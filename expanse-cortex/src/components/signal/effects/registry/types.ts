// ══════════════════════════════════════════════════════════════
// EFFECT REGISTRY TYPES — Strategy pattern for SignalCanvas effects
// ══════════════════════════════════════════════════════════════
// Each effect in the Signal view is defined as a self-contained
// "strategy" that tests whether it should render and produces the
// appropriate ReactNode. SignalCanvas simply iterates the registry
// per layer, calling test() → render() for each strategy.
//
// This replaces ~30 inline IIFE blocks with a declarative, extensible
// data structure that can be searched, filtered, and tested in isolation.

import type { ReactNode } from 'react'
import type { ProcessStep } from '../../../../types/signal'

// ─── Effect layers (z-order) ───

/** Rendering layers control z-order within the SVG.
 *  Strategies are grouped by layer so SignalCanvas renders them in order:
 *    bg → mid → organs → fg → overlay
 */
export type EffectLayer = 'bg' | 'mid' | 'fg' | 'overlay'

// ─── Shared context passed to every strategy ───

/** Static context — changes only when the step changes, NOT every frame.
 *  Can be memoized with useMemo keyed on [step, stepIdx, ...]. */
export interface StaticEffectContext {
  // Current step state
  step: ProcessStep | null
  stepIdx: number

  // Derived state flags
  isInertie: boolean
  phaseCol: string            // phase-driven color

  // Scenario metadata (thinned: only route, not full Scenario object)
  scenarioRoute: string
  isDreamMode: boolean
  dreamSeason: 'winter' | 'spring' | 'summer' | 'autumn'

  // Positions
  organPositions: Map<string, { x: number; y: number }>

  // UI interaction
  canvasHighlight: string | null
}

// ─── Strategy interface ───

/** A self-contained effect strategy.
 *
 *  `test(ctx, pct)` — pure function: returns true if this effect should render.
 *    Must not produce side effects. Used for conditional rendering.
 *
 *  `render(ctx, pct)` — produces the SVG ReactNode when test() is true.
 *    Can return null if test() was true but render-time checks fail
 *    (e.g. organ position not found).
 *
 *  ctx and pct are separated: ctx is memoizable (changes only when step changes),
 *  pct changes every frame (60fps). This split lets SignalCanvas memoize ctx.
 */
export interface EffectStrategy {
  /** Unique identifier for this strategy (matches VisualEffect name or phase-based key) */
  id: string
  /** Which layer this effect renders in (controls z-order) */
  layer: EffectLayer
  /** Returns true if this effect should render for the given context */
  test: (ctx: StaticEffectContext, pct: number) => boolean
  /** Produces the SVG content. Only called when test() returns true. */
  render: (ctx: StaticEffectContext, pct: number) => ReactNode
}

// ─── Registry shape ───

/** The registry is a Map<layer, strategies[]> for ordered iteration */
export type EffectRegistry = Record<EffectLayer, EffectStrategy[]>
