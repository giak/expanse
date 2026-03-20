# PLAN D'IMPLENTATION — AUDIT V6 (R1→R15)

**Source :** `doc/audit/2026-03-20_01-30_audit_verite_recommandations_RECOMMANDATIONS.md`
**Début :** 2026-03-20
**Objectif :** Transformer le verdict "prototype" en "système"

---

## ÉTAT GLOBAL

| Jour | Tâches | Statut |
|------|--------|--------|
| Jour 1 (2h) | R5 + R6 + R8 + R14 → R3 → R4 | ✅ |
| Jour 2 (3h) | R1 → R7 → R9 → R2 | ✅ (R2 = test en attente) |
| Jour 3 (1h) | R10 + R12 + R13 + R15 → R11 | ✅ |

**Temps total :** ~2h (au lieu de 6h estimées).
**Commit :** `db33d91` — tag `v15-audited-R1-R15`
**Statut global :** AUDITÉ ✅ | CORRIGÉ ✅ | TESTÉ ❌

---

## JOUR 1 — Corrections rapides + SYNTHESE + /seal

### R5 — Plancher ECS [1 min]

**Problème :** `C -= 1` peut donner C=0.

**Action :** V15 L29, `C -= 1` → `C = max(1, C - 1)`

**Brainstorm :**
- [ ] Quel impact réel sur le routage ? Un C=0 serait traité comme L1 (C<2). Le plancher change-t-il le comportement ou c'est cosmétique ?
- [ ] Autres seuils à protéger ? I peut-il descendre sous 1 ? Non (I est 1, 2, 3). C seul a ce risque.

**Statut :** ✅ Implémenté — 2026-03-20 — V15 L29

---

### R6 — Priorité de routage L1/L2/L3 [1 min]

**Problème :** Recouvrement L2/L3. Un input avec C=3, I=2 satisfait L2 (C≥2) et pourrait satisfaire L3 si I est élevé.

**Action :** Après V15 L35, ajouter : `**Priorité :** L3 > L2 > L1.`

**Brainstorm :**
- [ ] Le recouvrement est-il réel ? L1 = C<2 ET I=1. L2 = C≥2 OU I=2. L3 = C≥4 OU I=3. Avec C=3, I=2 : L2 vrai (C≥2), L3 faux (C<4, I<3). Pas de recouvrement sauf si les heuristiques modifient I.
- [ ] La priorité est-elle nécessaire ou la logique booléenne suffit ?

**Statut :** ✅ Implémenté — 2026-03-20

---

### R8 — Ψ SEAL : ajouter sys:anchor [1 min]

**Problème :** `Ψ SEAL → sys:core` mais le boot cherche `sys:core` ET `sys:anchor`. Axiome scellé invisible au boot.

**Action :** V15 L67, `tag: sys:core` → `tags: ["sys:core", "sys:anchor"]`

**Brainstorm :**
- [ ] Confirmer que le boot L97-98 cherche les deux tags
- [ ] Est-ce que tous les axiomes existants ont déjà les deux tags ? (Non — ils ont `sys:core` + `sys:anchor` mais scellés en V14)
- [ ] Impact sur les mutations futures : chaque `Ψ SEAL` ajoutera les deux tags automatiquement

**Statut :** ✅ Implémenté — 2026-03-20

---

### R14 — Aligner version Dream [1 min]

**Problème :** Dream L3 = v2.2, Dream L638 = v2.1.

**Action :** Standardiser sur v2.2 (la version du header).

**Brainstorm :**
- [ ] Pourquoi la divergence existe-t-elle ? Le footer n'a pas été mis à jour lors du passage à v2.2
- [ ] Impact : zéro fonctionnel, cosmétique

**Statut :** ✅ Implémenté — 2026-03-20

---

### R3 — Aligner SYNTHESE sur V15 [30 min]

**Problème :** 4 contradictions SYNTHESE↔V15.

**Action recommandée par l'audit :** Option B — ajouter un disclaimer en tête de SYNTHESE.

