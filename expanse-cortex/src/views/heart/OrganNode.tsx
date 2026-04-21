// ─── Organ node (large, glowing hexagon on vital ring) ───

import type { RenderNode } from '../../types/expanse'
import { ORGAN_COLORS } from '../../constants/theme'
import { BaseNode } from '../../components/graph/BaseNode'
import { NODE_PRESETS } from '../../components/graph/nodePresets'
import { hexPoints } from '../../utils/shapePoints'

interface OrganNodeProps {
  node: RenderNode
  isDragging: React.MutableRefObject<boolean>
  isClickingNode: React.MutableRefObject<boolean>
  onOrganClick?: (organSymbol: string) => void
  highlighted?: boolean
  bootPhase?: 'chaos' | 'locking' | 'locked' | null
}

export function OrganNode({ node, isDragging, isClickingNode, onOrganClick, highlighted, bootPhase }: OrganNodeProps) {
  const organSymbol = node.label.charAt(0)
  const color = ORGAN_COLORS[organSymbol] ?? node.color
  const r = node.radius
  const preset = NODE_PRESETS.organ!

  return (
    <BaseNode
      node={node}
      className={`${preset.className} nature-${node.nature}`}
      isDragging={isDragging}
      isClickingNode={isClickingNode}
      focusable={preset.focusable}
      onClick={() => onOrganClick?.(organSymbol)}
      labelOffset={r + 16}
      labelFontSize={preset.labelFontSize}
      labelOpacity={preset.labelOpacity}
      labelFontWeight={preset.labelFontWeight}
      renderBehind={({ isActive }) => (
        <>
          {highlighted && (
            <circle r={r + 24} fill="none" stroke={color} strokeWidth={2.5} opacity={0.6} className="organ-highlight-pulse" filter="url(#glow)" />
          )}
          {highlighted && (
            <circle r={r + 32} fill={color} opacity={0.06} />
          )}
          <circle r={r + 16} fill={color} opacity={isActive ? 0.15 : 0.08}
            className={bootPhase === 'chaos'
              ? `vital-pulse-chaos-${organSymbol}`
              : bootPhase === 'locking'
                ? 'vital-pulse-locking'
                : 'vital-pulse'
            } />
          <circle r={r + 8} fill={color} opacity={0.12} filter="url(#glow)" />
        </>
      )}
      renderShape={({ isSelected }) => (
        <polygon
          points={hexPoints(r)}
          fill={color}
          stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.3)'}
          strokeWidth={isSelected ? 2.5 : 1.5}
          filter="url(#glow)"
        />
      )}
      renderInner={() => (
        <>
          <circle r={r * 0.4} fill="rgba(0,0,0,0.25)" />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--color-base)"
            fontSize={r * 0.8}
            fontWeight="bold"
            fontFamily="'JetBrains Mono', monospace"
          >
            {organSymbol}
          </text>
        </>
      )}
    />
  )
}
