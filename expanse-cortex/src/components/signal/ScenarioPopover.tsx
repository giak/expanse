import { useState, useRef, useEffect, useCallback } from 'react'
import type { Scenario } from '../../types/signal'

// ══════════════════════════════════════════════════════════════
// SCENARIO POPOVER — VS Code status bar style
// Compact trigger → upward menu grouped by cognitive route
// ══════════════════════════════════════════════════════════════

/** Route display order and labels */
const ROUTE_ORDER = ['BOOT', 'L1', 'L2', 'L3', 'DREAM', 'NEG'] as const
const ROUTE_LABELS: Record<string, string> = {
  BOOT: 'INCARNATION',
  L1: 'L1 — FULGURANCE',
  L2: 'L2 — AUDIT',
  L3: 'L3 — TRIANGULATION',
  DREAM: 'RÊVE — AUTO-ÉVOLUTION',
  NEG: 'SÉCURITÉ',
}

interface ScenarioPopoverProps {
  scenarios: Scenario[]
  scenarioId: string
  scenario: Scenario
  switchScenario: (id: string) => void
}

export function ScenarioPopover({ scenarios, scenarioId, scenario, switchScenario }: ScenarioPopoverProps) {
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  const handleSelect = useCallback((id: string) => {
    switchScenario(id)
    setOpen(false)
  }, [switchScenario])

  // Group scenarios by route
  const groups: [string, Scenario[]][] = []
  for (const route of ROUTE_ORDER) {
    const items = scenarios.filter(s => s.route === route)
    if (items.length > 0) groups.push([route, items])
  }
  // Catch any scenarios with unrecognised routes
  const accounted = new Set(groups.flatMap(([, items]) => items.map(s => s.id)))
  const remainder = scenarios.filter(s => !accounted.has(s.id))
  if (remainder.length > 0) groups.push(['OTHER', remainder])

  return (
    <div ref={popoverRef} className="relative">
      {/* Trigger button — shows current scenario compact */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-all duration-150 scenario-trigger"
        style={{
          color: scenario.color,
          background: `${scenario.color}14`,
          border: `1px solid ${scenario.color}30`,
        }}
      >
        {/* Small color dot */}
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: scenario.color }}
        />
        {/* Route badge */}
        <span className="text-overlay0 text-[9px]">{scenario.route}</span>
        <span className="mx-0.5 text-surface1">::</span>
        {/* Scenario label */}
        <span>{scenario.selectorLabel ?? scenario.title}</span>
        {/* Chevron */}
        <svg
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''} opacity-50`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Popover — upward, positioned above the trigger */}
      {open && (
        <div className="scenario-popover">
          <div className="scenario-popover-inner">
            {groups.map(([route, items], gi) => (
              <div key={route}>
                {/* Route header */}
                <div className="px-2 pt-2 pb-0.5 text-[9px] font-mono font-bold tracking-wider text-surface1 uppercase">
                  {ROUTE_LABELS[route] ?? route}
                </div>
                {/* Scenario items */}
                {items.map(s => {
                  const isActive = s.id === scenarioId
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSelect(s.id)}
                      className={`scenario-popover-item ${isActive ? 'active' : ''}`}
                      style={isActive ? {
                        color: s.color,
                        background: `${s.color}10`,
                        borderLeftColor: s.color,
                      } : undefined}
                    >
                      {/* Color dot */}
                      <span
                        className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: s.color, opacity: isActive ? 1 : 0.4 }}
                      />
                      {/* Label */}
                      <span className="flex-1 text-left truncate">
                        {s.selectorLabel ?? s.title}
                      </span>
                      {/* Step count */}
                      <span className="text-[9px] text-surface1 tabular-nums flex-shrink-0">
                        {s.steps.length}stp
                      </span>
                      {/* Active indicator */}
                      {isActive && (
                        <span className="text-[10px]" style={{ color: s.color }}>●</span>
                      )}
                    </button>
                  )
                })}
                {/* Separator between groups */}
                {gi < groups.length - 1 && (
                  <div className="my-1 border-t border-white/5" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