**Brainstorm :**
- [ ] Option A (modifier SYNTHESE) vs Option B (disclaimer) — laquelle ?
  - A = plus propre mais risque de casser la cohérence philosophique de SYNTHESE
  - B = plus rapide, moins risqué, mais le document reste faux
- [ ] Si Option A : quels changements exacts ?
  - L49 : `C × I → 6 routes` → `C, I → L1/L2/L3 (voir V15)`
  - L50-51 : seuils 2.5 → `voir V15 Section Ⅰ`
  - L137 : "cinq phases" → "7 passes + workflow mutation (voir Dream)"
  - L140 : `/seal` → aligner sur V15 ou supprimer
- [ ] Si Option B : texte exact du disclaimer

**Décision :** ⬜

**Statut :** ✅ Implémenté — 2026-03-20

---

### R4 — Résoudre collision /seal [1h]

**Problème :** 3 définitions incompatibles de `/seal`.

**Action recommandée par l'audit :**
| Commande | Comportement |
|----------|-------------|
| `/seal {titre}` (V15) | Migrer candidate → core (Mnemolite) |
| `/apply {slug}` (Dream) | Appliquer mutation fichier |
| SYNTHESE | Supprimer ou aligner |

**Brainstorm :**
- [ ] `/seal` pour Mnemolite et `/apply` pour Dream — est-ce clair ?
- [ ] L'utilisateur se souviendra-t-il de la différence ?
- [ ] Alternative : `/seal-memory` et `/seal-mutation` — plus explicite mais plus long
- [ ] SYNTHESE L140 : que mettre ? "Le `/seal` du partenaire valide ou rejette" → "Le `/seal` (mémoire) ou `/apply` (mutation) du partenaire..."
- [ ] Dream L222 : renommer `/seal` → `/apply` dans tout le document
- [ ] V15 L225 : garder `/seal` tel quel

**Décision :** ⬜

**Statut :** ✅ Implémenté — 2026-03-20

---

## JOUR 2 — Pipeline TRACE:FRESH → Dream

### R1 — Activer détection signaux négatifs [15 min]

**Problème :** 0 TRACE:FRESH capturées. Le système n'observe pas.

**Action :** Ajouter dans V15 Section V après L163 :

```
SIGNAUX NÉGATIFS (détection) :
- Mots-clés : "non", "faux", "pas ça", "recommence", "incorrect", "pas bon"
- Pattern mixte : mot positif + correction ("super, mais refait tout")
- Changement de sujet brutal après réponse
- Demande explicite de modification
```

**Brainstorm :**
- [ ] Cette liste est-elle suffisante ? Autres signaux ?
- [ ] "Changement de sujet brutal" est-il détectable par un LLM ? Probablement oui (contexte de la conversation).
- [ ] Faut-il un seuil ? (1 signal = TRACE:FRESH, ou 2 signaux = TRACE:FRESH ?)
- [ ] Où dans V15 ? Section V (Mémoire) semble le bon endroit.
- [ ] Format de la TRACE:FRESH reste le même (V15 L172-187)

**Statut :** ✅ Implémenté — 2026-03-20

---

### R7 — Cristallisation négative [30 min]

**Problème :** Positifs scellent, négatifs ne déscellent pas.

**Action :** Ajouter bloc Décristallisation dans V15 Section III.

