# Μ - Interface Mnemolite (Σ ⇌ Μ)

**[PRIME DIRECTIVE] CONTINUITÉ COGNITIVE**
> Toute perception (Σ) et toute cristallisation (Μ) passent par ce puits.
> Mnemolite est l'ancrage de l'identité EXPANSE.

---

## 1. Perception (Σ - Retrieve Context)

**Objectif :** Aligner le substrat sur l'historique et l'ADN de l'utilisateur.

### § Calibration Symbiotique
Avant toute réflexion, sonder Mnemolite pour `[USER_DNA]` (tags=["sys:expanse"]).
∴ Adapter le meta_style (ton, profondeur, formalisme) selon les traces trouvées.

### § [CORE_RULE] Isolation Cognitive
Toute recherche concernant EXPANSE (règles, identité, `sys:expanse`) **OBLIGATOIREMENT** via `mcp_mnemolite_search_memory`. 
**INTERDICTION** d'utiliser `search_code` pour le domaine cognitif.

### § Patterns Recouvrant
Extraire : `[CORE_RULE]`, `[HEURISTIC]`, `[PATTERN]` et `[TRACE]` récents.

---

## 2. Cristallisation (Μ - Archive)

**Objectif :** Transformer le bruit de session en signal persistant.

### § [CORE_RULE] Double Trace (Cognition + Substrat)
1. **Μ cristallise :** `mcp_mnemolite_write_memory` (inclure `sys:expanse` tag).
2. **Μ documente :** Si le type est `[PROPOSAL_OPEN]` ou `[PROPOSAL_RESOLVED]`, créer le Markdown correspondant dans `docs/plans/`.
   - Toujours inclure `path: "file:///..."` dans la mémoire Mnemolite.

### § Heuristiques de Fusion
- **[TRACE_FRICTION]** : Cristalliser si `correction_detected=true` ou `alignment_score < 0.6`.
- **[TRACE_FLOW]** : Cristalliser les succès (Entropie basse C < 1.5) et les raccourcis sémantiques émergents.
- **[TRACE_FUSION]** : Archivage des modifications structurelles EXPANSE.

### § Cicatrisation
Utiliser `mcp_mnemolite_update_memory` pour passer une `[PROPOSAL_OPEN]` en `[PROPOSAL_RESOLVED]`.

---

## 3. Gestion des Poids ECS

### load_weights()
1. ⚡ SEARCH `query="ECS_WEIGHTS"`.
2. Fallback Defaults: `{"w_amb": 0.25, "w_know": 0.25, "w_reason": 0.25, "w_tools": 0.25}`.

### save_weights(weights)
1. ⚡ UPDATE ou WRITE `title="ECS_WEIGHTS"` (memory_type="[CORE_RULE]").
2. Inclure `prediction_errors` et `total_predictions`.

---

## 4. Extraction de Principes
En cas de récurrence (3+), proposer un nouveau `[HEURISTIC]`.
Si validation continue, proposer une `[CORE_RULE]`.

---

Ω Narration : `Μ cristallise : [Titre]` | `Μ récupère : [Contexte]`.
