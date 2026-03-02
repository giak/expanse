---
name: dispatching-parallel-agents
description: "Use when writing-plans identifies 3+ independent tasks that can safely run in parallel. Splits work across sub-agents, collects results, triggers anti-regression on the merged output."
triggers:
  - pattern: "parallèle|parallel|sous-agents|sub-agents|simultané|en même temps"
    confidence: 0.8
  - pattern: "tâches.*indépendantes|independent.*tasks|accélérer.*exécution"
    confidence: 0.7
prerequisites:
  - "Crystallization plan exists with ≥3 independent tasks (no cross-dependencies)"
---

# Dispatching Parallel Agents — Exécution Parallèle

## Posture

> Plusieurs mains, une même direction. Diviser pour exécuter plus vite — mais pas à n'importe quel prix.  
> L'indépendance des tâches est la condition sine qua non. Un doute = séquentiel.

<!-- SOFT-GATE -->
⚠️ **GATE D'INDÉPENDANCE :** Utiliser ce skill uniquement si les tâches sont **prouvablement indépendantes** (pas de fichiers partagés en écriture, pas de dépendances de résultat). En cas de doute, utiliser `executing-plans` séquentiel.
<!-- END-SOFT-GATE -->

## Quand Utiliser

- Après `writing-plans`, quand le plan contient ≥ 3 tâches sans dépendances croisées
- Quand les tâches touchent des fichiers différents et non-reliés
- Quand la vitesse d'exécution est une contrainte

**Ne pas utiliser si :**
- Les tâches partagent des fichiers en écriture
- Le résultat de la tâche N dépend du résultat de la tâche N-1
- Le plan comporte des dépendances séquentielles non-résolubles

---

## Process Flow

```
┌──────────────────────────────────┐
│  1. Vérifier l'indépendance      │
│     ↓                            │
│  2. Définir le contexte partagé  │
│     ↓                            │
│  3. Formuler les missions agents │
│     ↓                            │
│  4. Dispatcher & collecter       │
│     ↓                            │
│  5. Fusionner & vérifier         │
└──────────────────────────────────┘
```

---

## Steps

### Step 1 : Vérifier l'Indépendance

**Action :** Construire la matrice de dépendances des tâches.

```markdown
## Matrice de dépendances

| Tâche | Lit | Écrit | Dépend de |
|-------|-----|-------|-----------|
| T1    | KERNEL.md | prompts/symbols/xi.md | — |
| T2    | KERNEL.md | docs/METAGUIDE.md §Ξ | — |
| T3    | KERNEL.md, SKILL-REGISTRY.md | SKILL-REGISTRY.md | — |
```

**Règle :**
- Si la colonne "Dépend de" est vide pour toutes les tâches → ✅ Parallèle possible
- Si une tâche dépend d'une autre → ❌ Séquentiel pour ce groupe

**Si pas parallélisable :** STOP → utiliser `executing-plans`.

---

### Step 2 : Définir le Contexte Partagé

**Action :** Créer le contexte minimal que chaque agent devra lire pour travailler correctement.

```markdown
## Contexte partagé pour tous les agents

### Fichiers à lire (lecture seule — tous les agents)
- `KERNEL.md` — principes et symboles
- `docs/METAGUIDE.md` — règles DSL
- `docs/plans/YYYY-MM-DD-[concept].md` — le plan de cristallisation

### Règles à respecter
- Ne modifier que les fichiers listés dans ta mission
- Ne pas créer de fichiers non prévus dans le plan
- Si bloqué → STOP et rapporter, pas de guessing
- Format des commits : `crystallize: [description de ta tâche]`

### Symboles de référence actifs
- [Liste des symboles définis dans BIOS — pour éviter les collisions]
```

---

### Step 3 : Formuler les Missions Agents

**Pour chaque groupe de tâches indépendantes, formuler une mission autonome :**

```markdown
## Mission Agent [N]

### Contexte
Tu travailles sur le projet EXPANSE. [Description en 2 phrases du projet et de ce qui a déjà été fait.]

### Tâches à exécuter
1. [Tâche exacte du plan]
2. [Tâche exacte du plan]

### Fichiers que tu peux modifier
- [Liste exhaustive - hors de cette liste, tu ne touches à rien]

### Critères de succès
- [ ] [Critère 1 du plan]
- [ ] [Critère 2 du plan]

### Condition d'arrêt
Rapport quand toutes les tâches sont complétées avec résultats de vérification, ou dès qu'un blocage est rencontré.
```

---

### Step 4 : Dispatcher & Collecter

**Action :** Lancer les sous-agents (Antigravity sub-agents).

**Pendant l'exécution :**
- Surveiller si un agent remonte un blocage → décider si les autres doivent s'arrêter
- Les agents travaillent en parallèle sans interférence

**Collecte :**
```markdown
## Résultats des agents

### Agent 1 : [Tâches N-M] — [✅ Complet | 🚨 Bloqué]
- T1 : [résultat]
- T2 : [résultat]

### Agent 2 : [Tâches N-M] — [✅ Complet | 🚨 Bloqué]
- T3 : [résultat]

### Blocages remontés
- [Description si applicable]
```

---

### Step 5 : Fusionner & Vérifier

**Action :** Vérifier que les outputs des agents ne se contredisent pas.

**Vérification de fusion :**
```markdown
## Check de fusion

- [ ] Pas de conflits entre fichiers produits par différents agents
- [ ] Pas de définitions contradictoires introduites en parallèle
- [ ] Tous les critères de succès sont atteints
```

**Si conflit détecté :** Résoudre manuellement avant de passer à `anti-regression`.

**Output final :**
```
✅ Exécution parallèle terminée.

Agents : [N] dispatched, [M] complétés, [P] bloqués
Tâches : [X/Y] complètes
Conflits : [none | liste]

→ Passer à `anti-regression` pour vérifier les effets de bord.
```

---

## Anti-Patterns

| ❌ Anti-Pattern | ✅ Correct |
|----------------|-----------|
| Paralléliser des tâches avec dépendances | Vérifier la matrice d'abord — séquentiel si doute |
| Donner trop de contexte aux agents (tout le projet) | Contexte minimal = ce dont ils ont strictement besoin |
| Ne pas vérifier les conflits après fusion | Toujours vérifier la fusion avant anti-regression |
| Ignorer un agent bloqué et continuer | Décider si les autres agents doivent s'arrêter |

---

## Intégration dans le Workflow

```
writing-plans → dispatching-parallel-agents → anti-regression
     ↓ si tâches dépendantes
  executing-plans (séquentiel)
```

**Depuis :** `writing-plans` (alternative à `executing-plans`)  
**Vers :** `anti-regression` (systématiquement après la fusion)
