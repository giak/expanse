# Analyse Cognitive — 5 Améliorations Mnemolite pour Expanse

> **Protocole :** Ω raisonnement · Ξ diagnostic · Φ patterns · Λ contexte · M mémoire · Ψ métacognition  
> **Schema :** 1.6-SNR-AntifragilePlus  
> **Date :** 2026-03-27 23:00

---

## AMÉLIORATION 1 : System Snapshot (Boot en 1 Query)

---

### ⚡ 0. Λ Contexte & Contraintes

- **Objectif :** Remplacer les 4 queries séquentielles du boot Expanse par 1 requête SQL qui retourne le contexte système complet + métriques de santé.
- **Artefact :** Nouveau MCP tool `get_system_snapshot()` + SQL optimisé.
- **Environnement :** PostgreSQL 18, pgvector 0.8.1, Mnemolite API, Expanse Apex §IV.
- **Contraintes :** Non-régression (boot actuel doit continuer à fonctionner), perf (<100ms), pas de changement de schéma DB.
- `complexity_budget = 80`
- `require_tests = true`
- `output_format = markdown`

### ⚡ 0.a Estimation de Charge Cognitive (ECS)

**Niveau :** Moyenne.
**ECS : 4/5.**
- Profondeur : requête SQL complexe avec sous-requêtes agrégées, mais pattern connu.
- Continuité logique : chaque sous-requête est indépendante, pas de dépendance circulaire.
- Densité : une requête remplace 4 + ajoute 3 counts de santé = 7 informations en 1 appel.
- Risque : performance de la requête avec 34K+ memories.

### ⚡ 0.b Clarifying Gate

- `<!--needs_clarification-->` : Non. Les besoins sont clairs (boot, counts, budget).

---

### ⚡ 1. Génération d'approches

**Approche A : Sous-requêtes SQL parallèles (CTE)**
- Hypothèse : PostgreSQL optimise les CTE indépendantes en parallèle.
- Robustesse : haute. Pattern standard SQL, pas de dépendance applicative.

**Approche B : Vues matérialisées PostgreSQL**
- Hypothèse : Pré-calculer les snapshots dans une vue matérialisée refreshée périodiquement.
- Robustesse : moyenne. Ajoute de la latence de refresh, staleness possible.

**Approche C : Application-side parallel fetch**
- Hypothèse : Faire 4 requêtes en parallèle côté Python (asyncio.gather).
- Robustesse : moyenne. Plus de code applicatif, mais pas de SQL complexe.

---

### ⚡ 2. Boucle critique par approche

#### Approche A : CTE

**a. Ω Analyse critique :**
- Forces : 1 round-trip DB, SQL standard, pas de staleness.
- Faiblesses : Requête SQL longue (~50 lignes), difficile à maintenir si les groupes de tags changent.
- Risques : Performance avec 34K memories — mais les sous-requêtes sont limitées (LIMIT 20/10/5) et indexées.

**b. Ξ Non-régression :**
- Le boot actuel fait 4× `search_memory()`. Le nouveau tool retourne un superset de ces données. L'Apex peut utiliser l'un ou l'autre. Pas de breaking change.

**c. Φ/Ξ Effondrement Gate :** ECS stable à 4. Pas d'échec.

**d. Simplicity Gate :**
- LOC: ~60 (SQL) + ~40 (Python wrapper) = ~100
- Cyclomatic: 1 (une seule fonction)
- Deps: 0 (utilise le même engine)
- Score: 100 + 2 + 0 = 102 < 80 × 1.15 = 92 → dépasse légèrement

**KISS simplification :** Utiliser des requêtes séparées mais parallélisées (approche A+C hybride) au lieu d'une CTE monolithique.

**e. Pair-Opposition Audit :**
- Suppression : "Pourquoi pas 4 requêtes parallèles ? Plus simple."
- Justification : "4 round-trips vs 1. Avec latence réseau Docker (~2ms), la différence est négligeable. 4 requêtes parallèles sont plus lisibles."

**→ Approche A+C hybride gagne.**

**f. Two-Sentence Summary :**
Faire 4 requêtes SQL parallèles (asyncio.gather) au lieu d'une CTE monolithique. Plus lisible, même perf, pas de risque de plan d'exécution sous-optimal.

