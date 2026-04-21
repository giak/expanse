import { describe, it, expect } from 'vitest'
import type { StaticEffectContext } from '../types'
import type { ProcessStep } from '../../../../../types/signal'
import { requireStep, assertNonNull, hasEff } from '../strategies/shared'
import { ALL_STRATEGIES } from '../strategies/index'

// ─── Test fixtures ───

function makeStep(overrides: Partial<ProcessStep> & { organ: string; label: string }): ProcessStep {
  return { duration: 1000, phase: 'PERCEIVE', ...overrides }
}

function makeCtx(overrides: Partial<StaticEffectContext> = {}): StaticEffectContext {
  return {
    step: null,
    stepIdx: 0,
    isInertie: false,
    phaseCol: '#89b4fa',
    scenarioRoute: 'boot',
    isDreamMode: false,
    dreamSeason: 'spring',
    organPositions: new Map([
      ['Σ', { x: 0, y: 0 }],
      ['Ψ', { x: 100, y: 0 }],
      ['Φ', { x: 200, y: 0 }],
      ['Ω', { x: 300, y: 0 }],
      ['Μ', { x: 400, y: 0 }],
    ]),
    canvasHighlight: null,
    ...overrides,
  }
}

// ─── requireStep ───

describe('requireStep', () => {
  it('returns ctx with step narrowed to non-null when step is present', () => {
    const step = makeStep({ organ: 'Σ', label: 'test', phase: 'PERCEIVE' })
    const ctx = makeCtx({ step })
    const result = requireStep(ctx)
    expect(result.step).toBe(step)
    expect(result.step.organ).toBe('Σ')
  })

  it('throws descriptive error when step is null', () => {
    const ctx = makeCtx({ step: null })
    expect(() => requireStep(ctx)).toThrow('Strategy rendered without step')
  })

  it('throws when step is undefined', () => {
    const ctx = makeCtx({ step: undefined as unknown as ProcessStep })
    expect(() => requireStep(ctx)).toThrow('Strategy rendered without step')
  })
})

// ─── assertNonNull ───

describe('assertNonNull', () => {
  it('returns value when non-null', () => {
    expect(assertNonNull('hello', 'label')).toBe('hello')
    expect(assertNonNull(42, 'label')).toBe(42)
    expect(assertNonNull(0, 'label')).toBe(0)
    expect(assertNonNull(false, 'label')).toBe(false)
  })

  it('throws for null', () => {
    expect(() => assertNonNull(null, 'step.ecsFork')).toThrow('Expected step.ecsFork to be non-null but got null')
  })

  it('throws for undefined', () => {
    expect(() => assertNonNull(undefined, 'step.packetFlows')).toThrow('Expected step.packetFlows to be non-null but got undefined')
  })

  it('includes label in error message', () => {
    try {
      assertNonNull(null, 'myProp')
    } catch (e) {
      expect((e as Error).message).toContain('myProp')
    }
  })
})

// ─── hasEff ───

describe('hasEff', () => {
  it('returns true when effect is in step.visualEffects', () => {
    const step = makeStep({ organ: 'Ψ', label: 'audit', phase: 'AUDIT', visualEffects: ['audit-loop', 'tool-flash'] })
    const ctx = makeCtx({ step })
    expect(hasEff(ctx, 'audit-loop')).toBe(true)
    expect(hasEff(ctx, 'tool-flash')).toBe(true)
  })

  it('returns false when effect is not in visualEffects', () => {
    const step = makeStep({ organ: 'Ψ', label: 'audit', phase: 'AUDIT', visualEffects: ['audit-loop'] })
    const ctx = makeCtx({ step })
    expect(hasEff(ctx, 'dream-gate')).toBe(false)
  })

  it('returns false when step is null', () => {
    const ctx = makeCtx({ step: null })
    expect(hasEff(ctx, 'audit-loop')).toBe(false)
  })

  it('returns false when visualEffects is undefined', () => {
    const step = makeStep({ organ: 'Ψ', label: 'audit', phase: 'AUDIT' })
    const ctx = makeCtx({ step })
    expect(hasEff(ctx, 'audit-loop')).toBe(false)
  })

  it('returns false when visualEffects is empty', () => {
    const step = makeStep({ organ: 'Ψ', label: 'audit', phase: 'AUDIT', visualEffects: [] })
    const ctx = makeCtx({ step })
    expect(hasEff(ctx, 'audit-loop')).toBe(false)
  })
})

// ─── Strategy registry invariants ───

describe('Strategy registry invariants', () => {
  it('every strategy has a test function', () => {
    for (const s of ALL_STRATEGIES) {
      expect(typeof s.test, `Strategy ${s.id} missing test()`).toBe('function')
    }
  })

  it('every strategy has a render function', () => {
    for (const s of ALL_STRATEGIES) {
      expect(typeof s.render, `Strategy ${s.id} missing render()`).toBe('function')
    }
  })

  it('every strategy has a unique id', () => {
    const ids = ALL_STRATEGIES.map(s => s.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size, `Duplicate strategy ids found`).toBe(ids.length)
  })

  it('every strategy has a valid layer', () => {
    const validLayers = new Set(['bg', 'mid', 'fg', 'overlay'])
    for (const s of ALL_STRATEGIES) {
      expect(validLayers.has(s.layer), `Strategy ${s.id} has invalid layer "${s.layer}"`).toBe(true)
    }
  })

  it('organDendrites returns false when step is null', () => {
    const nullCtx = makeCtx({ step: null })
    const dendrites = ALL_STRATEGIES.find(s => s.id === 'organ-dendrites')
    expect(dendrites?.test(nullCtx, 0.5)).toBe(false)
  })

  it('strategies that access ctx.step.organ are gated by !!ctx.step in test()', () => {
    // Any strategy that uses requireStep in render() must have a test() that
    // checks !!ctx.step or ctx.step?.something — otherwise requireStep would throw
    const nullCtx = makeCtx({ step: null })
    for (const s of ALL_STRATEGIES) {
      // If test returns true with null step, render would crash (requireStep throws)
      const shouldRender = s.test(nullCtx, 0.5)
      if (shouldRender) {
        // This is OK only if the strategy doesn't use requireStep (e.g. neuralBridge
        // doesn't need step, just isDreamMode)
        expect(s.id, `Strategy ${s.id} test()=true with null step — may crash in render()`).toMatch(/^neural-bridge$/)
      }
    }
  })
})
