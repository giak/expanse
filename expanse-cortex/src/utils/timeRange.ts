/**
 * Compute the full time range across nodes with valid sort_keys.
 * Shared utility for timeline and temporal views.
 */

interface TimeRange {
  min: number
  max: number
}

/**
 * Compute the min/max time range from nodes, with 5% padding on each side.
 * Nodes with sort_key <= 0 are excluded (unset/invalid timestamps).
 * Falls back to a 24-hour range if no valid nodes are found.
 */
export function computeFullTimeRange(nodes: readonly { sort_key: number }[]): TimeRange {
  let min = Infinity
  let max = -Infinity
  for (const node of nodes) {
    if (node.sort_key > 0) {
      const ts = node.sort_key * 1000
      if (ts < min) min = ts
      if (ts > max) max = ts
    }
  }
  const range = max - min || 86400000
  return {
    min: min - range * 0.05,
    max: max + range * 0.05,
  }
}
