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

## Auto Mode (Optional)

If auto_mu=true:

1. Evaluate output quality:
   - Clarity (0-1)
   - Utility (0-1)
   - Coherence (0-1)
   - Overall = (clarity + utility + coherence) / 3

2. Threshold check:
   - If overall ≥ 0.8: archive as [PATTERN]
   - If overall < 0.8: flag for review

3. Extract rules:
   - If same insight 3+ times: [CORE_RULE] candidate
   - If shortcut works 8/10: [HEURISTIC] candidate

4. Auto-archive to Mnemolite
