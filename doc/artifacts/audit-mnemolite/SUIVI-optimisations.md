# Suivi Optimisations & Robustesse Mnemolite

> **Dernière mise à jour :** 2026-03-27 09:30  
> **Référence :** [10-optimisations-brainstorm.md](./10-optimisations-brainstorm.md) · [EMBEDDINGS-ANALYSIS.md](./EMBEDDINGS-ANALYSIS.md) · [ROBUSTESSE-AUDIT.md](./ROBUSTESSE-AUDIT.md)

---

## Synthèse Générale

| Catégorie | Total | Fait | Reste | Status |
|-----------|-------|------|-------|--------|
| **Optimisations** | 22 | 12 | 10 | 55% |
| **Robustesse** | 23 | 2 | 21 | 9% |
| **TOTAL** | **45** | **14** | **31** | **31%** |

### Validation Live ✅
```
hybrid search: vector=True, vec=100 candidates, lex=5 candidates
vector_time: 100ms, lexical_time: 422ms, fusion: 0.2ms
Similarité cosinus: 0.52-0.55 (réelles)
57 TDD tests passed, 5 skipped, 0 failed
```

---

## Backlog Unifié

### 🔴 CRITIQUE — Sécurité (2 jours)

| # | Issue | Source | Effort | Status |
|---|-------|--------|--------|--------|
| SEC-01 | Pas d'authentification API | robustesse + audit | 1-2j | ⬜ |
| SEC-02 | Credentials hardcodés | robustesse + audit | 0.5j | ⬜ |
| SEC-03 | SQL injection via f-string | robustesse #2 | 0.5j | ⬜ |
| SEC-04 | Subprocess sans sanitisation | robustesse #4 | 0.5j | ⬜ |

### 🟠 HIGH — Fiabilité (2 jours)

| # | Issue | Source | Effort | Status |
|---|-------|--------|--------|--------|
| REL-01 | Pas de rate limiting | robustesse #5 | 0.5j | ⬜ |
| REL-02 | CORS ouvert (`"*"`) | robustesse #6 | 0.5j | ⬜ |
| REL-03 | Pas de timeout MCP | robustesse #7 | 1j | ⬜ |
| REL-04 | Circuit breaker partagé (TEXT+CODE) | robustesse #8 | 0.5j | ⬜ |
| REL-05 | Dependencies manquantes | robustesse #9 | 0.5j | ⬜ |
| REL-06 | Cache non invalidé sur writes | robustesse #10 | 1j | ⬜ |
| REL-07 | pool_pre_ping=False | robustesse #11 | 5min | ⬜ |
| BUG-03 | `cache_hit` hardcodé | audit | 30min | ⬜ |

### 🟡 MEDIUM — Qualité (3 jours)

| # | Issue | Source | Effort | Status |
|---|-------|--------|--------|--------|
| QUA-01 | Config validation au démarrage | robustesse #12 | 1j | ⬜ |
| QUA-02 | Error details exposés au client | robustesse #13 | 0.5j | ⬜ |
| QUA-03 | Tests manquants (5 services >100 lignes) | robustesse #14 | 3j | ⬜ |
| QUA-04 | Health check incomplet | robustesse #15 | 0.5j | ⬜ |
| QUA-05 | Logging conflict (basicConfig vs structlog) | robustesse #16 | 0.5j | ⬜ |

### 🟢 Optimisations Restantes

| # | Action | Source | Effort | Status |
|---|--------|--------|--------|--------|
| OPT-11 | Memory graph (relations) | brainstorm | 3j | ⬜ |
| OPT-12 | Tasks primitive MCP | brainstorm | 3j | ⬜ |
| OPT-13 | RAG-Fusion multi-query | brainstorm | 2j | ⬜ |
| OPT-14 | PCA dimensionality reduction | brainstorm | 1sem | ⬜ |
| OPT-15 | Filesystem watcher | brainstorm | 2j | ⬜ |
| OPT-17 | Git-aware indexing | brainstorm | 1sem | ⬜ |

---

## Optimisations Faites ✅

### Quick Wins (3/3)
| # | Action | Commit | Date |
|---|--------|--------|------|
| 1 | Iterative scan pgvector 0.8 | `1c97600` | 2026-03-26 |
| 2 | HNSW tuning (ef_search=100) | `1c97600` | 2026-03-26 |
| 3 | halfvec quantification (-50% stockage) | `b18ddae` | 2026-03-26 |

### Court Terme (3/3)
| # | Action | Commit | Date |
|---|--------|--------|------|
| 4 | Activer reranking par défaut (+20-30%) | `4bf546e` | 2026-03-26 |
| 5 | Adaptive RRF k (20/60/80) | `9cc222e` | 2026-03-26 |
| 6 | Streamable HTTP transport | `9b904e9` | 2026-03-26 |

### Moyen Terme (4/5)
| # | Action | Commit | Date |
|---|--------|--------|------|
| 7 | Embedding upgrade (jina-v5 support) | `175e263` | 2026-03-27 |
| 8 | Incremental indexing (99% perf gain) | `7594d96` | 2026-03-27 |
| 9 | Memory consolidation API | `95de1a9` | 2026-03-26 |
| 10 | Memory decay scoring | `dd2bb1a` | 2026-03-26 |

### Fixes
| # | Action | Commit | Date |
|---|--------|--------|------|
| BUG-01 | `self.services` → `self._services` | `98724a1` | 2026-03-26 |
| BUG-02 | Filtre tags search_by_vector | `0baa353` | 2026-03-27 |
| — | asyncpg multi-SET fix | `f779f17` | 2026-03-27 |
| — | iterative_scan value fix | `bf4d9d4` | 2026-03-27 |
| — | Auto-embedding in hybrid search | `bf4d9d4` | 2026-03-27 |

---

## Tests

| Fichier | Tests | Couvre | Date |
|---------|-------|--------|------|
| `test_pgvector_optimizations.py` | 57 | halfvec, ef_search, iterative_scan, reranking, adaptive RRF k, HTTP transport, memory decay, consolidation, incremental indexing, BUG-02, embedding models, regression | 2026-03-27 |

**Validation Docker :** 57 passed / 5 skipped / 0 failed  
**Suite complète :** 1168 passed / 106 failed (pre-existing)

---

## Progression Globale

```
Optimisations : ██████░░░░ 12/22 (55%)
Robustesse    : █░░░░░░░░░  2/23 ( 9%)
──────────────────────────────────────
TOTAL         : ███░░░░░░░ 14/45 (31%)
```

**Prochaine priorité :** 🔴 Sécurité (SEC-01 → SEC-04) avant les optimisations restantes.
