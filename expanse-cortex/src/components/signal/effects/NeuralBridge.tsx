// ══════════════════════════════════════════════════════════════
// NEURAL BRIDGE — arched connection between Ψ and Μ during Dream
// When Dream activates, Σ/Φ/Ω fade and a massive glowing bridge
// forms between Ψ and Μ across the top of the canvas.
// Traveling light particles show data flowing between the two.
// ══════════════════════════════════════════════════════════════


interface NeuralBridgeProps {
  psiPos: { x: number; y: number }
  muPos: { x: number; y: number }
  progress: number
  /** Active Dream season — affects bridge color */
  season?: 'winter' | 'spring' | 'summer' | 'autumn'
  /** When true, bridge is already established from a previous step — skip re-animation */
  established?: boolean
}

const SEASON_BRIDGE_COLORS = {
  winter: 'var(--color-blue)',
  spring: 'var(--color-mauve)',
  summer: 'var(--color-green)',
  autumn: 'var(--color-peach)',
}

export function NeuralBridge({ psiPos, muPos, progress, season = 'spring', established = false }: NeuralBridgeProps) {
  // If bridge is already established from a previous Dream step, skip re-animation
  // by clamping progress to the pulse phase (0.35 minimum)
  const effectiveProgress = established ? Math.max(progress, 0.35) : progress

  // Animation phases: bridge appears (0→0.3), pulses (0.3→1.0)
  const appearPhase = Math.min(effectiveProgress / 0.3, 1)
  const pulsePhase = effectiveProgress > 0.3 ? Math.min((effectiveProgress - 0.3) / 0.5, 1) : 0
  const bridgeColor = SEASON_BRIDGE_COLORS[season]

  // Calculate arched midpoint (pushed upward for dramatic arch)
  const midX = (psiPos.x + muPos.x) / 2
  const midY = (psiPos.y + muPos.y) / 2
  const archHeight = -80 // push upward
  const archMidY = midY + archHeight

  // Two control points for a smooth arch
  const cp1x = psiPos.x + (muPos.x - psiPos.x) * 0.25
  const cp1y = psiPos.y + archHeight * 0.7
  const cp2x = psiPos.x + (muPos.x - psiPos.x) * 0.75
  const cp2y = muPos.y + archHeight * 0.7

  const pathD = `M${psiPos.x},${psiPos.y} C${cp1x},${cp1y} ${cp2x},${cp2y} ${muPos.x},${muPos.y}`

  // Pulse intensity
  const pulseIntensity = 0.3 + Math.sin(effectiveProgress * Math.PI * 4) * 0.15

  // Particle count traveling along the bridge
  const particleCount = 6

  return (
    <g className="pointer-events-none">
      {/* Wide glow background */}
      <path
        d={pathD}
        fill="none"
        stroke={bridgeColor}
        strokeWidth={8}
        opacity={appearPhase * 0.06}
        filter="url(#glow)"
      />

      {/* Medium glow */}
      <path
        d={pathD}
        fill="none"
        stroke={bridgeColor}
        strokeWidth={4}
        opacity={appearPhase * 0.12}
        filter="url(#glow)"
      />

      {/* Core bridge line */}
      <path
        d={pathD}
        fill="none"
        stroke={bridgeColor}
        strokeWidth={2}
        opacity={appearPhase * pulseIntensity}
        strokeDasharray="8 4"
      />

      {/* Traveling light particles */}
      {pulsePhase > 0 && Array.from({ length: particleCount }, (_, i) => {
        // Each particle travels at different speed with stagger
        const speed = 0.6 + (i % 3) * 0.15
        const stagger = i * 0.12
        const t = ((effectiveProgress * speed + stagger) % 1)

        // Alternate direction (some go Ψ→Μ, some Μ→Ψ)
        const isReversed = i % 2 === 1
        const finalT = isReversed ? 1 - t : t
        const fpx = (1-finalT)*(1-finalT)*(1-finalT)*psiPos.x + 3*(1-finalT)*(1-finalT)*finalT*cp1x + 3*(1-finalT)*finalT*finalT*cp2x + finalT*finalT*finalT*muPos.x
        const fpy = (1-finalT)*(1-finalT)*(1-finalT)*psiPos.y + 3*(1-finalT)*(1-finalT)*finalT*cp1y + 3*(1-finalT)*finalT*finalT*cp2y + finalT*finalT*finalT*muPos.y

        // Fade at endpoints
        const edgeFade = Math.min(finalT * 4, (1 - finalT) * 4, 1)

        return (
          <g key={`bridge-particle-${i}`}>
            <circle
              cx={fpx} cy={fpy} r={3}
              fill={bridgeColor}
              opacity={pulsePhase * edgeFade * 0.7}
              filter="url(#glow)"
            />
            <circle
              cx={fpx} cy={fpy} r={1.5}
              fill="#fff"
              opacity={pulsePhase * edgeFade * 0.4}
            />
          </g>
        )
      })}

      {/* Season indicator at arch apex */}
      {appearPhase > 0.5 && (
        <g transform={`translate(${midX}, ${archMidY})`} opacity={(appearPhase - 0.5) * 2}>
          <circle r={16} fill="rgba(17,17,27,0.6)" stroke={bridgeColor} strokeWidth={0.8} />
          <text
            textAnchor="middle" dominantBaseline="central"
            fill={bridgeColor} fontSize={11}
            fontFamily="'JetBrains Mono', monospace"
          >
            {season === 'winter' ? '❄' : season === 'spring' ? '✿' : season === 'summer' ? '☀' : '🍂'}
          </text>
        </g>
      )}

      {/* Ψ label on bridge endpoint */}
      {appearPhase > 0.6 && (
        <text
          x={psiPos.x + 20} y={psiPos.y - 25}
          fill="var(--color-mauve)" fontSize={7} fontFamily="'JetBrains Mono', monospace"
          opacity={(appearPhase - 0.6) * 2.5 * 0.6}
        >DREAM Ψ</text>
      )}

      {/* Μ label on bridge endpoint */}
      {appearPhase > 0.6 && (
        <text
          x={muPos.x - 45} y={muPos.y - 25}
          fill="var(--color-red)" fontSize={7} fontFamily="'JetBrains Mono', monospace"
          opacity={(appearPhase - 0.6) * 2.5 * 0.6}
        >DREAM Μ</text>
      )}
    </g>
  )
}
// See MEMO-NOTES.md §E
