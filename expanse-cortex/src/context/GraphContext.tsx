import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import type { GraphData, RenderNode } from '../types/expanse'
import { computeProximityMap } from '../utils/proximityBFS'

// ══════════════════════════════════════════════════════════════
// GRAPH CONTEXT — replaces jotai atoms with React Context
// ══════════════════════════════════════════════════════════════
// Split into two contexts to preserve jotai's re-render granularity:
//   GraphDataContext    — data + error (changes rarely, on fetch)
//   GraphInteractionCtx — activeNode, selectedNode, proximityMap (changes on hover)
// Views that only read data (8 views) won't re-render on hover.

// ── Data context (changes rarely: fetch → cache) ──

interface GraphDataState {
  data: GraphData | null
  error: string | null
  setData: (data: GraphData | null) => void
  setError: (error: string | null) => void
}

const GraphDataCtx = createContext<GraphDataState | null>(null)

// ── Interaction context (changes frequently: hover, click) ──

interface GraphInteractionState {
  activeNode: string | null
  selectedNode: RenderNode | null
  proximityMap: Map<string, number> | null
  setActiveNode: (id: string | null) => void
  setSelectedNode: (node: RenderNode | null) => void
}

const GraphInteractionCtx = createContext<GraphInteractionState | null>(null)

// ── Provider ──

export function GraphProvider({ children }: { children: ReactNode }) {
  // Data slice (rare updates)
  const [data, setData] = useState<GraphData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Interaction slice (frequent updates on hover/click)
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<RenderNode | null>(null)

  // Derived: BFS proximity map from activeNode — recomputes only when activeNode or data changes
  const proximityMap = useMemo(
    () => (activeNode && data ? computeProximityMap(activeNode, data.edges) : null),
    [activeNode, data],
  )

  // Memoize context values to avoid unnecessary re-renders
  const dataValue = useMemo<GraphDataState>(
    () => ({ data, error, setData, setError }),
    [data, error],
  )
  const interactionValue = useMemo<GraphInteractionState>(
    () => ({ activeNode, selectedNode, proximityMap, setActiveNode, setSelectedNode }),
    [activeNode, selectedNode, proximityMap],
  )

  return (
    <GraphDataCtx.Provider value={dataValue}>
      <GraphInteractionCtx.Provider value={interactionValue}>
        {children}
      </GraphInteractionCtx.Provider>
    </GraphDataCtx.Provider>
  )
}

// ══════════════════════════════════════════════════════════════
// Selector hooks — each component picks only what it needs
// (same API as the former graphAtoms.ts)
// ══════════════════════════════════════════════════════════════

function useDataCtx() {
  const ctx = useContext(GraphDataCtx)
  if (!ctx) throw new Error('useDataCtx must be used within <GraphProvider>')
  return ctx
}

function useInteractionCtx() {
  const ctx = useContext(GraphInteractionCtx)
  if (!ctx) throw new Error('useInteractionCtx must be used within <GraphProvider>')
  return ctx
}

/** Read graph data + error (for views that render the graph structure).
 *  NOT the same as hooks/useGraphData (which fetches from API).
 *  Rename avoids collision with the fetch hook. */
export function useAtomGraphData() {
  const { data, error } = useDataCtx()
  return { data, error }
}

/** Read + write activeNode (hover). Only the hovered node + its proximity zone re-render. */
export function useActiveNode() {
  const { activeNode, setActiveNode } = useInteractionCtx()
  return [activeNode, setActiveNode] as const
}

/** Read + write selectedNode (click). Only the inspector panel + the selected node re-render. */
export function useSelectedNode() {
  const { selectedNode, setSelectedNode } = useInteractionCtx()
  return [selectedNode, setSelectedNode] as const
}

/** Read proximityMap (derived from activeNode). Re-renders only when proximity changes. */
export function useProximityMap() {
  const { proximityMap } = useInteractionCtx()
  return proximityMap
}

/** Set activeNode imperatively (for route change cleanup, etc.) */
export function useSetActiveNode() {
  const { setActiveNode } = useInteractionCtx()
  return setActiveNode
}

/** Set selectedNode imperatively */
export function useSetSelectedNode() {
  const { setSelectedNode } = useInteractionCtx()
  return setSelectedNode
}

/** Read activeNode + proximityMap in one hook (common pattern for node/edge rendering) */
export function useProximity() {
  const { activeNode, proximityMap } = useInteractionCtx()
  return { activeNode, proximityMap }
}

/** Set graph data imperatively (for App.tsx sync from useGraphData fetch hook) */
export function useSetGraphData() {
  const { setData } = useDataCtx()
  return setData
}

/** Set graph error imperatively (for App.tsx sync from useGraphData fetch hook) */
export function useSetGraphError() {
  const { setError } = useDataCtx()
  return setError
}
