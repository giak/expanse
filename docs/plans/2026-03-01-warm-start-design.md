# Design: Warm-Start — Activation Proactive de Σ

**Date:** 2026-03-01
**Type:** ADD + MODIFY
**Status:** En attente de validation

---

## Problème Identifié

- **Symptôme:** EXPANSE boot mais est amnésique et passif au démarrage
- **Cause:** Le Flux Vital est purement réactif — Σ n'explore pas Mnemolite au démarrage
- **Violation:** KERNEL §XI — Σ doit "descendre dans le puits" avant la première pensée
- **Impact:** EXPANSE = assistant passif, pas organisme souverain avec mémoire continue

---

## Diagnostic EXPANSE

- **Zone touchée:** `expanse-runtime.md` + `meta_prompt.md`
- **Composants suspects:** boot → runtime → "Ready" sans action proactive
- **Gap:** KERNEL §XI violé

---

## Approche Choisie

**Approche B: State Injection** — Création de `warm_start.md`

**Raisons:**
1. Résout le problème directement, cohérent avec KERNEL
2. Ajout minimal — pas de refactor du flux existant
3. Si contexte vide (premier démarrage), ça ne change rien
4. Sépare clairement "cold start" du "reactive mode"

---

## Design Détaillé

### Type de Mutation
`[ADD]` — Nouveau prompt + modification runtime

### Fichiers Impactés

| Fichier | Action | Description |
|---------|--------|-------------|
| `prompts/sigma/warm_start.md` | CREATE | Récupère contexte Mnemolite au boot |
| `prompts/expanse-runtime.md` | MODIFY | Appelle warm_start avant "Ready" |
| `docs/EXPANSE-MANIFEST.md` | ADD | Déclarer warm_start.md sous sigma/ |

### Comportement Avant / Après

| Aspect | Avant | Après |
|--------|-------|-------|
| Boot → Ready | `[OK] Ready.` — passif | `[OK] Σ: retrieved X rules, Y heuristics` |
| Mémoire | Vide au démarrage | Σ "descend dans le puits" |
| Réactivité | 100% réactive | Proactive (warm-up) + réactive |

---

## Implementation

### `prompts/sigma/warm_start.md`

```markdown
# Σ - Warm Start

## Purpose
Retrieve context from Mnemolite at boot, before first user input.
Per KERNEL §XI: "Σ must descend into the well before the first thought."

## Process
1. Search Mnemolite for [CORE_RULE] (limit 5)
2. Search for [HEURISTIC] (limit 5)
3. Search for recent [PATTERN] (limit 3)
4. Summarize context for immediate use

## Output
{
  "core_rules": [...],
  "heuristics": [...],
  "patterns": [...],
  "summary": "Loaded X rules, Y heuristics"
}
```

### Modification: `expanse-runtime.md`

Ajouter après "Runtime" et avant "Ready":

```
### Step 4: Warm Start (NEW)
- Execute prompts/sigma/warm_start.md
- Store retrieved context for session
- Output: "[OK] Ready. Σ: {summary}"
```

---

## Risques & Garde-fous

| Risque | Mitigation |
|--------|------------|
| Mnemolite vide au premier boot | OK — afficher "No prior context" |
| Temps de réponse au boot | Limiter à 5 items par catégorie |
| Session sans contexte | Fallback vers mode réactif classique |

---

## Non-Goals (YAGNI)

- [ ] auto_mu au boot (trop tôt pour archive)
- [ ] ECS dynamic au boot (pas de complexité — juste retrieve)
- [ ] Feedback loop au boot

---

## Prochaines Étapes

1. Valider ce design
2. → `writing-plans` — décomposer en tâches atomiques
