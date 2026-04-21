import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGraphData } from '../useGraphData'
import type { GraphData } from '../../types/expanse'

// ─── Mocks ───
// vi.hoisted() ensures mock functions exist before vi.mock() factories run
// (vitest hoists vi.mock calls above const declarations)

const { mockLoadCachedGraph, mockCacheGraphData } = vi.hoisted(() => ({
  mockLoadCachedGraph: vi.fn(),
  mockCacheGraphData: vi.fn(),
}))

vi.mock('../../utils/fetchWithRetry', () => ({
  fetchWithRetry: vi.fn(),
}))

vi.mock('../../utils/graphCache', () => ({
  loadCachedGraph: mockLoadCachedGraph,
  cacheGraphData: mockCacheGraphData,
}))

vi.mock('../../utils/logger', () => ({
  logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn(), debug: vi.fn() },
}))

// ─── Test fixtures ───

const VALID_GRAPH: GraphData = {
  version: 5,
  generated_at: '2026-04-21T12:00:00Z',
  meta: {
    count_nodes: 8,
    count_edges: 12,
    density: 0.3,
  },
  nodes: [
    { id: 'Ω_SEAL_BREVITY', type: 'decision', label: 'Brevity', content: 'Short responses', tags: ['sys:core'], created_at: '2026-03-13', centrality: 0.9, nature: 'permanent', status: 'sealed', parent_organ: 'Ω', sort_key: 1, outcome: 1 },
  ],
  edges: [
    { source: 'Ω_SEAL_BREVITY', target: 'V14_CORE_AXIOMS', type: 'support', weight: 0.8, condition: null },
  ],
}

const FRESH_GRAPH: GraphData = { ...VALID_GRAPH, generated_at: '2026-04-21T14:00:00Z' }

// ─── Import mocked fetchWithRetry ───

import { fetchWithRetry } from '../../utils/fetchWithRetry'
const mockFetchWithRetry = vi.mocked(fetchWithRetry)

// ─── Helper: deferred fetch ───
// Creates a fetch that won't resolve until we call resolve(), so we can
// observe intermediate states (stale, loading) before the fetch completes.

function deferredFetch() {
  let resolve!: (value: unknown) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise((res, rej) => { resolve = res; reject = rej })
  return { promise, resolve, reject }
}

// ─── Tests ───

