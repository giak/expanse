// ─── Signal View Types ───
// Shared between SignalView and useSignalSimulation hook.

import { DREAM_PHASES } from '../constants/phases'

// ══════════════════════════════════════════════════════════════
// SEALED TYPES — Union types with runtime type guards
// ══════════════════════════════════════════════════════════════

/** The 5 organs of the cognitive system — sealed union type.
 *  Cannot be constructed from arbitrary string at compile time. */
export type Organ = 'Σ' | 'Ψ' | 'Φ' | 'Ω' | 'Μ'

/** Set for runtime validation */
export const VALID_ORGANS: Set<Organ> = new Set(['Σ', 'Ψ', 'Φ', 'Ω', 'Μ'])

/** Runtime type guard — validates JSON input from Mnemolite */
export function isOrgan(value: string): value is Organ {
  return VALID_ORGANS.has(value as Organ)
}

/** ECS routing levels — sealed union type.
 *  BOOT = pre-routing, PRE = pre-evaluation, L1/L2/L3 = resolution depth.
 *  DREAM = dream cycle routing (reserved — not used in demo scenarios yet, but
 *  the Dream Gate resolves as a distinct ECS level in the architecture). */
export type ECSLevel = 'BOOT' | 'PRE' | 'L1' | 'L2' | 'L3' | 'DREAM'

/** Set for runtime validation */
export const VALID_ECS_LEVELS: Set<ECSLevel> = new Set(['BOOT', 'PRE', 'L1', 'L2', 'L3', 'DREAM'])

/** Runtime type guard — validates JSON input */
export function isECSLevel(value: string): value is ECSLevel {
  return VALID_ECS_LEVELS.has(value as ECSLevel)
}

/** Step kind discriminator — optional, retrocompatible.
 *  Provides opt-in narrowing beyond phase-based type guards. */
export type StepKind = 'boot' | 'perceptual' | 'audit' | 'triangulation' | 'violation' | 'hallucination' | 'momentum' | 'vessel' | 'dream' | 'mutation'

/** Strict phase identifiers — compile-time safety for cognitive operation types.
 *  New phases MUST be added here explicitly. This ensures typos are caught at compile time. */
export type Phase =
  // Boot phases
  | 'INIT' | 'SEED' | 'APEX' | 'INDEX' | 'MEMORY' | 'CHECK' | 'BRIEFING' | 'READY' | 'LISTEN'
  // Bonjour / perceptual cycle phases
  | 'PERCEIVE' | 'EVALUATE' | 'ROUTE' | 'VERIFY' | 'EMIT' | 'RECORD' | 'IDLE'
  // L2 Audit phases
  | 'AUDIT' | 'TOOL_CALL' | 'RECALL' | 'SYNTHESIZE'
  // L3 Triangulation phases
  | 'TRIANGULATE' | 'ANCHOR_POLE' | 'VESSEL_POLE' | 'WEB_POLE'
  // Violation / SEC phases
  | 'DETECT' | 'BLOCK' | 'CHALLENGE'
  // Hallucination block phases
  | 'MISSING' | 'LOST_EMIT'
  // Momentum resist phases
  | 'RHETORIC_DETECT'
  // Vessel guard phases
  | 'VESSEL_SEARCH' | 'VESSEL_FOUND'
  // Dream cycle phases
  | 'DREAM_INIT' | 'WINTER' | 'FRESH_COUNT' | 'DEGEL' | 'LINTER' | 'EMERGENCE' | 'ELAGAGE'
  // Dream / Mutation phases
  | 'LOCK' | 'BACKUP' | 'DIFF' | 'MERGE' | 'PRUNE' | 'ARCHIVE'
  | 'DREAM' | 'PROPOSE' | 'TEST_M' | 'APPLY' | 'ROLLBACK'
  // Gardening phases
  | 'GARDEN' | 'SCAN' | 'TEND' | 'HARVEST'
  // Meta phases
  | 'SIGNAL_NEG' | 'DECRYSTALLIZE' | 'STALL'

/** Visual effect identifiers — compile-time safety for SVG animation triggers.
 *  Multiple effects can co-occur on a single step (e.g. resonance-pulse + recall-stream). */
export type VisualEffect =
  | 'crystallize' | 'decrystallize' | 'guard-shield' | 'question-pulse'
  | 'audit-loop' | 'tool-flash' | 'recall-stream'
  | 'tri-pole-orbit' | 'tri-pole-orbit-converging'
  | 'confiance-gauge' | 'constitutional-guard'
  | 'red-alert' | 'block-wall' | 'contradiction-bolt'
  | 'fresh-trace-mark' | 'fog-patch' | 'lost-stamp'
  | 'question-mark-shield' | 'vessel-radar' | 'grep-beam'
  | 'dream-gate' | 'mutation-orbit' | 'season-cycle'
  | 'proposal-bloom' | 'prune-shears' | 'resonance-pulse'

