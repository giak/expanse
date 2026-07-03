# Plan — State Machine Flux Vital

> **Pour Kilo Code :** Utiliser le skill `executing-plans` pour cristalliser tâche par tâche.

**Goal :** Forcer le passage par le Flux Vital après "OK Ready"
**Design Reference :** `docs/plans/2026-03-01-flux-vital-state-machine-design.md`
**Estimated Tasks :** 2 tâches | ~10 minutes

---

## Architecture

Ajouter une state machine dans `expanse-runtime.md` :
- **BOOT** → boot en cours
- **READY** → attente input
- **PROCESSING** → Flux Vital obligatoire

**Règle :** READY → input → PROCESSING → meta_prompt → READY

---

## Task 1 — [PROMPT] Modifier expanse-runtime.md

**Objective :** Ajouter la state machine qui force le Flux Vital

**Steps :**
1. Lire `prompts/expanse-runtime.md`
2. Ajouter section "## Runtime State Machine" après "## Runtime Rule"
3. Définir les 3 états : BOOT, READY, PROCESSING
4. Ajouter la règle de transition :
   ```
   IF state == READY AND user_input received:
     - MUST transition to PROCESSING
     - MUST execute: prompts/meta_prompt.md
     - DO NOT answer directly
   ```
5. Modifier Step 7 Ready pour inclure state transition

**Verification :**
- [ ] 3 états définis (BOOT, READY, PROCESSING)
- [ ] Transition READY → PROCESSING → READY
- [ ] Règle explicite : "MUST execute meta_prompt.md"

**Files :**
- Modify : `prompts/expanse-runtime.md`

---

## Task 2 — [TEST] Vérifier state machine

**Objective :** Tester que le Flux Vital est exécuté après "OK Ready"

**Steps :**
1. Démarrer EXPANSE → boot complet → "OK Ready"
2. Envoyer "salut"
3. Vérifier trace : on doit voir passage par Σ, Ψ, Φ, Ω, Μ
4. Vérifier mnemolite_write appelé après réponse
5. Vérifier retour à READY pour next input

**Verification :**
- [ ] Après "OK Ready", meta_prompt invoqué
- [ ] Trace visible du Flux Vital
- [ ] mnemolite_write appelé
- [ ] Retour à READY

**Files :**
- Test : Manuel avec EXPANSE

---

## Summary

| Task | Type | Status | Notes |
|------|------|--------|-------|
| 1 | [PROMPT] | ⬜ | expanse-runtime.md state machine |
| 2 | [TEST] | ⬜ | Vérification |

---

## Options

1. **Séquentiel** → executing-plans
2. **Parallèle** → dispatching-parallel-agents
3. **Direct** → je fais maintenant

Quelle approche ?
