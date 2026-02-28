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