describe('useGraphData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLoadCachedGraph.mockReturnValue(null)
    mockCacheGraphData.mockReturnValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ─── Stale-While-Revalidate: cache exists ───

  it('immediately sets data + status=stale when cache exists', async () => {
    mockLoadCachedGraph.mockReturnValue(VALID_GRAPH)
    // Use deferred fetch so we can observe the stale state before revalidation completes
    const { promise } = deferredFetch()
    mockFetchWithRetry.mockReturnValue(promise as Promise<unknown>)

    const { result } = renderHook(() => useGraphData())

    await waitFor(() => expect(result.current.status).toBe('stale'))
    expect(result.current.data).toEqual(VALID_GRAPH)
    expect(result.current.error).toBeNull()
  })

  it('revalidates in background when cache exists, then updates data + status=ok', async () => {
    mockLoadCachedGraph.mockReturnValue(VALID_GRAPH)
    // Deferred fetch: we control when it resolves
    const { promise, resolve } = deferredFetch()
    mockFetchWithRetry.mockReturnValue(promise as Promise<unknown>)

    const { result } = renderHook(() => useGraphData())

    // First: stale from cache
    await waitFor(() => expect(result.current.status).toBe('stale'))
    expect(result.current.data).toEqual(VALID_GRAPH)

    // Now resolve the fetch with fresh data
    resolve(FRESH_GRAPH)

    // Then: ok from fresh fetch
    await waitFor(() => expect(result.current.status).toBe('ok'))
    expect(result.current.data).toEqual(FRESH_GRAPH)
    expect(result.current.error).toBeNull()
  })

  it('caches fresh data after successful revalidation', async () => {
    mockLoadCachedGraph.mockReturnValue(VALID_GRAPH)
    mockFetchWithRetry.mockResolvedValue(FRESH_GRAPH)

    renderHook(() => useGraphData())

    await waitFor(() => expect(mockCacheGraphData).toHaveBeenCalledWith(FRESH_GRAPH))
  })

  // ─── No cache: loading path ───

  it('sets status=loading when no cache exists', async () => {
    // Deferred fetch so we can observe loading state
    const { promise } = deferredFetch()
    mockFetchWithRetry.mockReturnValue(promise as Promise<unknown>)

    const { result } = renderHook(() => useGraphData())

    await waitFor(() => expect(result.current.status).toBe('loading'))
  })

  it('transitions from loading→ok on successful fetch without cache', async () => {
    mockFetchWithRetry.mockResolvedValue(VALID_GRAPH)

    const { result } = renderHook(() => useGraphData())

    await waitFor(() => expect(result.current.status).toBe('ok'))
    expect(result.current.data).toEqual(VALID_GRAPH)
    expect(result.current.error).toBeNull()
    expect(mockCacheGraphData).toHaveBeenCalledWith(VALID_GRAPH)
  })

  // ─── Error handling: fetch fails with cache ───

  it('keeps status=stale and sets error when fetch fails but cache exists', async () => {
    mockLoadCachedGraph.mockReturnValue(VALID_GRAPH)
    // Deferred fetch: observe stale first, then reject
    const { promise, reject } = deferredFetch()
    mockFetchWithRetry.mockReturnValue(promise as Promise<unknown>)

    const { result } = renderHook(() => useGraphData())

    await waitFor(() => expect(result.current.status).toBe('stale'))

    // Reject the fetch
    reject(new Error('Network timeout'))

    // After fetch fails: still stale (cache is still usable)
    await waitFor(() => expect(result.current.error).toBe('Network timeout'))
    expect(result.current.status).toBe('stale')
    expect(result.current.data).toEqual(VALID_GRAPH)
  })

  // ─── Error handling: fetch fails without cache ───

  it('sets status=error when fetch fails and no cache exists', async () => {
    mockFetchWithRetry.mockRejectedValue(new Error('HTTP 500'))

    const { result } = renderHook(() => useGraphData())

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('HTTP 500')
  })

  // ─── Validation ───

  it('passes validated data even when validation warnings exist', async () => {
    const rawDataWithWarnings = {
      version: 5,
      generated_at: '2026-04-21T12:00:00Z',
      meta: { count_nodes: 1, count_edges: 0, density: 0 },
      nodes: [
        { id: '', type: '', label: 'bad', content: '', tags: [], created_at: '', centrality: 0, nature: '', status: null, parent_organ: 'INVALID', sort_key: 0, outcome: null },
      ],
      edges: [],
    }

    mockFetchWithRetry.mockResolvedValue(rawDataWithWarnings)

    const { result } = renderHook(() => useGraphData())

    await waitFor(() => expect(result.current.status).toBe('ok'))
    // Data is still set (best-effort validation, not rejection)
    expect(result.current.data).toBeTruthy()
  })

  // ─── Effect runs once ───

  it('fetches exactly once on mount (no re-fetch on re-render)', async () => {
    mockFetchWithRetry.mockResolvedValue(VALID_GRAPH)

    const { result, rerender } = renderHook(() => useGraphData())

    await waitFor(() => expect(result.current.status).toBe('ok'))
    const callCount = mockFetchWithRetry.mock.calls.length

    rerender()

    // Should not trigger another fetch
    expect(mockFetchWithRetry.mock.calls.length).toBe(callCount)
  })

  // ─── Corrupted cache ───

  it('treats corrupted cache as no-cache (loadCachedGraph returns null)', async () => {
    // graphCache.loadCachedGraph handles corruption internally (returns null)
    mockFetchWithRetry.mockResolvedValue(VALID_GRAPH)

    const { result } = renderHook(() => useGraphData())

    await waitFor(() => expect(result.current.status).toBe('ok'))
    expect(result.current.data).toEqual(VALID_GRAPH)
  })

  // ─── Full lifecycle ───

  it('transitions stale → ok when cache + fetch succeed', async () => {
    mockLoadCachedGraph.mockReturnValue(VALID_GRAPH)
    mockFetchWithRetry.mockResolvedValue(FRESH_GRAPH)

    const { result } = renderHook(() => useGraphData())

    await waitFor(() => expect(result.current.status).toBe('ok'))
    expect(result.current.data).toEqual(FRESH_GRAPH)
    expect(result.current.error).toBeNull()
  })

  it('transitions loading → ok when no cache + fetch succeeds', async () => {
    mockFetchWithRetry.mockResolvedValue(VALID_GRAPH)

    const { result } = renderHook(() => useGraphData())

    await waitFor(() => expect(result.current.status).toBe('ok'))
    expect(result.current.data).toEqual(VALID_GRAPH)
    expect(result.current.error).toBeNull()
  })

  it('transitions loading → error when no cache + fetch fails', async () => {
    mockFetchWithRetry.mockRejectedValue(new Error('ECONNREFUSED'))

    const { result } = renderHook(() => useGraphData())

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('ECONNREFUSED')
  })
})
