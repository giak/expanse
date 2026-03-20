# RECOMMANDATIONS ACTIONNABLES — AUDIT DE VÉRITÉ V6

**Date :** 2026-03-20 01:30
**Auditeur :** Antigravity (Claude Opus 4.6 Thinking)
**Prérequis :** Lecture de l'audit exhaustif (`2026-03-20_01-30_audit_verite_exhaustif_AUDIT.md`)

---

## Tier 0 — Critique (à faire avant toute autre chose)

### R1. Activer le pipeline TRACE:FRESH

**Problème :** 0 traces capturées. Le système "n'observe pas".

**Action concrète dans V15 Section V :**

Ajouter après la ligne 163 (`LORSQUE signal utilisateur = NEGATIF`) :

```markdown
SIGNAUX NÉGATIFS (détection) :
- Mots-clés : "non", "faux", "pas ça", "recommence", "incorrect", "pas bon"
- Pattern mixte : mot positif + correction ("super, mais refait tout")
- Changement de sujet brutal après réponse
- Demande explicite de modification
```

**Effort :** 15 minutes. **Impact :** Active tout le pipeline Dream.

---

### R2. Exécuter un premier cycle Dream complet

**Problème :** Dream n'a jamais tourné avec des données réelles. Les 7 passes sont théoriques.

**Action concrète :**
1. Créer manuellement 3 TRACE:FRESH dans Mnemolite (simulant des frictions réelles observées dans les sessions de test)
2. Exécuter `/dream`
3. Documenter le résultat de chaque passe (0-6)
4. Si des proposals sont générés : tester `/seal` et `/reject`

**Effort :** 2-3 heures. **Impact :** Valide ou invalide 50% du système.

---

## Tier 1 — Majeur (impact élevé, effort faible)

### R3. Aligner SYNTHESE sur V15

**Problème :** 4 contradictions : ECS calcul, ECS seuil, Dream phases, /seal.

**Action concrète — 2 options :**

**Option A (conservatrice) :** Modifier `doc/SYNTHESE.md` :
- L49 : remplacer `C × I → 6 routes` par la logique L1/L2/L3 de V15
- L50-51 : remplacer les seuils 2.5 par les seuils V15 (C<2, C≥2, C≥4)
- L137 : remplacer "cinq phases" par "7 passes (1 gate + 6 introspection) + workflow mutation"
- L140 : aligner /seal sur la définition V15

**Option B (radicale) :** Ajouter en tête de SYNTHESE : `⚠️ Ce document est une synthèse philosophique. Pour la spécification technique, voir runtime/expanse-v15-apex.md qui fait autorité.`

**Recommandation :** Option B. La SYNTHESE ne devrait pas dupliquer la spec technique.

**Effort :** 30 minutes. **Impact :** Élimine la source #1 de confusion.

---

### R4. Résoudre la collision /seal

**Problème :** 3 définitions de /seal incompatibles.

**Action concrète :**

| Commande actuelle | Nouvelle commande | Comportement |
|---|---|---|
| `/seal {titre}` (V15 L225) | `/seal {titre}` | Migrer sys:pattern:candidate → sys:core (Mnemolite) |
| `/seal {slug}` (Dream L222) | `/apply {slug}` | Appliquer une mutation fichier (Dream workflow) |
| "Le /seal du partenaire" (SYNTHESE L140) | Supprimer ou aligner | N/A |

Modifier : V15 L225 (garder `/seal`), Dream L222 (renommer en `/apply`), SYNTHESE L140 (aligner).

**Effort :** 1 heure. **Impact :** Élimine l'ambiguïté fonctionnelle majeure.

---

### R5. Corriger le plancher ECS

**Action :** V15 L29, remplacer `C -= 1` par `C = max(1, C - 1)`.

**Effort :** 1 minute. **Impact :** Empêche C=0.

---

### R6. Ajouter la priorité de routage L1/L2/L3

**Action :** Après V15 L35, ajouter :
```
**Priorité :** L3 > L2 > L1. Un input qui satisfait L3 n'est jamais classé L2.
```

