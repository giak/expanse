/**
 * Memory ecosystem layout computation helpers.
 * Extracted from MemoryEcosystemView for reuse and testability.
 */

import type { JsonNode, MemoryNature } from '../types/expanse'
import { spiralPosition } from './spiralLayout'

// Nature order from center → outer (permanent is innermost = most stable)
export const NATURE_ORDER: MemoryNature[] = ['permanent', 'vivide', 'volatile', 'incandescent']

// Zone radii (from center)
export const ZONE_RADII = {
  mcpCenter: 60,       // MCP tools cluster radius
  permanentInner: 80,  // permanent zone start
  permanentOuter: 200, // permanent zone end
  vivideInner: 210,
  vivideOuter: 340,
  volatileInner: 350,
  volatileOuter: 420,
  incandescentInner: 430,
  incandescentOuter: 520,
}

// Maximum tag root links to draw (avoid over-drawing)
const MAX_TAG_LINKS = 60

// ── Interfaces ──

interface NodePosition { x: number; y: number }

interface TagLink {
  x1: number; y1: number
  x2: number; y2: number
  tag: string
  sourceId: string
  targetId: string
}

// ── Helpers ──

/** Extract tag roots (e.g. "sys:core" → "sys", "v16" → "v16") */
function getTagRoot(tag: string): string {
  const colonIdx = tag.indexOf(':')
  if (colonIdx === -1) return tag
  return tag.slice(0, colonIdx)
}

// ── Computation functions ──

/**
 * Group nodes by their Mnemolite nature.
 * Initializes all nature keys from NATURE_ORDER, then assigns each node.
 */
export function groupNodesByNature(
  nodes: readonly JsonNode[],
  natures: Map<string, MemoryNature>,
): Map<MemoryNature, JsonNode[]> {
  const map = new Map<MemoryNature, JsonNode[]>()
  for (const nature of NATURE_ORDER) map.set(nature, [])
  for (const node of nodes) {
    const nature = natures.get(node.id) ?? 'vivide'
    const arr = map.get(nature)
    if (arr) arr.push(node)
  }
  return map
}

/**
 * Compute SVG positions for all nodes in the memory ecosystem.
 * OUTIL nodes use spiralPosition at center; nature-zone nodes use
 * spiralPosition within their concentric annulus.
 */
export function computeNodePositions(
  outilPositions: { node: JsonNode; x: number; y: number }[],
  nodesByNature: Map<MemoryNature, JsonNode[]>,
  centerX: number,
  centerY: number,
): Map<string, NodePosition> {
  const map = new Map<string, NodePosition>()
  for (const op of outilPositions) {
    map.set(op.node.id, { x: centerX + op.x, y: centerY + op.y })
  }
  for (const nature of NATURE_ORDER) {
    const zoneNodes = nodesByNature.get(nature) ?? []
    const innerR = ZONE_RADII[`${nature}Inner` as keyof typeof ZONE_RADII]
    const outerR = ZONE_RADII[`${nature}Outer` as keyof typeof ZONE_RADII]
    zoneNodes.forEach((node, idx) => {
      const pos = spiralPosition(idx, zoneNodes.length, innerR, outerR, node.id)
      map.set(node.id, {
        x: centerX + pos.x,
        y: centerY + pos.y,
      })
    })
  }
  return map
}

/**
 * Compute tag root links — lines connecting nodes that share a tag root.
 * Only draws links for tag roots with 2–6 nodes, capped at MAX_TAG_LINKS.
 */
export function computeTagLinks(
  nodes: readonly JsonNode[],
  nodePositions: Map<string, NodePosition>,
): TagLink[] {
  const byTagRoot = new Map<string, { id: string; x: number; y: number }[]>()
  for (const node of nodes) {
    for (const tag of node.tags) {
      const root = getTagRoot(tag)
      if (!byTagRoot.has(root)) byTagRoot.set(root, [])
      const pos = nodePositions.get(node.id)
      if (pos) byTagRoot.get(root)!.push({ id: node.id, ...pos })
    }
  }
  const links: TagLink[] = []
  for (const [root, tagNodes] of byTagRoot) {
    if (tagNodes.length < 2 || tagNodes.length > 6) continue
    for (let i = 0; i < tagNodes.length - 1 && links.length < MAX_TAG_LINKS; i++) {
      links.push({
        x1: tagNodes[i].x, y1: tagNodes[i].y,
        x2: tagNodes[i + 1].x, y2: tagNodes[i + 1].y,
        tag: root,
        sourceId: tagNodes[i].id,
        targetId: tagNodes[i + 1].id,
      })
    }
  }
  return links
}
