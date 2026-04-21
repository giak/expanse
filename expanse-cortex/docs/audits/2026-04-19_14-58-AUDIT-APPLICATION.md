# Audit Complet - Application Expanse Cortex

> **Date** : 2026-04-19  
> **Version auditée** : Basée sur l'état actuel du repository

---

## Résumé Exécutif

**Score Global : 8/10**

| Catégorie | Score | Commentaire |
|-----------|-------|-------------|
| Architecture | 8/10 | Bien structurée, mais `CognitiveHeartView` monolithique (987 lignes) |
| Types | 9/10 | Excellents, unions strictes, null safety |
| Composants | 7/10 | Fonctionnels mais certains trop grands |
| Vues | 8/10 | Diversifiées, `SignalView` bien conçue |
| Données | 8/10 | Complètes, génération live depuis graphe JSON |
| Utils | 9/10 | Purs, bien testables |
| Context | 9/10 | Minimal, bien encapsulé |
| Config | 9/10 | Moderne (React 19, Vite 8, Tailwind 4) |
| Documentation | 9/10 | Très complète et précise |
| Tests | 2/10 | Absence totale de tests automatisés |

---

## 1. Architecture

### Structure des dossiers

```
src/
├── App.tsx                    # Point d'entrée, routeur hash
├── main.tsx                   # Bootstrap React
├── types/
│   ├── expanse.ts             # Types JSON (JsonNode, JsonEdge, GraphData)
│   ├── signal.ts              # Types simulation (ProcessStep, Scenario, Phase)
│   └── aura.ts                # Types AURA (AuraState, DendriteNode)
├── constants/
│   ├── phases.ts              # Phase → couleurs, labels, mappings
│   ├── theme.ts               # Palette Catppuccin Mocha
│   └── schema.ts               # Layout constants (positions, rayons)
├── context/
│   ├── GraphContext.tsx       # Contexte graphe partagé
│   └── SignalContext.tsx      # Contexte scenario AURA
├── hooks/
│   ├── useGraphData.ts        # Fetch JSON data
│   ├── useHashRouter.ts       # Hash-based routing
│   ├── useNodeMap.ts          # Node lookup map
│   ├── usePanZoom.ts          # Pan/zoom SVG
│   ├── useViewBoxZoom.ts      # ViewBox zoom (SignalView)
│   ├── useSignalPlayback.ts   # Playback state machine
│   └── useSignalSimulation.ts # Graphe → scenarios
├── utils/
│   ├── computeNature.ts       # Nature (permanent/vivide/etc)
│   ├── computeRadius.ts       # Rayon depuis centralité
│   ├── groupNodes.ts          # Groupement par type
│   ├── matterState.ts         # MatterState/Curtain
│   ├── memoryLayout.ts        # Layout MemoryEcosystemView
│   ├── organCluster.ts        # Clusters autour des organes
│   ├── organLayout.ts         # Positions organes
│   ├── positionGraphNodes.ts  # Positionnement global
│   ├── proximityBFS.ts        # BFS proximité
│   ├── scenarioContext.ts     # AURA context derivation
│   ├── shapePoints.ts         # Points SVG (hexagone, etc.)
│   ├── spiralLayout.ts        # Layout spirale
│   ├── timeRange.ts           # Utilitaires temps
│   └── visualEffects.ts       # Helper effets visuels
├── views/
│   ├── CognitiveHeartView.tsx # Vue cœur anatomique (987 lignes)
│   ├── SignalView.tsx         # Simulateur processus (207 lignes)
│   ├── MemoryEcosystemView.tsx # Vue écosystème mémoire
│   ├── TimelineView.tsx       # Vue temporelle
│   ├── DashboardView.tsx      # Dashboard
│   ├── LayeredView.tsx        # Vue en couches
│   ├── OrganicView.tsx        # Vue force-layout
│   └── PipelineView.tsx       # Vue pipeline
├── components/
│   ├── DidacticPanel.tsx      # Panneau pédagogique
│   ├── hud/                   # Panneaux HUD (Inspector, Legend, Metrics)
│   ├── layout/TopNav.tsx      # Navigation
│   ├── memory/                # Composants mémoire
│   ├── particles/             # Système particules
│   ├── signal/
│   │   ├── SignalCanvas.tsx   # Canvas principal (507 lignes)
│   │   ├── PlaybackControls.tsx
│   │   ├── ScenarioPopover.tsx
│   │   ├── StepSidebar.tsx
│   │   └── effects/           # 38 effets visuels
│   ├── svg/                   # Composants SVG (NodeGfx, EdgeGfx, etc.)
│   ├── timeline/              # Composants timeline
│   └── vitals/                # Anneau vital
└── data/
    ├── scenarios.ts           # Registre scénarios
    ├── bootDidactic.ts        # Didactique Boot
    └── ... (9 fichiers didactiques)
```

