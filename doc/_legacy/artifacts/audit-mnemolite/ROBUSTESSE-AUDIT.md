# Mnemolite — Audit de Robustesse

> **Objectif :** Rendre Mnemolite infaillible — pas de crash, pas de perte de données, pas de surprise  
> **Date :** 2026-03-26  
> **Méthode :** Audit deep dive sur 10 axes (error handling, DB, embedding, MCP, cache, sécurité, tests, logging, config, deps)

---

## TL;DR : Ce qui va bien

| Area | Strength |
|------|----------|
| **Architecture** | Circuit breakers, 3-tier cache, lazy loading, fallbacks — pattern solide |
| **Logging** | structlog + trace IDs + Prometheus + OpenObserve — observabilité forte |
| **Cache** | L1/L2/L3 cascade avec retry et graceful degradation |
| **Embedding** | Dual model TEXT/CODE avec mock mode, timeout, RAM monitoring |
| **MCP** | FastMCP + service injection + lifespan management |
| **Tests** | 115+ fichiers de tests, TDD rigoureux |

---

## Ce qui ne va pas — 47 issues trouvées

### 🔴 CRITIQUE (Do Today)

#### 1. Pas d'authentification API

**Lieu :** Toute l'API (`/api/v1/*`)

**Problème :** Aucun endpoint n'a d'authentification. N'importe qui avec accès réseau peut lire, écrire, supprimer toutes les données.

**Impact :** Fuite de données, corruption, DoS.

**Fix :** Ajouter un middleware JWT ou API key sur tous les endpoints sauf `/health`.

---

#### 2. SQL injection via f-string

**Lieu :** `api/db/repositories/memory_repository.py:67`

```python
# DANGEREUX — interpolation directe dans SQL
embedding_str = f"'[{','.join(map(str, embedding))}]'::vector"
```

**Problème :** Si `embedding` est manipulé, injection SQL possible. Pattern répété dans 10+ fichiers.

**Impact :** Corruption DB, exfiltration, crash.

**Fix :** Remplacer TOUS les f-strings SQL par des paramètres liés.

---

#### 3. Credentials hardcodés

**Lieu :** `api/mnemo_mcp/config.py:44-48, 57-58`

```python
database_url: str = "postgresql://mnemo:mnemopass@db:5432/mnemolite"
oauth_secret_key: str = "change-me-in-production"
api_keys: dict = {"dev-key-12345": "developer", "test-key-67890": "tester"}
```

**Problème :** Mots de passe dans le code source. Docker compose aussi : `ZO_ROOT_USER_PASSWORD=Complexpass#123`.

**Impact :** Accès non autorisé si le code est exposé.

**Fix :** Tout dans les variables d'environnement. Jamais dans le code.

---

#### 4. Subprocess sans sanitisation

**Lieu :** `api/routes/conversations_routes.py:60-65`

```python
subprocess.run(["bash", str(script_path), working_dir], ...)
```

**Problème :** Si `working_dir` est contrôlé par l'utilisateur, injection de commande possible.

**Impact :** Exécution de code arbitraire sur le serveur.

**Fix :** Valider et sanitiser tous les arguments subprocess.

---

### 🟠 HIGH (This Week)

#### 5. Pas de rate limiting

**Lieu :** Toute l'API

**Problème :** Aucune limite de requêtes. L'endpoint d'embedding (coûteux) peut être bombardé.

**Impact :** DoS, épuisement RAM/CPU, crash.

**Fix :** Ajouter `slowapi` ou équivalent. 100 req/min par défaut.

---

#### 6. CORS ouvert

**Lieu :** `api/main.py:392`

```python
allowed_origins = ["*"]  # En mode dev
```

**Problème :** Si `ENVIRONMENT` est mal configuré, la production est ouverte aux requêtes cross-origin.

**Impact :** Attaques CSRF, exfiltration de données.

**Fix :** Ne jamais permettre `"*"` en production. Valider `ENVIRONMENT` au démarrage.

