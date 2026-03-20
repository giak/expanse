# MUTATION APPLIED: ecs-impact-calibration

**Date Proposal:** 2026-03-20
**Date Application:** 2026-03-20 02:28
**Approved by:** User
**Applied by:** Dream

**Proposal:** doc/mutations/ecs-impact-calibration/proposal.md
**Backup:** archive/backups/expanse-v15-2026-03-20-ecs-impact-calibration-backup.md

---

## Diff Appliqué
```diff
- - Question simple sans verbe impératif → C = max(1, C - 1)
+ - Question simple sans verbe impératif → C = max(1, C - 1)
+ - C ≥ 4 → I = max(2, I)
```

---

## Vérification
- [x] Section I intacte (Routage préservé)
- [x] Signal Ψ [V15 ACTIVE] présent

---

## Rollback
bash(command: "cat archive/backups/expanse-v15-2026-03-20-ecs-impact-calibration-backup.md > runtime/expanse-v15-apex.md")