### Patterns React utilisés

| Pattern | Utilisation | Qualité |
|---------|-------------|---------|
| **Context API** | `GraphContext`, `SignalContext` | ✅ Bon - minimal prop drilling |
| **Custom Hooks** | `useSignalPlayback`, `usePanZoom`, etc. | ✅ Excellent - sépare logique/UI |
| **Compound Components** | `VitalRingTrack`, effets visuels | ✅ Bien structuré |
| **Render Props** | `ExportButton`, `ExportPNG` | ✅ Pattern correct |
| **State Machines** | `useSignalPlayback` | ✅ State machine explicite |
| **Memoization** | `useMemo`, React Compiler hints | ✅ Optimisé correctement |

### Séparation des responsabilités

**Points forts** :
- Types séparés du code (`types/*.ts`)
- Constantes centralisées (`constants/*.ts`)
- Utils purs sans side-effects (`utils/*.ts`)
- Data isolée du composant (`data/*.ts`)

**Points à améliorer** :
- `CognitiveHeartView.tsx` fait 987 lignes - trop monolithique
- Certains effets visuels répètent des patterns similaires

---

## 2. Types et Interfaces

### Types principaux

**`src/types/expanse.ts`** - Types du graphe JSON :
```typescript
interface JsonNode {
  id, type, label, content, tags, created_at, centrality
  nature, status, parent_organ, sort_key, outcome
}

interface RenderNode extends JsonNode {
  x, y, color, radius, matterState, curtain, nature
}
```

**`src/types/signal.ts`** - Types simulation :
```typescript
type Phase = 'INIT' | 'SEED' | 'APEX' | ... // 45 phases (union stricte)

interface ProcessStep {
  organ: string           // 'Σ' | 'Ψ' | 'Φ' | 'Ω' | 'Μ'
  label: string
  detail?: string
  phase?: Phase          // compile-time safety
  visualEffects?: VisualEffect[]
  ecsRoute?: { c, i, level }
  temporality?: Temporality
  packetFlows?: PacketFlow[]
  mcpOperation?: {...}
}

interface Scenario {
  id, title, route, color, steps, divergences?
}
```

### Qualité des types

| Aspect | Évaluation |
|--------|-------------|
| **Complétude** | ✅ Types couvrent tous les cas |
| **Cohérence** | ✅ Nommage cohérent (Phase, ProcessStep, Scenario) |
| **Union stricte** | ✅ `Phase` est une union stricte - typos détectés |
| **Null safety** | ✅ `status: string \| null`, `parent_organ: string \| null` |
| **Extensibilité** | ✅ `visualEffects?: VisualEffect[]` permet ajout |

### Problèmes détectés

1. **`organ` dans `ProcessStep`** est `string` - pourrait être une union `'Σ' | 'Ψ' | 'Φ' | 'Ω' | 'Μ'`
2. **Duplication** : `MatterState` et `Curtain` définis dans `types/expanse.ts` mais aussi dans `matterState.ts`

---

## 3. Composants

### Qualité du code

**Points forts** :
- Composants fonctionnels avec hooks
- Mémorisation explicite avec `useMemo`
- Props bien typées
- Séparation concerns (Canvas/Sidebar/DidacticPanel)

**Points à améliorer** :

1. **Taille des composants** :
   - `CognitiveHeartView.tsx` : 987 lignes
   - `SignalCanvas.tsx` : 507 lignes
   
   **Recommandation** : extraire des sous-composants

2. **Répétition de patterns** :
   ```tsx
   // Pattern répété dans chaque nœud
   const { opacity, scale, blur } = activeNode
     ? hopToProximityStyle(proximityMap?.get(node.id))
     : { opacity: 1, scale: 1, blur: 0 }
   ```
   
   **Recommandation** : hook `useProximityStyle(node, activeNode, proximityMap)`

