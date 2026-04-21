import { useMemo, Suspense } from 'react'
import { useAnimationPct } from '../../hooks/useAnimationLoop'
import { ORGAN_COLORS, ORGAN_ORDER } from '../../constants/theme'
import { colorAlpha } from '../../utils/colorAlpha'
import { DREAM_SEASON_MAP } from '../../constants/phases'
import { AuraField } from './effects/AuraField'
import { AuraBudget } from './effects/AuraBudget'
import { EFFECT_REGISTRY_BY_LAYER } from './effects/registry'
import type { StaticEffectContext } from './effects/registry'
import { EffectErrorBoundary } from '../errors/ErrorBoundaries'
import { hexPoints } from '../../utils/shapePoints'
import { ORGAN_LABELS } from '../../utils/organLayout'
import { organPositions } from '../../utils/positionGraphNodes'
import { SvgDefs } from '../svg/SvgDefs'
import { ResetViewButton } from '../svg/ResetViewButton'
import { VitalRingTrack, VitalRingArrows } from '../vitals/VitalRingTrack'
import { useViewBoxZoom } from '../../hooks/useSvgZoom'
import type { ProcessStep, Scenario } from '../../types/signal'

// ══════════════════════════════════════════════════════════════
// SIGNAL CANVAS — SVG viewport for cognitive process animation
// ══════════════════════════════════════════════════════════════

export interface SignalCanvasProps {
  // Current step state
  step: ProcessStep | null
  steps: ProcessStep[]
  stepIdx: number
  // pct is now read via useAnimationPct() — no longer a prop
  visited: Set<string>       // organs that have been active
  // Derived state flags
  playing: boolean
  isInertie: boolean
  isListening: boolean
  phaseCol: string           // phase-driven color
  // Scenario metadata
  scenario: Scenario
  // UI interaction
  canvasHighlight: string | null
  onOrganClick: (stepIdx: number) => void
}

