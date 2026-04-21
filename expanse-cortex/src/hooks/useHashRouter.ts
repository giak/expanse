import { useState, useEffect } from 'react'

export type Route = 'heart' | 'layered' | 'organic' | 'pipeline' | 'dashboard' | 'timeline' | 'memory' | 'signal'

const ROUTE_MAP: Record<string, Route> = {
  '#/heart': 'heart',
  '#/layered': 'layered',
  '#/organic': 'organic',
  '#/pipeline': 'pipeline',
  '#/dashboard': 'dashboard',
  '#/timeline': 'timeline',
  '#/memory': 'memory',
  '#/signal': 'signal',
}

const DEFAULT_ROUTE: Route = 'heart'

/** Strip query params from hash before route matching.
 *  e.g. "#/signal?scenario=boot" → "#/signal" */
function hashToRoute(hash: string): Route {
  const path = hash.split('?')[0]
  return ROUTE_MAP[path] ?? DEFAULT_ROUTE
}

export function useHashRouter() {
  const [route, setRoute] = useState<Route>(() => {
    return hashToRoute(window.location.hash)
  })

  useEffect(() => {
    const onHashChange = () => {
      setRoute(hashToRoute(window.location.hash))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (r: Route) => {
    // eslint-disable-next-line react-compiler/react-compiler -- setting window.location.hash is a browser navigation API, not React state
    window.location.hash = `#/${r}`
  }

  return { route, navigate }
}
