# Suivi Optimisations Mnemolite

> **Dernière mise à jour :** 2026-03-26 22:43  
> **Référence :** [10-optimisations-brainstorm.md](./10-optimisations-brainstorm.md) · [EMBEDDINGS-ANALYSIS.md](./EMBEDDINGS-ANALYSIS.md)

---

## Quick Wins (< 1h)

| # | Action | Status | Commit | Date |
|---|--------|--------|--------|------|
| 1 | Iterative scan pgvector 0.8 | ✅ Fait | `1c97600` | 2026-03-26 |
| 2 | HNSW tuning (ef_search=100) | ✅ Fait | `1c97600` | 2026-03-26 |
| 3 | halfvec quantification | ✅ Fait | `b18ddae` | 2026-03-26 |

**Détail commit `1c97600` :**
- `vector_search_service.py` — ef_search + iterative_scan dans SET
- `memory_repository.py` — ajout SET LOCAL hnsw.ef_search=100 + iterative_scan
- `code_chunk_repository.py` — refactorisé pour conn directe avec tuning

**Détail commit `b18ddae` :**
- Migration Alembic : colonnes halfvec code_chunks + memories, indexes HNSW, triggers auto-sync
- `vector_search_service.py` — `::halfvec` + colonnes halfvec
- `code_chunk_repository.py` — `::halfvec` + colonnes halfvec
- `memory_repository.py` — `embedding_half` + `::halfvec`
- `hybrid_memory_search_service.py` — `embedding_half` + `::halfvec` + pgvector tuning
- Writes restent en `::vector` — triggers convertissent automatiquement

**Détail commit `4bf546e` :**
- `hybrid_code_search_service.py` — `default_enable_reranking=True`
- `hybrid_memory_search_service.py` — `default_enable_reranking=True`
- Reranker lazy-loaded au 1er search (pas de RAM avant)

**Détail commit `9cc222e` :**
- `rrf_fusion_service.py` — `get_optimal_k(query)` heuristique statique
- `hybrid_code_search_service.py` — param `rrf_k` sur `search()` et `_fuse_results()`
- `search_with_auto_weights()` appelle `get_optimal_k` automatiquement
- 9 tests TDD : code-heavy→k20, NL→k80, balanced→k60, empty→k60, scoring impact

**Détail commit `9b904e9` :**

**Détail commit `0baa353` (BUG-02) :**
- `memory_tools.py` — fallback vector-only utilise `MemoryFilters` au lieu de `dict`
- Tags, memory_type, project_id correctement transmis au `search_by_vector()`
- 3 tests TDD : MemoryFilters usage, no dict pattern, tags included

**Détail commit `9b904e9` :**
- `server.py` — `mcp.run(transport='streamable-http')` remplace le TODO+exit
- `transport/__init__.py` — documentation complète des 2 transports
- 4 tests TDD : config transport, appel mcp.run, pas d'erreur exit, config host/port

---

## Court Terme (1-2 jours)

| # | Action | Status | Commit | Date |
|---|--------|--------|--------|------|
| 4 | Activer reranking par défaut | ✅ Fait | `4bf546e` | 2026-03-26 |
| 5 | Adaptive RRF k (20/60/80) | ✅ Fait | `9cc222e` | 2026-03-26 |
| 6 | Streamable HTTP transport | ✅ Fait | `9b904e9` | 2026-03-26 |

---

## Moyen Terme (1-2 semaines)

| # | Action | Status | Commit | Date |
|---|--------|--------|--------|------|
| 7 | Embedding upgrade (jina-v5 support) | ✅ Fait | `175e263` | 2026-03-27 |
| 8 | Incremental indexing (watch mode) | ✅ Fait | `7594d96` | 2026-03-27 |
| 9 | Memory consolidation API | ✅ Fait | `95de1a9` | 2026-03-26 |
| 10 | Memory decay scoring | ✅ Fait | `dd2bb1a` | 2026-03-26 |
| 11 | Memory graph (relations) | ⬜ À faire | — | — |

---

## Long Terme (> 2 semaines)

| # | Action | Status | Commit | Date |
|---|--------|--------|--------|------|
| 12 | Tasks primitive MCP | ⬜ À faire | — | — |
| 13 | RAG-Fusion multi-query | ⬜ À faire | — | — |
| 14 | PCA dimensionality reduction | ⬜ À faire | — | — |
| 15 | Filesystem watcher | ⬜ À faire | — | — |
| 16 | Upgrade TEXT embedding (BGE-M3 / jina-v5-nano / e5-large) | ⬜ À faire | — | — |
| 17 | Git-aware indexing | ⬜ À faire | — | — |

---

## Fixs & Dette Technique

| # | Action | Status | Commit | Date |
|---|--------|--------|--------|------|
| BUG-01 | `self.services` → `self._services` | ✅ Fait | `98724a1` | 2026-03-26 |
| BUG-02 | Filtre tags search_by_vector | ✅ Fait | `0baa353` | 2026-03-27 |
| BUG-03 | `cache_hit` hardcodé | ⬜ À faire | — | — |
| SEC-01 | Authentification API | ⬜ À faire | — | — |
| SEC-02 | Secrets hardcodés | ⬜ À faire | — | — |

---

## Résultats Tests (2026-03-27 07:00)

**Environnement :** Docker (mnemo-api, mnemo-postgres, mnemo-redis)

| Test | Résultat |
|------|----------|
| Migration halfvec | ✅ Colonnes, indexes, triggers créés |
| Peuplement halfvec | ✅ 106 text + 19,289 code + 34,530 memories |
| Optimizations TDD | ✅ **57 passed**, 5 skipped, 0 failed |
| Embedding service | ✅ 13/13 passed |
| RRF fusion | ✅ 20/20 passed |
| Code chunking | ✅ 25/25 passed |
| Suite complète | ⚠️ 1168 passed, 106 failed (pre-existing DB config issues) |

**Bug trouvé et fixé pendant les tests :**
- `asyncpg` ne supporte pas `SET LOCAL a = 1; SET LOCAL b = 2` dans un prepared statement
- Fix : séparer les commandes SET en appels individuels

---

## Tests TDD

| Fichier | Tests | Couvre | Commit | Date |
|---------|-------|--------|--------|------|
| `test_pgvector_optimizations.py` | 57 | halfvec, ef_search, iterative_scan, reranking, adaptive RRF k, HTTP transport, memory decay, consolidation, incremental indexing, BUG-02 filters, embedding models, migration, regression | `f779f17` | 2026-03-27 |

---

## Progression Globale

```
Quick Wins    : ███ 3/3   (100%)
Court Terme   : ███ 3/3   (100%)  ✅
Moyen Terme   : ████ 4/5   (80%)
Long Terme    : ░░░ 0/6   (0%)
Fixs/Dette    : ██░ 2/5   (40%)
─────────────────────────────
TOTAL         : ███ 12/22 (55%)
```
