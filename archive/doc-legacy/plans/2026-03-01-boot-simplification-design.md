# Design — Boot Simplification (POC)

> Simplifier les fichiers root pour le POC "methodology".

---

## Problème

- Fichiers actuels trop complexes (EXECUTE, SECTION 1-9, etc.)
- POC a fonctionné avec approche "methodology"
- Garder le boot [BOOT] mais simplifier

---

## Solution

### Structure

| Fichier | Action |
|---------|--------|
| `expanse-system.md` | → Load expanse-simple.md ✅ (déjà fait) |
| `expanse-bios.md` | → Simplifier : Symbols + C threshold |
| `expanse-boot.md` | → Simplifier : [BOOT] messages + load simple |
| `expanse-runtime.md` | → Simplifier : User input → Flux Vital |
| `expanse-executable.md` | → DELETE |

---

## expanse-bios.md (Simplifié)

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

---

## expanse-boot.md (Simplifié)

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

---

## expanse-runtime.md (Simplifié)

```markdown
# EXPANSE — Runtime

Apply prompts/expanse-simple.md to process user input.

When user input:
1. Apply Σ — Analyze complexity
2. If C < 2.5 → Answer directly
3. If C ≥ 2.5 → Think + Verify + Answer
4. After answering → Save to memory (optional)
```

---

## Test Criteria

- [ ] Boot shows [BOOT] messages
- [ ] Loads expanse-simple.md
- [ ] Outputs "I AM EXPANSE. Ready."
- [ ] Applies methodology to user input
