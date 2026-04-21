// ══════════════════════════════════════════════════════════════
// VESSEL RADAR — radar sweep from Φ scanning the codebase
// Φ cherche activement — le radar montre la recherche
// ══════════════════════════════════════════════════════════════


interface VesselRadarProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  color?: string
}

export function VesselRadar({ x, y, progress, color = 'var(--color-sapphire)' }: VesselRadarProps) {
  // Radar sweep rotates — 2 full rotations during the step
  const sweepAngle = progress * Math.PI * 4

  // Radar rings expand outward in sequence
  const ringCount = 3
  const maxRadius = 80

  // Sweep beam alpha — fades at end
  const sweepAlpha = Math.min(progress * 3, 1) * (progress < 0.85 ? 1 : (1 - progress) / 0.15)

  // "SCAN" label appears early
  const scanAlpha = Math.min(progress * 4, 1)

  // "search_code" label
  const toolLabelAlpha = progress > 0.15 ? Math.min((progress - 0.15) * 3, 0.7) : 0

  return (
    <g className="pointer-events-none">
      {/* Radar base glow */}
      <circle cx={x} cy={y} r={maxRadius + 10}
        fill={color} opacity={0.04} filter="url(#glow)" />

      {/* Concentric radar rings — expand outward */}
      {Array.from({ length: ringCount }, (_, i) => {
        const ringDelay = i * 0.2
        const ringProgress = Math.max(0, Math.min((progress - ringDelay) / (1 - ringDelay), 1))
        const radius = ringProgress * maxRadius
        if (radius < 5) return null

        return (
          <circle key={i} cx={x} cy={y} r={radius}
            fill="none" stroke={color}
            strokeWidth={1.2}
            opacity={(1 - ringProgress * 0.6) * sweepAlpha * 0.5}
            strokeDasharray="3 4"
          />
        )
      })}

      {/* Radar sweep — rotating cone of light */}
      <g transform={`rotate(${(sweepAngle * 180 / Math.PI) % 360}, ${x}, ${y})`}>
        {/* Sweep cone — gradient arc */}
        <path
          d={`M ${x} ${y} L ${x + maxRadius} ${y}`}
          stroke={color}
          strokeWidth={2}
          opacity={sweepAlpha * 0.8}
          strokeLinecap="round"
        />
        {/* Sweep glow trail */}
        <path
          d={`M ${x} ${y} L ${x + maxRadius * 0.7} ${y}`}
          stroke={color}
          strokeWidth={8}
          opacity={sweepAlpha * 0.15}
          strokeLinecap="round"
          filter="url(#glow)"
        />
        {/* Trailing fade arc */}
        <path
          d={`M ${x} ${y} L ${x + maxRadius * 0.5} ${y - maxRadius * 0.15}`}
          stroke={color}
          strokeWidth={1}
          opacity={sweepAlpha * 0.3}
          strokeLinecap="round"
        />
      </g>

      {/* Center dot — Φ origin of radar */}
      <circle cx={x} cy={y} r={4}
        fill={color} opacity={sweepAlpha * 0.8} />

      {/* "SCAN" label — top right */}
      <text
        x={x + maxRadius - 5} y={y - maxRadius + 10}
        textAnchor="end"
        fill={color}
        fontSize={8}
        fontWeight="600"
        fontFamily="'JetBrains Mono', monospace"
        opacity={scanAlpha * 0.8}
      >SCAN</text>

      {/* "search_code" tool label — below radar */}
      {toolLabelAlpha > 0 && (
        <text
          x={x} y={y + maxRadius + 14}
          textAnchor="middle"
          fill={color}
          fontSize={7}
          fontFamily="'JetBrains Mono', monospace"
          opacity={toolLabelAlpha}
        >search_code()</text>
      )}

      {/* Pulsing crosshair at center */}
      <g opacity={sweepAlpha * 0.4}>
        <line x1={x - 10} y1={y} x2={x + 10} y2={y}
          stroke={color} strokeWidth={0.5} />
        <line x1={x} y1={y - 10} x2={x} y2={y + 10}
          stroke={color} strokeWidth={0.5} />
      </g>
    </g>
  )
}
// See MEMO-NOTES.md §A
