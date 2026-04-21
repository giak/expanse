import { createContext, useContext, useMemo, useRef, type ReactNode } from 'react'
import { accumulateScenarioContext, buildScenarioContextUpTo, deriveAuraState } from '../utils/scenarioContext'
import type { ProcessStep } from '../types/signal'
import type { AuraState, ScenarioContext } from '../types/aura'
import { INITIAL_AURA_STATE } from '../types/aura'

// ══════════════════════════════════════════════════════════════
// SIGNAL CONTEXT — exposes ScenarioContext + AuraState to the
// signal view subtree so any component (SignalCanvas, AuraField,
// DidacticPanel, etc.) can consume AURA data without prop drilling.
// ══════════════════════════════════════════════════════════════

interface SignalContextValue {
  /** Accumulated scenario context (cortex count, budget, fissure, etc.) */
  scenarioCtx: ScenarioContext
  /** Derived AURA visual state (ring radii/opacities, pulse, fissure) */
  auraState: AuraState
}

const SignalContext = createContext<SignalContextValue | null>(null)

export function SignalProvider({
  steps,
  stepIdx,
  step,
  children,
}: {
  steps: ProcessStep[]
  stepIdx: number
  step: ProcessStep | null
  children: ReactNode
}) {
  // ── Incremental cache: avoid O(n) recomputation on every stepIdx change ──
  // When stepIdx advances by 1, reuse the cached context for stepIdx-1
  // and accumulate only the new step. Invalidate when steps array changes.
  const cacheRef = useRef<Map<number, ScenarioContext>>(new Map())
  const prevStepsRef = useRef(steps)

  const scenarioCtx = useMemo(() => {
    // Invalidate entire cache when steps array identity changes (new scenario loaded)
    if (prevStepsRef.current !== steps) {
      cacheRef.current.clear()
      prevStepsRef.current = steps
    }

    // Check cache for exact hit
    const cached = cacheRef.current.get(stepIdx)
    if (cached) return cached

    // Try incremental: accumulate from stepIdx-1 if available
    const prev = cacheRef.current.get(stepIdx - 1)
    if (prev && stepIdx > 0 && stepIdx <= steps.length) {
      const result = accumulateScenarioContext(prev, steps[stepIdx])
      cacheRef.current.set(stepIdx, result)
      return result
    }

    // Fallback: full recomputation (first load or jump)
    const result = buildScenarioContextUpTo(steps, stepIdx)
    cacheRef.current.set(stepIdx, result)
    return result
  }, [steps, stepIdx])

  const auraState = useMemo(
    () => step ? deriveAuraState(step, scenarioCtx) : INITIAL_AURA_STATE,
    [step, scenarioCtx],
  )

  return (
    <SignalContext.Provider value={{ scenarioCtx, auraState }}>
      {children}
    </SignalContext.Provider>
  )
}

export function useSignal() {
  const ctx = useContext(SignalContext)
  if (!ctx) throw new Error('useSignal must be used within SignalProvider')
  return ctx
}

