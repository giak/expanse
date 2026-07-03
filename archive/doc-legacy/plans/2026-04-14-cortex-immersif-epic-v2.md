# 🧠 EPIC : EXPANSE Cortex — Extension Immersive v2

**Status** : ✅ COMPLÉTÉ (Phase 0 ✅ · Phase 1a ✅ · Phase 1b ✅ · Phase 1c ✅ · Phase 2 ✅ · Phase 3 ✅)
**Version** : 2.1
**Date** : 2026-04-14 · mis à jour 2026-04-11 (Phase 3 complet)
**Stack** : React + SVG + Canvas2D (intégré dans expanse-cortex/)
**Approche** : Enrichir l'app React existante + améliorer le JSON pour faciliter le rendu

---

## 0. PREAMBULE — Ce qui a changé depuis v1

La v1 de cette EPIC partait du principe que le JSON existant suffisait. **Le preview v2 (Cellule-Corail) a prouvé le contraire.** En implémentant réellement le rendu, on a découvert que :

1. Le JSON est **structuré pour le stockage, pas pour le rendu** — les positions doivent être intégralement calculées client-side, ce qui est coûteux et fragile
2. Les types de nœuds sont **trop grossiers** — REGLE contient des axiomes, des fichiers, des substrats et des tables de référence qui n'ont rien à voir entre eux
3. Les arêtes sont **monotypées** — 85% sont DERIVES_FROM, ce qui rend la topologie plate et peu informative
4. Les données sont **dupliquées** — 16 mutations apparaissent deux fois (mu84-mu103 + mu104-mu119)
5. Les champs `created_at` sont **incohérents** — parfois un timestamp ISO, parfois "5", "ADN", "Runtime", "Ontologique"
6. La **nature Mnemolite** (permanent/vivide/volatile/incandescent) n'est pas dans le JSON — elle doit être devinée heuristiquement à partir des tags

Cette v2 propose une refonte du schema JSON (v5, anciennement v4) en parallèle de l'implémentation React, pour que les données **facilitent** le rendu au lieu de le compliquer.

> **Mise à jour v2.1** : Phase 0 (générateur v5), Phase 1a (natures Mnemolite), Phase 1b (Particle Engine), Phase 1c (Vue Timeline), et Phase 2 (Vue Écosystème Mémoire) sont implémentées. Le schema est passé de v4 à v5 (ajout `condition` sur arêtes, `GraphMeta` extrait). Algorithme spiral partagé via `utils/spiralLayout.ts`. Phase 3 (Boot enrichi, ECS Prism interactif, Particules Mnemolite, Replay temporel, Export PNG) complétée. Voir §9 pour l'état détaillé.

---

## 1. VISION

> **Entrer dans le cristal cognitif.**

Un organisme bioluminescent des abysses. Pas un diagramme UML — un système nerveux vivant où les données courent comme des impulsions électriques, où les organes respirent, où la mémoire cristallise en temps réel.

Le Cortex Immersif est pour la **perception** — sentir le système. Le React app existant (expanse-cortex/) est pour l'**analyse**. Les deux cohabitent dans la même application, sous des routes différentes.

**Sensation** : Chirurgical. Souverain. Infini.

---

## 2. PROBLÉMATIQUE — Pourquoi rendre ces données est fondamentalement difficile

### 2.1 Le paradoxe de la topologie plate

Le système EXPANSE a une structure conceptuelle riche — 5 organes en pipeline, 7 sections APEX, 8 passes Dream, 38 mutations, 24 patterns. Mais dans le JSON, **tout est connecté à tout via DERIVES_FROM** :

- 31 REGLE → APEX §Ⅲ (Souveraineté) en étoile
- 14 COMMANDE → APEX §Ⅴ en étoile
- 38 MUTATION → APEX §Ⅲ ou §Ⅵ en étoile + PROTOCOLE Passe 1 en étoile
- 24 PATTERN → APEX §Ⅳ en étoile

Résultat : la topologie est une **étoile à 7 branches** (les 7 APEX), pas un réseau riche. La densité annoncée (1.3) est trompeuse — elle masque le fait que 85% des arêtes sont DERIVES_FROM, ce qui est la relation la moins informative possible.

**Conséquence pour le rendu** : Si on dessine toutes les arêtes, on obtient un diagramme en étoile illisible. Si on les filtre, on perd de l'information. Il faut soit agréger les arêtes DERIVES_FROM en "faisceaux" visuels, soit enrichir les types de relations pour créer de la structure.

### 2.2 Le problème de la confusion typologique

Le type `REGLE` contient 31 nœuds qui sont en réalité **5 catégories sémantiques distinctes** :

| Catégorie réelle | IDs | Ce que c'est vraiment | Tags distinctifs |
|---|---|---|---|
| Règles V16 | re13–re24 | Règles actives du runtime | `regle` + tag fonctionnel |
| Axiomes scellés | re25–re32 | Décisions immuables (sys:core) | `axiom`, `sys:core`, `sys:anchor` |
| **Fichiers runtime** | re33–re41 | Fichiers .md du système | `regle`, `axiom` (!) — **erreur** |
| **Substrats** | re42–re43 | IDE/sessions | `regle`, `axiom` (!) — **erreur** |

Les fichiers et substrats sont étiquetés REGLE avec tags `axiom` — c'est une erreur de classification. Un fichier n'est pas une règle, un substrat n'est pas un axiome. Le générateur les met dans REGLE parce qu'il n'a pas de types dédiés.

**Conséquence pour le rendu** : Dans la vue Cœur, ces nœuds apparaissent comme des dendrites de Ψ (règles), alors qu'ils devraient être des organites de Μ (fichiers mémoire) ou des membrane receptors (substrats). La signature géométrique est mauvaise parce que le type est faux.

### 2.3 Le problème du created_at cassé

Sur 167 nœuds, les valeurs de `created_at` se répartissent ainsi :

| Pattern | Exemples | Comptage | Utilisable pour Timeline ? |
|---|---|---|---|
| ISO 8601 valide | `"2026-04-14T06:50:51.510Z"`, `"2026-03-23"` | ~145 | ✅ Oui |
| Nombre brut | `"5"`, `"4"` | 2 | ❌ Non (sessions de substrat) |
| Label sémantique | `"ADN"`, `"Runtime (ECS+SEC+...)"`, `"Ontologique"`, `"Auto-évolution"` | 7 | ❌ Non (rôles de fichiers) |
| Date partielle | `"2026-03-19"` | ~18 | ✅ Oui (date sans heure) |

**Conséquence pour le rendu** : La vue Timeline ne peut pas trier ces nœuds correctement. Les fichiers runtime ont des `created_at` comme `"Runtime (ECS+SEC+Externes+Symbiose)"` au lieu d'une date. Les substrats ont `"5"` (nombre de sessions) au lieu d'une date. Il faut soit nettoyer le générateur, soit ajouter un fallback côté frontend.

### 2.4 Le problème des mutations dupliquées

Les nœuds mu84–mu103 et mu104–mu119 sont **des doublons partiels** :

| Slug | mu84-mu103 | mu104-mu119 |
|---|---|---|
| crystallization-guard-surgical | ✅ mu85 | ✅ mu104 |
| surgical-integrity-protocol | ✅ mu86 | ✅ mu105 |
| ecs-impact-calibration | ✅ mu87 | ✅ mu107 |
| master-matrix | ❌ absent | ✅ mu120 (REJECTED) |
| ecs-heuristics-expansion | ❌ absent | ✅ mu121 (REJECTED) |

Le générateur extrait les mutations de DEUX sources : le dashboard HTML (premier lot) et LOG.md (deuxième lot), sans dédupliquer par slug. Seuls les REJECTED manquent dans le premier lot.

**Conséquence pour le rendu** : 16 mutations apparaissent deux fois dans la vue Cœur et la Timeline, gonflant artificiellement les compteurs et créant des doublons visuels.

### 2.5 Le problème de la nature absente