3. **Effets visuels** : 38 fichiers dans `effects/` - bien que séparés, beaucoup partagent des patterns similaires (pulse, fade, etc.)

### Réutilisabilité

| Composant | Réutilisable? | Notes |
|-----------|---------------|-------|
| `SvgDefs` | ✅ Oui | Defs SVG partagées |
| `VitalRingTrack` | ✅ Oui | Utilisé dans 2 vues |
| `NodeGfx` | ✅ Oui | Nœuds génériques |
| `DidacticPanel` | ⚠️ Couplé | Lié à SignalView |
| `SignalCanvas` | ❌ Non | Très spécifique |

---

## 4. Vues

### CognitiveHeartView (987 lignes)

**Architecture** :
- Anneau vital avec 5 organes (ΣΨΦΩΜ)
- Noyau APEX au centre
- Swarm MUTATION orbital
- Nœuds DRIFT en périphérie
- Clusters autour des organes parents

**Complexité** : Élevée (CC ~45)
- Multiple états (boot, drag, focus, selection)
- Plusieurs types de nœuds avec render différents
- Animations SVG natives

**Recommandation** : Extraire :
- `OrganNode` → composant dédié
- `ApexNode` → composant dédié
- `MutationNode` → composant dédié
- `ClusterNode` → composant dédié
- `DriftNode` → composant dédié

### SignalView (207 lignes)

**Architecture** : Propre et bien séparée
- `SignalCanvas` : rendu SVG
- `StepSidebar` : informations techniques
- `DidacticPanel` : prose pédagogique
- `PlaybackControls` : contrôle du playback

**Points forts** :
- State machine `useSignalPlayback` bien encapsulée
- Context `SignalProvider` pour AURA

### MemoryEcosystemView (189 lignes)

**Architecture** : Concentrique par nature
- Outils MCP au centre
- 4 zones concentriques (permanent → incandescent)
- Tag links entre nœuds

**Problème** : Pas de zoom/pan interactif contrairement aux autres vues

---

## 5. Données

### Scénarios (9 scénarios + génération live)

**Fichiers didactiques** : 9 fichiers, un par scénario
- `bootDidactic.ts` : Concepts Boot (13 steps)
- `bonjourDidactic.ts` : Concepts L1
- `l2AuditDidactic.ts` : Concepts L2
- `l3TriangulationDidactic.ts` : Concepts L3
- `dreamCycleDidactic.ts` : Dream Cycle
- `hallucinationBlockDidactic.ts` : Blocage hallucination
- `momentumResistDidactic.ts` : Momentum/Resist
- `vesselGuardDidactic.ts` : Vessel Guard
- `violationAxiomeDidactic.ts` : Violation axiome

**Structure des données** :

```typescript
// scenarios.ts
export const BOOT_SCENARIO: Scenario = { ... }
export const SCENARIOS: Scenario[] = [...]

// Génération live depuis le graphe
function generateMutationScenario(mutation, nodes, edges): Scenario
function generateFrictionScenario(drift, nodes, edges): Scenario
function generateAxiomScenario(axiom, nodes, edges): Scenario
function generatePatternScenario(pattern, nodes, edges): Scenario
```

### Qualité des données

| Aspect | Évaluation |
|--------|-------------|
| **Couverture** | ✅ 9 scénarios couvrent Boot, L1, L2, L3, Dream, violations |
| **I18n** | ❌ Hardcodé en français - pas d'internationalisation |
| **Données live** | ✅ Génération dynamique depuis graphe JSON |
| **Glossaire** | ✅ Regex pré-compilé pour highlighting |

---

## 6. Utils

### Fonctions utilitaires

| Fichier | Fonction | Pure? | Notes |
|---------|----------|-------|-------|
| `computeNature.ts` | `computeNature()` | ✅ | Pure, détermine nature du nœud |
| `computeRadius.ts` | `computeRadius()` | ✅ | Pure, rayon depuis centralité |
| `groupNodes.ts` | `groupNodesByType()` | ✅ | Pure, groupement |
| `matterState.ts` | `computeMatterState()` | ✅ | Pure, état matière |
| `positionGraphNodes.ts` | `positionGraphNodes()` | ✅ | Pure, layout |
| `proximityBFS.ts` | `computeProximityMap()` | ✅ | Pure, BFS |
| `shapePoints.ts` | `hexPoints()`, etc. | ✅ | Pure, géométrie SVG |

