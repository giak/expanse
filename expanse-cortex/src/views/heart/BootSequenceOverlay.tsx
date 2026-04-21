// ─── Boot Sequence overlay (Phase 3 — BIOS → KERNEL → CORTEX → ACTIVE) ───

export type BootStage = 'bios' | 'kernel' | 'cortex' | 'active'

interface BootSequenceOverlayProps {
  stage: BootStage
}

export function BootSequenceOverlay({ stage }: BootSequenceOverlayProps) {
  if (stage === 'bios') return (
    <text x={0} y={0} textAnchor="middle" dominantBaseline="central"
      fill="var(--color-surface1)" fontSize={12} fontFamily="'JetBrains Mono', monospace"
      className="boot-bios">
      ▌ BIOS
    </text>
  )

  if (stage === 'kernel') return (
    <text x={0} y={-12} textAnchor="middle" dominantBaseline="central"
      fill="var(--color-overlay0)" fontSize={11} fontFamily="'JetBrains Mono', monospace"
      className="boot-kernel">
      ▌ KERNEL loading
    </text>
  )

  if (stage === 'cortex') return (
    <text x={0} y={-8} textAnchor="middle" dominantBaseline="central"
      fill="var(--color-blue)" fontSize={13} fontFamily="'JetBrains Mono', monospace"
      className="boot-cortex">
      ▌ CORTEX initializing
    </text>
  )

  // stage === 'active'
  return (
    <text x={0} y={0} textAnchor="middle" dominantBaseline="central"
      fill="var(--color-blue)" fontSize={16} fontFamily="'JetBrains Mono', monospace"
      className="boot-flash">
      Ψ [V16 ACTIVE]
    </text>
  )
}
