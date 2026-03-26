# 02 — Architecture MCP

---

## 2.1 Serveur MCP (`server.py` — 1570 lignes)

### Spécification
- **MCP Spec :** 2025-06-18
- **SDK :** FastMCP (`mcp==1.12.3`)
- **Transport :** stdio uniquement (HTTP TODO Story 23.8)

### Séquence de Démarrage (Lifespan)

```
server_lifespan(mcp)
  ├── 1. asyncpg pool (min=2, max=10, timeout=60s)
  │     └── Test: SELECT version()
  ├── 2. Redis (5s connect timeout)
  │     └── Graceful: services["redis"] = None si échec
  ├── 3. DualEmbeddingService
  │     └── preload_models() — ~660-700 MB RAM
  │     └── Graceful: services["embedding_service"] = None si échec
  ├── 4. SQLAlchemy engine (pool_size=10, max_overflow=20)
  ├── 5. CodeIndexingService
  │     ├── CodeChunkingService (max_workers=4)
  │     ├── MetadataExtractorService
  │     ├── GraphConstructionService
  │     ├── CodeChunkRepository
  │     └── CascadeCache (L1: 100MB + L2: Redis)
  ├── 6. MemoryRepository
  ├── 7. MetricsCollector
  ├── 8. HybridMemorySearchService (RRF k=60, weights 50/50)
  ├── 9. Graph services (NodeRepository + GraphTraversalService)
  ├── 10. Injection services → 23 composants singletons
  └── Shutdown: Redis close + asyncpg pool close
```

### Pattern d'Injection de Dépendances

```
mcp._services = { "db": pool, "redis": client, "embedding_service": svc, ... }
       ↓
chaque BaseMCPComponent.inject_services(mcp._services)
       ↓
self._services["embedding_service"]  (accès par clé)
self.embedding_service               (property getter)
```

**Critique :** Le DI est fait via un dict de services partagé. Pas de vérification de type à l'injection. Les properties de `BaseMCPComponent` retournent `None` silencieusement si le service n'est pas injecté — peut masquer des bugs d'initialisation.

---

## 2.2 BaseMCPComponent (`base.py` — 186 lignes)

### Classe Abstraite

```python
class BaseMCPComponent(ABC):
    _services: dict = None
    
    def inject_services(self, services: dict): ...
    def get_name(self) -> str: ...           # abstract
    def _get_service(self, name) -> Any: ... # avec RuntimeError
    
    # Properties (retournent None silencieusement)
    @property
    def memory_repository(self) -> MemoryRepository: ...
    @property
    def embedding_service(self) -> EmbeddingServiceProtocol: ...
    @property
    def redis_client(self): ...
    @property
    def engine(self): ...
    @property
    def db(self): ...
    @property
    def hybrid_memory_search_service(self): ...
```

**Incohérence :** `_get_service()` lève des erreurs explicites, mais les properties ne l'utilisent pas — elles retournent `None` silencieusement. L'interface n'est pas enforced (pas de `@abstractmethod` sur `execute()`).

---

## 2.3 Outils MCP (11 outils)

### Inventaire Complet

| # | Outil | Fichier | Lignes | Catégorie | Params Clés |
|---|-------|---------|--------|-----------|-------------|
| 1 | `ping` | `test_tool.py` | 79 | Test | (aucun) |
| 2 | `search_code` | `search_tool.py` | 391 | Search | query, filters, limit, offset, enable_lexical/vector, weights |
| 3 | `write_memory` | `memory_tools.py` | 857 | Memory | title, content, memory_type, tags, embedding_source |
| 4 | `update_memory` | ↕ | — | Memory | id, champs optionnels, embedding_source |
| 5 | `delete_memory` | ↕ | — | Memory | id, permanent (elicitation) |
| 6 | `search_memory` | ↕ | — | Memory | query, memory_type, tags, limit, offset |
| 7 | `read_memory` | ↕ | — | Memory | id |
| 8 | `index_project` | `indexing_tools.py` | 415 | Indexing | project_path, repository, include_gitignored |
| 9 | `reindex_file` | ↕ | — | Indexing | file_path, repository |
| 10 | `clear_cache` | `analytics_tools.py` | 166 | Analytics | layer (L1/L2/all, elicitation) |
| 11 | `switch_project` | `config_tools.py` | 154 | Config | repository, confirm (elicitation) |

### Détail des Outils Critiques

#### `search_code` — Pipeline Hybride

```
Query → [Redis Cache SHA256] → Cache hit? → Return
                                      ↓ miss
                              [embed_query ou generate_embedding]
                                      ↓
                              HybridCodeSearchService.search()
                                ├── LexicalSearchService (pg_trgm)
                                ├── VectorSearchService (HNSW)
                                ├── RRFFusionService (k=60)
                                └── [CrossEncoderRerankService] optionnel
                                      ↓
                              Cache populate (TTL 300s)
                                      ↓
                              Return CodeSearchResponse
```

**Bug mineur :** `HybridCodeSearchService` instancié à chaque appel (ligne 198) au lieu de réutiliser depuis les services. Pas un problème de perf (service stateless), mais pattern inconsistent.

#### `write_memory` — Flux de Création

```
Validate (title 1-200, content non-empty, memory_type enum)
  → Parse project_id (UUID ou name avec auto-create)
  → Generate embedding (embedding_source ou title+content)
  → Graceful: log warning si embedding fail, continue sans
  → memory_repository.create(memory_create, embedding)
  → Return MemoryResponse (id, title, type, timestamps, tags)
```

#### `search_memory` — Flux de Recherche

