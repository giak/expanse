// ══════════════════════════════════════════════════════════════
// PRUNE SHEARS — gardening shears cutting a weak pattern
// L'élagage est un acte de jardinier — les cisailles le montrent
// ══════════════════════════════════════════════════════════════


interface PruneShearsProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  color?: string
}

export function PruneShears({ x, y, progress, color = 'var(--color-peach)' }: PruneShearsProps) {
  // Animation: shears appear → close → cut → debris falls
  const appearPhase = Math.min(progress / 0.2, 1)
  const closePhase = progress > 0.3 ? Math.min((progress - 0.3) / 0.2, 1) : 0
  const cutPhase = progress > 0.5 ? Math.min((progress - 0.5) / 0.2, 1) : 0
  const debrisPhase = progress > 0.7 ? Math.min((progress - 0.7) / 0.3, 1) : 0

  // Shear blades angle: open=30°, closed=0°
  const bladeAngle = 30 * (1 - closePhase)

  // Debris particles
  const debrisCount = 5

  return (
    <g className="pointer-events-none">
      {/* Cut glow */}
      {cutPhase > 0 && (
        <circle cx={x} cy={y} r={25}
          fill={color} opacity={cutPhase * 0.1} filter="url(#glow)" />
      )}

      {/* Shears — two blades crossing */}
      <g transform={`translate(${x}, ${y})`} opacity={appearPhase}>
        {/* Blade 1 — rotates clockwise */}
        <g transform={`rotate(${-bladeAngle})`}>
          <line x1={0} y1={0} x2={0} y2={-30}
            stroke={color} strokeWidth={2.5} opacity={0.7} strokeLinecap="round" />
          <line x1={0} y1={0} x2={8} y2={12}
            stroke="var(--color-overlay0)" strokeWidth={2} opacity={0.5} strokeLinecap="round" />
        </g>

        {/* Blade 2 — rotates counter-clockwise */}
        <g transform={`rotate(${bladeAngle})`}>
          <line x1={0} y1={0} x2={0} y2={-30}
            stroke={color} strokeWidth={2.5} opacity={0.7} strokeLinecap="round" />
          <line x1={0} y1={0} x2={-8} y2={12}
            stroke="var(--color-overlay0)" strokeWidth={2} opacity={0.5} strokeLinecap="round" />
        </g>

        {/* Pivot */}
        <circle r={3} fill={color} opacity={0.6} />
      </g>

      {/* "PRUNE" label */}
      {appearPhase > 0.3 && (
        <text x={x} y={y + 25} textAnchor="middle"
          fill={color} fontSize={6} fontFamily="'JetBrains Mono', monospace"
          fontWeight="bold" opacity={(appearPhase - 0.3) * 1.4 * 0.6}>
          PRUNE
        </text>
      )}

      {/* Debris — falling leaf/petal fragments after cut */}
      {debrisPhase > 0 && Array.from({ length: debrisCount }, (_, i) => {
        const angle = (i * Math.PI * 2) / debrisCount + debrisPhase * 0.5
        const dist = 15 + debrisPhase * 20
        const dx = x + Math.cos(angle) * dist
        const dy = y + Math.sin(angle) * dist + debrisPhase * 10  // fall down
        const alpha = (1 - debrisPhase) * 0.5

        return (
          <g key={i} opacity={alpha}>
            <ellipse cx={dx} cy={dy} rx={3} ry={2}
              fill={color} transform={`rotate(${angle * 60}, ${dx}, ${dy})`} />
          </g>
        )
      })}

      {/* Strikethrough line on cut pattern */}
      {cutPhase > 0 && (
        <line x1={x - 20} y1={y - 40} x2={x + 20} y2={y - 40}
          stroke="var(--color-red)" strokeWidth={1.5} opacity={cutPhase * 0.4}
          strokeDasharray="3 2" />
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
