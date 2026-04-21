// ─── Le Refus — red shockwave from sealed axiom ───

interface RefusalShockwaveProps {
  origin: { x: number; y: number; key: number } | null
}

export function RefusalShockwave({ origin }: RefusalShockwaveProps) {
  if (!origin) return null

  return (
    <circle
      key={origin.key}
      cx={origin.x}
      cy={origin.y}
      r={15}
      fill="none"
      stroke="var(--color-red)"
      strokeWidth={2}
      className="refusal-shockwave"
    />
  )
}
