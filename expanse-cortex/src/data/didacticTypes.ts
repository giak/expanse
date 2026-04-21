// ══════════════════════════════════════════════════════════════
// DIDACTIC TYPES — shared type definitions for didactic data
// ══════════════════════════════════════════════════════════════
// Extracted from bootDidactic.ts to avoid circular dependency:
//   didacticFactory imports types from bootDidactic
//   bootDidactic imports createDidacticData from didacticFactory
// Both now import from this neutral types file.
// ══════════════════════════════════════════════════════════════

/** A concept revealed during boot — powers the Manifest Gauge */
export interface ManifestConcept {
  id: string
  label: string
  icon: string
  revealedAtStepIdx: number  // step index where this concept first appears
  color: string
}

/** Anti-pattern contrast: standard IA vs Expanse */
export interface AntiPattern {
  standard: string   // what a typical AI does
  expanse: string    // what Expanse does instead
}

/** Didactic content for a single step */
export interface StepDidactic {
  prose: string            // 1-3 sentences explaining WHY
  concept?: string         // name of the concept introduced (e.g. "Dualisme Matériel")
  antiPattern?: AntiPattern // contrast with standard AI behavior
  revealedConcepts?: string[] // IDs of manifest concepts revealed at this step
  canvasHighlight?: string  // concept ID to highlight in canvas when reading this
}

/** Glossary entry */
export interface GlossaryEntry {
  term: string
  definition: string
  relatedConcepts?: string[]
}
