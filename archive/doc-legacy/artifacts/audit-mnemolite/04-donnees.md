# 04 — Couche Données

---

## 4.1 Tables PostgreSQL

| Table | PK | Lignes Clés | Rôle |
|-------|-----|-------------|------|
| `events` | `id` UUID | content JSONB, metadata JSONB, embedding VECTOR(768), timestamp TIMESTAMPTZ | Événements/logs |
| `code_chunks` | `id` UUID | file_path, language, chunk_type, name, name_path, source_code, embedding_text VECTOR(768), embedding_code VECTOR(768), metadata JSONB | Chunks de code indexés |
| `nodes` | `node_id` UUID | node_type, label, properties JSONB, created_at | Nœuds du graphe |
| `edges` | `edge_id` UUID | source_node_id, target_node_id, relation_type, properties JSONB | Arêtes du graphe |
| `memories` | `id` UUID | title, content, memory_type, tags ARRAY, embedding VECTOR(768), deleted_at, project_id | Mémoires persistantes |
| `edge_weights` | `weight_id` UUID | edge_id FK, call_count, importance_score, is_critical_path, version | Poids des arêtes |
| `detailed_metadata` | `metadata_id` UUID | node_id, chunk_id, metadata JSONB, version | Métadonnées enrichies |
| `computed_metrics` | `metric_id` UUID | node_id, cyclomatic_complexity, afferent/efferent_coupling, pagerank_score | Métriques calculées |
| `error_logs` | `id` UUID | severity, category, service, error_type, message, stack_trace, context JSONB | Logs d'erreurs |
| `alerts` | — | Alert tracking | Alertes monitoring |

---

## 4.2 Index PostgreSQL

### Table `code_chunks` — Index les plus importants

| Index | Type | Colonne | Usage |
|-------|------|---------|-------|
| `idx_code_embedding_text` | HNSW (m=16, ef_construction=64, cosine) | `embedding_text` | Recherche sémantique TEXT |
| `idx_code_embedding_code` | HNSW (m=16, ef_construction=64, cosine) | `embedding_code` | Recherche sémantique CODE |
| `idx_code_metadata` | GIN (jsonb_path_ops) | `metadata` | Filtres JSONB |
| `idx_code_source_trgm` | GIN (gin_trgm_ops) | `source_code` | pg_trgm lexical |
| `idx_code_name_trgm` | GIN (gin_trgm_ops) | `name` | pg_trgm lexical |
| `idx_code_language` | B-tree | `language` | Filtre langage |
| `idx_code_type` | B-tree | `chunk_type` | Filtre type |
| `idx_code_file` | B-tree | `file_path` | Filtre fichier |
| `idx_code_indexed_at` | B-tree | `indexed_at` | Tri temporel |

### Table `memories`

| Index | Type | Colonne | Usage |
|-------|------|---------|-------|
| `unique_title_per_project` | Unique constraint | (title, project_id) | Unicité |
| HNSW | pgvector | `embedding` | Recherche sémantique mémoire |
| Trigram | pg_trgm | `title` | Recherche lexicale |

---

## 4.3 Repositories (10+ classes)

### Repository Pattern

```python
class Repository:
    def __init__(self, engine: AsyncEngine): ...
    async def _execute_query(self, query, params, is_mutation=False) -> Result: ...
```

Chaque repository a un `QueryBuilder` compagnon pour la construction SQL.

### EventRepository

| Méthode | Signature | SQL |
|---------|-----------|-----|
| `add` | `(event_data: EventCreate) -> EventModel` | INSERT INTO events ... RETURNING * |
| `get_by_id` | `(event_id: UUID) -> Optional[EventModel]` | SELECT ... WHERE id = :id |
| `update_metadata` | `(event_id, metadata_update) -> Optional[EventModel]` | UPDATE avec JSONB `\|\|` |
| `delete` | `(event_id: UUID) -> bool` | DELETE |
| `filter_by_metadata` | `(criteria, limit, offset) -> List[EventModel]` | WHERE metadata @> :criteria |
| `search_vector` | `(vector, metadata, ts_start, ts_end, limit, offset, threshold) -> Tuple[List, int]` | `<->` distance + auto-fallback |

### MemoryRepository

