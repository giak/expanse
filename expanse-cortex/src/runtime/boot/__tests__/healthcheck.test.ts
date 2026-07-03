// ══════════════════════════════════════════════════════════════
// assertBootHealthy — Unit tests
// ══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest'

import { assertBootHealthy } from '../healthcheck'
import { formatBootContext } from '../format'
import { makeOfflineBootContext } from '../boot'
import type { BootContext } from '../../types'

/**
 * Factory honoring the BootContext invariant: `health === snapshot.health`.
 * Same pattern as format.test.ts; mirrors snapshot overrides through to top-level.
 */
function makeBoot(overrides: Partial<BootContext> = {}): BootContext {
  const baseHealth = {
    fresh_drifts: 0,
    fresh_traces: 0,
    needs_consolidation: false,
    history_count: 0,
    total_memories: 0,
  }
  const snapshot: BootContext['snapshot'] = {
    core: [{ id: 'c1', title: 'Axiom 1', content: 'x', tags: ['sys:core'], created_at: '2026-07-01' }],
    patterns: [],
    extensions: [],
    profile: null,
    project: { name: 'expanse', intent: 'memory system' },
    health: { ...baseHealth, ...overrides.snapshot?.health },
    ...overrides.snapshot,
  }
  if (!overrides.snapshot?.health) snapshot.health = { ...baseHealth }

  const base: BootContext = {
    snapshot,
    protocols: [
      { id: 'p1', title: 'memory-triage', content: 't', tags: ['sys:protocol'], created_at: '2026-07-01' },
    ],
    vessel: null,
    health: snapshot.health,
    timestamp: '2026-07-02T10:00:00.000Z',
    online: true,
  }
  const merged: BootContext = { ...base, ...overrides }
  if (overrides.snapshot) merged.health = merged.snapshot.health
  if (overrides.health) merged.health = overrides.health
  return merged
}

describe('assertBootHealthy — happy path', () => {
  it('returns valid: true for typical online boot', () => {
    const ctx = makeBoot()
    const formatted = formatBootContext(ctx)
    const res = assertBootHealthy(ctx, formatted)
    expect(res.valid).toBe(true)
    expect(res.reason).toBeUndefined()
  })

  it('BootContext invariant: ctx.health is the same reference as ctx.snapshot.health', () => {
    const ctx = makeBoot()
    expect(ctx.health).toBe(ctx.snapshot.health)
  })
})

describe('assertBootHealthy — missing project', () => {
  it('fails when snapshot.project is null', () => {
    const ctx = makeBoot({
      snapshot: { ...makeBoot().snapshot, project: null },
    })
    const res = assertBootHealthy(ctx, formatBootContext(ctx))
    expect(res.valid).toBe(false)
    expect(res.reason).toMatch(/project/)
  })

  it('fails when snapshot.project.intent is empty', () => {
    const ctx = makeBoot({
      snapshot: { ...makeBoot().snapshot, project: { name: 'expanse', intent: '   ' } },
    })
    const res = assertBootHealthy(ctx, formatBootContext(ctx))
    expect(res.valid).toBe(false)
    expect(res.reason).toMatch(/intent/)
  })
})

describe('assertBootHealthy — empty core axioms (audit §3.1)', () => {
  it('fails when online but core is empty', () => {
    const ctx = makeBoot({ online: true })
    ctx.snapshot.core = []
    const res = assertBootHealthy(ctx, formatBootContext(ctx))
    expect(res.valid).toBe(false)
    expect(res.reason).toMatch(/core/)
  })

  it('passes when offline even with empty core (best-effort)', () => {
    const ctx = makeBoot({ online: false })
    ctx.snapshot.core = []
    const res = assertBootHealthy(ctx, formatBootContext(ctx), { requireProtocols: false })
    expect(res.valid).toBe(true)
  })

  it('passes when requireCore is false', () => {
    const ctx = makeBoot({ online: true })
    ctx.snapshot.core = []
    const res = assertBootHealthy(ctx, formatBootContext(ctx), { requireCore: false })
    expect(res.valid).toBe(true)
  })
})

describe('assertBootHealthy — no protocols', () => {
  it('fails when online and protocols empty', () => {
    const ctx = makeBoot({ protocols: [], online: true })
    const res = assertBootHealthy(ctx, formatBootContext(ctx))
    expect(res.valid).toBe(false)
    expect(res.reason).toMatch(/ONLINE/)
  })

  it('fails when offline and protocols empty (cold cache)', () => {
    const ctx = makeBoot({ protocols: [], online: false })
    const res = assertBootHealthy(ctx, formatBootContext(ctx))
    expect(res.valid).toBe(false)
    expect(res.reason).toMatch(/offline/i)
  })

  it('passes when requireProtocols is false', () => {
    const ctx = makeBoot({ protocols: [], online: true })
    const res = assertBootHealthy(ctx, formatBootContext(ctx), { requireProtocols: false })
    expect(res.valid).toBe(true)
  })
})

describe('assertBootHealthy — format token budget', () => {
  it('passes under default 500-token ceiling', () => {
    const ctx = makeBoot()
    const formatted = formatBootContext(ctx)
    const res = assertBootHealthy(ctx, formatted)
    expect(res.valid).toBe(true)
  })

  it('fails when formatted string is artificially too long', () => {
    const ctx = makeBoot()
    const padded = formatBootContext(ctx) + '\n' + 'x'.repeat(2_000)
    const res = assertBootHealthy(ctx, padded)
    expect(res.valid).toBe(false)
    expect(res.reason).toMatch(/token budget/i)
    expect(res.pattern).toBe('TOKEN_BUDGET')
  })

  it('respects custom maxFormatTokens', () => {
    const ctx = makeBoot()
    const padded = formatBootContext(ctx) + '\n' + 'y'.repeat(500)
    const res = assertBootHealthy(ctx, padded, { maxFormatTokens: 50 })
    expect(res.valid).toBe(false)
    expect(res.reason).toMatch(/50/)
  })
})

describe('assertBootHealthy — offline snapshot tolerated', () => {
  it('warm offline cache with seeded protocols passes', () => {
    const ctx = makeOfflineBootContext({
      protocols: [
        { id: 'p1', title: 'memory-triage', content: 't', tags: ['sys:protocol'], created_at: '2026-07-01' },
      ],
    })
    // OFFLINE_SNAPSHOT has empty core but online=false → requireCore skipped.
    expect(ctx.online).toBe(false)
    const res = assertBootHealthy(ctx, formatBootContext(ctx))
    expect(res.valid).toBe(true)
  })
})
