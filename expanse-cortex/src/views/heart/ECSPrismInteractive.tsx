// ─── ECS Prism (Phase 3 — Interactive: clickable, shows C×I breakdown) ───

import { useState } from 'react'
import { ORGAN_COLORS, ORGAN_ORDER } from '../../constants/theme'
import { ORGAN_ANGLES, VITAL_RING_RADIUS } from '../../constants/schema'

const ECS_LEVELS = [
  { level: 'L1', label: 'Auto', color: 'var(--color-green)', desc: 'C<2 ET I=1 → Ω direct' },
  { level: 'L2', label: 'Audit', color: 'var(--color-yellow)', desc: 'C≥2 OU I=2 → Ψ⇌Φ boucle' },
  { level: 'L3', label: 'Triang', color: 'var(--color-red)', desc: 'C≥4 OU I=3 → 3 pôles + confiance%' },
] as const

interface ECSPrismProps {
  organPositions: Map<string, { x: number; y: number }>
}

export function ECSPrism({ organPositions }: ECSPrismProps) {
  const [expanded, setExpanded] = useState(false)
  const sigmaAngle = ORGAN_ANGLES['Σ'] ?? -Math.PI / 2
  if (!organPositions.has('Σ')) return null

  // Prism positioned slightly interior from Σ toward center
  const prismDist = VITAL_RING_RADIUS - 55
  const px = Math.cos(sigmaAngle) * prismDist
  const py = Math.sin(sigmaAngle) * prismDist

  // Incoming beam: from outside the arc toward the prism (chaotic, diffuse)
  const inAngle = sigmaAngle
  const inX = px + Math.cos(inAngle) * 35
  const inY = py + Math.sin(inAngle) * 35

  // Prism rotation: align triangle point toward Σ
  const prismRotation = (sigmaAngle * 180 / Math.PI) + 90

  return (
    <g
      className="ecs-prism graph-node-focus cursor-pointer"
      role="button"
      aria-label="ECS Prism — click to expand resolution breakdown"
      tabIndex={0}
      onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setExpanded(!expanded) } }}
    >
      {/* Incoming chaotic beam (wide, diffuse, white) — pulses when expanded */}
      <line
        x1={inX} y1={inY} x2={px} y2={py}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={5}
        strokeDasharray="2 3"
        opacity={expanded ? 0.5 : 0.7}
        className={expanded ? 'vital-edge-flow' : ''}
      />

      {/* Prism triangular body — glows when expanded */}
      <g transform={`translate(${px}, ${py}) rotate(${prismRotation})`}>
        <polygon
          points="0,-12 10,9 -10,9"
          fill={expanded ? 'rgba(137,180,250,0.2)' : 'rgba(137,180,250,0.1)'}
          stroke={expanded ? 'rgba(137,180,250,0.5)' : 'rgba(137,180,250,0.25)'}
          strokeWidth={expanded ? 1.5 : 0.8}
          filter="url(#glow)"
        />
      </g>

      {/* 5 chromatic outgoing beams (one per organ color) */}
      {ORGAN_ORDER.map(sym => {
        const targetPos = organPositions.get(sym)
        if (!targetPos) return null
        const color = ORGAN_COLORS[sym]
        if (!color) return null
        const beamAngle = Math.atan2(targetPos.y - py, targetPos.x - px)
        const beamLen = expanded ? 45 : 18
        return (
          <line
            key={`beam-${sym}`}
            x1={px}
            y1={py}
            x2={px + Math.cos(beamAngle) * beamLen}
            y2={py + Math.sin(beamAngle) * beamLen}
            stroke={color}
            strokeWidth={expanded ? 1.5 : 0.8}
            opacity={expanded ? 0.6 : 0.35}
            filter="url(#glow)"
            className={expanded ? 'vital-edge-flow' : ''}
          />
        )
      })}

      {/* ECS label */}
      <text
        x={px}
        y={py + 22}
        textAnchor="middle"
        fill={expanded ? 'var(--color-blue)' : 'var(--color-overlay0)'}
        fontSize={expanded ? 8 : 6}
        fontFamily="'JetBrains Mono', monospace"
        opacity={expanded ? 0.9 : 0.5}
        fontWeight={expanded ? 'bold' : 'normal'}
      >
        ECS
      </text>

      {/* Phase 3: Expanded C×I resolution breakdown panel */}
      {expanded && (
        <g transform={`translate(${px + 28}, ${py - 30})`}>
          {/* Background card */}
          <rect
            x={-4} y={-4} width={130} height={62}
            rx={4}
            fill="rgba(12,12,18,0.9)"
            stroke="rgba(137,180,250,0.3)"
            strokeWidth={0.8}
          />
          {/* Title */}
          <text x={2} y={6} fill="var(--color-blue)" fontSize={7} fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
            ECS C×I Résolution
          </text>
          {/* Level rows */}
          {ECS_LEVELS.map((lvl, i) => (
            <g key={lvl.level} transform={`translate(2, ${16 + i * 14})`}>
              <circle r={3} fill={lvl.color} cx={4} cy={0} />
              <text x={10} y={3} fill="var(--color-fg)" fontSize={6.5} fontFamily="'JetBrains Mono', monospace">
                {lvl.level} {lvl.label}
              </text>
              <text x={10} y={11} fill="var(--color-overlay0)" fontSize={5} fontFamily="'JetBrains Mono', monospace">
                {lvl.desc}
              </text>
            </g>
          ))}
        </g>
      )}
    </g>
  )
}