| Méthode | Signature | Description |
|---------|-----------|-------------|
| `create` | `(memory_create, embedding) -> Memory` | UUID auto, timestamps auto |
| `get_by_id` | `(memory_id) -> Optional[Memory]` | Exclut soft-deleted |
| `update` | `(id, update, regenerate_embedding, new_embedding) -> Optional[Memory]` | SET dynamique |
| `soft_delete` | `(memory_id) -> bool` | SET deleted_at |
| `delete_permanently` | `(memory_id) -> bool` | Hard DELETE |
| `list_memories` | `(filters, limit, offset) -> Tuple[List, int]` | Filtres + pagination |
| `search_by_vector` | `(vector, filters, limit, offset, threshold) -> Tuple[List, int]` | Cosine distance `<=>` |

### CodeChunkRepository

| Méthode | Signature | Description |
|---------|-----------|-------------|
| `add` | `(chunk_data, connection) -> CodeChunkModel` | Insert single |
| `add_batch` | `(chunks_data, connection) -> int` | **Bulk INSERT** (10-50x faster) |
| `get_by_id` | `(chunk_id) -> Optional[CodeChunkModel]` | Select par ID |
| `search_vector` | `(embedding, embedding_type, filters, limit) -> List` | HNSW cosine |
| `search_similarity` | `(query, language, chunk_type, threshold, limit) -> List` | pg_trgm similarity |
| `delete_by_repository` | `(repository, connection) -> int` | Bulk delete |

### NodeRepository / EdgeRepository

| Repository | Méthodes Clés |
|------------|---------------|
| NodeRepository | create, create_code_node, get_by_id, get_by_chunk_id, search_by_label, delete_by_repository |
| EdgeRepository | create, create_dependency_edge, get_outbound_edges, get_inbound_edges, delete_by_source_node |

### Repositories Additionnels

| Repository | Rôle |
|------------|------|
| EdgeWeightsRepository | UPSERT sur (edge_id, version) |
| DetailedMetadataRepository | JSONB payload versionné |
| ComputedMetricsRepository | Coupling, PageRank, complexity |
| ErrorRepository | Logging erreurs, summary, critical |

---

## 4.4 Pattern Transactionnel (EPIC-12)

Tous les repositories graph supportent un paramètre `connection` optionnel :
- **Fourni :** utilise la connexion externe (caller gère la transaction)
- **Absent :** crée sa propre connexion avec auto-commit/rollback

Cela permet des opérations **atomiques multi-étapes** comme la suppression de repository.

---

## 4.5 pgvector Patterns

```python
# Format insertion
embedding = '[0.1,0.2,...]'::vector(768)

# Distance cosinus (range 0.0-2.0, lower = more similar)
ORDER BY embedding <=> :query_vector

# Similarité cosinus
similarity = 1 - (embedding <=> :query_vector)

# Index HNSW
CREATE INDEX ON code_chunks USING hnsw (embedding_code vector_cosine_ops)
    WITH (m = 16, ef_construction = 64)

# Requête avec ef_search tuning
SET LOCAL hnsw.ef_search = 100
```

**Dual embeddings :**
- `embedding_text` — pour docstrings/comments (TEXT domain)
- `embedding_code` — pour source code semantics (CODE domain)

---

## 4.6 pg_trgm Patterns

```sql
-- Opérateur trigram
WHERE source_code % :query  -- threshold par défaut 0.1

-- Fonction similarity
similarity(name, :query) AS score

-- Index GIN
CREATE INDEX ON code_chunks USING gin (source_code gin_trgm_ops)
```

---

## 4.7 Migrations Alembic

| Migration | Revision | Description |
|-----------|----------|-------------|
| Baseline | `9dde1f9db172` | NO-OP baseline pour table `events` existante |
| Code Chunks | `40a6de7d379` | Crée table `code_chunks` avec dual embeddings |

**Note :** Les tables `events`, `nodes`, `edges`, `memories`, `edge_weights`, `detailed_metadata`, `computed_metrics`, `error_logs`, `alerts` sont créées via des scripts SQL init (`db/init/`) et **n'ont pas de migrations Alembic**.

---

## 4.8 Connexions DB

### MCP Server
```python
asyncpg.create_pool(min_size=2, max_size=10, command_timeout=60)
SQLAlchemy create_async_engine(pool_size=10, max_overflow=20)
```

### API REST (main.py)
```python
create_async_engine(
    pool_size=20,
    max_overflow=10,
    pool_recycle=3600,
    connect_args={"server_settings": {"jit": "off"}, "command_timeout": 60}
)
```

---

*Suite : [05-api-rest.md](./05-api-rest.md)*
