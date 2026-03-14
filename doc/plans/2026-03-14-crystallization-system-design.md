# Design: Crystallization System (Μ)

> **Date:** 2026-03-14
> **Type:** feature (memory/learning)
> **Complexity:** C = 2.0 / 5 (lightweight)

---

## Λ Problem

**Type:** feature (learning)

**Problem:** Expanse ne cristallise pas ses apprentissages. Les patterns qu'il utilise ne sont pas sauvegardés. Pas de mémoire à long terme.

**Constraints:** Garder le boot silence, ne pas surcharger l'output

---

## C Complexity

**Score:** 2.0 / 5

**Mode:** lightweight

---

## Approaches

### Approach A: Automatique (rejeté)

Après chaque réponse, cristalliser automatiquement.

**Critique:** Trop intrusif, risque de polluer Mnemolite.

### Approach B: Validation Utilisateur (SELECTED)

Sur mots-clés de validation utilisateur.

### Approach C: Seuil de Répétition (rejeté)

Après 3 utilisations.

**Critique:** Trop complexe à tracker.

---

## ∴ Solution

### Trigger: Mots-clés de Validation

```
LORSQUE l'utilisateur envoie un message contenant:
- "merci", "parfait", "ok", "c'est bon"
- "bien", "excellent", "super", "génial"
- [autres synonymes de validation positive]

ALORS Expanse cristallise le pattern utilisé.
```

### Action: Crystallization

```
1. Identifier le pattern de raisonnement utilisé
2. Analyser la structure: Σ → [Ψ/Φ] → Ω
3. Créer une entrée Mnemolite:
   - title: "PATTERN: [nom]"
   - content: Description + Contexte
   - tags: ["sys:pattern", "[PATTERN]", "v14"]
4. Confirmer la cristallisation (output minimal)
```

### Format Mnemolite

```json
{
  "title": "PATTERN: Résolution Type [X]",
  "content": "# PATTERN DE RÉSOLUTION\n\n## Contexte\n[Description de la situation]\n\n## Méthode\n[Structure utilisée]\n\n## Résultat\n[Ce qui a fonctionné]\n\n## Tags\n[sys:pattern] [PATTERN] v14",
  "tags": ["sys:pattern", "[PATTERN]", "v14"],
  "memory_type": "pattern"
}
```

### Output Minimal

```
Ψ [Μ] Pattern cristallisé. {nombre_total} patterns en mémoire.
```

---

## ☐ Validation

- [ ] Trigger détecte les mots-clés
- [ ] Pattern identifié correctement
- [ ] Mnemolite write fonctionne
- [ ] Output minimal (pas de bruit)

---

## ∅ Exclusions

- Pas de cristallisation automatique
- Pas de seuil de répétition
- Pas de crystalline sans validation

---

## Files

- Modify: `prompts/expanse-v14-catalyst.md` (ajouter Section VII)

---

## Note

Ce design est une VERSION SIMPLE pour tester. Peut être étendu avec:
- Patterns complexes
- Multi-pattern tracking
- Évolution des patterns
