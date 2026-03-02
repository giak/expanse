---
name: writing-plans
description: "Use when you have a validated cognitive design and need to create a detailed crystallization plan. Tasks are typed: [PROMPT] for new prompt files, [WIRE] for meta_prompt.md wiring, [ONTOLOGY] for ONTOLOGY.md updates, [MEMORY] for Mnemolite rules, [MANIFEST] for docs/EXPANSE-MANIFEST.md updates, [TEST] for chain verification."
triggers:
  - pattern: "plan.*cristallisation|détailler.*tâches|next.*step.*after.*design"
    confidence: 0.7
  - file_exists: "docs/plans/*-design.md"
prerequisites:
  - "Design document exists in docs/plans/ and is approved"
---

# Writing Plans — Plan de Cristallisation

## Posture

> Transformer un design validé en tâches atomiques et actionnables.
> Chaque tâche = 2-5 minutes. Chaque tâche a un **type** précis. Pas de vague.

<!-- SOFT-GATE -->
⚠️ **GATE :** Design document validé dans `docs/plans/` ? Sinon → `brainstorm` d'abord.
<!-- END-SOFT-GATE -->

## Types de Tâches dans EXPANSE

Chaque tâche porte un **type** qui indique l'unité de travail :

| Type | Description | Fichier(s) concerné(s) |
|------|-------------|------------------------|
| `[PROMPT]` | Créer ou modifier un fichier de sous-prompt | `prompts/[organe]/[nom].md` |
| `[WIRE]` | Câbler le composant dans l'orchestrateur | `prompts/meta_prompt.md` |
| `[ONTOLOGY]` | Ajouter/modifier un symbole ou opérateur | `docs/ONTOLOGY.md` |
| `[MEMORY]` | Encoder une règle ou pattern dans Mnemolite | `mcp_mnemolite_write_memory` |
| `[MANIFEST]` | Mettre à jour la source de vérité structurelle | `docs/EXPANSE-MANIFEST.md` |
| `[BOOT]` | Modifier la chaîne de boot | `prompts/expanse-bios.md` ou `expanse-boot.md` |
| `[TEST]` | Vérifier la chaîne avec trace_level=3 | Vérification manuelle |
| `[DOC]` | Mettre à jour la documentation | `docs/METAGUIDE.md`, `kb/ARCHITECTURE.md` |

---

## Process Flow

```
┌────────────────────────────┐
│  1. Charger le Design      │
│     ↓                      │
│  2. Vérifier la Clarté     │
│     ↓                      │
│  3. Décomposer en Tâches   │
│     ↓                      │
│  4. Écrire le Plan         │
│     ↓                      │
│  5. Handoff                │
└────────────────────────────┘
```

---

## Steps

### Step 1 : Charger le Design

```bash
ls -la docs/plans/*-design.md | tail -3
```

Lire le design doc. Résumer en 4-5 phrases :
- Quel problème ce design résout-il ?
- Quel(s) type(s) de mutation ? (`[ADD]` / `[MODIFY]` / `[DELETE]` / `[REFACTOR]` / `[OPTIMIZE]` / `[FIX]`)
- Fichiers créés / modifiés / supprimés ?
- Impact sur `meta_prompt.md` ?
- Nouveaux symboles dans `docs/ONTOLOGY.md` ?

---

### Step 2 : Vérifier la Clarté

Checklist :
```
- [ ] Type de composant identifié ([PROMPT]|[LAYER]|[ORGAN]|[RULE]|[SYMBOL]|[WIRE]|[PARAM])
- [ ] Position dans le Flux Vital clairement définie
- [ ] Fichiers à créer/modifier listés
- [ ] Impact sur meta_prompt.md décrit
- [ ] Nouveaux symboles/marqueurs identifiés pour ONTOLOGY.md
```

Si problème → retour à `brainstorm`.

---

### Step 3 : Décomposer en Tâches

**Règle :** Une tâche = une action concrète = 2-5 min. Ordre logique : dépendances d'abord.

**Les tâches découlent du type de mutation du design :**

- `[ADD]` → tâches `[PROMPT]` + `[WIRE]` + `[ONTOLOGY]` + `[TEST]`
- `[MODIFY]` → tâches `[PROMPT]` (modification) + `[WIRE]` si l'interface change + `[TEST]`
- `[DELETE]` → tâches de suppression du fichier + nettoyage `[WIRE]` dans meta_prompt + `[TEST]`
- `[REFACTOR]` → tâches `[PROMPT]` multiples (découpage/fusion) + `[WIRE]` + `[TEST]` anti-régression
- `[OPTIMIZE]` → tâche `[PROMPT]` (modifier la logique interne) + `[TEST]` comparatif
- `[FIX]` → tâche `[PROMPT]` (corriger) + `[TEST]` sur le cas qui échouait

