// ══════════════════════════════════════════════════════════════
// CONSTITUTIONAL GUARD — shield with lock protecting immutable sections
// Appears during L3 Auto-Check to verify sections Ⅰ/Ⅲ/Ⅵ are untouched
// ══════════════════════════════════════════════════════════════


interface ConstitutionalGuardProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  color?: string
}

export function ConstitutionalGuard({ x, y, progress, color = 'var(--color-yellow)' }: ConstitutionalGuardProps) {
  // Sequential axiom checks: sys:core axiomes
  const axioms = ['Ω_RECURSION', 'Ω_GATE', 'Ω_PLANCK']
  const checkCount = Math.min(Math.floor(progress * 3), 3)

  // Lock appears after all 3 checks pass
  const lockVisible = checkCount >= 3

  // Shield glow intensity
  const glowIntensity = Math.sin(progress * Math.PI) * 0.3 + 0.2

  return (
    <g className="pointer-events-none">
      {/* Outer shield glow */}
      <circle cx={x} cy={y} r={60}
        fill={color} opacity={glowIntensity * 0.15} filter="url(#glow)" />

      {/* Shield shape — pointed bottom */}
      <path
        d={`M ${x - 35} ${y - 30} L ${x + 35} ${y - 30} L ${x + 35} ${y + 10}
            Q ${x + 35} ${y + 30} ${x} ${y + 45}
            Q ${x - 35} ${y + 30} ${x - 35} ${y + 10} Z`}
        fill={`${color}10`} stroke={color} strokeWidth={1.5}
        opacity={0.4 + progress * 0.3}
      />

      {/* Axiom check indicators — stacked */}
      {axioms.map((axiom, i) => {
        const checked = i < checkCount
        const cy = y - 18 + i * 16
        return (
          <g key={axiom}>
            {/* Axiom label */}
            <text x={x + 14} y={cy + 1} textAnchor="middle" dominantBaseline="central"
              fill={checked ? color : 'var(--color-overlay0)'} fontSize={7}
              fontFamily="'JetBrains Mono', monospace"              opacity={checked ? 0.9 : 0.3}>{axiom}</text>
            {/* Check mark */}
            {checked && (
              <g transform={`translate(${x - 14}, ${cy})`}>
                <circle r={5} fill={`${color}30`} stroke={color} strokeWidth={0.8} opacity={0.8} />
                <text textAnchor="middle" dominantBaseline="central"
                  fill={color} fontSize={7} fontWeight="bold">✓</text>
              </g>
            )}
            {/* Empty circle for unchecked */}
            {!checked && (
              <circle cx={x - 14} cy={cy} r={5}
                fill="none" stroke="var(--color-overlay0)" strokeWidth={0.5} opacity={0.2} />
            )}
          </g>
        )
      })}

      {/* Lock icon — appears when all checks pass */}
      {lockVisible && (
        <g transform={`translate(${x}, ${y + 28})`}>
          {/* Lock body */}
          <rect x={-7} y={-2} width={14} height={10} rx={2}
            fill={`${color}30`} stroke={color} strokeWidth={1} opacity={0.8} />
          {/* Lock shackle */}
          <path d="M -4 -2 L -4 -6 A 4 4 0 0 1 4 -6 L 4 -2"
            fill="none" stroke={color} strokeWidth={1.5} opacity={0.7} />
          {/* Keyhole */}
          <circle cx={0} cy={3} r={1.5} fill={color} opacity={0.6} />
        </g>
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
