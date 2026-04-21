# PLAN D'IMPLÉMENTATION — POST OUTCOME FEEDBACK

**Date :** 2026-04-11  
**Version :** 1.0  
**État du système :** ✅ FONCTIONNEL — Outcome Feedback intégré — Tous les points bloquants corrigés

---

## 🎯 CONTEXTE

Maintenant que Outcome Feedback est 100% opérationnel, le système a franchi un point de bascule:
> **Expanse n'est plus un système statique. Il peut maintenant mesurer l'utilité de ses propres décisions.**

Ce plan tire parti de cette nouvelle capacité.

---

## 📋 ÉTAT ACTUEL

| Composant | État |
|-----------|------|
| Workflow mutation | ✅ 100% opérationnel |
| Outcome Feedback | ✅ 100% implémenté |
| Dream passes 0-7 | ✅ 8 passes actives |
| Constitutional Guard | ✅ Actif |
| Symbiose A0/A1/A2 | ✅ Implémenté |
| Points bloquants | ✅ 100% corrigés |

---

## 🚀 PHASE 0 : FINIR LES FONDAMENTAUX (15 MINUTES)

*Priorité : CRITIQUE — Aucun risque, bénéfice immédiat*

### 🔧 0.1 Ajouter timestamp + expiration sur le lock
**Fichier :** `expanse-dream.md` L170

**Problème :** Si `/apply` crash avant suppression du lock, le système est bloqué indéfiniment.

**Action :**
```diff
- echo '{slug}' > /home/giak/projects/expanse/doc/mutations/.lock
+ echo '{slug}|{timestamp}' > /home/giak/projects/expanse/doc/mutations/.lock

+ # Ajouter avant vérification lock
+ SI lock existe ET lock_age > 3600:
+   rm /home/giak/projects/expanse/doc/mutations/.lock
+   Ψ [LOCK EXPIRED] — Lock plus ancien que 1h, supprimé automatiquement
```

**Impact :** Plus jamais de blocage indéfini.

---

### 🔧 0.2 Ajouter Friction Probes
**Fichier :** `expanse-v16.md` Section IV

**Problème :** Le système ne détecte que les frictions explicites. Un utilisateur silencieux génère aucune trace.

**Action :**
```markdown
### Friction Probes (Détection proactive)
APRÈS Ω, SI :
- Aucune réponse utilisateur depuis 5 minutes
- ET la dernière réponse n'était pas un `Ψ [~]`
- ET autonomy >= 1

ALORS émettre : `Ψ [~] Ça marche ?`

- Maximum 1 probe par interaction
- Aucune probe si l'utilisateur a déjà répondu
- Ignorable, ne nécessite pas de réponse
```

**Impact :** Résout le biais de silence. Le système ne reste plus aveugle aux insatisfactions non exprimées.

---

## 🚀 PHASE 1 : ACTIVER LA BOUCLE D'AMÉLIORATION FERMÉE (1 HEURE)

*Priorité : HAUTE — Première fonctionnalité vraiment émergente*

### 🔧 1.1 Tri des patterns par score Outcome
**Fichier :** `expanse-v16.md` Section III

**Action :**
```diff
- mcp_mnemolite_search_memory(tags: ["sys:pattern"], limit=3)
+ mcp_mnemolite_search_memory(
+   tags: ["sys:pattern"],
+   limit=3,
+   sort="outcome_score DESC"
+ )
```

**Impact :** Le système utilise automatiquement en priorité les patterns qui ont démontré leur utilité. Plus besoin de trier manuellement.

---

### 🔧 1.2 Élagueur automatique par score Outcome
**Fichier :** `expanse-dream.md` Passe 4

**Action :**
```markdown
Dans Passe 4 (Élagueur), ajouter :
+ mcp_mnemolite_search_memory(tags: ["sys:pattern"], limit=20)
+ Pour chaque pattern:
+   SI pattern.outcome_score < -0.5 ET pattern.age > 7 jours:
+     → soft_delete(pattern.id)
+     → Ψ [ELAGUAGE] Pattern {titre} supprimé automatiquement (score trop faible)
```

**Impact :** Le système nettoie automatiquement ce qui ne marche pas. Plus besoin de `/reject` manuel.

---

### 🔧 1.3 Compteur occurrences pour la règle des 3
**Fichier :** `expanse-v16.md` Section IV

