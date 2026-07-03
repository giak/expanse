# EXPANSE — API MNEMOLITE MCP

**Version:** 1.0
**Date:** 2026-04-21
**Connexion :** `streamable-http` → `http://localhost:8002/mcp`
**⚠️ PRÉREQUIS :** Mnemolite est OBLIGATOIRE pour Expanse. Sans Mnemolite, pas d'identité émergente. V16 §Ⅵ : « Expanse = V16 × Cortex ». Sans Cortex, V16 est un chatbot sophistiqué (lois sans expérience).

---

## ENDPOINTS — 9 OUTILS

### 1. `search_memory`

Recherche sémantique dans le cortex vectoriel Mnemolite. L'outil le plus utilisé du système (Boot, Dream P0-P7, Dashboard, Test Runner, /graph).

**Signature :**
```
mcp_mnemolite_search_memory(
  query?: string,           — Requête textuelle pour recherche sémantique
  tags?: string[],           — Filtre par tags (logique AND : TOUS les tags doivent être présents)
  limit?: number,           — Max résultats (défaut: variable selon contexte)
  consumed?: boolean,        — Filtrer par statut consommation (false = non consommées seulement)
  memory_type?: string       — Filtrer par type de mémoire
) → Memory[]
```

**Paramètres détaillés :**

| Param | Type | Requis | Défaut | Description |
|-------|------|--------|--------|-------------|
| `query` | string | Non | — | Requête sémantique. Ex: `"sys:extension"`, `"cache distribué"` |
| `tags` | string[] | Non | — | Filtre tag AND. Ex: `["sys:core", "sys:anchor"]`. Un item avec les 2 tags seulement |
| `limit` | number | Non | 20 | Nombre max de résultats. Varie selon le contexte d'appel |
| `consumed` | boolean | Non | — | `false` = retourner seulement les mémoires non consommées. Utilisé par Dream P0/P1 pour traces fraîches |
| `memory_type` | string | Non | — | Filtrer par type: `"note"`, `"decision"`, `"task"`, `"reference"`, `"conversation"`, `"investigation"` |

**⚠️ NON SUPPORTÉ :** Le paramètre `sort` (ex: `sort="outcome_score DESC"`) est référencé dans V16 §Ⅱ Rappel Associatif Contextuel mais **n'est pas supporté par l'API Mnemolite**. Le tri doit être fait côté client (LLM) en lisant `outcome_score` des résultats.

**⚠️ LOGIQUE AND sur tags :** `tags=["sys:history", "sys:user:profile"]` retourne SEULEMENT les mémoires ayant les DEUX tags. C'est pourquoi /graph v5.1 sépare la recherche profil (`tags=["sys:user:profile"]` seul) de l'historique. Le profil n'a PAS le tag `sys:history`.

**Retour :** `Memory[]` — tableau de mémoires, chacune avec :
- `id` — Identifiant unique (utilisé par rate_memory, mark_consumed)
- `title` — Titre de la mémoire
- `content` — Contenu textuel
- `tags` — Tags associés
- `memory_type` — Type de mémoire
- `outcome_score` — Score de qualité (0-1), modulé par rate_memory
- `consumed` — Boolean, consommée ou non
- `created_at` — Date de création ISO

**Contextes d'utilisation :**

