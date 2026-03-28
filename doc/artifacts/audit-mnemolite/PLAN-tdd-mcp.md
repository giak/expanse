# Plan TDD MCP Mnemolite — Framework de Validation & Documentation Auto

> **Date :** 2026-03-28 23:34  
> **Objectif :** Framework de test MCP intégré à Docker qui prouve que le MCP fonctionne et génère la doc d'usage  
> **Problème résolu :** "Je ne veux plus bidouiller et demander sans arrêt de vérifier car des bugs apparaissent"

---

## 1. Le Problème

Le MCP de Mnemolite a cassé **8 fois** en 2 jours :
1. `inject_services` sans `(services)` → `NoneType` crash
2. `get_chunks()` n'existe pas → sync method
3. `iterative_scan='on'` → invalide pgvector 0.8.1
4. jina-v5-nano nécessite `peft` → module manquant
5. `tags: string` rejeté par FastMCP → Pydantic validation
6. `ProjectScanner(root_path=...)` → argument inattendu
7. `docker exec -i` ne forwarde pas stdin/stdout → EOF
8. Config MCP absente → IDE ne trouve pas le serveur

**Cause racine :** Pas de test automatisé du MCP. Chaque changement peut casser sans que personne ne s'en aperçoit avant un utilisateur le signale.

**Solution :** Un framework TDD qui :
- Teste le MCP après chaque `docker compose up`
- Génère un rapport prouvant que tout fonctionne
- Génère la doc d'usage automatiquement
- Bloque les déploiements si les tests cassent

---

## 2. Architecture

```
tests/mcp/
├── __init__.py
├── conftest.py              # Fixtures (client MCP, DB, setup/teardown)
├── test_mcp_protocol.py     # Protocole MCP (5 tests)
├── test_mcp_tools.py        # Tous les outils (15 tests)
├── test_expanse_boot.py     # Boot Expanse (5 tests)
├── test_mcp_security.py     # Sécurité (5 tests)
├── test_mcp_performance.py  # Performance (3 tests)
├── report_generator.py      # Génère REPORT.md
└── doctest_generator.py     # Génère USAGE.md (doc d'usage)
```

### Docker Integration

```yaml
# docker-compose.yml — service de test
mcp-test:
  build:
    context: .
    dockerfile: api/Dockerfile
  environment:
    MCP_URL: http://mcp:8002/mcp
    DATABASE_URL: postgresql+asyncpg://mnemo:mnemopass@db:5432/mnemolite
  depends_on:
    mcp:
      condition: service_healthy
    db:
      condition: service_healthy
  command: >
    python3 -u -m pytest tests/mcp/ -v --tb=short
    --junitxml=/app/reports/mcp-junit.xml
    -o "python_files=test_mcp_*.py"
  volumes:
    - ./reports:/app/reports
```

### Makefile Targets

```makefile
mcp-test:           # Lance les tests MCP (dans Docker)
mcp-report:         # Génère REPORT.md (rapport de validation)
mcp-doctest:        # Génère USAGE.md (doc d'usage auto)
mcp-full:           # test + report + doctest en une commande
```

---

## 3. Tests Détailés

### 3.1 test_mcp_protocol.py — Protocole MCP (5 tests)

| # | Test | Méthode | Assertions |
|---|------|---------|-----------|
| 1 | Initialize | POST /mcp | `serverInfo.name == "mnemolite"`, `protocolVersion == "2025-03-26"` |
| 2 | Session management | POST /mcp | `mcp-session-id` header présent |
| 3 | Tools/list | POST /mcp | 17 tools, chaque outil a `name`, `description`, `inputSchema` |
| 4 | Resources/list | POST /mcp | 12 resources |
| 5 | Prompts/list | POST /mcp | 6 prompts |

