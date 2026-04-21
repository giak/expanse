import { describe, it, expect } from 'vitest'
import { computeRadius } from '../computeRadius'

describe('computeRadius', () => {
  it('returns base 8 for centrality 0', () => {
    expect(computeRadius(0)).toBe(8)
  })

  it('scales linearly with centrality', () => {
    expect(computeRadius(1)).toBe(9.5)
    expect(computeRadius(2)).toBe(11)
    expect(computeRadius(4)).toBe(14)
    expect(computeRadius(10)).toBe(23)
  })

  it('caps centrality at 15', () => {
    // 8 + 15 * 1.5 = 30.5
    expect(computeRadius(15)).toBe(30.5)
    expect(computeRadius(20)).toBe(30.5)
    expect(computeRadius(100)).toBe(30.5)
  })

  it('handles fractional centrality', () => {
    expect(computeRadius(0.5)).toBe(8.75)
    expect(computeRadius(3.7)).toBeCloseTo(13.55, 2)
  })
})
