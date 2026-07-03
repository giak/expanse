// ═════════════════════════════════════════════════════════════
// Minimal ambient typings for `process.env`
//
// The project avoids `@types/node` (we ship to browsers), but
// runtime helpers in `src/runtime/shared/env.ts` and
// `src/runtime/mcp/client.ts` read MNEMOLITE_HOST / PORT / PATH
// off `process.env`. Rather than untyped `Record<string, string |
// undefined>`, this d.ts lets callers write
// `process.env.MNEMOLITE_PORT` with autocomplete and typo checks.
//
// Only the three vars the current Expanse runtime consume are
// declared by name; the index signature is required so the
// `globalThis as { process?: { env?: Record<string, string |
// undefined> } }` cast pattern used in env.ts / env.test.ts /
// client.test.ts continues to compile cleanly alongside the
// ambient declaration. To add a new env-driven knob, append it
// to the `ProcessEnv` interface below — don't pull in `@types/node`.
// ═════════════════════════════════════════════════════════════

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Index signature keeps the globalThis cast pattern compatible. */
      [key: string]: string | undefined
      /** Mnemolite MCP server hostname. Default: localhost. */
      MNEMOLITE_HOST?: string
      /** Mnemolite MCP server port (string — parsed via parsePort). Default: 8002. */
      MNEMOLITE_PORT?: string
      /** Mnemolite MCP HTTP path. Default: /mcp. */
      MNEMOLITE_PATH?: string
    }
  }

  /**
   * Ambient `process` declaration — narrow to just the env subset
   * so the rest of Node's `process` API isn't accidentally available
   * (browsers don't have it). Declared as `var` (not `const`) to
   * stay compatible with any future `@types/node` inclusion.
   */
  var process: {
    env: NodeJS.ProcessEnv
  }
}

export {}
