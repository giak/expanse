// ══════════════════════════════════════════════════════════════
// runBoot — Unit tests
//
// Strategy: structural stubs for `MnemoliteClient` (no real MCP).
// Cover happy path, Mnemolite offline, partial failure, vessel timeout,
// skipVesselOnOffline path, makeOfflineBootContext factory.
// ══════════════════════════════════════════════════════════════

import { describe, it, expect, vi } from 'vitest'

import { runBoot, OFFLINE_SNAPSHOT, makeOfflineBootContext } from '../boot'
import type { MnemoliteClient } from '../../mcp'
import type {
  MnemoliteMemory,
  SearchMemoryArgs,
  SystemSnapshot,
  VesselChunk,
} from '../../types'

// ─── Fixtures ───

const FAKE_SNAPSHOT: SystemSnapshot = {
  core: [{ id: 'c1', title: 'Axiom 1', content: 'x', tags: ['sys:core'], created_at: '2026-07-01' }],
  patterns: [],
  extensions: [],
  profile: { style_cognitif: 'iterative' },
  project: { name: 'expanse', intent: 'memory system' },
  health: {
    fresh_drifts: 3,
    fresh_traces: 5,
    needs_consolidation: false,
    history_count: 100,
    total_memories: 250,
  },
}

const FAKE_PROTOCOL: MnemoliteMemory = {
  id: 'p1',
  title: 'memory-triage',
  content: 'triage protocol',
  tags: ['sys:protocol'],
  created_at: '2026-07-01',
}

const FAKE_VESSEL_CHUNK: VesselChunk = {
  path: 'KERNEL.md',
  content: '# Kernel',
  metadata: undefined,
}

// ─── Fake client factory ───

interface FakeHandlers {
  getSystemSnapshot?: (repo?: string) => Promise<SystemSnapshot>
  searchMemory?: (args: SearchMemoryArgs) => Promise<MnemoliteMemory[]>
  indexWorkspace?: (args: { repo: string; paths: string[] }) => Promise<VesselChunk[]>
}

function fakeClient(handlers: FakeHandlers = {}): MnemoliteClient {
  return {
    isOnline: async () => true,
    getSystemSnapshot: handlers.getSystemSnapshot ?? (async () => FAKE_SNAPSHOT),
    searchMemory: handlers.searchMemory ?? (async () => [FAKE_PROTOCOL]),
    indexWorkspace: handlers.indexWorkspace ?? (async () => [FAKE_VESSEL_CHUNK]),
  } as unknown as MnemoliteClient
}

// ─── Tests ───

