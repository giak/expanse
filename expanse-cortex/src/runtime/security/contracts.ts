// ══════════════════════════════════════════════════════════════
// SECURITY CONTRACTS — Step 9 of the reconstruction plan.
//
// Memory security has 3 axes:
//   1. validateMemoryContent  — reject injection patterns (in
//      imperative, identity changes, invalid file refs,
//      blacklisted regex payloads).
//   2. sanitizeExternalContent — prefix + escape content from
//      `external` sources that DOES pass validation.
//   3. provenance logging      — record every write attempt with
//      its MemorySource and rejection flag.
// All three are pure / I/O-isolated functions.
//
// Re-uses ValidationResult / MemorySource from ../types.
// ══════════════════════════════════════════════════════════════

import type { MemorySource, ValidationResult } from '../types'

/** An external content payload (e.g., from web scraper or
 *  user-supplied URL) awaiting validation + sanitization. */
export interface ExternalContent {
  /** Raw untrusted text. */
  raw: string
  /** Optional origin URL for provenance + audit. */
  originUrl?: string
}

/** Log entry for a single memory write attempt (Step 9 audit log).
 *  Consumed by security/provenance.ts. */
export interface ProvenanceLog {
  /** Source declared by the caller (`user`/`self`/`external`). */
  source: MemorySource
  /** ISO 8601 timestamp of the attempt. */
  timestamp: string
  /** True when the write was REJECTED by validateMemoryContent(). */
  rejected: boolean
  /** When rejected=true, the offending regex pattern (for
   *  forensic analysis). */
  flaggedPattern?: string
  /** Optional correlation ID (e.g., MnemoliteMemory.id once written). */
  memoryId?: string
}

/** Function signature for the content validator. Implementations
 *  MUST be pure regex-based — no LLM, no network. Returns
 *  `valid: false` + the matching `pattern` when blocked.
 *
 *  Validation rules differ per `source`:
 *    - 'external': full pattern scan (imperative, identity changes,
 *      file refs, blacklisted regex payloads).
 *    - 'user':     lighter scan (only prompt-injection markers).
 *    - 'self':     pass-through (system-generated content is trusted). */
export type ValidateMemory = (
  content: string,
  source: MemorySource,
) => ValidationResult

/** Function signature for the external-content sanitizer. After
 *  validation passes, prefix the content with a clear "EXTERNAL
 *  UNTRUSTED" marker so downstream consumers can render it
 *  defensively. */
export type SanitizeExternal = (content: ExternalContent) => string

/** Function signature for the provenance logger. Implementations
 *  side-effect: write to security/logs/provenance.log + rotate
 *  per Step 2's backup policy. */
export type LogProvenance = (entry: ProvenanceLog) => void
