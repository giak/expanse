import type { RenderNode } from '../../types/expanse'
import { useProximity, useActiveNode, useSelectedNode } from '../../context/GraphContext'
import { NATURE_COLORS } from '../../constants/theme'
import { hopToProximityStyle } from '../../utils/proximityBFS'

interface NodeGfxProps {
  node: RenderNode
  isDragging: React.MutableRefObject<boolean>
  isClickingNode: React.MutableRefObject<boolean>
  /** Whether the node is in the keyboard tab order. true=tabIndex 0, false=tabIndex -1. Defaults to false. */
  focusable?: boolean
}

export function NodeGfx({ node, isDragging, isClickingNode, focusable }: NodeGfxProps) {
  const { activeNode, proximityMap } = useProximity()
  const [, setActiveNode] = useActiveNode()
  const [selectedNode, setSelectedNode] = useSelectedNode()
  const isActive = activeNode === node.id
  const isSelected = selectedNode?.id === node.id

  // Combo proximity: opacity + scale (fisheye) + blur (depth-of-field)
  const { opacity, scale, blur } = activeNode
    ? hopToProximityStyle(proximityMap?.get(node.id))
    : { opacity: 1, scale: 1, blur: 0 }

  // Keyboard activation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      if (!isDragging.current) {
        setSelectedNode(node)
      }
    }
  }

  return (
    <g transform={`translate(${node.x}, ${node.y})`}>
    <g
      role="button"
      aria-label={`${node.type} ${node.label}`}
      tabIndex={focusable ? 0 : -1}
      onMouseDown={e => {
        e.stopPropagation()
        // eslint-disable-next-line react-compiler/react-compiler -- imperative click-tracking ref to avoid re-renders
        isClickingNode.current = true
      }}
      onClick={e => {
        e.stopPropagation()
        if (!isDragging.current) {
          setSelectedNode(node)
        }
      }}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setActiveNode(node.id)}
      onMouseLeave={() => setActiveNode(null)}
      style={{
        cursor: 'pointer',
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '0 0',
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        transition: 'opacity 0.15s ease, transform 0.2s ease, filter 0.2s ease',
      }}
      className={`graph-node-focus nature-${node.nature}`}
    >
      {isActive && (
        <circle
          r={node.radius + 10}
          fill={node.color}
          opacity={0.15}
          filter="url(#glow)"
        />
      )}

      {/* Nature aura — soft glow ring colored by Mnemolite nature */}
      <circle
        r={node.radius + 3}
        fill="none"
        stroke={NATURE_COLORS[node.nature] ?? 'transparent'}
        strokeWidth={2}
        opacity={0.35}
      />

      <circle
        r={node.radius}
        fill={node.color}
        stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.2)'}
        strokeWidth={isSelected ? 2 : 1}
        filter="url(#nodeShadow)"
      />

      <circle
        r={Math.max(3, node.radius * 0.35)}
        fill="rgba(0,0,0,0.3)"
      />

      <text
        y={node.radius + 12}
        textAnchor="middle"
        fill="var(--color-fg)"
        fontSize={10}
        fontFamily="'JetBrains Mono', monospace"
        opacity={0.85}
        aria-hidden="true"
      >
        {node.label}
      </text>
    </g>
    </g>
  )
}

// React Compiler auto-memoizes — GraphContext slices mean this component only re-renders when
// activeNode, selectedNode, or proximityMap actually change (not on unrelated state).
