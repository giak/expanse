// ══════════════════════════════════════════════════════════════
// assertBootHealthy — Pure validator for assembled BootContext
//
// Enforces the boot invariants called out by the audit (§8.3 + §3.1):
//   - Snapshot has a project anchor with non-empty intent
//   - Core axioms loaded when the server is online
//   - Protocols are loaded when online (or pre-cached offline)
//   - Serialized format stays under the 500-token cap
//
// Pure function: no I/O, no logging. Caller decides what to do
// with `valid: false` (warn, halt, retry, etc.).
// ══════════════════════════════════════════════════════════════

import type { BootContext, ValidationResult } from '../types'
import { estimateTokens } from './format'

export interface BootHealthOptions {
  /** Hard cap for the serialized prompt block. Default 500. */
  maxFormatTokens?: number
  /** When true (default), require at least one protocol. */
  requireProtocols?: boolean
  /** When true (default), require core axioms when online. */
  requireCore?: boolean
}

/**
 * Validate a boot snapshot + its serialised form.
 *
 * Disagreements between ONLINE state and the underlying call results
 * (e.g. online: true but vessel: null because indexWorkspace timed out)
 * are NOT failures here — the boot is functional. Surface that
 * separately via SystemSnapshot.health.
 */
export function assertBootHealthy(
  ctx: BootContext,
  formatted: string,
  opts: BootHealthOptions = {},
): ValidationResult {
  const maxFormatTokens = opts.maxFormatTokens ?? 500
  const requireProtocols = opts.requireProtocols ?? true
  const requireCore = opts.requireCore ?? true

  if (!ctx.snapshot.project) {
    return { valid: false, reason: 'snapshot.project is missing' }
  }
  if (!ctx.snapshot.project.intent?.trim()) {
    return { valid: false, reason: 'snapshot.project.intent is empty' }
  }
  if (requireCore && ctx.online && ctx.snapshot.core.length === 0) {
    return { valid: false, reason: 'no axioms loaded (core empty) from ONLINE server' }
  }
  if (requireProtocols && ctx.protocols.length === 0) {
    return {
      valid: false,
      reason: ctx.online
        ? 'no protocols loaded from an ONLINE server'
        : 'no protocols loaded AND Mnemolite is offline (cold cache)',
    }
  }

  const tokens = estimateTokens(formatted)
  if (tokens > maxFormatTokens) {
    return {
      valid: false,
      reason: `format exceeded token budget: ${tokens} > ${maxFormatTokens}`,
      pattern: 'TOKEN_BUDGET',
    }
  }

  return { valid: true }
}
