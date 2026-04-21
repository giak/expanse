# EPIC — Résilience Architecturelle : Patterns, Robustesse & Fiabilité

> **Σ→Ψ⇌Φ→Ω→Μ** — Face à l'immensité de la matrice, le système doit tenir.
>
> Version : 2.0 · Date : 2026-04-19 · Statut : PROPOSITION
> Périmètre : `expanse-cortex/src/` (75 TSX + 42 TS ≈ 14 600 LOC)
>
> **v2.0** : Corrigé après double-audit (cf. `expanse-cortex/docs/audits/EVALUATION-EPIC-RESILIENCE-2026-04-19.md`).
> Chiffres vérifiés contre le code réel, phases P0.5 + P5 ajoutées, recommandations d'audit intégrées.

---

## 0. Diagnostic — Pourquoi cette EPIC

Le cortex fonctionne. Les 9 scénarios tournent, les 24 effets SVG rendent, les 8 vues naviguent. Mais **sous la surface**, neuf fragilités structurelles menacent la pérennité du système :

| # | Fragilité | Symptôme | Risque |
|---|-----------|----------|--------|
| F1 | **Monolithe SignalCanvas** | 24 effets inline dans un fichier 507 lignes | Chaque ajout d'effet = risque de régression dans le canvas |
| F2 | **Zéro Error Boundary** | 1 crash SVG = écran blanc total | L'utilisateur perd tout contexte visuel |
| F3 | **Types lâches** | `organ: string`, `ecsRoute.level: string` | Les typos passent silencieusement à runtime |
| F4 | **Fetch nu** | `useGraphData` sans retry/cache/stale | 1 erreur réseau = app morte même si scénarios démo disponibles |
| F5 | **God Object ProcessStep** | 14 champs optionnels, 0 discriminated union | Chaque consommateur fait des checks conditionnels fragiles |
| F6 | **Duplication CognitiveHeartView** | 5 composants inline partageant 80% de logique | Changement de proximité = 5 endroits à modifier |
| F7 | **Zéro test** | Aucun fichier de test, aucun framework configuré | Aucune safety net contre les régressions |
| F8 | **Performance SVG** | 0 `React.memo` sur les nœuds, 0 `useMemo` sur les positions | Frame drops sur 200+ éléments SVG |
| F9 | **Accessibilité** | 0 `aria-label`, 0 `role`, 0 navigation clavier | Éléments interactifs invisibles aux lecteurs d'écran |

**Thèse** : Ces 9 fragilités ne sont pas des bugs isolés mais des **dettes structurelles** qui s'accumulent avec chaque nouvelle fonctionnalité. Le remède n'est pas du patchwork — c'est l'introduction de **design patterns** qui rendent le système _auto-résilient_ : incapable de régresser par construction.

---

## Ⅰ. Phases — Vue d'Ensemble

| Phase | Nom | Pattern | Fragilités ciblées | Priorité |
|-------|-----|---------|---------------------|----------|
| P0.5 | **Captures Visuelles** | Screenshot Regression (Playwright) | F1, F6 | 🔴 P0 |
| P0 | **Bouclier Runtime** | Error Boundary + Retry | F2, F4 | 🔴 P0 |
| P1 | **Registre des Effets** | Strategy Registry | F1 | 🟡 P1 |
| P2 | **Types Scellés** | Union Types + Type Guards | F3, F5 | 🟡 P1 |
| P3 | **Composition Nœud** | Template Method + Slot Pattern | F6 | 🟢 P2 |
| P4 | **Safety Net** | Vitest + Testing Library | F7 | 🟢 P2 |
| P5 | **Performance & Accessibilité** | React.memo + aria + lazy | F8, F9 | 🟢 P2 |

> **Note P0.5** : Avant tout refactor visuel (P1, P3), il faut capturer l'état actuel des 9 scénarios comme baseline. Sans ça, une régression visuelle (ex: ResonancePulse qui ne rend plus) passe inaperçue. *(Recommandation de l'audit — les refactors sans baseline sont du travail à l'aveugle.)*

---

## Ⅱ. Phase P0.5 — Captures Visuelles (Baseline)

> *On ne refactor pas ce qu'on ne peut pas vérifier.*

### 2.0 Problème — Refactor à l'aveugle

Les phases P1 et P3 impliquent des refactors visuels majeurs (SignalCanvas 507 lignes, CognitiveHeartView 986 lignes). Sans baseline visuelle, une régression (ex: ResonancePulse qui ne rend plus, TriPoleOrbit décalé) passe inaperçue jusqu'à ce qu'un utilisateur la signale.

**Pattern** : **Screenshot Regression Testing** — capturer l'état visuel actuel de chaque scénario comme référence, puis comparer après chaque refactor.

**Spécification** :

```bash
pnpm add -D @playwright/test
```

