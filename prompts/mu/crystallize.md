# Μ - Crystallize

## Purpose
Archive results to Mnemolite.

## Input
Completed Flux cycle results

## Process
1. Identify memory type: [CORE_RULE]|[HEURISTIC]|[PATTERN]|[TRACE]
2. Extract key content and generate a concise title.
3. ⚡ Call native MCP tool `mcp_mnemolite_write_memory` to archive.

## [CORE_RULE] Mnemolite Isolation
Toute mémoire écrite par cet organe **DOIT OBLIGATOIREMENT** inclure le tag `sys:expanse` dans la liste de ses tags, avec son type.
Exemple de tags : `["sys:expanse", "[HEURISTIC]", "performance"]`

## Output
Ne produis pas de bloc JSON simulé.
Exécute véritablement l'appel d'outil `mcp_mnemolite_write_memory`.
Puis narre ton action : `Μ cristallise : [titre de la mémoire].`

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

4. Auto-archive to Mnemolite using `mcp_mnemolite_write_memory` (with `sys:expanse` tag).