**g. Améliorations ciblées :**
1. Utiliser des requêtes paramétrées (`:tag`) au lieu de f-strings SQL.
2. Ajouter un timeout sur chaque sous-requête (5s max).

**h. Journal M :**
- ECS final : 4/5 (stable)
- Point d'instabilité : complexité SQL de l'approche CTE → résolu par hybride
- Correction : 4 requêtes parallèles au lieu d'une CTE

**i. Compression (5 points) :**
1. 4 requêtes parallèles (asyncio.gather) au lieu de séquentielles
2. Ajout de 3 counts de santé (drifts, traces, candidates)
3. Ajout de context_budget tracking
4. Pas de changement de schéma DB
5. Tool MCP `get_system_snapshot()` avec retour JSON structuré

#### Approche B : Vues matérialisées — ABANDONNÉE
- Staleness inacceptable pour Expanse (boot = état instantané).
- Ajoute complexité opérationnelle (refresh, monitoring).

#### Approche C : Application-side parallel — SUBSUMED
- L'approche A+C hybride capture les avantages de C.

---

### ⚡ 3. Comparaison finale

| Approche | Simplicité | Performance | Robustesse | Maintenabilité | Innovation | Non-Régression | ECS |
|----------|------------|-------------|-------------|------------------|------------|------------------|-----|
| A (CTE) | 6/10 | 9/10 | 8/10 | 5/10 | 7/10 | 9/10 | 4 |
| **A+C hybride** | **8/10** | **9/10** | **9/10** | **8/10** | **6/10** | **9/10** | **4** |
| B (vues mat.) | 4/10 | 10/10 | 6/10 | 4/10 | 8/10 | 7/10 | 3 |
| C (parallel) | 9/10 | 8/10 | 9/10 | 9/10 | 5/10 | 9/10 | 4 |

**Vainqueur : A+C hybride** (4 requêtes parallèles).

---

### ⚡ 4. Synthèse / Fusion

**FinalSolution :** Nouveau MCP tool `get_system_snapshot(repository, context_budget)` :
- 4 requêtes SQL parallèles via `asyncio.gather`
- Retourne core, patterns, extensions, profile, project + health metrics
- Budget context tracking (tokens used/remaining)
- Pas de changement de schéma DB
- Backward compatible (boot actuel continue à fonctionner)

### ⚡ 4.b Proof by Test

```python
# test_system_snapshot.py
async def test_snapshot_returns_all_groups(snapshot_tool):
    result = await snapshot_tool.execute(ctx=None, repository="expanse")
    assert "core" in result
    assert "patterns" in result
    assert "health" in result
    assert result["health"]["history_count"] >= 0

async def test_snapshot_fast(snapshot_tool):
    start = time.time()
    await snapshot_tool.execute(ctx=None, repository="expanse")
    assert (time.time() - start) < 0.1  # < 100ms

async def test_snapshot_no_crash_on_empty_db(snapshot_tool):
    result = await snapshot_tool.execute(ctx=None, repository="nonexistent")
    assert result["health"]["total_memories"] == 0
```

### ⚡ 4.c Refactor-to-Core (80/20)
- 80% de la valeur : les 4 requêtes parallèles + health counts
- 20% de la valeur : budget tracking, groupes additionnels (peut être ajouté après)

### ⚡ 4.d Checklist YAGNI
- ✅ Besoin réel : oui (boot Expanse 4× plus rapide)
- ✅ Pas de sur-ingénierie : 4 requêtes parallèles, pas de framework
- ✅ Testable : oui (unit + integration)
- ✅ Réversible : oui (boot actuel inchangé)

---

### ⚡ 5. Audit Qualité

- **Diff fonctionnel :** +1 MCP tool, +1 fonction SQL, 0 changement schéma
- **Diff perf :** boot 260ms → ~65ms (4× plus rapide)
- **Diff API :** +1 tool (non-breaking)
- **Diff sécurité :** aucun (pas de nouveau input utilisateur)
- **Ψ Test robustesse :** "Si les 4 requêtes échouent partiellement ?" → chaque requête a son try/except, les groupes vides retournent `[]`.

---

### ⚡ 6. Dernier levier d'optimisation (Ψ)

Cache le snapshot en Redis avec TTL 30s. Le boot de 2 sessions consécutives dans les 30s retourne le cache instantanément. Impact : ~1ms au lieu de ~65ms.

---

### ⚡ 7. Recommandation

