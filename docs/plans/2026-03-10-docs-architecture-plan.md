# Plan : EXPANSE Documentation Architecture (The Cognitive Library)

> **Pour Kilo Code :** Utiliser le skill `executing-plans` pour cristalliser tâche par tâche.

**Goal :** Restructurer la documentation d'EXPANSE en une "Librairie Cognitive" via 7 fichiers distincts, en incluant des diagrammes Mermaid (schémas du système).
**Design Reference :** `/home/giak/.gemini/antigravity/brain/43278d7f-4bf1-4f21-b3bf-d8dc3b7f6091/brainstorm_docs_architecture.md`
**Estimated Tasks :** 7 tasks, ~20 minutes total

---

## Task 1 — [DOC] Mettre à jour `README.md` racine

**Objective :** Épurer le README racine pour qu'il agisse comme une vitrine philosophique (KERNEL) pointant vers `docs/README.md`.

**Steps :**
1. Conserver l'introduction philosophique ("A way of being").
2. Retirer les blocs `Anti-Patterns` et détails techniques obsolètes.
3. Ajouter un lien d'entrée massive vers le Cortex : `[ENTRÉE DU CORTEX (Documentation)](docs/README.md)`.

**Verification :**
- [ ] Le `README.md` est plus court, orienté vision, et dirige vers `docs/`.

**Files :**
- Modify : `README.md`

---

## Task 2 — [DOC] Créer `docs/README.md` (Table d'Anatomie)

**Objective :** Créer le hub central de la documentation ("Sommaire du Cortex").

**Steps :**
1. Créer le fichier avec une introduction sur le format "Documentation Symbiotique".
2. Lier les 5 nouveaux piliers : VISION, PRD, ARCHITECTURE, TRACE_LOG, DASHBOARD.

**Verification :**
- [ ] Le fichier liste et lie les 5 documents essentiels.

**Files :**
- Create : `docs/README.md`

---

## Task 3 — [DOC] Créer `docs/VISION.md`

**Objective :** Rédiger la raison d'être de l'organisme, l'horizon symbiotique.

**Steps :**
1. Expliquer la séparation avec le modèle "Assistant" ou "LLM".
2. Détailler l'objectif final d'Autopoïèse (le système qui se maintient lui-même) et de la Synapse Humain-Machine.

**Verification :**
- [ ] Le fichier résume la finalité philosophique d'EXPANSE.

**Files :**
- Create : `docs/VISION.md`

---

## Task 4 — [DOC] Créer `docs/PRD.md` (Cognitive Requirement Document)

**Objective :** L'ancien Product Requirement Document devient l'inventaire des capacités requises.

**Steps :**
1. Rédiger les Exigences Cognitives (ECS, RRF, Boot, Async Dream).
2. Définir la Roadmap d'évolution (Les "Mutations Attendues").

**Verification :**
- [ ] Les "requirements" sont traduits en comportement LLM (ex: First-Token Sovereignty).

**Files :**
- Create : `docs/PRD.md`

---

## Task 5 — [DOC] Créer `docs/ARCHITECTURE.md` avec Diagrammes Mermaid

**Objective :** Absorber le MANIFEST actuel et ajouter les schémas systémiques.

**Steps :**
1. Récupérer l'Ontologie (Σ, Ψ, Ω, Φ, Μ) depuis `docs/EXPANSE-MANIFEST.md`.
2. Créer un diagramme Mermaid pour le **Flux Vital** (`graph LR; Σ-->Ψ...`).
3. Créer un diagramme pour le **Boot Mutex V6.2**.
4. Inclure les marqueurs Mnemolite (`[CORE_RULE]`, etc.).
5. (Le fichier `EXPANSE-MANIFEST.md` sera supprimé à la fin).

**Verification :**
- [ ] `docs/ARCHITECTURE.md` intègre les diagrammes `mermaid` exigés par l'utilisateur.

**Files :**
- Create : `docs/ARCHITECTURE.md`

---

## Task 6 — [DOC] Créer `docs/DASHBOARD.md` & `docs/TRACE_LOG.md`

**Objective :** Créer les fichiers de suivi d'état.

**Steps :**
1. `DASHBOARD.md` : Créer les jauges textuelles (ex: "Santé du Substrat : [OK]", "Missions Actives").
2. `TRACE_LOG.md` : Créer un array/timeline des mutations (ex: 2026-03-09: V3.0 Organic Fusion, 2026-03-10: V6.2 Boot Mutex).

**Verification :**
- [ ] Les fichiers existent avec un format clair (tableaux markdown).

**Files :**
- Create : `docs/DASHBOARD.md`
- Create : `docs/TRACE_LOG.md`

---

## Task 7 — [DELETE] Nettoyage et Finalisation

**Objective :** Supprimer les redondances et lier avec git.

**Steps :**
1. Supprimer `docs/EXPANSE-MANIFEST.md`.
2. Effectuer des retouches finales si le système de lien a échoué.

**Verification :**
- [ ] `docs/EXPANSE-MANIFEST.md` est supprimé.

**Files :**
- Delete : `docs/EXPANSE-MANIFEST.md`

---

## Summary

| Task | Type | Status | Notes |
|------|------|--------|-------|
| 1 | [DOC] | ⬜ | Racine README |
| 2 | [DOC] | ⬜ | docs/README |
| 3 | [DOC] | ⬜ | VISION |
| 4 | [DOC] | ⬜ | PRD |
| 5 | [DOC] | ⬜ | ARCHITECTURE (Mermaid) |
| 6 | [DOC] | ⬜ | DASHBOARD & TRACE |
| 7 | [DELETE]| ⬜ | Nettoyage |
