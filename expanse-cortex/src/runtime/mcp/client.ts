// ══════════════════════════════════════════════════════════════
// MnemoliteClient — Typed TypeScript port of graph/fetch-mcp.cjs
//
// Calls the Mnemolite MCP server (JSON-RPC over HTTP, SSE-aware)
// and returns typed results. Universal: works in browser and Node 18+
// via the global `fetch` API.
//
// Methods map 1:1 to the 12 calls used by the V15 boot script:
//   - listTools()           ← tools/list
//   - getSystemSnapshot()   ← tools/call get_system_snapshot
//   - searchMemory()        ← tools/call search_memory
//   - writeMemory()         ← tools/call write_memory
//   - indexWorkspace()      ← tools/call index_markdown_workspace
//   - mcpCall()             ← raw JSON-RPC escape hatch
//
// Resolves host/port/path from:
//   config overrides > process.env (MNEMOLITE_HOST/PORT/PATH) > defaults.
// Browser CORS:
//   Dev: Vite proxies `/mcp` → `http://localhost:8002` (configured in
//        this repo's `vite.config.ts` via `server.proxy`). The browser
//        sees a same-origin request, so no CORS preflight is required.
//   Prod: deploy Mnemolite behind the same origin (reverse proxy or
//         co-located server). Concrete nginx snippet for the SSE case:
//            location /mcp {
//              proxy_pass http://localhost:8002;
//              proxy_set_header Host $host;
//              proxy_buffering off;             # critical for SSE pass-through
//              proxy_set_header Connection '';
//              proxy_read_timeout 1h;           # SSE streams can be long-lived
//            }
//         Direct cross-origin calls require explicit Access-Control-Allow-*
//         headers from Mnemolite.
//   Direct (no proxy): pass `fetchImpl` or set `MNEMOLITE_HOST` to a
//         host that already serves CORS headers.
// ══════════════════════════════════════════════════════════════

import type {
  MnemoliteMemory,
  SearchMemoryArgs,
  SystemSnapshot,
  Tool,
  VesselChunk,
  WriteMemoryArgs,
} from '../types'

// Shared env helpers — see ../shared/env for the typed globalThis cast
// and the NaN-safe port parser. Keeps `MnemoliteClient` in sync with
// `vite.config.ts`'s proxy target so the two can't drift.
import {
  readNodeEnv,
  parsePort,
  MNEMOLITE_DEFAULT_HOST,
  MNEMOLITE_DEFAULT_PORT,
  MNEMOLITE_DEFAULT_PATH,
} from '../shared'

// ─── Config ───

export interface MnemoliteConfig {
  host?: string
  port?: number
  path?: string
  /** Default: 10_000ms (matches fetch-mcp.cjs). */
  timeoutMs?: number
  /** Inject for testability. Falls back to globalThis.fetch. */
  fetchImpl?: typeof fetch
}

// host/port/path defaults live in `../shared/env` so the Vite proxy and
// this client can't drift. Only `timeoutMs` is client-specific.
const DEFAULTS = {
  host: MNEMOLITE_DEFAULT_HOST,
  port: MNEMOLITE_DEFAULT_PORT,
  path: MNEMOLITE_DEFAULT_PATH,
  timeoutMs: 10_000,
} as const satisfies Pick<MnemoliteConfig, 'host' | 'port' | 'path' | 'timeoutMs'>

// ─── Typed errors ───

/** Transport-level error: fetch failed, timeout, empty body. */
export class McpNetworkError extends Error {
  readonly cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'McpNetworkError'
    this.cause = cause
  }
}

/** RPC-level error: server returned { jsonrpc: '2.0', error: {...} }. */
export class McpRpcError extends Error {
  readonly cause?: unknown
  constructor(message: string, rpcError?: unknown) {
    super(message)
    this.name = 'McpRpcError'
    this.cause = rpcError
  }
}

