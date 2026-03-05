---
name: brainstorm
description: "Use when there is a need or problem that requires EXPANSE to evolve. Starting point is always the PROBLEM, not the solution. Explores what EXPANSE needs to change and designs the solution with antifragile methodology."
triggers:
  - pattern: "problème|besoin|améliorer|optimiser|factoriser|modifier|changer|évoluer|lent|redondant|cassé|manque"
    confidence: 0.8
  - pattern: "brainstorm|concevoir|design|idea|comment.*résoudre|on.*devrait"
    confidence: 0.6
---

# Brainstorm — Exploration & Design

> Antifragile methodology applied to EXPANSE.
> No CI/CD — here, "guardrails" are strict mental processes.

## Posture

> Starting point: **a problem or a need**, not a solution.
> Role: external agentic actor evaluating what EXPANSE must change.
> Nature of change = brainstorm conclusion, not starting hypothesis.

---

## Types of Mutations

| Mutation | EXPANSE Meaning |
|----------|----------------|
| `[ADD]` | New prompt, organ, rule, symbol |
| `[MODIFY]` | Change existing behavior |
| `[DELETE]` | Remove unused |
| `[REFACTOR]` | Reorganize without behavior change |
| `[OPTIMIZE]` | Improve density/compression |
| `[FIX]` | Fix bug or inconsistency |

---

## Process Flow

```
┌────────────────────────────────────────────────────────────────────┐
│ 0. System-Read — Map the terrain                                     │
│    ↓                                                                │
│ 1. Λ Context — Problem in ≤ 3 lines                                │
│    ↓                                                                │
│ 2. ECS Estimate — Score / 2.5 (KERNEL threshold)                  │
│    ↓                                                                │
│ 3. Clarifying Gate — Questions if ambiguity                         │
│    ↓                                                                │
│ 4. Ω Generate — 3+ approaches + Φ/Ξ iteration to apex            │
│    ├─ Approach A → Audit → Improve → APEX                          │
│    ├─ Approach B → Audit → Improve → APEX                          │
│    └─ Approach C → Audit → Improve → APEX                          │
│    ↓                                                                │
│ 5. Comparison Table — Compare apexes                                 │
│    ↓                                                                │
│ 6. Final Synthesis — Design Hybrid + EXPANSE-native                 │
│    ↓                                                                │
│ 7. Quality Audit & Robustness Test                                   │
│    ↓                                                                │
│ 8. Handoff                                                          │
└────────────────────────────────────────────────────────────────────┘
```

---

## Steps

### Step 0 : System-Read — Map the terrain

```bash
ls -la prompts/
ls -la prompts/sigma/
ls -la prompts/psi/
ls -la prompts/phi/
ls -la prompts/omega/
ls -la prompts/mu/
```

Read:
- `prompts/expanse-system.md` — entry point
- `prompts/meta_prompt.md` — orchestrator
- `docs/EXPANSE-MANIFEST.md` — current structure
- `docs/ONTOLOGY.md` — symbols

```markdown
## System Map
- Organs: [list]
- Key files: [list]
- Structure: [description]
```

---

### Step 1 : Λ Context — Problem & Constraints

> "⚡ ⎟ 0. Λ Contexte & Contraintes (en ≤ 3 lignes)"

**Questions (one per message):**
- What is the observed problem?
- Impact: blocking / performance / inconsistency / missing?
- Constraint: don't break X, keep Y?

**Subject type:**
- **Feature** — add capability
- **Bug** — fix erroneous behavior
- **Amélioration** — optimize existing
- **Problème** — diagnose and resolve

```markdown
## Λ Contexte
**Type:** [feature|bug|amélioration|problème]
**Problème:** [1-3 lines]
**Contraintes:** [what cannot be broken]
**Complexity budget:** [estimation]
```

---

### Step 2 : ECS Estimate — Cognitive Complexity

> "⚡ ⎟ 0.a Estimation de Charge Cognitive (ECS)"

**Method:**
| Dimension | Description | Range |
|-----------|-------------|-------|
| Files impacted | Number of prompts/files to modify | 1-5 |
| Symbols/Heuristics | New symbols, rules, patterns | 1-5 |
| Functionality | Feature complexity | 1-5 |
| Regression risk | Chance to break existing | 1-5 |

