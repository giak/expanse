// ─── Spiral Layout ───
// Shared deterministic phyllotaxis (sunflower) positioning algorithm.
// Used by NatureZone and MemoryEcosystemView to ensure consistent node positions
// for both rendering and tag link alignment.

/** Deterministic hash-based noise for layout variety */
function hashNoise(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0
  }
  return (Math.abs(h) % 10000) / 10000
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)) // ~137.5°

/**
 * Compute a deterministic position on a phyllotaxis spiral.
 * @param index — node index within its group
 * @param total — total nodes in the group
 * @param innerR — inner radius of the annulus
 * @param outerR — outer radius of the annulus
 * @param seed — unique seed string (typically node.id) for angle offset
 */
export function spiralPosition(
  index: number,
  total: number,
  innerR: number,
  outerR: number,
  seed: string,
): { x: number; y: number } {
  const ringWidth = outerR - innerR
  const r = innerR + ringWidth * (0.15 + 0.7 * (index / Math.max(total - 1, 1)))
  const angle = index * GOLDEN_ANGLE + hashNoise(seed) * Math.PI * 2
  return {
    x: Math.cos(angle) * r,
    y: Math.sin(angle) * r,
  }
}