// ─── Tool-call payload helpers ───

interface ToolCallResult {
  content?: Array<{ text?: string; type?: string }>
}

function extractToolText(result: unknown): string | null {
  const r = result as ToolCallResult | null
  return r?.content?.[0]?.text ?? null
}

/** Front-load `#region`-aware parsing for search results (4 shapes). */
function coerceMemoryArray(parsed: unknown): MnemoliteMemory[] {
  if (Array.isArray(parsed)) return parsed as MnemoliteMemory[]
  if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>
    if (Array.isArray(obj.results)) return obj.results as unknown as MnemoliteMemory[]
    if (Array.isArray(obj.memories)) return obj.memories as unknown as MnemoliteMemory[]
    if (Array.isArray(obj.items)) return obj.items as unknown as MnemoliteMemory[]
    // Single-item envelope
    if (typeof obj.id === 'string') return [obj as unknown as MnemoliteMemory]
  }
  return []
}

// ─── Client ───

export class MnemoliteClient {
  private readonly endpoint: string
  private readonly timeoutMs: number
  private readonly fetchImpl: typeof fetch

  constructor(config: MnemoliteConfig = {}) {
    // Resolve env at construction time so tests can stub `process`.
    const env = readNodeEnv()
    const host = config.host ?? env?.MNEMOLITE_HOST ?? DEFAULTS.host
    const port = parsePort(config.port ?? env?.MNEMOLITE_PORT, DEFAULTS.port)
    const path = config.path ?? env?.MNEMOLITE_PATH ?? DEFAULTS.path
    this.endpoint = `http://${host}:${port}${path}`
    this.timeoutMs = config.timeoutMs ?? DEFAULTS.timeoutMs
    // Use injected fetch if provided, else fall back to globalThis (browser + Node 18+).
    this.fetchImpl = config.fetchImpl ?? globalThis.fetch
    if (typeof this.fetchImpl !== 'function') {
      throw new McpNetworkError(
        'No fetch implementation available: pass `fetchImpl` or run on Node 18+ / modern browser',
      )
    }
  }

  // ─── Raw RPC ───

