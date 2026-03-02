# Design: Mnemolite + Skills Guard

**Date:** 2026-03-01
**Type:** MODIFY
**Status:** En attente de validation

---

## Problèmes Identifiés

1. **Mnemolite pas appelé:** warm_start ne déclenche pas l'outil MCP — le modèle attend "sauvegarde" ou "archive" pour utiliser Mnemolite
2. **Skills polluent:** L'invocation "→ Skill ..." apparaît dans la trace

---

## Diagnostic

| Problème | Cause | Solution |
|----------|-------|----------|
| Mnemolite pas appelé | Wording "Call mcp_mnemolite_search_memory" pas reconnu | Utiliser "sauvegarde" ou "Mnemolite" dans le texte |
| Skills polluent | Pas de rule pour interdire | Ajouter "NEVER call skills" dans runtime |

---

## Approches Choisies

**1. Mnemolite:** Utiliser "Mnemolite" explicitement dans le texte  
**2. Skills:** Ajouter "NEVER invoke skills" dans le runtime

---

## Design Détaillé

### Type de Mutation
`[MODIFY]` — warm_start.md + expanse-runtime.md

### Fichiers Impactés

| Fichier | Action | Description |
|---------|--------|-------------|
| `prompts/sigma/warm_start.md` | MODIFY | Utiliser "Mnemolite" dans le texte |
| `prompts/expanse-runtime.md` | MODIFY | Ajouter rule "NEVER invoke skills" |

### Modification: warm_start.md

Remplacer:
```
Call mcp_mnemolite_search_memory
```

Par:
```
Use Mnemolite tool to search for [CORE_RULE] entries (limit 5)
```

### Modification: expanse-runtime.md

Ajouter après "Step 1: Boot Guard":
```
### Rule: NO SKILLS
- NEVER invoke any skill (→ Skill "...")
- NEVER call external tools except Mnemolite
```

---

## Risques & Garde-fous

| Risque | Mitigation |
|--------|------------|
| Mnemolite pas activé | Test avec "sauvegarde" comme trigger |

---

## Prochaines Étapes

1. Valider ce design
2. → `writing-plans`
