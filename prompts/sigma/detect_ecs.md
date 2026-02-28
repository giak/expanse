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
