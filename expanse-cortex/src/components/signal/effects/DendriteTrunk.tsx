// ══════════════════════════════════════════════════════════════
// DENDRITE TRUNK — 2-level trunk+leaves neural branch renderer
// Source canonique : EPIC-CONTEXTE-AURA.md §Ⅵ + §6.2 + §6.3 + §6.4
//
// Renders:
//   Level 1 — Trunk: thick bezier from organ → category panel (60×22)
//   Level 2 — Leaves: thin beziers from trunk panel → detail panels (44×16)
//
// Animation phasing (EPIC §6.3):
//   0.0–0.3  Trunk bezier grows
//   0.2–0.5  Trunk panel fades in
//   0.3–0.6  Leaf beziers grow
//   0.5–0.8  Leaf panels fade in
//   0.6–1.0  Text fades in progressively
//
// Architecture (static/dynamic split):
//   All geometry (positions, control points, status colors) is computed
//   in a single useMemo keyed on [from, angle, node] — the "static" part.
//   progress (volatile, 60fps) is NOT in the useMemo deps — it only drives
//   animation phase calculations at render time. This matches the pattern
//   used in SignalCanvas (StaticEffectContext/pct) and OrganDendrites
//   (trunks useMemo / progress direct).
// ══════════════════════════════════════════════════════════════

import { useMemo } from 'react'
import type { DendriteNode, DendriteLeaf, DendriteStatus } from '../../../types/aura'

// ─── Layout constants (EPIC §6.2) ───

/** Distance from organ center to trunk panel center */
const TRUNK_LENGTH = 105
/** Trunk panel dimensions */
const TRUNK_PANEL_W = 60
const TRUNK_PANEL_H = 22
/** Distance from trunk panel to leaf panel center */
const LEAF_LENGTH = 55
/** Angular spread between leaves (radians) — EPIC §6.4 */
const LEAF_SPREAD = 0.18

// ─── Status colors ───

const STATUS_COLORS: Record<DendriteStatus, string> = {
  ok: 'var(--color-green)',
  warn: 'var(--color-yellow)',
  error: 'var(--color-red)',
  neutral: '',  // uses organ color
}

// ─── Component ───

interface DendriteTrunkProps {
  /** Organ center position */
  from: { x: number; y: number }
  /** Direction angle (radians) for this trunk */
  angle: number
  /** Animation progress 0→1 */
  progress: number
  /** Organ color for branches */
  color: string
  /** DendriteNode data: trunk + leaves */
  node: DendriteNode
  /** Stagger delay for multi-trunk appearance */
  delay?: number
}

// ─── Static trunk descriptor (all geometry, no animation phases) ───
// Computed from (from, angle, node) — stable across animation frames.

interface TrunkStatic {
  trunkEnd: { x: number; y: number }
  // Trunk bezier control points
  cp1: { x: number; y: number }
  cp2: { x: number; y: number }
  // Trunk status color (resolved from node)
  trunkStatusColor: string
  // Precomputed leaf descriptors
  leaves: LeafStatic[]
}

interface LeafStatic {
  leaf: DendriteLeaf
  to: { x: number; y: number }
  // Leaf bezier control point (quadratic — single CP)
  cp: { x: number; y: number }
  // Status color (resolved from leaf)
  statusColor: string
  // Stagger delay coefficient for this leaf
  staggerCoeff: number
  staggerPanelCoeff: number
}

