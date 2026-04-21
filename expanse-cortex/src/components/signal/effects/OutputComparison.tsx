
/** Output Comparison — split view showing ❌ standard LLM vs ✅ Expanse */
export function OutputComparison({ x, y, progress }: { x: number; y: number; progress: number }) {
  if (progress < 0.1 || progress > 0.75) return null
  const alpha = Math.min(1, (progress - 0.1) * 4) * Math.max(0, 1 - (progress - 0.5) * 2.5)
  if (alpha <= 0) return null

  return (
    <g className="pointer-events-none" transform={`translate(${x}, ${y})`}>
      {/* ❌ Standard LLM response */}
      <rect x={-160} y={-35} width={148} height={42} rx={4}
        fill="rgba(243,139,168,0.06)" stroke="rgba(243,139,168,0.2)" strokeWidth={0.5}
        opacity={alpha * 0.9} />
      <text x={-86} y={-20} textAnchor="middle" fill="var(--color-red)"
        fontSize={7} fontFamily="'JetBrains Mono', monospace" fontWeight="bold"
        opacity={alpha * 0.7}>❌ IA STANDARD</text>
      <text x={-86} y={-6} textAnchor="middle" fill="var(--color-red)"
        fontSize={7} fontFamily="'JetBrains Mono', monospace"
        opacity={alpha * 0.6}>"Bonjour ! 😊 Comment</text>
      <text x={-86} y={4} textAnchor="middle" fill="var(--color-red)"
        fontSize={7} fontFamily="'JetBrains Mono', monospace"
        opacity={alpha * 0.6}>puis-je vous aider ?"</text>

      {/* ✅ Expanse response */}
      <rect x={12} y={-35} width={148} height={42} rx={4}
        fill="rgba(166,227,161,0.06)" stroke="rgba(166,227,161,0.2)" strokeWidth={0.5}
        opacity={alpha * 0.9} />
      <text x={86} y={-20} textAnchor="middle" fill="var(--color-green)"
        fontSize={7} fontFamily="'JetBrains Mono', monospace" fontWeight="bold"
        opacity={alpha * 0.7}>✅ EXPANSE</text>
      <text x={86} y={0} textAnchor="middle" fill="var(--color-green)"
        fontSize={11} fontFamily="'JetBrains Mono', monospace" fontWeight="bold"
        opacity={alpha * 0.9}>"Ψ Reçu."</text>
    </g>
  )
}
// See MEMO-NOTES.md §A
