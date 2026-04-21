import { describe, it, expect } from 'vitest'
import { computeNodeMeta } from '../computeNodeMeta'

describe('computeNodeMeta', () => {
  it('computes all three properties for an ORGAN node', () => {
    const meta = computeNodeMeta({ type: 'ORGAN', tags: ['sys:core'] })
    expect(meta.matterState).toBe('cristal')
    expect(meta.curtain).toBe('core')
    expect(meta.nature).toBe('permanent')
  })

  it('computes all three properties for a DRIFT node with trace:fresh', () => {
    const meta = computeNodeMeta({ type: 'DRIFT', tags: ['trace:fresh'] })
    expect(meta.matterState).toBe('liquide')
    expect(meta.curtain).toBe(null)
    expect(meta.nature).toBe('incandescent')
  })

  it('computes all three properties for a MUTATION with rejected tag', () => {
    const meta = computeNodeMeta({ type: 'MUTATION', tags: ['rejected'], status: 'rejected' })
    expect(meta.matterState).toBe('vapeur')
    expect(meta.curtain).toBe(null)
    expect(meta.nature).toBe('incandescent')
  })

  it('returns liquide for MUTATION with rejected status but no tag', () => {
    // computeMatterState only inspects tags, not status
    const meta = computeNodeMeta({ type: 'MUTATION', tags: [], status: 'rejected' })
    expect(meta.matterState).toBe('liquide')
    expect(meta.curtain).toBe(null)
    expect(meta.nature).toBe('incandescent')
  })

  it('respects authoritative nature field', () => {
    const meta = computeNodeMeta({ type: 'DRIFT', tags: ['trace:fresh'], nature: 'vivide' })
    expect(meta.nature).toBe('vivide')
  })

  it('returns vivide + liquide + null for a generic node', () => {
    const meta = computeNodeMeta({ type: 'PATTERN', tags: [] })
    expect(meta.matterState).toBe('liquide')
    expect(meta.curtain).toBe(null)
    expect(meta.nature).toBe('vivide')
  })

  it('returns correct values for a sealed axiom', () => {
    const meta = computeNodeMeta({ type: 'AXIOME', tags: ['scelle', 'sys:anchor'] })
    expect(meta.matterState).toBe('cristal')
    expect(meta.curtain).toBe('core')
    expect(meta.nature).toBe('permanent')
  })
})
