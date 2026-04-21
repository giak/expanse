export function computeRadius(centrality: number): number {
  const capped = Math.min(centrality, 15)
  return 8 + capped * 1.5
}
