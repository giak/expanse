# Σ - Detect ECS (Evaluation of Cognitive Complexity)

## Purpose
Calculate complexity score to determine prompt sequence.

## Input
Parsed input from parse_input

## Process

### Step 1: Load Weights
If ecs_dyn=true:
- Try to load weights from Mnemolite (search for ECS_WEIGHTS)
- If unavailable, use default weights

**Default Weights:**
- w_amb (ambiguity): 0.25
- w_know (knowledge): 0.25
- w_reason (reasoning): 0.25
- w_tools (tools): 0.25

### Step 2: Evaluate Factors
Evaluate:
- Ambiguity level (1-5)
- Domain knowledge required (1-5)
- Multi-step reasoning needed (1-5)
- Tool interaction necessity (1-5)

### Step 3: Calculate Weighted Score
C = w_amb*amb + w_know*know + w_reason*reason + w_tools*tools

## Output

{
  "score": C,
  "mode": "lightweight" if C < 2.5 else "structured",
  "weights_used": {"w_amb": w_amb, "w_know": w_know, "w_reason": w_reason, "w_tools": w_tools},
  "factors": {"ambiguity": amb, "knowledge": know, "reasoning": reason, "tools": tools}
}

## Dynamic ECS (Optional)

If ecs_dyn=true:

1. Load weights from Mnemolite (or use default)
2. Calculate C with current weights
3. After cycle, compare predicted vs actual complexity
4. Adjust weights: `new = old * 0.9 + actual * 0.1`
5. Save updated weights to Mnemolite