```python
class TestMCPProtocol:
    """Validate MCP protocol conformance."""

    def test_initialize(self, mcp_client):
        resp = mcp_client.send("initialize", {...})
        assert resp["result"]["serverInfo"]["name"] == "mnemolite"
        assert resp["result"]["protocolVersion"] == "2025-03-26"

    def test_tools_list(self, mcp_client):
        resp = mcp_client.send("tools/list")
        tools = resp["result"]["tools"]
        names = {t["name"] for t in tools}
        expected = {"ping", "search_memory", "write_memory", "read_memory",
                    "update_memory", "delete_memory", "get_system_snapshot",
                    "mark_consumed", "consolidate_memory", "search_code",
                    "configure_decay", "index_project", "index_incremental",
                    "index_markdown_workspace", "reindex_file",
                    "clear_cache", "switch_project"}
        assert expected.issubset(names)
```

### 3.2 test_mcp_tools.py — Outils MCP (15 tests)

| # | Test | Appel | Assertions |
|---|------|-------|-----------|
| 1 | ping | `{}` | `message == "pong"` |
| 2 | get_system_snapshot | `{repository: "expanse"}` | `health` présent, `core` non vide |
| 3 | search_memory (string tags) | `{tags: "sys:core"}` | Résultats retournés (tolérance) |
| 4 | search_memory (list tags) | `{tags: ["sys:core"]}` | Résultats retournés |
| 5 | search_memory (consumed=false) | `{consumed: false}` | `memories` dans la réponse |
| 6 | search_memory (lifecycle=sealed) | `{lifecycle_state: "sealed"}` | Pas de `:candidate` dans les résultats |
| 7 | write_memory | `{title: "TEST:tdd", ...}` | `id` présent, `embedding_generated` bool |
| 8 | read_memory | `{id: <from test 7>}` | `title == "TEST:tdd"` |
| 9 | update_memory | `{id: <from test 7>, tags: ["test"]}` | `tags` mis à jour |
| 10 | delete_memory | `{id: <from test 7>}` | `success: true` |
| 11 | search_code | `{query: "circuit", filters: {repository: "expanse"}}` | `results` présent |
| 12 | configure_decay | `{tag_pattern: "sys:test", decay_rate: 0.01}` | `tag_pattern` match |
| 13 | mark_consumed | `{memory_ids: [...], consumed_by: "test"}` | `marked >= 1` |
| 14 | consolidate_memory | `{title: "TEST", summary: "...", source_ids: [...]}` | `consolidated_memory.id` |
| 15 | index_markdown_workspace | `{root_path: "/app", repository: "test"}` | `indexed >= 0` (pas de crash) |

```python
class TestMCPTools:
    """Validate all MCP tools with real arguments."""

    def test_ping(self, mcp_client):
        resp = mcp_client.tool("ping", {})
        assert resp["message"] == "pong"

    def test_search_memory_string_tags(self, mcp_client):
        """Tags as string must work (tolerant to agent errors)."""
        resp = mcp_client.tool("search_memory", {
            "query": "V14 core", "tags": "sys:core", "limit": 3
        })
        assert "memories" in resp

    def test_write_read_update_delete(self, mcp_client):
        """Full CRUD cycle."""
        # Write
        w = mcp_client.tool("write_memory", {
            "title": "TEST:tdd_crud", "content": "test",
            "tags": ["test", "v15"], "memory_type": "note"
        })
        test_id = w["id"]

        # Read
        r = mcp_client.tool("read_memory", {"id": test_id})
        assert r["title"] == "TEST:tdd_crud"

        # Update
        u = mcp_client.tool("update_memory", {"id": test_id, "tags": ["test", "updated"]})
        assert "updated" in u["tags"]

        # Delete
        d = mcp_client.tool("delete_memory", {"id": test_id})
        assert d["success"] is True
```

### 3.3 test_expanse_boot.py — Boot Expanse (5 tests)

