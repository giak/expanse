# Design: Mnemo CLI — REST API wrapper pour Mnemolite

**Date:** 2026-03-23
**Type:** CREATE + MODIFY
**Status:** Validé

---

## Problème

Les appels MCP à Mnemolite (search_memory, write_memory) consomment plus de tokens et sont plus lents que nécessaire. Le protocole MCP (JSON-RPC + framing + docker exec) ajoute ~100ms de latence et du overhead de sérialisation.

## Solution

Créer un CLI bash (`mnemo`) qui appelle directement la REST API Mnemolite via `curl + jq`.

---

## Composants

### 1. Endpoint REST `POST /api/v1/memories`

**Fichier:** `api/routes/memories_routes.py`

Ajout d'un endpoint `POST /api/v1/memories` pour créer des mémoires.

Pattern existant: `conversations_routes.py:430` crée déjà des mémoires via MemoryRepository + WriteMemoryTool.

```python
class MemoryCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    memory_type: str = Field("note")
    tags: List[str] = Field(default_factory=list)
    author: Optional[str] = None
    embedding_source: Optional[str] = None

@router.post("", status_code=201)
async def create_memory(request, engine=Depends(get_db_engine)):
    # MemoryRepository.create() + EmbeddingService
```

### 2. Script CLI `scripts/mnemo.sh`

**Fichier:** `scripts/mnemo.sh`

```
mnemo search <query> [--type TYPE] [--limit N] [--format json|table]
mnemo write <title> <content> [--type TYPE] [--tags t1,t2] [--author NAME]
mnemo get <memory_id> [--format json|table]
mnemo stats
```

- `MNEMO_API` env var (défaut: `http://127.0.0.1:8001`)
- Format table par défaut (jq), format json pour pipe

---

## Gains

| Aspect | MCP | CLI curl |
|--------|-----|----------|
| Overhead protocole | JSON-RCP + framing MCP | HTTP brut |
| Latence | ~100ms (stdio+docker exec) | ~5ms (curl direct) |
| Tokens output | JSON verbose MCP | Compact, filtable jq |
| Composabilité | Non | Pipe, grep, jq |

---

## Fichiers

| Fichier | Action |
|---------|--------|
| `api/routes/memories_routes.py` | MODIFY — ajouter `POST ""` |
| `scripts/mnemo.sh` | CREATE — CLI bash |
