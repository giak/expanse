import { useState, lazy, Suspense, useEffect } from 'react'
import { StepSidebar } from '../components/signal/StepSidebar'
import { SignalCanvas } from '../components/signal/SignalCanvas'
import { PlaybackControls } from '../components/signal/PlaybackControls'
import { useSignalPlayback } from '../hooks/useSignalPlayback'
import { SCENARIOS } from '../data/scenarios'
import { loadDidacticData } from '../data/scenarioDidactics'
import type { ManifestConcept, GlossaryEntry, StepDidactic } from '../data/didacticTypes'
import { SignalProvider } from '../context/SignalContext'
import { SidebarErrorBoundary } from '../components/errors/ErrorBoundaries'

// ─── Lazy-loaded sidebar (doesn't block canvas rendering) ───
const DidacticPanel = lazy(() => import('../components/DidacticPanel').then(m => ({ default: m.DidacticPanel })))

// ══════════════════════════════════════════════════════════════
// MAIN SIGNAL VIEW
// ══════════════════════════════════════════════════════════════

export function SignalView() {
  // ── Async didactic loading (code-split from scenarioDidactics.ts) ──
  // Didactics are sidebar-only data — the canvas renders before they arrive.
  const [didactics, setDidactics] = useState<StepDidactic[]>([])
  const [didacticData, setDidacticData] = useState<{ manifestConcepts: ManifestConcept[]; glossary: Record<string, GlossaryEntry>; glossaryRegex: RegExp } | null>(null)

  // ── Playback state machine (extracted into custom hook) ──
  // scenarioId is read inside the hook from URL hash + useState.
  const {
    scenarioId, idx, playing, speed, visited,
    scenario, steps, step, isInertie, isListening, done, phaseCol,
    play, pause, reset, switchScenario, cycleSpeed, handleStepClick, stepForward, stepBackward,
  } = useSignalPlayback({
    scenarios: SCENARIOS,
    didactics,
  })

  // Load didactics for the active scenario only (per-scenario code-split ~7-16 KB)
  useEffect(() => {
    setDidactics([])
    setDidacticData(null) // clear stale data from previous scenario
    let cancelled = false
    loadDidacticData(scenarioId).then(data => {
      if (cancelled) return
      setDidactics(data.didactics)
      setDidacticData({ manifestConcepts: data.manifestConcepts, glossary: data.glossary, glossaryRegex: data.glossaryRegex })
    })
    return () => { cancelled = true }
  }, [scenarioId])

  // ── UI-only state (not part of playback logic) ──
  const [canvasHighlight, setCanvasHighlight] = useState<string | null>(null)

  // SignalProvider computes scenarioCtx + auraState for Story 6.2 (AuraField).
  // No current consumer yet, but the provider must be here so future AURA
  // components can access useSignal() without refactoring.
  return (
    <SignalProvider steps={steps} stepIdx={idx} step={step}>
    <div className="w-full h-full flex">
      {/* Left: SVG canvas + controls */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 relative overflow-hidden">
          <SignalCanvas
            step={step} steps={steps} stepIdx={idx} visited={visited}
            playing={playing} isInertie={isInertie} isListening={isListening} phaseCol={phaseCol}
            scenario={scenario}
            canvasHighlight={canvasHighlight} onOrganClick={handleStepClick}
          />
        </div>

        <PlaybackControls
          scenarios={SCENARIOS} scenarioId={scenarioId} scenario={scenario}
          step={step} idx={idx} steps={steps} playing={playing} speed={speed} phaseCol={phaseCol} done={done}
          play={play} pause={pause} reset={reset} stepForward={stepForward} stepBackward={stepBackward}
          switchScenario={switchScenario} cycleSpeed={cycleSpeed}
        />
      </div>

      {/* Middle + Right: sidebar panels protected by SidebarErrorBoundary */}
      <SidebarErrorBoundary>
        <StepSidebar step={step} stepIdx={idx} steps={steps} route={scenario.route} onStepClick={handleStepClick} />
        <Suspense fallback={<div className="w-96 flex-shrink-0 border-l border-white/[0.06] bg-sidebar" />}>
          <DidacticPanel
            step={step} stepIdx={idx}
            scenarioId={scenarioId}
            scenarioTitle={scenario.title}
            didactics={didactics}
            manifestConcepts={didacticData?.manifestConcepts ?? []}
            glossary={didacticData?.glossary ?? {}}
            glossaryRegex={didacticData?.glossaryRegex ?? /(?:)/u}
            divergences={scenario.divergences}
            onCanvasHighlight={setCanvasHighlight}
          />
        </Suspense>
      </SidebarErrorBoundary>
    </div>
    </SignalProvider>
  )
}
