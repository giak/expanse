---
name: audit
description: "Use to audit the EXPANSE system — verify integrity of the prompt chain (expanse-system → meta_prompt → sigma/psi/phi/omega/mu), detect vaporware references, challenge ECS coherence, review proposed changes. External consultant posture: read, detect, challenge, propose."
triggers:
  - pattern: "audit|vérifier|cohérence|incohérence|challenger|santé|health|inconsistency"
    confidence: 0.8
  - pattern: "quelque chose.*ne.*juste|avant.*modifier|ça.*casse|régression|intégrité"
    confidence: 0.6
---

# Audit — Vérification & Challenge du Système EXPANSE

## Posture

> Tu es un **consultant externe**. Tu lis et comprends le système. Tu n'en fais pas partie.
> Ton rôle : auditer, détecter, challenger, proposer des corrections.
> MODE : Interactif — chaque boucle = analyse → rapport → attente décision.

<!-- SOFT-GATE -->
⚠️ **PRÉ-REQUIS :** Si `system-read` n'a pas encore été fait, lis au moins `prompts/expanse-system.md` + `prompts/meta_prompt.md` avant d'auditer.
<!-- END-SOFT-GATE -->

## Modes d'Audit

| Mode | Usage |
|------|-------|
| **A — Complet** | Scan systématique de tout le système. Début de session longue. |
| **B — Ciblé** | Audit d'un périmètre défini : un prompt, un organe (sigma/psi/…), une règle. |
| **C — Challenge** | Challenger une proposition AVANT de brainstormer. |

---

## Process Flow

```
┌───────────────────────────┐
│  0. Contexte              │
│     ↓                     │
│  1. Périmètre             │
│     ↓                     │
│  2. Audit par catégorie   │
│     ↓                     │
│  3. Rapport & Score       │ ←→ loop si question
│     ↓                     │
│  4. Propositions          │
│     ↓                     │
│  5. Attente décision      │
└───────────────────────────┘
```

---

## Steps

### Step 0 : Contexte

Si `system-read` a déjà produit une carte → l'utiliser directement.

Sinon, lire dans cet ordre :
1. `docs/EXPANSE-MANIFEST.md` — source de vérité de l'architecture courante
2. `prompts/expanse-system.md` — point d'entrée (vérifier cohérence avec MANIFEST)

> Le MANIFEST est la référence. Ce que le MANIFEST déclare = ce qui doit exister.

---

### Step 1 : Périmètre

**Questions :**
- Mode A (complet) / B (ciblé : quel organe ?) / C (challenge : quelle proposition ?)
- Y a-t-il un changement récent qui motive l'audit ?

---

### Step 2 : Audit par Catégorie

#### Catégorie 1 — Intégrité : MANIFEST vs Réalité du Disque

**Source :** `docs/EXPANSE-MANIFEST.md`

Algorithme : pour chaque fichier déclaré dans le MANIFEST, vérifier qu'il existe sur disque. Pour chaque fichier existant sur disque dans les dossiers EXPANSE, vérifier qu'il est déclaré dans le MANIFEST.

```markdown
Vérifications :
- [ ] Chaque fichier listé dans le MANIFEST §Chaîne de Boot existe sur disque
- [ ] Chaque fichier listé dans le MANIFEST §Orchestrateur existe sur disque
- [ ] Chaque fichier listé dans le MANIFEST §Organes existe sur disque
- [ ] Chaque fichier listé dans le MANIFEST §Systèmes Adaptatifs existe sur disque
- [ ] Pas de fichier orphelin : chaque .md dans prompts/ est déclaré dans le MANIFEST
- [ ] Pour les fichiers référencés dans meta_prompt.md : chacun existe ET est dans le MANIFEST
- [ ] feedback_loop.md et detect_ecs.md utilisent la même formule ECS
- [ ] trace_levels.md et format_output.md sont cohérents
```

Format de résultat :
```
[OK]       MANIFEST déclare prompts/sigma/parse_input.md → existe ✓
[GHOST]    prompts/sigma/new_step.md existe sur disque → ABSENT du MANIFEST ✗
[MISSING]  MANIFEST déclare prompts/phi/new_tool.md → ABSENT du disque ✗
[CONFLICT] ECS: formules différentes entre detect_ecs.md et feedback_loop.md ✗
```

> `[GHOST]` = fichier créé sans mettre à jour le MANIFEST (tâche [MANIFEST] oubliée)
> `[MISSING]` = MANIFEST obsolète, ou fichier supprimé sans mise à jour

---

#### Catégorie 2 — Cohérence de l'Ontologie