### Qualité

**Points forts** :
- Fonctions pures sans side-effects
- Bien testables
- Pas de dépendances à React

**Recommandation** :
- Ajouter des tests unitaires pour les fonctions critiques (layout, BFS)

---

## 7. Context

### GraphContext

```typescript
interface GraphContextValue {
  data: GraphData | null
  error: string | null
  selectedNode: RenderNode | null
  setSelectedNode: (node: RenderNode | null) => void
  activeNode: string | null
  setActiveNode: (id: string | null) => void
  proximityMap: Map<string, number> | null
}
```

**Usage** : Partage le graphe JSON chargé, la sélection, et la proximité BFS.

### SignalContext

```typescript
interface SignalContextValue {
  scenarioCtx: ScenarioContext
  auraState: AuraState
}
```

**Usage** : Expose le contexte scénario accumulé et l'état AURA dérivé.

**Évaluation** : Bien structuré, minimal, pas de prop drilling excessif.

---

## 8. Configuration

### package.json

```json
{
  "dependencies": {
    "d3-force": "^3.0.0",
    "html2canvas": "^1.4.1",
    "react": "^19.2.5",
    "react-dom": "^19.2.5"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "vite": "^8.0.3",
    "tailwindcss": "^4.2.2",
    "eslint": "^9.39.4",
    "babel-plugin-react-compiler": "^1.0.0"
  }
}
```

**Points notables** :
- React 19.2.5 (dernière version)
- Vite 8.0.3 (rapide)
- Tailwind 4.2.2 (nouvelle syntaxe)
- React Compiler activé (optimisation automatique)
- Pas de bibliothèques d'animation (GSAP, Framer Motion) - SVG/CSS only

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Évaluation** : Configuration stricte - bonne pratique.

---

## 9. Documentation

### Fichiers de documentation

| Fichier | Contenu | Qualité |
|---------|---------|---------|
| `2026-04-15_07-52-SCHEMA.md` | Contrat JSON v5.0 | ✅ Excellent - précis |
| `2026-04-18_22-27-WORKFLOW-RUNTIME-TO-SCENARIO.md` | Pipeline 3 étapes | ✅ Excellent - détaillé |
| `2026-04-18_22-03-PROMPT-EXPANSE-READER.md` | Méta-prompt LLM | ✅ Bon |
| `2026-04-15_11-31-EPIC-SIGNAL.md` | Spec technique Signal | ✅ Très détaillé |
| `2026-04-18_22-01-EPIC-SCENARIOS.md` | Spec scénarios | ✅ Complet |
| `README.md` | Index documentation | ✅ Clair |

### Couverture fonctionnelle

D'après `2026-04-18_22-27-WORKFLOW-RUNTIME-TO-SCENARIO.md`, les fonctionnalités décrites sont implémentées :

| Fonctionnalité | Statut |
|----------------|--------|
| Types Phase (union stricte) | ✅ Implémenté |
| ProcessStep avec visualEffects | ✅ Implémenté |
| Scenario avec divergences | ✅ Implémenté |
| Didactique (prose, glossaire, anti-patterns) | ✅ Implémenté |
| AURA (3 strates L0/L1/L2) | ⚠️ Partiel (types présents, UI incomplète) |
| Dendrites par organe | ⚠️ Partiel |
| Contexte scénario accumulé | ✅ Implémenté |

---

## 10. Problèmes Potentiels

### Risques identifiés

### 1. Performance SVG
- `CognitiveHeartView` rend ~200 nœuds + edges
- Pas de virtualisation
- **Recommandation** : limiter à 500 nœuds max

### 2. Taille bundle
- 38 fichiers effets visuels
- **Recommandation** : lazy loading ou code splitting

### 3. Complexité CognitiveHeartView
- 987 lignes
- 5 types de nœuds inlines
- **Recommandation** : extraire les composants nœuds

