// ══════════════════════════════════════════════════════════════
// RECALL STREAM — particles Μ→Ψ for Rappel Associatif Contextuel
// Similar to MCPDataStream but with green accent (patterns recalled)
// ══════════════════════════════════════════════════════════════


interface RecallStreamProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
  progress: number    // 0→1 over step duration
  color?: string
}

export function RecallStream({ from, to, progress, color = 'var(--color-green)' }: RecallStreamProps) {
  const dx = to.x - from.x
  const dy = to.y - from.y

  // Spawn 3 particle groups representing the 3 recalled patterns
  const groups = Array.from({ length: 3 }, (_, i) => {
    const offset = i / 3
    const t = ((progress * 1.5 + offset) % 1)
    return {
      x: from.x + dx * t,
      y: from.y + dy * t,
      opacity: Math.sin(t * Math.PI) * 0.9,
      scale: 0.8 + Math.sin(t * Math.PI) * 0.4,
    }
  })

  return (
    <g className="pointer-events-none">
      {/* Connection arc — curved to avoid center */}
      <path
        d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2 + dy * 0.15} ${(from.y + to.y) / 2 - dx * 0.15} ${to.x} ${to.y}`}
        fill="none" stroke={color} strokeWidth={1}
        strokeDasharray="4 6" opacity={0.25}
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
      </path>

      {/* Pattern particles — small diamond shapes (pattern = crystal) */}
      {groups.map((g, i) => (
        <g key={i} transform={`translate(${g.x}, ${g.y}) scale(${g.scale})`} opacity={g.opacity}>
          <polygon points="0,-5 5,0 0,5 -5,0" fill={color} filter="url(#glow)" />
        </g>
      ))}

      {/* Arrival glow at Ψ when particles reach */}
      {progress > 0.6 && (
        <circle
          cx={to.x} cy={to.y} r={12}
          fill={color} opacity={(progress - 0.6) * 0.4}
          filter="url(#glow)"
        />
      )}

      {/* Label */}
      <text
        x={(from.x + to.x) / 2 + dy * 0.2}
        y={(from.y + to.y) / 2 - dx * 0.2 - 8}
        textAnchor="middle" fill={color}
        fontSize={7} fontFamily="'JetBrains Mono', monospace"
        opacity={0.4}
      >3 patterns</text>
    </g>
  )
}
// See MEMO-NOTES.md §B
