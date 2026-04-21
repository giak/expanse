
/** Guard Shield — amber shield pops up at Ψ during Stall Check */
export function GuardShield({ x, y, progress }: { x: number; y: number; progress: number }) {
  if (progress > 0.7) return null
  const alpha = Math.max(0, 1 - progress * 1.3)
  return (
    <g className="pointer-events-none">
      {/* Amber shield shape */}
      <path d={`M${x} ${y - 28} L${x + 22} ${y - 16} L${x + 18} ${y + 8} L${x} ${y + 22} L${x - 18} ${y + 8} L${x - 22} ${y - 16} Z`}
        fill="rgba(249,226,175,0.12)" stroke="var(--color-yellow)" strokeWidth={1.5}
        opacity={alpha * 0.8} filter="url(#glow)" className="guard-shield-pop" />
      {/* Check mark inside shield */}
      <path d={`M${x - 6} ${y - 2} L${x - 1} ${y + 4} L${x + 8} ${y - 8}`}
        fill="none" stroke="var(--color-yellow)" strokeWidth={2} strokeLinecap="round"
        opacity={alpha * 0.7} />
    </g>
  )
}
// See MEMO-NOTES.md §A
