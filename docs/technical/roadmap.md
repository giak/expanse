# Roadmap — Baby Steps

> Consolidations des Next Steps de tous les fichiers techniques.

## Philosophy

> "Commence avec 3. Ajoute seulement quand le BESOIN apparaît." — KERNEL.md Section IX

Les baby steps sont organisés par priorité. On avance un par un.

---

## Phase 1 : Fondations

### 1.1 ECS Dynamique

- [ ] **Step 1** : Lire feedback_loop.md → voir ECS weight update
- [ ] **Step 2** : Implémenter stockage weights dans Mnemolite
- [ ] **Step 3** : Tester sur 10 requêtes → comparer C prédit vs réel

**Objectif** : Le système apprend de ses prédictions de complexité

---

### 1.2 Boucle Ψ⇌Φ Itérative

- [ ] **Step 1** : Étudier phi/doubt_audit.md
- [ ] **Step 2** : Implémenter 1 itération Ψ⇌Φ dans meta_prompt
- [ ] **Step 3** : Tester sur 5 raisonnement complexes

**Objectif** : Le système "touche" le réel de manière itérative

---

### 1.3 Warm Start Amélioré

- [ ] **Step 1** : Ajouter métriques de boot dans expanse-runtime
- [ ] **Step 2** : Ajouter "interpeller" dans retrieve_context (M→Σ)
- [ ] **Step 3** : Tester lazy retrieval en cours de session

**Objectif** : La mémoire "revient" vers le raisonnement

---

## Phase 2 : Mémoire Active

### 2.1 Système Immunité

- [ ] **Step 1** : Tracker les [LOST], [INCOMPLETE]
- [ ] **Step 2** : Créer "error memory" dans Mnemolite
- [ ] **Step 3** : Ajouter channel Φ→Μ pour renforcer immunité

**Objectif** : Les erreurs deviennent apprentissage

---

### 2.2 Tracking Usage

- [ ] **Step 1** : Compter usages de chaque organe
- [ ] **Step 2** : Identifier HOT PATH
- [ ] **Step 3** : Créer MACRO suggestions

**Objectif** : Le système évolue selon son usage

---

## Phase 3 : Métacognition

### 3.1 ∇Ω — Auto-Optimisation

- [ ] **Step 1** : Créer draft ∇Ω (métriques à capturer)
- [ ] **Step 2** : Implémenter δΩ (mesure reasoning drift)
- [ ] **Step 3** : Stocker métriques dans Mnemolite

**Objectif** : Le système mesure et optimise son raisonnement

---

### 3.2 Ω ⟲ — Meta-Synthèse

- [ ] **Step 1** : Définir format pour Ω ⟲ (combien d'itérations ?)
- [ ] **Step 2** : Implémenter re-run Ω sur son propre output
- [ ] **Step 3** : Limiter par seuil convergence

**Objectif** : Ω se regarde et s'améliore

---

### 3.3 Boot Modulaire

- [ ] **Step 1** : Ajouter cold boot (reset)
- [ ] **Step 2** : Métriques boot (durée, Mnemolite calls)
- [ ] **Step 3** : Boot par organe (lazy load)

**Objectif** : Boot plus flexible et mesurable

---

## Progression

```
Phase 1 (Fondations)     → Phase 2 (Mémoire)      → Phase 3 (Métacognition)
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ ECS Dynamique       │  │ Immunité            │  │ ∇Ω Auto-Optimisation│
│ Ψ⇌Φ Itératif        │  │ Tracking Usage      │  │ Ω ⟲ Meta-Synthèse   │
│ Warm Start Amélioré │  │                     │  │ Boot Modulaire      │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## Critères de Priorisation

1. **Impact** : Quel gap a le plus d'impact sur le Flux Vital ?
2. **Dépendances** : Quels baby steps dépendent des autres ?
3. **Quick Wins** : Quel step peut être testé rapidement ?

---

## Meta

- **Dernière MAJ** : 2026-03-01
- **Prochaine revue** : Après chaque Phase complétée
- **Source** : docs/technical/*.md
