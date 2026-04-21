
/** Activation Shockwave — expanding ring burst on organ activation */
export function ActivationShockwave({ x, y, color, progress }: { x: number; y: number; color: string; progress: number }) {
  if (progress > 0.6) return null
  const alpha = Math.max(0, 1 - progress * 1.8)
  return (
    <g className="pointer-events-none">
      <circle cx={x} cy={y} r={30 + progress * 200} fill="none" stroke={color}
        strokeWidth={3 - progress * 4} opacity={alpha * 0.5} filter="url(#glow)" className="activation-shockwave" />
    </g>
  )
}
// See MEMO-NOTES.md §A
