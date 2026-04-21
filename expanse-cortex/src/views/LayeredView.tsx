import { useState, useEffect, useRef } from 'react'
import { useAtomGraphData } from '../context/GraphContext'
import { useCssZoom } from '../hooks/useSvgZoom'
import { useNodeMap } from '../hooks/useNodeMap'
import { NODE_COLORS, DEFAULT_NODE_COLOR } from '../constants/theme'
import { LAYERS, LAYER_COUNT, MAX_PER_COLUMN, COLUMN_WIDTH, NODE_SPACING, DEFAULT_LAYER } from '../constants/schema'
import { computeRadius } from '../utils/computeRadius'
import type { RenderNode } from '../types/expanse'
import { computeNodeMeta } from '../utils/computeNodeMeta'
import { NodeGfx } from '../components/svg/NodeGfx'
import { EdgeGfx } from '../components/svg/EdgeGfx'
import { useExportPNG, ExportButton } from '../components/svg/ExportPNG'
import { SvgDefs } from '../components/svg/SvgDefs'
import { ResetViewButton } from '../components/svg/ResetViewButton'

export function LayeredView() {
  const { data } = useAtomGraphData()
  const [nodes, setNodes] = useState<RenderNode[]>([])
  const { viewBox, centerX, centerY, isDragging, isClickingNode, handlers, fitToView, isZoomed, resetView } = useCssZoom()
  const svgRef = useRef<SVGSVGElement>(null)
  const { exportPNG } = useExportPNG({ svgRef, filename: 'expanse-couches' })
  const { getNode } = useNodeMap(nodes)

  useEffect(() => {
    if (!data) return

    const nodesByLayer: Record<number, RenderNode[]> = {}
    for (let i = 0; i < LAYER_COUNT; i++) nodesByLayer[i] = []

    data.nodes.forEach(node => {
      const layer = LAYERS[node.type] ?? DEFAULT_LAYER
      if (!nodesByLayer[layer]) nodesByLayer[layer] = []
      const color = NODE_COLORS[node.type] ?? DEFAULT_NODE_COLOR
      const radius = computeRadius(node.centrality)
      const meta = computeNodeMeta(node)
      nodesByLayer[layer].push({ ...node, x: 0, y: 0, color, radius, ...meta })
    })

    // Compute per-layer column counts
    const layerColumnCounts: Record<number, number> = {}
    for (let i = 0; i < LAYER_COUNT; i++) {
      const count = nodesByLayer[i]?.length ?? 0
      layerColumnCounts[i] = count === 0 ? 0 : Math.max(1, Math.ceil(count / MAX_PER_COLUMN))
    }

    // Compute cumulative x-offsets
    const layerXOffset: Record<number, number> = {}
    let xCursor = 100
    for (let i = 0; i < LAYER_COUNT; i++) {
      layerXOffset[i] = xCursor
      xCursor += layerColumnCounts[i] * COLUMN_WIDTH
    }

    // Position nodes
    const positioned: RenderNode[] = []
    Object.entries(nodesByLayer).forEach(([layer, layerNodes]) => {
      const layerIdx = parseInt(layer)
      if (layerColumnCounts[layerIdx] === 0) return
      layerNodes.forEach((node, idx) => {
        const col = Math.floor(idx / MAX_PER_COLUMN)
        const row = idx % MAX_PER_COLUMN
        positioned.push({
          ...node,
          x: layerXOffset[layerIdx] + col * COLUMN_WIDTH,
          y: 100 + row * NODE_SPACING,
        })
      })
    })

    setNodes(positioned)
    fitToView(positioned)
  }, [data, fitToView])

  return (
    <div className="w-full h-full relative">
    <ExportButton onClick={exportPNG} />
    <ResetViewButton isZoomed={isZoomed} resetView={resetView} />
    <svg
      ref={svgRef}
      className={`w-full h-full ${isZoomed ? 'cursor-grab' : 'cursor-default'}`}
      onClick={() => {}}
      {...handlers}
    >
      <SvgDefs />

      <g transform={`translate(${centerX}, ${centerY}) scale(${viewBox.scale})`}>
        {/* Edges */}
        {data?.edges.map((edge, idx) => {
          const source = getNode(edge.source)
          const target = getNode(edge.target)
          if (!source || !target) return null
          return <EdgeGfx key={idx} source={source} target={target} type={edge.type} weight={edge.weight} idx={idx} />
        })}

        {/* Nodes */}
        {nodes.map(node => (
          <NodeGfx key={node.id} node={node} isDragging={isDragging} isClickingNode={isClickingNode} focusable={node.type === 'ORGAN' || node.type === 'APEX'} />
        ))}
      </g>
    </svg>
    </div>
  )
}
