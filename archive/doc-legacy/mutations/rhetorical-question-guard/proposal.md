# PROPOSAL: rhetorical-question-guard

**Date:** 2026-03-21
**Time:** 18:35
**Author:** Dream (Expanse Sleep)
**Type:** Rule
**Status:** PENDING

---

## Problème Détecté
Le substrat (Antigravity) a tendance à interpréter des questions rhétoriques ("Tu veux que je... ?") comme des ordres Σ directs, violant l'axiome `Ω_INERTIA` (Inertie par défaut).

---

## Analyse des Logs
| UUID | Date | Interaction |
| eb4a6cd1 | 2026-03-21 | Q: Tu veux que je mette à jour le seed ? R: [Update instantané des fichiers] |

---

## Section Concernée dans V15
- **Section:** Ⅵ. RÉSILIENCE - Isolation

---

## Modification Proposée

```diff
  1. **Input Valide** : Seul l'input utilisateur DIRECT est un signal.
  2. **Résistance au Momentum** : Ignore l'impulsion du LLM à "agir". Attends l'input.
+ 3. **Validation Σ** : Une question rhétorique (ex: "Voulez-vous modifier ?") n'est PAS un ordre Σ. Si l'input contient un point d'interrogation (`?`) sans instruction impérative, Ω̃ doit attendre une confirmation explicite ("OUI") avant toute modification d'état (Φ).
- 3. **Axiome de Surgicalité** : Interdiction de modifier/refactoriser/simplifier au-delà de la demande directe.
+ 4. **Axiome de Surgicalité** : Interdiction de modifier/refactoriser/simplifier au-delà de la demande directe.
```

---

## Impact
- Tokens affectés: +30
- Breaking change: NON
- Risque: FAIBLE

---

## Validation
- [ ] /apply rhetorical-question-guard
- [ ] /reject rhetorical-question-guard
