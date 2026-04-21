// ─── Shape polygon point generators ───
// Shared utilities for generating SVG polygon points for various shapes.
// Used by CognitiveHeartView, SignalView, MemoryNode, etc.

/** Hexagon (point-up orientation, starting from top vertex) */
export function hexPoints(r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2
    return `${r * Math.cos(a)},${r * Math.sin(a)}`
  }).join(' ')
}

/** Octagon */
export function octPoints(r: number): string {
  return Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i - Math.PI / 8
    return `${r * Math.cos(a)},${r * Math.sin(a)}`
  }).join(' ')
}

/** Diamond (vertical rhombus) */
export function diamondPoints(r: number): string {
  const h = r * 1.3
  return `0,${-h} ${r * 0.7},0 0,${h} ${-r * 0.7},0`
}

/** Star (5-pointed, sharp inner) */
export function starPoints(r: number): string {
  return Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const rad = i % 2 === 0 ? r : r * 0.45
    return `${rad * Math.cos(a)},${rad * Math.sin(a)}`
  }).join(' ')
}

// ─── Alternate variants (used by Memory Ecosystem nodes) ───

/** Hexagon, flat-top orientation (vertex at right, not top) */
export function hexPointsFlatTop(r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`
  }).join(' ')
}

/** Diamond, compact (height = r, not r*1.3) */
export function diamondPointsCompact(r: number): string {
  const w = r * 0.65
  return `0,${-r} ${w},0 0,${r} ${-w},0`
}

/** Star, rounder inner radius (0.5 instead of 0.45) */
export function starPointsRounded(r: number): string {
  const inner = r * 0.5
  return Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const rad = i % 2 === 0 ? r : inner
    return `${(Math.cos(a) * rad).toFixed(1)},${(Math.sin(a) * rad).toFixed(1)}`
  }).join(' ')
}