Les 4 natures Mnemolite (Permanent/Vivide/Volatile/Incandescent) sont des **concepts centraux du système** mais elles n'existent pas dans le JSON. Elles doivent être déduites heuristiquement à partir des tags :

```javascript
// Logique actuelle dans le preview v2
function computeNature(tags) {
  const t = tags.join(' ')
  if (t.includes('sys:core') || t.includes('sys:anchor')) return 'permanent'
  if (t.includes('sys:pattern:candidate') || t.includes('sys:extension')) return 'volatile'
  if (t.includes('trace:fresh') || t.includes('sys:drift')) return 'incandescent'
  if (t.includes('sys:pattern') || t.includes('sys:history')) return 'vivide'
  return null // ~40% des nœuds n'ont pas de nature assignable !
}
```

**Problème** : Cette heuristique est fragile et incomplète. Les tags comme `apex`, `organ`, `commande`, `proto` ne correspondent à aucune nature. Les REGLE qui sont en fait des fichiers n'ont pas de nature du tout. Les PATTERN ont parfois `proposal`, `candidate`, `seed` comme tags — qui ne mappent pas proprement.

**Conséquence pour le rendu** : ~40% des nœuds n'ont pas de nature visible dans l'Écosystème Mémoire, ce qui crée des "trous" dans les zones concentriques.

### 2.6 Le problème du centrality bidon

Le champ `centrality` est simplement le **nombre d'arêtes entrantes + sortantes**, pas un vrai PageRank ou betweenness centrality. Conséquences :

- APEX §Ⅲ a centrality=59 (hyper-connecté) mais c'est juste parce que TOUTES les REGLE pointent vers lui
- Les ORGAN ont centrality=1 ou 9–10 (dépend des IMPLEMENTS edges)
- La plupart des nœuds ont centrality=1 ou 2 (connectés à 1-2 APEX)

**Conséquence pour le rendu** : Le rayon des nœuds (dérivé de centrality) ne reflète pas l'importance réelle. Les APEX sont énormes (pas juste), les REGLE sont minuscules (pas juste non plus — certaines règles sont plus critiques que d'autres).

---

## 3. DIFFICULTÉ — Défis techniques par vue

### 3.1 Vue Cœur Cognitif (`#/heart`)

| Défi | Description | Sévérité |
|---|---|---|
| **Layout déterministe par type** | Chaque type doit avoir sa signature géométrique propre (hélice, dendrites, Fibonacci, hexagone, etc.) sans Math.random(). Le preview v2 a prouvé que c'est possible mais fragile — le layout dépend de l'ordre des nœuds dans le JSON | 🟡 Moyen |
| **Alignement Canvas ↔ SVG** | Les particules (Canvas2D) doivent suivre les arêtes (SVG). Les deux systèmes de coordonnées doivent rester synchronisés lors du pan/zoom | 🔴 Élevé |
| **Faisceaux d'arêtes** | 31 REGLE → 1 APEX crée 31 arêtes presque parallèles. Il faut les regrouper visuellement en "faisceaux" (bundled edges) pour rester lisible | 🔴 Élevé |
| **Collision nœuds** | Avec 167 nœuds et des algorithmes de croissance déterministes, les REGLE dendrites peuvent chevaucher les MUTATION croûtes ou les OUTIL pseudopodes | 🟡 Moyen |
| **Labels lisibles** | En zoom normal, les labels des 167 nœuds se superposent. Il faut un système de labels adaptatif (zoom-dependent) | 🟡 Moyen |

### 3.2 Vue Timeline (`#/timeline`)

| Défi | Description | Sévérité |
|---|---|---|
| **created_at cassé** | 9 nœuds ont des created_at invalides (nombres, labels sémantiques). Il faut un fallback ou un nettoyage côté générateur | 🔴 Élevé |
| **Mutations dupliquées** | 16 mutations apparaissent deux fois → 2 points sur la timeline pour le même événement | 🟡 Moyen |
| **Échelle temporelle non-linéaire** | Les mutations se concentrent sur 3 jours (19-24 mars) puis un gap de 13 jours avant le 6 avril. L'échelle linéaire rend la période active illisible | 🟡 Moyen |
| **Lanes surchargées** | 31 REGLE dans une lane = illisible. Il faut sous-grouper par catégorie (axiomes, règles actives, etc.) | 🟡 Moyen |

### 3.3 Vue Écosystème Mémoire (`#/memory`)

| Défi | Description | Sévérité |
|---|---|---|
| **Nature non-déductible** | 40% des nœuds n'ont pas de nature assignable via tags. Ils "flottent" entre les zones concentriques | 🔴 Élevé |
| **Types confus dans les zones** | Les fichiers runtime (type REGLE, devrait être MEMOIRE) atterrissent dans la zone dendrite de Ψ au lieu de la zone Permanent de Μ | 🔴 Élevé |
| **8 outils MCP au centre** | 5 outils Mnemolite + 4 outils IDE + 9 skills = 18 OUTIL. Le centre serait surchargé. Il faut sous-clusters | 🟡 Moyen |
| **Tag root links** | Les liens entre mémoires partageant un tag créent un réseau dense (24 PATTERN × ~3 tags chacun = ~72 liens potentiels). Il faut filtrer | 🟡 Moyen |

### 3.4 Particle Engine (transversal)

| Défi | Description | Sévérité |
|---|---|---|
| **Performance glow** | shadowBlur à 60fps avec 150 particules = 2-3ms/frame sur GPU moyen. Il faut OffscreenCanvas pré-rendu | 🟡 Moyen |
| **Suivi d'arêtes Bézier** | Les arêtes SVG sont des courbes, pas des lignes droites. Les particules doivent interpoler le long de la courbe, pas linéairement | 🟡 Moyen |
| **Budget particules** | 217 arêtes × potentiellement 1 particule = trop. Il faut sélectionner les arêtes "vivantes" (IMPLEMENTS, CALLS, ALTERS) et ignorer les DERIVES_FROM statiques | 🟡 Moyen |

---

## 4. AUDIT JSON — État actuel vs État désiré

### 4.1 Schéma actuel (v3)

```
Node: { id, type, label, content, tags[], created_at, centrality }
Edge: { source, target, type, weight }
Meta: { version, generated_at, count_nodes, count_edges, density, deduplicated, mnemolite_timestamp }
```

### 4.2 Problèmes identifiés

| # | Problème | Impact | Sévérité |
|---|---|---|---|
| P1 | **Types trop grossiers** : REGLE = 5 catégories sémantiques différentes | Layout faux, signatures géométriques incohérentes | 🔴 Critique |
| P2 | **Arêtes monotypées** : 85% DERIVES_FOR | Topologie plate, peu informative | 🔴 Critique |
| P3 | **Mutations dupliquées** : 16 sur 38 | Compteurs gonflés, timeline faussée | 🟡 Moyen |
| P4 | **created_at incohérents** : 9 valeurs non-date | Timeline impossible pour ces nœuds | 🟡 Moyen |
| P5 | **Nature absente** : doit être devinée via tags | 40% des nœuds sans nature | 🔴 Critique |
| P6 | **Centrality = degré** : pas de vrai PageRank | Rayons des nœuds non-représentatifs | 🟡 Moyen |
| P7 | **Tags inconsistants** : mélange de `sys:core`, `apex`, `vsecurityalignmentaudit` (slug hash) | Natures mal déduites, filtres cassés | 🟡 Moyen |
| P8 | **Pas de status dédié** : mutation status dans tags (`applied`, `rejected`, `rolled_back`) | Parsing fragile pour couleurs/timeout | 🟠 Mineur |
| P9 | **Pas de outcome/consumed** : manquants sur MEMOIRE | Pas de métrique qualité dans Écosystème | 🟠 Mineur |
| P10 | **content tronqué à 120 chars** : certaines descriptions coupées | Tooltips incomplets | 🟠 Mineur |

### 4.3 Proposals de schéma v4 (implémentées comme v5)

#### Proposal A — Élargir les types de nœuds (résout P1, P5)

