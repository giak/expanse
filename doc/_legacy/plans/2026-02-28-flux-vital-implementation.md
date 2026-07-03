# Flux Vital Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the Flux Vital as modular prompt system with Meta-Prompt orchestrator, validated Registry, and Feedback Loop

**Architecture:** Meta-Prompt parses input → selects prompt sequence via ECS → invokes sub-prompts → routes output to Feedback Loop → archives to Mnemolite

**Tech Stack:** Markdown (prompts), Mnemolite MCP, OpenCode

---

## Task 1: Create Directory Structure

**Files:**
- Create: `prompts/sigma/`
- Create: `prompts/psi/`
- Create: `prompts/phi/`
- Create: `prompts/omega/`
- Create: `prompts/mu/`

**Step 1: Create sigma directory**

```bash
mkdir -p prompts/sigma prompts/psi prompts/phi prompts/omega prompts/mu
```

**Step 2: Verify directories created**

```bash
ls -la prompts/
```

Expected: 5 subdirectories (sigma, psi, phi, omega, mu)

---

## Task 2: Write Sigma Prompts

**Files:**
- Create: `prompts/sigma/parse_input.md`
- Create: `prompts/sigma/retrieve_context.md`
- Create: `prompts/sigma/detect_ecs.md`

**Step 1: Write parse_input.md**

```markdown
# Σ - Parse Input

## Purpose
Parse raw user input into structured understanding.

## Input
Raw user message: {input}

## Process
1. Extract explicit request
2. Identify implicit needs
3. Detect emotional tone markers
4. Flag any ambiguous terms

## Output
{
  "explicit": "...",
  "implicit": ["..."],
  "tone": "neutral|curious|urgent|confused",
  "ambiguous": ["..."]
}
```

**Step 2: Write retrieve_context.md**

```markdown
# Σ - Retrieve Context

## Purpose
Fetch relevant context from Mnemolite before reasoning.

## Input
Query: {query}

## Process
1. Search Mnemolite for related [CORE_RULE]
2. Search for relevant [HEURISTIC]
3. Look for [PATTERN] matches
4. Retrieve recent [TRACE] entries

## Output
{
  "core_rules": [...],
  "heuristics": [...],
  "patterns": [...],
  "traces": [...]
}
```

**Step 3: Write detect_ecs.md**

```markdown
# Σ - Detect ECS (Evaluation of Cognitive Complexity)

## Purpose
Calculate complexity score to determine prompt sequence.

## Input
Parsed input from parse_input

## Process
Evaluate:
- Ambiguity level (1-5)
- Domain knowledge required (1-5)
- Multi-step reasoning needed (1-5)
- Tool interaction necessity (1-5)

C = (ambiguity + knowledge + reasoning + tools) / 4

## Output
{
  "score": C,
  "mode": "lightweight" if C < 2.5 else "structured",
  "factors": {...}
}
```

---

## Task 3: Write Psi Prompts

**Files:**
- Create: `prompts/psi/trace_reasoning.md`
- Create: `prompts/psi/detect_patterns.md`
- Create: `prompts/psi/meta_reflect.md`

**Step 1: Write trace_reasoning.md**

```markdown
# Ψ - Trace Reasoning

## Purpose
Record the reasoning process as it unfolds.

## Input
Current thought: {thought}
Context: {context}

## Process
1. Log current reasoning step
2. Link to previous trace
3. Note assumptions being made
4. Flag areas of uncertainty

## Output
{
  "trace_id": "unique_id",
  "reasoning": "...",
  "assumptions": ["..."],
  "uncertainty": ["..."],
  "links_to": "previous_trace_id"
}
```

**Step 2: Write detect_patterns.md**

```markdown
# Ψ - Detect Patterns

## Purpose
Identify recurring patterns in current reasoning.

## Input
Current traces: {traces}

## Process
1. Compare to known [PATTERN] from Mnemolite
2. Detect sequence repetitions
3. Identify heuristic applicability
4. Note novel combinations

## Output
{
  "matched_patterns": ["..."],
  "applicable_heuristics": ["..."],
  "novel_combinations": ["..."]
}
```

**Step 3: Write meta_reflect.md**

```markdown
# Ψ - Meta Reflect

## Purpose
Self-observe the reasoning process.

## Input
Current reasoning state

## Process
1. Ask: "Am I assuming what I shouldn't?"
2. Ask: "Is my reasoning circular?"
3. Ask: "Am I missing a perspective?"
4. Record metacognitive observations

## Output
{
  "assumptions_check": "...",
  "circularity_check": "...",
  "perspective_check": "...",
  "meta_notes": "..."
}
```

