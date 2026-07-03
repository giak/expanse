// ══════════════════════════════════════════════════════════════
// DREAM CONTRACTS — Step 7 of the reconstruction plan.
//
// Dream = automated cron job that consumes traces, proposes
// mutations, validates them objectively (not via LLM self-review
// which is bias-prone — see audit E.3 Self-Preservation bias),
// and emits a DreamReport for human review.
//
// Re-uses DreamReport / MutationProposal / MutationChange /
// MutationType from ../types.
// ══════════════════════════════════════════════════════════════

import type { DreamReport } from '../types'

/** Options for a single Dream run. All fields optional — defaults
 *  baked into the implementation (Step 7). */
export interface DreamConfig {
  /** When true, the LLM prompt is generated but NOT invoked.
   *  Useful for testing the prompt + prompt-to-JSON parser
   *  without spending tokens. Defaults to false. */
  dryRun?: boolean
  /** Cap on prompt tokens for the LLM call. The Dream uses
   *  ~500-token prompts per the plan; this hard cap prevents
   *  accidental drift toward larger prompts. */
  maxTraceTokens?: number
  /** Optional explicit timestamp for the report.
   *  @internal — test-only debugging helper exposed for
   *  deterministic timestamps in CI; production callers
   *  should omit and let the implementation default to
   *  `new Date().toISOString()`. */
  /** @internal */
  timestampOverride?: string
}

/** Function signature for the Dream cron job.
 *  Implementations must consume Mnemolite traces via the
 *  MnemoliteClient (injected), emit mutations to the proposal
 *  pool, and return a DreamReport describing what was
 *  collected/proposed/rejected/consumed. */
export type RunDreamJob = (config?: DreamConfig) => Promise<DreamReport>
