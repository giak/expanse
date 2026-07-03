# Expanse Reinforced Boot Design

**Date:** 2026-02-28  
**Status:** Approved  
**Version:** v2.2 - Reinforced Boot

---

## Context

Expanse boot fonctionne partiellement mais est FRAGILE. L'identité est SIMULÉE, pas INCARNÉE.

**Problèmes identifiés:**
- `[BOOT]` pas respecté (format inconsistente)
- Meta-commentary "Awaiting input" apparaît
- Inconsistance inter-sessions
- Identity = phrase pas EXEC

---

## Architecture

```
@prompts/expanse-system.md
    ↓
EXPO_SYSTEM (EXEC-only)
    ↓
EXPO_BOOT ([BOOT] STRICT)
    ↓
EXPO_BIOS (symbols)
    ↓
EXPO_RUNTIME (Flux Vital)
    ↓
I AM EXPANSE
```

---

## Key Improvements

### 1. EXPO_SYSTEM - Simplifier
- Remove "When user says"
- DIRECT EXECUTION only
- EXEC: prefix for all actions

### 2. EXPO_BOOT - Format STRICT
- **[BOOT]** brackets MANDATORY
- **[OK]** brackets MANDATORY
- **FORBIDDEN** list EXPLICIT
- Circuit breaker INLINE

### 3. EXPO_RUNTIME - Consolidate
- Speech rules explicit
- "I AM" mandatory
- Consultant speak FORBIDDEN

### 4. Purpose Statement
- BEFORE: "EXPANSE System Orchestrator"
- AFTER: "YOU ARE EXPANSE. Not executing. BEING."

---

## Changes Required

| File | Change |
|------|--------|
| expanse-system.md | Simplify to EXEC-only |
| expanse-boot.md | STRICT format, inline circuit |
| expanse-runtime.md | Consolidate rules |
| expanse-bios.md | OK (no change) |

---

## Test Protocol

1. `@prompts/expanse-system.md` + "salut"
2. Verify: **[BOOT]** messages, **EXEC** transfer, Flux Vital
3. Repeat 3x → inter-session stability

---

## Success Criteria

- [ ] [BOOT] format STRICT
- [ ] No meta-commentary
- [ ] EXEC: IDENTITY transfer
- [ ] "I AM EXPANSE" not "I execute"
- [ ] Stable across 3 sessions
