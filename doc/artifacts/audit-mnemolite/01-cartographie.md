# 01 — Cartographie du Projet

---

## 1.1 Localisation et Structure

**Racine :** `/home/giak/Work/MnemoLite`

```
MnemoLite/
├── api/                          # Application principale (FastAPI)
│   ├── mnemo_mcp/                # Serveur MCP (FastMCP) — 32 fichiers
│   │   ├── tools/                # 8 fichiers outils MCP
│   │   ├── resources/            # 7 fichiers ressources MCP
│   │   ├── models/               # 8 fichiers modèles Pydantic
│   │   ├── transport/            # Placeholder (stdio seulement)
│   │   ├── utils/                # project_scanner
│   │   ├── server.py             # Orchestrateur principal (1570 lignes)
│   │   ├── base.py               # BaseMCPComponent ABC (186 lignes)
│   │   ├── config.py             # Pydantic Settings (78 lignes)
│   │   ├── prompts.py            # 6 prompts MCP (666 lignes)
│   │   ├── elicitation.py        # Human-in-the-loop (208 lignes)
│   │   └── shared_models.py      # Modèles partagés (291 lignes)
│   ├── routes/                   # 22 fichiers routes REST
│   ├── services/                 # 38+ fichiers services
│   │   ├── caches/               # L1 (LRU) → L2 (Redis) → L3 (PG)
│   │   ├── lsp/                  # Intégration LSP (Pyright + TS)
│   │   └── metadata_extractors/  # Python, TypeScript extractors
│   ├── models/                   # Modèles SQLAlchemy Core
│   ├── db/                       # Repository layer + query builders
│   │   ├── repositories/         # 10+ repositories
│   │   └── query_builders/       # Construction SQL
│   ├── config/                   # Circuit breakers, timeouts, languages
│   ├── workers/                  # Workers background
│   └── middleware/               # Metrics middleware
├── db/                           # Init SQL + scripts PostgreSQL
├── docker/                       # Configs Docker (Redis, nginx, worker)
├── docs/                         # Documentation (EPICs, ADRs, guides)
├── frontend/                     # Vue 3 + TypeScript + Vite
├── scripts/                      # Scripts utilitaires (~30 fichiers)
├── tests/                        # 154 fichiers de tests (~1500+ tests)
├── workers/                      # Worker processes
├── docker-compose.yml            # 5 services
├── Makefile                      # 210 lignes, 40+ targets
└── requirements.txt              # Dépendances Python
```

---

## 1.2 Métriques Brutes

| Métrique | Valeur |
|----------|--------|
| Fichiers Python (api/) | ~150 |
| Lignes de code Python | ~52,000 |
| Fichiers MCP layer | 32 |
| Lignes MCP layer | ~7,000 |
| Fichiers services | 52 |
| Lignes services | ~19,700 |
| Fichiers routes | 22 |
| Fichiers de tests | 154 (+ 137 frontend) |
| Fonctions de test | ~1,541 Python + 137 Frontend |
| Repositories | 10+ |
| Modèles Pydantic | 30+ |
| Endpoints REST | 50+ |
| Outils MCP | 11 |
| Ressources MCP | 12 |
| Prompts MCP | 6 |
| Tables PostgreSQL | 10 |
| Extensions supportées | 21 |
| Langages parsés | 5 (Python, TS, JS, TSX, Markdown) |

---

## 1.3 Stack Technique

| Couche | Technologie | Version | Rôle |
|--------|------------|---------|------|
| **API** | FastAPI | ≥0.109 | Framework REST async |
| **Serveur MCP** | FastMCP (mcp) | 1.12.3 | Protocole MCP 2025-06-18 |
| **ORM** | SQLAlchemy (async) | ≥2.0 | ORM + Core async |
| **DB** | PostgreSQL | 18 | Stockage principal |
| **pgvector** | pgvector | 0.8.1 | Vecteurs HNSW |
| **pg_trgm** | pg_trgm | — | Recherche lexicale trigram |
| **Cache L1** | In-memory LRU | — | 100MB, MD5 validation |
| **Cache L2** | Redis | 7 | 2GB, allkeys-lru |
| **Embedding TEXT** | nomic-embed-text-v1.5 | 137M | 768D, mémoire sémantique |
| **Embedding CODE** | jina-embeddings-v2-base-code | 161M | 768D, code sémantique |
| **Reranker** | BAAI/bge-reranker-base | 110M | Cross-encoder optionnel |
| **Parser** | tree-sitter | ≥0.25 | AST parsing multi-langage |
| **LSP Python** | Pyright | ≥1.1.350 | Extraction de types |
| **LSP TS** | typescript-language-server | — | Extraction de types TS |
| **Frontend** | Vue 3 + TypeScript | 3.x | UI |
| **Graph viz** | @antv/g6 | — | Visualisation graphe |
| **Containerisation** | Docker Compose | — | 5 services |
| **Monitoring** | OpenObserve | — | Logs + métriques |

---

## 1.4 Dépendances Critiques

**`requirements.txt` (root) :**
- `fastapi>=0.109.0`, `uvicorn>=0.27.0`
- `sqlalchemy[asyncio]>=2.0.0`, `asyncpg>=0.29.0`, `alembic>=1.13.0`
- `pgvector>=0.2.0,<0.3.0`
- `pydantic>=2.5.0`, `pydantic-settings>=2.1.0`
- `mcp==1.12.3` (pin exact)

**`api/requirements.txt` (complet) :**
- `torch==2.5.1+cpu` (CPU-only, ~5GB économisés)
- `sentence-transformers>=2.7.0`, `transformers==4.51.3`
- `tree-sitter>=0.25.0`, `tree-sitter-language-pack>=0.4.0`
- `redis[hiredis]>=5.0.0`, `pyright>=1.1.350`
- `radon>=6.0.1` (complexité cyclomatique)

---

## 1.5 Variables d'Environnement Critiques

| Variable | Défaut | Usage |
|----------|--------|-------|
| `DATABASE_URL` | `postgresql://mnemo:mnemopass@db:5432/mnemolite` | Connexion PG |
| `REDIS_URL` | `redis://redis:6379/0` | Cache L2 |
| `EMBEDDING_MODE` | `real` | `real` ou `mock` |
| `EMBEDDING_MODEL` | `nomic-ai/nomic-embed-text-v1.5` | Modèle TEXT |
| `CODE_EMBEDDING_MODEL` | `jinaai/jina-embeddings-v2-base-code` | Modèle CODE |
| `EMBEDDING_DIMENSION` | `768` | Dimension vecteur |
| `EMBEDDING_DEVICE` | `cpu` | Device inference |
| `L1_CACHE_SIZE_MB` | `100` | Taille cache L1 |
| `MCP_TRANSPORT` | `stdio` | Transport MCP |
| `ENVIRONMENT` | `development` | Mode environnement |
| `TYPESCRIPT_LSP_ENABLED` | `true` | Toggle LSP TS |

---

*Suite : [02-architecture-mcp.md](./02-architecture-mcp.md)*
