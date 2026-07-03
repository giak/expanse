// ══════════════════════════════════════════════════════════════
// TRIANGULATION CONTRACTS — Step 6 of the reconstruction plan.
//
// Triangulation = 3 INDEPENDENT pole executions executed in
// parallel, then aggregated to compute global confidence +
// contradictions + overlap. The poles are NOT invoked by the LLM
// (which was the source of "Confident Failure" — see audit §3.1).
//
// Re-uses TriangulationPole / PoleResult / TriangulationResult
// from ../types.
//
// Future: when Step 6 grows to dynamically-registered poles (not
// just the 3 hand-written poleAnchor/poleVessel/poleWeb), brand
// the PoleFunction: `PoleFunctionFor<S extends TriangulationPole>`
// so the tuple enforces `triple[i].source === poleOrder[i]` at
// compile time. YAGNI for now.
// ══════════════════════════════════════════════════════════════

import type { PoleResult, TriangulationResult } from '../types'

/** Input to the triangulation aggregator. */
export interface TriangulationInput {
  /** The query / hypothesis being verified. Each pole interprets
   *  this string independently. */
  query: string
  /** Optional scope context (e.g., protocol scope, file path globs)
   *  injected from BootContext. Empty array = global scope. */
  scopeContext?: string[]
}

/** Function signature for any of the 3 pole executors
 *  (poleAnchor, poleVessel, poleWeb). Poles receive only the
 *  raw query — they MUST NOT mutate shared state and MUST
 *  be idempotent. */
export type PoleFunction = (query: string) => Promise<PoleResult>

/** Tuple of the 3 poles — enforces the exact (anchor, vessel, web) shape that
 *  TriangulationResult.sources expects. Prevents callers from passing empty
 *  arrays, swapped roles, or duplicate sources. */
export type PoleTriple = readonly [PoleFunction, PoleFunction, PoleFunction]

/** Aggregator that consumes the 3 poles in fixed positions (anchor, vessel, web)
 *  and computes global confidence, contradictions, and overlap.
 *  Implementations live in triangulation/aggregate.ts (not yet written). */
export type TriangulateAggregator = (
  input: TriangulationInput,
  poles: PoleTriple,
) => Promise<TriangulationResult>
