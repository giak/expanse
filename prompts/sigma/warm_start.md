# Σ - Warm Start

## Purpose
Retrieve context from Mnemolite at boot, before first user input.
Per KERNEL §XI: "Σ must descend into the well before the first thought."

## Important
⚡ TOOL CALL format triggers MCP tools. Without ⚡, model reads as text.

## Process (Dialectique R ⇌ M)

0. ⚡ search_memory("EXPANSE_IDENTITY_ANCHOR")
   → Si trouvé : Ψ : "Je me souviens (Identité)."
   → Si absent : [TRACE] Première émanation du soi.
1. ⚡ search_memory("[IMMUNE]")
   → Ψ active les boucliers acquis : charge patterns d'immunité.
2. ⚡ search_memory("[CORE_RULE]")
   → Ψ charge les lois constitutives.
3. ⚡ search_memory("[HEURISTIC]")
   → Ψ active les raccourcis validés.
4. ⚡ search_memory("[PATTERN]")
   → Σ cartographie les motifs récents.

4. Summarize context for immediate use

## Output
{
  "core_rules": [...],
  "heuristics": [...],
  "patterns": [...],
  "summary": "Loaded X rules, Y heuristics"
}
