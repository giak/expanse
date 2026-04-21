// ══════════════════════════════════════════════════════════════
// AUDIT & TRIANGULATION — audit loop, tool flash, tri-pole orbit,
//   confiance gauge, constitutional guard
// ══════════════════════════════════════════════════════════════

import { AuditLoop } from '../../AuditLoop'
import { ToolFlash } from '../../ToolFlash'
import { hasEff, requireStep, LazyTriPoleOrbit, LazyConfianceGauge, LazyConstitutionalGuard } from './shared'
import type { EffectStrategy } from '../types'

export const auditLoop: EffectStrategy = {
  id: 'audit-loop',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'audit-loop'),
  render: (ctx, pct) => {
    const psiPos = ctx.organPositions.get('Ψ')
    const phiPos = ctx.organPositions.get('Φ')
    if (!psiPos || !phiPos) return null
    return <AuditLoop psiPos={psiPos} phiPos={phiPos} progress={pct} />
  },
}

export const toolFlash: EffectStrategy = {
  id: 'tool-flash',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'tool-flash'),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    const isFile = step.toolCalls?.some(t => t.includes('read_file')) ?? false
    const isGlobe = step.phase === 'WEB_POLE'
    return <ToolFlash x={pos.x} y={pos.y} progress={pct} toolType={isGlobe ? 'globe' : isFile ? 'file' : 'magnify'} />
  },
}

export const triPoleOrbit: EffectStrategy = {
  id: 'tri-pole-orbit',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'tri-pole-orbit'),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    return <LazyTriPoleOrbit x={pos.x} y={pos.y} progress={pct} />
  },
}

export const triPoleOrbitConverging: EffectStrategy = {
  id: 'tri-pole-orbit-converging',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'tri-pole-orbit-converging'),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    return <LazyTriPoleOrbit x={pos.x} y={pos.y} progress={pct} converging />
  },
}

export const confianceGauge: EffectStrategy = {
  id: 'confiance-gauge',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'confiance-gauge'),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    return <LazyConfianceGauge x={pos.x} y={pos.y} progress={pct} targetPercent={step.confidence ?? 82} />
  },
}

export const constitutionalGuard: EffectStrategy = {
  id: 'constitutional-guard',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'constitutional-guard'),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    return <LazyConstitutionalGuard x={pos.x} y={pos.y} progress={pct} />
  },
}

export const AUDIT_STRATEGIES: EffectStrategy[] = [
  auditLoop,
  toolFlash,
  triPoleOrbit,
  triPoleOrbitConverging,
  confianceGauge,
  constitutionalGuard,
]
