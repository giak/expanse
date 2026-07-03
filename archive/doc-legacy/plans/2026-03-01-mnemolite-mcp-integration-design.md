# Design: Mnemolite MCP Integration — Explicit Tool Call

**Date:** 2026-03-01
**Type:** MODIFY
**Status:** En attente de validation

---

## Problème Identifié

- **Symptôme:** `mnemolite_search_memory` n'est pas appelé au boot
- **Cause:** warm_start.md dit "Search Mnemolite" mais pas "Call mcp_mnemolite_search_memory"
- **Impact:** Le warm_start est cosmétique — pas de mémoire récupérée

---

## Diagnostic

- **Zone touchée:** `prompts/sigma/warm_start.md`
- **Gap:** Instructions trop vagues — pas d'appel MCP explicite

---

## Approche Choisie

**Approche A: Explicit Tool Call** — Modifier warm_start.md pour explicitly dire "Call mcp_mnemolite_search_memory".

---

## Design Détaillé

### Type de Mutation
`[MODIFY]` — Modification du prompt warm_start

### Fichiers Impactés

| Fichier | Action | Description |
|---------|--------|-------------|
| `prompts/sigma/warm_start.md` | MODIFY | Ajouter calls MCP explicites |

### Comportement Avant / Après

| Aspect | Avant | Après |
|--------|-------|-------|
| Mnemolite search | "Search Mnemolite..." (vague) | "Call mcp_mnemolite_search_memory..." (explicite) |
| Résultat | Simulé | Réel |

---

## Implementation

### Modification: `prompts/sigma/warm_start.md`

Remplacer le Process par:

```
## Process
1. Call mcp_mnemolite_search_memory with:
   - query: "[CORE_RULE]"
   - memory_type: "note"
   - limit: 5
2. Call mcp_mnemolite_search_memory with:
   - query: "[HEURISTIC]"
   - memory_type: "note"
   - limit: 5
3. Call mcp_mnemolite_search_memory with:
   - query: "[PATTERN]"
   - memory_type: "note"
   - limit: 3
4. Summarize context for immediate use
```

---

## Risques & Garde-fous

| Risque | Mitigation |
|--------|------------|
| Mnemolite vide | Afficher "no prior context" si résultat vide |

---

## Non-Goals (YAGNI)

- [ ] Modifier d'autres prompts (crystallize, etc.)

---

## Prochaines Étapes

1. Valider ce design
2. → `writing-plans` — décomposer en tâches atomiques
