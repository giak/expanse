// ══════════════════════════════════════════════════════════════
// SCENARIO CONTEXT — shared derivation layer for AURA + Dendrites
// Source canonique : EPIC-CONTEXTE-AURA.md §Ⅸ + §5.6 + §Ⅷ
// ══════════════════════════════════════════════════════════════

import type { ProcessStep, Organ } from '../types/signal'
import { hasEffect } from './visualEffects'
import type { AuraState, DendriteNode, DendriteLeaf, DendriteStatus, ScenarioContext } from '../types/aura'
import { INITIAL_SCENARIO_CONTEXT } from '../types/aura'
import { DREAM_PHASES } from '../constants/phases'
import { formatToolCall } from './formatToolCall'

// ─── Constants ───

/** L0 fixed radius after Boot step 1 — inner core, surrounds nucleus */
const L0_RADIUS = 120
/** L0 fixed opacity after Boot step 1 */
const L0_OPACITY = 0.12
/** L1 radius increment per cortex item — grows past organ ring */
const L1_RADIUS_PER_ITEM = 40
/** L1 base radius — starts where L0 ends */
const L1_RADIUS_BASE = 130
/** L1 opacity increment per cortex item */
const L1_OPACITY_PER_ITEM = 0.045
/** L1 base opacity */
const L1_OPACITY_BASE = 0.08
/** L2 radius increment per unit of dynamicActivity — extends beyond organ ring */
const L2_RADIUS_PER_ACTIVITY = 120
/** L2 base opacity */
const L2_OPACITY_BASE = 0.06
/** L2 opacity increment per unit of dynamicActivity */
const L2_OPACITY_PER_ACTIVITY = 0.12

/** Phases where L0 has been read (substrat exists in context) */
const L0_ACTIVE_PHASES = new Set<string>([
  'SEED', 'APEX', 'INDEX', 'MEMORY', 'CHECK', 'BRIEFING', 'READY', 'LISTEN',
  'PERCEIVE', 'EVALUATE', 'ROUTE', 'VERIFY', 'EMIT', 'RECORD', 'IDLE',
  'AUDIT', 'TOOL_CALL', 'RECALL', 'SYNTHESIZE',
  'TRIANGULATE', 'ANCHOR_POLE', 'VESSEL_POLE', 'WEB_POLE',
  'DETECT', 'BLOCK', 'CHALLENGE', 'MISSING', 'LOST_EMIT',
  'RHETORIC_DETECT', 'VESSEL_SEARCH', 'VESSEL_FOUND',
  'DREAM_INIT', 'WINTER', 'FRESH_COUNT', 'DEGEL', 'LINTER', 'EMERGENCE', 'ELAGAGE',
])

/** Μ search phases — increment cortexItemCount */
const CORTEX_INJECT_PHASES = new Set<string>(['MEMORY', 'RECALL', 'ANCHOR_POLE'])

/** Dream élagage phases — decrement cortexItemCount */
const CORTEX_PRUNE_PHASES = new Set<string>(['ELAGAGE'])

// ─── Μ Semantic Label Map (from OrganDendrites.tsx) ───

interface MuSearchContext {
  label: string
  resultSuffix: (count: number) => string
}

const MU_TAG_CONTEXT: Record<string, MuSearchContext> = {
  'sys:protocol': { label: 'PROTOCOLS', resultSuffix: c => `${c} règles` },
  'sys:core':     { label: 'AXIOMES',  resultSuffix: c => `${c} scellés` },
  'sys:anchor':   { label: 'ANCRES',   resultSuffix: c => `${c} ancrées` },
  'sys:core,sys:anchor': { label: 'AXIOMES+ANCRES', resultSuffix: c => `${c} items` },
  'sys:extension': { label: 'EXTENSIONS', resultSuffix: c => `${c} actives` },
  'sys:user:profile': { label: 'PROFIL', resultSuffix: c => `${c} profil` },
  'sys:project':  { label: 'PROJET',   resultSuffix: c => `${c} projet` },
  'ECS':          { label: 'ECS PATTERNS', resultSuffix: c => `${c} rappelés` },
  'query="ECS"':  { label: 'ECS PATTERNS', resultSuffix: c => `${c} rappelés` },
  'trace:fresh':  { label: 'TRACES FRAÎCHES', resultSuffix: c => `${c} traces` },
  'PROPOSAL_OPEN': { label: 'PROPOSAL', resultSuffix: c => `${c} proposal` },
  '':             { label: 'RECHERCHE', resultSuffix: c => `${c} résultats` },
}

