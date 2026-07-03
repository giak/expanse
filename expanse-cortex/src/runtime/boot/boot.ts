// ══════════════════════════════════════════════════════════════
// runBoot — Programmatically assemble a BootContext from Mnemolite
//
// Replaces the 6 sequential LLM-driven MCP calls of the V15 boot
// with a single function. Errors from individual calls are absorbed
// (allSettled + offline fallback) so the boot sequence stays
// resilient to a degraded server.
// ══════════════════════════════════════════════════════════════

import { McpNetworkError, MnemoliteClient } from '../mcp'
import type {
  BootContext,
  MnemoliteMemory,
  SystemSnapshot,
  VesselChunk,
} from '../types'

const DEFAULTS = {
  repo: 'expanse',
  workspacePaths: ['**/*.md'],
  /** Vessel timeout is tight — a slow index shouldn't stall boot. */
  vesselTimeoutMs: 3_000,
}

const OFFLINE_PROJECT = {
  name: 'expanse',
  intent: 'memory system (offline scaffold)',
} as const

/** Synthetic empty snapshot returned when Mnemolite is unreachable. */
export const OFFLINE_SNAPSHOT: SystemSnapshot = {
  core: [],
  patterns: [],
  extensions: [],
  profile: null,
  project: { ...OFFLINE_PROJECT },
  health: {
    fresh_drifts: 0,
    fresh_traces: 0,
    needs_consolidation: false,
    history_count: 0,
    total_memories: 0,
  },
}

export interface BootOptions {
  repo?: string
  workspacePaths?: string[]
  /** Override vessel timeout (ms). Default 3000. */
  vesselTimeoutMs?: number
  /**
   * Skip the indexWorkspace call entirely. Use when you already know
   * the server is offline (saves the vessel timeout wall-clock cost).
   * Default: false (always try; cheap on healthy servers thanks to
   * 3s timeout that's parallel with the other calls).
   */
  skipVesselOnOffline?: boolean
}

/**
 * Run the boot sequence. Never throws — degraded calls fall back to
 * empty defaults so a single bad response can't abort the inner loop.
 *
 *   await runBoot(new MnemoliteClient())
 *
 * **Performance:** the 3 calls run in parallel via Promise.allSettled,
 * total wall-clock cost is `max(snapshot, protocols, vessel)` not the
 * sum. No pre-flight `isOnline()` is performed — adding one would
 * penalize the 99%-online case (extra round trip) for an unlikely win
 * on the offline case. Use `skipVesselOnOffline: true` if you've
 * already verified offline status externally.
 */
export async function runBoot(
  client: MnemoliteClient,
  opts: BootOptions = {},
): Promise<BootContext> {
  const repo = opts.repo ?? DEFAULTS.repo
  const workspacePaths = opts.workspacePaths ?? DEFAULTS.workspacePaths
  const vesselTimeoutMs = opts.vesselTimeoutMs ?? DEFAULTS.vesselTimeoutMs
  const timestamp = new Date().toISOString()

  const vesselPromise: Promise<VesselChunk[]> = opts.skipVesselOnOffline
    ? Promise.resolve([])
    : withTimeout(
        client.indexWorkspace({ repo, paths: workspacePaths }),
        vesselTimeoutMs,
        'vessel indexing',
      )

  const [snapRes, protRes, vesselRes] = await Promise.allSettled([
    client.getSystemSnapshot(repo),
    client.searchMemory({ tags: ['sys:protocol'], limit: 20 }),
    vesselPromise,
  ])

  const snapshot: SystemSnapshot =
    snapRes.status === 'fulfilled' ? snapRes.value : OFFLINE_SNAPSHOT
  const protocols = protRes.status === 'fulfilled' ? protRes.value : []
  const vessel: VesselChunk[] | null =
    vesselRes.status === 'fulfilled' && vesselRes.value.length > 0
      ? vesselRes.value
      : null

  return {
    snapshot,
    protocols,
    vessel,
    health: snapshot.health,
    timestamp,
    // Online iff the snapshot fetch succeeded (the primary liveness signal).
    online: snapRes.status === 'fulfilled',
  }
}

/**
 * Build an offline BootContext with optional cached protocols/vessel.
 * Centralizes the `OFFLINE_SNAPSHOT + online: false` invariant so callers
 * don't have to remember to pair them.
 */
export function makeOfflineBootContext(
  opts: {
    protocols?: readonly Pick<MnemoliteMemory, 'id' | 'title' | 'content' | 'tags' | 'created_at'>[]
    vessel?: readonly VesselChunk[]
    timestamp?: string
  } = {},
): BootContext {
  return {
    snapshot: OFFLINE_SNAPSHOT,
    protocols: opts.protocols ? [...opts.protocols] : [],
    vessel: opts.vessel ? [...opts.vessel] : null,
    health: OFFLINE_SNAPSHOT.health,
    timestamp: opts.timestamp ?? new Date().toISOString(),
    online: false,
  }
}

/**
 * Race a promise against a timeout, throwing McpNetworkError on expiry.
 * The loser of the race is settled (not awaited) so it can't surface an
 * unhandled-rejection warning in Node when it loses the tie.
 */
async function withTimeout<T>(
  p: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new McpNetworkError(`${label} timed out after ${ms}ms`)),
      ms,
    )
  })
  try {
    return await Promise.race([p, timeout])
  } finally {
    if (timer) clearTimeout(timer)
    // Drain both races to prevent unhandled-rejection warnings on the loser.
    // Fire-and-forget: the actual outcome is already determined.
    void Promise.allSettled([p, timeout])
  }
}
