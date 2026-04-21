// ══════════════════════════════════════════════════════════════
// HALLUCINATION & VESSEL — fog patch, vessel radar, grep beam,
//   question mark shield
// ══════════════════════════════════════════════════════════════

import { ToolFlash } from '../../ToolFlash'
import { hasEff, requireStep, LazyFogPatch, LazyVesselRadar, LazyGrepBeam, LazyQuestionMarkShield } from './shared'
import type { EffectStrategy } from '../types'

/** Fog Patch — co-renders ToolFlash when toolCalls present */
export const fogPatch: EffectStrategy = {
  id: 'fog-patch',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'fog-patch'),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    const isDense = step.phase === 'MISSING'
    const hasToolCalls = (step.toolCalls?.length ?? 0) > 0
    const isFile = step.toolCalls?.some(t => t.includes('read_file')) ?? false
    return (
      <g>
        <LazyFogPatch x={pos.x} y={pos.y} progress={pct} dense={isDense} />
        {hasToolCalls && <ToolFlash x={pos.x} y={pos.y} progress={pct} toolType={isFile ? 'file' : 'magnify'} />}
      </g>
    )
  },
}

/** Vessel Radar + Grep Beam — paired during VESSEL_SEARCH */
export const vesselRadar: EffectStrategy = {
  id: 'vessel-radar',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'vessel-radar'),
  render: (ctx, pct) => {
    const phiPos = ctx.organPositions.get('Φ')
    if (!phiPos) return null
    return (
      <g>
        <LazyVesselRadar x={phiPos.x} y={phiPos.y} progress={pct} />
        <LazyGrepBeam x={phiPos.x} y={phiPos.y} progress={pct} />
      </g>
    )
  },
}

/** Grep Beam — standalone (rare) */
export const grepBeam: EffectStrategy = {
  id: 'grep-beam',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'grep-beam'),
  render: (ctx, pct) => {
    const phiPos = ctx.organPositions.get('Φ')
    if (!phiPos) return null
    return <LazyGrepBeam x={phiPos.x} y={phiPos.y} progress={pct} />
  },
}

export const questionMarkShield: EffectStrategy = {
  id: 'question-mark-shield',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'question-mark-shield'),
  render: (ctx, pct) => {
    const phiPos = ctx.organPositions.get('Φ')
    if (!phiPos) return null
    return <LazyQuestionMarkShield x={phiPos.x} y={phiPos.y} progress={pct} />
  },
}

export const HALLUCINATION_STRATEGIES: EffectStrategy[] = [
  fogPatch,
  vesselRadar,
  grepBeam,
  questionMarkShield,
]
