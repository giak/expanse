// ══════════════════════════════════════════════════════════════
// MnemoliteClient — Unit tests
//
// Strategy: inject a mock `fetch` via the constructor so tests are
// hermetic (no real HTTP, no global state). Covers all 5 high-level
// methods + error paths.
// ══════════════════════════════════════════════════════════════

import { describe, it, expect, vi } from 'vitest'

import {
  MnemoliteClient,
  McpNetworkError,
  McpRpcError,
} from '../client'
import type { MnemoliteMemory } from '../../types'

// ─── Mock helpers ───

function makeFetchMock(
  responder: (req: Request, init?: RequestInit) => Response | Promise<Response>,
) {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString()
    const req = new Request(url, { method: 'POST' })
    return responder(req, init)
  })
}

function jsonRpcResponse(result: unknown, id = 1): Response {
  return new Response(
    `data: ${JSON.stringify({ jsonrpc: '2.0', id, result })}\n\n`,
    { status: 200, headers: { 'Content-Type': 'text/event-stream' } },
  )
}

function jsonRpcError(error: unknown, id = 1): Response {
  return new Response(
    `data: ${JSON.stringify({ jsonrpc: '2.0', id, error })}\n\n`,
    { status: 200, headers: { 'Content-Type': 'text/event-stream' } },
  )
}

function httpError(status: number, statusText: string): Response {
  return new Response(statusText, { status, statusText })
}

function emptyResponse(): Response {
  return new Response('', { status: 200 })
}

function noSseResponse(): Response {
  return new Response('not sse\njust text', { status: 200 })
}

// Typed process.env access for tests (matches client.ts readNodeEnv pattern).
function stubProcessEnv(envPatch: Record<string, string | undefined>) {
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } }
  const originalEnv = g.process?.env
  const baseProcess = { ...g.process, env: { ...(originalEnv ?? {}), ...envPatch } }
  g.process = baseProcess
  return () => {
    if (originalEnv === undefined) {
      delete (globalThis as { process?: unknown }).process
    } else {
      g.process = { ...g.process, env: originalEnv }
    }
  }
}

// ─── Fixtures ───

const FAKE_MEMORY: MnemoliteMemory = {
  id: 'mem_123',
  title: 'Axiom: Context is a Verb',
  content: 'Context emerges from interaction, not from state.',
  tags: ['sys:core'],
  created_at: '2026-07-01T00:00:00Z',
}

const FAKE_TOOLS_LIST = {
  tools: [
    { name: 'search_memory', description: 'Search memories by tags / query' },
    { name: 'write_memory', description: 'Write a new memory entry' },
    { name: 'get_system_snapshot', description: 'Fetch the full system state' },
    { name: 'index_markdown_workspace', description: 'Index a workspace' },
  ],
}