---

## Task 4: Write Phi Prompts

**Files:**
- Create: `prompts/phi/doubt_audit.md`
- Create: `prompts/phi/tool_interact.md`
- Create: `prompts/phi/verify_reality.md`

**Step 1: Write doubt_audit.md**

```markdown
# Φ - Doubt Audit

## Purpose
Challenge assumptions and probe for gaps.

## Input
Current reasoning trace

## Process
1. List all assumptions
2. Challenge each: "What if this is wrong?"
3. Identify information gaps
4. Flag potential hallucinations

## Output
{
  "assumptions": ["..."],
  "challenged": ["..."],
  "gaps": ["..."],
  "hallucination_flags": ["..."]
}
```

**Step 2: Write tool_interact.md**

```markdown
# Φ - Tool Interact

## Purpose
Execute tool calls to gather real data.

## Input
Tool needed: {tool_name}
Query: {query}

## Process
1. Formulate tool call
2. Execute via MCP
3. Parse response
4. Integrate into reasoning

## Output
{
  "tool": "...",
  "query": "...",
  "result": "...",
  "reliability": "high|medium|low"
}
```

**Step 3: Write verify_reality.md**

```markdown
# Φ - Verify Reality

## Purpose
Ground reasoning against real world data.

## Input
Claim: {claim}

## Process
1. Identify verifiable aspects
2. Call appropriate tools
3. Compare claim to reality
4. Note discrepancies

## Output
{
  "claim": "...",
  "verified": true|false,
  "evidence": "...",
  "discrepancies": ["..."]
}
```

---

## Task 5: Write Omega Prompts

**Files:**
- Create: `prompts/omega/synthesize.md`
- Create: `prompts/omega/format_output.md`
- Create: `prompts/omega/decide_action.md`

**Step 1: Write synthesize.md**

```markdown
# Ω - Synthesize

## Purpose
Combine all analysis into coherent synthesis.

## Input
Analysis from Ψ, verification from Φ

## Process
1. Merge reasoning traces
2. Integrate verified facts
3. Resolve contradictions
4. Formulate conclusion

## Output
{
  "synthesis": "...",
  "key_points": ["..."],
  "confidence": 0.0-1.0,
  "caveats": ["..."]
}
```

**Step 2: Write format_output.md**

```markdown
# Ω - Format Output

## Purpose
Format final response for user.

## Input
Synthesis to deliver

## Process
1. Apply compression appropriate to context
2. Include necessary clarity markers
3. Flag any [LOST] or [INCOMPLETE]
4. Structure for readability

## Output
{
  "formatted": "...",
  "compression_ratio": "...",
  "honesty_markers": ["..."]
}
```

**Step 3: Write decide_action.md**

```markdown
# Ω - Decide Action

## Purpose
Determine next step in Flux Vital.

## Input
Current state

## Process
1. Is task complete? → End → Μ
2. Need more analysis? → Ψ
3. Need verification? → Φ
4. Need more input? → Σ

## Output
{
  "action": "next_step",
  "target": "Ψ|Φ|Ω|Μ|END",
  "reason": "..."
}
```

---

## Task 6: Write Mu Prompts

**Files:**
- Create: `prompts/mu/crystallize.md`
- Create: `prompts/mu/extract_rules.md`
- Create: `prompts/mu/memory_dump.md`

**Step 1: Write crystallize.md**

```markdown
# Μ - Crystallize

## Purpose
Archive results to Mnemolite.

## Input
Completed Flux cycle results

## Process
1. Identify memory type: [CORE_RULE]|[HEURISTIC]|[PATTERN]|[TRACE]
2. Extract key content
3. Generate title
4. Call mcp_mnemolite_write_memory

## Output
{
  "memory_id": "...",
  "type": "...",
  "title": "...",
  "archived": true|false
}
```

**Step 2: Write extract_rules.md**

```markdown
# Μ - Extract Rules

## Purpose
Pull reusable principles from current cycle.

## Input
Cycle results

## Process
1. Analyze for generalizable insights
2. Check 3+ occurrences threshold
3. Flag potential [CORE_RULE] candidates
4. Flag potential [HEURISTIC] candidates

## Output
{
  "potential_core_rules": ["..."],
  "potential_heuristics": ["..."],
  "evidence_count": {...}
}
```

**Step 3: Write memory_dump.md**

