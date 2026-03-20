# Plan : TRACE:FRESH + UUID Boot Alert (V8.2)

> **Pour Kilo Code :** Utiliser le skill `executing-plans` pour cristalliser tâche par tâche.

**Goal :** Implémenter les corrections validées par simulation des Défis #2 et #3.
**Design Reference :** `2026-03-09-architectural-challenges-brainstorm.md`
**Estimated Tasks :** 5 tasks, ~15 minutes total

---

## Task 1 — [PROMPT] Mu : Ajout du tag `[TRACE:FRESH]` à l'écriture

**Objective :** Quand Μ écrit une `[TRACE_FRICTION]` ou `[TRACE_FLOW]`, il doit ajouter automatiquement le tag `[TRACE:FRESH]`.

**Steps :**
1. Ouvrir `prompts/mu/crystallize.md`.
2. Dans les heuristiques "Friction" et "Flow", ajouter l'obligation d'inclure `[TRACE:FRESH]` dans la liste de tags Mnemolite lors de l'écriture.

**Verification :**
- [ ] `mu/crystallize.md` mentionne `[TRACE:FRESH]` pour l'écriture de chaque `[TRACE_FRICTION]` et `[TRACE_FLOW]`.

**Files :**
- Modify : `prompts/mu/crystallize.md`

---

## Task 2 — [PROMPT] Rêveur : Passe Zéro sur `[TRACE:FRESH]` + Consommation

**Objective :** La Passe Zéro cherche uniquement les traces fraîches. Après lecture, le Rêveur retire le tag.

**Steps :**
1. Ouvrir `prompts/expanse-dream.md`.
2. Modifier la Passe Zéro : remplacer la recherche générique `[TRACE_FRICTION]` par `[TRACE:FRESH]`.
3. Dans "Output Attendu", ajouter l'obligation : *"Après avoir lu une `[TRACE:FRESH]`, retirez ce tag via `update_memory` pour éviter les boucles."*

**Verification :**
- [ ] `expanse-dream.md` Passe Zéro filtre sur `[TRACE:FRESH]`.
- [ ] `expanse-dream.md` contient l'instruction de consommation post-lecture.

**Files :**
- Modify : `prompts/expanse-dream.md`

---

## Task 3 — [BOOT] DREAM INTERRUPT : Afficher l'UUID

**Objective :** L'alerte de boot affiche l'UUID de la proposition pour permettre la cicatrisation cross-session.

**Steps :**
1. Ouvrir `prompts/expanse-system.md`.
2. Modifier le texte du `[DREAM INTERRUPT]` pour forcer l'affichage de l'UUID : `∇(Évolution) [TYPE] — UUID: {id} — "{Titre}". Appliquer ?`

**Verification :**
- [ ] `expanse-system.md` [DREAM INTERRUPT] instruite Σ d'afficher l'UUID.

**Files :**
- Modify : `prompts/expanse-system.md`

---

## Task 4 — [ONTOLOGY] Documenter `[TRACE:FRESH]`

**Objective :** Enregistrer le nouveau tag dans l'Ontologie.

**Steps :**
1. Ouvrir `docs/ONTOLOGY.md`.
2. Ajouter `[TRACE:FRESH]` dans la section Memory Taxonomy.

**Verification :**
- [ ] `ONTOLOGY.md` contient la définition de `[TRACE:FRESH]`.

**Files :**
- Modify : `docs/ONTOLOGY.md`

---

## Task 5 — [TEST] Vérification du cycle complet

**Objective :** Prouver que la boucle Friction → Rêve → Consommation est correcte.

**Steps :**
1. Simuler une `[TRACE_FRICTION]` avec le tag `[TRACE:FRESH]` via Mnemolite.
2. Lancer `expanse-dream.md` : vérifier que la Passe Zéro la détecte.
3. Vérifier que le Rêveur retire le tag après traitement.
4. Relancer `expanse-dream.md` : vérifier l'inertie (Passe Zéro ne trouve rien).

**Verification :**
- [ ] Cycle complet sans boucle infinie confirmé.

---

## Summary

| Task | Type | Status | Notes |
|------|------|--------|-------|
| 1 | `[PROMPT]` | ⬜ | Mu : tag TRACE:FRESH |
| 2 | `[PROMPT]` | ⬜ | Rêveur : Passe Zéro + Consommation |
| 3 | `[BOOT]` | ⬜ | UUID dans DREAM INTERRUPT |
| 4 | `[ONTOLOGY]`| ⬜ | Documenter TRACE:FRESH |
| 5 | `[TEST]` | ⬜ | Validation cycle complet |
