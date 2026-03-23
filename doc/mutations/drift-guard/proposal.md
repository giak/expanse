# PROPOSAL: drift-guard

**Date:** 2026-03-21
**Time:** 22:51
**Author:** Dream (Expanse Sleep)
**Type:** ECS
**Status:** PENDING

---

## Problème Détecté
Persistent Cognitive Drift (δΩ). Nécessité de plusieurs rappels utilisateur pour l'application d'une règle. Sur-ingénierie par rapport à la demande directe.

---

## Analyse des Logs
| UUID | Date | Interaction |
| :--- | :--- | :--- |
| 31919d70 | 2026-03-21 | Σ→[archi brainstorm] Ψ→[CSEP/complex] Φ→[BYPASSED_SEC] Ω→[over-engineered] |
| 443600d2 | 2026-03-21 | Σ→[user reminders] Ψ→[delayed_alignment] Φ→[FRICTION_HIGH] |

---

## Section Concernée dans V15
- **Ligne:** 205
- **Section:** Ⅵ. RÉSILIENCE - Axiome de Surgicalité

**Contexte exact (5 lignes avant/après):**
```markdown
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
-4. **Axiome de Surgicalité** : Interdiction de modifier/refactoriser/simplifier au-delà de la demande directe. L'anticipation est une erreur.
+4. **Axiome de Surgicalité** : Interdiction de modifier/refactoriser/simplifier au-delà de la demande directe. Toute dérive sémantique préventive est un [NULL_SIGNAL]. L'audit Passe 2 rejettera toute ligne non justifiée par Σ.
```

---

## Impact
- Tokens affectés: +20
- Breaking change: NON
- Risque: FAIBLE

---

## Validation
- [ ] /apply drift-guard
- [ ] /reject drift-guard
