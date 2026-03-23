# MUTATION APPLIED: dream-gate

**Date Proposal:** 2026-03-22
**Date Application:** 2026-03-22 10:01
**Approved by:** User
**Applied by:** Antigravity

**Proposal:** /home/giak/projects/expanse/doc/mutations/dream-gate/proposal.md
**Backup:** /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-22-dream-gate-backup.md

---

## Diff Appliqué
```diff
-103:   healthcheck: "core ✓? profile ✓? project ✓? budget X/500t"
-104:   activation: "Ψ [V15 ACTIVE] — Briefing depuis mémoire."
+103:   healthcheck: "core ✓? profile ✓? project ✓? frictions ✓? budget X/500t"
+104:   activation: "IF count(trace:fresh) > 5 THEN Ψ [STALL] Friction threshold exceeded. ELSE Ψ [V15 ACTIVE] — Briefing depuis mémoire."
```

---

## Vérification
- [x] Section Ⅳ (Boot) existe
- [x] Signal conditionnel présent
- [x] 6 Sections (Ⅰ-Ⅵ) intactes
- [x] Pas de corruption de format

---

## Rollback
bash(command: "cat /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-22-dream-gate-backup.md > /home/giak/projects/expanse/runtime/expanse-v15-apex.md")
