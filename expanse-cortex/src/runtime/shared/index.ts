// ─── Shared runtime utilities ───
// Helpers used by both the LLM-facing runtime (boot, ECS, dream, ...)
// and the Cortex frontend hooks (useGraphData, ...).
//   - env.ts        : MNEMOLITE_* env vars + defaults
//   - fetchWithRetry: bounded exponential backoff for network fetches
export {
  readNodeEnv,
  parsePort,
  getMnemoliteEndpointFromEnv,
  MNEMOLITE_DEFAULT_PORT,
  MNEMOLITE_DEFAULT_HOST,
  MNEMOLITE_DEFAULT_PATH,
} from './env'

export { fetchWithRetry } from './fetchWithRetry'
export type { FetchWithRetryOptions } from './fetchWithRetry'
