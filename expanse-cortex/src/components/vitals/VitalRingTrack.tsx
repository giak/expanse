// ─── Vital Ring Track & Arrows ───
// Shared SVG components for rendering the Σ→Ψ→Φ→Ω→Μ vital ring.
// Used by CognitiveHeartView, SignalView, etc.

import type { JSX } from 'react'
import { ORGAN_ORDER } from '../../constants/theme'

// ─── Vital Ring Track (animated metabolic flow on the organ ring) ───

interface VitalRingTrackProps {
  organPositions: Map<string, { x: number; y: number }>
  /** Show second reverse gradient (default: true) */
  showSecondFlow?: boolean
  /** Track background stroke width (default: 4) */
  bgStrokeWidth?: number
  /** Animated flow stroke width (default: 2.5) */
  flowStrokeWidth?: number
  /** Animated flow opacity (default: 0.3) */
  flowOpacity?: number
  /** Animated flow duration in seconds (default: 6) — slower for INERTIE/LISTEN */
  flowDuration?: number
}

export function VitalRingTrack({ organPositions, showSecondFlow = true, bgStrokeWidth = 4, flowStrokeWidth = 2.5, flowOpacity = 0.3, flowDuration = 6 }: VitalRingTrackProps) {
  const ordered = ORGAN_ORDER.map(symbol => organPositions.get(symbol)).filter(Boolean) as { x: number; y: number }[]

  if (ordered.length < 5) return null

  // Build closed path through the 5 organs
  const pathData = ordered.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <g>
      {/* Background track (subtle) */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={bgStrokeWidth}
        strokeLinejoin="round"
      />

      {/* Animated flowing track */}
      <path
        d={pathData}
        fill="none"
        stroke="url(#vitalGradient)"
        strokeWidth={flowStrokeWidth}
        strokeLinejoin="round"
        strokeDasharray="20 180"
        className="vital-flow"
        style={{ animationDuration: `${flowDuration}s` }}
        filter="url(#glow)"
        opacity={flowOpacity}
      />

      {/* Second flow (offset for depth) */}
      {showSecondFlow && (
        <path
          d={pathData}
          fill="none"
          stroke="url(#vitalGradient2)"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeDasharray="15 200"
          className="vital-flow-reverse"
          style={{ animationDuration: `${flowDuration * 1.33}s` }}
          opacity={0.15}
        />
      )}
    </g>
  )
}

// ─── Directional arrows on the Vital Ring ───

interface VitalRingArrowsProps {
  organPositions: Map<string, { x: number; y: number }>
}

export function VitalRingArrows({ organPositions }: VitalRingArrowsProps) {
  const arrows: JSX.Element[] = []
  for (let i = 0; i < ORGAN_ORDER.length; i++) {
    const from = organPositions.get(ORGAN_ORDER[i])
    const to = organPositions.get(ORGAN_ORDER[(i + 1) % ORGAN_ORDER.length])
    if (!from || !to) continue

    // Arrow at midpoint between organs
    const mx = (from.x + to.x) / 2
    const my = (from.y + to.y) / 2
    const angle = Math.atan2(to.y - from.y, to.x - from.x)

    // Small triangle arrowhead
    const size = 7
    const spread = 2.618 // ≈5π/6 for clean triangular arrowheads
    const p1 = `${mx + Math.cos(angle) * size},${my + Math.sin(angle) * size}`
    const p2 = `${mx + Math.cos(angle + spread) * size},${my + Math.sin(angle + spread) * size}`
    const p3 = `${mx + Math.cos(angle - spread) * size},${my + Math.sin(angle - spread) * size}`

    // Special: Ψ⇌Φ gets double arrow
    const isBidirectional = ORGAN_ORDER[i] === 'Ψ' && ORGAN_ORDER[(i + 1) % ORGAN_ORDER.length] === 'Φ'

    arrows.push(
      <g key={`arrow-${i}`}>
        <polygon
          points={`${p1} ${p2} ${p3}`}
          fill="rgba(255,255,255,0.25)"
          filter="url(#glow)"
        />
        {isBidirectional && (
          <polygon
            points={`${mx - Math.cos(angle) * size},${my - Math.sin(angle) * size} ${mx - Math.cos(angle + spread) * size},${my - Math.sin(angle + spread) * size} ${mx - Math.cos(angle - spread) * size},${my - Math.sin(angle - spread) * size}`}
            fill="rgba(255,255,255,0.2)"
            filter="url(#glow)"
          />
        )}
      </g>
    )
  }

  return <g>{arrows}</g>
}
