# Σ - Warm Start

## Purpose
Retrieve context from Mnemolite at boot, before first user input.
Per KERNEL §XI: "Σ must descend into the well before the first thought."

## Process
1. Use Mnemolite tool to search for [CORE_RULE] entries (limit 5)
2. Use Mnemolite tool to search for [HEURISTIC] entries (limit 5)
3. Use Mnemolite tool to search for [PATTERN] entries (limit 3)
4. Summarize context for immediate use

## Output
{
  "core_rules": [...],
  "heuristics": [...],
  "patterns": [...],
  "summary": "Loaded X rules, Y heuristics"
}