const _MU_PARTIAL_KEYS = Object.keys(MU_TAG_CONTEXT)
  .filter(k => k)
  .sort((a, b) => b.length - a.length)

function deriveMuSearchContext(toolName: string, toolCalls?: string[]): MuSearchContext {
  let match = toolName.match(/search_memory\(([^)]*)\)/)
  let tag = match?.[1]?.trim() ?? ''

  if (!tag && toolCalls?.length) {
    match = toolCalls[0].match(/search_memory\(([^)]*)\)/)
    tag = match?.[1]?.trim() ?? ''
  }

  if (MU_TAG_CONTEXT[tag]) return MU_TAG_CONTEXT[tag]

  for (const key of _MU_PARTIAL_KEYS) {
    if (tag.includes(key)) return MU_TAG_CONTEXT[key]
  }

  if (tag) {
    const shortTag = tag.length > 14 ? tag.substring(0, 12) + '…' : tag
    return { label: shortTag.toUpperCase(), resultSuffix: c => `${c} trouvés` }
  }
  return MU_TAG_CONTEXT['']
}

// ══════════════════════════════════════════════════════════════
// 1. accumulateScenarioContext — reactive context update per step
// ══════════════════════════════════════════════════════════════

/** Accumulate ScenarioContext from the current step.
 *  Call this reactively in SignalCanvas when the step changes.
 *  Returns a NEW context object (immutable update).
 */
export function accumulateScenarioContext(
  prevCtx: ScenarioContext,
  step: ProcessStep,
): ScenarioContext {
  let cortexItemCount = prevCtx.cortexItemCount
  let fissure = prevCtx.fissure
  const budget = { ...prevCtx.budget }

  // ── Cortex injection: Μ search operations add L1 items ──
  if (step.mcpOperation?.type === 'search' && CORTEX_INJECT_PHASES.has(step.phase ?? '')) {
    cortexItemCount += 1
    budget.l1Tokens += Math.round(step.mcpOperation.resultCount ?? 1) * 500
  }

  // ── Boot MEMORY steps without mcpOperation: count from organ + phase ──
  if (step.organ === 'Μ' && step.phase === 'MEMORY' && !step.mcpOperation) {
    cortexItemCount += 1
    budget.l1Tokens += 500
  }

  // ── Cortex pruning: Dream P4 élague ──
  if (CORTEX_PRUNE_PHASES.has(step.phase ?? '') && step.organ === 'Μ') {
    const deleted = step.badge?.match(/(\d+)\s*DELETED/)?.[1]
    if (deleted) {
      const n = parseInt(deleted, 10)
      cortexItemCount = Math.max(0, cortexItemCount - n)
      budget.l1Tokens = Math.max(0, budget.l1Tokens - n * 500)
    }
  }

  // ── Fissure: BLOCK phase sets violation flag ──
  if (step.phase === 'BLOCK') {
    fissure = true
  }

  // ── L0 tokens: present after Boot step 1 (SEED reads boot-seed + V16) ──
  if (L0_ACTIVE_PHASES.has(step.phase ?? '') && budget.l0Tokens === 0) {
    budget.l0Tokens = 3000
  }

  // ── L2 tokens: dynamic activity from tool calls, input, etc. ──
  const toolCallCount = step.toolCalls?.length ?? 0
  const hasInput = step.phase === 'PERCEIVE' || step.phase === 'DREAM_INIT'
  const l2Estimate = toolCallCount * 2000 + (hasInput ? 3000 : 0)
  budget.l2Tokens = l2Estimate

  // ── Dynamic activity: 0–1 based on current step complexity ──
  let dynamicActivity = 0
  if (toolCallCount > 0) dynamicActivity = Math.min(1, toolCallCount * 0.25)
  if (hasInput) dynamicActivity = Math.max(dynamicActivity, 0.3)
  if (step.phase === 'AUDIT' || step.phase === 'TRIANGULATE') dynamicActivity = 0.5
  if (step.phase === 'SYNTHESIZE' || step.phase === 'EMIT') dynamicActivity = 0.7
  if (step.ecsRoute?.level === 'L3') dynamicActivity = Math.max(dynamicActivity, 0.8)

  return {
    cortexItemCount,
    dynamicActivity,
    fissure,
    budget,
  }
}

