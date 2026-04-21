// ─── Individual Particle Data ───
// Particles are plain objects managed by ParticleEngine.
// No class — the engine handles all lifecycle logic.

import type { ParticleTypeConfig } from './particleTypes'

export interface Particle {
  /** Edge index in the edges array this particle travels along */
  edgeIdx: number
  /** Progress along the edge: 0 = source, 1 = target */
  progress: number
  /** Speed: how much progress per second (1 / duration) */
  speed: number
  /** Particle type config (determines visual style) */
  config: ParticleTypeConfig
  /** Source node screen position (graph-space, updated each frame) */
  sx: number
  sy: number
  /** Target node screen position (graph-space, updated each frame) */
  tx: number
  ty: number
  /** Current interpolated position (graph-space) */
  x: number
  y: number
  /** Remaining life in seconds after reaching target (fade-out period) */
  fadeOut: number
  /** Is this particle alive? */
  alive: boolean
}
