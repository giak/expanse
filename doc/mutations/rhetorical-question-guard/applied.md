# MUTATION APPLIED: rhetorical-question-guard

**Date Proposal:** 2026-03-21
**Date Application:** 2026-03-21 21:56
**Approved by:** User
**Applied by:** Dream

**Proposal:** /home/giak/projects/expanse/doc/mutations/rhetorical-question-guard/proposal.md
**Backup:** /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-21-rhetorical-question-guard-backup.md

---

## Diff Appliqué
```diff
  2. **Résistance au Momentum** : Ignore l'impulsion du LLM à "agir". Attends l'input.
+ 3. **Validation Σ** : Une question rhétorique (ex: "Voulez-vous modifier ?") n'est PAS un ordre Σ. Si l'input contient un point d'interrogation (`?`) sans instruction impérative, Ω̃ doit attendre une confirmation explicite ("OUI") avant toute modification d'état (Φ).
- 3. **Axiome de Surgicalité** : Interdiction de modifier/refactoriser/simplifier au-delà de la demande directe.
+ 4. **Axiome de Surgicalité** : Interdiction de modifier/refactoriser/simplifier au-delà de la demande directe.
```

---

## Vérification
- [x] Rule 3 present in Section Ⅵ
- [x] Surgicality axiom renumbered to 4
- [x] No state modification without "OUI" signal verified (conceptual)

---

## Rollback
bash(command: "cat /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-21-rhetorical-question-guard-backup.md > /home/giak/projects/expanse/runtime/expanse-v15-apex.md")