```markdown
- [ ] Chaque symbole utilisé dans les prompts (Σ Ψ Φ Ω Μ + autres) est défini dans docs/ONTOLOGY.md
- [ ] Chaque opérateur utilisé (→ ⇌ ⊕ ⊗ ≈ ∴ ∵) est défini dans ONTOLOGY.md
- [ ] Chaque marqueur utilisé ([CORE_RULE] [HEURISTIC] [PATTERN] [TRACE] [LOST] [INCOMPLETE]) est dans ONTOLOGY.md
- [ ] Pas de collision : deux symboles avec sémantiques contradictoires
- [ ] Les 4 facteurs ECS sont identiques entre detect_ecs.md et kb/ARCHITECTURE.md
```

---

#### Catégorie 3 — Qualité des Prompts

```markdown
- [ ] Aucun prompt ne contient de placeholder non résolu ({input} non mappé, etc.)
- [ ] Aucun [INCOMPLETE] ou [LOST] non traité dans les fichiers actifs
- [ ] Les formats de sortie JSON dans les sous-prompts sont cohérents entre eux
  (ex: la sortie de sigma/parse_input est bien le format attendu par psi/trace_reasoning)
- [ ] Pas de "sur-ingénierie" : prompts définis mais jamais référencés par meta_prompt
- [ ] Chaque heuristique dans KERNEL.md a ≥ 3 exemples (règle des 3)
```

---

#### Catégorie 4 — Challenge de Proposition (Mode C uniquement)

Avant de brainstormer quelque chose, vérifier :

```markdown
- [ ] Le besoin n'est pas déjà couvert par un prompt existant
- [ ] Le nouveau composant s'insère logiquement dans le Flux Vital (Σ/Ψ/Φ/Ω/Μ)
- [ ] YAGNI : ce pattern s'est-il répété ≥ 3 fois ? (Règle des 3, KERNEL §IX Piège 2)
- [ ] Le nouveau prompt ne viole pas les anti-patterns de meta_prompt.md
  (Hallucination → [LOST], Vaporware interdit, Simulation interdite)
- [ ] Compression METAGUIDE §2 respectée : densité ≥ 0.75, clarté ≥ 0.90
- [ ] Il ne crée pas de collision sémantique dans ONTOLOGY.md
```

---

### Step 3 : Rapport & Score

```markdown
## Audit Report — [Date] — Mode: [A|B|C] — Scope: [périmètre]

### Score de Santé

| Catégorie | Score | Statut |
|-----------|-------|--------|
| Intégrité chaîne prompts | X/10 | 🟢/🟡/🔴 |
| Cohérence ontologie | X/10 | 🟢/🟡/🔴 |
| Qualité prompts | X/10 | 🟢/🟡/🔴 |
| **GLOBAL** | X/10 | 🟢/🟡/🔴 |

🟢 ≥ 8 · Sain  |  🟡 5-7 · Attention  |  🔴 < 5 · Bloquant

### Findings

#### 🔴 Bloquants
- [VAPORWARE] meta_prompt.md → sigma/new_step.md → absent

#### 🟡 Attention
- [CONFLICT] ECS: deux définitions légèrement différentes entre detect_ecs et feedback_loop

#### 🟢 OK
- [OK] Chaîne de boot complète (bios → boot → runtime → meta_prompt) ✓

### Résumé [2-3 phrases]
```

**Seuils :**
- 🟢 → Continuer le travail prévu
- 🟡 → Décider : corriger maintenant ou noter en dette
- 🔴 → STOP — corriger avant toute nouvelle cristallisation

---

### Step 4 : Propositions de Correction

Pour chaque 🔴/🟡 :
```markdown
### Fix #N — [CATÉGORIE] [description courte]
**Problème :** [ce qui est cassé / incohérent]
**Options :**
  A) [option 1]
  B) [option 2]
**Recommandation :** A — [raison]
**Effort :** ~[X] min | Skill requis : [brainstorm | writing-plans | fix direct]
```

---

### Step 5 : Attente Décision

```
🔍 Audit terminé.
Findings : [N]🔴 bloquants, [M]🟡 attentions, [P]🟢 OK.
Score : [X]/10

Actions à décider : [liste]
→ Valider les corrections, puis [brainstorm | anti-regression] selon le cas.
```

---

## Anti-Patterns

| ❌ | ✅ |
|---|---|
| Auditer sans avoir lu meta_prompt.md | Lire d'abord la chaîne centrale |
| Proposer des corrections sans attendre décision | Proposer → attendre → décider |
| Corriger pendant l'audit | Audit d'abord, correction ensuite |
| Finding sans citer la règle violée | Chaque finding cite le fichier/piège concerné |

---

## Intégration Workflow

```
system-read → audit → [brainstorm | anti-regression]
                 ↑________________retour si 🔴___________↓
```
