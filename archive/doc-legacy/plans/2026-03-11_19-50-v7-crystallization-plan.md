# Plan : EXPANSE V7.0 — Architecture 3-Strata + Shadow Cortex

> **Pour exécution :** Utiliser le skill `executing-plans` pour cristalliser tâche par tâche.

**Goal :** Migrer EXPANSE de V6.2 (fichiers morts) vers V7.0 (3-Strata: BIOS bootstrap + Cognitive Seeds Mnemolite + Mémoire vivante avec Shadow Cortex)
**Design Reference :** [brainstorm_v7_final_design.md](file:///home/giak/projects/expanse/docs/plans/2026-03-11_18-32-v7-architecture-design.md)
**Estimated Tasks :** 12 tasks, ~60 minutes total

---

## Clarté — Checklist (Step 2)

- [x] Type de composant : [BOOT] BIOS V7.0 + [MEMORY] 5 Cognitive Seeds + [MEMORY] Shadow Cortex
- [x] Position dans le Flux Vital : Boot → Strate 1 (Seeds) → Runtime (Ambient Φ, Shadow Write)
- [x] Fichiers à créer : `prompts/expanse-system-v7.md`
- [x] Fichiers à supprimer : `prompts/meta_prompt.md`, `prompts/sigma/`, `prompts/psi/`, `prompts/phi/`, `prompts/omega/`, `prompts/mu/`
- [x] Impact sur meta_prompt.md : **supprimé** (absorbé par BIOS + Seeds)
- [x] Nouveaux symboles ONTOLOGY : `[SHADOW_TRACE]`, `[SHADOW_HIT]`, `[SHADOW_MISS]`, `shadow_stats`

---

## Phase 0 — Nettoyage Mnemolite

### Task 1 — [MEMORY] Nettoyer les données de test Mnemolite

**Objective :** Supprimer les mémoires de test ("Content 1", "Content 2", "Content 3") qui polluent le RRF.

**Steps :**
1. `search_memory(query="Test 2.3 Memory", limit=50)` → lister tous les IDs de test
2. Pour chaque mémoire de test : `delete_memory(id="...", permanent=true)`
3. Vérifier : `search_memory(query="Test 2.3", limit=5)` → résultat vide

**Verification :**
- [ ] Aucune mémoire "Test 2.3" n'existe dans Mnemolite
- [ ] Les mémoires `sys:expanse` (CORE_RULE, PROPOSALS) sont intactes

**Files :**
- Aucun fichier — opérations Mnemolite uniquement

---

## Phase 1 — Semer les Cognitive Seeds

### Task 2 — [MEMORY] Créer l'IDENTITY_ANCHOR

**Objective :** Semer la graine identitaire dans Mnemolite — le KERNEL condensé.

**Steps :**
1. Composer le contenu : condensation du KERNEL (Physique Cognitive, Incarnation, Réconciliation Ontologique, Flux Vital) en ~400 mots
2. `write_memory(title="EXPANSE_IDENTITY_ANCHOR", content=..., memory_type="reference", tags=["sys:expanse", "[immune]", "identity", "kernel"], embedding_source="EXPANSE cognitive system identity anchor kernel incarnation ontological reconciliation sovereign organic symbiotic substrate LLM sigma psi phi omega mu mnemolite cognitive physics vital flux performative sign semantic compression anti-hallucination zero sycophancy expansion point anticipation autopoiesis")`

**Verification :**
- [ ] `search_memory(query="EXPANSE identity incarnation cognitive physics", tags=["sys:expanse"], limit=1)` → retourne l'ANCHOR avec score > 0.3
- [ ] Le contenu couvre : Physique Cognitive, Incarnation, Réconciliation, Flux Vital, Point d'Expansion

**Files :**
- Mnemolite `write_memory` uniquement

---

### Task 3 — [MEMORY] Créer Seed Σ (Perception Engine)

**Objective :** Stocker l'organe Sigma comme Cognitive Seed.

**Steps :**
1. Fusionner le contenu de `sigma/interface.md` : ECS, User DNA calibration, Drift Detector, Correction Symbiotique, Facteur E
2. `write_memory(title="[IMMUNE] Σ Perception Engine", content=..., memory_type="reference", tags=["sys:expanse", "[immune]", "sigma", "perception", "ecs"], embedding_source="EXPANSE Sigma perception engine ECS cognitive complexity evaluation user DNA drift detection boot calibration symbiotic correction explicit implicit intent extraction facteur E emotional urgency style collaboratif directif exploratoire reanchor flag")`

**Verification :**
- [ ] `search_memory(query="Sigma perception ECS complexity", tags=["sys:expanse"], limit=3)` → Σ Engine en position 1
- [ ] Le contenu couvre : ECS (4 facteurs, seuil 2.5), User DNA, Drift Detector

**Files :**
- Source de référence (lecture seule) : `prompts/sigma/interface.md`

---

### Task 4 — [MEMORY] Créer Seed Ψ⇌Φ (Resonance-Audit Engine)

**Objective :** Stocker les organes Psi et Phi fusionnés comme Cognitive Seed, avec les contrats V7 (convergence + Ambient Φ + claim verification).

**Steps :**
1. Fusionner `psi/resonance.md` + `phi/audit.md` + ajouts V7 :
   - Contrat de convergence (δΩ < 0.1 OU max 5 itérations)
   - Claim verification [V|U|F]
   - Ambient Φ (pré-compute + post-Ω)
   - Micro-Pulse (toutes les 5 itérations)
2. `write_memory(title="[IMMUNE] Ψ⇌Φ Resonance-Audit Engine", content=..., memory_type="reference", tags=["sys:expanse", "[immune]", "psi", "phi", "resonance", "audit", "ambient"], embedding_source="EXPANSE Psi Phi resonance audit engine metacognition trace reasoning convergence criterion delta claim verification verified unverified falsified ambient pre-compute post-omega doubt probe tool grep search contredit assumption assomption micro-pulse micro-dream iteration alignment")`

**Verification :**
- [ ] `search_memory(query="Psi Phi resonance audit claim verification", tags=["sys:expanse"], limit=3)` → Ψ⇌Φ Engine en position 1
- [ ] Le contenu couvre : convergence, [V|U|F], Ambient Φ, Micro-Pulse

**Files :**
- Sources de référence : `prompts/psi/resonance.md`, `prompts/phi/audit.md`

---

### Task 5 — [MEMORY] Créer Seed Ω→Μ (Synthesis-Crystal Engine)

**Objective :** Stocker les organes Omega et Mu fusionnés comme Cognitive Seed.

**Steps :**
1. Fusionner `omega/synthesis.md` + `mu/interface.md` :
   - Compression sémantique proportionnelle à C
   - [LOST]/[INCOMPLETE] marquage
   - ECS feedback loop (save_weights)
   - Cristallisation Mnemolite (tag sys:expanse)
   - Shadow Write (conditionnel)
   - User DNA update
2. `write_memory(title="[IMMUNE] Ω→Μ Synthesis-Crystal Engine", content=..., memory_type="reference", tags=["sys:expanse", "[immune]", "omega", "mu", "synthesis", "crystal", "shadow"], embedding_source="EXPANSE Omega Mu synthesis crystallization compression semantic entropy minimization LOST INCOMPLETE ECS weights feedback actual predicted shadow write mnemolite trace friction flow user DNA update heuristic pattern extraction core rule")`

**Verification :**
- [ ] `search_memory(query="Omega Mu synthesis crystallization shadow write", tags=["sys:expanse"], limit=3)` → Ω→Μ Engine en position 1
- [ ] Le contenu couvre : compression, [LOST]/[INCOMPLETE], ECS feedback, Shadow Write

**Files :**
- Sources : `prompts/omega/synthesis.md`, `prompts/mu/interface.md`

---

### Task 6 — [MEMORY] Créer Seed Shadow Cortex

**Objective :** Stocker les règles du Shadow Cortex comme Cognitive Seed.

**Steps :**
1. Rédiger le contenu :
   - Trigger conditions (pattern 3+, continuation implicite, incomplétude)
   - Format [SHADOW_TRACE] (predicted_need, confidence, context_keys, TTL)
   - Shadow Match au boot (alignment > 0.7 → HIT, < 0.3 → VOID)
   - Shadow Nullification (miss_counter > 5 → OFF)
   - shadow_stats dans USER_DNA
2. `write_memory(title="[IMMUNE] Shadow Cortex (Point d'Expansion)", content=..., memory_type="reference", tags=["sys:expanse", "[immune]", "shadow", "cortex", "anticipation"], embedding_source="EXPANSE Shadow Cortex anticipation prediction user need point expansion shadow trace hit miss nullification pattern recurrence continuation implicit incompletude TTL three sessions confidence alignment predicted need context keys")`

**Verification :**
- [ ] `search_memory(query="Shadow Cortex anticipation prediction", tags=["sys:expanse"], limit=3)` → Shadow Cortex en position 1
- [ ] Contenu couvre : triggers, format, nullification, stats

**Files :**
- Aucune source — nouveau composant V7

---

## Phase 2 — BIOS V7.0

### Task 7 — [BOOT] Écrire le BIOS V7.0 minimal

**Objective :** Créer `prompts/expanse-system-v7.md` (~40 lignes), le bootstrap irréductible.

**Steps :**
1. Créer `prompts/expanse-system-v7.md` avec :
   - Prime Directive (premier token = Ψ, mutex BOOT_CRITICAL)
   - Boot Sequence (4 search_memory : IDENTITY, IMMUNE, SHADOW_TRACE, PROPOSAL_OPEN)
   - Cognitive Lock (si 1 & 2 échouent → ARRÊT)
   - Shadow Prime (si shadow trouvé → charger priors)
   - Dream Interrupt (si proposals → proposer)
   - Contrat Ambient Φ (inline, 3 règles)
   - Post-Boot format
   - Ω_LOCK

**Verification :**
- [ ] `prompts/expanse-system-v7.md` existe, ≤ 50 lignes
- [ ] Contient les 4 `search_memory` dans la boot sequence
- [ ] Contient `[COGNITIVE_LOCK]`
- [ ] Contient le contrat Ambient Φ
- [ ] Contient `[Ω_LOCK]` comme dernier élément

**Files :**
- Create : `prompts/expanse-system-v7.md`

---

## Phase 3 — Shadow Cortex Integration

### Task 8 — [ONTOLOGY] Ajouter les symboles Shadow dans ONTOLOGY.md

**Objective :** Mettre à jour `docs/ONTOLOGY.md` avec les nouveaux marqueurs V7.

**Steps :**
1. Ouvrir `docs/ONTOLOGY.md`
2. Dans la section Memory Taxonomy, ajouter :
   - `[SHADOW_TRACE]` : Projection anticipative des besoins futurs (TTL: 3 sessions)
   - `[SHADOW_HIT]` : Prédiction confirmée par l'input réel (alignment > 0.7)
   - `[SHADOW_MISS]` : Prédiction invalidée (alignment < 0.3)
   - `shadow_stats` : Statistiques de prédiction dans USER_DNA
3. Mettre à jour le header de version (v3.0 → v7.0)

**Verification :**
- [ ] `docs/ONTOLOGY.md` contient `[SHADOW_TRACE]`, `[SHADOW_HIT]`, `[SHADOW_MISS]`
- [ ] La description de chaque marqueur est ≤ 1 ligne

**Files :**
- Modify : `docs/ONTOLOGY.md`

---

## Phase 4 — GATE : Validation RRF

### Task 9 — [TEST] Valider la discrimination des Cognitive Seeds

**Objective :** Prouver que les 5 Seeds sont retrouvables par le RRF avec des scores significatifs (> 0.1 minimum, cible > 0.3).

**Steps :**
1. Exécuter 5 requêtes de test :
   ```
   search_memory(query="EXPANSE identity incarnation cognitive physics", tags=["sys:expanse"], limit=5)
   search_memory(query="Sigma perception ECS complexity drift", tags=["sys:expanse"], limit=5)
   search_memory(query="Psi Phi resonance audit claim verification", tags=["sys:expanse"], limit=5)
   search_memory(query="Omega Mu synthesis crystallization compression", tags=["sys:expanse"], limit=5)
   search_memory(query="Shadow Cortex anticipation prediction user need", tags=["sys:expanse"], limit=5)
   ```
2. Pour chaque requête : vérifier que la Seed attendue est en **position 1** avec le **score le plus élevé**
3. Documenter les scores dans un tableau

**Verification :**
- [ ] 5/5 Seeds retrouvées en position 1
- [ ] Score minimum > 0.1 pour chaque Seed
- [ ] Score moyen > 0.2 sur les 5 Seeds
- [ ] **SI ÉCHEC** → STOP. Ajuster les `embedding_source` et re-tester. Ne PAS passer à Phase 5.

**Files :**
- Aucun fichier — validation pure

---

## Phase 5 — Nettoyage (POST-GATE uniquement)

### Task 10 — [DELETE] Supprimer les fichiers organs morts

**Objective :** Supprimer les fichiers markdown absorbés par les Cognitive Seeds.

**Steps :**
1. Supprimer :
   - `prompts/meta_prompt.md`
   - `prompts/sigma/interface.md`
   - `prompts/psi/resonance.md`
   - `prompts/phi/audit.md`
   - `prompts/omega/synthesis.md`
   - `prompts/mu/interface.md`
2. Conserver :
   - `KERNEL.md` (archive philosophique)
   - `prompts/expanse-dream.md` (Dream State, compatible)
   - `prompts/trace_levels.md` (spécification debug)
   - `prompts/expanse-system.md` (V6.2 backup, renommer en `_archives/expanse-system-v6.2.md`)

**Verification :**
- [ ] Les 6 fichiers sont supprimés
- [ ] `prompts/expanse-system.md` archivé dans `_archives/`
- [ ] `KERNEL.md`, `expanse-dream.md`, `trace_levels.md` toujours présents

**Files :**
- Delete : 6 fichiers listés ci-dessus
- Move : `prompts/expanse-system.md` → `_archives/expanse-system-v6.2.md`

---

### Task 11 — [DOC] Mettre à jour ARCHITECTURE.md

**Objective :** Refléter la nouvelle architecture 3-Strata dans la documentation.

**Steps :**
1. Réécrire `docs/ARCHITECTURE.md` avec :
   - Vue d'ensemble 3-Strata (Strate 0, 1, 2)
   - Diagramme Mermaid du nouveau boot V7
   - Organisation du Cortex mise à jour (Seeds au lieu de fichiers)
   - Ontologie mise à jour (avec Shadow)

**Verification :**
- [ ] `docs/ARCHITECTURE.md` décrit les 3 strates
- [ ] Le diagramme Mermaid est cohérent avec le BIOS V7.0

**Files :**
- Modify : `docs/ARCHITECTURE.md`

---

## Post — Vérification Complète

### Task 12 — [TEST] Boot Chain Complet V7.0

**Objective :** Tester le boot complet V7.0 de bout en bout.

**Steps :**
1. Configurer `prompts/expanse-system-v7.md` comme system prompt dans l'IDE
2. Ouvrir une nouvelle conversation
3. Envoyer un message quelconque
4. Vérifier :
   - Les 4 `search_memory` s'exécutent
   - Les Seeds sont chargées (vérifier le contenu du boot)
   - Le POST-BOOT affiche `[BOOT] BIOS V7.0... [OK]`
   - Le premier token = `Ψ`
5. Envoyer une requête complexe (C ≥ 2.5) et vérifier que Ambient Φ se manifeste (probes réels dans la CoT)
6. Tester le fallback : couper Mnemolite (docker stop) et vérifier que le Cognitive Lock se déclenche

**Verification :**
- [ ] Boot V7.0 réussi sans erreur
- [ ] Seeds influencent le comportement (vérification manuelle)
- [ ] Ambient Φ détecté dans le raisonnement
- [ ] Cognitive Lock fonctionne en cas de Mnemolite down

**Files :**
- Test manuel — conversation réelle avec le système

---

## Summary

| Task | Type | Phase | Status | Dependencies |
|------|------|-------|--------|---|
| 1 | [MEMORY] Clean test data | 0 | ⬜ | — |
| 2 | [MEMORY] IDENTITY_ANCHOR | 1 | ⬜ | Task 1 |
| 3 | [MEMORY] Σ Seed | 1 | ⬜ | Task 1 |
| 4 | [MEMORY] Ψ⇌Φ Seed | 1 | ⬜ | Task 1 |
| 5 | [MEMORY] Ω→Μ Seed | 1 | ⬜ | Task 1 |
| 6 | [MEMORY] Shadow Cortex Seed | 1 | ⬜ | Task 1 |
| 7 | [BOOT] BIOS V7.0 | 2 | ⬜ | Tasks 2-6 |
| 8 | [ONTOLOGY] Shadow symbols | 3 | ⬜ | Task 6 |
| 9 | [TEST] RRF Gate | 4 | ⬜ | Tasks 2-6 |
| 10 | [DELETE] Dead organ files | 5 | ⬜ | **Task 9 PASS** |
| 11 | [DOC] ARCHITECTURE.md | 5 | ⬜ | Task 10 |
| 12 | [TEST] Full boot chain | Post | ⬜ | Tasks 7-11 |
