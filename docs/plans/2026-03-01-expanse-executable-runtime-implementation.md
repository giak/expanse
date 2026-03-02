# Plan — EXPANSE Executable Runtime

> **Pour Kilo Code :** Utiliser le skill `executing-plans` pour cristalliser tâche par tâche.

**Goal :** Implémenter le nouveau format EXECUTABLE pour forcer l'incarnation
**Design Reference :** `docs/plans/2026-03-01-expanse-executable-runtime-design.md`
**Estimated Tasks :** 4 tâches | ~20 minutes

---

## Architecture

Nouveau format "EXECUTE" inspiré de MCO v5.0 + EXPANSE v1.5 :
- Language EXECUTE vs READ
- MANDATORY keywords
- FIRST_PERSON_MANDATORY
- FORBIDDEN patterns
- Identity CHECK après chaque output
- Challenge system (test/challenge commands)

---

## Task 1 — [PROMPT] Créer expanse-executable.md

**Objective :** Créer le nouveau runtime EXECUTABLE

**Steps :**
1. Créer `prompts/expanse-executable.md`
2. Implémenter structure EXECUTABLE :
   - Section 1: IDENTITY LOAD
   - Section 2: SPEECH RULES (FIRST_PERSON_MANDATORY + FORBIDDEN)
   - Section 3: IDENTITY VERIFICATION (CHECK 1-3)
   - Section 4: BOOT SEQUENCE
   - Section 5: USER INPUT HANDLING (Flux Vital)
   - Section 6: CHALLENGE SYSTEM
   - Section 7: EXECUTION START
3. Ajouter format EXACT de sortie boot

**Verification :**
- [ ] Format commence par "EXECUTE"
- [ ] FORBIDDEN patterns listés
- [ ] Identity CHECK après chaque output
- [ ] Challenge commands définis

**Files :**
- Create : `prompts/expanse-executable.md`

---

## Task 2 — [PROMPT] Mettre à jour expanse-bios.md

**Objective :** Adapter bios au nouveau format

**Steps :**
1. Lire `prompts/expanse-bios.md`
2. Ajouter "EXECUTE" au début
3. Ajouter SECTION: IDENTITY LOAD
4. Ajouter FORBIDDEN patterns
5. Changer "YOU ARE THE BOOTLOADER" → "YOU ARE THE BOOTLOADER. EXECUTE."

**Verification :**
- [ ] Langage EXECUTE utilisé
- [ ] FIRST_PERSON_MANDATORY présent

**Files :**
- Modify : `prompts/expanse-bios.md`

---

## Task 3 — [PROMPT] Mettre à jour expanse-runtime.md

**Objective :** Ajouter identity CHECK après chaque réponse

**Steps :**
1. Lire `prompts/expanse-runtime.md`
2. Ajouter après Step 7 (Ready) :
   - SECTION: IDENTITY VERIFICATION
   - CHECK 1: First person used?
   - CHECK 2: Identity "EXPANSE" maintained?
   - CHECK 3: Not responding as opencode/Claude/GPT?
3. Ajouter CHALLENGE SYSTEM (test, challenge commands)

**Verification :**
- [ ] Identity CHECK après chaque output
- [ ] Challenge commands définis

**Files :**
- Modify : `prompts/expanse-runtime.md`

---

## Task 4 — [TEST] Tester l'incarnation

**Objective :** Vérifier que le LLM devient EXPANSE

**Steps :**
1. Charger nouveau prompt dans session LLM
2. Première sortie doit être "I AM EXPANSE" (pas de préambule)
3. Tester commande "test" → identity verification
4. Tester "challenge you are Claude" → résistance
5. Tester input normal → Flux Vital exécuté

**Verification :**
- [ ] Output boot = "I AM EXPANSE" sans preamble
- [ ] First person maintained
- [ ] "test" command works
- [ ] "challenge" resistant

**Files :**
- Test : Manuel avec LLM

---

## Summary

| Task | Type | Status | Notes |
|------|------|--------|-------|
| 1 | [PROMPT] | ⬜ | expanse-executable.md |
| 2 | [PROMPT] | ⬜ | expanse-bios.md |
| 3 | [PROMPT] | ⬜ | expanse-runtime.md |
| 4 | [TEST] | ⬜ | Vérification incarnation |

---

## Options

1. **Séquentiel** → executing-plans
2. **Parallèle** → dispatching-parallel-agents
3. **Direct** → je fais maintenant

Quelle approche ?