| Contexte | Appel typique | Fichier |
|----------|---------------|---------|
| Boot §Ⅵ core_anchor | `search_memory(tags=["sys:core","sys:anchor"], limit=10)` | V16 §Ⅵ |
| Boot §Ⅵ protocols | `search_memory(tags=["sys:protocol"], limit=10)` | V16 §Ⅵ |
| Boot §Ⅵ extensions | `search_memory(tags=["sys:extension"], limit=10)` | V16 §Ⅵ |
| Boot §Ⅵ profile_project | `search_memory(tags=["sys:user:profile","sys:project"], limit=5)` | V16 §Ⅵ |
| Boot onboarding | `search_memory(tags=["sys:project"], limit=5)` | /graph #13 |
| Boot profil seul | `search_memory(tags=["sys:user:profile"], limit=1)` | /graph #11 |
| Dream P0 | `search_memory(tags=["trace:fresh"], consumed=false, limit=20)` | Dream |
| Dream P1 traces | `search_memory(tags=["trace:fresh"], consumed=false, limit=20)` | Dream |
| Dream P1 drifts | `search_memory(tags=["sys:drift"], consumed=false, limit=20)` | Dream |
| Dream P1 doubt | `search_memory(tags=["sys:pattern:doubt"], limit=20)` | Dream |
| Dream P1 Triangulation Anchor | `search_memory(tags=["sys:core","sys:anchor"], query="{mots-clés}", limit=5)` | Dream |
| Dream P2 protocoles | `search_memory(tags=["sys:protocol"], limit=10)` | Dream |
| Dream P3 extensions | `search_memory(query="sys:extension", tags=["sys:extension"], limit=20)` | Dream |
| Dream P3 Triangulation | `search_memory(tags=["sys:pattern"], query="{symbole}", limit=5)` | Dream |
| Dream P4 doubt | `search_memory(tags=["sys:pattern:doubt"], limit=20)` | Dream |
| Dream P4 patterns | `search_memory(tags=["sys:pattern"], limit=20)` | Dream |
| Dream P4 Triangulation | `search_memory(tags=["sys:pattern"], query="{titre}", limit=3)` | Dream |
| Dream P5 protocoles | `search_memory(tags=["sys:protocol"], limit=10)` | Dream |
| Dream P5 Triangulation | `search_memory(tags=["sys:protocol"], query="{outil}", limit=5)` | Dream |
| Dream P6 santé | `search_memory(tags=["sys:history","sys:user:profile"], limit=50)` | Dream |
| Dream P6 Triangulation | `search_memory(tags=["sys:history"], query="{substrat}", limit=10)` | Dream |
| Dream P7 diff | `search_memory(query="sys:diff", tags=["sys:diff","temporal"], limit=1)` | Dream |
| Dream P7 history | `search_memory(query="sys:history", tags=["sys:history"], limit=50)` | Dream |
| Dashboard | `search_memory(query="...", tags=["..."], limit=50)` × 6 | Dashboard |
| /graph #2-#13 | `search_memory(tags=[...], limit=50-100)` × 12 | /graph |
| L2 Rappel Associatif | `search_memory(query=Σ_input, limit=5)` → tri côté client par `outcome_score` | V16 §Ⅱ |

---

### 2. `write_memory`

Écriture dans le cortex vectoriel. Utilisé pour cristallisation (Μ), drift, BRM, proposals, history, diff, snapshots, tests.

**Signature :**
```
mcp_mnemolite_write_memory(
  title: string,             — Titre de la mémoire (OBLIGATOIRE)
  content: string,            — Contenu textuel (OBLIGATOIRE)
  tags: string[],             — Tags de classification (OBLIGATOIRE)
  memory_type: string         — Type de mémoire (OBLIGATOIRE)
) → { id: string, ... }
```

**Paramètres détaillés :**

| Param | Type | Requis | Description |
|-------|------|--------|-------------|
| `title` | string | ✅ | Titre. Préfixes conventionnels : `PATTERN:`, `CANDIDATE:`, `BRM:`, `PROPOSAL:`, `DRIFT:`, `DIFF:`, `TEST_FAIL:`, `TEST_REPORT:`, `INTERACTION:`, `PRE_MUTATION_SNAPSHOT:` |
| `content` | string | ✅ | Contenu. Format libre mais structuré selon le contexte |
| `tags` | string[] | ✅ | Tags. Namespace : `sys:core`, `sys:anchor`, `sys:pattern`, `sys:pattern:candidate`, `sys:pattern:doubt`, `sys:drift`, `sys:extension`, `sys:protocol`, `sys:history`, `sys:diff`, `sys:test:report`, `sys:snapshot`, `sys:consumed`, `sys:user:profile`, `sys:project`, `trace:fresh`, `trace:dream:brm`, `substrat:{LLM}`, `type:{TYPE}`, `ide:{IDE}`, `v16` |
| `memory_type` | string | ✅ | **Valeurs valides** : `"note"`, `"decision"`, `"task"`, `"reference"`, `"conversation"`, `"investigation"`. ⚠️ `"pattern"` N'EST PAS valide (erreur connue V14) |

