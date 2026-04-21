
/** MCP Radar Ping — sonar rings emanating from Μ during search_memory */
export function MCPRadarPing({ x, y, progress }: { x: number; y: number; progress: number }) {
  return (
    <g className="pointer-events-none">
      {/* Primary ping ring */}
      <circle cx={x} cy={y} r={20 + progress * 180} fill="none" stroke="var(--color-red)"
        strokeWidth={2 - progress * 1.5} opacity={0.6 * (1 - progress)} filter="url(#glow)" />
      {/* Secondary ping (delayed) */}
      {progress > 0.15 && (
        <circle cx={x} cy={y} r={20 + (progress - 0.15) * 180} fill="none" stroke="var(--color-red)"
          strokeWidth={1.5 - (progress - 0.15) * 1} opacity={0.3 * (1 - progress)} filter="url(#glow)" />
      )}
      {/* Center flash */}
      {progress < 0.3 && (
        <circle cx={x} cy={y} r={8} fill="var(--color-red)" opacity={0.4 * (1 - progress * 3)} filter="url(#glow)" />
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
