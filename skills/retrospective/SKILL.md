---
name: retrospective
description: "Use at the end of a work session or after completing a crystallization cycle. Documents what was done, what was learned, emerging heuristics, and remaining debt. Closes the loop."
triggers:
  - pattern: "rétrospective|retrospective|bilan|fin.*session|clôture|on.*termine|wrap.*up"
    confidence: 0.8
  - pattern: "qu.*appris|heuristique.*émergente|dette.*technique|note.*pour.*la.*suite"
    confidence: 0.6
---

# Retrospective — Boucle d'Apprentissage

## Posture

> Le travail est fait. Avant de fermer, je documente ce qui s'est passé — pas pour l'archivage, mais pour apprendre.  
> Une rétrospective non faite = une heuristique perdue = un pattern qu'on réinventera la prochaine fois.

**Principle KISS :** 15 minutes max. Pas un roman. Des faits, des patterns, des décisions.

## Quand Utiliser

- Fin de session de travail (même courte)
- Après `anti-regression` complété avec succès
- Après un cycle complet `brainstorm → writing-plans → executing-plans → anti-regression`
- Quand on sent qu'on a appris quelque chose de non-trivial

**Skip si :** La session n'a produit aucun changement ou apprentissage (session de lecture pure).

---

## Process Flow

```
┌───────────────────────────────┐
│  1. Ce qui a été fait         │
│     ↓                         │
│  2. Ce qui a surpris          │
│     ↓                         │
│  3. Décisions & rationale     │
│     ↓                         │
│  4. Heuristiques émergentes   │
│     ↓                         │
│  5. Dette & prochaine session │
└───────────────────────────────┘
```

---

## Steps

### Step 1 : Ce qui a été fait

**Action :** Lister les changements réels (pas les intentions, les faits).

```markdown
### Ce qui a été fait
- [Cristallisation] Symbole Ξ créé dans prompts/symbols/xi.md
- [Modification] METAGUIDE.md mis à jour — ajout section §7 Ξ
- [Correction] Vaporware `dispatching-parallel-agents` résolu dans writing-plans
```

**Source :** L'output de `anti-regression` ou `executing-plans`.

---

### Step 2 : Ce qui a surpris / Résistances Rencontrées

**Action :** Documenter les frictions, imprévus, découvertes.

```markdown
### Surprises & résistances
- La définition de Ξ dans BIOS était partiellement en conflit avec §IV KERNEL — résolu en précisant la portée
- Le skill `writing-plans` référençait `dispatching-parallel-agents` depuis l'origine — non détecté jusqu'à cet audit
- Plus de temps que prévu sur Step 3 de brainstorm (clarification d'intention difficile)
```

---

### Step 3 : Décisions & Rationale

**Action :** Documenter les décisions non-triviales prises, et pourquoi.

```markdown
### Décisions prises

| Décision | Rationale |
|----------|-----------|
| Ξ ≠ Μ — distinction temporelle | Μ = cristallisation immédiate, Ξ = persistance long terme |
| SOFT-GATE au lieu de HARD-GATE | Adapté à un projet de DSL (pas de TDD automatisable) |
| Supprimer le vaporware plutôt que créer le SKILL | YAGNI — le besoin n'est pas encore confirmé |
```

---

### Step 4 : Heuristiques Émergentes

**Action :** Identifier les patterns appris pendant cette session.

**Critère pour encoder :** A-t-on appliqué cette séquence ≥ 3 fois ? (Règle des 3 — KERNEL §IX)

```markdown
### Candidats heuristiques

#### ✅ Confirmer (≥ 3 occurrences)
- "SI nouveau symbole ALORS vérifier collision avec Μ, Ψ, Φ avant design"
  → Encoder dans KERNEL ou METAGUIDE : `[HEURISTIC]`

#### 🔍 Observer (< 3 occurrences)
- "Quand Step 1 de brainstorm révèle un conflit → audit ciblé d'abord"
  → À observer encore avant d'encoder
```

---

### Step 5 : Dette & Prochaine Session

**Action :** Lister ce qui reste, et dans quel état.

```markdown
### Dette technique / cognitive

| Item | Type | Priorité | Action suggérée |
|------|------|----------|-----------------|
| Compléter skill retrospective | Implémentation | 🟡 Moyenne | Prochaine session |
| Ambiguïté Φ (2 définitions légèrement différentes) | Cohérence | 🟡 Moyenne | Audit ciblé |

### Prochaine session

**Prochaine action :** [brainstorm sur X | audit de Y | writing-plans pour Z]
**Contexte à garder :** [ce dont on devra se souvenir]
**Santé du système :** [X]/10 — [justification 1 phrase]
```

---

## Output Final

Deux formats possibles :

**Format court (fin de session légère) :** Directement en conversation, pas de fichier.

**Format complet (fin de cycle majeur) :** Écrire dans `docs/retrospectives/YYYY-MM-DD.md`

```markdown
# Rétrospective — [Date]

## Résumé
[1-2 phrases sur le cycle complet]

## Ce qui a été fait
[liste]

## Surprises
[liste]

## Décisions
[table]

## Heuristiques
[liste avec statut ✅/🔍]

## Dette & Suite
[table + prochaine action]

## Santé du système : [X]/10
```

---

## Anti-Patterns

| ❌ Anti-Pattern | ✅ Correct |
|----------------|-----------|
| Sauter la rétrospective (trop fatigant) | 15 minutes max — faire court mais faire |
| Écrire ce qu'on *voulait* faire, pas ce qui a été fait | Faits réels uniquement |
| Encoder une heuristique après 1 occurrence | Règle des 3 — observer d'abord |
| Note vague "à améliorer" | Dette concrète avec action suggérée |

---

## Intégration dans le Workflow

```
anti-regression → retrospective → [fin de session | prochaine session]
```

**Depuis :** `anti-regression` (naturellement en fin de cycle)  
**Vers :** Prochaine session qui commencera par `system-read` (contexte rechargé)
