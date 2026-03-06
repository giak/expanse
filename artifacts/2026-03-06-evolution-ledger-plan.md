# Plan : Le Registre d'Évolution (V8.1)

> **Pour Kilo Code :** Utiliser le skill `executing-plans` pour cristalliser tâche par tâche.

**Goal :** Implémenter la traçabilité (Audit Trail) et la gestion de cycle de vie (Cicatrisation) des mutations d'EXPANSE.
**Design Reference :** [2026-03-06_cicatrisation_design.md](file:///home/giak/.gemini/antigravity/brain/eb08612f-8cc7-4adf-88a3-2bbcb2e74a37/2026-03-06_cicatrisation_design.md) & [2026-03-06_audit_trail_design.md](file:///home/giak/.gemini/antigravity/brain/eb08612f-8cc7-4adf-88a3-2bbcb2e74a37/2026-03-06_audit_trail_design.md)
**Estimated Tasks :** 5 tasks, ~20 minutes total

---

## Task 1 — [PROMPT] Mise à jour du Rêveur (Provenance)

**Objective :** Forcer le Rêveur à citer ses sources (ID Mnemolite) lors de la génération de propositions.

**Steps :**
1. Ouvrir [prompts/expanse-dream.md](file:///home/giak/projects/expanse/prompts/expanse-dream.md).
2. Dans la section "Output Attendu", ajouter l'obligation d'inclure le champ `Source: [ID]` dans le contenu de la `[RULE_PROPOSAL]`.

**Verification :**
- [ ] [expanse-dream.md](file:///home/giak/projects/expanse/prompts/expanse-dream.md) exige formellement la citation de la source (`[TRACE_FRICTION]` ou `[TRACE_FLOW]`).

**Files :**
- Modify : [prompts/expanse-dream.md](file:///home/giak/projects/expanse/prompts/expanse-dream.md)

---

## Task 2 — [PROMPT] Optimisation de l'Organe Μ (Intelligence de Résolution)

**Objective :** Apprendre à Μ comment "cicatriser" une proposition en y ajoutant les tags `[RESOLVED]`, `[APPLIED]` ou `[REJECTED]`.

**Steps :**
1. Ouvrir [prompts/mu/crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md).
2. Ajouter une section "Cicatrisation" décrivant le protocole de clôture d'une `[RULE_PROPOSAL]`.

**Verification :**
- [ ] [mu/crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md) contient les instructions pour marquer une mémoire comme résolue.

**Files :**
- Modify : [prompts/mu/crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md)

---

## Task 3 — [BOOT] Filtrage du BIOS (Anti-Loop)

**Objective :** Modifier la séquence de boot pour qu'elle ignore les propositions déjà résolues.

**Steps :**
1. Ouvrir [prompts/expanse-system.md](file:///home/giak/projects/expanse/prompts/expanse-system.md).
2. Dans la Séquence de Boot (Action 3), modifier la recherche Mnemolite pour exclure les tags `[RESOLVED]`.

**Verification :**
- [ ] La requête de boot filtre négativement les tags de résolution.

**Files :**
- Modify : [prompts/expanse-system.md](file:///home/giak/projects/expanse/prompts/expanse-system.md)

---

## Task 4 — [ONTOLOGY] Documentation de la Chaîne de Provenance

**Objective :** Documenter les tags `[RESOLVED]`, `[APPLIED]`, `[REJECTED]` et la convention `<!-- origin: [...] -->`.

**Steps :**
1. Ouvrir [docs/ONTOLOGY.md](file:///home/giak/projects/expanse/docs/ONTOLOGY.md).
2. Ajouter les nouveaux marqueurs de cycle de vie dans la section "Memory Taxonomy".
3. Documenter le format de liaison ADN (Vertical Traceability).

**Verification :**
- [ ] [docs/ONTOLOGY.md](file:///home/giak/projects/expanse/docs/ONTOLOGY.md) contient la définition complète de la chaîne de provenance.

**Files :**
- Modify : [docs/ONTOLOGY.md](file:///home/giak/projects/expanse/docs/ONTOLOGY.md)

---

## Task 5 — [TEST] Vérification de la Cicatrice

**Objective :** Valider qu'un tag `[RESOLVED]` libère effectivement le boot.

**Steps :**
1. Créer une proposition factice.
2. Vérifier le blocage au boot.
3. Demander à μ de "cicatriser" la proposition.
4. Vérifier la fluidité du boot.

**Verification :**
- [ ] Le boot ne s'interrompt plus pour une règle résolue.

---

## Summary

| Task | Type | Status | Notes |
|------|------|--------|-------|
| 1 | `[PROMPT]` | ⬜ | Provenance dans le Rêve |
| 2 | `[PROMPT]` | ⬜ | Intelligence de Mu |
| 3 | `[BOOT]` | ⬜ | Filtrage du BIOS |
| 4 | `[ONTOLOGY]`| ⬜ | Marqueurs de cycle de vie |
| 5 | `[TEST]` | ⬜ | Validation du flux |
