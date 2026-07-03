# Expanse v2.0 Design

**Date:** 2026-02-28  
**Status:** Approved  
**Version:** v2.0

---

## Overview

Improve Expanse with configurable trace levels, auto Mnemolite integration, dynamic ECS, and post-cycle feedback.

---

## Architecture

```
@expanse [config] <input>
    ↓
CONFIG (trace=0-3, auto_mu, ecs_dyn)
    ↓
Σ (Input) → ECS Dynamic
    ↓
[Ψ ⇌ Φ] (if C ≥ 2.5)
    ↓
Ω (Output)
    ↓
Μ (Auto if auto_mu=true)
    ↓
Feedback Loop (post-cycle)
```

---

## Config Syntax

| Config | Description |
|--------|-------------|
| `@expanse <question>` | Default (trace=1, auto_mu=false) |
| `@expanse:trace=0 <q>` | Silent (no trace) |
| `@expanse:trace=1 <q>` | Minimal (Σ → Ω → Μ) |
| `@expanse:trace=2 <q>` | Standard (with actions) |
| `@expanse:trace=3 <q>` | Debug (full + timing + tokens) |
| `@expanse:auto <q>` | Auto Mnemolite enabled |
| `@expanse:full <q>` | trace=3 + auto + ecs_dyn |
| `@expanse:light <q>` | trace=1, C > 4.0 required for Ψ/Φ |

---

## Components

### 1. Trace Levels

| Level | Output |
|-------|--------|
| 0 | Silent - just answer |
| 1 | Minimal - `Σ → Ω → Μ` |
| 2 | Standard - `Σ: parse → Ω: synthesize` |
| 3 | Debug - full trace + timing + tokens |

**Configurable via:** `@expanse:trace=N` or ENV `EXPANSE_TRACE=N`

### 2. Auto Mnemolite (v3)

When `auto_mu=true`:
1. After each cycle, analyze output
2. If quality ≥ 0.8 → `[PATTERN]` → Mnemolite
3. Extract potential `[CORE_RULE]` / `[HEURISTIC]`
4. Update ECS weights based on success

**Configurable via:** `@expanse:auto` or ENV `EXPANSE_AUTO_MU=true`

### 3. Dynamic ECS

- Initialize with default weights
- After each cycle, compare predicted C vs actual complexity
- Adjust weights to minimize prediction error
- Self-calibrates over time

**Configurable via:** `@expanse:dyn` or ENV `EXPANSE_ECS_DYN=true`

### 4. Feedback Loop

Post-cycle evaluation:
1. Rate output: clarity, utility, coherence (0-1)
2. If overall ≥ 0.8: tag `[PATTERN]`, recommend for registry
3. If overall < 0.8: tag `[TRACE]`, flag for review
4. Update ECS weights
5. Log to Mnemolite

---

## ECS Dynamic Weights

Initial:
- ambiguity: 0.25
- knowledge: 0.25
- reasoning: 0.25
- tools: 0.25

Update rule:
```
new_weight = old_weight * (1 - alpha) + actual_contribution * alpha
```
Where alpha = 0.1 (learning rate)

---

## Memory Integration

| Trigger | Memory Type |
|---------|-------------|
| High quality output | `[PATTERN]` |
| Proven principle | `[CORE_RULE]` |
| Valid shortcut (8/10) | `[HEURISTIC]` |
| Notable investigation | `[TRACE]` |
| Missing information | `[LOST]` |

---

## Anti-Patterns (Enforced)

1. **Hallucination** → Use `[LOST]`
2. **Vaporware** → Only reference seen via tools
3. **Simulation** → Be the system

---

## Implementation Priority

1. Update `.system/expanse.md` with config syntax
2. Add trace level support to meta_prompt
3. Implement auto Mnemolite in `prompts/mu/crystallize.md`
4. Add ECS dynamic weights to `prompts/sigma/detect_ecs.md`
5. Enhance feedback_loop with weight updates

---

## Success Criteria

- [ ] Configurable trace levels (0-3) work
- [ ] Auto Mnemolite archives high-quality outputs
- [ ] ECS adapts to usage patterns
- [ ] Feedback loop runs after each cycle
- [ ] All anti-patterns enforced
