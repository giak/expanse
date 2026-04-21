// ══════════════════════════════════════════════════════════════
// VISUAL EFFECTS — helper for step SVG animation triggers
// ══════════════════════════════════════════════════════════════

import type { ProcessStep, VisualEffect } from '../types/signal'

/** Helper: check if a step has a given visual effect.
 *  Also acts as a type guard: when true, `step` is narrowed to non-null. */
export function hasEffect(step: ProcessStep | null, effect: VisualEffect): step is ProcessStep & { visualEffects: VisualEffect[] } {
  return step?.visualEffects?.includes(effect) ?? false
}
