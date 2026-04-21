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
    // PERCEIVE is in L0_ACTIVE_PHASES
    expect(aura.l0Radius).toBe(60)
    expect(aura.l0Opacity).toBe(0.15)
  })

  it('returns zero radii for inactive phase', () => {
    const step = makeStep({ organ: 'Σ', label: 'test', phase: 'INIT' })
    // INIT is NOT in L0_ACTIVE_PHASES
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
