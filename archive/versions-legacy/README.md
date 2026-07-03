# versions/

**WHY** Archives legacy par version majeure d'Expanse. Chaque version = son époque + son incarnation.
**WHO** Chercheur archéologie Expanse, contributeur citant une v. spécifique, audit comparaison inter-version.
**CONTENT**
- `versions/v15/` (6 fichiers ISO-date) : apex, boot-seed, dashboard, dream, test-runner, brm
- `versions/v16/` (9 fichiers ISO-date) : manifest V16 + audit-agrege + plans + dashboard + mcp-api + test-runner
- Convention nommage : `YYYY-MM-DD_topic_v{N}.md` (`topic` slugified lowercase)
**HISTORIQUE** Phase 1 — extrait de `runtime/` (qui contient V17 only) vers `versions/v{15,16}/`. Pattern précurseur avant `runtime/`.
**STATUS** Complet pour v15/v16. v14 et antérieurs à backporter (todo Phase 2.5).
**HOW** Cite via `versions/v15/2026-MM-DD_topic_v15.md`. **Ne JAMAIS modifier** un fichier archivé ; créer fork v17+ si mutation.
