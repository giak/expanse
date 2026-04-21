// ─── Timeline View ───
// Temporal view with horizontal axis, lanes by node type, event markers,
// and a zoom slider for exploring the time dimension.

import { useState, useEffect, useRef, useMemo } from 'react'
import { useAtomGraphData, useSetSelectedNode } from '../context/GraphContext'
import { computeNatureMap } from '../utils/computeNature'
import { groupNodesByType } from '../utils/groupNodes'
import { computeFullTimeRange } from '../utils/timeRange'
import type { JsonNode, MemoryNature } from '../types/expanse'
import { NODE_COLORS, DEFAULT_NODE_COLOR, NATURE_COLORS } from '../constants/theme'
import { TimelineAxis } from '../components/timeline/TimelineAxis'
import { TimelineLane } from '../components/timeline/TimelineLane'
import { TimelineSlider } from '../components/timeline/TimelineSlider'
import { TimelineReplayControls } from '../components/timeline/TimelineReplayControls'
import { useExportPNG, ExportButton } from '../components/svg/ExportPNG'
import { SvgDefs } from '../components/svg/SvgDefs'

// Lane order — most active/mutating types at top
const LANE_ORDER = [
  'MUTATION',
  'PATTERN',
  'DRIFT',
  'REGLE',
  'AXIOME',
  'COMMANDE',
  'PROTOCOLE',
  'OUTIL',
  'APEX',
  'FICHIER',
  'EXTENSION',
  'SUBSTRAT',
  'ORGAN',
]

const LANE_HEIGHT = 36
const HEADER_HEIGHT = 40
const SLIDER_HEIGHT = 24
const SLIDER_MARGIN = 20
const PADDING_TOP = 20
const PADDING_LEFT = 20

export function TimelineView() {
  const { data } = useAtomGraphData()
  const setSelectedNode = useSetSelectedNode()
  const svgRef = useRef<SVGSVGElement>(null)
  const { exportPNG } = useExportPNG({ svgRef, filename: 'expanse-timeline' })

  // React Compiler auto-memoizes pure computations
  const natures = data ? computeNatureMap(data.nodes) : new Map<string, MemoryNature>()
  const nodesByType = data ? groupNodesByType(data.nodes, (a, b) => a.sort_key - b.sort_key) : new Map<string, JsonNode[]>()

  const activeLanes = LANE_ORDER.filter(type => {
    const nodes = nodesByType.get(type)
    if (!nodes) return false
    return nodes.some(n => n.sort_key > 0)
  })

  // Must stay as useMemo — flows into useEffect deps for view range sync
  const fullTimeRange = useMemo(
    () => data ? computeFullTimeRange(data.nodes) : { min: 0, max: 1 },
    [data]
  )

  // View range (zoom state) — synced with fullTimeRange via useEffect
  const [viewRange, setViewRange] = useState({ min: 0, max: 1 })

  // Sync view range when data loads or changes
  useEffect(() => {
    if (data) setViewRange({ min: fullTimeRange.min, max: fullTimeRange.max })
  }, [data, fullTimeRange])

  const handleRangeChange = (min: number, max: number) => {
    setViewRange({ min, max })
  }

  const handleNodeSelect = (node: JsonNode) => {
    if (!data) return
    const color = NODE_COLORS[node.type] ?? DEFAULT_NODE_COLOR
    const nature = natures.get(node.id) ?? 'vivide'
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

  // Lane hover state
  const [hoveredLane, setHoveredLane] = useState<string | null>(null)

  // Layout dimensions
  const svgWidth = typeof window !== 'undefined' ? window.innerWidth : 1400
  const contentWidth = svgWidth - PADDING_LEFT * 2
  const axisY = PADDING_TOP + HEADER_HEIGHT
  const lanesStartY = axisY + 40 // space for axis ticks
  const totalLaneHeight = activeLanes.length * LANE_HEIGHT
  const sliderY = lanesStartY + totalLaneHeight + SLIDER_MARGIN

  if (!data) return null

  return (
    <div className="w-full h-full relative">
    <ExportButton onClick={exportPNG} />
    <svg ref={svgRef} className="w-full h-full app-bg">
      <SvgDefs />

      <g transform={`translate(${PADDING_LEFT}, 0)`}>
        {/* Header */}
        <text
          x={0} y={PADDING_TOP + 12}
          fill="var(--color-fg)" fontSize={14} fontFamily="monospace" fontWeight={600}
        >
          TIMELINE
        </text>
        <text
          x={80} y={PADDING_TOP + 12}
          fill="var(--color-overlay0)" fontSize={11} fontFamily="monospace"
        >
          {activeLanes.length} types · {data.nodes.filter(n => n.sort_key > 0).length} événements
        </text>

        {/* Nature color key in header */}
        {(['permanent', 'vivide', 'volatile', 'incandescent'] as MemoryNature[]).map((n, i) => (
          <g key={n} transform={`translate(${contentWidth - 400 + i * 95}, ${PADDING_TOP})`}>
            <circle r={4} fill={NATURE_COLORS[n]} cx={0} cy={8} />
            <text x={8} y={12} fill="var(--color-overlay0)" fontSize={8} fontFamily="monospace">
              {n.toUpperCase()}
            </text>
          </g>
        ))}

        {/* Axis */}
        <TimelineAxis
          minTime={viewRange.min}
          maxTime={viewRange.max}
          width={contentWidth}
          y={axisY}
        />

        {/* Lanes */}
        {activeLanes.map((type, idx) => {
          const nodes = nodesByType.get(type) ?? []
          const laneY = lanesStartY + idx * LANE_HEIGHT + LANE_HEIGHT / 2
          return (
            <TimelineLane
              key={type}
              type={type}
              nodes={nodes}
              natures={natures}
              minTime={viewRange.min}
              maxTime={viewRange.max}
              width={contentWidth}
              y={laneY}
              height={LANE_HEIGHT}
              onSelect={handleNodeSelect}
              isHovered={hoveredLane === type}
              onHoverChange={(h) => setHoveredLane(h ? type : null)}
            />
          )
        })}

        {/* Slider */}
        <TimelineSlider
          fullMin={fullTimeRange.min}
          fullMax={fullTimeRange.max}
          viewMin={viewRange.min}
          viewMax={viewRange.max}
          onRangeChange={handleRangeChange}
          width={contentWidth}
          y={sliderY}
          height={SLIDER_HEIGHT}
        />

        {/* Phase 3: Replay controls */}
        <TimelineReplayControls
          fullMin={fullTimeRange.min}
          fullMax={fullTimeRange.max}
          viewMin={viewRange.min}
          viewMax={viewRange.max}
          onRangeChange={handleRangeChange}
          x={0}
          y={sliderY + SLIDER_HEIGHT + 16}
        />
      </g>
    </svg>
    </div>
  )
}