### 4. Absence de tests
- Aucun fichier `*.test.ts` ou `*.spec.ts` détecté
- **Recommandation** : tests unitaires pour utils, tests visuels pour composants

### 5. Internationalisation
- Hardcodé français
- **Recommandation** : extraire les strings vers `i18n/*.json`

### 6. Accessibilité
- Pas d'attributs `aria-*` sur les éléments interactifs
- **Recommandation** : ajouter `aria-label`, `role`, navigation clavier

---

## 11. Améliorations Suggérées

### Priorité Haute

#### 1. Extraire les composants nœuds de `CognitiveHeartView`

```
CognitiveHeartView.tsx
├── OrganNode.tsx
├── ApexNode.tsx
├── MutationNode.tsx
├── ClusterNode.tsx
└── DriftNode.tsx
```

#### 2. Ajouter des tests

```typescript
// computeNature.test.ts
describe('computeNature', () => {
  it('returns "permanent" for axioms', () => {...})
  it('returns "vivide" for candidates', () => {...})
})

// positionGraphNodes.test.ts
describe('positionGraphNodes', () => {
  it('positions nodes in correct order', () => {...})
})
```

#### 3. Créer un hook pour la proximité

```typescript
const { opacity, scale, blur } = useProximityStyle(node, activeNode, proximityMap)
```

### Priorité Moyenne

#### 4. Lazy loading des effets visuels

```typescript
const OuvrierShadow = lazy(() => import('./effects/OuvrierShadow'))
```

#### 5. Virtualisation pour grandes listes (si >500 nœuds)

#### 6. Accessibilité

Ajouter `aria-label` sur organes, `role="button"` sur nœuds cliquables

### Priorité Basse

#### 7. Internationalisation

Extraire strings vers fichiers de langue

#### 8. Storybook

Créer des stories pour les composants visuels

---

## 12. Conformité au Workflow

D'après `2026-04-18_22-27-WORKFLOW-RUNTIME-TO-SCENARIO.md`, l'application implémente correctement :

### ✅ Implémenté

- **Pipeline 3 étapes** : Lire → Écrire → Implémenter
- **Types stricts** : `Phase` union, `ProcessStep`, `Scenario`
- **Phases et couleurs** : `PHASE_COLORS`, `ROUTE_PALETTE`
- **Didactique par scénario** : `{id}Didactic.ts` avec prose, concepts, glossaire
- **Scénarios enregistrés** : `scenarios.ts` + `SCENARIO_DIDACTIC_CONFIG`
- **Effets visuels** : 38 fichiers dans `effects/`
- **Build propre** : TypeScript strict, Vite

### ⚠️ Partiel

- **AURA cohérente** : Types présents, `auraDelta` sur steps, mais UI des anneaux incomplète
- **Dendrites dérivées** : `deriveDendriteNodes()` présent mais non intégré dans toutes les vues

### ❌ Manquant

- **Tests automatisés** : Pas de tests pour vérifier le build
- **Checklist de complétude** : Pas de CI pour valider les scénarios

---

## 13. Conclusion

### Points forts majeurs

1. **Architecture modulaire** avec séparation claire types/constants/utils/views/data
2. **TypeScript strict** avec unions type-safe (Phase) et null safety
3. **React Compiler** activé pour optimisation automatique
4. **Documentation excellente** (WORKFLOW, EPIC, SCHEMA)
5. **Pas de bibliothèques d'animation lourdes** - SVG/CSS natifs
6. **38 effets visuels** bien organisés dans un dossier dédié

### Points à améliorer prioritaires

1. **Refactoriser `CognitiveHeartView`** (987 lignes) en composants plus petits
2. **Ajouter des tests unitaires** pour les utils et composants critiques
3. **Améliorer l'accessibilité** avec aria-labels et navigation clavier
4. **Implémenter l'UI AURA complète** (3 anneaux L0/L1/L2)
5. **Intégrer les dendrites** dans toutes les vues pertinentes

### Recommandations finales

| Court terme | Moyen terme | Long terme |
|-------------|-------------|------------|
| Extraire composants nœuds | Lazy loading effets | Internationalisation |
| Tests unitaires utils | Virtualisation nœuds | Storybook |
| aria-labels | UI AURA complète | Tests visuels |

---

*Audit réalisé le 2026-04-19*