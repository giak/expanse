import { describe, it, expect } from 'vitest'
import { deriveAuraState, accumulateScenarioContext, buildScenarioContextUpTo } from '../scenarioContext'
import type { ProcessStep } from '../../types/signal'
import { INITIAL_SCENARIO_CONTEXT } from '../../types/aura'

// Helper to create a minimal step
function makeStep(overrides: Partial<ProcessStep> & { organ: string; label: string }): ProcessStep {
  return { duration: 1000, ...overrides }
}

describe('accumulateScenarioContext', () => {
  it('returns initial context unchanged for a step with no side effects', () => {
    const step = makeStep({ organ: 'Σ', label: 'idle', phase: 'IDLE' })
    const ctx = accumulateScenarioContext(INITIAL_SCENARIO_CONTEXT, step)
    // cortexItemCount and fissure should not change for a plain IDLE step
    expect(ctx.cortexItemCount).toBe(0)
    expect(ctx.fissure).toBe(false)
  })

  it('increments cortexItemCount for MCP search in MEMORY phase', () => {
    const step = makeStep({
      organ: 'Μ', label: 'search', phase: 'MEMORY',
      mcpOperation: { type: 'search', toolName: 'search_memory', targetNodeIds: [], resultCount: 3 },
    })
    const ctx = accumulateScenarioContext(INITIAL_SCENARIO_CONTEXT, step)
    expect(ctx.cortexItemCount).toBe(1)
    expect(ctx.budget.l1Tokens).toBe(1500) // 3 * 500
  })

  it('increments cortexItemCount for Μ MEMORY without mcpOperation', () => {
    const step = makeStep({ organ: 'Μ', label: 'memory', phase: 'MEMORY' })
    const ctx = accumulateScenarioContext(INITIAL_SCENARIO_CONTEXT, step)
    expect(ctx.cortexItemCount).toBe(1)
    expect(ctx.budget.l1Tokens).toBe(500)
  })

  it('sets fissure on BLOCK phase', () => {
    const step = makeStep({ organ: 'Ψ', label: 'block', phase: 'BLOCK' })
    const ctx = accumulateScenarioContext(INITIAL_SCENARIO_CONTEXT, step)
    expect(ctx.fissure).toBe(true)
  })

  it('decrements cortexItemCount on ELAGAGE with DELETE badge', () => {
    const prevCtx = { ...INITIAL_SCENARIO_CONTEXT, cortexItemCount: 5, budget: { ...INITIAL_SCENARIO_CONTEXT.budget, l1Tokens: 2500 } }
    const step = makeStep({ organ: 'Μ', label: 'elagage', phase: 'ELAGAGE', badge: '3 DELETED' })
    const ctx = accumulateScenarioContext(prevCtx, step)
    expect(ctx.cortexItemCount).toBe(2)
    expect(ctx.budget.l1Tokens).toBe(1000)
  })

  it('does not decrement cortexItemCount below 0', () => {
    const step = makeStep({ organ: 'Μ', label: 'elagage', phase: 'ELAGAGE', badge: '10 DELETED' })
    const ctx = accumulateScenarioContext(INITIAL_SCENARIO_CONTEXT, step)
    expect(ctx.cortexItemCount).toBe(0)
    expect(ctx.budget.l1Tokens).toBe(0)
  })

  it('sets L0 tokens on first active phase', () => {
    const step = makeStep({ organ: 'Σ', label: 'perceive', phase: 'PERCEIVE' })
    const ctx = accumulateScenarioContext(INITIAL_SCENARIO_CONTEXT, step)
    expect(ctx.budget.l0Tokens).toBe(3000)
  })

  it('computes dynamicActivity from tool calls', () => {
    const step = makeStep({ organ: 'Φ', label: 'audit', phase: 'AUDIT', toolCalls: ['read_file(x)', 'grep(y)'] })
    const ctx = accumulateScenarioContext(INITIAL_SCENARIO_CONTEXT, step)
    expect(ctx.dynamicActivity).toBe(0.5) // 0.25 * 2 = 0.5
  })

  it('computes L2 tokens from tool calls', () => {
    const step = makeStep({ organ: 'Φ', label: 'audit', phase: 'AUDIT', toolCalls: ['read_file(x)'] })
    const ctx = accumulateScenarioContext(INITIAL_SCENARIO_CONTEXT, step)
    expect(ctx.budget.l2Tokens).toBe(2000) // 1 * 2000
  })
})

