import { useSyncExternalStore } from 'react'

// ══════════════════════════════════════════════════════════════
// ANIMATION LOOP — external rAF store for particle interpolation
// ══════════════════════════════════════════════════════════════
// Replaces useState(pct) + rAF in useSignalPlayback.
// Only components that call useAnimationPct() re-render on each frame.
// SignalView and its non-canvas children stay stable during animation.
//
// Architecture:
//   rAF → animationPct updates → notify subscribers → useSyncExternalStore
//   Only SignalCanvas subscribes → only it re-renders 60fps.
//   Step advance happens via onComplete callback (replaces setTimeout).

// ── Module-level animation store ──

const subscribers = new Set<() => void>()
let rafId: number | null = null
let loopStart = 0
let loopDuration = 0
let loopPct = 0
let loopOnComplete: (() => void) | null = null

function notifyAll() {
  subscribers.forEach(fn => fn())
}

function tick() {
  const elapsed = performance.now() - loopStart
  loopPct = Math.min(elapsed / loopDuration, 1)
  notifyAll()
  if (loopPct < 1) {
    rafId = requestAnimationFrame(tick)
  } else {
    // Animation complete — stop loop, notify callback
    rafId = null
    loopOnComplete?.()
  }
}

function startLoop(duration: number, onComplete: () => void) {
  stopLoop()
  loopDuration = duration
  loopStart = performance.now()
  loopPct = 0
  loopOnComplete = onComplete
  // First rAF tick will notify subscribers — no need to notifyAll() here.
  // This avoids a double notification during step transitions (cleanup→start).
  rafId = requestAnimationFrame(tick)
}

function stopLoop() {
  if (rafId !== null) cancelAnimationFrame(rafId)
  rafId = null
  loopPct = 0
  loopOnComplete = null
  notifyAll()
}

function subscribe(listener: () => void): () => void {
  subscribers.add(listener)
  return () => subscribers.delete(listener)
}

function getSnapshot(): number {
  return loopPct
}

// ── Public API ──

/**
 * Hook for components that need frame-by-frame pct updates.
 * Uses useSyncExternalStore to subscribe to the rAF-driven animation store.
 * Only components calling this hook re-render on each animation frame.
 */
export function useAnimationPct(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/**
 * Imperative API for useSignalPlayback to control the animation loop.
 * Does NOT cause re-renders in the caller — only subscribers via useAnimationPct re-render.
 */
export const animationLoop = {
  start: startLoop,
  stop: stopLoop,
  /** Read current pct without subscribing (for non-React code) */
  get pct() { return loopPct },
}