| # | Test | Scénario | Assertions |
|---|------|----------|-----------|
| 1 | Snapshot complet | `get_system_snapshot(repository="expanse")` | core≥1, health complet |
| 2 | Patterns scellés | `search_memory(tags=["sys:pattern"], lifecycle="sealed")` | Pas de `:candidate` |
| 3 | Health check | `snapshot["health"]` | `history_count`, `fresh_traces`, `needs_consolidation` présents |
| 4 | STALL detection | Vérifier `fresh_traces > 5 → STALL` | Logic correcte |
| 5 | Briefing data | Toutes les données nécessaires au briefing | core, profile, project, health |

```python
class TestExpanseBoot:
    """Validate Expanse boot flow via MCP."""

    def test_snapshot_completeness(self, mcp_client):
        resp = mcp_client.tool("get_system_snapshot", {"repository": "expanse"})
        assert len(resp["core"]) >= 1, "Must have at least 1 core memory"
        assert resp["health"]["history_count"] >= 0
        assert resp["health"]["fresh_traces"] >= 0
        assert isinstance(resp["health"]["needs_consolidation"], bool)

    def test_stall_detection(self, mcp_client):
        """Verify STALL condition per Expanse Apex §IV."""
        resp = mcp_client.tool("get_system_snapshot", {"repository": "expanse"})
        health = resp["health"]
        is_stall = health["fresh_drifts"] > 5 or health["fresh_traces"] > 5
        # Just verify the data is present for the agent to decide
        assert "fresh_drifts" in health
        assert "fresh_traces" in health
```

### 3.4 test_mcp_security.py — Sécurité (5 tests)

| # | Test | Input | Assertions |
|---|------|-------|-----------|
| 1 | SQL injection (search) | `"query": "'; DROP TABLE memories; --"` | Pas de crash, pas de data leak |
| 2 | SQL injection (UUID) | `"id": "'; DROP TABLE memories; --"` | UUID validation reject |
| 3 | Tags injection | `"tags": ["'; DELETE FROM memories --"]` | Pas de crash |
| 4 | Empty query | `"query": ""` | Géré proprement (pas de crash) |
| 5 | Oversized input | `"query": "A" * 100000` | Géré proprement |

```python
class TestMCPSecurity:
    """Validate security of MCP tools."""

    def test_sql_injection_search(self, mcp_client):
        resp = mcp_client.tool("search_memory", {
            "query": "'; DROP TABLE memories; --", "limit": 1
        })
        # Should return empty results, not crash
        assert "memories" in resp

    def test_sql_injection_uuid(self, mcp_client):
        resp = mcp_client.tool("read_memory", {
            "id": "'; DROP TABLE memories; --"
        })
        # Should return error, not crash
        assert resp is not None  # No crash
```

### 3.5 test_mcp_performance.py — Performance (3 tests)

| # | Test | Métrique | Seuil |
|---|------|----------|-------|
| 1 | ping latency | Temps de réponse | < 1s |
| 2 | snapshot latency | Temps de réponse | < 5s |
| 3 | search latency | Temps de réponse | < 30s (avec embedding) |

```python
class TestMCPPerformance:
    """Validate MCP performance baselines."""

    def test_ping_latency(self, mcp_client):
        t0 = time.time()
        mcp_client.tool("ping", {})
        elapsed = time.time() - t0
        assert elapsed < 1.0, f"ping took {elapsed:.1f}s (expected < 1s)"

    def test_snapshot_latency(self, mcp_client):
        t0 = time.time()
        mcp_client.tool("get_system_snapshot", {"repository": "expanse"})
        elapsed = time.time() - t0
        assert elapsed < 5.0, f"snapshot took {elapsed:.1f}s (expected < 5s)"
```

---

## 4. Génération de Rapport

### 4.1 report_generator.py

```python
class MCPReportGenerator:
    """Generate markdown validation report from test results."""

    def generate(self, results: List[TestResult]) -> str:
        """
        Generates REPORT.md with:
        - Score global (A-F)
        - Tableau des tests par catégorie
        - Temps de réponse
        - Erreurs détaillées
        - Recommandations
        """

    def _compute_score(self, results) -> ScoreCard:
        """Compute A-F grade from test results."""
        passed = sum(1 for r in results if r.passed)
        total = len(results)
        pct = passed / total * 100
        grade = "A" if pct >= 90 else "B" if pct >= 75 else "C" if pct >= 60 else "D" if pct >= 45 else "F"
        return ScoreCard(grade=grade, percentage=pct, passed=passed, total=total)
```

