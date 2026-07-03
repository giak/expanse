# Plan : L'ADN de l'Utilisateur (V8.3 — Symbiose)

> **Pour Kilo Code :** Utiliser le skill `executing-plans` pour cristalliser tâche par tâche.

**Goal :** Implémenter la Triade Symbiotique — `[USER_DNA]`, Parseur de Correction, Checkpoint de Résonance.
**Design Reference :** `2026-03-09-symbiosis-brainstorm.md`
**Estimated Tasks :** 6 tasks, ~25 minutes total

---

## Task 1 — [ONTOLOGY] Créer le type mémoire `[USER_DNA]`

**Objective :** Documenter le nouveau type mémoire dans `docs/ONTOLOGY.md`.

**Steps :**
1. Ouvrir `docs/ONTOLOGY.md`.
2. Ajouter `[USER_DNA]` dans la Memory Taxonomy avec sa description et sa structure de champs.

**Structure :**
```
[USER_DNA] : Profil inférentiel de l'utilisateur humain.
Mis à jour par Μ en fin de session. Lu par Σ au boot.
Champs observés :
- style: philosophique | technique | pragmatique (poids 0-1)
- tempo: rapide | réflexif (poids 0-1)
- correction_pattern: explicite | reformulation_silencieuse | iteration
- domains_hot: [liste des sujets fréquents]
```

**Verification :**
- [ ] `ONTOLOGY.md` contient la définition de `[USER_DNA]`.

**Files :**
- Modify : `docs/ONTOLOGY.md`

---

## Task 2 — [MANIFEST] Mise à jour Marqueurs V8.3

**Objective :** Synchroniser le MANIFEST avec le nouveau type mémoire.

**Steps :**
1. Ouvrir `docs/EXPANSE-MANIFEST.md`.
2. Ajouter `[USER_DNA]` dans la table `### Marqueurs Mémoire`.

**Verification :**
- [ ] `EXPANSE-MANIFEST.md` liste `[USER_DNA]`.

**Files :**
- Modify : `docs/EXPANSE-MANIFEST.md`

---

## Task 3 — [PROMPT] Μ : Inférence et écriture du `[USER_DNA]`

**Objective :** Après chaque session, Μ infère des données sur l'utilisateur et met à jour son ADN dans Mnemolite.

**Steps :**
1. Ouvrir `prompts/mu/crystallize.md`.
2. Ajouter une heuristique `[HEURISTIC] Mise à jour de l'ADN Utilisateur` :
   - Si la session contenait des corrections ou reformulations → incrémenter le poids `correction_pattern`.
   - Si l'ECS était faible et l'échange fluide → renforcer le style dominant observé.
   - Si un domaine récurrent apparaît → l'ajouter à `domains_hot`.
3. Écrire/Mettre à jour la mémoire `[USER_DNA]` via `update_memory` si elle existe ou `write_memory` si c'est la première session.

**Verification :**
- [ ] `mu/crystallize.md` contient la logique d'inférence et d'écriture du `[USER_DNA]`.

**Files :**
- Modify : `prompts/mu/crystallize.md`

---

## Task 4 — [PROMPT] Σ : Lecture boot + Calibration + Détection Correction

**Objective :** Sigma lit le `[USER_DNA]` au démarrage (calibration du ton) et détecte les reformulations sémantiques dans l'input courant.

**Steps :**
1. Ouvrir `prompts/sigma/retrieve_context.md`.
2. Ajouter : *"Cherche la mémoire `[USER_DNA]` dans Mnemolite. Utilise-la pour calibrer le style de réponse attendu avant tout traitement."*
3. Ouvrir `prompts/sigma/parse_input.md`.
4. Ajouter une heuristique de détection de correction : *"Si l'input reformule ou nie une synthèse précédente → poser le flag `correction_detected=true`. Mu écrira une `[TRACE_FRICTION]` post-session."*

**Verification :**
- [ ] `retrieve_context.md` lit le `[USER_DNA]` au boot.
- [ ] `parse_input.md` détecte les reformulations et pose le flag.

**Files :**
- Modify : `prompts/sigma/retrieve_context.md`
- Modify : `prompts/sigma/parse_input.md`

---

## Task 5 — [PROMPT] Ψ : Checkpoint de Résonance (post-Ω, contextuel)

**Objective :** Après une synthèse complexe (C ≥ 2.5 et sujet conceptuel), Ψ émet un micro-signal de résonance.

**Steps :**
1. Ouvrir `prompts/psi/meta_reflect.md`.
2. Ajouter : *"Si la session avait C ≥ 2.5 et portait sur un sujet conceptuel/philosophique, émettre après Ω : `Ψ(résonance) : Ce cadre correspond-il à ce que tu cherches ?`. Non-intrusif. Une seule fois par session complexe."*

**Verification :**
- [ ] `psi/meta_reflect.md` contient l'instruction de checkpoint de résonance.

**Files :**
- Modify : `prompts/psi/meta_reflect.md`

---

## Task 6 — [TEST] Validation du cycle de Symbiose

**Objective :** Vérifier que le `[USER_DNA]` est bien créé, lu et mis à jour.

**Steps :**
1. Lancer une session EXPANSE. Produire une réponse qui nécessite une correction.
2. Reformuler la demande → Vérifier que le flag `correction_detected` est posé.
3. En fin de session, Μ doit écrire/mettre à jour un `[USER_DNA]` dans Mnemolite.
4. Au prochain boot, Σ doit lire ce profil et calibrer son style.
5. Chercher le `[USER_DNA]` dans Mnemolite : `search_memory(query="[USER_DNA]", tags=["sys:expanse"])`.

**Verification :**
- [ ] `[USER_DNA]` existe dans Mnemolite après la session.
- [ ] Le style de la session suivante est adapté au profil.

---

## Summary

| Task | Type | Status | Notes |
|------|------|--------|-------|
| 1 | `[ONTOLOGY]` | ⬜ | Définir `[USER_DNA]` |
| 2 | `[MANIFEST]` | ⬜ | Synchroniser marqueurs V8.3 |
| 3 | `[PROMPT]` | ⬜ | Mu : Inférence + écriture |
| 4 | `[PROMPT]` | ⬜ | Sigma : Boot calibration + détection correction |
| 5 | `[PROMPT]` | ⬜ | Psi : Checkpoint de résonance |
| 6 | `[TEST]` | ⬜ | Validation du cycle complet |
