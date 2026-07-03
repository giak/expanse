# 📂 runtime/ — Cerveau actif d'Expanse

> **Statut :** ✅ ACTIF | **Mise à jour :** 2026-07-03 | **Mainteneur :** Giak + Buffy

## 🎯 What is this?

Le dossier **`runtime/`** contient les fichiers de prompt Expanse **actuellement actifs** ou **legacy-bootable**. Ces fichiers sont chargés par le substrat LLM (opencode / freebuff / kilocode) à chaque boot pour incarner le système Expanse.

Conventions de nommage appliquées le 2026-07-03 :
- Format : `YYYY-MM-DD_topic_v{N}.md`
- Topic en kebab-case lisible
- Tag version (`v14`, `v15`, `v16`, `v17`) en suffixe
- Date = 1ʳᵉ commit du fichier (`git log --reverse --format=%ai`)

## 🗂️ Key files (8 fichiers)

| Fichier | Rôle | Statut | Version |
|---------|------|--------|---------|
| `2026-03-XX_v15-apex_v15.md` | V15 apex (legacy, 2900 tok, manifeste runtime) | 🧊 LEGACY | v15 |
| `2026-03-XX_v15-boot-seed_v15.md` | V15 boot seed procédural (inertie forcée) | 🧊 LEGACY | v15 |
| `2026-03-XX_v15-dream_v15.md` | V15 dream (auto-mutation, 8 passes) | 🧊 LEGACY | v15 |
| `2026-03-XX_v15-dashboard_v15.md` | V15 dashboard (visualisation HTML) | 🧊 LEGACY | v15 |
| `2026-03-XX_v15-test-runner_v15.md` | V15 test runner (validation comportementale) | 🧊 LEGACY | v15 |
| `2026-03-XX_v15-brm_v15.md` | V15 BRM (template brainstorm) | 🧊 LEGACY | v15 |
| `2026-06-XX_v17-minimal-v1_v17.md` | V17 minimal v1 (CALIBRAGE CONDITIONNEL — déprécié) | 🧊 LEGACY | v17 |
| `2026-07-03_v17-minimal-iteration2_v17.md` | **V17.6 Behavioral-Directive rigide (recommandé cross-host)** | ✅ ACTIF | v17 |

## 🕰️ History

- **2026-07-03** : Réorganisation (renommage ISO-date + fix typo `explanse-` → `expanse-`) — 7 fichiers renommés.
- **2026-03-XX** : Création du système V15 (5 fichiers legacy ajouté).
- **2026-06-XX** : V17 minimal v1 créé (échec cross-host, déprécié).
- **2026-07-03** : V17.6 minimal-iteration2 créé (succès sur Buffy, à valider cross-host).

## 🔗 Cross-references

- [`../doc/tests/`](../doc/tests/) — protocole S14 Rétrogression test cross-host
- [`../doc/core/`](../doc/core/) — specs canoniques (architecture, PRD)
- [`../versions/v16/runtime/`](../versions/v16/runtime/) — V16 archive (102 lignes Apex incarnation)
- [`../versions/v17/`](../versions/v17/) — V17 brainstorm + recette + réponses
- [`../../expanse-cortex/`](../../expanse-cortex/) — frontend React/TS (consomme les fichiers runtime/)

## 🧭 Comment naviguer

| Tu cherches ... | Va dans ... |
|-----------------|-------------|
| Le runtime courant à booter | `2026-07-03_v17-minimal-iteration2_v17.md` ✅ ACTIF |
| Une version passée bootable | `../versions/v{N}/runtime/` |
| Un test cross-host | `../doc/tests/2026-07-03_s14-retrogression-test_v17.md` |
| Un audit d'échec Sub-Protocol | `../v16/runtime/` ou `../doc/audits/` |

## ⚠️ Maintenance rules

- **Commit `git mv` UNIQUEMENT** — pas de modif contenu pendant renommage (sinon git perd la détection rename).
- **Date = 1ʳᵉ commit** : ne PAS changer la date après modifs (cohérence historique).
- **Topic kebab-case** : toujours en minuscules + tirets (lisible terminal).
- **Version suffix** : `v{N}` obligatoire, jamais `v17.6` ou `v17beta` (cohérence grep).
- **Pas de doublon** : un seul fichier par (topic, version). Vieux fichier = archive/move, pas doublon local.

*README rédigé le 2026-07-03 lors de la réorganisation initiale du projet.*
