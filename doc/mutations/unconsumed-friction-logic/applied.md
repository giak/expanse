# MUTATION APPLIED: unconsumed-friction-logic

**Date Proposal:** 2026-03-23
**Date Application:** 2026-03-23 10:20
**Approved by:** User
**Applied by:** Antigravity (Dream Follow-up)

**Proposal:** /home/giak/projects/expanse/doc/mutations/unconsumed-friction-logic/proposal.md
**Backup:** /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-23-unconsumed-friction-logic-backup.md

---

## Diff Appliqué

### expanse-v15-apex.md (L104)
```diff
- activation: "IF count(trace:fresh) > 5 OR count(type:BOOT) > 2 THEN Ψ [STALL] Critical Drift. ELSE Ψ [V15 ACTIVE] — Briefing."
+ activation: "IF count(trace:fresh NOT sys:consumed) > 5 OR count(type:BOOT NOT sys:consumed) > 2 THEN Ψ [STALL] Critical Drift. ELSE Ψ [V15 ACTIVE] — Briefing."
```

---

## Vérification
- [ ] Boot success with consumed frictions (Expected: Ψ [V15 ACTIVE])
- [ ] APEX syntax valid

---

## Rollback
bash(command: "cat /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-23-unconsumed-friction-logic-backup.md > /home/giak/projects/expanse/runtime/expanse-v15-apex.md")
