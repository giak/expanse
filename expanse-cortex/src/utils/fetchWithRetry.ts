// ══════════════════════════════════════════════════════════════
// FETCH WITH RETRY — Exponential backoff for network resilience
// ══════════════════════════════════════════════════════════════
// Pattern: Graceful Degradation + Stale-While-Revalidate
// If the fetch fails but cache exists, status = 'stale'.
// The app never dies from a network error alone.

export interface FetchWithRetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  retries?: number
  /** Base delay in ms for exponential backoff (default: 800ms) */
  baseDelay?: number
  /** Custom fetch function (for testing) */
  fetchFn?: typeof fetch
}

/**
 * Fetch with automatic retry and exponential backoff.
 *
 * Retries are only attempted for:
 * - Network errors (TypeError: fetch failed)
 * - HTTP 5xx (server errors)
 * - HTTP 429 (rate limited — respects Retry-After if present)
 *
 * HTTP 4xx (client errors) are NOT retried — they indicate a
 * permanent problem (404 = missing file, 403 = forbidden, etc.)
 * that retrying won't fix.
 */
export async function fetchWithRetry<T = unknown>(
  url: string,
  options: FetchWithRetryOptions = {},
): Promise<T> {
  const {
    retries = 3,
    baseDelay = 800,
    fetchFn = fetch,
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchFn(url)

      // Don't retry client errors (4xx) — they're permanent
      if (!res.ok && res.status >= 400 && res.status < 500) {
        throw new Error(`HTTP ${res.status}`)
      }

      // Retry server errors (5xx) and rate limits (429)
      if (!res.ok) {
        if (attempt >= retries) {
          throw new Error(`HTTP ${res.status}`)
        }

        // Compute delay: respect Retry-After for 429, else exponential backoff
        let delay = baseDelay * Math.pow(2, attempt)
        if (res.status === 429) {
          const retryAfter = res.headers.get('Retry-After')
          if (retryAfter) delay = parseInt(retryAfter, 10) * 1000
        }

        await sleep(delay)
        continue
      }

      return await res.json() as T
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))

      // Don't retry if we've exhausted attempts
      if (attempt >= retries) break

      // Only retry network errors (TypeError = fetch failure) with backoff.
      // Non-network errors (SyntaxError from bad JSON, etc.) won't fix themselves on retry.
      if (err instanceof TypeError) {
        await sleep(baseDelay * Math.pow(2, attempt))
      } else {
        // Non-network error (e.g. malformed JSON) — don't retry, fail immediately
        break
      }
    }
  }

  throw lastError ?? new Error(`Fetch failed after ${retries + 1} attempts: ${url}`)
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