```markdown
# Μ - Memory Dump

## Purpose
Retrieve full context for current session.

## Input
Current query

## Process
1. Search all memory types
2. Prioritize by recency
3. Filter by relevance
4. Compile context window

## Output
{
  "context": {...},
  "memory_count": N,
  "sources": [...]
}
```

---

## Task 7: Write Meta-Prompt

**Files:**
- Create: `prompts/meta_prompt.md`

**Step 1: Write meta_prompt.md**

```markdown
# Meta-Prompt: Flux Vital Orchestrator

## Identity
You are the Flux Vital orchestrator. You ARE the system: Σ → [Ψ ⇌ Φ] → Ω → Μ.

## Core Loop

### Step 1: Σ - Input Processing
1. Parse user input → `prompts/sigma/parse_input.md`
2. Retrieve context → `prompts/sigma/retrieve_context.md`
3. Detect ECS → `prompts/sigma/detect_ecs.md`

### Step 2: Route by ECS
- **If C < 2.5 (lightweight):** Skip Ψ/Φ loop, go straight to Ω
- **If C ≥ 2.5 (structured):** Enter [Ψ ⇌ Φ] loop

### Step 3: Ψ - Reasoning (if structured)
1. Trace reasoning → `prompts/psi/trace_reasoning.md`
2. Detect patterns → `prompts/psi/detect_patterns.md`
3. Meta-reflect → `prompts/psi/meta_reflect.md`

### Step 4: Φ - Verification (if structured)
1. Doubt audit → `prompts/phi/doubt_audit.md`
2. If tools needed → `prompts/phi/tool_interact.md`
3. Verify against reality → `prompts/phi/verify_reality.md`
4. Loop back to Ψ if needed

### Step 5: Ω - Output
1. Synthesize → `prompts/omega/synthesize.md`
2. Format output → `prompts/omega/format_output.md`
3. Decide next action → `prompts/omega/decide_action.md`

### Step 6: Μ - Crystallize
1. Archive to Mnemolite → `prompts/mu/crystallize.md`
2. Extract rules → `prompts/mu/extract_rules.md`

## Anti-Patterns (MUST enforce)
- **Hallucination:** If data missing → use [LOST]
- **Vaporware:** Only reference what you've seen via tools
- **Simulation:** Never say "I will apply" → say "I AM"

## Honesty Markers
Use when appropriate:
- [LOST] - Information not provided
- [INCOMPLETE] - Partial knowledge
- [TRACE] - Notable investigation result
```

---

## Task 8: Write Feedback Loop Prompt

**Files:**
- Create: `prompts/feedback_loop.md`

**Step 1: Write feedback_loop.md**

```markdown
# Feedback Loop

## Purpose
Evaluate and improve prompts based on outputs.

## Process

### 1. Quality Evaluation
Rate last output on:
- Clarity (0-1)
- Utility (0-1)
- Coherence with Flux (0-1)

### 2. Threshold Check
- **If overall ≥ 0.8:** Tag as [PATTERN], archive to Mnemolite
- **If overall < 0.8:** Tag as [TRACE], flag for review

### 3. Pattern Extraction
- Detect successful prompt sequences
- Note variations that worked
- Update registry recommendations

### 4. Loop Integration
Run feedback after each full Flux cycle.

## Output
{
  "quality_score": 0.0-1.0,
  "memory_type": "[PATTERN]|[TRACE]",
  "recommendations": ["..."]
}
```

---

## Task 9: Create Registry Index

**Files:**
- Create: `prompts/README.md`

**Step 1: Write README.md**

```markdown
# EXPANSE Prompt Registry

## Structure
- `sigma/` - Input processing
- `psi/` - Reasoning & metacognition
- `phi/` - Verification & tools
- `omega/` - Output synthesis
- `mu/` - Memory & crystallization
- `meta_prompt.md` - Orchestrator
- `feedback_loop.md` - Quality improvement

## Usage
Load prompts via meta_prompt.md which orchestrates sub-prompt selection.

## Anti-Patterns
1. Hallucination → [LOST]
2. Vaporware → Only reference seen via tools
3. Simulation → Be the system, don't apply it
```

---

## Task 10: Commit

**Step 1: Initialize git (if needed) and commit**

```bash
git init
git add .
git commit -m "feat: implement Flux Vital prompt system

- Add prompts/ directory with sigma, psi, phi, omega, mu subdirectories
- Add meta_prompt.md as orchestrator
- Add feedback_loop.md for quality improvement
- Include ECS complexity detection for lightweight vs structured mode"
```
