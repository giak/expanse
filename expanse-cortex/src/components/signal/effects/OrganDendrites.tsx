// ══════════════════════════════════════════════════════════════
// ORGAN DENDRITES — contextual satellite panels around each organ
// Inspired by neural dendrites: branches extend outward from the organ,
// each ending in a terminal node that displays contextual information.
// Content is derived via deriveDendriteNodes() from the shared
// derivation layer (utils/scenarioContext.ts — Story 6.1).
// ══════════════════════════════════════════════════════════════

import { useMemo } from 'react'
import { ORGAN_COLORS } from '../../../constants/theme'
import { deriveDendriteNodes } from '../../../utils/scenarioContext'
import { DendriteTrunk } from './DendriteTrunk'
import type { ProcessStep, Organ } from '../../../types/signal'
import type { DendriteNode } from '../../../types/aura'
import { ORGAN_ORDER } from '../../../constants/theme'

// ─── Terminal positioning: outward from each organ ───

/** Directions each organ extends its dendrites (angle offset from center) */
const DENDRITE_DIRS: Record<Organ, { angle: number; spread: number }> = {
  'Σ': { angle: -Math.PI / 2, spread: 0.4 },         // Upward fan
  'Ψ': { angle: -Math.PI / 10, spread: 0.35 },        // Upper-right fan
  'Φ': { angle: Math.PI * 3 / 10, spread: 0.35 },     // Lower-right fan
  'Ω': { angle: Math.PI * 7 / 10, spread: 0.35 },     // Lower-left fan
  'Μ': { angle: Math.PI * 11 / 10, spread: 0.35 },    // Upper-left fan
}

// ─── Main component ───

interface OrganDendritesProps {
  step: ProcessStep | null
  progress: number
  organPositions: Map<string, { x: number; y: number }>
  /** When true, only Ψ and Μ show dendrites (Dream mode) */
  isDreamMode?: boolean
}

// ─── Memoized trunk descriptor (static data per trunk) ───
// Computed from step-derived data — stable across animation frames.
// Only `progress` changes per frame and is passed at render time.

interface DendriteTrunkDescriptor {
  key: string
  from: { x: number; y: number }
  angle: number
  color: string
  node: DendriteNode
  delay: number
}

// ══════════════════════════════════════════════════════════════
// ORGAN DENDRITES — orchestrator with static/dynamic split
// ══════════════════════════════════════════════════════════════
//
// Architecture: All step-derived data (organ selection, dendrite
// derivation, angle computation) is memoized in a single useMemo
// keyed on [step, isDreamMode]. This is the "static" part.
//
// `progress` (volatile, 60fps) is NOT included in the useMemo — it
// flows directly to each DendriteTrunk at render time. This matches
// the StaticEffectContext/pct split pattern used in SignalCanvas.
//
// The previous OrganDendriteBranch sub-component has been absorbed
// into the parent useMemo — its per-organ useMemo was the only
// reason for its existence, and hoisting eliminates an unnecessary
// component layer (5 OrganDendriteBranch instances per frame).
// ══════════════════════════════════════════════════════════════

export function OrganDendrites({
  step, progress, organPositions, isDreamMode = false,
}: OrganDendritesProps) {
  // ── Memoize ALL step-derived data (static — changes only when step changes) ──
  // This absorbs the former OrganDendriteBranch's per-organ useMemo,
  // computing all trunk descriptors in one pass. deriveDendriteNodes
  // (regex, string ops, object creation) only runs when step changes.
  const trunks: DendriteTrunkDescriptor[] = useMemo(() => {
    if (!step) return []

    // Determine which organs show dendrites
    const dreamOrgans: Organ[] = [...new Set<Organ>(['Ψ', 'Μ', ...(step.organ ? [step.organ] : [])])]
    const organs: Organ[] = isDreamMode ? dreamOrgans : [...ORGAN_ORDER]

    const descriptors: DendriteTrunkDescriptor[] = []

    for (const organ of organs) {
      const pos = organPositions.get(organ)
      if (!pos) continue

      const isActive = step.organ === organ

      // Skip non-active organs in non-Dream mode
      if (!isDreamMode && !isActive) continue

      // Active organ gets full step data; non-active Dream organs
      // also get step data (showing shared Dream context).
      const stepForOrgan = isDreamMode ? step : (isActive ? step : null)

      const nodes = stepForOrgan ? deriveDendriteNodes(organ, stepForOrgan) : []
      if (nodes.length === 0) continue

      const dir = DENDRITE_DIRS[organ]
      const color = ORGAN_COLORS[organ]

      for (let i = 0; i < nodes.length; i++) {
        const angleOffset = (i - (nodes.length - 1) / 2) * dir.spread
        const angle = dir.angle + angleOffset
        descriptors.push({
          key: `dendrite-${organ}-${i}`,
          from: pos,
          angle,
          color,
          node: nodes[i],
          delay: i * 0.15,
        })
      }
    }

    return descriptors
  }, [step, isDreamMode, organPositions])

  return (
    <g className="pointer-events-none">
      {trunks.map(desc => (
        <DendriteTrunk
          key={desc.key}
          from={desc.from}
          angle={desc.angle}
          progress={progress}
          color={desc.color}
          node={desc.node}
          delay={desc.delay}
        />
      ))}
    </g>
  )
}
