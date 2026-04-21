// ══════════════════════════════════════════════════════════════
// GREP BEAM — faisceau de lumière Φ→codebase quand search_code exécuté
// L'outil est un faisceau qui éclaire le code
// ══════════════════════════════════════════════════════════════


interface GrepBeamProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  color?: string
}

export function GrepBeam({ x, y, progress, color = 'var(--color-sapphire)' }: GrepBeamProps) {
  // Beam fires outward from Φ to the right and down (codebase direction)
  // The beam is a focused cone of light

  const beamLength = 120
  const beamWidth = 8

  // Beam fires in phases: charge → fire → scan → results
  const chargePhase = Math.min(progress / 0.2, 1)
  const firePhase = progress > 0.2 ? Math.min((progress - 0.2) / 0.15, 1) : 0
  const scanPhase = progress > 0.35 ? Math.min((progress - 0.35) / 0.4, 1) : 0
  const resultPhase = progress > 0.75 ? Math.min((progress - 0.75) / 0.25, 1) : 0

  // Beam endpoint — diagonal to lower-right (representing codebase)
  const endX = x + beamLength * 0.7
  const endY = y + beamLength * 0.5

  // Beam origin offset from Φ
  const originX = x + 30
  const originY = y + 20

  // Charge glow — building intensity
  const chargeAlpha = chargePhase * 0.6

  // Fire beam alpha
  const beamAlpha = firePhase > 0 ? (scanPhase < 1 ? 0.8 : (1 - resultPhase) * 0.8) : 0

  // Scan shimmer — particles traveling along beam
  const particleCount = 5

  // "grep" text
  const grepAlpha = firePhase > 0 ? Math.min(firePhase * 2, 0.7) : 0

  // Result highlights — small dots at beam end representing matches
  const resultAlpha = resultPhase * 0.8

  return (
    <g className="pointer-events-none">
      {/* Charge glow at origin */}
      {chargePhase > 0 && (
        <circle cx={originX} cy={originY}
          r={6 + chargePhase * 8}
          fill={color}
          opacity={chargeAlpha * 0.3}
          filter="url(#glow)" />
      )}

      {/* Main beam — cone of light from Φ to codebase */}
      {beamAlpha > 0 && (
        <g>
          {/* Beam body — gradient line */}
          <line
            x1={originX} y1={originY}
            x2={originX + (endX - originX) * scanPhase} y2={originY + (endY - originY) * scanPhase}
            stroke={color}
            strokeWidth={beamWidth}
            strokeLinecap="round"
            opacity={beamAlpha * 0.6}
          />
          {/* Beam glow */}
          <line
            x1={originX} y1={originY}
            x2={originX + (endX - originX) * scanPhase} y2={originY + (endY - originY) * scanPhase}
            stroke={color}
            strokeWidth={beamWidth * 3}
            strokeLinecap="round"
            opacity={beamAlpha * 0.1}
            filter="url(#glow)"
          />
          {/* Beam core — bright thin line */}
          <line
            x1={originX} y1={originY}
            x2={originX + (endX - originX) * scanPhase} y2={originY + (endY - originY) * scanPhase}
            stroke="#ffffff"
            strokeWidth={1.5}
            strokeLinecap="round"
            opacity={beamAlpha * 0.4}
          />
        </g>
      )}

      {/* Scanning particles traveling along beam */}
      {scanPhase > 0 && beamAlpha > 0 && (
        Array.from({ length: particleCount }, (_, i) => {
          const particleDelay = i * 0.15
          const particleT = ((scanPhase + particleDelay) % 1)
          const px = originX + (endX - originX) * particleT
          const py = originY + (endY - originY) * particleT
          // Particles fade as they travel
          const pAlpha = beamAlpha * (1 - particleT) * 0.7
          return (
            <circle key={i} cx={px} cy={py} r={2.5}
              fill="#ffffff" opacity={pAlpha} filter="url(#glow)" />
          )
        })
      )}

      {/* Result highlights at beam end — small match dots */}
      {resultAlpha > 0 && (
        <g>
          {/* Match 1 */}
          <circle cx={endX - 5} cy={endY - 8}
            r={3} fill="var(--color-green)" opacity={resultAlpha} filter="url(#glow)" />
          {/* Match 2 */}
          <circle cx={endX + 8} cy={endY + 3}
            r={3} fill="var(--color-green)" opacity={resultAlpha * 0.8} filter="url(#glow)" />
          {/* Match 3 */}
          <circle cx={endX - 2} cy={endY + 12}
            r={3} fill="var(--color-green)" opacity={resultAlpha * 0.6} filter="url(#glow)" />

          {/* "3 results" label */}
          <text
            x={endX + 15} y={endY + 4}
            textAnchor="start"
            fill="var(--color-green)"
            fontSize={7}
            fontWeight="600"
            fontFamily="'JetBrains Mono', monospace"
            opacity={resultAlpha * 0.8}
          >3 results</text>
        </g>
      )}

      {/* "grep" label near origin */}
      {grepAlpha > 0 && (
        <text
          x={originX - 15} y={originY - 12}
          textAnchor="middle"
          fill={color}
          fontSize={7}
          fontFamily="'JetBrains Mono', monospace"
          opacity={grepAlpha}
        >grep</text>
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
