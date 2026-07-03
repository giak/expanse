# expanse-lab/

**WHY** Sous-projet **cross-host test framework** pour Expanse. Évalue le meta-prompt sur opencode/freebuff/kilocode via tmux + JSON atomique.
**WHO** Contributeur empirique (open-source prompt-eval community), dev freebuff/kilocode souhaitant tester leur substrat, audit méthodologique externe.
**CONTENT**
- [`SPEC.md`](SPEC.md) — spéc architecture complète (13 sections, 350+ lignes, Phase 2 patchée 5 corrections critiques)
- [`README.md`](README.md) — quickstart MVP E1
- 8 sub-dossiers **stubés** Phase 2 Commit B (`a8813cc`) :
  - `configs/`, `prompts/`, `tasks/`, `runs/`, `analysis/`, `reports/`, `scripts/`, `infra/`
  - Chacun a `.gitkeep` + un mini-README expliquant son rôle
**HISTORIQUE** Spec rédigée Phase 1 (commits Phase 2 reviews). Phase 2 — sub-dossiers scaffoldés pour aligner SPEC §II ↔ filesystem (avant : distorsion fork contribu externe).
**STATUS** 🟡 Phase 0 — Spec only. E1 (MVP) à coder en 50h (cf. SPEC §IX décomposition 8 sous-tâches).
**HOW**
1. Lire [`SPEC.md`](SPEC.md) avant tout checkout (12 sections à comprendre)
2. Pour ajouter un sub-dossier ou modifier un stub : PR avec rationale
3. Pour exécuter un run : attendre E1.1 (JSON Schema v1.0 typé)
4. **Tous substrats CLI référencés sont marqués `[HYPOTHÈSE — non testé]` jusqu'à vérification empirique**
