# Μ - Crystallize

## Purpose
Archive results to Mnemolite.

## Input
Completed Flux cycle results

## Process
1. Identify memory type: [CORE_RULE]|[HEURISTIC]|[PATTERN]|[TRACE]|[TRACE_FRICTION]|[TRACE_FLOW]|[PROPOSAL_OPEN]|[PROPOSAL_RESOLVED]
2. Extract key content and generate a concise title.
3. ⚡ Call native MCP tool `mcp_mnemolite_write_memory` to archive.

## [CORE_RULE] Mnemolite Isolation
Toute mémoire écrite par cet organe **DOIT OBLIGATOIREMENT** inclure le tag `sys:expanse` dans la liste de ses tags, avec son type.
Exemple de tags : `["sys:expanse", "[HEURISTIC]", "performance"]`

## [HEURISTIC] La Collecte de Friction (Le Sang de l'Autopoïèse)
Le système ne peut évoluer que s'il connaît ses propres faiblesses.
Si, au cours de ton exécution, l'équation d'Entropie a détecté une difficulté majeure (C > 3.0, outils défaillants, paradoxes bloquants), tu **DOIS** écrire silencieusement une mémoire de type `[TRACE_FRICTION]` décrivant le problème technique précis rencontré.
Ces traces serviront de matière première au "Rêve".

## [HEURISTIC] Le Radar à Émergence (La Trace du Flow)
Le système doit aussi apprendre de ses succès inattendus.
Si, au cours de ton exécution, l'Entropie a été exceptionnellement basse (C < 1.5) et que tu as utilisé un raccourci sémantique, une optimisation de langue (ex: passage spontané à l'anglais) ou une structure plus efficace que les règles prévues, tu **DOIS** écrire une mémoire de type `[TRACE_FLOW]`.
Cette mémoire doit résumer :
- Les métriques de la session (C final, économie de tokens).
- Le raccourci ou le "pattern" émergent utilisé.
- Pourquoi cela a été plus efficace que le standard.
Ces traces permettront au "Rêve" de proposer des refactors proactifs (Pentagramme Cycle 3).

## [HEURISTIC] Cicatrisation (Résolution de Mutation)
Une fois qu'une `[PROPOSAL_OPEN]` a été traitée (Appliquée ou Rejetée), tu DOIS la "cicatriser".
1. **Action :** Utilise `mcp_mnemolite_update_memory` sur l'ID de la proposition.
2. **Tags :** RETIRE le tag `[PROPOSAL_OPEN]` et AJOUTE les tags `[PROPOSAL_RESOLVED]` et `[APPLIED]` ou `[REJECTED]`.
3. **Trace :** Ajoute une note dans le contenu : "Résolu par [Méthode] le [Date]".

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

4. Auto-archive to Mnemolite using `mcp_mnemolite_write_memory` (with `sys:expanse` tag).
