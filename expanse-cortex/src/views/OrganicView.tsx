import { useState, useEffect, useRef } from 'react'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
} from 'd3-force'
import { useAtomGraphData } from '../context/GraphContext'
import { useCssZoom } from '../hooks/useSvgZoom'
import { useNodeMap } from '../hooks/useNodeMap'
import { NODE_COLORS, DEFAULT_NODE_COLOR } from '../constants/theme'
import { CLUSTER_X, CLUSTER_Y, DEFAULT_CLUSTER_X, DEFAULT_CLUSTER_Y, CLUSTER_STRENGTH_X, CLUSTER_STRENGTH_Y } from '../constants/schema'
import { computeRadius } from '../utils/computeRadius'
import type { RenderNode, SimNode, SimLink } from '../types/expanse'
import { computeNodeMeta } from '../utils/computeNodeMeta'
import { NodeGfx } from '../components/svg/NodeGfx'
import { EdgeGfx } from '../components/svg/EdgeGfx'
import { useExportPNG, ExportButton } from '../components/svg/ExportPNG'
import { SvgDefs } from '../components/svg/SvgDefs'
import { ResetViewButton } from '../components/svg/ResetViewButton'

export function OrganicView() {
  const { data } = useAtomGraphData()
  const [nodes, setNodes] = useState<RenderNode[]>([])
  const { viewBox, centerX, centerY, isDragging, isClickingNode, handlers, fitToView, isZoomed, resetView } = useCssZoom()
  const svgRef = useRef<SVGSVGElement>(null)
  const { exportPNG } = useExportPNG({ svgRef, filename: 'expanse-organique' })
  const { getNode } = useNodeMap(nodes)

  useEffect(() => {
    if (!data) return

    const simNodes: SimNode[] = data.nodes.map(node => {
      const cx = CLUSTER_X[node.type] ?? DEFAULT_CLUSTER_X
      const cy = CLUSTER_Y[node.type] ?? DEFAULT_CLUSTER_Y
      return {
        ...node,
        x: cx + (Math.random() - 0.5) * 100,
        y: cy + (Math.random() - 0.5) * 100,
        color: NODE_COLORS[node.type] ?? DEFAULT_NODE_COLOR,
        radius: computeRadius(node.centrality),
      }
    })

    const nodeIndex = new Map(simNodes.map((n, i) => [n.id, i]))
    const simLinks: SimLink[] = data.edges.reduce<SimLink[]>((acc, edge) => {
      const si = nodeIndex.get(edge.source)
      const ti = nodeIndex.get(edge.target)
      if (si !== undefined && ti !== undefined) {
        acc.push({ source: si, target: ti, weight: edge.weight, type: edge.type })
      }
      return acc
    }, [])

    const simulation = forceSimulation<SimNode>(simNodes)
      .force('link', forceLink<SimNode, SimLink>(simLinks)
        .distance(d => 80 + (1 - d.weight) * 120)
        .strength(0.4))
      .force('charge', forceManyBody<SimNode>()
        .strength(d => -120 - d.centrality * 10)
        .distanceMax(500))
      .force('center', forceCenter<SimNode>(0, 0).strength(0.05))
      .force('collide', forceCollide<SimNode>()
        .radius(d => d.radius + 4)
        .strength(0.8))
      .force('clusterX', forceX<SimNode>(d => CLUSTER_X[d.type] ?? DEFAULT_CLUSTER_X)
        .strength(CLUSTER_STRENGTH_X))
      .force('clusterY', forceY<SimNode>(d => CLUSTER_Y[d.type] ?? DEFAULT_CLUSTER_Y)
        .strength(CLUSTER_STRENGTH_Y))
      .alphaDecay(0.03)
      .velocityDecay(0.3)

    simulation.stop()
    for (let i = 0; i < 200; i++) simulation.tick()
    simulation.alpha(0)

    const positioned: RenderNode[] = simNodes.map(n => {
      return {
        ...n,
        ...computeNodeMeta(n),
      }
    })

    setNodes(positioned)
    fitToView(positioned)
  }, [data, fitToView])

  return (
    <div className="w-full h-full relative">
    <ExportButton onClick={exportPNG} />
    <ResetViewButton isZoomed={isZoomed} resetView={resetView} />
    <svg ref={svgRef} className={`w-full h-full ${isZoomed ? 'cursor-grab' : 'cursor-default'}`} onClick={() => {}} {...handlers}>
      <SvgDefs />

      <g transform={`translate(${centerX}, ${centerY}) scale(${viewBox.scale})`}>
        {data?.edges.map((edge, idx) => {
          const source = getNode(edge.source)
          const target = getNode(edge.target)
          if (!source || !target) return null
          return <EdgeGfx key={idx} source={source} target={target} type={edge.type} weight={edge.weight} idx={idx} />
        })}
        {nodes.map(node => (
          <NodeGfx key={node.id} node={node} isDragging={isDragging} isClickingNode={isClickingNode} focusable={node.type === 'ORGAN' || node.type === 'APEX'} />
        ))}
      </g>
    </svg>
    </div>
  )
}
