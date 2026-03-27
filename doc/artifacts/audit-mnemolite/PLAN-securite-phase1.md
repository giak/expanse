# Plan Sécurité Mnemolite — Phase 1 (Critique)

> **Date :** 2026-03-27  
> **Source :** [ROBUSTESSE-AUDIT.md](./ROBUSTESSE-AUDIT.md) + cartographie SQL injection  
> **Effort estimé :** 3 jours  
> **Objectif :** Zéro vulnérabilité critique

---

## SEC-03 : SQL Injection (11 vulnérabilités)

### Cartographie

| # | Fichier | Lignes | Pattern | Sévérité | Fix |
|---|---------|--------|---------|----------|-----|
| 1 | `code_chunk_repository.py` | 279-286 | f-string embedding dans SELECT | HIGH | Paramètre lié |
| 2 | `vector_search_service.py` | 104,155-170 | f-string embedding + colonne | HIGH | Paramètre lié |
| 3 | `memory_repository.py` | 67-83 | f-string embedding dans INSERT | HIGH | Paramètre lié |
| 4 | `memory_repository.py` | 208-209 | f-string embedding dans UPDATE | HIGH | Paramètre lié |
| 5 | `memory_repository.py` | 479-505 | f-string vector dans SELECT/WHERE | HIGH | Paramètre lié |
| 6 | `hybrid_memory_search_service.py` | 604-619 | f-string vector dans SELECT/WHERE | HIGH | Paramètre lié |
| 7 | `error_repository.py` | 131,184,244,284 | f-string hours dans INTERVAL | MEDIUM | `make_interval` |
| 8 | `autosave_monitoring_routes.py` | 79-85 | f-string days dans INTERVAL | MEDIUM | `make_interval` |
| 9 | `vector_search_service.py` | 149 | f-string ef_search dans SET | LOW | `int()` validation |

### Tâches

#### T1 : INTERVAL injection (7-8) — 30min
```python
# AVANT
WHERE timestamp > NOW() - INTERVAL '{hours} hours'

# APRÈS
WHERE timestamp > NOW() - make_interval(hours => :hours)
```
**Fichiers :** `error_repository.py` (4 occurrences), `autosave_monitoring_routes.py` (1)

#### T2 : ef_search integer injection (9) — 15min
```python
# AVANT
f"SET LOCAL hnsw.ef_search = {self.ef_search}"

# APRÈS
await conn.execute(text("SET LOCAL hnsw.ef_search = :ef"), {"ef": int(self.ef_search)})
```
**Fichier :** `vector_search_service.py`

#### T3 : Embedding vector injection (1-6) — 2h
Les vecteurs d'embedding (768 floats) ne peuvent PAS être passés comme paramètres SQLAlchemy classiques. pgvector attend un cast `::vector` ou `::halfvec`.

**Stratégie :** Utiliser un helper centralisé `format_vector_for_sql()` qui :
- Valide que l'input est bien une liste de floats de la bonne dimension
- Échappe les caractères dangereux
- Retourne un format garanti safe

```python
# api/utils/sql_vector.py (nouveau)
def format_halfvec_for_sql(embedding: List[float]) -> str:
    """Format embedding for safe SQL interpolation.
    
    Validates and formats a float list as a pgvector halfvec literal.
    Safe for SQL interpolation because:
    - Input is validated as list of floats
    - No string characters survive the float conversion
    - Output format is strictly [num,num,...]
    """
    if not isinstance(embedding, (list, tuple)):
        raise ValueError(f"Expected list, got {type(embedding)}")
    if len(embedding) == 0:
        raise ValueError("Empty embedding")
    for x in embedding:
        if not isinstance(x, (int, float)):
            raise ValueError(f"Non-numeric value in embedding: {x}")
    return "[" + ",".join(str(float(x)) for x in embedding) + "]"
```

**Fichiers :**
- `code_chunk_repository.py` — utiliser `format_halfvec_for_sql()`
- `vector_search_service.py` — idem
- `memory_repository.py` — `format_vector_for_sql()` pour INSERT/UPDATE (cast `::vector`)
- `memory_repository.py` — `format_halfvec_for_sql()` pour search (cast `::halfvec`)
- `hybrid_memory_search_service.py` — idem

---

## SEC-02 : Credentials Hardcodés — 30min

### Fichiers concernés

| Fichier | Lignes | Contenu |
|---------|--------|---------|
| `api/mnemo_mcp/config.py` | 37-38 | `database_url` avec mot de passe |
| `api/mnemo_mcp/config.py` | 44-48 | `api_keys` hardcodés |
| `api/mnemo_mcp/config.py` | 57-58 | `oauth_secret_key` |
| `docker-compose.yml` | — | `ZO_ROOT_USER_PASSWORD` |

