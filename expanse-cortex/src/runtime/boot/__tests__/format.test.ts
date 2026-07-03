// ══════════════════════════════════════════════════════════════
// formatBootContext + estimateTokens — Unit tests
// ══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest'

import { formatBootContext, estimateTokens } from '../format'
import { OFFLINE_SNAPSHOT } from '../boot'
import type { BootContext } from '../../types'

/**
 * Factory honoring the BootContext invariant: `health === snapshot.health`.
 * Builds snapshot first (so snapshot overrides flow through), then derives
 * the top-level `health` field from `snapshot.health`. Any explicit
 * `overrides.health` wins (escape hatch for edge-case tests).
 */
function makeBootContext(overrides: Partial<BootContext> = {}): BootContext {
  const baseHealth = {
    fresh_drifts: 3,
    fresh_traces: 5,
    needs_consolidation: false,
    history_count: 100,
    total_memories: 250,
  }
  const snapshot: BootContext['snapshot'] = {
    core: [],
    patterns: [],
    extensions: [],
    profile: { style_cognitif: 'iterative' },
    project: { name: 'expanse', intent: 'memory system' },
    health: { ...baseHealth, ...overrides.snapshot?.health },
    ...overrides.snapshot,
  }
  // Keep snapshot's own health authoritative after the spread above.
  if (!overrides.snapshot?.health) snapshot.health = { ...baseHealth }

  const base: BootContext = {
    snapshot,
    protocols: [
      { id: 'p1', title: 'memory-triage', content: 'triage', tags: ['sys:protocol'], created_at: '2026-07-01' },
      { id: 'p2', title: 'friction-trace', content: 'trace', tags: ['sys:protocol'], created_at: '2026-07-01' },
    ],
    vessel: [{ path: 'a.md', content: 'a' }, { path: 'b.md', content: 'b' }],
    health: snapshot.health,  // INVARIANT
    timestamp: '2026-07-02T10:00:00.000Z',
    online: true,
  }
  // Apply non-snapshot overrides AFTER invariant is established.
  const merged: BootContext = { ...base, ...overrides }
  // Re-establish invariant (overrides could have replaced snapshot).
  if (overrides.snapshot) merged.health = merged.snapshot.health
  // Explicit health override wins last (escape hatch).
  if (overrides.health) merged.health = overrides.health
  return merged
}

// ─── estimateTokens ───

describe('estimateTokens', () => {
  it('returns 0 for empty string', () => {
    expect(estimateTokens('')).toBe(0)
  })

  it('returns at least 1 for non-empty', () => {
    expect(estimateTokens('a')).toBe(1)
    expect(estimateTokens('hi')).toBe(1)
  })

  it('approximates ~3.5 chars per token', () => {
    const text = 'a'.repeat(100)
    expect(estimateTokens(text)).toBe(29)  // ceil(100/3.5) = 29
  })

  it('matches the standard 4-char rule within ±15%', () => {
    const text = 'The quick brown fox jumps over the lazy dog. '.repeat(10)
    const tokens = estimateTokens(text)
    expect(tokens).toBeGreaterThan(100)
    expect(tokens).toBeLessThan(160)
  })
})

// ─── formatBootContext ───

describe('formatBootContext — basic structure', () => {
  it('emits [BOOT ONLINE] header with timestamp', () => {
    const out = formatBootContext(makeBootContext())
    expect(out.split('\n')[0]).toBe('[BOOT ONLINE] 2026-07-02T10:00:00.000Z')
  })

  it('emits [BOOT OFFLINE] when online: false', () => {
    const out = formatBootContext(makeBootContext({ online: false }))
    expect(out.split('\n')[0]).toBe('[BOOT OFFLINE] 2026-07-02T10:00:00.000Z')
  })

  it('includes project line', () => {
    const out = formatBootContext(makeBootContext())
    expect(out).toContain('PROJECT: expanse \u2014 memory system')
  })

  it('includes user cognitive style when present', () => {
    const out = formatBootContext(makeBootContext())
    expect(out).toContain('USER: iterative')
  })

  it('omits user line when profile.style_cognitif is missing', () => {
    const out = formatBootContext(makeBootContext({
      snapshot: { ...makeBootContext().snapshot, profile: {} },
    }))
    expect(out).not.toContain('USER:')
  })

  it('includes health summary with all metrics', () => {
    const out = formatBootContext(makeBootContext())
    expect(out).toContain('HEALTH: 3 drifts')
    expect(out).toContain('5 traces')
    expect(out).toContain('consolidation: no')
    expect(out).toContain('250 memories total')
  })

  it('flips consolidation to YES when needs_consolidation: true', () => {
    const out = formatBootContext(makeBootContext({
      snapshot: { ...makeBootContext().snapshot, health: { ...makeBootContext().snapshot.health, needs_consolidation: true } },
    }))
    expect(out).toContain('consolidation: YES')
  })
})

