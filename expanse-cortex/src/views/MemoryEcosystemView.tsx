// ─── Memory Ecosystem View ───
// Concentric layout by Mnemolite nature with MCP tools at center.
// Four zones from inside-out: PERMANENT → VIVIDE → VOLATILE → INCANDESCENT.
// Tag root links show semantic connections across zones.

import { useState, useEffect, useRef } from 'react'
import { useAtomGraphData, useProximity, useSetSelectedNode } from '../context/GraphContext'
import { useCssZoom } from '../hooks/useSvgZoom'
import { computeNatureMap } from '../utils/computeNature'
import { spiralPosition } from '../utils/spiralLayout'
import {
  NATURE_ORDER,
  ZONE_RADII,
  groupNodesByNature,
  computeNodePositions,
  computeTagLinks,
} from '../utils/memoryLayout'
import type { JsonNode, MemoryNature } from '../types/expanse'
import { NODE_COLORS, DEFAULT_NODE_COLOR } from '../constants/theme'
import { NatureZone } from '../components/memory/NatureZone'
import { MCPToolNode } from '../components/memory/MCPToolNode'
import { TagRootLink } from '../components/memory/TagRootLink'
import { useExportPNG, ExportButton } from '../components/svg/ExportPNG'
import { SvgDefs } from '../components/svg/SvgDefs'
import { ResetViewButton } from '../components/svg/ResetViewButton'
import { edgeHopToOpacity } from '../utils/proximityBFS'

export function MemoryEcosystemView() {
  const { data } = useAtomGraphData()
  const { activeNode, proximityMap } = useProximity()
  const setSelectedNode = useSetSelectedNode()
  const { viewBox, centerX, centerY, isDragging, isClickingNode, handlers, fitToView, isZoomed, resetView } = useCssZoom()
  const svgRef = useRef<SVGSVGElement>(null)
  const { exportPNG } = useExportPNG({ svgRef, filename: 'expanse-memoire' })

  // React Compiler auto-memoizes pure computations
  const natureMap = data ? computeNatureMap(data.nodes) : new Map<string, MemoryNature>()

  const outilNodes = data ? data.nodes.filter(n => n.type === 'OUTIL') : []

  const nonOutilNodes = data ? data.nodes.filter(n => n.type !== 'OUTIL') : []

  // React Compiler auto-memoizes pure computations
  const nodesByNature = groupNodesByNature(nonOutilNodes, natureMap)

  const outilPositions = outilNodes.map((node, idx) => {
    const pos = spiralPosition(idx, outilNodes.length, 0, ZONE_RADII.mcpCenter, node.id)
    return { node, x: pos.x, y: pos.y }
  })

  const nodePositions = computeNodePositions(outilPositions, nodesByNature, centerX, centerY)

  const tagLinks = data ? computeTagLinks(data.nodes, nodePositions) : []

  // Highlighted tag (on hover over a tag link)
  const [highlightedTag, setHighlightedTag] = useState<string | null>(null)

  const handleNodeSelect = (node: JsonNode) => {
    const color = NODE_COLORS[node.type] ?? DEFAULT_NODE_COLOR
    const nature = natureMap.get(node.id) ?? 'vivide'
    setSelectedNode({
      ...node,
      x: 0, y: 0,
      color,
      radius: 8,
      matterState: 'cristal',
      curtain: null,
      nature,
    })
  }

  // Fit to view on first load
  useEffect(() => {
    if (data) {
      fitToView([{ x: centerX, y: centerY, radius: 520 }])
    }
  }, [data, centerX, centerY, fitToView])

  if (!data) return null

  return (
    <div className="w-full h-full relative">
    <ExportButton onClick={exportPNG} />
    <ResetViewButton isZoomed={isZoomed} resetView={resetView} />
    <svg
      ref={svgRef}
      className={`w-full h-full ${isZoomed ? 'cursor-grab' : 'cursor-default'}`}
      onClick={() => { if (!isDragging.current && !isClickingNode.current) setSelectedNode(null) }}
      {...handlers}
    >
      <SvgDefs />

      <g transform={`translate(${centerX}, ${centerY}) scale(${viewBox.scale})`}>
        {/* Header */}
        <text
          x={-centerX + 20} y={-centerY + 30}
          fill="var(--color-fg)" fontSize={14} fontFamily="monospace" fontWeight={600}
        >
          ÉCOSYSTÈME MÉMOIRE
        </text>
        <text
          x={-centerX + 20} y={-centerY + 46}
          fill="var(--color-overlay0)" fontSize={10} fontFamily="monospace"
        >
          {nonOutilNodes.length} nœuds · {outilNodes.length} outils · {tagLinks.length} liens tag
        </text>

        {/* Tag root links (rendered first = behind everything) */}
        {tagLinks.map((link, idx) => {
          // Graduated proximity opacity for tag links based on endpoint node BFS hops
          const tagOpacity = activeNode
            ? edgeHopToOpacity(proximityMap?.get(link.sourceId), proximityMap?.get(link.targetId))
            : undefined
          return (
            <g
              key={idx}
              onMouseEnter={() => setHighlightedTag(link.tag)}
              onMouseLeave={() => setHighlightedTag(null)}
              style={{ cursor: 'crosshair' }}
            >
              <TagRootLink
                x1={link.x1 - centerX} y1={link.y1 - centerY}
                x2={link.x2 - centerX} y2={link.y2 - centerY}
                tag={link.tag}
                highlighted={highlightedTag === link.tag}
                opacity={tagOpacity}
              />
            </g>
          )
        })}

        {/* Nature zones (concentric, permanent=innermost) */}
        {NATURE_ORDER.map(nature => (
          <NatureZone
            key={nature}
            nature={nature}
            nodes={nodesByNature.get(nature) ?? []}
            innerRadius={ZONE_RADII[`${nature}Inner` as keyof typeof ZONE_RADII]}
            outerRadius={ZONE_RADII[`${nature}Outer` as keyof typeof ZONE_RADII]}
            centerX={0}
            centerY={0}
            onSelect={handleNodeSelect}
          />
        ))}

        {/* MCP Tool cluster at center */}
        {outilPositions.map(op => (
          <MCPToolNode
            key={op.node.id}
            node={op.node}
            x={op.x}
            y={op.y}
            connections={
              // Find connected nodes via edges for filaments
              data.edges
                .filter(e => e.source === op.node.id || e.target === op.node.id)
                .map(e => {
                  const targetId = e.source === op.node.id ? e.target : e.source
                  const pos = nodePositions.get(targetId)
                  return pos ? { x: pos.x - centerX, y: pos.y - centerY } : { x: 0, y: 0 }
                })
                .filter(p => p.x !== 0 || p.y !== 0)
            }
            onSelect={handleNodeSelect}
          />
        ))}

        {/* Center label */}
        <text
          x={0} y={-ZONE_RADII.mcpCenter - 10}
          fill="var(--color-mauve)" fontSize={9} fontFamily="monospace" fontWeight={600}
          textAnchor="middle" opacity={0.5}
        >
          OUTILS MCP
        </text>

        {/* Highlighted tag label */}
        {highlightedTag && (
          <text
            x={0} y={ZONE_RADII.incandescentOuter + 20}
            fill="var(--color-blue)" fontSize={10} fontFamily="monospace"
            textAnchor="middle" opacity={0.8}
          >
            tag:{highlightedTag}
          </text>
        )}
      </g>
    </svg>
    </div>
  )
}
