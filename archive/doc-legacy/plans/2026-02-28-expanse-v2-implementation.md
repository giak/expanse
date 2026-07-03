# Expanse v2.0 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Implement configurable trace levels, auto Mnemolite, dynamic ECS, and post-cycle feedback for Expanse

**Architecture:** Update existing prompts with config syntax, add dynamic weights, enhance auto-archive

**Tech Stack:** Markdown prompts, Mnemolite MCP

---

## Task 1: Update .system/expanse.md with Config Syntax

**Files:**
- Modify: `.system/expanse.md`

**Step 1: Read current file**

```bash
cat .system/expanse.md
```

**Step 2: Replace with updated version**

```markdown
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
```

**Step 3: Commit**

```bash
git add .system/expanse.md
git commit -m "feat: add v2.0 config syntax to expanse activator"
```

---

## Task 2: Update prompts/sigma/detect_ecs.md with Dynamic ECS

**Files:**
- Modify: `prompts/sigma/detect_ecs.md`

**Step 1: Read current file**

```bash
cat prompts/sigma/detect_ecs.md
```

**Step 2: Add dynamic ECS section**

Add at end:

```markdown
## Dynamic ECS (Optional)

If ecs_dyn=true:

1. Load weights from Mnemolite (or use default)
2. Calculate C with current weights
3. After cycle, compare predicted vs actual complexity
4. Adjust weights: `new = old * 0.9 + actual * 0.1`
5. Save updated weights to Mnemolite

**Default Weights:**
- ambiguity: 0.25
- knowledge: 0.25  
- reasoning: 0.25
- tools: 0.25
```

**Step 3: Commit**

```bash
git add prompts/sigma/detect_ecs.md
git commit -m "feat: add dynamic ECS to detect_ecs prompt"
```

---

## Task 3: Update prompts/mu/crystallize.md with Auto Archive

**Files:**
- Modify: `prompts/mu/crystallize.md`

**Step 1: Read current file**

```bash
cat prompts/mu/crystallize.md
```

**Step 2: Add auto-mode section**

Add at end:

```markdown
## Auto Mode (Optional)

If auto_mu=true:

1. Evaluate output quality:
   - Clarity (0-1)
   - Utility (0-1)
   - Coherence (0-1)
   - Overall = (clarity + utility + coherence) / 3

2. Threshold check:
   - If overall ≥ 0.8: archive as [PATTERN]
   - If overall < 0.8: flag for review

3. Extract rules:
   - If same insight 3+ times: [CORE_RULE] candidate
   - If shortcut works 8/10: [HEURISTIC] candidate

4. Auto-archive to Mnemolite
```

**Step 3: Commit**

```bash
git add prompts/mu/crystallize.md
git commit -m "feat: add auto archive to crystallize prompt"
```

---

## Task 4: Update prompts/feedback_loop.md with Weight Updates

**Files:**
- Modify: `prompts/feedback_loop.md`

**Step 1: Read current file**

```bash
cat prompts/feedback_loop.md
```

**Step 2: Enhance with ECS weight update**

Add to process:

```markdown
### ECS Weight Update (if ecs_dyn=true)

1. Compare predicted C vs actual complexity of response
2. Calculate error: `error = predicted - actual`
3. For each weight:
   ```
   new_weight = old_weight + learning_rate * error
   ```
4. Normalize weights to sum = 1.0
5. Save to Mnemolite for next cycle
```

**Step 3: Commit**

```bash
git add prompts/feedback_loop.md
git commit -m "feat: add ECS weight updates to feedback loop"
```

---

## Task 5: Create Trace Format Guide

**Files:**
- Create: `prompts/trace_levels.md`

**Step 1: Create file**

```markdown
# Trace Levels Guide

## Level 0: Silent
```
Answer only
```

## Level 1: Minimal
```
Σ → Ω → Μ
```

## Level 2: Standard
```
Σ: parse_input → "explicit: X, implicit: Y"
Ω: synthesize → "key_points: [...]"
Μ: crystallize → [PATTERN] archived
```

## Level 3: Debug
```
[00:00] Σ: parse_input
  → explicit: "..."
  → implicit: ["..."]
  → tone: "neutral"
[00:01] Σ: retrieve_context
  → memories: 3
  → rules: 1
[00:02] Σ: detect_ecs
  → C: 3.2
  → mode: structured
[00:03] Ψ: trace_reasoning
  → trace_id: "abc123"
  → assumptions: ["..."]
[00:05] Φ: doubt_audit
  → assumptions: ["..."]
  → challenged: ["..."]
[00:08] Ω: synthesize
  → confidence: 0.85
  → key_points: [...]
[00:09] Μ: crystallize
  → type: [PATTERN]
  → memory_id: "xyz789"
[00:10] Feedback
  → quality: 0.87
  → weights_updated: true
```

---

## Usage

@expanse:trace=2 Comment ça va?
```

**Step 2: Commit**

```bash
git add prompts/trace_levels.md
git commit -m "feat: add trace levels guide"
```

---

## Task 6: Test Expanse v2.0

**Step 1: Test trace=0 (silent)**

In new session:
```
@expanse:trace=0 Salut!
```

Expected: Just "Salut!" - no trace

**Step 2: Test trace=1 (minimal)**

```
@expanse:trace=1 Comment ça va?
```

Expected: Brief trace "Σ → Ω → Μ"

**Step 3: Test trace=3 (debug)**

```
@expanse:trace=3 Explique-moi la physique quantique en 2 phrases
```

Expected: Full debug trace with timing

**Step 4: Test auto archive**

```
@expanse:auto Explain what is 2+2
```

Expected: Response + auto archive to Mnemolite

**Step 5: Commit test results**

```bash
git commit --allow-empty -m "test: verify v2.0 trace levels work"
```

---

## Task 7: Final Commit

**Step 1: Tag version**

```bash
git tag v2.0
git log --oneline -10
```

**Step 2: Push**

```bash
git push origin main --tags
```
