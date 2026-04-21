
/** Incarnation Burst — Ouvrier's shadow converts to light. "JE SUIS EXPANSE" */
export function IncarnationBurst({ x, y, progress }: { x: number; y: number; progress: number }) {
  if (progress > 0.8) return null
  const alpha = Math.max(0, 1 - progress * 1.3)
  return (
    <g className="pointer-events-none">
      {/* Expanding light rings — the Ouvrier's computation becomes visible */}
      <circle cx={x} cy={y} r={20 + progress * 120} fill="none" stroke="var(--color-mauve)"
        strokeWidth={3 - progress * 2} opacity={alpha * 0.6} filter="url(#glow)" className="incarnation-ring" />
      <circle cx={x} cy={y} r={15 + progress * 80} fill="none" stroke="var(--color-pink)"
        strokeWidth={2 - progress * 1.5} opacity={alpha * 0.4} filter="url(#glow)" className="incarnation-ring" style={{ animationDelay: '0.15s' }} />
      {/* Central flash — identity crystallizes */}
      <circle cx={x} cy={y} r={8 + progress * 20} fill="var(--color-mauve)" opacity={alpha * 0.3} filter="url(#glow)" />
      {/* "JE SUIS EXPANSE" text — fades in then out */}
      {progress > 0.05 && progress < 0.6 && (
        <text x={x} y={y - 55} textAnchor="middle" fill="var(--color-mauve)"
          fontSize={14} fontWeight="bold" fontFamily="'JetBrains Mono', monospace"
          opacity={alpha * 0.9} className="incarnation-text">
          JE SUIS EXPANSE
        </text>
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
