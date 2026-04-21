import { describe, it, expect } from 'vitest'
import { computeNature, computeNatureMap } from '../computeNature'
// JsonNode import removed — computeNatureMap uses it but we provide minimal fixtures

describe('computeNature', () => {
  // ─── Priority 1: node.nature field (v5 JSON, authoritative) ───

  it('returns node.nature when it is a valid MemoryNature', () => {
    expect(computeNature({ type: 'ORGAN', tags: [], nature: 'permanent' })).toBe('permanent')
    expect(computeNature({ type: 'MUTATION', tags: [], nature: 'vivide' })).toBe('vivide')
    expect(computeNature({ type: 'DRIFT', tags: [], nature: 'incandescent' })).toBe('incandescent')
    expect(computeNature({ type: 'EXTENSION', tags: [], nature: 'volatile' })).toBe('volatile')
  })

  it('ignores invalid node.nature and falls through to tag heuristic', () => {
    // "invalid" is not a valid MemoryNature → falls through
    expect(computeNature({ type: 'DRIFT', tags: ['trace:fresh'], nature: 'invalid' })).toBe('incandescent')
  })

  // ─── Priority 2: Tag-based heuristic ───

  it('returns incandescent for trace:fresh tag', () => {
    expect(computeNature({ type: 'DRIFT', tags: ['trace:fresh'] })).toBe('incandescent')
  })

  it('returns incandescent for sys:drift tag', () => {
    expect(computeNature({ type: 'DRIFT', tags: ['sys:drift'] })).toBe('incandescent')
  })

  it('returns volatile for sys:pattern:candidate tag', () => {
    expect(computeNature({ type: 'PATTERN', tags: ['sys:pattern:candidate'] })).toBe('volatile')
  })

  it('returns volatile for proposal tag', () => {
    expect(computeNature({ type: 'MUTATION', tags: ['proposal'] })).toBe('volatile')
  })

  it('returns volatile for sys:extension tag', () => {
    expect(computeNature({ type: 'EXTENSION', tags: ['sys:extension'] })).toBe('volatile')
  })

  it('returns permanent for scelle tag', () => {
    expect(computeNature({ type: 'AXIOME', tags: ['scelle'] })).toBe('permanent')
  })

  it('returns permanent for sys:anchor tag', () => {
    expect(computeNature({ type: 'AXIOME', tags: ['sys:anchor'] })).toBe('permanent')
  })

  it('returns permanent for sys:core tag', () => {
    expect(computeNature({ type: 'AXIOME', tags: ['sys:core'] })).toBe('permanent')
  })

  // ─── Mutation status overrides ───

  it('returns incandescent for MUTATION with status=rejected', () => {
    expect(computeNature({ type: 'MUTATION', tags: [], status: 'rejected' })).toBe('incandescent')
  })

  it('returns volatile for MUTATION with status=rolled_back', () => {
    expect(computeNature({ type: 'MUTATION', tags: [], status: 'rolled_back' })).toBe('volatile')
  })

  // ─── Priority 3: Type-based defaults ───

  it('returns permanent for ORGAN type', () => {
    expect(computeNature({ type: 'ORGAN', tags: [] })).toBe('permanent')
  })

  it('returns permanent for APEX type', () => {
    expect(computeNature({ type: 'APEX', tags: [] })).toBe('permanent')
  })

  it('returns permanent for AXIOME type', () => {
    expect(computeNature({ type: 'AXIOME', tags: [] })).toBe('permanent')
  })

  it('returns vivide for PATTERN type', () => {
    expect(computeNature({ type: 'PATTERN', tags: [] })).toBe('vivide')
  })

  it('returns vivide for MUTATION type (default, no status override)', () => {
    expect(computeNature({ type: 'MUTATION', tags: [] })).toBe('vivide')
  })

  it('returns incandescent for DRIFT type', () => {
    expect(computeNature({ type: 'DRIFT', tags: [] })).toBe('incandescent')
  })

  it('returns volatile for EXTENSION type', () => {
    expect(computeNature({ type: 'EXTENSION', tags: [] })).toBe('volatile')
  })

  it('returns vivide as fallback for unknown type', () => {
    expect(computeNature({ type: 'UNKNOWN', tags: [] })).toBe('vivide')
  })
})

describe('computeNatureMap', () => {
  it('builds a Map from node array', () => {
    const nodes = [
      { id: 'n1', label: 'Σ', type: 'ORGAN', tags: [] as string[], centrality: 1, content: '', created_at: '', nature: '', status: null, parent_organ: null, sort_key: 0, outcome: null },
      { id: 'n2', label: 'sec-1', type: 'DRIFT', tags: ['trace:fresh'], centrality: 0.5, content: '', created_at: '', nature: '', status: null, parent_organ: null, sort_key: 0, outcome: null },
    ]
    const map = computeNatureMap(nodes)
    expect(map.get('n1')).toBe('permanent')
    expect(map.get('n2')).toBe('incandescent')
  })

  it('returns empty map for empty array', () => {
    const map = computeNatureMap([])
    expect(map.size).toBe(0)
  })
})