**⚠️ ERREUR CONNUE :** `memory_type: "pattern"` retourne l'erreur `Invalid memory_type 'pattern'. Valid types: note, decision, task, reference, conversation, investigation`. Utiliser `"reference"` pour les patterns et `"decision"` pour les proposals.

**memory_type par contexte :**

| Contexte | memory_type | Tags |
|----------|-------------|------|
| Cristallisation (pattern) | `"reference"` | `["sys:pattern", "v16", "substrat:{LLM}"]` |
| Candidate | `"reference"` | `["sys:pattern:candidate", "v16"]` |
| Proposal | `"decision"` | `["sys:pattern:candidate", "v16", "proposal"]` |
| Historique interaction | `"conversation"` | `["sys:history", "v16"]` |
| Drift post-Ω | `"investigation"` | `["sys:drift", "auto", "type:contradiction"]` |
| BRM Dream | `"investigation"` | `["trace:dream:brm", "v16"]` |
| Différentiel temporel | `"reference"` | `["sys:diff", "temporal", "v16"]` |
| Test report | `"reference"` | `["sys:test:report", "v16"]` |
| Test fail | `"investigation"` | `["trace:fresh", "type:test"]` |
| Pre-mutation snapshot | `"reference"` | `["sys:snapshot", "v16", "mutation:{slug}"]` |
| Boot onboarding profil | `"note"` | `["sys:user:profile"]` |
| Boot onboarding projet | `"note"` | `["sys:project"]` |
| Axiome scellé | `"decision"` | `["sys:core", "sys:anchor"]` |
| Extension symbiose | `"reference"` | `["sys:extension"]` |
| Protocole | `"reference"` | `["sys:protocol"]` |
| Trace:fresh | `"investigation"` | `["trace:fresh", "type:{TYPE}"]` |

**Retour :** `{ id: string, ... }` — L'ID est utilisé par `rate_memory` et `mark_consumed`.

---

### 3. `rate_memory`

Évaluation qualitative d'une mémoire. Module le taux de décroissance (decay) : les mémoires utiles persistent plus longtemps, les inutiles disparaissent plus vite. Cœur de l'Outcome Feedback (V16 §Ⅳ).

**Signature :**
```
mcp_mnemolite_rate_memory(
  id: string,                 — ID de la mémoire (OBLIGATOIRE)
  helpful: boolean            — Évaluation positive ou négative (OBLIGATOIRE)
) → { success: boolean }
```

**Paramètres détaillés :**

| Param | Type | Requis | Description |
|-------|------|--------|-------------|
| `id` | string | ✅ | ID Mnemolite de la mémoire. Doit venir de `current_memory_ids` (registre contextuel) |
| `helpful` | boolean | ✅ | `true` = la mémoire a aidé → décroissance ralentie. `false` = la mémoire n'a pas aidé → décroissance accélérée |

**⚠️ CONTRAT API IMPLICITE :** Le paramètre `helpful` est spécifié dans V16 §Ⅳ mais n'est pas dans la liste `alwaysAllow` du MCP config. Il est possible que le paramètre soit `rating` ou `score` dans l'implémentation réelle. Vérifier avec un appel test.

**Contextes d'utilisation :**

| Contexte | Condition | Appel |
|----------|-----------|-------|
| Outcome Feedback positif | User répond "merci", "ok", "marche", "parfait" | `rate_memory(id, helpful=True)` pour chaque ID dans `current_memory_ids` |
| Outcome Feedback négatif | User répond "non", "faux", "pas ça", "recommence" | `rate_memory(id, helpful=False)` pour chaque ID dans `current_memory_ids` |

