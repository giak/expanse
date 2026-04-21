// ─── Tag Root Link ───
// A faint curved link between two nodes that share a common tag root.
// Used in the Memory Ecosystem to show semantic connections across nature zones.

interface TagRootLinkProps {
  x1: number
  y1: number
  x2: number
  y2: number
  tag: string
  highlighted: boolean
  /** Override opacity (e.g. from proximity BFS) */
  opacity?: number
}

export function TagRootLink({ x1, y1, x2, y2, tag, highlighted, opacity }: TagRootLinkProps) {
  // Control point for a gentle curve — offset perpendicular to the line
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.sqrt(dx * dx + dy * dy) || 1
  // Perpendicular offset — 10% of distance, alternating direction based on tag hash
  const sign = tag.length % 2 === 0 ? 1 : -1
  const offset = dist * 0.1 * sign
  const nx = -dy / dist
  const ny = dx / dist
  const cx = mx + nx * offset
  const cy = my + ny * offset

  return (
    <path
      d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
      fill="none"
      stroke={highlighted ? 'var(--color-blue)' : '#313244'}
      strokeWidth={highlighted ? 1 : 0.5}
      strokeDasharray={highlighted ? 'none' : '2 4'}
      opacity={opacity !== undefined ? Math.max(opacity, highlighted ? 0.4 : 0.1) : (highlighted ? 0.4 : 0.1)}
    />
  )
}
