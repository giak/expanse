// ══════════════════════════════════════════════════════════════
// FOREGROUND (post-organ z-order) — neural bridge, canvas highlight,
//   phase banner, packet flow, activation shockwave
// ══════════════════════════════════════════════════════════════

import { PhaseBanner } from '../../PhaseBanner'
import { ActivationShockwave } from '../../ActivationShockwave'
import { hasEff, requireStep, assertNonNull, LazyNeuralBridge, LazyPacketFlowRenderer, SHOCKWAVE_PHASES, HIGHLIGHT_ORGAN_MAP, HIGHLIGHT_COLOR_MAP, phaseColorWithFallback } from './shared'
import type { EffectStrategy } from '../types'

/** Neural bridge — background layer, dream mode only */
export const neuralBridge: EffectStrategy = {
  id: 'neural-bridge',
  layer: 'bg',
  test: (ctx) => ctx.isDreamMode,
  render: (ctx, pct) => {
    const psiPos = ctx.organPositions.get('Ψ')
    const muPos = ctx.organPositions.get('Μ')
    if (!psiPos || !muPos) return null
    const established = ctx.stepIdx > 0
    return <LazyNeuralBridge psiPos={psiPos} muPos={muPos} progress={pct} season={ctx.dreamSeason} established={established} />
  },
}

/** Canvas highlight from Didactic Panel hover — mid layer, after other mid effects */
export const canvasHighlight: EffectStrategy = {
  id: 'canvas-highlight',
  layer: 'mid',
  test: (ctx) => !!ctx.canvasHighlight,
  render: (ctx, _pct) => {
    const highlight = assertNonNull(ctx.canvasHighlight, 'ctx.canvasHighlight')
    const organSym = HIGHLIGHT_ORGAN_MAP[highlight]
    if (!organSym) return null
    const pos = ctx.organPositions.get(organSym)
    if (!pos) return null
    const hCol = phaseColorWithFallback(HIGHLIGHT_COLOR_MAP[highlight] ?? ctx.step?.phase)
    return (
      <g className="pointer-events-none">
        <circle cx={pos.x} cy={pos.y} r={65} fill={hCol} opacity={0.08} filter="url(#glow)" />
        <circle cx={pos.x} cy={pos.y} r={50} fill="none" stroke={hCol}
          strokeWidth={2} opacity={0.3} filter="url(#glow)" className="signal-ring-pulse" />
      </g>
    )
  },
}

/** Phase Banner — mid layer, after canvas highlight */
export const phaseBanner: EffectStrategy = {
  id: 'phase-banner',
  layer: 'mid',
  test: (ctx) => !!ctx.step?.phase,
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    return <PhaseBanner phase={assertNonNull(step.phase, 'step.phase')} progress={pct} route={ctx.scenarioRoute} />
  },
}

/** Packet flow renderer — foreground layer */
export const packetFlowRenderer: EffectStrategy = {
  id: 'packet-flow-renderer',
  layer: 'fg',
  test: (ctx, pct) => !!ctx.step?.packetFlows && ctx.step.packetFlows.length > 0 && pct > 0.05,
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    return <LazyPacketFlowRenderer flows={assertNonNull(step.packetFlows, 'step.packetFlows')} progress={pct} organPositions={ctx.organPositions} />
  },
}

/** Activation shockwave — foreground layer */
export const activationShockwave: EffectStrategy = {
  id: 'activation-shockwave',
  layer: 'fg',
  test: (ctx, pct) =>
    !!ctx.step && pct < 0.25 &&
    (SHOCKWAVE_PHASES.has(ctx.step.phase ?? '') || hasEff(ctx, 'crystallize')),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const pos = ctx.organPositions.get(step.organ)
    if (!pos) return null
    return <ActivationShockwave x={pos.x} y={pos.y} color={ctx.phaseCol} progress={pct * 4} />
  },
}

export const FOREGROUND_STRATEGIES: EffectStrategy[] = [
  neuralBridge,
  canvasHighlight,
  phaseBanner,
  packetFlowRenderer,
  activationShockwave,
]