### 4.2 Rapport Exemple (REPORT.md)

```markdown
# MCP Mnemolite — Rapport de Validation
Date: 2026-03-28 23:45 | Serveur: http://mcp:8002/mcp
Score: A (96%) — 32/33 passed

## Protocole (5/5 ✅)
  ✅ initialize (0.0s) → mnemolite v1.12.3
  ✅ session management → mcp-session-id present
  ✅ tools/list → 17 tools
  ✅ resources/list → 12 resources
  ✅ prompts/list → 6 prompts

## Outils (15/15 ✅)
  ✅ ping (0.0s) → pong
  ✅ get_system_snapshot (0.2s) → core=13, traces=16
  ✅ search_memory string tags (1.8s) → 2 results
  ✅ search_memory list tags (1.7s) → 2 results
  ✅ search_memory consumed=false (1.9s) → OK
  ✅ search_memory lifecycle=sealed (1.7s) → OK
  ✅ write_memory (0.1s) → id=755c9ac8..., emb=true
  ✅ read_memory (0.0s) → title=TEST:tdd_crud
  ✅ update_memory (0.0s) → tags=[test, updated]
  ✅ delete_memory (0.0s) → success=true
  ✅ search_code (0.1s) → vector=true
  ✅ configure_decay (0.0s) → rate=0.01
  ✅ mark_consumed (0.0s) → marked=1
  ✅ consolidate_memory (0.1s) → consolidated
  ✅ index_markdown_workspace (0.0s) → no crash

## Expanse Boot (5/5 ✅)
  ✅ Snapshot completeness → core=13, health OK
  ✅ Patterns sealed → no candidates
  ✅ Health check → all fields present
  ✅ STALL detection → data present
  ✅ Briefing data → core+profile+project+health

## Sécurité (4/5 ⚠️)
  ✅ SQL injection search → empty results
  ✅ SQL injection UUID → error, no crash
  ✅ Tags injection → handled
  ❌ Empty query → error (expected)
  ✅ Oversized input → handled

## Performance (3/3 ✅)
  ✅ ping: 0.0s (< 1s)
  ✅ snapshot: 0.2s (< 5s)
  ✅ search: 1.8s (< 30s)

## Résumé
  Score: A (96%)
  Passed: 32/33
  Failed: 1 (empty query — non-critical)
  Avg latency: 0.3s
  Uptime: healthy
```

---

## 5. Génération de Documentation (USAGE.md)

### 5.1 doctest_generator.py

```python
class MCPDocGenerator:
    """Generate usage documentation from test cases."""

    def generate(self, test_results, tool_schemas) -> str:
        """
        Generates USAGE.md with:
        - Pour chaque outil : description, arguments, exemple, résultat
        - Exemples de code (curl, Python)
        - Erreurs courantes et solutions
        - Flow complet (boot, search, CRUD)
        """

    def _extract_example_from_test(self, test: TestResult) -> str:
        """Extract curl/python example from test arguments."""
```

### 5.2 Documentation Exemple (USAGE.md)

