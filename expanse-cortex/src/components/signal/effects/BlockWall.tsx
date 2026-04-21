// ══════════════════════════════════════════════════════════════
// BLOCK WALL — barrière verticale devant Ω empêchant l'émission
// Appears during BLOCK phase: Ω cannot synthesize
// ══════════════════════════════════════════════════════════════


interface BlockWallProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  color?: string
}

export function BlockWall({ x, y, progress, color = 'var(--color-red)' }: BlockWallProps) {
  // Wall rises from bottom to full height
  const wallHeight = Math.min(progress * 1.5, 1) * 80

  // Bricks form sequentially
  const brickCount = 5
  const visibleBricks = Math.floor(progress * brickCount * 1.5)

  // "BLOQUÉ" text appears after wall is fully formed
  const textVisible = progress > 0.6

  // Pulsing intensity for the wall
  const pulse = Math.sin(progress * Math.PI * 4) * 0.15 + 0.85

  return (
    <g className="pointer-events-none">
      {/* Wall glow */}
      <rect
        x={x - 30} y={y - wallHeight / 2}
        width={60} height={wallHeight}
        fill={color} opacity={0.08 * pulse} filter="url(#glow)"
        rx={2}
      />

      {/* Brick pattern — horizontal bars stacking up */}
      {Array.from({ length: brickCount }, (_, i) => {
        const brickVisible = i < visibleBricks
        if (!brickVisible) return null
        const brickY = y + 35 - (i + 1) * (wallHeight / brickCount)
        const brickOpacity = 0.4 + (i / brickCount) * 0.3
        const offset = i % 2 === 0 ? 0 : 5 // stagger pattern
        return (
          <g key={i}>
            <rect
              x={x - 28 + offset} y={brickY}
              width={56 - offset * 2} height={wallHeight / brickCount - 2}
              fill={`${color}15`} stroke={color} strokeWidth={0.8}
              opacity={brickOpacity * pulse} rx={1}
            />
            {/* Crack lines on each brick */}
            <line
              x1={x - 10 + offset + i * 3} y1={brickY + 2}
              x2={x + 5 + offset} y2={brickY + wallHeight / brickCount - 4}
              stroke={color} strokeWidth={0.3} opacity={0.3}
            />
          </g>
        )
      })}

      {/* Central "✗" block symbol */}
      {progress > 0.3 && (
        <g transform={`translate(${x}, ${y})`}>
          <circle r={12} fill={`${color}20`} stroke={color} strokeWidth={1.5}
            opacity={0.7 * pulse} />
          <text textAnchor="middle" dominantBaseline="central"
            fill={color} fontSize={14} fontWeight="bold"
            opacity={0.8 * pulse}>✗</text>
        </g>
      )}

      {/* "BLOQUÉ" label */}
      {textVisible && (
        <g transform={`translate(${x}, ${y - wallHeight / 2 - 14})`}>
          <rect x={-30} y={-7} width={60} height={14} rx={3}
            fill={`${color}20`} stroke={`${color}60`} strokeWidth={0.5} />
          <text textAnchor="middle" dominantBaseline="central"
            fill={color} fontSize={8} fontFamily="'JetBrains Mono', monospace"
            fontWeight="bold" opacity={0.9}>BLOQUÉ</text>
        </g>
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
