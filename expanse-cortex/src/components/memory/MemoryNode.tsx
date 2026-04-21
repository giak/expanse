// ─── Memory Node ───
// A single node within a nature zone of the Memory Ecosystem view.
// Renders with type-based shape, nature aura glow, and outcome indicator.

import { useState } from 'react'
import type { JsonNode, MemoryNature } from '../../types/expanse'
import { NODE_COLORS, DEFAULT_NODE_COLOR, NATURE_COLORS } from '../../constants/theme'
import { NODE_SHAPES } from '../../constants/schema'
import { useProximity, useSetActiveNode } from '../../context/GraphContext'
import { hopToProximityStyle } from '../../utils/proximityBFS'
import { hexPointsFlatTop, diamondPointsCompact, octPoints, starPointsRounded } from '../../utils/shapePoints'

interface MemoryNodeProps {
  node: JsonNode
  x: number
  y: number
  nature: MemoryNature
  onSelect: (node: JsonNode) => void
}

const BASE_RADIUS = 8
// (shape generators extracted to utils/shapePoints.ts)

export function MemoryNode({ node, x, y, nature, onSelect }: MemoryNodeProps) {
  const [hovered, setHovered] = useState(false)
  const { activeNode, proximityMap } = useProximity()
  const setActiveNode = useSetActiveNode()
  const color = NODE_COLORS[node.type] ?? DEFAULT_NODE_COLOR
  const natureColor = NATURE_COLORS[nature]
  const r = Math.max(BASE_RADIUS, BASE_RADIUS + node.centrality * 0.4)
  const shape = NODE_SHAPES[node.type] ?? 'circle'
  // Combo proximity: opacity + scale (fisheye) + blur (depth-of-field)
  const { opacity: groupOpacity, scale, blur } = activeNode
    ? hopToProximityStyle(proximityMap?.get(node.id))
    : { opacity: 1, scale: 1, blur: 0 }

  // Outcome indicator: small colored dot if outcome exists
  const hasOutcome = node.outcome !== null && node.outcome !== undefined
  const outcomeColor = hasOutcome
    ? (node.outcome! >= 0.7 ? 'var(--color-green)' : node.outcome! >= 0.4 ? 'var(--color-yellow)' : 'var(--color-red)')
    : 'transparent'

  return (
    <g transform={`translate(${x}, ${y})`}>
    <g
      className={`nature-${nature}`}
      onMouseEnter={() => { setHovered(true); setActiveNode(node.id) }}
      onMouseLeave={() => { setHovered(false); setActiveNode(null) }}
      onClick={() => onSelect(node)}
      style={{ cursor: 'pointer', opacity: groupOpacity, transform: `scale(${scale})`, transformOrigin: '0 0', filter: blur > 0 ? `blur(${blur}px)` : 'none', transition: 'opacity 0.15s ease, transform 0.2s ease, filter 0.2s ease' }}
    >
      {/* Nature aura glow */}
      <circle
        r={r + 5}
        fill="none"
        stroke={natureColor}
        strokeWidth={1.5}
        opacity={0.3}
      />

      {/* Shape by type */}
      {shape === 'circle' && (
        <circle
          r={r}
          fill={color}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={0.5}
          opacity={node.status === 'rejected' ? 0.3 : node.status === 'rolled_back' ? 0.5 : 0.85}
        />
      )}
      {shape === 'hexagon' && (
        <polygon
          points={hexPointsFlatTop(r)}
          fill={color}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={0.5}
          opacity={0.85}
        />
      )}
      {shape === 'diamond' && (
        <polygon
          points={diamondPointsCompact(r)}
          fill={color}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={0.5}
          opacity={0.85}
        />
      )}
      {shape === 'octagon' && (
        <polygon
          points={octPoints(r)}
          fill={color}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={0.5}
          opacity={0.85}
        />
      )}
      {shape === 'star' && (
        <polygon
          points={starPointsRounded(r)}
          fill={color}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={0.5}
          opacity={0.85}
        />
      )}

      {/* Outcome indicator dot */}
      {hasOutcome && (
        <circle cx={r - 2} cy={-r + 2} r={2.5} fill={outcomeColor} stroke="var(--color-app-bg)" strokeWidth={0.5} />
      )}

      {/* Hover highlight + tooltip */}
      {hovered && (
        <>
          <circle r={r + 8} fill={color} opacity={0.12} filter="url(#glow)" />
          <g transform={`translate(0, ${-r - 22})`}>
            <rect
              x={-90} y={-10} width={180} height={36}
              rx={4} fill="var(--color-base)" stroke="var(--color-surface1)" strokeWidth={0.5} opacity={0.95}
            />
            <text
              x={0} y={2} fill="var(--color-fg)" fontSize={9} textAnchor="middle" fontFamily="monospace"
            >
              {node.label.length > 28 ? node.label.slice(0, 26) + '…' : node.label}
            </text>
            <text
              x={0} y={14} fill="var(--color-overlay0)" fontSize={8} textAnchor="middle" fontFamily="monospace"
            >
              {node.type}{node.status ? ` · ${node.status}` : ''}{hasOutcome ? ` · outcome:${(node.outcome! * 100).toFixed(0)}%` : ''}
            </text>
          </g>
        </>
      )}

      {/* Label (only on hover or for large nodes) */}
      {(hovered || r > 14) && (
        <text
          y={r + 12}
          fill="var(--color-overlay0)" fontSize={7} textAnchor="middle" fontFamily="monospace"
          opacity={hovered ? 1 : 0.5}
        >
          {node.label.length > 16 ? node.label.slice(0, 14) + '…' : node.label}
        </text>
      )}
    </g>
    </g>
  )
}