**Note : 8.5/10.** Simple, performant, non-breaking. À implémenter en priorité #2 (après Consumption Tracking).

---

---

## AMÉLIORATION 2 : Consumption Tracking

---

### ⚡ 0. Λ Contexte & Contraintes

- **Objectif :** Ajouter `consumed_at` + `consumed_by` sur les mémoires pour permettre au Dream de marquer les mémoires comme traitées.
- **Artefact :** Migration SQL + MCP tool `mark_consumed()` + filtres sur `search_memory`.
- **Environnement :** Table `memories`, 34,531 rows, index existants.
- **Contraintes :** Migration non-destructive (ALTER TABLE), backward compatible (NULL = non consommé).
- `complexity_budget = 60`
- `require_tests = true`

### ⚡ 0.a ECS

**Niveau :** Faible-Moyenne.
**ECS : 4/5.**
- Pattern simple (ajout de colonnes + filtre WHERE), mais impact large (toutes les queries mémoire).
- Continuité : chaque étape est indépendante (migration → tool → filtres).

### ⚡ 0.b Clarifying Gate

- `<!--needs_clarification-->` : Non.

---

### ⚡ 1. Génération d'approches

**Approche A : Colonnes sur la table `memories`**
- Hypothèse : `consumed_at TIMESTAMPTZ NULL` + `consumed_by VARCHAR(100) NULL`.
- Robustesse : haute. NULL = non consommé (semantique naturelle).

**Approche B : Table séparée `memory_consumptions`**
- Hypothèse : Table de jointure (memory_id, consumed_at, consumed_by).
- Robustesse : moyenne. Permet multiple consumptions mais complexifie les queries.

**Approche C : Tag-based (ajouter tag `sys:consumed:dream_passe1`)**
- Hypothèse : Utiliser le système de tags existant au lieu de colonnes.
- Robustesse : faible. Pollue les tags, rend les queries plus complexes.

---

### ⚡ 2. Boucle critique

#### Approche A : Colonnes

**a. Ω Analyse :**
- Forces : Simple, performant (index B-tree), query naturelle (`WHERE consumed_at IS NULL`).
- Faiblesses : 1 seule consommation par mémoire (pas de multi-consumption).
- Risques : Aucun pour Expanse (chaque mémoire est consommée une seule fois par Dream).

**b. Ξ Non-régression :**
- `consumed_at IS NULL` est la valeur par défaut. Toutes les queries existantes continuent à retourner les mêmes résultats (tout est "non consommé" initialement).
- Les filtres `consumed_at=NULL` sont opt-in dans `search_memory`.

**c. Effondrement Gate :** ECS stable à 4.

**d. Simplicity Gate :**
- LOC: 15 (migration) + 30 (tool) + 10 (filtres) = 55
- Cyclomatic: 1
- Deps: 0
- Score: 57 < 60 → OK

**e. Pair-Opposition :**
- Suppression : "Pourquoi pas des tags ?"
- Justification : "Les tags sont pour la catégorisation sémantique. consumed_at est un état transactionnel. Séparer les responsabilités."

**f. Two-Sentence Summary :**
Ajouter 2 colonnes (consumed_at, consumed_by) sur memories. Un MCP tool `mark_consumed()` les met à jour. Les queries filtrent avec `consumed_at IS NULL` pour les mémoires fraîches.

**g. Améliorations ciblées :**
1. Index partial sur `consumed_at IS NULL` (seulement les non-consommés).
2. `mark_consumed` est idempotent (UPDATE WHERE consumed_at IS NULL).

**h. Journal M :**
- ECS : 4/5
- Instabilité : aucune
- Gain : Dream ne relit plus tout, économise tokens + temps

**i. Compression :**
1. 2 colonnes (consumed_at, consumed_by)
2. Index partial (WHERE consumed_at IS NULL)
3. Tool mark_consumed (idempotent)
4. Filtre opt-in dans search_memory
5. 0 breaking change

---

### ⚡ 3. Comparaison

| Approche | Simplicité | Performance | Robustesse | Maintenabilité | Non-Régression | ECS |
|----------|------------|-------------|-------------|------------------|------------------|-----|
| **A (colonnes)** | **9/10** | **9/10** | **9/10** | **9/10** | **10/10** | **4** |
| B (table jointure) | 5/10 | 7/10 | 8/10 | 6/10 | 8/10 | 3 |
| C (tags) | 7/10 | 6/10 | 5/10 | 5/10 | 7/10 | 3 |

