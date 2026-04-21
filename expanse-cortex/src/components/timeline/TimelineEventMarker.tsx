// ─── Timeline Event Marker ───
// A single event dot on the timeline, colored by node type with nature-based glow.

import { useState } from 'react'
import type { JsonNode } from '../../types/expanse'
import { NODE_COLORS, DEFAULT_NODE_COLOR, NATURE_COLORS } from '../../constants/theme'
import type { MemoryNature } from '../../types/expanse'
import { useProximity, useSetActiveNode } from '../../context/GraphContext'
import { hopToProximityStyle } from '../../utils/proximityBFS'

interface TimelineEventMarkerProps {
  node: JsonNode
  x: number
  y: number
  nature: MemoryNature
  onSelect: (node: JsonNode) => void
}

const MARKER_RADIUS = 5

export function TimelineEventMarker({ node, x, y, nature, onSelect }: TimelineEventMarkerProps) {
  const [hovered, setHovered] = useState(false)
  const { activeNode, proximityMap } = useProximity()
  const setActiveNode = useSetActiveNode()
  const color = NODE_COLORS[node.type] ?? DEFAULT_NODE_COLOR
  const natureColor = NATURE_COLORS[nature] ?? 'transparent'
  // Combo proximity: opacity + scale (fisheye) + blur (depth-of-field)
  const { opacity: groupOpacity, scale, blur } = activeNode
    ? hopToProximityStyle(proximityMap?.get(node.id))
    : { opacity: 1, scale: 1, blur: 0 }

  // Mutation status overrides
  const isRejected = node.status === 'rejected'
  const isRolledBack = node.status === 'rolled_back'
  const isApplied = node.status === 'applied'

  return (
    <g transform={`translate(${x}, ${y})`}>
    <g
      className="timeline-event-marker"
      onMouseEnter={() => { setHovered(true); setActiveNode(node.id) }}
      onMouseLeave={() => { setHovered(false); setActiveNode(null) }}
      onClick={() => onSelect(node)}
      style={{ cursor: 'pointer', opacity: groupOpacity, transform: `scale(${scale})`, transformOrigin: '0 0', filter: blur > 0 ? `blur(${blur}px)` : 'none', transition: 'opacity 0.15s ease, transform 0.2s ease, filter 0.2s ease' }}
    >
      {/* Nature aura glow */}
      <circle
        r={MARKER_RADIUS + 4}
        fill="none"
        stroke={natureColor}
        strokeWidth={1.5}
        opacity={0.4}
      />

      {/* Main dot */}
      <circle
        r={MARKER_RADIUS}
        fill={isRejected ? 'var(--color-red)' : isRolledBack ? 'var(--color-peach)' : color}
        opacity={isRejected ? 0.4 : isRolledBack ? 0.5 : isApplied ? 1 : 0.8}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={0.5}
      />

      {/* Hover highlight */}
      {hovered && (
        <>
          <circle
            r={MARKER_RADIUS + 6}
            fill={color}
            opacity={0.15}
            filter="url(#glow)"
          />
          {/* Tooltip */}
          <g transform={`translate(0, -${MARKER_RADIUS + 14})`}>
            <rect
              x={-80} y={-10} width={160} height={32}
              rx={4}
              fill="var(--color-base)" stroke="var(--color-surface1)" strokeWidth={0.5}
              opacity={0.95}
            />
            <text
              x={0} y={2}
              fill="var(--color-fg)"
              fontSize={9}
              textAnchor="middle"
              fontFamily="monospace"
            >
              {node.label.length > 24 ? node.label.slice(0, 22) + '…' : node.label}
            </text>
            <text
              x={0} y={13}
              fill="var(--color-overlay0)"
              fontSize={8}
              textAnchor="middle"
              fontFamily="monospace"
            >
              {node.type}{node.status ? ` · ${node.status}` : ''}
            </text>
          </g>
        </>
      )}
    </g>
    </g>
  )
}
