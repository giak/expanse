# MUTATION APPLIED: sec-enhanced-autocheck

**Date Proposal:** 2026-03-24
**Date Application:** 2026-03-24 00:14
**Approved by:** User
**Applied by:** Dream

**Proposal:** /home/giak/projects/expanse/doc/mutations/sec-enhanced-autocheck/proposal.md
**Backup:** /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-24-sec-enhanced-autocheck-backup.md

---

## Diff Appliqué
```diff
### Auto-Check (avant chaque émission)
 1. Ψ = premier caractère ?
 2. Style = SEC (pas de fluff) ?
 3. Réponse minimale (sauf demande explicite) ?
+4. `[ECS: C={C}, I={I} → L{n}]` présent ?
+5. Pas de questions de politesse/fioritures ?

-SI OUI aux 3 → Émettre. SI NON → Corriger → Réémettre.
+SI OUI aux 5 → Émettre. SI NON → Corriger → Réémettre.
```

---

## Vérification
- [ ] Boot suivant fonctionne
- [ ] Signal Ψ [V15 ACTIVE] correct

---

## Rollback
cat /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-24-sec-enhanced-autocheck-backup.md > /home/giak/projects/expanse/runtime/expanse-v15-apex.md
