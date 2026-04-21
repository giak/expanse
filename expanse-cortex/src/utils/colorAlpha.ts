// ══════════════════════════════════════════════════════════════
// COLOR ALPHA — safe alpha mixing for hex strings AND CSS var() refs
// ══════════════════════════════════════════════════════════════
// `${col}12` works when col='#89b4fa' → '#89b4fa12' (valid 8-digit hex)
// but produces INVALID CSS when col='var(--color-blue)' → 'var(--color-blue)12'
//
// This utility handles both cases:
//   - hex strings → append 2-digit alpha hex
//   - var() refs  → color-mix(in srgb, var(--color-X) pct%, transparent)
//
// Usage: colorAlpha(col, 12) → '#89b4fa12' or 'color-mix(in srgb, var(--color-blue) 7%, transparent)'
// The alpha parameter is in hex range: 00=0%, FF=100%. Common values:
//   0a ≈ 4%,  12 ≈ 7%,  15 ≈ 8%,  18 ≈ 9%,  20 ≈ 13%,  25 ≈ 15%,
//   30 ≈ 19%, 40 ≈ 25%, 50 ≈ 31%

/**
 * Mix alpha into a color string. Works with both '#rrggbb' hex and 'var(--color-*)' CSS references.
 * @param color - CSS color string (hex or var() reference)
 * @param alphaHex - 2-digit hex alpha value (e.g. 0x12 for ~7%)
 * @returns CSS color string with alpha applied
 */
export function colorAlpha(color: string, alphaHex: number): string {
  if (color.startsWith('#')) {
    // Raw hex — append 2-digit alpha hex suffix (e.g. '#89b4fa' + 0x12 → '#89b4fa12')
    return color + alphaHex.toString(16).padStart(2, '0')
  }
  // var() reference — use color-mix() which resolves CSS custom properties
  const alphaPct = Math.round((alphaHex / 255) * 100)
  return `color-mix(in srgb, ${color} ${alphaPct}%, transparent)`
}
