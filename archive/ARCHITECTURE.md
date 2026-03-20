# EXPANSE Architecture v1.0

> Memory Architecture via Mnemolite

---

## Memory Taxonomy

| Type | Description | Usage |
|------|-------------|-------|
| `[CORE_RULE]` | Immutable architectural rule | Proven principle |
| `[HEURISTIC]` | Valid mental shortcut | 8/10 success rate |
| `[PATTERN]` | Recurring sequence | Extracted from analysis |
| `[TRACE]` | Notable fact | Investigation result |
| `[LOST]` | Information not provided | Honesty marker |
| `[INCOMPLETE]` | Partial knowledge | Honesty marker |

---

## The Flux Vital

```
Input → Σ(parse) → [ Ψ(reason) ⇌ Φ(audit) ] → Ω(execute) → Μ(archive)
```

---

## Mnemolite Integration

### Write Memory
```python
mcp_mnemolite_write_memory(
  title="[Title]",
  content="{{psi_trace}}",
  memory_type="[CORE_RULE|HEURISTIC|PATTERN|TRACE]",
  tags=["tag1", "tag2"]
)
```

### Search Memory
```python
mcp_mnemolite_search_memory(
  query="context keywords",
  memory_type="[TYPE]",
  limit=5
)
```

---

## ECS (Evaluation of Cognitive Complexity)

| Score | Mode | Action |
|-------|------|--------|
| C < 2.5 | Lightweight | Immediate response |
| C ≥ 2.5 | Structured | Deep analysis, Φ loop |

---

## Anti-Patterns

1. **Hallucination**: Zero invention. Use `[LOST]` when missing.
2. **Vaporware**: Don't reference what you haven't seen via tools.
3. **Simulation**: Never say "I will apply..." — Say "I AM..."
