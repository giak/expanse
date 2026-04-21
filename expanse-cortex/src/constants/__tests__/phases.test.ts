import { describe, it, expect } from 'vitest'
import { phaseColorWithFallback, PHASE_COLORS, DREAM_PHASES } from '../phases'

describe('phaseColorWithFallback', () => {
  it('returns the correct color for known phases', () => {
    expect(phaseColorWithFallback('INIT')).toBe('#89b4fa')
    expect(phaseColorWithFallback('APEX')).toBe('#cba6f7')
    expect(phaseColorWithFallback('BLOCK')).toBe('#f38ba8')
    expect(phaseColorWithFallback('EMIT')).toBe('#cba6f7')
  })

  it('returns route palette color for unknown phase with route', () => {
    expect(phaseColorWithFallback('UNKNOWN', 'L1')).toBe('#a6e3a1')
    expect(phaseColorWithFallback('UNKNOWN', 'L2')).toBe('#f9e2af')
    expect(phaseColorWithFallback('UNKNOWN', 'L3')).toBe('#f38ba8')
    expect(phaseColorWithFallback('UNKNOWN', 'DREAM')).toBe('#cba6f7')
  })

  it('returns default blue for undefined phase without route', () => {
    expect(phaseColorWithFallback(undefined)).toBe('#89b4fa')
  })

  it('returns default blue for undefined phase with unknown route', () => {
    expect(phaseColorWithFallback(undefined, 'UNKNOWN')).toBe('#89b4fa')
  })

  it('returns default blue for unknown phase without route', () => {
    expect(phaseColorWithFallback('NONEXISTENT')).toBe('#89b4fa')
  })

  it('known phase takes precedence over route', () => {
    // INIT is #89b4fa, not the L2 route color
    expect(phaseColorWithFallback('INIT', 'L2')).toBe('#89b4fa')
  })
})

describe('DREAM_PHASES', () => {
  it('contains all 7 dream phases', () => {
    expect(DREAM_PHASES.size).toBe(7)
    expect(DREAM_PHASES.has('DREAM_INIT')).toBe(true)
    expect(DREAM_PHASES.has('WINTER')).toBe(true)
    expect(DREAM_PHASES.has('FRESH_COUNT')).toBe(true)
    expect(DREAM_PHASES.has('DEGEL')).toBe(true)
    expect(DREAM_PHASES.has('LINTER')).toBe(true)
    expect(DREAM_PHASES.has('EMERGENCE')).toBe(true)
    expect(DREAM_PHASES.has('ELAGAGE')).toBe(true)
  })

  it('does not contain non-dream phases', () => {
    expect(DREAM_PHASES.has('INIT')).toBe(false)
    expect(DREAM_PHASES.has('EMIT')).toBe(false)
    expect(DREAM_PHASES.has('AUDIT')).toBe(false)
  })
})

describe('PHASE_COLORS', () => {
  it('has a color for every phase in PHASE_COLORS', () => {
    const keys = Object.keys(PHASE_COLORS)
    expect(keys.length).toBeGreaterThan(20)
    // All colors should be hex format
    for (const [, color] of Object.entries(PHASE_COLORS)) {
      expect(color).toMatch(/^#[0-9a-f]{6}$/)
    }
  })
})
