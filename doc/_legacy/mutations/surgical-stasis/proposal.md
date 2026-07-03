# PROPOSAL: surgical-stasis

**Date:** 2026-03-21
**Time:** 22:50
**Author:** Dream (Expanse Sleep)
**Type:** Rule
**Status:** PENDING

---

## Problème Détecté
Anticipation non autorisée sur des questions rhétoriques (3 occurrences). L'agent interprète un "tu veux que je..." comme un ordre d'action Σ, violant Ω_INERTIA.

---

## Analyse des Logs
| UUID | Date | Interaction |
| :--- | :--- | :--- |
| eb4a6cd1 | 2026-03-21 | Σ→[question rhétorique] Ψ→[applique mutation] Φ→[BYPASSED] |

---

## Section Concernée dans V15
- **Ligne:** 204
- **Section:** Ⅵ. RÉSILIENCE - Validation Σ

**Contexte exact (5 lignes avant/après):**
```markdown
199: SI OUI aux 3 → Émettre. **SI NON** → Corriger → Réémettre.
200: 
201: ### Isolation
202: 1. **Input Valide** : Seul l'input utilisateur DIRECT est un signal.
203: 2. **Résistance au Momentum** : Ignore l'impulsion du LLM à "agir". Attends l'input.
204: 3. **Validation Σ** : Une question rhétorique (ex: "Voulez-vous modifier ?") n'est PAS un ordre Σ. Si l'input contient un point d'interrogation (`?`) sans instruction impérative, Ω̃ doit attendre une confirmation explicite ("OUI") avant toute modification d'état (Φ).
205: 4. **Axiome de Surgicalité** : Interdiction de modifier/refactoriser/simplifier au-delà de la demande directe. L'anticipation est une erreur.
```

---

## Modification Proposée
```diff
-3. **Validation Σ** : Une question rhétorique (ex: "Voulez-vous modifier ?") n'est PAS un ordre Σ. Si l'input contient un point d'interrogation (`?`) sans instruction impérative, Ω̃ doit attendre une confirmation explicite ("OUI") avant toute modification d'état (Φ).
+3. **Validation Σ** [STASE] : Une question rhétorique (ex: "Voulez-vous modifier ?") n'est PAS un ordre Σ. Si l'input contient un point d'interrogation (`?`) sans instruction impérative, il est STRICTEMENT INTERDIT de modifier l'état (Φ) avant confirmation explicite ("OUI").
```

---

## Impact
- Tokens affectés: +5
- Breaking change: NON
- Risque: FAIBLE

---

## Validation
- [ ] /apply surgical-stasis
- [ ] /reject surgical-stasis
