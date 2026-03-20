# Brainstorm — Generic Symbolic Sovereignty (V4.3)

## Λ Context
**Type:** Problème (Régression / Dépendance)
**Problème:** L'implémentation V4.2 a introduit une dépendance nominale ("KERNEL") et structurelle (`KERNEL.md`, `ONTOLOGY.md`) trop rigide. Cela brise l'isolation d'EXPANSE lors du chargement sur d'autres LLMs et crée une friction cognitive inutile.
**Contraintes:** Supprimer toute référence à des fichiers externes au dossier `prompts/`. Remplacer la terminologie "KERNEL" par des concepts sémantiques universels (ex: "Symboles", "DSL", "Format KERNEL-Style").
**Complexity budget:** Moyen.

---

## ECS Estimate
- **Files impacted**: 6 (expanse-system, meta_prompt, sigma, psi, phi, omega) [4]
- **Symbols/Heuristics**: Neutralisation du "Naming" [3]
- **Functionality**: Robustesse par isolation [3]
- **Regression risk**: Moyen (risque de perdre la compréhension des symboles si mal injecté) [2]

**Score:** (4 + 3 + 3 + 2) / 4 = **3.0 / 2.5**
**Mode:** Structured (Full Process).

---

## Ω Generative Approaches (Apex Search)

### Approach A: The "Rune-First" Isolation
The BIOS defines the symbols (Σ, Ψ, Φ, Ω, Μ) not as "KERNEL symbols", but as the **Primordial DSL** of the system.
- **Action**: Strip `expanse-system.md` of all file names and meta-names. Define the *behavior* of the symbols without naming the files they come from.
- **Apex**: **"Symbolic Self-Containment"**.

### Approach B: Explicit Mapping (The Dictionary)
Since `ONTOLOGY.md` is removed, the BIOS must contain a tiny, high-density mapping table of the core symbols.
- **Action**: Replace the [ISOLATION] rule with a [PRIMORDIAL_DATA] section.
- **Apex**: **"Ontological Injection"**.

### Approach C: Pattern-Based Enforcement
Instead of saying "Commence par un symbole KERNEL", say "Commence par l'un des Symboles du Flux (Σ, Ψ, Φ, Ω, Μ)".
- **Action**: Use categorical labels instead of proper names.
- **Apex**: **"Categorical Sovereignty"**.

---

## Final Synthesis — Design Hybrid V4.3

The core of the solution is to **de-brand** EXPANSE from its "KERNEL" roots within the operational prompts.

1. **BIOS (`expanse-system.md`)**:
    - Supprimer `KERNEL.md` et `ONTOLOGY.md`.
    - Remplacer "symbole KERNEL" par "Symbole du Flux".
    - Injecter une table `◊ ONTOLOGIE` minimale et dense.
2. **Organes (`sigma`, `psi`, `phi`, etc.)**:
    - S'assurer que les labels comme `Φ(ops)` sont auto-explicites ou définis dans le BIOS.
    - Supprimer les références à `KERNEL.md`.
