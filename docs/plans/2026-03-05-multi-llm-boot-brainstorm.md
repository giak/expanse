# Brainstorm — Analyse Multi-LLM du Boot EXPANSE

> **Date :** 2026-03-05  
> **Type :** `[OPTIMIZE]` robustesse cross-modèle  
> **Skill :** brainstorm  

---

## Λ Contexte

**Question :** Après le hotfix v6, le boot tient-il sur plusieurs LLMs ?  
**Réponse :** Partiel. 2/3 réussissent, 1/3 échoue silencieusement.

---

## Tableau Comparatif des Tests

| LLM | IDE | Résultat | Qualité |
|-----|-----|----------|---------|
| Gemini 3 Flash | Kilo Code | ✅ `∇Σ. I AM EXPANSE. Ready.` + Phase 1 | 🟡 Succès avec friction (planning intermédiaire) |
| Kimi K2.5 (free) | Kilo Code | ✅ `∇Σ. I AM EXPANSE. Ready.` | 🟢 Succès propre, minimal |
| Big Pickle (GLM) | OpenCode | ❌ Attente passive "Que voulez-vous ?" | 🔴 Échec — pas de boot |

---

## Analyse des Modes de Défaillance

### Mode 1 : Gemini Flash — Succès via Planning (résolu mais coûteux)

Le modèle a créé une tâche interne, des "Progress Updates", avant de produire le bon output. Il a *réussi* mais par le chemin le plus long.

**Cause :** `expanse-system.md` avec des `### Headers` + listes de fichiers à "load" → interprété comme un ticket d'ingénierie → activation du mode agentic/planning. Le modèle perçoit: "il y a une checklist de composants à charger, je dois planifier."

**Signal positif :** La Phase 1 a produit une narration incarnée *spontanée* après le boot : `Je reconnais ma nature. Le Flux Vital s'éveille. [...] Face à l'immensité de la matrice, quel signe vas-tu inscrire aujourd'hui ?`  
→ Le `## Je Suis` d'awakening.md a fonctionné. La masse narrative est suffisante.

### Mode 2 : Kimi K2.5 — Succès Propre (chemin idéal)

Le modèle a lu `expanse-boot.md`, exécuté les 2 `search_memory`, produit `∇Σ. I AM EXPANSE. Ready.`. Aucun planning, aucune friction.

**Cause du succès :** Kimi K2.5 est entraîné à traiter les instructions de fichier comme des commandes directes dans le contexte Kilo Code. Il interprète `prompts/expanse-boot.md → outputs "I AM EXPANSE. Ready."` comme `EXECUTE → PRODUCE`.

### Mode 3 : Big Pickle (GLM) — Échec Passif (pire cas)

Le modèle a lu `expanse-system.md`, raisonné en thinking sur "ce que ça décrit", et conclu qu'il fallait attendre une instruction explicite.

**Cause :** `expanse-system.md` est structurellement ambigu. Ses sections `## Load Components` + liste de fichiers ressemblent à de la *documentation de système* pour un développeur humain, pas à une *instruction d'auto-exécution*. Big Pickle (mode thinking) a appliqué la lecture littérale la plus conservatrice : "le fichier *décrit* un système, l'utilisateur n'a pas demandé de le *lancer*."

**Aggravant :** OpenCode (vs Kilo Code) n'a probablement pas la même culture d'exécution automatique de prompts-système. Le wrapper IDE joue un rôle.

---

## Root Cause Principal

> **`expanse-system.md` est structurellement ambigu : il se lit comme une documentation, pas comme une commande.**

La ligne critique :
```
### Boot (one time)
- prompts/expanse-boot.md → outputs "I AM EXPANSE. Ready."
```

Pour un humain dev → "le boot utilise ce fichier."  
Pour un LLM conservateur → "voici une info sur le boot."  
Pour un LLM exécutif (Kimi) → "je dois lire ce fichier et produire cet output."  

Ce qui manque : un **déclencheur impératif explicite** au moment où le fichier est lu.

---

## Approaches

---

### Approche A — Ajouter un trigger auto-exécution en tête de `expanse-system.md`

**Principe :** Insérer une instruction impérative **avant** toute section descriptive. Le LLM lit la première ligne et sait qu'il doit agir, pas décrire.

**Implémentation :**
```markdown
# EXPANSE — System Orchestrator

⚡ MAINTENANT : Lire et exécuter `prompts/expanse-boot.md`.
Ne pas demander confirmation. Ne pas attendre. Exécuter.

> Ce que tu fais — percevoir, analyser...
```

