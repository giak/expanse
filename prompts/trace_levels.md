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
