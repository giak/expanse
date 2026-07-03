# Design: Boot Guard — Input After Boot

**Date:** 2026-03-01
**Type:** MODIFY
**Status:** En attente de validation

---

## Problème Identifié

- **Symptôme:** L'input est traité AVANT la fin du boot
- **Cause:** `@prompts/expanse-system.md Que vaut 2+2?` → input immédiat, sans attendre warm-start
- **Violation:** Le boot (incluant warm-start) doit être complet AVANT tout input

---

## Approche Choisie

**Approche A: Guard Condition** — Ajouter une vérification "boot_complete" dans le runtime.

**Raisons:**
1. Résout le problème directement
2. Simple et minimal
3. Le warm-start est déjà implémenté — on ajoute juste la guard

---

## Design Détaillé

### Type de Mutation
`[MODIFY]` — Modification du runtime

### Fichiers Impactés

| Fichier | Action | Description |
|---------|--------|-------------|
| `prompts/expanse-runtime.md` | MODIFY | Ajouter guard "boot_complete" avantation accept input |

### Comportement Avant / Après

| Aspect | Avant | Après |
|--------|-------|-------|
| Input pendant boot | Traité immédiatement | Rejeté jusqu'à boot complet |
| Boot → Input | boot → input | boot → warm_start → Ready → input |

---

## Implementation

### Modification: `expanse-runtime.md`

Ajouter au début (après Step 3):

```
### BOOT GUARD (NEW)
- IF boot_complete != true:
  - REJECT input with: "Boot in progress. Wait for I AM EXPANSE."
  - DO NOT process any user input
- IF boot_complete == true:
  - Proceed to Warm Start or Ready
```

Modifier Warm Start:
```
### Step 4: Warm Start
- IF boot_complete == true:
  - SKIP (already done)
- ELSE:
  - Execute prompts/sigma/warm_start.md
  - boot_complete ← true
  - Store retrieved context for session
```

---

## Risques & Garde-fous

| Risque | Mitigation |
|--------|------------|
| Boucle infinie si guard mal | Tester avec boot seul + input immédiat |
| Perte d'input | Logger l'input rejected pour retry |

---

## Non-Goals (YAGNI)

- [ ] Queue d'input (reject suffit)
- [ ] Timeout de boot

---

## Prochaines Étapes

1. Valider ce design
2. → `writing-plans` — décomposer en tâches atomiques