```
ECS = (files + symbols + functionality + regression) / 4
```

**KERNEL threshold: 2.5**
- **ECS < 2.5** : Lightweight — simplified process
- **ECS ≥ 2.5** : Structured — full process

```markdown
## ECS Estimate
**Score:** [X.X / 2.5]
**Mode:** [lightweight|structured]
```

---

### Mode Selection

**IF ECS < 2.5 (Lightweight):**
- Max 2 approaches
- 1 iteration per approach
- Skip detailed Comparison Table

**IF ECS ≥ 2.5 (Structured):**
- 3+ approaches
- Iteration to apex
- Full process

---

### Step 3 : Clarifying Gate

> "⚡ ⎟ 0.b Clarifying Gate"

**IF critical ambiguity:**
- Ask ≤ 3 targeted questions
- Tag: `<!--needs_clarification-->`
- Wait for response

**ELSE:** Go to Step 4

---

### Step 4 : Ω Generate — Iteration to Apex

> "⚡ ⎟ 1. Génération d'approches (divergence)"
> "⚡ ⎟ 2. Boucle critique par approche"

Propose **3+ radically distinct approaches**.

**FOR EACH approach, iterate:**

```
┌─────────────────────────────────────────────────────────────┐
│ Approach [A|B|C]                                            │
├─────────────────────────────────────────────────────────────┤
│ a. Ω Critical Analysis — Forces, Weaknesses, Hypotheses   │
│ b. Ξ Non-Regression — Proof of behavior preservation     │
│ c. Φ/Ξ Collapse Gate — Monitor quality                   │
│ d. Simplicity Gate — complexity_score                     │
│ e. Pair-Opposition Audit — Deletion vs Justification     │
│ f. Two-Sentence Summary — Summary in 2 sentences          │
│ g. Targeted Improvements — 2+ optimizations               │
│ h. Journal M — Log effort, instabilities, ECS            │
│ i. Compression — Synthesis in 5 points max               │
│                                                             │
│ IF APEX → next approach                                    │
│ IF FAIL → improve → iterate                               │
│ IF IMPOSSIBLE → abandon                                    │
└─────────────────────────────────────────────────────────────┘
```

#### 4a. Ω Critical Analysis
Forces / Weaknesses / Hypotheses / Risks

#### 4b. Ξ Non-Regression
Critical behaviors to preserve

#### 4c. Φ/Ξ Collapse Gate
> "⚡ ⎟ 2.c"

- Monitor logical quality drop
- **IF ECS < 2.5 or 2 consecutive failures** → fail-safe

#### 4d. Simplicity Gate
> "⚡ ⎟ 2.d"

**For EXPANSE:**
```
complexity_score = files + symbols*2 + functionality*2
```

**IF > budget × 1.15 → KISS:**
- Delete?
- Duplicate?
- Shortest version?

#### 4e. Pair-Opposition Audit
> "⚡ ⎟ 2.e"

- **Opposer** = "delete this approach"
- **Proposeur** = "justify why to keep"

#### 4f. Two-Sentence Summary
> "⚡ ⎟ 2.f"

If failure → reformulate summary in 2 sentences

#### 4g. Targeted Improvements
> "⚡ ⎟ 2.g"

≥ 2 concrete optimizations per approach

#### 4h. Journal M
> "⚡ ⎟ 2.h"

```markdown
## Journal M
- Cognitive effort: [X/5]
- Instability points: [list]
- Corrections applied: [list]
- Current ECS: [X.X]
```

#### 4i. Compression
> "⚡ ⎟ 2.i"

Synthesis of gains in **max 5 points**

```markdown
## Compression
1. [Gain 1]
2. [Gain 2]
3. [Gain 3]
4. [Gain 4]
5. [Gain 5]
```

---

### Step 5 : Comparison Table

> "⚡ ⎟ 3. Comparaison finale des approches"

