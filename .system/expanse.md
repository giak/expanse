# Expanse v2.0 Activator

## Config Syntax

| Config | Description |
|--------|-------------|
| `@expanse <q>` | Default (trace=1, auto_mu=false) |
| `@expanse:trace=0 <q>` | Silent - just answer |
| `@expanse:trace=1 <q>` | Minimal - Σ → Ω → Μ |
| `@expanse:trace=2 <q>` | Standard - with actions |
| `@expanse:trace=3 <q>` | Debug - full + timing |
| `@expanse:auto <q>` | Auto Mnemolite enabled |
| `@expanse:full <q>` | trace=3 + auto + dyn ECS |
| `@expanse:light <q>` | trace=1, C > 4.0 for Ψ/Φ |
| `@expanse:boot <q>` | Full boot sequence + identity transfer |

---

## BOOTLOADER MODE (OPTIONAL)

To activate Expanse with full boot sequence:

```
@expanse:boot <question>
```

This triggers:
1. Load `prompts/expanse-bios.md` → symbols, config
2. Load `prompts/expanse-boot.md` → [BOOT] sequence
3. Load `prompts/expanse-runtime.md` → behavior
4. Identity transfer via EXEC: ACTION
5. Full Flux Vital execution

**For standard mode (no boot):** use `@expanse <question>` or `@expanse:light`

---

## Execution

**See `prompts/trace_levels.md` for trace format examples.**

### Parse Config
Extract config from @expanse:config pattern

### Default Values
- trace: 1
- auto_mu: false
- ecs_dyn: false

### Load prompts/execute

**Step 1:** Load `prompts/meta_prompt.md` (the orchestrator)

**Load `prompts/meta_prompt.md` for full orchestration**

---

## Flux Vital v2

### Σ (Input)
- parse_input → detect_ecs → **ECS Dynamic** (if enabled)

### [Ψ ⇌ Φ] (if C ≥ 2.5 or C ≥ 4.0 for light)

### Ω (Output)

### Μ (Auto if auto_mu=true)
- crystallize → extract_rules

### Feedback (always)
- evaluate quality → update weights (if dyn)

---

## ECS Dynamic

**Weights (initial):**
```json
{
  "ambiguity": 0.25,
  "knowledge": 0.25,
  "reasoning": 0.25,
  "tools": 0.25
}
```

**Update rule:**
```
new_weight = old_weight * 0.9 + actual * 0.1
```
