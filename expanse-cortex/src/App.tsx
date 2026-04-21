import { useEffect, lazy, Suspense } from 'react'
import { useGraphData } from './hooks/useGraphData'
import { useHashRouter } from './hooks/useHashRouter'
import {
  useSetGraphData,
  useSetGraphError,
  useSetActiveNode,
  useSetSelectedNode,
} from './context/GraphContext'
import { getCachedGraphAge } from './utils/graphCache'
import { TopNav } from './components/layout/TopNav'
import { MetricsPanel } from './components/hud/MetricsPanel'
import { LegendPanel } from './components/hud/LegendPanel'
import { InspectorPanel } from './components/hud/InspectorPanel'
import { ViewErrorBoundary } from './components/errors/ErrorBoundaries'

// ─── Lazy-loaded views ───
// Only one view renders at a time; the other 7 stay out of the initial bundle.
const CognitiveHeartView = lazy(() => import('./views/heart').then(m => ({ default: m.CognitiveHeartView })))
const LayeredView = lazy(() => import('./views/LayeredView').then(m => ({ default: m.LayeredView })))
const OrganicView = lazy(() => import('./views/OrganicView').then(m => ({ default: m.OrganicView })))
const PipelineView = lazy(() => import('./views/PipelineView').then(m => ({ default: m.PipelineView })))
const DashboardView = lazy(() => import('./views/DashboardView').then(m => ({ default: m.DashboardView })))
const TimelineView = lazy(() => import('./views/TimelineView').then(m => ({ default: m.TimelineView })))
const MemoryEcosystemView = lazy(() => import('./views/MemoryEcosystemView').then(m => ({ default: m.MemoryEcosystemView })))
const SignalView = lazy(() => import('./views/SignalView').then(m => ({ default: m.SignalView })))

function App() {
  const { data, error, status } = useGraphData()
  const { route, navigate } = useHashRouter()

  // ── Sync graph data into context (replaces jotai atoms) ──
  const setData = useSetGraphData()
  const setError = useSetGraphError()
  const setActiveNode = useSetActiveNode()
  const setSelectedNode = useSetSelectedNode()

  useEffect(() => { setData(data) }, [data, setData])
  useEffect(() => { setError(error) }, [error, setError])

  // Clear activeNode on route change to avoid stale dimming state
  useEffect(() => { setActiveNode(null); setSelectedNode(null) }, [route, setActiveNode, setSelectedNode])

  if (status === 'error' && !data) {
    return (
      <div className="w-screen h-screen bg-app-bg flex items-center justify-center">
        <div className="text-red text-sm">Erreur: {error}</div>
      </div>
    )
  }

  return (
      <div className="w-screen h-screen bg-app-bg">
        {/* View content */}
        <Suspense fallback={(
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue animate-pulse" />
          </div>
        )}>
          {route === 'heart' && <ViewErrorBoundary><CognitiveHeartView /></ViewErrorBoundary>}
          {route === 'layered' && <ViewErrorBoundary><LayeredView /></ViewErrorBoundary>}
          {route === 'organic' && <ViewErrorBoundary><OrganicView /></ViewErrorBoundary>}
          {route === 'pipeline' && <ViewErrorBoundary><PipelineView /></ViewErrorBoundary>}
          {route === 'dashboard' && <ViewErrorBoundary><DashboardView /></ViewErrorBoundary>}
          {route === 'timeline' && <ViewErrorBoundary><TimelineView /></ViewErrorBoundary>}
          {route === 'memory' && <ViewErrorBoundary><MemoryEcosystemView /></ViewErrorBoundary>}
          {route === 'signal' && <ViewErrorBoundary><SignalView /></ViewErrorBoundary>}
        </Suspense>

        {/* Shared chrome */}
        <TopNav route={route} navigate={navigate} />

        {/* HUD: Title */}
        <div className="fixed top-6 left-6 z-10 hud">
          <h1 className="text-fg text-lg font-semibold mb-2">Σ→Ψ⇌Φ→Ω→Μ</h1>
          <p className="text-fg text-sm mb-1 opacity-90">EXPANSE V16 — CARTOGRAPHIE</p>
          <p className="text-overlay0 text-xs opacity-70">
            Click noeud pour inspecter • Molette zoom • Drag pan
          </p>
        </div>

        {/* HUD: Metrics + Legend + Inspector (hidden on dashboard/timeline) */}
        {route !== 'dashboard' && route !== 'timeline' && route !== 'memory' && route !== 'signal' && (
          <>
            <MetricsPanel />
            <LegendPanel />
          </>
        )}
        <InspectorPanel />

        {/* Stale data badge — shown when using cached graph data */}
        {status === 'stale' && (
          <div className="fixed top-6 right-6 z-20 px-3 py-1.5 rounded-md bg-yellow/10 border border-yellow/20 text-yellow text-xs font-mono backdrop-blur-md">
            DONNÉES EN CACHE {getCachedGraphAge() ?? ''}
          </div>
        )}
      </div>
  )
}

export default App