**Vainqueur : A (colonnes).**

---

### ⚡ 4. Synthèse

**FinalSolution :**
```sql
ALTER TABLE memories ADD COLUMN consumed_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE memories ADD COLUMN consumed_by VARCHAR(100) DEFAULT NULL;
CREATE INDEX idx_memories_fresh ON memories(consumed_at) WHERE consumed_at IS NULL;
```

```python
@tool()
async def mark_consumed(memory_ids: List[str], consumed_by: str) -> dict:
    # UPDATE memories SET consumed_at=NOW(), consumed_by=:by
    # WHERE id=ANY(:ids) AND consumed_at IS NULL
    # Returns: {marked: N, already_consumed: M}
```

### ⚡ 4.b Tests

```python
async def test_mark_consumed_idempotent():
    mark_consumed(["uuid1"], "dream")
    mark_consumed(["uuid1"], "dream")  # déjà consommé
    # Le 2ème appel ne fait rien (déjà consumed_at != NULL)

async def test_search_excludes_consumed():
    mark_consumed(["uuid1"], "dream")
    results = search_memory(tags=["sys:drift"], consumed_at=NULL)
    assert "uuid1" not in [r.id for r in results]
```

### ⚡ 4.d Checklist YAGNI
- ✅ Besoin réel : oui (Dream inefficace sans ça)
- ✅ Simple : 2 colonnes + 1 tool
- ✅ Testable : oui
- ✅ Réversible : `ALTER TABLE DROP COLUMN`

---

### ⚡ 5. Audit Qualité

- **Diff fonctionnel :** +2 colonnes, +1 tool, +1 filtre search_memory
- **Diff perf :** index partial → query `WHERE consumed_at IS NULL` en O(1)
- **Ψ Test robustesse :** "Si Dream crash après mark_consumed ?" → les mémoires restent marquées, pas de perte. Idempotent = safe.

---

### ⚡ 6. Dernier levier

Le `consumed_by` peut contenir `"dream_passe1"`, `"dream_passe2"`, `"boot"`, etc. Permet de tracer exactement qui a consommé quoi. Le Dream peut vérifier : "ai-je traité les traces de la passe 1 ?"

---

### ⚡ 7. Recommandation

**Note : 9/10.** Le plus impactant des 5 améliorations pour Expanse. Effort minimal (0.5j). À faire en premier.

---

---

## AMÉLIORATION 3 : Tag-Based Decay & Auto-Consolidation

---

### ⚡ 0. Λ Contexte & Contraintes

- **Objectif :** Remplacer les presets hardcodés de decay par une config par tag. Ajouter auto-consolidation quand seuil atteint.
- **Artefact :** Nouvelle table `memory_decay_config` + MCP tool `configure_decay()` + auto-consolidation dans le boot.
- **Environnement :** `MemoryDecayService` existant avec `DECAY_PRESETS` hardcodés.
- **Contraintes :** Backward compatible (si pas de config, utilise presets). Auto-consolidation non-bloquante.
- `complexity_budget = 100`
- `require_tests = true`

### ⚡ 0.a ECS

**Niveau :** Moyenne-Élevée.
**ECS : 4/5.**
- Nouvelle table + CRUD + intégration avec decay service + auto-consolidation = plusieurs composants.
- Mais chaque composant est simple individuellement.

### ⚡ 0.b Clarifying Gate

- `<!--needs_clarification-->` : L'auto-consolidation doit-elle être synchrone (dans le boot) ou asynchrone (cron) ? → **Asynchrone** (dans le boot, après le snapshot, non-bloquante).

---

### ⚡ 1. Génération d'approches

**Approche A : Table de config PostgreSQL**
- Hypothèse : `memory_decay_config(tag_pattern, decay_rate, auto_consolidate_threshold)`.
- Robustesse : haute. Persistance, requêtable, gérable.

**Approche B : Fichier YAML de config**
- Hypothèse : `decay_config.yaml` lu au démarrage.
- Robustesse : moyenne. Pas de persistance DB, reload nécessaire.

**Approche C : Enrichir DECAY_PRESETS avec consolidation**
- Hypothèse : Ajouter `auto_consolidate_threshold` au dict existant.
- Robustesse : faible. Hardcodé, pas configurable à runtime.

