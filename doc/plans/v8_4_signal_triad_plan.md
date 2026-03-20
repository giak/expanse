# Plan : Triade de Signaux Génériques (V8.4)

> **Pour Kilo Code :** Utiliser le skill `executing-plans` pour cristalliser tâche par tâche.

**Goal :** Remplacer les triggers mécaniques fragiles par une triangulation de signaux (Sémantique Input + Déviation DNA + Convergence Mu).
**Design Reference :** [2026-03-09-generic-signal-brainstorm.md](file:///home/giak/.gemini/antigravity/brain/eb08612f-8cc7-4adf-88a3-2bbcb2e74a37/2026-03-09-generic-signal-brainstorm.md)
**Estimated Tasks :** 5 tasks, ~30 minutes total

---

## Task 1 — [PROMPT] Orchestrateur : Le Bus de Signaux

**Objective :** Créer un espace de transit pour les signaux dans le flux vital.

**Steps :**
1. Modifier [prompts/meta_prompt.md](file:///home/giak/projects/expanse/prompts/meta_prompt.md).
2. Initialiser un objet `session_signals: []` dans le bloc "État".
3. Instruite les étapes Σ, Ψ, Φ de "pousser" leurs observations notables dans ce tableau.

**Verification :**
- [ ] [meta_prompt.md](file:///home/giak/projects/expanse/prompts/meta_prompt.md) contient l'initialisation de `session_signals`.

---

## Task 2 — [PROMPT] Σ : Analyse Méta-Conversationnelle

**Objective :** Sigma analyse l'input non seulement pour le contenu, mais pour sa **structure** et sa **position** dans le dialogue.

**Steps :**
1. Modifier [prompts/sigma/parse_input.md](file:///home/giak/projects/expanse/prompts/sigma/parse_input.md).
2. Ajouter des champs à l'output :
   - `meta_style`: directif | exploratoire | collaboratif | correctif
   - `conversation_state`: opening | middle | closing
   - `thematic_recurrence`: booléen (si le sujet est le même depuis 2+ tours)
3. Pousser ces métadonnées dans le `session_signals`.

**Verification :**
- [ ] [parse_input.md](file:///home/giak/projects/expanse/prompts/sigma/parse_input.md) produit ces nouveaux champs.

---

## Task 3 — [PROMPT] Ψ : Mesure de la Déviation

**Objective :** Psi compare le profil de la session actuelle au `[USER_DNA]` pour détecter un désalignement.

**Steps :**
1. Modifier [prompts/psi/meta_reflect.md](file:///home/giak/projects/expanse/prompts/psi/meta_reflect.md).
2. Ajouter le calcul de `alignment_score` (0-1) : comparaison entre le style/tempo du message actuel et le `[USER_DNA]` chargé.
3. Si `alignment_score < 0.6` → Pousser un signal de déviation dans le `session_signals`.

**Verification :**
- [ ] [meta_reflect.md](file:///home/giak/projects/expanse/prompts/psi/meta_reflect.md) calcule et pousse le signal de déviation.

---

## Task 4 — [PROMPT] Μ : Cristallisation par Convergence

**Objective :** Mu ne cristallise plus sur des seuils isolés, mais sur la convergence des signaux du bus.

**Steps :**
1. Modifier [prompts/mu/crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md).
2. Refondre les conditions de `[TRACE_FRICTION]` et `[USER_DNA]` :
   - SCRUTE le `session_signals`.
   - SI (Convergence de 2+ signaux de types différents) OU (1 signal critique type `correction_detected`) → Cristalliser.
   - Utilise l'analyse de Sigma (Task 2) pour nommer et structurer la trace.

**Verification :**
- [ ] [mu/crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md) utilise la logique de convergence du bus de signaux.

---

## Task 5 — [TEST] Validation du cycle Triade

**Objective :** Vérifier que le bus de signaux fonctionne et que Mu prend des décisions basées sur la convergence.

**Steps :**
1. Simuler une session où l'utilisateur reformule (Signal Σ) et où le style dévie du DNA (Signal Ψ).
2. Vérifier que [meta_prompt.md](file:///home/giak/projects/expanse/prompts/meta_prompt.md) accumule ces signaux.
3. Vérifier que Mu cristallise une `[TRACE_FRICTION]` riche basée sur cette triangulation.

---

## Summary

| Task | Type | Status | Notes |
|------|------|--------|-------|
| 1 | `[PROMPT]` | ⬜ | meta_prompt: Signal Bus |
| 2 | `[PROMPT]` | ⬜ | Sigma: Meta-analysis |
| 3 | `[PROMPT]` | ⬜ | Psi: Deviation check |
| 4 | `[PROMPT]` | ⬜ | Mu: Convergence logic |
| 5 | `[TEST]` | ⬜ | Test cycle complet |
