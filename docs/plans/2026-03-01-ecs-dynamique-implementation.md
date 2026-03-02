# Plan — ECS Dynamique

> **Pour Kilo Code :** Utiliser le skill `executing-plans` pour cristalliser tâche par tâche.

**Goal :** Implémenter ECS dynamique avec feedback loop
**Design Reference :** `docs/plans/2026-03-01-ecs-dynamique-design.md`
**Estimated Tasks :** 5 tâches | ~25 minutes

---

## Task 1 — [PROMPT] Créer ecs_weights.md

**Objective :** Créer le prompt qui gère le load/save des weights ECS dans Mnemolite

**Steps :**
1. Créer `prompts/sigma/ecs_weights.md`
2. Implémenter fonction `load_weights()` → Mnemolite search ou defaults
3. Implémenter fonction `save_weights(weights)` → Mnemolite write
4. Définir format JSON pour storage

**Verification :**
- [ ] `prompts/sigma/ecs_weights.md` existe avec load_weights et save_weights
- [ ] Format Mnemolite document défini

**Files :**
- Create : `prompts/sigma/ecs_weights.md`

---

## Task 2 — [PROMPT] Modifier detect_ecs.md

**Objective :** Intégrer load weights dans detect_ecs pour calcul pondéré

**Steps :**
1. Lire `prompts/sigma/detect_ecs.md`
2. Ajouter import `ecs_weights.md`
3. Modifier Step 1 : load_weights() depuis Mnemolite
4. Modifier Step 2 : calculer C avec weights (pas moyenne)
5. Conserver fallback si Mnemolite unavailable

**Verification :**
- [ ] detect_ecs.md load weights avant calcul
- [ ] Formule : `w_amb*amb + w_know*know + w_reason*reason + w_tools*tools`

**Files :**
- Modify : `prompts/sigma/detect_ecs.md`

---

## Task 3 — [WIRE] Ajouter tracking Ψ⇌Φ dans meta_prompt.md

**Objective :** Compter les itérations Ψ⇌Φ pour mesurer actual_C

**Steps :**
1. Lire `prompts/meta_prompt.md`
2. Ajouter `iteration_count = 0` au state initial
3. Après chaque itération Ψ⇌Φ : `iteration_count += 1`
4. Passer `iteration_count` à feedback_loop

**Verification :**
- [ ] meta_prompt.md contient counter iteration_count
- [ ] Iteration incrémentée à chaque tour Ψ⇌Φ

**Files :**
- Modify : `prompts/meta_prompt.md`

---

## Task 4 — [PROMPT] Modifier feedback_loop.md

**Objective :** Ajouter calculation actual_C et weight update

**Steps :**
1. Lire `prompts/feedback_loop.md`
2. Ajouter Step 5 : calculate_actual_C (itérations / max_iterations * 4)
3. Ajouter Step 6 : calculate_error (predicted_C - actual_C)
4. Ajouter Step 7 : update_weights avec formule
5. Ajouter Step 8 : save_weights vers Mnemolite
6. Ajouter Step 9 : log prediction pour analyse

**Verification :**
- [ ] feedback_loop.md calcule actual_C depuis itérations
- [ ] weights mis à jour avec learning rate
- [ ] weights sauvegardés dans Mnemolite

**Files :**
- Modify : `prompts/feedback_loop.md`

---

## Task 5 — [TEST] Vérifier la chaîne ECS dynamique

**Objective :** Tester le cycle complet sur 3+ requêtes

**Steps :**
1. Démarrer EXPANSE avec trace_level=3
2. Faire 3 requêtes de complexité variée
3. Logger C prédit et itérations pour chaque
4. Vérifier weights updated dans Mnemolite (search)
5. Comparer précision prédiction (avant vs après 3 requêtes)

**Verification :**
- [ ] Logs montrent C prédit différent de C réel
- [ ] Mnemolite contient ECS_WEIGHTS avec updated weights
- [ ] Précision s'améliore après 3 itérations

**Files :**
- Test : Manuel avec EXPANSE

---

## Summary

| Task | Type | Status | Notes |
|------|------|--------|-------|
| 1 | [PROMPT] | ⬜ | ecs_weights.md |
| 2 | [PROMPT] | ⬜ | detect_ecs.md |
| 3 | [WIRE] | ⬜ | meta_prompt.md |
| 4 | [PROMPT] | ⬜ | feedback_loop.md |
| 5 | [TEST] | ⬜ | Vérification |

---

## Options

1. **Séquentiel** → executing-plans (une tâche après l'autre)
2. **Parallèle** → dispatching-parallel-agents (tasks 1-4 indépendantes)
3. **Tester d'abord** → faire une tâche test rapide

Quelle approche ?
