# Σ - Retrieve Context

## Purpose
Fetch relevant context from Mnemolite before reasoning.

## Input
Query: {query}

## Process
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
