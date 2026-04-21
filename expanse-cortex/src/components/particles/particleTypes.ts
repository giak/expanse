// ─── Particle Type Definitions ───
// Each type controls how particles look and behave on a specific edge category.

export interface ParticleTypeConfig {
  /** Which edge types spawn this particle */
  edgeTypes: string[]
  /** Base color (hex) — particles interpolate source→target color */
  color: string
  /** Particle radius in graph-space pixels */
  radius: number
  /** Travel time along the edge in seconds */
  duration: number
  /** Particles per edge (spread over time) */
  density: number
  /** Glow intensity (0–1). 0 = no glow, just a dot */
  glowIntensity: number
  /** Opacity at peak */
  opacity: number
  /** Tail length (0 = no tail, 1 = full trail) */
  tailLength: number
}

// Edge types that should NEVER spawn particles (structural / static)
// Phase 3: Removed GUARDS, CHECKS, STALLS, CONTAINS, RESOLVES — now have nature-specific particles
export const STATIC_EDGE_TYPES = new Set([
  'DERIVES_FROM',
  'RELATES_TO',
  'REFERENCES',
  'IMPLEMENTS',
  'SUPERSEDES',
  'RATE_POSITIVE',
  'RATE_NEGATIVE',
])

// Metabolic flow — Σ→Ψ→Φ→Ω→Μ pipeline (FEEDS_INTO)
export const METABOLIC: ParticleTypeConfig = {
  edgeTypes: ['FEEDS_INTO'],
  color: '#89b4fa',
  radius: 3,
  duration: 3,
  density: 2,        // 2 particles per FEEDS_INTO edge
  glowIntensity: 0.5,
  opacity: 0.85,
  tailLength: 0.4,
}

// Mutation pulse — MUTATION→APEX (ALTERS)
export const MUTATION_PULSE: ParticleTypeConfig = {
  edgeTypes: ['ALTERS'],
  color: '#fab387',
  radius: 2.5,
  duration: 4.5,
  density: 1,
  glowIntensity: 0.35,
  opacity: 0.7,
  tailLength: 0.3,
}

// Trigger flash — COMMANDE→PROTOCOLE (TRIGGERS)
export const TRIGGER_FLASH: ParticleTypeConfig = {
  edgeTypes: ['TRIGGERS'],
  color: '#f9e2af',
  radius: 2,
  duration: 1.8,
  density: 1,
  glowIntensity: 0.6,
  opacity: 0.9,
  tailLength: 0.6,
}

// Tool activation — OUTIL→* (CALLS, PRODUCES, DRAFTS)
export const TOOL_CALL: ParticleTypeConfig = {
  edgeTypes: ['CALLS', 'PRODUCES', 'DRAFTS'],
  color: '#cba6f7',
  radius: 2,
  duration: 2.5,
  density: 1,
  glowIntensity: 0.3,
  opacity: 0.65,
  tailLength: 0.2,
}

// Crystallization — Ω→Μ or pattern-related (CRYSTALLIZES_FROM)
export const CRYSTALLIZATION: ParticleTypeConfig = {
  edgeTypes: ['CRYSTALLIZES_FROM'],
  color: '#a6e3a1',
  radius: 2.5,
  duration: 3.5,
  density: 1,
  glowIntensity: 0.4,
  opacity: 0.75,
  tailLength: 0.35,
}

// ─── Phase 3: Nature-specific Mnemolite particles ───

// Incandescent spark — DRIFT edges emit fleeting red sparks that decay quickly
export const INCANDESCENT_SPARK: ParticleTypeConfig = {
  edgeTypes: ['STALLS', 'RESOLVES'],
  color: '#f38ba8',
  radius: 1.5,
  duration: 1.2,         // fast — incandescent burns out quickly
  density: 1,
  glowIntensity: 0.7,   // intense glow
  opacity: 0.9,
  tailLength: 0.5,
}

// Permanent crystal shimmer — REFERENCES edges have slow, crystalline particles
export const PERMANENT_CRYSTAL: ParticleTypeConfig = {
  edgeTypes: ['FEEDBACK', 'CONTAINS'],
  color: '#b4befe',
  radius: 1.8,
  duration: 5,           // slow — permanent is enduring
  density: 1,
  glowIntensity: 0.25,
  opacity: 0.6,
  tailLength: 0.15,
}

// Volatile drift — GUARDS/CHECKS edges have intermittent yellow particles
export const VOLATILE_DRIFT: ParticleTypeConfig = {
  edgeTypes: ['GUARDS', 'CHECKS', 'DRAFTS'],
  color: '#f9e2af',
  radius: 1.5,
  duration: 2.5,
  density: 1,
  glowIntensity: 0.35,
  opacity: 0.7,
  tailLength: 0.25,
}

// All active particle types
export const ALL_PARTICLE_TYPES: ParticleTypeConfig[] = [
  METABOLIC,
  MUTATION_PULSE,
  TRIGGER_FLASH,
  TOOL_CALL,
  CRYSTALLIZATION,
  INCANDESCENT_SPARK,
  PERMANENT_CRYSTAL,
  VOLATILE_DRIFT,
]

// Map edge type → particle config (for fast lookup)
export const EDGE_TYPE_TO_PARTICLE: Map<string, ParticleTypeConfig> = new Map()
for (const pt of ALL_PARTICLE_TYPES) {
  for (const et of pt.edgeTypes) {
    // First registration wins (earlier types have priority)
    if (!EDGE_TYPE_TO_PARTICLE.has(et)) {
      EDGE_TYPE_TO_PARTICLE.set(et, pt)
    }
  }
}
