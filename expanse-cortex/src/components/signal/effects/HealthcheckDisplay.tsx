
/** Healthcheck — sequential checkmarks appearing one by one */
export function HealthcheckDisplay({ x, y, progress }: { x: number; y: number; progress: number }) {
  const checks = ['core', 'profile', 'project', 'budget']
  return (
    <g className="pointer-events-none">
      {checks.map((label, i) => {
        const threshold = (i + 1) / (checks.length + 1)
        const visible = progress >= threshold
        return (
          <g key={label} transform={`translate(${x + 45}, ${y - 20 + i * 14})`}>
            {visible ? (
              <>
                <circle r={3} fill="var(--color-green)" opacity={0.9} className="checkmark-pop" />
                <text x={7} fill="var(--color-green)" fontSize={8} fontFamily="'JetBrains Mono', monospace" dominantBaseline="central">
                  {label} ✓
                </text>
              </>
            ) : (
              <>
                <circle r={3} fill="none" stroke="var(--color-surface2)" strokeWidth={0.5} />
                <text x={7} fill="var(--color-surface2)" fontSize={8} fontFamily="'JetBrains Mono', monospace" dominantBaseline="central">
                  {label} …
                </text>
              </>
            )}
          </g>
        )
      })}
    </g>
  )
}
// See MEMO-NOTES.md §A
