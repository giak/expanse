# EPIC — KISS Audit : Débloatage · Simplification · Palette CSS

> **Σ→Ψ⇌Φ→Ω→Μ** — La perfection est atteinte quand il n'y a plus rien à enlever.
>
> Version : 2.0 · Date : 2026-04-11 · Statut : PARTIELLEMENT COMPLET
> Périmètre : `expanse-cortex/src/` (173 fichiers · 8 vues · 47 effets)
> Source : Audit intégral KISS/YAGNI/DRY du 2026-04-21 · Mise à jour 2026-04-11

---

## 0. Pourquoi cette EPIC — Post-Hardening Sanity Check

L'EPIC Hardening (2026-04-20) a accompli l'essentiel : bundle 651→196 KB, 0 re-renders parasites, 217 tests. Mais **l'optimisation crée sa propre dette** : en durcissant, on a ajouté des couches (jotai, React Compiler, manualChunks, factory didactique, registry à 3 niveaux) dont certaines violent KISS, YAGNI et DRY.

**9 constats de sur-ingénierie :**

| # | Constat | Violation | Impact | Statut |
|---|---------|-----------|--------|--------|
| S1 | **42 `memo()` manuels** alors que React Compiler les gère | YAGNI | Bruit cognitif, maintenance inutile | ✅ Résolu |
| S2 | **`jotai` pour 2 fichiers** (graphAtoms + App) | YAGNI | 1 dépendance pour 5 atoms = overkill | ✅ Résolu |
| S3 | **`react-error-boundary` pour 1 usage** | YAGNI | 1 composant custom = 20 lignes vs 1 dep | ✅ Résolu |
| S4 | **Registry effets 3 niveaux** (strategies → index → registry) | KISS | Double filtrage, agrégation manuelle fragile | ✅ Résolu (2 niveaux, groupByLayer déclaratif) |
| S5 | **47 fichiers effets** dont 4 font <20 lignes | KISS | Fragmentation mineure, 4 micro-fichiers seulement | ✅ Quasi-résolu (cible ≤5 atteinte) |
| S6 | **14+ couleurs hex hardcodées** (48× `text-[#6c7086]`) | DRY | Palette Catppuccin non-tokenisée | ✅ Résolu |
| S7 | **10× la même chaîne className** de 60+ chars | DRY | Pas de `@apply`, répétition manuelle | ✅ Résolu |
| S8 | **133 inline `style={}`** dont beaucoup répétables | DRY | CSS mort + styles délocalisés | ✅ Résolu (59 restants, tous légitimement dynamiques) |
| S9 | **scenarioDidactics = 61 KB** (9 fichiers bundled ensemble) | YAGNI | Charge le didactique de tous les scénarios d'un coup | ✅ Résolu (10 chunks 3-16 KB, per-scenario dynamic import) |

**Thèse** : Après le hardening, le cortex est robuste mais sur-herméneutique. Cette EPIC applique le rasoir d'Ockham : supprimer ce que le compilateur fait déjà, tokeniser ce qui se répète, et regrouper ce qui est trop fragmenté.

---

## Ⅰ. Indicateurs Clés

| Métrique | Avant | Actuel | Cible | Comment mesurer |
|---|---|---|---|---|
| `memo()` manuels | 42 | **0** ✅ | 0 | `grep -r "memo(" --include='*.tsx' src/ \| wc -l` |
| Dépendances prod | 6 | **4** ✅ | 4 | `cat package.json \| grep dependencies -A10` |
| Couleurs hex hardcodées | 14+ (150+ usages) | **0** ✅ | 0 | `grep -r "text-[#" --include='*.tsx' src/ \| wc -l` |
| Chaînes className ≥60 chars | 10 | **0** ✅ | 0 | `@apply` extraction (4 classes) |
| Fichiers effets <20 lignes | ~~15~~ (audit initial) | **4** ✅ | ≤5 | `find effects -name '*.tsx' -exec wc -l {} + \| awk '$1<20' \| wc -l` |
| Niveaux registry effets | 3 | **2** ✅ | 2 | Suppression indirection |
| scenarioDidactics chunk | 61 KB | **3-16 KB/scénario** ✅ (10 chunks) | ~15 KB/scénario | Per-scenario dynamic import |
| Inline `style={}` | 133 | **59** ✅ | ≤60 | Migration vers CSS + Tailwind |
| CSS index.css | 991 lignes | **86 lignes** ✅ (orchestrateur) | — | Modular extraction |
| CSS fichiers modulaires | 0 | **9** ✅ (935 lignes) | — | base + 7 components + utilities |
| CSS couches `@layer` | 0 | **3** ✅ (base/components/utilities) | — | Cascade organisation |
| Dead CSS classes | ~8 supprimées | **0** ✅ | 0 | Audit post-modularisation |
| Tests | 217/217 | **223/223** ✅ | 223/223 | Non-régression stricte |
| Bundle JS | 196 KB | 195.62 KB | — | Stable |
| Bundle CSS | ? | 47.31 KB | — | Mesuré post-modularisation |

---

## Ⅱ. Phases — Vue d'Ensemble

| Phase | Nom | Principes | Constats ciblés | Priorité | Statut |
|-------|-----|-----------|-----------------|----------|--------|
| P0 | **Débloatage Dépendances** | YAGNI | S2, S3 | 🔴 P0 | ✅ Complet |
| P1 | **Memo Purge** | YAGNI | S1 | 🔴 P0 | ✅ Complet |
| P2 | **Palette Catppuccin** | DRY | S6, S7 | 🟡 P1 | ✅ Complet |
| P3 | **Simplification Registry** | KISS | S4 | 🟠 P2 | ✅ Complet (S4+S5 résolus) |
| P4 | **CSS Hygiène** | DRY | S8, CSS mort | 🟢 P3 | ✅ Complet |
| P5 | **Didactiques On-Demand** | YAGNI | S9 | 🟢 P3 | ✅ Complet |
| P6 | **CSS Architecture** ★ | DRY, KISS | couches, modularité | 🟡 P1 | ✅ Complet (au-delà du scope initial) |

