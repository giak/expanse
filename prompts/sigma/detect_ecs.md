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