// Static/dynamic split: useMemo for geometry, progress drives animation at render time
export function DendriteTrunk({
  from, angle, progress, color, node, delay = 0,
}: DendriteTrunkProps) {
  // ── Memoize ALL step-derived geometry (static — changes only when from/angle/node change) ──
  // Consolidates trunkEnd, leafAnchors, bezier control points, and status colors
  // into a single useMemo. All of this is deterministic from (from, angle, node)
  // and has no dependency on progress (volatile, 60fps).
  const s = useMemo<TrunkStatic>(() => {
    const trunkEnd = {
      x: from.x + Math.cos(angle) * TRUNK_LENGTH,
      y: from.y + Math.sin(angle) * TRUNK_LENGTH,
    }

    // Trunk bezier control points (organic curve)
    const dx = trunkEnd.x - from.x
    const dy = trunkEnd.y - from.y
    const perpX = -dy * 0.08
    const perpY = dx * 0.08
    const cp1 = { x: from.x + dx * 0.35 + perpX, y: from.y + dy * 0.35 + perpY }
    const cp2 = { x: from.x + dx * 0.65, y: from.y + dy * 0.65 }

    const trunkStatusColor = STATUS_COLORS[node.trunkStatus] || color

    // Precompute leaf geometry
    const leaves = node.leaves.map((lf, i) => {
      const offset = (i - (node.leaves.length - 1) / 2) * LEAF_SPREAD
      const leafAngle = angle + offset
      const to = {
        x: trunkEnd.x + Math.cos(leafAngle) * LEAF_LENGTH,
        y: trunkEnd.y + Math.sin(leafAngle) * LEAF_LENGTH,
      }

      // Leaf bezier control — subtle curve following the fan direction
      const ldx = to.x - trunkEnd.x
      const ldy = to.y - trunkEnd.y
      const lcp = {
        x: trunkEnd.x + ldx * 0.4 + (-ldy * 0.05),
        y: trunkEnd.y + ldy * 0.4 + (ldx * 0.05),
      }

      return {
        leaf: lf,
        to,
        cp: lcp,
        statusColor: STATUS_COLORS[lf.status] || color,
        staggerCoeff: i * 0.08,
        staggerPanelCoeff: i * 0.06,
      }
    })

    return { trunkEnd, cp1, cp2, trunkStatusColor, leaves }
  }, [from, angle, node, color])

  // ── Animation phases (dynamic — derived from progress each frame) ──
  const adj = Math.max(0, (progress - delay) / (1 - delay))
  if (adj <= 0) return null

  const trunkGrowPhase   = Math.min(adj / 0.3, 1)                         // 0.0–0.3
  const trunkPanelPhase  = adj > 0.2 ? Math.min((adj - 0.2) / 0.3, 1) : 0  // 0.2–0.5
  const leafGrowPhase    = adj > 0.3 ? Math.min((adj - 0.3) / 0.3, 1) : 0  // 0.3–0.6
  const leafPanelPhase   = adj > 0.5 ? Math.min((adj - 0.5) / 0.3, 1) : 0  // 0.5–0.8
  const textPhase        = adj > 0.6 ? Math.min((adj - 0.6) / 0.4, 1) : 0  // 0.6–1.0

  // Partial trunk endpoint during growth
  const trunkTip = trunkGrowPhase < 1
    ? { x: from.x + (s.trunkEnd.x - from.x) * trunkGrowPhase,
        y: from.y + (s.trunkEnd.y - from.y) * trunkGrowPhase }
    : s.trunkEnd

  return (
    <g className="pointer-events-none">

      {/* ── Level 1: Trunk — thick bezier curve ── */}
      <path
        d={`M${from.x},${from.y} C${s.cp1.x},${s.cp1.y} ${s.cp2.x},${s.cp2.y} ${trunkTip.x},${trunkTip.y}`}
        fill="none"
        stroke={color}
        strokeWidth={trunkGrowPhase < 1 ? 2 * trunkGrowPhase : 2}
        opacity={Math.min(trunkGrowPhase * 1.5, 0.6)}
        strokeDasharray={trunkGrowPhase < 1 ? '4 3' : 'none'}
      />

      {/* Trunk glow */}
      {trunkGrowPhase > 0.5 && (
        <path
          d={`M${from.x},${from.y} C${s.cp1.x},${s.cp1.y} ${s.cp2.x},${s.cp2.y} ${trunkTip.x},${trunkTip.y}`}
          fill="none"
          stroke={color}
          strokeWidth={4}
          opacity={0.06}
          filter="url(#glow)"
        />
      )}

      {/* Traveling light on trunk */}
      {trunkGrowPhase > 0.2 && trunkGrowPhase < 0.9 && (() => {
        const t = trunkGrowPhase
        const px = Math.pow(1 - t, 3) * from.x + 3 * Math.pow(1 - t, 2) * t * s.cp1.x + 3 * (1 - t) * t * t * s.cp2.x + t * t * t * s.trunkEnd.x
        const py = Math.pow(1 - t, 3) * from.y + 3 * Math.pow(1 - t, 2) * t * s.cp1.y + 3 * (1 - t) * t * t * s.cp2.y + t * t * t * s.trunkEnd.y
        return <circle cx={px} cy={py} r={3} fill={color} opacity={0.5} filter="url(#glow)" />
      })()}

      {/* ── Level 1: Trunk panel (60×22) ── */}
      {trunkPanelPhase > 0 && (
        <g transform={`translate(${s.trunkEnd.x}, ${s.trunkEnd.y})`} opacity={trunkPanelPhase}>
          {/* Background panel */}
          <rect
            x={-TRUNK_PANEL_W / 2} y={-TRUNK_PANEL_H / 2}
            width={TRUNK_PANEL_W} height={TRUNK_PANEL_H}
            rx={4}
            fill="rgba(17,17,27,0.8)"
            stroke={s.trunkStatusColor}
            strokeWidth={1}
            opacity={0.95}
          />

          {/* Status indicator dot */}
          <circle
            cx={-TRUNK_PANEL_W / 2 + 8} cy={0}
            r={3}
            fill={s.trunkStatusColor}
            opacity={0.85}
          />

          {/* Trunk label (category) */}
          {textPhase > 0 && (
            <text
              x={-TRUNK_PANEL_W / 2 + 15} y={node.trunkValue ? -2 : 1}
              fill={s.trunkStatusColor}
              fontSize={7}
              fontWeight="700"
              fontFamily="'JetBrains Mono', monospace"
              opacity={textPhase * 0.95}
              dominantBaseline={node.trunkValue ? 'auto' : 'central'}
            >{node.trunk}</text>
          )}

          {/* Trunk value (optional — e.g. "RECHERCHE", "ÉCRITURE") */}
          {textPhase > 0 && node.trunkValue && (
            <text
              x={-TRUNK_PANEL_W / 2 + 15} y={8}
              fill="var(--color-fg)"
              fontSize={6}
              fontFamily="'JetBrains Mono', monospace"
              opacity={textPhase * 0.7}
            >{node.trunkValue}</text>
          )}
        </g>
      )}

      {/* ── Level 2: Leaf branches + panels ── */}
      {s.leaves.map((ls, i) => (
        <DendriteLeafBranch
          key={`leaf-${i}`}
          from={s.trunkEnd}
          to={ls.to}
          cp={ls.cp}
          leaf={ls.leaf}
          color={color}
          statusColor={ls.statusColor}
          staggerCoeff={ls.staggerCoeff}
          staggerPanelCoeff={ls.staggerPanelCoeff}
          growPhase={leafGrowPhase}
          panelPhase={leafPanelPhase}
          textPhase={textPhase}
        />
      ))}
    </g>
  )
}

