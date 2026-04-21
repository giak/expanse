// ─── APEX nucleus node (octagon, dense, heavy) ───

import type { RenderNode } from '../../types/expanse'
import { BaseNode } from '../../components/graph/BaseNode'
import { NODE_PRESETS } from '../../components/graph/nodePresets'
import { octPoints } from '../../utils/shapePoints'

interface ApexNodeProps {
  node: RenderNode
  isDragging: React.MutableRefObject<boolean>
  isClickingNode: React.MutableRefObject<boolean>
  onApexClick?: () => void
}

export function ApexNode({ node, isDragging, isClickingNode, onApexClick }: ApexNodeProps) {
  const preset = NODE_PRESETS.apex!

  return (
    <BaseNode
      node={node}
      className={`${preset.className} nature-${node.nature}`}
      isDragging={isDragging}
      isClickingNode={isClickingNode}
      focusable={preset.focusable}
      onClick={onApexClick}
      labelOffset={node.radius + 14}
      labelFontSize={preset.labelFontSize}
      labelOpacity={preset.labelOpacity}
      renderBehind={({ isActive }) => (
        <>
          {isActive && <circle r={node.radius + 10} fill={node.color} opacity={0.2} filter="url(#glow)" />}
        </>
      )}
      renderShape={({ isSelected }) => (
        <>
          <polygon
            points={octPoints(node.radius)}
            fill={node.color}
            stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.25)'}
            strokeWidth={isSelected ? 2 : 1}
            filter="url(#nodeShadow)"
          />
          <circle r={node.radius + 4} fill="none" stroke={node.color} strokeWidth={1} opacity={0.4} className="nucleus-breath" />
        </>
      )}
    />
  )
}
