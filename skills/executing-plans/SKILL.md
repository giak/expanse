---
name: executing-plans
description: "Use when you have a written crystallization plan and need to execute it task-by-task with validation checkpoints."
triggers:
  - pattern: "execute.*plan|cristalliser|start.*working.*on|commencer.*tâches"
    confidence: 0.7
  - file_exists: "docs/plans/YYYY-MM-DD-*.md"
prerequisites:
  - "Crystallization plan exists in docs/plans/"
---

# Executing Plans - Exécution du Plan

## Overview

Exécute un plan de cristallisation tâche par tâche avec des points de contrôle et validation entre les lots.

**Principe clé:** Exécution par lots avec validation. Pas de dérive. Pas de raccourcis.

<!-- SOFT-GATE -->
⚠️ **WARNING GATE:** Vérifie qu'un plan de cristallisation existe dans `docs/plans/` (pas un design, un plan avec tâches détaillées). Si non, utilise `writing-plans` d'abord.
<!-- END-SOFT-GATE -->

## When to Use

**After:** Crystallization plan written and committed
**During:** Execution of planned tasks

## Process Flow

```
┌─────────────────────────┐
│  1. Load & Review Plan  │
│     ↓                   │
│  2. Execute Batch (3)   │
│     ↓                   │
│  3. Report & Checkpoint │ ←→ (feedback loop)
│     ↓                   │
│  4. Repeat or Complete  │
│     ↓                   │
│  5. Finalize            │
└─────────────────────────┘
```

## Steps

### Step 1: Load & Review Plan

**Action:** Lire et valider le plan

```bash
# Lister les plans récents
ls -lt docs/plans/*.md | head -5
```

**Checklist de validation:**
- [ ] Plan a des tâches numérotées
- [ ] Chaque tâche a des steps clairs
- [ ] Chaque tâche a des critères de vérification
- [ ] Les dépendances sont claires

**Si problème:** Retour à `writing-plans`

**Si OK:** Créer un TodoWrite avec les tâches

---

### Step 2: Execute Batch

**Action:** Exécuter le premier lot de tâches (par défaut: 3 tâches)

**Pour chaque tâche:**

```markdown
### Task X: [Nom]

1. **Mark in_progress**
   - TodoWrite: Update status

2. **Execute Steps**
   - Suivre chaque step du plan EXACTEMENT
   - Ne pas ajouter de "bonus"
   - Ne pas sauter de vérification

3. **Verification**
   - Cocher chaque critère de vérification
   - Si échec → Fix immédiat ou STOP

4. **Mark completed**
   - TodoWrite: Update status
   - Brief note on completion
```

**Règles:**
- **Une tâche à la fois**
- **Pas de multitâche**
- **Validation obligatoire avant la suivante**
- **Si bloqué → STOP et demander** (pas de guessing)

---

### Step 3: Report & Checkpoint

**Action:** Présenter le rapport après chaque batch

**Format:**
```markdown
## Batch Complete: Tasks [N] to [M]

### ✅ Completed:
- Task [N]: [Brief description]
- Task [N+1]: [Brief description]
- Task [N+2]: [Brief description]

### Verification Results:
- [Critère 1]: ✅ Pass
- [Critère 2]: ✅ Pass
- ...

### 🚧 Blockers (if any):
- [Description du blocage]

### 📊 Progress:
[X/Y] tasks complete ([Z]%)

**Ready for feedback.**
```

**Attendre:**
- Feedback sur le batch
- Validation pour continuer
- Corrections si nécessaire

---

### Step 4: Repeat or Complete

**Si feedback positif:**
- Exécuter le prochain batch
- Répéter Steps 2-3

**Si corrections demandées:**
- Appliquer les corrections
- Re-vérifier
- Re-rapporter

**Si toutes les tâches sont faites:**
- Passer à Step 5

---

### Step 5: Finalize

**Action:** Compléter le travail

**Checklist de finalisation:**
- [ ] Toutes les tâches sont completed
- [ ] Toutes les vérifications passent
- [ ] Résumé des changements
- [ ] Mise à jour du plan (mark all tasks complete)

**Output:**
```markdown
## ✅ Crystallization Complete

**Concept:** [Name]
**Plan:** docs/plans/YYYY-MM-DD-[concept].md
**Tasks:** [X/Y] complete

### Summary of Changes:
- [Change 1 - ex: "Created prompts/symbols/xi.md"]
- [Change 2 - ex: "Updated docs/METAGUIDE.md with Ξ"]
- ...

### Verification:
All acceptance criteria met. ✅
```

**Commit final:**
```bash
git add .
git commit -m "crystallize: complete [concept]

- [Change 1]
- [Change 2]

Refs: docs/plans/YYYY-MM-DD-[concept].md"
```

---

## Anti-Patterns

| ❌ Anti-Pattern | ✅ Correct |
|----------------|-----------|
| Exécuter tout d'un coup sans checkpoint | Batch de 3 tâches max, puis rapport |
| Sauter les vérifications | Chaque critère doit être coché |
| Ajouter des "bonus" non planifiés | Strictement suivre le plan |
| Continuer si bloqué | STOP et demander de l'aide |
| Ignorer le feedback | Attendre validation entre batches |
| Marquer done sans vérification | Vérifier AVANT de marquer |

---

## When to STOP

**STOP immédiatement si:**
- Blocage conceptuel (symbole incohérent, relation ambiguë)
- Instructions du plan incohérentes
- Vérification échoue répétitivement
- Le plan ne correspond plus à la réalité

**Action:** Rapporter le problème et attendre instruction

---

## Integration with EXPANSE

**Activation:**
- Σ (Sigma) détecte "execute" ou plan file → Route vers `executing-plans`
- Ψ (Psi) suit les steps et raisonne sur les problèmes
- Φ (Phi) vérifie les validations et détecte les dérives
- Ω (Omega) formate les rapports de batch
- Μ (Mu) archive les patterns d'exécution efficaces

**Previous Skill:** `writing-plans` (required)

---

## Example Session

**Context:** Plan de cristallisation du symbole Ξ avec 4 tâches

**Agent:**
1. [Load] Lit `docs/plans/2026-02-28-xi-crystallization.md`
2. [Todo] Crée: Task 1 ⏳, Task 2 ⬜, Task 3 ⬜, Task 4 ⬜
3. [Batch 1] Exécute Tasks 1-3:
   - Task 1: ✅ Créer prompts/symbols/xi.md
   - Task 2: ✅ Documenter Ξ ⇌ Φ
   - Task 3: ✅ Ajouter Ξ au Flux Vital
4. [Report] "Batch 1 complete. Task 4 restante. Ready for feedback?"
5. [User] "Continue"
6. [Batch 2] Exécute Task 4:
   - Task 4: ✅ Mettre à jour SKILL-REGISTRY
7. [Finalize] "All tasks complete. Symbol Ξ crystallized."
8. [Commit] Commit final avec résumé