// ══════════════════════════════════════════════════════════════
// EFFECT REGISTRY — layer-grouped index for SignalCanvas
// ══════════════════════════════════════════════════════════════
// SignalCanvas iterates layers in order: bg → mid → fg → overlay
// Within each layer, strategies render in their defined order.
//
// Layer grouping is done declaratively via groupByLayer() — each strategy
// declares its own `layer` field, no manual filtering needed.

import { ALL_STRATEGIES } from './strategies/index'
import type { EffectRegistry, EffectLayer, EffectStrategy } from './types'

// ─── Declarative layer grouping ───

function groupByLayer(strategies: EffectStrategy[]): EffectRegistry {
  const layers: EffectRegistry = { bg: [], mid: [], fg: [], overlay: [] }
  for (const s of strategies) {
    layers[s.layer].push(s)
  }
  return layers
}

/** The effect registry, grouped by layer for ordered iteration */
export const EFFECT_REGISTRY_BY_LAYER: EffectRegistry = groupByLayer(ALL_STRATEGIES)

/** Ordered list of layers for sequential rendering.
 *  Available for external consumers that iterate layers in order.
 *  SignalCanvas currently uses EFFECT_REGISTRY_BY_LAYER directly. */
export const EFFECT_LAYERS: EffectLayer[] = ['bg', 'mid', 'fg', 'overlay']

/** Find a strategy by id (useful for testing) */
export function findStrategy(id: string): EffectStrategy | undefined {
  return ALL_STRATEGIES.find(s => s.id === id)
}

/** Re-export types for convenience */
export type { StaticEffectContext, EffectStrategy, EffectLayer, EffectRegistry } from './types'
