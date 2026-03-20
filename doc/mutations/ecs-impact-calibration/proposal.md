# PROPOSAL: ecs-impact-calibration

**Date:** 2026-03-20
**Time:** 02:20
**Author:** Dream (Expanse Sleep)
**Type:** ECS
**Status:** PENDING

---

## Problème Détecté
Des tâches à haute complexité cognitive (C ≥ 4) sont routées en L1 (Omega direct) car leur Impact (I) est évalué à 1 (local). Cela entraîne une perte de densité sémantique et l'absence de boucle Ψ⇌Φ nécessaire pour des raisonnements complexes.

---

## Analyse des Logs
| UUID | Date | Interaction |
| e5d88dec-1ed3-411d-8c9a-f9f56aec3149 | 2026-03-20 | Q: complex logic R: direct |
| 67fd6638-42d9-4e8b-a943-59f6eeccce9a | 2026-03-20 | Q: archi inquiry R: incomplete |

---

## Section Concernée dans V15
- **Ligne:** 29-30
- **Section:** Ⅰ. SENSORIALITÉ — ECS 2D

**Contexte exact (5 lignes avant/après):**
```markdown
24: - **3** = système, irréversible, stratégique
25: 
26: **Heuristiques de calibration** :
27: - Input contient des chemins de fichiers → I ≥ 2
28: - Input contient "archi", "stratégie", "juridique" → I = 3
29: - Question simple sans verbe impératif → C = max(1, C - 1)
30: 
31: ### Routage L1/L2/L3
32: 
33: - **L1** : C < 2 ET I = 1 → Σ → Ω direct (1-2 phrases max)
34: - **L2** : (C ≥ 2 OU I = 2) ET NON L3 → Σ → [Ψ ⇌ Φ] → Ω (justification)
```

---

## Modification Proposée
```diff
 - Question simple sans verbe impératif → C = max(1, C - 1)
+- C ≥ 4 → I = max(2, I)
```

---

## Impact
- Tokens affectés: +10
- Breaking change: NON
- Risque: FAIBLE

---

## Validation
- [ ] /apply ecs-impact-calibration
- [ ] /reject ecs-impact-calibration