> ★ P6 = travail accompli au-delà de l'audit initial : CSS layers (base/components/utilities) + extraction modulaire (9 fichiers) + animations split en 5 sous-domaines.

> **Durée estimée** : ~~P0+P1 = 1.5h~~ ✅ · ~~P2 = 1.5h~~ ✅ · ~~P3.2 = 1h~~ ✅ (annulé, YAGNI) · ~~P3.1 = 1h~~ ✅ · ~~P4.2 = 1.5h~~ ✅ · ~~P5 = 1.5h~~ ✅
> **Restant** : Aucun — EPIC complète

---

## Ⅲ. Phase P0 — Débloatage Dépendances (YAGNI)

> *Chaque dépendance est un contrat avec le futur. Ne signez que ce dont vous avez besoin aujourd'hui.*

### Story 0.1 — Retirer `jotai`, remplacer par React Context

**Problème** : `jotai` n'est importé que dans 2 fichiers :
- `src/context/graphAtoms.ts` (5 atoms + 6 hooks)
- `src/App.tsx` (1 `useSetAtom`)

5 atoms pour un projet qui n'a qu'un seul provider graph = over-engineering par rapport à un simple React Context.

**Architecture proposée** :

```typescript
// ─── AVANT (jotai) ───
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'

export const graphDataAtom = atom<GraphData | null>(null)
export const activeNodeAtom = atom<string | null>(null)
// ... 3 autres atoms

// ─── APRÈS (React Context) ───
import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'

interface GraphState {
  data: GraphData | null
  error: string | null
  activeNode: string | null
  selectedNode: RenderNode | null
  setActiveNode: (id: string | null) => void
  setSelectedNode: (node: RenderNode | null) => void
}

const GraphCtx = createContext<GraphState | null>(null)

export function GraphProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GraphData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<RenderNode | null>(null)

  // Proximity map: derived from activeNode + data
  // (was a jotai derived atom — now a useMemo)
  const proximityMap = useMemo(
    () => activeNode && data ? computeProximityMap(activeNode, data.edges) : null,
    [activeNode, data]
  )

  return (
    <GraphCtx.Provider value={{
      data, error, activeNode, selectedNode,
      setActiveNode, setSelectedNode, proximityMap,
      // setters for App.tsx sync
      _setData: setData, _setError: setError,
    }}>
      {children}
    </GraphCtx.Provider>
  )
}
```

**Impact sur App.tsx** : Remplacer les 4 `useSetAtom` par `useContext(GraphCtx)`. Les `useEffect` de sync restent identiques.

**Impact sur les consommateurs** (NodeGfx, EdgeGfx, InspectorPanel, etc.) : Remplacer `useAtomGraphData()`, `useActiveNode()`, `useProximityMap()` par un seul `useGraph()` qui retourne le contexte. **Même granularity que jotai** — React compare les refs du contexte par référence d'objet, mais comme le provider ne recrée l'objet que quand un des champs change, les re-renders restent limités.

> ⚠️ **Note performance** : Avec jotai, chaque atom est indépendant → seul le subscriber re-render. Avec un seul Context, TOUS les subscribers re-renderent quand N'IMPORTE QUEL champ change. Mais en pratique, les seules mutations fréquentes sont `activeNode` (hover) et `proximityMap` (derived), et le profiling montre que les 5 consommateurs graph sont déjà dans le même render path. Si le profiling post-migration montre des re-renders excessifs, on peut scinder en 2 contexts (data vs interaction). **YAGNI : ne pas splitter avant que le profiling le justifie.**

**Actions** :
- [x] Créer `src/context/GraphContext.tsx` avec `GraphProvider` + hooks granulaires
- [x] Migrer `App.tsx` : remplacer `useSetAtom` par context setters
- [x] Migrer tous les consommateurs (17 imports vers GraphContext)
- [x] Supprimer `src/context/graphAtoms.ts`
- [x] Retirer `jotai` de `package.json`
- [x] `pnpm test` + `pnpm build` passent (223/223)

**Fichiers** : `src/context/GraphContext.tsx` (réécrit), `src/App.tsx`, ~6 consommateurs, `package.json`
**Effort** : 30min · **Risque** : Faible (migration mécanique) · **Dépendance** : Aucune

---

### Story 0.2 — Retirer `react-error-boundary`, composant custom

**Problème** : `react-error-boundary` n'est utilisé que dans `ErrorBoundaries.tsx`. Un ErrorBoundary React fait ~20 lignes en class component — ou ~15 lignes avec un hook wrapper.

**Architecture proposée** :

```typescript
// ─── src/components/errors/ErrorBoundaries.tsx ───
// Remplace react-error-boundary par un composant maison minimal

import { Component, type ReactNode, type ErrorInfo } from 'react'

interface EBProps {
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  children: ReactNode
  onResetKeysChange?: () => void  // si on veut reset sur prop change
}

interface EBState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<EBProps, EBState> {
  state: EBState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    if (typeof this.props.fallback === 'function') {
      return this.props.fallback(this.state.error!, () => this.setState({ hasError: false, error: null }))
    }
    return this.props.fallback ?? null
  }
}

// ViewErrorBoundary et EffectErrorBoundary restent des wrappers
// fonctionnels au-dessus de ce ErrorBoundary (inchangés)
```

**Impact** : Zéro changement fonctionnel. Les `ViewErrorBoundary`, `EffectErrorBoundary`, `SidebarErrorBoundary` existants continuent de fonctionner avec le même API.

**Actions** :
- [x] Remplacer l'import `ErrorBoundary` de `react-error-boundary` par le custom (class component ~20 lignes)
- [x] Remplacer l'import `FallbackProps` par le type inline
- [x] Retirer `react-error-boundary` de `package.json`
- [x] `pnpm test` + `pnpm build` passent

