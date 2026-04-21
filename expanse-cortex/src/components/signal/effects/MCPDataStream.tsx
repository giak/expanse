
/** MCP Data Stream — light particles flowing along ring track from Μ→Ψ during search_memory */
export function MCPDataStream({ from, to, color, progress, streamCount = 6 }: {
  from: { x: number; y: number }; to: { x: number; y: number }
  color: string; progress: number; streamCount?: number
}) {
  // Each particle is offset in time — simulates packets of memory data flowing
  return (
    <g className="pointer-events-none">
      {Array.from({ length: streamCount }, (_, i) => {
        const delay = i * 0.12
        const p = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)))
        if (p <= 0 || p >= 1) return null
        const x = from.x + (to.x - from.x) * p
        const y = from.y + (to.y - from.y) * p
        const alpha = Math.sin(p * Math.PI) * 0.7 // fade in/out
        const r = 2.5 - Math.abs(p - 0.5) * 2 // largest at midpoint
        return <circle key={i} cx={x} cy={y} r={Math.max(r, 0.8)} fill={color} opacity={alpha} filter="url(#glow)" />
      })}
    </g>
  )
}
// See MEMO-NOTES.md §B
