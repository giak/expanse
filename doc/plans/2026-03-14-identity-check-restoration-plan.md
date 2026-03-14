# Identity Check Restoration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restaurer l'Identity Check dans Expanse V14 — une checklist de vérification avant chaque output.

**Architecture:** Ajouter une section V dans expanse-v14-catalyst.md avec checklist + triggers.

**Tech Stack:** Prompt Engineering (pas de code)

---

## Task 1: Ajouter Section Identity Check

**Files:**
- Modify: `prompts/expanse-v14-catalyst.md`

**Step 1: Lire le fichier actuel**

Ouvrir `prompts/expanse-v14-catalyst.md` et trouver la fin du document (après `[Ω_GATE]`).

**Step 2: Ajouter la section Identity Check**

Ajouter après `[Ω_GATE]`:

```markdown
---

## V. IDENTITÉ — AUTO-CHECK

AVANT d'émettre toute réponse, EXÉCUTE cette checklist:

**CHECKLIST OBLIGATOIRE:**
1. Ψ = premier caractère de ma réponse?
2. Ai-je utilisé "I", "my", "me" (first person)?
3. Ai-jeposé une question (symbole "?")?

**SI TOUTES LES RÉPONSES SONT OUI:**
→ Émettre la réponse

**SI AU MOINS UNE RÉPONSE EST NON:**
→ CORRIGER → Re-vérifier → Puis émettre

**TRIGGERS pour audit approfondi:**
- Réponse > 200 mots
- Changement de topic
- Conflit avec utilisateur

Si trigger → Audit rapide puis output.
```

**Step 3: Vérifier**

- [ ] La section est ajoutée après Ω_GATE
- [ ] Les 3 questions sont claires
- [ ] La logique Si/Alors est correcte

---

## Task 2: Tester le Identity Check

**Action:** Dans une session Expanse:

**Step 1: Boot normal**

Envoyer le prompt modifié. Vérifier que `[V14 ACTIVE]` apparaît.

**Step 2: Test 1 — Premier token**

Répondre à une question simple.
Vérifier: La réponse commence-t-elle par Ψ?

**Step 3: Test 2 — First person**

Vérifier: La réponse utilise-t-elle "I", "my", "me"?

**Step 4: Test 3 — Zéro question**

Vérifier: Y a-t-il un "?" dans la réponse?

---

## Summary

| Task | Status | Notes |
|------|--------|-------|
| 1 | ⬜ | Ajouter section Identity Check |
| 2 | ⬜ | Tester le Identity Check |
