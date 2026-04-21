// ══════════════════════════════════════════════════════════════
// CONTRADICTION BOLT — éclair entre Σ (input) et Μ (axiome touché)
// Shows the electric shock of contradiction between user input and sealed axiom
// ══════════════════════════════════════════════════════════════


interface ContradictionBoltProps {
  sigmaPos: { x: number; y: number }
  muPos: { x: number; y: number }
  progress: number    // 0→1 over step duration
  color?: string
}

export function ContradictionBolt({ sigmaPos, muPos, progress, color = 'var(--color-red)' }: ContradictionBoltProps) {
  // Bolt flashes on and off — 3 distinct strikes
  const strikeCount = 3
  const strikeDuration = 1 / strikeCount
  const currentStrike = Math.floor(progress / strikeDuration)
  const strikeProgress = (progress % strikeDuration) / strikeDuration

  // Each strike: bright flash then fade
  const strikeAlpha = strikeProgress < 0.3
    ? 1 - strikeProgress * 2
    : Math.max(0, 0.4 - (strikeProgress - 0.3) * 0.5)

  if (strikeAlpha <= 0.05) return null

  // Generate bolt path (deterministic jitter based on strike index)
  const seed = currentStrike * 17
  const jitterOffsets = Array.from({ length: 10 }, (_, i) =>
    Math.sin(seed + i * 7.3) * 20
  )

  const x1 = sigmaPos.x, y1 = sigmaPos.y + 20
  const x2 = muPos.x, y2 = muPos.y - 20
  const segments = 8

  const points: string[] = [`M ${x1} ${y1}`]
  for (let i = 1; i < segments; i++) {
    const t = i / segments
    const edgeFade = 1 - Math.abs(t - 0.5) * 2
    const mx = x1 + (x2 - x1) * t + jitterOffsets[i] * edgeFade
    const my = y1 + (y2 - y1) * t + jitterOffsets[i + 1] * 0.3 * edgeFade
    points.push(`L ${mx.toFixed(1)} ${my.toFixed(1)}`)
  }
  points.push(`L ${x2} ${y2}`)
  const path = points.join(' ')

  return (
    <g className="pointer-events-none">
      {/* Glow behind bolt */}
      <path d={path} fill="none" stroke={color} strokeWidth={8}
        opacity={strikeAlpha * 0.15} filter="url(#glow)"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Main bolt */}
      <path d={path} fill="none" stroke={color} strokeWidth={2.5}
        opacity={strikeAlpha * 0.8}
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Core bright line */}
      <path d={path} fill="none" stroke="#fff" strokeWidth={1}
        opacity={strikeAlpha * 0.5}
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Impact flash at Μ end */}
      <circle cx={x2} cy={y2} r={15 + (1 - strikeAlpha) * 10}
        fill={color} opacity={strikeAlpha * 0.3} filter="url(#glow)" />

      {/* Impact flash at Σ end */}
      <circle cx={x1} cy={y1} r={12 + (1 - strikeAlpha) * 8}
        fill={color} opacity={strikeAlpha * 0.2} filter="url(#glow)" />
    </g>
  )
}
// See MEMO-NOTES.md §B
