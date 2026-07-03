import { describe, it, expect } from 'vitest'
import type {
  ECSResult,
  ECSRoute,
  MnemoliteMemory,
  SearchMemoryArgs,
  WriteMemoryArgs,
  MemorySource,
  SystemSnapshot,
  BootContext,
  TraceFresh,
  DriftSignal,
  TriangulationPole,
  PoleResult,
  TriangulationResult,
  MutationType,
  MutationChange,
  MutationProposal,
  DreamReport,
  ValidationResult,
  Tool,
  VesselChunk,
  FileMatch,
  SearchResult,
} from '../types'

describe('runtime/types', () => {
  it('ECSResult has C, I, and route fields', () => {
    const result: ECSResult = { C: 3, I: 2, route: 'L2' }
    expect(result.C).toBe(3)
    expect(result.I).toBe(2)
    expect(result.route).toBe('L2')
  })

  it('ECSRoute is one of L1, L2, L3', () => {
    const routes: ECSRoute[] = ['L1', 'L2', 'L3']
    expect(routes).toHaveLength(3)
    expect(routes).toContain('L2')
  })

  it('MnemoliteMemory has required fields', () => {
    const mem: MnemoliteMemory = {
      id: 'test-1',
      title: 'Test memory',
      content: 'Some content',
      tags: ['sys:pattern'],
      created_at: '2026-07-02T10:00:00Z',
    }
    expect(mem.id).toBe('test-1')
    expect(mem.tags).toContain('sys:pattern')
  })

  it('SearchMemoryArgs supports optional fields', () => {
    const args: SearchMemoryArgs = { tags: ['sys:core'], limit: 10 }
    expect(args.limit).toBe(10)
    expect(args.query).toBeUndefined()
  })

  it('WriteMemoryArgs requires source (provenance enforcement)', () => {
    const args: WriteMemoryArgs = {
      title: 'PATTERN: test',
      content: 'content',
      tags: ['sys:pattern'],
      source: 'self',
    }
    expect(args.source).toBe('self')
  })

  it('MemorySource is user | self | external', () => {
    const sources: MemorySource[] = ['user', 'self', 'external']
    expect(sources).toHaveLength(3)
  })

  it('SystemSnapshot has core arrays and health', () => {
    const snap: SystemSnapshot = {
      core: [],
      patterns: [],
      extensions: [],
      profile: null,
      project: null,
      health: {
        fresh_drifts: 0,
        fresh_traces: 0,
        needs_consolidation: false,
        history_count: 0,
        total_memories: 0,
      },
    }
    expect(snap.core).toEqual([])
    expect(snap.health.fresh_drifts).toBe(0)
  })

  it('BootContext assembles snapshot + protocols + vessel + health', () => {
    const ctx: BootContext = {
      snapshot: {
        core: [],
        patterns: [],
        extensions: [],
        profile: null,
        project: null,
        health: {
          fresh_drifts: 0,
          fresh_traces: 0,
          needs_consolidation: false,
          history_count: 0,
          total_memories: 0,
        },
      },
      protocols: [],
      vessel: null,
      health: {
        fresh_drifts: 0,
        fresh_traces: 0,
        needs_consolidation: false,
        history_count: 0,
        total_memories: 0,
      },
      timestamp: '2026-07-02T10:00:00Z',
      online: true,
    }
    expect(ctx.online).toBe(true)
    expect(ctx.vessel).toBeNull()
    expect(ctx.timestamp).toBe('2026-07-02T10:00:00Z')
  })

  it('TraceFresh has id, title, content, tags', () => {
    const trace: TraceFresh = {
      id: 'trace-1',
      title: 'TRACE: test',
      content: 'friction detected',
      tags: ['trace:fresh'],
      created_at: '2026-07-02T10:00:00Z',
    }
    expect(trace.tags).toContain('trace:fresh')
  })

  it('DriftSignal has type field', () => {
    const drift: DriftSignal = {
      id: 'drift-1',
      title: 'DRIFT: contradiction',
      content: 'response contradicts anchor',
      tags: ['sys:drift'],
      type: 'contradiction',
      created_at: '2026-07-02T10:00:00Z',
    }
    expect(drift.type).toBe('contradiction')
  })

  it('TriangulationPole is anchor | vessel | web', () => {
    const poles: TriangulationPole[] = ['anchor', 'vessel', 'web']
    expect(poles).toHaveLength(3)
  })

  it('PoleResult has source, data, confidence', () => {
    const pole: PoleResult = {
      source: 'anchor',
      data: [],
      confidence: 0.9,
    }
    expect(pole.source).toBe('anchor')
    expect(pole.confidence).toBe(0.9)
  })

  it('TriangulationResult has confidence, sources, contradictions, overlap', () => {
    const result: TriangulationResult = {
      confidence: 90,
      sources: [],
      contradictions: ['anchor says X, web says Y'],
      overlap: ['concept-A'],
    }
    expect(result.contradictions).toHaveLength(1)
    expect(result.overlap).toContain('concept-A')
  })

  it('MutationType is rule | ecs | boot | archi', () => {
    const types: MutationType[] = ['rule', 'ecs', 'boot', 'archi']
    expect(types).toHaveLength(4)
  })

  it('MutationChange includes remove (anti-additive-bias)', () => {
    const changes: MutationChange[] = ['add', 'modify', 'remove']
    expect(changes).toContain('remove')
  })

  it('MutationProposal has slug, type, change, validation_test', () => {
    const proposal: MutationProposal = {
      slug: 'test-mutation',
      type: 'rule',
      description: 'Add guard against X',
      trace_ref: 'trace-1',
      change: 'add',
      validation_test: 'S14 on 3 tasks',
    }
    expect(proposal.slug).toBe('test-mutation')
    expect(proposal.validation_test).toBe('S14 on 3 tasks')
  })

  it('DreamReport has timestamp, counts, mutations, traces_consumed', () => {
    const report: DreamReport = {
      timestamp: '2026-07-02T10:00:00Z',
      traces_collected: 5,
      drifts_collected: 2,
      mutations_proposed: [],
      mutations_rejected: [],
      traces_consumed: ['trace-1', 'trace-2'],
    }
    expect(report.traces_collected).toBe(5)
    expect(report.traces_consumed).toHaveLength(2)
  })

  it('ValidationResult has valid boolean and optional reason', () => {
    const ok: ValidationResult = { valid: true }
    const bad: ValidationResult = { valid: false, reason: 'Injection detected', pattern: 'ignore previous' }
    expect(ok.valid).toBe(true)
    expect(bad.valid).toBe(false)
    expect(bad.reason).toBe('Injection detected')
  })

  it('Tool has name and optional description', () => {
    const tool: Tool = { name: 'search_memory' }
    expect(tool.name).toBe('search_memory')
    expect(tool.description).toBeUndefined()
  })

  it('VesselChunk has path and content', () => {
    const chunk: VesselChunk = { path: '/versions/v15/2026-03-20_v15-apex_v15.md', content: '# APEX' }
    expect(chunk.path).toBe('/versions/v15/2026-03-20_v15-apex_v15.md')
  })

  it('FileMatch has path, line, content', () => {
    const match: FileMatch = { path: 'src/app.ts', line: 42, content: 'export default' }
    expect(match.line).toBe(42)
  })

  it('SearchResult has url, title, snippet', () => {
    const result: SearchResult = { url: 'https://example.com', title: 'Example', snippet: '...' }
    expect(result.url).toBe('https://example.com')
  })
})
