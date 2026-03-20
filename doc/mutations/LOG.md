# MUTATION LOG — EXPANSE V15

**Last Updated:** 2026-03-18
**Version:** 2.1

---

## Statistiques

| Métrique | Count |
|----------|-------|
| Total Proposals | 5 |
| Applied | 4 |
| Rejected | 0 |
| Failed | 0 |
| Rolled Back | 1 |
| Pending | 0 |

---

## Historique

| Date | Slug | Type | Status | Applied By |
|------|------|------|--------|-----------|
| 2026-03-19 | crystallization-guard | Rule | ROLLED_BACK | Dream |
| 2026-03-19 | crystallization-guard-surgical | Rule | APPLIED | Dream |
| 2026-03-19 | surgical-integrity-protocol | Rule | APPLIED | Dream |
| 2026-03-20 | ecs-impact-calibration | ECS | APPLIED | Dream |
| 2026-03-20 | boot-parallel-sync | BOOT | APPLIED | Dream |

---

## Applied Mutations
| Date | Slug | Type | Status | Applied By |
|------|------|------|--------|-----------|
| 2026-03-19 | crystallization-guard-surgical | Rule | APPLIED | Dream |
| 2026-03-19 | surgical-integrity-protocol | Rule | APPLIED | Dream |
| 2026-03-20 | boot-parallel-sync | BOOT | APPLIED | Dream |
| 2026-03-20 | ecs-impact-calibration | ECS | APPLIED | Dream |

---

## Rejected Mutations

(Aucune mutation rejetée pour le moment)

---

## Failed Mutations

(Aucune mutation échouée pour le moment)

---

## Pending Proposals

(Aucune proposition en attente)

---

## Rollback Log

| Date | Slug | Reason | Restored |
|------|------|--------|----------|
| 2026-03-19 | crystallization-guard | Non-surgical / Unnecessary | V15.0 |


---

## Commandes

| Commande | Action |
|----------|--------|
| `/seal {slug}` | Appliquer une mutation |
| `/reject {slug}` | Rejeter une mutation |
| `/rollback {slug}` | Inverser une mutation |
| `/mutations` | Afficher ce LOG |
| `/proposals` | Lister les proposals en attente |
| `/diff {slug}` | Afficher le diff d'une mutation |

---

## Archives

Les backups de V15 sont stockés dans `_archives/`

Format: `expanse-v15-YYYY-MM-DD-{slug}-backup.md`

---

## Lock

Un fichier `.lock` existe dans `doc/mutations/` quand une mutation est en cours.

---

*Log v2.1 - 2026-03-18*
