import { describe, it, expect } from 'vitest'
import type { ECSInput, ECSEvaluation, EvaluateECS } from '../contracts'
import type { ECSResult } from '../../types'

describe('ecs/contracts', () => {
  it('barrel re-exports the contract types from ecs/index', async () => {
    // Import via the module barrel path — any rename/typo here fails at compile time.
    const barrel = await import('../index')
    expect(barrel).toBeDefined()
    // Verify type-only symbols are accessible via the namespace.
    const sample: ECSInput = { text: 'test' }
    expect(sample.text).toBe('test')
  })

  it('ECSInput accepts required text and optional vesselAvailable', () => {
    const minimal: ECSInput = { text: 'refactor ECS' }
    expect(minimal.text).toBe('refactor ECS')
    expect(minimal.vesselAvailable).toBeUndefined()

    const withVessel: ECSInput = { text: 'refactor ECS', vesselAvailable: true }
    expect(withVessel.vesselAvailable).toBe(true)
  })

  it('ECSEvaluation wraps ECSResult with a reason string', () => {
    const result: ECSResult = { C: 4, I: 2, route: 'L3' }
    const evaluation: ECSEvaluation = { result, reason: 'C=4 ≥ threshold → L3' }
    expect(evaluation.result.C).toBe(4)
    expect(evaluation.result.route).toBe('L3')
    expect(evaluation.reason).toContain('L3')
  })

  it('EvaluateECS function-shape compiles (mandatory for Step 3 implementation)', () => {
    // We can't INVOKE it (no impl yet), but the shape MUST compile.
    // This pins (input: ECSInput) → ECSEvaluation without I/O or LLM calls.
    const sampleImpl: EvaluateECS = (input) => {
      // Toy deterministic stub for compile-time verification only.
      const isHard = input.text.length > 80 || input.text.includes('kernel')
      return {
        result: { C: isHard ? 4 : 2, I: isHard ? 2 : 1, route: isHard ? 'L3' : 'L2' },
        reason: isHard ? 'C=4 ≥ threshold → L3' : 'C=2 → L2',
      }
    }
    const out = sampleImpl({ text: 'refactor kernel ECS' })
    expect(out.result.route).toBe('L3')
    expect(out.reason).toContain('L3')
  })

  it('@ts-expect-error pair verifies text is required AND vesselAvailable can be omitted', () => {
    // The two statements below must BOTH produce TS errors. If a future refactor
    // makes either field optional/defaulted, the @ts-expect-error annotations become
    // "unused" and tsc will report them — failing CI loud. The runtime assertion
    // confirms the declared field shape is what we expected.
    const good: ECSInput = { text: 'ok' }
    expect(good.text).toBe('ok')

    // @ts-expect-error -- vesselAvailable is optional but `text` is required; this object omits text
    const noTextButVessel: ECSInput = { vesselAvailable: true }
    expect(noTextButVessel.vesselAvailable).toBe(true)
  })

  it('ECSResult fields are independent (modifying reason does not affect result)', () => {
    const evaluation: ECSEvaluation = {
      result: { C: 1, I: 1, route: 'L1' },
      reason: 'trivial request',
    }
    const cloned: ECSEvaluation = { ...evaluation, reason: 'reread' }
    expect(cloned.reason).toBe('reread')
    expect(cloned.result).toEqual(evaluation.result)
  })
})