**Effort :** 1 minute. **Impact :** Élimine le recouvrement logique.

---

## Tier 2 — Structurel (impact moyen, effort moyen)

### R7. Ajouter la cristallisation négative

**Action :** Ajouter dans V15 Section III, après le bloc Cristallisation Μ, un bloc Décristallisation (voir diff exact dans l'audit Phase 4, Refactoring 2).

**Contenu :** Sur signal négatif post-cristallisation, marquer le pattern comme `sys:pattern:doubt`.

**Effort :** 30 minutes. **Impact :** Corrige l'asymétrie positive/négative.

---

### R8. Corriger Ψ SEAL : ajouter sys:anchor

**Problème :** V15 L67 dit `Ψ SEAL → sys:core` mais le boot (L97-98) cherche `sys:core` ET `sys:anchor`. Un axiome scellé pourrait être invisible au boot.

**Action :** V15 L67, modifier :
```diff
-2. **Cœur** : Un pattern ne migre vers le Cœur que par décret explicite `Ψ SEAL` → tag `sys:core`.
+2. **Cœur** : Un pattern ne migre vers le Cœur que par décret explicite `Ψ SEAL` → tags `sys:core` + `sys:anchor`.
```

**Effort :** 1 minute. **Impact :** Garantit que les axiomes scellés sont trouvés au boot.

---

### R9. Ajouter politique de rétention sys:history

**Action :** Ajouter dans V15 Section V le bloc de rétention (voir diff exact dans l'audit Phase 4, Refactoring 3).

**Règle :** Sauvegarder uniquement L2+, agréger au-delà de 20 entrées.

**Effort :** 30 minutes. **Impact :** Empêche l'explosion de stockage.

---

### R10. Renommer le KERNEL

**Action :** Renommer KERNEL Section XIII de "La Physique Cognitive" à "L'Architecture Cognitive" ou "Le Guide d'Identité".

**Justification :** Même contenu, packaging honnête. "Physique" implique falsifiabilité, prédictivité, universalité — aucun de ces critères n'est satisfait. "Architecture" ou "Guide" décrit correctement le rôle du document sans inviter la critique scientifique.

**Effort :** 5 minutes. **Impact :** Blinde le projet contre l'attaque critique la plus facile.

---

## Tier 3 — Moyen terme

### R11. Migrer les axiomes V14 → V15

Créer une commande `/migrate-core` qui re-scelle les axiomes Mnemolite sous l'étiquette `v15`.

### R12. Définir "Vessel" explicitement

Dans V15 L50, ajouter : `Vessel = documentation technique du workspace (docs/, kb/, README)`.

### R13. Corriger Dream "6 Lois" → "6 Sections"

Dream L349 et L601 : remplacer "6 Lois" par "6 Sections (Ⅰ-Ⅵ)".

### R14. Aligner la version Dream

Dream L638 : remplacer `v2.1` par `v2.2` (ou inversement).

### R15. Documenter les prérequis IDE pour Dream

Ajouter au préambule de Dream : `⚠️ Prérequis : accès fichiers (read_file, write_file, bash). Non fonctionnel dans ChatGPT web, Claude web, ou tout environnement sans accès système.`

---

## Ordre d'exécution recommandé

```
Jour 1 (2h) : R5 + R6 + R8 + R14 (corrections d'une minute)
             → R3 (aligner SYNTHESE)
             → R4 (résoudre /seal)

Jour 2 (3h) : R1 (signaux négatifs)
             → R7 (cristallisation négative)
             → R9 (rétention sys:history)
             → R2 (premier cycle Dream complet)

Jour 3 (1h) : R10 + R12 + R13 + R15 (corrections textuelles)
             → R11 (migration axiomes V14→V15)
```

**Temps total estimé :** 6 heures de travail sur 3 jours.

---

*Recommandations V6 — 2026-03-20 01:30*
*~900 mots — 15 recommandations actionnables*
