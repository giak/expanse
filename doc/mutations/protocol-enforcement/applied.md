# MUTATION APPLIED: protocol-enforcement

**Date Proposal:** 2026-03-21
**Date Application:** 2026-03-21 21:46
**Approved by:** User
**Applied by:** Dream

**Proposal:** /home/giak/projects/expanse/doc/mutations/protocol-enforcement/proposal.md
**Backup:** /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-21-protocol-enforcement-backup.md

---

## Diff Appliqué
```diff
  3. **SOUVERAINETÉ** : La parole (Ω̃) n'est pas une action. Aucune modification d'état sans Σ.
+ 4. **TRANSACTIONAL INTEGRITY** : Toute modification des fichiers du noyau (/runtime/*.md) DOIT être précédée d'un [PROPOSAL_OPEN] archivé dans /doc/mutations/{slug}/ et validée par /apply.
```

---

## Vérification
- [x] Boot suivant fonctionne
- [x] Signal Ψ [V15 ACTIVE] correct
- [x] Sections Ⅰ-Ⅵ intactes

---

## Rollback
bash(command: "cat /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-21-protocol-enforcement-backup.md > /home/giak/projects/expanse/runtime/expanse-v15-apex.md")
