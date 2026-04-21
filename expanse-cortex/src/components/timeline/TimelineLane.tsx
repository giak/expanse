// ─── Timeline Lane ───
// A horizontal lane for a single node type, containing its label and event markers.

import type { JsonNode, MemoryNature } from '../../types/expanse'
import { NODE_COLORS, DEFAULT_NODE_COLOR } from '../../constants/theme'
import { TimelineEventMarker } from './TimelineEventMarker'

interface TimelineLaneProps {
  /** Node type this lane represents */
  type: string
  /** Nodes belonging to this type, sorted by sort_key */
  nodes: JsonNode[]
  /** Computed natures for each node (indexed by node id) */
  natures: Map<string, MemoryNature>
  /** Leftmost timestamp (unix ms) */
  minTime: number
  /** Rightmost timestamp (unix ms) */
  maxTime: number
  /** Pixel width of the timeline content area */
  width: number
  /** Y position of this lane's center line */
  y: number
  /** Height of the lane */
  height: number
  /** Callback when a node is selected */
  onSelect: (node: JsonNode) => void
  /** Whether this lane is currently hovered */
  isHovered: boolean
  onHoverChange: (hovered: boolean) => void
}

const LANE_LABEL_WIDTH = 90

export function TimelineLane({
  type,
  nodes,
  natures,
  minTime,
  maxTime,
  width,
  y,
  height,
  onSelect,
  isHovered,
  onHoverChange,
}: TimelineLaneProps) {
  const range = maxTime - minTime || 1
  const color = NODE_COLORS[type] ?? DEFAULT_NODE_COLOR
  const contentWidth = width - LANE_LABEL_WIDTH

  const toX = (ts: number) => LANE_LABEL_WIDTH + ((ts - minTime) / range) * contentWidth

  return (
    <g
      className="timeline-lane"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {/* Lane background — subtle highlight on hover */}
      <rect
        x={0} y={y - height / 2}
        width={width} height={height}
        fill={isHovered ? '#181825' : 'transparent'}
        opacity={isHovered ? 0.6 : 0}
        rx={2}
      />

      {/* Separator line */}
      <line
        x1={LANE_LABEL_WIDTH} y1={y - height / 2}
        x2={LANE_LABEL_WIDTH} y2={y + height / 2}
        stroke="var(--color-surface0)" strokeWidth={0.5}
      />

      {/* Lane label */}
      <text
        x={LANE_LABEL_WIDTH - 8}
        y={y + 3}
        fill={color}
        fontSize={9}
        textAnchor="end"
        fontFamily="monospace"
        fontWeight={isHovered ? 600 : 400}
        opacity={isHovered ? 1 : 0.7}
      >
        {type}
      </text>

      {/* Count badge */}
      <text
        x={LANE_LABEL_WIDTH - 8}
        y={y + 13}
        fill="var(--color-overlay0)"
        fontSize={7}
        textAnchor="end"
        fontFamily="monospace"
      >
        {nodes.length}
      </text>

      {/* Event markers */}
      {nodes.map(node => {
        const ts = node.sort_key * 1000 // sort_key is unix seconds, we need ms
        if (ts <= 0) return null // skip nodes without valid timestamps
        const x = toX(ts)
        if (x < LANE_LABEL_WIDTH || x > width) return null
        const nature = natures.get(node.id) ?? 'vivide'
        return (
          <TimelineEventMarker
            key={node.id}
            node={node}
            x={x}
            y={y}
            nature={nature}
            onSelect={onSelect}
          />
        )
      })}
    </g>
  )
}
