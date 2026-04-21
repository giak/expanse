// ══════════════════════════════════════════════════════════════
// FOG PATCH — brume grise sur Φ quand l'outil ne trouve rien
// Ignorance is fog — not a void. The fog thickens as more tools fail.
// ══════════════════════════════════════════════════════════════


interface FogPatchProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  dense?: boolean     // true = thicker fog (second tool failure)
  color?: string
}

export function FogPatch({ x, y, progress, dense = false, color = 'var(--color-overlay0)' }: FogPatchProps) {
  // Fog opacity builds up — thicker when dense (second failure)
  const baseAlpha = dense ? 0.25 : 0.15
  const fogAlpha = Math.min(progress * 1.5, 1) * baseAlpha

  // Drifting fog blobs — slow lateral movement simulating haze
  const drift1 = Math.sin(progress * Math.PI * 1.5) * 8
  const drift2 = Math.cos(progress * Math.PI * 1.2) * 6
  const drift3 = Math.sin(progress * Math.PI * 0.8 + 1) * 10

  // "0 results" text fades in after fog coalesces
  const textVisible = progress > 0.35

  // Pulsing density — fog breathes
  const breathe = Math.sin(progress * Math.PI * 3) * 0.03

  const r1 = dense ? 55 : 45
  const r2 = dense ? 40 : 30
  const r3 = dense ? 35 : 25

  return (
    <g className="pointer-events-none">
      {/* Outer haze — wide diffuse glow */}
      <circle cx={x + drift1 * 0.5} cy={y}
        r={r1 + 20} fill={color} opacity={fogAlpha * 0.4 + breathe} filter="url(#glow)" />

      {/* Main fog blob 1 — large soft cloud */}
      <ellipse cx={x + drift1} cy={y - 5}
        rx={r1} ry={r1 * 0.7}
        fill={color} opacity={fogAlpha * 1.2 + breathe} />

      {/* Fog blob 2 — offset drifting */}
      <ellipse cx={x + drift2 - 15} cy={y + 8}
        rx={r2} ry={r2 * 0.65}
        fill={color} opacity={fogAlpha * 0.9} />

      {/* Fog blob 3 — smaller wisp */}
      <ellipse cx={x + drift3 + 20} cy={y - 10}
        rx={r3} ry={r3 * 0.6}
        fill={color} opacity={fogAlpha * 0.7} />

      {/* Dense mode: extra thick central cloud */}
      {dense && (
        <ellipse cx={x} cy={y}
          rx={30} ry={22}
          fill={color} opacity={fogAlpha * 1.5}
          filter="url(#glow)" />
      )}

      {/* "0 résultats" label — floating in the fog */}
      {textVisible && (
        <g transform={`translate(${x}, ${y + (dense ? 40 : 32)})`}>
          <text textAnchor="middle" fill={color}
            fontSize={dense ? 10 : 8} fontFamily="'JetBrains Mono', monospace"
            opacity={Math.min((progress - 0.35) * 3, 0.7)}
            fontWeight="600">
            {dense ? 'rien' : '0 résultats'}
          </text>
        </g>
      )}

      {/* "?" mark dissolving into fog — knowledge dissolving */}
      {progress > 0.5 && (
        <g transform={`translate(${x}, ${y - (dense ? 45 : 35)})`}>
          <text textAnchor="middle" fill={color}
            fontSize={16} fontFamily="'JetBrains Mono', monospace"
            opacity={Math.max(0, 0.5 - (progress - 0.5) * 1.5)}
            fontWeight="300">
            ?
          </text>
        </g>
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
