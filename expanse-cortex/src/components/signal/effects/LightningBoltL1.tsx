
/** Lightning Bolt L1 — fulgurant direct path Σ→Ω bypassing Ψ⇌Φ */
export function LightningBoltL1({ sigmaPos, omegaPos, progress }: {
  sigmaPos: { x: number; y: number }; omegaPos: { x: number; y: number }; progress: number
}) {
  if (progress > 0.7) return null
  const alpha = Math.max(0, 1 - progress * 1.5)

  // Zigzag path from Σ to Ω — representing the direct L1 bypass
  const dx = omegaPos.x - sigmaPos.x
  const dy = omegaPos.y - sigmaPos.y
  const midX = (sigmaPos.x + omegaPos.x) / 2
  const midY = (sigmaPos.y + omegaPos.y) / 2
  // Perpendicular offset for zigzag
  const perpX = -dy * 0.08
  const perpY = dx * 0.08

  const zigzag = `${sigmaPos.x},${sigmaPos.y} `
    + `${midX + perpX + dx * 0.1},${midY + perpY + dy * 0.1} `
    + `${midX - perpX - dx * 0.05},${midY - perpY - dy * 0.05} `
    + `${omegaPos.x},${omegaPos.y}`

  return (
    <g className="pointer-events-none">
      {/* Flash line */}
      <polyline points={zigzag} fill="none" stroke="var(--color-green)"
        strokeWidth={3 - progress * 3} opacity={alpha * 0.8} filter="url(#glow)" />
      {/* Glow around the bolt */}
      <polyline points={zigzag} fill="none" stroke="var(--color-green)"
        strokeWidth={8 - progress * 8} opacity={alpha * 0.15} filter="url(#glow)" />
      {/* "⚡ L1" label */}
      {progress > 0.15 && progress < 0.5 && (
        <text x={midX} y={midY - 15} textAnchor="middle" fill="var(--color-green)"
          fontSize={11} fontWeight="bold" fontFamily="'JetBrains Mono', monospace"
          opacity={alpha * 0.9}>⚡ L1</text>
      )}
    </g>
  )
}
// See MEMO-NOTES.md §B