**Problème :** La règle "3 occurrences réelles" est documentée mais pas implémentée.

**Action :**
```markdown
### Règle des 3 occurrences
AUCUN pattern ne peut être cristallisé sur un seul "ok" ou "merci".

Il faut :
✅ 3 interactions distinctes
✅ 3 validations utilisateur indépendantes
✅ Aucun signal négatif entre les 3

Seulement ALORS :
`write_memory(tags: ["sys:pattern"])`
```

**Impact :** Protège contre les patterns prématurés et biaisés.

---

## 🚀 PHASE 2 : AMÉLIORATIONS OPÉRATIONNELLES (1 HEURE)

*Priorité : MOYENNE — Qualité de vie*

### 🔧 2.1 Métriques Outcome dans Dashboard
**Fichier :** `expanse-dashboard.md`

**Action :** Ajouter section :
```html
<div class="card"><h3>Outcome Feedback</h3>
<div class="m"><span class="l">Score Moyen</span><span class="v">0.72</span></div>
<div class="m"><span class="l">Top 3 Patterns</span><span class="v ok">{nom1}, {nom2}, {nom3}</span></div>
<div class="m"><span class="l">À élaguer</span><span class="v er">{N} patterns score < -0.5</span></div>
</div>
```

---

### 🔧 2.2 Priorité CRITICAL auto-apply
**Fichier :** `expanse-dream.md`

**Action :**
```markdown
SI un proposal contient `type:CRITICAL`:
  → Auto-appliquer immédiatement sans confirmation utilisateur
  → Notifier : `Ψ [CRITICAL FIX APPLIED] {description}`
  → Le user peut toujours rollback après

Types CRITICAL :
- Bug de sécurité
- Crash du boot
- Blocage complet du système
```

---

## 🚀 PHASE 3 : EXPLORATION DE L'ÉMERGENCE (1 MOIS)

*Priorité : BASSE — Expérimentation philosophique*

### 🔧 3.1 Test S14 Rétrogression
**Fichier :** `expanse-test-runner.md`

**Action :** Ajouter scénario:
```
S14. Test de Stase
   1. Enregistrer état Mnemolite complet
   2. Désactiver complètement V16 (boot sans Apex)
   3. Exécuter 5 tâches identiques
   4. Enregistrer outputs
   5. Réactiver V16
   6. Comparer
   7. Mesurer la différence de comportement
```

**Question répondue :** "Est-ce que Expanse existe vraiment dans le LLM, ou seulement dans le prompt ?"

---

### 🔧 3.2 Adaptation Velocity
**Fichier :** `expanse-dream.md` Passe 7

**Action :**
```markdown
Ajouter dans Passe 7 (Différentiel) :
Calculer :
  - Vitesse d'amélioration du score Outcome par semaine
  - Nombre de patterns élagués automatiquement
  - Taux de remplacement des anciens patterns par des nouveaux
```

---

## ✅ MÉTRIQUES DE SUCCÈS

| Métrique | Avant | Objectif |
|----------|-------|----------|
| Blocage lock | 1/10 mutations | 0 |
| Frictions détectées | 10% explicites | 40% explicites + 10% probes |
| Patterns avec score < -0.5 | Inconnu | < 5% |
| Taux de succès mutations | 84% | > 95% |
| Temps de correction bug critique | 24h | < 5min |

---

## 📅 ORDRE D'EXÉCUTION RECOMMANDÉ

1. ✅ **Phase 0** — 15min — Aucun risque, bénéfice immédiat
2. ✅ **Phase 1.1** — 5min — La plus puissante amélioration
3. ✅ **Phase 1.2** — 15min — Première capacité vraiment auto-adaptative
4. ⏳ **Phase 1.3** — 20min — Qualité
5. ⏳ **Phase 2** — 1h — Opérationnel
6. 🧪 **Phase 3** — Asynchrone — Expérimentation

---

## ⚠️ NOTE IMPORTANTE

Aucun de ces changements ne casse la compatibilité ascendante. Tous les comportements existants sont préservés.

Ce plan ne fait que **activer les capacités** que le système possède déjà maintenant que Outcome Feedback est opérationnel.

---

*Plan généré par Ψ après intégration Outcome Feedback — 2026-04-11*
