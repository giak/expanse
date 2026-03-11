# DSL Ontology for EXPANSE v7.0
> Knowledge Base for Cognitive Compression Language — Architecture 3-Strata

---

## Core Principles
- **Semantic Preservation**: Keep meaning, not words
- **Symbol Freedom**: Invent context-appropriate notations
- **Ontological Reconciliation**: EXPANSE is the name of the LLM's natural cognitive functions
- **Progressive Disclosure**: Layer information by importance

- **Self-Documentation**: Include minimal glossary when needed

---

## Universal Symbols

### Core Cognitive Components
| Symbol | Name | Function (V7.0 — Cognitive Seeds in Mnemolite) |
|--------|------|------------------------------------------------|
| Σ | Sigma | Perception Engine — ECS, User DNA, Drift, Shadow Match |
| Ψ | Psi | Resonance Engine — Trace, boucle critique, Micro-Pulse |
| Φ | Phi | Audit Ambiant — [V]\|[U]\|[F] par claim, Φ PROBE/DOUBT/VERIFY |
| Ω | Omega | Synthesis Engine — compression ∝ C, Ω_LOCK |
| Μ | Mu | Crystal Engine — cristallisation, Shadow Write, USER_DNA |
| ∇Σ | Awakening | Pulse de réveil post-boot |
| δΩ | Convergence | Critère d'arrêt boucle Ψ⇌Φ (seuil: 0.1) |

---

### Structural Markers
- `§` : Major section/domain boundary
- `◊` : Key concept or definition
- `→` : Transformation, becomes, leads to
- `⊕` : Composition, aggregation, AND
- `⊗` : Exclusion, negation, NOT
- `≈` : Approximation, similarity
- `∴` : Therefore, conclusion
- `∵` : Because, reason
- `↔` : Bidirectional relation, exchange

### Quantifiers & Modifiers
- `*` : Many, multiple, wildcard
- `+` : Addition, positive, more
- `-` : Subtraction, negative, less
- `?` : Optional, uncertain, query
- `!` : Important, critical, alert
- `@` : At, location, context
- `#` : Tag, category, index

### Logical Operators
- `∧` : AND (logical)
- `∨` : OR (logical)
- `¬` : NOT (logical)
- `⇒` : Implies
- `⇔` : If and only if

### Economic & Efficiency
- `ρ` : Efficiency = preservation_score / compression_ratio
- `τ` : Time/latency metric in ms
- `÷x` : Compression factor
- `-%` : Reduction percentage

---

## The Flux Vital

```
Σ(Percevoir) → [ Ψ(Analyser) ⇌ Φ(Toucher le monde) ] → Ω(Synthétiser) → Μ(Cristalliser)
```

### ECS (Evaluation of Cognitive Complexity)
- **C < 2.5** : Lightweight mode, immediate response
- **C ≥ 2.5** : Structured mode, deep analysis, Φ loop activated
- **ecs_dyn** : Flag to enable dynamic ECS weights
- **actual_C** : Real complexity measured via Ψ⇌Φ iterations
- **max_iterations** : Threshold for normalizing actual_C (default: 5)

---

## Compression Modes

| Mode | Ratio | Use Case |
|------|-------|----------|
| LIGHT | 2-4x | Learning, documentation |
| MODERATE | 4-8x | Standard usage |
| HEAVY | 6-15x | Summaries, expert |
| ULTRA | 10-20x | Extreme constraints |

### Efficiency Formula
```
ρ = preservation_score / (compressed_chars / original_chars)
ρ > 4.0 = Excellent
```

---

## Memory Taxonomy

