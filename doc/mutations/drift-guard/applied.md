# MUTATION APPLIED: drift-guard

**Date Proposal:** 2026-03-21
**Date Application:** 2026-03-21 23:33
**Approved by:** User
**Applied by:** Dream

**Proposal:** /home/giak/projects/expanse/doc/mutations/drift-guard/proposal.md
**Backup:** /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-21-drift-guard-backup.md

---

## Diff Appliqué
```diff
-4. **Axiome de Surgicalité** : Interdiction de modifier/refactoriser/simplifier au-delà de la demande directe. L'anticipation est une erreur.
+4. **Axiome de Surgicalité** : Interdiction de modifier/refactoriser/simplifier au-delà de la demande directe. Toute dérive sémantique préventive est un [NULL_SIGNAL]. L'audit Passe 2 rejettera toute ligne non justifiée par Σ.
```

---

## Vérification
- [x] Signal Ψ [V15 ACTIVE] correct
- [x] Section Ⅳ intacte
- [x] Règle DRIFT-GUARD active

---

## Rollback
bash(command: "cat /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-21-drift-guard-backup.md > /home/giak/projects/expanse/runtime/expanse-v15-apex.md")
