// ══════════════════════════════════════════════════════════════
// AURA FIELD — 3 concentric rings visualizing the context milieu
// Source canonique : EPIC-CONTEXTE-AURA.md §Ⅴ + §5.6
//
// Renders L0 (substrat/blue), L1 (cortex/violet), L2 (dynamic/orange)
// as radial-gradient circles centered on the organ ring.
// Z-order: AURA (z-0) < Organs (z-1) < Dendrites (z-2).
// ══════════════════════════════════════════════════════════════

import { useSignal } from '../../../context/SignalContext'

// ─── Individual stratum ring ───

interface StratumRingProps {
  /** Radius of the ring */
  radius: number
  /** Opacity multiplier (0–1) */
  opacity: number
  /** Gradient ID to reference in <defs> */
  gradientId: string
  /** CSS class for pulse animation */
  className?: string
  /** Animation duration derived from pulseSpeed */
  animationDuration?: string
  /** Stroke color for boundary ring (optional) */
  strokeColor?: string
}

function StratumRing({ radius, opacity, gradientId, className, animationDuration, strokeColor }: StratumRingProps) {
  if (radius <= 0 || opacity <= 0) return null

  // Use a wrapper <g> for radius scaling (smooth transition via transform),
  // so the inner circle's CSS pulse animation (also transform:scale) doesn't conflict.
  // Opacity is applied per-element (not on wrapper) to avoid double-multiplication.
  return (
    <g style={{ transition: 'opacity 0.6s ease' }}>
      <g style={{
        transform: `scale(${radius})`,
        transformOrigin: '0 0',
        transition: 'transform 0.8s ease',
      }}>
        {/* Filled gradient disc */}
        <circle
          cx={0} cy={0}
          r={1}
          fill={`url(#${gradientId})`}
          opacity={opacity}
          className={className}
          style={animationDuration ? { animationDuration } : undefined}
        />
        {/* Thin boundary stroke — delineates stratum edge */}
        {strokeColor && (
          <circle
            cx={0} cy={0}
            r={1}
            fill="none"
            stroke={strokeColor}
            strokeWidth={0.6 / Math.max(radius, 1)}
            opacity={Math.max(0.15, opacity * 0.5)}
            className={className}
            style={animationDuration ? { animationDuration } : undefined}
          />
        )}
      </g>
    </g>
  )
}

// ─── Main AuraField component ───

export function AuraField() {
  const { auraState } = useSignal()

  // Determine dominant stratum for pulse behavior
  const hasAnyAura = auraState.l0Radius > 0 || auraState.l1Radius > 0 || auraState.l2Radius > 0
  if (!hasAnyAura) return null

  const pulseDur = `${auraState.pulseSpeed}s`

  // Determine if multiple strata are active → irisation glow
  const activeStrata = [auraState.l0Radius > 0, auraState.l1Radius > 0, auraState.l2Radius > 0].filter(Boolean).length
  const hasIrisation = activeStrata >= 2

  // Outermost radius for the irisation halo
  const outerRadius = Math.max(auraState.l0Radius, auraState.l1Radius, auraState.l2Radius)

  return (
    <g className="pointer-events-none">
      {/* L2 — DYNAMIQUE (outermost, volatile, orange) */}
      <StratumRing
        radius={auraState.l2Radius}
        opacity={auraState.l2Opacity}
        gradientId="auraGradientL2"
        strokeColor="var(--color-peach)"
        className="aura-ring-pulse"
        animationDuration={pulseDur}
      />

      {/* L1 — CORTEX (middle, grows with Μ injections, violet/red) */}
      <StratumRing
        radius={auraState.l1Radius}
        opacity={auraState.l1Opacity}
        gradientId={auraState.fissure ? 'auraGradientL1Fissure' : 'auraGradientL1'}
        strokeColor={auraState.fissure ? 'var(--color-red)' : 'var(--color-mauve)'}
        className={auraState.fissure ? 'aura-fissure-pulse' : 'aura-ring-pulse'}
        animationDuration={auraState.fissure ? '0.4s' : pulseDur}
      />

      {/* L0 — SUBSTRAT (innermost, fixed, blue) */}
      <StratumRing
        radius={auraState.l0Radius}
        opacity={auraState.l0Opacity}
        gradientId="auraGradientL0"
        strokeColor="var(--color-blue)"
        className="aura-ring-pulse"
        animationDuration={pulseDur}
      />

      {/* Irisation glow — subtle multi-color halo when 2+ strata active, slowly rotating */}
      {hasIrisation && outerRadius > 0 && (
        <g style={{
          transform: `scale(${outerRadius})`,
          transformOrigin: '0 0',
          transition: 'transform 0.8s ease',
        }}>
          <circle
            cx={0} cy={0}
            r={1}
            fill="none"
            stroke="url(#auraIrisationStroke)"
            strokeWidth={1.2 / outerRadius}
            opacity={0.2}
            filter="url(#glow)"
            className="aura-irisation-halo"
          />
        </g>
      )}

      {/* Fissure flash overlay — bright red pulse on L1 when violation detected */}
      {auraState.fissure && auraState.l1Radius > 0 && (
        <g style={{
          transform: `scale(${auraState.l1Radius})`,
          transformOrigin: '0 0',
        }}>
          <circle
            cx={0} cy={0}
            r={1}
            fill="none"
            stroke="var(--color-red)"
            strokeWidth={Math.max(2.5, auraState.l1Radius * 0.01) / auraState.l1Radius}
            className="aura-fissure-flash"
            filter="url(#glow)"
          />
        </g>
      )}
    </g>
  )
}
// See MEMO-NOTES.md §D
