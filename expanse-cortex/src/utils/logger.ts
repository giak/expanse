// ══════════════════════════════════════════════════════════════
// LOGGER — Configurable logging with DEV gate
// ══════════════════════════════════════════════════════════════
// Replaces raw console.* calls so production builds stay silent.
// Level hierarchy: debug < info < warn < error < silent
// Default: 'warn' in production, 'debug' in DEV.

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent'

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
}

const DEFAULT_LEVEL: LogLevel = import.meta.env.DEV ? 'debug' : 'warn'

const envLevel = import.meta.env.VITE_LOG_LEVEL as string | undefined
let currentLevel: LogLevel = DEFAULT_LEVEL
if (envLevel && envLevel in LEVEL_RANK) {
  currentLevel = envLevel as LogLevel
}

/** Change the active log level at runtime (e.g. for diagnostics) */
export function setLogLevel(level: LogLevel): void {
  currentLevel = level
}

/** Read the current log level */
export function getLogLevel(): LogLevel {
  return currentLevel
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_RANK[level] >= LEVEL_RANK[currentLevel]
}

/** Prefix all cortex logs for easy filtering in DevTools */
const PREFIX = '[expanse-cortex]'

export const logger = {
  debug(...args: unknown[]): void {
    if (shouldLog('debug')) console.debug(PREFIX, ...args)
  },
  info(...args: unknown[]): void {
    if (shouldLog('info')) console.info(PREFIX, ...args)
  },
  warn(...args: unknown[]): void {
    if (shouldLog('warn')) console.warn(PREFIX, ...args)
  },
  error(...args: unknown[]): void {
    if (shouldLog('error')) console.error(PREFIX, ...args)
  },
} as const