```
Validate query + params
  → Generate query embedding (obligatoire — RuntimeError si pas de service)
  → HybridMemorySearchService.search() si disponible
    ├── Lexical: ILIKE + trigram similarity (title + embedding_source)
    ├── Vector: pgvector HNSW cosine distance
    └── RRF fusion (k=60, weights 50/50)
  → Fallback: memory_repository.search_by_vector() (vector-only)
  → Return { memories, pagination, metadata }
```

**Point d'attention :** Le filtrage par `tags` en mode fallback vector-only n'est pas garanti — dépend de l'implémentation de `search_by_vector()`.

#### `delete_memory` — Double Mode

- **Soft delete (défaut) :** `memory_repository.soft_delete(id)` → sets `deleted_at`
- **Hard delete :** Requiert `permanent=True` → elicitation confirmation → vérifie soft delete d'abord → `delete_permanently(id)`

#### `index_project` — Pipeline 9 Étapes

```
1. ProjectScanner.scan() → List[FileInput]
2. Elicitation >100 files (SKIPPÉ — FastMCP API changed)
3. Redis distributed lock (NX, 10min TTL)
4. Redis status tracking
5. Progress callback (throttled 1/sec)
6. CodeIndexingService.index_repository()
7. Final status update
8. Return IndexResult
9. Lock release (finally)
```

---

## 2.4 Ressources MCP (12 ressources)

| URI | Classe | Méthode | Description |
|-----|--------|---------|-------------|
| `health://status` | HealthStatusResource | GET | Health DB + Redis + uptime |
| `memories://get/{id}` | GetMemoryResource | GET | Memory par UUID |
| `memories://list` | ListMemoriesResource | GET | Liste filtrée + pagination |
| `memories://search/{query}` | SearchMemoriesResource | GET | Recherche hybride |
| `graph://nodes/{chunk_id}` | GraphNodeDetailsResource | GET | Détail nœud + voisins |
| `graph://callers/{name}` | FindCallersResource | GET | Appelants entrants |
| `graph://callees/{name}` | FindCalleesResource | GET | Appelés sortants |
| `index://status/{repo}` | IndexStatusResource | GET | Statut indexation |
| `cache://stats` | CacheStatsResource | GET | Stats L1/L2/cascade |
| `analytics://search` | SearchAnalyticsResource | GET | Métriques recherche |
| `projects://list` | ListProjectsResource | GET | Liste projets indexés |
| `config://languages` | SupportedLanguagesResource | GET | 15 langages supportés |

**Bug critique :** `IndexingResources` utilise `self.services` (ligne 48) au lieu de `self._services` → `AttributeError` à l'exécution.

**Code dupliqué :** `_convert_to_mcp_node()` est dupliqué 3 fois dans `graph_resources.py`.

---

## 2.5 Prompts MCP (6 prompts)

| Prompt | Params | Usage |
|--------|--------|-------|
| `analyze_codebase` | language, focus | Analyse architecture en 6 sections |
| `refactor_suggestions` | focus, severity | Opportunités de refactoring |
| `find_bugs` | severity, category | Détection bugs/vulnérabilités |
| `generate_tests` | chunk_id, test_type, coverage_target | Génération de tests |
| `explain_code` | chunk_id, level, audience | Explication de code |
| `security_audit` | scope, compliance | Audit OWASP/CWE/PCI-DSS/HIPAA |

Chaque prompt retourne un texte multi-paragraphe guidant l'LLM vers des outils MCP spécifiques. Pas de validation des params enum-like.

---

## 2.6 Transport

| Transport | Status | Notes |
|-----------|--------|-------|
| **stdio** | ✅ Implémenté | JSON-RPC sur stdin/stdout, défaut Claude Desktop |
| **HTTP/SSE** | ❌ TODO | Story 23.8, `server.py:1552` |
| **Auth (API Key)** | ⚠️ Configuré mais non implémenté | `config.py` a les clés mais pas de middleware |
| **Auth (OAuth)** | ⚠️ Configuré mais non implémenté | `config.py` a le secret mais pas de flow |

Le dossier `transport/` contient uniquement `__init__.py` — aucun transport implémenté.

---

## 2.7 Modèles Pydantic MCP (8 fichiers)

| Fichier | Lignes | Modèles Principaux |
|---------|--------|-------------------|
| `search_models.py` | 372 | CodeSearchQuery, CodeSearchFilters, CodeSearchResult, CodeSearchMetadata, CodeSearchResponse |
| `memory_models.py` | 366 | MemoryType(6 vals), MemoryCreate, MemoryUpdate, Memory, MemoryResponse, MemoryFilters |
| `graph_models.py` | 368 | MCPNode, MCPEdge, GraphTraversalResponse, CallerCalleeResponse |
| `indexing_models.py` | 191 | IndexResult, FileIndexResult, IndexStatus, ProgressUpdate |
| `analytics_models.py` | 58 | SearchAnalyticsResponse |
| `cache_models.py` | 110 | ClearCacheRequest/Response, CacheLayerStats, CacheStatsResponse |
| `config_models.py` | 112 | SwitchProjectRequest/Response, ProjectsListResponse |
| `__init__.py` | 79 | Re-exports |

**Conflit de modèles :** `shared_models.Memory` (avec `name`) et `memory_models.Memory` (avec `title`) représentent le même concept avec des schémas différents.

---

## 2.8 Élicitation (Human-in-the-Loop)

```python
# elicitation.py — 208 lignes
request_confirmation(ctx, action, details, dangerous=False) -> ElicitationResult
request_choice(ctx, question, choices, default=None) -> str
```

**Usage :**
- `delete_memory(permanent=True)` → `request_confirmation()`
- `switch_project` → `request_confirmation()`
- `clear_cache` → `ctx.elicit()` direct (incohérent — n'utilise pas le helper)

---

*Suite : [03-services.md](./03-services.md)*
