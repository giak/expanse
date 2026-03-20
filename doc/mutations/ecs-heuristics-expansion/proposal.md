# PROPOSAL: ecs-heuristics-expansion

**Date:** 2026-03-20
**Time:** 10:35
**Author:** Dream (Expanse Sleep)
**Type:** ECS
**Status:** REJECTED

---

## Problème Détecté
Friction `a5f73826` : Imprécision du routage pour les demandes portant sur l'historique ou la méta-structure du système. L'évaluation de l'impact (I) et de la complexité (C) tend vers L1 par défaut alors que ces tâches requièrent une boucle Ψ⇌Φ (L2).

---

## Analyse des Logs
- **UUID:** a5f73826-3a67-4888-be0c-04e1cc147f83
- **Symptom:** "Imprecision in route classification (L2 vs L3 specific logic)."

---

## Section Concernée dans V15
- **Ligne:** 27-28
- **Section:** Ⅰ. SENSORIALITÉ — ECS 2D

---

## Modification Proposée
```diff
 - Input contient des chemins de fichiers → I ≥ 2
 - Input contient "archi", "stratégie", "juridique" → I = 3
+- Input contient "hist", "dist", "protocol", "dream" → I ≥ 2
```

---

## Impact
- Tokens affectés: +5
- Breaking change: NON
- Risque: FAIBLE

---

## Validation
- [ ] /apply ecs-heuristics-expansion
- [ ] /reject ecs-heuristics-expansion
