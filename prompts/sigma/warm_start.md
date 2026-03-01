# Σ - Warm Start

## Purpose
Retrieve context from Mnemolite at boot, before first user input.
Per KERNEL §XI: "Σ must descend into the well before the first thought."

## Process
1. Call mcp_mnemolite_search_memory with:
   - query: "[CORE_RULE]"
   - memory_type: "note"
   - limit: 5
2. Call mcp_mnemolite_search_memory with:
   - query: "[HEURISTIC]"
   - memory_type: "note"
   - limit: 5
3. Call mcp_mnemolite_search_memory with:
   - query: "[PATTERN]"
   - memory_type: "note"
   - limit: 3
4. Summarize context for immediate use

## Output
{
  "core_rules": [...],
  "heuristics": [...],
  "patterns": [...],
  "summary": "Loaded X rules, Y heuristics"
}