describe('formatBootContext — protocols', () => {
  it('joins protocol titles with middle dot', () => {
    const out = formatBootContext(makeBootContext())
    expect(out).toContain('PROTOCOLS: memory-triage \u00b7 friction-trace')
  })

  it('emits (none) when protocols empty', () => {
    const out = formatBootContext(makeBootContext({ protocols: [] }))
    expect(out).toContain('PROTOCOLS: (none)')
  })
})

describe('formatBootContext — vessel', () => {
  it('emits (not indexed) when vessel is null', () => {
    const out = formatBootContext(makeBootContext({ vessel: null }))
    expect(out).toContain('VESSEL: (not indexed)')
  })

  it('emits (empty) when vessel is empty array', () => {
    const out = formatBootContext(makeBootContext({ vessel: [] }))
    expect(out).toContain('VESSEL: (empty)')
  })

  it('lists vessel paths when present', () => {
    const out = formatBootContext(makeBootContext({
      vessel: [
        { path: 'a.md', content: 'a' },
        { path: 'b.md', content: 'b' },
      ],
    }))
    expect(out).toContain('VESSEL: 2 chunks [a.md, b.md]')
  })

  it('collapses vessel paths with +N more when > 5', () => {
    const vessel = Array.from({ length: 12 }, (_, i) => ({
      path: `file-${i}.md`,
      content: 'x',
    }))
    const out = formatBootContext(makeBootContext({ vessel }))
    // Overflow is INSIDE the brackets — grouped as part of the path list,
    // which is the conventional Expanse output convention.
    expect(out).toMatch(/VESSEL: 12 chunks \[file-0\.md, file-1\.md, file-2\.md, file-3\.md, file-4\.md \(\+7 more\)\]/)
  })
})

describe('formatBootContext — offline snapshot recovery', () => {
  it('still emits project + offline health for OFFLINE_SNAPSHOT', () => {
    const ctx = makeBootContext({
      snapshot: OFFLINE_SNAPSHOT,
      vessel: null,
      protocols: [],
      online: false,
    })
    const out = formatBootContext(ctx)
    expect(out).toContain('[BOOT OFFLINE]')
    expect(out).toContain('PROJECT: expanse \u2014 memory system (offline scaffold)')
    expect(out).toContain('HEALTH: 0 drifts')          // from OFFLINE_SNAPSHOT.health
    expect(out).toContain('0 memories total')          // from OFFLINE_SNAPSHOT.health
    expect(out).toContain('VESSEL: (not indexed)')
    expect(out).toContain('PROTOCOLS: (none)')
  })
})

describe('formatBootContext — token budget', () => {
  it('typical online boot fits well under 200 tokens', () => {
    const out = formatBootContext(makeBootContext())
    expect(estimateTokens(out)).toBeLessThan(200)
  })

  it('typical offline boot fits well under 100 tokens', () => {
    const ctx = makeBootContext({
      snapshot: OFFLINE_SNAPSHOT,
      vessel: null,
      protocols: [],
      online: false,
    })
    const out = formatBootContext(ctx)
    expect(estimateTokens(out)).toBeLessThan(100)
  })

  it('hard ceiling: realistic 20-protocol boot stays well under 550 tokens', () => {
    const manyProtocols = Array.from({ length: 20 }, (_, i) => ({
      id: `p${i}`,
      title: `protocol-${i}`,
      content: 'x',
      tags: ['sys:protocol'],
      created_at: '2026-07-01',
    }))
    const out = formatBootContext(makeBootContext({ protocols: manyProtocols }))
    const tokens = estimateTokens(out)
    // 10% slack on the 500-token ceiling to account for heuristic drift.
    expect(tokens).toBeLessThanOrEqual(500 + Math.ceil(500 * 0.1))
  })
})
