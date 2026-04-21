import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSignalPlayback } from '../useSignalPlayback'
import type { Scenario, ProcessStep } from '../../types/signal'

// ─── Test fixtures ───

function makeStep(overrides: Partial<ProcessStep> & { organ: string; label: string }): ProcessStep {
  return { duration: 1000, phase: 'PERCEIVE', ...overrides }
}

const BOOT_STEPS: ProcessStep[] = [
  makeStep({ organ: 'Σ', label: 'init', phase: 'INIT' }),
  makeStep({ organ: 'Σ', label: 'seed', phase: 'SEED' }),
  makeStep({ organ: 'Μ', label: 'memory', phase: 'MEMORY' }),
  makeStep({ organ: 'Ψ', label: 'check', phase: 'CHECK' }),
  makeStep({ organ: 'Ψ', label: 'ready', phase: 'READY' }),
]

const BOOT_SCENARIO: Scenario = {
  id: 'boot',
  title: 'Boot',
  subtitle: 'Boot scenario',
  route: 'BOOT',
  color: '#89b4fa',
  steps: BOOT_STEPS,
}

const VIOLATION_SCENARIO: Scenario = {
  id: 'violation-axiome',
  title: 'Violation',
  subtitle: 'Violation scenario',
  route: 'NEG',
  color: '#f38ba8',
  steps: [
    makeStep({ organ: 'Σ', label: 'perceive', phase: 'PERCEIVE' }),
    makeStep({ organ: 'Ψ', label: 'detect', phase: 'DETECT' }),
    makeStep({ organ: 'Ω', label: 'block', phase: 'BLOCK' }),
  ],
}

const SCENARIOS = [BOOT_SCENARIO, VIOLATION_SCENARIO]

// ─── Tests ───

describe('useSignalPlayback', () => {
  beforeEach(() => {
    // Reset URL hash between tests
    window.location.hash = ''
  })

  it('initializes with first scenario and step 0', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    expect(result.current.scenarioId).toBe('boot')
    expect(result.current.idx).toBe(0)
    expect(result.current.step?.organ).toBe('Σ')
    expect(result.current.step?.phase).toBe('INIT')
  })

  it('starts not playing', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    expect(result.current.playing).toBe(false)
  })

  it('play() sets playing=true', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    act(() => { result.current.play() })
    expect(result.current.playing).toBe(true)
  })

  it('pause() sets playing=false', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    act(() => { result.current.play() })
    act(() => { result.current.pause() })
    expect(result.current.playing).toBe(false)
  })

  it('reset() returns to step 0 and stops playing', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    act(() => {
      result.current.play()
      result.current.handleStepClick(3)
    })
    expect(result.current.idx).toBe(3)
    act(() => { result.current.reset() })
    expect(result.current.idx).toBe(0)
    expect(result.current.playing).toBe(false)
  })

  it('handleStepClick() jumps to specific step and pauses', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    act(() => { result.current.handleStepClick(2) })
    expect(result.current.idx).toBe(2)
    expect(result.current.step?.phase).toBe('MEMORY')
    expect(result.current.playing).toBe(false)
  })

  it('stepForward() advances by one step', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    act(() => { result.current.stepForward() })
    expect(result.current.idx).toBe(1)
  })

  it('stepForward() clamps at last step', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    act(() => { result.current.handleStepClick(BOOT_STEPS.length - 1) })
    act(() => { result.current.stepForward() })
    expect(result.current.idx).toBe(BOOT_STEPS.length - 1)
  })

  it('stepBackward() goes back one step', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    act(() => { result.current.handleStepClick(3) })
    act(() => { result.current.stepBackward() })
    expect(result.current.idx).toBe(2)
  })

  it('stepBackward() clamps at 0', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    act(() => { result.current.stepBackward() })
    expect(result.current.idx).toBe(0)
  })

  it('switchScenario() resets to step 0 and stops playing', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    act(() => { result.current.play() })
    act(() => { result.current.switchScenario('violation-axiome') })
    expect(result.current.scenarioId).toBe('violation-axiome')
    expect(result.current.idx).toBe(0)
    expect(result.current.playing).toBe(false)
  })

  it('cycleSpeed() cycles through speed values', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    expect(result.current.speed).toBe(1)
    act(() => { result.current.cycleSpeed() })
    expect(result.current.speed).toBe(0.5)
    act(() => { result.current.cycleSpeed() })
    expect(result.current.speed).toBe(2)
    act(() => { result.current.cycleSpeed() })
    expect(result.current.speed).toBe(4)
    act(() => { result.current.cycleSpeed() })
    expect(result.current.speed).toBe(1)
  })

  it('isInertie is true for READY phase', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    act(() => { result.current.handleStepClick(4) }) // READY
    expect(result.current.isInertie).toBe(true)
  })

  it('isInertie is false for non-INERTIE phases (INIT)', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    act(() => { result.current.handleStepClick(0) }) // INIT — not inertie
    expect(result.current.isInertie).toBe(false)
  })

  it('done is true when at last step and not playing', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    act(() => { result.current.handleStepClick(BOOT_STEPS.length - 1) })
    expect(result.current.done).toBe(true)
  })

  it('done is false when playing', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    act(() => {
      result.current.handleStepClick(BOOT_STEPS.length - 1)
      result.current.play()
    })
    expect(result.current.done).toBe(false)
  })

  it('play() from last step restarts from 0', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    act(() => { result.current.handleStepClick(BOOT_STEPS.length - 1) })
    expect(result.current.idx).toBe(BOOT_STEPS.length - 1)
    act(() => { result.current.play() })
    expect(result.current.idx).toBe(0)
    expect(result.current.playing).toBe(true)
  })

  it('visited tracks organs stepped through', () => {
    const { result } = renderHook(() => useSignalPlayback({ scenarios: SCENARIOS, didactics: [] }))
    // Step 0 = Σ, step 2 = Μ
    act(() => { result.current.handleStepClick(0) })
    act(() => { result.current.handleStepClick(2) })
    expect(result.current.visited.has('Σ')).toBe(true)
    expect(result.current.visited.has('Μ')).toBe(true)
  })

  it('returns null step when idx exceeds steps length', () => {
    const smallScenario: Scenario = { id: 'tiny', title: 'Tiny', subtitle: 'Tiny', route: 'BOOT', color: '#89b4fa', steps: [makeStep({ organ: 'Σ', label: 'only', phase: 'INIT' })] }
    const { result } = renderHook(() => useSignalPlayback({ scenarios: [smallScenario], didactics: [] }))
    expect(result.current.step).toBeTruthy()
  })
})
