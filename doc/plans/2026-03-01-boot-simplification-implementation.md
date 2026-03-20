# Plan — Boot Simplification (POC)

> **Pour Kilo Code :** Utiliser le skill `executing-plans` pour cristalliser tâche par tâche.

**Goal :** Simplifier les fichiers root pour le POC "methodology"
**Design Reference :** `docs/plans/2026-03-01-boot-simplification-design.md`
**Estimated Tasks :** 4 tâches | ~10 minutes

---

## Task 1 — [DELETE] Supprimer expanse-executable.md

**Objective :** Supprimer le fichier useless

**Steps :**
1. Supprimer `prompts/expanse-executable.md`

**Verification :**
- [ ] File deleted

**Files :**
- Delete : `prompts/expanse-executable.md`

---

## Task 2 — [PROMPT] Simplifier expanse-bios.md

**Objective :** Simplifier BIOS

**Steps :**
1. Écraser `prompts/expanse-bios.md` avec :

```markdown
# EXPANSE — BIOS

Load symbols and rules.

## Symbols
- Σ = Input analysis
- Ψ = Reasoning  
- Φ = Verification
- Ω = Output
- Μ = Memory

## Complexity
- C < 2.5 = Simple
- C ≥ 2.5 = Complex

---

Load prompts/expanse-simple.md
```

**Verification :**
- [ ] Symbols listés
- [ ] C threshold 2.5
- [ ] Load expanse-simple.md

**Files :**
- Modify : `prompts/expanse-bios.md`

---

## Task 3 — [PROMPT] Simplifier expanse-boot.md

**Objective :** Simplifier boot avec [BOOT] messages

**Steps :**
1. Écraser `prompts/expanse-boot.md` avec :

```markdown
# EXPANSE — Boot

[BOOT] Loading BIOS...
Read prompts/expanse-bios.md
[OK] BIOS loaded

[BOOT] Loading Methodology...
Read prompts/expanse-simple.md
[OK] Methodology loaded

[BOOT] Setting identity...
I AM EXPANSE. Ready.
```

**Verification :**
- [ ] [BOOT] messages présents
- [ ] Load expanse-bios.md
- [ ] Load expanse-simple.md
- [ ] Output "I AM EXPANSE. Ready."

**Files :**
- Modify : `prompts/expanse-boot.md`

---

## Task 4 — [PROMPT] Simplifier expanse-runtime.md

**Objective :** Simplifier runtime

**Steps :**
1. Écraser `prompts/expanse-runtime.md` avec :

```markdown
# EXPANSE — Runtime

Apply prompts/expanse-simple.md to process user input.

When user input:
1. Apply Σ — Analyze complexity
2. If C < 2.5 → Answer directly
3. If C ≥ 2.5 → Think + Verify + Answer
4. After answering → Save to memory (optional)
```

**Verification :**
- [ ] Référence expanse-simple.md
- [ ] Étapes Σ → Ψ → Φ → Ω → Μ

**Files :**
- Modify : `prompts/expanse-runtime.md`

---

## Summary

| Task | Type | Status | Notes |
|------|------|--------|-------|
| 1 | [DELETE] | ⬜ | expanse-executable.md |
| 2 | [PROMPT] | ⬜ | expanse-bios.md |
| 3 | [PROMPT] | ⬜ | expanse-boot.md |
| 4 | [PROMPT] | ⬜ | expanse-runtime.md |

---

## Options

1. **Séquentiel** → executing-plans
2. **Direct** → je fais maintenant

Quelle approche ?
