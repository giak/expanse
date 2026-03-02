# ECS — Evaluation of Cognitive Complexity

> Comment EXPANSE évalue l'effort nécessaire.

## Purpose

ECS selon KERNEL.md Section VI :

> "Avant de lancer le Flux, Σ DOIT évaluer l'effort nécessaire. C'est l'ECS :
> - Si (C < 2.5) : Réponse immédiate. Densité légère.
> - Si (C ≥ 2.5) : Activation immédiate de la boucle Φ. Le monde doit être palpé."

ECS doit :
1. Calculer C (complexité)
2. Router vers lightweight ou structured
3. (Optionnel) Adapter les weightsdynamiquement

## Current

### Fichier

`prompts/sigma/detect_ecs.md`

### Formule

```python
C = (ambiguity + knowledge + reasoning + tools) / 4
```

### Dimensions

| Dimension | Description | Range |
|----------|-------------|-------|
| ambiguity | Ambigüité de l'input | 0-4 |
| knowledge | Connaissance requise | 0-4 |
| reasoning | Complexité de raisonnement | 0-4 |
| tools | Outils nécessaires | 0-4 |

### Routing

```python
IF C < 2.5:
    mode = "lightweight"
    # Σ → Ω → Μ
ELSE:
    mode = "structured"
    # Σ → [Ψ ⇌ Φ] → Ω → Μ
```

## Gap

### Gap 1 : Weights fixes
- **Current** : 4 dimensions, weights égaux
- **KERNEL** : "Poids adaptatifs : stockés dans Mnemolite si ecs_dyn=true"
- **Gap** : Pas de learning sur les prédictions

### Gap 2 : C = moyenne brute
- **Current** : C = (a+k+r+t)/4
- **KERNEL** : "ECS weights adaptatifs"
- **Gap** : Pas de weighted average

### Gap 3 : Pas de feedback
- **Current** : C calculé, puis oublié
- **KERNEL** : feedback_loop.md → "ECS Weight Update"
- **Gap** : Pas de comparison predicted vs actual

### Gap 4 : Calibration absente
- **Current** : Pas de calibration
- **KERNEL** : "Après 50 usages" → analyser
- **Gap** : Pas de tracking de précision

### Gap 5 : C continu
- **Current** : Seuil 2.5 = binaire
- **KERNEL** : Nuances selon contexte
- **Gap** : Pas de gradation

## Objectives

1. [ ] Implémenter ECS dynamique (weights dans Mnemolite)
2. [ ] Ajouter feedback (predicted vs actual C)
3. [ ] Calibration après N usages
4. [ ] Ajouter gradation (pas que binaire)

## Next Steps (Baby Step)

- [ ] Lire feedback_loop.md → voir ECS weight update
- [ ] Implémenter stockage weights dans Mnemolite
- [ ] Tester sur 10 requêtes → comparer C prédit vs réel
