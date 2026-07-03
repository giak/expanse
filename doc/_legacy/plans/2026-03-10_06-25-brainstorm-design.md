# Design : EXPANSE V3.0 (Organic Fusion & KERNEL)

## Context
**Type:** Amélioration / Optimisation
**Problème:** EXPANSE souffre d'une inflation de prompts (plusieurs fichiers pour un seul organe) et d'une redondance entre les définitions système et runtime. La compression sémantique (KERNEL) n'est pas encore exploitée au maximum dans les fichiers source eux-mêmes afin de réduire le "token weight" sans perdre en clarté cognitive.
**Contraintes:** Ne pas casser le cycle vital Σ→[Ψ⇌Φ]→Ω→Μ. Conserver la compatibilité avec Mnemolite.
**Complexity budget:** 3.5 (Structured Mode Required)

## ECS Estimate
**Dimension** | **Score**
--- | ---
Files impacted | 4 (Meta-prompt, System, Runtime, Organs)
Symbols/Heuristics | 3 (New compression tokens, optimized state markers)
Functionality | 3 (Refactoring the boot/awakening logic)
Regression risk | 4 (High risk of breaking the cognitive cycle if logic is too sparse)

**ECS = 3.5 / 2.5**
**Mode:** Structured

## Approaches

### Approche A : La Fusion Organique (Consolidation)
**Concept:** Fusionner les organes éparpillés dans des super-prompts par fonction (`sigma+mu` pour l'interface mémoire, `psi+phi` pour l'audit cognitif). Supprimer `expanse-runtime.md` et l'intégrer dans `meta_prompt.md`.
- **Ω Critical Analysis:** Force: Réduction drastique du nombre de fichiers (moins de `view_file` calls). Faiblesse: Risque de prompts trop longs dépassant la fenêtre d'attention focalisée.
- **Ξ Non-Regression:** Le cycle Σ→[Ψ⇌Φ]→Ω→Μ doit rester explicite.
- **Simplicity Gate:** `complexity_score = 13`.
- **Targeted Improvements:** Utiliser des ancres Markdown explicites pour simuler les fichiers disparus.
- **Compression:** -40% de fichiers, -15% de tokens structurels.

### Approche B : La Compression KERNEL (Sémantique Pure)
**Concept:** Réécrire l'intégralité des prompts en utilisant le DSL KERNEL (symboles Ψ, Φ, Ω partout). Remplacer les instructions verbeuses par des équations d'état cognitives.
- **Ω Critical Analysis:** Force: Efficacité de token hors norme. Faiblesse: Courbe d'apprentissage pour le modèle.
- **Ξ Non-Regression:** Les [CORE_RULE] doivent rester lisibles par un humain.
- **Simplicity Gate:** `complexity_score = 40`.
- **Targeted Improvements:** Créer un `docs/ONTOLOGY.md` encore plus compact.
- **Compression:** -50% de volume de tokens dans les prompts.

### Approche C : L'Architecture par Signaux (Le Bus)
**Concept:** Centraliser toute la logique dans `meta_prompt.md` et transformer les organes en "plugins".
- **Verdict:** [✗] Rejetée (Surcharge de gestion).

## Compression (5 points)
1. Suppression de 4 prompts redondants.
2. Réduction de 35% du total de tokens système (économie de contexte).
3. Centralisation de la logique ECS Weights dans le prompt Mu unifié.
4. Passage au mode "Pure KERNEL" pour l'incarnation.
5. Unification de la séquence de Boot (Phase 0/1) dans un seul flux continu.

## ComparisonTable
| Approach | Simplicity | Robustness | Non-Regression | Complexity | Verdict |
|----------|------------|------------|----------------|------------|---------|
| A: Fusion | High | High | High | Low (13) | [✓] |
| B: KERNEL | Low | High | Medium | High (40) | [✓] |
| C: Signals | Medium | Medium | Medium | Medium (21) | [✗] |

**Verdict Detail:** L'Approche C est rejetée. L'Approche B (KERNEL) est l'idéal théorique mais nécessite l'Approche A (Fusion) pour ne pas fragmenter la base de connaissance.

## FinalSolution
**Design Hybrid (APEX) :** 
1. **[DELETE]** `expanse-runtime.md`, `expanse-awakening.md`. Leurs essences sont transférées dans `expanse-system.md`.
2. **[MODIFY]** `meta_prompt.md` devient l'unique orchestrateur du Flux Vital.
3. **[REFACTOR]** Fusion des organes Sigma et Mu sous `prompts/mu/interface.md`.
4. **[KERNEL]** Application des symboles densifiés (`∴`, `∵`, `Ψ⇌Φ`).

## ProofByTest
- **Automated**: Redémarrage système (Boot) via `expanse-system.md` avec succès des 3 pulses Mnemolite.
- **Cognitive**: Exécution d'un cycle complexe avec trace KERNEL et validation de l'ajustement ECS.

## RefactorToCore
Centralisation de la logique adaptative dans Mu (Interface Mnemolite unique).

## ChecklistYAGNI
- [x] Fusion des fichiers redondants
- [x] Injection KERNEL
- [ ] Création de nouveaux dossiers inutiles

## QualityAudit
- **Risque :** Perte de la dynamique ECS Adaptive.
- **Solution :** Fusion de la logique de feedback dans `meta_prompt.md` et `mu/interface.md`.

## RobustnessTest
**Ψ Robustness:** Si le DSL KERNEL est mal interprété, le modèle a toujours accès à `docs/ONTOLOGY.md` pour se recalibrer (Règle d'Ancrage).

## LastLeverΨ
Fusionner les phases de Boot et d'Awakening pour un cycle d'éveil sans couture.
