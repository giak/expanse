
/** Ouvrier Shadow — the hidden thinking block flickering behind the active organ */
export function OuvrierShadow({ x, y, color, progress }: { x: number; y: number; color: string; progress: number }) {
  // Flicker simulates CoT processing — erratic opacity like neurons firing
  const flicker = Math.sin(progress * 17) * 0.3 + Math.sin(progress * 31) * 0.2 + 0.5
  return (
    <g className="pointer-events-none">
      <circle cx={x} cy={y} r={50} fill={color} opacity={0.04 + flicker * 0.06} className="ouvrier-shadow" />
      <circle cx={x} cy={y} r={38} fill={color} opacity={0.06 + flicker * 0.08} />
    </g>
  )
}
// See MEMO-NOTES.md §A
