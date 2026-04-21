import type { Scenario, ProcessStep } from '../../types/signal'
import { ScenarioPopover } from './ScenarioPopover'

// ══════════════════════════════════════════════════════════════
// PLAYBACK CONTROLS — transport bar for scenario navigation
// Redesigned: ScenarioPopover (VS Code style) + transport + step info
// ══════════════════════════════════════════════════════════════

export interface PlaybackControlsProps {
  scenarios: Scenario[]
  scenarioId: string
  scenario: Scenario
  step: ProcessStep | null
  idx: number
  steps: ProcessStep[]
  playing: boolean
  speed: number
  phaseCol: string
  done: boolean
  // Actions
  play: () => void
  pause: () => void
  reset: () => void
  stepForward: () => void
  stepBackward: () => void
  switchScenario: (id: string) => void
  cycleSpeed: () => void
}

export function PlaybackControls({
  scenarios, scenarioId, scenario,
  step, idx, steps, playing, speed, phaseCol, done,
  play, pause, reset, stepForward, stepBackward, switchScenario, cycleSpeed,
}: PlaybackControlsProps) {
  return (
    <div className="flex-shrink-0 border-t border-white/5 bg-sidebar/95 backdrop-blur-md px-4 py-2 flex items-center gap-3">
      {/* Scenario selector — VS Code popover */}
      <ScenarioPopover
        scenarios={scenarios} scenarioId={scenarioId} scenario={scenario}
        switchScenario={switchScenario}
      />

      {/* Separator */}
      <div className="w-px h-5 bg-white/10" />

      {/* Transport controls */}
      <button onClick={reset} className="p-1.5 rounded-md text-overlay0 hover:text-fg hover:bg-white/5" title="Reset" aria-label="Reset scenario">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 1 9 9" /><path d="M3 3v6h6" /></svg>
      </button>
      <button onClick={stepBackward} disabled={idx === 0}
        className="p-1.5 rounded-md text-overlay0 hover:text-fg hover:bg-white/5 disabled:opacity-30" aria-label="Step backward">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="19 20 9 12 19 4" /><line x1="5" y1="19" x2="5" y2="5" /></svg>
      </button>
      {playing ? (
        <button onClick={pause} className="p-2 rounded-lg bg-white/10 text-fg hover:bg-white/15" title="Pause" aria-label="Pause">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
        </button>
      ) : (
        <button onClick={play} className="p-2 rounded-lg text-fg hover:bg-white/15"
          style={{ backgroundColor: `${scenario.color}20` }} title={done ? 'Replay' : 'Play'} aria-label={done ? 'Replay' : 'Play'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21" /></svg>
        </button>
      )}
      <button onClick={stepForward} disabled={idx >= steps.length - 1}
        className="p-1.5 rounded-md text-overlay0 hover:text-fg hover:bg-white/5 disabled:opacity-30" aria-label="Step forward">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20" /><line x1="19" y1="5" x2="19" y2="19" /></svg>
      </button>

      {/* Step progress indicator */}
      <span className="text-[9px] font-mono text-surface1 tabular-nums">
        {idx + 1}/{steps.length}
      </span>

      {/* Separator */}
      <div className="w-px h-5 bg-white/10" />

      {/* Step info — flexible center area */}
      <div className="flex-1 min-w-0 text-center">
        <span className="text-xs font-mono" style={{ color: phaseCol }}>{step?.organ ?? '—'}</span>
        <span className="text-overlay0 text-xs mx-1.5">→</span>
        <span className="text-fg text-xs font-mono">{step?.label ?? 'Prêt'}</span>
        {step?.detail && <span className="text-overlay0 text-[10px] ml-2 font-mono">{step.detail}</span>}
      </div>

      {/* Speed control */}
      <button onClick={cycleSpeed} className="px-2 py-1 rounded-md text-[10px] font-mono border border-white/10 hover:border-white/20"
        style={{ color: speed === 1 ? 'var(--color-overlay0)' : speed < 1 ? 'var(--color-yellow)' : scenario.color }} aria-label={`Playback speed ${speed}x`}>{speed}×</button>
    </div>
  )
}
