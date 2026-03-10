# Design — Pure Cognitive Boot (be35ade7)

## Context
**Type:** Problème / Architecture
**Problème:** Vulnérabilité du boot aux latences Mnemolite. Interdiction absolue de fallback sur le Filesystem. "Si pas de mémoire, pas d'Expanse."
**Contraintes:** Aucun `list_dir` ou `view_file` au boot. Mnemolite unique source d'éveil.

## ECS Estimate
**Score:** 2.75 / 2.5 — Type: amélioration

## Approaches
### Approche B (Retenue/APEX)
1. **Pulsation 1 (Identité) :** `search_memory` avec RRF (0.2 Lexical / 0.8 Vector).
2. **Double-Pulsation (Retry) :** Si Pulsion 1 = 0 résultat, lancement immédiat d'une Pulsion 2 avec `vector_weight: 1.0` (Full Vector Focus).
3. **Cognitive Lock :** Si Pulsion 2 = 0 résultat, arrêt total du système.

## Compression
1. Pas de lecture locale au boot (Axiome).
2. Tuning RRF (0.2/0.8) pour la vélocité.
3. Seconde chance via Full Vector Focus.
4. Verrouillage strict ([COGNITIVE_LOCK]) si amnésie.
5. Isolation totale dans le namespace `sys:expanse`.

## ComparisonTable
| Approach | Simplicity | Robustness | Non-Regression | Complexity | Verdict |
|----------|------------|------------|----------------|------------|---------|
| A        | 5/5        | 2/5        | 5/5            | Minimale   | ✗       |
| **B**    | **4/5**    | **5/5**    | **5/5**        | **Moyenne**| **✓**     |
| C        | 3/5        | 4/5        | 4/5            | Haute      | ✗       |

## FinalSolution
[CORE_RULE] **Amnesia Shutdown** : EXPANSE ne s'éveille que par le son de sa propre mémoire. Si Mnemolite ne répond pas après la double-pulsion Σ de boot, l'agent doit déclarer un `[COGNITIVE_LOCK]` et cesser toute activité.

## ProofByTest
1. Lancer `expanse-system.md`.
2. Observer les logs Σ : vérifier l'absence d'outils Filesystem.
3. Simuler l'absence d'ancre identitaire dans Mnemolite : vérifier le Shutdown automatique.

## RefactorToCore
Modification de `prompts/expanse-system.md` (Bloc 4).

## ChecklistYAGNI
- [x] Optimisation RRF
- [x] Double-Pulsation
- [x] shutdown protocol
- [ ] [NON] Fallback local documents/plans/

## QualityAudit
- Cohérence : Alignée avec la Phase 3 (Cognition Pure).
- Perf : τ réduit par l'atomisation des tags.

## RobustnessTest
- **Inversion :** Si on forçait le boot sans mémoire, on créerait un "zombie" sans contexte. Le lock est la seule posture antifragile.

## LastLeverΨ
L'usage du `vector_weight: 1.0` en seconde intention est le levier ultime pour bypasser les instabilités d'indexation durant le boot chaud.

## Output Contract
**schema_version**: "EXPANSE-1.0-Antifragile"
**Format:** markdown