```
Types actuels (10) :  APEX, ORGAN, REGLE, PROTOCOLE, PATTERN,
                      MEMOIRE, OUTIL, COMMANDE, MUTATION, DRIFT

Types proposés (13) : APEX, ORGAN, REGLE, AXIOME, FICHIER, SUBSTRAT,
                      PROTOCOLE, PATTERN, OUTIL, COMMANDE,
                      MUTATION, DRIFT, EXTENSION
                      // MEMOIRE retiré : 0 nœuds après extraction FICHIER+EXTENSION
```

| Nouveau type | Détaché de | Description | Signature géométrique |
|---|---|---|---|
| **AXIOME** | REGLE (re25–re32) | Décision scellée sys:core | Octaèdre cristallin, nature=permanent |
| **FICHIER** | REGLE (re33–re41) | Fichier runtime .md | Icône document, nature=permanent |
| **SUBSTRAT** | REGLE (re42–re43) | IDE/session | Hexagone membrane, nature=vivide |
| **EXTENSION** | MEMOIRE (me146–me147) | Extension Ψ_SYMBIOSIS, ◊ | Losange doré, nature=volatile |

> **Note sur MEMOIRE** : Après extraction de FICHIER (8 nœuds), EXTENSION (2 nœuds) et SUBSTRAT (2 nœuds) depuis l'ancien type MEMOIRE, il reste 0 nœuds MEMOIRE. Le type est retiré du schema v4. Les sys:history entries et non-file memories seront classifiés selon leur sémantique (FICHIER si persistant, PATTERN si cristallisé, etc.).

**Impact sur le rendu** :
- AXIOME → sa propre poche morphologique (cristaux octaédriques dans le noyau, pas des dendrites de Ψ)
- FICHIER → organites de Μ (près de la zone Permanent), pas dendrites de Ψ
- SUBSTRAT → récepteurs sur la membrane externe, pas dendrites de Ψ
- EXTENSION → auréole autour de l'organe concerné, pas des vacuoles génériques

**Impact sur computeNature** : Chaque nouveau type a une nature par défaut :
- AXIOME → `permanent` (scellé, immuable)
- FICHIER → `permanent` (fichier de référence)
- SUBSTRAT → `vivide` (actif, sessions en cours)
- EXTENSION → `volatile` (en incubation, peut être retiré)

#### Proposal B — Enrichir les types d'arêtes (résout P2)

```
Types actuels (7) :   DERIVES_FROM, IMPLEMENTS, CALLS, RELATES_TO,
                      RATE_POSITIVE, RATE_NEGATIVE, ALTERS

Types proposés (14) : DERIVES_FROM, IMPLEMENTS, CALLS, RELATES_TO,
                      ALTERS, FEEDS_INTO, CRYSTALLIZES_FROM,
                      GUARDS, TRIGGERS, SUPERSEDES, REFERENCES, FEEDBACK,
                      RATE_POSITIVE, RATE_NEGATIVE

// RATE_POSITIVE/NEGATIVE conservés — utilisés par outcome feedback
```

| Nouveau type d'arête | Description | Exemple | Visuel |
|---|---|---|---|
| **FEEDS_INTO** | Flux pipeline Σ→Ψ→Φ→Ω→Μ | or8→or9, or9→or10 | Particule rapide, courbe douce |
| **CRYSTALLIZES_FROM** | Pattern cristallise depuis interaction | pa137←interaction | Particule lente, vert→rose |
| **GUARDS** | Règle protège un élément | re21→ou65 (Vessel Guard) | Ligne pointillée, bouclier |
| **TRIGGERS** | Commande déclenche protocole | co44→pr76 (/dream→Passe 0) | Éclair, flash |
| **SUPERSEDES** | Mutation remplace une autre | mu85→mu84 (surgical supersede guard) | Flèche orange, override |
| **REFERENCES** | Mémoire/fichier réfère à APEX | me158→ap1 (v16.md→§Ⅰ) | Ligne fine grise |
| **FEEDBACK** | Outcome feedback boucle | re24→ou62 (feedback→rate_memory) | Flèche retour verte |

**Impact sur le rendu** : Au lieu de 85% DERIVES_FOR, on aurait une distribution variée permettant de dessiner des faisceaux visuellement distincts. Les arêtes FEEDS_INTO créent le flux métabolique du Cœur. Les TRIGGERS créent des éclairs entre commandes et protocoles. Les GUARDS créent des boucliers entre règles et outils.

#### Proposal C — Ajouter les champs dédiés (résout P4, P5, P6, P8, P9)

```
Node v3 : { id, type, label, content, tags[], created_at, centrality }
Node v4 : { id, type, label, content, tags[], created_at, centrality,
            nature, status, parent_organ, sort_key, outcome }
```

> **Ordre de résolution** : Proposal E (corriger les created_at) doit être exécuté AVANT de calculer sort_key. sort_key = Date.parse(created_at_corrigé) || 0.

| Nouveau champ | Type | Description | Exemple |
|---|---|---|---|
| **nature** | `string\|null` | Nature Mnemolite (permanent/vivide/volatile/incandescent) | `"permanent"` |
| **status** | `string\|null` | Statut dédié (pour mutations : applied/rejected/rolled_back) | `"applied"` |
| **parent_organ** | `string\|null` | Organe parent direct (Σ/Ψ/Φ/Ω/Μ) pour layout | `"Ψ"` |
| **sort_key** | `number` | Clé de tri temporel (timestamp unix, 0 si inconnu) | `1742284800` |
| **outcome** | `number\|null` | Score outcome feedback (0-1, null si pas applicable) | `0.78` |

**Impact sur le rendu** :
- `nature` → plus besoin de computeNature(). Chaque nœud a sa zone dans l'Écosystème
- `status` → plus besoin de parser les tags pour les couleurs de mutation
- `parent_organ` → le layout du Cœur est immédiat (pas de résolution par arête)
- `sort_key` → la Timeline trie correctement même si created_at est cassé
- `outcome` → l'Écosystème peut montrer la qualité des mémoires (glow vert/rouge)

#### Proposal D — Dédupliquer par slug + par label fichier (résout P3 + fichier dup)

**Mutations** : Ajouter une étape de déduplication par `slug` (label pour les mutations) dans le générateur. Les mutations avec le même slug ne doivent apparaître qu'une seule fois. Le premier occurence (du dashboard HTML) est conservé ; les REJECTED uniques du second lot (mu120, mu121) sont ajoutés.

**Fichiers** : Les mêmes fichiers runtime apparaissent deux fois — une fois comme REGLE (extrait du dashboard §Ⅶ, re33–re41) et une fois comme MEMOIRE (extrait du RUNTIME_FILES list, me158–me165). Après reclassification en FICHIER, les doublons par `label` doivent être fusionnés. Par exemple, `expanse-v16.md` apparaît comme re33 ET me158 — un seul nœud FICHIER subsiste.

#### Proposal E — Corriger les created_at (résout P4)

| ID actuel | created_at actuel | created_at corrigé | Source de la correction |
|---|---|---|---|
| re33 (expanse-v16.md) | `"Runtime (ECS+SEC+Externes+Symbiose)"` | `"2026-04-06"` | Date de dernière mutation V16 |
| re34 (expanse-dream.md) | `"Auto-évolution"` | `"2026-03-13"` | Date de création V14 |
| re35 (expanse-v16-boot-seed.md) | `"Boot (substrat+BIOS)"` | `"2026-03-13"` | Date de création boot seed |
| re36 (KERNEL.md) | `"ADN"` | `"2026-03-10"` | Date de création KERNEL |
| re37 (doc/SYNTHESE.md) | `"Ontologique"` | `"2026-03-10"` | Date approximative |
| re38–re41 (autres fichiers) | Labels sémantiques | `"2026-03-13"` | Date de création V14 |
| re42 (antigravity) | `"5"` | `"2026-03-23"` | Dernière utilisation dashboard |
| re43 (mimo-v2-pro-free) | `"4"` | `"2026-03-23"` | Dernière utilisation dashboard |

#### Proposal F — Centrality pondéré (résout P6)

