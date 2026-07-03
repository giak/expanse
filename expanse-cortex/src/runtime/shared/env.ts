// ══════════════════════════════════════════════════════════════
// Runtime env — single source of truth for MNEMOLITE_* access
//
// Centralizes the env-var hydration pattern used by both the
// MnemoliteClient (browser + node) and vite.config.ts (node-only)
// so the two stay in sync and the default port 8002 isn't
// duplicated three times across the codebase.
//
// Defaults are exposed individually (MNEMOLITE_DEFAULT_PORT /
// _HOST / _PATH) for ergonomic single-key use, plus the composite
// MNEMOLITE_DEFAULTS object for callers that need all three.
// ══════════════════════════════════════════════════════════════

/** Composite defaults — the single source of truth for `localhost:8002/mcp`. */
export const MNEMOLITE_DEFAULTS = {
  host: 'localhost',
  port: 8002,
  path: '/mcp',
} as const

/** Individual defaults exposed for documentation / tests / one-off consumers. */
export const MNEMOLITE_DEFAULT_PORT = MNEMOLITE_DEFAULTS.port
export const MNEMOLITE_DEFAULT_HOST = MNEMOLITE_DEFAULTS.host
export const MNEMOLITE_DEFAULT_PATH = MNEMOLITE_DEFAULTS.path

/**
 * Read `process.env` via a typed globalThis cast. The project targets
 * browsers (no `@types/node`), so `process` is unknown to the compiler;
 * the `src/env.d.ts` ambient declaration narrows it to just the three
 * MNEMOLITE_* vars for the cases where callers want autocomplete.
 *
 * Returns `undefined` if `process.env` is unavailable (pure browser
 * without a polyfill) — callers MUST handle that case.
 */
export function readNodeEnv(): Record<string, string | undefined> | undefined {
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } }
  return g.process?.env
}

/**
 * Coerce a port-like value to a finite integer. Handles `number`
 * (config) and `string` (env var — may be malformed) inputs;
 * `undefined` falls back to the caller-provided default.
 *
 * Returns `fallback` when:
 *   - the input is `undefined`
 *   - the parsed integer is `NaN` (e.g. `"abc"`)
 *   - the parsed integer is outside the finite range
 *
 * Note on `parseInt` semantics: leading-digit strings like `"1234abc"`
 * silently parse to `1234`. That's standard `parseInt` behavior and
 * is documented here so future readers don't file a bug.
 */
export function parsePort(
  raw: number | string | undefined,
  fallback: number,
): number {
  const parsed = parseInt(String(raw ?? ''), 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

/**
 * Resolve the full Mnemolite MCP endpoint from env vars with defaults.
 * Composite helper so a new caller can't forget the path or invent
 * their own default. Used by `MnemoliteClient` (browser + node) and
 * `vite.config.ts` proxy target (node-only).
 */
export function getMnemoliteEndpointFromEnv(): {
  host: string
  port: number
  path: string
} {
  const env = readNodeEnv()
  return {
    host: env?.MNEMOLITE_HOST ?? MNEMOLITE_DEFAULTS.host,
    port: parsePort(env?.MNEMOLITE_PORT, MNEMOLITE_DEFAULTS.port),
    path: env?.MNEMOLITE_PATH ?? MNEMOLITE_DEFAULTS.path,
  }
}