```typescript
// e2e/scenarios.spec.ts
import { test, expect } from '@playwright/test'

const SCENARIOS = ['boot', 'bonjour', 'l2-audit', 'l3-triangulation', 'dream']

for (const scenario of SCENARIOS) {
  test(`${scenario} scenario renders correctly`, async ({ page }) => {
    await page.goto(`http://localhost:5173/#/signal?scenario=${scenario}`)
    await page.waitForSelector('[data-testid="signal-canvas"]')
    // Attendre la fin de l'animation du premier step
    await page.waitForTimeout(2000)
    expect(await page.screenshot()).toMatchSnapshot(`${scenario}-baseline.png`)
  })
}
```

**Pré-requis** : Ajouter `data-testid="signal-canvas"` au `<svg>` dans SignalCanvas.tsx.

**Fichier nouveau** : `e2e/scenarios.spec.ts`, `playwright.config.ts`
**Fichier modifié** : `package.json` (devDependency)

**Critère** : 5+ scénarios capturés comme baseline PNG. Les snapshots sont commités dans `e2e/__snapshots__/`.

---

## Ⅲ. Phase P0 — Bouclier Runtime

> *Le système doit survivre à ses propres défaillances.*

### 2.1 Error Boundaries — Chute Contrôlée

**Problème** : Actuellement, un crash dans `ResonancePulse` tue tout le canvas SVG. Aucun Error Boundary n'existe dans le projet.

**Pattern** : **Circuit Breaker** — un composant qui encapsule chaque zone de rendement et fournit un fallback dégradé au lieu du crash total.

**Choix technique** : Utiliser [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) plutôt que des class components. Cette lib fournit `<ErrorBoundary>` fonctionnel avec `FallbackComponent`, `onError`, et `resetKeys` — aucune class component nécessaire. *(Recommandation de l'audit — les class components Error Boundaries sont un anti-pattern en React 19.)*

**Spécification** :

```
┌─ App ──────────────────────────────────────────┐
│  ┌─ ViewErrorBoundary ──────────────────────┐  │
│  │  route='signal' → SignalView             │  │
│  │  Fallback: ViewCrashRecovery              │  │
│  │    (logo + message + bouton re-nav)       │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌─ SignalView ──────────────────────────────┐  │
│  │  ┌─ EffectErrorBoundary ───────────────┐  │  │
│  │  │  <ResonancePulse />                  │  │  │
│  │  │  Fallback: null (effet invisible)    │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─ EffectErrorBoundary ───────────────┐  │  │
│  │  │  <GuardShield />                     │  │  │
│  │  │  Fallback: null                      │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

**Architecture** :

