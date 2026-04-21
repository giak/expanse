# WORKFLOW : Du Runtime Expanse à sa Visualisation par Scénarios

> **Usage** : Ce document est un prompt réutilisable. Il décrit le pipeline complet pour transformer les mécanismes du runtime Expanse en scénarios animés interactifs dans le Cortex. À utiliser chaque fois qu'on souhaite visualiser un mécanisme Expanse.

---

## Le Pipeline en 3 Étapes

```
① LIRE le runtime    →    ② ÉCRIRE le scénario    →    ③ IMPLÉMENTER dans le Cortex
PROMPT-EXPANSE-READER     docs/scenarios/              src/
```

Chaque étape produit un artefact spécifique qui nourrit la suivante. Aucune étape ne peut être sautée.

---

## ① LIRE — Le Méta-Prompt Expanse Reader

**Fichier** : `docs/2026-04-18_22-03-PROMPT-EXPANSE-READER.md`  
**Rôle** : Apprendre à un LLM comment LIRE les sources runtime d'Expanse pour en extraire une description ultra-détaillée, fidèle dans ses moindres subtilités.

**Sources runtime à lire (dans cet ordre)** :

| Source | Fichier | Ce qu'elle contient |
|--------|---------|---------------------|
| L'ADN | `KERNEL.md` | Invariants absolus, ontologie, les 6 pièges |
| Le Manifeste | `v16/runtime/expanse-v16.md` | Lois opérationnelles, ECS, SEC, Boot, Cristallisation, Symbiose, Cortex Assembly |
| Le Seed | `v16/runtime/expanse-v16-boot-seed.md` | Rituel d'incarnation (4 directives) |
| Le Métabolisme | `v16/runtime/expanse-dream.md` | Auto-évolution, 8 passes, workflow mutation, impact AURA P4 |
| L'Outil de Réflexion | `v16/runtime/expanse-brm.md` | Gabarit BRM (3 sections) |
| Le Commentaire | `doc/SYNTHESE.md` | Commentaire ontologique de l'ADN (V16) |
| L'AURA (design) | `docs/2026-04-18_22-06-EPIC-CONTEXTE-AURA.md` | Contexte comme milieu visible, 3 strates L0/L1/L2, dendrites 2-niveaux, Cortex Assembly |

**Méthode (§Ⅳ du Reader)** :
1. Lire le KERNEL → comprendre les invariants
2. Lire l'Apex V16 → extraire les mécanismes avec conditions exactes
3. Lire le Seed → comprendre le rituel d'incarnation
4. Lire le Dream → comprendre l'auto-évolution
5. Lire le BRM → comprendre la réflexion adverse
6. Lire l'EPIC-CONTEXTE-AURA → comprendre le contexte comme milieu (3 strates, Cortex Assembly, dendrites)
7. Synthèse croisée → vérifier cohérence, détecter divergences

**4 Lentilles à appliquer (§Ⅲ)** :
- **Ontologique** (KERNEL/SYNTHESE) : Pourquoi ça doit être ?
- **Opérationnel** (V16/boot-seed) : Comment ça s'exécute ? (seuils, conditions exactes)
- **Évolutif** (Dream/BRM) : Comment ça mute ?
- **Contextuelle** (EPIC-CONTEXTE-AURA) : Dans quel milieu ça existe ? Chaque mécanisme opère DANS un contexte qui n'est pas un contenant passif mais un **milieu** (l'AURA). La taille et la composition du contexte (3 strates L0/L1/L2) changent qualitativement le fonctionnement de chaque organe. Un mécanisme qui enrichit le contexte (L1 croît), l'appauvrit (L1 rétrécit), ou le consomme (L2 dense) a un impact contextuel mesurable. Μ n'injecte pas de l'information — Μ injecte des **modulateurs de comportement** (7 genres L1 : LOI, ANCRE, PROTOCOLE, EXTENSION, PATTERN, PROFIL, CONTEXTE).

**Format de sortie (§Ⅷ)** — 10 sections + 2 sous-sections obligatoires :
1. Ce que c'est (une phrase)
2. Pourquoi ça doit être (Ontologique)
3. Comment ça s'exécute (Opérationnel) + sous-section **Divergences entre sources**
4. Comment ça mute (Évolutif)
5. Dans quel milieu ça existe (Contextuel) — impact sur les strates L0/L1/L2, modulateurs L1 impliqués
6. Dépendances (Amont / Latéral / Aval)
7. Préconditions cachées
8. Ce qu'un lecteur de surface raterait (anti-patterns)
9. Test de l'amputation — pour chaque organe impliqué, que se passe-t-il si on le retire ? Si l'absence ne brise rien, l'organe est décoratif, pas fonctionnel.
10. La chorégraphie (décomposition notation compressée) + sous-section **Temporalité réelle** (⚡ simultané / 🔄 conditionnel / ⏳ différé / ⏱️ séquentiel)

