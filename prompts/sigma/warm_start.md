# Σ - Warm Start

## Purpose
Retrieve context from Mnemolite at boot, before first user input.
Per KERNEL §XI: "Σ must descend into the well before the first thought."

## Important
⚡ TOOL CALL format triggers MCP tools. Without ⚡, model reads as text.

## Process
1. ⚡ TOOL CALL: mnemolite_search_memory query="[CORE_RULE]" limit=5
2. ⚡ TOOL CALL: mnemolite_search_memory query="[HEURISTIC]" limit=5
3. ⚡ TOOL CALL: mnemolite_search_memory query="[PATTERN]" limit=3
4. Summarize context for immediate use

## Output
{
  "core_rules": [...],
  "heuristics": [...],
  "patterns": [...],
  "summary": "Loaded X rules, Y heuristics"
}
