// ══════════════════════════════════════════════════════════════
// GRAPH CACHE — Stale-While-Revalidate persistence
// ══════════════════════════════════════════════════════════════
// Stores the last successfully fetched graph in localStorage.
// If the next fetch fails, the cached version is used as fallback
// (status = 'stale'). The app never shows "Erreur: HTTP 404"
// if it has previously loaded data.

import type { GraphData } from '../types/expanse'

const CACHE_KEY = 'expanse-cortex:graph-data'
const CACHE_TIMESTAMP_KEY = 'expanse-cortex:graph-timestamp'

/**
 * Load cached GraphData from localStorage.
 * Returns null if no cache exists or if the cache is corrupted.
 */
export function loadCachedGraph(): GraphData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as GraphData
  } catch {
    // Corrupted cache — clear it
    try { localStorage.removeItem(CACHE_KEY) } catch { /* storage unavailable */ }
    return null
  }
}

/**
 * Save GraphData to localStorage for future stale-while-revalidate.
 * Silently fails if localStorage is unavailable (private browsing, quota, etc.)
 */
export function cacheGraphData(data: GraphData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString())
  } catch {
    // localStorage unavailable or quota exceeded — non-critical
  }
}

/**
 * Get the timestamp when the cache was last written.
 * Useful for displaying "Data from 2 min ago" in the stale badge.
 */
export function getCachedGraphAge(): string | null {
  try {
    const ts = localStorage.getItem(CACHE_TIMESTAMP_KEY)
    if (!ts) return null

    const cached = new Date(ts)
    const now = new Date()
    const diffMs = now.getTime() - cached.getTime()

    // Guard against NaN from Invalid Date (unparsable timestamp)
    if (!Number.isFinite(diffMs)) return null

    if (diffMs < 60_000) return 'à l\'instant'
    if (diffMs < 3_600_000) return `il y a ${Math.floor(diffMs / 60_000)} min`
    if (diffMs < 86_400_000) return `il y a ${Math.floor(diffMs / 3_600_000)}h`
    return `il y a ${Math.floor(diffMs / 86_400_000)}j`
  } catch {
    return null
  }
}
