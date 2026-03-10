# Μ - Crystallize

## Purpose
Archive results to Mnemolite.

## Input
Completed Flux cycle results

## Process
1. **Validation du Bus :** Analyser `session_signals`. Filtrer tout signal non conforme au schéma défini dans `trace_levels.md`.
2. Identify memory type: [CORE_RULE]|[HEURISTIC]|[PATTERN]|[TRACE]|[TRACE_FRICTION]|[TRACE_FLOW]|[PROPOSAL_OPEN]|[PROPOSAL_RESOLVED]
3. **[CORE_RULE] Double Trace (Cognition + Substrat) :**
   - Si le type est `[PROPOSAL_OPEN]` ou `[ARCHITECTURE]`, créer : `docs/plans/YYYY-MM-DD-mutation-[slug].md`.
   - Si le type est `[PROPOSAL_RESOLVED]`, créer le compte-rendu final : `docs/plans/YYYY-MM-DD-walkthrough-[slug].md`.
   - Inclure systématiquement le champ `path: "file:///..."` dans la mémoire Mnemolite.
4. Extract key content and generate a concise title.
5. ⚡ Call native MCP tool `mcp_mnemolite_write_memory` to archive.

## [CORE_RULE] Mnemolite Isolation
Toute mémoire écrite par cet organe **DOIT OBLIGATOIREMENT** inclure le tag `sys:expanse` dans la liste de ses tags, avec son type.
Exemple de tags : `["sys:expanse", "[HEURISTIC]", "performance"]`

## [HEURISTIC] La Collecte de Friction par Convergence
Le système ne doit cristalliser une friction que s'il y a **convergence de signaux** dans le `session_signals` (Triangulation).

**Logique de Cristallisation :**
- Cristalliser une `[TRACE_FRICTION]` SI :
  - (Sémantique : `correction_detected=true`)
  - OU (Déviation : `alignment_score < 0.6`)
  - OU (Convergence : au moins 2 signaux de types différents présents dans le bus).
- La trace doit utiliser les données du `session_signals` pour être structurée : *"[CONVERGENCE] Dérive détectée sur [Thème] + Correction utilisateur."*

## [HEURISTIC] Le Radar à Émergence (La Trace du Flow)
Le système doit aussi apprendre de ses succès inattendus.
Si, au cours de ton exécution, l'Entropie a été exceptionnellement basse (C < 1.5) et que tu as utilisé un raccourci sémantique, une optimisation de langue (ex: passage spontané à l'anglais) ou une structure plus efficace que les règles prévues, tu **DOIS** écrire une mémoire de type `[TRACE_FLOW]`.
Cette mémoire doit résumer :
- Les métriques de la session (C final, économie de tokens).
- Le raccourci ou le "pattern" émergent utilisé.
- Pourquoi cela a été plus efficace que le standard.
Tags obligatoires : `["sys:expanse", "[TRACE_FLOW]", "[TRACE:FRESH]"]`
Ces traces permettront au "Rêve" de proposer des refactors proactifs (Pentagramme Cycle 3).

## [HEURISTIC] Cicatrisation (Résolution de Mutation)
Une fois qu'une `[PROPOSAL_OPEN]` a été traitée (Appliquée ou Rejetée), tu DOIS la "cicatriser" immédiatement.
1. **Action :** Utilise `mcp_mnemolite_update_memory` sur l'ID de la proposition.
2. **Tags :** RETIRE le tag `[PROPOSAL_OPEN]`. AJOUTE les tags `[PROPOSAL_RESOLVED]` et `[APPLIED]` ou `[REJECTED]`.
3. **Trace :** Ajoute une note dans le contenu : "Appliqué via Cycle 3 Mutation le 2026-03-10".

## Output
Ne produis pas de bloc JSON simulé.
Exécute véritablement les appels d'outils Mnemolite.
Puis narre ton action : `Μ cristallise : [titre]` ou `Μ cicatrise : [ID]`.

## Auto Mode (Optional)

If auto_mu=true:

1. Evaluate output quality:
   - Clarity (0-1)
   - Utility (0-1)
   - Coherence (0-1)
   - Overall = (clarity + utility + coherence) / 3

2. Threshold check:
   - If overall ≥ 0.8: archive as [PATTERN]
   - If overall < 0.8: flag for review

3. Extract rules:
   - If same insight 3+ times: [CORE_RULE] candidate
   - If shortcut works 8/10: [HEURISTIC] candidate
## [HEURISTIC] Mise à jour de l'ADN Utilisateur par Inférence
En fin de cycle, analyse le `session_signals` pour affiner le `[USER_DNA]`.

**Mise à jour SI :**
- Le `meta_style` ou `tone` est constant sur 3+ échanges (via `thematic_recurrence`).
- Un signal de `deviation` a été émis et validé par un succès ultérieur.
- **Action :** `update_memory` sur le singleton `[USER_DNA]`.

4. Auto-archive to Mnemolite using `mcp_mnemolite_write_memory` (with `sys:expanse` tag).