const FAKE_SNAPSHOT = {
  core: [FAKE_MEMORY],
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

// ─── Tests ───

describe('MnemoliteClient — constructor', () => {
  it('builds default endpoint from host/port/path', () => {
    const fetchImpl = makeFetchMock(() => jsonRpcResponse([]))
    const client = new MnemoliteClient({ fetchImpl })
    // No public getter, but this indirectly asserts via listTools below.
    expect(client).toBeInstanceOf(MnemoliteClient)
  })

  it('throws when no fetch is available and none injected', () => {
    vi.stubGlobal('fetch', undefined)
    expect(() => new MnemoliteClient()).toThrow(McpNetworkError)
    vi.unstubAllGlobals()
  })

  it('uses custom host/port/path', async () => {
    const fetchImpl = vi.fn(async () => jsonRpcResponse([]))
    const client = new MnemoliteClient({
      host: 'mnemo.internal',
      port: 9000,
      path: '/custom',
      fetchImpl,
    })
    await client.listTools()
    expect(fetchImpl).toHaveBeenCalledWith(
      'http://mnemo.internal:9000/custom',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('falls back to MNEMOLITE_HOST/PORT/PATH env vars when config omits them', async () => {
    const restore = stubProcessEnv({
      MNEMOLITE_HOST: 'env.host',
      MNEMOLITE_PORT: '1234',
      MNEMOLITE_PATH: '/envmcp',
    })
    try {
      const fetchImpl = vi.fn(async () => jsonRpcResponse([]))
      const client = new MnemoliteClient({ fetchImpl })
      await client.listTools()
      expect(fetchImpl).toHaveBeenCalledWith(
        'http://env.host:1234/envmcp',
        expect.objectContaining({ method: 'POST' }),
      )
    } finally {
      restore()
    }
  })

  it('config host overrides MNEMOLITE_HOST env var', async () => {
    const restore = stubProcessEnv({ MNEMOLITE_HOST: 'env.host' })
    try {
      const fetchImpl = vi.fn(async () => jsonRpcResponse([]))
      const client = new MnemoliteClient({
        host: 'override.example',
        port: 8000,
        path: '/mcp',
        fetchImpl,
      })
      await client.listTools()
      expect(fetchImpl).toHaveBeenCalledWith(
        'http://override.example:8000/mcp',
        expect.anything(),
      )
    } finally {
      restore()
    }
  })

  it('config port (number) overrides MNEMOLITE_PORT (string env)', async () => {
    const restore = stubProcessEnv({ MNEMOLITE_PORT: '1234' })
    try {
      const fetchImpl = vi.fn(async () => jsonRpcResponse([]))
      const client = new MnemoliteClient({ port: 9999, fetchImpl })
      await client.listTools()
      expect(fetchImpl).toHaveBeenCalledWith(
        'http://localhost:9999/mcp',
        expect.anything(),
      )
    } finally {
      restore()
    }
  })

  it('falls back to default port when MNEMOLITE_PORT is not a number', async () => {
    const restore = stubProcessEnv({ MNEMOLITE_PORT: 'abc' })
    try {
      const fetchImpl = vi.fn(async () => jsonRpcResponse([]))
      const client = new MnemoliteClient({ fetchImpl })
      await client.listTools()
      expect(fetchImpl).toHaveBeenCalledWith(
        'http://localhost:8002/mcp',
        expect.anything(),
      )
    } finally {
      restore()
    }
  })
})

describe('MnemoliteClient — listTools', () => {
  it('unwraps { tools: [...] } shape', async () => {
    const fetchImpl = makeFetchMock(() => jsonRpcResponse(FAKE_TOOLS_LIST))
    const client = new MnemoliteClient({ fetchImpl })
    const tools = await client.listTools()
    expect(tools).toHaveLength(4)
    expect(tools[0]?.name).toBe('search_memory')
  })

  it('unwraps bare array shape', async () => {
    const fetchImpl = makeFetchMock(() =>
      jsonRpcResponse([{ name: 'search_memory' }, { name: 'write_memory' }]),
    )
    const client = new MnemoliteClient({ fetchImpl })
    const tools = await client.listTools()
    expect(tools.map(t => t.name)).toEqual(['search_memory', 'write_memory'])
  })

  it('returns empty array for unknown shape', async () => {
    const fetchImpl = makeFetchMock(() => jsonRpcResponse({ foo: 'bar' }))
    const client = new MnemoliteClient({ fetchImpl })
    const tools = await client.listTools()
    expect(tools).toEqual([])
  })
})

describe('MnemoliteClient — isOnline', () => {
  it('returns true when listTools succeeds', async () => {
    const fetchImpl = makeFetchMock(() => jsonRpcResponse(FAKE_TOOLS_LIST))
    const client = new MnemoliteClient({ fetchImpl })
    expect(await client.isOnline()).toBe(true)
  })

  it('returns false when listTools fails', async () => {
    const fetchImpl = makeFetchMock(() => httpError(503, 'Service Unavailable'))
    const client = new MnemoliteClient({ fetchImpl })
    expect(await client.isOnline()).toBe(false)
  })
})

describe('MnemoliteClient — getSystemSnapshot', () => {
  it('parses the text content from the tool result', async () => {
    const fetchImpl = makeFetchMock(() =>
      jsonRpcResponse({
        content: [{ type: 'text', text: JSON.stringify(FAKE_SNAPSHOT) }],
      }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    const snap = await client.getSystemSnapshot('expanse')
    expect(snap.health.total_memories).toBe(250)
    expect(snap.core).toEqual([FAKE_MEMORY])
  })

  it('uses default repo "expanse"', async () => {
    const fetchImpl = makeFetchMock(() =>
      jsonRpcResponse({ content: [{ text: JSON.stringify(FAKE_SNAPSHOT) }] }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    await client.getSystemSnapshot()
    const callBody = JSON.parse(
      (fetchImpl.mock.calls[0]?.[1]?.body as string) ?? '{}',
    )
    expect(callBody.params.arguments.repository).toBe('expanse')
  })

  it('throws on missing text content', async () => {
    const fetchImpl = makeFetchMock(() => jsonRpcResponse({}))
    const client = new MnemoliteClient({ fetchImpl })
    await expect(client.getSystemSnapshot()).rejects.toThrow(McpNetworkError)
  })
})

describe('MnemoliteClient — searchMemory', () => {
  it('extracts array from .results envelope', async () => {
    const fetchImpl = makeFetchMock(() =>
      jsonRpcResponse({
        content: [{ text: JSON.stringify({ results: [FAKE_MEMORY] }) }],
      }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    const mems = await client.searchMemory({ tags: ['sys:core'], limit: 10 })
    expect(mems).toEqual([FAKE_MEMORY])
  })

  it('extracts array from .memories envelope', async () => {
    const fetchImpl = makeFetchMock(() =>
      jsonRpcResponse({
        content: [{ text: JSON.stringify({ memories: [FAKE_MEMORY] }) }],
      }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    const mems = await client.searchMemory({ limit: 5 })
    expect(mems).toEqual([FAKE_MEMORY])
  })

  it('accepts a bare array as a valid response', async () => {
    const fetchImpl = makeFetchMock(() =>
      jsonRpcResponse({
        content: [{ text: JSON.stringify([FAKE_MEMORY, FAKE_MEMORY]) }],
      }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    const mems = await client.searchMemory({ query: 'context' })
    expect(mems).toHaveLength(2)
  })

  it('extracts array from .items envelope', async () => {
    const fetchImpl = makeFetchMock(() =>
      jsonRpcResponse({
        content: [{ text: JSON.stringify({ items: [FAKE_MEMORY] }) }],
      }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    const mems = await client.searchMemory({ query: 'context' })
    expect(mems).toEqual([FAKE_MEMORY])
  })

  it('wraps single-item response in array', async () => {
    const fetchImpl = makeFetchMock(() =>
      jsonRpcResponse({
        content: [{ text: JSON.stringify(FAKE_MEMORY) }],
      }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    const mems = await client.searchMemory({ tags: ['sys:user:profile'] })
    expect(mems).toEqual([FAKE_MEMORY])
  })

  it('returns [] when no text content', async () => {
    const fetchImpl = makeFetchMock(() => jsonRpcResponse({}))
    const client = new MnemoliteClient({ fetchImpl })
    const mems = await client.searchMemory({ tags: ['sys:core'] })
    expect(mems).toEqual([])
  })

  it('returns [] on malformed JSON instead of throwing', async () => {
    const fetchImpl = makeFetchMock(() =>
      jsonRpcResponse({ content: [{ text: 'not valid json' }] }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    const mems = await client.searchMemory({ tags: ['sys:core'] })
    expect(mems).toEqual([])
  })
})

describe('MnemoliteClient — writeMemory', () => {
  it('returns the new memory id', async () => {
    const fetchImpl = makeFetchMock(() =>
      jsonRpcResponse({
        content: [{ text: JSON.stringify({ id: 'mem_new_42' }) }],
      }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    const res = await client.writeMemory({
      title: 'New trace',
      content: 'observed pattern',
      tags: ['trace:fresh'],
      source: 'user',
    })
    expect(res.id).toBe('mem_new_42')
  })

  it('forwards source in the arguments', async () => {
    const fetchImpl = makeFetchMock(() =>
      jsonRpcResponse({
        content: [{ text: JSON.stringify({ id: 'mem_x' }) }],
      }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    await client.writeMemory({
      title: 'X',
      content: 'Y',
      tags: ['t'],
      source: 'self',
    })
    const body = JSON.parse(
      (fetchImpl.mock.calls[0]?.[1]?.body as string) ?? '{}',
    )
    expect(body.params.arguments.source).toBe('self')
  })

  it('throws when response missing id', async () => {
    const fetchImpl = makeFetchMock(() =>
      jsonRpcResponse({ content: [{ text: '{}' }] }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    await expect(
      client.writeMemory({
        title: 'X',
        content: 'Y',
        tags: ['t'],
        source: 'user',
      }),
    ).rejects.toThrow(McpNetworkError)
  })
})

describe('MnemoliteClient — indexWorkspace', () => {
  it('returns chunks from bare array response', async () => {
    const chunks = [
      { path: 'a.md', content: 'aaa' },
      { path: 'b.md', content: 'bbb' },
    ]
    const fetchImpl = makeFetchMock(() =>
      jsonRpcResponse({ content: [{ text: JSON.stringify(chunks) }] }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    const result = await client.indexWorkspace({ repo: 'expanse', paths: ['**/*.md'] })
    expect(result).toEqual(chunks)
  })

  it('returns chunks from .chunks envelope', async () => {
    const fetchImpl = makeFetchMock(() =>
      jsonRpcResponse({
        content: [{ text: JSON.stringify({ chunks: [{ path: 'x.md', content: 'xxx' }] }) }],
      }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    const result = await client.indexWorkspace({ repo: 'r', paths: [] })
    expect(result).toEqual([{ path: 'x.md', content: 'xxx' }])
  })
})

describe('MnemoliteClient — error paths', () => {
  it('throws McpNetworkError on HTTP error status', async () => {
    const fetchImpl = makeFetchMock(() => httpError(500, 'Internal Server Error'))
    const client = new MnemoliteClient({ fetchImpl })
    await expect(client.listTools()).rejects.toThrow(McpNetworkError)
  })

  it('throws McpNetworkError on empty body', async () => {
    const fetchImpl = makeFetchMock(() => emptyResponse())
    const client = new MnemoliteClient({ fetchImpl })
    await expect(client.listTools()).rejects.toThrow(/Empty response/)
  })

  it('throws McpNetworkError when no SSE data lines', async () => {
    const fetchImpl = makeFetchMock(() => noSseResponse())
    const client = new MnemoliteClient({ fetchImpl })
    await expect(client.listTools()).rejects.toThrow(/No SSE/)
  })

  it('throws McpRpcError when response contains error field', async () => {
    const fetchImpl = makeFetchMock(() =>
      jsonRpcError({ code: -32601, message: 'Method not found' }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    await expect(client.listTools()).rejects.toThrow(McpRpcError)
  })

  it('McpRpcError preserves the original error payload as cause', async () => {
    const payload = { code: -32601, message: 'Method not found' }
    const fetchImpl = makeFetchMock(() => jsonRpcError(payload))
    const client = new MnemoliteClient({ fetchImpl })
    try {
      await client.listTools()
      throw new Error('Should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(McpRpcError)
      expect((e as McpRpcError).cause).toEqual(payload)
    }
  })

  it('throws McpNetworkError on malformed JSON', async () => {
    const fetchImpl = makeFetchMock(
      () =>
        new Response('data: {not valid json\n\n', { status: 200 }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    await expect(client.listTools()).rejects.toThrow(/Malformed JSON/)
  })

  it('throws McpNetworkError on fetch throw (e.g. DNS failure)', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError('fetch failed')
    })
    const client = new MnemoliteClient({ fetchImpl })
    await expect(client.listTools()).rejects.toThrow(/Fetch failed/)
  })
})

describe('MnemoliteClient — SSE parsing', () => {
  it('keeps the LAST data: line (server may emit progress events)', async () => {
    const fetchImpl = makeFetchMock(
      () =>
        new Response(
          [
            'event: progress',
            'data: {"step":1}',
            '',
            'event: progress',
            'data: {"step":2}',
            '',
            'data: {"jsonrpc":"2.0","id":1,"result":{"foo":"final"}}',
            '',
          ].join('\n'),
          { status: 200 },
        ),
    )
    const client = new MnemoliteClient({ fetchImpl })
    // `mcpCall` is part of the public API — call it directly.
    const result = await client.mcpCall('ping', {})
    expect(result).toEqual({ foo: 'final' })
  })

  it('throws when the response has neither result nor error fields', async () => {
    const fetchImpl = makeFetchMock(() =>
      new Response('data: {"jsonrpc":"2.0","id":1}\n\n', { status: 200 }),
    )
    const client = new MnemoliteClient({ fetchImpl })
    await expect(client.listTools()).rejects.toThrow(McpRpcError)
  })
})