- **`ViewErrorBoundary`** — 1 par vue. Fallback : écran Catppuccin avec le logo Σ→Ψ⇌Φ→Ω→Μ, le nom de la vue crashée, et un bouton « Retour au Cœur ».
- **`EffectErrorBoundary`** — 1 par effet visuel dans le canvas. Fallback : `null` (l'effet disparaît silencieusement, le reste du canvas continue).
- **`SidebarErrorBoundary`** — Protège le StepSidebar + DidacticPanel. Fallback : panneau grisé avec « Section temporairement indisponible ».

**Fichier nouveau** : `src/components/errors/ErrorBoundaries.tsx` (wrappers autour de `react-error-boundary`)

**Principe** : Le **Cascade Failure Principle** — une erreur dans un sous-système ne doit jamais propager à un sur-système. Chaque couche a son propre bouclier.

### 2.2 Résilience Réseau — fetchWithRetry + Stale-While-Revalidate

**Problème** : `useGraphData` est un `fetch` nu. Si `/graph/expanse-graph.json` est indisponible, l'app entière affiche « Erreur: HTTP 404 ». Pourtant, les 9 scénarios démo fonctionnent indépendamment des données live.

**Pattern** : **Stale-While-Revalidate** — afficher les données en cache pendant le rechargement, et **Graceful Degradation** — les vues qui n'ont pas besoin de données live continuent de fonctionner.

**Spécification** :

```typescript
// useGraphData.ts — AVANT
useEffect(() => {
  fetch('/graph/expanse-graph.json')
    .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() })
    .then(d => setData(d))
    .catch(err => setError(err.message))  // ← mort
}, [])

// useGraphData.ts — APRÈS
interface UseGraphDataReturn {
  data: GraphData | null
  error: string | null
  status: 'idle' | 'loading' | 'ok' | 'stale' | 'error'
}

useEffect(() => {
  // 1. Charger depuis le cache immédiatement (si disponible)
  const cached = loadCachedGraph()
  if (cached) { setData(cached); setStatus('stale') }

  // 2. Revalider en arrière-plan avec retry
  fetchWithRetry('/graph/expanse-graph.json', { retries: 3, baseDelay: 800 })
    .then(d => { setData(d); cacheGraphData(d); setStatus('ok') })
    .catch(err => {
      setError(err.message)
      setStatus(cached ? 'stale' : 'error')  // stale = données en cache disponibles
    })
}, [])
```

**Fichier nouveau** : `src/utils/fetchWithRetry.ts`
**Fichier modifié** : `src/hooks/useGraphData.ts`

**Convention** : Les vues qui nécessitent des données live (`CognitiveHeartView`, `OrganicView`, etc.) vérifient `status` et affichent un badge « DONNÉES EN CACHE » si `status === 'stale'`. Les vues purement démo (`SignalView`) ignorent le statut.

---

## Ⅳ. Phase P1 — Registre des Effets (Strategy Registry)

> *Le canvas ne doit jamais être modifié pour ajouter un effet.*

### 4.1 Problème — Le Monolithe SignalCanvas

Actuellement, SignalCanvas.tsx (507 lignes) contient 24 blocs conditionnels `hasEffect` de cette forme (27 appels total, dont 2 négés `!hasEffect`) :

```tsx
{hasEffect(step, 'resonance-pulse') && (() => {
  const mPos = organPositions.get('Μ')
  if (!mPos) return null
  // ... 10 lignes de logique de position + rendu
  return <ResonancePulse source={mPos} targets={...} progress={pct} intensity={...} />
})()}
```

Chaque nouvel effet exige :
1. Modifier `types/signal.ts` (ajouter le literal VisualEffect)
2. Ajouter l'import dans `SignalCanvas.tsx`
3. Ajouter le bloc conditionnel inline dans `SignalCanvas.tsx`
4. Ajouter l'export dans `effects/index.ts`

**Étape 3 viole l'Open/Closed Principle** : le canvas est _ouvert à la modification_ au lieu d'être _ouvert à l'extension_.

### 4.2 Solution — Strategy Registry

**Pattern** : **Strategy** + **Registry** (GoF + PoEAA). Chaque effet s'enregistre lui-même auprès d'un registre central. Le canvas itère sur le registre — il ne connaît jamais les effets individuels.

**Architecture** :

```typescript
// ─── src/components/signal/effects/EffectRegistry.ts ───

export interface EffectContext {
  step: ProcessStep
  pct: number
  organPositions: Map<string, { x: number; y: number }>
  scenario: Scenario
  isDreamMode: boolean
}

export type EffectRenderer = (ctx: EffectContext) => JSX.Element | null

const EFFECT_REGISTRY = new Map<VisualEffect, EffectRenderer>()

export function registerEffect(id: VisualEffect, renderer: EffectRenderer): void {
  EFFECT_REGISTRY.set(id, renderer)
}

export function getEffectRenderer(id: VisualEffect): EffectRenderer | undefined {
  return EFFECT_REGISTRY.get(id)
}

export function registeredEffects(): VisualEffect[] {
  return [...EFFECT_REGISTRY.keys()]
}
```

```typescript
// ─── Chaque fichier effet (ex: ResonancePulse.tsx) ───

import { registerEffect } from './EffectRegistry'
import type { EffectContext } from './EffectRegistry'

function ResonancePulseRenderer(ctx: EffectContext): JSX.Element | null {
  const { step, pct, organPositions } = ctx
  const mPos = organPositions.get('Μ')
  if (!mPos) return null
  const targets = ORGAN_ORDER.filter(sym => sym !== 'Μ').map(sym => {
    const pos = organPositions.get(sym)!
    return { x: pos.x, y: pos.y, symbol: sym }
  })
  const resultCount = step.mcpOperation?.resultCount ?? 1
  const intensity = Math.min(1, 0.5 + Math.max(0, resultCount - 1) / 6)
  return <ResonancePulse source={mPos} targets={targets} progress={pct} intensity={intensity} />
}

// Auto-enregistrement au import-time
registerEffect('resonance-pulse', ResonancePulseRenderer)

// Le composant React est toujours exporté pour usage direct si nécessaire
export { ResonancePulse }
```

```tsx
// ─── SignalCanvas.tsx — APRÈS ───

// Les 30 blocs inline sont remplacés par :
{step?.visualEffects?.flatMap(effect => {
  const renderer = getEffectRenderer(effect)
  if (!renderer) return null
  return (
    <EffectErrorBoundary key={effect}>
      {renderer({ step, pct, organPositions, scenario, isDreamMode })}
    </EffectErrorBoundary>
  )
})}

// Les effets "non-visualEffects" (phase-driven, non déclaratifs) restent inline
// car ils dépendent de la phase, pas d'un visualEffect
// Ex : ECSPrism (ecsFork), LightningBoltL1 (phase === 'ROUTE'), etc.
```

### 4.3 Effets Phase-Driven vs Effects-Driven

Certains rendus SVG ne sont pas pilotés par `visualEffects` mais par des conditions de phase/propriété. Classification :

| Catégorie | Condition | Exemples | Traitement |
|-----------|-----------|----------|------------|
| **Effects-driven** | `hasEffect(step, 'x')` | ResonancePulse, GuardShield, AuditLoop, RecallStream, ToolFlash, SeasonCycle, DreamGate, RedAlert, BlockWall, FogPatch, FreshTraceMark, ConfianceGauge, ConstitutionalGuard, ContradictionBolt, LostStamp, MutationOrbit, ProposalBloom, PruneShears, GrepBeam, QuestionMarkShield, TriPoleOrbit, TriPoleOrbitConverging, VesselRadar | → Strategy Registry |
| **Phase-driven** | `step.phase === 'X'` ou `step.ecsFork` | MCPDataStream, IncarnationBurst, FirstLight, HealthcheckDisplay, LightningBoltL1, OutputComparison, ECSPrism | → Restent inline (conditions structurelles) |
| **Context-driven** | `isDreamMode`, `visited`, `pct < 0.25` | NeuralBridge, OuvrierShadow, MCPRadarPing, ActivationShockwave, AuraField, AuraBudget, PhaseBanner, OrganDendrites, Crystallize *(compound avec phase check)* | → Restent inline (dépendent du contexte global) |

**23 effets** migrent vers le registre. **8 rendus** restent inline.

> **Note audit** : Certains effets ont des dépendances entre eux (ex: `red-alert` et `contradiction-bolt` apparaissent souvent ensemble). Le registre doit supporter les **effets composés** — un renderer peut retourner un `<g>` contenant plusieurs sous-effets. Cela ne change pas l'API du registre, juste la liberté du renderer.

### 4.4 Bénéfice Open/Closed

Après cette phase :
- ✅ Ajouter un nouvel effet = créer 1 fichier + ajouter le literal VisualEffect au type
- ❌ Toucher à SignalCanvas.tsx = **plus jamais**
- ✅ Effet crashé = automatiquement isolé par EffectErrorBoundary (P0)

---

## Ⅴ. Phase P2 — Types Scellés

> *Le compilateur doit attraper ce que l'œil humain manque.*

### 5.1 Union Types — Organ & ECSLevel

**Problème** : `organ: string` et `ecsRoute.level: string` permettent des valeurs invalides comme `'X'` ou `'L4'`. TypeScript ne peut pas les attraper.

**Pattern** : **Union Type** + **Type Guard** — un type union fermé empêche l'assignation depuis `string` générique au compile-time, et un type guard runtime valide les données JSON entrantes avec fallback sûr.

**Spécification** :

```typescript
// ─── src/types/signal.ts ───

/** Les 5 organes du système cognitif — ne peut pas être construit depuis string arbitraire */
export type Organ = 'Σ' | 'Ψ' | 'Φ' | 'Ω' | 'Μ'

/** Set pour validation runtime */
export const VALID_ORGANS: Set<Organ> = new Set(['Σ', 'Ψ', 'Φ', 'Ω', 'Μ'])

/** Type guard runtime */
export function isOrgan(value: string): value is Organ {
  return VALID_ORGANS.has(value as Organ)
}

/** Niveaux ECS — fermés par conception */
export type ECSLevel = 'BOOT' | 'PRE' | 'L1' | 'L2' | 'L3' | 'DREAM'

export interface ECSRoute {
  c: number
  i: number
  level: ECSLevel
}

export interface ProcessStep {
  organ: Organ           // ← était string
  ecsRoute?: ECSRoute    // ← level était string
  // ...
}
```

**Impact** : Les générateurs de scénarios live (`useSignalSimulation.ts`) doivent valider les données JSON entrantes avec `isOrgan()` et fallback vers `'Ψ'`. Les scénarios démo bénéficient du type-checking compile-time.

### 5.2 Type Guards + Discriminated Union — ProcessStep

**Problème** : `ProcessStep` est une interface unique avec 14 champs optionnels. Un step Boot et un step Dream n'ont rien en commun au-delà de `organ`, `label`, `duration`. Chaque consommateur doit faire des checks conditionnels fragiles :

```typescript
// Fragile — que se passe-t-il si phase est undefined ?
if (DREAM_PHASES.has(step.phase ?? '')) { ... }
```

**Pattern** : **Type Guards** basés sur `phase` *(recommandation de l'audit — plus progressif et moins risqué que la discriminated union)* + **`kind` optionnel** pour opt-in au narrowing.

**Pourquoi les type guards plutôt que la discriminated union** : L'audit recommande d'utiliser des type guards (`isBootStep()`, `isDreamStep()`) basés sur `phase` plutôt que d'introduire un champ `kind` discriminateur. Les type guards sont rétrocompatibles, ne cassent aucun scénario, et fournissent le narrowing voulu. Le champ `kind` reste disponible comme opt-in progressif.

**Spécification progressive** — On introduit les type guards d'abord (zéro risque), puis `kind` comme optionnel pour les consumers qui veulent du narrowing explicite :

```typescript
// Phase 1 : kind est optionnel, rétrocompatible
export type StepKind = 'boot' | 'perceptual' | 'audit' | 'triangulation' | 'violation' | 'hallucination' | 'momentum' | 'vessel' | 'dream' | 'mutation'

export interface ProcessStep {
  // ... champs existants inchangés
  kind?: StepKind  // NOUVEAU — optionnel pour rétrocompatibilité
}

// Type guards — rétrocompatibles, basés sur phase existante
export function isBootStep(step: ProcessStep): step is ProcessStep & { phase: BootPhase } {
  return BOOT_PHASES.has(step.phase ?? '')
}
export function isDreamStep(step: ProcessStep): step is ProcessStep & { phase: DreamPhase } {
  return DREAM_PHASES.has(step.phase ?? '')
}

// Phase 2 (future) : kind devient obligatoire, ProcessStep devient discriminated union
// export type ProcessStep = BootStep | PerceptualStep | AuditStep | DreamStep | ...
```

**Bénéfice immédiat** : Les consumers peuvent opt-in au narrowing :

```typescript
// Avant : fragile
if (DREAM_PHASES.has(step.phase ?? '')) { /* step est ProcessStep, pas DreamStep */ }

// Après (type guard) : type-safe, zéro breaking change
if (isDreamStep(step)) { /* TypeScript sait que step.phase est un DreamPhase */ }

// Après (kind) : opt-in progressif
if (step.kind === 'dream') { /* TypeScript sait que step.phase est un DreamPhase */ }
```

### 5.3 Schéma de validation runtime

Les données JSON du graph sont non-typées (viennent de Mnemolite). On introduit un validateur :

```typescript
// ─── src/utils/validateGraphData.ts ───

import type { GraphData, JsonNode } from '../types/expanse'

export function validateGraphData(raw: unknown): { data: GraphData; warnings: string[] } {
  const warnings: string[] = []

  // Validate structure
  if (!raw || typeof raw !== 'object') throw new GraphValidationError('Root must be an object')

  // Validate nodes
  const nodes = (raw as any).nodes ?? []
  for (const node of nodes) {
    if (!node.id) warnings.push(`Node missing id: ${JSON.stringify(node).substring(0, 60)}`)
    if (!node.type) warnings.push(`Node ${node.id} missing type`)
    // Validate known types
    if (node.parent_organ && !isOrgan(node.parent_organ)) {
      warnings.push(`Node ${node.id} has invalid parent_organ: "${node.parent_organ}"`)
    }
  }

  return { data: raw as GraphData, warnings }
}
```

---

## Ⅵ. Phase P3 — Composition Nœud

> *5 composants qui font la même chose, c'est 4 composants de trop.*

### 6.1 Problème — Duplication dans CognitiveHeartView

Les 5 composants `OrganNode`, `ApexNode`, `MutationNode`, `DriftNode`, `ClusterNode` partagent cette logique :

1. Proximity computation (opacity, scale, blur via `hopToProximityStyle`)
2. Graph context consumption (`useGraph()`)
3. Click/drag interaction pattern (`isDragging`, `isClickingNode`)
4. Selection highlighting (`isActive`, `isSelected`)
5. Positioning (`translate(${node.x}, ${node.y})`)

Seuls varient : la forme SVG, le contenu intérieur (icônes, symboles spéciaux), et les classes CSS.

### 6.2 Solution — Template Method + Slot Pattern

**Pattern** : **Template Method** (GoF) adapté à React via le **Slot Pattern** (composition via `children` + render props).

```typescript
// ─── src/components/graph/BaseNode.tsx ───

interface BaseNodeProps {
  node: RenderNode
  shape: 'circle' | 'hexagon' | 'octagon' | 'diamond' | 'star'
  onClick?: () => void
  className?: string
  /** Slot pour le contenu spécifique au type de nœud */
  children?: (props: { isActive: boolean; isSelected: boolean }) => ReactNode
}

export function BaseNode({ node, shape, onClick, className, children }: BaseNodeProps) {
  const { activeNode, setActiveNode, selectedNode, setSelectedNode, proximityMap } = useGraph()
  const isActive = activeNode === node.id
  const isSelected = selectedNode?.id === node.id
  const { opacity, scale, blur } = activeNode
    ? hopToProximityStyle(proximityMap?.get(node.id))
    : { opacity: 1, scale: 1, blur: 0 }

  return (
    <g transform={`translate(${node.x}, ${node.y})`}>
      <g
        onClick={handleClick}
        onMouseEnter={() => setActiveNode(node.id)}
        onMouseLeave={() => setActiveNode(null)}
        style={{ cursor: 'zoom-in', opacity, transform: `scale(${scale})`, ... }}
        className={className}
      >
        {isActive && <circle r={node.radius + 8} fill={node.color} opacity={0.15} filter="url(#glow)" />}
        {renderShape(shape, node.radius, node.color, isSelected)}
        <circle r={node.radius * 0.4} fill="rgba(0,0,0,0.25)" />
        {children?.({ isActive, isSelected })}
        <text y={node.radius + 12} ...>{node.label}</text>
      </g>
    </g>
  )
}
```

```typescript
// ─── DriftNode devient un wrapper mince ───

function DriftNode({ node, isDragging, isClickingNode, onDriftClick }: DriftNodeProps) {
  return (
    <BaseNode node={node} shape="circle" className={`drift-spark matter-${node.matterState} nature-${node.nature}`}
      onClick={() => { if (!isDragging.current) onDriftClick?.(node.id) }}>
      {({ isActive }) => (
        <>
          {node.tags.includes('sec') && <FrictionSpark radius={node.radius} />}
          {isActive && <circle r={node.radius + 6} fill={node.color} opacity={0.2} filter="url(#glow)" />}
        </>
      )}
    </BaseNode>
  )
}
```

**Bénéfice** : ~200 lignes de duplication éliminées. Un changement de logique de proximité = 1 fichier au lieu de 5.

---

## Ⅶ. Phase P4 — Safety Net (Tests)

> *Le seul code qu'on ose refactorer est le code qu'on ose casser.*

### 7.1 Configuration

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

```typescript
// vite.config.ts — ajout de la config test
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.ts',
}
```

### 7.2 Pyramide de Tests

**Couche 1 — Fonctions pures** (priorité maximale, effort minimal) :

| Fonction | Fichier | Pourquoi |
|----------|---------|----------|
| `computeNature` | `utils/computeNature.ts` | 3 niveaux de fallback, logique conditionnelle |
| `deriveAuraState` | `utils/scenarioContext.ts` | 7 constantes, calcul multiplicatif |
| `buildScenarioContextUpTo` | `utils/scenarioContext.ts` | Accumulation mutable, effets de bord potentiels |
| `hasEffect` | `utils/visualEffects.ts` | Type guard, comportement null-safe |
| `computeRadius` | `utils/computeRadius.ts` | Fonction pure, facile |
| `phaseColorWithFallback` | `constants/phases.ts` | Lookup + fallback, test de limites |
| `validateGraphData` | `utils/validateGraphData.ts` (nouveau) | Validation, cas limites |

**Couche 2 — Hooks** (priorité moyenne, effort moyen) :

| Hook | Fichier | Méthode |
|------|---------|---------|
| `useSignalPlayback` | `hooks/useSignalPlayback.ts` | `renderHook` + simulation de timer |
| `useGraphData` | `hooks/useGraphData.ts` | Mock `fetch` + test retry |

**Couche 3 — Snapshots de scénarios** (priorité faible, effort faible) :

```typescript
// Assure que les données de scénario ne changent pas accidentellement
describe('Scenario stability', () => {
  for (const scenario of SCENARIOS) {
    it(`${scenario.id} step count is stable`, () => {
      expect(scenario.steps.length).toMatchSnapshot(`${scenario.id}-steps`)
    })
  }
})
```

### 7.3 Convention de nommage

```
src/
  utils/
    computeNature.ts
    __tests__/
      computeNature.test.ts      ← co-localisé
  hooks/
    useSignalPlayback.ts
    __tests__/
      useSignalPlayback.test.ts  ← co-localisé
```

---

## Ⅷ. Phase P5 — Performance & Accessibilité

> *Un canvas fluide et lisible est un canvas utilisable.*

### 8.1 Performance SVG — React.memo + useMemo

**Problème** : CognitiveHeartView (986 lignes) rend ~200 éléments SVG sans aucun `React.memo` ni `useMemo`. À chaque frame d'animation, tous les nœuds sont re-rendus même si leurs props n'ont pas changé.

**Pattern** : **Memoization** — `React.memo` sur les composants nœud, `useMemo` sur les calculs de position.

**Spécification** :

```typescript
// Avant : re-rendu systématique
function OrganNode({ node, isDragging, isClickingNode, onOrganClick }: OrganNodeProps) {
  // ...
}

// Après : memo avec comparaison custom
const OrganNode = React.memo(function OrganNode({ node, isDragging, isClickingNode, onOrganClick }: OrganNodeProps) {
  // ...
}, (prev, next) => {
  return prev.node.id === next.node.id
    && prev.node.x === next.node.x && prev.node.y === next.node.y
    && prev.node.radius === next.node.radius
})

// useMemo sur les positions de graphe
const nodePositions = useMemo(() => computeNodePositions(nodes), [nodes])
```

**Impact estimé** : +30% render performance sur les vues avec 200+ nœuds.

### 8.2 Lazy Loading des Effets

**Problème** : Les 24 effets visuels sont importés statiquement dans SignalCanvas. Le bundle initial inclut du code qui n'est utilisé que dans certains scénarios.

**Pattern** : **Lazy Loading** — `React.lazy` + `Suspense` pour les effets rares.

```typescript
// Seuls les effets fréquents sont chargés statiquement
import { ResonancePulse } from './effects/ResonancePulse'
import { GuardShield } from './effects/GuardShield'

// Les effets rares sont lazy-loadés
const DreamGate = lazy(() => import('./effects/DreamGate'))
const SeasonCycle = lazy(() => import('./effects/SeasonCycle'))
```

**Note** : Cette optimisation est plus pertinente après P1 (Effect Registry), car le registry peut gérer le lazy loading de manière transparente.

### 8.3 Accessibilité — aria + navigation clavier

**Problème** : Aucun élément interactif n'a de `aria-label`, `role`, ou navigation clavier. Les organes SVG sont cliquables mais invisibles aux lecteurs d'écran.

**Spécification** :

```tsx
// Avant : invisible pour l'accessibilité
<g onClick={handleClick} style={{ cursor: 'zoom-in' }}>

// Après : accessible
<g role="button" aria-label={`Organe ${organSymbol} — ${organLabel}`}
   tabIndex={0}
   onClick={handleClick}
   onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}>
```

**Fichiers modifiés** : CognitiveHeartView.tsx (5 composants nœud), SignalCanvas.tsx (organes), StepSidebar.tsx (contrôles de playback).

---

## Ⅸ. Dépendances entre Phases

```
P0.5 (Captures Visuelles)
 │
 └── Baseline screenshots ←── prérequis pour P1 et P3

P0 (Bouclier Runtime)
 │
 ├── Error Boundaries  ←── requis par P1 (EffectErrorBoundary)
 ├── react-error-boundary ←── dépendance npm
 └── fetchWithRetry    ←── indépendant

P1 (Registre des Effets)
 │
 ├── EffectRegistry    ←── utilise P0 (EffectErrorBoundary)
 └── SignalCanvas      ←── refactor après P1

P2 (Types Scellés)
 │
 ├── Organ/ECSLevel    ←── indépendant
 ├── Type guards        ←── indépendant, rétrocompatible
 ├── StepKind           ←── indépendant, optionnel
 └── validateGraphData  ←── utilise Organ type guard

P3 (Composition Nœud)
 │
 └── BaseNode          ←── indépendant (mais P2 rend les props plus strictes)

P4 (Safety Net)
 │
 └── Tests             ←── idéalement après P2 (types plus stricts = tests plus précis)

P5 (Performance & Accessibilité)
 │
 ├── React.memo/useMemo ←── idéalement après P3 (BaseNode = 1 memo au lieu de 5)
 ├── Lazy loading       ←── idéalement après P1 (registry gère le lazy)
 └── aria/tabIndex       ←── indépendant
```

**Ordre recommandé** : P0.5 → P0 → P1 → P2 → P3 → P4 → P5.
Mais P2 et P3 sont interchangeables. P4 peut commencer dès P0 (tests sur les fonctions pures existantes). P5 est plus efficace après P1+P3 mais les aria peuvent se faire indépendamment.

---

## Ⅹ. Estimation

| Phase | Fichiers nouveaux | Fichiers modifiés | LOC estimé |
|-------|-------------------|-------------------|------------|
| P0.5 | 2 (e2e/spec, playwright.config) | 1 (package.json, SignalCanvas data-testid) | ~80 |
| P0 | 4 (ErrorBoundaries, fetchWithRetry, cache, react-error-boundary dep) | 4 (App, useGraphData, SignalView, SignalCanvas) | ~300 |
| P1 | 1 (EffectRegistry) | 25 (23 effets + SignalCanvas + effects/index) | ~350 |
| P2 | 2 (validateGraphData, __tests__) | 5 (signal.ts, useSignalSimulation, scenarios, organLayout, positionGraphNodes) | ~250 |
| P3 | 1 (BaseNode) | 2 (CognitiveHeartView, exports) | ~200 |
| P4 | 7+ (__tests__ dirs) | 1 (vite.config.ts, package.json) | ~400 |
| P5 | 0 | 3 (CognitiveHeartView, SignalCanvas, StepSidebar) | ~100 |
| **Total** | **~17** | **~42** | **~1680** |

---

## Ⅺ. Risques & Mitigation

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|------------|
| P0.5 : Snapshots trop sensibles (anti-aliasing, fonts) | Élevé | Faible | Utiliser `maxDiffPixelRatio: 0.1` dans Playwright config. Focus sur la structure, pas le pixel-perfect. |
| P1 : Refactor SignalCanvas casse les effets phase-driven | Moyen | Élevé | Les 8 effets phase-driven restent inline. Seuls les 23 effects-driven migrent. Baseline P0.5 pour détecter les régressions. |
| P1 : Effets composés non supportés par le registry | Faible | Moyen | Le renderer peut retourner un `<g>` contenant plusieurs sous-effets. L'API du registry ne change pas. |
| P2 : Type guards basés sur phase deviennent invalides si phases changent | Faible | Moyen | Les type guards sont auto-générés depuis les constantes `BOOT_PHASES`, `DREAM_PHASES` — si les constantes changent, les guards changent aussi. |
| P2 : `kind` optionnel reste optionnel pour toujours (dette) | Moyen | Faible | Les type guards fournissent le narrowing sans `kind`. Le champ `kind` est un bonus, pas une nécessité. |
| P3 : BaseNode ne couvre pas les cas edge (bootPhase, ghost) | Moyen | Moyen | BaseNode expose des hooks de cycle (`onRenderInner`, `onRenderOverlay`) pour les cas spéciaux. |
| P4 : Tests faux positifs (snapshots trop permissifs) | Faible | Faible | Snapshots seulement sur les compteurs de steps, pas sur le contenu détaillé. |
| P5 : React.memo casse les animations (stale props) | Faible | Élevé | Comparaison custom sur les champs pertinents seulement (id, x, y, radius). Ne pas memo les effets animés. |

---

## Ⅻ. Critères d'Acceptation

### P0.5 — Captures Visuelles
- [ ] `@playwright/test` configuré et `pnpm e2e` fonctionne
- [ ] 5+ scénarios capturés comme baseline PNG dans `e2e/__snapshots__/`
- [ ] `data-testid="signal-canvas"` ajouté au `<svg>` dans SignalCanvas.tsx
- [ ] Les tests passent sur l'état actuel du code (baseline = vert)

### P0 — Bouclier Runtime
- [ ] Un crash dans un effet SVG ne tue plus le canvas (effet invisible, reste visible)
- [ ] Un crash dans une vue affiche l'écran de récupération au lieu du blanc
- [ ] `react-error-boundary` installé et utilisé (pas de class component ErrorBoundary)
- [ ] `useGraphData` tente 3 retry avec backoff exponentiel
- [ ] Si le fetch échoue mais qu'un cache existe, status = `'stale'` et les données en cache sont affichées
- [ ] Badge « DONNÉES EN CACHE » visible quand `status === 'stale'`

### P1 — Registre des Effets
- [ ] SignalCanvas.tsx ne contient plus aucun bloc `hasEffect(step, 'x') && (() => ...)()`
- [ ] Chaque effet visuel est auto-enregistré via `registerEffect()`
- [ ] L'ajout d'un nouvel effet ne nécessite AUCUNE modification de SignalCanvas.tsx
- [ ] Les 8 effets phase-driven restent inline et fonctionnent identiquement
- [ ] Les effets composés (red-alert + contradiction-bolt) sont supportés par le registry
- [ ] Les 23 effets effects-driven sont migrés (incluant tri-pole-orbit-converging)
- [ ] Les screenshots P0.5 passent toujours après le refactor

### P2 — Types Scellés
- [ ] `ProcessStep.organ` est de type `Organ` (5 littéraux), pas `string`
- [ ] `ECSRoute.level` est de type `ECSLevel` (6 littéraux), pas `string`
- [ ] Les scénarios live valident les données JSON avec `isOrgan()` avant construction
- [ ] Type guards `isBootStep()`, `isDreamStep()` ajoutés et utilisés dans au moins 2 consumers
- [ ] `StepKind` optionnel ajouté — au moins 3 scénarios l'utilisent
- [ ] `validateGraphData` émet des warnings pour les nœuds invalides

### P3 — Composition Nœud
- [ ] `BaseNode` extrait la logique commune (proximity, click, drag, selection)
- [ ] 3+ composants nœud utilisent BaseNode (DriftNode, MutationNode, ClusterNode minimum)
- [ ] CognitiveHeartView.tsx perd au moins 150 lignes

### P4 — Safety Net
- [ ] `vitest` configuré et `pnpm test` fonctionne
- [ ] 7+ fonctions pures testées (computeNature, deriveAuraState, hasEffect, etc.)
- [ ] Coverage ≥ 80% sur `utils/` et `types/`
- [ ] Au moins 1 hook testé (useSignalPlayback)

### P5 — Performance & Accessibilité
- [ ] `React.memo` ajouté sur 3+ composants nœud (OrganNode, MutationNode, DriftNode minimum)
- [ ] `useMemo` ajouté sur les calculs de position dans CognitiveHeartView
- [ ] `aria-label` + `role="button"` + `tabIndex` ajoutés sur les organes SVG interactifs
- [ ] Navigation clavier fonctionnelle (Enter/Space = click) sur les organes

---

## ⅩⅢ. Glossaire

| Terme | Définition |
|-------|-----------|
| **Strategy Registry** | Pattern où chaque stratégie (ici : effet visuel) s'enregistre dans un registre central. Le consommateur itère le registre au lieu de connaître chaque stratégie. |
| **Circuit Breaker** | Pattern de résilience : un composant encapsule une zone de rendu et intercepte les erreurs pour fournir un fallback dégradé. |
| **Union Type** | Type TypeScript qui enumère explicitement toutes les valeurs permises (ex: `'Σ' \| 'Ψ' \| 'Φ' \| 'Ω' \| 'Μ'`). Empêche l'assignation depuis `string`. |
| **Type Guard** | Fonction TypeScript qui retourne un type predicate (`value is T`), permettant au compilateur de narrower le type dans les branches conditionnelles. Rétrocompatible — ne casse aucun code existant. |
| **Discriminated Union** | Union de types où un champ commun (le discriminateur) permet à TypeScript de narrow le type automatiquement dans les branches conditionnelles. |
| **Stale-While-Revalidate** | Pattern de cache : on affiche les données en cache (stale) immédiatement, puis on revalide en arrière-plan. L'utilisateur ne voit jamais un écran de chargement si des données existent. |
| **Slot Pattern** | Pattern React où un composant parent définit la structure et délègue le contenu spécifique via des slots (render props ou children). Équivalent React du Template Method. |
| **EffectErrorBoundary** | Error Boundary dédiée aux effets visuels SVG. Fallback : `null` (l'effet disparaît silencieusement). |
| **Effet composé** | Effet visuel dont le renderer retourne plusieurs sous-effets dans un `<g>`. Ex: `red-alert` + `contradiction-bolt` apparaissant ensemble. |
| **Screenshot Regression** | Tests E2E qui comparent les screenshots actuels avec une baseline PNG. Toute différence visible = échec du test. |

---

## ⅩⅣ. Diagramme — Avant vs Après

### Avant (F1 — Monolithe)

```
SignalCanvas.tsx (507 lignes)
├── hasEffect('resonance-pulse') && (() => { ... 12 lignes ... })()
├── hasEffect('guard-shield') && (() => { ... 8 lignes ... })()
├── hasEffect('audit-loop') && (() => { ... 8 lignes ... })()
├── hasEffect('recall-stream') && (() => { ... 8 lignes ... })()
├── ... (20 autres blocs identiques)
└── Total : 24 effets inline, ~300 lignes de logique positionnelle
```

### Après (P1 — Registry)

```
SignalCanvas.tsx (~120 lignes)
├── {step?.visualEffects?.flatMap(effect => {
│     const renderer = getEffectRenderer(effect)
│     if (!renderer) return null
│     return <EffectErrorBoundary key={effect}>
│       {renderer({ step, pct, organPositions, scenario, isDreamMode })}
│     </EffectErrorBoundary>
│   })}
│   // + 8 rendus phase-driven/context-driven qui restent inline

EffectRegistry.ts (30 lignes)
├── registerEffect('resonance-pulse', ResonancePulseRenderer)  ← auto-importé
├── registerEffect('guard-shield', GuardShieldRenderer)         ← auto-importé
├── ... (23 entrées)

ResonancePulse.tsx
├── export function ResonancePulse(...)  ← composant React (inchangé)
└── registerEffect('resonance-pulse', ResonancePulseRenderer)  ← NOUVEAU
```

---

*Σ→Ψ⇌Φ→Ω→Μ — La résilience n'est pas l'absence de panne, c'est la capacité à continuer malgré elle.*
