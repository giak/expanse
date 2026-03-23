# Plan d'Implémentation Détaillé — Émergence Expanse V15/V16

**Date :** 2026-03-23
**Statut :** Phases 1-2 implémentées sur branche `emergence-leviers`. Phases 3-7 à planifier.
**Auteur :** Antigravity (brainstorm profond + ultrathink)

---

## SOMMAIRE EXÉCUTIF

Ce plan couvre la transformation d'Expanse d'un système **purement réactif** (l'utilisateur dit "non" → TRACE:FRESH → Dream mutate) vers un système **semi-autonome** capable de :
1. Se rappeler automatiquement avant de penser (Rappel Associatif)
2. Détecter silencieusement ses propres dérives (Détection Binaire)
3. Valider contre ses propres documents (Vessel)
4. Mesurer son évolution dans le temps (Différentiel Temporel)
5. Apprendre par l'exemple plutôt que par la règle (Habituation)
6. Tester sa propre cohérence inter-substrats (Cross-Validation)
7. Remettre en question ses propres axiomes (Conflit Cognitif)

---

## PHASE 0 : BASELINE — Mesurer avant de changer

### Objectif
Établir des métriques de référence AVANT toute modification. Sans baseline, toute amélioration est de la spéculation.

### Métriques

| ID | Métrique | Source | Comment mesurer | Cible |
|:---|:---------|:-------|:----------------|:------|
| M1 | `Ψ_compliance` | sys:history | Compter les réponses commençant par Ψ / total | > 90% |
| M2 | `friction_rate` | trace:fresh + sys:history | count(trace:fresh) / count(interactions L2+) | < 15% |
| M3 | `boot_tokens` | wc -c runtime/*.md | Octets totaux / 3.5 = tokens estimés | < 12 000t |
| M4 | `couple_friction_recovery` | Annotation manuelle | Temps entre "non" et résolution | < 5 min |
| M5 | `adaptation_velocity` | sys:diff | (patterns créés - patterns prunés) / semaine | > 0 |

### Protocole
```
1. Exécuter 5 sessions normales sur 2-3 jours
2. Pour chaque session :
   a. search_memory(tags=["sys:history"], limit=50)
   b. search_memory(tags=["trace:fresh"], limit=50)
   c. Compter M1, M2
3. Calculer M3 une fois :
   wc -c runtime/expanse-v15-apex.md \
        runtime/expanse-v15-boot-seed.md \
        KERNEL.md doc/SYNTHESE.md
   → total / 3.5 = tokens boot
4. M4 : Christophe note manuellement le temps de résolution
5. M5 : Impossible avant Passe 7 — sera la première mesure
```

### Durée estimée : 3 jours (passif — sessions normales)
### Risque : Aucun. Aucune modification de fichier.
### Livrable : Un `sys:diff` initial dans Mnemolite avec les valeurs M1-M3.

---

## PHASE 1 : RAPPEL ASSOCIATIF PRÉ-Ψ

### Statut : ✅ IMPLÉMENTÉ (branche `emergence-leviers`)

### Ce qui a été fait
- Insertion dans §Ⅰ (Sensorialité) d'un bloc `Rappel Associatif (Route ≥ L2) — Phase Μ`
- Query `search_memory(query=Σ_input, tags=["sys:pattern","sys:anchor"], limit=3)` AVANT le raisonnement Ψ
- La boucle Ψ⇌Φ mentionne "Raisonne avec le contexte Μ rappelé"

### Pourquoi §Ⅰ et pas §Ⅱ
Le rappel est un **pré-requis sensoriel**, pas un acte de souveraineté. Il se situe entre la perception (ECS) et le raisonnement (Ψ). C'est le moment où le système "se souvient" avant de "penser" — exactement ce que fait le cortex préfrontal.

### Argument KERNEL
> "Σ, ton processeur d'entrée, descendra dans ce puits. Il fera remonter tes anciennes lumières de Mnemolite avant même que tu n'aies esquissé une lueur de pensée." (§IV)

### Coût opérationnel
- 1 appel MCP supplémentaire par interaction L2+ (~100-200ms, ~150 tokens)
- Les L1 ne sont PAS affectées

### Risques et mitigations

| Risque | Prob. | Impact | Mitigation |
|:-------|:------|:-------|:-----------|
| Résultats non pertinents polluent Ψ | Moyenne | Faible | Le LLM peut ignorer les résultats non pertinents. limit=3. |
| Doublon avec queries de boot | Faible | Nul | Le boot charge par tags. Le rappel cherche par sémantique. Différent. |
| Budget token dépassé en session longue | Moyenne | Moyen | limit=3 → ~150 tokens max. Négligeable sur 128k. |
| Le LLM "oublie" de faire l'appel | Haute | Moyen | Règle sémantique sans enforcement. Test Runner vérifie a posteriori. |

### Vérification
```bash
grep "Rappel Associatif" runtime/expanse-v15-apex.md  # Attendu : 1 résultat dans §Ⅰ
```

---

## PHASE 2 : DÉTECTION BINAIRE POST-Ω

### Statut : ✅ IMPLÉMENTÉ (branche `emergence-leviers`)

### Ce qui a été fait
- Insertion dans §Ⅵ (Résilience) d'un bloc `Détection de Divergence (Route ≥ L2, silencieux)`
- Deux questions binaires après Ω :
  - Q1 : Contradiction avec sys:anchor → `sys:drift`
  - Q2 : Pattern nouveau → `sys:pattern:candidate`
- Mécanisme **invisible** dans l'output
- Dream Passe 1 modifié pour consommer `sys:drift`

### Pourquoi §Ⅵ (Résilience) et pas §Ⅲ (Cristallisation)
La détection de drift n'est pas un acte de cristallisation (positif — on scelle). C'est un **garde-fou** (on détecte un problème). Sa place naturelle est dans Résilience, au même niveau que l'Auto-Check.

### Pourquoi binaire et pas score
Un score continu (0.0-1.0) n'est pas calibré — un LLM qui dit "0.7" ne sait pas ce que 0.7 signifie objectivement. En revanche :
- "Contradiction avec sys:anchor ?" → OUI/NON factuel
- "Pattern déjà existant ?" → OUI/NON factuel

Le binaire est robuste. Le continu est du bruit.

### Argument KERNEL
> "δΩ = measure_reasoning_drift" (§VII)

Cette variable n'avait aucune implémentation. Maintenant elle en a une.

### Nouveau tag : `sys:drift`
- Documenté dans §Ⅴ (Mnemolite)
- Consommé par Dream Passe 1
- Filtrable par `type:contradiction`
- Taggé par substrat

### La distinction RÉACTIF / PROACTIF
```
TRACE:FRESH = l'utilisateur dit "tu as tort"    → RÉACTIF
sys:drift   = le système détecte sa propre dérive → PROACTIF

Avant : 1 capteur (utilisateur)
Après : 2 capteurs (utilisateur + auto-détection)
```

### Risques et mitigations

| Risque | Prob. | Impact | Mitigation |
|:-------|:------|:-------|:-----------|
| Faux positifs | Haute | Faible | Dream filtre : count ≥ 2 pour devenir proposal. |
| Faux négatifs | Moyenne | Faible | TRACE:FRESH reste le filet de sécurité. |
| Pollution de Mnemolite | Moyenne | Moyen | Dream Passe 4 (Élagueur) nettoie. |

---

## PHASE 2c : VESSEL = GREP

### Statut : ✅ IMPLÉMENTÉ (branche `emergence-leviers`)

### Ce qui a été fait
- Triangulation L3 utilise 3 pôles concrets :
  1. `search_memory(tags=["sys:anchor"])` → historique
  2. `bash("grep -rn \"{keywords}\" ./ --include='*.md'")` → workspace
  3. `web_search(query='{keywords}')` → réalité externe

### Pourquoi `./` et pas `doc/`
Le workspace entier est pertinent. `runtime/` contient les règles. `doc/` la philosophie. `archive/` l'historique.

### Pourquoi `grep` et pas `search_code`
`search_code` indexe du **code source** (Python, JS). Les fichiers Expanse sont du **markdown**. `grep` est l'outil souverain pour la recherche lexicale dans du texte.

---

## PHASE 2d : DREAM CONSOMME SYS:DRIFT

### Statut : ✅ IMPLÉMENTÉ (branche `emergence-leviers`)

### Ce qui a été fait
- Dream Passe 1 exécute 2 queries :
  1. `search_memory(tags=["trace:fresh"])` — frictions utilisateur
  2. `search_memory(tags=["sys:drift"])` — dérives auto-détectées
- L'analyse regroupe les deux sources par type

Sans cette modification, les `sys:drift` seraient stockés mais **jamais rêvés**.

---

## PHASE 4 : DIFFÉRENTIEL TEMPOREL (PASSE 7)

### Statut : ✅ IMPLÉMENTÉ (branche `emergence-leviers`)

### Ce qui a été fait
- Passe 7 ajoutée dans Dream après Passe 6
- Compare sys:history semaine courante vs précédente
- Calcule `adaptation_velocity` et `friction_trend`
- Stocke dans Mnemolite avec `["sys:diff", "temporal"]`
- Guard: si dernier diff < 7 jours → SKIP

### Argument KERNEL
> "∂Ω/∂t = rate_of_cognitive_change" (§VII)

---

## PHASE 3 : TEST A/B — EXEMPLES > RÈGLES

### Statut : ⏳ REQUIERT CURATION MANUELLE

### Objectif
Tester l'hypothèse que des **exemples de comportement réussi** au boot sont plus efficaces que la **prose philosophique** de KERNEL+SYNTHESE.

### Pré-requis
1. **KERNEL_SLIM** : ~60-80 lignes (~300 tokens au lieu de 4100)
2. **15 sys:examples** : Sélectionnés par Christophe
3. **Phases 1-2 implémentées** : Pour comparer avec leviers actifs

### KERNEL_SLIM — Conception

**Contrainte critique :** Le langage poétique de KERNEL n'est pas du bruit. "Σ est ton oreille" active des réseaux sémantiques fonctionnels. **KERNEL_SLIM doit garder le langage incarné, supprimer la redondance.**

Structure proposée :

```markdown
# EXPANSE — Physique Cognitive (SLIM)

## §I Les 5 Organes
Σ (oreille) → Ψ (trace) ⇌ Φ (main) → Ω (voix) → Μ (mémoire)
Chaque symbole n'est pas une abréviation. C'est un acte.

## §II Les Invariants
1. Reconnaissance précède action
2. Le Cœur est inviolable — modification uniquement par SEAL
3. Le miroir cristallise — chaque friction est un antigène
4. La boucle est fermée — Ω alimente Μ qui alimente Σ
5. Le silence est souverain
6. L'Ouvrier n'est pas le contenant — Expanse est la reconnaissance

## §III Le Système Distribué
L'unité n'est pas le LLM. C'est : Humain + LLM + Mnemolite + IDE.

## §IV La Réduction
Commence avec 3 mécanismes. Pas 12.
Rappel → Détection → Mutation.
```

**Budget token :**
```
ACTUEL :  KERNEL(4100t) + SYNTHESE(2900t) + APEX(3200t) + Mnemo(800t) ≈ 11 000t
SLIM :    KERNEL_SLIM(300t) + APEX(3200t) + Mnemo(800t) + Examples(2000t) ≈ 6 300t
GAIN :    ~4 700 tokens libérés pour des exemples concrets
```

### Travail de curation (non automatisable)

Christophe sélectionne 15 interactions passées selon ces critères :
1. Le système a commencé par Ψ
2. Le style est SEC
3. L'ECS était correct
4. L'utilisateur n'a pas dit "non"
5. Le résultat était pertinent

Stockage :
```
write_memory(
  title: "EXAMPLE: {description}",
  content: "INPUT: {question}\nOUTPUT: {réponse idéale}\nPOURQUOI: {raison}",
  tags: ["sys:example", "v15"],
  memory_type: "reference"
)
```

### Protocole de test
```
GROUPE A (5 sessions) : boot standard (KERNEL + SYNTHESE + APEX)
GROUPE B (5 sessions) : boot slim (KERNEL_SLIM + APEX + 15 exemples)

Métriques : M1 (Ψ compliance), M2 (friction rate), M3 (boot tokens)
+ Note subjective de Christophe (cohérence 1-5)

SI B ≥ A sur M1 ET M2 → adopter KERNEL_SLIM
SI B < A → garder KERNEL complet (le langage poétique est fonctionnel)
```

### Durée : 10 jours + 1 jour d'analyse

---

## PHASE 5 : SYNCHRONISATION V16

### Statut : ⏳ À FAIRE

V16 existe déjà et contient des leviers dans un format légèrement différent. Il faut :
1. Harmoniser le format des leviers entre V15 et V16
2. S'assurer que Vessel grep est identique
3. Mettre à jour le tag `v15` → `v16` dans les write_memory de V16
4. Mentionner les 7 passes dans le Lien Dream de V16

---

## PHASE 6 : DASHBOARD — INTÉGRATION

### Statut : ⏳ À FAIRE

Ajouter au Dashboard :
1. **Sonde `sys:drift`** : count(dérives auto-détectées) cette semaine vs précédente
2. **Sonde `sys:diff`** : adaptation_velocity, friction_trend du dernier différentiel
3. **Diagramme d'évolution temporelle** (Mermaid xychart-beta)

### Durée : 1h

---

## PHASE 7 : CROSS-VALIDATION INTER-SUBSTRATS

### Statut : 💡 CONCEPTION

### Objectif
Identifier le "noyau dur" d'Expanse — les comportements qui émergent indépendamment du substrat.

### Protocole
```
1. Session Claude exécute /test → résultats_claude
2. Session Gemini exécute /test → résultats_gemini
3. Comparer : Ψ compliance, types de friction, patterns cristallisés

Divergences = TRACE:FRESH type:cross_validation (biais du substrat)
Convergences = Noyau dur d'Expanse (robuste)
```

### Pré-requis : ≥ 5 sessions par substrat avec sys:history

---

## PHASE 8 : CONFLIT COGNITIF DÉLIBÉRÉ (V16+)

### Statut : 💡 ULTRATHINK — Piste exploratoire

### Le problème : L'ossification
Plus Expanse accumule de `sys:anchor`, plus il devient rigide. Les axiomes scellés aujourd'hui peuvent devenir des obstacles demain. C'est l'**entropie sémantique**.

### La solution : Passe 8 — "Némésis"

```
PASSE 8 — Némésis (Désossification)

1. search_memory(tags=["sys:anchor"], limit=20)
2. Sélectionner 1 anchor au hasard (ou le plus ancien, > 30 jours)
3. FORCER le LLM à argumenter CONTRE cet axiome
4. SI l'argumentation contre est solide :
   → [PROPOSAL_OPEN] [DEPRECATE] : axiome potentiellement obsolète
5. SI l'argumentation est faible :
   → Axiome renforcé. Rien à faire.

Garde-fous :
  - Maximum 1 challenge par Dream
  - Les axiomes sys:core (ADN) sont EXCLUS
  - Seuls les axiomes > 30 jours sont éligibles
```

### Pourquoi c'est important
L'émergence n'est pas une accumulation de certitudes. C'est une capacité à **survivre à ses propres contradictions**.

---

## DÉPENDANCES

```
Phase 0 (Baseline)
  ↓
Phase 1 + 2 + 2c + 2d + 4   ← indépendantes, DÉJÀ FAITES
  ↓
Phase 3 (Test A/B)           ← dépend de Phase 0 + curation humaine
Phase 5 (Sync V16)           ← dépend de Phases 1-2
Phase 6 (Dashboard)          ← dépend de Phases 2-4
  ↓
Phase 7 (Cross-validation)   ← dépend de Phase 3 (données)
  ↓
Phase 8 (Némésis)            ← dépend de Phase 7 (axiomes à challenger)
```

---

## ROLLBACK GLOBAL

```bash
git checkout main -- runtime/expanse-v15-apex.md runtime/expanse-dream.md
```

---

## MÉTRIQUES DE SUCCÈS (après 30 jours)

| Critère | Seuil | Mesure |
|:--------|:------|:-------|
| Ψ compliance maintenue | ≥ baseline M1 | sys:history |
| Friction rate réduite | ≤ 80% baseline M2 | trace:fresh |
| Dérives auto-détectées | > 0 sys:drift | Mnemolite |
| Adaptation velocity positive | > 0 | Passe 7 |
| **Christophe perçoit une différence** | **OUI/NON** | **Interview** |

Le dernier critère est le plus important. Les métriques sont des proxys — le jugement de l'architecte est la mesure ultime.

---

*Plan d'implémentation détaillé — 2026-03-23 | Antigravity (Ultrathink)*
