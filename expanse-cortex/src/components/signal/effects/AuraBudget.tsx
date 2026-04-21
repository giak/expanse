// ══════════════════════════════════════════════════════════════
// AURA BUDGET — mini context budget indicator bar (EPIC §5.8)
//
// Renders a segmented horizontal bar showing the proportion of
// the LLM context window occupied by each stratum:
//   L0 (substrat/blue) | L1 (cortex/violet) | L2 (dynamique/orange)
//
// Overall color shifts: green (<50%), yellow (50-75%), red (>75%).
// Positioned below the organ ring in SignalCanvas.
// ══════════════════════════════════════════════════════════════

import { useId } from 'react'
import { useSignal } from '../../../context/SignalContext'

// ─── Layout constants ───

/** Total width of the budget bar */
const BAR_WIDTH = 180
/** Height of the bar */
const BAR_HEIGHT = 5
/** Y offset below SVG center — below the max AURA ring (~410px) with margin */
const BAR_Y_OFFSET = 460
/** Gap between segments (visual separation) */
const SEGMENT_GAP = 1
/** Label font size */
const LABEL_FONT = 7

// ─── Stratum colors ───

const STRATUM_COLORS = {
  l0: 'var(--color-blue)',   // blue — substrat
  l1: 'var(--color-mauve)',   // violet — cortex
  l2: 'var(--color-peach)',   // orange — dynamique
} as const

// ─── Threshold color for overall usage ───

function usageColor(pct: number): string {
  if (pct >= 75) return 'var(--color-red)'   // red — overloaded
  if (pct >= 50) return 'var(--color-yellow)'   // yellow — moderate
  return 'var(--color-green)'                   // green — healthy
}

// ─── Component ───

export function AuraBudget() {
  const { auraState } = useSignal()
  const uid = useId().replace(/:/g, '_')  // SVG-safe unique ID
  const { budget } = auraState

  const used = budget.l0Tokens + budget.l1Tokens + budget.l2Tokens
  const total = budget.totalBudget
  if (total <= 0 || used <= 0) return null

  const usedPct = (used / total) * 100

  // Segment widths (proportional to token count, within total bar width)
  const usableWidth = BAR_WIDTH - SEGMENT_GAP * 2  // 2 gaps between 3 segments
  const l0W = Math.max(0, (budget.l0Tokens / total) * BAR_WIDTH)
  const l1W = Math.max(0, (budget.l1Tokens / total) * BAR_WIDTH)
  const l2W = Math.max(0, (budget.l2Tokens / total) * BAR_WIDTH)

  // Clamp total to bar width
  const scale = (l0W + l1W + l2W) > 0
    ? usableWidth / (l0W + l1W + l2W)
    : 1
  const s0 = l0W * scale
  const s1 = l1W * scale
  const s2 = l2W * scale

  // Center the bar horizontally
  const barX = -BAR_WIDTH / 2
  const barY = BAR_Y_OFFSET

  const pctColor = usageColor(usedPct)
  const pctLabel = usedPct < 1 ? '<1%' : `${Math.round(usedPct)}%`

  return (
    <g className="pointer-events-none">
      {/* Background track */}
      <rect
        x={barX} y={barY}
        width={BAR_WIDTH} height={BAR_HEIGHT}
        rx={BAR_HEIGHT / 2}
        fill="var(--color-base)"
        opacity={0.6}
      />

      {/* Segments clipped to the rounded track shape (clipPath provides consistent corner rounding) */}
      <clipPath id={`budgetBarClip_${uid}`}>
        <rect
          x={barX} y={barY}
          width={BAR_WIDTH} height={BAR_HEIGHT}
          rx={BAR_HEIGHT / 2}
        />
      </clipPath>
      <g clipPath={`url(#budgetBarClip_${uid})`}>
        {/* L0 segment (substrat — blue) */}
        {s0 > 0 && (
          <rect
            x={barX} y={barY}
            width={s0} height={BAR_HEIGHT}
            fill={STRATUM_COLORS.l0}
            opacity={0.8}
          />
        )}

        {/* L1 segment (cortex — violet) */}
        {s1 > 0 && (
          <rect
            x={barX + s0 + SEGMENT_GAP} y={barY}
            width={s1} height={BAR_HEIGHT}
            fill={STRATUM_COLORS.l1}
            opacity={0.8}
          />
        )}

        {/* L2 segment (dynamique — orange) */}
        {s2 > 0 && (
          <rect
            x={barX + s0 + s1 + SEGMENT_GAP * 2} y={barY}
            width={s2} height={BAR_HEIGHT}
            fill={STRATUM_COLORS.l2}
            opacity={0.8}
          />
        )}
      </g>

      {/* Percentage label — right-aligned below bar */}
      <text
        x={barX + BAR_WIDTH} y={barY + BAR_HEIGHT + 12}
        textAnchor="end"
        fill={pctColor}
        fontSize={LABEL_FONT}
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="bold"
        opacity={0.8}
      >
        {pctLabel} ctx
      </text>

      {/* Stratum labels — left-aligned below bar */}
      <text
        x={barX} y={barY + BAR_HEIGHT + 12}
        textAnchor="start"
        fill="var(--color-overlay0)"
        fontSize={LABEL_FONT - 1}
        fontFamily="'JetBrains Mono', monospace"
        opacity={0.5}
      >
        {'L0 '}
        <tspan fill={STRATUM_COLORS.l0}>■</tspan>
        {' L1 '}
        <tspan fill={STRATUM_COLORS.l1}>■</tspan>
        {' L2 '}
        <tspan fill={STRATUM_COLORS.l2}>■</tspan>
      </text>
    </g>
  )
}
// See MEMO-NOTES.md §D
