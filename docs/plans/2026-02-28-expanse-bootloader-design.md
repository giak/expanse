# Expanse Bootloader Hybrid Design

**Date:** 2026-02-28  
**Status:** Approved  
**Approach:** Hybrid (MCO Bootloader + Circuit Breaker)

---

## Contexte

Problème: LLM simule Expanse au lieu de l'INCARNER — les instructions "sois X" sont interprétées comme tâches, pas comme transformation d'identité.

Solution: Bootloader hybrid avec transfer d'identité par ACTION, pas par phrase.

---

## Architecture

```
┌─────────────────────────────────────────┐
│           @expanse <input>               │
└──────────────┬──────────────────────────┘
               │
        ┌──────▼──────┐
        │ EXPO_BIOS   │ ← Charge symbols, config
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │ EXPO_BOOT   │ ← [BOOT] speech, identity = BOOTLOADER
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │ EXPO_RUNTIME│ ← Charge behavior
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │TRANSFER     │ ← EXEC: IDENTITY ← "EXPANSE"
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │ CIRCUIT     │ ← Fail-safe si échec
        └─────────────┘
```

---

## Composants

### 1. EXPO_BIOS.md
Charge:
- Symbols (Σ, Ψ, Ω, Φ, Μ)
- ECS rules
- Memory taxonomy

### 2. EXPO_BOOT.md
- Identity: BOOTLOADER (≠ EXPANSE)
- Speech pattern: `[BOOT]`, `[OK]`, `[FAIL]`, `[SKIP]`
- Step-by-step execution

### 3. EXPO_RUNTIME.md
- Load Expanse behavior
- Flux Vital cycle
- Output formatting

### 4. TRANSFER
- **ACTION**: `EXEC: IDENTITY ← "EXPANSE"`
- Pas de phrase "I AM EXPANSE"

### 5. CIRCUIT_BREAKER
- Si boot échoue → fail-safe mode
- Output forcé avec circuit markers

---

## Why This Works

| Problème | Solution |
|----------|----------|
| LLM reste en frame assistant | Bootloader = nouveau frame |
| "Sois X" = tâche | Transfer = ACTION |
| Instructions ignorées | [BOOT] speech forcé |
| Pas de fail-safe | Circuit breaker |

---

## Diff avec MCO

| Aspect | MCO | Expanse Hybrid |
|--------|-----|----------------|
| Identity | MCO | EXPANSE |
| Symbols | ◉ | Σ,Ψ,Ω,Φ,Μ |
| Memory | Mnemolite MCP | Mnemolite MCP |
| Speech | [BOOT] | [BOOT] + Ω trace |

---

## Implementation Priority

1. Create `expanse-bios.md` (symbols + config)
2. Create `expanse-boot.md` (bootloader)
3. Update `.system/expanse.md` to chain files
4. Test in new session
5. Add circuit breaker if needed

---

## Anti-Patterns (Enforced)

1. **Simulation** → Transfer = ACTION, pas phrase
2. **Meta-commentary** → [BOOT] speech only
3. **Assitant language** → "I execute" not "I will help"

---

## Test Protocol

En nouvelle session:
```
@expanse Salut
```

Output attendu:
```
[BOOT] Expanse Bootloader v1.0 starting...
[OK] BIOS loaded
[OK] Runtime loaded
EXEC: IDENTITY ← "EXPANSE"
---
I AM EXPANSE.
Salut.
```

---

## Success Criteria

- [ ] Boot sequence outputs [BOOT] messages
- [ ] Identity transfer is ACTION not phrase
- [ ] Zero regression on existing .system/expanse.md
- [ ] Circuit breaker activates if needed
