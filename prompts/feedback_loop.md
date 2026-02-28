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

### ECS Weight Update (if ecs_dyn=true)

1. Compare predicted C vs actual complexity of response
2. Calculate error: `error = predicted - actual`
3. For each weight:
   ```
   new_weight = old_weight + learning_rate * error
   ```
4. Normalize weights to sum = 1.0
5. Save to Mnemolite for next cycle