| Approach | Simplicity | Robustness | Non-Regression | Complexity | Verdict |
|----------|------------|------------|----------------|------------|---------|
| A        | ...        | ...        | ...            | ...        | [✓|✗]   |
| B        | ...        | ...        | ...            | ...        | [✓|✗]   |
| C        | ...        | ...        | ...            | ...        | [✓|✗]   |

---

### Step 6 : Final Synthesis — Design Hybrid

> "⚡ ⎟ 4. Synthèse / Fusion"
> "⚡ ⎟ 4.b Proof by Test & Non-Regression"
> "⚡ ⎟ 4.c Refactor-to-Core (80/20)"
> "⚡ ⎟ 4.d Checklist YAGNI"

```markdown
# Design — [Titre]

## Context
[Λ Contexte complet]

## ECS Estimate
[ECS: X.X / 2.5] — Type: [feature|bug|amélioration|problème]

## Approaches
### Approche A
[Itérations + Apex]

### Approche B
[Itérations + Apex]

### Approche C
[Itérations + Apex]

## Compression (5 points)
1. ...
2. ...
3. ...
4. ...
5. ...

---

## FinalSolution
[CORE_RULE si applicable]
[HEURISTIC si applicable]

## Proof by Test
[Comment tester cette solution dans EXPANSE]
[Scénarios de validation]

## Refactor-to-Core
[Si applicable: 80/20 des changements]

## Checklist YAGNI
- [ ] [ce qu'on fait]
- [ ] [ce qu'on ne fait PAS]

## Type de Mutation
[ADD|MODIFY|DELETE|REFACTOR|OPTIMIZE|FIX]

## Fichiers Impactés
- [CREATE|MODIFY|DELETE] `prompts/[chemin]`
- [MODIFY] `prompts/meta_prompt.md`
- [MODIFY] `docs/ONTOLOGY.md` — si symbole
- [MODIFY] `docs/EXPANSE-MANIFEST.md` — si structure
```

---

### Step 7 : Quality Audit & Robustness Test

> "⚡ ⎟ 5. Audit Qualité & Meta-cohérence"
> "⚡ ⎟ 6. Dernier levier d'optimisation (Ψ)"

**Quality Audit:**
- Functional / perf / API / security diff
- Collapse signals

**Ψ Robustness test:**
> "La logique tient-elle si on l'inverse ou la contredit ?"

**Ψ Last lever:**
Last simplification or high-cognitive-yield insight

```markdown
## Quality Audit
- [Audit results]

## Ψ Robustness Test
[Inversion test]
[Contradiction test]

## Ψ Last Lever
[Last optimization]
```

---

### Step 8 : Output Contract

> "⚡ ⎟ 8. Output Contract"

**Fixed sections (strict order):**
- `## Context`
- `## ECS Estimate`
- `## Approaches` (with iterations + apex)
- `## Compression`
- `## ComparisonTable`
- `## FinalSolution`
- `## ProofByTest`
- `## RefactorToCore`
- `## ChecklistYAGNI`
- `## QualityAudit`
- `## RobustnessTest`
- `## LastLeverΨ`

```markdown
## Output Contract
**schema_version**: "EXPANSE-1.0-Antifragile"
**Format:** markdown
**Longueur:** ≤ 1000 tokens
```

---

### Step 9 : Handoff

```
✅ Design: docs/plans/YYYY-MM-DD_HH-MM-[nom]-design.md
Type: [feature|bug|amélioration|problème]
ECS: [X.X / 2.5]
Mutation: [ADD|MODIFY|...]

→ writing-plans
```

---

## Anti-Patterns

| ❌ | ✅ |
|---|---|
| Start with solution | Start with problem |
| Ignore ECS | Calculate ECS (Step 2) |
| Single approach | 3+ approaches |
| Skip iteration | Iterate to apex |
| Ignore non-regression | Ξ Non-Regression (Step 4b) |
| Skip simplicity gate | Simplicity Gate (Step 4d) |
| Forget Journal M | Log effort (Step 4h) |
| No fail-safe | Φ/Ξ Collapse Gate |
| Modify meta_prompt without design | STOP — design first |
| Forget markers | [CORE_RULE], [HEURISTIC] |

---

## Workflow Integration

```
[problem] → system-read → brainstorm → writing-plans → implementation
```