Remplacer le simple degré (edge count) par un score composite :

```javascript
centrality = (
  0.4 × in_degree +          // combien de nœuds pointent vers moi
  0.3 × type_weight +         // ORGAN=5, APEX=4, AXIOME=3, REGLE=2, autre=1
  0.3 × nature_weight         // permanent=3, vivide=2, volatile=1, incandescent=0.5
)
```

Cela donne aux organes et aux axiomes un score élevé même s'ils ont peu d'arêtes entrantes, reflétant leur importance structurelle.

### 4.4 Synthèse des proposals

| Proposal | Ce que ça résout | Effort générateur | Effort frontend | Impact rendu |
|---|---|---|---|---|
| A — Types élargis | P1, P5 (partiel) | 🟡 Moyen | 🟢 Facile | 🔴 Critique |
| B — Arêtes enrichies | P2 | 🔴 Élevé | 🟢 Facile | 🔴 Critique |
| C — Champs dédiés | P4, P5, P6, P8, P9 | 🟡 Moyen | 🟢 Facile | 🟡 Moyen |
| D — Dédup mutations | P3 | 🟢 Facile | 🟢 Facile | 🟡 Moyen |
| E — created_at corrigés | P4 | 🟢 Facile | 🟢 Nul | 🟠 Mineur |
| F — Centrality pondéré | P6 | 🟢 Facile | 🟢 Nul | 🟠 Mineur |

**Recommandation** : Implémenter A + C + D + E en Phase 1 (effort raisonnable, impact maximal). B peut attendre la Phase 2. F est optionnel.

---

## 5. SCHEMA v5 — Format final (implémenté)

```jsonc
{
  "version": 5,
  "generated_at": "2026-04-14T...",
  "meta": {
    "count_nodes": 148,       // ≈167 - 16 mutations dup + 3 fichiers dup (dashboard+RUNTIME_FILES)
    "count_edges": 230,
    "density": 1.6,
    "deduplicated": 19,       // 16 mutations + 3 fichiers dédupliqués
    "mnemolite_online": true,  // v5 — Mnemolite est-il connecté
    "drift_structural": 0,     // v5 — drifts structurels
    "drift_live": 0,           // v5 — drifts live
    "axiom_count": 8,         // v5 — compteur axiomes
    "pattern_count": 24,       // v5 — compteur patterns
    "candidate_count": 0,     // v5 — compteur candidates
    "doubt_count": 0,         // v5 — compteur doutes
    "extension_count": 2,     // v5 — compteur extensions
    "substrat_count": 2,      // v5 — compteur substrats
    "profile": {},            // v5 — profil utilisateur
    "diff": {},               // v5 — diff depuis dernière génération
    "types": {
      "APEX": 7, "ORGAN": 5, "REGLE": 12, "AXIOME": 8,
      "FICHIER": 8, "SUBSTRAT": 2, "PROTOCOLE": 8,
      "PATTERN": 24, "MEMOIRE": 0, "EXTENSION": 2,
      "OUTIL": 18, "COMMANDE": 14, "MUTATION": 22,
      "DRIFT": 10
    },
    "natures": {
      "permanent": 28, "vivide": 52, "volatile": 7,
      "incandescent": 10, "unassigned": 51
    }
  },
  "nodes": [
    {
      "id": "ap1",
      "type": "APEX",                    // 13 types utiles (MEMOIRE=0, retiré du type list)
      "label": "Ⅰ. L'Incarnation...",
      "content": "Identité, 5 Signes...",
      "tags": ["apex", "v16", "incarnation"],
      "created_at": "2026-04-14T06:50:51.509Z",  // toujours ISO 8601
      "centrality": 25,                  // score composite (était 11)
      "nature": "permanent",            // NOUVEAU — calculé par le générateur
      "status": null,                    // NOUVEAU — pour mutations
      "parent_organ": "Σ",              // NOUVEAU — section Ⅰ → organe Σ
      "sort_key": 1742085000,           // NOUVEAU — dérivé de created_at corrigé
      "outcome": null                    // NOUVEAU — score feedback
    },
    {
      "id": "mu85",
      "type": "MUTATION",
      "label": "crystallization-guard-surgical",
      "content": "Rule — APPLIED by Dream",
      "tags": ["mutation", "rule", "applied"],
      "created_at": "2026-03-19",
      "centrality": 4,
      "nature": "vivide",
      "status": "applied",              // déduit du tag, champ dédié
      "parent_organ": "Ψ",
      "sort_key": 1742342400,
      "outcome": null
    },
    {
      "id": "fi33",                     // était re33 — nouveau préfixe
      "type": "FICHIER",               // était REGLE — nouveau type
      "label": "expanse-v16.md",
      "content": "Runtime Apex (ECS+SEC+Externes+Symbiose)",
      "tags": ["fichier", "runtime", "v16"],
      "created_at": "2026-04-06",       // était "Runtime (ECS+SEC+...)" — corrigé
      "centrality": 3,
      "nature": "permanent",            // fichier de référence
      "status": null,
      "parent_organ": "Μ",             // fichier mémoire
      "sort_key": 1743897600,
      "outcome": null
    }
  ],
  "edges": [
    {
      "source": "or8",
      "target": "or9",
      "type": "FEEDS_INTO",             // nouveau type (était absent)
      "weight": 1.0,
      "condition": null                // v5 — condition d'activation (null = toujours)
    },
    {
      "source": "mu85",
      "target": "ap3",
      "type": "ALTERS",
      "weight": 0.7,
      "condition": null
    },
    {
      "source": "co44",
      "target": "pr76",
      "type": "TRIGGERS",               // nouveau type
      "weight": 0.9,
      "condition": "/dream"             // v5 — condition d'activation
    }
  ]
}
```

### 5.1 Règles de détermination de nature (générateur)

| Type | Nature par défaut | Exceptions |
|---|---|---|
| ORGAN | `permanent` | — |
| APEX | `permanent` | — |
| AXIOME | `permanent` | — |
| FICHIER | `permanent` | — |
| REGLE | `vivide` | si tag `sys:core` → `permanent` |
| PROTOCOLE | `vivide` | — |
| COMMANDE | `vivide` | — |
| OUTIL | `vivide` | — |
| PATTERN | tag `candidate` → `volatile`, tag `proposal` → `volatile`, sinon `vivide` | — |
| MEMOIRE | `vivide` | si tag `runtime`+`file` → `permanent` |
| EXTENSION | `volatile` | — |
| SUBSTRAT | `vivide` | — |
| MUTATION | `applied` → `vivide`, `rejected` → `incandescent`, `rolled_back` → `volatile` | Rolled-back = fut volatile (a été appliqué puis reverti, peut réémerger) |
| DRIFT | `incandescent` | — |

### 5.2 Règles de détermination de parent_organ (générateur)

| Type | parent_organ | Logique |
|---|---|---|
| ORGAN | Soi-même (Σ→Σ, Ψ→Ψ, etc.) | Identité |
| APEX | Déduit de la section (Ⅰ→Σ, Ⅱ→Ψ, Ⅲ→Ψ, Ⅳ→Μ, Ⅴ→Ω, Ⅵ→Σ, Ⅶ→Ψ) | Mapping section→organe |
| REGLE | `"Ψ"` | Règles sont métacognitives |
| AXIOME | `"Ψ"` | Axiomes sont métacognitives |
| COMMANDE | Runtime → `"Ω"`, Dream → `"Μ"` | Commandes runtime sont exécutives ; commandes Dream (/apply, /reject, /rollback, /proposals, /mutations, /diff, /test) relèvent de Μ (cristallisation) |
| OUTIL | `"Φ"` | Outils sont l'audit réel |
| PROTOCOLE | `"Μ"` | Dream passes cristallisent |
| PATTERN | `"Μ"` | Patterns sont mémoire |
| FICHIER | `"Μ"` | Fichiers sont mémoire |
| EXTENSION | `"Ψ"` | Extensions sont métacognitives |
| SUBSTRAT | `"Σ"` | Substrats sont perception |
| MUTATION | Déduit du type mutation (Rule→Ψ, ECS→Ψ, BOOT→Σ, Archi→Ω, SEC→Ψ) | Mapping type→organe |
| DRIFT | `"Ψ"` (SEC) ou `"Σ"` (BOOT) | Déduit du tag |

