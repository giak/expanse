// ══════════════════════════════════════════════════════════════
// PERCEPTION & ECS ROUTING — ECS prism, lightning bolt, output comparison
// ══════════════════════════════════════════════════════════════

import { ECSPrism } from '../../ECSPrism'
import { LightningBoltL1 } from '../../LightningBoltL1'
import { OutputComparison } from '../../OutputComparison'
import { requireStep, assertNonNull } from './shared'
import type { EffectStrategy } from '../types'

export const ecsPrism: EffectStrategy = {
  id: 'ecs-prism',
  layer: 'mid',
  test: (ctx) => !!ctx.step?.ecsFork,
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    return <ECSPrism x={pos.x} y={pos.y} level={assertNonNull(step.ecsFork, 'step.ecsFork').level} progress={pct} organPositions={ctx.organPositions} />
  },
}

export const lightningBoltL1: EffectStrategy = {
  id: 'lightning-bolt-l1',
  layer: 'mid',
  test: (ctx) => ctx.step?.phase === 'ROUTE',
  render: (ctx, pct) => {
    const sigmaPos = ctx.organPositions.get('Σ')
    const omegaPos = ctx.organPositions.get('Ω')
    if (!sigmaPos || !omegaPos) return null
    return <LightningBoltL1 sigmaPos={sigmaPos} omegaPos={omegaPos} progress={pct} />
  },
}

export const outputComparison: EffectStrategy = {
  id: 'output-comparison',
  layer: 'mid',
  test: (ctx) => ctx.step?.phase === 'EMIT' || ctx.step?.phase === 'LOST_EMIT',
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    return <OutputComparison x={pos.x} y={pos.y + 70} progress={pct} />
  },
}

export const ECS_STRATEGIES: EffectStrategy[] = [
  ecsPrism,
  lightningBoltL1,
  outputComparison,
]
