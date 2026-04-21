import { describe, it, expect } from 'vitest'
import { computeMatterState, computeCurtain } from '../matterState'

describe('computeMatterState', () => {
  it('returns cristal for scelle tag', () => {
    expect(computeMatterState({ type: 'AXIOME', tags: ['scelle'] })).toBe('cristal')
  })

  it('returns cristal for sys:anchor tag', () => {
    expect(computeMatterState({ type: 'AXIOME', tags: ['sys:anchor'] })).toBe('cristal')
  })

  it('returns cristal for sys:core tag', () => {
    expect(computeMatterState({ type: 'AXIOME', tags: ['sys:core'] })).toBe('cristal')
  })

  it('returns cristal for ORGAN type', () => {
    expect(computeMatterState({ type: 'ORGAN', tags: [] })).toBe('cristal')
  })

  it('returns cristal for APEX type', () => {
    expect(computeMatterState({ type: 'APEX', tags: [] })).toBe('cristal')
  })

  it('returns vapeur for proposal tag', () => {
    expect(computeMatterState({ type: 'PATTERN', tags: ['proposal'] })).toBe('vapeur')
  })

  it('returns vapeur for candidate tag', () => {
    expect(computeMatterState({ type: 'PATTERN', tags: ['candidate'] })).toBe('vapeur')
  })

  it('returns vapeur for extension tag', () => {
    expect(computeMatterState({ type: 'EXTENSION', tags: ['extension'] })).toBe('vapeur')
  })

  it('returns vapeur for rejected tag', () => {
    expect(computeMatterState({ type: 'MUTATION', tags: ['rejected'] })).toBe('vapeur')
  })

  it('returns vapeur for rolled_back tag', () => {
    expect(computeMatterState({ type: 'MUTATION', tags: ['rolled_back'] })).toBe('vapeur')
  })

  it('returns liquide as default for active nodes', () => {
    expect(computeMatterState({ type: 'PATTERN', tags: [] })).toBe('liquide')
    expect(computeMatterState({ type: 'PROTOCOLE', tags: [] })).toBe('liquide')
    expect(computeMatterState({ type: 'REGLE', tags: [] })).toBe('liquide')
  })

  it('cristal takes precedence over vapeur tags', () => {
    // scelle appears before proposal in the function, so cristal wins
    expect(computeMatterState({ type: 'PATTERN', tags: ['scelle', 'proposal'] })).toBe('cristal')
  })
})

describe('computeCurtain', () => {
  it('returns core for sys:core tag', () => {
    expect(computeCurtain({ type: 'AXIOME', tags: ['sys:core'] })).toBe('core')
  })

  it('returns core for sys:anchor tag', () => {
    expect(computeCurtain({ type: 'AXIOME', tags: ['sys:anchor'] })).toBe('core')
  })

  it('returns heuristic for heuristic tag', () => {
    expect(computeCurtain({ type: 'PATTERN', tags: ['heuristic'] })).toBe('heuristic')
  })

  it('returns heuristic for PROTOCOLE type', () => {
    expect(computeCurtain({ type: 'PROTOCOLE', tags: [] })).toBe('heuristic')
  })

  it('returns heuristic for OUTIL type', () => {
    expect(computeCurtain({ type: 'OUTIL', tags: [] })).toBe('heuristic')
  })

  it('returns candidate for proposal tag', () => {
    expect(computeCurtain({ type: 'PATTERN', tags: ['proposal'] })).toBe('candidate')
  })

  it('returns candidate for candidate tag', () => {
    expect(computeCurtain({ type: 'PATTERN', tags: ['candidate'] })).toBe('candidate')
  })

  it('returns null for default nodes', () => {
    expect(computeCurtain({ type: 'ORGAN', tags: [] })).toBe(null)
    expect(computeCurtain({ type: 'APEX', tags: [] })).toBe(null)
  })

  it('core takes precedence over heuristic', () => {
    expect(computeCurtain({ type: 'PROTOCOLE', tags: ['sys:core'] })).toBe('core')
  })
})