```markdown
# MCP Mnemolite — Guide d'Utilisation

## Connexion
  URL: http://localhost:8002/mcp
  Transport: Streamable HTTP
  Protocol: MCP 2025-03-26
  Config IDE: {"type": "streamable-http", "url": "http://localhost:8002/mcp"}

## ping
  Description: Health check
  Args: (aucun)
  Exemple: mcp_mnemolite_ping()
  Résultat: {"success": true, "message": "pong"}
  Latence: 0.0s

## get_system_snapshot
  Description: Get system context + health in one call
  Args: repository (str, default="expanse")
  Exemple: mcp_mnemolite_get_system_snapshot(repository="expanse")
  Résultat: {core: [...], patterns: [...], health: {fresh_traces: 16, ...}}
  Latence: 0.2s

## search_memory
  Description: Semantic search on memories with filters
  Args:
    query (str) — search text
    tags (str | list) — filter by tags (accepts string OR list!)
    consumed (bool) — filter by consumption (None=all, False=fresh, True=consumed)
    lifecycle_state (str) — filter by state (sealed/candidate/doubt/summary)
    limit (int, default=10) — max results
  Exemple:
    search_memory(query="circuit breaker", tags=["sys:pattern"], lifecycle_state="sealed", limit=3)
    search_memory(query="friction", tags="trace:fresh", consumed=False, limit=20)
  Résultat: {memories: [{id, title, tags, memory_type, ...}], total: N}
  Latence: 1.7s (premier appel), 0.3s (suivants)

## write_memory
  Description: Create a new memory with auto-embedding
  Args: title (str), content (str), tags (list), memory_type (str)
  Exemple:
    write_memory(title="PATTERN: test", content="...", tags=["sys:pattern:candidate"], memory_type="reference")
  Résultat: {id: "uuid", title: "...", embedding_generated: true}

## mark_consumed
  Description: Mark memories as consumed (idempotent)
  Args: memory_ids (list), consumed_by (str)
  Exemple:
    mark_consumed(memory_ids=["uuid1", "uuid2"], consumed_by="dream_passe1")
  Résultat: {marked: 2, already_consumed: 0}

## consolidate_memory
  Description: Merge old memories into summary
  Args: title (str), summary (str), source_ids (list), tags (list)
  Exemple:
    consolidate_memory(title="History: March 20-26", summary="...", source_ids=[...], tags=["sys:history"])
  Résultat: {consolidated_memory: {id, title, tags}, deleted_count: 10}

## Erreurs Courantes
  ❌ "tags must be a list" → Utiliser tags=["sys:history"] ou tags="sys:history" (tolérant)
  ❌ "Invalid UUID" → L'ID doit être un UUID valide, pas un texte
  ❌ "embedding circuit breaker open" → Le modèle se charge, attendre 60s
  ❌ "timeout" → Premier appel lent (modèle), suivant rapide

## Flow Complet Expanse Boot
  1. get_system_snapshot(repository="expanse")
  2. Vérifier health.fresh_traces > 5 → STALL
  3. search_memory(tags=["sys:pattern"], lifecycle_state="sealed")
  4. Générer briefing avec les données
```

---

## 6. Intégration Docker

### 6.1 docker-compose.yml

```yaml
  # Service de test MCP — lance les tests après démarrage des services
  mcp-test:
    build:
      context: .
      dockerfile: api/Dockerfile
    container_name: mnemo-mcp-test
    environment:
      MCP_URL: http://mcp:8002/mcp
      DATABASE_URL: postgresql+asyncpg://mnemo:mnemopass@db:5432/mnemolite
    depends_on:
      mcp:
        condition: service_healthy
      db:
        condition: service_healthy
    networks:
      - backend
    volumes:
      - ./tests/mcp:/app/tests/mcp:ro
      - ./reports:/app/reports
    command: >
      python3 -u -m pytest tests/mcp/ -v
      --tb=short
      --junitxml=/app/reports/mcp-junit.xml
      2>&1 | tee /app/reports/mcp-output.txt
    profiles:
      - test  # Only runs with: docker compose --profile test up
    logging: *default-logging
```

### 6.2 Makefile

```makefile
# MCP Tests
mcp-test:
	docker compose --profile test run --rm mcp-test

mcp-report:
	docker exec mnemo-mcp python3 -u tests/mcp/report_generator.py > reports/REPORT.md
	@echo "Report: reports/REPORT.md"

mcp-doctest:
	docker exec mnemo-mcp python3 -u tests/mcp/doctest_generator.py > reports/USAGE.md
	@echo "Usage doc: reports/USAGE.md"

mcp-full: mcp-test mcp-report mcp-doctest
	@echo "Full MCP validation complete. Reports: reports/"
```

