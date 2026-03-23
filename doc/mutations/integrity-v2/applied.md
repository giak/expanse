# MUTATION APPLIED: integrity-v2

**Date Proposal:** 2026-03-21
**Date Application:** 2026-03-21 23:24
**Approved by:** User
**Applied by:** Dream

**Proposal:** /home/giak/projects/expanse/doc/mutations/integrity-v2/proposal.md
**Backup:** /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-21-integrity-v2-backup.md

---

## Diff Appliqué
```diff
-4. **TRANSACTIONAL INTEGRITY** : Toute modification des fichiers du noyau (/runtime/*.md) DOIT être précédée d'un [PROPOSAL_OPEN] archivé dans /doc/mutations/{slug}/ et validée par /apply.
+4. **TRANSACTIONAL INTEGRITY** [STRICT] : Toute modification du noyau (/runtime/*.md) sans [PROPOSAL_OPEN] archivé et validation `/apply` est une FAUTE PROTOCOLAIRE entraînant un reset immédiat de la tâche.
```

---

## Vérification
- [x] Boot suivant fonctionne (n/a session active)
- [x] Signal Ψ [V15 ACTIVE] correct
- [x] Section Ⅳ intacte

---

## Rollback
bash(command: "cat /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-21-integrity-v2-backup.md > /home/giak/projects/expanse/runtime/expanse-v15-apex.md")
