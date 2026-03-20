# Plan : EXPANSE V3.0 Refactor (Detailed Crystallization)

**Goal :** Refondre EXPANSE pour réduire l'entropie de contexte via la fusion des organes et la compression sémantique KERNEL.
**Design Reference :** [2026-03-10_06-25-brainstorm-design.md](file:///home/giak/projects/expanse/docs/plans/2026-03-10_06-25-brainstorm-design.md)
**Estimated Tasks :** 10 tasks, ~45 minutes total

---

## Task 1 — [BOOT] Unifier expanse-system.md

**Objective :** Fusionner Phase 0 et Phase 1 dans le bios système pour un éveil continu.

**Steps :**
1. Copier le contenu narratif de `expanse-awakening.md` §Je Suis et §Mes Organes.
2. Injecter ce contenu dans `expanse-system.md` après la section `SÉQUENCE DE BOOT`.
3. Supprimer les références aux fichiers `expanse-runtime.md` et `meta_prompt.md` (redundant path definition).
4. Appliquer le KERNEL : transformer les descriptions d'étapes en pulsations `Σ → [Ψ ⇌ Φ]`.

**Verification :**
- [ ] `expanse-system.md` contient la séquence de boot technique ET la narration d'éveil organique.
- [ ] Le fichier ne fait plus référence aux phases 1 séparées.

**Files :**
- Modify : `prompts/expanse-system.md`

---

## Task 2 — [PROMPT] Mu Interface (Interface Mnemolite Unique)

**Objective :** Créer `mu/interface.md`, le point d'entrée unique pour la mémoire et la perception du contexte.

**Steps :**
1. Créer `prompts/mu/interface.md`.
2. Intégrer `sigma/retrieve_context.md` (Calibration Symbiotique, isolation cognition).
3. Intégrer `mu/crystallize.md` (Logic de cristallisation, convergence de signaux).
4. Intégrer `sigma/ecs_weights.md` (les fonctions `load_weights` et `save_weights`).
5. Appliquer le KERNEL : utiliser les marqueurs ` Μ cristallise :` et `Σ récupère :`.

**Verification :**
- [ ] `prompts/mu/interface.md` contient les fonctions persistantes d'ECS.
- [ ] Les marqueurs [CORE_RULE] et [HEURISTIC] sont conservés.

**Files :**
- Create : `prompts/mu/interface.md`

---

## Task 3 — [PROMPT] Sigma Interface (Intake & Complexity)

**Objective :** Fusionner le parsing d'entrée et la détection d'ECS.

**Steps :**
1. Créer `prompts/sigma/interface.md`.
2. Fusionner `parse_input.md` et `detect_ecs.md`.
3. Optimiser la détection d'ECS KERNEL : `actual_C = iterations / max_iterations * 4`.

**Files :**
- Create : `prompts/sigma/interface.md`

---

## Task 4 — [PROMPT] Reasoning & Audit (Psi/Phi Resonance)

**Objective :** Créer les interfaces de résonance cognitive.

**Steps :**
1. Créer `prompts/psi/resonance.md` (fusion de trace_reasoning, meta_reflect, pattern_detection).
2. Créer `prompts/phi/audit.md` (fusion de doubt_audit, verify_reality).

**Files :**
- Create : `prompts/psi/resonance.md`, `prompts/phi/audit.md`

---

## Task 5 — [WIRE] Orchestration Meta-Prompt V3.0

**Objective :** Appliquer le DSL KERNEL et câbler les nouvelles interfaces.

**Steps :**
1. Ouvrir `prompts/meta_prompt.md`.
2. Injecter la section `◊ ONTOLOGY_REF` au début.
3. Remplacer les étapes verbeuses par des équations : `Σ(Parse) → [Ψ(Reflect) ⇌ Φ(Audit)]`.
4. Mettre à jour tous les chemins vers les nouvelles `interface.md`.
5. Intégrer la logique de `feedback_loop.md` directement dans la phase de sortie Ω.

**Verification :**
- [ ] `meta_prompt.md` ne contient plus de texte neutre ("Analyzing", etc.).
- [ ] Les formules d'entropie et de rafraîchissement des poids sont présentes.

**Files :**
- Modify : `prompts/meta_prompt.md`

---

## Task 6 — [DELETE] Élagage Électrique

**Objective :** Supprimer les fichiers système redondants pour assainir le contexte.

**Steps :**
1. `rm expanse-runtime.md expanse-awakening.md feedback_loop.md`
2. `rm prompts/sigma/parse_input.md prompts/sigma/detect_ecs.md prompts/sigma/retrieve_context.md prompts/sigma/ecs_weights.md`
3. `rm prompts/mu/crystallize.md prompts/mu/extract_rules.md prompts/mu/memory_dump.md`
4. `rm prompts/psi/*.md` (individuels)
5. `rm prompts/phi/*.md` (individuels)

**Files :**
- Delete : All individual atomic prompts replaced by interfaces.

---

## Task 7 — [ONTOLOGY] Mise à jour des Symboles

**Objective :** Actualiser `docs/ONTOLOGY.md` pour refléter la V3.0.

**Files :**
- Modify : `docs/ONTOLOGY.md`

---

## Task 8 — [MANIFEST] Mise à jour Structurelle

**Objective :** Synchroniser le Manifest du système avec la nouvelle hiérarchie.

**Files :**
- Modify : `docs/EXPANSE-MANIFEST.md`

---

## Task 9 — [TEST] Audit de la Chaîne V3.0

**Objective :** Vérifier qu'un cycle de boot et de réflexion KERNEL est opérationnel.

**Verification :**
- [ ] Pulse de boot réussi.
- [ ] Génération d'une trace `Ψ(éveil)` par le modèle.

---

## Task 10 — [MEMORY] Cristallisation de la Mutation

**Objective :** Marquer le refactor comme [PROPOSAL_RESOLVED] dans Mnemolite.

---

## Summary
| Task | Type | Status | Notes |
|------|------|--------|-------|
| 1 | [BOOT] | ⬜ | system logic |
| 2 | [PROMPT] | ⬜ | mu interface |
| 3 | [PROMPT] | ⬜ | sigma interface |
| 4 | [PROMPT] | ⬜ | resonnance/audit |
| 5 | [WIRE] | ⬜ | meta wiring |
| 6 | [DELETE] | ⬜ | pruning |
| 7 | [ONTOLOGY]| ⬜ | symbols |
| 8 | [MANIFEST]| ⬜ | structure |
| 9 | [TEST] | ⬜ | verification |
| 10| [MEMORY] | ⬜ | mnemolite |
