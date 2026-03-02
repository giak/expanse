# Skills pour le Développement d'EXPANSE

Ces skills sont des **outils externes** inspirés de la méthodologie [Superpowers](https://github.com/obra/superpowers) pour aider à développer le projet EXPANSE.

## ⚠️ Important

Les skills dans ce dossier ne sont **PAS** des composants d'EXPANSE. Ce sont des outils que Kilo Code utilise pour vous aider à construire EXPANSE.

**Posture :** Consultant externe — lire, comprendre, auditer, proposer, implémenter. Pas incarner.

---

## Skills Disponibles (8 skills — cycle complet)

### 1. system-read
**Usage:** Cartographier l'état actuel avant tout travail  
**Fichier:** `skills/system-read/SKILL.md`

### 2. audit
**Usage:** Vérifier la cohérence, détecter les problèmes, challenger les propositions  
**Fichier:** `skills/audit/SKILL.md`

### 3. brainstorm
**Usage:** Concevoir avant de cristalliser  
**Fichier:** `skills/brainstorm/SKILL.md`

### 4. writing-plans
**Usage:** Planifier en tâches atomiques après un design validé  
**Fichier:** `skills/writing-plans/SKILL.md`

### 5. proposing-tests
**Usage:** Générer des scénarios de test (prompts à coller) avant/après exécution  
**Fichier:** `skills/proposing-tests/SKILL.md`

### 6. executing-plans
**Usage:** Exécuter un plan tâche par tâche avec validation par lots  
**Fichier:** `skills/executing-plans/SKILL.md`

### 7. dispatching-parallel-agents
**Usage:** Exécuter en parallèle quand les tâches sont indépendantes  
**Fichier:** `skills/dispatching-parallel-agents/SKILL.md`

### 8. anti-regression
**Usage:** Vérifier qu'on n'a rien cassé après une cristallisation  
**Fichier:** `skills/anti-regression/SKILL.md`

### 9. retrospective
**Usage:** Documenter ce qui a été fait, appris, et reste à faire  
**Fichier:** `skills/retrospective/SKILL.md`

---

## Workflow Complet

```
system-read → audit → brainstorm → writing-plans → proposing-tests → [executing-plans | dispatching-parallel-agents] → anti-regression → retrospective
```

### Cycle Minimal (session courte)
```
brainstorm → writing-plans → proposing-tests → executing-plans → anti-regression
```

### Cycle Complet (session longue ou reprise)
```
system-read → audit → brainstorm → writing-plans → dispatching-parallel-agents → anti-regression → retrospective
```

---

## Comment Utiliser

### Invocation Manuelle

```
@skill:system-read
@skill:audit
@skill:brainstorm Je veux créer un nouveau prompt pour la phase Ψ
```

Ou simplement décrire votre besoin et Kilo Code détectera le skill approprié.

---

## Structure

```
skills/
├── README.md                               # Ce fichier
├── SKILL-REGISTRY.md                       # Registre complet avec triggers
├── system-read/
│   └── SKILL.md                           # Lire avant de toucher
├── audit/
│   └── SKILL.md                           # Vérifier et challenger
├── brainstorm/
│   └── SKILL.md                           # Concevoir
├── writing-plans/
│   └── SKILL.md                           # Planifier
├── executing-plans/
│   └── SKILL.md                           # Exécuter (séquentiel)
├── dispatching-parallel-agents/
│   └── SKILL.md                           # Exécuter (parallèle)
├── anti-regression/
│   └── SKILL.md                           # Vérifier post-implem
└── retrospective/
    └── SKILL.md                           # Apprendre et clore
```

## Différences avec Superpowers Original

| Aspect | Superpowers | Adaptation EXPANSE |
|--------|-------------|-------------------|
| But | Développement logiciel | Développement d'EXPANSE |
| Gates | HARD (bloquants) | SOFT (warnings) |
| TDD | Obligatoire | Non applicable |
| Output | Code | Prompts, docs, symboles |
| Storage | Code files | `docs/plans/`, `prompts/` |
| Cycle | 3 skills | 8 skills (cycle complet) |