describe('buildScenarioContextUpTo', () => {
  it('accumulates context across multiple steps', () => {
    const steps: ProcessStep[] = [
      makeStep({ organ: 'Μ', label: 'memory', phase: 'MEMORY' }),
      makeStep({ organ: 'Μ', label: 'recall', phase: 'RECALL', mcpOperation: { type: 'search', toolName: 'search_memory', targetNodeIds: [], resultCount: 2 } }),
      makeStep({ organ: 'Ψ', label: 'block', phase: 'BLOCK' }),
    ]
    const ctx = buildScenarioContextUpTo(steps, 2)
    expect(ctx.cortexItemCount).toBe(2) // MEMORY + RECALL
    expect(ctx.fissure).toBe(true) // BLOCK
  })

  it('returns initial context for empty steps array', () => {
    const ctx = buildScenarioContextUpTo([], 0)
    expect(ctx.cortexItemCount).toBe(0)
  })

  it('returns initial context for negative stepIdx', () => {
    const ctx = buildScenarioContextUpTo([], -1)
    expect(ctx.cortexItemCount).toBe(0)
  })
})

describe('deriveAuraState', () => {
  it('returns L0 aura for active phase', () => {
    const step = makeStep({ organ: 'Σ', label: 'test', phase: 'PERCEIVE' })
    const ctx = { ...INITIAL_SCENARIO_CONTEXT, budget: { ...INITIAL_SCENARIO_CONTEXT.budget } }
    const aura = deriveAuraState(step, ctx)
    // L0 actif dès que boot-seed lu (toute phase ≠ INIT, EPIC §Ⅸ)
    expect(aura.l0Radius).toBe(60)
    expect(aura.l0Opacity).toBe(0.15)
  })

  it('returns zero radii for inactive phase', () => {
    const step = makeStep({ organ: 'Σ', label: 'test', phase: 'INIT' })
    // L0 inactif en phase INIT (EPIC §Ⅸ : substrat pas encore lu)
    const ctx = { ...INITIAL_SCENARIO_CONTEXT, budget: { ...INITIAL_SCENARIO_CONTEXT.budget } }
    const aura = deriveAuraState(step, ctx)
    expect(aura.l0Radius).toBe(0)
    expect(aura.l0Opacity).toBe(0)
  })

  it('returns L1 aura when cortexItemCount > 0', () => {
    const step = makeStep({ organ: 'Σ', label: 'test', phase: 'PERCEIVE' })
    const ctx = { cortexItemCount: 3, dynamicActivity: 0, fissure: false, budget: { ...INITIAL_SCENARIO_CONTEXT.budget } }
    const aura = deriveAuraState(step, ctx)
    expect(aura.l1Radius).toBe(60 + 3 * 15) // 105
    expect(aura.l1Opacity).toBeCloseTo(0.25, 2) // 0.1 + 3 * 0.05
  })

  it('returns L2 aura when dynamicActivity > 0', () => {
    const step = makeStep({ organ: 'Σ', label: 'test', phase: 'PERCEIVE' })
    const ctx = { cortexItemCount: 0, dynamicActivity: 0.5, fissure: false, budget: { ...INITIAL_SCENARIO_CONTEXT.budget } }
    const aura = deriveAuraState(step, ctx)
    expect(aura.l2Radius).toBe(60 + 0.5 * 50) // 85
    expect(aura.l2Opacity).toBeCloseTo(0.175, 2) // 0.1 + 0.5 * 0.15
  })

  it('returns L2 max when cortexItemCount=4 and dynamicActivity=1 (regression for EPIC §Ⅸ unconditional base)', () => {
    // L2 formula: (L1_RADIUS_BASE + count * L1_RADIUS_PER_ITEM) + activity * L2_RADIUS_PER_ACTIVITY
    // = 60 + 4*15 + 1*50 = 170. Locks in that L2 base is unconditional within l2Active
    // (not gated on l1Active — would have collapsed to 50 if gated on l1Radius).
    const step = makeStep({ organ: 'Σ', label: 'test', phase: 'PERCEIVE' })
    const ctx = { cortexItemCount: 4, dynamicActivity: 1, fissure: false, budget: { ...INITIAL_SCENARIO_CONTEXT.budget } }
    const aura = deriveAuraState(step, ctx)
    expect(aura.l2Radius).toBe(170)
    expect(aura.l2Opacity).toBeCloseTo(0.25, 2) // 0.1 + 1 * 0.15
  })

  it('returns zero L2 when dynamicActivity = 0 (l2Active gated on activity, EPIC §Ⅸ)', () => {
    const step = makeStep({ organ: 'Σ', label: 'test', phase: 'PERCEIVE' })
    const ctx = { cortexItemCount: 3, dynamicActivity: 0, fissure: false, budget: { ...INITIAL_SCENARIO_CONTEXT.budget } }
    const aura = deriveAuraState(step, ctx)
    expect(aura.l2Radius).toBe(0)
    expect(aura.l2Opacity).toBe(0)
    // l1 still grows independently
    expect(aura.l1Radius).toBe(60 + 3 * 15) // 105
  })

  it('returns 60 + 2*15 + 0.3*50 = 105 for intermediate L2 (locks EPIC §Ⅸ unconditional base)', () => {
    // Exercises both axes simultaneously — covers the case where a future
    // refactor that re-gates l2Radius on l1Active would emit a different value
    // (gated on l1Radius would give 0.3 * 50 = 15 instead of 105).
    const step = makeStep({ organ: 'Σ', label: 'test', phase: 'PERCEIVE' })
    const ctx = { cortexItemCount: 2, dynamicActivity: 0.3, fissure: false, budget: { ...INITIAL_SCENARIO_CONTEXT.budget } }
    const aura = deriveAuraState(step, ctx)
    // L1 axes (independent of L2)
    expect(aura.l1Radius).toBe(60 + 2 * 15) // 90 (per-item = 15)
    expect(aura.l1Opacity).toBeCloseTo(0.1 + 2 * 0.05, 2) // 0.20 (per-item = 0.05, NOT 15)
    // L2 axes (unconditional base + activity increment)
    expect(aura.l2Radius).toBe(60 + 2 * 15 + 0.3 * 50) // 105
    expect(aura.l2Opacity).toBeCloseTo(0.1 + 0.3 * 0.15, 2) // 0.145
  })

  it('returns zero L2 during phase-transition steps with no tool calls (locks l2Active tightening)', () => {
    // SEED is a phase-transition step with no tool calls → dynamicActivity stays 0
    // even though step.organ is set. Per EPIC §Ⅸ "L2 apparaît avec l'activité dynamique",
    // L2 must NOT appear. Locks in the dropped `|| step.organ !== undefined` fallback.
    const step = makeStep({ organ: 'Μ', label: 'boot-seed', phase: 'SEED' })
    const ctx = { ...INITIAL_SCENARIO_CONTEXT, budget: { ...INITIAL_SCENARIO_CONTEXT.budget } }
    const aura = deriveAuraState(step, ctx)
    expect(aura.l2Radius).toBe(0)
    expect(aura.l2Opacity).toBe(0)
    // L0 still lit (SEED ≠ INIT) and L1 still null (cortexItemCount=0)
    expect(aura.l0Radius).toBe(60)
    expect(aura.l1Radius).toBe(0)
  })

  it('computes pulseSpeed from dynamicActivity', () => {
    const step = makeStep({ organ: 'Σ', label: 'test', phase: 'PERCEIVE' })
    const ctx1 = { ...INITIAL_SCENARIO_CONTEXT, dynamicActivity: 0.8 }
    expect(deriveAuraState(step, ctx1).pulseSpeed).toBe(0.2) // > 0.7

    const ctx2 = { ...INITIAL_SCENARIO_CONTEXT, dynamicActivity: 0.5 }
    expect(deriveAuraState(step, ctx2).pulseSpeed).toBe(0.35) // > 0.3

    const ctx3 = { ...INITIAL_SCENARIO_CONTEXT, dynamicActivity: 0.1 }
    expect(deriveAuraState(step, ctx3).pulseSpeed).toBe(0.5) // <= 0.3
  })

  it('propagates fissure from context', () => {
    const step = makeStep({ organ: 'Σ', label: 'test', phase: 'PERCEIVE' })
    const ctx = { ...INITIAL_SCENARIO_CONTEXT, fissure: true }
    const aura = deriveAuraState(step, ctx)
    expect(aura.fissure).toBe(true)
  })
})
