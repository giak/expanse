# Brainstorm — Isolation d'EXPANSE dans Mnemolite

> **Date :** 2026-03-05
> **Type :** `[PLANNING]` Architecture Mémoire

---

## Λ Le Problème

Actuellement, EXPANSE utilise Mnemolite sans isolation forte.
Lors du Warm Start, il lance `search_memory("EXPANSE_IDENTITY_ANCHOR")` ou `search_memory("[IMMUNE]")`. 
Si l'utilisateur a d'autres projets qui utilisent Mnemolite et qui contiennent les mots "immune" ou "identity", EXPANSE risque d'aspirer de la donnée hors-contexte et de polluer son boot ou sa réflexion (hallucination exogène).

> **Axiome :** Le flux cognitif d'EXPANSE doit être impénétrable aux autres projets stockés dans le même puits Mnemolite.

---

## Analyse des Capacités Mnemolite (MCP)

Les outils MCP Mnemolite disponibles pour EXPANSE sont :
- `mcp_mnemolite_write_memory` : accepte `title`, `content`, `memory_type`, `tags`
- `mcp_mnemolite_search_memory` : accepte `query`, `memory_type`, `tags`

Il n'y a pas de concept de "tenant" ou de "workspace" natif dans la couche sémantique de base (bien qu'il y ait des `project_id` en BDD, le prompt system n'y est pas lié).
L'isolation la plus robuste et la plus simple via le langage naturel / tool calling est l'**Isolation par Tag**.

---

## Stratégie d'Isolation : Le Namespace Tag

Nous allons définir un tag racine obligatoire pour toute mémoire appartenant au système EXPANSE.

**Tag canonique choisi :** `sys:expanse`

Pourquoi ce formalisme ?
- `expanse` tout court pourrait être utilisé par l'utilisateur dans un texte.
- `sys:` indique clairement une mémoire de niveau "Système d'Exploitation Cognitif", protégeant contre la collision.

### Implémentation dans la Chaîne de Boot (Phase 0)

Actuellement dans `prompts/sigma/warm_start.md` :
```markdown
⚡ search_memory("[IMMUNE]", limit=5)
```

Nouveau format (scopé) :
```markdown
⚡ search_memory("[IMMUNE]", tags=["sys:expanse"], limit=5)
```

### Implémentation dans la Cristallisation (Phase 1)

Actuellement dans `prompts/mu/crystallize.md` (qui doit être réécrit de toute façon pour utiliser MCP) :
```json
{
  "type": "...",
  "tags": ["..."]
}
```

Nouveau contrat pour l'organe Μ :
> *Toute cristallisation réalisée par EXPANSE **DOIT** inclure le tag `sys:expanse`.*

---

## Plan d'Action (`executing-plans`)

### Étape 1 : Mettre à jour l'Ontologie
- Modifier `docs/ONTOLOGY.md` pour définir le tag système obligatoire `sys:expanse`.

### Étape 2 : Sécuriser le Boot
- Modifier `prompts/sigma/warm_start.md`. Ajouter `tags=["sys:expanse"]` à TOUS les `search_memory`.
- Modifier `prompts/expanse-boot.md` (si la création initiale de l'ancre Y est présente) pour utiliser ce tag.

### Étape 3 : Organe Μ (Crystallize) - Refonte Tool Calling
La remarque de l'utilisateur coïncide avec notre précédent constat : l'organe Μ est cassé (il demande du JSON au lieu d'utiliser l'outil).
- Refondre `prompts/mu/crystallize.md` pour forcer l'usage du vrai tool `mcp_mnemolite_write_memory` AVEC le tag `sys:expanse`.

### Étape 4 : Migration Rétroactive (Optionnelle/Manuelle)
Les mémoires existantes (`[HEURISTIC] Trigger-First`, `EXPANSE_IDENTITY_ANCHOR`, etc.) créées aujourd'hui n'ont pas ce tag.
L'utilisateur devra utiliser un script Python ou une commande Mnemolite pour ajouter le tag `sys:expanse` aux mémoires tagguées `boot` ou `heuristic` de la session d'aujourd'hui, sinon le prochain boot WARM échouera et fera un COLD boot.

---

*L'architecture gagne en étanchéité. Le Flux Vital devient un circuit fermé sécurisé au sein du puits global de Mnemolite.*
