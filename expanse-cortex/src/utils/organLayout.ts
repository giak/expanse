// ─── Organ Layout Utilities ───
// Shared computation of organ positions on the vital ring and labels.
// Used by CognitiveHeartView, SignalView, etc.

import { ORGAN_ORDER } from '../constants/theme'
import { VITAL_RING_RADIUS, ORGAN_ANGLES } from '../constants/schema'

/** Compute organ positions on the vital ring (centered at origin) */
export function computeOrganPositions(): Map<string, { x: number; y: number }> {
  const map = new Map<string, { x: number; y: number }>()
  ORGAN_ORDER.forEach(symbol => {
    const angle = ORGAN_ANGLES[symbol] ?? 0
    map.set(symbol, {
      x: Math.cos(angle) * VITAL_RING_RADIUS,
      y: Math.sin(angle) * VITAL_RING_RADIUS,
    })
  })
  return map
}

/** Human-readable labels for each organ symbol */
export const ORGAN_LABELS: Record<string, string> = {
  'Σ': 'Percevoir',
  'Ψ': 'Métacog',
  'Φ': 'Audit',
  'Ω': 'Synthèse',
  'Μ': 'Mémoire',
}
