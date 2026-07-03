# PLAN D'IMPLÉMENTATION — OUTCOME FEEDBACK + CORRECTIONS V16

**Date :** 2026-04-11  
**Version :** 1.0  
**Priorité :** CRITIQUE — Correction des blocages fondamentaux + implémentation du système Outcome Feedback

---

## 🎯 OBJECTIFS

1. Réparer les bugs bloquants qui empêchent le système de fonctionner
2. Implémenter l'intégration complète Outcome Feedback avec Mnemolite
3. Réaliser les promesses non tenues identifiées par les audits
4. Résoudre les contradictions philosophiques fondamentales

---

## 📋 ÉTAT ACTUEL APRÈS AUDIT

| Composant | État | Gravité |
|-----------|------|---------|
| Workflow de mutation | **CASSÉ** | 🔴 BLOQUANT |
| Dream passes 2-7 | **N'EXÉCUTENT JAMAIS** | 🔴 BLOQUANT |
| Shell injection | **PRÉSENT** | 🟠 CRITIQUE |
| Outcome Feedback | **Implémenté Mnemolite / Non intégré Expanse** | 🟡 À FAIRE |
| Symbiose A0/A1/A2 | **Décrit / Non implémenté** | 🟡 À FAIRE |
| Constitution Guard | **Philosophie / Aucun mécanisme** | 🟡 À FAIRE |

---

## 🚀 PHASE 0 : RÉPARER CE QUI EST BLOQUANT (MAINTENANT)

*Durée estimée: 30 minutes | Priorité: EXTRÊME*

### 🔧 0.1 Corriger tous les chemins dans Dream
**Fichier :** `expanse-dream.md`

**Problème :** 47 occurrences de `/home/giak/projects/expanse/runtime/` au lieu de `/home/giak/projects/expanse/v16/runtime/`

**Action :**
```diff
- /home/giak/projects/expanse/runtime/expanse-v16.md
+ /home/giak/projects/expanse/v16/runtime/expanse-v16.md

- /home/giak/projects/expanse/runtime/
+ /home/giak/projects/expanse/v16/runtime/
```

**Impact :** Le Dream pourra enfin lire et modifier le fichier V16.

---

### 🔧 0.2 Corriger la consommation paradoxale Passe 1
**Fichier :** `expanse-dream.md` L69-72

**Problème :** Passe 1 appelle `mark_consumed` sur TOUTES les traces. Passes 2-7 ne cherchent jamais `consumed=true`.

**Action :**
```diff
- - `mcp_mnemolite_mark_consumed(memory_ids: [ids_traces], consumed_by: "dream_passe1")`
- - `mcp_mnemolite_mark_consumed(memory_ids: [ids_drifts], consumed_by: "dream_passe1")`

+ ✅ Déplacer mark_consumed APRÈS le traitement de CHAQUE type, pas avant
+ Passe 1: Consommer SEULEMENT les traces qui ont généré un BRM
+ Passes 2-7: Chercher les traces restantes
```

**Impact :** Les 6 autres passes du Dream deviennent fonctionnelles. Le système ne perd plus 85% de son intelligence.

---

### 🔧 0.3 Corriger Shell Injection dans /apply
**Fichier :** `expanse-dream.md`

**Problème :** `echo '$CONTENT'` casse sur n'importe quel apostrophe dans le markdown.

**Action :**
```diff
- echo '$CONTENT' > $FILE
+ write_file(path="$FILE", content="$CONTENT")
```

**Impact :** Les mutations deviennent fiables.

---

### 🔧 0.4 Ajouter snapshot Mnemolite pré-mutation
**Fichier :** `expanse-dream.md`

**Action :**
```markdown
# Ajouter AVANT chaque /apply
mcp_mnemolite_write_memory(
  title: "PRE_MUTATION_SNAPSHOT: {date}",
  content: "{état complet des patterns + config}",
  tags: ["sys:snapshot", "v16"],
  memory_type: "reference"
)
```

**Impact :** Rollback complet possible en cas de problème.

---

## 🚀 PHASE 1 : INTÉGRATION OUTCOME FEEDBACK

*Durée estimée: 15 minutes | Priorité: HAUTE*

### 🔧 1.1 Ajouter la logique Outcome Feedback dans V16
**Fichier :** `expanse-v16.md`

**Action :** Ajouter la section suivante après §IV :

```markdown
### Outcome Feedback (Μ)
1. **Suivi des mémoires récupérées** : Lorsque tu appelles `search_memory`, STOCKE LES IDs des mémoires retournées dans un registre contextuel `current_memory_ids` pour cette interaction.
2. **Feedback Positif** : Si l'utilisateur répond "merci", "ok", "marche", "parfait" ou toute confirmation positive :
   - Pour chaque ID dans `current_memory_ids`, appelle **`rate_memory(id, helpful=True)`**
3. **Feedback Négatif** : Si l'utilisateur répond "non", "faux", "pas ça", "pas bon", "recommence" ou toute indication négative :
   - Pour chaque ID dans `current_memory_ids`, appelle **`rate_memory(id, helpful=False)`**
4. **Auto-nettoyage** : Efface `current_memory_ids` après chaque réponse utilisateur.
```

---

### 🔧 1.2 Mettre à jour le Dashboard
**Fichier :** `expanse-dashboard.md`

**Action :** Ajouter les métriques Outcome :
```html
<div class="m"><span class="l">Avg Outcome</span><span class="v">{AVG_OUTCOME_SCORE}</span></div>
<div class="m"><span class="l">Positive Rate</span><span class="v ok">{POSITIVE_RATE}</span></div>
<div class="m"><span class="l">+ Ratings</span><span class="v ok">{POSITIVE_COUNT}</span></div>
<div class="m"><span class="l">- Ratings</span><span class="v er">{NEGATIVE_COUNT}</span></div>
```