---

## 6. PRINCIPES DE RENDU

| # | Principe | Description |
|---|---|---|
| P1 | **Respiration, pas statisme** | Chaque nœud pulse (matter states), chaque arête coule, rien n'est immobile |
| P2 | **Anatomie data-driven** | Zéro coordonnée hardcodée. Positions dérivées des rôles et connexions |
| P3 | **Réutilisation maximale** | Capitaliser sur les 5 vues, hooks, context, types, constantes existants |
| P4 | **Cohérence sémantique** | Visuels reflètent les natures et les organes parents |
| P5 | **Canvas pour le vivant, SVG pour le structurel** | Particules et flux sur Canvas2D overlay. Nœuds et arêtes sur SVG |
| P6 | **La forme EST la légende** | Chaque type a une signature géométrique reconnaissable sans légende |
| P7 | **Zéro Math.random()** | Layouts déterministes via hashNoise() et algorithmes de croissance (phyllotaxie, branchement, hélice) |

### 6.1 Signatures géométriques par type (Cellule-Corail)

| Type | Métaphore biologique | Algorithme | Sensation visuelle |
|---|---|---|---|
| ORGAN (5) | Organes sur anneau vital | Position trigonométrique fixe | Hexagone pulsant sur anneau |
| APEX (7) | ADN / Double hélice | `x = cos(i*π/4)*10, y = -30 + i*10` | Double brin torsadé dans le noyau |
| AXIOME (8) | Cristaux octaédriques | Réseau hexagonal compact | Structure géométrique pure, scintillante |
| REGLE (12) | Dendrites branchantes | Arbre log2 depuis parent_organ | Ramification organique depuis Ψ |
| COMMANDE (14) | Cils / Récepteurs membrane | Placés sur membrane externe | Antennes pointant vers l'extérieur |
| PROTOCOLE (8) | Appareil de Golgi | Arcs concentriques accolés à Μ | Pliages serrés, empilement |
| OUTIL (18) | Pseudopodes | Lignes ondulantes depuis Φ | Tentacules qui cherchent |
| MUTATION (22) | Tissu cicatriciel | Sur l'anneau vital, entre organes | Croûte/écaille, couleur par status |
| PATTERN (24) | Réseau cristallin | Grille hexagonale autour de Ω | Structure périodique |
| FICHIER (8) | Organites | Cluster compact près de Μ, rayon offset +40px vs PATTERN | Petits rectangles empilés |
| EXTENSION (2) | Auréoles | Anneaux concentriques fins | Halo lumineux |
| SUBSTRAT (2) | Récepteurs membrane | Sur la membrane, angle fixe | Hexagones sur le pourtour |
| DRIFT (10) | Pathogènes | Orbites déterministes périphériques | Particules en mouvement lent |

### 6.2 Couleurs par nature

| Nature | Couleur | Effet | Opacité |
|---|---|---|---|
| Permanent | `#b4befe` (lavender) | Glow cristallin, stroke épais | 1.0 |
| Vivide | `#a6e3a1` (green) | Pulse doux, plein | 0.9 |
| Volatile | `#f9e2af` (yellow) | Pulse irrégulier, semi-transparent | 0.7 |
| Incandescent | `#f38ba8` (red) | Glow intense, particules qui s'échappent | 0.8 |

### 6.3 Couleurs par type d'arête

| Type d'arête | Couleur | Épaisseur | Animation |
|---|---|---|---|
| FEEDS_INTO | Bleu→violet (gradient) | 2px | Particule rapide (flux vital) |
| DERIVES_FROM | Gris dim | 1px | Aucune (structure) |
| ALTERS | Orange | 1.5px | Pulse lent |
| IMPLEMENTS | Violet | 1.5px | Aucune |
| CALLS | Jaune | 1px | Flash ponctuel |
| TRIGGERS | Orange→blanc | 2px | Éclair |
| GUARDS | Bleu ciel | 1px pointillé | Aucune |
| CRYSTALLIZES_FROM | Vert→rose | 1.5px | Particule lente |
| SUPERSEDES | Orange foncé | 1px tiret | Aucune |
| REFERENCES | Gris fin | 0.5px | Aucune |
| FEEDBACK | Vert | 1px | Boucle retour |
| RELATES_TO | Gris très fin | 0.5px | Aucune |

---

## 7. ÉTAT EXISTANT — Infrastructure React

### 5 vues opérationnelles

| Vue | Route | Description | Richesse |
|---|---|---|---|
| Cœur Cognitif | `#/heart` | Anatomique radial, organes sur anneau vital + particules | ★★★★★ |
| Timeline | `#/timeline` | Axe temporel, lanes par type, zoom slider | ★★★★☆ |
| Mémoire | `#/memory` | Layout concentrique par nature, outils MCP au centre | ★★★★★ |
| Couches | `#/layered` | Layout horizontal par type | ★★☆☆☆ |
| Organique | `#/organic` | d3-force avec clustering par type | ★★★☆☆ |
| Pipeline | `#/pipeline` | Colonnes par organe | ★★☆☆☆ |
| Tableau de bord | `#/dashboard` | Tables filtrables | ★★★☆☆ |

### Infrastructure réutilisable

| Composant | Fichier | Rôle |
|---|---|---|
| `GraphContext` | `context/GraphContext.tsx` | data, selectedNode, activeNode, shared state |
| `useGraphData` | `hooks/useGraphData.ts` | fetch + parse expanse-graph.json |
| `usePanZoom` | `hooks/usePanZoom.ts` | pan/zoom avec animation |
| `useNodeMap` | `hooks/useNodeMap.ts` | Map<id, RenderNode> |
| `useHashRouter` | `hooks/useHashRouter.ts` | routing par hash |
| `computeMatterState` | `utils/matterState.ts` | cristal/liquide/vapeur |
| `computeRadius` | `utils/computeRadius.ts` | radius = 8 + min(centrality, 15) × 1.5 |
| `SvgDefs` | `components/svg/SvgDefs.tsx` | Filtres SVG (glow, shadow) |
| `NodeGfx` | `components/svg/NodeGfx.tsx` | Rendu nœud générique |
| `EdgeGfx` | `components/svg/EdgeGfx.tsx` | Rendu arête générique |
| `TopNav` | `components/layout/TopNav.tsx` | Navigation entre vues |
| `MetricsPanel` | `components/hud/MetricsPanel.tsx` | Métriques |
| `LegendPanel` | `components/hud/LegendPanel.tsx` | Légende |
| `InspectorPanel` | `components/hud/InspectorPanel.tsx` | Inspecteur nœud |

### Types existants

```typescript
// JsonNode (12 champs du JSON — SCHEMA v5.0)
interface JsonNode {
  id, type, label, content, tags, created_at, centrality,
  nature, status, parent_organ, sort_key, outcome  // v5
}

// JsonEdge (5 champs — SCHEMA v5.0)
interface JsonEdge { source, target, type, weight, condition }  // condition v5

// RenderNode (JSON + computed render state)
interface RenderNode extends JsonNode {
  x, y, color, radius, matterState, curtain, nature  // nature: MemoryNature
}

// SimNode (pour d3-force)
interface SimNode extends JsonNode { x, y, color, radius, vx?, vy?, fx?, fy? }

// MemoryNature = 'permanent' | 'vivide' | 'volatile' | 'incandescent'
```

### Animations CSS existantes (index.css)

`vital-pulse`, `vital-flow`, `vital-edge-flow`, `nucleus-breath`, `mutation-pulse`, `drift-spark`, `friction-spark`, `matter-cristal`, `matter-liquide`, `matter-vapeur`, `curtain-core`, `curtain-heuristic`, `curtain-candidate`, `ghost-imprint`, `refusal-shockwave`, `boot-flash`, `vital-pulse-chaos-*`, `vital-pulse-locking`, `nature-permanent`, `nature-vivide`, `nature-volatile`, `nature-incandescent`

