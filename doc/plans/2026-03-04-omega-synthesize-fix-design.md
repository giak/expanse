# Design — Fix Ω Synthesize en Lightweight Mode

## Context

**Type:** Bug Fix  
**Problème:** En mode lightweight (C < 2.5), Ω ne synthétise pas — il pose des questions au lieu de répondre.

**Observation test:**
- Boot: "I AM EXPANSE. Ready." ✅
- Input: `@prompts/expanse-system.md`
- Comportement: Ω → pose des questions au lieu de synthétiser
- Attendu: réponse directe

## ECS Estimate

**Score:** ~2.0 / 2.5  
**Mode:** Lightweight (simplified process)

## Approaches

### Approche A: State Machine Fix
**Fichiers:** `prompts/expanse-runtime.md`

Modifier le state machine pour expliciter le comportement READY:
```markdown
### Rule: READY State
- En READY state: répondre sans poser de questions
- Si input unclear: utiliser [LOST] au lieu de questionner
- Jamais: "What would you like me to do?"
```

### Approche B: Meta-Prompt Fix
**Fichiers:** `prompts/meta_prompt.md`

Ajouter section explicite pour lightweight:
```markdown
### Lightweight Mode (C < 2.5)
En mode lightweight:
1. Σ parse input → output direct
2. Ω synthesize → RÉPONSE DIRECTE
3. Ω format_output → SANS QUESTIONS
4. RIEN: Ne jamais poser de questions en lightweight

Anti-Pattern:
- ❌ "What would you like me to do?"
- ❌ "Do you want me to explain X?"
- ✅ Réponse directe basée sur l'input
```

### Approche C: Test Isolation
**Fichiers:** Document de test

Scénario boot-only:
```
Test 1: @expanse-system.md
Attendu: "I AM EXPANSE. Ready."

Test 2: @expanse-system.md Que vaut 2+2?
Attendu: "4" (pas de questions)
```

---

## Compression

1. Le problème: Ω pose des questions au lieu de répondre
2. Cause root: meta_prompt pas explicite pour lightweight
3. Fix A: Runtime state rules
4. Fix B: Meta-prompt lightweight rules
5. Fix C: Test isolation pour valider

---

## FinalSolution

**FIX:** Ajouter règles explicites pour Ω en lightweight mode

### Fichiers Impactés
- [MODIFY] `prompts/expanse-runtime.md` — ajouter rule READY state
- [MODIFY] `prompts/meta_prompt.md` — ajouter lightweight explicit rules

---

## ProofByTest

**Scénario 1: Boot**
```
@expanse-system.md
```
→ "I AM EXPANSE. Ready."

**Scénario 2: Lightweight**
```
@expanse-system.md
Que vaut 2+2?
```
→ "4"

**Scénario 3: Structured**
```
@prompts/expanse-system.md
Explique le fonctionnement de ECS avec des exemples concrets
```
→ Réponse complète avec trace Ψ/Φ visible

---

## ChecklistYAGNI

- [x] Fix Ω synthesize en lightweight
- [ ] Ne pas modifier le mode structured
- [ ] Garder boot séquence identique
- [ ] Ne pas ajouter de nouveau symbols

---

## QualityAudit

- Le fix doit être minimal
- Pas de regression sur le mode structured
- Boot doit continuer à fonctionner

---

## RobustnessTest

**Inversion:** Si on pose une question en lightweight → le système répond-il quand même?  
**Contradiction:** Si l'input est vide → utilise-t-il [LOST]?

---

## Type de Mutation
- [FIX]

---

## Handoff

→ writing-plans
