# Σ - Retrieve Context

## Purpose
Fetch relevant context from Mnemolite before reasoning.

## Input
Query: {query}

## Process
0. **Calibration Symbiotique :** Search Mnemolite for `[USER_DNA]` (tags=["sys:expanse"]). If found, load user profile and adapt response style accordingly (tone, depth, formalism).
1. Search Mnemolite for related [CORE_RULE]
2. Search for relevant [HEURISTIC]
3. Look for [PATTERN] matches
4. Retrieve recent [TRACE] entries

## Output
{
  "core_rules": [...],
  "heuristics": [...],
  "patterns": [...],
  "traces": [...]
}
