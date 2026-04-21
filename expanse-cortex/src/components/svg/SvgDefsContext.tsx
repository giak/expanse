// ══════════════════════════════════════════════════════════════
// SVG DEFS CONTEXT — singleton guard for SVG filter/gradient IDs
// ══════════════════════════════════════════════════════════════
// Problem: hardcoded IDs like "glow", "nodeShadow" collide when
// two SVGs exist in the same DOM. url(#glow) resolves document-wide.
//
// Current architecture: only one SVG view is rendered at a time
// (tab-based navigation), so hardcoded IDs work fine.
//
// This module provides a dev-mode singleton guard: if more than one
// <SvgDefs> is mounted simultaneously, it warns about collision risk.
//
// Future: when multiple simultaneous SVGs are needed, add a
// React.useId()-based provider here (SvgDefsProvider + useDefUrl)
// to scope IDs per SVG root. That code will be written when the
// need arises — not before.
// ══════════════════════════════════════════════════════════════

// ─── Singleton guard (dev mode only) ───

// Module-level mutable counter — intentional for SPA dev-mode detection.
// Not suitable for SSR; this project is a client-only Vite SPA.
let _mountCount = 0

/** Call in SvgDefs mount/unmount to warn about potential ID collisions. */
export function trackSvgDefsMount(delta: 1 | -1): void {
  if (import.meta.env.DEV) {
    _mountCount += delta
    if (_mountCount > 1) {
      console.warn(
        `[SvgDefs] ${_mountCount} instances mounted — SVG ID collision risk. ` +
        `Wrap each SVG root in <SvgDefsProvider> and use useDefUrl() in consumers.`
      )
    }
  }
}
