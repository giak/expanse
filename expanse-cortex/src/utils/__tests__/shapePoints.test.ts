import { describe, it, expect } from 'vitest'
import { hexPoints, octPoints, diamondPoints, starPoints, hexPointsFlatTop, diamondPointsCompact, starPointsRounded } from '../shapePoints'

describe('shapePoints', () => {
  describe('hexPoints', () => {
    it('produces 6 points for a hexagon', () => {
      const points = hexPoints(10)
      const parts = points.split(' ')
      expect(parts.length).toBe(6)
    })

    it('produces points at the correct radius', () => {
      const points = hexPoints(50)
      const parts = points.split(' ')
      // Top vertex: angle = -PI/2 → x=0, y=-r
      const [x0, y0] = parts[0].split(',').map(Number)
      expect(x0).toBeCloseTo(0, 4)
      expect(y0).toBeCloseTo(-50, 4)
    })

    it('scales with radius', () => {
      const p1 = hexPoints(10)
      const p2 = hexPoints(20)
      // Each coordinate in p2 should be ~2x p1
      const c1 = p1.split(' ')[1].split(',').map(Number)
      const c2 = p2.split(' ')[1].split(',').map(Number)
      expect(c2[0] / c1[0]).toBeCloseTo(2, 1)
      expect(c2[1] / c1[1]).toBeCloseTo(2, 1)
    })
  })

  describe('octPoints', () => {
    it('produces 8 points for an octagon', () => {
      const points = octPoints(10)
      expect(points.split(' ').length).toBe(8)
    })
  })

  describe('diamondPoints', () => {
    it('produces 4 points for a diamond', () => {
      const points = diamondPoints(10)
      expect(points.split(' ').length).toBe(4)
    })

    it('top vertex is at (0, -r*1.3)', () => {
      const points = diamondPoints(10)
      const [x, y] = points.split(' ')[0].split(',').map(Number)
      expect(x).toBe(0)
      expect(y).toBeCloseTo(-13, 4)
    })
  })

  describe('starPoints', () => {
    it('produces 10 points for a 5-pointed star', () => {
      const points = starPoints(10)
      expect(points.split(' ').length).toBe(10)
    })

    it('outer points are at full radius', () => {
      const points = starPoints(50)
      const parts = points.split(' ')
      // First point (outer): angle = -PI/2 → x=0, y=-50
      const [x0, y0] = parts[0].split(',').map(Number)
      expect(x0).toBeCloseTo(0, 4)
      expect(y0).toBeCloseTo(-50, 4)
    })

    it('inner points are at 45% radius', () => {
      const points = starPoints(100)
      const parts = points.split(' ')
      // Second point (inner): radius = 45
      const [x1, y1] = parts[1].split(',').map(Number)
      const dist = Math.sqrt(x1 * x1 + y1 * y1)
      expect(dist).toBeCloseTo(45, 1)
    })
  })

  describe('hexPointsFlatTop', () => {
    it('produces 6 points', () => {
      const points = hexPointsFlatTop(10)
      expect(points.split(' ').length).toBe(6)
    })
  })

  describe('diamondPointsCompact', () => {
    it('produces 4 points', () => {
      const points = diamondPointsCompact(10)
      expect(points.split(' ').length).toBe(4)
    })

    it('height equals r (not r*1.3)', () => {
      const points = diamondPointsCompact(10)
      const [, y] = points.split(' ')[0].split(',').map(Number)
      expect(y).toBe(-10)
    })
  })

  describe('starPointsRounded', () => {
    it('produces 10 points', () => {
      const points = starPointsRounded(10)
      expect(points.split(' ').length).toBe(10)
    })

    it('inner radius is 50% of outer', () => {
      const points = starPointsRounded(100)
      const parts = points.split(' ')
      const [x1, y1] = parts[1].split(',').map(Number)
      const dist = Math.sqrt(x1 * x1 + y1 * y1)
      expect(dist).toBeCloseTo(50, 0)
    })
  })
})
