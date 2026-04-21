// ══════════════════════════════════════════════════════════════
// QUESTION MARK SHIELD — bouclier sur Φ avec "?" barré
// La question n'est pas un ordre — le bouclier la rejette
// ══════════════════════════════════════════════════════════════


interface QuestionMarkShieldProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  color?: string
}

export function QuestionMarkShield({ x, y, progress, color = 'var(--color-yellow)' }: QuestionMarkShieldProps) {
  // Shield materializes progressively
  const shieldAlpha = Math.min(progress * 2, 1)

  // Strikethrough line appears after shield is formed
  const strikeVisible = progress > 0.35
  const strikeAlpha = strikeVisible ? Math.min((progress - 0.35) * 3, 1) : 0

  // "?" text fades in during first phase, then gets struck
  const questionAlpha = Math.min(progress * 3, 1)

  // "Φ INACTIF" label fades in after the strike
  const labelVisible = progress > 0.55
  const labelAlpha = labelVisible ? Math.min((progress - 0.55) * 3, 1) : 0

  // Subtle pulse on the shield border
  const pulse = Math.sin(progress * Math.PI * 2.5) * 0.1 + 0.9

  // Shield dimensions
  const shieldW = 60
  const shieldH = 70

  return (
    <g className="pointer-events-none">
      {/* Outer glow halo */}
      <ellipse cx={x} cy={y}
        rx={shieldW + 15} ry={shieldH + 15}
        fill={color} opacity={shieldAlpha * 0.06 * pulse} filter="url(#glow)" />

      {/* Shield body — pointed bottom like a classic shield */}
      <path
        d={`M ${x} ${y - shieldH / 2}
            C ${x + shieldW / 2 + 5} ${y - shieldH / 2},
              ${x + shieldW / 2 + 5} ${y - shieldH / 4},
              ${x + shieldW / 2} ${y}
              C ${x + shieldW / 2} ${y + shieldH / 5},
              ${x + shieldW / 4} ${y + shieldH / 2},
              ${x} ${y + shieldH / 2 + 10}
              C ${x - shieldW / 4} ${y + shieldH / 2},
              ${x - shieldW / 2} ${y + shieldH / 5},
              ${x - shieldW / 2} ${y}
              C ${x - shieldW / 2 - 5} ${y - shieldH / 4},
              ${x - shieldW / 2 - 5} ${y - shieldH / 2},
              ${x} ${y - shieldH / 2}
            Z`}
        fill={`${color}15`}
        stroke={color}
        strokeWidth={2}
        opacity={shieldAlpha * pulse}
        filter="url(#glow)"
      />

      {/* Inner shield border — double line for heraldic look */}
      <path
        d={`M ${x} ${y - shieldH / 2 + 8}
            C ${x + shieldW / 2 - 5} ${y - shieldH / 2 + 8},
              ${x + shieldW / 2 - 5} ${y - shieldH / 4 + 2},
              ${x + shieldW / 2 - 6} ${y - 2}
              C ${x + shieldW / 2 - 6} ${y + shieldH / 5 - 5},
              ${x + shieldW / 4 - 3} ${y + shieldH / 2 - 8},
              ${x} ${y + shieldH / 2 + 2}
              C ${x - shieldW / 4 + 3} ${y + shieldH / 2 - 8},
              ${x - shieldW / 2 + 6} ${y + shieldH / 5 - 5},
              ${x - shieldW / 2 + 6} ${y - 2}
              C ${x - shieldW / 2 + 5} ${y - shieldH / 4 + 2},
              ${x - shieldW / 2 + 5} ${y - shieldH / 2 + 8},
              ${x} ${y - shieldH / 2 + 8}
            Z`}
        fill="none"
        stroke={color}
        strokeWidth={0.8}
        opacity={shieldAlpha * 0.5}
        strokeDasharray="4 3"
      />

      {/* "?" character — large, centered */}
      <text
        x={x} y={y - 2}
        textAnchor="middle" dominantBaseline="central"
        fill={color}
        fontSize={32}
        fontWeight="bold"
        fontFamily="'JetBrains Mono', monospace"
        opacity={questionAlpha}
      >?</text>

      {/* Strikethrough line — diagonal slash across the "?" */}
      {strikeVisible && (
        <line
          x1={x - 22} y1={y + 18}
          x2={x + 22} y2={y - 22}
          stroke="var(--color-red)"
          strokeWidth={4}
          strokeLinecap="round"
          opacity={strikeAlpha * 0.9}
        />
      )}

      {/* Strikethrough glow */}
      {strikeVisible && (
        <line
          x1={x - 22} y1={y + 18}
          x2={x + 22} y2={y - 22}
          stroke="var(--color-red)"
          strokeWidth={10}
          strokeLinecap="round"
          opacity={strikeAlpha * 0.15}
          filter="url(#glow)"
        />
      )}

      {/* "Φ INACTIF" label below shield */}
      {labelVisible && (
        <text
          x={x} y={y + shieldH / 2 + 24}
          textAnchor="middle"
          fill={color}
          fontSize={8}
          fontWeight="600"
          fontFamily="'JetBrains Mono', monospace"
          opacity={labelAlpha * 0.8}
        >Φ INACTIF</text>
      )}

      {/* "PAS D'IMPÉRATIF" micro-label */}
      {labelVisible && (
        <text
          x={x} y={y + shieldH / 2 + 34}
          textAnchor="middle"
          fill="var(--color-overlay0)"
          fontSize={6}
          fontFamily="'JetBrains Mono', monospace"
          opacity={labelAlpha * 0.6}
        >PAS D'IMPÉRATIF</text>
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
