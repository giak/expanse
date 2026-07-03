# skills/

**WHY** Skills système utilisées par les agents sub-spawn (Buffy, autres Codebuff). Bibliothèque de capacités.
**WHO** Dev agents, contributeur skill, maintainer Buffy/Codebuff.
**CONTENT** — 9 skills trackées :
- `audit` — forensic review de fichiers modifiés
- `brainstorm` — exploration multi-angle pour décision design
- `dispatching-parallel-agents` — lancement multi-agents
- `executing-plans` — exécution séquentielle de plans multi-step
- `proposing-tests` — propose tests après modif code
- `retrospective` — re-analyse d'une session pour apprendre
- `system-read` — lecture system (processus, environnement)
- `writing-plans` — plan mode user-initiated
- `anti-regression` — Phase 2 ajout (gardes anti-répétition erreurs)
**HISTORIQUE** Bibliothèque s'étoffe au fil des phases. `anti-regression` ajoutée Phase 2 (cf. Phase 1 incident délégation récursive).
**STATUS** ✅ 9 skills trackées. READMEs sous chaque dossier skill (à vérifier Phase 2.5).
**HOW**
- Consulter [`SKILL-REGISTRY.md`](SKILL-REGISTRY.md) pour TOC
- Charger via `skill {name}` dans Buffy
- Pour installer une nouvelle skill : `npx skills add <owner/repo> --skill <name> --yes`