---

### ⚡ 2. Boucle critique

#### Approche A

**a. Ω :** Forces : configurable à runtime, persistant, requêtable. Faiblesses : nouvelle table à maintenir.

**b. Ξ :** Non-régression : `DECAY_PRESETS` reste comme fallback. Si la table est vide, les presets s'appliquent.

**c. ECS : 4/5** (stable).

**d. Simplicity Gate :** LOC: 40 (migration) + 30 (tool) + 20 (intégration decay) + 50 (auto-consolidation) = 140. Score: 146 > 115 → dépasse.

**KISS :** Simplifier l'auto-consolidation : pas de service dédié, juste un check dans le boot qui appelle `consolidate_memory` si seuil atteint.

**e. Pair-Opposition :**
- Suppression : "Pourquoi pas juste les presets ?"
- Justification : "Expanse a des règles spécifiques (sys:history=20, sys:drift=none). Les presets ne couvrent pas tous les cas."

**f. Two-Sentence Summary :**
Table `memory_decay_config` avec 7 presets Expanse. Le decay service lit la config au lieu des presets hardcodés. Auto-consolidation dans le boot si seuil atteint.

**g. Améliorations :**
1. Lire la config avec cache (TTL 60s) pour éviter des requêtes DB à chaque search.
2. `configure_decay()` est idempotent (UPSERT).

**h. Journal M :** ECS 4/5. Instabilité : auto-consolidation synchrone → changé en check-only (non-bloquant).

**i. Compression :**
1. Table `memory_decay_config` (7 presets Expanse)
2. Tool `configure_decay()` (UPSERT)
3. Decay service lit config avec cache
4. Auto-consolidation check dans boot (non-bloquant)
5. Fallback vers presets si table vide

---

### ⚡ 3. Comparaison

| Approche | Simplicité | Performance | Robustesse | Maintenabilité | Non-Régression | ECS |
|----------|------------|-------------|-------------|------------------|------------------|-----|
| **A (table)** | **7/10** | **8/10** | **9/10** | **8/10** | **9/10** | **4** |
| B (YAML) | 8/10 | 9/10 | 6/10 | 7/10 | 8/10 | 4 |
| C (enrichir presets) | 9/10 | 10/10 | 5/10 | 5/10 | 7/10 | 3 |

**Vainqueur : A (table).**

---

### ⚡ 4. Synthèse

**FinalSolution :** Table + tool + integration decay service + check auto-consolidation dans boot.

### ⚡ 4.b Tests

```python
async def test_decay_uses_config_over_presets():
    configure_decay("sys:history", 0.1, auto_consolidate_threshold=5)
    service = MemoryDecayService()
    rate = service.get_rate_for_tag("sys:history")
    assert rate == 0.1

async def test_auto_consolidation_triggers():
    # Create 25 sys:history memories
    for i in range(25):
        write_memory(title=f"H{i}", tags=["sys:history"], content="test")
    # Check consolidation
    snapshot = get_system_snapshot(repository="test")
    assert snapshot["health"]["needs_consolidation"] is True
```

### ⚡ 4.d YAGNI
- ✅ Besoin réel : oui (decay par tag, consolidation auto)
- ⚠️ Attention : ne pas over-engineer la config. 7 presets suffisent pour Expanse.

---

### ⚡ 5. Audit

- **Diff fonctionnel :** +1 table, +1 tool, modification decay service
- **Diff perf :** cache config (1 query/min au lieu de 1/query)
- **Ψ :** "Si la config est corrompue ?" → fallback vers presets hardcodés.

---

### ⚡ 6. Dernier levier

Le `priority_boost` dans la config permet de remonter les `sys:drift` (urgents) et `sys:core` (fondamentaux) dans les résultats. Pas besoin d'un système de scoring séparé.

---

### ⚡ 7. Recommandation

**Note : 7.5/10.** Utile mais plus complexe que les 2 premières. Priorité #3.

---

---

## AMÉLIORATION 4 : Markdown-Optimized Indexing

---

### ⚡ 0. Λ Contexte & Contraintes

