// ─── MCP Tool Node ───
// A central node representing an MCP tool in the Memory Ecosystem.
// Rendered as a purple spider-like shape with radial filaments reaching
// to the nodes it connects to.

import { useState } from 'react'
import type { JsonNode } from '../../types/expanse'
import { NODE_COLORS } from '../../constants/theme'
import { useProximity, useSetActiveNode } from '../../context/GraphContext'
import { hopToProximityStyle } from '../../utils/proximityBFS'

interface MCPToolNodeProps {
  node: JsonNode
  x: number
  y: number
  connections: { x: number; y: number }[]
  onSelect: (node: JsonNode) => void
}

export function MCPToolNode({ node, x, y, connections, onSelect }: MCPToolNodeProps) {
  const [hovered, setHovered] = useState(false)
  const { activeNode, proximityMap } = useProximity()
  const setActiveNode = useSetActiveNode()
  const color = NODE_COLORS.OUTIL ?? 'var(--color-mauve)'
  const r = 10
  // Combo proximity: opacity + scale (fisheye) + blur (depth-of-field)
  const { opacity: groupOpacity, scale, blur } = activeNode
    ? hopToProximityStyle(proximityMap?.get(node.id))
    : { opacity: 1, scale: 1, blur: 0 }

  return (
    <g transform={`translate(${x}, ${y})`}>
    <g
      className="mcp-tool-node nature-vivide"
      onMouseEnter={() => { setHovered(true); setActiveNode(node.id) }}
      onMouseLeave={() => { setHovered(false); setActiveNode(null) }}
      onClick={() => onSelect(node)}
      style={{ cursor: 'pointer', opacity: groupOpacity, transform: `scale(${scale})`, transformOrigin: '0 0', filter: blur > 0 ? `blur(${blur}px)` : 'none', transition: 'opacity 0.15s ease, transform 0.2s ease, filter 0.2s ease' }}
    >
      {/* Radial filaments to connected nodes */}
      {connections.map((target, idx) => {
        const dx = target.x - x
        const dy = target.y - y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        // Only draw filament if within reasonable range
        if (dist > 600) return null
        const nx = dx / dist
        const ny = dy / dist
        // Filament goes from node edge to partway toward target
        const filamentLength = Math.min(dist * 0.4, 80)
        return (
          <line
            key={idx}
            x1={nx * r} y1={ny * r}
            x2={nx * filamentLength} y2={ny * filamentLength}
            stroke={color}
            strokeWidth={0.5}
            opacity={hovered ? 0.4 : 0.12}
          />
        )
      })}

      {/* Spider body — central circle */}
      <circle r={r} fill={color} opacity={0.7} filter="url(#glow)" />

      {/* Spider legs — 8 radial lines */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (Math.PI / 4) * i + Math.PI / 8
        const legLen = r + 6
        return (
          <line
            key={i}
            x1={Math.cos(angle) * (r - 2)} y1={Math.sin(angle) * (r - 2)}
            x2={Math.cos(angle) * legLen} y2={Math.sin(angle) * legLen}
            stroke={color}
            strokeWidth={1}
            opacity={0.5}
          />
        )
      })}

      {/* Inner dot */}
      <circle r={3} fill="var(--color-base)" opacity={0.8} />

      {/* Hover highlight + tooltip */}
      {hovered && (
        <>
          <circle r={r + 12} fill={color} opacity={0.1} filter="url(#glow)" />
          <g transform={`translate(0, ${-r - 22})`}>
            <rect
              x={-80} y={-10} width={160} height={26}
              rx={4} fill="var(--color-base)" stroke="var(--color-surface1)" strokeWidth={0.5} opacity={0.95}
            />
            <text
              x={0} y={2} fill="var(--color-fg)" fontSize={9} textAnchor="middle" fontFamily="monospace"
            >
              {node.label.length > 24 ? node.label.slice(0, 22) + '…' : node.label}
            </text>
            <text
              x={0} y={12} fill="var(--color-overlay0)" fontSize={7} textAnchor="middle" fontFamily="monospace"
            >
              OUTIL
            </text>
          </g>
        </>
      )}

      {/* Label */}
      <text
        y={r + 12}
        fill="var(--color-overlay0)" fontSize={6} textAnchor="middle" fontFamily="monospace"
        opacity={0.5}
      >
        {node.label.length > 12 ? node.label.slice(0, 10) + '…' : node.label}
      </text>
    </g>
    </g>
  )
}
