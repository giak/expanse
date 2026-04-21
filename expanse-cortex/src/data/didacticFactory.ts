// ══════════════════════════════════════════════════════════════
// DIDACTIC FACTORY — eliminates boilerplate across 9 didactic files
// ══════════════════════════════════════════════════════════════
// Each didactic file previously repeated the same pattern:
//   1. MANIFEST_CONCEPTS array
//   2. DIDACTICS array
//   3. GLOSSARY object
//   4. GLOSSARY_TERMS = Object.keys(GLOSSARY)
//   5. GLOSSARY_REGEX = new RegExp(complex boilerplate...)
//
// This factory computes steps 4-5 automatically, and returns
// a unified DidacticData object that scenarios.ts can consume.
// ══════════════════════════════════════════════════════════════

import type { ManifestConcept, StepDidactic, GlossaryEntry } from './didacticTypes'

// ─── Output type ───

export interface DidacticData {
  /** Concepts revealed during this scenario (powers the Manifest Gauge) */
  manifestConcepts: ManifestConcept[]
  /** One StepDidactic per scenario step */
  didactics: StepDidactic[]
  /** Glossary of terms specific to this scenario */
  glossary: Record<string, GlossaryEntry>
  /** Terms that should be highlighted in prose (keys of glossary) */
  glossaryTerms: string[]
  /** Pre-built regex for glossary term matching (longest first, Unicode-aware) */
  glossaryRegex: RegExp
}

// ─── Regex builder ───

/**
 * Build a glossary-matching regex.
 *
 * Uses `(?<!\w)` / `(?!\w)` instead of `\b` — works for both ASCII
 * and Unicode terms like Ψ↓, Φ, etc. The 'u' flag ensures `\w`
 * matches Unicode word characters too.
 *
 * Terms are sorted longest-first to avoid partial matches
 * (e.g. "Triangulation Absolue" before "Triangulation").
 */
function buildGlossaryRegex(terms: string[]): RegExp {
  if (terms.length === 0) {
    return /(?:)/u // empty non-capturing group — never matches
  }
  const sorted = [...terms].sort((a, b) => b.length - a.length)
  const escaped = sorted.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return new RegExp(
    `(?:((?<!\\w)${escaped.join('|')}(?!\\w)))`,
    'gu'
  )
}

// ─── Factory ───

/**
 * Create a complete didactic data bundle from the three input arrays.
 *
 * Usage:
 * ```ts
 * export const BOOT_DATA = createDidacticData({
 *   manifestConcepts: [...],
 *   didactics: [...],
 *   glossary: { ... },
 * })
 * ```
 */
export function createDidacticData(config: {
  manifestConcepts: ManifestConcept[]
  didactics: StepDidactic[]
  glossary: Record<string, GlossaryEntry>
}): DidacticData {
  const glossaryTerms = Object.keys(config.glossary)
  const glossaryRegex = buildGlossaryRegex(glossaryTerms)

  return {
    manifestConcepts: config.manifestConcepts,
    didactics: config.didactics,
    glossary: config.glossary,
    glossaryTerms,
    glossaryRegex,
  }
}