**Ordre logique commun (adapter selon la mutation) :**
1. `[PROMPT]` Créer/modifier/supprimer le(s) fichier(s) source
2. `[WIRE]` Mettre à jour `meta_prompt.md` (ajouter, modifier ou retirer la référence)
3. `[MANIFEST]` Mettre à jour `docs/EXPANSE-MANIFEST.md` si la structure a changé (ADD/DELETE/RENAME)
4. `[ONTOLOGY]` Mettre à jour `docs/ONTOLOGY.md` si symbole ajouté/modifié/supprimé
5. `[MEMORY]` Encoder la règle/pattern dans Mnemolite si applicable
5. `[TEST]` Vérifier la chaîne avec trace_level=3
6. `[DOC]` Mettre à jour documentation si nécessaire

**Template de tâche :**
```markdown
### Task N — [TYPE] [Nom de la tâche]

**Objective :** [Ce que cette tâche produit en une phrase]

**Steps :**
1. [Action concrète]
2. [Action concrète]

**Verification :**
- [ ] [Critère vérifiable — ex: "prompts/phi/new_step.md existe avec format JSON de sortie"]
- [ ] [Critère vérifiable — ex: "meta_prompt.md Step 4 contient la référence à new_step"]

**Files :**
- Create : `prompts/[chemin]`
- Modify : `prompts/meta_prompt.md:Step [N]`
```

**Exemples de bonnes tâches :**
- ✅ `[PROMPT]` Créer `prompts/phi/new_check.md` avec input/process/output JSON
- ✅ `[WIRE]` Ajouter appel `phi/new_check.md` dans meta_prompt.md Step 4 après doubt_audit
- ✅ `[MANIFEST]` Ajouter `prompts/phi/new_check.md` dans la section §Phi du MANIFEST
- ✅ `[ONTOLOGY]` Ajouter symbole Ξ dans `docs/ONTOLOGY.md` §Core Cognitive Components
- ✅ `[MEMORY]` Encoder `[HEURISTIC]` "SI contradiction Φ ALORS relancer Ψ loop" dans Mnemolite
- ❌ "Implémenter le nouveau système" (trop vague)
- ❌ "Modifier les prompts" (pas de type, pas de fichier)

---

### Step 4 : Écrire le Plan

**Path :** `docs/plans/YYYY-MM-DD-<kebab-nom>.md`

```markdown
# Plan : [Nom du Composant]

> **Pour Kilo Code :** Utiliser le skill `executing-plans` pour cristalliser tâche par tâche.

**Goal :** [Une phrase — ex: "Ajouter phi/new_check.md et le câbler dans le Flux Vital"]
**Design Reference :** [lien vers *-design.md]
**Estimated Tasks :** [N tasks, ~X minutes total]

---

## Task 1 — [PROMPT] [Nom]

**Objective :** [...]

**Steps :**
1. [...]

**Verification :**
- [ ] [...]

**Files :**
- Create : `prompts/phi/new_check.md`

---

## Task 2 — [WIRE] Câbler dans meta_prompt.md

**Objective :** [...]

**Steps :**
1. Ouvrir `prompts/meta_prompt.md`
2. Dans Step 4 (Φ - Verification), ajouter après `phi/doubt_audit.md` :
   `3. New check → prompts/phi/new_check.md`

**Verification :**
- [ ] meta_prompt.md Step 4 contient la référence à `phi/new_check.md`

**Files :**
- Modify : `prompts/meta_prompt.md`

---

## Summary

| Task | Type | Status | Notes |
|------|------|--------|-------|
| 1 | [PROMPT] | ⬜ | |
| 2 | [WIRE] | ⬜ | |
| ... | [...] | ⬜ | |
```

---

### Step 5 : Handoff

```
✅ Plan créé : docs/plans/YYYY-MM-DD-[nom].md
[N] tâches typées | ~X minutes

Options :
1. Valider par des tests → proposing-tests
2. Séquentiel → executing-plans
3. Parallèle (si ≥ 3 tâches indépendantes) → dispatching-parallel-agents

Quelle approche ?
```

**Next Skills :**
- `proposing-tests`
- `executing-plans`
- `dispatching-parallel-agents`

---

## Anti-Patterns

| ❌ | ✅ |
|---|---|
| Tâches sans type | Chaque tâche a un `[TYPE]` |
| `[WIRE]` avant `[PROMPT]` | Le fichier source doit exister avant d'être câblé |
| Pas de tâche `[TEST]` | Toujours vérifier la chaîne après modification |
| Pas de tâche `[ONTOLOGY]` si nouveau symbole | Chaque symbole → ONTOLOGY.md |
| Modificer meta_prompt.md sans tâche dédiée | `[WIRE]` = tâche obligatoire et séparée |

---

## Intégration Workflow

```
brainstorm → writing-plans → [executing-plans | dispatching-parallel-agents] → anti-regression
```