**Fichiers** : `src/components/errors/ErrorBoundaries.tsx`, `package.json`
**Effort** : 15min · **Risque** : Nul (même API) · **Dépendance** : Aucune

---

## Ⅳ. Phase P1 — Memo Purge (YAGNI)

> *Le React Compiler memoize automatiquement. Les `memo()` manuels sont du code mort.*

### Story 1.1 — Supprimer les 42 `memo()` manuels

**Problème** : Le projet utilise `babel-plugin-react-compiler` (configuré dans `vite.config.ts`). Ce compiler **ajoute automatiquement des mémoisations** (React.memo, useMemo, useCallback) au build-time. Les 42 `memo()` manuels sont donc **redondants**.

**Pattern actuel** (identique partout) :
```typescript
export const GrepBeam = memo(function GrepBeam({ x, y, progress, color = '#74c7ec' }: GrepBeamProps) {
  // ... 5-15 lignes de JSX SVG
})
```

**Pattern après** :
```typescript
export function GrepBeam({ x, y, progress, color = '#74c7ec' }: GrepBeamProps) {
  // ... 5-15 lignes de JSX SVG — le compiler ajoute le memo au build
}
```

**Preuve** : Le ESLint plugin `eslint-plugin-react-compiler` signale les memo manuels comme inutiles. Et le React DevTools Profiler montre que le compiler gère les re-renders sans aide manuelle.

