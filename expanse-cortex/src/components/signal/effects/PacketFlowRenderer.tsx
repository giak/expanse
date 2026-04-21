import { ORGAN_COLORS } from '../../../constants/theme'

/** Packet Flow Renderer — labeled data particles traveling between organs */
export function PacketFlowRenderer({ flows, progress, organPositions }: {
  flows: { source: string; target: string; label: string }[]
  progress: number
  organPositions: Map<string, { x: number; y: number }>
}) {
  return (
    <g className="pointer-events-none">
      {flows.map((pf) => {
        const from = organPositions.get(pf.source)
        const to = organPositions.get(pf.target)
        if (!from || !to) return null

        const isSelf = pf.source === pf.target
        const srcCol = ORGAN_COLORS[pf.source] ?? 'var(--color-blue)'

        // For self-flows (Ψ→Ψ), orbit around the organ
        if (isSelf) {
          const cx = from.x
          const cy = from.y
          const orbitR = 45
          const angle = progress * Math.PI * 2
          const px = cx + Math.cos(angle) * orbitR
          const py = cy + Math.sin(angle) * orbitR
          return (
            <g key={`${pf.source}->${pf.target}|${pf.label}`}>
              <circle cx={px} cy={py} r={3} fill={srcCol} opacity={0.6} filter="url(#glow)" className="data-packet-capsule" />
              <text x={cx} y={cy - 55} textAnchor="middle" fill={srcCol}
                fontSize={8} fontFamily="'JetBrains Mono', monospace" opacity={0.5}>
                {pf.label}
              </text>
            </g>
          )
        }

        // Normal flow: particles traveling from source to target
        const particleCount = 4
        return (
          <g key={`${pf.source}->${pf.target}|${pf.label}`}>
            {Array.from({ length: particleCount }, (_, pi) => {
              const delay = pi * 0.1
              const p = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)))
              if (p <= 0 || p >= 1) return null
              const px = from.x + (to.x - from.x) * p
              const py = from.y + (to.y - from.y) * p
              const alpha = Math.sin(p * Math.PI) * 0.7
              return (
                <circle key={pi} cx={px} cy={py} r={2.5}
                  fill={srcCol} opacity={alpha} filter="url(#glow)" className="data-packet-capsule" />
              )
            })}
            {/* Label at midpoint */}
            {progress > 0.2 && progress < 0.8 && (() => {
              const mx = (from.x + to.x) / 2
              const my = (from.y + to.y) / 2
              const labelAlpha = Math.sin((progress - 0.2) / 0.6 * Math.PI) * 0.6
              return (
                <text x={mx} y={my - 10} textAnchor="middle" fill={srcCol}
                  fontSize={7} fontFamily="'JetBrains Mono', monospace" opacity={labelAlpha}>
                  {pf.label}
                </text>
              )
            })()}
          </g>
        )
      })}
    </g>
  )
}
// See MEMO-NOTES.md §E
