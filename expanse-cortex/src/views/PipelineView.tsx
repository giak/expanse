import { useState, useEffect, useRef } from 'react'
import { useAtomGraphData } from '../context/GraphContext'
import { useCssZoom } from '../hooks/useSvgZoom'
import { useNodeMap } from '../hooks/useNodeMap'
import { NODE_COLORS, DEFAULT_NODE_COLOR, ORGAN_ORDER, ORGAN_COLORS } from '../constants/theme'
import { computeRadius } from '../utils/computeRadius'
import type { RenderNode } from '../types/expanse'
import { computeNodeMeta } from '../utils/computeNodeMeta'
import { NodeGfx } from '../components/svg/NodeGfx'
import { EdgeGfx } from '../components/svg/EdgeGfx'
import { useExportPNG, ExportButton } from '../components/svg/ExportPNG'
import { SvgDefs } from '../components/svg/SvgDefs'
import { ResetViewButton } from '../components/svg/ResetViewButton'

// Map each node type to its parent organ
const ORGAN_MAP: Record<string, string> = {
  ORGAN: 'Σ',
  APEX: 'Σ',
  AXIOME: 'Ψ',
  COMMANDE: 'Ψ',
  REGLE: 'Ψ',
  PROTOCOLE: 'Ψ',
  OUTIL: 'Φ',
  FICHIER: 'Φ',
  MUTATION: 'Φ',
  PATTERN: 'Ω',
  EXTENSION: 'Ω',
  MEMOIRE: 'Μ',
  SUBSTRAT: 'Μ',
  DRIFT: 'Μ',
}

const ORGAN_X: Record<string, number> = {
  'Σ': -800,
  'Ψ': -400,
  'Φ': 0,
  'Ω': 400,
  'Μ': 800,
}

const ORGAN_SPACING_Y = 70

export function PipelineView() {
  const { data } = useAtomGraphData()
  const [nodes, setNodes] = useState<RenderNode[]>([])
  const { viewBox, centerX, centerY, isDragging, isClickingNode, handlers, fitToView, isZoomed, resetView } = useCssZoom()
  const svgRef = useRef<SVGSVGElement>(null)
  const { exportPNG } = useExportPNG({ svgRef, filename: 'expanse-pipeline' })
  const { getNode } = useNodeMap(nodes)

  useEffect(() => {
    if (!data) return

    // Find ORGAN nodes for pipeline headers
    const organNodes = data.nodes.filter(n => n.type === 'ORGAN')
    const organBySymbol = new Map(organNodes.map(n => [n.label.charAt(0), n]))

    // Group non-ORGAN nodes by their parent organ
    const nodesByOrgan: Record<string, RenderNode[]> = {}
    ORGAN_ORDER.forEach(o => { nodesByOrgan[o] = [] })

    data.nodes
      .filter(n => n.type !== 'ORGAN')
      .forEach(node => {
        const organ = ORGAN_MAP[node.type] ?? 'Φ'
        if (!nodesByOrgan[organ]) nodesByOrgan[organ] = []
        const color = NODE_COLORS[node.type] ?? DEFAULT_NODE_COLOR
        const radius = computeRadius(node.centrality)
        const meta = computeNodeMeta(node)
        nodesByOrgan[organ].push({ ...node, x: 0, y: 0, color, radius, ...meta })
      })

    // Position organ nodes as large headers
    const positioned: RenderNode[] = []
    ORGAN_ORDER.forEach(symbol => {
      const organNode = organBySymbol.get(symbol)
      if (organNode) {
        positioned.push({
          ...organNode,
          x: ORGAN_X[symbol],
          y: -50,
          color: ORGAN_COLORS[symbol] ?? NODE_COLORS.ORGAN,
          radius: 28,
          matterState: 'cristal',
          curtain: null,
          nature: 'permanent',
        })
      }
    })

    // Position child nodes vertically under each organ
    ORGAN_ORDER.forEach(symbol => {
      const children = nodesByOrgan[symbol] ?? []
      children.forEach((node, childIdx) => {
        positioned.push({
          ...node,
          x: ORGAN_X[symbol] + (childIdx % 2 === 0 ? -60 : 60),
          y: 100 + Math.floor(childIdx / 2) * ORGAN_SPACING_Y,
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
    <svg ref={svgRef} className={`w-full h-full ${isZoomed ? 'cursor-grab' : 'cursor-default'}`} onClick={() => {}} {...handlers}>
      <SvgDefs />

      {/* Pipeline flow arrows between organs */}
      <g transform={`translate(${centerX}, ${centerY}) scale(${viewBox.scale})`}>
        {ORGAN_ORDER.slice(0, -1).map((symbol, organIdx) => {
          const next = ORGAN_ORDER[organIdx + 1]
          const x1 = ORGAN_X[symbol] + 40
          const x2 = ORGAN_X[next] - 40
          return (
            <g key={organIdx}>
              <line x1={x1} y1={-50} x2={x2} y2={-50}
                stroke={ORGAN_COLORS[next]} strokeWidth={3} opacity={0.4}
                strokeDasharray="8 4" />
              <text x={(x1 + x2) / 2} y={-65} textAnchor="middle"
                fill="var(--color-overlay0)" fontSize={10} fontFamily="'JetBrains Mono', monospace" opacity={0.5}>
                →
              </text>
            </g>
          )
        })}

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
