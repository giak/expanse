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
