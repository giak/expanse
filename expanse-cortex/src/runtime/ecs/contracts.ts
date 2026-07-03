// ══════════════════════════════════════════════════════════════
// ECS CONTRACTS — Step 3 of the reconstruction plan.
//
// ECS (Evaluation of Cognitive Complexity) is a deterministic pure
// function (regex heuristics) that replaces LLM-internal judgment
// with code. This file defines ONLY the shapes — implementations
// land in ecs/evaluate.ts.
//
// Re-uses centralized types from ../types (no duplication of
// ECSRoute / ECSResult / MnemoliteMemory / etc.).
// ══════════════════════════════════════════════════════════════

import type { ECSResult } from '../types'

/** Input to evaluateECS(). The raw text is the only required field;
 *  vesselAvailable hints whether the offline vessel index can be used
 *  as a tie-breaker (Step 5 distillation will consume this). */
export interface ECSInput {
  /** Raw input text to assess (user prompt or task description). */
  text: string
  /** Whether the vessel (workspace index) is available offline.
   *  When true, L3 routing may fall back to vessel search instead
   *  of LLM triangulation. Defaults to false in the contract layer. */
  vesselAvailable?: boolean
}

/** Wraps ECSResult with a deterministic `reason` string. The reason
 *  is human-readable and derived from the same heuristics that
 *  produced C/I/route — useful for audit logs (Step 9) and S14. */
export interface ECSEvaluation {
  result: ECSResult
  /** Human-readable explanation of WHY this C/I/route was chosen.
   *  Format: "<= 80 chars, e.g. 'C=4 ≥ threshold → L3'". */
  reason: string
}

/** Function signature for the deterministic evaluator.
 *  Implementations must be pure (no I/O, no LLM calls). */
export type EvaluateECS = (input: ECSInput) => ECSEvaluation
