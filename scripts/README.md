# scripts/

**WHY** Helpers système du projet — vérification de cohérence, réconciliation, audit structurel.
**WHO** Dev opère sur la structure du repo, automation CI/CD, contributeur qui ajoute un helper.
**CONTENT**
- `check-broken-links.sh` : audit cross-refs (avert. par défaut, mode `CI=true` exit 1)
- `reconcile_audit.py` : fusion idempotente `doc/audit/` → `doc/audits/` (pathlib UTF-8 safe, dry-run support)
**HISTORIQUE** Phase 1 — `check-broken-links.sh` livré comme filet de sécurité après réorg massif non-déclaré gitignored (**PHASE 1 n'avait pas engagé ce script !**; restauré Phase 2 commit 92a58d8). Phase 2 — `reconcile_audit.py` ajouté pour achever la fusion audit/audits après l'échec awk-dep des bash initiaux.
**STATUS** ✅ Actifs. À enrichir (idées : schema validation, ISO-date lint, forbidden-words scan).
**HOW**
- `./scripts/check-broken-links.sh` (ou `CI=true ./scripts/check-broken-links.sh` pour CI)
- `python3 scripts/reconcile_audit.py --dry-run` pour preview avant commit
