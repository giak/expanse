import { useState, useEffect } from 'react'
import type { GraphData } from '../types/expanse'
import { fetchWithRetry } from '../utils/fetchWithRetry'
import { loadCachedGraph, cacheGraphData } from '../utils/graphCache'
import { validateGraphData, formatWarnings } from '../utils/validateGraphData'
import { logger } from '../utils/logger'

export type GraphDataStatus = 'idle' | 'loading' | 'ok' | 'stale' | 'error'

export interface UseGraphDataReturn {
  data: GraphData | null
  error: string | null
  status: GraphDataStatus
}

export function useGraphData(): UseGraphDataReturn {
  const [data, setData] = useState<GraphData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<GraphDataStatus>('idle')

  useEffect(() => {
    // 1. Load from cache immediately if available (stale-while-revalidate)
    const cached = loadCachedGraph()
    if (cached) {
      setData(cached)
      setStatus('stale')
    } else {
      setStatus('loading')
    }

    // 2. Revalidate in background with retry
    fetchWithRetry<GraphData>('/graph/expanse-graph.json', { retries: 3, baseDelay: 800 })
      .then(d => {
        // Validate incoming JSON using sealed type guards
        const { data: validated, warnings } = validateGraphData(d)
        if (warnings.length > 0) {
          logger.warn('Graph data warnings:\n' + formatWarnings(warnings))
        }
        setData(validated)
        cacheGraphData(validated)
        setError(null)
        setStatus('ok')
      })
      .catch(err => {
        logger.error('Failed to load graph:', err)
        setError(err.message)
        // If we have cached data, status = stale (still usable)
        // If no cache, status = error (app must handle)
        setStatus(cached ? 'stale' : 'error')
      })
  }, [])

  return { data, error, status }
}
