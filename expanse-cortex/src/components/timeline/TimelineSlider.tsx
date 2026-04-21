// ─── Timeline Slider ───
// A dual-thumb range selector for zooming into a time range on the timeline.
// Renders as an SVG brush slider at the bottom of the view.

import { useState, useRef, useCallback } from 'react'

interface TimelineSliderProps {
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
  /** Pixel width */
  width: number
  /** Y position */
  y: number
  /** Height of the slider track */
  height: number
}

const THUMB_WIDTH = 8
const MIN_RANGE_FRACTION = 0.05 // minimum zoom: 5% of total range

export function TimelineSlider({
  fullMin,
  fullMax,
  viewMin,
  viewMax,
  onRangeChange,
  width,
  y,
  height,
}: TimelineSliderProps) {
  const fullRange = fullMax - fullMin || 1
  const [dragging, setDragging] = useState<'left' | 'right' | 'middle' | null>(null)
  const dragStartRef = useRef({ x: 0, viewMin: 0, viewMax: 0 })

  const toFraction = (ts: number) => (ts - fullMin) / fullRange

  const leftFrac = toFraction(viewMin)
  const rightFrac = toFraction(viewMax)

  const leftX = leftFrac * width
  const rightX = rightFrac * width
  const brushWidth = rightX - leftX

  const handleMouseDown = useCallback((thumb: 'left' | 'right' | 'middle', e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setDragging(thumb)
    dragStartRef.current = { x: e.clientX, viewMin, viewMax }

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - dragStartRef.current.x
      const dFrac = dx / width
      const minRange = MIN_RANGE_FRACTION * fullRange

      if (thumb === 'left') {
        const newMin = Math.max(fullMin, dragStartRef.current.viewMin + dFrac * fullRange)
        onRangeChange(Math.min(newMin, viewMax - minRange), viewMax)
      } else if (thumb === 'right') {
        const newMax = Math.min(fullMax, dragStartRef.current.viewMax + dFrac * fullRange)
        onRangeChange(viewMin, Math.max(viewMin + minRange, newMax))
      } else {
        // Pan the brush
        const range = dragStartRef.current.viewMax - dragStartRef.current.viewMin
        let newMin = dragStartRef.current.viewMin + dFrac * fullRange
        let newMax = newMin + range
        if (newMin < fullMin) { newMin = fullMin; newMax = fullMin + range }
        if (newMax > fullMax) { newMax = fullMax; newMin = fullMax - range }
        onRangeChange(newMin, newMax)
      }
    }

    const onUp = () => {
      setDragging(null)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [width, fullMin, fullMax, fullRange, viewMin, viewMax, onRangeChange])

  return (
    <g className="timeline-slider" transform={`translate(0, ${y})`}>
      {/* Full track background */}
      <rect
        x={0} y={0} width={width} height={height}
        fill="var(--color-mantle)" rx={3}
      />

      {/* Mini overview dots — show node density */}
      <rect
        x={0} y={0} width={width} height={height}
        fill="var(--color-base)" rx={3}
        opacity={0.8}
      />

      {/* Brush (selected range) */}
      <rect
        x={leftX} y={0} width={Math.max(brushWidth, THUMB_WIDTH)} height={height}
        fill="var(--color-blue)" opacity={0.2} rx={2}
      />

      {/* Left thumb */}
      <rect
        x={leftX - THUMB_WIDTH / 2} y={-1}
        width={THUMB_WIDTH} height={height + 2}
        fill="var(--color-blue)" rx={2}
        opacity={dragging === 'left' ? 1 : 0.7}
        className="cursor-ew-resize"
        onMouseDown={e => handleMouseDown('left', e)}
      />

      {/* Right thumb */}
      <rect
        x={rightX - THUMB_WIDTH / 2} y={-1}
        width={THUMB_WIDTH} height={height + 2}
        fill="var(--color-blue)" rx={2}
        opacity={dragging === 'right' ? 1 : 0.7}
        className="cursor-ew-resize"
        onMouseDown={e => handleMouseDown('right', e)}
      />

      {/* Middle drag handle */}
      {brushWidth > THUMB_WIDTH * 3 && (
        <rect
          x={leftX + THUMB_WIDTH / 2} y={height / 2 - 1}
          width={brushWidth - THUMB_WIDTH} height={3}
          fill="var(--color-blue)" rx={1} opacity={0.3}
          className="cursor-grab"
          onMouseDown={e => handleMouseDown('middle', e)}
        />
      )}

      {/* Range labels */}
      <text
        x={leftX} y={height + 12}
        fill="var(--color-overlay0)" fontSize={8} textAnchor="middle" fontFamily="monospace"
      >
        {new Date(viewMin).toLocaleDateString('fr', { day: 'numeric', month: 'short' })}
      </text>
      <text
        x={rightX} y={height + 12}
        fill="var(--color-overlay0)" fontSize={8} textAnchor="middle" fontFamily="monospace"
      >
        {new Date(viewMax).toLocaleDateString('fr', { day: 'numeric', month: 'short' })}
      </text>
    </g>
  )
}
