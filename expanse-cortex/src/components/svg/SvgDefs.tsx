import { useEffect } from 'react'
import { trackSvgDefsMount } from './SvgDefsContext'

export function SvgDefs() {
  useEffect(() => {
    trackSvgDefsMount(1)
    return () => trackSvgDefsMount(-1)
  }, [])

  return (
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="nodeShadow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.5" />
      </filter>

      {/* ════════ AURA RADIAL GRADIENTS (Story 6.2) ════════ */}
      {/* L0 — SUBSTRAT (blue, fixed after Boot step 1) — wider spread for larger ring */}
      <radialGradient id="auraGradientL0" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--color-blue)" stopOpacity="0.35" />
        <stop offset="40%" stopColor="var(--color-blue)" stopOpacity="0.15" />
        <stop offset="75%" stopColor="var(--color-blue)" stopOpacity="0.05" />
        <stop offset="100%" stopColor="var(--color-blue)" stopOpacity="0" />
      </radialGradient>

      {/* L1 — CORTEX (violet, grows with Μ injections) — wider spread */}
      <radialGradient id="auraGradientL1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--color-mauve)" stopOpacity="0.3" />
        <stop offset="35%" stopColor="var(--color-mauve)" stopOpacity="0.12" />
        <stop offset="70%" stopColor="var(--color-mauve)" stopOpacity="0.04" />
        <stop offset="100%" stopColor="var(--color-mauve)" stopOpacity="0" />
      </radialGradient>

      {/* L1 Fissure — red flash when violation detected */}
      <radialGradient id="auraGradientL1Fissure" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--color-red)" stopOpacity="0.45" />
        <stop offset="35%" stopColor="var(--color-red)" stopOpacity="0.15" />
        <stop offset="70%" stopColor="var(--color-red)" stopOpacity="0.05" />
        <stop offset="100%" stopColor="var(--color-red)" stopOpacity="0" />
      </radialGradient>

      {/* L2 — DYNAMIQUE (orange, volatile) — widest spread */}
      <radialGradient id="auraGradientL2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--color-peach)" stopOpacity="0.25" />
        <stop offset="30%" stopColor="var(--color-peach)" stopOpacity="0.1" />
        <stop offset="65%" stopColor="var(--color-peach)" stopOpacity="0.03" />
        <stop offset="100%" stopColor="var(--color-peach)" stopOpacity="0" />
      </radialGradient>

      {/* Irisation stroke — multi-color linear gradient for halo when 2+ strata active */}
      <linearGradient id="auraIrisationStroke" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--color-blue)" stopOpacity="0.8" />
        <stop offset="33%" stopColor="var(--color-mauve)" stopOpacity="0.8" />
        <stop offset="66%" stopColor="var(--color-peach)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="var(--color-blue)" stopOpacity="0.8" />
      </linearGradient>
    </defs>
  )
}
