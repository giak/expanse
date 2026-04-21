// ─── Drift node (outermost, SEC friction spark) ───

import type { RenderNode } from '../../types/expanse'
import { BaseNode } from '../../components/graph/BaseNode'
import { NODE_PRESETS } from '../../components/graph/nodePresets'

interface DriftNodeProps {
  node: RenderNode
  isDragging: React.MutableRefObject<boolean>
  isClickingNode: React.MutableRefObject<boolean>
  onDriftClick?: (driftId: string) => void
}

export function DriftNode({ node, isDragging, isClickingNode, onDriftClick }: DriftNodeProps) {
  const preset = NODE_PRESETS.drift!

  return (
    <BaseNode
      node={node}
      className={`drift-spark matter-${node.matterState} nature-${node.nature}`.trim()}
      isDragging={isDragging}
      isClickingNode={isClickingNode}
      onClick={() => onDriftClick?.(node.id)}
      labelOffset={node.radius + 9}
      labelFontSize={preset.labelFontSize}
      labelOpacity={preset.labelOpacity}
      labelColor={preset.labelColor}
      renderShape={() => (
        <>
          <circle r={node.radius} fill={node.color} opacity={0.8} />
          <circle r={node.radius + 3} fill={node.color} opacity={0.15} filter="url(#glow)" />
        </>
      )}
      renderOverlay={({ isActive, isSelected }) => (
        <>
          {isActive && <circle r={node.radius + 6} fill={node.color} opacity={0.2} filter="url(#glow)" />}
          {isSelected && <circle r={node.radius + 5} fill="none" stroke="#ffffff" strokeWidth={1} />}
          {node.tags.includes('sec') && (
            <g className="friction-spark">
              <circle r={node.radius + 6} fill="var(--color-red)" opacity={0.3} filter="url(#glow)" />
              <text x={node.radius + 5} y={-(node.radius + 3)}
                fill="var(--color-red)" fontSize={8} fontFamily="serif" opacity={0.6}
              >∴</text>
            </g>
          )}
        </>
      )}
    />
  )
}
