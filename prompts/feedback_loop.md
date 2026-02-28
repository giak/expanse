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
