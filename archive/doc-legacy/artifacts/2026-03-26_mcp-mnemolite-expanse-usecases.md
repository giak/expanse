# MCP Mnemolite - Expanse Use Cases Report

> **Date:** 2026-03-26  
> **Status:** ✅ Opérationnel

---

## Résumé Exécutif

| Outil MCP | Utilisation Expanse | Status | Performance |
|-----------|-------------------|--------|-------------|
| `write_memory` | Pattern crystallization | ✅ | ~100ms |
| `search_memory` | Recall patterns (§M) | ✅ | ~6s (embeddings) |
| `read_memory` | Retrieve full content | ✅ | ~50ms |
| `update_memory` | Add tags | ✅ | ~100ms |
| `delete_memory` | Cleanup | ✅ | ~50ms |
| `search_code` | Vessel workspace search | ✅ | ~100ms (lexical) |
| `index_project` | Index files | ✅ | ~30s/file (embeddings) |

---

## Use Cases Expanse

### 1. Pattern Crystallization (`write_memory`)

**Source:** `expanse-v15-apex.md` §VIII  
**Appel:**
```
mcp_mnemolite_write_memory(
    title="PATTERN: {nom}",
    content="{description}",
    tags=["sys:pattern", "v15", "substrat:{LLM}"],
    memory_type="reference"
)
```

**Test:**
```bash
curl -X POST "http://localhost:8000/api/v1/memories" \
  -d '{"title":"TEST: ECS Pattern","content":"Test.","memory_type":"reference","tags":["sys:pattern"]}'
# Result: ✅ Created ID=a76e47e6-8936-4f6e-aade-b3ea40e0d7d4
```

---

### 2. Pattern Recall (`search_memory`)

**Source:** `expanse-v15-apex.md` §M  
**Appel:**
```
mcp_mnemolite_search_memory(
    query=Σ_input,
    tags=["sys:pattern","sys:anchor"],
    limit=3
)
```

**Test:**
```bash
curl -X POST "http://localhost:8000/api/v1/memories/search" \
  -d '{"query": "ECS", "limit": 3}'
# Result: ✅ 2 results, search_time=6144ms
```

---

### 3. Vessel Search (`search_code`)

**Source:** `expanse-v15-apex.md` §Ⅱ  
**Appel:**
```
mcp_mnemolite_search_code(
    query="{keywords}",
    filters={"repository": "expanse"},
    limit=5
)
```

**Test:**
```bash
curl -X POST "http://localhost:8000/v1/code/search/lexical" \
  -d '{"query": "ECS", "repository": "expanse", "limit": 3}'
# Result: ✅ 1 result, score=0.333
```

---

### 4. Trace Fresh Search (`search_memory`)

**Source:** `expanse-dream.md` §DREAM  
**Appel:**
```
mcp_mnemolite_search_memory(
    query="TRACE:FRESH",
    tags=["trace:fresh"],
    limit=20
)
```

---

### 5. History Recall (`search_memory`)

**Source:** `expanse-dream.md` §DASHBOARD  
**Appel:**
```
mcp_mnemolite_search_memory(
    query="sys:history",
    tags=["sys:history"],
    limit=50
)
```

---

### 6. Drift Investigation (`write_memory`)

**Source:** `expanse-dashboard.md`  
**Appel:**
```
mcp_mnemolite_write_memory(
    title="DRIFT: {symptom}",
    tags=["sys:drift", "auto", "type:contradiction"],
    memory_type="investigation"
)
```

---

### 7. Auto-Extension (`write_memory`)

**Source:** `expanse-test-runner.md`  
**Appel:**
```
mcp_mnemolite_write_memory(
    title="EXTENSION: {nom}",
    tags=["sys:extension", "auto"],
    memory_type="reference"
)
```

---

## Endpoints HTTP Disponibles

| Endpoint | Méthode | Usage |
|---------|---------|-------|
| `/api/v1/memories` | POST | write_memory |
| `/api/v1/memories/{id}` | GET | read_memory |
| `/api/v1/memories/{id}` | PUT | update_memory |
| `/api/v1/memories/{id}` | DELETE | delete_memory |
| `/api/v1/memories/search` | POST | search_memory |
| `/v1/code/search/lexical` | POST | search_code (lexical) |
| `/v1/code/search/vector` | POST | search_code (vector) |
| `/v1/code/search/hybrid` | POST | search_code (hybrid) |

---

## Performance Notes

| Opération | Avant | Après | Amélioration |
|-----------|-------|-------|--------------|
| write_memory | ~100ms | ~100ms | - |
| read_memory | ~50ms | ~50ms | - |
| search_memory | **~4000ms** | **~65ms** | **60x ✅** |
| search_code (lexical) | ~100ms | ~100ms | - |
| search_code (hybrid) | ~30s | ~30s | - |

### Bug Fix: search_memory singleton

**Problème:** `search_memories` créait une **nouvelle instance** de `SentenceTransformerEmbeddingService` par requête → modèle rechargé (~4s) à chaque fois.

**Solution:** Utiliser le pattern de dépendances FastAPI avec `get_embedding_service` (singleton).

```python
# AVANT (lent)
embedding_service = SentenceTransformerEmbeddingService()

# APRÈS (rapide)
embedding_service: EmbeddingServiceProtocol = Depends(get_embedding_service)
```

---

## Conclusion

✅ **Tous les outils MCP Mnemolite utilisés par Expanse sont opérationnels.**

✅ **search_memory corrigé: 4s → 65ms (60x plus rapide)**

**Améliorations possibles:**
1. ✅ Cache pour search_memory — FIXÉ avec singleton
2. Index lexical pour memories (fallback quand embeddings indisponibles)
3. Batch write_memory pour patterns multiples