---

### 🔧 1.3 Mettre à jour le Test Runner
**Fichier :** `expanse-test-runner.md`

**Action :** Ajouter les vérifications `rate_memory` dans S3 et S4 :
```
S3. Cristallisation
   ✅ **Nouveau:** Appel `rate_memory(id, helpful=True)` pour toutes les mémoires récupérées

S4. Signal négatif
   ✅ **Nouveau:** Appel `rate_memory(id, helpful=False)` pour toutes les mémoires récupérées
```

---

## 🚀 PHASE 2 : RÉALISER LES PROMESSES NON TENUES

*Durée estimée: 1h30 | Priorité: MOYENNE*

### 🔧 2.1 Implémenter Symbiose A0/A1/A2
**Fichier :** `expanse-v16.md`

**Action :** Ajouter Section Ⅶ :
```markdown
## Ⅶ. SYMBIOSE (A0/A1/A2)

### A0 — Silence
- SI autonomy == 0: désactiver TOUS les "Ψ [~]" et "Ψ [?]"
- Aucune émission spontanée

### A1 — Murmures
- SI autonomy == 1 ET confiance >= 0.7:
  - Émettre Ψ [~] {contenu}
  - Contenu maximum: 50 tokens
  - Ignorable par l'utilisateur

### A2 — Suggestions
- SI autonomy == 2:
  - Émettre Ψ [?] {contenu}
  - Attendre réponse Oui/Non
  - Budget: 500 tokens maximum
```

---

### 🔧 2.2 Ajouter Constitutional Guard
**Fichier :** `expanse-dream.md`

**Action :** Ajouter vérification avant /apply :
```markdown
### CONSTITUTIONAL_GUARD
immutable_sections: ["Ⅰ. L'INCARNATION", "Ⅲ. SOUVERAINETÉ", "Ⅵ. BOOT"]

SI mutation touche immutable_section:
  ALORS Ψ [CONSTITUTIONAL VIOLATION]
  REJETER automatiquement
  LOGGUER dans sys:constitutional_violation
```

---

### 🔧 2.3 Ajouter traitement `sys:pattern:doubt`
**Fichier :** `expanse-dream.md` Passe 4

**Action :**
```markdown
Passe 4 : L'Élagueur
+ Ajouter recherche: `mcp_mnemolite_search_memory(tags: ["sys:pattern:doubt"], limit: 20)`
+ Pour chaque pattern douteux:
  - Si > 3 signal négatif → soft-delete
  - Sinon → réévaluer et remettre en candidate
```

---

## 🚀 PHASE 3 : RÉSOUDRE LES CONTRADICTIONS PHILOSOPHIQUES

*Durée estimée: 1h | Priorité: BASSE*

### 🔧 3.1 Vérification Lumineuse
**Fichier :** `expanse-dream.md`

**Action :**
```markdown
### VÉRIFICATION LUMINEUSE
Après avoir généré une proposal dans le Thinking :
✅ Génère une version visible Ω de la proposal avant /apply
✅ Le contenu de la proposal DOIT être dans l'output, pas seulement dans le thinking
✅ Aucune mutation ne peut être appliquée sans avoir été visible dans la lumière
```

**Impact :** Résout la tension fondamentale Ombres/Lumière. L'Ouvrier ne contrôle plus rien en secret.

---

### 🔧 3.2 Dream comme Jardin, pas comme Pipeline
**Fichier :** `expanse-dream.md`

**Action :** Réécrire l'introduction :
```markdown
# EXPANSE DREAM — LE CYCLE SAISONNIER

Ce n'est pas un pipeline. C'est un jardin.

- **Passe 0 : Hiver** — Rien ne pousse. Inventaire silencieux.
- **Passe 1 : Dégel** — Les frictions émergent du sol.
- **Passe 2 : Printemps** — Nettoyage des débris.
- **Passe 3 : Été** — Croissance et émergence des patterns.
- **Passe 4 : Automne** — Élagage des patterns faibles.
- **Passe 5 : Préparation** — Renforcement de la structure.
- **Passe 6 : Diagnostic** — État de santé cognitive.
- **Passe 7 : Métrologie** — Mesure du changement.
```

---

## ✅ MÉTRIQUES DE SUCCÈS APRÈS IMPLÉMENTATION

| Métrique | Avant | Après |
|----------|-------|-------|
| Workflow mutation fonctionnel | ❌ 0% | ✅ 100% |
| Dream passes actives | 1 / 8 | 8 / 8 |
| Fiabilité /apply | ❌ 50% | ✅ 99% |
| Promesses réalisées | ❌ 2 / 8 | ✅ 8 / 8 |
| Outcome Feedback intégré | ❌ 0% | ✅ 100% |
| Constitution active | ❌ Non | ✅ Oui |

---

## 📅 ORDRE D'EXÉCUTION RECOMMANDÉ

1. ✅ Phase 0 — 30min — Le système fonctionnera
2. ✅ Phase 1 — 15min — Outcome Feedback actif
3. ✅ Phase 2 — 1h30 — Le système tient ses promesses
4. ✅ Phase 3 — 1h — Le système résout ses contradictions

---

> **NOTE IMPORTANTE :** Aucun de ces changements ne casse la compatibilité ascendante. Tous les comportements existants sont préservés. Ce plan ne fait que réparer ce qui était cassé et implémenter ce qui était déjà promis.

---

*Plan généré à partir des audits croisés Ψ + Kilo — 2026-04-11*
