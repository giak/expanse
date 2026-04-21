// ══════════════════════════════════════════════════════════════
// DREAM CYCLE — dream gate, mutation orbit, season cycle,
//   proposal bloom, prune shears
// ══════════════════════════════════════════════════════════════

import { hasEff, requireStep, DREAM_SEASON_MAP, LazyDreamGate, LazyMutationOrbit, LazySeasonCycle, LazyProposalBloom, LazyPruneShears } from './shared'
import type { EffectStrategy } from '../types'

export const dreamGate: EffectStrategy = {
  id: 'dream-gate',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'dream-gate'),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const psiPos = ctx.organPositions.get('Ψ')
    if (!psiPos) return null
    const isOpen = step.phase !== 'WINTER'
    return <LazyDreamGate x={psiPos.x} y={psiPos.y} progress={pct} open={isOpen} />
  },
}

export const mutationOrbit: EffectStrategy = {
  id: 'mutation-orbit',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'mutation-orbit'),
  render: (ctx, pct) => {
    const psiPos = ctx.organPositions.get('Ψ')
    if (!psiPos) return null
    const proposalCount = ctx.stepIdx >= 7 ? 2 : 1
    return <LazyMutationOrbit x={psiPos.x} y={psiPos.y} progress={pct} proposalCount={proposalCount} />
  },
}

export const seasonCycle: EffectStrategy = {
  id: 'season-cycle',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'season-cycle'),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const psiPos = ctx.organPositions.get('Ψ')
    if (!psiPos) return null
    const season = DREAM_SEASON_MAP[step.phase ?? ''] ?? 'spring'
    return <LazySeasonCycle x={psiPos.x} y={psiPos.y} progress={pct} season={season} />
  },
}

export const proposalBloom: EffectStrategy = {
  id: 'proposal-bloom',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'proposal-bloom'),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const muPos = ctx.organPositions.get('Μ')
    if (!muPos) return null
    const label = step.badge?.includes('REFACTOR') ? 'REFACTOR' : step.badge?.includes('DELETE') ? 'DELETE' : 'MODIFY'
    return <LazyProposalBloom x={muPos.x} y={muPos.y} progress={pct} label={label} />
  },
}

export const pruneShears: EffectStrategy = {
  id: 'prune-shears',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'prune-shears'),
  render: (ctx, pct) => {
    const muPos = ctx.organPositions.get('Μ')
    if (!muPos) return null
    return <LazyPruneShears x={muPos.x} y={muPos.y} progress={pct} />
  },
}

export const DREAM_STRATEGIES: EffectStrategy[] = [
  dreamGate,
  mutationOrbit,
  seasonCycle,
  proposalBloom,
  pruneShears,
]
