// ══════════════════════════════════════════════════════════════
// RESONANCE PULSE — injection wave from Μ to all organs (EPIC §5.7)
//
// When Μ injects content into the context, a circular wave pulses
// from Μ toward all other organs. Each organ briefly glows on arrival.
//
// Trigger: step.organ === 'Μ' AND step.mcpOperation exists
//          AND progress between 0.5 and 0.8
//
// Effects:
//   1. L1 AURA ring pulse (rayon += 20px * intensity)
//   2. Expanding wave ring from Μ source
//   3. Brief glow at each target organ on "arrival"
//
// Intensity: 0.5 (1 MCP result) → 1.0 (4+ MCP results)
// ══════════════════════════════════════════════════════════════

import { useSignal } from '../../../context/SignalContext'

// ─── Layout constants ───

/** Maximum radius the wave expands to */
const WAVE_MAX_RADIUS = 350
/** Organ glow radius */
const GLOW_RADIUS = 50
/** Organ glow duration as fraction of progress (0.15 = ~15% of the 0.5–0.8 window) */
const GLOW_PROGRESS_WINDOW = 0.15

// ─── Component ───

interface ResonancePulseProps {
  /** Position of Μ (wave source) */
  source: { x: number; y: number }
  /** Positions of other organs (wave targets) — excludes Μ */
  targets: { x: number; y: number; symbol: string }[]
  /** Progress of the step — pulse active between 0.5 and 0.8 */
  progress: number
  /** Intensity: 0.5 (1 item) → 1.0 (4+ items) */
  intensity: number
}

export function ResonancePulse({
  source, targets, progress, intensity,
}: ResonancePulseProps) {
  // ── Hooks must be called unconditionally (Rules of Hooks) ──
  const { auraState } = useSignal()

  // Normalize progress to 0→1 within the 0.5–0.8 window
  const windowStart = 0.5
  const windowEnd = 0.8
  const windowSize = windowEnd - windowStart

  if (progress < windowStart || progress > windowEnd) return null

  const p = (progress - windowStart) / windowSize  // 0→1 within the resonance window

  // ── 1. Expanding wave ring from Μ ──
  const waveRadius = p * WAVE_MAX_RADIUS
  const waveAlpha = Math.max(0, (1 - p) * 0.4 * intensity)

  // ── 2. Organ glow — each target glows when the wave "reaches" it ──
  // Stagger arrival based on distance from Μ
  const maxDist = Math.max(...targets.map(t =>
    Math.hypot(t.x - source.x, t.y - source.y)
  ), 1)

  // ── 0. L1 AURA ring pulse — radius inflation during injection (EPIC §5.7) ──
  // The L1 ring temporarily expands proportionally to its current size, then returns.
  const l1Inflate = auraState.l1Radius * 0.12 * intensity
  // Smooth rise-and-fall: peaks at p=0.4, returns to 0 by p=0.9
  const l1PulseAlpha = p < 0.4
    ? p / 0.4                                          // rise
    : Math.max(0, 1 - (p - 0.4) / 0.5)               // fall

  return (
    <g className="pointer-events-none">
      {/* L1 AURA ring inflation — temporary radius boost during cortex injection */}
      {auraState.l1Radius > 0 && l1PulseAlpha > 0 && (
        <circle
          cx={0} cy={0}
          r={auraState.l1Radius + l1Inflate * l1PulseAlpha}
          fill="none"
          stroke="var(--color-mauve)"
          strokeWidth={1.5 * intensity * l1PulseAlpha}
          opacity={0.25 * l1PulseAlpha * intensity}
          filter="url(#glow)"
        />
      )}

      {/* Primary wave ring — expanding circle from Μ */}
      <circle
        cx={source.x} cy={source.y}
        r={waveRadius}
        fill="none"
        stroke="var(--color-mauve)"
        strokeWidth={2.5 * intensity * (1 - p * 0.7)}
        opacity={waveAlpha}
        filter="url(#glow)"
      />

      {/* Secondary wave ring — delayed, softer */}
      {p > 0.1 && (
        <circle
          cx={source.x} cy={source.y}
          r={(p - 0.1) * WAVE_MAX_RADIUS}
          fill="none"
          stroke="var(--color-blue)"
          strokeWidth={1.5 * intensity * (1 - p * 0.6)}
          opacity={waveAlpha * 0.5}
          filter="url(#glow)"
        />
      )}

      {/* Source glow — Μ pulses brighter during emission */}
      {p < 0.4 && (
        <circle
          cx={source.x} cy={source.y}
          r={40 + p * 30}
          fill="var(--color-mauve)"
          opacity={0.15 * intensity * (1 - p * 2.5)}
          filter="url(#glow)"
        />
      )}

      {/* Per-target glow — organ brightens when wave arrives */}
      {targets.map(target => {
        const dist = Math.hypot(target.x - source.x, target.y - source.y)
        // Arrival time: closer organs get the wave sooner (normalized 0→1)
        const arrivalP = (dist / maxDist) * 0.5  // arrives in first half
        // Glow window: from arrival to arrival + GLOW_PROGRESS_WINDOW
        const glowStart = arrivalP
        const glowEnd = arrivalP + GLOW_PROGRESS_WINDOW
        const inGlowWindow = p >= glowStart && p <= glowEnd

        if (!inGlowWindow) return null

        // Fade-in then fade-out within the glow window
        const glowProgress = (p - glowStart) / GLOW_PROGRESS_WINDOW
        const glowAlpha = glowProgress < 0.4
          ? glowProgress / 0.4                         // fade in
          : 1 - (glowProgress - 0.4) / 0.6            // fade out

        return (
          <g key={target.symbol}>
            {/* Outer glow halo */}
            <circle
              cx={target.x} cy={target.y}
              r={GLOW_RADIUS}
              fill="var(--color-mauve)"
              opacity={0.12 * intensity * glowAlpha}
              filter="url(#glow)"
            />
            {/* Inner bright ring */}
            <circle
              cx={target.x} cy={target.y}
              r={GLOW_RADIUS * 0.6}
              fill="none"
              stroke="var(--color-mauve)"
              strokeWidth={1.5 * intensity}
              opacity={0.35 * glowAlpha}
              filter="url(#glow)"
            />
          </g>
        )
      })}
    </g>
  )
}
// See MEMO-NOTES.md §E
