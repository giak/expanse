// ══════════════════════════════════════════════════════════════
// FRESH TRACE MARK — marque rouge sur Μ (trace:fresh créée)
// Appears when a SEC violation is recorded as trace:fresh
// ══════════════════════════════════════════════════════════════


interface FreshTraceMarkProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  color?: string
}

export function FreshTraceMark({ x, y, progress, color = 'var(--color-red)' }: FreshTraceMarkProps) {
  // Mark appears progressively — scar forming
  const markAlpha = Math.min(progress * 2, 1)

  // Subtle pulse
  const pulse = Math.sin(progress * Math.PI * 3) * 0.1 + 0.9

  // "trace:fresh" text fades in after mark
  const textVisible = progress > 0.4

  return (
    <g className="pointer-events-none">
      {/* Glow halo */}
      <circle cx={x} cy={y} r={40}
        fill={color} opacity={markAlpha * 0.1 * pulse} filter="url(#glow)" />

      {/* Scar mark — diagonal line across Μ */}
      <g transform={`translate(${x + 20}, ${y - 25})`}>
        {/* Main scar line */}
        <line x1={0} y1={0} x2={18} y2={18}
          stroke={color} strokeWidth={2.5} opacity={markAlpha * 0.8}
          strokeLinecap="round" />
        {/* Cross line */}
        <line x1={18} y1={0} x2={0} y2={18}
          stroke={color} strokeWidth={2.5} opacity={markAlpha * 0.8}
          strokeLinecap="round" />

        {/* Scar glow */}
        <line x1={0} y1={0} x2={18} y2={18}
          stroke={color} strokeWidth={6} opacity={markAlpha * 0.15}
          strokeLinecap="round" filter="url(#glow)" />
        <line x1={18} y1={0} x2={0} y2={18}
          stroke={color} strokeWidth={6} opacity={markAlpha * 0.15}
          strokeLinecap="round" filter="url(#glow)" />
      </g>

      {/* "trace:fresh" label */}
      {textVisible && (
        <g transform={`translate(${x}, ${y + 50})`}>
          <rect x={-35} y={-7} width={70} height={14} rx={3}
            fill={`${color}15`} stroke={`${color}50`} strokeWidth={0.5} />
          <text textAnchor="middle" dominantBaseline="central"
            fill={color} fontSize={7} fontFamily="'JetBrains Mono', monospace"
            opacity={0.85}>trace:fresh</text>
        </g>
      )}

      {/* Type:SEC tag */}
      {textVisible && (
        <g transform={`translate(${x}, ${y + 66})`}>
          <rect x={-20} y={-6} width={40} height={12} rx={2}
            fill={`${color}10`} stroke={`${color}30`} strokeWidth={0.3} />
          <text textAnchor="middle" dominantBaseline="central"
            fill={color} fontSize={6} fontFamily="'JetBrains Mono', monospace"
            opacity={0.7}>type:SEC</text>
        </g>
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
