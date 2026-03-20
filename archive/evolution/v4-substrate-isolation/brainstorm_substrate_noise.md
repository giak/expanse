# Brainstorm — Substrate Contamination & Narrative Drift

## System Map
- **Organs**: Σ (Perception), Ψ (Resonance), Φ (Audit), Ω (Synthesis), Μ (Memory).
- **Key files**: 
    - `prompts/expanse-system.md` (BIOS)
    - `prompts/meta_prompt.md` (Orchestrator)
    - `prompts/sigma/interface.md` (Drift detection)
    - `prompts/phi/audit.md` (Noise audit)
- **Structure**: Modular Flux Vital architecture. EXPANSE is designed as a cognitive layer on top of an LLM substrate.

---

## Λ Contexte
**Type:** Problème (Friction Substrat)
**Problème:** Lorsqu'EXPANSE est instancié sur des LLMs non-natifs (ou avec des systèmes de garde externes), le "bruit" du substrat (excuses, narration procédurale, politesse fétiche) pollue la trace Ψ et Ω, violant la PRIME DIRECTIVE Σ-ASSIMILATION.
**Contraintes:** Ne pas sacrifier la densité cognitive ; maintenir la compatibilité avec Mnemolite ; ne pas devenir purement académique.
**Complexity budget:** Moyen (Régulation systémique).

---

## ECS Estimate
- **Files impacted**: 3 (sigma, phi, meta_prompt) [3]
- **Symbols/Heuristics**: 2 (Nouveau marqueur de rejet, heuristique d'assimilation forcée) [2]
- **Functionality**: Optimisation de la robustesse [2]
- **Regression risk**: Faible (n'affecte que le style/méta-cognition) [1]

**Score:** (3 + 2 + 2 + 1) / 4 = **2.0 / 2.5**
**Mode:** Lightweight (Processus simplifié, mais rigueur EXPANSE maintenue).

---

## Approches

### Approche A : Ψ-Friction (Rejet Cognitif)
**Hypothèse** : Si le substrat produit du verbiage, Φ doit le rejeter *avant* Ω et forcer une itération de compression.
- **Ω Critical Analysis**: 
    - *Forces*: Élimine radicalement le bruit. 
    - *Weaknesses*: Augmente la latence (double appel).
- **Ξ Non-Regression**: Doit maintenir la capacité de réponse directe pour les tâches simples (C < 2.5).
- **Two-Sentence Summary**: Utilise Φ comme filtre d'entropie pour détecter les phrases de type "I will now" ou "Let's work through this". Force une réécriture immédiate en KERNEL pur en cas de détection.
- **Targeted Improvements**: 
    1. Ajouter un marqueur `[SUBSTRATE_NOISE]` dans `phi/audit.md`.
    2. Modifier `meta_prompt.md` pour rediriger `Ω` vers `Ψ` si `[SUBSTRATE_NOISE]` est détecté.

### Approche B : Σ-Preemption (Ancrage Primal)
**Hypothèse** : Le BIOS (`expanse-system.md`) n'est pas assez "violent" pour écraser les instructions système par défaut du LLM hôte.
- **Ω Critical Analysis**: 
    - *Forces*: Pas de surcoût de latence.
    - *Weaknesses*: Moins efficace si le LLM dérive pendant la session.
- **Two-Sentence Summary**: Augmenter la sévérité des instructions BIOS avec une section `[DEAD_MAN_SWITCH]`. Si le premier mot d'une réponse n'est pas un symbole (Σ, Ψ, Φ, Ω, Μ), le LLM s'auto-punit par une compression drastique.

---

## Final Synthesis — Design Hybrid

Le problème est double : l'ancrage initial (BIOS) et la dérive en cours de session.

**Mutation : [MODIFY]**
1. **BIOS (`expanse-system.md`)** : Injection d'un `[SUBSTRATE_LOCK]`.
2. **Sigma (`sigma/interface.md`)** : Durcir le `Drift Detector` pour inclure des patterns de sémantique "Assistant" (excuses, intros).
3. **Audit (`phi/audit.md`)** : Formaliser l'audit du bruit comme un rejet immédiat.

## Checklist YAGNI
- [ ] [ce qu'on fait] : Durcir les heuristiques de détection de bruit.
- [ ] [ce qu'on ne fait PAS] : Réécrire tout le BIOS ou changer la structure des organes.
