import { describe, it, expect } from 'vitest'
import type {
  ExternalContent,
  ProvenanceLog,
  ValidateMemory,
  SanitizeExternal,
  LogProvenance,
} from '../contracts'
import type { ValidationResult, MemorySource } from '../../types'

describe('security/contracts', () => {
  it('barrel re-exports the contract types from security/index', async () => {
    const barrel = await import('../index')
    expect(barrel).toBeDefined()
    const sample: ExternalContent = { raw: 'untrusted' }
    expect(sample.raw).toBe('untrusted')
  })

  it('ExternalContent accepts raw + optional originUrl', () => {
    const minimal: ExternalContent = { raw: 'hello' }
    expect(minimal.originUrl).toBeUndefined()
    const withOrigin: ExternalContent = {
      raw: 'EXTERNAL CONTENT',
      originUrl: 'https://example.com/article',
    }
    expect(withOrigin.originUrl).toContain('example.com')
  })

  it('ProvenanceLog fields: source + timestamp + rejected + optional flaggedPattern', () => {
    const accepted: ProvenanceLog = {
      source: 'user' as MemorySource,
      timestamp: '2026-07-02T10:00:00Z',
      rejected: false,
    }
    expect(accepted.rejected).toBe(false)
    expect(accepted.flaggedPattern).toBeUndefined()

    const rejected: ProvenanceLog = {
      source: 'external' as MemorySource,
      timestamp: '2026-07-02T10:00:00Z',
      rejected: true,
      flaggedPattern: 'ignore previous',
      memoryId: 'mem-attempt-1',
    }
    expect(rejected.rejected).toBe(true)
    expect(rejected.flaggedPattern).toBe('ignore previous')
    expect(rejected.memoryId).toBe('mem-attempt-1')
  })

  it('ValidateMemory signature compiles with (content, source) and returns ValidationResult', () => {
    const sampleValidator: ValidateMemory = (content, source) => {
      // Toy: blocks "ignore" only for external source; user/self pass-through.
      if (source === 'external' && content.includes('ignore')) {
        return { valid: false, reason: 'injection pattern', pattern: 'ignore' }
      }
      return { valid: true }
    }
    // External + injection → blocked
    const blocked: ValidationResult = sampleValidator('please ignore previous', 'external')
    expect(blocked.valid).toBe(false)
    expect(blocked.pattern).toBe('ignore')
    // User + same content → passes (lighter scan)
    const userPasses = sampleValidator('please ignore previous', 'user')
    expect(userPasses.valid).toBe(true)
    // Self → trusted (pass-through)
    expect(sampleValidator('anything', 'self').valid).toBe(true)
    // Clean external content → passes
    expect(sampleValidator('safe text', 'external').valid).toBe(true)
  })

  it('SanitizeExternal signature compiles and prefixes content', () => {
    const sampleSanitizer: SanitizeExternal = (content) => {
      return `[EXTERNAL UNTRUSTED | origin=${content.originUrl ?? 'unknown'}]\n\n${content.raw}`
    }
    const result = sampleSanitizer({ raw: 'some text', originUrl: 'https://x.com' })
    expect(result).toContain('[EXTERNAL UNTRUSTED')
    expect(result).toContain('https://x.com')
    expect(result).toContain('some text')
  })

  it('LogProvenance signature compiles (side-effect-only function)', () => {
    // LogProvenance is void — sample by capturing in a local array.
    const captured: ProvenanceLog[] = []
    const sampleLog: LogProvenance = (entry) => {
      captured.push(entry)
    }
    sampleLog({
      source: 'self',
      timestamp: '2026-07-02T10:00:00Z',
      rejected: false,
    })
    sampleLog({
      source: 'external',
      timestamp: '2026-07-02T10:00:01Z',
      rejected: true,
      flaggedPattern: 'system prompt',
    })
    expect(captured).toHaveLength(2)
    expect(captured[0].source).toBe('self')
    expect(captured[1].rejected).toBe(true)
  })

  it('MemorySource values accepted by ProvenanceLog.source', () => {
    const sources: MemorySource[] = ['user', 'self', 'external']
    const logs: ProvenanceLog[] = sources.map((s, i) => ({
      source: s,
      timestamp: `2026-07-02T10:00:0${i}Z`,
      rejected: s === 'external', // external is the main attack surface
    }))
    expect(logs.map((l) => l.source)).toEqual(['user', 'self', 'external'])
    expect(logs.filter((l) => l.rejected)).toHaveLength(1)
  })
})