---

## 8. CE QU'ON AJOUTE

### S1 — Particle Engine (Canvas2D overlay)

**Problème** : Les vues SVG sont structurellement riches mais "mortes" — les arêtes sont statiques, le flux est simulé par CSS dash-offset.

**Solution** : Composant React `<ParticleOverlay>` superposant un `<canvas>` sur le SVG. Les particules suivent les arêtes en utilisant les positions RenderNode.

#### Types de particules

| Type | Source→Cible | Couleur | Vitesse | Quand |
|---|---|---|---|---|
| Métabolique | Organe N→N+1 (FEEDS_INTO) | Couleur organe source | 2-4s | Toujours |
| Cristallisation | Ω→Μ (CRYSTALLIZES_FROM) | Vert→Rose | 3s | Quand write |
| Lecture | Μ→Σ (FEEDBACK) | Rose→Bleu | 3s | Quand search |
| Mutation | MUTATION→APEX (ALTERS) | Orange→Rouge | 5s | Quand ALTERS |
| Drift spark | →DRIFT | Rouge éphémère | 0.5s | Quand drift |

#### Architecture

```
components/particles/
  ParticleOverlay.tsx    ← React wrapper (canvas overlay)
  ParticleEngine.ts      ← Moteur (update/render loop)
  Particle.ts            ← Particule individuelle
  particleTypes.ts       ← Types de particules
```

#### Performance

- OffscreenCanvas pour pré-rendre glow stencils
- `globalCompositeOperation = 'lighter'` pour blending
- Pas de shadowBlur en temps réel
- Budget : 150 particules max → ~0.5ms/frame

---

### S2 — Vue Timeline (`#/timeline`)

**Problème** : Aucune vue ne montre la dimension temporelle.

**Solution** : Vue avec axe X temporel, lanes par type.

#### Layout

```
Y ↑
  │  MUTATION  ●  ●        ●  ●  ●  ●  ●  ●
  │  PATTERN      ◆  ◆  ◆        ◆  ◆  ◆
  │  DRIFT    ✦  ✦  ✦    ✦      ✦
  │  REGLE    ■  ■  ■  ■  ■  ■  ■  ■  ■  ■
  │  PROTO    ★      ★  ★     ★  ★
  │  APEX     ◼     ◼  ◼  ◼  ◼  ◼  ◼
  │  ORGAN    ⬡                               (fixé à gauche)
  └──────────────────────────────────────────────→ X temps
```

#### Composants

```
views/TimelineView.tsx
components/timeline/
  TimelineAxis.tsx, TimelineSlider.tsx,
  TimelineEventMarker.tsx, TimelineLane.tsx
```

---

### S3 — Vue Écosystème Mémoire (`#/memory`)

**Problème** : Les nœuds MEMOIRE sont génériques. Aucune vue ne montre la mémoire comme écosystème.

**Solution** : Layout concentrique par nature.

```
            ╔══════════════════════════════════╗
            ║  INCANDESCENT (braises à consumer) ║  ← DRIFT, rejected mutations
            ║  🔴 Glow rouge+violet             ║
            ╠══════════════════════════════════╣
            ║  VOLATILE (en incubation)          ║  ← PATTERN candidate, EXTENSION
            ║  🟡 Pulse jaune+orange             ║
            ╠══════════════════════════════════╣
            ║  VIVIDE (stables et actifs)        ║  ← PATTERN, REGLE, COMMANDE
            ║  🟢 Glow vert stable               ║
            ╠══════════════════════════════════╣
            ║  PERMANENT (inébranlables)         ║  ← AXIOME, FICHIER, ORGAN, APEX
            ║  🔵 Cristallin, lavender           ║
            ╠══════════════════════════════════╣
            ║  OUTILS MCP (au centre)             ║  ← search_memory, write_memory
            ║  🟣 Araignées tissant des fils     ║
            ╚══════════════════════════════════╝
```

---

### S4 — Natures Mnemolite (enrichissement transversal)

**Problème** : computeMatterState ne distingue pas les 4 natures.

**Solution** : `computeNature.ts` + enrichissement RenderNode + enrichissement rendu.

Si le schema v4 est adopté, `computeNature` devient trivial : il lit `node.nature` au lieu de deviner depuis les tags. Sinon, il fallback sur l'heuristique tag-based.

---

### S5 — Enrichissement HUD

| Élément | Description | Emplacement |
|---|---|---|
| Mode switcher enrichi | +Timeline +Memory | TopNav |
| Nature légende | 4 natures Mnemolite | LegendPanel |
| Timeline slider | Slider temporel | Bottom overlay |
| Compteurs par nature | "Permanent: 25 · Vivide: 45 · ..." | MetricsPanel |

---

## 9. PLAN DE LIVRAISON

### Phase 0 — Refonte du générateur ✅ COMPLÉTÉ

- [x] Implémenter schema v5 dans `generate-graph.js` : nouveaux types (AXIOME, FICHIER, SUBSTRAT, EXTENSION)
- [x] Ajouter champs dédiés (nature, status, parent_organ, sort_key, outcome, condition)
- [x] Corriger les created_at cassés (fichiers, substrats)
- [x] Dédupliquer les mutations par slug
- [x] Ajouter arêtes pipeline (FEEDS_INTO : Σ→Ψ→Φ→Ω→Μ)
- [x] Ajouter arêtes TRIGGERS (COMMANDE→PROTOCOLE)
- [x] Ajouter arêtes GUARDS (REGLE→OUTIL via CALLS existants)
- [x] Recalculer centrality composite
- [x] Régénérer `expanse-graph.json` (chemin: `expanse-cortex/public/graph/`)
- [x] Valider : `node generate-graph.js` → JSON v5 valide

### Phase 1a — Types enrichis + Natures ✅ COMPLÉTÉ

