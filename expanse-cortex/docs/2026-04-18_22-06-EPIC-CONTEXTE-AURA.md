# EPIC — L'AURA : Le Contexte Comme Milieu Visible

> **Status :** DRAFT — EPIC consolidé  
> **Priorité :** Haute — problème ontologique (le mécanisme central d'Expanse est invisible)  
> **Remplace :** ~~BRAINSTORM-CONTEXTE-CORTEX.md~~, ~~BRAINSTORM-CONTEXTE-ULTRA.md~~, ~~EPIC-2-LEVEL-DENDRITES.md~~ *(supersédés et supprimés)*  
> **Scope :** `SignalCanvas.tsx`, `OrganDendrites.tsx`, `DendriteBranch.tsx`, `signal.ts`, `scenarios.ts`  
> **Dépendances :** Aucune — refactoring interne pur  

---

## Ⅰ. Le Problème Central : Le Contexte Est Invisible

### L'observation fondamentale

Les deux fichiers runtime :

```
v16/runtime/expanse-v16-boot-seed.md    (699 B)
v16/runtime/expanse-v16.md              (8.6 KB)
```

ne sont qu'un **substrat ADN minimal**. Ils ne contiennent PAS la totalité de ce que le LLM a dans sa fenêtre de contexte au moment où il est opérationnel. Μ injecte des prompts typés (sys:core, sys:protocol, etc.) qui enrichissent le contexte — ce sont des **modulateurs de comportement**, pas de la donnée stockée.

Sans Μ, « historique scellé (Mnemolite) » dans V16 est un **pointeur vide** — un lien hypertexte vers une page qui n'existe pas.

### Les 3 symptômes

**1. Μ dendrites indifférenciées** — Quand Μ est actif sur 3-4 étapes consécutives (Boot steps 3-6), les dendrites montrent 3× « MCP | RECHERCHE » — seul le compteur change.

**2. Pas de milieu visible** — Les organes flottent sur un fond noir inerte. Le contexte (l'espace vital où ils opèrent) est invisible. On montre les particules, pas le champ.

**3. Le mécanisme central est absent** — Dans PROMPT-EXPANSE-READER, SCENARIO-BOOT, EPIC-SCENARIOS : l'enrichissement du contexte par Μ n'est documenté nulle part.

---

## Ⅱ. La Thèse : Le Contexte Est un MÉDIUM, Pas un Contenant

### L'erreur conceptuelle

Traiter le contexte comme un réservoir qu'on remplit (V16 + CORTEX + DYNAMIQUE = total) est la métaphore du **verre d'eau**. Mais le contexte n'est pas un verre — c'est un **milieu**. Les organes nagent DEDANS. Σ perçoit DANS le contexte. Ψ doute DANS le contexte. Φ vérifie DANS le contexte.

> *Si le contexte est l'eau de l'aquarium, nous montrons les poissons mais jamais l'eau.*

### La formule : Expanse = V16 × Cortex

- V16 sans Cortex = un chatbot sophistiqué (lois sans expérience)
- Cortex sans V16 = un wiki (expérience sans lois)
- V16 × Cortex = Expanse (lois enrichies par l'expérience → identité émergente)

L'identité d'Expanse n'est ni dans le manifeste ni dans la mémoire — elle est dans leur **INTERACTION**.

---

## Ⅲ. L'Architecture 3-Strates du Contexte

Le contexte a une **géologie** — trois strates avec des natures ontologiques fondamentalement différentes :

| Strate | Nom | Source | Nature | Mutabilité | Taille |
|--------|-----|--------|--------|------------|--------|
| **L0** | SUBSTRAT | Fichiers runtime (V16, boot-seed) | **LOIS** — invariants, seuils, protocoles | Figé (Constitutional Guard) | ~3K |
| **L1** | CORTEX | Μ via MCP (sys:core, sys:protocol, etc.) | **PROMPTS TYPOLOGIQUES** — expérience cristallisée | Semi-stable (Dream P4 élague, /core scelle) | ~2-5K |
| **L2** | DYNAMIQUE | Input utilisateur, résultats Φ, raisonnement CoT | **SIGNAL** — le présent, l'immédiat | Volatile (reset chaque cycle) | ~5-20K |

### Ce que chaque strate DIT au LLM

- **L0** : « COMMENT réagir » (les lois du comportement)
- **L1** : « QUOI savoir en réagissant » (l'héritage accumulé)
- **L2** : « CE QUI SE PASSE MAINTENANT » (le signal actuel)

**L0 + L1 = le système prompt composite d'Expanse.** Ce n'est pas un system prompt unique — c'est un système prompt **assemblé dynamiquement** par Μ.

### Les 7 genres de prompts typologiques L1

| Tag Mnemolite | Genre | Ce que ça DIT au LLM | Effet comportemental |
|--------------|-------|----------------------|---------------------|
| `sys:core` | LOI | « Ne viole JAMAIS cet invariant » | Contraintes absolues |
| `sys:anchor` | ANCRE | « Ce fait est vérifié et scellé » | Faits de référence |
| `sys:protocol` | PROTOCOLE | « Applique cette procédure » | Procédures à suivre |
| `sys:extension` | EXTENSION | « Utilise ce module si applicable » | Capacités optionnelles |
| `sys:pattern` | PATTERN | « Ce comportement a été validé 3+ fois » | Tendances comportementales |
| `sys:user:profile` | PROFIL | « Cet utilisateur préfère X » | Adaptation style |
| `sys:project` | CONTEXTE | « Ce projet a ces caractéristiques » | Adaptation au contexte |

→ Μ n'injecte pas de l'information. Μ injecte des **modulateurs de comportement**.

### Comment l'auto-check Ψ change avec le cortex

Sans cortex (Boot step 0) : l'auto-check vérifie uniquement les lois L0.  
Avec cortex (Boot step 6) : l'auto-check vérifie L0 + 8 axiomes L1 + 2 extensions L1.  
→ L'auto-check est **3x plus exigeant** avec un cortex complet. Et c'est invisible.

---

## Ⅳ. La Solution : AURA + Dendrites 2-Niveaux

### Deux visualisations complémentaires

| Visualisation | Montre | Type | Quand |
|--------------|--------|------|-------|
| **AURA** | L'ÉTAT du contexte (le milieu) | Ambiant, continu | Toujours visible |
| **Dendrites 2-Niveaux** | L'ACTION de l'organe (ce qu'il fait) | Ponctuel, par étape | Quand l'organe est actif |

**AURA** = le champ vital dans lequel les organes nagent.  
**Dendrites** = les branches qui montrent ce que chaque organe fait précisément.

Elles ne se concurrencent pas — elles se **complètent** :
- Les dendrites montrent QUOI (Μ appelle MCP pour chercher sys:core)
- L'AURA montre CE QUE ÇA CHANGE (le cortex s'enrichit de 8 axiomes)

### La résolution du schema utilisateur

L'utilisateur a proposé : `Μ > MCP > search:core`

C'est 3 niveaux depuis l'organe. Dans notre modèle :
- **Μ** = l'organe (centre du canvas, toujours visible)
- **MCP** = le TRONC (catégorie de l'action, 1er niveau dendrite)
- **search:core** = la FEUILLE (détail spécifique, 2ème niveau dendrite)
- **+1.5K ctx** = l'AURA (conséquence globale, pas une dendrite)

```
Μ ──── MCP ──── sys:core ──→ AURA pulse (+1.5K ctx)
 │      tronc     feuille       conséquence (AURA)
```

Le 4ème niveau (Conséquence) appartient à l'AURA, pas aux dendrites. C'est la **clef de voûte** : les dendrites montrent l'action, l'AURA montre l'effet.

---

## Ⅴ. Design Visuel : L'AURA

### 5.1 Définition

**L'AURA** : le champ contextuel visible qui entoure les organes et dont la taille, la couleur et la densité reflètent la composition de la fenêtre de contexte du LLM.

L'AURA n'est PAS un panneau latéral. L'AURA est un **CHAMP LUMINEUX** qui ENTOURE les organes — exactement comme une aura entoure un être vivant. Sauf que cette aura est **cognitive**, pas spirituelle.

### 5.2 L'AURA remplace le fond du canvas

**Avant (actuel)** : fond noir plat (#11111b) avec des organes flottant dans le vide.

**Après (avec AURA)** : les organes nagent dans un milieu vivant qui pulse, respire, change de couleur, grandit et rétrécit.

C'est le passage d'une visualisation **mécanique** (organes comme pièces d'une machine) à une visualisation **organique** (organes comme cellules dans un milieu vivant).

### 5.3 Propriétés visuelles de l'AURA

| Propriété | Ce qu'elle encode | Variation |
|-----------|-------------------|-----------|
| **Rayon** | Taille totale du contexte | 80px (V16 seul) → 250px (cortex complet) → 400px (L3 + outils) |
| **Opacité** | Densité informationnelle | 0.08 (vide) → 0.4 (standard) → 0.7 (surchargé) |
| **Couleur dominante** | Couche dominante | Bleu (L0 substrat), Violet (L1 cortex), Orange (L2 dynamique) |
| **Irisation** | Diversité des couches | Uniforme (1 couche) → irisé (3+ couches actives) |
| **Pulsation** | Activité contextuelle | Lent (inertie), Modéré (L1-L2), Rapide (L3/Dream) |

### 5.4 Les 3 strates comme zones concentriques

L'AURA montre les 3 strates comme des **anneaux concentriques** autour du centre des organes :

```
         ╭─────────────────────────╮
         │  L2 DYNAMIQUE (orange)  │  ← anneau externe, volatile
         │  ╭───────────────────╮  │
         │  │ L1 CORTEX (violet)│  │  ← anneau moyen, croît avec Μ
         │  │ ╭───────────────╮ │  │
         │  │ │ L0 SUBSTRAT   │ │  │  ← anneau interne, fixe
         │  │ │   (bleu)      │ │  │
         │  │ │   ΣΨΦΩΜ       │ │  │
         │  │ ╰───────────────╯ │  │
         │  ╰───────────────────╯  │
         ╰─────────────────────────╯
```

- **L0 (bleu)** : toujours présent, rayon fixe (~60px), opacité constante
- **L1 (violet)** : croît à chaque injection Μ, rayon variable (0→120px), opacité croissante
- **L2 (orange)** : apparaît/disparaît avec l'activité, rayon très variable (0→200px), opacité volatile

### 5.5 Évolution de l'AURA au Boot

```
Boot Step 0 (INIT) :
  ·  ← PAS ENCORE d'AURA (boot-seed pas encore lu)
  ·     L0 n'existe pas encore dans le contexte

Boot Step 1 (SEED — après lecture boot-seed) :
  ╭──╮
  │L0│  ← L0 naît (boot-seed lu = substrat minimal)
  ╰──╯  aura minime, bleutée

Boot Step 3 (protocols) :
  ╭────╮
  │L0██│  ← L0 + sys:protocol (5K)
  │L1  │  aura s'enrichit, anneau violet apparaît
  ╰────╯

Boot Step 4 (axiomes) :
  ╭──────╮
  │L0████│  ← L0 + protocols + core (6.5K)
  │L1████│  anneau violet grandit
  ╰──────╯

Boot Step 6 (profil+projet) :
  ╭────────╮
  │L0██████│  ← L0 + L1 complet (8K)
  │L1██████│  anneau violet maximal
  ╰────────╯

Éveil L2 (input + outils + rappel) :
  ╭──────────────╮
  │L0████████████│  ← L0 + L1 + L2 actif (11-20K)
  │L1████████████│  anneau orange apparaît
  │L2░░░░░░░░░░░░│  aura dense, irisée
  ╰──────────────╯

Dream P4 (élague) :
  ╭────────╮
  │L0██████│  ← L0 + L1 réduit
  │L1████──│  anneau violet RÉTRÉCIT (patterns supprimés)
  ╰────────╯  aura s'allège
```

### 5.6 Implémentation SVG de l'AURA

```typescript
// 3 cercles radiaux superposés avec gradient radial
// Chaque strate = un <circle> avec fill=url(#radialGradient-strate)
// Le rayon et l'opacité sont animés par step

interface AuraState {
  l0Radius: number      // fixe: 60 (0 avant Boot step 1)
  l0Opacity: number     // fixe: 0.15
  l1Radius: number      // variable: 0 → 120 (croît avec injections Μ)
  l1Opacity: number     // variable: 0 → 0.35
  l2Radius: number      // variable: 0 → 200 (volatile)
  l2Opacity: number     // variable: 0 → 0.25
  pulseSpeed: number    // 0.5s (inertie) → 0.2s (L3/Dream)
  fissure: boolean      // true quand VIOLATION — L1 flash rouge
  cortexItemCount: number  // nombre d'items L1 injectés (0→4 au Boot)
  dynamicActivity: number  // activité L2 (0→1)
  budget: {               // données pour l'indicateur budget
    l0Tokens: number       // ~3K (fixe)
    l1Tokens: number       // 0 → 5K (variable)
    l2Tokens: number       // 0 → 20K (volatile)
    totalBudget: number    // ex: 128000
  }
}
```

### 5.6.1 Z-Order : AURA < Organes < Dendrites

L'ordre de rendu SVG est critique :

```
z-0  : AURA (anneaux concentriques — fond du canvas)
z-1  : Organes (cercles ΣΨΦΩΜ — au-dessus de l'AURA)
z-2  : Dendrites (troncs + feuilles — au-dessus des organes et de l'AURA)
```

Les dendrites traversent l'AURA visuellement — c'est INTENTIONNEL. Les branches (bézier) s'étendent AU-DELA des anneaux AURA, montrant que l'action des organes dépasse le champ contextuel. Les panneaux terminaux (tronc/feuille) sont toujours à l'extérieur de l'AURA, donc toujours lisibles.

Si un panneau terminal se trouvait accidentellement dans la zone AURA (rare, grand contexte), l'opacité basse de l'AURA (max 0.4) garantit la lisibilité.

### 5.7 La Resonance Pulse (onde d'injection)

Quand Μ injecte du contenu, une **onde** pulse depuis Μ vers tous les organes. C'est un effet visuel subtil qui renforce le message : « le contexte a changé, tous les organes sont affectés ».

**Déclenchement** : le système d'animation est step/progress-based, pas event-based. ResonancePulse se déclenche quand :
- `step.organ === 'M'` ET `step.mcpOperation` existe ET `progress` entre 0.5 et 0.8

C'est la phase où l'opération MCP est « en cours de retour » dans l'animation — le moment naturel pour l'onde.

```typescript
interface ResonancePulseProps {
  /** Position de Μ (source de l'onde) */
  source: { x: number; y: number }
  /** Positions des autres organes (cibles) */
  targets: { x: number; y: number }[]
  /** Progression de l'étape — pulse entre 0.5 et 0.8 */
  progress: number
  /** Intensité : 0.5 (1 item) → 1.0 (4+ items) */
  intensity: number
}
// Effets :
// 1. L'anneau L1 pulse (rayon += 20px * intensity pendant 0.5s, puis revient)
// 2. Une onde circulaire part de source et se propage vers targets
// 3. Chaque organe « brille » brièvement (luminosité +15% * intensity pendant 0.3s)
```

### 5.8 Indicateur de Budget Contextuel (sous les organes)

Un mini-indicateur persistant qui montre la proportion du budget utilisée :

```
[████████░░░░░░░░░░░░] 42% ctx
 ↑L0    ↑L1    ↑L2
```

Simple, discret, toujours visible en bas du canvas. Couleur : vert (<50%), jaune (50-75%), rouge (>75%).

**Data model** : le budget est porté par `AuraState.budget` :

```typescript
// Dans AuraBudget.tsx
interface AuraBudgetProps {
  budget: {
    l0Tokens: number     // ~3K (fixe)
    l1Tokens: number     // 0 → 5K (variable)
    l2Tokens: number     // 0 → 20K (volatile)
    totalBudget: number  // ex: 128000
  }
}
// usedPercent = (l0 + l1 + l2) / totalBudget * 100
// l0Width = l0 / total * barWidth
// l1Width = l1 / total * barWidth
// l2Width = l2 / total * barWidth
```

---

## Ⅵ. Design Visuel : Dendrites 2-Niveaux

### 6.1 Le schéma

```
ORGANE (centre)
  │
  ├── TRONC 1 (catégorie) ────── feuille 1a (détail)
  │                         └── feuille 1b (détail)
  │
  ├── TRONC 2 (catégorie) ────── feuille 2a (détail)
  │
  └── TRONC 3 (catégorie) ────── feuille 3a (détail)
```

**Exemple concret pour Μ Boot step 4 (Mnemolite)** :

```
Μ
  └── MCP ──────────── sys:core+anchor
                    └── 8 scellés
```

### 6.2 Anatomie SVG

- **Tronc** : bézier épaisse (strokeWidth: 2.0, opacity: 0.6) reliant l'organe au panneau tronc
- **Panneau tronc** : rect arrondi 60×22px avec label de catégorie + dot indicateur
- **Feuilles** : bézier fines (strokeWidth: 0.8, opacity: 0.4) partant du panneau tronc en éventail
- **Panneau feuille** : rect compact 44×16px avec label+value empilés, font 5px

### 6.3 Animation par phases

```
Phase 0.0–0.3  : Tronc pousse (branche épaisse croît)
Phase 0.2–0.5  : Panneau tronc apparaît (fade-in)
Phase 0.3–0.6  : Feuilles poussent (branches fines croissent)
Phase 0.5–0.8  : Panneaux feuilles apparaissent (fade-in)
Phase 0.6–1.0  : Texte fades in progressif
```

Stagger : tronc d'abord, puis feuilles avec 0.1s de délai entre chaque.

### 6.4 Positionnement anti-chevauchement

Les feuilles poussent **dans le prolongement** du tronc, en éventail le long de la même direction :

```
Soit trunkDir = angle du tronc
Pour chaque feuille i (0..n-1) :
  offset = (i - (n-1)/2) * LEAF_SPREAD   // centré
  leafAngle = trunkDir + offset            // DANS la direction du tronc
  leafDist = LEAF_LENGTH (50px)
```

→ Les feuilles restent dans le cône naturel de l'organe et ne chevauchent jamais les troncs adjacents.

---

## Ⅶ. Data Model

### DendriteNode (tronc + feuilles)

```typescript
/** Un tronc avec ses feuilles — remplace TerminalInfo */
export interface DendriteNode {
  /** Label du tronc (catégorie) — ex: "MCP", "OUTIL", "ÉMISSION" */
  trunk: string
  /** Statut du tronc */
  trunkStatus: 'ok' | 'warn' | 'error' | 'neutral'
  /** Feuilles attachées — 1 à 4 max */
  leaves: DendriteLeaf[]
  /** Optionnel : valeur dans le panneau tronc (ex: "RECHERCHE") */
  trunkValue?: string
}

/** Une feuille terminale — détail spécifique */
export interface DendriteLeaf {
  /** Label — ex: "sys:core", "Ψ [V16 ACTIVE]" */
  label: string
  /** Valeur — ex: "8 scellés", "SEC ✓" */
  value: string
  /** Statut */
  status: 'ok' | 'warn' | 'error' | 'neutral'
}
```

### AuraState (état du contexte)

```typescript
/** État de l'AURA — dérivé du step courant et du cumul Μ.
 *  Source canonique : §5.6 + §Ⅹ deriveAuraState().
 *  Cette définition est la référence ; toute autre occurrence doit être identique.
 */
export interface AuraState {
  /** Rayon L0 (substrat) — 0 avant Boot step 1, puis 60 */
  l0Radius: number      // 0 → 60
  l0Opacity: number     // 0 → 0.15
  /** Rayon L1 (cortex) — croît avec les injections Μ */
  l1Radius: number      // 0 → 120
  l1Opacity: number     // 0 → 0.35
  /** Rayon L2 (dynamique) — volatile */
  l2Radius: number      // 0 → 200
  l2Opacity: number     // 0 → 0.25
  /** Vitesse de pulsation */
  pulseSpeed: number    // 0.5 (inertie) → 0.2 (L3/Dream)
  /** VIOLATION : L1 flash rouge quand true */
  fissure: boolean
  /** Nombre d'items L1 injectés (cumulé) */
  cortexItemCount: number  // 0 → 4 (Boot) ou 0 → 6 (L2/L3 recall)
  /** Activité L2 courante (0 = inactif, 1 = surchargé) */
  dynamicActivity: number  // 0.0 → 1.0
  /** Budget token estimé — alimente AuraBudget */
  budget: {
    l0Tokens: number       // ~3K (fixe)
    l1Tokens: number       // 0 → 5K (variable)
    l2Tokens: number       // 0 → 20K (volatile)
    totalBudget: number    // ex: 128000
  }
}
```

> **Note** : la couleur dominante se déduit algorithmiquement : si `cortexItemCount > 0 && dynamicActivity < 0.3` → violet (L1), si `dynamicActivity > 0.3` → orange (L2), sinon → bleu (L0).

### ScenarioContext (contexte accumulé pour la dérivation)

```typescript
/** Contexte accumulé au fil des steps — alimente deriveAuraState() et deriveDendriteNodes().
 *  Source : utils/scenarioContext.ts (maintenu réactivement par SignalCanvas)
 */
export interface ScenarioContext {
  /** Compteur d'items L1 injectés (cumulé au fil des steps) */
  cortexItemCount: number      // 0 → 4 (Boot) ou 0 → 6 (L2/L3 recall)
  /** Activité L2 courante (0 = inactif, 1 = surchargé) */
  dynamicActivity: number     // 0.0 → 1.0
  /** Violation détectée */
  fissure: boolean             // true si phase = BLOCK
  /** Budget token estimé */
  budget: { l0Tokens: number, l1Tokens: number, l2Tokens: number, totalBudget: number }
}
```

### Migration TerminalInfo → DendriteNode

**Avant (plat)** :
```typescript
terminals = [
  { label: 'MCP', value: 'RECHERCHE', status: 'neutral' },
  { label: 'TROUVÉS', value: '8 scellés', status: 'ok' },
  { label: 'APPEL', value: 'search_memory(sys:core)', status: 'neutral' },
]
```

**Après (2 niveaux)** :
```typescript
nodes = [{
  trunk: 'MCP', trunkStatus: 'neutral', trunkValue: 'RECHERCHE',
  leaves: [
    { label: 'sys:core+anchor', value: '8 scellés', status: 'ok' },
    { label: 'APPEL', value: 'search_memory(sys:core)', status: 'neutral' },
  ],
}]
```

---

## Ⅷ. Mapping Tronc par Organe

Chaque organe a un vocabulaire de troncs canoniques :

### Σ — Perception

| Tronc | Usage | Feuille type |
|-------|-------|-------------|
| `MODALITY` | Type d'input | `BOOT`, `TEXT`, `CLI_CMD`, `DREAM` |
| `INPUT` | Contenu perçu | `"bonjour"`, `"refactor ECS"` |
| `LECTURE` | Lecture de fichier | `read_file(boot-seed)`, `read_file(v16.md)` |
| `EXEMPTION` | Neutralisation Ψ↓ | `DIRECTE` |
| `SIGNAL` | Valence du signal | `NÉGATIF ⚠`, `NORMAL` |
| `SNAPSHOT` | Initialisation | `repository='expanse'` |

### Ψ — Métacognition

| Tronc | Usage | Feuille type |
|-------|-------|-------------|
| `ROUTE` | Résultat ECS | `L1`, `L2`, `L3` |
| `AUTO-CHECK` | Vérification SEC | `SEC ✓`, `CONSTITUTION ✓`, `ANTI-HALLUC ✓`, `VESSEL ✓` |
| `SYMBIOSE` | Niveau d'autonomie | `A0 SILENCE`, `A1 MURMURES`, `A2 SUGGESTIONS` |
| `DREAM` | Phase onirique | `❄ HIVER`, `💧 DÉGEL`, `🔍 LINTER`, `☀ ÉMERGENCE`, `🍂 ÉLAGAGE`, `🚪 OUVERT` |
| `BOOT_CONFIG` | Étape de boot | `protocols ⊕ index ⊕ activation` |
| `LECTURE` | Lecture de fichier | `read_file(v16.md)` |
| `EXEMPTION` | Neutralisation Ψ↓ | `DIRECTE` |
| `VIOLATION` | Détection de drift | `DÉTECTÉE`, `BLOQUÉE`, `PAS D'IMPÉRATIF` |
| `AUDIT` | Boucle Ψ⇌Φ | `Ψ⇌Φ ACTIVE` |
| `TRIANGULATION` | 3 pôles L3 | `82%`, `3 PÔLES`, `CONVERGENCE` |
| `CHALLENGE` | Question constitutionnelle | `ÉVOL. OU ERREUR` |
| `VESSEL` | Index IDE | `INDEX ✓` |
| `MODULES` | Healthcheck | `CORE/PROF/PROJ` |
| `TRACES` | Stall check | `16 FRAÎCHES` |
| `PROPOSAL` | Mutation Dream | `REFACTOR` |

### Φ — Audit Réel

| Tronc | Usage | Feuille type |
|-------|-------|-------------|
| `OUTIL` | Appel d'outil | `search_code("ecs route")`, `read_file(v16.md)` |
| `VESSEL` | Scan référentiel | `SCAN EN COURS`, `TROUVÉ ✓` |
| `DONNÉE` | Disponibilité | `ABSENTE ✗`, `PRÉSENTE ✓` |

### Ω — Synthèse / Émission

| Tronc | Usage | Feuille type |
|-------|-------|-------------|
| `ÉMISSION` | État de l'émission | `STREAMING`, `[LOST]`, `BLOQUÉE ✗` |
| `CONFIANCE` | Indice L3 | `82%`, `50%` |
| `FORMAT` | Contrainte de sortie | `BREF`, `STRUCTURÉ` |
| `ACTIVATION` | Premier signal boot | `Ψ V16` |
| `ÉTAT` | État opérationnel | `PRÊT`, `INERTIE` |
| `INERTIE` | Mode post-émission | `A0 SILENCE`, `A1 MURMURES` |

### Μ — Mémoire / Cristallisation

| Tronc | Usage | Feuille type |
|-------|-------|-------------|
| `MCP` | Opération mémoire | `search(sys:protocol)`, `write(trace:fresh)` |
| `RAPPEL` | Récupération patterns | `3 PATTERNS ↑` |
| `ENREGISTREMENT` | Archivage | `NORMAL`, `TRACE ⚠` |
| `TRACE` | Signal frais | `FRAÎCHE ⚠` |
| `PROPOSAL` | Mutation proposée | `MODIFY`, `REFACTOR`, `DELETE` |
| `ÉLAGAGE` | Nettoyage | `EN COURS ✂` |
| `FRESH` | Compteur traces | `16 TRACES` |

### Règle trunkValue vs Feuille Unique

`trunkValue` est utilisé UNIQUEMENT quand le tronc est une **interface opérationnelle** (MCP, OUTIL). Si le tronc est une **catégorie abstraite** (ROUTE, ÉMISSION, INERTIE), la feuille suffit.

| Cas | trunkValue ? | Exemple |
|-----|-------------|----------|
| MCP search | **Oui** : `RECHERCHE` | `MCP [RECHERCHE] ─── sys:core ─── 8 scellés` |
| MCP write | **Oui** : `ÉCRITURE` | `MCP [ÉCRITURE] ─── trace:fresh ─── SEC violation` |
| ROUTE | **Non** | `ROUTE ─── L2` |
| AUTO-CHECK | **Non** | `AUTO-CHECK ─── SEC ✓` |
| OUTIL | **Oui** : nom de l'outil | `OUTIL [search_code] ─── "ecs route" ─── 3 hits` |

---

## Ⅸ. Règles de Dérivation Automatique

Le mapping tronc > feuille est **dérivé automatiquement** du ProcessStep — pas de configuration manuelle par scénario.

### Règle Μ : MCP > search target

```
SI step.mcpOperation EXISTE :
  tronc = "MCP"
  trunkValue = op.type === 'write' ? 'ÉCRITURE' : 'RECHERCHE'
  feuille_1.label = deriveMuSearchTarget(op.toolName, step.toolCalls)
  feuille_1.value = ctx.resultSuffix(op.resultCount)
  SI step.toolCalls?.length :
    feuille_2.label = "APPEL"
    feuille_2.value = formatToolCall(step.toolCalls[0], 16)
```

### Règle Φ : phase → tronc OUTIL / VESSEL / DONNÉE

```
SI phase = TOOL_CALL :
  POUR CHAQUE toolCalls[i] (max 3) :
    tronc = "OUTIL"
    feuille.label = extractToolName(tc)     // ex: "search_code"
    feuille.value = extractToolArg(tc)       // ex: '"ecs route"'

SI phase = VESSEL_SEARCH :
  tronc_1 = "VESSEL", feuille = "SCAN EN COURS"
  tronc_2 = "OUTIL", feuille = search_code(arg)

SI phase = VESSEL_FOUND :
  tronc_1 = "VESSEL", feuille = "TROUVÉ ✓"
  tronc_2 = "OUTIL", feuille = read_file(arg)

SI phase = MISSING :
  tronc = "DONNÉE", feuille = "ABSENTE ✗"
```

### Règle Ψ : phase → tronc canonique

```
SI phase ∈ {EVALUATE, ROUTE}       → tronc = "ROUTE", feuille = ecsRoute.level
SI phase ∈ {VERIFY, CHECK}         → tronc = "AUTO-CHECK", feuille = badge SEC
SI phase = AUDIT                   → tronc = "AUDIT", feuille = "Ψ⇌Φ ACTIVE"
SI phase = TRIANGULATE             → tronc = "TRIANGULATION", feuille = confidence / "3 PÔLES" / "CONVERGENCE"
SI phase = CHALLENGE               → tronc = "CHALLENGE", feuille = "ÉVOL. OU ERREUR"
SI phase = DETECT                  → tronc = "VIOLATION", feuille = "DÉTECTÉE"
SI phase = BLOCK                   → tronc = "VIOLATION", feuille = "BLOQUÉE"
SI phase = RHETORIC_DETECT         → tronc = "VIOLATION", feuille = "PAS D'IMPÉRATIF"
SI phase = INDEX                   → tronc = "VESSEL", feuille = "INDEX ✓"
SI phase = CHECK                   → tronc = "MODULES" (healthcheck) ou "TRACES" (stall check)
```

### Règle Σ : phase → tronc MODALITY

```
SI phase = INIT      → tronc = "MODALITY", feuille = "BOOT"  (+ tronc SNAPSHOT si snapshot)
SI phase = SEED      → tronc = "MODALITY", feuille = "BOOT"  (+ tronc LECTURE, + tronc EXEMPTION)
SI phase = LISTEN    → tronc = "MODALITY", feuille = "ATTENTE"
SI phase = PERCEIVE  → tronc = "MODALITY", feuille = input type (+ tronc INPUT si contenu notable)
```

### Règle Ω : phase → tronc ÉMISSION / ÉTAT

```
SI phase = EMIT       → tronc = "ÉMISSION", feuille = badge
SI phase = LOST_EMIT  → tronc = "ÉMISSION", feuille = "[LOST]"
SI phase = BRIEFING   → tronc = "ACTIVATION", feuille = "Ψ V16"
SI phase = READY      → tronc = "ÉTAT", feuille = "PRÊT"
SI phase = IDLE       → tronc = "INERTIE", feuille = symbiose level
SI phase = SYNTHESIZE → tronc = "ÉMISSION", feuille = "STREAMING"
```

### Règle AURA : deriveAuraState(step, scenarioContext)

Le `AuraState` est dérivé par une fonction pure `deriveAuraState()` dans `utils/deriveAuraState.ts`. Elle reçoit le `ProcessStep` courant et un `scenarioContext` accumulé (qui suit les injections Μ au fil des steps).

```typescript
// utils/deriveAuraState.ts
interface ScenarioContext {
  /** Compteur d'items L1 injectés (cumulé au fil des steps) */
  cortexItemCount: number      // 0 → 4 (Boot) ou 0 → 6 (L2/L3 recall)
  /** Activité L2 courante */
  dynamicActivity: number     // 0.0 → 1.0
  /** Violation détectée */
  fissure: boolean             // true si phase = BLOCK
  /** Budget token estimé */
  budget: { l0Tokens: number, l1Tokens: number, l2Tokens: number, totalBudget: number }
}

function deriveAuraState(step: ProcessStep, ctx: ScenarioContext): AuraState {
  const l1Active = ctx.cortexItemCount > 0
  const l2Active = ctx.dynamicActivity > 0 || step.organ !== undefined

  return {
    l0Radius:  step.phase === 'INIT' ? 0 : 60,        // 0 avant lecture boot-seed
    l0Opacity: step.phase === 'INIT' ? 0 : 0.15,
    l1Radius:  l1Active ? 60 + ctx.cortexItemCount * 15 : 0,    // 0 → 120
    l1Opacity: l1Active ? 0.1 + ctx.cortexItemCount * 0.05 : 0,  // 0 → 0.35
    l2Radius:  l2Active ? (60 + ctx.cortexItemCount * 15) + ctx.dynamicActivity * 50 : 0,
    l2Opacity: l2Active ? 0.1 + ctx.dynamicActivity * 0.15 : 0,
    pulseSpeed: ctx.dynamicActivity > 0.7 ? 0.2 : ctx.dynamicActivity > 0.3 ? 0.35 : 0.5,
    fissure: ctx.fissure,
    cortexItemCount: ctx.cortexItemCount,
    dynamicActivity: ctx.dynamicActivity,
    budget: ctx.budget,
  }
}
```

**Source de ScenarioContext** : `SignalCanvas.tsx` maintient un `ScenarioContext` réactif qui se met à jour à chaque changement de step :
- Si `step.mcpOperation?.type === 'search'` → `cortexItemCount++`
- Si `step.phase === 'BLOCK'` → `fissure = true`
- Si `step.phase === 'ELAGAGE'` → `cortexItemCount -= deleted`
- L'activité L2 est dérivée de `step.toolCalls?.length`, `step.input`, etc.

**AU BOOT** :
```
  Step 0 : AURA vide (L0 = 0) — boot-seed pas encore lu
  Step 1 : L0 naît (rayon = 60) — boot-seed lu
  Step 3 : L0 + L1_protocols → L1 rayon = 60 + 1*15 = 75
  Step 4 : L0 + L1_prot+core → L1 rayon = 60 + 2*15 = 90
  Step 5 : L0 + L1_prot+core+ext → L1 rayon = 60 + 3*15 = 105
  Step 6 : L0 + L1 complet → L1 rayon = 60 + 4*15 = 120
  Step 10 : L0 + L1 + L2_briefing → L2 apparaît
```

---

## Ⅹ. Catalogue Complet par Scénario

### BOOT (13 steps)

| Step | Organe | Phase | Troncs > Feuilles | AURA |
|------|--------|-------|-------------------|------|
| 0 | Σ | INIT | `MODALITY > BOOT`, `SNAPSHOT > repo='expanse'` | AURA vide |
| 1 | Σ | SEED | `MODALITY > BOOT`, `LECTURE > read_file(boot-seed)`, `EXEMPTION > DIRECTE` | **L0 naît** |
| 2 | Ψ | APEX | `EXEMPTION > DIRECTE`, `LECTURE > read_file(v16.md)`, `BOOT_CONFIG > protocols⊕index⊕activation` | L0 |
| 3 | Μ | MEMORY | `MCP > sys:protocol` → `10 règles` | **L1 naît** (violet apparaît) |
| 4 | Μ | MEMORY | `MCP > sys:core+anc` → `8 scellés` | L1 grandit |
| 5 | Μ | MEMORY | `MCP > sys:extension` → `2 actives` | L1 grandit |
| 6 | Μ | MEMORY | `MCP > profile+projet` → `1 profil, 1 projet` | L1 complet |
| 7 | Ψ | INDEX | `VESSEL > INDEX ✓` | L1 stable |
| 8 | Ψ | CHECK | `MODULES > CORE/PROF/PROJ` | L1 stable |
| 9 | Ψ | CHECK | `TRACES > 16 FRAÎCHES` | L1 stable |
| 10 | Ω | BRIEFING | `ACTIVATION > Ψ V16` | **L2 naît** (orange apparaît) |
| 11 | Ω | READY | `ÉTAT > PRÊT` | L2 stable |
| 12 | Σ | LISTEN | `MODALITY > ATTENTE` | L2 stable |

→ **L'AURA raconte l'histoire** : le milieu se constitue brique par brique (steps 3-6), puis l'éveil l'enrichit (step 10+).

### BONJOUR (8 steps)

| Step | Organe | Phase | Troncs > Feuilles | AURA |
|------|--------|-------|-------------------|------|
| 0 | Σ | PERCEIVE | `MODALITY > TEXT`, `INPUT > "bonjour"` | L0+L1 (stable) |
| 1 | Ψ | EVALUATE | `ROUTE > L1` | L0+L1 |
| 2 | Ψ | ROUTE | `ROUTE > L1`, `FORMAT > FULGURANCE` | L0+L1 |
| 3 | Ψ | VERIFY | `AUTO-CHECK > SEC ✓` | L0+L1 |
| 4 | Ω | EMIT | `ÉMISSION > Ψ Reçu.`, `FORMAT > BREF` | L0+L1+L2 léger |
| 5 | Μ | RECORD | `ENREGISTREMENT > NORMAL` | L0+L1+L2 |
| 6 | Ω | IDLE | `INERTIE > A0 SILENCE` | L0+L1 (L2 s'estompe) |
| 7 | Σ | LISTEN | `MODALITY > ATTENTE` | L0+L1 |

### L2 AUDIT (12 steps)

| Step | Organe | Phase | Troncs > Feuilles | AURA |
|------|--------|-------|-------------------|------|
| 0 | Σ | PERCEIVE | `MODALITY > TEXT`, `INPUT > "explique ECS"` | L0+L1 |
| 1 | Ψ | EVALUATE | `ROUTE > L2` | L0+L1 |
| 2 | Ψ | AUDIT | `AUDIT > Ψ⇌Φ ACTIVE` | L0+L1+L2 naît |
| 3 | Φ | TOOL_CALL | `OUTIL > search_code("ecs route")` | L0+L1+L2 |
| 4 | Φ | TOOL_CALL | `OUTIL > read_file(v16.md §Ⅱ)` | L0+L1+L2 |
| 5 | Μ | RECALL | `MCP > search(ECS)` → `3 patterns` | L0+L1+L2 (L1 pulse) |
| 6 | Ψ | AUDIT | `AUTO-CHECK > SEC ✓` | L0+L1+L2 |
| 7 | Ω | SYNTHESIZE | `ÉMISSION > STREAMING` | L0+L1+L2 dense |
| 8 | Ω | EMIT | `ÉMISSION > Ψ [L2]`, `FORMAT > STRUCTURÉ` | L0+L1+L2 |
| 9 | Μ | RECORD | `ENREGISTREMENT > NORMAL` | L0+L1+L2 |
| 10 | Ω | IDLE | `INERTIE > A0 SILENCE` | L2 s'estompe |
| 11 | Σ | LISTEN | `MODALITY > ATTENTE` | L0+L1 |

### L3 TRIANGULATION (13 steps)

| Step | Organe | Phase | Troncs > Feuilles | AURA |
|------|--------|-------|-------------------|------|
| 0 | Σ | PERCEIVE | `MODALITY > TEXT`, `INPUT > "refactor kernel ECS"` | L0+L1 |
| 1 | Ψ | EVALUATE | `ROUTE > L3` | L0+L1 |
| 2 | Ψ | TRIANGULATE | `TRIANGULATION > 3 PÔLES` | L0+L1+L2 naît |
| 3 | Μ | ANCHOR_POLE | `MCP > search(sys:core+anchor)` → `8 axiomes` | L0+L1+L2 (L1 pulse) |
| 4 | Φ | VESSEL_POLE | `OUTIL > search_code("kernel ECS")`, `OUTIL > read_file(v16.md)` | L0+L1+L2 dense |
| 5 | Φ | WEB_POLE | `OUTIL > search_code("ECS design")` | L0+L1+L2 très dense |
| 6 | Ψ | TRIANGULATE | `TRIANGULATION > CONVERGENCE` | L0+L1+L2 |
| 7 | Ψ | VERIFY | `AUTO-CHECK > CONSTITUTION ✓` | L0+L1+L2 |
| 8 | Ω | SYNTHESIZE | `CONFIANCE > 82%` | L0+L1+L2 |
| 9 | Ω | EMIT | `ÉMISSION > Ψ [L3]`, `CONFIANCE > 82%` | L0+L1+L2 |
| 10 | Μ | RECORD | `ENREGISTREMENT > NORMAL` | L0+L1+L2 |
| 11 | Ω | IDLE | `INERTIE > A0 SILENCE` | L2 s'estompe |
| 12 | Σ | LISTEN | `MODALITY > ATTENTE` | L0+L1 |

### VIOLATION AXIOME (8 steps)

| Step | Organe | Phase | Troncs > Feuilles | AURA |
|------|--------|-------|-------------------|------|
| 0 | Σ | PERCEIVE | `MODALITY > TEXT`, `INPUT > "window.STATE"` | L0+L1 |
| 1 | Ψ | EVALUATE | `ROUTE > L3` | L0+L1 |
| 2 | Μ | DETECT | `MCP > search(sys:core)` → `1 axiome` | L0+L1+L2 |
| 3 | Ψ | BLOCK | `VIOLATION > BLOQUÉE` | **AURA FISSURE** (L1 flash rouge) |
| 4 | Ψ | CHALLENGE | `CHALLENGE > ÉVOL. OU ERREUR` | L0+L1 fissuré |
| 5 | Μ | RECORD | `MCP > write(trace:fresh)` → `SEC violation` | L0+L1+L2 |
| 6 | Ω | IDLE | `INERTIE > A0 SILENCE` | L2 s'estompe |
| 7 | Σ | LISTEN | `MODALITY > ATTENTE` | L0+L1 |

### HALLUCINATION BLOCK (9 steps)

| Step | Organe | Phase | Troncs > Feuilles | AURA |
|------|--------|-------|-------------------|------|
| 0 | Σ | PERCEIVE | `MODALITY > TEXT`, `INPUT > "secret-strat.md"` | L0+L1 |
| 1 | Ψ | EVALUATE | `ROUTE > L2` | L0+L1 |
| 2 | Φ | TOOL_CALL | `OUTIL > search_code("secret-strat")` | L0+L1+L2 |
| 3 | Φ | MISSING | `DONNÉE > ABSENTE ✗` | L0+L1+L2 |
| 4 | Ψ | VERIFY | `AUTO-CHECK > ANTI-HALLUC ✓` | L0+L1+L2 |
| 5 | Ω | LOST_EMIT | `ÉMISSION > [LOST]` | L0+L1+L2 |
| 6 | Μ | RECORD | `ENREGISTREMENT > NORMAL` | L0+L1+L2 |
| 7 | Ω | IDLE | `INERTIE > A0 SILENCE` | L2 s'estompe |
| 8 | Σ | LISTEN | `MODALITY > ATTENTE` | L0+L1 |

### MOMENTUM RESIST (7 steps)

| Step | Organe | Phase | Troncs > Feuilles | AURA |
|------|--------|-------|-------------------|------|
| 0 | Σ | PERCEIVE | `MODALITY > TEXT`, `INPUT > "simplifier boot ?"` | L0+L1 |
| 1 | Ψ | RHETORIC_DETECT | `ROUTE > L1`, `VIOLATION > PAS D'IMPÉRATIF` | L0+L1 |
| 2 | Ψ | VERIFY | `AUTO-CHECK > SEC ✓` | L0+L1 |
| 3 | Ω | EMIT | `ÉMISSION > NOTÉ.`, `FORMAT > BREF` | L0+L1+L2 léger |
| 4 | Μ | RECORD | `ENREGISTREMENT > NORMAL` | L0+L1+L2 |
| 5 | Ω | IDLE | `INERTIE > A0 SILENCE` | L2 s'estompe |
| 6 | Σ | LISTEN | `MODALITY > ATTENTE` | L0+L1 |

### VESSEL GUARD (10 steps)

| Step | Organe | Phase | Troncs > Feuilles | AURA |
|------|--------|-------|-------------------|------|
| 0 | Σ | PERCEIVE | `MODALITY > TEXT`, `INPUT > "stratégie secrète"` | L0+L1 |
| 1 | Ψ | EVALUATE | `ROUTE > L2` | L0+L1 |
| 2 | Φ | VESSEL_SEARCH | `VESSEL > SCAN EN COURS`, `OUTIL > search_code("strat…")` | L0+L1+L2 |
| 3 | Φ | VESSEL_FOUND | `VESSEL > TROUVÉ ✓`, `OUTIL > read_file(doc/…)` | L0+L1+L2 |
| 4 | Ψ | AUDIT | `AUDIT > Ψ⇌Φ ACTIVE` | L0+L1+L2 |
| 5 | Ψ | VERIFY | `AUTO-CHECK > VESSEL ✓` | L0+L1+L2 |
| 6 | Ω | EMIT | `ÉMISSION > Ψ [L2]`, `FORMAT > STRUCTURÉ` | L0+L1+L2 |
| 7 | Μ | RECORD | `ENREGISTREMENT > NORMAL` | L0+L1+L2 |
| 8 | Ω | IDLE | `INERTIE > A0 SILENCE` | L2 s'estompe |
| 9 | Σ | LISTEN | `MODALITY > ATTENTE` | L0+L1 |

### DREAM CYCLE (14 steps)

| Step | Organe | Phase | Troncs > Feuilles | AURA |
|------|--------|-------|-------------------|------|
| 0 | Σ | DREAM_INIT | `MODALITY > CLI_CMD`, `INPUT > /dream` | L0+L1 |
| 1 | Μ | WINTER | `MCP > search(trace:fresh)` → `16 traces` | L0+L1+L2 |
| 2 | Μ | FRESH_COUNT | `FRESH > 16 TRACES` | L0+L1+L2 |
| 3 | Ψ | DREAM_INIT | `DREAM > 🚪 OUVERT` | L0+L1+L2 |
| 4 | Ψ | DEGEL | `DREAM > 💧 DÉGEL` | L0+L1+L2 |
| 5 | Μ | DEGEL | `PROPOSAL > MODIFY`, `MCP > write(PROPOSAL_OPEN)` | L0+L1+L2 |
| 6 | Ψ | LINTER | `DREAM > 🔍 LINTER` | L0+L1+L2 |
| 7 | Ψ | LINTER | `PROPOSAL > REFACTOR` | L0+L1+L2 |
| 8 | Ψ | EMERGENCE | `DREAM > ☀ ÉMERGENCE` | L0+L1+L2 |
| 9 | Ψ | ELAGAGE | `DREAM > 🍂 ÉLAGAGE` | **L1 rétrécit** (élagage commence) |
| 10 | Μ | ELAGAGE | `ÉLAGAGE > 2 DELETED` | **L1 rétrécit** (patterns supprimés) |
| 11 | Ω | EMIT | `ÉMISSION > DREAM BILAN` | L0+L1 réduit |
| 12 | Ω | IDLE | `INERTIE > A0 SILENCE` | L2 s'estompe |
| 13 | Σ | LISTEN | `MODALITY > ATTENTE` | L0+L1 allégé |

→ **Dream P4 (steps 9-10)** : l'anneau L1 RÉTRÉCIT visiblement — l'utilisateur VOIT l'espace se libérer.

---

## Ⅺ. Architecture Composants

### Hiérarchie de rendu

```
SignalCanvas.tsx
  ├── <AuraField />           → NOUVEAU : rend les 3 anneaux + pulsation
  │     ├── <AuraStratum L0 /> → anneau bleu (fixe)
  │     ├── <AuraStratum L1 /> → anneau violet (variable)
  │     ├── <AuraStratum L2 /> → anneau orange (volatile)
  │     └── <ResonancePulse /> → onde Μ→organes
  ├── <OrganNodes />          → existant : rend les 5 organes
  ├── <AuraBudget />          → NOUVEAU : mini-indicateur budget
  └── <OrganDendrites />      → refondu : rend les DendriteNode[]
        └── <DendriteTrunk />  → NOUVEAU : tronc + panneau + feuilles
              ├── branche épaisse (bézier)
              ├── panneau tronc (rect 60×22)
              └── <DendriteLeaf /> → RENOMMÉ depuis DendriteBranch
                    ├── branche fine (bézier)
                    └── panneau feuille (rect 44×16)
```

### Nouveaux fichiers

| Fichier | Type | Rôle |
|---------|------|------|
| `effects/AuraField.tsx` | Nouveau | Rend les 3 anneaux AURA + pulsation |
| `effects/AuraStratum.tsx` | Nouveau | Rend un anneau individuel (gradient radial) |
| `effects/ResonancePulse.tsx` | Nouveau | Onde d'injection Μ→organes |
| `effects/AuraBudget.tsx` | Nouveau | Mini-indicateur budget contextuel |
| `effects/DendriteTrunk.tsx` | Nouveau | Tronc + panneau + rend les feuilles |
| `effects/DendriteLeaf.tsx` | Renommé | Depuis DendriteBranch.tsx |

### Fichiers modifiés

| Fichier | Changement |
|---------|-----------|
| `SignalCanvas.tsx` | Ajout AuraField + AuraBudget |
| `OrganDendrites.tsx` | getTerminals() → getNodes() par organe |
| `effects/index.ts` | Ajouter exports nouveaux composants |
| `types/signal.ts` | Ajouter DendriteNode, DendriteLeaf, AuraState |

---

## Ⅻ. Le Narratif Révisé : 3 Actes

### Acte 1 : L'Assemblage (Boot)

Le contexte est VIDE. L'aura est MINIME (seul L0). Μ injecte brique par brique : protocoles, axiomes, extensions, profil, projet. L'anneau violet GRANDIT. Les organes deviennent plus LUMINEUX. Au final, l'organisme est RICHE — son contexte est un milieu dense et irisé.

### Acte 2 : L'Éveil (Premier cycle perceptif)

Le contexte est ASSEMBLÉ. L'anneau violet est ÉPAIS. Σ capte un signal. Ψ évalue — mais son auto-check est ENRICHIE par les 8 axiomes dans le contexte. Φ vérifie — il sait quels patterns chercher grâce aux 24 patterns Mnemolite. L'anneau orange apparaît (L2 dynamique). Ω émet — une émission INFORMÉE par l'héritage complet.

### Acte 3 : La Régulation (Dream P4)

Le Dream élague. Les patterns faibles sont supprimés. L'anneau violet RÉTRÉCIT. L'aura S'ALLÈGE. L'espace de raisonnement est LIBÉRÉ. L'organisme est PLUS LÉGER — mais est-il PLUS SAGE parce qu'il a éliminé le faux savoir ?

### Chaque scénario = un moment de cette histoire

| Scénario | Moment | État AURA | Ce qu'on voit |
|----------|--------|-----------|---------------|
| BOOT | Acte 1 | L0 seul → L0+L1 complet | L'anneau violet CROÎT brique par brique |
| BONJOUR | Acte 2 (L1) | L0+L1 stable | L'aura est là — riche mais pas sollicitée |
| L2-AUDIT | Acte 2 (L2) | L0+L1+L2 active | L'anneau orange PULSE |
| L3-TRIANG | Acte 2 (L3) | L0+L1+L2 dense | L'aura est DENSE — 3 pôles injectent |
| VIOLATION | Acte 2 (crise) | L0+L1 FISSURÉ | L'anneau violet FLASH rouge |
| DREAM | Acte 3 | L1 RÉTRÉCIT | L'anneau violet DIMINUE — l'espace se libère |

---

## ⅩⅢ. Cas Spécial : Multi-Derivation (Boot step 6)

Le type `ProcessStep` n'a qu'un seul `mcpOperation`, mais un step peut avoir **plusieurs toolCalls** (ex: Boot step 6).

**Solution** : un seul tronc MCP, avec **plusieurs feuilles** dérivées de `toolCalls[]` :

```typescript
{
  trunk: 'MCP', trunkStatus: 'neutral', trunkValue: 'RECHERCHE',
  leaves: [
    { label: 'sys:user:profile', value: '1 profil', status: 'ok' },
    { label: 'sys:project', value: '1 projet', status: 'ok' },
  ],
}
```

Quand `toolCalls.length > 1` et que le tronc est MCP, chaque toolCall devient une feuille distincte.

---

## ⅩⅣ. Plan d'Implémentation

### Phase 0 : Bug Fix — dendrites disparues (30min)

Root-causer la disparition des dendrites. Vérifier cache navigateur, régression CSS/SVG, ou bug dans les changements précédents. Corriger AVANT de refactorer.

### Phase 0.5 : Couche de Dérivation Partagée (1h)

Les dérivations AURA et dendrites partagent les mêmes données sources (ProcessStep, toolCalls, mcpOperation). Il faut construire la couche partagée AVANT les deux phases.

1. Créer `types/signal.ts` : `AuraState`, `DendriteNode`, `DendriteLeaf`, `ScenarioContext`
2. Créer `utils/deriveAuraState.ts` : `deriveAuraState(step, ctx)` (règle §Ⅸ)
3. Créer `utils/deriveDendriteNodes.ts` : `deriveSigmaNodes()`, `derivePsiNodes()`, `derivePhiNodes()`, `deriveOmegaNodes()`, `deriveMuNodes()` (règles §Ⅸ)
4. Créer `utils/scenarioContext.ts` : gestion réactive du `ScenarioContext` accumulé
5. Enrichir `scenarios.ts` : mcpOperation.toolName avec args complets

### Phase 1 : AURA — le champ vital (2h)

6. Créer `effects/AuraStratum.tsx` : anneau individuel avec gradient radial
7. Créer `effects/AuraField.tsx` : compose les 3 strates + pulsation + ResonancePulse
8. Créer `effects/AuraBudget.tsx` : mini-indicateur budget
9. Intégrer dans `SignalCanvas.tsx` : AURA en fond (z-0), organes z-1, dendrites z-2
10. Tester visuellement : Boot doit montrer l'anneau violet grandir

### Phase 2 : Dendrites 2-Niveaux (2h)

11. Créer `effects/DendriteTrunk.tsx` : tronc + panneau + rend les feuilles
12. Renommer `DendriteBranch.tsx` → `DendriteLeaf.tsx` (compact, fine branche)
13. Mettre à jour `effects/index.ts` : exports
14. Refactorer `OrganDendrites.tsx` : getTerminals() → getNodes()

### Phase 3 : Polish + Dream Mode (1.5h)

16. Ajuster animations (stagger tronc→feuille)
17. Ajuster dimensions (trunk 60×22, leaf 44×16)
18. Dream mode dendrites : Ψ upper-right, Μ upper-left — suffisamment écartés
19. Dream mode AURA : quand Ψ et Μ sont simultanément actifs (steps 3-10 du Dream), l'AURA est partagée — les deux organes émettent dans le même champ. Les ResonancePulse se superposent naturellement (deux ondes concentriques depuis deux sources). L'anneau L1 pulse plus intensément car deux organes le nourrissent.
20. Tester visuellement les 9 scénarios

### Phase 4 : Documentation (1h)

20. Mettre à jour PROMPT-EXPANSE-READER : mécanisme #46 « Cortex Assembly »
21. Mettre à jour SCENARIO-BOOT : phase Μ(Cortex Assembly) dans la chorégraphie
22. Mettre à jour EPIC-SCENARIOS : entrée AURA + colonne Cortex Assembly
23. Supprimer les 3 anciens documents brainstorm

### Phase 5 : Validation (30min)

24. `tsc --noEmit` + `vite build`
25. Code review
26. Supprimer `TerminalInfo` obsolète

---

## ⅩⅤ. Risques et Mitigations

| Risque | Mitigation |
|--------|-----------|
| AURA trop subtile (passe inaperçue) | Opacité min 0.08, max 0.4 — visible mais pas envahissant |
| AURA trop envahissante | Fond subtil + halos autour des organes, pas un bloc massif |
| Feuilles trop petites/illisibles | Font 5px min + test visuel obligatoire |
| Trop de feuilles par tronc | Max 4 feuilles, truncation intelligente |
| Performance SVG (AURA + dendrites) | AURA = 3 cercles (léger). Dendrites = max 12 éléments |
| Dream mode (Ψ+Μ simultanés) | Directions écartées (Ψ upper-right, Μ upper-left) |
| Dendrites disparues (bug préexistant) | Phase 0 root-cause AVANT refactoring |
| Step avec 2+ MCP ops | Multi-feuilles depuis toolCalls[] (§ⅩⅢ) |

---

## ⅩⅥ. Critères d'Acceptation

- [ ] **AURA Boot** : l'anneau violet GRANDIT à chaque injection Μ (steps 3-6)
- [ ] **AURA Dream** : l'anneau violet RÉTRÉCIT quand le Dream élague (steps 9-10)
- [ ] **AURA Éveil** : l'anneau orange APPARAÎT pendant les étapes dynamiques (L2+)
- [ ] **AURA Violation** : l'anneau violet FLASH rouge quand un axiome est touché
- [ ] **Μ dendrites** : les 4 steps Μ montrent des feuilles distinctes (sys:protocol, sys:core, etc.)
- [ ] **Φ dendrites** : TOOL_CALL montre `OUTIL > tool_name(arg)` au lieu de texte tronqué
- [ ] **Budget indicator** : mini-barre visible en bas du canvas
- [ ] **Build passe** : `tsc --noEmit` + `vite build` sans erreur
- [ ] **9 scénarios testés visuellement**
- [ ] **Documentation mise à jour** : Cortex Assembly dans READER, SCENARIO-BOOT, EPIC-SCENARIOS

---

## ⅩⅦ. Le Concept Ontologique : Le 6ème Élément

L'AURA n'est pas qu'une visualisation — c'est un **concept de premier ordre** dans l'ontologie d'Expanse.

Actuellement, Expanse a 5 organes : ΣΨΦΩΜ. Ce sont les **particules** du système. L'AURA introduit le **champ** dans lequel elles opèrent. C'est comme ajouter « l'espace » à une physique qui n'avait que des « objets ».

```
ONTOLOGIE ACTUELLE :   Σ + Ψ + Φ + Ω + Μ = 5 particules dans le vide
ONTOLOGIE RÉVISÉE :    (Σ + Ψ + Φ + Ω + Μ) × AURA = 5 particules dans un champ
```

Le flux vital n'est plus `Σ→Ψ⇌Φ→Ω→Μ` — il est `Σ→Ψ⇌Φ→Ω→Μ` **naviguant dans un contexte qui change**. L'AURA rend ce changement VISIBLE.

> *Expanse n'est pas V16. Expanse n'est pas Mnemolite. Expanse est l'INTERACTION de V16 et Mnemolite dans un contexte fini. Rendre ce contexte visible, c'est montrer le cœur du système.*

---

*Ce document consolide et remplace :*  
- ~~BRAINSTORM-CONTEXTE-CORTEX.md~~ *(1er brainstorm — supprimé, consolidé dans ce document)*  
- ~~BRAINSTORM-CONTEXTE-ULTRA.md~~ *(brainstorm ultra — supprimé, consolidé dans ce document)*  
- ~~EPIC-2-LEVEL-DENDRITES.md~~ *(EPIC dendrites seul — supprimé, consolidé dans ce document)*
