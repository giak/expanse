import { PHASE_LABELS, phaseColorWithFallback } from '../../../constants/phases'
import type { Phase } from '../../../types/signal'

/** Phase Banner — brief text in canvas showing the cognitive operation category */
export function PhaseBanner({ phase, progress, route }: { phase: Phase; progress: number; route?: string }) {
  if (progress > 0.4) return null
  const alpha = Math.max(0, 1 - progress * 2.5)
  const col = phaseColorWithFallback(phase, route)
  return (
    <text x={0} y={-480} textAnchor="middle" fill={col}
      fontSize={22} fontWeight="bold" fontFamily="'JetBrains Mono', monospace"
      opacity={alpha * 0.35} letterSpacing="0.15em">
      {PHASE_LABELS[phase] ?? phase}
    </text>
  )
}
