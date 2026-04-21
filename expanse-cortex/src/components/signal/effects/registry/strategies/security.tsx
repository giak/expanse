// ══════════════════════════════════════════════════════════════
// SECURITY & VIOLATIONS — red alert, contradiction bolt, block wall,
//   fresh trace mark, lost stamp
// ══════════════════════════════════════════════════════════════

import { hasEff, requireStep, LazyRedAlert, LazyContradictionBolt, LazyBlockWall, LazyFreshTraceMark, LazyLOSTStamp } from './shared'
import type { EffectStrategy } from '../types'

/** Red Alert + Contradiction Bolt — paired during DETECT phase */
export const redAlert: EffectStrategy = {
  id: 'red-alert',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'red-alert'),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    const sigmaPos = ctx.organPositions.get('Σ')
    const muPos = ctx.organPositions.get('Μ')
    if (!pos) return null
    return (
      <g>
        <LazyRedAlert x={pos.x} y={pos.y} progress={pct} />
        {sigmaPos && muPos && <LazyContradictionBolt sigmaPos={sigmaPos} muPos={muPos} progress={pct} />}
      </g>
    )
  },
}

/** Contradiction Bolt — standalone (for EXT-CONTRADICTION scenario) */
export const contradictionBolt: EffectStrategy = {
  id: 'contradiction-bolt',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'contradiction-bolt'),
  render: (ctx, pct) => {
    const sigmaPos = ctx.organPositions.get('Σ')
    const muPos = ctx.organPositions.get('Μ')
    if (!sigmaPos || !muPos) return null
    return <LazyContradictionBolt sigmaPos={sigmaPos} muPos={muPos} progress={pct} />
  },
}

export const blockWall: EffectStrategy = {
  id: 'block-wall',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'block-wall'),
  render: (ctx, pct) => {
    const omegaPos = ctx.organPositions.get('Ω')
    if (!omegaPos) return null
    return <LazyBlockWall x={omegaPos.x} y={omegaPos.y} progress={pct} />
  },
}

export const freshTraceMark: EffectStrategy = {
  id: 'fresh-trace-mark',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'fresh-trace-mark'),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    return <LazyFreshTraceMark x={pos.x} y={pos.y} progress={pct} />
  },
}

export const lostStamp: EffectStrategy = {
  id: 'lost-stamp',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'lost-stamp'),
  render: (ctx, pct) => {
    const omegaPos = ctx.organPositions.get('Ω')
    if (!omegaPos) return null
    return <LazyLOSTStamp x={omegaPos.x} y={omegaPos.y} progress={pct} />
  },
}

export const SECURITY_STRATEGIES: EffectStrategy[] = [
  redAlert,
  contradictionBolt,
  blockWall,
  freshTraceMark,
  lostStamp,
]
