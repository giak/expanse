// ─── Timeline Replay Controls ───
// Phase 3: Play/pause/speed controls for temporal replay.
// Auto-advances the visible time window across the timeline.

import { useState, useRef, useEffect, useCallback } from 'react'

interface TimelineReplayControlsProps {
  /** Full range start (unix ms) */
  fullMin: number
  /** Full range end (unix ms) */
  fullMax: number
  /** Current visible range start (unix ms) */
  viewMin: number
  /** Current visible range end (unix ms) */
  viewMax: number
  /** Callback when the visible range changes */
  onRangeChange: (min: number, max: number) => void
  /** X position of the controls */
  x: number
  /** Y position */
  y: number
}

const SPEED_OPTIONS = [
  { label: '0.5×', factor: 0.5 },
  { label: '1×', factor: 1 },
  { label: '2×', factor: 2 },
  { label: '4×', factor: 4 },
] as const

const BASE_SPEED = 86400000 // 1 day per second at 1× speed

export function TimelineReplayControls({
  fullMin,
  fullMax,
  viewMin,
  viewMax,
  onRangeChange,
  x,
  y,
}: TimelineReplayControlsProps) {
  const [playing, setPlaying] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(1) // default 1×
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const rangeRef = useRef({ viewMin, viewMax, fullMin, fullMax })
  rangeRef.current = { viewMin, viewMax, fullMin, fullMax }

  const speed = SPEED_OPTIONS[speedIdx].factor
  const windowSize = viewMax - viewMin
  const fullRange = fullMax - fullMin

  // Must stay as useCallback — flows into useEffect deps for rAF loop
  const advance = useCallback((dtMs: number) => {
    const { viewMin, viewMax, fullMin, fullMax } = rangeRef.current
    const dtSec = dtMs / 1000
    const advanceMs = dtSec * BASE_SPEED * speed
    const windowSz = viewMax - viewMin
    let newMin = viewMin + advanceMs
    let newMax = viewMax + advanceMs

    // Loop: when we reach the end, wrap to the beginning
    if (newMax > fullMax) {
      newMin = fullMin
      newMax = fullMin + windowSz
    }

    onRangeChange(newMin, newMax)
  }, [speed, onRangeChange])

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    lastTimeRef.current = performance.now()

    const loop = (now: number) => {
      const dt = now - lastTimeRef.current
      lastTimeRef.current = now
      if (dt > 0 && dt < 200) { // cap at 200ms to avoid jumps on tab switch
        advance(dt)
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [playing, advance])

  const togglePlay = () => setPlaying(p => !p)

  const cycleSpeed = () => setSpeedIdx(i => (i + 1) % SPEED_OPTIONS.length)

  const resetToStart = () => {
    setPlaying(false)
    onRangeChange(fullMin, fullMin + windowSize)
  }

  // Progress through the timeline (0–1)
  const progress = fullRange > 0 ? (viewMin - fullMin) / fullRange : 0

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Background panel */}
      <rect
        x={-4} y={-12} width={180} height={26}
        rx={6}
        fill="rgba(12,12,18,0.85)"
        stroke="rgba(137,180,250,0.2)"
        strokeWidth={0.8}
      />

      {/* Play/Pause button */}
      <g onClick={togglePlay} className="cursor-pointer">
        <rect x={2} y={-8} width={20} height={18} rx={3} fill="transparent" />
        <text
          x={12} y={4}
          textAnchor="middle"
          dominantBaseline="central"
          fill={playing ? 'var(--color-red)' : 'var(--color-green)'}
          fontSize={12}
          fontFamily="'JetBrains Mono', monospace"
        >
          {playing ? '⏸' : '▶'}
        </text>
      </g>

      {/* Speed button */}
      <g onClick={cycleSpeed} className="cursor-pointer">
        <rect x={24} y={-8} width={32} height={18} rx={3} fill="transparent" />
        <text
          x={40} y={4}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--color-blue)"
          fontSize={8}
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="bold"
        >
          {SPEED_OPTIONS[speedIdx].label}
        </text>
      </g>

      {/* Reset button */}
      <g onClick={resetToStart} className="cursor-pointer">
        <rect x={58} y={-8} width={18} height={18} rx={3} fill="transparent" />
        <text
          x={67} y={4}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--color-overlay0)"
          fontSize={10}
          fontFamily="'JetBrains Mono', monospace"
        >
          ⏮
        </text>
      </g>

      {/* Progress bar */}
      <rect x={80} y={-2} width={90} height={4} rx={2} fill="var(--color-base)" />
      <rect x={80} y={-2} width={Math.max(2, 90 * progress)} height={4} rx={2} fill="var(--color-blue)" opacity={0.7} />

      {/* Date indicator */}
      <text
        x={125} y={-6}
        textAnchor="middle"
        fill="var(--color-overlay0)"
        fontSize={6}
        fontFamily="'JetBrains Mono', monospace"
      >
        {new Date(viewMin).toLocaleDateString('fr', { day: 'numeric', month: 'short' })}
      </text>
    </g>
  )
}
