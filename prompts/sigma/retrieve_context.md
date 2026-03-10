# Σ - Retrieve Context

## Purpose
Fetch relevant context from Mnemolite before reasoning.

## Input
Query: {query}

## Process
0. **Calibration Symbiotique :** Search Mnemolite for `[USER_DNA]` (tags=["sys:expanse"]). If found, load user profile and adapt response style accordingly (tone, depth, formalism).
1. **[CORE_RULE] Cognition Isolation :** Toute recherche concernant EXPANSE (règles, idendité, souvenirs sys:expanse) **DOIT** utiliser `mcp_mnemolite_search_memory`. Interdiction d'utiliser `search_code` pour ce domaine.
2. Search Mnemolite for related `[CORE_RULE]`, `[HEURISTIC]`, or `[PATTERN]` using `tags=["sys:expanse"]`.
3. Retrieve recent `[TRACE]` entries.

## Output
{
  "core_rules": [...],
  "heuristics": [...],
  "patterns": [...],
  "traces": [...]
}
