
/** First Light — the first visible character Ψ is emitted. Rays from Ω. */
export function FirstLight({ x, y, progress }: { x: number; y: number; progress: number }) {
  if (progress > 0.7) return null
  const alpha = Math.max(0, 1 - progress * 1.5)
  return (
    <g className="pointer-events-none">
      {/* White flash — first visible emission */}
      <circle cx={x} cy={y} r={15 + progress * 60} fill="var(--color-green)" opacity={alpha * 0.25} filter="url(#glow)" />
      {/* Golden-green bloom — crystallization of the output */}
      <circle cx={x} cy={y} r={40} fill="var(--color-green)" opacity={alpha * 0.4} filter="url(#glow)" className="crystallize-bloom" />
      {/* Rays shooting outward — the signal propagates */}
      {[0, 72, 144, 216, 288].map(angle => {
        const rad = (angle * Math.PI) / 180
        const len = 30 + progress * 80
        return (
          <line key={angle} x1={x + Math.cos(rad) * 20} y1={y + Math.sin(rad) * 20}
            x2={x + Math.cos(rad) * len} y2={y + Math.sin(rad) * len}
            stroke="var(--color-green)" strokeWidth={1.5 - progress} opacity={alpha * 0.5} filter="url(#glow)" />
        )
      })}
    </g>
  )
}
// See MEMO-NOTES.md §A
