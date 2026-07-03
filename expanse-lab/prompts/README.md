# prompts/

**WHY** Expanse snapshots testés, versionnés par sha256. Chaque run référence le snapshot exact, garant d'isomorphism.
**WHO** Runner (snapshot_inputs), analyste post-hoc, contributeur fork.
**HOW** Dépose `expanse-v17.6.md` + `expanse-v17.6.md.sha256` ; le runner lit VIA sha256.
**EXAMPLE** `prompts/baseline-minimal.md` (30 tok) vs `prompts/expanse-v17.6.md` (330 tok).
**STATUS** Phase 0 — ghost stub. Réels prompts post-E1.1.
**SOURCE** SPEC.md §II.
