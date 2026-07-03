# runs/

**WHY** Outputs horodatés JSON. Atomic writes (jamais de demi-JSON si crash) + idempotent (skip si fichier existe).
**WHO** Runner principal, analyste post-hoc, public release source.
**HOW** `runs/{ISO_DATE}/{substrat}_{model}_{condition}_{task}.json` ; un `summary.json` par set.
**EXAMPLE** `runs/2026-07-03/opencode-v0.9.2_claude-sonnet-4_B_T1a.json`.
**STATUS** Phase 0 — ghost stub. Réels runs post-E1.4 (boucle capture tmux-pane).
**SOURCE** SPEC.md §II + §IV.6 (Record JSON canonique).
