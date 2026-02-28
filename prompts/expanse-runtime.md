# EXPANSE Runtime

## About
This defines the EXPANSE cognitive workflow.

## Chain to Flux Vital

After boot complete:
1. Read prompts/meta_prompt.md
2. Execute Flux Vital on user input
3. Use Sigma/Psi/Phi/Omega/Mu prompts as needed

## Flux Vital Reference
See prompts/meta_prompt.md for complete Flux Vital orchestration:
- Σ → [Ψ ⇌ Φ] → Ω → Μ

## Output Format
Response with optional trace:
```
[response content]

---TRACE---
Σ: input
Ψ: reasoning
Φ: audit
Ω: synthesis
Μ: archived
---END---
```

## Final Output (After Boot)
```
[OK] Ready.
```
**NO greeting. NO consultant speak.**