export interface ProcessStep {
  organ: Organ           // which organ is active — sealed type, not arbitrary string
  label: string          // what's happening
  detail?: string        // optional detail text
  badge?: string         // e.g. "ECS: C=3, I=2 → L2"
  toolCalls?: string[]   // e.g. ["search_memory()", "search_code()"]
  confidence?: number    // % for L3
  duration: number       // ms this step stays active
  isNegative?: boolean   // true = negative signal / SEC violation
  ecsRoute?: { c: number; i: number; level: ECSLevel }  // ECS routing info — sealed level
  phase?: Phase          // cognitive operation phase — compile-time checked
  visualEffects?: VisualEffect[]  // triggers special SVG animations (multiple can co-occur)

  // ─── Temporalité réelle (Étape 7 du méta-prompt) ───

  /** How this step executes in time — distinguishes presentation from execution */
  temporality?: Temporality

  // ─── Physiological props: what specifically happens inside the organ ───

  /** Specific graph node IDs that pulse during this step */
  activeNodeIds?: string[]

  /** Labeled data packets traveling between specific coordinates */
  packetFlows?: PacketFlow[]

  /** MCP operation: sonar ping + target node illumination */
  mcpOperation?: {
    type: 'search' | 'write' | 'rate' | 'snapshot'
    toolName: string           // e.g. 'search_memory()'
    targetNodeIds: string[]    // nodes that illuminate on ping
    resultCount?: number       // how many results returned
  }

  /** ECS routing fork behavior */
  ecsFork?: {
    level: 'L1' | 'L2' | 'L3'  // subset of ECSLevel — fork only happens at resolved levels
    rays: Organ[]              // organ symbols the prism shoots rays toward — sealed type
  }

  /** Node lifecycle transition */
  nodeLifecycle?: {
    nodeId?: string
    action: 'spawn' | 'morph-to-pattern' | 'morph-to-core' | 'delete' | 'guard-block'
  }

}

/** A labeled data packet traveling between two points in the graph */
export interface PacketFlow {
  source: string        // node ID or organ symbol (Σ, Ψ, Φ, Ω, Μ)
  target: string        // node ID or organ symbol
  label: string         // what data is moving: "search_memory(tags)", "3 patterns", "mutation diff"
  color?: string        // override color (defaults to source organ color)
  isCurved?: boolean    // arc the path to avoid center collision
}

export type ScenarioRoute = 'L1' | 'L2' | 'L3' | 'BOOT' | 'DREAM' | 'A1' | 'A2' | 'MUT' | 'NEG' | 'CRYS' | 'DCRY' | 'GARD' | 'LIVE'

/** Temporality classification for step execution (Garde 9 / Étape 7) */
export type Temporality = 'simultané' | 'conditionnel' | 'différé' | 'séquentiel'

/** A divergence between two sources about the same mechanism (Garde 9) */
export interface Divergence {
  source1: string       // e.g. "KERNEL §XII"
  source2: string       // e.g. "V16 Seed"
  description: string   // what diverges between the sources
  resolution: string    // how the divergence is resolved (hierarchy)
}

export interface Scenario {
  id: string
  title: string
  /** Short label + emoji for scenario selector (e.g. '🧬 Boot', '👋 Bonjour'). Falls back to title if omitted. */
  selectorLabel?: string
  subtitle: string
  route: ScenarioRoute
  color: string
  steps: ProcessStep[]
  /** Divergences between sources for this mechanism (Garde 9) */
  divergences?: Divergence[]
  source?: 'demo' | 'live'  // whether this is a demo or generated from live data
}

// ══════════════════════════════════════════════════════════════
// TYPE GUARDS — phase-based narrowing (after ProcessStep definition)
// ══════════════════════════════════════════════════════════════

/** Phases that belong to the Boot sequence */
const BOOT_PHASE_SET = new Set([
  'INIT', 'SEED', 'APEX', 'INDEX', 'MEMORY', 'CHECK', 'BRIEFING', 'READY', 'LISTEN',
])

/** Type guard: is this step a Boot step? */
export function isBootStep(step: ProcessStep): step is ProcessStep & { phase: 'INIT' | 'SEED' | 'APEX' | 'INDEX' | 'MEMORY' | 'CHECK' | 'BRIEFING' | 'READY' | 'LISTEN' } {
  return !!step.phase && BOOT_PHASE_SET.has(step.phase)
}

/** Type guard: is this step a Dream step? */
export function isDreamStep(step: ProcessStep): step is ProcessStep & { phase: 'DREAM_INIT' | 'WINTER' | 'FRESH_COUNT' | 'DEGEL' | 'LINTER' | 'EMERGENCE' | 'ELAGAGE' } {
  return !!step.phase && DREAM_PHASES.has(step.phase)
}

/** Type guard: is this step an Audit (L2) step? */
export function isAuditStep(step: ProcessStep): step is ProcessStep & { phase: 'AUDIT' | 'TOOL_CALL' | 'RECALL' | 'SYNTHESIZE' } {
  const p = step.phase
  return !!p && (p === 'AUDIT' || p === 'TOOL_CALL' || p === 'RECALL' || p === 'SYNTHESIZE')
}
