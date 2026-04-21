// ══════════════════════════════════════════════════════════════
// BOOT & INIT — organ dendrites, ouvrier shadow, incarnation burst,
//   first light, healthcheck display, guard shield
// ══════════════════════════════════════════════════════════════

import { OrganDendrites } from '../../OrganDendrites'
import { OuvrierShadow } from '../../OuvrierShadow'
import { IncarnationBurst } from '../../IncarnationBurst'
import { FirstLight } from '../../FirstLight'
import { HealthcheckDisplay } from '../../HealthcheckDisplay'
import { GuardShield } from '../../GuardShield'
import { hasEff, requireStep, INCARNATION_PHASE, FIRST_LIGHT_PHASE, SHADOW_PHASES } from './shared'
import type { EffectStrategy } from '../types'

export const organDendrites: EffectStrategy = {
  id: 'organ-dendrites',
  layer: 'mid',
  test: (ctx) => !!ctx.step,
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    return <OrganDendrites step={step} progress={pct} organPositions={ctx.organPositions} isDreamMode={ctx.isDreamMode} />
  },
}

export const ouvrierShadow: EffectStrategy = {
  id: 'ouvrier-shadow',
  layer: 'mid',
  test: (ctx) => !!ctx.step && !ctx.isInertie && !SHADOW_PHASES.has(ctx.step.phase ?? ''),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    return <OuvrierShadow x={pos.x} y={pos.y} color={ctx.phaseCol} progress={pct} />
  },
}

export const incarnationBurst: EffectStrategy = {
  id: 'incarnation-burst',
  layer: 'mid',
  test: (ctx, pct) => ctx.step?.phase === INCARNATION_PHASE && pct >= 0.05,
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    return <IncarnationBurst x={pos.x} y={pos.y} progress={pct} />
  },
}

export const firstLight: EffectStrategy = {
  id: 'first-light',
  layer: 'mid',
  test: (ctx, pct) => ctx.step?.phase === FIRST_LIGHT_PHASE && pct >= 0.1,
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    return <FirstLight x={pos.x} y={pos.y} progress={pct} />
  },
}

export const healthcheckDisplay: EffectStrategy = {
  id: 'healthcheck-display',
  layer: 'mid',
  test: (ctx) => ctx.step?.phase === 'CHECK' && !hasEff(ctx, 'guard-shield') && !hasEff(ctx, 'constitutional-guard'),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    return <HealthcheckDisplay x={pos.x} y={pos.y} progress={pct} />
  },
}

export const guardShield: EffectStrategy = {
  id: 'guard-shield',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'guard-shield') || hasEff(ctx, 'constitutional-guard'),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    return <GuardShield x={pos.x} y={pos.y} progress={pct} />
  },
}

export const BOOT_STRATEGIES: EffectStrategy[] = [
  organDendrites,
  ouvrierShadow,
  incarnationBurst,
  firstLight,
  healthcheckDisplay,
  guardShield,
]
