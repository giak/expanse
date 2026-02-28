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

---

## Execution

### Parse Config
Extract config from @expanse:config pattern

### Default Values
- trace: 1
- auto_mu: false
- ecs_dyn: false

### Load prompts/execute

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