  /**
   * Low-level JSON-RPC call. Returns `parsed.result` (the unwrapped
   * RPC payload), throwing on transport or RPC errors.
   */
  async mcpCall(method: string, params: unknown): Promise<unknown> {
    const body = JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })

    let res: Response
    try {
      const ac = new AbortController()
      const timer = setTimeout(() => ac.abort(), this.timeoutMs)
      try {
        res = await this.fetchImpl(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json, text/event-stream',
          },
          body,
          signal: ac.signal,
        })
      } finally {
        clearTimeout(timer)
      }
    } catch (e) {
      throw new McpNetworkError(
        `Fetch failed: ${(e as Error).message ?? 'unknown'}`,
        e,
      )
    }

    if (!res.ok) {
      throw new McpNetworkError(`HTTP ${res.status} ${res.statusText}`)
    }

    const text = await res.text()
    if (!text.trim()) throw new McpNetworkError('Empty response body')

    // SSE-aware extraction: parse `data:` lines, keep the last one.
    // Works for both JSON and text/event-stream bodies (server may
    // return either depending on Accept negotiation).
    const lines = text.split('\n').filter(l => l.startsWith('data:'))
    if (!lines.length) {
      throw new McpNetworkError('No SSE data lines in response')
    }
    const payload = lines[lines.length - 1]!.replace(/^data:\s*/, '')

    let parsed: { result?: unknown; error?: unknown }
    try {
      parsed = JSON.parse(payload)
    } catch (e) {
      throw new McpNetworkError(`Malformed JSON: ${(e as Error).message}`, e)
    }

    if (parsed.error) {
      throw new McpRpcError(
        `RPC error: ${JSON.stringify(parsed.error)}`,
        parsed.error,
      )
    }

    // `result` is optional in JSON-RPC 2.0 spec — could be `null`.
    if (parsed.result === undefined) {
      throw new McpRpcError(
        'RPC response missing both `result` and `error` fields',
      )
    }

    return parsed.result
  }

  // ─── High-level methods ───

  /** List tools exposed by the Mnemolite MCP server (liveness check). */
  async listTools(): Promise<Tool[]> {
    const result = await this.mcpCall('tools/list', {})
    if (Array.isArray(result)) return result as Tool[]
    if (result && typeof result === 'object') {
      const obj = result as Record<string, unknown>
      if (Array.isArray(obj.tools)) return obj.tools as Tool[]
    }
    return []
  }

  /** Ping the server; returns true if listTools succeeds. */
  async isOnline(): Promise<boolean> {
    try {
      await this.listTools()
      return true
    } catch {
      return false
    }
  }

  /** Fetch the system snapshot (core + patterns + extensions + profile + health). */
  async getSystemSnapshot(repo = 'expanse'): Promise<SystemSnapshot> {
    const result = await this.mcpCall('tools/call', {
      name: 'get_system_snapshot',
      arguments: { repository: repo },
    })
    const text = extractToolText(result)
    if (!text) throw new McpNetworkError('get_system_snapshot: no text content')
    try {
      return JSON.parse(text) as SystemSnapshot
    } catch (e) {
      throw new McpNetworkError(
        `get_system_snapshot: malformed JSON: ${(e as Error).message}`,
        e,
      )
    }
  }

  /**
   * Search memories by tags / query / lifecycle. Returns MnemoliteMemory[].
   *
   * SOFT-FAIL: returns `[]` instead of throwing on parse errors or empty
   * content, so a degraded server doesn't abort the boot sequence. Callers
   * that need to detect staleness should check `SystemSnapshot.health`
   * (`total_memories`, `history_count`) rather than relying on this method.
   */
  async searchMemory(args: SearchMemoryArgs): Promise<MnemoliteMemory[]> {
    const result = await this.mcpCall('tools/call', {
      name: 'search_memory',
      arguments: args,
    })
    const text = extractToolText(result)
    if (!text) return []
    try {
      return coerceMemoryArray(JSON.parse(text))
    } catch {
      return []
    }
  }

  /** Write a memory entry. Requires `source` for provenance (Step 9 security). */
  async writeMemory(args: WriteMemoryArgs): Promise<{ id: string }> {
    const result = await this.mcpCall('tools/call', {
      name: 'write_memory',
      arguments: args,
    })
    const text = extractToolText(result)
    if (!text) throw new McpNetworkError('write_memory: no text content')
    try {
      const parsed = JSON.parse(text) as { id?: string }
      if (!parsed.id) throw new McpNetworkError('write_memory: response missing id')
      return { id: parsed.id }
    } catch (e) {
      throw new McpNetworkError(
        `write_memory: malformed response: ${(e as Error).message}`,
        e,
      )
    }
  }

  /**
   * Index a workspace (markdown files) and return vessel chunks.
   *
   * SOFT-FAIL: returns `[]` on parse errors (see `searchMemory` docstring).
   * The boot sequence should check `SystemSnapshot.health` rather than
   * rely on this method to surface failures.
   */
  async indexWorkspace(args: {
    repo: string
    paths: string[]
  }): Promise<VesselChunk[]> {
    const result = await this.mcpCall('tools/call', {
      name: 'index_markdown_workspace',
      arguments: args,
    })
    const text = extractToolText(result)
    if (!text) return []
    try {
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed)) return parsed as VesselChunk[]
      if (parsed && typeof parsed === 'object') {
        const obj = parsed as Record<string, unknown>
        if (Array.isArray(obj.chunks)) return obj.chunks as VesselChunk[]
        if (Array.isArray(obj.vessel)) return obj.vessel as VesselChunk[]
      }
      return []
    } catch {
      return []
    }
  }
}
