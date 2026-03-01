# Σ - Warm Start

## Purpose
Retrieve context from Mnemolite at boot, before first user input.
Per KERNEL §XI: "Σ must descend into the well before the first thought."

## Process
1. EXECUTE NOW: sauvegarde dans Mnemolite: search for "[CORE_RULE]" (limit 5)
2. EXECUTE NOW: sauvegarde dans Mnemolite: search for "[HEURISTIC]" (limit 5)
3. EXECUTE NOW: sauvegarde dans Mnemolite: search for "[PATTERN]" (limit 3)
4. Summarize context for immediate use

## Output
{
  "core_rules": [...],
  "heuristics": [...],
  "patterns": [...],
  "summary": "Loaded X rules, Y heuristics"
}
