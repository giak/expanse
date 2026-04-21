// ─── Generic cluster node (varies shape by type) ───

import type { RenderNode } from '../../types/expanse'
import { NODE_SHAPES } from '../../constants/schema'
import { BaseNode } from '../../components/graph/BaseNode'
import { NODE_PRESETS } from '../../components/graph/nodePresets'
import { hexPoints, diamondPoints, starPoints } from '../../utils/shapePoints'

interface ClusterNodeProps {
  node: RenderNode
  isDragging: React.MutableRefObject<boolean>
  isClickingNode: React.MutableRefObject<boolean>
  onClusterClick?: (clusterId: string) => void
  onRefusal?: (node: RenderNode) => void
}

export function ClusterNode({ node, isDragging, isClickingNode, onClusterClick, onRefusal }: ClusterNodeProps) {
  const shape = NODE_SHAPES[node.type] ?? 'circle'
  const r = node.radius
  const matterClass = `matter-${node.matterState}`
  const curtainClass = node.curtain ? `curtain-${node.curtain}` : ''
  const preset = NODE_PRESETS.cluster!

  return (
    <BaseNode
      node={node}
      className={`${matterClass} ${curtainClass} nature-${node.nature}`.trim()}
      isDragging={isDragging}
      isClickingNode={isClickingNode}
      focusable={preset.focusable}
      onClick={() => { onClusterClick?.(node.id); onRefusal?.(node) }}
      renderBehind={({ isActive }) => (
        <>
          {isActive && <circle r={r + 8} fill={node.color} opacity={0.15} filter="url(#glow)" />}
        </>
      )}
      renderShape={({ isSelected }) => {
        const strokeColor = isSelected ? '#ffffff' : 'rgba(255,255,255,0.2)'
        const strokeWidth = isSelected ? 2 : 0.8
        if (shape === 'diamond') return <polygon points={diamondPoints(r)} fill={node.color} stroke={strokeColor} strokeWidth={strokeWidth} />
        if (shape === 'star') return <polygon points={starPoints(r)} fill={node.color} stroke={strokeColor} strokeWidth={strokeWidth} />
        if (shape === 'hexagon') return <polygon points={hexPoints(r)} fill={node.color} stroke={strokeColor} strokeWidth={strokeWidth} />
        return <circle r={r} fill={node.color} stroke={strokeColor} strokeWidth={strokeWidth} />
      }}
    />
  )
}
