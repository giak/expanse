# 08 — Issues & Sécurité

---

## 8.1 Bugs Critiques

### BUG-01 : `self.services` vs `self._services` — CRITIQUE

**Fichier :** `resources/indexing_resources.py:48`  
**Impact :** `AttributeError` à l'exécution quand on accède à `index://status/{repository}`  
**Cause :** Utilise `self.services` au lieu de `self._services` (le nom correct de l'attribut dans `BaseMCPComponent`)  
**Fix :** Remplacer `self.services` par `self._services`

### BUG-02 : Filtre Tags Non Garanti (search_memory fallback) — ÉLEVÉ

**Fichier :** `memory_tools.py:712-724`  
**Impact :** Les boot queries Expanse avec `tags=["sys:core","sys:anchor"]` pourraient ne pas filtrer correctement en mode fallback vector-only  
**Cause :** `memory_repository.search_by_vector()` peut ne pas implémenter le filtrage par tags  
**Fix :** Vérifier et implémenter le filtrage par tags dans `search_by_vector()`

### BUG-03 : `cache_hit` Hardcodé à `False` — MINEUR

**Fichier :** `search_tool.py:243`  
**Impact :** Observabilité réduite — impossible de mesurer le taux de hit cache côté client  
**Fix :** Utiliser une variable `was_cached = False` et la mettre à `True` dans le chemin cache

---

## 8.2 TODOs Non Résolus

| # | Fichier | Ligne | TODO | Impact |
|---|---------|-------|------|--------|
| 1 | `server.py` | 1552 | HTTP transport (Story 23.8) | MCP limité à stdio |
| 2 | `server.py` | 697 | Cursor-based pagination | Scalabilité |
| 3 | `graph_resources.py` | 126 | `EdgeRepository.get_edges_for_node()` | Edges toujours vides |
| 4 | `graph_resources.py` | 331, 518 | Cache hit tracking | Observabilité |
| 5 | `code_chunking_service.py` | 586 | Optimiser chunk node finding | Performance |
| 6 | `code_chunking_service.py` | 716 | Merge small chunks | Qualité chunks |
| 7 | `typescript_extractor.py` | — | Multiple Story 26.2 (call extraction) | Complétude TS |
| 8 | `batch_indexing_consumer.py` | 41 | Hardcoded `CONSUMER_NAME = "worker-1"` | Multi-worker |
| 9 | `indexing_tools.py` | 104 | Elicitation >100 files désactivée | UX |

---

## 8.3 Problèmes de Sécurité

### SEC-01 : Pas d'Authentification — CRITIQUE

L'API REST n'a **aucune authentification**. Tous les endpoints sont ouverts. Le `config.py` a des champs `auth_mode`, `api_keys`, `oauth_secret_key` mais **aucun middleware d'auth** n'est implémenté.

**Risque :** N'importe qui avec accès réseau peut lire, créer, supprimer des mémoires et des chunks de code.

### SEC-02 : Secrets Hardcodés — ÉLEVÉ

**Fichier :** `config.py:44-48`

```python
api_keys: dict[str, str] = {
    "dev-key-12345": "developer",
    "admin-key-67890": "admin"
}
oauth_secret_key: str = "change-me-in-production"
```

Ces valeurs par défaut sont dans le code source. Si le `.env` ne les surcharge pas, elles sont actives.

### SEC-03 : Pas de Rate Limiting — MOYEN

Aucun rate limiting sur les endpoints. Un client peut :
- Saturer le service d'embedding avec des requêtes massives
- Remplir la base de données avec des mémoires spam
- Surcharger Redis avec des recherches

### SEC-04 : CORS Large — FAIBLE

`cors_origins` inclut `http://localhost:3000` et d'autres origins de dev. En production sans surcharge, ces origins sont autorisées.

### SEC-05 : SQL Injection — PROTÉGÉ ✅

SQLAlchemy ORM + parametrized queries. Pas de SQL injection possible.

### SEC-06 : Input Validation — PROTÉGÉ ✅

UUID validation, length limits, enum parsing sur tous les outils MCP.

### SEC-07 : Hard Delete Protégé — PROTÉGÉ ✅

Elicitation confirmation requise pour `permanent=True`.

---

## 8.4 Dette Technique

### Code Dupliqué

| Fichier | Duplication |
|---------|-------------|
| `graph_resources.py` | `_convert_to_mcp_node()` × 3 |
| `shared_models.py` vs `memory_models.py` | `Memory` model conflictuel (name vs title) |
| `server.py` | Registration pattern répété 8 fois |

### Incohérences

| Incohérence | Détail |
|-------------|--------|
| Elicitation | `clear_cache` utilise `ctx.elicit()` direct, les autres utilisent `request_confirmation()` |
| HybridCodeSearchService | Nouvelle instance par appel (`search_tool.py:198`) au lieu de singleton |
| Property accessors | Retournent `None` silencieusement au lieu de lever des erreurs |
| Interface enforcement | Pas de `@abstractmethod` sur `execute()` — convention non enforced |
| Cache TTL | Config définie mais jamais utilisée — outils hardcodent leurs TTLs |

### Modèles Conflictuels

```python
# shared_models.py
class Memory(BaseModel):
    name: str                    # ← "name"
    memory_type: Literal["semantic", "episodic", "procedural"]  # ← 3 valeurs
    ...

# memory_models.py
class Memory(BaseModel):
    title: str                   # ← "title"
    memory_type: MemoryType      # ← 6 valeurs (note, decision, task, reference, conversation, investigation)
    ...
```

Deux modèles `Memory` différents coexistent. `shared_models.py` semble être un vestige d'une version antérieure.

---

## 8.5 Performance — Points d'Attention

| Aspect | État | Impact |
|--------|------|--------|
| Boot Expanse (4 queries) | Séquentiel ~260ms | Optimisable à ~65ms avec `asyncio.gather()` |
| Hybrid code search | ~30s pour gros index | Normal (embeddings generation) |
| search_memory (pre-fix) | ~4000ms | Corrigé → ~65ms |
| HybridCodeSearchService | Nouvelle instance/call | Pas un bug (stateless) mais pattern inconsistent |
| L1 cache | 100MB LRU | Taille suffisante pour usage typique |
| RAM embedding | ~660-700 MB | Considérable mais bien monitoré |

---

*Suite : [09-recommandations.md](./09-recommandations.md)*
