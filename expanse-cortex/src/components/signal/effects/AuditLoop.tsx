// ══════════════════════════════════════════════════════════════
// AUDIT LOOP — animated Ψ⇌Φ double-arrow with oscillating particles
// The heartbeat of L2: the boucle audit pulses like a living system
// ══════════════════════════════════════════════════════════════


interface AuditLoopProps {
  psiPos: { x: number; y: number }
  phiPos: { x: number; y: number }
  progress: number    // 0→1 over step duration
  color?: string
}

export function AuditLoop({ psiPos, phiPos, progress, color = 'var(--color-yellow)' }: AuditLoopProps) {
  const dx = phiPos.x - psiPos.x
  const dy = phiPos.y - psiPos.y

  // Particles oscillate along the line: some go Ψ→Φ, some Φ→Ψ
  const particles = Array.from({ length: 6 }, (_, i) => {
    const t = ((progress * 2 + i / 6) % 1)
    const direction = i % 2 === 0 ? 1 : -1  // alternating direction
    const p = direction === 1 ? t : 1 - t
    return {
      x: psiPos.x + dx * p,
      y: psiPos.y + dy * p,
      direction,
      opacity: Math.sin(p * Math.PI) * 0.8,  // fade at endpoints
    }
  })

  return (
    <g className="pointer-events-none">
      {/* Connection line — dashed, animated */}
      <line
        x1={psiPos.x} y1={psiPos.y}
        x2={phiPos.x} y2={phiPos.y}
        stroke={color} strokeWidth={1.5}
        strokeDasharray="6 4"
        opacity={0.4}
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.5s" repeatCount="indefinite" />
      </line>

      {/* Arrows at both ends — Ψ→Φ and Φ→Ψ */}
      {/* Arrow toward Φ */}
      <polygon
        points={`0,-4 8,0 0,4`}
        fill={color} opacity={0.6}
        transform={`translate(${psiPos.x + dx * 0.55}, ${psiPos.y + dy * 0.55}) rotate(${Math.atan2(dy, dx) * 180 / Math.PI})`}
      />
      {/* Arrow toward Ψ */}
      <polygon
        points={`0,-4 -8,0 0,4`}
        fill={color} opacity={0.6}
        transform={`translate(${psiPos.x + dx * 0.45}, ${psiPos.y + dy * 0.45}) rotate(${Math.atan2(dy, dx) * 180 / Math.PI})`}
      />

      {/* Oscillating particles */}
      {particles.map((p, i) => (
        <circle key={i}
          cx={p.x} cy={p.y} r={3}
          fill={color} opacity={p.opacity}
          filter="url(#glow)"
        />
      ))}

      {/* Pulsing glow at midpoint */}
      <circle
        cx={(psiPos.x + phiPos.x) / 2}
        cy={(psiPos.y + phiPos.y) / 2}
        r={8 + Math.sin(progress * Math.PI * 4) * 4}
        fill={color} opacity={0.12 + Math.sin(progress * Math.PI * 2) * 0.06}
        filter="url(#glow)"
      />

      {/* Label */}
      <text
        x={(psiPos.x + phiPos.x) / 2}
        y={(psiPos.y + phiPos.y) / 2 - 18}
        textAnchor="middle" fill={color}
        fontSize={8} fontFamily="'JetBrains Mono', monospace"
        opacity={0.5}
      >Ψ⇌Φ</text>
    </g>
  )
}
// See MEMO-NOTES.md §B
