# 05 — API REST

---

## 5.1 Vue d'Ensemble

**22 fichiers de routes, 50+ endpoints**

| Préfixe | Routes | Méthodes |
|---------|--------|----------|
| `/api/v1/memories` | 7 | GET, POST, PUT, DELETE |
| `/api/v1/search` | 4 | GET, POST |
| `/api/v1/events` | 7 | GET, POST, PATCH, DELETE |
| `/v1/code/search` | 4 | POST |
| `/v1/code/index` | 4 | GET, POST, DELETE |
| `/code/graph` | 8 | GET, POST |
| `/api/graph` | 2 | GET |
| `/api/monitoring` | 5 | GET |
| `/api/monitoring/advanced` | 7 | GET, POST |
| `/api/v1/dashboard` | 3 | GET |
| `/api/v1/projects` | 5 | GET, POST, DELETE |
| `/api/v1/indexing/batch` | 2 | POST, GET |
| `/v1/conversations` | 4 | POST, GET |
| `/performance` | 8 | GET, POST |
| `/` | 2 | GET (health, readiness) |
| Autres | ~10 | Divers |

---

## 5.2 Endpoints Mémoires (`/api/v1/memories`)

| Endpoint | Méthode | Description | Request/Response |
|----------|---------|-------------|------------------|
| `/stats` | GET | Dashboard stats | → total, today, embedding_rate |
| `/recent` | GET | Mémoires récentes | ?limit=N&offset=N |
| `/code-chunks/recent` | GET | Chunks récents | → chunks + stats |
| `/` | POST | Créer mémoire | MemoryCreateRequest → MemoryCreateResponse |
| `/{id}` | PUT | Update mémoire | Partial update, ré-embed si content change |
| `/{id}` | DELETE | Supprimer | ?permanent=true pour hard delete |
| `/{id}` | GET | Lire mémoire | → Memory complète |
| `/embeddings/health` | GET | Health embedding | → text+code success rates |
| `/search` | POST | **Recherche hybride** | MemorySearchRequest → MemorySearchResponse |

---

## 5.3 Endpoints Recherche Code (`/v1/code/search`)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/hybrid` | POST | **Recherche hybride** (pg_trgm + HNSW + RRF) |
| `/lexical` | POST | Lexical-only (pg_trgm) |
| `/vector` | POST | Vector-only (HNSW) |
| `/health` | GET | Health search service |

**Hybrid search features :**
- Auto weight adjustment (query analysis)
- Qualified name detection (`models.User` → name_path search)
- Configurable candidate pool (10-1000)
- Configurable weights (0.0-1.0)
- Execution timing breakdown

---

## 5.4 Endpoints Indexation (`/v1/code/index`)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/` | POST | Indexer fichiers (pipeline 7 étapes) |
| `/repositories` | GET | Lister repositories indexés |
| `/{repository}` | DELETE | **Atomique** delete (chunks + nodes + edges) |
| `/health` | GET | Health indexing |
| `/cache/stats` | GET | Stats cache L1 |

---

## 5.5 Endpoints Graphe (`/code/graph`)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/build` | POST | Construire graphe pour repository |
| `/traverse` | POST | Traverser (outbound/inbound, recursive CTE) |
| `/path` | POST | Plus court chemin entre 2 nœuds |
| `/repositories` | GET | Repositories avec nœuds |
| `/stats/{repo}` | GET | Stats graphe par repository |
| `/data/{repo}` | GET | Nœuds+edges pour visualisation |
| `/metrics/{repo}` | GET | Métriques (complexity, coupling, PageRank) |
| `/module/{repo}` | GET | Graphe MODULE-level (orgchart) |

---

## 5.6 Endpoints Monitoring

### Standard (`/api/monitoring`)
| Endpoint | Description |
|----------|-------------|
| `/status` | Status système (operational/degraded/critical) |
| `/events/critical` | Événements critiques (24h) |
| `/events/timeline` | Counts par période |
| `/events/distribution` | Distribution par severity/project |
| `/metrics` | Métriques système |

### Advanced (`/api/monitoring/advanced`)
| Endpoint | Description |
|----------|-------------|
| `/summary` | Métriques complètes (API, Redis, PG, System) |
| `/logs/stream` | **SSE stream** temps réel |
| `/performance/endpoints` | Latence par endpoint (P50/P95/P99) |
| `/performance/slow-endpoints` | Endpoints lents + impact |
| `/performance/error-hotspots` | Erreurs par endpoint |
| `/alerts` | Alertes actives |
| `/alerts/counts` | Compte alertes par severity |
| `/{id}/acknowledge` | Acquitter alerte |

---

## 5.7 Health Checks

| Endpoint | Vérifications |
|----------|---------------|
| `/readiness` | DB connectivity → `{status: "ok"}` |
| `/health` | Full: DB + Redis + circuit breakers + Prometheus |
| `/api/v1/dashboard/health` | DB + write capability + memories table |

---

## 5.8 Middleware

| Middleware | Rôle |
|------------|------|
| CORS | Origins configurables |
| MetricsMiddleware | EPIC-22 — latence, comptage requêtes |
| Cache-disable | Development mode |

---

*Suite : [06-tests-qualite.md](./06-tests-qualite.md)*
