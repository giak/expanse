# 2026-07-03 — PLAN : Screaming Architecture × LIFECYCLE pour Expanse

> **Statut** : DRAFT (awaiting user approval)
> **Phase** : 3 — suite logique de Phase 1 (renames ISO-date) + Phase 2 (reorg top-level + 9 READMEs)
> **Owner** : Buffy + user
> **Cible** : `doc/` racine + sous-dossiers + ajout section à `AGENTS.md` + nouveau script d'enforcement

---

## §0 — Résumé exécutif (TL;DR)

**Problème** : `doc/` mélange 3 versions Expanse (V15/V16/V17), des specs, brainstorms, plans, tests, audits, artifacts, mutations dans le même dossier plat racine + 6 sous-dossiers disparates. ~230 fichiers .md sans hiérarchie d'intention claire. Un nouvel agent/LLM qui ouvre `doc/` n'a aucune chance de comprendre « où va ce fichier, pourquoi il est là, dans quel état ».

**Solution** : Croiser 2 axes :
1. **Screaming Architecture (Bob Martin)** — la structure crie **l'intention cognitive** du fichier (kernel / spec / brainstorm / plan / test / audit / artifact / mutation), pas le framework.
2. **LIFECYCLE** — chaque fichier porte un **statut** (`DRAFT/ACTIVE/ARCHIVED/DEPRECATED`) + un **identity triple** (date + version + type + name).

