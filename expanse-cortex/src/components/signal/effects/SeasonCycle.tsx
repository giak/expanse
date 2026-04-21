// ══════════════════════════════════════════════════════════════
// SEASON CYCLE — 4 seasonal colors rotating on the ring
// The Dream is a garden — seasons show its passage
// Winter(bleu) → Spring(violet) → Summer(vert) → Autumn(orange)
// ══════════════════════════════════════════════════════════════


interface SeasonCycleProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  season?: 'winter' | 'spring' | 'summer' | 'autumn'
}

const SEASONS = [
  { id: 'winter', color: 'var(--color-blue)', label: 'HIVER ❄', icon: '❄' },
  { id: 'spring', color: 'var(--color-mauve)', label: 'PRINTEMPS ✿', icon: '✿' },
  { id: 'summer', color: 'var(--color-green)', label: 'ÉTÉ ☀', icon: '☀' },
  { id: 'autumn', color: 'var(--color-peach)', label: 'AUTOMNE 🍂', icon: '🍂' },
] as const

export function SeasonCycle({ x, y, progress, season }: SeasonCycleProps) {
  // Determine active season index
  const activeIdx = season
    ? SEASONS.findIndex(s => s.id === season)
    : Math.floor(progress * 4) % 4

  const activeSeason = SEASONS[Math.max(0, activeIdx)]

  // Ring parameters
  const innerR = 55
  const outerR = 75

  // Season transition: each quarter of progress = one season
  const seasonProgress = (progress * 4) % 1

  // Appear phase
  const appear = Math.min(progress * 3, 1)

  return (
    <g className="pointer-events-none">
      {/* Season ring segments */}
      {SEASONS.map((s, i) => {
        const startAngle = (i * Math.PI * 2) / 4 - Math.PI / 2
        const endAngle = ((i + 1) * Math.PI * 2) / 4 - Math.PI / 2
        const isActive = i <= activeIdx

        // Draw arc segment
        const sx = x + Math.cos(startAngle) * outerR
        const sy = y + Math.sin(startAngle) * outerR
        const ex = x + Math.cos(endAngle) * outerR
        const ey = y + Math.sin(endAngle) * outerR
        const sxI = x + Math.cos(startAngle) * innerR
        const syI = y + Math.sin(startAngle) * innerR
        const exI = x + Math.cos(endAngle) * innerR
        const eyI = y + Math.sin(endAngle) * innerR

        const segAlpha = isActive ? appear * 0.3 : appear * 0.05

        return (
          <path key={s.id}
            d={`M ${sx} ${sy} A ${outerR} ${outerR} 0 0 1 ${ex} ${ey}
                L ${exI} ${eyI} A ${innerR} ${innerR} 0 0 0 ${sxI} ${syI} Z`}
            fill={s.color} opacity={segAlpha}
            stroke={s.color} strokeWidth={isActive ? 1 : 0.3}
            strokeOpacity={isActive ? 0.5 : 0.1}
          />
        )
      })}

      {/* Active season glow */}
      <circle cx={x} cy={y} r={innerR - 10}
        fill={activeSeason.color} opacity={appear * 0.06} filter="url(#glow)" />

      {/* Rotating indicator dot */}
      {(() => {
        const angle = -Math.PI / 2 + (activeIdx * Math.PI * 2) / 4 + seasonProgress * (Math.PI / 2)
        const dotR = (innerR + outerR) / 2
        const dx = x + Math.cos(angle) * dotR
        const dy = y + Math.sin(angle) * dotR
        return (
          <circle cx={dx} cy={dy} r={4}
            fill={activeSeason.color} opacity={appear * 0.8} filter="url(#glow)" />
        )
      })()}

      {/* Season label */}
      <text x={x} y={y + outerR + 18} textAnchor="middle"
        fill={activeSeason.color} fontSize={7} fontFamily="'JetBrains Mono', monospace"
        fontWeight="bold" opacity={appear * 0.7}>
        {activeSeason.label}
      </text>

      {/* Season icon at center */}
      <text x={x} y={y + 4} textAnchor="middle" dominantBaseline="central"
        fontSize={14} opacity={appear * 0.5}>
        {activeSeason.icon}
      </text>
    </g>
  )
}
// See MEMO-NOTES.md §A
