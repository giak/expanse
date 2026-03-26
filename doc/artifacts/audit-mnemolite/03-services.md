# 03 — Services

---

## 3.1 Architecture des Services

**Total :** 52 fichiers, ~19,700 lignes

```
CodeIndexingService (orchestrateur)
├── CodeChunkingService (1023 lignes)
│   ├── PythonParser (tree-sitter)
│   ├── TypeScriptParser (tree-sitter)
│   ├── JavaScriptParser (hérite TS)
│   └── MarkdownChunker (regex)
├── DualEmbeddingService (877 lignes)
│   ├── nomic-embed-text-v1.5 (TEXT, 137M, 768D)
│   └── jina-embeddings-v2-base-code (CODE, 161M, 768D)
├── GraphConstructionService (1727 lignes)
│   ├── NodeRepository / EdgeRepository
│   └── MetricsCalculationService
├── CascadeCache
│   ├── CodeChunkCache L1 (100MB in-memory LRU)
│   └── RedisCache L2 (Redis 7, 2GB)
├── SymbolPathService (226 lignes)
├── TypeExtractorService (769 lignes)
│   ├── PyrightLSPClient (594 lignes)
│   └── TypeScriptLSPClient (697 lignes)
└── MetadataExtractorService (526 lignes)
    ├── PythonMetadataExtractor (434 lignes)
    └── TypeScriptMetadataExtractor (1092 lignes)

HybridCodeSearchService (755 lignes)
├── LexicalSearchService (pg_trgm)
├── VectorSearchService (HNSW)
├── RRFFusionService (k=60)
└── CrossEncoderRerankService (optionnel)

HybridMemorySearchService (693 lignes)
├── pg_trgm lexical (ILIKE + trigram)
├── pgvector HNSW vector
├── RRFFusionService
└── CrossEncoderRerankService (optionnel)
```

---

## 3.2 Services d'Embedding

### EmbeddingServiceInterface (ABC)
- `generate_embedding(text: str) -> List[float]`
- `compute_similarity(item1, item2) -> float` — cosinus normalisé [0,1]

### MockEmbeddingService
- Hash-based, déterministe, pas sémantique
- `np.random.seed(abs(hash(text)) % 2^32-1)` → vecteur Gauss normalisé
- Usage : dev/test uniquement

### SentenceTransformerEmbeddingService (506 lignes)
- Modèle unique (nomic, e5-base, e5-small, e5-large)
- Lazy loading + double-checked locking + asyncio.Lock
- LRU cache (1000 entrées, SHA-256 key)
- ThreadPoolExecutor pour encode (CPU-bound)
- Batch encoding (batch_size=32)

### DualEmbeddingService (877 lignes) — **Production**

| Aspect | Détail |
|--------|--------|
| Modèle TEXT | nomic-embed-text-v1.5 (137M params, ~260 MB) |
| Modèle CODE | jina-embeddings-v2-base-code (161M params, ~400 MB) |
| RAM total | ~660-700 MB |
| Retour | `Dict[str, List[float]]` avec clés `text` et/ou `code` |
| Circuit breaker | EPIC-12 — failure_threshold, recovery_timeout, half_open_max_calls |
| Timeout | EPIC-12 — wrapping sur tous les appels encode |
| RAM monitoring | psutil — refuse CODE si RSS > 2500 MB |
| Mock mode | `EMBEDDING_MODE=mock` — vecteurs MD5 déterministes |
| Cleanup | `torch.no_grad()` + `cuda.empty_cache()` après chaque batch |

**Performance :** ~50ms/batch (32 textes), ~5ms single embedding avec cache.

---

## 3.3 Services de Recherche

### LexicalSearchService (270 lignes) — pg_trgm

```sql
SELECT *, GREATEST(
    similarity(name, :query),
    similarity(source_code, :query),
    similarity(name_path, :query)
) as score
FROM code_chunks
WHERE similarity(...) > :threshold  -- default 0.1
ORDER BY score DESC
LIMIT :limit
```

**Performance :** 5-15ms pour 10k chunks. Index GIN trigram.

### VectorSearchService (300 lignes) — pgvector HNSW

```sql
SELECT *, (1 - (embedding <=> :query_vector)) as similarity
FROM code_chunks
WHERE ...
ORDER BY embedding <=> :query_vector
LIMIT :limit
```

**Performance :** <20ms pour 10k chunks. HNSW ef_search=100.

