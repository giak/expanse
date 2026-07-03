# 07 — Infrastructure

---

## 7.1 Docker Compose

| Service | Image | CPU | RAM | Rôle |
|---------|-------|-----|-----|------|
| `db` | ./db/Dockerfile (PG18+pgvector) | 1 | 2GB (+1GB shm) | PostgreSQL |
| `redis` | redis:7-alpine | — | 256MB | Cache L2 + task queue |
| `api` | api/Dockerfile | 2 | 24GB (16GB reserved) | FastAPI + MCP |
| `worker` | docker/Dockerfile.worker | — | — | Async task processor |
| `openobserve` | openobserve | — | — | Observability |

**Réseaux :** `frontend` (bridge), `backend` (bridge)  
**Volumes :** `postgres_data`, `redis_data`, `openobserve_data`

---

## 7.2 Configuration Docker

| Fichier | Contenu |
|---------|---------|
| `docker/Dockerfile.frontend` | Node 22 Alpine, Vite dev server |
| `docker/Dockerfile.worker` | Python 3.11-slim, conversation worker |
| `docker/redis/redis.conf` | RDB+AOF, noeviction, 256MB max |

---

## 7.3 Makefile (40+ targets)

### Dev
| Target | Description |
|--------|-------------|
| `up` | Start services |
| `down` | Stop services |
| `build` | Build avec BuildKit |
| `restart` | Restart all |
| `logs` | Follow logs |
| `ps` | List containers |
| `clean` | Remove containers + volumes |
| `prune` | Full Docker cleanup |

### Database
| Target | Description |
|--------|-------------|
| `db-up` | Start DB only |
| `db-shell` | psql shell |
| `db-backup` | pg_dump |
| `db-restore file=` | Restore from backup |
| `db-create-test` | Create test database |
| `db-fill-test` | Fill test DB with fixtures |
| `db-test-reset` | Create + fill test DB |

### API
| Target | Description |
|--------|-------------|
| `api-shell` | Container bash |
| `api-test` | Full test suite + coverage |
| `api-test-file file=` | Specific test file |
| `api-test-one test=` | Specific test |
| `api-coverage` | Coverage report |
| `api-debug file=` | PDB debug |
| `api-test-reset` | Full environment reset |

### Utilitaires
| Target | Description |
|--------|-------------|
| `health` | Check API + DB health |
| `benchmark` | Run benchmarks |
| `lint` | flake8 |
| `lint-fix` | black + autopep8 |

---

## 7.4 Scripts (`scripts/`)

| Catégorie | Scripts |
|-----------|---------|
| **MCP** | `mcp_server.sh`, `mcp_test.sh` |
| **Indexing** | `index_directory.py`, `batch_index_consumer.py`, `clean_and_reindex.py`, `rebuild_graph.py` |
| **Embeddings** | `backfill_memory_embeddings.py`, `reindex_memories_e5.py`, `test_e5_embedding.py` |
| **Migration** | `migrate_v2_to_v3.py`, `migrate_parsers.py`, `migrate-projects-conversations.py` |
| **Hooks** | `claude-with-hooks.sh`, `save-conversation-from-hook.sh`, `deploy-hooks-to-project.sh` |
| **Benchmarks** | `benchmarks/run_benchmark.py`, `benchmarks/cache_benchmark.py`, `benchmarks/create_hnsw_indexes.py` |
| **Testing** | `testing/test_application.sh`, `testing/generate_test_data.py`, `testing/fake_event_poster.py` |
| **Performance** | `performance/fix_embedding_performance.sh`, `performance/apply_optimizations.sh` |

---

## 7.5 CI/CD

**⚠️ Pas de CI/CD trouvé.** Pas de `.github/`, `.gitlab-ci.yml`, `Jenkinsfile`, ou équivalent. Le README fait référence à CI/CD mais la configuration n'existe pas dans le repo.

Locust load test présent (`api/locust_test.py` — 351 lignes) mais pas intégré dans un pipeline.

---

## 7.6 Frontend

**Stack :** Vue 3 + TypeScript + Vite + Tailwind CSS 4 + Pinia

**Dépendances clés :**
- `@antv/g6` — Visualisation graphe
- `pinia` — State management
- `vue-router` — Routing
- `v-network-graph` — Network graphs

**Structure :** composables, components, pages, utils, types, layouts, styles

---

## 7.7 Monitoring

| Composant | Technologie | Rôle |
|-----------|------------|------|
| OpenObserve | — | Logs + métriques centralisés |
| Prometheus metrics | `/metrics` endpoint | Export métriques |
| SSE stream | `/api/monitoring/advanced/logs/stream` | Logs temps réel |
| Alertes | `MonitoringAlertService` | Seuils configurables |
| Error tracking | `ErrorTrackingService` | Severity + categories |

**Seuils d'alerte :**
- Cache hit rate < 70%
- Memory > 80%
- Slow queries > 10
- Error rate > 5%
- CPU > 90%
- Disk > 90%
- Connections > 80%

---

*Suite : [08-issues-securite.md](./08-issues-securite.md)*