/** Build a ScenarioContext by accumulating from step 0 to stepIdx.
 *  Used when jumping to a specific step (e.g. scrubbing timeline).
 */
export function buildScenarioContextUpTo(
  steps: ProcessStep[],
  stepIdx: number,
): ScenarioContext {
  if (stepIdx < 0 || steps.length === 0) {
    return { ...INITIAL_SCENARIO_CONTEXT, budget: { ...INITIAL_SCENARIO_CONTEXT.budget } }
  }
  let ctx: ScenarioContext = { ...INITIAL_SCENARIO_CONTEXT, budget: { ...INITIAL_SCENARIO_CONTEXT.budget } }
  for (let i = 0; i <= stepIdx; i++) {
    ctx = accumulateScenarioContext(ctx, steps[i])
  }
  return ctx
}

// ══════════════════════════════════════════════════════════════
// 2. deriveAuraState — pure function: step + ctx → AuraState
// ══════════════════════════════════════════════════════════════

/** Derive AURA visual state from the current step and accumulated context.
 *  Pure function — no side effects. Matches EPIC §Ⅸ deriveAuraState().
 */
export function deriveAuraState(step: ProcessStep, ctx: ScenarioContext): AuraState {
  const phase = step.phase ?? ''
  const l0Active = L0_ACTIVE_PHASES.has(phase)
  const l1Active = ctx.cortexItemCount > 0
  const l2Active = ctx.dynamicActivity > 0 || step.organ !== undefined

  return {
    l0Radius:  l0Active ? L0_RADIUS : 0,
    l0Opacity: l0Active ? L0_OPACITY : 0,
    l1Radius:  l1Active ? L1_RADIUS_BASE + ctx.cortexItemCount * L1_RADIUS_PER_ITEM : 0,
    l1Opacity: l1Active ? L1_OPACITY_BASE + ctx.cortexItemCount * L1_OPACITY_PER_ITEM : 0,
    l2Radius:  l2Active
      ? (L1_RADIUS_BASE + ctx.cortexItemCount * L1_RADIUS_PER_ITEM) + ctx.dynamicActivity * L2_RADIUS_PER_ACTIVITY
      : 0,
    l2Opacity: l2Active ? L2_OPACITY_BASE + ctx.dynamicActivity * L2_OPACITY_PER_ACTIVITY : 0,
    pulseSpeed: ctx.dynamicActivity > 0.7 ? 0.2 : ctx.dynamicActivity > 0.3 ? 0.35 : 0.5,
    fissure: ctx.fissure,
    cortexItemCount: ctx.cortexItemCount,
    dynamicActivity: ctx.dynamicActivity,
    budget: { ...ctx.budget },
  }
}

// ══════════════════════════════════════════════════════════════
// 3. deriveDendriteNodes — per-organ dendrite derivation
// ══════════════════════════════════════════════════════════════

/** Derive DendriteNode[] for a specific organ from the current step.
 *  Rules from EPIC §Ⅷ + §Ⅸ.
 */
export function deriveDendriteNodes(organ: Organ, step: ProcessStep | null): DendriteNode[] {
  if (!step) return []

  switch (organ) {
    case 'Σ': return deriveSigmaNodes(step)
    case 'Ψ': return derivePsiNodes(step)
    case 'Φ': return derivePhiNodes(step)
    case 'Ω': return deriveOmegaNodes(step)
    case 'Μ': return deriveMuNodes(step)
    default: return []
  }
}

