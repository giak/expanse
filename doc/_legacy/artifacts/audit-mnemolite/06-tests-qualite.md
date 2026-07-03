# 06 — Tests & Qualité

---

## 6.1 Vue d'Ensemble

| Métrique | Valeur |
|----------|--------|
| Fichiers de tests Python | 154 |
| Fonctions de test Python | ~1,541 |
| Classes + fonctions | ~1,720 |
| Tests frontend (Vitest) | ~137 |
| Scripts shell | 8 |
| Fichiers désactivés | 3 (~56 tests) |
| Fichiers archivés | 6 |
| **Total estimé actif** | **~1,500+ Python + 137 Frontend** |

---

## 6.2 Catégories de Tests

### Unit Tests (root `tests/test_*.py`) — ~244 tests
| Fichier | Tests | Coverage |
|---------|-------|----------|
| `test_embedding_service.py` | ~18 | MockEmbeddingService, similarity, batch |
| `test_rrf_fusion_service.py` | ~20 | RRF scoring, weighted fusion |
| `test_search_fallback.py` | ~9 | Auto-fallback, threshold |
| `test_dependency_injection.py` | ~6 (2 xfail) | Protocol-based DI |
| `test_retry.py` | ~12 | Exponential backoff, jitter |
| `test_notification_service.py` | ~15 | SMTP, multi-channel |
| `test_error_tracking.py` | ~10 | ErrorRepository, severity |

### Service Tests (`tests/services/`) — ~404 tests
| Fichier | Tests | Coverage |
|---------|-------|----------|
| `test_code_chunking_service.py` | ~25 (1 xfail) | Python AST chunking |
| `test_metadata_extractor_service.py` | ~34 | Complexity, calls, imports |
| `test_markdown_chunking.md` | — | Markdown split by ## |
| `test_dual_embedding_service.py` | — | TEXT+CODE embedding |
| `test_symbol_path_service.py` | — | name_path generation |
| `test_file_classification_service.py` | — | REGULAR/BARREL/CONFIG/TEST |
| `test_metrics_calculation_service.py` | — | Coupling, PageRank |
| `test_monitoring_alert_service.py` | — | Alert generation |

### LSP Tests (`tests/services/lsp/`) — ~60 tests (8+ skipif)
| Fichier | Tests | Notes |
|---------|-------|-------|
| `test_lsp_client.py` | ~13 | 8 skipif (LSP availability) |
| `test_lsp_lifecycle.py` | ~10 | 1 skipif |
| `test_type_extractor.py` | ~12 | 3 skipif |
| `test_type_extractor_cache.py` | ~15 | Cache hits, TTL |

### Metadata Extractor Tests — ~57 tests
| Fichier | Focus |
|---------|-------|
| `test_python_extractor.py` | Docstrings, type hints, decorators |
| `test_typescript_extractor.py` | Interfaces, generics, exports |
| `test_typescript_extractor_byte_offset.py` | UTF-8 byte offset precision |
| `test_typescript_extractor_reexports.py` | Re-export resolution |

### Route Tests (`tests/routes/`) — ~110 tests
Tous les endpoints ont des tests. 2 skip (SSE streaming, unnamed).

### Integration Tests (`tests/integration/`) — ~200 tests
| Fichier | Focus |
|---------|-------|
| `test_full_pipeline.py` | Pipeline complet chunk→metadata→embed→graph→store |
| `test_streaming_pipeline.py` | Mode streaming |
| `test_parallel_pipeline.py` | Workers parallèles |
| `test_batch_consumer_*.py` | Batch processing (Redis stream, subprocess) |
| `test_graph_construction.py` | Graph building |
| `test_semantic_search_e2e.py` | Recherche E2E |
| `test_circuit_breakers.py` | Circuit breaker pattern |
| `test_timeout_enforcement.py` | Timeout enforcement |
| `test_code_chunk_cache_integration.py` | L1/L2 cache |
| `test_large_batch_upload.py` | Stress test upload |
| `test_story_12_2_transactions.py` | Transaction handling |
| `test_epic11_*.py` | Qualified name search |

### MCP Indexing E2E (`tests/integration/test_mcp_indexing_e2e/`) — ~15 tests
| Fichier | Focus |
|---------|-------|
| `test_full_pipeline.py` | MCP-triggered indexing |
| `test_batch_insert.py` | Batch insert via MCP |
| `test_embedding_mismatch.py` | Dimension mismatch handling |

### Performance Tests (`tests/performance/`) — ~5 tests
| Fichier | Focus | Marker |
|---------|-------|--------|
| `test_embedding_performance.py` | Latency SLA, batch speedup, cache, throughput (>10 enc/s) | `@performance` |

