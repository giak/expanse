import { useState, useEffect } from 'react'
import { LISTEN_PHASE, phaseColorWithFallback } from '../constants/phases'
import { animationLoop } from './useAnimationLoop'
import type { Scenario, ProcessStep } from '../types/signal'
import type { StepDidactic } from '../data/didacticTypes'

// Stable reference avoids lint warning when used as default in useEffect deps
const STABLE_EMPTY_DIDACTICS: StepDidactic[] = [] as StepDidactic[]

// ══════════════════════════════════════════════════════════════
// SIGNAL PLAYBACK HOOK — state machine for scenario animation
// ══════════════════════════════════════════════════════════════

export interface UseSignalPlaybackParams {
  scenarios: Scenario[]
  /** Pre-loaded didactics for the current scenario.
   *  Loaded asynchronously by the view and passed in (code-split friendly). */
  didactics?: StepDidactic[]
}

export interface UseSignalPlaybackReturn {
  // Core state
  scenarioId: string
  idx: number
  playing: boolean
  speed: number
  // NOTE: pct is no longer here — use useAnimationPct() in components
  //       that need frame-by-frame updates (e.g. SignalCanvas).
  visited: Set<string>     // organs that have been active so far

  // Derived state
  scenario: Scenario
  steps: ProcessStep[]
  step: ProcessStep | null
  didactics: StepDidactic[]
  isInertie: boolean       // READY or IDLE phase
  isListening: boolean     // LISTEN phase
  done: boolean            // finished + not listening
  phaseCol: string         // phase-driven color

  // Actions
  play: () => void
  pause: () => void
  reset: () => void
  switchScenario: (id: string) => void
  cycleSpeed: () => void
  handleStepClick: (i: number) => void
  stepForward: () => void
  stepBackward: () => void
}

export function useSignalPlayback({ scenarios, didactics: externalDidactics }: UseSignalPlaybackParams): UseSignalPlaybackReturn {
  const [scenarioId, setScenarioId] = useState(() => {
    // Read initial scenario from URL ?scenario= param.
    // With hash routing (#/signal?scenario=boot), the query is inside the hash fragment,
    // so window.location.search is empty — parse from hash instead.
    const hash = window.location.hash  // e.g. "#/signal?scenario=boot"
    const queryStart = hash.indexOf('?')
    const urlScenario = queryStart >= 0
      ? new URLSearchParams(hash.slice(queryStart)).get('scenario')
      : null
    if (urlScenario && scenarios.some(s => s.id === urlScenario)) return urlScenario
    return scenarios[0]?.id ?? ''
  })
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  // Visited organs: intentionally useState (not useMemo) because this tracks which organs
  // were ACTIVELY STEPPED THROUGH during playback — not all organs up to the current index.
  // When a user clicks step 5 directly, organs from steps 0–4 must remain unvisited (ghost UX).
  // This is event-driven state, not derivable state.
  const [visited, setVisited] = useState<Set<string>>(new Set())

  // ── Derived (React Compiler auto-memoizes) ──
  const scenario = scenarios.find(s => s.id === scenarioId) ?? scenarios[0]
  const steps = scenario.steps
  const step = steps[idx] ?? null
  // ── Didactics (injected from view, loaded async for code splitting) ──
  // Didactics are sidebar-only data — the canvas works without them.
  // The view loads them via dynamic import('scenarioDidactics') and passes them here.
  const didactics = externalDidactics ?? STABLE_EMPTY_DIDACTICS

  const isInertie = step?.phase === 'READY' || step?.phase === 'IDLE'
  const isListening = step?.phase === LISTEN_PHASE
  const done = idx >= steps.length - 1 && !playing && !isListening

  // Phase-driven color (with route-based fallback for unknown phases)
  const phaseCol = phaseColorWithFallback(step?.phase, scenario.route)

  // ── Auto-advance timer ──
  // When playing, starts the animation loop for each step.
  // On animation complete (pct reaches 1), applies didactic pause then advances.
  useEffect(() => {
    if (!playing || !step) {
      animationLoop.stop()
      return
    }

    const dur = step.duration / speed
    const didactic = didactics[idx]
    const hasNewConcept = didactic?.revealedConcepts && didactic.revealedConcepts.length > 0
    const pauseExtra = hasNewConcept ? 800 / speed : 0
    const atEnd = idx >= steps.length - 1

    animationLoop.start(dur, () => {
      // Animation pct reached 1.0 — apply didactic pause then advance.
      const advance = () => {
        if (atEnd) { setPlaying(false); return }
        setIdx(i => i + 1)
      }
      if (pauseExtra > 0) {
        setTimeout(advance, pauseExtra)
      } else {
        advance()
      }
    })

    return () => animationLoop.stop()
  }, [playing, idx, step, speed, steps.length, didactics])

  // ── Track visited organs (only during playback, not on skip) ──
  useEffect(() => {
    if (step) setVisited(p => { if (p.has(step.organ)) return p; const n = new Set(p); n.add(step.organ); return n })
  }, [step])

  // ── Action callbacks (React Compiler auto-memoizes) ──
  const play = () => {
    if (idx >= steps.length - 1) { setIdx(0); setVisited(new Set()) }
    setPlaying(true)
  }

  const pause = () => { setPlaying(false) }

  const reset = () => {
    setIdx(0); setPlaying(false); setVisited(new Set())
    animationLoop.stop()
  }

  const switchScenario = (id: string) => {
    setScenarioId(id); setIdx(0); setPlaying(false); setVisited(new Set())
    animationLoop.stop()
  }

  const cycleSpeed = () => setSpeed(s => s === 1 ? 0.5 : s === 0.5 ? 2 : s === 2 ? 4 : 1)

  const handleStepClick = (i: number) => { setIdx(i); setPlaying(false) }

  const stepForward = () => {
    setIdx(i => Math.min(i + 1, steps.length - 1))
  }

  const stepBackward = () => {
    setIdx(i => Math.max(i - 1, 0))
  }

  return {
    scenarioId, idx, playing, speed, visited,
    scenario, steps, step, didactics, isInertie, isListening, done, phaseCol,
    play, pause, reset, switchScenario, cycleSpeed, handleStepClick, stepForward, stepBackward,
  }
}
