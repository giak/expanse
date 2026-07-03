// ─── BOOT submodule ───
// Programmatic replacement for the 6-call V15 boot sequence.
// Three pure-ish layers: runBoot (resilient orchestration),
// formatBootContext (token-aware serialization), assertBootHealthy
// (invariant enforcement), plus makeOfflineBootContext factory.
export { runBoot, OFFLINE_SNAPSHOT, makeOfflineBootContext } from './boot'
export type { BootOptions } from './boot'
export { formatBootContext, estimateTokens } from './format'
export { assertBootHealthy } from './healthcheck'
export type { BootHealthOptions } from './healthcheck'