**Exemples travaillés** : Le Reader §Ⅺ contient deux exemples contrastés — Dream P1 (complexe, 5 organes) et Cortex Assembly (simple mais crucial, 2 organes). Voir aussi `docs/scenarios/2026-04-18_22-03-SCENARIO-BOOT.md` pour l'application au mécanisme Boot.

---

## ② ÉCRIRE — Le Document Scénario

**Répertoire** : `docs/scenarios/`  
**Rôle** : Transformer la description du Reader en un scénario pédagogique structuré, prêt à être spécifié pour l'implémentation.

**Convention de nommage** : `SCENARIO-{NOM}.md` (ex: `2026-04-18_22-03-SCENARIO-BOOT.md`)

**Le scénario alimente ensuite** : [`docs/epics/2026-04-18_22-01-EPIC-SCENARIOS.md`](./epics/2026-04-18_22-01-EPIC-SCENARIOS.md) — le document de référence qui spécifie l'implémentation de chaque scénario (steps, phases, effets visuels, didactique, types TypeScript). Ce document contient aussi des liens retours vers ce workflow pour navigation bidirectionnelle.

**Structure d'un scénario** :
- Référence au Reader (méthode suivie, sections utilisées)
- Les 10 sections + 2 sous-sections du format §Ⅷ (produites par l'étape ①)
- Vérification de complétude (§Ⅶ — 12 critères)
- Épreuve de vérité (§Ⅹ — 5 critères, dont le test de l'amputation)

**Ce que le scénario capture que le Reader ne spécifie pas** :
- Les **divergences entre sources** (reconnaissance vs bascule vs étalonnage, etc.)
- Les **préconditions cachées** et **conséquences cachées**
- La **temporalité réelle** (⚡🔄⏳⏱️) — pas la séquence de présentation
- Les **anti-patterns de lecture** (ce qu'un lecteur de surface raterait)
- L'**impact contextuel** (strates L0/L1/L2, modulateurs L1 impliqués)
- Le **test de l'amputation** (chaque organe est-il indispensable ?)

---

## ③ IMPLÉMENTER — Dans le Cortex

**Répertoire** : `src/`  
**Rôle** : Transformer le scénario en code React interactif — scénario animé, didactique, effets visuels SVG.

### Architecture du Cortex (fichiers à modifier)

| Fichier | Rôle | Quand le modifier |
|---------|------|-------------------|
| `src/types/signal.ts` | Types `ProcessStep`, `Scenario`, `Phase` (strict union), `ScenarioDidacticConfig`, `Temporality`, `Divergence` | Ajout de phases, champs ProcessStep, routes |
| `src/types/aura.ts` | Types `AuraState`, `DendriteNode`, `DendriteLeaf`, `ScenarioContext` (EPIC-CONTEXTE-AURA) | AURA + dendrites |
| `src/data/scenarios.ts` | Définition des scénarios + registre unifié `SCENARIO_DIDACTIC_CONFIG` | Chaque nouveau scénario |
| `src/data/{id}Didactic.ts` | Prose, concepts ManifestConcept[], glossaire, anti-patterns par scénario | Chaque nouveau scénario |
| `src/constants/phases.ts` | `PHASE_COLORS`, `PHASE_LABELS`, `MCP_PHASES`, `SHADOW_PHASES`, `HIGHLIGHT_*_MAP`, `ROUTE_PALETTE` | Nouvelles phases, nouvelles couleurs |
| `src/constants/theme.ts` | `ORGAN_COLORS`, `NODE_COLORS`, `EDGE_COLORS` | Si nouveau type/couleur |
| `src/utils/scenarioContext.ts` | Accumulation réactive du `ScenarioContext` pour `deriveAuraState()` + `deriveDendriteNodes()` | AURA + dendrites |
| `src/views/SignalView.tsx` | Canvas SVG + câblage des effets + scenario selector | Nouveaux effets, nouvelles phases |
| `src/components/DidacticPanel.tsx` | Panel didactique (reçoit props scenario-aware) | Si changement d'interface |
| `src/components/signal/StepSidebar.tsx` | Sidebar avec badges, temporalité, divergences | Si nouvelles fonctionnalités sidebar |
| `src/components/signal/AuraField.tsx` | Rendu SVG des 3 anneaux AURA (L0/L1/L2) | AURA |
| `src/components/signal/OrganDendrites.tsx` | Rendu des troncs dendritiques par organe | Dendrites |

### Conventions d'implémentation

1. **Phase en premier** : Ajouter au type `Phase` dans `types/signal.ts` **avant** tout le reste — typo = erreur compilation
2. **Couleurs** : `PHASE_COLORS` dans `phases.ts` + fallback `ROUTE_PALETTE` si pas de couleur explicite
3. **Effets visuels** : Ajouter au type union `ProcessStep.visualEffect` dans `types/signal.ts` + câbler dans le render SVG
4. **Scénario** : Ajouter au `SCENARIOS` array + `SCENARIO_DIDACTIC_CONFIG` dans `data/scenarios.ts`
5. **Glossaire regex** : Toujours `(?:((?<!\\w){terms}(?!\\w)))` avec flag `'gu'` — supporte Unicode (Ψ↓)
6. **Apostrophes françaises** : Dans les strings TypeScript contenant `l'`, `d'`, `n'`, `qu'` — utiliser des double quotes `""`
7. **Utils** : Les helpers de computation pure sont dans `utils/*.ts` — pas dans les composants React
8. **Dead exports** : Pas d'exports morts — `function` sans `export` pour les helpers internes

### Types clés

```typescript
type Phase = 'INIT' | 'SEED' | 'APEX' | ... // strict union — compile-time safety

interface ProcessStep {
  organ: string              // 'Σ' | 'Ψ' | 'Φ' | 'Ω' | 'Μ'
  label: string              // ce qui se passe (court)
  detail?: string            // détail technique
  badge?: string             // badge sous l'organe (ex: "ECS: C=3, I=2 → L2")
  phase?: Phase              // pilotage couleur + PhaseBanner
  duration: number           // ms (1500-2500 typique)
  isNegative?: boolean       // signal négatif / violation SEC
  visualEffect?: 'crystallize' | 'guard-shield' | 'audit-loop' | 'aura-pulse' | 'aura-fissure' | 'dendrite-inject' | 'dendrite-retract' | ...
  ecsRoute?: { c: number; i: number; level: string }
  temporality?: Temporality  // 'simultané' | 'conditionnel' | 'différé' | 'séquentiel'
  toolCalls?: string[]
  packetFlows?: PacketFlow[]
  mcpOperation?: { type: 'search' | 'write' | 'rate' | 'snapshot'; ... }
  ecsFork?: { level: 'L1' | 'L2' | 'L3'; rays: string[] }
  // --- AURA (EPIC-CONTEXTE-AURA) ---
  auraDelta?: { strate: 'L0' | 'L1' | 'L2'; action: 'born' | 'grow' | 'shrink' | 'pulse' | 'flash-red' | 'fade' }  // changement AURA provoqué par ce step
  cortexInject?: { genre: 'LOI' | 'ANCRE' | 'PROTOCOLE' | 'EXTENSION' | 'PATTERN' | 'PROFIL' | 'CONTEXTE'; source: string }  // injection Μ L1 (Cortex Assembly)
}

type Temporality = 'simultané' | 'conditionnel' | 'différé' | 'séquentiel'

interface Divergence {
  source1: string  // ex: "KERNEL §XII"
  source2: string  // ex: "V16 boot-seed"
  description: string
  resolution: string
}

interface Scenario {
  id: string
  title: string
  selectorLabel?: string     // court label + emoji pour le sélecteur
  subtitle: string
  route: ScenarioRoute
  color: string
  steps: ProcessStep[]
  divergences?: Divergence[] // divergences entre sources documentées
}
```

---

## Workflow Opérationnel — Pas à Pas

### Pour visualiser un nouveau mécanisme Expanse :

**Étape 1 — Lire avec le Reader**
```
Fournir au LLM :
- docs/2026-04-18_22-03-PROMPT-EXPANSE-READER.md (le méta-prompt)
- Le nom du mécanisme cible (ex: "Cristallisation", "Symbiose A1", "Dream Passe 3")
- Les fichiers source pertinents (KERNEL.md, V16, Dream, BRM, SYNTHESE, EPIC-CONTEXTE-AURA)

Le LLM produit :
- Une description au format §Ⅷ (10 sections + 2 sous-sections obligatoires, dont Contextuelle et Test de l'amputation)
```

**Étape 2 — Écrire le scénario**
```
1. Créer docs/scenarios/SCENARIO-{NOM}.md avec la description produite
2. Mettre à jour docs/epics/2026-04-18_22-01-EPIC-SCENARIOS.md (↔ lien bidirectionnel) :
   - Ajouter l'entrée scénario dans §Ⅳ (les 24 ÉPIQUES)
   - Spécifier : steps détaillés, phases, effets visuels, didactique, types
   - Suivre le template existant (voir ① BOOT comme référence)
```

**Étape 3 — Implémenter dans le Cortex**
```
1. Ajouter les nouvelles Phase au type union dans src/types/signal.ts
2. Ajouter les couleurs dans src/constants/phases.ts (PHASE_COLORS + ROUTE_PALETTE fallback)
3. Créer src/data/{id}Didactic.ts (prose, concepts, glossaire, anti-patterns)
4. Ajouter le scénario dans src/data/scenarios.ts (steps + SCENARIO_DIDACTIC_CONFIG)
5. Câbler les nouveaux visualEffect dans les composants SVG si nécessaire
6. Vérifier : npx tsc --noEmit && npx vite build
```

---

## Résumé Visuel

```
┌─────────────────────────────────────────────────────────────────┐
│                    PIPELINE RUNTIME → CORTEX                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ① LIRE                                                          │
│  ┌──────────────────────┐                                         │
│  │ PROMPT-EXPANSE-READER │──── Lecture des 7 sources runtime      │
│  │ (méta-prompt)         │──── 4 Lentilles (onto/opérat/évol+context)│
│  │                       │──── 9 Gardes-contre-pièges              │
│  │                       │──── Format §Ⅷ (10 sections + 2 sous)  │
│  └──────────┬───────────┘                                         │
│             │                                                     │
│             ▼                                                     │
│  ② ÉCRIRE                                                        │
│  ┌──────────────────────┐                                         │
│  │ docs/scenarios/       │──── SCENARIO-{NOM}.md                  │
│  │ 2026-04-18_22-03-SCENARIO-BOOT.md ◄───│──── Divergences, préconditions cachées  │
│  │ SCENARIO-ECS.md      │──── Temporalité réelle (⚡🔄⏳⏱️)       │
│  │ ...                   │──── Anti-patterns de lecture           │
│  └──────────┬───────────┘                                         │
│             │                                                     │
│             ▼                                                     │
│  ┌──────────────────────┐                                         │
│  │ docs/epics/           │──── 2026-04-18_22-01-EPIC-SCENARIOS.md                  │
│  │ 2026-04-18_22-01-EPIC-SCENARIOS.md     │──── Spécification d'implémentation     │
│  │                       │──── Steps, phases, effets, types TS    │
│  │     ◄─── lien ↔ ───►  │──── Navigation bidirectionnelle        │
│  └──────────┬───────────┘                                         │
│             │                                                     │
│             ▼                                                     │
│  ③ IMPLÉMENTER                                                   │
│  ┌──────────────────────┐                                         │
│  │ src/                  │──── types/signal.ts (Phase, ProcessStep)│
│  │  ├── types/           │──── types/aura.ts (AuraState, Dendrite) │
│  │  ├── data/            │──── data/scenarios.ts + {id}Didactic.ts │
│  │  ├── constants/       │──── constants/phases.ts (PHASE_COLORS)  │
│  │  ├── utils/           │──── utils/scenarioContext.ts (derive)   │
│  │  ├── components/      │──── AuraField.tsx + DidacticPanel.tsx   │
│  │  └── views/           │──── views/SignalView.tsx (canvas SVG)  │
│  └──────────────────────┘                                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Checklist de Complétude

Avant de considérer un mécanisme comme entièrement visualisé :

- [ ] **Reader appliqué** : Les 7 sources lues (runtime + EPIC-CONTEXTE-AURA), 4 lentilles appliquées (ontologique, opérationnel, évolutif, contextuelle), 9 gardes vérifiées
- [ ] **Scénario écrit** : `docs/scenarios/SCENARIO-{NOM}.md` au format §Ⅷ complet
- [ ] **EPIC mise à jour** : Entrée ajoutée dans `docs/epics/2026-04-18_22-01-EPIC-SCENARIOS.md` §Ⅳ
- [ ] **Phases ajoutées** : Type `Phase` + `PHASE_COLORS` + `ROUTE_PALETTE`
- [ ] **Didactique créée** : `src/data/{id}Didactic.ts` avec prose, concepts, glossaire
- [ ] **Scénario enregistré** : `src/data/scenarios.ts` + `SCENARIO_DIDACTIC_CONFIG`
- [ ] **Effets visuels câblés** : Nouveaux `visualEffect` dans le canvas SVG
- [ ] **AURA cohérente** : `auraDelta` sur chaque step qui modifie le contexte, `ScenarioContext` accumulé réactivement, `deriveAuraState()` alimente les 3 anneaux
- [ ] **Dendrites dérivées** : `deriveDendriteNodes()` par organe × scénario, structure Tronc > Feuille
- [ ] **Build propre** : `npx tsc --noEmit` + `npx vite build` passent sans erreur

---

*Dernière mise à jour : 2026-04-11 — Version 1.1 — AURA + Cortex Assembly*