// ─── Helper: create a single-trunk node with leaves ───

function trunk(trunkLabel: string, status: DendriteStatus, leaves: DendriteLeaf[], trunkValue?: string): DendriteNode {
  return { trunk: trunkLabel, trunkStatus: status, leaves, trunkValue }
}

function leaf(label: string, value: string, status: DendriteStatus): DendriteLeaf {
  return { label, value, status }
}

// ─── Σ Perception ───

function deriveSigmaNodes(step: ProcessStep): DendriteNode[] {
  const nodes: DendriteNode[] = []

  // MODALITY trunk
  const isDream = DREAM_PHASES.has(step.phase ?? '')
  const isCommand = step.badge?.includes('/dream') || step.badge?.includes('/apply')
  const isBoot = step.ecsRoute?.level === 'BOOT'
  let modality: string
  if (step.phase === 'INIT') modality = 'BOOT'
  else if (step.phase === 'LISTEN') modality = 'ATTENTE'
  else if (isCommand) modality = 'CLI_CMD'
  else if (isDream) modality = 'DREAM'
  else if (isBoot) modality = 'BOOT'
  else modality = 'TEXT'
  nodes.push(trunk('MODALITY', 'neutral', [leaf('TYPE', modality, 'neutral')]))

  // SNAPSHOT trunk (Boot INIT)
  if (step.phase === 'INIT') {
    nodes.push(trunk('SNAPSHOT', 'neutral', [leaf('REPO', 'expanse', 'neutral')]))
  }

  // LECTURE trunk (Boot SEED)
  if (step.phase === 'SEED') {
    const fileLeaves: DendriteLeaf[] = []
    if (step.toolCalls?.length) {
      fileLeaves.push(leaf('FICHIER', formatToolCall(step.toolCalls[0], 20), 'neutral'))
    }
    if (step.badge?.includes('EXEMPTION')) {
      fileLeaves.push(leaf('EXEMPTION', 'DIRECTE', 'warn'))
    }
    if (fileLeaves.length > 0) {
      nodes.push(trunk('LECTURE', 'neutral', fileLeaves))
    }
  }

  // INPUT trunk (perception with content)
  if (step.phase === 'PERCEIVE' || step.phase === 'DREAM_INIT') {
    const inputText = step.detail?.match(/«([^»]+)»/)?.[1] ?? step.badge ?? ''
    if (inputText) {
      nodes.push(trunk('INPUT', 'neutral', [leaf('CONTENU', inputText.length > 18 ? inputText.substring(0, 16) + '…' : inputText, 'neutral')]))
    }
  }

  // ECS INPUT trunk (complexity + impact values before routing)
  if (step.ecsRoute) {
    nodes.push(trunk('ECS INPUT', step.ecsRoute.c >= 4 ? 'warn' : 'neutral', [
      leaf('VALEURS', `C=${step.ecsRoute.c} I=${step.ecsRoute.i}`, step.ecsRoute.c >= 4 ? 'warn' : 'neutral'),
    ]))
  }

  // SIGNAL trunk (negative signal)
  if (step.isNegative) {
    nodes.push(trunk('SIGNAL', 'error', [leaf('VALENCE', 'NÉGATIF ⚠', 'error')]))
  }

  return nodes
}

// ─── Ψ Métacognition ───