### RRFFusionService (299 lignes) — Reciprocal Rank Fusion

```
RRF_score(doc) = Σ weight_i / (k + rank_i(doc))
```

- `k=60` (constante industry-standard)
- Scale-invariant — pas de normalisation nécessaire
- `FusedResult` : chunk_id, rrf_score, rank, contribution (source breakdown)

### HybridCodeSearchService (755 lignes) — Pipeline Complet

```
Query → [Redis Cache] → Parallèle [Lexical + Vector] → RRF → [Reranker] → Top-K → Cache
```

**Auto-weight heuristic :**
- Code-heavy (≥5 indicators `(){}.->::`) : lexical=0.3, vector=0.7
- Natural language (>3 words, 0 indicators) : lexical=0.5, vector=0.5
- Default : lexical=0.4, vector=0.6

**Cross-Encoder Reranking (optionnel) :**
- Lazy-loaded, limité à 30 candidats
- Modèles : ms-marco-MiniLM-L-6-v2 (22M), BAAI/bge-reranker-base (110M)
- ~10ms/doc, improvement 20-30%

### HybridMemorySearchService (693 lignes)

**Spécificités vs Code Search :**
- ILIKE pour matching exact de noms propres (ex: "Bardella")
- Trigram sur `title` + `embedding_source` uniquement (PAS le content complet — trop lent)
- ILIKE match → bonus score 1.0/0.95
- Vector similarity threshold 0.1 (filtre le bruit sémantique)
- Cible : <100ms P95 sans reranking, <200ms P95 avec

---

## 3.4 Service d'Indexation

### CodeIndexingService (878 lignes) — Pipeline 7 Étapes

```
Pour chaque fichier :
  1. Cache invalidation (L1 + L2)
  2. Language detection (extension-based, 22 extensions)
  3. CodeChunkingService.chunk_code() → List[CodeChunk]
     └── tree-sitter AST → code units → split/merge → chunks
  4. LSP type extraction (Pyright ou TS LSP, 3s timeout/chunk)
  5. Embedding generation (batch)
     ├── Chunks avec docstring → EmbeddingDomain.TEXT
     └── Chunks sans docstring → EmbeddingDomain.CODE
  6. Batch insert dans DB (transaction atomique)
  7. Cache population (L1 + L2)
```

**Limites :** 50 chunks/fichier max. Fichiers .d.ts >5000 lignes skippés.

### CodeChunkingService (1023 lignes) — AST Chunking

**Langages supportés :** Python, TypeScript, JavaScript, TSX, Markdown

**Algorithme (inspiré cAST paper 2024) :**
1. Parse → AST (tree-sitter, ThreadPoolExecutor 4 workers)
2. Identify code units (functions, classes, methods, interfaces)
3. Split si > max_chunk_size (2000 chars)
4. Merge si < min_chunk_size (100 chars) — **TODO : non implémenté**
5. Fallback : fixed chunking (10% overlap)

**Types de chunks spéciaux :**
- `BARREL` — ré-exportateurs (EPIC-29)
- `CONFIG_MODULE` — fichiers de config
- `MARKDOWN_SECTION` — split par `##` headers
- `FALLBACK_FIXED` — chunking line-based avec overlap

### MarkdownChunker (`_chunk_markdown()` lignes 805-891)

```python
# Split par ## headers (H2 uniquement)
# Content avant premier ## → prepend au premier chunk
# Section > 2000 chars → fallback_fixed_chunking()
# Chunk metadata: {"header": header_text}
```

---

## 3.5 Services de Graphe

### GraphConstructionService (1727 lignes)

**Pipeline :**
1. Auto-detect languages
2. Get all chunks
3. Create nodes (Function, Class, Module, Config)
4. Create call edges (avec résolution)
5. Create import edges (avec résolution)
6. Create re-export edges (barrels)
7. Create structural hierarchy (contains)
8. Calculate metrics (coupling, PageRank, edge weights)

**Résolution d'appels :**
1. Skip Python builtins (50+ noms)
2. name_path exact match (EPIC-11) — plus haute précision
3. Local file match — précision moyenne
4. Import-based match — fallback

### GraphTraversalService (603 lignes)

- PostgreSQL `WITH RECURSIVE` CTEs
- Direction : outbound (dependencies) / inbound (dependents)
- Cycle prevention : `NOT (e.target_node_id = ANY(p.path))`
- Profondeur max : 3 (défaut)
- L2 cache Redis (TTL 120s)

