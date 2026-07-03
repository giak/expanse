# doc/

**WHY** Documentation centrale du projet Expanse : manifests, philosophy, audits, plans, tests, artifacts, brainstorms, recettes.
**WHO** Contributeur fork, chercheur Expanse interne, audit externe tierce partie.
**CONTENT**
- racine : `EXPANSE-BIBLE-Resurrection.md`, `expanse-architecture.md`, `EXPANSE V{7,14.3,15} — Comment ça Marche.md`, `EXPANSE V14.3 — Pour les Débutants.md`, `expanse-v17-{brainstorm,recette,recette-response,recette-response-pure}.md`, `EXPANSE-vs-SOFTWARE-3.0.md`, `audit-prompt-v16{,-contre-audit,-rapport}.md`, `2026-07-02_PLAN-RECONSTRUCTION-FROM-SCRATCH.md`, `DASHBOARD.md`
- `audits/` (~130 fichiers) : audits fusionnés Phase 2 (`audit/`/`audits/` → `audits/` via `scripts/reconcile_audit.py`)
- `plans/` (~87 fichiers), `tests/` (~10), `artifacts/` (~18), `challenges/` (3), `mutations/` (1)
**HISTORIQUE** Phase 1 : renames ISO-date dans runtime/, migration v15/v16 → versions/. Phase 2 (current) : fusion audit/audits + ce README.
**STATUS** Partiellement réorg-anisé. Sub-dir regroupement (core/, philosophy/, process/, meta/) reste à faire.
**HOW** Liens inter-fichiers nombreux ; `./scripts/check-broken-links.sh` comme filet de sécurité.