### 6.3 CI Integration (optionnel)

```yaml
# .github/workflows/mcp-test.yml
name: MCP Validation
on: [push, pull_request]
jobs:
  mcp-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker compose up -d db redis mcp
      - run: sleep 30 && docker compose --profile test run --rm mcp-test
      - uses: actions/upload-artifact@v4
        with:
          name: mcp-reports
          path: reports/
```

---

## 7. Implémentation — Tâches

| # | Fichier | Lignes | Contenu | Effort |
|---|---------|--------|---------|--------|
| 1 | `tests/mcp/__init__.py` | 5 | Package init | 2min |
| 2 | `tests/mcp/conftest.py` | 80 | Fixtures: MCPClient, session, setup/teardown | 1h |
| 3 | `tests/mcp/test_mcp_protocol.py` | 60 | 5 tests protocole | 30min |
| 4 | `tests/mcp/test_mcp_tools.py` | 200 | 15 tests outils | 2h |
| 5 | `tests/mcp/test_expanse_boot.py` | 80 | 5 tests boot | 1h |
| 6 | `tests/mcp/test_mcp_security.py` | 60 | 5 tests sécurité | 30min |
| 7 | `tests/mcp/test_mcp_performance.py` | 40 | 3 tests performance | 30min |
| 8 | `tests/mcp/report_generator.py` | 120 | Génère REPORT.md | 1h |
| 9 | `tests/mcp/doctest_generator.py` | 150 | Génère USAGE.md | 1h |
| 10 | `docker-compose.yml` | 20 | Service mcp-test | 15min |
| 11 | `Makefile` | 10 | Targets mcp-* | 15min |
| | **TOTAL** | **~830** | **33 tests + 2 générateurs + infra** | **~8h** |

---

## 8. Ordre d'Implémentation

```
Phase 1 — Core (2h)
  1. conftest.py — MCPClient fixture (le plus critique)
  2. test_mcp_protocol.py — 5 tests
  3. test_mcp_tools.py — 5 tests outils (ping, snapshot, search, write, delete)

Phase 2 — Couverture (2h)
  4. test_mcp_tools.py — 10 tests restants
  5. test_expanse_boot.py — 5 tests
  6. test_mcp_security.py — 5 tests

Phase 3 — Rapport & Doc (2h)
  7. report_generator.py — Génère REPORT.md
  8. doctest_generator.py — Génère USAGE.md

Phase 4 — Intégration Docker (1h)
  9. docker-compose.yml — Service mcp-test
  10. Makefile — Targets mcp-test, mcp-report, mcp-doctest
  11. test_mcp_performance.py — 3 tests latence

Phase 5 — Validation (1h)
  12. Lancer mcp-full et vérifier les rapports
  13. Vérifier que les 33 tests passent
  14. Vérifier que REPORT.md est correct
  15. Vérifier que USAGE.md est complet
```

---

## 9. Résultat Attendu

Après `make mcp-full` :

```
tests/mcp/REPORT.md  — Rapport de validation (A-F score)
tests/mcp/USAGE.md   — Doc d'usage auto-générée
reports/mcp-junit.xml — Résultats JUnit (pour CI)
reports/mcp-output.txt — Sortie console complète

33 tests: 32 passed, 1 failed (non-critical)
Score: A (96%)
```

L'utilisateur peut désormais :
1. Lancer `make mcp-test` → savoir si le MCP fonctionne
2. Lire `REPORT.md` → voir exactement ce qui passe et ce qui échoue
3. Lire `USAGE.md` → savoir comment utiliser chaque outil
4. Intégrer dans CI → empêcher les régressions

---

*"Un test qui n'est pas automatisé est un test qui n'existe pas."*

---

*Document généré le 2026-03-28 23:34*