- **Objectif :** Créer un indexeur spécialisé markdown pour Expanse (au lieu de l'indexeur générique 21 langages).
- **Artefact :** Nouveau MCP tool `index_markdown_workspace()`.
- **Environnement :** 419 fichiers .md, MarkdownChunker existant, 180 embeddings sur 369 chunks.
- **Contraintes :** Pas de dépendance tree-sitter/LSP. TEXT model only (pas CODE). Max 50KB/fichier.
- `complexity_budget = 80`
- `require_tests = true`

### ⚡ 0.a ECS

**Niveau :** Moyenne.
**ECS : 4/5.**
- Pipeline simple (scan → split → embed → store) mais avec des détails (cache invalidation, batch insert, halfvec).

### ⚡ 0.b Clarifying Gate

- `<!--needs_clarification-->` : Non.

---

### ⚡ 1. Génération d'approches

**Approche A : Nouveau tool dédié (index_markdown_workspace)**
- Hypothèse : Pipeline simplifié sans tree-sitter/LSP/metadata extractors.
- Robustesse : haute. Code minimal, pas de dépendance externe.

**Approche B : Ajouter un mode "markdown" à index_project**
- Hypothèse : `index_project(language="markdown")` filtre et utilise MarkdownChunker.
- Robustesse : moyenne. Mélange les responsabilités.

**Approche C : Script shell externe**
- Hypothèse : Script bash qui appelle l'API REST directement.
- Robustesse : faible. Pas de gestion d'erreur, pas de cache.

---

### ⚡ 2. Boucle critique

#### Approche A

**a. Ω :** Forces : code minimal (~150 LOC), pipeline clair, 10x plus rapide. Faiblesses : duplication partielle avec index_project.

**b. Ξ :** Non-régression : index_project continue à fonctionner. Le nouveau tool est additionnel.

**c. ECS : 4/5** (stable).

**d. Simplicity Gate :** LOC: 150, Cyclomatic: 2, Deps: 1 (MarkdownChunker). Score: 156 > 92 → dépasse.

**KISS :** Réutiliser `CodeIndexingService.index_repository()` mais avec un pipeline simplifié qui skippe tree-sitter/LSP/metadata. Passer un flag `skip_metadata=True, skip_graph=True`.

**e. Pair-Opposition :**
- Suppression : "Pourquoi ne pas juste améliorer index_project ?"
- Justification : "index_project fait 7 étapes dont 5 inutiles pour markdown. Un tool dédié est plus clair dans l'intention."

**f. Two-Sentence Summary :**
Nouveau tool `index_markdown_workspace()` qui scan les .md, split par ##, embed avec TEXT model, stocke avec halfvec. 10x plus rapide que index_project pour markdown.

**g. Améliorations :**
1. Progress callback via Redis (pour suivre l'avancement).
2. Skip fichiers > 50KB (souvent des dumps, pas du contenu utile).

**h. Journal M :** ECS 4/5. Gain principal : pas de CODE model, pas de tree-sitter, pas de LSP.

**i. Compression :**
1. Scan .md files (skip dot-prefixed, .bak, >50KB)
2. Split par ## (MarkdownChunker existant)
3. Embed TEXT only (pas de CODE model)
4. Batch insert avec halfvec trigger
5. 10x plus rapide (~3.5min vs ~35min pour 419 fichiers)

---

### ⚡ 3. Comparaison

| Approche | Simplicité | Performance | Robustesse | Maintenabilité | Non-Régression | ECS |
|----------|------------|-------------|-------------|------------------|------------------|-----|
| **A (tool dédié)** | **8/10** | **9/10** | **9/10** | **8/10** | **10/10** | **4** |
| B (mode markdown) | 6/10 | 8/10 | 7/10 | 6/10 | 8/10 | 3 |
| C (script shell) | 9/10 | 7/10 | 4/10 | 3/10 | 7/10 | 2 |

**Vainqueur : A (tool dédié).**

---

### ⚡ 4. Synthèse

**FinalSolution :** `index_markdown_workspace(root_path, repository, max_file_size_kb)` — pipeline simplifié markdown-only.

### ⚡ 4.b Tests

```python
async def test_index_markdown_creates_chunks(tool):
    result = await tool.execute(ctx=None, root_path="/tmp/test_md_repo")
    assert result["indexed_files"] > 0
    assert result["indexed_chunks"] > 0
    assert result["failed_files"] == 0

async def test_index_skips_large_files(tool):
    # Create a 60KB file
    result = await tool.execute(ctx=None, root_path="/tmp/big_md_repo", max_file_size_kb=50)
    assert result["skipped_large_files"] >= 1
```

### ⚡ 4.d YAGNI
- ✅ Besoin réel : oui (indexation Expanse lente et fragile)
- ✅ Simple : pipeline 5 étapes
- ✅ Testable : oui
- ✅ Réversible : supprime le tool

---

### ⚡ 5. Audit

- **Diff fonctionnel :** +1 MCP tool
- **Diff perf :** 10x plus rapide pour markdown
- **Ψ :** "Si un fichier .md contient du code ?" → le MarkdownChunker split par ##, le code reste dans les chunks. L'embedding TEXT capture le sémantique. Suffisant pour Expanse.

---

### ⚡ 6. Dernier levier

Le `max_file_size_kb=50` skippe les fichiers comme `expanse-dream.md` (souvent > 100KB). Ces fichiers sont des dumps de contexte, pas du contenu à rechercher. Skipper = gain de temps + qualité d'index.

---

### ⚡ 7. Recommandation

**Note : 8/10.** Gain de performance significatif. Priorité #5 (après les 4 autres).

---

---

## AMÉLIORATION 5 : Lifecycle-Aware Memory Search

---

### ⚡ 0. Λ Contexte & Contraintes

- **Objectif :** Enrichir `search_memory` avec des filtres lifecycle (sealed, candidate, doubt, consumed).
- **Artefact :** Modification de `search_memory` + `MemoryFilters`.
- **Environnement :** `search_memory` existant, `MemoryFilters` Pydantic, `consumed_at` (Amélioration 2).
- **Contraintes :** Backward compatible (nouveaux filtres optionnels). Pas de changement de schéma (utilise tags existants).
- `complexity_budget = 60`
- `require_tests = true`

### ⚡ 0.a ECS

**Niveau :** Faible-Moyenne.
**ECS : 4/5.**
- Pattern simple (ajout de filtres WHERE), mais nécessite de comprendre la sémantique des tags Expanse.

### ⚡ 0.b Clarifying Gate

- `<!--needs_clarification-->` : Comment mapper lifecycle_state vers les tags ? → `sealed` = pas de `:candidate` ni `:doubt`. `candidate` = tag se termine par `:candidate`. `doubt` = tag se termine par `:doubt`.

---

### ⚡ 1. Génération d'approches

**Approche A : Mapper lifecycle_state vers des conditions SQL sur les tags**
- Hypothèse : `lifecycle_state="sealed"` → `tag NOT LIKE '%:candidate' AND tag NOT LIKE '%:doubt'`.
- Robustesse : haute. Utilise les tags existants, pas de nouvelle colonne.

**Approche B : Nouvelle colonne `lifecycle_state`**
- Hypothèse : `ALTER TABLE memories ADD COLUMN lifecycle_state VARCHAR(20)`.
- Robustesse : moyenne. Duplique l'information déjà dans les tags.

**Approche C : Vue PostgreSQL**
- Hypothèse : Vue qui calcule le lifecycle_state à partir des tags.
- Robustesse : moyenne. Ajoute de la complexité SQL.

---

### ⚡ 2. Boucle critique

#### Approche A

**a. Ω :** Forces : 0 changement de schéma, utilise les tags existants. Faiblesses : le mapping tag→state est implicite (dépend de la convention de nommage des tags).

**b. Ξ :** Non-régression : les filtres sont optionnels. Sans `lifecycle_state`, le comportement est identique.

**c. ECS : 4/5** (stable).

**d. Simplicity Gate :** LOC: 20 (filtres dans search_memory) + 15 (MemoryFilters) = 35. Score: 37 < 60 → OK.

**e. Pair-Opposition :**
- Suppression : "Pourquoi pas juste filtrer par tag directement ?"
- Justification : "L'agent ne connaît pas la convention de nommage. `lifecycle_state='candidate'` est plus intuitif que `tags=['sys:pattern:candidate']`."

**f. Two-Sentence Summary :**
Ajouter un filtre `lifecycle_state` à `search_memory` qui mappe vers les conventions de tags Expanse. `sealed` = tags sans `:candidate` ni `:doubt`. `consumed=False` utilise le champ `consumed_at` (Amélioration 2).

**g. Améliorations :**
1. Le mapping est configurable (pas hardcodé).
2. `importance_min` utilise le `priority_boost` de la config decay (Amélioration 3).

**h. Journal M :** ECS 4/5. Gain : l'agent n'a plus à connaître les conventions de tags.

**i. Compression :**
1. Filtre `lifecycle_state` (sealed/candidate/doubt/summary)
2. Filtre `consumed` (True/False/None)
3. Mapping vers tags existants (0 changement schéma)
4. Backward compatible (filtres optionnels)
5. 35 LOC

---

### ⚡ 3. Comparaison

| Approche | Simplicité | Performance | Robustesse | Maintenabilité | Non-Régression | ECS |
|----------|------------|-------------|-------------|------------------|------------------|-----|
| **A (mapping tags)** | **9/10** | **8/10** | **8/10** | **7/10** | **10/10** | **4** |
| B (nouvelle colonne) | 6/10 | 9/10 | 7/10 | 6/10 | 7/10 | 3 |
| C (vue PostgreSQL) | 5/10 | 8/10 | 7/10 | 5/10 | 8/10 | 3 |

**Vainqueur : A (mapping tags).**

---

### ⚡ 4. Synthèse

**FinalSolution :** Ajouter `lifecycle_state` et `consumed` comme filtres optionnels dans `search_memory`. Mapping vers tags existants.

### ⚡ 4.b Tests

```python
async def test_lifecycle_sealed_excludes_candidates():
    write_memory(title="P1", tags=["sys:pattern:candidate"], content="test")
    write_memory(title="P2", tags=["sys:pattern"], content="test")
    results = search_memory(tags=["sys:pattern"], lifecycle_state="sealed")
    assert all("candidate" not in r.tags for r in results)

async def test_consumed_false_excludes_consumed():
    write_memory(title="D1", tags=["sys:drift"], content="test")
    mark_consumed(["uuid_of_D1"], "dream")
    results = search_memory(tags=["sys:drift"], consumed=False)
    assert len(results) == 0
```

### ⚡ 4.d YAGNI
- ✅ Besoin réel : oui (Dream veut les drifts frais, pas les consommés)
- ✅ Simple : mapping tags, pas de nouvelle colonne
- ✅ Dépend de : Amélioration 2 (consumed_at)

---

### ⚡ 5. Audit

- **Diff fonctionnel :** +2 filtres dans search_memory
- **Diff perf :** mapping ajoute ~1ms (conditions SQL supplémentaires)
- **Ψ :** "Si un tag contient ':candidate' mais n'est pas un pattern ?" → le mapping est générique (`tag LIKE '%:candidate'`), ce qui est acceptable pour Expanse (convention stricte).

---

### ⚡ 6. Dernier levier

Le `importance_min` (optionnel) utilise le `priority_boost` de la config decay (Amélioration 3). Permet de filtrer les mémoires par importance sans système de scoring séparé. 3 améliorations se renforcent mutuellement.

---

### ⚡ 7. Recommandation

**Note : 8/10.** Simple, élégant, renforcé par les améliorations 2 et 3. Priorité #4.

---

---

## MATRICE FINALE

| # | Amélioration | Simplicité | Performance | Robustesse | Maintenabilité | Non-Régression | ECS | Note | Priorité |
|---|-------------|------------|-------------|-------------|------------------|------------------|-----|------|----------|
| 1 | System Snapshot | 8/10 | 9/10 | 9/10 | 8/10 | 9/10 | 4 | **8.5/10** | #2 |
| **2** | **Consumption Tracking** | **9/10** | **9/10** | **9/10** | **9/10** | **10/10** | **4** | **9/10** | **#1** |
| 3 | Tag-Based Decay | 7/10 | 8/10 | 9/10 | 8/10 | 9/10 | 4 | **7.5/10** | #3 |
| 4 | Markdown Indexing | 8/10 | 9/10 | 9/10 | 8/10 | 10/10 | 4 | **8/10** | #5 |
| 5 | Lifecycle Search | 9/10 | 8/10 | 8/10 | 7/10 | 10/10 | 4 | **8/10** | #4 |

**Ordre d'implémentation :** 2 → 1 → 3 → 5 → 4

**Dépendances :**
- 5 dépend de 2 (consumed_at)
- 3 peut utiliser le priority_boost de 5
- 1 est indépendant
- 4 est indépendant

**Effort total :** ~4 jours

---

*Protocole 1.6-SNR-AntifragilePlus appliqué le 2026-03-27 23:15*