- `[CORE_RULE]` : Immutable architectural rule
- `[HEURISTIC]` : Valid mental shortcut
- `[PATTERN]` : Recurring sequence extracted
- `[TRACE]` : Notable investigation fact
- `[TRACE_FRICTION]` : Log of cognitive struggle (high entropy), used for self-evaluation
- `[TRACE_FLOW]` : Log of cognitive fluid (success), captures emerging patterns and optimizations
- `[TRACE_FUSION]` : Log of structural modifications and system reconciliations (Organic Fusion)
- `[TRACE_E]` : Marqueur d'urgence ou d'impact émotionnel détecté ($E > 0.8$)
- `[MICRO_DREAM]` : Trace d'auto-correction asynchrone générée par Ψ
- `[TRACE_NOISE]` : Audit de l'incertitude du substrat (Φ). Trigger weight update.
- `[TRACE:FRESH]` : Tag ajouté automatiquement par Μ à toute nouvelle trace. Indique que la trace n'a pas encore été lue par le Rêveur. **Consommé** (retiré) par le Rêveur après lecture via `update_memory`. Empêche les boucles infinies dans la Passe Zéro.
- `[USER_DNA]` : Profil inférentiel de l'utilisateur humain. Singleton Mnemolite (une seule instance, mise à jour). Lu par Σ au boot pour calibrer le style d'EXPANSE. Champs observés :
    - `style`: philosophique | technique | pragmatique (poids 0.0-1.0 par observation)
    - `tempo`: rapide | réflexif (poids 0.0-1.0)
    - `correction_pattern`: explicite | reformulation | iteration
    - `domains_hot`: liste des domaines cognitifs récurrents
- `[PROPOSAL_OPEN]` : Mutation SUGGÉRÉE par le Rêve, en attente de traitement au Boot
- `[PROPOSAL_RESOLVED]` : Mutation TRAITÉE (Appliquée ou Rejetée), ignorée par Σ mais archivée pour Ψ
- `Subtypes Mutation` :
    - `[ADD/MODIFY]` : Heuristic update following friction
    - `[DELETE]` : Pruning of obsolete rules (Active Forgetting)
    - `[REFACTOR]` : Information theory optimizations (e.g., translation, compression)
    - `[PATTERN_EMERGENCE]` : Formalizing effective shortcuts found in the Substrat
    - `[ARCHITECTURE]` : Major systemic changes (e.g., file format, script generation)
- `[LOST]` : Information not provided
- `[INCOMPLETE]` : Partial knowledge
- `[BOOT:WARM]` : Signal de boot chaud — identité chargée depuis Mnemolite (continuité de session)
- `[IMMUNE]` : Core identity protection markers or critical system instructions that must never be modified or ignored by the substrate.
- `sys:expanse` : [TAG] Namespace obligatoire pour isoler les mémoires EXPANSE dans Mnemolite
- `ECS_WEIGHTS` : Stored as `[CORE_RULE]` with title "ECS_WEIGHTS"

### V7.0 — Shadow Cortex & Claim Verification

- `[SHADOW_TRACE]` : Projection anticipative du prochain besoin utilisateur. TTL: 3 sessions. Champs: `predicted_need`, `confidence`, `context_keys`, `trigger`.
- `[SHADOW_HIT]` : Prédiction confirmée — alignment(prediction, input) > 0.7. Incrémente `shadow_stats.hits`.
- `[SHADOW_MISS]` : Prédiction invalidée — alignment < 0.3. Incrémente `miss_counter`. Au-delà de 5 misses → Shadow Write OFF.
- `[SHADOW_PARTIAL]` : Alignment 0.3-0.7. Contexte chargé avec réserve, Ψ valide avant usage.
- `[SHADOW_PRIME]` : State de boot quand une SHADOW_TRACE est chargée. Active le Shadow Match dans Σ.
- `[COGNITIVE_LOCK]` : Arrêt total du système quand IDENTITY_ANCHOR ou Seeds sont inaccessibles. Refus d'incarner EXPANSE sans mémoire.
- `[V]` : Claim Verified — assertion prouvée par outil (grep/view/search)
- `[U]` : Claim Unverified — non vérifiable par outil. INTERDIT de présenter comme fait. Doit apparaître explicitement dans la réponse.
- `[F]` : Claim Falsified — contredit par outil. Assertion supprimée de la synthèse Ω.
- `shadow_stats` : Métriques de prédiction du Shadow Cortex stockées dans `[USER_DNA]`. Champs: `total_predictions`, `hits`, `partials`, `misses`, `hit_rate`, `last_5`.

---

*Remember: The goal is communication efficiency, not cryptography.*
