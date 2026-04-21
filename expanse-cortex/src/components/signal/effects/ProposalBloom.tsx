// ══════════════════════════════════════════════════════════════
// PROPOSAL BLOOM — flower that blooms from Μ when a proposal is generated
// The proposal is a shoot — it blooms into a PROPOSAL_OPEN
// ══════════════════════════════════════════════════════════════


interface ProposalBloomProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  label?: string      // proposal type label (e.g. "MODIFY", "REFACTOR")
  color?: string
}

export function ProposalBloom({ x, y, progress, label = 'PROPOSAL', color = 'var(--color-green)' }: ProposalBloomProps) {
  // Bloom animation: stem grows → bud forms → petals open → glow
  const stemPhase = Math.min(progress / 0.25, 1)
  const budPhase = progress > 0.25 ? Math.min((progress - 0.25) / 0.2, 1) : 0
  const bloomPhase = progress > 0.45 ? Math.min((progress - 0.45) / 0.3, 1) : 0
  const glowPhase = progress > 0.75 ? Math.min((progress - 0.75) / 0.25, 1) : 0

  const petalCount = 6
  const maxPetalR = 22

  // Stem endpoint
  const stemEndY = y - 50 * stemPhase

  return (
    <g className="pointer-events-none">
      {/* Glow when fully bloomed */}
      {glowPhase > 0 && (
        <circle cx={x} cy={stemEndY} r={maxPetalR + 15}
          fill={color} opacity={glowPhase * 0.08} filter="url(#glow)" />
      )}

      {/* Stem */}
      {stemPhase > 0 && (
        <line x1={x} y1={y} x2={x} y2={stemEndY}
          stroke={color} strokeWidth={2} opacity={stemPhase * 0.6}
          strokeDasharray="3 2" />
      )}

      {/* Leaves on stem */}
      {stemPhase > 0.5 && (
        <>
          <ellipse cx={x - 8} cy={y - 20 * stemPhase}
            rx={6} ry={3} fill={color} opacity={(stemPhase - 0.5) * 2 * 0.3}
            transform={`rotate(-30, ${x - 8}, ${y - 20 * stemPhase})`} />
          <ellipse cx={x + 8} cy={y - 35 * stemPhase}
            rx={5} ry={2.5} fill={color} opacity={(stemPhase - 0.5) * 2 * 0.25}
            transform={`rotate(25, ${x + 8}, ${y - 35 * stemPhase})`} />
        </>
      )}

      {/* Bud */}
      {budPhase > 0 && bloomPhase === 0 && (
        <ellipse cx={x} cy={stemEndY} rx={5 * budPhase} ry={8 * budPhase}
          fill={color} opacity={budPhase * 0.5} />
      )}

      {/* Petals — bloom outward */}
      {bloomPhase > 0 && Array.from({ length: petalCount }, (_, i) => {
        const angle = (i * Math.PI * 2) / petalCount - Math.PI / 2
        const petalR = maxPetalR * bloomPhase
        const px = x + Math.cos(angle) * petalR * 0.5
        const py = stemEndY + Math.sin(angle) * petalR * 0.5

        return (
          <ellipse key={i} cx={px} cy={py}
            rx={8 * bloomPhase} ry={4 * bloomPhase}
            fill={color} opacity={bloomPhase * 0.35}
            transform={`rotate(${(angle * 180) / Math.PI}, ${px}, ${py})`} />
        )
      })}

      {/* Center of bloom */}
      {bloomPhase > 0.3 && (
        <circle cx={x} cy={stemEndY} r={4 * bloomPhase}
          fill={color} opacity={bloomPhase * 0.6} filter="url(#glow)" />
      )}

      {/* Label */}
      {bloomPhase > 0.5 && (
        <text x={x} y={stemEndY - maxPetalR - 8} textAnchor="middle"
          fill={color} fontSize={6} fontFamily="'JetBrains Mono', monospace"
          fontWeight="bold" opacity={(bloomPhase - 0.5) * 2 * 0.7}>
          {label}
        </text>
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
