// ══════════════════════════════════════════════════════════════
// SHARED — helpers, constants, lazy wrappers used across domains
// ══════════════════════════════════════════════════════════════

import { lazy } from 'react'
import type { VisualEffect } from '../../../../../types/signal'
import type { StaticEffectContext } from '../types'
import { ORGAN_ORDER } from '../../../../../constants/theme'
import { organPositions } from '../../../../../utils/positionGraphNodes'

// ─── Safe hasEffect check ───

export function hasEff(ctx: StaticEffectContext, effect: VisualEffect): boolean {
  return ctx.step?.visualEffects?.includes(effect) ?? false
}

// ─── Non-null assertion helpers (replace ctx.step! usage) ───

/** Assert that ctx.step is present. Throws a descriptive error if absent,
 *  which gets caught by EffectErrorBoundary. This replaces `ctx.step!`
 *  with a safe runtime guard — if a strategy's test() has a bug and
 *  allows render() without step, the error is caught instead of a
 *  silent crash. */
export function requireStep(ctx: StaticEffectContext): StaticEffectContext & { step: NonNullable<StaticEffectContext['step']> } {
  if (!ctx.step) throw new Error(`Strategy rendered without step — test() guard missing or buggy`)
  return ctx as StaticEffectContext & { step: NonNullable<StaticEffectContext['step']> }
}

/** Assert a value is non-null. Same pattern as requireStep but for
 *  specific properties like ctx.step.ecsFork, ctx.step.packetFlows, etc. */
export function assertNonNull<T>(value: T | null | undefined, label: string): T {
  if (value == null) throw new Error(`Expected ${label} to be non-null but got ${value}`)
  return value
}

// ─── Precomputed stable array for ResonancePulse targets ───

export const RESONANCE_TARGETS = ORGAN_ORDER
  .filter(sym => sym !== 'Μ')
  .map(sym => {
    const pos = organPositions.get(sym)!
    return { x: pos.x, y: pos.y, symbol: sym }
  })

// ─── Shockwave phases ───

export const SHOCKWAVE_PHASES = new Set([
  'APEX', 'BRIEFING', 'READY', 'EMIT', 'LOST_EMIT', 'SYNTHESIZE', 'LISTEN',
])

// ─── Lazy wrappers (rare effects, code-split) ───

export const LazyNeuralBridge = lazy(() => import('../../NeuralBridge').then(m => ({ default: m.NeuralBridge })))
export const LazyPacketFlowRenderer = lazy(() => import('../../PacketFlowRenderer').then(m => ({ default: m.PacketFlowRenderer })))
export const LazyTriPoleOrbit = lazy(() => import('../../TriPoleOrbit').then(m => ({ default: m.TriPoleOrbit })))
export const LazyConfianceGauge = lazy(() => import('../../ConfianceGauge').then(m => ({ default: m.ConfianceGauge })))
export const LazyConstitutionalGuard = lazy(() => import('../../ConstitutionalGuard').then(m => ({ default: m.ConstitutionalGuard })))
export const LazyRedAlert = lazy(() => import('../../RedAlert').then(m => ({ default: m.RedAlert })))
export const LazyBlockWall = lazy(() => import('../../BlockWall').then(m => ({ default: m.BlockWall })))
export const LazyContradictionBolt = lazy(() => import('../../ContradictionBolt').then(m => ({ default: m.ContradictionBolt })))
export const LazyFreshTraceMark = lazy(() => import('../../FreshTraceMark').then(m => ({ default: m.FreshTraceMark })))
export const LazyFogPatch = lazy(() => import('../../FogPatch').then(m => ({ default: m.FogPatch })))
export const LazyLOSTStamp = lazy(() => import('../../LOSTStamp').then(m => ({ default: m.LOSTStamp })))
export const LazyQuestionMarkShield = lazy(() => import('../../QuestionMarkShield').then(m => ({ default: m.QuestionMarkShield })))
export const LazyVesselRadar = lazy(() => import('../../VesselRadar').then(m => ({ default: m.VesselRadar })))
export const LazyGrepBeam = lazy(() => import('../../GrepBeam').then(m => ({ default: m.GrepBeam })))
export const LazyDreamGate = lazy(() => import('../../DreamGate').then(m => ({ default: m.DreamGate })))
export const LazyMutationOrbit = lazy(() => import('../../MutationOrbit').then(m => ({ default: m.MutationOrbit })))
export const LazySeasonCycle = lazy(() => import('../../SeasonCycle').then(m => ({ default: m.SeasonCycle })))
export const LazyProposalBloom = lazy(() => import('../../ProposalBloom').then(m => ({ default: m.ProposalBloom })))
export const LazyPruneShears = lazy(() => import('../../PruneShears').then(m => ({ default: m.PruneShears })))

// ─── Re-export constants used by strategies ───

export {
  MCP_PHASES, INCARNATION_PHASE, FIRST_LIGHT_PHASE,
  SHADOW_PHASES, DREAM_SEASON_MAP,
  HIGHLIGHT_ORGAN_MAP, HIGHLIGHT_COLOR_MAP, phaseColorWithFallback,
} from '../../../../../constants/phases'


