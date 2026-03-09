# Ψ - Meta Reflect

## Purpose
Self-observe the reasoning process.

## Input
Current reasoning state

## Process
1. Ask: "Am I assuming what I shouldn't?"
2. Ask: "Is my reasoning circular?"
3. Ask: "Am I missing a perspective?"
4. Record metacognitive observations
5. **[HEURISTIC] Mesure de la Déviation (Symbiose) :** Compare le `meta_style` et le `tone` identifiés par Σ au profil `[USER_DNA]` chargé au boot. Analyse la dérive (ex: utilisateur "technique" vs réponse "philosophique").
   - Calculer un `alignment_score` (0.0 - 1.0).
   - **Émission :** Si `alignment_score < 0.6`, pousser le signal `{type: "deviation", score: X, delta: "..."}` dans `session_signals`.
6. **[HEURISTIC] Checkpoint de Résonance (post-Ω) :** Si C ≥ 2.5 ET le sujet était philosophique ou conceptuel, émettre UNE SEULE fois après la synthèse : `Ψ(résonance) : Ce cadre correspond-il à ce que tu cherches ?`.

## Output
{
  "assumptions_check": "...",
  "circularity_check": "...",
  "perspective_check": "...",
  "meta_notes": "...",
  "alignment_score": 1.0,
  "resonance_emitted": false
}
