// ══════════════════════════════════════════════════════════════
// SCENARIO DIDACTICS — per-scenario lazy loading for SignalView
// ══════════════════════════════════════════════════════════════
// Each scenario's didactic data is loaded on demand via dynamic
// import(). Vite creates a separate chunk for each, so only the
// active scenario's ~7-15 KB didactic bundle loads instead of
// the full 61 KB.
//
// Previously: 9 static imports → 1 monolithic 61 KB chunk.
// Now: 9 dynamic imports → 9 per-scenario chunks + shared factory.

import type { DidacticData } from './didacticFactory'

// ─── Per-scenario lazy loaders ───
// Vite sees each import() and creates a separate output chunk.
// The `didacticFactory` shared dependency is automatically split
// or inlined by Rollup as needed.

const DIDACTIC_LOADERS: Record<string, () => Promise<DidacticData>> = {
  'boot':               () => import('./bootDidactic').then(m => m.BOOT_DATA),
  'bonjour':            () => import('./bonjourDidactic').then(m => m.BONJOUR_DATA),
  'l2-audit':           () => import('./l2AuditDidactic').then(m => m.L2_AUDIT_DATA),
  'l3-triangulation':   () => import('./l3TriangulationDidactic').then(m => m.L3_TRIANGULATION_DATA),
  'violation-axiome':   () => import('./violationAxiomeDidactic').then(m => m.VIOLATION_AXIOME_DATA),
  'hallucination-block':() => import('./hallucinationBlockDidactic').then(m => m.HALLUCINATION_BLOCK_DATA),
  'momentum-resist':    () => import('./momentumResistDidactic').then(m => m.MOMENTUM_RESIST_DATA),
  'vessel-guard':       () => import('./vesselGuardDidactic').then(m => m.VESSEL_GUARD_DATA),
  'dream-cycle':        () => import('./dreamCycleDidactic').then(m => m.DREAM_CYCLE_DATA),
}

const FALLBACK_ID = 'boot'

/** Load didactic data for a specific scenario (lazy, code-split).
 *  Falls back to 'boot' if the scenario has no didactic data. */
export async function loadDidacticData(scenarioId: string): Promise<DidacticData> {
  const loader = DIDACTIC_LOADERS[scenarioId] ?? DIDACTIC_LOADERS[FALLBACK_ID]!
  return loader()
}
