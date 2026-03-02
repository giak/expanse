# Kilo Code Skill Registry

**⚠️ OUTILS EXTERNES pour développer EXPANSE** — Ces skills ne sont pas des composants d'EXPANSE.

Registre des skills adaptés de [Superpowers](https://github.com/obra/superpowers) pour aider au développement du projet EXPANSE.

---

## Skills Disponibles

### 1. system-read
**Fichier:** `skills/system-read/SKILL.md`

**Quand l'utiliser:**
- Début de session (première fois ou après interruption > 24h)
- Avant tout `brainstorm` ou `audit` si pas déjà fait
- Pour obtenir une carte cohérente de l'état actuel

**Output:**
- Carte système en contexte (+ optionnel: `docs/state/YYYY-MM-DD-system-state.md`)

**Next Skill:** `audit` ou `brainstorm`

**Trigger Patterns:**
- "où en est le système|état actuel|reprendre|onboarding|contexte"

---

### 2. audit
**Fichier:** `skills/audit/SKILL.md`

**Quand l'utiliser:**
- Avant un refactor ou modification structurelle majeure
- Pour challenger une proposition avant de brainstormer
- Après une cristallisation (vérification ciblée)
- Périodiquement (après N cycles)

**Modes:**
- A: Audit complet du système
- B: Audit ciblé (fichier, symbole, relation)
- C: Challenge d'intention (avant brainstorm)

**Output:**
- Rapport avec score de santé par catégorie
- Liste de findings 🔴/🟡/🟢 avec propositions de correction

**Next Skill:** `brainstorm` (si corrections à concevoir) | `anti-regression` (si post-implem)

**Trigger Patterns:**
- "audit|vérifier|cohérence|incohérence|challenger|santé|quelque chose.*ne.*juste"

---

### 3. brainstorm
**Fichier:** `skills/brainstorm/SKILL.md`

**Quand l'utiliser:**
- Avant toute création de symboles/DSL
- Quand l'utilisateur dit "je veux inventer...", "créer un symbole...", "designer..."
- Quand le besoin cognitif n'est pas clairement défini

**Output:**
- Design document dans `docs/plans/YYYY-MM-DD-*-design.md`

**Next Skill:** `writing-plans`

**Trigger Patterns:**
- "create|invent|design|new.*symbol|new.*dsl|évoluer.*langage"
- "comment.*penser|structure.*cachée|pattern.*cognitif"

---

### 4. writing-plans
**Fichier:** `skills/writing-plans/SKILL.md`

**Quand l'utiliser:**
- Après un design cognitif validé
- Quand on a besoin de détailler les tâches de cristallisation
- Avant de commencer la cristallisation

**Prérequis:**
- Design document existe dans `docs/plans/`

**Output:**
- Plan document dans `docs/plans/YYYY-MM-DD-*.md`

**Next Skill:** `executing-plans` ou `dispatching-parallel-agents`

**Trigger Patterns:**
- "plan.*cristallisation|détailler.*tâches|next.*step.*after.*design"
- File existe: `docs/plans/*-design.md`

---

### 5. proposing-tests
**Fichier:** `skills/proposing-tests/SKILL.md`

**Quand l'utiliser:**
- Après `writing-plans` (avant ou après exécution)
- Pour générer des scénarios de test pratiques (prompts à coller)
- Pour définir les critères de validation avant de cristalliser

**Output:**
- Suite de tests avec prompts "ready-to-paste" et trace attendue

**Next Skill:** `executing-plans` ou `anti-regression`

**Trigger Patterns:**
- "proposer.*test|scénario.*test|comment.*tester|test.*cases"
- "prêt.*à.*coller|prompt.*de.*test"

---

### 6. executing-plans
**Fichier:** `skills/executing-plans/SKILL.md`

**Quand l'utiliser:**
- Quand un plan de cristallisation existe
- Pour exécuter les tâches une par une avec validation entre lots

**Prérequis:**
- Plan document avec tâches détaillées dans `docs/plans/`

**Output:**
- Tâches exécutées et vérifiées

**Next Skill:** `anti-regression`

**Trigger Patterns:**
- "execute.*plan|cristalliser|start.*working.*on"
- File existe: `docs/plans/YYYY-MM-DD-*.md` (sans -design)

---

### 6. dispatching-parallel-agents
**Fichier:** `skills/dispatching-parallel-agents/SKILL.md`

**Quand l'utiliser:**
- Alternative à `executing-plans` quand ≥ 3 tâches sont indépendantes (pas de dépendances croisées)
- Pour accélérer l'exécution de plans larges

**Prérequis:**
- Plan document avec tâches **prouvablement indépendantes**

**Output:**
- Tâches exécutées en parallèle, résultats fusionnés

**Next Skill:** `anti-regression`

**Trigger Patterns:**
- "parallèle|sous-agents|simultané|tâches.*indépendantes"

---

### 7. anti-regression
**Fichier:** `skills/anti-regression/SKILL.md`

**Quand l'utiliser:**
- **Immédiatement après** `executing-plans` ou `dispatching-parallel-agents`
- Avant tout commit final

**Output:**
- Rapport PASS 🟢 / PASS WITH WARNINGS 🟡 / FAIL 🔴
- Liste de regressions détectées et corrections suggérées

**Next Skill:** `retrospective` (si PASS) | fix inline (si FAIL)

**Trigger Patterns:**
- "anti-regression|vérifier.*après|rien.*cassé|post.*implem"

---

### 8. retrospective
**Fichier:** `skills/retrospective/SKILL.md`

**Quand l'utiliser:**
- Fin de session de travail
- Après `anti-regression` complété
- Après tout cycle complet de cristallisation

**Output:**
- Documentation du cycle (faits, surprises, décisions, heuristiques émergentes, dette)
- Optionnel: `docs/retrospectives/YYYY-MM-DD.md`

**Next Skill:** (fin de cycle — prochaine session commence par `system-read`)

**Trigger Patterns:**
- "rétrospective|bilan|fin.*session|on.*termine|qu.*appris"

---

## Chaîne de Workflow Complète

```
┌─────────────┐     ┌────────┐     ┌─────────────┐     ┌───────────────┐
│ system-read │ ──▶ │ audit  │ ──▶ │  brainstorm │ ──▶ │ writing-plans │
│  (lire)     │     │(diag.) │     │  (design)   │     │  (planifier)  │
└─────────────┘     └────────┘     └─────────────┘     └───────┬───────┘
                                                               │
                              ┌───────────────────────────────┤
                              │ séquentiel           parallèle│
                    ┌─────────▼──────┐         ┌─────────────▼──────────┐
                    │ executing-plans│         │dispatching-parallel-ag.│
                    └─────────┬──────┘         └─────────────┬──────────┘
                              └───────────────┬───────────────┘
                                    ┌─────────▼──────────┐
                                    │  anti-regression   │
                                    └─────────┬──────────┘
                                    ┌─────────▼──────────┐
                                    │   retrospective    │
                                    └────────────────────┘
```

## Détection Automatique

Kilo Code peut détecter quel skill utiliser via:

1. **Pattern matching** sur l'input utilisateur
2. **Existence de fichiers** (design doc, plan doc, state doc)
3. **Contexte de la conversation** (dernier skill utilisé)

## Utilisation Manuelle

```
@skill:system-read
@skill:audit
@skill:brainstorm
@skill:writing-plans
@skill:executing-plans
@skill:dispatching-parallel-agents
@skill:anti-regression
@skill:retrospective
```

## Différences avec Superpowers Original

| Aspect | Superpowers | Adaptation pour EXPANSE |
|--------|-------------|------------------------|
| Hard Gates | Bloquants | SOFT-GATE (warnings) |
| TDD | Obligatoire | Non applicable |
| Output | Code | Prompts, docs, symboles |
| Activation | Auto via pattern | Manuelle ou auto-détection |
| Storage | Dans repo | Dossier `docs/plans/` |
| Workflow | 3 skills | 8 skills (cycle complet) |

## Notes

- Les skills utilisent les outils natifs de Kilo Code (`list_files`, `read_file`, `write_to_file`, etc.)
- Les skills sont **modulaires** et **composables**
- Chaque skill peut être utilisé **indépendamment** si les prérequis sont remplis
- Les SOFT-GATEs affichent des **warnings** mais ne bloquent pas
- `system-read` peut être sauté si déjà fait dans la session en cours