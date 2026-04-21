import type { RenderNode } from '../../types/expanse'
import { useProximity } from '../../context/GraphContext'
import { EDGE_COLORS, DEFAULT_EDGE_COLOR } from '../../constants/theme'
import { edgeHopToOpacity, hopToBlur } from '../../utils/proximityBFS'

interface EdgeGfxProps {
  source: RenderNode
  target: RenderNode
  type: string
  weight: number
  idx: number
}

export function EdgeGfx({ source, target, type, weight, idx }: EdgeGfxProps) {
  const { activeNode, proximityMap } = useProximity()
  // Graduated edge opacity + blur based on BFS proximity of both endpoints
  const opacity = activeNode
    ? edgeHopToOpacity(proximityMap?.get(source.id), proximityMap?.get(target.id))
    : 0.5
  // Edge blur: use the more distant endpoint's blur (the dimmer one drives softness)
  const blur = activeNode
    ? Math.max(
        hopToBlur(proximityMap?.get(source.id)),
        hopToBlur(proximityMap?.get(target.id)),
      )
    : 0
  const edgeColor = EDGE_COLORS[type] ?? DEFAULT_EDGE_COLOR

  return (
    <line
      key={idx}
      x1={source.x}
      y1={source.y}
      x2={target.x}
      y2={target.y}
      stroke={edgeColor}
      strokeWidth={0.5 + weight * 2.5}
      opacity={opacity}
      style={{
        transition: 'opacity 0.15s ease, filter 0.2s ease',
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
      }}
    />
  )
}