---

#### 7. Pas de timeout MCP

**Lieu :** Tous les outils MCP (`server.py`)

**Problème :** Les appels MCP n'ont pas de timeout. Une requête DB lente ou un embedding bloquant peut hang le client MCP indéfiniment.

**Impact :** Client MCP bloqué, mauvaise UX.

**Fix :** Wrapper chaque tool avec `asyncio.wait_for(tool(), timeout=30)`.

---

#### 8. Circuit breaker partagé

**Lieu :** `api/services/dual_embedding_service.py:142`

**Problème :** Les modèles TEXT et CODE partagent un seul circuit breaker. Si CODE échoue, TEXT est aussi bloqué.

**Impact :** Défaillance en cascade, service complet indisponible.

**Fix :** Un circuit breaker par modèle.

---

#### 9. Dependencies manquantes

**Lieu :** `requirements.txt`

**Problème :**
- `sentence-transformers` est commenté (core dependency !)
- `psutil` est importé mais pas listé
- `redis` est importé mais pas listé
- `numpy` est dans requirements-dev mais c'est runtime

**Impact :** Crash au démarrage sur un install propre.

**Fix :** Ajouter TOUTES les dépendances runtime.

---

#### 10. Cache non invalidé sur writes

**Lieu :** `api/services/caches/cascade_cache.py`

**Problème :** Quand des données sont écrites en DB, le cache n'est pas invalidé. Les lectures suivantes retournent des données obsolètes.

**Impact :** Incohérence données, bugs silencieux.

**Fix :** Ajouter des hooks d'invalidation sur les opérations d'écriture.

---

#### 11. pool_pre_ping désactivé

**Lieu :** `api/main.py:71`

```python
pool_pre_ping=False  # "Not needed for local PostgreSQL"
```

**Problème :** Après un restart Docker de PostgreSQL, les connexions existantes dans le pool sont mortes. Les requêtes échouent avec des erreurs cryptiques.

**Impact :** Erreurs intermittentes après restart DB.

**Fix :** `pool_pre_ping=True` (coût négligeable, gain énorme).

---

### 🟡 MEDIUM (This Sprint)

#### 12. Pas de validation config au démarrage

**Lieu :** `api/main.py`

**Problème :** Si `EMBEDDING_DIMENSION=abc` ou `DATABASE_URL` manquant, l'app crash avec un `ValueError` cryptique au lieu d'un message clair.

**Fix :** Valider toutes les variables d'environnement au démarrage avec des messages d'erreur clairs.

---

#### 13. Error details exposés

**Lieu :** Plusieurs routes

```python
raise HTTPException(status_code=500, detail=f"Failed: {str(e)}")
```

**Problème :** Les détails internes (stack traces, noms de tables, chemins) sont envoyés au client.

**Fix :** En production, retourner des messages génériques. Logger les détails côté serveur.

---

#### 14. Tests manquants

| Service | Lignes | Tests | Status |
|---------|--------|-------|--------|
| `hybrid_memory_search_service.py` | 752 | 0 | ❌ |
| `hybrid_code_search_service.py` | ~500 | 0 | ❌ |
| `cross_encoder_rerank_service.py` | ~200 | 0 | ❌ |
| `memory_decay_service.py` | ~100 | 0 | ❌ |
| `cascade_cache.py` | ~200 | 0 | ❌ |

**Fix :** Tests unitaires pour chaque service >100 lignes.

---

#### 15. Health check incomplet

**Lieu :** `api/routes/health_routes.py`

**Problème :** Seul le circuit breaker embedding est vérifié. Redis et DB circuits ne sont pas dans le health check critique.

**Fix :** Ajouter Redis et DB aux vérifications critiques.

---

#### 16. Logging conflict

**Lieu :** `api/db/repositories/event_repository.py:36`

```python
logging.basicConfig(level=INFO)  # Conflit avec structlog
```

