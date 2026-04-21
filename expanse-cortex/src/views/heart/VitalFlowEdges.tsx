// ─── Vital Flow Edges (M1.1 — Metabolic current per organ-to-organ segment) ───

import type { JSX } from 'react'
import { ORGAN_COLORS, ORGAN_ORDER } from '../../constants/theme'

interface VitalFlowEdgesProps {
  organPositions: Map<string, { x: number; y: number }>
}

export function VitalFlowEdges({ organPositions }: VitalFlowEdgesProps) {
  const segments: JSX.Element[] = []

  for (let i = 0; i < ORGAN_ORDER.length; i++) {
    const fromSymbol = ORGAN_ORDER[i]
    const toSymbol = ORGAN_ORDER[(i + 1) % ORGAN_ORDER.length]
    const from = organPositions.get(fromSymbol)
    const to = organPositions.get(toSymbol)
    if (!from || !to) continue

    const color = ORGAN_COLORS[fromSymbol] ?? 'var(--color-blue)'
    const isBidirectional = (fromSymbol === 'Ψ' && toSymbol === 'Φ') || (fromSymbol === 'Φ' && toSymbol === 'Ψ')

    segments.push(
      <g key={`vital-flow-${fromSymbol}-${toSymbol}`}>
        {/* Conduit background (static, subtle) */}
        <line
          x1={from.x} y1={from.y} x2={to.x} y2={to.y}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={3}
        />
        {/* Courant lumineux (animated metabolic flow, source→target) */}
        <line
          x1={from.x} y1={from.y} x2={to.x} y2={to.y}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="8 40"
          className="vital-edge-flow"
          filter="url(#glow)"
          opacity={0.6}
        />
        {/* M1.2: Danse ⇌ — reverse current on Ψ⇌Φ (target→source, Φ color) */}
        {isBidirectional && (
          <line
            x1={from.x} y1={from.y} x2={to.x} y2={to.y}
            stroke={ORGAN_COLORS[toSymbol] ?? 'var(--color-peach)'}
            strokeWidth={1}
            strokeDasharray="6 42"
            className="vital-edge-flow-reverse"
            filter="url(#glow)"
            opacity={0.35}
          />
        )}
      </g>
    )
  }

  return <g>{segments}</g>
}
