import { ORGAN_COLORS, NODE_COLORS, DEFAULT_NODE_COLOR } from '../constants/theme'
import {
  VITAL_RING_RADIUS,
  NUCLEUS_RADIUS,
  SWARM_INNER_RADIUS,
  SWARM_OUTER_RADIUS,
  ANATOMICAL_CLUSTER,
  NEBULA_RADIUS,
} from '../constants/schema'
import { computeOrganPositions } from './organLayout'
import { computeRadius } from './computeRadius'
import { computeNodeMeta } from './computeNodeMeta'
import type { GraphData, RenderNode } from '../types/expanse'

// ─── Shared organ positions (computed once) ───

const organPositions = computeOrganPositions()

// ─── Position all graph nodes around their parent organs ───

export function positionGraphNodes(data: GraphData): RenderNode[] {
  const positioned: RenderNode[] = []

  // 1. Place organs on vital ring
  const organNodes = data.nodes.filter(n => n.type === 'ORGAN')
  organNodes.forEach(node => {
    const symbol = node.label.charAt(0)
    const pos = organPositions.get(symbol)
    if (pos) {
      positioned.push({
        ...node,
        x: pos.x,
        y: pos.y,
        color: ORGAN_COLORS[symbol] ?? NODE_COLORS.ORGAN,
        radius: 30,
        ...computeNodeMeta(node),
      })
    }
  })

  // 2. Place APEX in nucleus (tight cluster at center)
  const apexNodes = data.nodes.filter(n => n.type === 'APEX')
  const apexAngleStep = (2 * Math.PI) / Math.max(apexNodes.length, 1)
  apexNodes.forEach((node, i) => {
    const angle = apexAngleStep * i
    const dist = NUCLEUS_RADIUS * 0.6 + (node.centrality / 60) * NUCLEUS_RADIUS * 0.3
    positioned.push({
      ...node,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      color: NODE_COLORS.APEX,
      radius: computeRadius(node.centrality) * 0.8,
      ...computeNodeMeta(node),
    })
  })

  // 3. Place mutations in orbital swarm
  const mutationNodes = data.nodes.filter(n => n.type === 'MUTATION')
  const mutAngleStep = (2 * Math.PI) / Math.max(mutationNodes.length, 1)
  mutationNodes.forEach((node, i) => {
    const angle = mutAngleStep * i + (i * 0.07) // slight jitter per index for stability
    const dist = SWARM_INNER_RADIUS + ((i * 127 + 37) % (SWARM_OUTER_RADIUS - SWARM_INNER_RADIUS))
    positioned.push({
      ...node,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      color: NODE_COLORS.MUTATION,
      radius: Math.max(4, 3 + node.centrality * 0.3),
      ...computeNodeMeta(node),
    })
  })

  // 4. Place drifts scattered in outer region
  const driftNodes = data.nodes.filter(n => n.type === 'DRIFT')
  driftNodes.forEach((node, i) => {
    const angle = (2 * Math.PI / Math.max(driftNodes.length, 1)) * i + (i * 0.13)
    const dist = VITAL_RING_RADIUS + 120 + ((i * 127 + 43) % 200)
    positioned.push({
      ...node,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      color: NODE_COLORS.DRIFT,
      radius: 4,
      ...computeNodeMeta(node),
    })
  })

  // 5. Place clustered types around their parent organ
  const clusteredTypes = ['COMMANDE', 'REGLE', 'PROTOCOLE', 'OUTIL', 'PATTERN', 'MEMOIRE', 'AXIOME', 'FICHIER', 'EXTENSION', 'SUBSTRAT']
  clusteredTypes.forEach(type => {
    const config = ANATOMICAL_CLUSTER[type]
    if (!config || config.parentOrgan.startsWith('__')) return

    const parentPos = organPositions.get(config.parentOrgan)
    if (!parentPos) return

    // Direction from center to organ
    const organAngle = Math.atan2(parentPos.y, parentPos.x)
    const clusterAngle = organAngle + config.angleOffset
    const clusterDist = config.radialBias + config.spreadRadius * 0.5
    const clusterCenterX = parentPos.x + Math.cos(clusterAngle) * clusterDist
    const clusterCenterY = parentPos.y + Math.sin(clusterAngle) * clusterDist

    const typeNodes = data.nodes.filter(n => n.type === type)
    const angleStep = (Math.PI * 1.2) / Math.max(typeNodes.length, 1)
    const startAngle = clusterAngle - (Math.PI * 0.6)

    typeNodes.forEach((node, i) => {
      const a = startAngle + angleStep * i
      // Extension MEMOIRE nodes are pushed to the nebula periphery
      const isExtension = node.tags.includes('extension')
      const r = isExtension
        ? NEBULA_RADIUS + ((i * 97 + 31) % 60) - 30
        : config.spreadRadius * 0.3 + ((i * 127 + 17) % Math.max(1, Math.floor(config.spreadRadius * 0.5)))
      positioned.push({
        ...node,
        x: isExtension ? Math.cos(a) * r : clusterCenterX + Math.cos(a) * r,
        y: isExtension ? Math.sin(a) * r : clusterCenterY + Math.sin(a) * r,
        color: NODE_COLORS[type] ?? DEFAULT_NODE_COLOR,
        radius: computeRadius(node.centrality) * 0.7,
        ...computeNodeMeta(node),
      })
    })
  })

  return positioned
}

// ─── Export the shared organ positions map for resolvePosition helpers ───

export { organPositions }
