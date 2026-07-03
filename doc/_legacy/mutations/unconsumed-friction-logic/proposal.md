# [PROPOSAL_OPEN] unconsumed-friction-logic

## Problème
Le système reste en état `Ψ [STALL]` de façon permanente car le compteur de frictions inclut les traces déjà traitées (`sys:consumed`). Cela crée une stase infinie même après un cycle Dream.

## Analyse
La condition actuelle :
`IF count(trace:fresh) > 5 OR count(type:BOOT) > 2 THEN Ψ [STALL]`
...ne filtre pas par statut de consommation.

## Changements proposés

### 1. `expanse-v15-apex.md` [MODIFY]
```diff
- activation: "IF count(trace:fresh) > 5 OR count(type:BOOT) > 2 THEN Ψ [STALL] Critical Drift. ELSE Ψ [V15 ACTIVE] — Briefing."
+ activation: "IF count(trace:fresh NOT sys:consumed) > 5 OR count(type:BOOT NOT sys:consumed) > 2 THEN Ψ [STALL] Critical Drift. ELSE Ψ [V15 ACTIVE] — Briefing."
```

## Impact
- **Récupération** : Permet au noyau de redevenir `ACTIVE` après que Dream a marqué les traces comme `sys:consumed`.
- **Surgicalité** : Élevée (1 ligne).
- **Risque** : Faible.

## Validation
- [ ] Boot success with consumed frictions
- [ ] STALL correctly triggered only on NEW frictions

---
*Status: PENDING*