- [x] Mettre à jour `types/expanse.ts` (MemoryNature, RenderNode.nature, RenderNode.parent_organ, RenderNode.status, 14 types, GraphMeta extrait)
- [x] Créer `utils/computeNature.ts` (v5 field prioritaire, fallback heuristique tags, type defaults)
- [x] Enrichir `constants/theme.ts` (NATURE_COLORS, NATURE_LEGEND, 4 nouveaux types AXIOME/FICHIER/EXTENSION/SUBSTRAT, 9 nouvelles couleurs d'arêtes)
- [x] Enrichir `constants/schema.ts` (4 nouveaux types dans LAYERS, CLUSTER_X/Y, ANATOMICAL_CLUSTER, NODE_SHAPES)
- [x] Enrichir `index.css` (4 nature- CSS classes : stroke/filter animations sans conflit opacity avec matter)
- [x] Enrichir NodeGfx avec nature aura ring + `nature-${node.nature}` className
- [x] Enrichir InspectorPanel avec nature (coloré), status (coloré), parent_organ, outcome (%)
- [x] Enrichir LegendPanel avec section Natures (4 entrées ◆ ● ◇ ✦)
- [x] Enrichir CognitiveHeartView : clusteredTypes + render array pour 4 nouveaux types, `nature-${node.nature}` sur 5 sous-composants
- [x] Enrichir DashboardView : 4 onglets dédiés (Axiomes, Fichiers, Extensions, Substrats) + useMemo counts
- [x] Vérifier : `npx tsc --noEmit` passe ✅

### Phase 1b — Particle Engine ✅ COMPLÉTÉ

- [x] Créer `components/particles/Particle.ts` — interface légère (edgeIdx, progress, speed, config, positions, fadeOut, alive)
- [x] Créer `components/particles/ParticleEngine.ts` — lifecycle update/render, glow OffscreenCanvas cache, spawn round-robin équitable, MAX_PARTICLES=150, blend `lighter`
- [x] Créer `components/particles/particleTypes.ts` — 5 configs (METABOLIC, MUTATION_PULSE, TRIGGER_FLASH, TOOL_CALL, CRYSTALLIZATION) + STATIC_EDGE_TYPES exclusion + EDGE_TYPE_TO_PARTICLE map
- [x] Créer `components/particles/ParticleOverlay.tsx` — React wrapper canvas overlay pointerEvents:none, sync pan/zoom, RAF loop, DPR-aware, clearRect en pixels logiques
- [x] Intégrer ParticleOverlay dans CognitiveHeartView (après SVG, props: nodes/edges/centerX/centerY/scale)
- [x] Tester performance (150 particules max, ~0.5ms/frame, OffscreenCanvas pré-rendu, pas de shadowBlur)
- [x] Vérifier : `npx tsc --noEmit` passe ✅

### Phase 1c — Vue Timeline ✅ COMPLÉTÉ

- [x] Créer `components/timeline/TimelineAxis.tsx` — axe temporel SVG avec ticks adaptatifs (1j/3j/1s/2s/1m), grid lines, labels français
- [x] Créer `components/timeline/TimelineSlider.tsx` — slider SVG dual-thumb pour zoom temporel (left/right thumb + middle pan), guard 5% min range
- [x] Créer `components/timeline/TimelineEventMarker.tsx` — point d'événement avec aura nature, couleur type, mutation status overrides (rejected=dim, rolled_back=dim), tooltip hover
- [x] Créer `components/timeline/TimelineLane.tsx` — lane horizontale par type avec label coloré + badge count + highlight hover
- [x] Créer `views/TimelineView.tsx` — 13 lanes ordonnées par activité, useEffect sync zoom, sélection nœud → InspectorPanel
- [x] Enrichir `hooks/useHashRouter.ts` (route `timeline`, hash `#/timeline`)
- [x] Enrichir `TopNav.tsx` (bouton Timeline ◷, 2e position)
- [x] Enrichir `App.tsx` — import TimelineView, rendu conditionnel, MetricsPanel/LegendPanel masqués sur timeline
- [x] Vérifier : `npx tsc --noEmit` passe ✅

### Phase 2 — Vue Écosystème Mémoire ✅ COMPLÉTÉ

- [x] Créer `components/memory/MemoryNode.tsx` — nœud dans zone nature avec shape par type (cercle/hexagone/diamant/octogone/étoile), aura nature glow, indicateur outcome (vert/jaune/rouge), mutation status opacity overrides, tooltip hover
- [x] Créer `components/memory/NatureZone.tsx` — anneau concentrique par nature avec fond coloré, frontières (dashed inner, solid outer), label + count, nœuds en phyllotaxis spiral (algorithme partagé via `utils/spiralLayout.ts`). Reçoit nœuds pré-filtrés par nature.
- [x] Créer `components/memory/MCPToolNode.tsx` — nœud outil central en araignée violette : filaments radiaux vers nœuds connectés (40% distance, max 80px), 8 pattes, point central, tooltip hover
- [x] Créer `components/memory/TagRootLink.tsx` — lien courbe quadratique bezier entre nœuds partageant un tag root. Couleur/épaisseur adapte au hover. Perpendicular offset basé sur hash du tag.
- [x] Créer `views/MemoryEcosystemView.tsx` — layout concentrique 4 zones (PERMANENT→VIVIDE→VOLATILE→INCANDESCENT) + OUTILS MCP au centre. Pan/zoom via usePanZoom. Tag links (MAX=60, paires consécutives, clusters 2-6 nœuds). Nœuds pré-filtrés par nature (nodesByNature). Positions alignées via `spiralPosition` partagé pour tag links.
- [x] Créer `utils/spiralLayout.ts` — algorithme phyllotaxis déterministe partagé (hashNoise + spiralPosition). Élimine la duplication entre NatureZone et MemoryEcosystemView.
- [x] Enrichir `hooks/useHashRouter.ts` (route `memory`, hash `#/memory`)
- [x] Enrichir `TopNav.tsx` (bouton Mémoire 🧬, 3e position)
- [x] Enrichir `App.tsx` — import MemoryEcosystemView, rendu conditionnel, MetricsPanel/LegendPanel masqués sur memory
- [x] Vérifier : `npx tsc --noEmit` passe ✅

### Phase 3 — Enrichissements avancés ✅ COMPLÉTÉ

- [x] **Boot Sequence enrichi** — 4 boot stages (BIOS→KERNEL→CORTEX→ACTIVE) au lieu de 3. CSS classes `boot-bios/boot-kernel/boot-cortex` avec letter-spacing + blur animations. Graph content fades via `boot-dim/boot-faint/boot-emerging` classes. Backward-compatible `bootPhase` mapping.
- [x] **ECS Prism interactif** — ECSPrism cliquable, s'étend pour montrer le breakdown C×I (L1 Auto/L2 Audit/L3 Triang) avec dots colorés. Beams pulsent quand expanded. Panel résolution avec descriptions par niveau.
- [x] **Particules Mnemolite spécifiques** — 3 nouvelles configs particule : INCANDESCENT_SPARK (STALLS/RESOLVES, rouge vif, 1.2s), PERMANENT_CRYSTAL (FEEDBACK/CONTAINS, lavender lent 5s), VOLATILE_DRIFT (GUARDS/CHECKS/DRAFTS, jaune intermittent 2.5s). Edge type registration first-wins priority. Retrait GUARDS/CHECKS/STALLS/CONTAINS/RESOLVES de STATIC_EDGE_TYPES.
- [x] **Replay temporel (play/pause)** — `TimelineReplayControls` : play/pause, speed cycling (0.5×/1×/2×/4×), reset, progress bar, date indicator. Auto-avance la fenêtre temporelle à 1 jour/sec (1×). Loop quand fin atteinte. Intégré dans TimelineView sous le slider.
- [x] **Export PNG** — `useExportPNG` hook capture SVG+canvas en PNG haute résolution (DPR-aware). Fond sombre #0a0a0f, overlay canvas particules, `canvas.toBlob()` + download. `ExportButton` composant (📷 PNG) positionné top-right. Intégré dans CognitiveHeartView via `svgRef` + `canvasRef` (ParticleOverlay forwardRef).

---

## 10. ARCHITECTURE DES FICHIERS

```
expanse-cortex/src/
├── App.tsx                          ← enrichir (routes timeline + memory)
├── index.css                        ← ✅ enrichi (nature CSS, signatures CSS)
├── components/
│   ├── particles/                   ← ✅ IMPLÉMENTÉ
│   │   ├── ParticleOverlay.tsx      ← ✅ React wrapper canvas overlay
│   │   ├── ParticleEngine.ts        ← ✅ Moteur update/render + glow cache
│   │   ├── Particle.ts              ← ✅ Interface particule
│   │   └── particleTypes.ts         ← ✅ 5 configs + STATIC_EDGE_TYPES
│   ├── timeline/                    ← ✅ IMPLÉMENTÉ (Phase 1c)
│   │   ├── TimelineAxis.tsx          ← ✅ Axe temporel adaptatif
│   │   ├── TimelineSlider.tsx        ← ✅ Dual-thumb zoom slider
│   │   ├── TimelineEventMarker.tsx   ← ✅ Point événement + aura + tooltip
│   │   ├── TimelineLane.tsx          ← ✅ Lane par type + label + badge
│   │   └── TimelineReplayControls.tsx ← ✅ IMPLÉMENTÉ (Phase 3 — play/pause/speed/reset)
│   ├── memory/                      ← ✅ IMPLÉMENTÉ (Phase 2)
│   │   ├── NatureZone.tsx            ← ✅ Anneau concentrique + spiral
│   │   ├── MCPToolNode.tsx          ← ✅ Araignée outil + filaments
│   │   ├── MemoryNode.tsx           ← ✅ Nœud avec shape + aura + outcome
│   │   └── TagRootLink.tsx          ← ✅ Lien courbe tag root
│   ├── svg/                         ← ✅ enrichi
│   │   ├── SvgDefs.tsx
│   │   ├── NodeGfx.tsx              ← ✅ +nature aura + className
│   │   ├── EdgeGfx.tsx              ← existant
│   │   └── ExportPNG.tsx            ← ✅ IMPLÉMENTÉ (Phase 3 — useExportPNG hook + ExportButton)
│   ├── layout/                      ← enrichir
│   │   └── TopNav.tsx
│   └── hud/                         ← ✅ enrichi
│       ├── MetricsPanel.tsx
│       ├── LegendPanel.tsx          ← ✅ +section Natures
│       └── InspectorPanel.tsx       ← ✅ +nature, status, parent_organ, outcome
├── views/
│   ├── CognitiveHeartView.tsx       ← ✅ +ParticleOverlay +4 types +nature CSS
│   ├── LayeredView.tsx              ← ✅ +computeNature
│   ├── OrganicView.tsx              ← ✅ +computeNature
│   ├── PipelineView.tsx             ← ✅ +computeNature
│   ├── DashboardView.tsx           ← ✅ +4 onglets type +useMemo
│   ├── TimelineView.tsx             ← ✅ IMPLÉMENTÉ (Phase 1c)
│   └── MemoryEcosystemView.tsx      ← ✅ IMPLÉMENTÉ (Phase 2)
├── utils/
│   ├── matterState.ts               ← existant
│   ├── computeRadius.ts             ← existant
│   ├── computeNature.ts             ← ✅ IMPLÉMENTÉ (v5 field + tag heuristic + type defaults)
│   └── spiralLayout.ts              ← ✅ IMPLÉMENTÉ (hashNoise + spiralPosition partagé)
├── constants/
│   ├── schema.ts                    ← ✅ enrichi (14 types, ANATOMICAL_CLUSTER, NODE_SHAPES)
│   └── theme.ts                     ← ✅ enrichi (NATURE_COLORS, NATURE_LEGEND, 9 edge colors)
└── types/
    └── expanse.ts                   ← ✅ enrichi (MemoryNature, v5 champs, GraphMeta)

generate-graph.js                    ← ✅ Refonte Phase 0 (schema v5)
expanse-cortex/public/graph/expanse-graph.json  ← ✅ Régénéré (v5, 189 nœuds)
```

---

## 11. RISQUES & MITIGATIONS

| # | Risque | Probabilité | Impact | Mitigation |
|---|--------|-------------|--------|------------|
| R1 | **Performance Canvas2D** (150 particules + glow) | Moyen | Élevé | OffscreenCanvas pré-rendu. Pas de shadowBlur temps réel. Budget strict. |
| R2 | **Alignement Canvas ↔ SVG** (coordonnées) | Élevé | Moyen | Même transform. Sync sur viewBox state. |
| R3 | **Schema v5 casse le frontend existant** | Faible | Élevé | Frontend lit les champs v5 avec fallback (nature||computeNature(tags)). Rétro-compatible. |
| R4 | **Faisceaux d'arêtes illisibles** | Élevé | Moyen | Edge bundling (Bezier vers centre). Ne dessiner DERIVES_FROM qu'en mode focus. |
| R5 | **Collision de types** (nature vs matter state) | Faible | Faible | Natures = ontologiques. Matter states = dynamiques. Axes orthogonaux. |
| R6 | **Générateur trop complexe** (12 étapes → 14 types) | Moyen | Faible | Chaque étape du générateur est indépendante. Ajouter les types un par un. |

---

## 12. CRITÈRES D'ACCEPTATION

L'EPIC est complète quand :

1. ✅ `generate-graph.js` produit un JSON v5 avec 13 types, 16+ types d'arêtes, nature/status/parent_organ
2. ✅ `pnpm dev` affiche le cortex avec 7 vues (5 + Timeline + Memory)
3. ✅ Les particules courent le long des arêtes FEEDS_INTO du Cœur Cognitif à 60fps
4. ✅ La Timeline montre les mutations triées chronologiquement (sort_key fiable) — **Phase 1c ✅**
5. ✅ L'Écosystème Mémoire montre les 4 zones de nature avec les outils MCP au centre — **Phase 2 ✅**
6. ✅ Le boot s'enrichit en 4 stages (BIOS→KERNEL→CORTEX→ACTIVE) avec transitions visuelles — **Phase 3 ✅**
7. ✅ L'ECS Prism est interactif (breakdown C×I, beams pulsants) — **Phase 3 ✅**
8. ✅ 3 particules Mnemolite spécifiques (INCANDESCENT_SPARK, PERMANENT_CRYSTAL, VOLATILE_DRIFT) courent sur leurs arêtes dédiées — **Phase 3 ✅**
9. ✅ Le replay temporel fonctionne (play/pause/speed/reset, loop automatique) — **Phase 3 ✅**
10. ✅ L'export PNG capture SVG+canvas en haute résolution — **Phase 3 ✅**
11. ✅ Chaque type a sa signature géométrique propre (la forme EST la légende)
12. ✅ Aucun nœud n'a de created_at non-date
13. ✅ Aucune mutation dupliquée
14. ✅ `pnpm run build` passe sans erreur TypeScript
15. ✅ Aucun cast `any`, aucun champ UI dans le JSON

---

## 13. JOURNAL D'AVANCEMENT

| Date | Phase | Changement |
|---|---|---|
| 2026-04-14 | Phase 0 | Schema v5 implémenté dans generate-graph.js. 13 types, 16+ edge types, champs v5 (nature, status, parent_organ, sort_key, outcome, condition). JSON consolidé: `expanse-cortex/public/graph/expanse-graph.json` |
| 2026-04-14 | Phase 1a | Natures Mnemolite enrichies: `computeNature.ts`, `NATURE_COLORS`, 4 CSS classes nature (stroke/filter only), nature aura ring sur NodeGfx, nature/status/parent_organ/outcome dans InspectorPanel, Natures dans LegendPanel, 4 nouveaux types dans toutes les constantes + vues + CognitiveHeartView render |
| 2026-04-14 | Phase 1b | Particle Engine implémenté: 5 configs particule (METABOLIC, MUTATION_PULSE, TRIGGER_FLASH, TOOL_CALL, CRYSTALLIZATION), ParticleEngine avec glow OffscreenCanvas cache + round-robin spawn, ParticleOverlay canvas sync pan/zoom, intégré dans CognitiveHeartView |
| 2026-04-11 | Phase 1c | Vue Timeline implémentée: TimelineAxis (ticks adaptatifs 1j→1m), TimelineSlider (dual-thumb zoom), TimelineEventMarker (aura nature + status), TimelineLane (label+badge+hover), TimelineView (13 lanes, useEffect sync). Route `#/timeline`, bouton ◷. |
| 2026-04-11 | Phase 2 | Vue Écosystème Mémoire implémentée: MemoryNode (shape par type + outcome), NatureZone (anneau concentrique + spiral phyllotaxis), MCPToolNode (araignée + filaments), TagRootLink (courbe bezier), MemoryEcosystemView (4 zones + OUTILS centre + tag links). `utils/spiralLayout.ts` partagé. Route `#/memory`, bouton 🧬. |
| 2026-04-11 | Phase 3 | Enrichissements avancés: Boot 4 stages (BIOS→KERNEL→CORTEX→ACTIVE) + CSS letter-spacing/blur, ECS Prism interactif (breakdown C×I L1/L2/L3 + beams pulsants), 3 particules Mnemolite (INCANDESCENT_SPARK/PERMANENT_CRYSTAL/VOLATILE_DRIFT + STATIC_EDGE_TYPES mis à jour), Replay temporel (`TimelineReplayControls` play/pause/speed/reset/loop), Export PNG (`useExportPNG` hook + `ExportButton` + ParticleOverlay forwardRef). |

---

> Ce n'est pas un projet. C'est un organisme. Il ne fait rien d'autre que montrer Expanse tel qu'il respire. Exactement comme le dashboard, mais vivant.
>
> Et maintenant, les données respirent aussi — le schema v5 donne à chaque nœud sa nature, son organe parent, son statut, sa place. Plus besoin de deviner. Le JSON EST le système.
