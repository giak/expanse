// ══════════════════════════════════════════════════════════════
// BASE NODE — Template Method + Slot Pattern for graph nodes
// ══════════════════════════════════════════════════════════════
// Extracts shared logic from OrganNode, ApexNode, MutationNode,
// DriftNode, and ClusterNode in CognitiveHeartView:
//
//   ① Graph context consumption (active, selected, proximity)
//   ② Proximity styling (opacity, scale, blur)
//   ③ Position translation
//   ④ Mouse interaction (click, drag, hover)
//   ⑤ Selection highlighting
//   ⑥ Label text below node
//
// Node-specific content is injected via slot render props:
//   renderBehind  — elements behind the shape (e.g. highlight pulse)
//   renderShape   — the SVG shape itself (mandatory)
//   renderInner   — content inside the shape (e.g. organ symbol)
//   renderOverlay — elements on top (e.g. active glow, friction spark)

import { type ReactNode } from 'react'
import { useProximity, useActiveNode, useSelectedNode } from '../../context/GraphContext'
import { hopToProximityStyle } from '../../utils/proximityBFS'
import type { RenderNode } from '../../types/expanse'

// ─── Slot context ───

/** Context passed to each slot renderer. */
export interface NodeSlotContext {
  node: RenderNode
  isActive: boolean
  isSelected: boolean
}

// ─── BaseNode props ───

export interface BaseNodeProps {
  /** The graph node data */
  node: RenderNode
  /** CSS class(es) for the inner group */
  className?: string
  /** Vertical offset for the label text. Defaults to node.radius + 12 */
  labelOffset?: number
  /** Font size for the label. Defaults to 9 */
  labelFontSize?: number
  /** Label opacity. Defaults to 0.75 */
  labelOpacity?: number
  /** Label color. Defaults to 'var(--color-fg)' */
  labelColor?: string
  /** Label font weight. Defaults to 'normal' */
  labelFontWeight?: string | number

  /** Drag guard ref (shared across all nodes in a view) */
  isDragging: React.MutableRefObject<boolean>
  /** Click guard ref (shared across all nodes in a view) */
  isClickingNode: React.MutableRefObject<boolean>
  /** Whether the node is in the keyboard tab order. true=tabIndex 0 (landmark), false=tabIndex -1 (programmatically focusable only). Defaults to false. */
  focusable?: boolean
  /** Called when the node is clicked (not dragging) */
  onClick?: () => void

  // ─── Slot renderers ───

  /** Elements behind the shape (e.g. highlight pulse, boot glow) */
  renderBehind?: (ctx: NodeSlotContext) => ReactNode
  /** The SVG shape itself — mandatory (hexagon, circle, octagon, etc.) */
  renderShape: (ctx: NodeSlotContext) => ReactNode
  /** Content inside the shape (e.g. organ symbol, inner core) */
  renderInner?: (ctx: NodeSlotContext) => ReactNode
  /** Elements on top of the shape (e.g. active glow, friction spark) */
  renderOverlay?: (ctx: NodeSlotContext) => ReactNode
}

// ─── BaseNode component ───

export function BaseNode({
  node,
  className,
  labelOffset,
  labelFontSize,
  labelOpacity,
  labelColor,
  labelFontWeight,
  isDragging,
  isClickingNode,
  focusable,
  onClick,
  renderBehind,
  renderShape,
  renderInner,
  renderOverlay,
}: BaseNodeProps) {
  const { activeNode, proximityMap } = useProximity()
  const [, setActiveNode] = useActiveNode()
  const [selectedNode, setSelectedNode] = useSelectedNode()
  const isActive = activeNode === node.id
  const isSelected = selectedNode?.id === node.id
  const { opacity, scale, blur } = activeNode
    ? hopToProximityStyle(proximityMap?.get(node.id))
    : { opacity: 1, scale: 1, blur: 0 }

  const ctx: NodeSlotContext = { node, isActive, isSelected }

  const lOffset = labelOffset ?? node.radius + 12
  const lFontSize = labelFontSize ?? 9
  const lOpacity = labelOpacity ?? 0.75
  const lColor = labelColor ?? 'var(--color-fg)'
  const lFontWeight = labelFontWeight ?? 'normal'

  // Keyboard activation handler — Enter/Space triggers the same action as click
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      if (!isDragging.current) {
        setSelectedNode(node)
        onClick?.()
      }
    }
  }

  return (
    <g transform={`translate(${node.x}, ${node.y})`}>
    <g
      role="button"
      aria-label={`${node.type} ${node.label}`}
      tabIndex={focusable ? 0 : -1}
      onMouseDown={e => { e.stopPropagation(); isClickingNode.current = true }} // eslint-disable-line react-compiler/react-compiler
      onClick={e => {
        e.stopPropagation()
        if (!isDragging.current) {
          setSelectedNode(node)
          onClick?.()
        }
      }}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setActiveNode(node.id)}
      onMouseLeave={() => setActiveNode(null)}
      style={{
        cursor: 'zoom-in',
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '0 0',
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        transition: 'opacity 0.15s ease, transform 0.2s ease, filter 0.2s ease',
      }}
      className={`graph-node-focus ${className ?? ''}`.trim()}
    >
      {renderBehind?.(ctx)}
      {renderShape(ctx)}
      {renderInner?.(ctx)}
      {renderOverlay?.(ctx)}
      <text
        y={lOffset}
        textAnchor="middle"
        fill={lColor}
        fontSize={lFontSize}
        fontFamily="'JetBrains Mono', monospace"
        fontWeight={lFontWeight}
        opacity={lOpacity}
        aria-hidden="true"
      >
        {node.label}
      </text>
    </g>
    </g>
  )
}

// Note: React.memo removed — render props are inline functions (new refs each render),
// so memo with shallow comparison is a no-op (always re-renders). Performance should
// be addressed by memo-izing the wrapper components (OrganNode, etc.) where primitive
// props like highlighted/bootPhase can be compared.
