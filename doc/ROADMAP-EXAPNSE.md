# ROADMAP EXPANSE V15 — Améliorations & État

**Dernière mise à jour :** 2026-03-19
**Sources :** Audit (22 findings), Boot Brainstorm (21 itérations), Live Tests, Harness Engineering (article)

---

## ✅ CE QUI FONCTIONNE

| Composant | Preuve |
|-----------|--------|
| Boot cross-LLM (3/3) | Seed MCP validé OpenCode, Gemini, Big Pickle |
| Maintien Ψ post-boot | D+C (boot-as-lesson + règle absolue) |
| Auto-Check (Ψ/SEC/minimal) | Exécuté 3/3 après boot D+C |
| Cristallisation | Mutation crystallization-guard-surgical appliquée |
| Dream (proposals) | 3 proposals générés, 2 applied, 1 rolled back |
| Rollback | Mutation 1 rolled back proprement |
| Auto-réflexion | surgical-integrity-protocol (système se protège) |
| ECS L1 routing | Vérifié en session live |

---

## ❌ CE QUI NE FONCTIONNE PAS (ou pas encore testé)

| Composant | Problème | Source |
|-----------|----------|--------|
| Axiomes Mnemolite = V14 | Aucun axiome V15 scellé | Audit #1 |
| Seuil ECS incohérent (2.5 vs 4) | KERNEL/SYNTHESE ≠ V15 | Audit #2 |
| Vessel non défini | Triangulation L3 dégradée | Audit #3 |
| `/seal` collision (V15 vs Dream) | Même commande, 2 comportements | Audit B |
| Cristallisation négative absente | Positifs scellent, négatifs déscellent pas | Audit H |
| Ψ non visible (certains LLMs) | OpenCode sans D+C = pas de Ψ | Live test |
| L2/L3 routing | Jamais testé en conditions réelles | Non testé |
| Dream complet (Passes 0-6) | Jamais exécuté avec données réelles | Non testé |
| sys:history explosion | Aucune politique de rétention | Audit #12 |

---

## 🔧 AMÉLIORATIONS PRIORITAIRES

### Tier 1 — Quick Wins (impact élevé, effort faible)

| # | Action | Source | Statut |
|---|--------|--------|--------|
| 1 | **Plafonner recherches Mnemolite** : limit=15 au lieu de 50 | Harness article (SWE-agent : "highest-leverage change") | À faire |
| 2 | **Définir Vessel** : "documentation technique du workspace (docs/, kb/, README)" | Audit #3 | À faire |
| 3 | **Définir signaux négatifs** : liste explicite de mots-clés pour TRACE:FRESH | Audit #4, Harness article | À faire |
| 4 | **Corriger "6 Lois" → "6 Sections"** dans Dream L349/L601 | Audit #6 | À faire |
| 5 | **Ajouter plancher `max(1, C-1)`** à heuristique ECS | Audit #9 | À faire |
| 6 | **Mettre à jour nexus fichiers** V14 → V15 | Audit #7 | À faire |
| 7 | **Mettre à jour kb/ARCHITECTURE.md** ECS 1D → 2D | Audit #8 | À faire |

### Tier 2 — Améliorations structurelles

| # | Action | Source | Statut |
|---|--------|--------|--------|
| 8 | **Progress file** : tag `sys:last_session` avec résumé 3-5 lignes post-session | Harness article ("prevents declaring victory too early") | À faire |
| 9 | **Linter post-écriture** : vérification sémantique V15 après write_file (pas juste structure) | Harness article ("syntax errors caught at moment of introduction") | À faire |
| 10 | **Résumé sys:history** : quand >20 entrées, résumer les anciennes en sys:pattern | Harness article ("collapsed older observations") | À faire |
| 11 | **Feature list V15** : état de complétude des fonctionnalités (boot, ECS, cristallisation, Dream) | Harness article ("makes completeness explicit") | À faire |
| 12 | **Résoudre collision `/seal`** : renommer V15 `/seal` → `/crystallize` | Audit B, G | À faire |
| 13 | **Cristallisation négative** : déscellement sur signal négatif post-pattern | Audit H | À faire |
| 14 | **Corriger `Ψ SEAL`** : ajouter tag `sys:anchor` en plus de `sys:core` | Audit D | À faire |

### Tier 3 — Tests à lancer

| # | Test | Quoi vérifier | Statut |
|---|------|---------------|--------|
| 15 | **L2 routing** : question modérée avec outils | Boucle Ψ⇌Φ, outils utilisés | À faire |
| 16 | **L3 routing** : question complexe stratégique | Triangulation 3 pôles, confiance % | À faire |
| 17 | **Cristallisation** : `merci` après L2 | Pattern sauvé dans Mnemolite | À faire |
| 18 | **Dream complet** : `/dream` avec ≥3 TRACE:FRESH | Passes 0-6, proposals générés | À faire |
| 19 | **Maintien cross-LLM** : Gemini et Big Pickle avec seed D+C | Ψ visible post-boot sur tous les LLMs | À faire |

---

## 📊 INSIGHTS HARNESS ENGINEERING (article)

Principes documentés par SWE-agent (Princeton), Anthropic (Claude Code), OpenAI (Codex) et leur application à Expanse :

| Principe | Article | Application Expanse |
|----------|---------|-------------------|
| Capped search | "50 results max, force agent to refine" | Mnemolite limit=15 |
| Line numbers in file viewer | "Removing cognitive task from working memory" | read_file avec numéros |
| Linter after edit | "Syntax errors caught at moment of introduction" | Vérification post-write |
| Context compression | "Older observations → single-line summaries" | sys:history >20 → résumé |
| Progress file | "Read at start, write at end of every session" | sys:last_session |
| Feature list | "Makes completeness explicit and unambiguous" | État V15 (boot/ECS/cristallisation/Dream) |
| Repository as system of record | "If agent can't read it, it doesn't exist" | KERNEL/V15/Mnemolite |
| Progressive disclosure | "Minimum to orient, pointers to find more" | Boot → V15 → Dream (sur demande) |
| Two-agent architecture | "Initializer + executor" | Seed (initializer) + V15 (executor) |

---

## 📁 FICHIERS DE RÉFÉRENCE

| Fichier | Contenu |
|---------|---------|
| `doc/audit/V15-APEX-AUDIT-2026-03-19.md` | Audit statique (22 findings) + contre-audit |
| `doc/audit/V15-APEX-LIVE-TESTS-2026-03-19.md` | Journal de tests vivants |
| `doc/audit/V15-APEX-BOOT-BRAINSTORM-2026-03-19.md` | Boot : 21 itérations brainstorm |
| `runtime/expanse-v15-boot-seed.md` | Seed boot (9 lignes) |
| `runtime/expanse-v15-apex.md` | Runtime V15 |
| `runtime/expanse-dream.md` | Auto-évolution Dream |
| `runtime/expanse-dashboard.md` | Dashboard Mnemolite |
| `dashboard/expanse-dashboard.html` | Dashboard généré |
| `doc/mutations/LOG.md` | Historique mutations |

---

*Roadmap Expanse V15 — 2026-03-19*
*Document vivant — mettre à jour au fur et à mesure des tests et corrections*
