// ══════════════════════════════════════════════════════════════
// TOOL FLASH — orange flash on Φ when a tool is called
// Shows a brief icon (magnifying glass or file) over the active organ
// ══════════════════════════════════════════════════════════════


interface ToolFlashProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  toolType?: 'magnify' | 'file' | 'globe'  // which icon to show
  color?: string
}

export function ToolFlash({ x, y, progress, toolType = 'magnify', color = 'var(--color-peach)' }: ToolFlashProps) {
  // Flash intensity: bright at start, fading toward end
  const flashIntensity = Math.max(0, 1 - progress * 1.5)
  const iconOpacity = progress < 0.7 ? 0.9 : Math.max(0, 0.9 - (progress - 0.7) * 3)

  return (
    <g className="pointer-events-none">
      {/* Expanding ring flash */}
      <circle
        cx={x} cy={y}
        r={40 + progress * 30}
        fill="none" stroke={color}
        strokeWidth={2 * flashIntensity}
        opacity={flashIntensity * 0.5}
        filter="url(#glow)"
      />

      {/* Second ring — delayed */}
      {progress > 0.15 && (
        <circle
          cx={x} cy={y}
          r={40 + (progress - 0.15) * 35}
          fill="none" stroke={color}
          strokeWidth={1.5 * flashIntensity}
          opacity={flashIntensity * 0.3}
          filter="url(#glow)"
        />
      )}

      {/* Tool icon — positioned above the organ */}
      <g transform={`translate(${x}, ${y - 55})`} opacity={iconOpacity}>
        {toolType === 'magnify' ? (
          // Magnifying glass
          <g stroke={color} strokeWidth={1.5} fill="none">
            <circle cx={0} cy={0} r={7} />
            <line x1={5} y1={5} x2={10} y2={10} />
          </g>
        ) : toolType === 'file' ? (
          // File icon
          <g stroke={color} strokeWidth={1.5} fill="none">
            <rect x={-6} y={-8} width={12} height={16} rx={1} />
            <line x1={-3} y1={-3} x2={3} y2={-3} />
            <line x1={-3} y1={1} x2={3} y2={1} />
            <line x1={-3} y1={5} x2={1} y2={5} />
          </g>
        ) : (
          // Globe icon — for Web pole / external search
          <g stroke={color} strokeWidth={1.5} fill="none">
            <circle cx={0} cy={0} r={8} />
            <ellipse cx={0} cy={0} rx={4} ry={8} />
            <line x1={-8} y1={0} x2={8} y2={0} />
          </g>
        )}
      </g>

      {/* Glow behind organ */}
      <circle
        cx={x} cy={y} r={45}
        fill={color} opacity={0.06 + flashIntensity * 0.1}
        filter="url(#glow)"
      />
    </g>
  )
}
// See MEMO-NOTES.md §A
