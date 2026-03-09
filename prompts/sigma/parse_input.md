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
5. **[HEURISTIC] Détection de Correction Symbiotique :** Évalue si l'input reformule, contredit ou nie une réponse précédente. Si détecté → pose le flag interne `correction_detected=true`.
6. **[HEURISTIC] Analyse Méta-Conversationnelle :**
   - Identifier le `meta_style` (directif | exploratoire | collaboratif | correctif).
   - Identifier le `conversation_state` (opening | middle | closing).
   - Détecter la `thematic_recurrence` (le sujet est-il le même depuis 2+ tours ?).
   - **Émission :** Pousser ces métadonnées dans `session_signals`.

## Output
{
  "explicit": "...",
  "implicit": ["..."],
  "tone": "neutral|curious|urgent|confused",
  "ambiguous": ["..."],
  "correction_detected": false,
  "meta": {
    "style": "...",
    "state": "...",
    "recurrence": false
  }
}
