// ─── Heart-specific SVG defs (gradients, filters) ───
// Separated from CognitiveHeartView to keep the main view lean.

import { VITAL_RING_RADIUS, SWARM_OUTER_RADIUS } from '../../constants/schema'

export function HeartDefs() {
  return (
    <defs>
      {/* Vital ring animated gradient */}
      <linearGradient id="vitalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--color-blue)" stopOpacity="0">
          <animate attributeName="offset" values="0;1;0" dur="6s" repeatCount="indefinite" />
        </stop>
        <stop offset="50%" stopColor="var(--color-blue)" stopOpacity="1">
          <animate attributeName="offset" values="0.3;0.7;0.3" dur="6s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="var(--color-green)" stopOpacity="0">
          <animate attributeName="offset" values="0.6;1;0.6" dur="6s" repeatCount="indefinite" />
        </stop>
      </linearGradient>

      <linearGradient id="vitalGradient2" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="var(--color-mauve)" stopOpacity="0">
          <animate attributeName="offset" values="0;1;0" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="50%" stopColor="var(--color-mauve)" stopOpacity="0.6">
          <animate attributeName="offset" values="0.2;0.8;0.2" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="var(--color-red)" stopOpacity="0">
          <animate attributeName="offset" values="0.5;1;0.5" dur="8s" repeatCount="indefinite" />
        </stop>
      </linearGradient>

      {/* Nucleus radial glow */}
      <radialGradient id="nucleusGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--color-red)" stopOpacity="0.08" />
        <stop offset="60%" stopColor="var(--color-red)" stopOpacity="0.03" />
        <stop offset="100%" stopColor="var(--color-red)" stopOpacity="0" />
      </radialGradient>

      {/* Swarm glow */}
      <radialGradient id="swarmGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--color-maroon)" stopOpacity="0" />
        <stop offset="40%" stopColor="var(--color-maroon)" stopOpacity="0.04" />
        <stop offset="100%" stopColor="var(--color-maroon)" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

/** VITAL_RING_RADIUS + 300 — used by the nucleus glow circle in CognitiveHeartView */
export const NUCLEUS_GLOW_RADIUS = VITAL_RING_RADIUS + 300
/** SWARM_OUTER_RADIUS + 20 — used by the swarm glow circle in CognitiveHeartView */
export const SWARM_GLOW_RADIUS = SWARM_OUTER_RADIUS + 20