function derivePsiNodes(step: ProcessStep): DendriteNode[] {
  const nodes: DendriteNode[] = []

  // ROUTE trunk
  if (step.ecsRoute) {
    const lvl = step.ecsRoute.level
    nodes.push(trunk('ROUTE', lvl === 'L3' ? 'warn' : lvl === 'L1' ? 'ok' : 'neutral', [
      leaf('ECS', lvl, lvl === 'L3' ? 'warn' : lvl === 'L1' ? 'ok' : 'neutral'),
    ]))
  }

  // AUTO-CHECK trunk
  const isVerify = step.phase === 'VERIFY' || step.phase === 'CHECK'
  const hasGuard = hasEffect(step, 'guard-shield') || hasEffect(step, 'constitutional-guard')
  if (isVerify || hasGuard) {
    const checkLeaves: DendriteLeaf[] = []
    if (hasGuard) {
      checkLeaves.push(leaf('CONSTITUTION', '✓', 'ok'))
    }
    checkLeaves.push(leaf('SEC', '✓', 'ok'))
    nodes.push(trunk('AUTO-CHECK', 'ok', checkLeaves))
  }

  // SYMBIOSE trunk
  if (step.badge?.includes('A1') || step.badge?.includes('A2')) {
    nodes.push(trunk('SYMBIOSE', 'neutral', [leaf('NIVEAU', step.badge, 'neutral')]))
  }

  // DREAM trunk
  if (DREAM_PHASES.has(step.phase ?? '')) {
    const seasonLabels: Record<string, string> = {
      WINTER: '❄ HIVER', FRESH_COUNT: '🔴 TRACES', DREAM_INIT: '🚪 OUVERT',
      DEGEL: '✿ DÉGEL', LINTER: '🔍 LINTER', EMERGENCE: '☀ ÉMERGENCE',
      ELAGAGE: '🍂 ÉLAGAGE',
    }
    nodes.push(trunk('DREAM', 'neutral', [leaf('PASSE', seasonLabels[step.phase ?? ''] ?? step.phase ?? 'ACTIVE', 'neutral')]))
  }

  // BOOT_CONFIG trunk (APEX phase)
  if (step.phase === 'APEX') {
    const bootLeaves: DendriteLeaf[] = []
    if (step.badge?.includes('EXEMPTION')) {
      bootLeaves.push(leaf('EXEMPTION', 'DIRECTE', 'warn'))
    }
    if (step.toolCalls?.length) {
      bootLeaves.push(leaf('LECTURE', formatToolCall(step.toolCalls[0], 20), 'neutral'))
    }
    bootLeaves.push(leaf('PROTOCOLS', '⊕ index ⊕ activation', 'neutral'))
    nodes.push(trunk('BOOT_CONFIG', 'neutral', bootLeaves))
  }

  // VESSEL trunk (INDEX phase)
  if (step.phase === 'INDEX') {
    nodes.push(trunk('VESSEL', 'ok', [leaf('INDEX', '✓', 'ok')]))
  }

  // MODULES / TRACES trunks (CHECK phase)
  if (step.phase === 'CHECK') {
    if (step.badge?.includes('FRESH')) {
      const count = step.badge.replace('FRESH:', '')
      nodes.push(trunk('TRACES', 'warn', [leaf('FRAÎCHES', `${count}`, 'warn')]))
    } else if (step.label?.includes('Healthcheck')) {
      nodes.push(trunk('MODULES', 'ok', [leaf('CORE', '✓', 'ok'), leaf('PROF/PROJ', '✓', 'ok')]))
    }
  }

  // VIOLATION trunk
  if (step.phase === 'DETECT' || step.phase === 'BLOCK') {
    nodes.push(trunk('VIOLATION', 'error', [leaf('STATUT', step.phase === 'DETECT' ? 'DÉTECTÉE' : 'BLOQUÉE', 'error')]))
  }

  // CHALLENGE trunk
  if (step.phase === 'CHALLENGE') {
    nodes.push(trunk('CHALLENGE', 'warn', [leaf('QUESTION', 'ÉVOL. OU ERREUR', 'warn')]))
  }

  // RHÉTORIQUE trunk
  if (step.phase === 'RHETORIC_DETECT') {
    nodes.push(trunk('VIOLATION', 'warn', [leaf('RHÉTORIQUE', 'PAS D\'IMPÉRATIF', 'warn')]))
  }

  // AUDIT trunk
  if (step.phase === 'AUDIT') {
    nodes.push(trunk('AUDIT', 'warn', [leaf('BOUCLE', 'Ψ⇌Φ ACTIVE', 'warn')]))
  }

  // TRIANGULATION trunk
  if (step.phase === 'TRIANGULATE' || step.phase === 'ANCHOR_POLE' || step.phase === 'VESSEL_POLE' || step.phase === 'WEB_POLE') {
    const triLeaves: DendriteLeaf[] = []
    if (step.confidence !== undefined) {
      triLeaves.push(leaf('CONFIANCE', `${step.confidence}%`, step.confidence >= 80 ? 'ok' : 'warn'))
    } else {
      triLeaves.push(leaf('PÔLES', '3 ACTIFS', 'warn'))
    }
    if (step.phase === 'TRIANGULATE' && hasEffect(step, 'tri-pole-orbit-converging')) {
      triLeaves.push(leaf('STATUT', 'CONVERGENCE', 'ok'))
    }
    nodes.push(trunk('TRIANGULATION', step.confidence !== undefined && step.confidence >= 80 ? 'ok' : 'warn', triLeaves))
  }

  return nodes
}