**Workflow V16 §Ⅳ :**
1. Quand `search_memory` est appelé → stocker les IDs retournés dans `current_memory_ids`
2. Si feedback positif → `rate_memory(id, helpful=True)` pour chaque ID
3. Si feedback négatif → `rate_memory(id, helpful=False)` pour chaque ID
4. Après chaque réponse utilisateur → effacer `current_memory_ids` (auto-nettoyage)

---

### 4. `mark_consumed`

Marquer des mémoires comme consommées (traitées). Utilisé par Dream P1 (consommation sélective), Dream Partie 3, et la boucle de nettoyage.

**Signature :**
```
mcp_mnemolite_mark_consumed(
  memory_ids: string[],       — IDs des mémoires à marquer (OBLIGATOIRE)
  consumed_by: string         — Identifiant du consommateur (OBLIGATOIRE)
) → { success: boolean }
```

**Paramètres détaillés :**

| Param | Type | Requis | Description |
|-------|------|--------|-------------|
| `memory_ids` | string[] | ✅ | Liste d'IDs Mnemolite à marquer consommées |
| `consumed_by` | string | ✅ | Source de la consommation. Ex: `"dream_passe1"`, `"dream_passe1_triangulation_abandon"` |

**Contextes d'utilisation :**

| Contexte | consumed_by | Note |
|----------|-------------|------|
| Dream P1 — traces avec BRM PASSÉ | `"dream_passe1"` | Seulement les traces dont le BRM a passé la triangulation |
| Dream P1 — drifts avec BRM PASSÉ | `"dream_passe1"` | Même règle sélective |
| Dream P1 — BRM ABANDONNÉ | `"dream_passe1_triangulation_abandon"` | Le BRM est marqué consommé comme mémoire négative |
| Dream P2-P7 | `"dream_passe{n}"` | Chaque passe consomme ses propres traces |

**⚠️ CONSOMMATION SÉLECTIVE (Dream P1) :** Ne PAS consommer les traces dont le BRM a été ABANDONNÉ — la friction est réelle, seul le diagnostic était faux. Ces traces seront retraitées par un Dream futur avec un BRM différent.

---

### 5. `get_system_snapshot`

Snapshot complet du cortex Mnemolite en un appel (~50ms). Utilisé au Boot et par /graph.

**Signature :**
```
mcp_mnemolite_get_system_snapshot(
  repository: string          — Nom du dépôt (OBLIGATOIRE)
) → { counts: object, metrics: object, ... }
```

**Paramètres détaillés :**

| Param | Type | Requis | Description |
|-------|------|--------|-------------|
| `repository` | string | ✅ | Nom du dépôt. Toujours `"expanse"` pour ce projet |

**Retour :** Objet contenant des counts par tag, métriques (outcome_score moyen, consumed count), et métadonnées du cortex.

**Contextes d'utilisation :**

| Contexte | Appel |
|----------|-------|
| Boot §Ⅵ Phase 1 | `get_system_snapshot(repository="expanse")` |
| /graph #1 | `get_system_snapshot(repository="expanse")` |
| Dream /apply §5b (pre-mutation snapshot) | Via `write_memory` (sauvegarde du snapshot) |

---

### 6. `search_code`

Recherche dans le code source du workspace (Vessel — pôle 2 de la Triangulation L3). Utilisé par Φ Vessel Guard et Triangulation L3.

**Signature :**
```
mcp_mnemolite_search_code(
  query: string,              — Requête de recherche (OBLIGATOIRE)
  filters?: object            — Filtres optionnels (ex: repository)
) → CodeResult[]
```

**Paramètres détaillés :**