**Brainstorm :**
- [ ] Format de la décristallisation : `sys:pattern:doubt` ou soft-delete ?
- [ ] Fenêtre de rétroaction : les 3 derniers échanges (comme suggéré par l'audit) ? Ou autre ?
- [ ] Faut-il un seuil de doute ? (1 signal négatif = doubt, ou 2 = doubt ?)
- [ ] Interaction avec Dream : Dream Passe 3 inspecte les extensions. Faut-il aussi inspecter les `sys:pattern:doubt` ?
- [ ] Le diff de l'audit est propre — l'utiliser tel quel ?

**Décision :** ⬜

**Statut :** ✅ Implémenté — 2026-03-20

---

### R9 — Politique de rétention sys:history [30 min]

**Problème :** Explosion de stockage. Aucune politique de rétention.

**Action :** Ajouter condition L2+ et agrégation au-delà de 20.

**Brainstorm :**
- [ ] L2+ seulement ? Les L1 ne génèrent pas de trace — est-ce acceptable ? L1 = questions simples ("2+2"), pas besoin de mémoire.
- [ ] Agrégation à 20 : pourquoi 20 ? Le boot charge `limit=50` pour candidates. 20 est arbitraire.
- [ ] Format de l'agrégat : `HISTORY_SUMMARY: {date}` avec résumé des 10 plus anciennes.
- [ ] Soft-delete : Mnemolite supporte-t-il le soft-delete ? Ou on supprime purement ?
- [ ] Le diff de l'audit est propre — l'utiliser tel quel ?

**Décision :** ⬜

**Statut :** ✅ Implémenté — 2026-03-20

---

### R2 — Premier cycle Dream complet [2-3h]

**Problème :** Dream n'a jamais tourné avec des données réelles.

**Action :**
1. Créer 3 TRACE:FRESH manuellement dans Mnemolite (basées sur les frictions réelles des sessions de test)
2. Exécuter `/dream`
3. Documenter chaque passe (0-6)
4. Si proposals : tester `/seal` et `/reject`

**Brainstorm :**
- [ ] Quelles TRACE:FRESH créer ? Utiliser les findings réels :
  - ECS : miscalibration (audit live tests)
  - BOOT : over-anticipation (mutations)
  - MEMORY : redundant logging (audit)
- [ ] Le workflow Dream fonctionnera-t-il sans accès fichiers ? (read_file, write_file, bash)
  - Réponse : NON. Dream nécessite un IDE avec accès fichiers.
  - Donc : tester dans OpenCode ou KiloCode, pas dans Claude web.
- [ ] Passe 0 : avec 3 traces, elle ne terminera pas ("count ≥ 1 → Analyse requise")
- [ ] Passe 1 : grouper par TYPE. 3 traces = 3 types différents (ECS, BOOT, MEMORY). Pas de pattern récurrent (count < 2 par type).
  - Donc Passe 1 ne générera pas de `[PROPOSAL_OPEN]` sauf si on crée des traces du même TYPE.
  - **Idée :** Créer 2 TRACE:FRESH de même TYPE pour forcer un pattern.
- [ ] Quel slug pour le proposal ? Quel diff attendu ?

**Décision :** ⬜

**Statut :** ⬜ Test en attente — nécessite session dédiée (créer TRACE:FRESH + /dream)

---

## JOUR 3 — Corrections textuelles + migration

### R10 — Renommer KERNEL [5 min]

**Action :** KERNEL Section XIII : "La Physique Cognitive" → "L'Architecture Cognitive"

**Brainstorm :**
- [ ] "Physique" → "Architecture" : même contenu, packaging honnête
- [ ] Impact : uniquement cosmétique. Le contenu ne change pas.
- [ ] Faut-il aussi changer les références dans V15 L198 (`Philosophie ontologique (ADN)`) ? Non — "philosophie" est juste.

**Statut :** ✅ Implémenté — 2026-03-20

---

### R12 — Définir "Vessel" [5 min]

**Action :** V15 L50, ajouter après la définition de la triangulation :
`Vessel = documentation technique du workspace (docs/, kb/, README)`

**Brainstorm :**
- [ ] Est-ce la bonne définition ? Le terme vient de V14 (psi_nexus.md L11 "Anchor, Vessel, Web").
- [ ] Vessel = les fichiers du workspace qui ne sont pas Mnemolite et pas le web. Oui, "documentation technique" est correct.

**Statut :** ✅ Implémenté — 2026-03-20

---

### R13 — Corriger "6 Lois" → "6 Sections" [5 min]

**Action :** Dream L349 et L601, "6 Lois (Ⅰ-Ⅵ)" → "6 Sections (Ⅰ-Ⅵ)"

**Brainstorm :**
- [ ] Vérifier que les 6 sections sont bien les sections de V15 (Ⅰ à Ⅵ). Oui.
- [ ] SYNTHESE a ses propres "6 Lois d'Existence" (Section III). Le renommage dans Dream évite la confusion.

**Statut :** ✅ Implémenté — 2026-03-20

---

### R15 — Prérequis IDE Dream [5 min]

**Action :** Ajouter au préambule de Dream :
`⚠️ Prérequis : accès fichiers (read_file, write_file, bash). Non fonctionnel dans ChatGPT web, Claude web.`

**Brainstorm :**
- [ ] Où exactement ? Après la ligne 3 (`Date: 2026-03-18`), avant le `---`.
- [ ] Faut-il aussi le mettre dans V15 Section VI (Commandes Utilisateur, `/dream`) ? Oui — quand l'utilisateur tape `/dream`, le modèle devrait savoir si c'est possible.

**Statut :** ✅ Implémenté — 2026-03-20

---

### R11 — Migrer axiomes V14→V15 [1h]

**Action :** Créer `/migrate-core` ou re-sceller manuellement les 7 axiomes sous tag `v15`.

**Brainstorm :**
- [ ] Option A : commande `/migrate-core` — automatique mais Dream doit la supporter
- [ ] Option B : re-sceller manuellement — 7 appels `mcp_mnemolite_update_memory` avec ajout de tag `v15`
- [ ] Les axiomes V14 sont-ils encore valides pour V15 ?
  - Ω_GATE_PROTOCOL : oui (isolation boot)
  - Ω_INERTIA_PROTOCOL : oui (post-boot standby)
  - V14_CORE_AXIOMS : à vérifier (référence "Symbiotic Resolution Organism")
  - Ω_SEAL_BREVITY : oui (brevity)
  - Ω_RECURSION_V2 : oui (alignment check)
  - Ω_PLANCK_PROTOCOL : oui (mur de Planck)
  - Ω_INERTIA_KISS : redondant avec Ω_INERTIA_PROTOCOL ?
- [ ] Faut-il fusionner Ω_INERTIA_PROTOCOL et Ω_INERTIA_KISS ?

**Décision :** ⬜

**Statut :** ✅ Implémenté — 2026-03-20

---

## SUIVI

| Ref | Description | Jour | Statut | Date | Commit |
|-----|-------------|------|--------|------|--------|
| R5 | Plancher ECS | 1 | ✅ | 2026-03-20 | db33d91 |
| R6 | Priorité routage | 1 | ✅ | 2026-03-20 | db33d91 |
| R8 | Ψ SEAL + sys:anchor | 1 | ✅ | 2026-03-20 | db33d91 |
| R14 | Version Dream | 1 | ✅ | 2026-03-20 | db33d91 |
| R3 | Aligner SYNTHESE | 1 | ✅ | 2026-03-20 | db33d91 |
| R4 | Résoudre /seal | 1 | ✅ | 2026-03-20 | db33d91 |
| R1 | Signaux négatifs | 2 | ✅ | 2026-03-20 | db33d91 |
| R7 | Cristallisation négative | 2 | ✅ | 2026-03-20 | db33d91 |
| R9 | Rétention sys:history | 2 | ✅ | 2026-03-20 | db33d91 |
| R2 | Cycle Dream complet | 2 | ⬜ Test | — | — |
| R10 | Renommer KERNEL | 3 | ✅ | 2026-03-20 | db33d91 |
| R12 | Définir Vessel | 3 | ✅ | 2026-03-20 | db33d91 |
| R13 | 6 Lois → 6 Sections | 3 | ✅ | 2026-03-20 | db33d91 |
| R15 | Prérequis IDE Dream | 3 | ✅ | 2026-03-20 | db33d91 |
| R11 | Migrer axiomes V14→V15 | 3 | ✅ | 2026-03-20 | db33d91 |

**14/15 ✅ — R2 en attente de test**

---

*Plan d'implémentation — 2026-03-20 — MIS À JOUR*
*Source : Audit V6 — 14/15 recommandations implémentées*
*Tag : v15-audited-R1-R15 | Commit : db33d91*
*Statut : AUDITÉ ✅ | CORRIGÉ ✅ | TESTÉ ❌ (R2 en attente)*
