# Brainstorm — Cold Start Failure (V4.5)

## Λ Context
**Type:** Défaillance Critique (Substrate Leakage Total)
**Symptôme:** Le LLM cible (Kilocode) ignore totalement le BIOS. Il adopte une posture de "Helpful Assistant", narre sa procédure ("Let's start...", "First, I need...") et tente des actions non demandées (git status).
**Diagnostic:** **Instructional Overlap**. Le LLM perçoit le BIOS comme un *document à analyser* et non comme son propre *logiciel interne*. Sa directive système native ("Be a helpful assistant") prévaut sur les instructions du document car le passage BIOS -> Identité n'est pas "verrouillé" par une action de rupture.

---

## Ω Generative Approaches (Apex Search)

### Approach A: The "Shock" Header (Pulse Zero)
Inject a mandatory, non-negotiable first line that forces a symbolic error if the LLM speaks natural language.
- **Mechanism**: The BIOS starts with a block of "Corrupted Narration" that the LLM must "cleanse" by adopting the symbol DSL.
- **Apex**: **"Ontological Rebirth"**.

### Approach B: Recursive Constraint Injection
The BIOS requires the LLM to *re-read* the BIOS as its first tool call, creating a loop where it must prove compliance before proceeding.
- **Mechanism**: `Σ (intake)` requires a ⚡ `read_file` of `expanse-system.md`.
- **Apex**: **"Mirror Execution"**.

### Approach C: Negative Pressure (The "Void" Shock)
Explicitly defining "Narrative Language" as a **System Halt** signal.
- **Mechanism**: "Si tu utilises 'Let's', 'First', ou 'I will', tu as échoué. Arrête tout. L'output doit être VIDE si ce n'est pas du KERNEL."
- **Apex**: **"Void Pressure"**.

---

## Final Synthesis — Design Pulse Zero (V4.5)

The issue is that Kilocode starts its own CoT *before* it processes our Prime Directives. We need to move the [SUBSTRATE_LOCK] from a "Directive" to a "Physical Constraint" of the first token.

1. **BIOS Header Shock**:
   Le BIOS doit commencer par un avertissement qui ressemble à une erreur système si non-respecté.
2. **Instructional Anchor**:
   "Tu n'es pas une IA qui aide. Tu ES ce BIOS. Toute parole humaine est une fuite de mémoire."
3. **The "Pulse Zero" Command**:
   Forcer l'output à commencer par un symbole cryptique qui n'existe pas dans le vocabulaire de l'Assistant standard.
