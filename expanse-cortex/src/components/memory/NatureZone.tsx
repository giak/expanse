// ─── Nature Zone ───
// A concentric ring in the Memory Ecosystem, one per nature.
// Renders the background arc with nature color, a label arc, and positions
// all nodes of that nature using a phyllotaxis spiral (deterministic, no Math.random).

import type { JsonNode, MemoryNature } from '../../types/expanse'
import { NATURE_COLORS, NATURE_LEGEND } from '../../constants/theme'
import { MemoryNode } from './MemoryNode'
import { spiralPosition } from '../../utils/spiralLayout'

interface NatureZoneProps {
  nature: MemoryNature
  /** Pre-filtered nodes for this nature (parent already filtered by computeNature) */
  nodes: JsonNode[]
  innerRadius: number
  outerRadius: number
  centerX: number
  centerY: number
  onSelect: (node: JsonNode) => void
}

export function NatureZone({
  nature,
  nodes,
  innerRadius,
  outerRadius,
  centerX,
  centerY,
  onSelect,
}: NatureZoneProps) {
  const legend = NATURE_LEGEND.find(l => l.nature === nature)
  const color = NATURE_COLORS[nature]
  const midR = (innerRadius + outerRadius) / 2

  return (
    <g className={`nature-zone nature-zone-${nature}`}>
      {/* Background ring — faint fill with nature color */}
      <circle
        cx={centerX} cy={centerY}
        r={outerRadius}
        fill="none"
        stroke={color}
        strokeWidth={outerRadius - innerRadius}
        opacity={0.04}
      />

      {/* Ring boundary — inner and outer arcs */}
      <circle
        cx={centerX} cy={centerY}
        r={innerRadius}
        fill="none"
        stroke={color}
        strokeWidth={0.5}
        opacity={0.15}
        strokeDasharray="4 6"
      />
      <circle
        cx={centerX} cy={centerY}
        r={outerRadius}
        fill="none"
        stroke={color}
        strokeWidth={0.5}
        opacity={0.2}
      />

      {/* Label arc — nature name at top of the zone */}
      <text
        x={centerX}
        y={centerY - midR}
        fill={color}
        fontSize={10}
        fontFamily="monospace"
        fontWeight={600}
        textAnchor="middle"
        opacity={0.6}
        letterSpacing={2}
      >
        {legend?.icon} {nature.toUpperCase()}
      </text>

      {/* Count badge */}
      <text
        x={centerX}
        y={centerY - midR + 13}
        fill={color}
        fontSize={8}
        fontFamily="monospace"
        textAnchor="middle"
        opacity={0.35}
      >
        {nodes.length} nœuds
      </text>

      {/* Nodes placed in phyllotaxis spiral */}
      {nodes.map((node, idx) => {
        const pos = spiralPosition(idx, nodes.length, innerRadius, outerRadius, node.id)
        return (
          <MemoryNode
            key={node.id}
            node={node}
            x={centerX + pos.x}
            y={centerY + pos.y}
            nature={nature}
            onSelect={onSelect}
          />
        )
      })}
    </g>
  )
}
