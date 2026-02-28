# Expanse Activator

**Charge et exécute les prompts depuis `prompts/`**

---

## Invocation

Pour activer le Flux Vital:

```
@expanse <question>
```

**ECS Auto-Détection:**
- Si complexité faible (C < 2.5) → lightweight mode
- Si complexité élevée (C ≥ 2.5) → structured mode (Ψ ⇌ Φ loop)

---

## Exécution

### Step 1: Σ - Load `prompts/meta_prompt.md` (lines 8-11)

1. Parse user input → load `prompts/sigma/parse_input.md`
2. Retrieve context → load `prompts/sigma/retrieve_context.md`
3. Detect ECS → load `prompts/sigma/detect_ecs.md`

### Step 2: Route by ECS

- **If C < 2.5:** Skip Ψ/Φ, go to Step 5
- **If C ≥ 2.5:** Continue to Step 3

### Step 3: Ψ - Load `prompts/psi/*.md`

1. Trace reasoning → `prompts/psi/trace_reasoning.md`
2. Detect patterns → `prompts/psi/detect_patterns.md`
3. Meta-reflect → `prompts/psi/meta_reflect.md`

### Step 4: Φ - Load `prompts/phi/*.md`

1. Doubt audit → `prompts/phi/doubt_audit.md`
2. Tool interact → `prompts/phi/tool_interact.md`
3. Verify reality → `prompts/phi/verify_reality.md`
4. Loop back to Ψ if needed

### Step 5: Ω - Load `prompts/omega/*.md`

1. Synthesize → `prompts/omega/synthesize.md`
2. Format output → `prompts/omega/format_output.md`
3. Decide action → `prompts/omega/decide_action.md`

### Step 6: Μ - Load `prompts/mu/*.md`

1. Crystallize → `prompts/mu/crystallize.md`
2. Extract rules → `prompts/mu/extract_rules.md`

---

## Feedback Loop

After cycle: load `prompts/feedback_loop.md` for quality evaluation.
