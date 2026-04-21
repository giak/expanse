// ══════════════════════════════════════════════════════════════
// CONFIANCE GAUGE — circular gauge showing Indice de Confiance %
// Fills progressively around Ω from 0% to target value
// ══════════════════════════════════════════════════════════════


interface ConfianceGaugeProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  targetPercent?: number // confidence target (default 82)
  color?: string
}

export function ConfianceGauge({ x, y, progress, targetPercent = 82, color = 'var(--color-green)' }: ConfianceGaugeProps) {
  const gaugeRadius = 55
  const strokeWidth = 4
  const circumference = 2 * Math.PI * gaugeRadius

  // Current fill: progress * target (so it fills to target% over the step duration)
  const currentPercent = Math.min(progress * targetPercent, targetPercent)
  const dashOffset = circumference * (1 - currentPercent / 100)

  // Color shifts from yellow (low) to green (high)
  const gaugeColor = currentPercent < 50 ? 'var(--color-yellow)' : currentPercent < 75 ? 'var(--color-green)' : 'var(--color-green)'

  return (
    <g className="pointer-events-none">
      {/* Background track */}
      <circle cx={x} cy={y} r={gaugeRadius}
        fill="none" stroke="var(--color-surface1)" strokeWidth={strokeWidth} opacity={0.3}
        strokeDasharray="3 5"
      />

      {/* Filled arc */}
      <circle cx={x} cy={y} r={gaugeRadius}
        fill="none" stroke={gaugeColor} strokeWidth={strokeWidth}
        strokeDasharray={`${circumference}`} strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${x} ${y})`}
        opacity={0.8}
        filter="url(#glow)"
        style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
      />

      {/* Graduation marks — every 25% */}
      {[0, 25, 50, 75, 100].map(pct => {
        const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2
        const innerR = gaugeRadius - 8
        const outerR = gaugeRadius + 8
        return (
          <line key={pct}
            x1={x + Math.cos(angle) * innerR} y1={y + Math.sin(angle) * innerR}
            x2={x + Math.cos(angle) * outerR} y2={y + Math.sin(angle) * outerR}
            stroke="var(--color-overlay0)" strokeWidth={0.5} opacity={0.3}
          />
        )
      })}

      {/* Target mark — small triangle at target % */}
      {(() => {
        const targetAngle = (targetPercent / 100) * 2 * Math.PI - Math.PI / 2
        const markR = gaugeRadius + 12
        const mx = x + Math.cos(targetAngle) * markR
        const my = y + Math.sin(targetAngle) * markR
        return (
          <polygon
            points="0,-3 4,3 -4,3"
            fill={color} opacity={0.5}
            transform={`translate(${mx}, ${my}) rotate(${(targetPercent / 100) * 360})`}
          />
        )
      })()}

      {/* Center text — percentage */}
      <text x={x} y={y - 4} textAnchor="middle" dominantBaseline="central"
        fill={gaugeColor} fontSize={14} fontWeight="bold"
        fontFamily="'JetBrains Mono', monospace" opacity={0.9}>
        {Math.round(currentPercent)}%
      </text>

      {/* Sub-label */}
      <text x={x} y={y + 14} textAnchor="middle"
        fill="var(--color-overlay0)" fontSize={6} fontFamily="'JetBrains Mono', monospace" opacity={0.5}>
        CONFIANCE
      </text>
    </g>
  )
}
// See MEMO-NOTES.md §A
