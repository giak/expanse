// ══════════════════════════════════════════════════════════════
// env — Unit tests
//
// Covers the typed process.env cast, NaN-safe port parsing, and
// the env cascade (env override → defaults). Stubbing uses
// `vi.stubGlobal('process', ...)` per vitest convention; we
// snapshot the live `process.env` keys at stub time and merge the
// patch on top so partial overrides don't accidentally nuke the
// real env (a lesson learned in client.test.ts and the boot tests).
//
// Note on testing the "process absent" path: deleted-from-globalThis
// scenarios break vitest's own `process.nextTick` plumbing, so
// `readNodeEnv`'s `undefined`-tolerance is verified by code-review
// + the type signature rather than a runtime test.
// ══════════════════════════════════════════════════════════════

import { describe, it, expect, vi, afterEach } from 'vitest'

import {
  readNodeEnv,
  parsePort,
  getMnemoliteEndpointFromEnv,
  MNEMOLITE_DEFAULT_PORT,
  MNEMOLITE_DEFAULT_HOST,
  MNEMOLITE_DEFAULT_PATH,
  MNEMOLITE_DEFAULTS,
} from '../env'

// ─── Stub helper ───

type ProcLike = { env?: Record<string, string | undefined> }

function stubProcess(patch: Record<string, string | undefined>): void {
  const g = globalThis as { process?: ProcLike }
  const originalEnv = g.process?.env ?? {}
  vi.stubGlobal('process', { env: { ...originalEnv, ...patch } })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

// ─── readNodeEnv ───

describe('readNodeEnv', () => {
  it('returns the env record when process is present', () => {
    stubProcess({ FOO: 'bar' })
    expect.assertions(2)
    const env = readNodeEnv()
    expect(env).toBeDefined()
    expect(env?.FOO).toBe('bar')
  })
})

// ─── parsePort ───

describe('parsePort', () => {
  it('passes through a valid number', () => {
    expect.assertions(1)
    expect(parsePort(8080, 8002)).toBe(8080)
  })

  it('parses a valid string', () => {
    expect.assertions(1)
    expect(parsePort('9000', 8002)).toBe(9000)
  })

  it('falls back on undefined', () => {
    expect.assertions(1)
    expect(parsePort(undefined, 8002)).toBe(8002)
  })

  it('falls back on NaN-producing strings ("abc")', () => {
    expect.assertions(1)
    expect(parsePort('abc', 8002)).toBe(8002)
  })

  it('falls back on empty string', () => {
    expect.assertions(1)
    expect(parsePort('', 8002)).toBe(8002)
  })

  it('parses leading-digit strings ("1234abc" → 1234) — parseInt semantics', () => {
    // Documented inline so nobody opens a bug for this.
    expect.assertions(1)
    expect(parsePort('1234bad', 8002)).toBe(1234)
  })
})

// ─── getMnemoliteEndpointFromEnv ───

describe('getMnemoliteEndpointFromEnv', () => {
  it('returns defaults when no env vars are set', () => {
    vi.stubGlobal('process', { env: {} })
    expect.assertions(2)
    const ep = getMnemoliteEndpointFromEnv()
    expect(ep).toEqual({
      host: MNEMOLITE_DEFAULT_HOST,
      port: MNEMOLITE_DEFAULT_PORT,
      path: MNEMOLITE_DEFAULT_PATH,
    })
    expect(ep.port).toBe(MNEMOLITE_DEFAULTS.port)
  })

  it('honors MNEMOLITE_HOST / PORT / PATH individually', () => {
    stubProcess({
      MNEMOLITE_HOST: 'env.host',
      MNEMOLITE_PORT: '1234',
      MNEMOLITE_PATH: '/envmcp',
    })
    expect.assertions(1)
    expect(getMnemoliteEndpointFromEnv()).toEqual({
      host: 'env.host',
      port: 1234,
      path: '/envmcp',
    })
  })

  it('falls back to default port on malformed MNEMOLITE_PORT', () => {
    stubProcess({ MNEMOLITE_PORT: 'not-a-number' })
    expect.assertions(1)
    expect(getMnemoliteEndpointFromEnv().port).toBe(MNEMOLITE_DEFAULT_PORT)
  })

  it('leaves host/path untouched when only MNEMOLITE_PORT is set', () => {
    stubProcess({ MNEMOLITE_PORT: '9999' })
    expect.assertions(3)
    const ep = getMnemoliteEndpointFromEnv()
    expect(ep.port).toBe(9999)
    expect(ep.host).toBe(MNEMOLITE_DEFAULT_HOST)
    expect(ep.path).toBe(MNEMOLITE_DEFAULT_PATH)
  })

  it('preserves other env keys when patching (no accidental nuke)', () => {
    stubProcess({ UNRELATED: 'keep-me', MNEMOLITE_PORT: '7777' })
    expect.assertions(2)
    const env = readNodeEnv()
    expect(env?.UNRELATED).toBe('keep-me')
    expect(env?.MNEMOLITE_PORT).toBe('7777')
  })
})

// ─── Defaults export ───

describe('defaults exports', () => {
  it('MNEMOLITE_DEFAULTS is the composite object', () => {
    expect.assertions(4)
    expect(MNEMOLITE_DEFAULTS).toEqual({
      host: 'localhost',
      port: 8002,
      path: '/mcp',
    })
    expect(MNEMOLITE_DEFAULTS.host).toBe(MNEMOLITE_DEFAULT_HOST)
    expect(MNEMOLITE_DEFAULTS.port).toBe(MNEMOLITE_DEFAULT_PORT)
    expect(MNEMOLITE_DEFAULTS.path).toBe(MNEMOLITE_DEFAULT_PATH)
  })

  it('MNEMOLITE_DEFAULT_PORT is 8002', () => {
    expect.assertions(1)
    expect(MNEMOLITE_DEFAULT_PORT).toBe(8002)
  })

  it('MNEMOLITE_DEFAULT_HOST is localhost', () => {
    expect.assertions(1)
    expect(MNEMOLITE_DEFAULT_HOST).toBe('localhost')
  })

  it('MNEMOLITE_DEFAULT_PATH is /mcp', () => {
    expect.assertions(1)
    expect(MNEMOLITE_DEFAULT_PATH).toBe('/mcp')
  })
})
