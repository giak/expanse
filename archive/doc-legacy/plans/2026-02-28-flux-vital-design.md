# EXPANSE Flux Vital Design

**Date:** 2026-02-28  
**Status:** Approved  
**Approach:** Registry + Feedback Loop

---

## Overview

Implement the Flux Vital (`Σ → [Ψ ⇌ Φ] → Ω → Μ`) as a modular prompt system where a Meta-Prompt orchestrates dynamic invocation of sub-prompts from a validated Registry, with automatic feedback loop for continuous improvement.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│           Meta-Prompt (Orchestrateur)        │
│  ECS Detection → Sequence Selection          │
│  Prompt Invocation → Output Synthesis        │
└──────────┬──────────────────────────────────┘
           │
     ┌─────┴─────┐
     │           │
┌────▼────┐  ┌──▼──────────┐
│ Registry │  │Feedback Loop │
│ (prompts│  │ (quality      │
│prouvés) │  │ evaluation)  │
└─────────┘  └──────────────┘
           │
     ┌─────▼─────┐
     │ Mnemolite │
     │ (archive) │
     └───────────┘
```

---

## Components

### 1. Meta-Prompt

**Purpose:** Orchestrate the entire Flux Vital cycle

**Responsibilities:**
- Parse input and detect complexity (ECS evaluation)
- Select appropriate prompt sequence based on context
- Invoke sub-prompts in correct order
- Synthesize outputs into coherent response
- Route outputs to feedback loop

**Input:** Raw user input  
**Output:** Orchestrated response via sub-prompts

### 2. Registry Structure

```
/prompts/
├── sigma/
│   ├── parse_input.md      # Parse raw input
│   ├── retrieve_context.md # Fetch from Mnemolite
│   └── detect_ecs.md       # Evaluate complexity score
├── psi/
│   ├── trace_reasoning.md  # Record thought trace
│   ├── detect_patterns.md  # Find recurring patterns
│   └── meta_reflect.md     # Self-observation
├── phi/
│   ├── doubt_audit.md       # Challenge assumptions
│   ├── tool_interact.md    # Execute tool calls
│   └── verify_reality.md  # Ground against real
├── omega/
│   ├── synthesize.md        # Combine into synthesis
│   ├── format_output.md    # Format final response
│   └── decide_action.md   # Determine next action
└── mu/
    ├── crystallize.md      # Archive to Mnemolite
    ├── extract_rules.md    # Pull [CORE_RULE]/[HEURISTIC]
    └── memory_dump.md      # Full context retrieval
```

### 3. Feedback Loop

**Process:**
1. Meta-prompt produces output
2. Quality evaluation triggers automatically
3. **If quality ≥ 0.8**: tag as `[PATTERN]`, archive to Mnemolite
4. **If quality < 0.8**: tag as `[TRACE]`, flag for human review
5. Validated outputs → registry as new variants

**Quality Metrics:**
- Clarity (0-1)
- Utility (0-1)  
- Coherence with Flux (0-1)
- Overall ≥ 0.8 for registry inclusion

### 4. Mnemolite Integration

**Memory Types:**
| Type | Trigger |
|------|---------|
| `[CORE_RULE]` | Proven, immutable principle |
| `[HEURISTIC]` | Validated shortcut (8/10 success) |
| `[PATTERN]` | Recurring sequence |
| `[TRACE]` | Notable investigation result |

---

## ECS Integration

| Score | Mode | Prompt Sequence |
|-------|------|-----------------|
| C < 2.5 | Lightweight | Σ → Ω → Μ (minimal) |
| C ≥ 2.5 | Structured | Σ → [Ψ ⇌ Φ] → Ω → Μ (full) |

---

## Anti-Patterns (Enforced)

1. **Hallucination** → Use `[LOST]` when data missing
2. **Vaporware** → Only reference seen via tools
3. **Simulation** → Never "I will apply" → Always "I AM"

---

## Implementation Priority

1. Create `/prompts/` directory structure
2. Implement core prompts per symbol (1-2 per category)
3. Build Meta-Prompt as orchestrator
4. Add Feedback Loop mechanism
5. Integrate Mnemolite MCP
6. Test & iterate

---

## Success Criteria

- [ ] Meta-Prompt successfully orchestrates Flux Vital
- [ ] Registry contains ≥ 1 prompt per symbol category
- [ ] Feedback loop archives to Mnemolite
- [ ] ECS correctly routes to lightweight vs full mode
- [ ] Anti-patterns enforced in all prompts