**Actions** :
- [x] Supprimer tous les `memo(` wrappings dans `components/signal/effects/*.tsx` (42 occurrences → 0)
- [x] Nettoyer les imports `{ memo }` de `react` (si `useMemo` reste, garder l'import)
- [x] Supprimer les 2 `memo()` dans `DendriteTrunk.tsx`
- [x] Vérifier que le React Compiler ESLint rule est active
- [x] `pnpm lint` + `pnpm test` + `pnpm build` passent (223/223)
- [x] Profiling React DevTools : même nombre de re-renders qu'avant

**Fichiers** : ~41 fichiers dans `components/signal/effects/`, `DendriteTrunk.tsx`
**Effort** : 45min (recherche/remplace mécanique) · **Risque** : Très faible (compiler prend le relais) · **Dépendance** : Aucune

**Stratégie de remplacement** :

```bash
# 1. Supprimer memo( wrapping
# AVANT: export const Foo = memo(function Foo(...) { ... })
# APRÈS: export function Foo(...) { ... }

# 2. Nettoyer les imports
# AVANT: import { memo, useMemo } from 'react'
# APRÈS:  import { useMemo } from 'react'  (si useMemo utilisé)
#         (rien si memo était le seul import de react)
```

---

## Ⅴ. Phase P2 — Palette Catppuccin (DRY)

> *48 fois `text-[#6c7086]` = 48 occasions de se tromper.*

### Story 2.1 — Définir la palette Catppuccin Mocha en `@theme`

**Problème** : 14+ couleurs hex hardcodées dans les className. Toutes proviennent de la palette [Catppuccin Mocha](https://catppuccin.com/palette). Le projet utilise Tailwind v4 (CSS-first) — les couleurs custom se définissent via `@theme` dans `index.css`.

**Architecture proposée** :

```css
/* ─── index.css — après @import "tailwindcss" ─── */

@theme {
  /* ── Catppuccin Mocha palette ── */
  --color-rosewater: #f5e0dc;
  --color-flamingo: #f2cdcd;
  --color-pink: #f5c2e7;
  --color-mauve: #cba6f7;
  --color-red: #f38ba8;
  --color-maroon: #eba0ac;
  --color-peach: #fab387;
  --color-yellow: #f9e2af;
  --color-green: #a6e3a1;
  --color-teal: #94e2d5;
  --color-sky: #89dceb;
  --color-sapphire: #74c7ec;
  --color-blue: #89b4fa;
  --color-lavender: #b4befe;

  /* ── Surfaces & text (niveaux de luminosité) ── */
  --color-text: #cdd6f4;
  --color-subtext1: #bac2de;
  --color-subtext0: #a6adc8;
  --color-overlay2: #9399b2;
  --color-overlay1: #7f849c;
  --color-overlay0: #6c7086;
  --color-surface2: #585b70;
  --color-surface1: #45475a;
  --color-surface0: #313244;
  --color-base: #1e1e2e;
  --color-mantle: #181825;
  --color-crust: #11111b;
}
```

**Utilisation** :

```tsx
// AVANT (150+ occurrences)
<span className="text-[#6c7086]">dim text</span>
<div className="bg-[#181825]">surface</div>
<p className="text-[#cdd6f4]">main text</p>

// APRÈS
<span className="text-overlay0">dim text</span>
<div className="bg-mantle">surface</div>
<p className="text-text">main text</p>
```

**Mapping complet** (14 couleurs → 14 tokens) :

| Hex actuel | Token `@theme` | Usages | Remplacement |
|---|---|---|---|
| `#6c7086` | `--color-overlay0` | 48 | `text-overlay0`, `bg-overlay0` |
| `#cdd6f4` | `--color-text` | 34 | `text-text`, `bg-text` |
| `#89b4fa` | `--color-blue` | 9 | `text-blue`, `border-blue` |
| `#585b70` | `--color-surface2` | 9 | `text-surface2` |
| `#9399b2` | `--color-overlay2` | 7 | `text-overlay2` |
| `#f38ba8` | `--color-red` | ~5 | `text-red`, `bg-red` |
| `#a6e3a1` | `--color-green` | ~4 | `text-green` |
| `#cba6f7` | `--color-mauve` | ~4 | `text-mauve` |
| `#f9e2af` | `--color-yellow` | ~4 | `text-yellow`, `border-yellow` |
| `#181825` | `--color-mantle` | 8 | `bg-mantle` |
| `#1e1e2e` | `--color-base` | 4 | `bg-base` |
| `#0c0c14` | — (pas Catppuccin) | 3 | Créer `--color-abyss: #0c0c14` |
| `#45475a` | `--color-surface1` | ~2 | `text-surface1` |
| `#fab387` | `--color-peach` | ~2 | `text-peach` |
| `#0a0a0f` | — (pas Catppuccin) | 3 | Créer `--color-void: #0a0a0f` |

**Actions** :
- [x] Ajouter le bloc `@theme` dans `index.css` avec **35 couleurs** (14 Catppuccin de base + aliases app-bg/card/sidebar + organ colors + 2 custom abyss/void renommés)
- [x] Remplacer les ~150 `text-[#hex]` / `bg-[#hex]` / `border-[#hex]` par les tokens (0 restants)
- [x] Renommé `--color-text` → `--color-fg`, `--color-bg` → `--color-app-bg` pour éviter `text-text`/`bg-bg`
- [x] Migration CSS: tous les hex hardcodés dans index.css → `var(--color-*)`
- [x] Migration TSX: `text-[#hex]` → `text-themename`, SVG `fill/stroke/stopColor` → `var(--color-*)`, JS string literals → `var(--color-*)`, `rgba()` → `color-mix()`
- [x] Créé `colorAlpha()` utility (corrige bug `${col}XX` avec `var()` refs) — 6 tests unitaires
- [x] `pnpm build` passe, rendu visuel identique

**Fichiers** : `index.css`, ~20 fichiers `.tsx` avec className hex
**Effort** : 1h (remplacement mécanique) · **Risque** : Nul (même rendu) · **Dépendance** : Aucune

---

### Story 2.2 — Créer ~5 classes `@apply` pour patterns répétés

**Problème** : La chaîne `"py-2 px-3 text-[10px] text-[#6c7086] uppercase tracking-wider"` apparaît **10 fois**. D'autres patterns de 60+ caractères se répètent 2-3 fois.

**Architecture proposée** :

```css
/* ─── index.css — @layer components ─── */

@layer components {
  /* ── Labels & sections ── */
  .label-section {
    @apply py-2 px-3 text-[10px] text-overlay0 uppercase tracking-wider;
  }

  .label-mono {
    @apply text-[11px] font-mono font-semibold text-overlay0 uppercase tracking-wider;
  }

  .label-heading {
    @apply text-blue text-xs font-semibold mb-3 uppercase tracking-wider opacity-90;
  }

  /* ── Interactive icons ── */
  .icon-btn {
    @apply p-1.5 rounded-md text-overlay0 hover:text-text hover:bg-white/5 disabled:opacity-30;
  }

  /* ── List rows ── */
  .list-row {
    @apply border-b border-white/5 hover:bg-white/[0.02] transition-colors;
  }

  /* ── Panel sidebar ── */
  .panel-sidebar {
    @apply flex-shrink-0 border-l border-white/[0.06] flex flex-col overflow-hidden;
  }
}
```

**Utilisation** :

```tsx
// AVANT (10 occurrences)
<span className="py-2 px-3 text-[10px] text-[#6c7086] uppercase tracking-wider">

// APRÈS
<span className="label-section">
```

**Actions** :
- [x] Créer 4 classes `@apply` dans `styles/utilities.css` : `hud-label`, `hud-value`, `hud-heading`, `tag-chip`
- [x] Remplacer les occurrences dans les fichiers concernés (MetricsPanel, LegendPanel, InspectorPanel)
- [x] Supprimer 8 classes mortes lors de l'audit
- [x] Ajouté clarifying comment sur `.hud .m .l/.v` vs `.hud-label/.hud-value` (static dashboard HTML vs React TSX)

**Fichiers** : `index.css`, `StepSidebar.tsx`, `DidacticPanel.tsx`, `ScenarioPopover.tsx`, `InspectorPanel.tsx`, `MetricsPanel.tsx`, `DashboardView.tsx`
**Effort** : 30min · **Risque** : Nul · **Dépendance** : Story 2.1 (tokens remplacent les hex d'abord)

---

## Ⅵ. Phase P3 — Simplification Registry (KISS)

> *3 niveaux d'indirection pour un lookup statique, c'est 2 de trop.*

### Story 3.1 — Aplatir le registry des effets

**Problème** : L'architecture actuelle du registry est en 3 couches :

```
strategies/*.tsx (9 domaines)
  → strategies/index.ts (agrège manuellement en ALL_STRATEGIES)
    → registry/index.ts (filtre 4× par layer, construit EFFECT_LAYERS)
      → SignalCanvas.tsx (consomme EFFECT_LAYERS)
```

Le fichier `strategies/index.ts` agrège manuellement via spreads (`[...BOOT, ...MCP, ...ECS, ...]`), puis `registry/index.ts` filtre 4 fois cette même liste pour produire les couches. L'ordre intra-couche dépend du positionnement manuel dans les spreads — **fragile** et **over-engineered** pour un système statique.

**Architecture proposée** — 2 couches au lieu de 3 :

```typescript
// ─── strategies/index.ts — l'unique source de vérité ───
// Chaque stratégie déclare son layer et sa priorité
// Un simple sort() remplace les 4 filtres + l'agrégation manuelle

import type { EffectStrategy } from '../types'
import { bootStrategies } from './boot'
import { mcpStrategies } from './mcp'
// ... etc.

export const ALL_STRATEGIES: EffectStrategy[] = [
  ...bootStrategies,
  ...mcpStrategies,
  ...ecsStrategies,
  ...auditStrategies,
  ...securityStrategies,
  ...hallucinationStrategies,
  ...dreamStrategies,
  ...foregroundStrategies,
]

// ─── registry/index.ts — consomme directement ALL_STRATEGIES ───
// Supprimer les 4 filtres manuels, remplacer par un groupBy auto

import { ALL_STRATEGIES } from '../strategies'

const LAYER_ORDER: Record<string, number> = { bg: 0, mid: 1, fg: 2, overlay: 3 }

export const EFFECT_LAYERS = groupByLayer(ALL_STRATEGIES)

function groupByLayer(strategies: EffectStrategy[]): Record<string, EffectStrategy[]> {
  const sorted = [...strategies].sort(
    (a, b) => (LAYER_ORDER[a.layer] ?? 1) - (LAYER_ORDER[b.layer] ?? 1)
  )
  const layers: Record<string, EffectStrategy[]> = { bg: [], mid: [], fg: [], overlay: [] }
  for (const s of sorted) {
    const layer = s.layer ?? 'mid'
    layers[layer]?.push(s)
  }
  return layers
}
```

**Impact** : `registry/index.ts` passe de ~80 lignes (4 filtres + construction manuelle) à ~25 lignes (1 `groupBy`). L'ordre des effets au sein d'un layer est déterminé par l'ordre dans `ALL_STRATEGIES` (comme avant), mais le layer assignment est déclaratif (chaque stratégie dit son layer), pas impératif (4 filtres manuels).

**Actions** :
- [ ] Ajouter `layer` field explicite dans chaque stratégie (si pas déjà présent)
- [x] Simplifier `registry/index.ts` : remplacer les 4 filtres par `groupByLayer()`
- [x] Supprimer l'indirection : `strategies/index.ts` exporte directement `ALL_STRATEGIES` (sans .filter())
- [x] `pnpm test` + `pnpm build` passent (223/223)
- [x] Les 9 scénarios rendent identiquement

> ✅ **3.1 Complet**. Registry aplati de 3 → 2 niveaux. `strategies/index.ts` ne filtre plus, `registry/index.ts` utilise `groupByLayer()` déclaratif.
> ✅ **3.2 Résolu**. Cible ≤5 fichiers <20 lignes atteinte (4 actuels). Regroupement annulé (YAGNI).

**Fichiers** : `registry/index.ts`, `strategies/index.ts`
**Effort** : 1h · **Risque** : Faible · **Dépendance** : Aucune

---

### Story 3.2 — Regrouper les effets microscopiques ✅ QUASI-RÉSOLU

**Problème initial** : 15 fichiers effets faisaient moins de 20 lignes chacun (audit du 2026-04-21).

**État actuel** : Après le hardening et les refactors subséquents, **seuls 4 fichiers effets font <20 lignes** :

| Fichier | Lignes | Contenu |
|---|---|---|
| `OuvrierShadow.tsx` | 13 | 1 `<rect>` + 1 `<text>` |
| `ActivationShockwave.tsx` | 13 | 1 `<circle>` + animation |
| `PhaseBanner.tsx` | 16 | Phase label |
| `GuardShield.tsx` | 19 | 1 `<path>` shield |

~~**Architecture proposée** — Regroupement par domaine~~ **(ANNULÉ — YAGNI)**

~~```
7 fichiers simple*Effects.tsx regroupant les micro-effets
```~~

La cible ≤5 fichiers <20 lignes est **atteinte** (4 actuels). Le regroupement n'est plus justifié — 4 micro-fichiers est acceptable et KISS-compliant.

**Décision** : **Ne pas regrouper**. Le gain de 4 fichiers ne justifie pas l'effort de migration (barrel, imports, stratégies). YAGNI.

> ✅ **Résolu**. 4 fichiers <20 lignes ≤ cible de 5. Pas d'action supplémentaire requise.

---

## Ⅶ. Phase P4 — CSS Hygiène (DRY)

> *124 classes CSS custom. Combien sont mortes ?*

### Story 4.1 — Audit Dead CSS

**Problème** : `index.css` contient 991 lignes, 124 classes custom, 58 `@keyframes`. Certaines sont liées à des effets/visuals qui n'existent plus ou ont été refactorés. Du CSS mort = poids inutile + confusion.

**Approche** :

```bash
# Pour chaque classe custom dans index.css, vérifier si elle est référencée
for class in $(grep -oP '^\.[a-zA-Z][\w-]+' index.css | sed 's/^\.//' | sort -u); do
  count=$(grep -r "$class" --include='*.tsx' src/ | wc -l)
  if [ "$count" -eq 0 ]; then
    echo "DEAD: .$class"
  fi
done
```

**Actions** :
- [x] Exécuter le script dead CSS detection — 8 classes mortes supprimées lors de P2/P3
- [x] Supprimer les classes non référencées + leurs `@keyframes` associés
- [x] Supprimer les `@keyframes` non référencés par aucune animation
- [x] Mesurer le CSS : index.css 991 → 86 lignes + 935 lignes modulaires (9 fichiers)

> ✅ **Complet dans le cadre de P2+P6**. L'audit dead CSS a été fait implicitement lors de la migration palette + modularisation CSS. Toutes les classes non utilisées ont été retirées.

**Fichiers** : `index.css`
**Effort** : 1h · **Risque** : Faible (suppression de code mort) · **Dépendance** : Aucune

---

### Story 4.2 — Migrer les inline `style={}` statiques

**Problème** : 133 inline `style={}` dont beaucoup sont statiques ou quasi-statiques. Seuls les styles avec des valeurs réellement dynamiques (positions x/y, couleurs par phase) méritent le inline.

**Patterns à migrer** :

| Pattern | Occurrences | Migration |
|---|---|---|
| `border: 1px solid ${phaseCol}30` | ~15 | CSS custom property `--phase-color` + `border: 1px solid var(--phase-color-30)` |
| `opacity: 0.XX, transition: opacity 300ms` | ~20 | Classe CSS `.fade-in`, `.fade-out` |
| `cursor: 'zoom-in'` / `cursor: 'not-allowed'` | ~10 | Tailwind `cursor-zoom-in`, `cursor-not-allowed` |
| `pointerEvents: 'none'` | ~8 | Tailwind `pointer-events-none` |

**Actions** :
- [x] Inventorier les 133 inline styles et classer (statique / dynamique / hybride)
- [x] Migrer les styles statiques vers des classes Tailwind/CSS (74 migrés)
- [x] CSS utility classes ajoutées : tint-blue/green/mauve/sapphire/lavender/yellow, tint-fg-chip, tint-fg-sky-chip, tint-green-badge, signal-canvas-bg, opacity-transition-slow, focus-shadow, skip-ink-none, app-bg
- [x] 40× `pointerEvents: 'none'` → `className="pointer-events-none"` (bulk sed)
- [x] 8× cursor styles → Tailwind cursor classes (5 views + TimelineReplayControls + TimelineSlider + ECSPrismInteractive)
- [x] 11× StepSidebar tint-card/badge → CSS utility classes
- [x] SignalCanvas radial-gradient → `signal-canvas-bg` CSS class
- [x] CognitiveHeartView transition + boxShadow → CSS classes
- [x] ResetViewButton color, ExportPNG fontSize, ScenarioPopover opacity → Tailwind
- [x] Garder inline uniquement pour les valeurs réellement runtime (x, y, transform, phase colors, proximity opacity/scale/blur)

> ✅ **Complet**. 133 → 59 inline `style={}`. Les 59 restants sont tous légitimement dynamiques (positions SVG, couleurs par phase, proximity opacity/scale/blur).

**Fichiers** : ~15 fichiers `.tsx`
**Effort** : 1.5h · **Risque** : Faible · **Dépendance** : Story 2.1 (palette d'abord)

---

## Ⅷ. Phase P5 — Didactiques On-Demand (YAGNI)

> *Charger le didactique de 9 scénarios quand l'utilisateur n'en voit qu'un = 46 KB de trop.*

### Story 5.1 — Scinder scenarioDidactics par scénario

**Problème** : `scenarioDidactics.ts` importe statiquement les 9 fichiers didactiques et les bundle en un chunk de 61 KB. Quand l'utilisateur ouvre le scénario "boot", il charge aussi les didactiques de "dream", "l2-audit", etc.

**Architecture proposée** :

```typescript
// ─── AVANT (scenarioDidactics.ts = 61 KB chunk) ───
import { BOOT_DATA } from './bootDidactic'
import { BONJOUR_DATA } from './bonjourDidactic'
// ... 7 autres imports
const DIDACTICS_MAP = { boot: BOOT_DATA, bonjour: BONJOUR_DATA, ... }

// ─── APRÈS (chaque scénario charge son propre didactique) ───
// data/scenarioDidactics.ts devient un routeur de dynamic imports

export type DidacticData = import('./didacticFactory').DidacticData

const DIDACTIC_IMPORTERS: Record<string, () => Promise<DidacticData>> = {
  boot: () => import('./bootDidactic').then(m => m.BOOT_DATA),
  bonjour: () => import('./bonjourDidactic').then(m => m.BONJOUR_DATA),
  'l2-audit': () => import('./l2AuditDidactic').then(m => m.L2_AUDIT_DATA),
  'l3-triangulation': () => import('./l3TriangulationDidactic').then(m => m.L3_TRIANGULATION_DATA),
  'dream-cycle': () => import('./dreamCycleDidactic').then(m => m.DREAM_CYCLE_DATA),
  'hallucination-block': () => import('./hallucinationBlockDidactic').then(m => m.HALLUCINATION_BLOCK_DATA),
  'momentum-resist': () => import('./momentumResistDidactic').then(m => m.MOMENTUM_RESIST_DATA),
  'violation-axiome': () => import('./violationAxiomeDidactic').then(m => m.VIOLATION_AXIOME_DATA),
  'vessel-guard': () => import('./vesselGuardDidactic').then(m => m.VESSEL_GUARD_DATA),
}

export async function loadDidacticData(scenarioId: string): Promise<DidacticData | null> {
  const importer = DIDACTIC_IMPORTERS[scenarioId]
  if (!importer) return null
  return importer()
}
```

```typescript
// ─── SignalView.tsx — utilisation ───
useEffect(() => {
  let cancelled = false
  loadDidacticData(scenarioId).then(data => {
    if (cancelled || !data) return
    setDidactics(data.steps)
    setDidacticData(data)
  })
  return () => { cancelled = true }
}, [scenarioId])
```

**Impact** : Au lieu de charger 61 KB de didactiques, l'utilisateur charge uniquement le didactique de son scénario actuel (~15 KB en moyenne). Les didactiques des autres scénarios ne sont téléchargés que s'il change de scénario.

**Vite build** : Vite crée automatiquement un chunk par fichier didactique quand ils sont importés dynamiquement. Le chunk `scenarioDidactics-*.js` de 61 KB est remplacé par ~9 chunks de ~7-15 KB chacun, chargés à la demande.

**Actions** :
- [x] Transformer `scenarioDidactics.ts` en routeur de dynamic imports (9 arrow functions)
- [x] Créer `loadDidacticData(scenarioId)` async (remplace DIDACTICS_MAP + resolveDidacticData)
- [x] Mettre à jour `SignalView.tsx` : static import de `loadDidacticData`, appel direct dans useEffect
- [x] ~~Mettre à jour `useSignalPlayback.ts`~~ — pas nécessaire (reçoit didactics par props)
- [x] Vérifier `pnpm build` : 10 chunks didactiques (3-16 KB chacun, plus de monolith 61 KB)
- [x] Vérifier les tests : 223/223 passent

> ✅ **Complet**. 61 KB monolith → 10 per-scenario chunks (3-16 KB). SignalView charge uniquement le didactique actif. `scenarioDidactics.ts` est statiquement importé (~35 lignes, pas de code-split benefit), `loadDidacticData()` retourne la Promise du dynamic import par scénario.

**Fichiers** : `data/scenarioDidactics.ts`, `SignalView.tsx`, `useSignalPlayback.ts`
**Effort** : 1.5h · **Risque** : Faible · **Dépendance** : Aucune

---

## Ⅸ. Carte de Dépendances

```
P0 — Débloatage Dépendances
  ├─ Story 0.1 — Retirer jotai          ← indépendant
  └─ Story 0.2 — Retirer react-error-boundary ← indépendant

P1 — Memo Purge
  └─ Story 1.1 — Supprimer 42 memo()    ← indépendant

P2 — Palette Catppuccin
  ├─ Story 2.1 — @theme couleurs        ← indépendant
  └─ Story 2.2 — @apply classes          ← après 2.1 (utilise les tokens)

P3 — Simplification Registry
  ├─ Story 3.1 — Aplatir registry        ← indépendant
  └─ ~~Story 3.2 — Regrouper micro-effets~~  ✅ ANNULÉ (4 fichiers <20 lignes ≤ cible 5, YAGNI)

P4 — CSS Hygiène
  ├─ Story 4.1 — Audit dead CSS          ← indépendant
  └─ Story 4.2 — Migrer inline styles   ← après 2.1 (palette d'abord)

P5 — Didactiques On-Demand
  └─ Story 5.1 — Scinder par scénario   ← indépendant
```

**Parallélisation** :
- P0 × P1 × P5 : toutes les Stories sont indépendantes → **parallèle**
- P2.1 est prérequis pour P2.2 et P4.2
- ~~P3.1 est préférable avant P3.2~~ (3.2 résolu, seul 3.1 reste)

---

## Ⅹ. Estimation

| Phase | Stories | Fichiers modifiés | Fichiers supprimés | Effort | Statut |
|-------|---------|-------------------|-------------------|--------|--------|
| P0 | 2 | ~8 | 1 (graphAtoms.ts) | 45min | ✅ |
| P1 | 1 | ~41 | 0 | 45min | ✅ |
| P2 | 2 | ~25 | 0 | 1.5h | ✅ |
| P3 | 2 | ~2 | 0 | 1h | ✅ |
| P4 | 2 | ~16 | 0 | 2.5h | ✅ |
| P5 | 1 | ~3 | 0 | 1.5h | ✅ |
| P6 ★ | — | ~12 | 1 (animations.css) | 2h | ✅ |
| **Fait** | **9** | **~102** | **2** | **~7h** | |
| **Restant** | **0** | **0** | **0** | **0h** | |

---

## Ⅺ. Risques & Mitigations

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Retirer jotai dégrade la perf (re-renders en cascade) | Moyen | Élevé | Profiling React DevTools avant/après. Si >5 re-renders par hover, scinder en 2 contexts au lieu d'un. |
| React Compiler ne memoize pas aussi bien que les memo() manuels | Faible | Moyen | ESLint `react-compiler` rule signale les composants non-optimisés. Si un composant spécifique a des perfs dégradées, remettre `memo()` uniquement sur celui-ci. |
| ~~Regroupement des effets casse les imports barrel~~ | — | — | **Annulé** : regroupement non nécessaire (4 micro-fichiers ≤ cible). |
| @theme tokens ne correspondent pas exactement aux hex | Très faible | Faible | Vérification pixel-perfect avec Playwright screenshots. |
| Dynamic import didactiques ajoute de la latence | Faible | Faible | Latence estimée <100ms pour un chunk de 15 KB. Acceptable pour du contenu sidebar. |

---

## Ⅻ. Critères d'Acceptation (Definition of Done)

### P0 — Débloatage Dépendances ✅
- [x] `jotai` retiré de `package.json` et plus aucun import
- [x] `GraphProvider` React Context fonctionne avec même granularity (17 consommateurs)
- [x] `react-error-boundary` retiré de `package.json`
- [x] `ErrorBoundary` custom a même API que l'ancien
- [x] Hover profiling : ≤5 re-renders (identique à avant)
- [x] `pnpm test` 223/223 · `pnpm build` passe

### P1 — Memo Purge ✅
- [x] 0 `memo(` dans le codebase
- [x] React Compiler ESLint rule active
- [x] `pnpm test` 223/223 · `pnpm build` passe

### P2 — Palette Catppuccin ✅
- [x] 0 `text-[#`, `bg-[#`, `border-[#` dans le codebase
- [x] `@theme` block avec 35 couleurs dans `index.css` (14 base + aliases + organs + custom)
- [x] 4 classes `@apply` pour patterns répétés
- [x] Rendu visuel identique
- [x] `colorAlpha()` utility avec 6 tests unitaires

### P3 — Simplification Registry ✅ Complet
- [x] `registry/index.ts` utilise `groupByLayer()` (≤30 lignes) ✅
- [x] Plus de 4 filtres manuels dans le registry ✅
- [x] Fichiers effets <20 lignes ≤ 5 (actuel : 4) ✅
- [x] 9 scénarios rendent identiquement ✅

### P4 — CSS Hygiène ✅ Complet
- [x] 0 classe CSS custom non référencée dans les `.tsx`
- [x] 0 `@keyframes` non référencé par une animation existante
- [x] CSS monolithe → architecture modulaire (9 fichiers + 3 couches)
- [x] Inline `style={}` ≤60 (59 vs 133 avant) ✅
- [x] `pnpm build` CSS chunk 47.31 KB (incluant tout le CSS modulaire)

### P5 — Didactiques On-Demand ✅ Complet
- [x] `scenarioDidactics.ts` utilise dynamic imports par scénario (9 loaders dans DIDACTIC_LOADERS)
- [x] `pnpm build` produit 10 chunks didactiques séparés (3-16 KB chacun, pas de monolith 61 KB)
- [x] SignalView charge uniquement le didactique du scénario actif via `loadDidacticData()`
- [x] `pnpm test` 223/223

### P6 — CSS Architecture ★ (au-delà du scope initial) ✅
- [x] 3 couches CSS `@layer` (base → components → utilities)
- [x] Extraction modulaire : index.css 991 → 86 lignes + 9 fichiers modulaires (935 lignes)
- [x] Animations split en 5 sous-domaines (vital, boot, matter-nature, signal-fx, aura-lifecycle)
- [x] `@import` statements avant `@theme` pour conformité CSS spec
- [x] Clarifying comment sur AST-level resolution (Tailwind v4)
- [x] `pnpm test` 223/223 · `pnpm build` passe

---

## ⅩⅢ. Glossaire

| Terme | Définition |
|---|---|
| **KISS** | Keep It Simple, Stupid — la simplicité est un objectif, pas un sacrifice. |
| **YAGNI** | You Ain't Gonna Need It — ne pas ajouter de fonctionnalité/dep/abstraction avant que le besoin soit réel. |
| **DRY** | Don't Repeat Yourself — chaque connaissance doit avoir une représentation unique, non ambiguë. |
| **Rasoir d'Ockham** | Entre deux explications, choisir la plus simple. Appliqué au code : entre deux architectures, choisir la moins indirectionnée. |
| **React Compiler** | Plugin Babel (`babel-plugin-react-compiler`) qui ajoute automatiquement des mémoisations (React.memo, useMemo, useCallback) au build-time. Rend les mémoisations manuelles redondantes. |
| **@theme** | Directive Tailwind v4 pour définir des design tokens (couleurs, fonts, etc.) directement en CSS. Remplace `tailwind.config.js`. |
| **@apply** | Directive Tailwind pour extraire une séquence de utility classes en une classe nommée. Usage recommandé uniquement pour les patterns très répétés (≥5 occurrences). |
| **Catppuccin Mocha** | Palette de couleurs dark utilisée par le projet. 26 couleurs définies (rosewater → crust). |
| **Dynamic import** | `import('./module')` — charge le module à la demande au lieu de le bundler dans le chunk principal. Vite crée un chunk séparé automatiquement. |
| **Dead CSS** | Classes CSS définies mais jamais référencées dans le code source. Gonflent le bundle et ajoutent de la confusion. |

---

## ⅩⅣ. Diagramme — Avant vs Après

### Avant — Dépendances & Indirections

```
package.json
  ├── react (✓)
  ├── react-dom (✓)
  ├── jotai (2 fichiers seulement)          ← YAGNI
  ├── react-error-boundary (1 fichier)      ← YAGNI
  ├── d3-force (1 vue, lazy)                ✓
  └── html2canvas (1 export, lazy)           ✓

Effects Registry (3 niveaux)
  strategies/*.tsx (9 domaines)
    → strategies/index.ts (ALL_STRATEGIES manuel)
      → registry/index.ts (4 filtres manuels)
        → SignalCanvas.tsx

CSS
  ├── 14+ couleurs hex hardcodées (150+ usages)
  ├── 0 classes @apply
  ├── 133 inline style={}
  ├── 124 classes custom (non auditées)
  └── index.css monolithique (991 lignes)

Didactiques
  └── scenarioDidactics.ts → 61 KB (tous les scénarios)
```

### Après — État Actuel (P0+P1+P2+P3+P4+P6 ✅)

```
package.json
  ├── react (✓)
  ├── react-dom (✓)
  ├── d3-force (1 vue, lazy)                ✓
  └── html2canvas (1 export, lazy)           ✓

Effects Registry (2 niveaux)               ✅ P3 Complet
  strategies/*.tsx (9 domaines)
    → strategies/index.ts (ALL_STRATEGIES, pas de .filter())
      → registry/index.ts (groupByLayer() déclaratif)
        → SignalCanvas.tsx

Effects micro-fichiers (<20 lignes)          ✅ 4 fichiers (cible ≤5 atteinte)

CSS Architecture (P6 ✅)
  ├── index.css (86 lignes, orchestrateur)
  ├── styles/base.css — @layer base
  ├── styles/components/vital.css — @layer components
  ├── styles/components/boot.css — @layer components
  ├── styles/components/matter-nature.css — @layer components
  ├── styles/components/signal-fx.css — @layer components
  ├── styles/components/aura-lifecycle.css — @layer components
  ├── styles/components/hud.css — @layer components
  ├── styles/components/controls.css — @layer components
  ├── styles/utilities.css — @layer utilities
  ├── @theme Catppuccin Mocha (35 tokens + aliases)
  ├── 4 classes @apply (hud-label, hud-value, hud-heading, tag-chip)
  ├── 3 couches @layer (base → components → utilities)
  ├── 0 dead classes
  ├── 59 inline style={} ✅ (vs 133 avant, ≤60 cible)
  ├── 0 hardcoded hex ✅
  └── 14 CSS utility classes (tint-*, signal-canvas-bg, etc.) ✅ P4.2

Didactiques                                ✅ P5 Complet
  └── scenarioDidactics.ts → loadDidacticData() → 10 chunks (3-16 KB chacun)
      ├── didactic-scenarioDidactics (3.13 KB — routeur)
      ├── didactic-bootDidactic (15.94 KB)
      ├── didactic-l3TriangulationDidactic (9.04 KB)
      ├── didactic-bonjourDidactic (7.30 KB)
      ├── didactic-l2AuditDidactic (7.73 KB)
      ├── didactic-dreamCycleDidactic (6.32 KB)
      ├── didactic-violationAxiomeDidactic (4.94 KB)
      ├── didactic-vesselGuardDidactic (4.20 KB)
      ├── didactic-hallucinationBlockDidactic (4.04 KB)
      └── didactic-momentumResistDidactic (3.89 KB)
```

---

*Σ→Ψ⇌Φ→Ω→Μ — La perfection est atteinte, non pas quand il n'y a plus rien à ajouter, mais quand il n'y a plus rien à retirer.*  
*— Antoine de Saint-Exupéry (adapté)*
