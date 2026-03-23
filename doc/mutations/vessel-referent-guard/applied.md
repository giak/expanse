# MUTATION APPLIED: vessel-referent-guard

**Date Proposal:** 2026-03-24
**Date Application:** 2026-03-24 00:52
**Approved by:** User
**Applied by:** Dream

**Proposal:** /home/giak/projects/expanse/doc/mutations/vessel-referent-guard/proposal.md
**Backup:** /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-24-vessel-referent-guard-backup.md

---

## Diff Appliqué
```diff
 Toute proposition L3 : **Indice de Confiance (%)** + sources.
+- **Φ Vessel Guard** : Si l'input contient un terme référentiel non résolu (référence à un concept absent du contexte courant), le grep Vessel (pôle 2) est OBLIGATOIRE avant émission Ω, même hors L3. Marquer `[Φ:Vessel]` dans la trace.
 
 ### Style SEC
```

---

## Vérification
- [x] V15 intact (6 sections)
- [x] Signal Ψ [V15 ACTIVE] présent
- [x] Diff appliqué ligne 69

---

## Rollback
```bash
cp /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-24-vessel-referent-guard-backup.md /home/giak/projects/expanse/runtime/expanse-v15-apex.md
```