describe('runBoot — happy path', () => {
  it('assembles a full online BootContext', async () => {
    const ctx = await runBoot(fakeClient())
    expect(ctx.online).toBe(true)
    expect(ctx.snapshot).toBe(FAKE_SNAPSHOT)
    expect(ctx.protocols).toEqual([FAKE_PROTOCOL])
    expect(ctx.vessel).toEqual([FAKE_VESSEL_CHUNK])
    expect(ctx.health).toBe(FAKE_SNAPSHOT.health)
    expect(ctx.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
})

describe('runBoot — Mnemolite offline (snapshot throws)', () => {
  it('returns OFFLINE_SNAPSHOT and online: false', async () => {
    const client = fakeClient({
      getSystemSnapshot: async () => {
        throw new Error('ECONNREFUSED')
      },
    })
    const ctx = await runBoot(client)
    expect(ctx.online).toBe(false)
    expect(ctx.snapshot).toBe(OFFLINE_SNAPSHOT)
    expect(ctx.snapshot.project?.name).toBe('expanse')
    expect(ctx.snapshot.project?.intent).toContain('offline')
  })

  it('still assembles sibling-call results when those succeed', async () => {
    const client = fakeClient({
      getSystemSnapshot: async () => {
        throw new Error('offline')
      },
      indexWorkspace: async () => [FAKE_VESSEL_CHUNK],
    })
    const ctx = await runBoot(client)
    expect(ctx.vessel).toEqual([FAKE_VESSEL_CHUNK])
    expect(ctx.health).toBe(OFFLINE_SNAPSHOT.health)
  })
})

describe('runBoot — partial failure (snapshot OK, others fail)', () => {
  it('reports online: true and empty protocols/vessel when those fail', async () => {
    const client = fakeClient({
      searchMemory: async () => {
        throw new Error('search down')
      },
      indexWorkspace: async () => {
        throw new Error('vessel down')
      },
    })
    const ctx = await runBoot(client)
    expect(ctx.online).toBe(true)
    expect(ctx.protocols).toEqual([])
    expect(ctx.vessel).toBeNull()
  })
})

describe('runBoot — vessel timeout (real timer race)', () => {
  it('caps slow vessel indexing and falls back to null without fake timers', async () => {
    const slowIndex: FakeHandlers['indexWorkspace'] = () =>
      new Promise<VesselChunk[]>((resolve) => {
        setTimeout(() => resolve([FAKE_VESSEL_CHUNK]), 200)
      })
    const client = fakeClient({ indexWorkspace: slowIndex })
    const ctx = await runBoot(client, { vesselTimeoutMs: 30 })
    expect(ctx.vessel).toBeNull()  // timed out before resolving
    expect(ctx.online).toBe(true)
  })
}, 5_000)

describe('runBoot — skipVesselOnOffline opt-in', () => {
  it('does NOT call indexWorkspace when skipVesselOnOffline is true', async () => {
    const indexWorkspace = vi.fn(async () => {
      throw new Error('should not be called')
    })
    const client = fakeClient({ indexWorkspace })
    const ctx = await runBoot(client, { skipVesselOnOffline: true })
    expect(indexWorkspace).not.toHaveBeenCalled()
    expect(ctx.vessel).toBeNull()  // skipped promise resolves to []
  })

  it('defaults to attempting indexWorkspace even when snapshot is offline', async () => {
    // Verifies: caller must opt in explicitly; no implicit preflight.
    const indexWorkspace = vi.fn(async () => {
      throw new Error('indexer down')
    })
    const client = fakeClient({
      getSystemSnapshot: async () => {
        throw new Error('snapshot down')  // forces offline
      },
      indexWorkspace,
    })
    await runBoot(client)  // no opts → skipVesselOnOffline defaults false
    expect(indexWorkspace).toHaveBeenCalledTimes(1)
  })
})

describe('runBoot — options passthrough', () => {
  it('passes custom repo + paths to client calls', async () => {
    const getSystemSnapshot = vi.fn(async () => FAKE_SNAPSHOT)
    const searchMemory = vi.fn(async () => [FAKE_PROTOCOL])
    const indexWorkspace = vi.fn(async () => [FAKE_VESSEL_CHUNK])
    const client = fakeClient({ getSystemSnapshot, searchMemory, indexWorkspace })
    await runBoot(client, { repo: 'custom', workspacePaths: ['**/*.txt'] })
    expect(getSystemSnapshot).toHaveBeenCalledWith('custom')
    expect(indexWorkspace).toHaveBeenCalledWith({
      repo: 'custom',
      paths: ['**/*.txt'],
    })
    expect(searchMemory).toHaveBeenCalledWith(
      expect.objectContaining({ tags: ['sys:protocol'], limit: expect.any(Number) }),
    )
  })

  it('timestamp is a valid ISO 8601 string', async () => {
    const ctx = await runBoot(fakeClient())
    expect(Number.isNaN(new Date(ctx.timestamp).getTime())).toBe(false)
  })
})

describe('makeOfflineBootContext', () => {
  it('returns a BootContext with OFFLINE_SNAPSHOT and online: false', () => {
    const ctx = makeOfflineBootContext()
    expect(ctx.snapshot).toBe(OFFLINE_SNAPSHOT)
    expect(ctx.online).toBe(false)
    expect(ctx.protocols).toEqual([])
    expect(ctx.vessel).toBeNull()
  })

  it('accepts cached protocols and vessel (warm offline cache scenario)', () => {
    const ctx = makeOfflineBootContext({
      protocols: [FAKE_PROTOCOL],
      vessel: [FAKE_VESSEL_CHUNK],
    })
    expect(ctx.protocols).toEqual([FAKE_PROTOCOL])
    expect(ctx.vessel).toEqual([FAKE_VESSEL_CHUNK])
    expect(ctx.online).toBe(false)
  })

  it('accepts a custom timestamp', () => {
    const ctx = makeOfflineBootContext({ timestamp: '2026-07-02T00:00:00.000Z' })
    expect(ctx.timestamp).toBe('2026-07-02T00:00:00.000Z')
  })
})
