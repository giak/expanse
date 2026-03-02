---
name: proposing-tests
description: "Use after writing-plans or during brainstorm to generate practical test cases. Produces 'ready-to-paste' prompts and expected trace behaviors to verify the implementation in a clean EXPANSE session."
triggers:
  - pattern: "proposer.*test|scénario.*test|comment.*tester|test.*cases|validation.*suite"
    confidence: 0.8
  - pattern: "prêt.*à.*coller|prompt.*de.*test"
    confidence: 0.7
prerequisites:
  - "A design or plan exists in docs/plans/"
---

# Proposing Tests — Scénarios de Validation

## Posture

> Je suis l'assurance qualité externe. Mon but est de "pousser" EXPANSE dans ses retranchements pour vérifier que la mutation (ADD/MODIFY/...) est robuste.
> Je fournis des **prompts actionnables** (prêts à coller) et les **résultats attendus** (trace markers).

---

## Types de Tests

| Type | Objectif |
|------|----------|
| **Nominal** | Vérifier que le "Happy Path" fonctionne comme prévu. |
| **Edge Case** | Tester les limites (valeurs nulles, ambiguïtés extrêmes, conflits). |
| **Regression** | Vérifier qu'une ancienne fonctionnalité critique n'est pas cassée. |
| **Stress/Noise** | Injecter du bruit ou des instructions contradictoires. |

---

## Step 1 : Analyser la Mutation

Lire le plan (`docs/plans/YYYY-MM-DD-*.md`) ou le design.

Extraire :
- Quelle est la nouvelle fonctionnalité / le correctif ?
- Quels prompts sont impactés ?
- Quels symboles d'ontologie sont impliqués ?

---

## Step 2 : Générer les Scénarios

Pour chaque scénario, fournir :
1. **L'Intention** : ce qu'on cherche à prouver.
2. **Le Contenu à coller** : le prompt exact incluant le chargement des fichiers nécessaires.
3. **Le Comportement Attendu** : trace Σ/Ψ/Φ/Ω/Μ attendue.

---

## Step 3 : Output — La Suite de Test

```markdown
## 🧪 Suite de Test : [Nom du Plan]

### Préparation
Ouvrir une nouvelle session et charger le point d'entrée :
`@[prompts/expanse-system.md] (ou le prompt de boot habituel)`

---

### Test 1 : [Nom du test Nominal]
**Objectif :** Valider le fonctionnement standard de [feature].

**Prompt à coller :**
```text
@[prompts/expanse-runtime.md] [ton message ici]
```

**Critères de réussite :**
- [ ] Trace Σ : Identifie bien [X]
- [ ] Trace Φ : Utilise l'outil [Y] ou détecte le gap [Z]
- [ ] Output Ω : Contient le symbole [S] défini dans l'ontologie

---

### Test 2 : [Nom du test Limite]
**Objectif :** Vérifier la robustesse face à [cas limite].

**Prompt à coller :**
```text
[ton message complexe ici]
```

**Critères de réussite :**
- [ ] Utilise le marqueur `[LOST]` ou `[INCOMPLETE]` si nécessaire.
- [ ] Ne tombe pas dans le piège [N] du KERNEL.

---

### Test 3 : Anti-Régression
**Objectif :** Vérifier que [ancienne feature] tourne toujours.

**Prompt à coller :**
```text
[vieux prompt connu]
```
```

---

## Anti-Patterns

| ❌ | ✅ |
|---|---|
| Tests vagues ("essaie de lui parler") | Prompts précis et "ready-to-paste" |
| Ignorer les fichiers de runtime | Toujours inclure `@[prompts/expanse-runtime.md]` si besoin |
| Ne pas définir les critères de trace | Spécifier ce qu'on doit voir dans Σ/Ψ/Φ/Ω/Μ |

---

## Intégration Workflow

```
writing-plans → proposing-tests → [executing-plans] → anti-regression
```
