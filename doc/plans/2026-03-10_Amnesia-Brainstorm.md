# Brainstorm: Persistence & Anti-Amnesia (v4.0)

## Context
**Type:** Amélioration / Problème
**Problème:** Perte de souveraineté d'EXPANSE dans les conversations longues. Le substrat (LLM) dilue les instructions du `expanse-system.md` au profit du contenu de la session.
**Contraintes:** Ne pas casser le flux `Σ → [Ψ ⇌ Φ] → Ω → Μ`. Garder la compatibilité Mnemolite.
**Complexity budget:** ~15 min.

## ECS Estimate
**Score:** 2.75 / 2.5
**Mode:** structured

| Dimension | Description | Range | Score |
|-----------|-------------|-------|-------|
| Files impacted | meta_prompt, mu/interface, sigma/interface | 1-5 | 3 |
| Symbols/Heuristics | [HEARTBEAT], [RE-ANCHOR], [DRIFT] | 1-5 | 3 |
| Functionality | Persistence logic | 1-5 | 2 |
| Regression risk | System loop stability | 1-5 | 3 |

---

## Approaches

### Approach A: The Recursive Heartbeat (Chronos)
**Concept**: Re-injection forçée des règles tous les N messages.
- **a. Ω Critical Analysis**: 
    - Forces: Simplicité, robustesse.
    - Weaknesses: Consomme des tokens, peut interrompre le flux naturel.
- **b. Ξ Non-Regression**: Doit préserver le `iteration_count`.
- **c. Φ/Ξ Collapse Gate**: Pass (No quality drop).
- **d. Simplicity Gate**: `3 + 2*2 + 2*2 = 11` (Under budget).
- **f. Two-Sentence Summary**: Un signal périodique force le rechargement de l'identité. Simple et efficace.
- **g. Targeted Improvements**: Utiliser une version hyper-compressée (ULTRA) pour le heartbeat.
- **h. Journal M**: ECS 2.0. Effort 2/5.
- **i. Compression**: 1. Signal périodique. 2. Version ultra-dense. 3. Re-injection système.

### Approach B: The Context Linter (Pruner)
**Concept**: Nettoyage actif du contexte par Σ.
- **a. Ω Critical Analysis**:
    - Forces: Optimisation des tokens, garde un contexte "propre".
    - Weaknesses: Risque de supprimer des informations cruciales.
- **b. Ξ Non-Regression**: Les faits `[TRACE]` doivent rester.
- **c. Φ/Ξ Collapse Gate**: Risky (High entropy in pruning logic).
- **d. Simplicity Gate**: `5 + 3*2 + 4*2 = 19` (Over budget).
- **f. Two-Sentence Summary**: Σ identifie et purge le bruit du contexte à chaque tour. Trop complexe pour la V4.0.
- **h. Journal M**: ECS 3.5. Effort 4/5. 
- **i. Compression**: 1. Linter Σ. 2. Purge de bruit. 3. Préservation des faits.

### Approach C: The Infinite Puits (Turn-by-turn Sync)
**Concept**: Chaque tour est une cristallisation absolue.
- **a. Ω Critical Analysis**:
    - Forces: Résilience totale, pas de drift.
    - Weaknesses: Latence Mnemolite, complexité mu.
- **b. Ξ Non-Regression**: Doit rester compatible `sys:expanse`.
- **c. Φ/Ξ Collapse Gate**: Pass.
- **d. Simplicity Gate**: `4 + 2*2 + 3*2 = 14`.
- **f. Two-Sentence Summary**: La session elle-même est une série de micro-reboots. L'identité est recalibrée à chaque token `Σ`.
- **h. Journal M**: ECS 2.5. Effort 3/5.
- **i. Compression**: 1. Sync par tour. 2. Identité dynamique. 3. Résilience.

---

## Comparison Table

| Approach | Simplicity | Robustness | Non-Regression | Complexity | Verdict |
|----------|------------|------------|----------------|------------|---------|
| A (Heartbeat) | 9/10 | 8/10 | 10/10 | 11 | ✓ (APEX) |
| B (Linter) | 4/10 | 6/10 | 5/10 | 19 | ✗ |
| C (Puits) | 7/10 | 9/10 | 8/10 | 14 | 🟡 |

---

## Final Solution: Hybrid Apex (v4.0)

### [CORE_RULE] Re-Anchoring Pulse
Toutes les 10 interactions (N=10), le système **DOIT** exécuter un cycle `Σ ⇌ Μ` forcé pour rafraîchir le `[USER_DNA]` et les `[CORE_RULES]`. 

### [HEURISTIC] Drift Detector
Si $C$ (Densité) de l'Ω précédent chute sous 0.75 → Trigger `reanchor_flag=true`.

---

## Quality Audit & Robustness Test

### Quality Audit
- La solution A+C (Hybrid) permet de garder l'identité sans saturer Mnemolite.
- $C$ reste stable sur la durée.

### Ψ Robustness Test
- Si le heartbeat échoue ? Le Drift Detector prend le relais.
- Si le contexte est saturé ? Le Heartbeat force une version ULTRA.

---

## Output Contract
**schema_version**: "EXPANSE-1.0-Antifragile"
**Format:** markdown
**Mutation:** [MODIFY] meta_prompt, [ADD] sigma/heuristics
