---
name: brainstorm
description: "Generic brainstorming protocol for any problem or need. Start with PROBLEM, end with DESIGN. No file dependencies - pure reasoning methodology."
triggers:
  - pattern: "brainstorm|problème|besoin|améliorer|comment.*résoudre"
    confidence: 0.7
  - pattern: "design|concevoir|architecture|solution"
    confidence: 0.6
---

# Brainstorm — Generic Protocol

> **Purpose:** Transform any problem into a validated design through structured reasoning.
> **No assumptions:** This skill works for any project, system, or context.
> **Output:** A design document ready for implementation.

---

## Core Principles

| Principle | Description |
|-----------|-------------|
| **Problem First** | Never start with a solution. Start with the problem. |
| **Multi-Path** | Always explore 3+ approaches before choosing |
| **Iterate to Apex** | Improve each approach until it can't be improved |
| **Prove It** | Every design must have validation criteria |
| **YAGNI** | ruthlessly remove unnecessary features |

---

## Process Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Λ PROBLEM — Define the problem in ≤ 3 lines            │
│    ↓                                                        │
│ 2. C COMPLEXITY — Estimate effort (1-5 scale)              │
│    ↓                                                        │
│ 3. ? CLARIFY — Ask questions if ambiguous                  │
│    ↓                                                        │
│ 4. ≿ GENERATE — 3+ distinct approaches                    │
│    ├─ Approach A → Critique → Improve → Apex               │
│    ├─ Approach B → Critique → Improve → Apex               │
│    └─ Approach C → Critique → Improve → Apex               │
│    ↓                                                        │
│ 5. ⊕ COMPARE — Compare apexes                             │
│    ↓                                                        │
│ 6. ∴ SYNTHESIS — Hybrid solution + validation             │
│    ↓                                                        │
│ 7. ☐ OUTPUT — Design document                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: Λ — Problem Definition

**Constraint:** Maximum 3 lines.

**Questions:**
- What is the observed problem?
- Impact: blocking / performance / broken / missing?
- What cannot be broken?

**Output:**
```markdown
## Λ Problem
**Type:** [bug|feature|improvement|investigation]
**Problem:** [≤3 lines]
**Constraints:** [what must be preserved]
```

---

## Step 2: C — Complexity Estimate

**Scale: 1-5**

| Dimension | Description |
|-----------|-------------|
| Files/Components | How many things need to change? |
| Dependencies | How many connections to other systems? |
| Risk | What could break if we get this wrong? |
| Novelty | Is this new territory or familiar? |

**Formula:**
```
C = (files + dependencies + risk + novelty) / 4
```

**Threshold: 2.5**
- **C < 2.5** → Lightweight (simplified)
- **C ≥ 2.5** → Full process

**Output:**
```markdown
## C Complexity
**Score:** [X.X / 5]
**Mode:** [lightweight|full]
```

---

## Step 3: ? — Clarifying Gate

**If unclear:**
- Ask 1-3 targeted questions
- Wait for response

**If clear:**
- Proceed to Step 4

---

## Step 4: ≿ — Generate Approaches

**Requirement:** 3+ radically different approaches

**For EACH approach, iterate:**

```
┌─────────────────────────────────────────────┐
│ Approach [X]                               │
├─────────────────────────────────────────────┤
│ a. WHAT — What is this approach?           │
│ b. WHY — Why would it work?                │
│ c. CRITIQUE — What's wrong with it?        │
│ d. IMPROVE — How to fix the critique?      │
│ e. APEX? — Good enough?                    │
│     YES → Next approach                    │
│     NO → Improve → Repeat d-e              │
└─────────────────────────────────────────────┘
```

### Iteration Rules

| If | Then |
|----|------|
| Approach is perfect | Mark as APEX → next |
| Has fixable issues | Fix → re-critique |
| Is fundamentally broken | Abandon → next |

---

## Step 5: ⊕ — Compare

**Create comparison table:**

| Approach | Pros | Cons | Risk | Complexity | Verdict |
|----------|------|------|------|------------|---------|
| A | ... | ... | ... | ... | [✓|✗] |
| B | ... | ... | ... | ... | [✓|✗] |
| C | ... | ... | ... | ... | [✓|✗] |

---

## Step 6: ∴ — Synthesis

**Output:**
```markdown
## ∴ Solution

### Hybrid Approach
[How the best elements are combined]

### Validation Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### What NOT to Do
- [ ] Excluded approach 1
- [ ] Excluded approach 2
```

---

## Step 7: ☐ — Output Contract

**Required sections (in order):**
1. `## Λ Problem`
2. `## C Complexity`
3. `## Approaches` (with iterations)
4. `## ⊕ Comparison`
5. `## ∴ Solution`
6. `## ☐ Validation`
7. `## ∅ Exclusions`

**Format:** Markdown
**Length:** ≤ 800 words for lightweight, ≤ 1500 for full

---

## Handoff

```
✅ Design complete: docs/plans/YYYY-MM-DD-[topic]-design.md
Complexity: C = [X.X/5]
Type: [bug|feature|improvement|investigation]

→ Ready for implementation planning
```

---

## Anti-Patterns

| ❌ | ✅ |
|---|---|
| Start with solution | Start with problem |
| Single approach | 3+ approaches |
| Skip iteration | Iterate to apex |
| No validation criteria | Always prove it works |
| Assume context | Ask clarifying questions |
| Over-engineer | YAGNI |

---

## Adaptability

**This skill is framework-agnostic.**

To adapt:
- Replace "Components" with your domain terms
- Replace "C Complexity" with your metrics
- Keep the PROCESS identical

**The method is the message.**
