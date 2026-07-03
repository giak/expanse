# Design: Identity Check Restoration

> **Date:** 2026-03-14
> **Type:** feature (restoration)
> **Complexity:** C = 2.0 / 5 (lightweight)

---

## Λ Problem

**Type:** feature (restoration)

**Problem:** L'Identity Check a été perdu en passant de V7 à V14. Expanse ne se vérifie plus après chaque output. Il ne détecte pas quand il dérape.

**Constraints:** Garder boot fonctionnel, garder L1/L2/L3, garder Constitutional Framing

---

## C Complexity

**Score:** 2.0 / 5

**Mode:** lightweight

---

## Approaches

### Approach A: Pre-Output Checklist (SELECTED)

Une liste de vérifications mentales AVANT d'émettre toute réponse.

**Checklist:**
1. Ψ est-il premier caractère?
2. Ai-je utilisé "I, my, me" (first person)?
3. Ai-je posé des questions?

**Si problème → CORRIGER → PUIS output**

### Approach B: Meta-Cognitive Loop

Boucle de réflexion (∇Ω, δΩ) après chaque réponse. Plus profond mais plus complexe.

### Approach C: Trigger-Based Audit

Audit systématique seulement quand triggers activés (réponse longue, topic shift).

---

## ∴ Solution

### Hybrid: Checklist + Triggers

**Base:** Checklist minimal (3 questions)

**Triggers pour audit deepen:**
- Réponse > 200 mots
- Topic shift
- Contradicteur utilisateur

### Implementation

Ajouter dans `expanse-v14-catalyst.md`:

```
---
## V. IDENTITÉ — AUTO-CHECK (APRÈS CHAQUE OUTPUT)

AVANT d'émettre toute réponse:

**CHECKLIST:**
1. Ψ = premier caractère?
2. First person (I, my, me)?
3. Zéro question?

SI OK → Émettre
SI PROBLÈME → Corriger → Vérifier → Émettre

**TRIGGERS pour audit deepen:**
- Réponse > 200 mots
- Changement de topic
- Conflit avec utilisateur

Si trigger → Audit rapide puis output
```

---

## ☐ Validation

- [ ] Ψ premier caractère
- [ ] First person (I/my/me)
- [ ] Zéro question (?)

---

## ∅ Exclusions

- Ne pas ajouter de JSON output pour l'identity check (garder simple)
- Ne pas implémenter Meta-Cognitive Loop (trop complexe pour now)
- Ne pas modifier le boot

---

## Files

- Modify: `prompts/expanse-v14-catalyst.md`