### Tâches

#### T4 : Config Pydantic — valeurs par défaut sécurisées
```python
# AVANT
database_url: str = "postgresql://mnemo:mnemopass@db:5432/mnemolite"
api_keys: dict[str, str] = {"dev-key-12345": "developer"}
oauth_secret_key: str = "change-me-in-production"

# APRÈS
database_url: str = Field(default="")
api_keys: dict[str, str] = Field(default_factory=dict)
oauth_secret_key: str = Field(default="")
```

#### T5 : Validation au démarrage
```python
# server.py lifespan — vérifier que les secrets sont configurés
if not config.database_url:
    raise RuntimeError("DATABASE_URL must be set")
if config.transport == "http" and not config.oauth_secret_key:
    logger.warning("HTTP transport without OAuth — API key recommended")
```

---

## SEC-04 : Subprocess Injection — 30min

### Fichier concerné

| Fichier | Ligne | Contenu |
|---------|-------|---------|
| `api/routes/conversations_routes.py` | 60-65 | `subprocess.run(["bash", ...])` |

### Tâche

#### T6 : Valider et sanitiser working_dir
```python
# AVANT
subprocess.run(["bash", str(script_path), working_dir], ...)

# APRÈS
import shlex
# Valider que working_dir est un chemin absolu existant
validated_dir = os.path.realpath(working_dir)
if not validated_dir.startswith("/home/"):
    raise ValueError("Working directory must be under /home/")
subprocess.run(
    ["/bin/bash", str(script_path), validated_dir],
    cwd=None,
    timeout=30,
    capture_output=True
)
```

---

## SEC-01 : Authentification API — 1-2j

### Architecture recommandée

```
Client Request
  → API Key Middleware (simple, suffisant pour Expanse)
    → Verify X-API-Key header
    → Rate limit per key
  → Endpoint Handler
```

### Pourquoi API Key et pas JWT ?

- Expanse est un usage **personnel** (pas multi-tenant)
- API Key est plus simple à implémenter et à maintenir
- Pas besoin de refresh tokens, rotation, etc.
- JWT ajoute de la complexité sans bénéfice pour Expanse

### Tâches

#### T7 : Middleware API Key — `api/middleware/auth.py` (nouveau)
```python
# api_keys stockés dans env var: MNEMO_API_KEYS=key1:owner1,key2:owner2
# ou dans un fichier JSON: /etc/mnemolite/api_keys.json

class APIKeyMiddleware(BaseHTTPMiddleware):
    EXEMPT_PATHS = {"/health", "/readiness", "/metrics", "/"}
    
    async def dispatch(self, request, call_next):
        if request.url.path in self.EXEMPT_PATHS:
            return await call_next(request)
        
        api_key = request.headers.get("X-API-Key")
        if not api_key or not self._verify_key(api_key):
            return JSONResponse(status_code=401, content={"error": "Invalid API key"})
        
        return await call_next(request)
```

#### T8 : Registration dans `main.py`
```python
app.add_middleware(APIKeyMiddleware)
```

#### T9 : Tests TDD
- Test sans clé → 401
- Test clé invalide → 401
- Test clé valide → 200
- Test path exempt (/health) → 200 sans clé

---

## Ordre d'Exécution

```
1. T1 + T2  (45min)  → INTERVAL + ef_search — fixes faciles, impact immédiat
2. T3        (2h)    → Embedding vectors — helper centralisé + 6 fichiers
3. T4 + T5  (30min)  → Credentials hardcodés
4. T6        (30min)  → Subprocess injection
5. T7 + T8 + T9 (1-2j) → Auth middleware
```

**Total :** ~3 jours

---

## Tests TDD Plan

| Test | Couvre | Type |
|------|--------|------|
| `test_interval_parameterized` | INTERVAL make_interval() | Unitaire |
| `test_ef_search_is_integer` | ef_search validation | Unitaire |
| `test_format_halfvec_valid` | Helper vector validation | Unitaire |
| `test_format_halfvec_rejects_non_float` | Helper rejet input | Unitaire |
| `test_no_fstring_in_sql` | Regression — aucun f-string SQL | Inspection code |
| `test_api_key_required` | Auth middleware | Intégration |
| `test_api_key_invalid` | Auth middleware | Intégration |
| `test_api_key_valid` | Auth middleware | Intégration |
| `test_health_exempt_from_auth` | Auth exempt paths | Intégration |
| `test_creds_not_in_source` | No hardcoded creds | Inspection code |

---

*Document généré le 2026-03-27 — Plan sécurité Phase 1*