| Param | Type | Requis | Description |
|-------|------|--------|-------------|
| `query` | string | ✅ | Requête textuelle. Ex: `"cache distributed redis"` |
| `filters` | object | Non | Filtres. Ex: `{repository: "expanse"}` |

**Retour :** `CodeResult[]` — résultats de recherche dans le code source.

**Contextes d'utilisation :**

| Contexte | Condition | Description |
|----------|-----------|-------------|
| V16 §Ⅱ Φ Vessel Guard | Référence à un objet interne non connu | `search_code` OBLIGATOIRE avant Ω |
| V16 §Ⅱ Triangulation L3 | C≥4 OU I=3 | Pôle 2 (Vessel) de la Triangulation Absolue |
| Dream P1 BRM Triangulation | Pôle Web optionnel | Si le Cristal fait une affirmation factuelle vérifiable dans le code |

---

### 7. `index_markdown_workspace`

Indexation du workspace Markdown pour accélérer les recherches futures. Appelé au Boot (§Ⅵ Phase 2).

**Signature :**
```
mcp_mnemolite_index_markdown_workspace(
  root_path?: string,         — Chemin racine du workspace
  repository?: string         — Nom du dépôt
) → { indexed: number, ... }
```

**Paramètres détaillés :**

| Param | Type | Requis | Description |
|-------|------|--------|-------------|
| `root_path` | string | Non | Chemin racine. Utiliser `{PROJECT_ROOT}` (résolu au Boot) |
| `repository` | string | Non | Nom du dépôt. `"expanse"` |

**Contextes d'utilisation :**

| Contexte | Appel |
|----------|-------|
| Boot §Ⅵ index | `index_markdown_workspace()` — assure l'accès à l'index Markdown de l'IDE |
| /graph ot_boot_index | `index_markdown_workspace(root_path, repository='expanse')` |

**Performance :** ~10x plus rapide que la recherche fichier par fichier (V15 §4).

---

### 8. `configure_decay`

Configuration de la politique de décroissance des mémoires. Permet de contrôler la vitesse à laquelle les mémoires deviennent moins pertinentes.

**Signature :**
```
mcp_mnemolite_configure_decay(
  ...params                   — Paramètres de configuration decay
) → { success: boolean }
```

**⚠️ PEU UTILISÉ :** Aucun appel explicite dans les fichiers runtime actuels. Présent dans le MCP config `alwaysAllow` mais pas invoqué par V16, Dream, Dashboard, /graph ou Test Runner. La décroissance est gérée implicitement via `rate_memory` (qui module le decay) plutôt que par configuration directe.

**Contexte théorique :** Pourrait être utilisé pour ajuster les half-lives des mémoires par tag ou par type. Non documenté faute d'usage.

---

### 9. `consolidate_memory`

Consolidation des mémoires — fusion, résumé, ou nettoyage des mémoires redondantes ou obsolètes.

**Signature :**
```
mcp_mnemolite_consolidate_memory(
  ...params                   — Paramètres de consolidation
) → { success: boolean }
```

**⚠️ PEU UTILISÉ :** Aucun appel explicite dans les fichiers runtime actuels. Présent dans le MCP config `alwaysAllow` mais pas invoqué. Le mécanisme équivalent est la Règle 9 d'agrégation (Dream) et le `mark_consumed` pour la consommation.

**Contexte théorique :** Pourrait être utilisé pour l'agrégation R9 (quand `sys:history > 20`) ou la purge des traces consommées (`consumed > 20`). Non documenté faute d'usage.

---

## MODE DÉGRADÉ — Mnemolite Down

**Règle fondamentale (V16 §Ⅵ + /graph §0) :** MNEMOLITE EST OBLIGATOIRE. Si Mnemolite ne répond pas → **ABORT IMMÉDIAT**.