### Pragmatic Integration (`tests/test_integration/`) — ~18 tests
`test_api_flow.py` — Flow API complet (marker: `integration`)

### Utility Tests (`tests/utils/`) — ~43 tests
Circuit breaker state machine, timeout decorator.

### Migration Tests (`tests/migrations/`) — ~17 tests
Schema migration v2→v3.

### Hook Tests (`tests/hooks/`) — 8 scripts shell
Project detection, message extraction, centralized service, Redis integration.

### Frontend Tests — ~137 tests (Vitest)
`useMemorySearch`, `useMemories`, `useCodeGraph`, `useDashboard`, `useCodeSearch`, `semantic-zoom-scoring`, `orgchart-visual-encoding`.

---

## 6.3 Tests Désactivés

| Fichier | Raison | Tests |
|---------|--------|-------|
| `_DISABLED_test_code_indexing_integration.py` | Sync TestClient + async DB, indentation errors | ~16 |
| `services/_DISABLED_test_php_vue_parsers.py` | `tree-sitter-language-pack` manquant | ~16 |
| `services/_DISABLED_test_javascript_typescript_parsers.py` | Même dépendance | ~24 |

## 6.4 Tests XFail/Skip

| Fichier | Type | Raison |
|---------|------|--------|
| `test_code_chunking_service.py:138` | xfail | Edge case: code < 50 chars |
| `test_dependency_injection.py:96,145` | xfail | Error behavior needs review |
| `test_event_routes.py:369,421` | skip | (non spécifié) |
| `routes/test_monitoring_routes_advanced.py:147` | skip | SSE streaming hangs |
| LSP tests (8+) | skipif | LSP server availability |

---

## 6.5 Configuration Tests

### `pytest.ini`
```ini
asyncio_mode = auto
anyio_backend = asyncio
markers = integration, performance, unit
```

### Fixtures Principaux (`tests/conftest.py` — 317 lignes)

| Fixture | Scope | Description |
|---------|-------|-------------|
| `test_engine` | function | SQLAlchemy engine test |
| `clean_db` | function | TRUNCATE CASCADE all tables |
| `event_repo` | function | EventRepository |
| `code_chunk_repo` | function | CodeChunkRepository |
| `test_client` | function | httpx AsyncClient (ASGITransport) |
| `dual_embedding_service` | session | Real DualEmbeddingService |
| `sample_events` | function | 5 events divers |
| `random_vector` | function | 768-dim random vector |

### Patterns de Mocking
- `AsyncMock` — async services
- `MagicMock` — sync objects
- `@patch` — decorator/context
- `MockEmbeddingService` — custom hash-based
- `MockEventRepository` — protocol-based
- httpx `AsyncClient` + `ASGITransport` — real app testing

---

## 6.6 Benchmarks (Performance)

| Opération | Target | Réel (estimé) | Notes |
|-----------|--------|---------------|-------|
| L1 cache hit | <0.01ms | <0.01ms | In-memory LRU |
| L2 cache hit | <5ms | 1-5ms | Redis async |
| Lexical search | <15ms | 5-15ms | pg_trgm GIN |
| Vector search | <20ms | <20ms | HNSW ef_search=100 |
| RRF fusion | <1ms | <1ms | In-memory |
| Hybrid code search | <50ms P95 | ~50ms | Sans reranking |
| Hybrid memory search | <100ms P95 | ~65ms | Post-fix singleton |
| Embedding single | <30ms | ~5ms | Avec cache |
| Embedding batch (32) | <60ms | ~50ms | SentenceTransformer |
| Code chunking | <100ms/300LOC | ~80ms | tree-sitter |
| File indexing | <5s | ~3-5s | Pipeline complet |
| Graph traversal | <5ms | ~0.155ms | Recursive CTE |
| Boot queries (4×) | — | ~260ms | Séquentiel (pouvant être 65ms) |

---

## 6.7 Commandes de Test

```bash
# Full suite (Docker)
make api-test

# Coverage
make api-coverage

# Fichier spécifique
make api-test-file file=tests/test_embedding_service.py

# Test spécifique
make api-test-one test=tests/test_embedding_service.py::test_generate_embedding

# Pragmatic runner
./tests/run_pragmatic_tests.sh fast   # ~10s
./tests/run_pragmatic_tests.sh full   # ~30s
./tests/run_pragmatic_tests.sh perf   # ~15s

# Frontend
cd frontend && pnpm test

# Load testing
locust -f api/locust_test.py --host http://localhost:8001
```

---

*Suite : [07-infrastructure.md](./07-infrastructure.md)*
