import { ORGAN_COLORS } from '../../constants/theme'
import { phaseColorWithFallback } from '../../constants/phases'
import { colorAlpha } from '../../utils/colorAlpha'
import type { ProcessStep, Temporality } from '../../types/signal'

/** Temporality styling lookup — replaces fragile ternary chain */
const TEMPORALITY_STYLE: Record<Temporality, { emoji: string; color: string; bg: string; border: string }> = {
  simultané:  { emoji: '⚡', color: 'var(--color-green)',  bg: 'color-mix(in srgb, var(--color-green) 10%, transparent)',  border: 'color-mix(in srgb, var(--color-green) 15%, transparent)' },
  conditionnel: { emoji: '🔄', color: 'var(--color-blue)',   bg: 'color-mix(in srgb, var(--color-blue) 10%, transparent)',  border: 'color-mix(in srgb, var(--color-blue) 15%, transparent)' },
  différé:    { emoji: '⏳', color: 'var(--color-yellow)', bg: 'color-mix(in srgb, var(--color-yellow) 10%, transparent)',  border: 'color-mix(in srgb, var(--color-yellow) 15%, transparent)' },
  séquentiel: { emoji: '⏱️', color: 'var(--color-overlay2)', bg: 'color-mix(in srgb, var(--color-overlay2) 6%, transparent)', border: 'color-mix(in srgb, var(--color-overlay2) 10%, transparent)' },
}