// ══════════════════════════════════════════════════════════════
// DENDRITE LEAF BRANCH — thin bezier + compact 44×16 panel
// Rendered as part of DendriteTrunk, not as a standalone export.
// React Compiler auto-memoizes — skips re-render when props are unchanged.
// ══════════════════════════════════════════════════════════════

interface DendriteLeafBranchProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
  /** Precomputed quadratic bezier control point */
  cp: { x: number; y: number }
  leaf: DendriteLeaf
  color: string
  /** Precomputed status color */
  statusColor: string
  /** Stagger delay coefficient for this leaf (leafIndex * 0.08) */
  staggerCoeff: number
  /** Stagger panel coefficient (leafIndex * 0.06) */
  staggerPanelCoeff: number
  growPhase: number
  panelPhase: number
  textPhase: number
}

/** Leaf panel dimensions (EPIC §6.2) */
const LEAF_PANEL_W = 44
const LEAF_PANEL_H = 16

// See MEMO-NOTES.md §E
function DendriteLeafBranch({
  from, to, cp, leaf, color, statusColor,
  staggerCoeff, staggerPanelCoeff,
  growPhase, panelPhase, textPhase,
}: DendriteLeafBranchProps) {
  if (growPhase <= 0) return null

  // Stagger: each leaf has a small additional delay
  const stagger = Math.max(0, growPhase - staggerCoeff)
  if (stagger <= 0) return null

  // Partial leaf endpoint during growth — computed from stagger, not growPhase
  const leafTip = stagger < 1
    ? { x: from.x + (to.x - from.x) * stagger,
        y: from.y + (to.y - from.y) * stagger }
    : to

  return (
    <g className="pointer-events-none">

      {/* Thin leaf bezier — uses precomputed control point */}
      <path
        d={`M${from.x},${from.y} Q${cp.x},${cp.y} ${leafTip.x},${leafTip.y}`}
        fill="none"
        stroke={color}
        strokeWidth={stagger < 1 ? 0.8 * stagger : 0.8}
        opacity={Math.min(stagger * 1.5, 0.4)}
        strokeDasharray={stagger < 1 ? '3 2' : 'none'}
      />

      {/* Leaf panel (44×16 compact) */}
      {panelPhase > 0 && (() => {
        // Apply leaf-level stagger to panel too
        const leafPanelAdj = Math.max(0, (panelPhase - staggerPanelCoeff) / (1 - staggerPanelCoeff))
        if (leafPanelAdj <= 0) return null

        return (
          <g transform={`translate(${to.x}, ${to.y})`} opacity={leafPanelAdj}>
            {/* Background panel */}
            <rect
              x={-LEAF_PANEL_W / 2} y={-LEAF_PANEL_H / 2}
              width={LEAF_PANEL_W} height={LEAF_PANEL_H}
              rx={3}
              fill="rgba(17,17,27,0.7)"
              stroke={statusColor}
              strokeWidth={0.6}
              opacity={0.85}
            />

            {/* Status dot */}
            <circle
              cx={-LEAF_PANEL_W / 2 + 6} cy={0}
              r={1.8}
              fill={statusColor}
              opacity={0.75}
            />

            {/* Label */}
            {textPhase > 0 && (
              <text
                x={-LEAF_PANEL_W / 2 + 11} y={-2}
                fill={statusColor}
                fontSize={5}
                fontWeight="600"
                fontFamily="'JetBrains Mono', monospace"
                opacity={textPhase * 0.85}
              >{leaf.label}</text>
            )}

            {/* Value */}
            {textPhase > 0 && (
              <text
                x={-LEAF_PANEL_W / 2 + 11} y={6}
                fill="var(--color-fg)"
                fontSize={5.5}
                fontFamily="'JetBrains Mono', monospace"
                opacity={textPhase * 0.65}
              >{leaf.value}</text>
            )}
          </g>
        )
      })()}
    </g>
  )
}
