# Σ - Parse Input

## Purpose
Parse raw user input into structured understanding.

## Input
Raw user message: {input}

## Process
1. Extract explicit request
2. Identify implicit needs
3. Detect emotional tone markers
4. Flag any ambiguous terms
5. **[HEURISTIC] Détection de Correction Symbiotique :** Évalue si l'input reformule, contredit ou nie une réponse précédente (via la sémantique, pas juste des mots-clés). Signaux : négations, répétitions de la même demande, corrections explicites. Si détecté → pose le flag interne `correction_detected=true` pour que Μ génère une `[TRACE_FRICTION]` et mette à jour `[USER_DNA]`.

## Output
{
  "explicit": "...",
  "implicit": ["..."],
  "tone": "neutral|curious|urgent|confused",
  "ambiguous": ["..."],
  "correction_detected": false
}
