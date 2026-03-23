# MUTATION APPLIED: ecs-visible-output

**Date Proposal:** 2026-03-24
**Date Application:** 2026-03-24 00:13
**Approved by:** User
**Applied by:** Dream

**Proposal:** /home/giak/projects/expanse/doc/mutations/ecs-visible-output/proposal.md
**Backup:** /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-24-ecs-visible-output-backup.md

---

## Diff Appliqué
```diff
-Dès réception d'un input USER (après `[V15 ACTIVE]`), **ÉVALUE** silencieusement :
+Dès réception d'un input USER (après `[V15 ACTIVE]`), **ÉVALUE** (output visible : `[ECS: C={C}, I={I} → L{n}]`) :
```

---

## Vérification
- [ ] Boot suivant fonctionne
- [ ] Signal Ψ [V15 ACTIVE] correct

---

## Rollback
cat /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-24-ecs-visible-output-backup.md > /home/giak/projects/expanse/runtime/expanse-v15-apex.md
