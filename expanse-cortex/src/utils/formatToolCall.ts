// ══════════════════════════════════════════════════════════════
// FORMAT TOOL CALL — human-readable shortening for dendrite display
// ══════════════════════════════════════════════════════════════

/**
 * Formats a toolCall string for compact display in dendrite terminals.
 *
 * Input:  'read_file(v16/runtime/expanse-v16.md)'
 * Output: 'read_file(v16/runt…)'
 *
 * Before, replace(/[()]/g, '') produced: 'read_filev16/runtime/expanse-v16.md'
 * which truncated to garbled text like 'read_filev16/runti'.
 *
 * Strategy:
 * 1. Parse into toolName + argument
 * 2. Keep the parentheses structure
 * 3. Truncate the argument inside the parens (preserving closing paren)
 * 4. Always keep the full tool name
 */
export function formatToolCall(toolCall: string, maxLen: number = 18): string {
  const match = toolCall.match(/^([a-z_]+)\((.*)\)$/s)
  if (!match) {
    // No parens — just truncate raw
    return toolCall.length > maxLen ? toolCall.substring(0, maxLen - 1) + '…' : toolCall
  }

  const [, name, arg] = match
  const prefix = name + '('
  const suffix = ')'
  const availableForArg = maxLen - prefix.length - suffix.length

  if (availableForArg <= 2) {
    // Extremely tight: show just 'read_fi…'
    return name.length + 3 > maxLen
      ? name.substring(0, maxLen - 1) + '…'
      : name + '…'
  }

  if (arg.length <= availableForArg) {
    return prefix + arg + suffix
  }

  return prefix + arg.substring(0, availableForArg - 1) + '…' + suffix
}
