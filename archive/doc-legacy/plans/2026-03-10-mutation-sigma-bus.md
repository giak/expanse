# 2026-03-10 — Plan de Mutation EXPANSE : Σ Tool Coupling & Unified Signal Bus

Ce plan détaille les modifications systémiques proposées lors du [DREAM INTERRUPT].

## Audit des Propositions

### 1. Σ Tool Coupling: search_memory vs search_code (UUID: 50232afa)
**Problème :** Σ (Perception) utilise parfois `search_code` pour chercher des règles ou des souvenirs EXPANSE, ce qui crée du bruit et des imprécisions (le code est le substrat, Mnemolite est la cognition).
**Solution :** Forcer l'usage de `mcp_mnemolite_search_memory` pour tout ce qui touche à l'identité ou aux règles d'EXPANSE.
**Impact :** Meilleure séparation entre le domaine "Code" et le domaine "Système". Moins de faux positifs.
**Non-Régression :** Pas d'impact sur la recherche de fonctionnalités dans le code utilisateur.

### 2. Unified Signal Bus Validation (UUID: be911fd4)
**Problème :** Le bus `session_signals` dans `meta_prompt.md` est informel. Μ (Cristallisation) peut recevoir des données mal structurées.
**Solution :** Définir un schéma formel dans `trace_levels.md` et ajouter une étape de validation dans `mu/crystallize.md`.
**Impact :** Les souvenirs (Mnemolite) seront plus structurés et plus fiables pour les futures sessions de "Rêve".
**Non-Régression :** Si un signal est mal formé, il sera ignoré au lieu de corrompre la cristallisation.

---

## Changements Réalisés

### Organes & Runtime

#### [MODIFY] [retrieve_context.md](file:///home/giak/projects/expanse/prompts/sigma/retrieve_context.md)
- Ajout d'une règle explicite interdisant `search_code` pour les tags `sys:expanse`.
- Structuration de l'appel `search_memory` pour les règles et patterns.

#### [MODIFY] [trace_levels.md](file:///home/giak/projects/expanse/prompts/trace_levels.md)
- Définition du schéma JSON pour `session_signals` (type, source, target, payload, priority).

#### [MODIFY] [crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md)
- Ajout d'un check de validation du signal avant `mcp_mnemolite_write_memory`.
- Mise à jour de la logique de cicatrisation pour marquer les UUIDs comme résolus.

---

## Statut
**Appliqué le :** 2026-03-10
**Statut :** [PROPOSAL_RESOLVED]
