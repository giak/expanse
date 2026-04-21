// ══════════════════════════════════════════════════════════════
// TRIPOLE ORBIT — 3 circles orbiting around Ψ for Triangulation
// Each circle = one pole: Anchor (lavande), Vessel (cyan), Web (teal)
// When converging, circles tighten toward center
// ══════════════════════════════════════════════════════════════


interface TriPoleOrbitProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  converging?: boolean // true = poles are converging (step 6+)
  color?: string
}

const POLES = [
  { label: 'Anchor', color: 'var(--color-lavender)', offset: 0 },
  { label: 'Vessel', color: 'var(--color-sapphire)', offset: (2 * Math.PI) / 3 },
  { label: 'Web', color: 'var(--color-teal)', offset: (4 * Math.PI) / 3 },
]

const BASE_RADIUS = 85
const CONVERGED_RADIUS = 40

export function TriPoleOrbit({ x, y, progress, converging = false, color = 'var(--color-red)' }: TriPoleOrbitProps) {
  const orbitRadius = converging
    ? BASE_RADIUS - (BASE_RADIUS - CONVERGED_RADIUS) * progress
    : BASE_RADIUS

  const rotationSpeed = converging ? 0.8 : 1.5 // slower when converging

  return (
    <g className="pointer-events-none">
      {/* Central glow — Ψ hub */}
      <circle cx={x} cy={y} r={18} fill={color} opacity={0.12} filter="url(#glow)" />

      {/* Connection lines from center to each pole */}
      {POLES.map((pole, i) => {
        const angle = pole.offset + progress * Math.PI * 2 * rotationSpeed
        const px = x + Math.cos(angle) * orbitRadius
        const py = y + Math.sin(angle) * orbitRadius
        return (
          <line key={`line-${i}`}
            x1={x} y1={y} x2={px} y2={py}
            stroke={pole.color} strokeWidth={1} opacity={0.2}
            strokeDasharray="4 4"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="1s" repeatCount="indefinite" />
          </line>
        )
      })}

      {/* Orbit path — faint circle */}
      <circle cx={x} cy={y} r={orbitRadius}
        fill="none" stroke={color} strokeWidth={0.5} opacity={0.1}
        strokeDasharray="3 6"
      />

      {/* Pole circles with labels */}
      {POLES.map((pole, i) => {
        const angle = pole.offset + progress * Math.PI * 2 * rotationSpeed
        const px = x + Math.cos(angle) * orbitRadius
        const py = y + Math.sin(angle) * orbitRadius
        const poleRadius = converging ? 12 : 16

        return (
          <g key={`pole-${i}`}>
            {/* Glow */}
            <circle cx={px} cy={py} r={poleRadius + 6}
              fill={pole.color} opacity={0.08} filter="url(#glow)" />
            {/* Circle */}
            <circle cx={px} cy={py} r={poleRadius}
              fill={`${pole.color}20`} stroke={pole.color} strokeWidth={1.5} opacity={0.7} />
            {/* Label */}
            <text x={px} y={py + poleRadius + 10} textAnchor="middle"
              fill={pole.color} fontSize={7} fontFamily="'JetBrains Mono', monospace" opacity={0.6}>
              {pole.label}
            </text>
            {/* Icon inside */}
            <text x={px} y={py + 1} textAnchor="middle" dominantBaseline="central"
              fontSize={10} opacity={0.8}>
              {i === 0 ? '🏛️' : i === 1 ? '📜' : '🌐'}
            </text>
          </g>
        )
      })}

      {/* Convergence indicator — pulsing ring when converging */}
      {converging && (
        <circle cx={x} cy={y} r={orbitRadius + 10}
          fill="none" stroke={color} strokeWidth={2}
          opacity={0.15 + Math.sin(progress * Math.PI * 4) * 0.1}
          filter="url(#glow)"
          className="signal-ring-pulse"
        />
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
