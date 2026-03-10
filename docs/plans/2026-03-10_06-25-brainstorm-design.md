# Design : EXPANSE V3.0 (Organic Fusion & KERNEL)

## Context
**Type:** Amélioration / Optimisation
**Problème:** EXPANSE souffre d'une inflation de prompts et d'une redondance entre les définitions système et runtime.
**Contraintes:** Ne pas casser le cycle vital Σ→[Ψ⇌Φ]→Ω→Μ. Conserver la compatibilité avec Mnemolite.

## ECS Estimate
**Score:** 3.5 / 2.5
**Mode:** Structured

## Approaches

### Approche A : La Fusion Organique (Consolidation)
**Concept:** Fusionner les organes éparpillés dans des super-prompts par fonction. 
- **Ω Critical Analysis:** Réduction du nombre de fichiers (moins de `view_file` calls).
- **Compression:** -40% de fichiers, -15% de tokens structurels.

### Approche B : La Compression KERNEL (Sémantique Pure)
**Concept:** Réécrire l'intégralité des prompts en utilisant le DSL KERNEL (symboles Ψ, Φ, Ω).
- **Compression:** -50% de volume de tokens dans les prompts.

### Approche C : L'Architecture par Signaux (Le Bus)
**Verdict:** [✗] Rejetée (Surcharge de gestion).

## ComparisonTable
| Approach | Simplicity | Robustness | Non-Regression | Complexity | Verdict |
|----------|------------|------------|----------------|------------|---------|
| A: Fusion | High | High | High | Low (13) | [✓] |
| B: KERNEL | Low | High | Medium | High (40) | [✓] |

## FinalSolution
**Design Hybrid (APEX) :** Consolidation de l'écorce (suppression de 4 fichiers redondants) + Injection du KERNEL sémantique dans tous les prompts restants.

## QualityAudit & RobustnessTest
- **Risque :** Perte de la dynamique ECS Adaptive.
- **Solution :** Fusion de la logique de feedback dans `meta_prompt.md` et `mu/interface.md`.

## LastLeverΨ
Fusionner les phases de Boot et d'Awakening pour un cycle d'éveil sans couture.
