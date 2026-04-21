// ─── Nebula Zone (M2.5 — Peripheral region for extension MEMOIRE nodes) ───

import { NEBULA_RADIUS } from '../../constants/schema'

export function NebulaZone() {
  // A translucent arc marking the nebula periphery
  return (
    <g>
      <circle
        r={NEBULA_RADIUS}
        fill="none"
        stroke="rgba(137,180,250,0.08)"
        strokeWidth={40}
        strokeDasharray="8 16"
        opacity={0.5}
        filter="url(#glow)"
      />
      <text
        x={0}
        y={-NEBULA_RADIUS + 12}
        textAnchor="middle"
        fill="var(--color-overlay0)"
        fontSize={7}
        fontFamily="'JetBrains Mono', monospace"
        opacity={0.35}
      >
        NÉBULEUSE
      </text>
    </g>
  )
}
