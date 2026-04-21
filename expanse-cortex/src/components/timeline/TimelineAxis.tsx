// ─── Timeline Axis ───
// Renders the temporal X-axis with date tick marks and faint vertical grid lines.

interface TimelineAxisProps {
  /** Leftmost timestamp (unix ms) */
  minTime: number
  /** Rightmost timestamp (unix ms) */
  maxTime: number
  /** Pixel width of the timeline content area */
  width: number
  /** Y offset to start drawing the axis */
  y: number
}

const TICK_HEIGHT = 8
const LABEL_SIZE = 10

function formatTick(ts: number): string {
  const d = new Date(ts)
  const month = d.toLocaleString('fr', { month: 'short' })
  const day = d.getDate()
  return `${day} ${month}`
}

function computeTicks(min: number, max: number, maxTicks: number): number[] {
  const range = max - min
  if (range <= 0) return [min]
  // Choose interval: 1 day, 3 days, 1 week, 2 weeks, 1 month
  const DAY = 86400000
  const intervals = [DAY, 3 * DAY, 7 * DAY, 14 * DAY, 30 * DAY, 90 * DAY]
  let interval = intervals[intervals.length - 1]
  for (const iv of intervals) {
    if (range / iv <= maxTicks) {
      interval = iv
      break
    }
  }
  const ticks: number[] = []
  // Snap to midnight
  const start = Math.floor(min / DAY) * DAY
  for (let t = start; t <= max; t += interval) {
    if (t >= min) ticks.push(t)
  }
  return ticks
}

export function TimelineAxis({ minTime, maxTime, width, y }: TimelineAxisProps) {
  const ticks = computeTicks(minTime, maxTime, Math.floor(width / 100))
  const range = maxTime - minTime || 1

  const toX = (ts: number) => ((ts - minTime) / range) * width

  return (
    <g className="timeline-axis">
      {/* Main axis line */}
      <line
        x1={0} y1={y} x2={width} y2={y}
        stroke="var(--color-surface1)" strokeWidth={1}
      />

      {/* Grid lines + ticks */}
      {ticks.map(ts => {
        const x = toX(ts)
        return (
          <g key={ts}>
            {/* Faint vertical grid line */}
            <line
              x1={x} y1={0} x2={x} y2={y}
              stroke="var(--color-surface0)" strokeWidth={0.5} strokeDasharray="4 4"
            />
            {/* Tick mark */}
            <line
              x1={x} y1={y} x2={x} y2={y + TICK_HEIGHT}
              stroke="var(--color-overlay0)" strokeWidth={1}
            />
            {/* Date label */}
            <text
              x={x} y={y + TICK_HEIGHT + LABEL_SIZE + 2}
              fill="var(--color-overlay0)"
              fontSize={LABEL_SIZE}
              textAnchor="middle"
              fontFamily="monospace"
            >
              {formatTick(ts)}
            </text>
          </g>
        )
      })}
    </g>
  )
}
