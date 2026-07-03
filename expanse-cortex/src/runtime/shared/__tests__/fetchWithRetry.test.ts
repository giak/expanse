import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchWithRetry } from '../fetchWithRetry'

// ─── Mock fetch ───

function mockResponse(opts: { ok: boolean; status: number; json?: unknown; headers?: Record<string, string> }): Response {
  const { ok, status, json, headers = {} } = opts
  return {
    ok,
    status,
    headers: new Headers(headers),
    json: () => Promise.resolve(json),
  } as Response
}

function networkError(): never {
  throw new TypeError('Failed to fetch')
}

// ─── Helpers ───

let mockFetch: ReturnType<typeof vi.fn>

beforeEach(() => {
  mockFetch = vi.fn()
})

// Cast helper — mockFetch isn't a real fetch but conforms closely enough
const asFetch = () => mockFetch as typeof fetch

// ─── Tests ───

describe('fetchWithRetry', () => {
  it('returns parsed JSON on successful first attempt', async () => {
    const data = { nodes: [], edges: [] }
    mockFetch.mockResolvedValueOnce(mockResponse({ ok: true, status: 200, json: data }))

    const result = await fetchWithRetry('/graph.json', { fetchFn: asFetch(), baseDelay: 1 })
    expect(result).toEqual(data)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('retries on 5xx server error and succeeds on second attempt', async () => {
    const data = { ok: true }
    mockFetch
      .mockResolvedValueOnce(mockResponse({ ok: false, status: 500 }))
      .mockResolvedValueOnce(mockResponse({ ok: true, status: 200, json: data }))

    const result = await fetchWithRetry('/graph.json', { fetchFn: asFetch(), retries: 2, baseDelay: 1 })
    expect(result).toEqual(data)
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('retries on 5xx with exponential backoff', async () => {
    mockFetch
      .mockResolvedValueOnce(mockResponse({ ok: false, status: 503 }))
      .mockResolvedValueOnce(mockResponse({ ok: false, status: 502 }))
      .mockResolvedValueOnce(mockResponse({ ok: true, status: 200, json: { done: true } }))

    // baseDelay=100 → attempt 0: 100*2^0=100, attempt 1: 100*2^1=200
    const result = await fetchWithRetry('/graph.json', { fetchFn: asFetch(), retries: 2, baseDelay: 100 })
    expect(result).toEqual({ done: true })
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  it('does NOT retry on 4xx client errors — throws immediately', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ ok: false, status: 404 }))

    await expect(
      fetchWithRetry('/graph.json', { fetchFn: asFetch(), retries: 3, baseDelay: 1 }),
    ).rejects.toThrow('HTTP 404')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('does NOT retry on 403 forbidden', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ ok: false, status: 403 }))

    await expect(
      fetchWithRetry('/graph.json', { fetchFn: asFetch(), retries: 3, baseDelay: 1 }),
    ).rejects.toThrow('HTTP 403')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('does NOT retry on 429 (treated as 4xx client error)', async () => {
    // 429 is in the 4xx range, so fetchWithRetry throws immediately
    // without retrying — consistent with the "4xx = permanent" rule.
    mockFetch.mockResolvedValueOnce(mockResponse({
      ok: false,
      status: 429,
      headers: { 'Retry-After': '5' },
    }))

    await expect(
      fetchWithRetry('/graph.json', { fetchFn: asFetch(), retries: 3, baseDelay: 1 }),
    ).rejects.toThrow('HTTP 429')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('retries on network TypeError and succeeds', async () => {
    const data = { recovered: true }
    mockFetch
      .mockImplementationOnce(networkError)
      .mockResolvedValueOnce(mockResponse({ ok: true, status: 200, json: data }))

    const result = await fetchWithRetry('/graph.json', { fetchFn: asFetch(), retries: 2, baseDelay: 1 })
    expect(result).toEqual(data)
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('does NOT retry on non-network errors (e.g. SyntaxError)', async () => {
    mockFetch.mockImplementationOnce(() => {
      throw new SyntaxError('Unexpected token')
    })

    await expect(
      fetchWithRetry('/graph.json', { fetchFn: asFetch(), retries: 3, baseDelay: 1 }),
    ).rejects.toThrow(SyntaxError)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('throws after exhausting all retries on persistent 5xx', async () => {
    mockFetch.mockResolvedValue(mockResponse({ ok: false, status: 500 }))

    await expect(
      fetchWithRetry('/graph.json', { fetchFn: asFetch(), retries: 2, baseDelay: 1 }),
    ).rejects.toThrow('HTTP 500')
    // attempt 0 (initial) + attempt 1 + attempt 2 = 3 calls
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  it('throws after exhausting retries on persistent network errors', async () => {
    mockFetch.mockImplementation(networkError)

    await expect(
      fetchWithRetry('/graph.json', { fetchFn: asFetch(), retries: 2, baseDelay: 1 }),
    ).rejects.toThrow('Failed to fetch')
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  it('preserves original network error message when all retries fail', async () => {
    mockFetch.mockImplementation(networkError)

    await expect(
      fetchWithRetry('/graph.json', { fetchFn: asFetch(), retries: 0, baseDelay: 1 }),
    ).rejects.toThrow('Failed to fetch')
  })

  it('uses default options when none provided', async () => {
    const data = { defaults: true }
    mockFetch.mockResolvedValueOnce(mockResponse({ ok: true, status: 200, json: data }))

    const result = await fetchWithRetry('/graph.json', { fetchFn: asFetch() })
    expect(result).toEqual(data)
  })
})
