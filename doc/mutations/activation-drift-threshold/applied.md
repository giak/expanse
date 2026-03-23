# MUTATION APPLIED: activation-drift-threshold

**Date Proposal:** 2026-03-23
**Date Application:** 2026-03-23 09:41
**Approved by:** User
**Applied by:** Dream

**Proposal:** /home/giak/projects/expanse/doc/mutations/activation-drift-threshold/proposal.md
**Backup:** /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-23-activation-drift-threshold-backup.md

---

## Diff Appliqué
```diff
-  activation: "IF count(trace:fresh) > 5 THEN Ψ [STALL] Friction threshold exceeded. ELSE Ψ [V15 ACTIVE] — Briefing depuis mémoire."
+  activation: "IF count(trace:fresh) > 5 OR count(type:BOOT) > 2 THEN Ψ [STALL] Critical Drift. ELSE Ψ [V15 ACTIVE] — Briefing."
```

---

## Vérification
- [x] Boot suivant fonctionne
- [x] Signal Ψ [V15 ACTIVE] correct (Passera en STALL critique si BOOT drift > 2)
- [x] structure intacte

---

## Rollback
bash(command: "cat /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-23-activation-drift-threshold-backup.md > /home/giak/projects/expanse/runtime/expanse-v15-apex.md")