export function SignalCanvas({
  step, steps, stepIdx, visited,
  playing, isInertie, isListening, phaseCol,
  scenario,
  canvasHighlight, onOrganClick,
}: SignalCanvasProps) {
  // ── Subscribe to external animation loop (60fps re-renders ONLY here) ──
  const pct = useAnimationPct()
  // ── Dream mode detection — SCENARIO-level (not step-level) ──
  const isDreamMode = scenario.route === 'DREAM'
  const dreamSeason = DREAM_SEASON_MAP[step?.phase ?? ''] ?? 'spring'

  // ── ViewBox zoom/pan ──
  const { viewBox, svgRef, hasDragged, isDraggingActive, isZoomed, resetView, mouseHandlers } = useViewBoxZoom()

  // ── Build static context for the effect registry (memoized) ──
  // StaticEffectContext changes only when step changes — NOT every frame.
  // pct (volatile, 60fps) is passed separately to strategy.test/render.
  const staticCtx: StaticEffectContext = useMemo(() => ({
    step, stepIdx,
    isInertie, phaseCol,
    scenarioRoute: scenario.route, isDreamMode, dreamSeason,
    organPositions,
    canvasHighlight,
  }), [step, stepIdx, isInertie, phaseCol, scenario.route, isDreamMode, dreamSeason, canvasHighlight])

  return (
    <div className={`w-full h-full relative ${isDraggingActive ? 'cursor-grabbing' : isZoomed ? 'cursor-grab' : 'cursor-default'}`}>
    <svg ref={svgRef} data-testid="signal-canvas"
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
      className="w-full h-full signal-canvas-bg" preserveAspectRatio="xMidYMid meet"
      {...mouseHandlers}
    >
      <SvgDefs />

      {/* ── AURA FIELD — context milieu (z-0: behind organs) ── */}
      <EffectErrorBoundary effectKey="aura-field">
        <AuraField />
      </EffectErrorBoundary>

      {/* Vital ring — dims during INERTIE, fades during DREAM */}
      <EffectErrorBoundary effectKey="vital-ring">
        <g style={{ opacity: isInertie ? 0.3 : isListening ? 0.6 : isDreamMode ? 0.15 : 1, transition: 'opacity 1.5s ease' }}>
          <VitalRingTrack organPositions={organPositions}
            flowDuration={isInertie || isListening ? 12 : step?.phase === 'APEX' ? 4 : 6} />
          <VitalRingArrows organPositions={organPositions} />
        </g>
      </EffectErrorBoundary>

      {/* ══════════════════════════════════════════════════════════
          EFFECT REGISTRY — bg-layer effects (pre-organ, z-0)
          Suspense for lazy-loaded strategies + EffectErrorBoundary for cascade isolation.
      ══════════════════════════════════════════════════════════ */}
      <Suspense fallback={null}>
      {EFFECT_REGISTRY_BY_LAYER.bg.map(strategy =>
        strategy.test(staticCtx, pct) ? (
          <EffectErrorBoundary key={strategy.id} effectKey={strategy.id}>
            {strategy.render(staticCtx, pct)}
          </EffectErrorBoundary>
        ) : null
      )}
      </Suspense>

      {/* ══════════════════════════════════════════════════════════
          EFFECT REGISTRY — mid-layer effects (before organs)
          Suspense for lazy-loaded strategies + EffectErrorBoundary for cascade isolation.
      ══════════════════════════════════════════════════════════ */}
      <Suspense fallback={null}>
      {EFFECT_REGISTRY_BY_LAYER.mid.map(strategy =>
        strategy.test(staticCtx, pct) ? (
          <EffectErrorBoundary key={strategy.id} effectKey={strategy.id}>
            {strategy.render(staticCtx, pct)}
          </EffectErrorBoundary>
        ) : null
      )}
      </Suspense>

      {/* ── Organs ── */}
      {ORGAN_ORDER.map(sym => {
        const pos = organPositions.get(sym)!
        const active = step?.organ === sym
        const vis = visited.has(sym)
        const col = ORGAN_COLORS[sym]
        const r = 32
        const pulse = active
          ? (isListening && !playing)
            ? 0.3  // Gentle resting pulse when alive and awaiting input
            : Math.sin(pct * Math.PI * 2) * 0.5 + 0.5
          : 0

        // Progressive reveal: organs not yet visited are barely visible ghosts
        const isGhost = !active && !vis

        // Dream mode: fade out non-Ψ/Μ organs UNLESS they're the active organ
        const isDreamFaded = isDreamMode && !active && sym !== 'Ψ' && sym !== 'Μ'

        return (
          <g key={sym} transform={`translate(${pos.x}, ${pos.y})`}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              if (hasDragged.current) return
              const fromIdx = stepIdx
              let nextIdx = -1
              for (let offset = 0; offset < steps.length; offset++) {
                const candidate = (fromIdx + offset) % steps.length
                if (steps[candidate].organ === sym) { nextIdx = candidate; break }
              }
              if (nextIdx >= 0) onOrganClick(nextIdx)
            }}
            style={{ opacity: isDreamFaded ? 0.12 : (isInertie && !active) ? 0.35 : (isListening && sym !== 'Σ') ? 0.5 : 1, transition: 'opacity 1.5s ease', cursor: 'pointer' }}
            onMouseDown={e => e.stopPropagation()}>

            {/* Active organ glow */}
            {active && <circle r={r + 18} fill={col} opacity={0.1 + pulse * 0.15} filter="url(#glow)" />}
            {active && <circle r={r + 10} fill="none" stroke={step?.isNegative ? 'var(--color-red)' : col}
              strokeWidth={1.5} opacity={0.3 + pulse * 0.3} filter="url(#glow)" className="signal-ring-pulse" />}

            {/* Organ hexagon */}
            <polygon points={hexPoints(r)}
              fill={active ? col : vis ? col : colorAlpha('var(--color-base)', 0x66)}
              stroke={active ? '#fff' : vis ? col : 'rgba(255,255,255,0.06)'}
              strokeWidth={active ? 2 : vis ? 1 : 0.3}
              opacity={active ? 1 : vis ? 0.5 : 0.15}
              className={isGhost ? 'signal-breathe' : (isListening && active && !playing) ? 'signal-breathe' : undefined}
              style={{ transition: 'fill 0.3s, stroke 0.3s, opacity 0.3s' }} />

            {/* Inner core */}
            <circle r={r * 0.4} fill="rgba(0,0,0,0.3)" />

            {/* Symbol */}
            <text textAnchor="middle" dominantBaseline="central"
              fill={active ? '#fff' : vis ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.1)'}
              fontSize={18} fontWeight="bold" fontFamily="'JetBrains Mono', monospace">{sym}</text>

            {/* Label below */}
            <text y={r + 12} textAnchor="middle" fill={active ? col : 'var(--color-overlay0)'}
              fontSize={7} fontFamily="'JetBrains Mono', monospace" opacity={active ? 0.8 : 0.3}>
              {ORGAN_LABELS[sym] ?? sym}
            </text>

            {/* Active step label above */}
            {active && step && (
              <text y={-r - 12} textAnchor="middle" fill={step.isNegative ? 'var(--color-red)' : 'var(--color-fg)'}
                fontSize={10} fontWeight="600" fontFamily="'JetBrains Mono', monospace">{step.label}</text>
            )}

            {/* Badge */}
            {active && step?.badge && (
              <g transform={`translate(0, ${r + 24})`}>
                <rect x={-step.badge.length * 3 - 4} y={-7} width={step.badge.length * 6 + 8} height={14}
                  rx={3} fill={step.isNegative ? colorAlpha('var(--color-red)', 0x26) : colorAlpha(col, 0x20)}
                  stroke={step.isNegative ? colorAlpha('var(--color-red)', 0x4d) : colorAlpha(col, 0x40)} strokeWidth={0.5} />
                <text textAnchor="middle" fill={step.isNegative ? 'var(--color-red)' : col}
                  fontSize={7} fontFamily="'JetBrains Mono', monospace">{step.badge}</text>
              </g>
            )}
          </g>
        )
      })}

      {/* ══════════════════════════════════════════════════════════
          EFFECT REGISTRY — fg-layer effects (after organs)
          Suspense for lazy-loaded strategies + EffectErrorBoundary for cascade isolation.
      ══════════════════════════════════════════════════════════ */}
      <Suspense fallback={null}>
      {EFFECT_REGISTRY_BY_LAYER.fg.map(strategy =>
        strategy.test(staticCtx, pct) ? (
          <EffectErrorBoundary key={strategy.id} effectKey={strategy.id}>
            {strategy.render(staticCtx, pct)}
          </EffectErrorBoundary>
        ) : null
      )}
      </Suspense>

      {/* ── AURA BUDGET — context usage bar ── */}
      <EffectErrorBoundary effectKey="aura-budget">
        <AuraBudget />
      </EffectErrorBoundary>

      {/* Title */}
      <text x={30} y={-530} fill={scenario.color} fontSize={16} fontWeight="bold"
        fontFamily="'JetBrains Mono', monospace" opacity={0.9}>SIGNAL — {scenario.title}</text>
      <text x={30} y={-510} fill="var(--color-overlay0)" fontSize={11}
        fontFamily="'JetBrains Mono', monospace" opacity={0.6}>{scenario.subtitle}</text>
      <text x={530} y={-530} textAnchor="end" fill="var(--color-overlay0)" fontSize={11}
        fontFamily="'JetBrains Mono', monospace">{stepIdx + 1}/{steps.length}</text>
    </svg>

    <ResetViewButton isZoomed={isZoomed} resetView={resetView} />
    </div>
  )
}
