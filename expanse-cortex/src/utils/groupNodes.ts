/**
 * Group nodes by their `type` field.
 * Shared utility used by TimelineView (Map variant) and CognitiveHeartView (Record variant).
 */

/**
 * Group nodes into a Map<string, T[]>, optionally sorted.
 * Used by TimelineView which needs Map semantics and sort_key ordering.
 */
export function groupNodesByType<T extends { type: string }>(
  nodes: readonly T[],
  sortFn?: (a: T, b: T) => number,
): Map<string, T[]> {
  const map = new Map<string, T[]>()
  for (const node of nodes) {
    const arr = map.get(node.type) ?? []
    arr.push(node)
    map.set(node.type, arr)
  }
  if (sortFn) {
    for (const [, arr] of map) {
      arr.sort(sortFn)
    }
  }
  return map
}

/**
 * Group nodes into a Record<string, T[]> for bracket-access patterns.
 * Used by CognitiveHeartView which uses nodeGroups[type] access.
 */
export function groupNodesByTypeRecord<T extends { type: string }>(
  nodes: readonly T[],
): Record<string, T[]> {
  return Object.fromEntries(groupNodesByType(nodes))
}
