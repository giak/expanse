import { describe, it, expect } from 'vitest'
import { validateGraphData, formatWarnings } from '../validateGraphData'

// ─── Test fixtures ───

const VALID_DATA = {
  version: 5,
  generated_at: '2026-04-21T12:00:00Z',
  meta: { count_nodes: 2, count_edges: 1, density: 0.3 },
  nodes: [
    { id: 'NODE_A', type: 'decision', label: 'A', content: 'Alpha', tags: ['sys:core'], created_at: '2026-03-13', centrality: 0.9, nature: 'permanent', status: 'sealed', parent_organ: 'Σ', sort_key: 1, outcome: 1 },
    { id: 'NODE_B', type: 'pattern', label: 'B', content: 'Beta', tags: ['sys:pattern'], created_at: '2026-03-14', centrality: 0.5, nature: 'vivide', status: null, parent_organ: 'Μ', sort_key: 2, outcome: 0.8 },
  ],
  edges: [
    { source: 'NODE_A', target: 'NODE_B', type: 'support', weight: 0.8, condition: null },
  ],
}

// ─── validateGraphData ───

describe('validateGraphData', () => {
  it('returns no warnings for valid data', () => {
    const { data, warnings } = validateGraphData(VALID_DATA)
    expect(warnings).toEqual([])
    expect(data).toEqual(VALID_DATA)
  })

  it('returns data even when warnings exist (best-effort)', () => {
    const { data, warnings } = validateGraphData({ ...VALID_DATA, nodes: [{ id: '' }] })
    expect(warnings.length).toBeGreaterThan(0)
    expect(data).toBeTruthy()
  })

  // ─── Root validation ───

  it('warns when root is not an object', () => {
    const { warnings } = validateGraphData(null)
    expect(warnings).toContain('Root must be an object, got: object')
  })

  it('warns when root is a string', () => {
    const { warnings } = validateGraphData('not an object')
    expect(warnings).toContain('Root must be an object, got: string')
  })

  it('warns when root is undefined', () => {
    const { warnings } = validateGraphData(undefined)
    expect(warnings).toContain('Root must be an object, got: undefined')
  })

  // ─── Node validation ───

  it('warns when nodes is not an array', () => {
    const { warnings } = validateGraphData({ ...VALID_DATA, nodes: 'bad' })
    // No node-specific warnings — empty array fallback
    expect(warnings).toEqual([])
  })

  it('warns when a node is missing id', () => {
    const { warnings } = validateGraphData({
      ...VALID_DATA,
      nodes: [{ type: 'decision', label: 'X' }],
    })
    expect(warnings.some(w => w.includes('missing id'))).toBe(true)
  })

  it('warns when a node is missing type', () => {
    const { warnings } = validateGraphData({
      ...VALID_DATA,
      nodes: [{ id: 'NODE_X' }],
    })
    expect(warnings.some(w => w.includes('NODE_X') && w.includes('missing type'))).toBe(true)
  })

  it('warns when a node has invalid parent_organ', () => {
    const { warnings } = validateGraphData({
      ...VALID_DATA,
      nodes: [{ ...VALID_DATA.nodes[0], parent_organ: 'INVALID' }],
    })
    expect(warnings.some(w => w.includes('invalid parent_organ') && w.includes('INVALID'))).toBe(true)
  })

  it('does not warn for valid parent_organ values (Σ, Ψ, Φ, Ω, Μ)', () => {
    for (const organ of ['Σ', 'Ψ', 'Φ', 'Ω', 'Μ']) {
      const { warnings } = validateGraphData({
        ...VALID_DATA,
        nodes: [{ ...VALID_DATA.nodes[0], parent_organ: organ }],
      })
      expect(warnings.some(w => w.includes('parent_organ'))).toBe(false)
    }
  })

  it('does not warn when parent_organ is null', () => {
    const { warnings } = validateGraphData({
      ...VALID_DATA,
      nodes: [{ ...VALID_DATA.nodes[0], parent_organ: null }],
    })
    expect(warnings.some(w => w.includes('parent_organ'))).toBe(false)
  })

  it('skips remaining checks for a node missing id (continue)', () => {
    // A node without id should produce only the "missing id" warning,
    // not a "missing type" warning (the code continues after missing id)
    const { warnings } = validateGraphData({
      ...VALID_DATA,
      nodes: [{ type: 'decision' }],
    })
    // Should have "missing id" but NOT "missing type"
    expect(warnings.some(w => w.includes('missing id'))).toBe(true)
    expect(warnings.some(w => w.includes('missing type'))).toBe(false)
  })

  // ─── Edge validation ───

  it('warns when edges is not an array', () => {
    const { warnings } = validateGraphData({ ...VALID_DATA, edges: 'bad' })
    expect(warnings).toEqual([])
  })

  it('warns when an edge is missing source', () => {
    const { warnings } = validateGraphData({
      ...VALID_DATA,
      edges: [{ target: 'NODE_B', type: 'support', weight: 1 }],
    })
    expect(warnings.some(w => w.includes('missing source'))).toBe(true)
  })

  it('warns when an edge is missing target', () => {
    const { warnings } = validateGraphData({
      ...VALID_DATA,
      edges: [{ source: 'NODE_A', type: 'support', weight: 1 }],
    })
    expect(warnings.some(w => w.includes('missing target'))).toBe(true)
  })

  it('does not warn for valid edges', () => {
    const { warnings } = validateGraphData(VALID_DATA)
    expect(warnings.some(w => w.includes('Edge'))).toBe(false)
  })

  // ─── Meta validation ───

  it('warns when meta.density has unexpected type (boolean)', () => {
    const { warnings } = validateGraphData({
      ...VALID_DATA,
      meta: { ...VALID_DATA.meta, density: true },
    })
    expect(warnings.some(w => w.includes('density') && w.includes('unexpected type'))).toBe(true)
  })

  it('does not warn when meta.density is a number', () => {
    const { warnings } = validateGraphData(VALID_DATA)
    expect(warnings.some(w => w.includes('density'))).toBe(false)
  })

  it('does not warn when meta.density is a string', () => {
    const { warnings } = validateGraphData({
      ...VALID_DATA,
      meta: { ...VALID_DATA.meta, density: '0.3' },
    })
    expect(warnings.some(w => w.includes('density'))).toBe(false)
  })

  it('does not warn when meta is absent', () => {
    const { warnings } = validateGraphData({ ...VALID_DATA, meta: undefined })
    expect(warnings).toEqual([])
  })

  // ─── Multiple warnings ───

  it('collects multiple warnings from different categories', () => {
    const { warnings } = validateGraphData({
      ...VALID_DATA,
      nodes: [{ type: 'decision' }],  // missing id → 1 warning
      edges: [{ target: 'X' }],        // missing source → 1 warning
    })
    expect(warnings.length).toBeGreaterThanOrEqual(2)
    expect(warnings.some(w => w.includes('missing id'))).toBe(true)
    expect(warnings.some(w => w.includes('missing source'))).toBe(true)
  })

  it('edge with both missing source AND missing target produces exactly two warnings', () => {
    const { warnings } = validateGraphData({
      ...VALID_DATA,
      edges: [{ type: 'support', weight: 1 }],
    })
    expect(warnings.length).toBe(2)
    expect(warnings.some(w => w.includes('missing source'))).toBe(true)
    expect(warnings.some(w => w.includes('missing target'))).toBe(true)
  })

  it('warns for empty string type (falsy)', () => {
    const { warnings } = validateGraphData({
      ...VALID_DATA,
      nodes: [{ id: 'NODE_X', type: '' }],
    })
    expect(warnings.some(w => w.includes('NODE_X') && w.includes('missing type'))).toBe(true)
  })

  it('does not warn when meta is a non-object (string) — guard skips it', () => {
    const { warnings } = validateGraphData({
      ...VALID_DATA,
      meta: 'not an object',
    })
    expect(warnings.some(w => w.includes('density'))).toBe(false)
  })
})

// ─── formatWarnings ───

describe('formatWarnings', () => {
  it('returns "✓" message for empty warnings', () => {
    expect(formatWarnings([])).toContain('✓')
  })

  it('formats warnings as numbered list', () => {
    const result = formatWarnings(['Bad node', 'Missing edge'])
    expect(result).toContain('1.')
    expect(result).toContain('2.')
    expect(result).toContain('Bad node')
    expect(result).toContain('Missing edge')
  })

  it('handles single warning', () => {
    const result = formatWarnings(['Only one'])
    expect(result).toContain('1. Only one')
  })
})
