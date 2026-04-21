// ══════════════════════════════════════════════════════════════
// DREAM GATE — portal that opens when the garden has frictions
// P0 Inertie: if traces ≥ 1 the gate opens → Dream continues
// ══════════════════════════════════════════════════════════════


interface DreamGateProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  open?: boolean      // true = gate opens (traces ≥1), false = stays closed
  color?: string
}

export function DreamGate({ x, y, progress, open = true, color = 'var(--color-blue)' }: DreamGateProps) {
  // Gate dimensions
  const gateW = 60
  const gateH = 90
  const pillarW = 8

  // Animation phases: pillars form → gate state → glow
  const formPhase = Math.min(progress / 0.3, 1)
  const gatePhase = progress > 0.3 ? Math.min((progress - 0.3) / 0.4, 1) : 0
  const glowPhase = progress > 0.7 ? Math.min((progress - 0.7) / 0.3, 1) : 0

  // Gate door angle: 0 = closed, 90 = fully open
  const doorAngle = open ? gatePhase * 70 : 0

  // Flicker glow when open
  const glowPulse = glowPhase * (0.5 + Math.sin(progress * 12) * 0.2)

  // "DREAM" text
  const textAlpha = formPhase * 0.7

  return (
    <g className="pointer-events-none">
      {/* Background glow when gate is open */}
      {open && glowPhase > 0 && (
        <ellipse cx={x} cy={y - gateH * 0.3} rx={gateW * 0.8 + glowPhase * 20}
          ry={gateH * 0.6 + glowPhase * 15}
          fill={color} opacity={glowPulse * 0.08} filter="url(#glow)" />
      )}

      {/* Left pillar */}
      <rect x={x - gateW / 2} y={y - gateH / 2}
        width={pillarW} height={gateH * formPhase}
        fill={color} opacity={formPhase * 0.7}
        rx={2} />

      {/* Right pillar */}
      <rect x={x + gateW / 2 - pillarW} y={y - gateH / 2}
        width={pillarW} height={gateH * formPhase}
        fill={color} opacity={formPhase * 0.7}
        rx={2} />

      {/* Arch */}
      {formPhase > 0.5 && (
        <path
          d={`M ${x - gateW / 2} ${y - gateH / 2}
              Q ${x} ${y - gateH / 2 - 25} ${x + gateW / 2} ${y - gateH / 2}`}
          fill="none" stroke={color} strokeWidth={3}
          opacity={(formPhase - 0.5) * 2 * 0.6}
        />
      )}

      {/* Gate doors — double doors that swing open */}
      {/* Left door */}
      <rect x={x - gateW / 2 + pillarW} y={y - gateH / 2}
        width={(gateW / 2 - pillarW)} height={gateH * formPhase}
        fill={open ? color : 'var(--color-surface1)'} opacity={formPhase * 0.35}
        transform={`rotate(${-doorAngle}, ${x - gateW / 2 + pillarW}, ${y - gateH / 2})`}
        rx={1} />

      {/* Right door */}
      <rect x={x} y={y - gateH / 2}
        width={(gateW / 2 - pillarW)} height={gateH * formPhase}
        fill={open ? color : 'var(--color-surface1)'} opacity={formPhase * 0.35}
        transform={`rotate(${doorAngle}, ${x + gateW / 2 - pillarW}, ${y - gateH / 2})`}
        rx={1} />

      {/* Light streaming through when open */}
      {open && gatePhase > 0.2 && (
        <g opacity={gatePhase * 0.4}>
          {Array.from({ length: 5 }, (_, i) => {
            const rayX = x + (i - 2) * 8
            const rayAlpha = (1 - Math.abs(i - 2) * 0.25) * gatePhase
            return (
              <line key={i} x1={rayX} y1={y - gateH * 0.3}
                x2={rayX + (i - 2) * 15} y2={y + gateH * 0.4}
                stroke={color} strokeWidth={1.5} opacity={rayAlpha * 0.5} />
            )
          })}
        </g>
      )}

      {/* Lock symbol when closed */}
      {!open && formPhase > 0.6 && (
        <g opacity={(formPhase - 0.6) * 2.5 * 0.6}>
          <rect x={x - 6} y={y - 4} width={12} height={10} rx={2}
            fill="var(--color-surface1)" stroke="var(--color-overlay0)" strokeWidth={1} />
          <path d={`M ${x - 4} ${y - 4} L ${x - 4} ${y - 9} Q ${x - 4} ${y - 13} ${x} ${y - 13} Q ${x + 4} ${y - 13} ${x + 4} ${y - 9} L ${x + 4} ${y - 4}`}
            fill="none" stroke="var(--color-overlay0)" strokeWidth={1.5} />
        </g>
      )}

      {/* "DREAM" label */}
      {formPhase > 0.4 && (
        <text x={x} y={y - gateH / 2 - 30} textAnchor="middle"
          fill={color} fontSize={8} fontFamily="'JetBrains Mono', monospace"
          fontWeight="bold" opacity={textAlpha} letterSpacing={3}>
          DREAM
        </text>
      )}

      {/* "0 traces" or "N traces" indicator */}
      {formPhase > 0.6 && (
        <text x={x} y={y + gateH / 2 + 14} textAnchor="middle"
          fill={open ? 'var(--color-green)' : 'var(--color-overlay0)'} fontSize={7}
          fontFamily="'JetBrains Mono', monospace"
          opacity={formPhase * 0.6}>
          {open ? 'traces ≥ 1 → porte ouverte' : 'traces = 0 → fin du rêve'}
        </text>
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
