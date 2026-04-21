// ══════════════════════════════════════════════════════════════
// MUTATION ORBIT — proposals orbiting around Ψ like planets
// Each proposal is a small orb with a label, circling Ψ
// ══════════════════════════════════════════════════════════════


interface MutationOrbitProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  proposalCount?: number  // how many proposals to show
  color?: string
}

export function MutationOrbit({ x, y, progress, proposalCount = 3, color = 'var(--color-mauve)' }: MutationOrbitProps) {
  // Orbit parameters
  const orbitRadius = 70
  const proposals = [
    { label: 'MODIFY', color: 'var(--color-blue)' },
    { label: 'REFACTOR', color: 'var(--color-mauve)' },
    { label: 'DELETE', color: 'var(--color-peach)' },
  ].slice(0, proposalCount)

  // Animation: proposals appear one by one, then orbit
  const appearPhase = Math.min(progress / 0.3, 1)
  const orbitPhase = progress > 0.2 ? (progress - 0.2) / 0.8 : 0

  // Orbit center is at (x, y) — which should be Ψ position
  return (
    <g className="pointer-events-none">
      {/* Orbit ring */}
      <circle cx={x} cy={y} r={orbitRadius}
        fill="none" stroke={color} strokeWidth={0.8}
        opacity={appearPhase * 0.25}
        strokeDasharray="4 6" />

      {/* Inner orbit ring */}
      <circle cx={x} cy={y} r={orbitRadius * 0.6}
        fill="none" stroke={color} strokeWidth={0.5}
        opacity={appearPhase * 0.15}
        strokeDasharray="2 8" />

      {/* Orbiting proposals */}
      {proposals.map((p, i) => {
        // Stagger appearance
        const delay = i * 0.15
        const pAppear = progress > delay ? Math.min((progress - delay) / 0.2, 1) : 0
        if (pAppear <= 0) return null

        // Orbital angle — each proposal starts at a different angle
        const startAngle = (i * Math.PI * 2) / proposals.length
        const angle = startAngle + orbitPhase * Math.PI * 2
        const radius = i % 2 === 0 ? orbitRadius : orbitRadius * 0.6

        // Proposal position on orbit
        const px = x + Math.cos(angle) * radius
        const py = y + Math.sin(angle) * radius * 0.5  // elliptical

        // Trail particles
        const trailCount = 4
        const trailAlpha = pAppear * 0.3

        return (
          <g key={p.label}>
            {/* Trail */}
            {Array.from({ length: trailCount }, (_, t) => {
              const trailAngle = angle - (t + 1) * 0.15
              const tx = x + Math.cos(trailAngle) * radius
              const ty = y + Math.sin(trailAngle) * radius * 0.5
              return (
                <circle key={t} cx={tx} cy={ty}
                  r={2.5 - t * 0.5}
                  fill={p.color} opacity={trailAlpha * (1 - t / trailCount)} />
              )
            })}

            {/* Proposal orb */}
            <circle cx={px} cy={py} r={8}
              fill={p.color} opacity={pAppear * 0.2} />
            <circle cx={px} cy={py} r={5}
              fill={p.color} opacity={pAppear * 0.5} filter="url(#glow)" />
            <circle cx={px} cy={py} r={3}
              fill={p.color} opacity={pAppear * 0.9} />

            {/* Label */}
            <text x={px} y={py + 13} textAnchor="middle"
              fill={p.color} fontSize={5} fontFamily="'JetBrains Mono', monospace"
              fontWeight="bold" opacity={pAppear * 0.6}>
              {p.label}
            </text>
          </g>
        )
      })}

      {/* Center glow — Ψ thinking about mutations */}
      {appearPhase > 0.5 && (
        <circle cx={x} cy={y} r={20}
          fill={color} opacity={(appearPhase - 0.5) * 2 * 0.06} filter="url(#glow)" />
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
