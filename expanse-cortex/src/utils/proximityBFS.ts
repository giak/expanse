// ─── Proximity BFS ───
// Computes the hop distance from a root node to all reachable nodes via edges.
// Provides a graduated opacity curve: root=1.0, hop1=0.85, hop2=0.6, hop3=0.35, hop4+=0.15.

import type { JsonEdge } from '../types/expanse'

const MAX_HOPS = 4

// Opacity curve: maps hop distance → opacity
const OPACITY_CURVE: Record<number, number> = {
  0: 1.0,    // the active node itself
  1: 0.85,   // directly connected
  2: 0.6,    // 2 hops away
  3: 0.35,   // 3 hops away
  4: 0.15,   // 4+ hops (barely visible)
}

const DIM_OPACITY = 0.10 // opacity for nodes not reached at all

// Scale curve: hop distance → scale factor (fisheye magnification)
const SCALE_CURVE: Record<number, number> = {
  0: 1.35,   // the active node itself — prominent magnification
  1: 1.12,   // directly connected — slight magnification
  2: 0.92,   // 2 hops — slight shrink
  3: 0.75,   // 3 hops — noticeable shrink
  4: 0.6,    // 4+ hops — small
}
const DIM_SCALE = 0.5   // scale for unreachable nodes

// Blur curve: hop distance → blur radius in px
const BLUR_CURVE: Record<number, number> = {
  0: 0,     // the active node — pin-sharp
  1: 0,     // directly connected — sharp
  2: 0.5,   // 2 hops — barely soft
  3: 1.2,   // 3 hops — noticeably soft
  4: 2.5,   // 4+ hops — quite blurry
}
const DIM_BLUR = 3.5   // blur for unreachable nodes

/**
 * BFS from a root node through the edge graph.
 * Returns a Map<nodeId, hopDistance>. Root is at distance 0.
 * Stops at MAX_HOPS depth.
 */
export function computeProximityMap(
  rootId: string,
  edges: JsonEdge[],
): Map<string, number> {
  const proximity = new Map<string, number>()
  proximity.set(rootId, 0)

  // Build adjacency list for fast lookup
  const adj = new Map<string, string[]>()
  for (const e of edges) {
    let list = adj.get(e.source)
    if (!list) { list = []; adj.set(e.source, list) }
    list.push(e.target)
    list = adj.get(e.target)
    if (!list) { list = []; adj.set(e.target, list) }
    list.push(e.source)
  }

  // BFS
  const queue: string[] = [rootId]
  let head = 0
  while (head < queue.length) {
    const current = queue[head++]
    const currentDist = proximity.get(current)!
    if (currentDist >= MAX_HOPS) continue

    const neighbors = adj.get(current)
    if (!neighbors) continue

    for (const neighbor of neighbors) {
      if (!proximity.has(neighbor)) {
        proximity.set(neighbor, currentDist + 1)
        queue.push(neighbor)
      }
    }
  }

  return proximity
}

/**
 * Maps a hop distance (or undefined = not reachable) to an opacity value.
 * Uses the graduated curve: 0→1.0, 1→0.85, 2→0.6, 3→0.35, 4+→0.15, undefined→0.12
 */
function hopToOpacity(hop: number | undefined): number {
  if (hop === undefined) return DIM_OPACITY
  return OPACITY_CURVE[Math.min(hop, MAX_HOPS)] ?? DIM_OPACITY
}

/**
 * Maps a hop distance to a scale factor (fisheye magnification).
 * Active node = 1.35×, hop 1 = 1.12×, hop 2 = 0.92×, hop 3 = 0.75×, hop 4+ = 0.6×, unreachable = 0.5×
 */
function hopToScale(hop: number | undefined): number {
  if (hop === undefined) return DIM_SCALE
  return SCALE_CURVE[Math.min(hop, MAX_HOPS)] ?? DIM_SCALE
}

/**
 * Maps a hop distance to a CSS blur radius in px.
 * Active node = 0, hop 1 = 0, hop 2 = 0.5px, hop 3 = 1.2px, hop 4+ = 2.5px, unreachable = 3.5px
 */
export function hopToBlur(hop: number | undefined): number {
  if (hop === undefined) return DIM_BLUR
  return BLUR_CURVE[Math.min(hop, MAX_HOPS)] ?? DIM_BLUR
}

/**
 * Compute all three visual properties (opacity, scale, blur) from a hop distance.
 * Returns an object suitable for spreading into style prop.
 */
export function hopToProximityStyle(hop: number | undefined): {
  opacity: number
  scale: number
  blur: number
} {
  return {
    opacity: hopToOpacity(hop),
    scale: hopToScale(hop),
    blur: hopToBlur(hop),
  }
}

/**
 * For edges: opacity is the maximum of source and target hop distances.
 * An edge is visible if either endpoint is close.
 */
export function edgeHopToOpacity(
  sourceHop: number | undefined,
  targetHop: number | undefined,
): number {
  // If both are unreachable, dim the edge
  if (sourceHop === undefined && targetHop === undefined) return DIM_OPACITY
  // Use the closer endpoint's opacity
  const minHop = Math.min(
    sourceHop ?? MAX_HOPS + 1,
    targetHop ?? MAX_HOPS + 1,
  )
  return hopToOpacity(minHop)
}
