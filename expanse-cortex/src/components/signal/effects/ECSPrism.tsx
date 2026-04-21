
/** ECS Prism — routing visualization near Ψ. Shows L1/L2/L3 rays, active one glows. */
export function ECSPrism({ x, y, level, progress, organPositions }: {
  x: number; y: number; level: 'L1' | 'L2' | 'L3'; progress: number;
  organPositions: Map<string, { x: number; y: number }>
}) {
  if (progress > 0.8) return null
  const alpha = Math.max(0, 1 - progress * 1.2)

  const routes: { level: string; target: string; color: string; label: string }[] = [
    { level: 'L1', target: 'Ω', color: 'var(--color-green)', label: 'L1 Fulgurance' },
    { level: 'L2', target: 'Φ', color: 'var(--color-yellow)', label: 'L2 Audit' },
    { level: 'L3', target: 'Φ', color: 'var(--color-red)', label: 'L3 Triangulation' },
  ]

  return (
    <g className="pointer-events-none">
      {/* Prism triangle at Ψ */}
      <polygon points={`${x},${y - 20} ${x - 18},${y + 12} ${x + 18},${y + 12}`}
        fill="rgba(166,227,161,0.08)" stroke="var(--color-green)" strokeWidth={1}
        opacity={alpha * 0.6} filter="url(#glow)" />

      {/* Input beam from Σ */}
      {(() => {
        const sigma = organPositions.get('Σ')
        if (!sigma) return null
        return (
          <line x1={sigma.x} y1={sigma.y} x2={x} y2={y}
            stroke="var(--color-blue)" strokeWidth={1.5} opacity={alpha * 0.4}
            strokeDasharray="6 4" filter="url(#glow)" />
        )
      })()}

      {/* Route rays */}
      {routes.map(r => {
        const target = organPositions.get(r.target)
        if (!target) return null
        const isActive = r.level === level
        const mx = (x + target.x) / 2
        const my = (y + target.y) / 2
        return (
          <g key={r.level}>
            <line x1={x} y1={y} x2={target.x} y2={target.y}
              stroke={r.color} strokeWidth={isActive ? 2 : 0.5}
              opacity={alpha * (isActive ? 0.7 : 0.15)}
              strokeDasharray={isActive ? 'none' : '4 8'}
              filter={isActive ? 'url(#glow)' : undefined} />
            {/* Label at midpoint for active route */}
            {isActive && progress > 0.2 && progress < 0.7 && (
              <text x={mx} y={my - 8} textAnchor="middle" fill={r.color}
                fontSize={9} fontWeight="bold" fontFamily="'JetBrains Mono', monospace"
                opacity={alpha * 0.8}>{r.label}</text>
            )}
          </g>
        )
      })}
    </g>
  )
}
// See MEMO-NOTES.md §C
