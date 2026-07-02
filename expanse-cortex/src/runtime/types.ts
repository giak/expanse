// ══════════════════════════════════════════════════════════════
// RUNTIME TYPES — Core contracts for the Expanse cognitive runtime
//
// This module defines the shared types used across all runtime
// subsystems: ECS evaluation, Mnemolite client, boot, triangulation,
// dream (cron), and memory security.
//
// Convention: interface for object shapes, type for unions.
// ══════════════════════════════════════════════════════════════

// ─── ECS (Evaluation of Cognitive Complexity) ───

/** ECS routing levels — determines processing depth. */
export type ECSRoute = 'L1' | 'L2' | 'L3'

/** Result of the ECS evaluation function.
 *  C = Complexity (1-5), I = Impact (1-3), route = processing level. */
export interface ECSResult {
  C: number
  I: number
  route: ECSRoute
}

// ─── MCP Tool ───

/** A tool exposed by the Mnemolite MCP server. */
export interface Tool {
  name: string
  description?: string
}

// ─── Vessel (Workspace Index) ───

/** A chunk of indexed workspace content from index_markdown_workspace. */
export interface VesselChunk {
  path: string
  content: string
  metadata?: Record<string, unknown>
}

// ─── Mnemolite Memory ───

/** A single memory entry stored in Mnemolite. */
export interface MnemoliteMemory {
  id: string
  title: string
  content: string
  tags: string[]
  created_at: string
  lifecycle_state?: string
  memory_type?: string
  centrality?: number
}

/** Arguments for search_memory MCP calls. */
export interface SearchMemoryArgs {
  query?: string
  tags?: string[]
  limit?: number
  lifecycle_state?: string
  consumed?: boolean
}

/** Arguments for write_memory MCP calls.
 *  `source` is required — all writes must declare provenance (Step 9 security). */
export interface WriteMemoryArgs {
  title: string
  content: string
  tags: string[]
  memory_type?: string
  source: MemorySource
}

/** Provenance of a memory write — used by the security layer. */
export type MemorySource = 'user' | 'self' | 'external'

// ─── System Snapshot ───

/** Full system snapshot returned by get_system_snapshot. */
export interface SystemSnapshot {
  core: MnemoliteMemory[]
  patterns: MnemoliteMemory[]
  extensions: MnemoliteMemory[]
  profile: UserProfile | null
  project: ProjectInfo | null
  health: SnapshotHealth
}

/** Health metrics from the snapshot. */
export interface SnapshotHealth {
  fresh_drifts: number
  fresh_traces: number
  needs_consolidation: boolean
  history_count: number
  total_memories: number
}

/** User profile stored in Mnemolite (sys:user:profile). */
export interface UserProfile {
  style_cognitif?: string
  [key: string]: unknown
}

/** Project info stored in Mnemolite. */
export interface ProjectInfo {
  name: string
  intent: string
  [key: string]: unknown
}

// ─── Boot Context ───

/** Assembled context from the boot script, injected into the LLM prompt.
 *  Replaces the 57K-token V15 boot with a ~200-token structured object. */
export interface BootContext {
  snapshot: SystemSnapshot
  protocols: MnemoliteMemory[]
  vessel: VesselChunk[] | null
  health: SnapshotHealth
  timestamp: string
  online: boolean
}

// ─── Traces & Drift ───

/** A fresh trace from the last interaction cycle (tag: trace:fresh). */
export interface TraceFresh {
  id: string
  title: string
  content: string
  tags: string[]
  created_at: string
}

/** A drift signal auto-detected by the system (tag: sys:drift). */
export interface DriftSignal {
  id: string
  title: string
  content: string
  tags: string[]
  type: string
  created_at: string
}

// ─── Triangulation ───

/** The 3 independent poles of verification. */
export type TriangulationPole = 'anchor' | 'vessel' | 'web'

/** A file match from the vessel (workspace) pole — ripgrep result. */
export interface FileMatch {
  path: string
  line: number
  content: string
}

/** A web search result from the web pole. */
export interface SearchResult {
  url: string
  title: string
  snippet: string
}

/** Result from a single triangulation pole. */
export interface PoleResult {
  source: TriangulationPole
  data: unknown
  confidence: number
  error?: string
}

/** Aggregated result from the 3-pole triangulation.
 *  Pre-calculated in code, injected into the LLM context. */
export interface TriangulationResult {
  confidence: number
  sources: PoleResult[]
  contradictions: string[]
  overlap: string[]
}

// ─── Dream (Cron Job) ───

/** Type of mutation proposed by the Dream cycle. */
export type MutationType = 'rule' | 'ecs' | 'boot' | 'archi'

/** Direction of change — 'remove' is explicit to counter additive bias. */
export type MutationChange = 'add' | 'modify' | 'remove'

/** A mutation proposed by the Dream analysis, pending validation + human review. */
export interface MutationProposal {
  slug: string
  type: MutationType
  description: string
  trace_ref: string
  change: MutationChange
  validation_test: string
}

/** Full report from a Dream cycle run. */
export interface DreamReport {
  timestamp: string
  traces_collected: number
  drifts_collected: number
  mutations_proposed: MutationProposal[]
  mutations_rejected: MutationProposal[]
  traces_consumed: string[]
}

// ─── Security ───

/** Result of validating memory content before writing. */
export interface ValidationResult {
  valid: boolean
  reason?: string
  pattern?: string
}
