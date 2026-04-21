import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loadCachedGraph, cacheGraphData, getCachedGraphAge } from '../graphCache'
import type { GraphData } from '../../types/expanse'

// ─── Test fixtures ───

const SAMPLE_GRAPH: GraphData = {
  version: 5,
  generated_at: '2026-04-21T12:00:00Z',
  meta: { count_nodes: 8, count_edges: 12, density: 0.3 },
  nodes: [
    { id: 'Ω_SEAL_BREVITY', type: 'decision', label: 'Brevity', content: 'Short', tags: ['sys:core'], created_at: '2026-03-13', centrality: 0.9, nature: 'permanent', status: 'sealed', parent_organ: 'Ω', sort_key: 1, outcome: 1 },
  ],
  edges: [],
}

// ─── localStorage spy ───

let store: Record<string, string>

beforeEach(() => {
  store = {}
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => store[key] ?? null)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => { store[key] = value })
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => { delete store[key] })
})

// ─── loadCachedGraph ───

describe('loadCachedGraph', () => {
  it('returns null when no cache exists', () => {
    expect(loadCachedGraph()).toBeNull()
  })

  it('returns parsed GraphData when cache exists', () => {
    store['expanse-cortex:graph-data'] = JSON.stringify(SAMPLE_GRAPH)

    const result = loadCachedGraph()
    expect(result).toEqual(SAMPLE_GRAPH)
  })

  it('returns null and clears corrupted cache (invalid JSON)', () => {
    store['expanse-cortex:graph-data'] = '{not valid json'

    const result = loadCachedGraph()
    expect(result).toBeNull()
    // Corrupted entry should be removed
    expect(store['expanse-cortex:graph-data']).toBeUndefined()
  })

  it('returns null when localStorage throws (unavailable)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('The operation is insecure')
    })

    expect(loadCachedGraph()).toBeNull()
  })

  it('does not throw even when removeItem also fails after corruption', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('{bad')
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })

    // Should not throw — the catch block handles removeItem failure
    expect(loadCachedGraph()).toBeNull()
  })
})

// ─── cacheGraphData ───

describe('cacheGraphData', () => {
  it('saves data as JSON to localStorage', () => {
    cacheGraphData(SAMPLE_GRAPH)

    const stored = store['expanse-cortex:graph-data']
    expect(stored).toBeDefined()
    expect(JSON.parse(stored)).toEqual(SAMPLE_GRAPH)
  })

  it('saves timestamp alongside data', () => {
    const before = new Date()
    cacheGraphData(SAMPLE_GRAPH)
    const after = new Date()

    const ts = store['expanse-cortex:graph-timestamp']
    expect(ts).toBeDefined()
    const cachedDate = new Date(ts)
    expect(cachedDate.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(cachedDate.getTime()).toBeLessThanOrEqual(after.getTime())
  })

  it('overwrites previous cache on subsequent calls', () => {
    cacheGraphData(SAMPLE_GRAPH)
    const UPDATED: GraphData = { ...SAMPLE_GRAPH, generated_at: '2026-04-22T00:00:00Z' }
    cacheGraphData(UPDATED)

    const stored = JSON.parse(store['expanse-cortex:graph-data'])
    expect(stored.generated_at).toBe('2026-04-22T00:00:00Z')
  })

  it('does not throw when localStorage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    // Should silently fail — no throw
    expect(() => cacheGraphData(SAMPLE_GRAPH)).not.toThrow()
  })
})

// ─── getCachedGraphAge ───

describe('getCachedGraphAge', () => {
  it('returns null when no timestamp exists', () => {
    expect(getCachedGraphAge()).toBeNull()
  })

  it('returns "à l\'instant" for cache less than 1 minute old', () => {
    const now = new Date()
    store['expanse-cortex:graph-timestamp'] = now.toISOString()

    expect(getCachedGraphAge()).toBe("à l'instant")
  })

  it('returns "il y a X min" for cache a few minutes old', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60_000)
    store['expanse-cortex:graph-timestamp'] = fiveMinAgo.toISOString()

    expect(getCachedGraphAge()).toBe('il y a 5 min')
  })

  it('returns "il y a Xh" for cache a few hours old', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 3_600_000)
    store['expanse-cortex:graph-timestamp'] = twoHoursAgo.toISOString()

    expect(getCachedGraphAge()).toBe('il y a 2h')
  })

  it('returns "il y a Xj" for cache days old', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86_400_000)
    store['expanse-cortex:graph-timestamp'] = threeDaysAgo.toISOString()

    expect(getCachedGraphAge()).toBe('il y a 3j')
  })

  it('returns null when localStorage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })

    expect(getCachedGraphAge()).toBeNull()
  })

  it('returns null for unparsable timestamp', () => {
    store['expanse-cortex:graph-timestamp'] = 'not-a-date'

    // new Date('not-a-date') produces Invalid Date, getTime() returns NaN
    // All comparisons with NaN are false, so falls through to return null
    expect(getCachedGraphAge()).toBeNull()
  })
})