**Fix :** Supprimer les `logging.basicConfig()` des repositories.

---

### 🔵 LOW (Next Sprint)

#### 17. Pas de lockfile
#### 18. Pas de vulnerability scanning
#### 19. Pas de log rotation app-level
#### 20. Alert thresholds hardcodés
#### 21. No OpenTelemetry distributed tracing
#### 22. Dual connection pools (asyncpg + SQLAlchemy)
#### 23. Cache key collision potential

---

## Matrice de Priorisation

| # | Issue | Risk | Effort | Impact |
|---|-------|------|--------|--------|
| 1 | Pas d'authentification | 🔴 Critique | 1-2j | Sécurité |
| 2 | SQL injection | 🔴 Critique | 0.5j | Sécurité |
| 3 | Credentials hardcodés | 🔴 Critique | 0.5j | Sécurité |
| 4 | Subprocess injection | 🔴 Critique | 0.5j | Sécurité |
| 5 | Pas de rate limiting | 🟠 High | 0.5j | Disponibilité |
| 6 | CORS ouvert | 🟠 High | 0.5j | Sécurité |
| 7 | Pas de timeout MCP | 🟠 High | 1j | Fiabilité |
| 8 | Circuit breaker partagé | 🟠 High | 0.5j | Résilience |
| 9 | Dependencies manquantes | 🟠 High | 0.5j | Déploiement |
| 10 | Cache non invalidé | 🟠 High | 1j | Cohérence |
| 11 | pool_pre_ping=False | 🟠 High | 5min | Fiabilité |
| 12 | Config validation | 🟡 Medium | 1j | UX |
| 13 | Error details exposés | 🟡 Medium | 0.5j | Sécurité |
| 14 | Tests manquants | 🟡 Medium | 3j | Confiance |
| 15 | Health check incomplet | 🟡 Medium | 0.5j | Observabilité |
| 16 | Logging conflict | 🟡 Medium | 0.5j | Observabilité |
| 17-23 | Divers (LOW) | 🔵 Low | 2j | Qualité |

---

## Plan d'Action Recommandé

### Phase 1 — Sécurité (2 jours)

1. **Ajouter auth middleware** (JWT ou API key)
2. **Fix SQL injection** — remplacer f-strings par params liés
3. **Déplacer credentials** dans env vars
4. **Sanitiser subprocess**
5. **Restreindre CORS**
6. **Fix pool_pre_ping=True** (5 min)

### Phase 2 — Fiabilité (2 jours)

7. **Ajouter rate limiting** (`slowapi`)
8. **Ajouter MCP timeouts** (wrapper asyncio)
9. **Séparer circuit breakers** (TEXT vs CODE)
10. **Ajouter cache invalidation** sur writes
11. **Fix dependencies** dans requirements.txt

### Phase 3 — Confiance (3 jours)

12. **Tests unitaires** pour services manquants
13. **Config validation** au démarrage
14. **Health check complet** (DB + Redis + Embedding)
15. **Error sanitization** (pas de str(e) au client)
16. **Logging cleanup**

---

## Ce qui est déjà bon — Ne pas casser

- Circuit breaker pattern ✅
- 3-tier cache cascade ✅
- Dual embedding service ✅
- structlog + trace IDs ✅
- Prometheus metrics ✅
- Graceful degradation ✅
- TDD culture ✅

---

## Résumé

> **Mnemolite est architecturalement solide mais manque les fondations de sécurité et de fiabilité.**
> 
> La priorité #1 est la sécurité (auth, SQL injection, credentials). Sans ça, le système est vulnérable à chaque requête.
> 
> La priorité #2 est la fiabilité (rate limiting, timeouts, cache consistency). Sans ça, un simple bug peut cascader en outage complet.
> 
> La priorité #3 est la confiance (tests, config validation, health checks). Sans ça, on ne peut pas garantir que les changements ne cassent rien.

---

*Document généré le 2026-03-26 — Audit de robustesse Mnemolite*
