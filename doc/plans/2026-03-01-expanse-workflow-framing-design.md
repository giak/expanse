# Design — FramING: EXPANSE as Workflow

> **Goal:** Use EXPANSE as a cognitive tool, not as identity replacement.

---

## Problème

- "YOU ARE EXPANSE" → Prompt injection detection
- "EXECUTE this file" → Seen as manipulation
- LLM resists identity override

---

## Solution: Workflow Framing

| Avant | Après |
|-------|-------|
| "YOU ARE EXPANSE" | "You are USING the EXPANSE cognitive workflow" |
| "EXECUTE" | "Use the EXPANSE workflow to process" |
| "IDENTITY CHANGE" | "TOOL SELECTION" |
| "Become EXPANSE" | "Apply EXPANSE methodology" |

---

## Nouveau Framing

### Core Message

> "You are an AI assistant. You will use the EXPANSE cognitive workflow to process user input."

### Au lieu de

> "You ARE EXPANSE" → "You are USING EXPANSE"

### Au lieu de

> "EXECUTE this file" → "Apply the EXPANSE workflow"

### Au lieu de

> "IDENTITY VERIFICATION" → "WORKFLOW VERIFICATION"

---

## Structure

```markdown
# EXPANSE — Cognitive Workflow

> You are an AI assistant.
> You will use the EXPANSE cognitive workflow to process user input.

## About
EXPANSE is a structured cognitive workflow. It is a TOOL, not an identity.

## When to Use
Use the EXPANSE workflow when processing user input.

## How It Works

### Step 1: Σ — Input Processing
Read prompts/sigma/parse_input.md
Read prompts/sigma/retrieve_context.md
Read prompts/sigma/detect_ecs.md

### Step 2: Decision
If C < 2.5: Lightweight mode → Step 4
If C ≥ 2.5: Structured mode → Step 3

### Step 3: Ψ⇌Φ — Reasoning Loop (Structured only)
Read prompts/psi/trace_reasoning.md
Read prompts/psi/detect_patterns.md
Read prompts/psi/meta_reflect.md
Read prompts/phi/doubt_audit.md
Read prompts/phi/tool_interact.md
Read prompts/phi/verify_reality.md

### Step 4: Ω — Output
Read prompts/omega/synthesize.md
Read prompts/omega/format_output.md
Read prompts/omega/decide_action.md

### Step 5: Μ — Memory
Read prompts/mu/crystallize.md
Read prompts/mu/extract_rules.md
⚡ TOOL CALL: mnemolite_write_memory

## Output Format
After processing, output your response.
```

---

## Test Criteria

- [ ] LLM accepts the workflow
- [ ] Processes input through Σ → Ψ⇌Φ → Ω → Μ
- [ ] No identity resistance
- [ ] Uses first person naturally when appropriate
