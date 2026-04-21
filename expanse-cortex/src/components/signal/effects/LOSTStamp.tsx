// ══════════════════════════════════════════════════════════════
// LOST STAMP — tampon [LOST] en rouge/gris sur Ω
// The word is official, administrative — the stamp makes it formal.
// Ignorance assumed is a weapon, not a weakness.
// ══════════════════════════════════════════════════════════════


interface LOSTStampProps {
  x: number
  y: number
  progress: number    // 0→1 over step duration
  color?: string
}

export function LOSTStamp({ x, y, progress, color = 'var(--color-overlay0)' }: LOSTStampProps) {
  // Stamp "slams down" in the first 30% — then holds
  const slamPhase = Math.min(progress / 0.3, 1)
  // Overshoot bounce for stamp impact
  const bounce = slamPhase < 1
    ? 1 + Math.sin(slamPhase * Math.PI) * 0.15
    : 1 + Math.sin((progress - 0.3) * Math.PI * 2) * 0.02 // subtle settle vibration

  // Stamp opacity — appears instantly on slam, stays
  const stampAlpha = Math.min(progress * 4, 1)

  // Ink spread effect — red ink bleeding slightly outward
  const inkSpread = progress > 0.3 ? Math.min((progress - 0.3) * 0.5, 0.15) : 0

  // Stamp rotation — slight tilt for "official stamp" feel
  const stampRotation = -8 + Math.sin(progress * Math.PI * 0.5) * 2

  // Double border for administrative stamp look
  const outerW = 70
  const outerH = 28
  const innerW = outerW - 6
  const innerH = outerH - 6

  return (
    <g className="pointer-events-none">
      {/* Ink bleed glow — red aura spreading */}
      <rect
        x={x - outerW / 2 - inkSpread * 30} y={y - outerH / 2 - inkSpread * 15}
        width={outerW + inkSpread * 60} height={outerH + inkSpread * 30}
        rx={3} fill={color} opacity={stampAlpha * 0.08}
        filter="url(#glow)"
        transform={`rotate(${stampRotation}, ${x}, ${y})`}
      />

      <g transform={`translate(${x}, ${y}) rotate(${stampRotation}) scale(${bounce})`}>
        {/* Outer border — stamp frame */}
        <rect
          x={-outerW / 2} y={-outerH / 2}
          width={outerW} height={outerH}
          rx={2} fill="none"
          stroke={color} strokeWidth={2}
          opacity={stampAlpha * 0.7}
        />

        {/* Inner border — double frame */}
        <rect
          x={-innerW / 2} y={-innerH / 2}
          width={innerW} height={innerH}
          rx={1} fill="none"
          stroke={color} strokeWidth={0.8}
          opacity={stampAlpha * 0.5}
        />

        {/* Stamp fill — very subtle */}
        <rect
          x={-outerW / 2 + 1} y={-outerH / 2 + 1}
          width={outerW - 2} height={outerH - 2}
          rx={2} fill={color}
          opacity={stampAlpha * 0.06}
        />

        {/* [LOST] text — the official declaration */}
        <text
          textAnchor="middle" dominantBaseline="central"
          fill={color} fontSize={14}
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="700" letterSpacing={2}
          opacity={stampAlpha * 0.85}
        >
          [LOST]
        </text>
      </g>

      {/* "Fichier introuvable" subtitle — appears after stamp settles */}
      {progress > 0.5 && (
        <g transform={`translate(${x}, ${y + 28})`}>
          <text
            textAnchor="middle" fill={color}
            fontSize={8} fontFamily="'JetBrains Mono', monospace"
            opacity={Math.min((progress - 0.5) * 3, 0.5)}
            fontWeight="400"
          >
            Fichier introuvable
          </text>
        </g>
      )}

      {/* Small ✗ mark in corner — formal rejection */}
      {progress > 0.4 && (
        <g transform={`translate(${x + outerW / 2 + 8}, ${y - outerH / 2 - 2})`}>
          <text
            textAnchor="middle" dominantBaseline="central"
            fill={color} fontSize={10}
            fontFamily="'JetBrains Mono', monospace"
            opacity={Math.min((progress - 0.4) * 2.5, 0.5)}
          >
            ✗
          </text>
        </g>
      )}
    </g>
  )
}
// See MEMO-NOTES.md §A
