// ─── Mutation node (small dot, swarming) ───

import type { RenderNode } from '../../types/expanse'
import { BaseNode } from '../../components/graph/BaseNode'
import { NODE_PRESETS } from '../../components/graph/nodePresets'

interface MutationNodeProps {
  node: RenderNode
  isDragging: React.MutableRefObject<boolean>
  isClickingNode: React.MutableRefObject<boolean>
  onMutationClick?: (mutationId: string) => void
  onRefusal?: (node: RenderNode) => void
}

export function MutationNode({ node, isDragging, isClickingNode, onMutationClick, onRefusal }: MutationNodeProps) {
  const isGhost = node.tags.includes('rolled_back') || node.tags.includes('rejected')
  const matterClass = isGhost ? '' : `matter-${node.matterState}`
  const ghostClass = isGhost ? 'ghost-imprint' : 'mutation-pulse'
  const preset = NODE_PRESETS.mutation!

  return (
    <BaseNode
      node={node}
      className={`${matterClass} ${ghostClass} nature-${node.nature}`.trim()}
      isDragging={isDragging}
      isClickingNode={isClickingNode}
      onClick={() => { onMutationClick?.(node.id); onRefusal?.(node) }}
      labelOffset={node.radius + 10}
      labelFontSize={preset.labelFontSize}
      labelOpacity={preset.labelOpacity}
      renderShape={({ isSelected }) => (
        <circle
          r={node.radius}
          fill={node.color}
          stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.15)'}
          strokeWidth={isSelected ? 1.5 : 0.5}
        />
      )}
      renderOverlay={({ isActive }) => (
        <>
          {isActive && <circle r={node.radius + 5} fill={node.color} opacity={0.2} filter="url(#glow)" />}
        </>
      )}
    />
  )
}