### MetricsCalculationService (242 lignes)

- **Coupling :** afferent (incoming) / efferent (outgoing) / instability
- **PageRank :** power method itératif, damping=0.85, convergence 1e-6
- **Edge weights :** average PageRank of source + target

---

## 3.6 Cache Triple-Couche

```
L1 (In-Memory)  →  L2 (Redis)  →  L3 (PostgreSQL)
   0.01ms            1-5ms           100-200ms
   100MB LRU         2GB shared      Unlimited
```

### CodeChunkCache (L1 — 229 lignes)
- LRU eviction avec validation MD5 hash (zero-trust)
- `get(file_path, source_code)` → vérifie hash, retourne chunks ou None
- Stats : hits, misses, evictions, utilization %

### RedisCache (L2 — 330 lignes)
- Async Redis, connection pooling (max 20)
- Circuit breaker (EPIC-12)
- Retry logic : 3 tentatives, 0.5s base delay, exponential backoff + jitter
- Graceful degradation → returns None/False

### CascadeCache (L1+L2 — 293 lignes)
- **Write-through :** populate L1 + L2
- **Auto-promotion :** L2 hit → promote to L1
- **Invalidation :** `invalidate(file_path)` clear both layers
- **Hit rate formula :** `L1_rate + (1 - L1_rate) × L2_rate`

---

## 3.7 Intégration LSP

```
TypeExtractorService (769 lignes)
├── PyrightLSPClient (594 lignes) — Python
│   ├── JSON-RPC stdio
│   ├── hover() → type info
│   ├── get_document_symbols()
│   └── Background _read_responses() + _drain_stderr()
└── TypeScriptLSPClient (697 lignes) — TS/JS/TSX/JSX
    ├── JSON-RPC stdio
    ├── hover() + get_definition()
    └── language_id param

LSPLifecycleManager (318 lignes)
├── start() — retry exponential backoff (max 3)
├── ensure_running() — auto-restart si crash
├── health_check() → healthy/crashed/not_started/starting
└── shutdown() — graceful
```

**Cache LSP :** Redis `lsp:type:{content_hash}:{line_number}` TTL 300s.

---

## 3.8 Extraction de Métadonnées

### MetadataExtractorService (526 lignes) — Routeur

```
language=python → PythonMetadataExtractor (tree-sitter ou ast fallback)
language=typescript/javascript → TypeScriptMetadataExtractor
other → basic metadata (vide)
```

### PythonMetadataExtractor (434 lignes)
- tree-sitter queries : imports, calls, decorators, type hints, async
- Fallback `ast` module : signature, docstring, complexity (radon), imports, calls
- Framework blacklist : pytest, unittest, mock, print, logging

### TypeScriptMetadataExtractor (1092 lignes) — **Plus complexe**
- Named/namespace/default/side-effect imports
- Type-only imports/exports (manual AST traversal)
- Re-exports (named, wildcard, renamed, type-only)
- Function calls avec cleanup (_clean_call_name)
- Constructor calls (new)
- Framework blacklist (Vitest/Jest)
- Call contexts (scope_type, is_conditional, is_loop, is_try_catch)
- Cyclomatic complexity calculation
- LSP type mapping
- **Fix UTF-8 (EPIC-28) :** byte offset slicing avec encode/decode

---

## 3.9 Services Additionnels

| Service | Lignes | Rôle |
|---------|--------|------|
| CrossEncoderRerankService | 316 | Reranking cross-encoder (20-30% improvement) |
| SymbolPathService | 226 | Génération name_path hiérarchique |
| FileClassificationService | 164 | Classification REGULAR/BARREL/CONFIG/TEST |
| MetricsCollector | 335 | Métriques API, Redis, PG, System |
| EndpointPerformanceService | 312 | Latence par endpoint (P50/P95/P99) |
| MonitoringAlertService | 434 | Alertes sur seuils |
| ErrorTrackingService | 353 | Logging centralisé avec severity |
| BatchIndexingProducer | 235 | Scan + enqueue Redis Stream |
| BatchIndexingConsumer | 553 | Process batches via subprocess |
| SimpleMemoryCache | 343 | LRU cache + CachedEmbeddingService wrapper |
| EventService | 234 | Event CRUD avec auto-embedding |
| NotificationService | 168 | SMTP email notifications |

---

*Suite : [04-donnees.md](./04-donnees.md)*
