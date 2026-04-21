// ══════════════════════════════════════════════════════════════
// RED ALERT — flash rouge + anneau pulsant sur l'axiome touché
// Appears during DETECT phase when an axiom contradiction is found
// ══════════════════════════════════════════════════════════════


interface RedAlertProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  color?: string
}

export function RedAlert({ x, y, progress, color = 'var(--color-red)' }: RedAlertProps) {
  // Flash intensity peaks early then decays
  const flashIntensity = progress < 0.3 ? 1 - progress * 2 : Math.max(0, 0.4 - (progress - 0.3) * 0.5)

  // Pulsing ring expands outward
  const ringPhase = (progress * 3) % 1
  const ringRadius = 20 + ringPhase * 60
  const ringOpacity = (1 - ringPhase) * 0.6

  // Second delayed pulse
  const ring2Phase = ((progress * 3) + 0.5) % 1
  const ring2Radius = 20 + ring2Phase * 60
  const ring2Opacity = (1 - ring2Phase) * 0.4

  // Warning text
  const textVisible = progress > 0.2

  return (
    <g className="pointer-events-none">
      {/* Full flash glow */}
      <circle cx={x} cy={y} r={50}
        fill={color} opacity={flashIntensity * 0.3} filter="url(#glow)" />

      {/* Inner flash burst */}
      <circle cx={x} cy={y} r={30}
        fill={color} opacity={flashIntensity * 0.5} />

      {/* Pulsing ring 1 — expanding outward */}
      <circle cx={x} cy={y} r={ringRadius}
        fill="none" stroke={color} strokeWidth={2}
        opacity={ringOpacity} filter="url(#glow)" />

      {/* Pulsing ring 2 — delayed echo */}
      <circle cx={x} cy={y} r={ring2Radius}
        fill="none" stroke={color} strokeWidth={1.5}
        opacity={ring2Opacity} />

      {/* "⚠" warning icon above */}
      {textVisible && (
        <g transform={`translate(${x}, ${y - 50})`}>
          <text textAnchor="middle" dominantBaseline="central"
            fill={color} fontSize={16} opacity={0.9}
            className="signal-ring-pulse">⚠</text>
        </g>
      )}

      {/* Axiom label */}
      {textVisible && (
        <text x={x} y={y + 50} textAnchor="middle"
          fill={color} fontSize={7} fontFamily="'JetBrains Mono', monospace"
          opacity={0.7}>No Global Variables</text>
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