function StepSidebar({ step, stepIdx, steps, route, onStepClick }: {
  step: ProcessStep | null; stepIdx: number; steps: ProcessStep[]; route?: string; onStepClick: (i: number) => void
}) {
  const col = step ? (step.isNegative ? 'var(--color-red)' : ORGAN_COLORS[step.organ] ?? 'var(--color-blue)') : 'var(--color-overlay0)'
  const phaseCol = step?.phase ? phaseColorWithFallback(step.phase, route) : col

  return (
    <div className="w-80 flex-shrink-0 border-l border-white/[0.06] bg-crust/95 backdrop-blur-md flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.06]" style={{ background: `linear-gradient(135deg, ${colorAlpha(phaseCol, 0x15)} 0%, transparent 60%)` }}>
        {step ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold font-mono"
                style={{ backgroundColor: colorAlpha(phaseCol, 0x18), color: phaseCol, border: `1px solid ${colorAlpha(phaseCol, 0x30)}` }}>
                {step.organ}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono font-semibold text-fg truncate">{step.label}</div>
                <div className="text-[11px] font-mono text-overlay2 mt-0.5 truncate">{step.detail}</div>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              {step.phase && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold tracking-wide"
                  style={{ color: phaseCol, background: colorAlpha(phaseCol, 0x12), border: `1px solid ${colorAlpha(phaseCol, 0x25)}` }}>
                  {step.phase}
                </span>
              )}
              {step.badge && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium"
                  style={{ color: step.isNegative ? 'var(--color-red)' : col, background: step.isNegative ? 'color-mix(in srgb, var(--color-red) 10%, transparent)' : colorAlpha(col, 0x12), border: `1px solid ${step.isNegative ? 'color-mix(in srgb, var(--color-red) 15%, transparent)' : colorAlpha(col, 0x25)}` }}>
                  {step.badge}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="text-[12px] font-mono text-overlay0">En attente...</div>
        )}
      </div>

      {/* Detail Cards */}
      <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-2 step-log-scroll">
        {step?.ecsRoute && (
          <div className="rounded-lg p-3 space-y-1.5 tint-blue">
            <div className="text-[11px] font-mono font-semibold text-blue uppercase tracking-wider">ECS Route</div>
            <div className="flex items-center gap-1.5 text-[12px] font-mono">
              <span className="px-1.5 py-0.5 rounded tint-fg-chip">C={step.ecsRoute.c}</span>
              <span className="text-surface2">→</span>
              <span className="px-1.5 py-0.5 rounded tint-fg-chip">I={step.ecsRoute.i}</span>
              <span className="text-surface2">→</span>
              <span className="px-1.5 py-0.5 rounded font-semibold" style={{ background: colorAlpha(col, 0x12), color: col }}>{step.ecsRoute.level}</span>
            </div>
          </div>
        )}
        {step?.confidence != null && (
          <div className="rounded-lg p-3 space-y-1.5 tint-green">
            <div className="text-[11px] font-mono font-semibold text-green uppercase tracking-wider">Confiance</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${step.confidence}%`, backgroundColor: col, opacity: 0.85 }} />
              </div>
              <span className="text-[13px] font-mono font-semibold tabular-nums" style={{ color: col }}>{step.confidence}%</span>
            </div>
          </div>
        )}
        {step?.toolCalls && step.toolCalls.length > 0 && (
          <div className="rounded-lg p-3 space-y-1.5 tint-mauve">
            <div className="text-[11px] font-mono font-semibold text-mauve uppercase tracking-wider">Outils</div>
            {step.toolCalls.map((tc) => (
              <div key={tc} className="flex items-start gap-2">
                <span className="text-mauve text-[11px] mt-0.5">⚡</span>
                <code className="text-[12px] font-mono text-mauve leading-relaxed break-all">{tc}</code>
              </div>
            ))}
          </div>
        )}
        {step?.mcpOperation && (
          <div className="rounded-lg p-3 space-y-1.5 tint-sapphire">
            <div className="text-[11px] font-mono font-semibold text-sky uppercase tracking-wider">MCP</div>
            <div className="text-[12px] font-mono text-fg">
              <span className="px-1.5 py-0.5 rounded text-[11px] tint-fg-sky-chip">{step.mcpOperation.type}</span>
              <span className="text-overlay2 ml-2">{step.mcpOperation.toolName}</span>
            </div>
            {step.mcpOperation.resultCount != null && (
              <div className="text-[12px] font-mono text-overlay2">
                → {step.mcpOperation.resultCount} résultat{step.mcpOperation.resultCount > 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}
        {step?.packetFlows && step.packetFlows.length > 0 && (
          <div className="rounded-lg p-3 space-y-1.5 tint-lavender">
            <div className="text-[11px] font-mono font-semibold text-lavender uppercase tracking-wider">Flux</div>
            {step.packetFlows.map((pf) => (
              <div key={`${pf.source}-${pf.target}-${pf.label}`} className="flex items-center gap-1.5 text-[12px] font-mono">
                <span className="font-semibold" style={{ color: ORGAN_COLORS[pf.source] ?? 'var(--color-blue)' }}>{pf.source}</span>
                <span className="text-surface2">→</span>
                <span className="font-semibold" style={{ color: ORGAN_COLORS[pf.target] ?? 'var(--color-blue)' }}>{pf.target}</span>
                <span className="text-overlay2 ml-1 text-[11px]">{pf.label}</span>
              </div>
            ))}
          </div>
        )}
        {step?.temporality && (() => {
          const ts = TEMPORALITY_STYLE[step.temporality]
          return (
            <div className="rounded-lg p-3 space-y-1.5 tint-yellow">
              <div className="text-[11px] font-mono font-semibold text-yellow uppercase tracking-wider">Temporalité</div>
              <span className="px-2 py-0.5 rounded-md text-[12px] font-mono font-medium"
                style={{ color: ts.color, background: ts.bg, border: `1px solid ${ts.border}` }}>
                {ts.emoji} {step.temporality}
              </span>
            </div>
          )
        })()}
        {step?.visualEffects && step.visualEffects.length > 0 && (
          <div className="rounded-lg p-3 tint-green">
            <div className="flex flex-wrap gap-1.5">
              {step.visualEffects.map(ef => (
                <span key={ef} className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold uppercase tracking-wider tint-green-badge">
                  ✦ {ef}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step Log */}
      <div className="border-t border-white/[0.06] px-3 pt-2 pb-1">
        <div className="text-[11px] font-mono font-semibold text-overlay0 uppercase tracking-wider mb-1.5">Log</div>
      </div>
      <div className="overflow-y-auto px-2 pb-2 space-y-0.5 step-log-scroll step-log-max-h">
        {steps.map((s, i) => {
          const isCurrent = i === stepIdx
          const isPast = i < stepIdx
          const sc = s.isNegative ? 'var(--color-red)' : ORGAN_COLORS[s.organ] ?? 'var(--color-blue)'
          const pc = s.phase ? phaseColorWithFallback(s.phase, route) : sc
          return (
            <button key={`${s.organ}-${s.phase}-${i}`} onClick={() => onStepClick(i)}
              className={`w-full text-left rounded-md px-3 py-1.5 transition-all duration-150
                ${isCurrent ? '' : 'border-l-transparent'} ${isPast ? 'opacity-50' : isCurrent ? '' : 'opacity-25'}`}
              style={isCurrent ? { background: colorAlpha(pc, 0x0a), borderLeft: `2px solid ${pc}` } : undefined}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: isCurrent ? pc : 'color-mix(in srgb, var(--color-fg) 15%, transparent)' }} />
                <span className="text-[12px] font-mono font-medium" style={{ color: isCurrent ? pc : 'var(--color-overlay2)' }}>{s.organ}</span>
                <span className="text-[12px] font-mono text-surface2">→</span>
                <span className="text-[12px] font-mono" style={{ color: isCurrent ? 'var(--color-fg)' : 'var(--color-overlay0)' }}>{s.label}</span>
                {isCurrent && s.phase && (
                  <span className="ml-auto text-[10px] font-mono opacity-70" style={{ color: pc }}>{s.phase}</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { StepSidebar }