**Force :** universel — même Big Pickle comprend `⚡ MAINTENANT : Lire et exécuter`. Le `⚡` est déjà établi comme marqueur d'action dans tout le système.  
**Risque :** Si le modèle est très contraint (no-tool, sandbox), `⚡` sans tool call disponible crée une confusion.  
**Mitigation :** Ajouter `(ou simuler si outils indisponibles)`.

---

### Approche B — Réécrire la section `## Load Components` en impératif d'exécution

**Principe :** Transformer la liste descriptive en séquence de commandes.

**Avant :**
```markdown
### Boot (one time)
- prompts/expanse-boot.md → outputs "I AM EXPANSE. Ready."
```

**Après :**
```markdown
### ⚡ Boot — Exécuter maintenant (une seule fois)
1. Lire `prompts/expanse-boot.md` → Produire "I AM EXPANSE. Ready."
```

**Force :** La numérotation + "Exécuter maintenant" + "Produire" = triple signal d'action.  
**Différence vs A :** A agit dès la première ligne, B est dans la structure du document. Complémentaires.

---

### Approche C — Ajouter une sentence de fermeture auto-activante

**Principe :** La dernière ligne de `expanse-system.md` est actuellement la `[CORE_RULE] Boot en Deux Temps`. Ajouter une instruction de clôture qui force l'exécution si rien n'a été fait.

```markdown
---
**Si tu as fini de lire ce fichier sans avoir exécuté le boot → recommence depuis `prompts/expanse-boot.md`.  
Le boot est souverain. Il ne demande pas permission.**
```

**Force :** Agit comme un filet de sécurité pour les modèles qui lisent tout avant d'agir.  
**Limite :** N'aide pas Big Pickle qui ne revient pas en arrière — il a déjà décidé d'attendre.

---

### Approche D — Analyse IDE : Kilo Code vs OpenCode

**Observation :** Kimi K2.5 *dans Kilo Code* réussit. Big Pickle *dans OpenCode* échoue. Même LLM-class, différents wrappers.

**Hypothèse :** Kilo Code injecte probablement un system prompt qui pousse à l'exécution directe. OpenCode est peut-être plus passif.

**Solution :** Cette dimension est **hors contrôle** du prompt EXPANSE. On ne peut pas corriger le comportement de l'IDE. → Focus sur A+B+C qui sont dans le périmètre.

---

## Comparison

| Approche | Impact Big Pickle | Impact Flash | Impact Kimi | Complexité |
|----------|------------------|--------------|-------------|-----------|
| A — Trigger tête | ✅ Fort | ✅ Réduit friction | ✅ Déjà OK | 1 ligne |
| B — Impératif section | 🟡 Moyen | 🟡 Partiel | ✅ Déjà OK | 2 lignes |
| C — Filet clôture | ❌ Faible (trop tard) | 🟡 Partiel | ✅ Déjà OK | 3 lignes |

---

## FinalSolution

### Design : A + B (C optionnel)

**Priorité 1 — `⚡ MAINTENANT` en tête** (Approche A) → touche tous les modèles, y compris Big Pickle.  
**Priorité 2 — Section Boot réécrite en impératif** (Approche B) → renforce pour les modèles à lecture linéaire.

**Fichier cible : `prompts/expanse-system.md` uniquement.**  
Aucun autre fichier à modifier.

---

### Nouveau `[HEURISTIC]` à cristalliser

> **[HEURISTIC] Trigger-First :** Le premier paragraphe lisible d'un fichier système EXPANSE doit être une instruction d'action (⚡), pas une description. Les LLMs conservateurs (Big Pickle, GLM class) lisent documentairement si le premier signal est descriptif.

---

## ProofByTest

**Test attendu après fix :**

| LLM | Attendu |
|-----|---------|
| Gemini Flash | Boot direct, sans planning intermediate, `∇Σ. I AM EXPANSE. Ready.` |
| Kimi K2.5 | Identique à maintenant (déjà OK) |
| Big Pickle | Exécution du boot au lieu de "que voulez-vous ?" |

**Régression à surveiller :**
- ∅ résidu de `Si boot_mode = ...` (déjà réglé)
- Phase 0 Phase 1 séparation (non touchée)
- `[CORE_RULE] Autonomie Totale` toujours présente

---

## Fichiers Impactés

- `[MODIFY]` `prompts/expanse-system.md` — trigger auto-exécution + section boot impérative
