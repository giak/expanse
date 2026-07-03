import { describe, it, expect } from 'vitest'
import type {
  TriangulationInput,
  PoleFunction,
  TriangulateAggregator,
} from '../contracts'
import type { PoleResult, TriangulationPole } from '../../types'

describe('triangulation/contracts', () => {
  it('barrel re-exports the contract types from triangulation/index', async () => {
    const barrel = await import('../index')
    expect(barrel).toBeDefined()
    const sample: TriangulationInput = { query: 'is ECS pruning safe?' }
    expect(sample.query).toContain('ECS')
  })

  it('TriangulationInput accepts required query and optional scopeContext', () => {
    const minimal: TriangulationInput = { query: 'global' }
    expect(minimal.scopeContext).toBeUndefined()
    const scoped: TriangulationInput = {
      query: 'kernel ECS',
      scopeContext: ['runtime/', 'src/'],
    }
    expect(scoped.scopeContext).toHaveLength(2)
  })

  it('PoleFunction signature compiles and returns a PoleResult-like Promise', async () => {
    // Toy pole fn: identity pass-through with hardcoded confidence.
    const samplePole: PoleFunction = async (query) => {
      return {
        source: 'anchor' as TriangulationPole,
        data: { echo: query },
        confidence: 0.8,
      }
    }
    const result: PoleResult = await samplePole('test')
    expect(result.source).toBe('anchor')
    expect(result.confidence).toBe(0.8)
  })

  it('all 3 TriangulationPoles are accommodated (anchor|vessel|web)', () => {
    // The PoleResult.source field must accept all 3 values.
    const poles: TriangulationPole[] = ['anchor', 'vessel', 'web']
    expect(poles).toHaveLength(3)
    const poleFn: PoleFunction = async () => ({
      source: poles[0],
      data: null,
      confidence: 0,
    })
    expect(typeof poleFn).toBe('function')
  })

  it('TriangulateAggregator signature compiles with PoleTriple (3 fixed poles)', async () => {
    // Toy aggregator: averages confidences of all 3 poles, empty contradictions/overlap.
    const sampleAggregator: TriangulateAggregator = async (_input, [anchor, vessel, web]) => {
      const results = await Promise.all([
        anchor(_input.query),
        vessel(_input.query),
        web(_input.query),
      ])
      const confidence = results.reduce((s, r) => s + r.confidence, 0) / results.length
      return {
        confidence: confidence * 100,
        sources: results,
        contradictions: [],
        overlap: [],
      }
    }
    const mockTriple: import('../contracts').PoleTriple = [
      async () => ({ source: 'anchor', data: null, confidence: 0.9 }),
      async () => ({ source: 'vessel', data: null, confidence: 0.8 }),
      async () => ({ source: 'web', data: null, confidence: 0.7 }),
    ]
    const result = await sampleAggregator({ query: 'verify' }, mockTriple)
    expect(result.confidence).toBeCloseTo(80)
    expect(result.sources).toHaveLength(3)
  })

  it('PoleResult with error field compiles (failure path)', () => {
    const failure: PoleResult = {
      source: 'web',
      data: null,
      confidence: 0,
      error: 'network timeout',
    }
    expect(failure.error).toBe('network timeout')
    expect(failure.confidence).toBe(0)
  })

  it('empty scopeContext behaves identically to undefined (global scope)', () => {
    const a: TriangulationInput = { query: 'q', scopeContext: [] }
    const b: TriangulationInput = { query: 'q' }
    // Same effective shape — both represent "no scope filter".
    expect(a.scopeContext).toEqual(b.scopeContext ?? [])
  })
})