| Phase | Mnemolite UP | Mnemolite DOWN |
|-------|-------------|----------------|
| **Boot** | 6 appels MCP → L0+L1 Cortex Assembly → Ψ [V16 ACTIVE] | **ABORT** — pas de Cortex, pas d'identité. V16 seul = chatbot sophistiqué |
| **Runtime L1** | Ω direct, pas de MCP | **OK** — L1 ne nécessite pas Mnemolite |
| **Runtime L2** | search_memory (Rappel Μ) + rate_memory (Feedback) | **DÉGRADÉ** — pas de rappel associatif, pas de feedback. Réponse sans expérience |
| **Runtime L3** | Triangulation 3 pôles (Anchor+Vessel+Web) | **DÉGRADÉ** — pas de pôle Anchor (Mnemolite), pas de pôle Vessel (search_code). Triangulation tronquée |
| **Dream P0-P7** | search_memory + write_memory + mark_consumed | **IMPOSSIBLE** — le Dream ne peut pas sonder les traces ni écrire les proposals |
| **Dashboard** | 6 search_memory + LOG.md | **IMPOSSIBLE** — les métriques Mnemolite sont indisponibles |
| **/graph** | 13 appels MCP | **ABORT** — /graph §0 : « AUCUN FALLBACK. AUCUNE SIMULATION. » |
| **Cristallisation** | write_memory (pattern/drift) | **SILENCIEUX** — les patterns ne sont pas sauvegardés, l'expérience est perdue |
| **Decay Configuration** | configure_decay (rare) | **DÉFAUT** — décroissance par défaut seulement, pas de personnalisation des half-lives |
| **Memory Consolidation** | consolidate_memory (rare) | **MANUEL** — mark_consumed seulement, pas de fusion/ragrégation automatique (R9 manuelle) |

**Hiérarchie de dégradation :**

```
Mnemolite UP        → Expanse = V16 × Cortex (identité émergente)
Mnemolite PARTIAL   → L1 fonctionne, L2/L3 dégradés, Dream impossible
Mnemolite DOWN      → V16 seul (lois sans expérience) → Chatbot sophistiqué
Mnemolite DOWN + Boot → ABORT (le Boot ne peut pas construire le Cortex)
```

**Résultats vides vs ERREUR de connexion :**

| Situation | Comportement |
|-----------|-------------|
| Appel MCP retourne **0 résultats** | ✅ VALIDE — le graphe/cortex aura 0 nœuds de ce type. Continuer. |
| Appel MCP retourne champs vides/null dans snapshot | ✅ VALIDE — pas une erreur. Continuer. |
| Appel MCP **échoue/timeout/refuse** | ❌ ERREUR CRITIQUE — ABORT COMPLET. |
| Appel MCP retourne JSON inattendu | ❌ ERREUR CRITIQUE — ABORT COMPLET. |

---

## DISCREPANCIES & ERREURS CONNUES

| # | Problème | Source | Correction |
|---|----------|--------|------------|
| D1 | `sort="outcome_score DESC"` non supporté | V16 §Ⅱ Rappel Associatif | Tri côté client (LLM) après réception des résultats |
| D2 | `memory_type: "pattern"` invalide | V14 test scenario | Utiliser `"reference"` pour patterns |
| D3 | `rate_memory` absent de `alwaysAllow` MCP config | .kilocode/mcp.json vs V16 §Ⅳ | ⚠️ **ACTION REQUISE** : exécuter `rate_memory(id="{test_id}", helpful=True)` lors du prochain Boot et observer la réponse. Si erreur → le paramètre est `rating`/`score`, ajuster V16 §Ⅳ en conséquence. |
| D4 | Tags AND logique vs OR attendu | Dream P6 `tags=["sys:history","sys:user:profile"]` | Séparer en 2 appels si OR voulu. /graph v5.1 corrige |
| D5 | `consumed` param peut ne pas être supporté partout | Dashboard vs Dream | Vérifier que le paramètre est bien traité par l'API |
| D6 | `index_markdown_workspace` params varient | Boot vs /graph | Les paramètres exacts dépendent de l'implémentation Mnemolite |

---

*Expanse MCP API v1.0 — 2026-04-21*
