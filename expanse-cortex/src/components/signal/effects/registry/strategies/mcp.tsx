// ══════════════════════════════════════════════════════════════
// MEMORY & MCP — radar ping, resonance pulse, data stream, recall
// ══════════════════════════════════════════════════════════════

import { MCPDataStream } from '../../MCPDataStream'
import { MCPRadarPing } from '../../MCPRadarPing'
import { RecallStream } from '../../RecallStream'
import { ResonancePulse } from '../../ResonancePulse'
import { hasEff, requireStep, MCP_PHASES, RESONANCE_TARGETS } from './shared'
import type { EffectStrategy } from '../types'

export const mcpRadarPing: EffectStrategy = {
  id: 'mcp-radar-ping',
  layer: 'mid',
  test: (ctx) => !!ctx.step && MCP_PHASES.has(ctx.step.phase ?? ''),
  render: (ctx, pct) => {
    const mPos = ctx.organPositions.get('Μ')
    if (!mPos) return null
    return <MCPRadarPing x={mPos.x} y={mPos.y} progress={pct} />
  },
}

export const resonancePulse: EffectStrategy = {
  id: 'resonance-pulse',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'resonance-pulse'),
  render: (ctx, pct) => {
    const { step } = requireStep(ctx)
    const mPos = ctx.organPositions.get('Μ')
    if (!mPos) return null
    const resultCount = step.mcpOperation?.resultCount ?? 1
    const intensity = Math.min(1, 0.5 + Math.max(0, resultCount - 1) / 6)
    return <ResonancePulse source={mPos} targets={RESONANCE_TARGETS} progress={pct} intensity={intensity} />
  },
}

export const mcpDataStream: EffectStrategy = {
  id: 'mcp-data-stream',
  layer: 'mid',
  test: (ctx) => !!ctx.step && MCP_PHASES.has(ctx.step.phase ?? '') && !hasEff(ctx, 'recall-stream'),
  render: (ctx, pct) => {
    const mPos = ctx.organPositions.get('Μ')
    const psiPos = ctx.organPositions.get('Ψ')
    if (!mPos || !psiPos) return null
    return <MCPDataStream from={mPos} to={psiPos} color="#f38ba8" progress={pct} />
  },
}

export const recallStream: EffectStrategy = {
  id: 'recall-stream',
  layer: 'mid',
  test: (ctx) => hasEff(ctx, 'recall-stream'),
  render: (ctx, pct) => {
    const mPos = ctx.organPositions.get('Μ')
    const psiPos = ctx.organPositions.get('Ψ')
    if (!mPos || !psiPos) return null
    return <RecallStream from={mPos} to={psiPos} progress={pct} />
  },
}

export const MCP_STRATEGIES: EffectStrategy[] = [
  mcpRadarPing,
  resonancePulse,
  mcpDataStream,
  recallStream,
]