**Aboutissement** :
- `AGENTS.md` enrichi d'une section 3 « Organisation, Nommage, LIFECYCLE » (≤80 lignes, lisible humain + grep-friendly).
- `scripts/check_docs_lifecycle.py` valide les nouveaux fichiers (regex + front-matter).
- Migration backward-compat : 230 fichiers existants → `_legacy/` quarantinés (lisibles mais hors d'enforcement).

**Coût estimé** : 1 plan (ce fichier) + 1 commit-rules AGENTS.md + 1 commit-script + N migrations opportunistes. Aucun rush.

---

## §1 — Diagnostic honnête de `doc/`

| Lieu | Volume | État | Convention nommage |
|------|--------|------|---------------------|
| `doc/*.md` racine | ~24 fichiers | Mélange core (BIBLE, KERNEL, philosophy) + process (DASHBOARD, PRD) + daté (1 fichier Phase 2) + brainstorm/recette V17 — **non-trié** | ISO-date partiel (1/24) |
| `doc/audits/` | 130 | Issue fusion Phase 2 (78 initiaux + 52 reconciliation). Espaces, `:`, multi-authoring. | ISO-date respecté |
| `doc/plans/` | 87 | Mêlés ; contient `challenges/`, `mutations/`, `artifacts/` en interne — **scoping faible** | ISO-date partiel |
| `doc/tests/` | 10 | Scripts shell + md mélangés | Variable |
| `doc/artifacts/` | ~18 | POC outputs dispersés | Variable |
| `doc/challenges/` | 3 | Quasi-vide | N/A |
| `doc/mutations/` | 1 | Quasi-vide | N/A |

**Manques structurels** :
- **Aucun statut par fichier** — impossible de savoir ce qui est canon vs obsolète.
- **Pas de version explicite** — V15/V16/V17 specs mélangés à V17 brainstorms.
- **3 sub-dossiers fantômes** (`challenges/`, `mutations/`, sous-dossiers quasi-vides) — bruyants.
- **`AGENTS.md` n'a aucune règle d'organisation** — seulement RTK + write() anti-pattern.

---

## §2 — 3 architectures candidates (brainstorm)

### Option A — Screaming Phase (cycle cognitif) ⭐ recommandé

Crie le **flux** ΣΨΦΩ΂ dans l'arborescence :
```
doc/
├── 00-kernel/       # Invariants immuables (KERNEL, BIBLE, PHILOSOPHY)
├── 01-specs/        # Ce qui doit être construit (PRD, specs V{15,16,17,18})
├── 02-brainstorms/  # Exploration divergente (avant plans)
├── 03-plans/        # Plans committed per phase (Phase 0/1/2/3)
├── 04-tests/        # Protocoles + résultats (S-XX)
├── 05-audits/       # Forensique (post-mortem, retro-analysis)
├── 06-artifacts/    # POC outputs, research outputs
├── 07-mutations/    # Petites variations incrémentales
└── _legacy/         # Quarantaine : 230 fichiers existants non conformes
```

**Statuts** : suffixe dans nom (`_DRAFT`, `_ACTIVE`, `_ARCHIVED`, `_DEPRECATED`) + YAML front-matter (versant link `superseded-by`).

**Versions** : préfixe fichier `v15_`, `v16_`, `v17_`, `v18_` (cohabitation dans `01-specs/` sans cloisonnement aveugle).

**Pro** : lecture transverse facile (audit V15 vs V16 vs V17 dans même dossier) ; grep LIFECYCLE trivial ; aligné logique ΣΨΦΩ΂ du KERNEL.

**Con** : apprendre le routage (où va mon fichier ? → 8 dossiers à connaître) ; numéro préfixe `00-kernel/` peut évoquer un framework.

### Option B — Screaming Version (timeline isolation)

Crie la **timeline** :
```
doc/
├── kernel/          # Agnostique (BIBLE, KERNEL, PHILOSOPHY)
├── v15/ → {specs, plans, tests, audits, artifacts, mutations}
├── v16/ → idem
├── v17/ → idem
└── v18/ → idem (futur)
```

**Pro** : étanche parfait cross-version (anti-hallucination agent).
**Con** : comparaison transversale (audit V15 vs audit V16) **difficile car disséminés**. Risque duplication avec `runtime/` (V17-only) et `versions/` (legacy archives) — 3 namespaces pour V17 ?

### Option C — Screaming Symbols (Expanse dogmatique)

AlignéΣΨΦΩ du KERNEL :
```
doc/
├── 1_Σ_Input/       # Brainstorms, inputs raw user, ideation
├── 2_Ψ_Core/        # Kernel, Architecture, Specs
├── 3_Φ_Audits/      # Tests, Audits reality-check
└── 4_Ω_Output/      # Artifacts, deliveries
```

**Pro** : philosophiquement cohérent avec `KERNEL.md`. Très parlant pour agents qui ont lu KERNEL.
**Con** : cryptique pour agents qui n'ont pas lu KERNEL (nouveau contributeur humain) ; risque *cargo-cult* (signes sans substance).

---

## §3 — Recommandation motivée

**Option A — Screaming Phase** est retenue pour 5 raisons :

1. **Compatibilité LIFECYCLE INDEX existant** : le README.md Phase 2 a 11 étapes utilisateur (01-onboarding → 11-dashboard). Architecture-phasée se mappe naturellement (00-kernel = fondation, 01-specs = spec → 07-mutations = incrémental).
2. **Transversalité** : comparer audit V15 vs V16 vs V17 → même dossier `05-audits/`. Avec Option B, sería 3 grep différents.
3. **Compatibilité runtime/ + versions/** : ces deux dossiers sont **déjà** Version-screaming. Option A les COMPLETE (Version-axis en préfixe fichier), ne duplique pas.
4. **Simplicité cognitive pour agent** : « Où va mon fichier ? → posez 2 questions : (1) quelle **phase cognitive** ? spec / plan / audit ?, (2) quel **statut** ? DRAFT / ACTIVE ? » → 2 décisions simples vs 4 catégories-symboles alambiquées d'Option C.
5. **Symétrie avec `versions/` + `runtime/`** : la version est déjà dans le nom, donc la structure crie « Expanse V17 source-of-truth is in runtime/ ; legacy is in versions/ ; exploration is in doc/02-brainstorms/ ».

**Verdict** : Option A. Option B rejetée (cloisonnement excessif). Option C écartée (cargo-cult risk).

---

## §4 — Naming convention spec (à inscrire dans AGENTS.md)

### Format canonique
```
{YYYY-MM-DD}_v{N}_{TYPE}_{SLUG}_{STATUS}.md
```

Décomposition char par char :
- `{YYYY-MM-DD}` — date de **création** (jamais update — c'est un identifiant, pas un timestamp mutable)
- `_v{N}` — `v15`, `v16`, `v17`, `v18`, ou `all` (si agnostique version)
- `_{TYPE}` — un parmi : `KERNEL`, `SPEC`, `BRAINSTORM`, `PLAN`, `TEST`, `AUDIT`, `ARTIFACT`, `MUTATION`, `RECETTE`, `PRD`, `BIBLE`, `README`
- `_{SLUG}` — kebab-case court (≤5 mots), décrivant le sujet
- `_{STATUS}` — un parmi : `DRAFT`, `ACTIVE`, `ARCHIVED`, `DEPRECATED`

### Regex de validation (à embarquer dans le script d'enforcement)
```
^[0-9]{4}-[0-9]{2}-[0-9]{2}_v(15|16|17|18|all)_(KERNEL|SPEC|BRAINSTORM|PLAN|TEST|AUDIT|ARTIFACT|MUTATION|RECETTE|PRD|BIBLE|README)_[a-z0-9-]+_(DRAFT|ACTIVE|ARCHIVED|DEPRECATED)\.md$
```

### Exemples concrets
| Cas | Avant (Phase 2 hétérogène) | Après (Phase 3 strict) |
|-----|---------------------------|----------------------|
| Brainstorm V17 | `doc/expanse-v17-brainstorm.md` | `doc/02-brainstorms/2026-03-15_v17_BRAINSTORM_cognitive-flow_DRAFT.md` |
| Plan V17 reconstruction | `doc/2026-07-02_PLAN-RECONSTRUCTION-FROM-SCRATCH.md` | `doc/03-plans/2026-07-02_v17_PLAN_reconstruction-from-scratch_ACTIVE.md` |
| Audit V15 atomique | `doc/audits/2026-03-15-atomic-test.md` | `doc/05-audits/2026-03-15_v15_AUDIT_atomic-test_ARCHIVED.md` |
| Spec V18 nouvelle | (à créer) | `doc/01-specs/2026-07-03_v18_SPEC_screaming-arch-phase3_DRAFT.md` |
| README racine doc | `doc/README.md` | `doc/README.md` (exception, voir §4.4) |

### Exceptions au naming canonique

1. **`README.md`** : racine de chaque dossier (équivalent index.html) — pas de date prefix.
2. **`AGENTS.md`, `KERNEL.md`, `.gitignore`** : fichiers opérationnels racine — pas touchés.
3. **Fichiers dans `_legacy/`** : naming libre (non-enforced), préservés verbatim pour traçabilité historique.

---

## §5 — LIFECYCLE states + transitions

### 4 états

| Statut | Définition | Transitions possibles |
|--------|-----------|----------------------|
| `DRAFT` | Brouillon — exploratoire, peut changer quotidiennement | → ACTIVE / → ARCHIVED (jamais publié) |
| `ACTIVE` | Fait autorité — référence canonique pour le sujet traité | → DEPRECATED / → ARCHIVED |
| `ARCHIVED` | Snapshot figé — figé à un moment T, consultable mais non-modifié | (terminal) |
| `DEPRECATED` | Périmé — risque de confusion avec ACTIVE, marqué dangereux | → ARCHIVED (terminal) |

### Pourquoi 4 états (pas 2 ou 5)

- **DRAFT vs ACTIVE** : distinction engageante — un DRAFT créé hier n'est pas un ACTIVE même si pertinent.
- **ARCHIVED vs DEPRECATED** : distinction temporelle vs informationnelle. ARCHIVED = vieux mais valide à son époque (audit). DEPRECATED = encore jeune mais supplanté par X (front-matter `superseded-by`).
- **Pas de `WIP`** : confondu avec DRAFT. Pas de `LEGACY` : confondu avec ARCHIVED.

### Diagramme de transitions

```
                  ┌─────────────┐
                  │   CREATE    │
                  └──────┬──────┘
                         ▼
                  ┌─────────────┐
       ┌──────────│   DRAFT     │
       │          └──────┬──────┘
       │                 │ promote (manus)
       │                 ▼
       │          ┌─────────────┐
       │          │   ACTIVE    │
       │          └─┬────────┬──┘
       │            │        │
       │   superseded     archive (end of life)
       │            │        │
       │            ▼        ▼
       │    ┌──────────┐ ┌──────────┐
       └────│ DEPRECATED│ │ ARCHIVED │
            └─────┬────┘ └─────┬────┘
                  └──────┬─────┘
                         ▼
                    (terminal)
```

---

## §6 — Front-matter template (YAML)

Tout fichier `.md` (hors `README.md`, `AGENTS.md`, `KERNEL.md`, ...) **doit** démarrer par ce bloc YAML:

```yaml
---
type: SPEC                          # parmi KERNEL/SPEC/BRAINSTORM/PLAN/TEST/AUDIT/ARTIFACT/MUTATION/RECETTE/PRD/BIBLE
version: v17                        # parmi v15/v16/v17/v18/all
status: ACTIVE                      # parmi DRAFT/ACTIVE/ARCHIVED/DEPRECATED
title: "Cognitive flow V17 - Phase 3"
author: "Mickael Martin (né Giak)"
created: 2026-07-03
last_reviewed: 2026-07-03
superseded_by: ""                   # si DEPRECATED, pointer le fichier qui l'a supplanté
related:                            # références transverses (optionnel)
  - "../02-brainstorms/2026-03-15_v17_BRAINSTORM_cognitive-flow_DRAFT.md"
tags: [cognition, kernel, v17]
---
```

**Champs obligatoires** : `type`, `version`, `status`, `title`, `created`. Autres optionnels mais recommandés.

**Convergence nom + front-matter** : le `status:` YAML **doit** matcher le `_STATUS` suffix du nom de fichier (cohérence forcée par `check_docs_lifecycle.py`).

---

## §7 — Section AGENTS.md à ajouter (DRAFT)

Append après la section 2 (`## ⚠️ ANTI-PATTERN — Appels tool write()`) :

```markdown
## ⚠️ ORG — Organisation, Nommage, LIFECYCLE (Phase 3)

### Règle 1 — Tout fichier .md suit la screaming architecture
Voir `doc/plans/2026-07-03_PLAN_SCREAMING-ARCHITECTURE-PHASE3.md`. En résumé :
- `doc/00-kernel/` — invariants (KERNEL, BIBLE, PHILOSOPHY).
- `doc/01-specs/` — specs frozen (PRD, EXIGENCES).
- `doc/02-brainstorms/` — exploration divergente (avant plans).
- `doc/03-plans/` — plans committed (Phase 0/1/2/3).
- `doc/04-tests/` — protocoles + résultats.
- `doc/05-audits/` — forensique.
- `doc/06-artifacts/` — POC outputs.
- `doc/07-mutations/` — incréments.
- `doc/_legacy/` — quarantaine (naming libre, non-enforced).

### Règle 2 — Naming canonique
Format : `{YYYY-MM-DD}_v{N}_{TYPE}_{SLUG}_{STATUS}.md`.
Regex : `^[0-9]{4}-[0-9]{2}-[0-9]{2}_v(15|16|17|18|all)_(KERNEL|SPEC|BIBLE|PRD|RECETTE|BRAINSTORM|PLAN|TEST|AUDIT|ARTIFACT|MUTATION)_[a-z0-9-]+_(DRAFT|ACTIVE|ARCHIVED|DEPRECATED)\.md$`

### Règle 3 — LIFECYCLE parmi {DRAFT, ACTIVE, ARCHIVED, DEPRECATED}
Suffixe nom + YAML `status:` doivent matcher. Pas d'états supplémentaires (`WIP`, `LEGACY`, etc.) — utiliser DRAFT/ARCHIVED.

### Règle 4 — Front-matter YAML obligatoire (sauf README/AGENTS/KERNEL)
Tout nouveau .md dans `doc/{00-kernel,01-specs,02-brainstorms,03-plans,04-tests,05-audits,06-artifacts,07-mutations}/` doit avoir front-matter (voir §6).

### Règle 5 — Avant de créer un fichier, pose 3 questions
1. **Quelle phase cognitive est-ce ?** (kernel / spec / brainstorm / plan / test / audit / artifact / mutation)
2. **Quel statut ?** (DRAFT / ACTIVE / ARCHIVED / DEPRECATED)
3. **Quelle version ?** (v15 / v16 / v17 / v18 / all)

Tes 3 réponses = `{TYPE}_{STATUS}_v{N}` = chemin unique.

### Règle 6 — Enforcement
`scripts/check_docs_lifecycle.py` valide tout nouveau fichier hors `_legacy/` selon §4 + §6. Run pre-commit recommandé (hook à venir).
```

**Note d'intégration** : cette section **n'est PAS** ajoutée à AGENTS.md par ce plan. Elle est documentée comme livrable futur, awaiting user approval.

---

## §8 — Enforcement : `scripts/check_docs_lifecycle.py`

### But
Valider tout fichier `.md` hors `doc/_legacy/`, `node_modules/`, `dist/`, `README.md` (racine dossier), `AGENTS.md`, `KERNEL.md` selon les règles §4 + §6.

### Comportement (CLI)
```
$ ./scripts/check_docs_lifecycle.py            # scan complet
$ ./scripts/check_docs_lifecycle.py --staged   # scan fichiers git-staged uniquement (pre-commit)
$ CI=true ./scripts/check_docs_lifecycle.py    # exit 1 sur hits > 0
```

### Vérifications
1. **Naming regex** : matche §4 regex. Hit si KO.
2. **Front-matter YAML** : présent + parsable. Hit si manquant ou invalide.
3. **Cohérence nom ↔ front-matter** : `status:` YAML doit matcher `_STATUS` du nom de fichier. Hit si KO.
4. **Cohérence nom ↔ dossier** : `2026-03-15_v17_AUDIT_x_ACTIVE.md` dans `doc/05-audits/` ✓. Hit si placé dans `01-specs/`.
5. **Cohérence nom ↔ version** : `v17_` dans nom → `version: v17` dans YAML. Hit si KO.
6. **Statut LIFECYCLE valide** : un parmi `DRAFT/ACTIVE/ARCHIVED/DEPRECATED`. Hit sinon.

### Tech
- Python `pathlib` (UTF-8 safe, espaces OK) — leçon Phase 2 awk-bug.
- `click` ou `argparse` natif.
- Pas de dépendance exotique (juste `pyyaml`).
- Idempotent : run N fois = même output.

### Preview (1er sample d'exécution)
```
$ ./scripts/check_docs_lifecycle.py
[INFO] scan: 4 fichiers hors _legacy/, 230 quarantained in _legacy/
[OK]   doc/03-plans/2026-07-03_v17_PLAN_screaming-arch_DRAFT.md : match §4 + §6
[OK]   README.md : exempt (racine listée exception §4.4)
[HIT] doc/EXPANSE-BIBLE-Resurrection.md : pas de préfixe ISO-date (legacy non-conforme)
   → propose migration vers doc/_legacy/bible-misc/EXPANSE-BIBLE-Resurrection.md
[HIT] doc/PROMPT-XX.md : front-matter YAML manquant
   → propose add front-matter + rename vers §4
[SUMMARY] 2 hits / 4 scannés
```

### Status par défaut
**WARN-only** (exit 0 en mode local; exit 1 si `CI=true`). Le user decide quand promote WARN → STRICT (post-migration _legacy/ complet).

---

## §9 — Migration 6 étapes (proposal)

### Étape 1 — Décision utilisateur
User approuve le plan OU propose adjustments. Pas de code-touch avant ça.

### Étape 2 — Commit règles AGENTS.md
- 1 commit : `chore(AGENTS): append §3 ORG Section` avec le contenu §7 brut.

### Étape 3 — Commit script d'enforcement
- 1 commit : `feat(check_docs_lifecycle): Phase 3 enforcement` avec `scripts/check_docs_lifecycle.py` (run mode WARN).

### Étape 4 — Quarantaine _legacy/
- 1 commit : `refactor(doc): create _legacy/ + quarantine outdated files`
- Déplacer les 24 fichiers racine `doc/*.md` (non-Phase-3-conformes) vers `doc/_legacy/`.
- Déplacer `doc/{audits,plans,tests,artifacts,challenges,mutations}/` entiers vers `doc/_legacy/by-type/{audits,plans,...}/` (preserves structure).
- Ces fichiers conservent leur naming original (lisibles, traçables, mais exempts d'enforcement).

### Étape 5 — Création squelette nouveau
- 1 commit : `feat(doc): scaffold Phase 3 screaming-arch skeleton`
- `mkdir doc/{00-kernel,01-specs,02-brainstorms,03-plans,04-tests,05-audits,06-artifacts,07-mutations}/`
- `touch doc/{01..07}-* /README.md` (1 README par sous-dossier, explique placement).

### Étape 6 — Migration opportuniste
- **PAS** de migration bulk du stock existant.
- Quand un agent/user consulte un fichier legacy et l'est utile → il est migré vers le nouveau namespace + renommé selon §4.
- Critère : « si on l'édite, on le migre ». Pas de bulk-edit.

### Total commits Phase 3 = 5 (étapes 2-5 + tag).

### Effort réaliste
- Étape 2 : ~5min (1 edit AGENTS.md).
- Étape 3 : ~30min (script Python + tests manuels).
- Étape 4 : ~20min (mv récursifs via `reconcile_audit.py`-style Python script).
- Étape 5 : ~10min (mkdir + 7 mini-READMEs).
- Étape 6 : permanent, opportuniste (effort amorti dans le temps).

**Total Phase 3 = ~1h + 5 commits + 1 tag**.

---

## §10 — Décisions stratégiques en attente

Le user doit trancher avant exécution §9 :

1. **Option A confirmée ?** (vs B / C / nouveau D)
2. **Statuts granulaires** : 4 états (DRAFT/ACTIVE/ARCHIVED/DEPRECATED) acceptés ?
3. **AGENTS.md §3 (~80 lignes) OK** ou le contenu doit-il être dans un fichier séparé `CONVENTIONS.md` référencé ?
4. **Migration bulk ou opportunistic** ? (étape 6 = opportunistic proposé)
5. **Quarantaine `_legacy/` ou literal move to namespaces** ? (ex. déplacer chaque `doc/plans/X.md` vers `doc/03-plans/X-renamed.md` en bloc — lourd)

---

## §11 — Suite immédiate

### Action 0 (attente user)
- User review ce plan (lecture ~10min).
- Réponse aux 5 questions §10.

### Action 1 (post-approval, ~30min)
- Commit §9.2 (AGENTS.md §3) + §9.3 (script enforcement) en série.
- Tag `v0.6.0-prep` (Phase 3 scaffolding posé).

### Action 2 (post-Phase-3-ship)
- Migration opportuniste au fil de l'eau.
- `check_docs_lifecycle.py` en mode WARN pendant 1 mois, puis promote STRICT (CI gate) à `v0.7.0`.

### Action 3 (long terme)
- Hook pre-commit (git) qui run `check_docs_lifecycle.py --staged` avant chaque commit.
- Script `archive_drafts.py` qui detecte les DRAFT >6 mois sans promotion et suggère `→ ARCHIVED`.

---