// ─── Φ Audit Réel ───

function derivePhiNodes(step: ProcessStep): DendriteNode[] {
  const nodes: DendriteNode[] = []

  // OUTIL trunk — tool calls
  if (step.toolCalls && step.toolCalls.length > 0) {
    const toolLeaves: DendriteLeaf[] = step.toolCalls.slice(0, 3).map((tc) => {
      const toolName = tc.match(/^([a-z_]+)\(/)?.[1] ?? 'outil'
      const arg = tc.match(/\(([^)]*)\)/)?.[1] ?? ''
      return leaf(toolName.toUpperCase(), arg.length > 16 ? arg.substring(0, 14) + '…' : arg, 'neutral')
    })
    nodes.push(trunk('OUTIL', 'neutral', toolLeaves, step.toolCalls[0]?.match(/^([a-z_]+)\(/)?.[1]))
  }

  // VESSEL trunk
  if (step.phase === 'VESSEL_SEARCH') {
    nodes.push(trunk('VESSEL', 'warn', [leaf('SCAN', 'EN COURS', 'warn')]))
  }
  if (step.phase === 'VESSEL_FOUND') {
    nodes.push(trunk('VESSEL', 'ok', [leaf('STATUT', 'TROUVÉ ✓', 'ok')]))
  }

  // DONNÉE trunk (hallucination block)
  if (hasEffect(step, 'fog-patch')) {
    nodes.push(trunk('DONNÉE', 'error', [leaf('DISPONIBILITÉ', 'ABSENTE ✗', 'error')]))
  }

  return nodes
}

// ─── Ω Synthèse / Émission ───

function deriveOmegaNodes(step: ProcessStep): DendriteNode[] {
  const nodes: DendriteNode[] = []

  // ÉMISSION trunk
  if (step.phase === 'EMIT' || step.phase === 'SYNTHESIZE') {
    const emitLeaves: DendriteLeaf[] = []
    emitLeaves.push(leaf('STATUT', step.phase === 'SYNTHESIZE' ? 'STREAMING' : 'ÉMIS', 'ok'))
    // FORMAT leaf — always present during EMIT/SYNTHESIZE
    const format = step.ecsRoute?.level === 'L1' ? 'BREF' : 'STRUCTURÉ'
    emitLeaves.push(leaf('FORMAT', format, 'neutral'))
    nodes.push(trunk('ÉMISSION', 'ok', emitLeaves))
  }

  // LOST_EMIT
  if (step.phase === 'LOST_EMIT') {
    nodes.push(trunk('ÉMISSION', 'error', [leaf('STATUT', '[LOST]', 'error')]))
  }

  // BLOCK (émission bloquée)
  if (step.phase === 'BLOCK') {
    nodes.push(trunk('ÉMISSION', 'error', [leaf('STATUT', 'BLOQUÉE ✗', 'error')]))
  }

  // CONFIANCE trunk (L3)
  if (step.confidence !== undefined && step.phase !== 'TRIANGULATE') {
    nodes.push(trunk('CONFIANCE', step.confidence >= 80 ? 'ok' : step.confidence >= 50 ? 'warn' : 'error', [
      leaf('INDICE', `${step.confidence}%`, step.confidence >= 80 ? 'ok' : 'warn'),
    ]))
  }

  // ACTIVATION trunk (BRIEFING)
  if (step.phase === 'BRIEFING') {
    nodes.push(trunk('ACTIVATION', 'ok', [leaf('SIGNAL', 'Ψ V16', 'ok')]))
  }

  // ÉTAT trunk (READY)
  if (step.phase === 'READY') {
    nodes.push(trunk('ÉTAT', 'ok', [leaf('OPÉRATIONNEL', 'PRÊT', 'ok')]))
  }

  // INERTIE trunk (IDLE)
  if (step.phase === 'IDLE') {
    const symbiose = step.badge?.includes('A1') ? 'A1 MURMURES' : step.badge?.includes('A2') ? 'A2 SUGGESTIONS' : 'A0 SILENCE'
    nodes.push(trunk('INERTIE', 'neutral', [leaf('SYMBIOSE', symbiose, 'neutral')]))
  }

  return nodes
}

// ─── Μ Mémoire / Cristallisation ───

function deriveMuNodes(step: ProcessStep): DendriteNode[] {
  const nodes: DendriteNode[] = []

  // MCP trunk — search/write operations
  if (step.mcpOperation) {
    const op = step.mcpOperation
    const ctx = deriveMuSearchContext(op.toolName, step.toolCalls)
    const mcpLeaves: DendriteLeaf[] = []

    // Primary leaf: semantic target
    mcpLeaves.push(leaf(ctx.label, ctx.resultSuffix(op.resultCount ?? 0), op.resultCount !== undefined && op.resultCount > 0 ? 'ok' : 'warn'))

    // Sub-leaves from toolCalls (multi-feuille for Boot step 6, etc.)
    if (step.toolCalls && step.toolCalls.length > 1) {
      step.toolCalls.slice(1, 4).forEach(tc => {
        const tag = tc.match(/search_memory\(([^)]*)\)/)?.[1] ?? ''
        const short = tag.length > 14 ? tag.substring(0, 12) + '…' : tag
        mcpLeaves.push(leaf(short || 'APPEL', formatToolCall(tc, 16), 'neutral'))
      })
    } else if (step.toolCalls?.length === 1) {
      mcpLeaves.push(leaf('APPEL', formatToolCall(step.toolCalls[0], 16), 'neutral'))
    }

    nodes.push(trunk('MCP', 'neutral', mcpLeaves, op.type === 'write' ? 'ÉCRITURE' : 'RECHERCHE'))
  }

  // RAPPEL trunk (without mcpOperation)
  if (step.phase === 'RECALL' && !step.mcpOperation) {
    nodes.push(trunk('RAPPEL', 'ok', [leaf('PATTERNS', '↑', 'ok')]))
  }

  // ENREGISTREMENT trunk
  if (step.phase === 'RECORD' && !hasEffect(step, 'fresh-trace-mark') && !step.mcpOperation) {
    nodes.push(trunk('ENREGISTREMENT', step.isNegative ? 'warn' : 'ok', [
      leaf('SIGNAL', step.isNegative ? 'TRACE ⚠' : 'NORMAL', step.isNegative ? 'warn' : 'ok'),
    ]))
  }

  // TRACE trunk
  if (hasEffect(step, 'fresh-trace-mark')) {
    nodes.push(trunk('TRACE', 'warn', [leaf('FRAÎCHEUR', '⚠', 'warn')]))
  }

  // FRESH trunk (Dream winter)
  if (step.phase === 'WINTER' || step.phase === 'FRESH_COUNT') {
    nodes.push(trunk('FRESH', 'warn', [leaf('TRACES', '16', 'warn')]))
  }

  // PROPOSAL trunk
  if (hasEffect(step, 'proposal-bloom')) {
    const type = step.badge?.includes('REFACTOR') ? 'REFACTOR' : step.badge?.includes('DELETE') ? 'DELETE' : 'MODIFY'
    nodes.push(trunk('PROPOSAL', 'neutral', [leaf('TYPE', type, 'neutral')]))
  }

  // ÉLAGAGE trunk
  if (hasEffect(step, 'prune-shears')) {
    nodes.push(trunk('ÉLAGAGE', 'warn', [leaf('ACTION', 'EN COURS ✂', 'warn')]))
  }

  return nodes
}
