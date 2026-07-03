// ══════════════════════════════════════════════════════════════
// formatBootContext — Serialize a BootContext for LLM injection
//
// Target: ~200 tokens, well under the 500-token assertion ceiling.
// Inline format that prioritizes signal density: status, project,
// user, health, protocols, vessel.
//
// Token counting: heuristic (1 token ≈ 3.5 chars) — see `estimateTokens`.
// This is intentionally cheap (no LLM, no dictionary); for production
// telemetry swap to tiktoken in a sibling module.
// ══════════════════════════════════════════════════════════════

import type { BootContext } from '../types'

/**
 * Heuristic token estimator. ~3.5 chars per token is a robust mid-point
 * between Anthropic (3.5), OpenAI (4), and code-heavy docs (3).
 *
 * Returns 0 for empty input, otherwise at least 1.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0
  return Math.max(1, Math.ceil(text.length / 3.5))
}

/** Max vessel paths to inline before collapsing to "+N more". */
const VESSEL_PATH_LIMIT = 5

/** Strip embedded newlines so a protocol title or vessel path can't break the multi-line format. */
const oneLine = (s: string): string => s.replace(/[\r\n]+/g, ' ').trim()

/**
 * Format a BootContext to a compact, LLM-friendly text block.
 *
 *   [BOOT ONLINE] 2026-07-02T10:00:00Z
 *   PROJECT: expanse — memory system
 *   USER: iterative
 *   HEALTH: 3 drifts | 5 traces | consolidation: no | 250 memories total
 *   PROTOCOLS: triage · friction-trace · consolidation
 *   VESSEL: 12 chunks [a.md, b.md, ...] (+7 more)
 */
export function formatBootContext(ctx: BootContext): string {
  const lines: string[] = []

  lines.push(`[BOOT ${ctx.online ? 'ONLINE' : 'OFFLINE'}] ${ctx.timestamp}`)

  if (ctx.snapshot.project) {
    lines.push(
      `PROJECT: ${ctx.snapshot.project.name} \u2014 ${ctx.snapshot.project.intent}`,
    )
  }

  const style = ctx.snapshot.profile?.style_cognitif
  if (style) lines.push(`USER: ${style}`)

  lines.push(
    `HEALTH: ${ctx.health.fresh_drifts} drifts | ` +
      `${ctx.health.fresh_traces} traces | ` +
      `consolidation: ${ctx.health.needs_consolidation ? 'YES' : 'no'} | ` +
      `${ctx.health.total_memories} memories total`,
  )

  if (ctx.protocols.length) {
    lines.push(`PROTOCOLS: ${ctx.protocols.map(p => oneLine(p.title)).join(' \u00b7 ')}`)
  } else {
    lines.push('PROTOCOLS: (none)')
  }

  if (ctx.vessel !== null) {
    if (ctx.vessel.length === 0) {
      lines.push('VESSEL: (empty)')
    } else {
      const paths = ctx.vessel.map(v => oneLine(v.path)).slice(0, VESSEL_PATH_LIMIT).join(', ')
      const overflow = ctx.vessel.length > VESSEL_PATH_LIMIT
        ? ` (+${ctx.vessel.length - VESSEL_PATH_LIMIT} more)`
        : ''
      lines.push(`VESSEL: ${ctx.vessel.length} chunks [${paths}${overflow}]`)
    }
  } else {
    lines.push('VESSEL: (not indexed)')
  }

  return lines.join('\n')
}
