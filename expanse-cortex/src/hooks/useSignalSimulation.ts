
import type { GraphData, JsonNode } from '../types/expanse'
import type { Scenario, Organ, ECSLevel } from '../types/signal'
import { isOrgan } from '../types/signal'

// ─── Route color mapping ───

const ROUTE_COLORS: Record<string, string> = {
  L1: '#a6e3a1',
  L2: '#f9e2af',
  L3: '#f38ba8',
  BOOT: '#89b4fa',
  DREAM: '#cba6f7',
  A1: '#94e2d5',
  A2: '#94e2d5',
  MUT: '#b4befe',
  NEG: '#f38ba8',
  CRYS: '#a6e3a1',
  DCRY: '#eba0ac',
  GARD: '#f9e2af',
  LIVE: '#b4befe',
}

// ─── Helpers ───

/** Find nodes connected FROM source via a specific edge type */
function findTargets(nodes: JsonNode[], edges: GraphData['edges'], sourceId: string, edgeType: string): JsonNode[] {
  return edges
    .filter(e => e.source === sourceId && e.type === edgeType)
    .map(e => nodes.find(n => n.id === e.target))
    .filter((n): n is JsonNode => n != null)
}

/** Get OUTIL tool labels connected to a node via CALLS edges */
function getToolCalls(nodes: JsonNode[], edges: GraphData['edges'], nodeId: string): string[] {
  const outils = findTargets(nodes, edges, nodeId, 'CALLS')
  if (outils.length > 0) return outils.map(o => o.label)
  // Fallback: find OUTILs connected via any edge
  const anyOutils = edges
    .filter(e => (e.source === nodeId || e.target === nodeId))
    .map(e => nodes.find(n => n.id === (e.source === nodeId ? e.target : e.source) && n.type === 'OUTIL'))
    .filter((n): n is JsonNode => n != null)
  if (anyOutils.length > 0) return anyOutils.slice(0, 2).map(o => o.label)
  return []
}

/** Extract organ symbol from parent_organ field (e.g. 'Ψ' from 'Ψ') */
function organFromParent(parentOrgan: string | null): Organ {
  if (!parentOrgan) return 'Ψ' // default to metacog
  // parent_organ is already a symbol like 'Σ', 'Ψ', 'Φ', 'Ω', 'Μ'
  const first = parentOrgan.charAt(0)
  if (isOrgan(first)) return first
  return 'Ψ'
}

/** Determine ECS level from node properties */
function inferECSLevel(node: JsonNode): { c: number; i: number; level: ECSLevel } {
  // High centrality + security tags → L3
  if (node.tags.includes('sec') || node.tags.includes('trace:fresh') || node.status === 'REJECTED' || node.status === 'ROLLED_BACK') {
    return { c: 5, i: 3, level: 'L3' }
  }
  // Medium centrality + structural tags → L2
  if (node.tags.includes('drift-type') || node.type === 'MUTATION' || node.type === 'PATTERN') {
    return { c: 3, i: 2, level: 'L2' }
  }
  // Default → L1
  return { c: 1, i: 1, level: 'L1' }
}

/** Map a node's status to negative signal */
function isNegativeStatus(status: string | null): boolean {
  return status === 'REJECTED' || status === 'ROLLED_BACK'
}

// ─── Scenario generators ───

/** Generate a mutation workflow scenario from a MUTATION node */
function generateMutationScenario(
  mutation: JsonNode,
  nodes: JsonNode[],
  edges: GraphData['edges'],
  supersedingMutation?: JsonNode,
): Scenario {
  const organ = organFromParent(mutation.parent_organ)
  const tools = getToolCalls(nodes, edges, mutation.id)
  const isNeg = isNegativeStatus(mutation.status)
  const ecs = inferECSLevel(mutation)
  const route = isNeg ? 'L3' : 'DREAM'
  const color = isNeg ? ROUTE_COLORS.L3 : ROUTE_COLORS.DREAM

  const steps: Scenario['steps'] = []

  // Step 1: Μ loads trace context
  steps.push({
    organ: 'Μ',
    label: 'Trace Load',
    detail: `Analyzing: ${mutation.label}`,
    duration: 1500,
  })

  // Step 2: Σ receives the change request
  steps.push({
    organ: 'Σ',
    label: 'Change Request',
    detail: `Proposal: ${(mutation.content ?? mutation.label ?? '').substring(0, 50)}`,
    badge: `ECS: C=${ecs.c}, I=${ecs.i} → ${ecs.level}`,
    ecsRoute: ecs,
    duration: 1800,
  })

  // Step 3: Ψ evaluates
  steps.push({
    organ: 'Ψ',
    label: 'Metacognition',
    detail: `Evaluating impact on ${organ} subsystem`,
    duration: 2100,
  })

  // Step 4: Φ audits with tools
  steps.push({
    organ: 'Φ',
    label: 'Audit',
    detail: 'Verifying system stability',
    toolCalls: tools.length > 0 ? tools : ['search_memory()', 'search_code()'],
    duration: 2700,
  })

  // Step 5: Ω proposes or blocks
  if (isNeg) {
    steps.push({
      organ: 'Ψ',
      label: 'Auto-Check',
      detail: `✗ ${mutation.status} — ${mutation.label}`,
      badge: `Ψ SEC ✗`,
      isNegative: true,
      duration: 1500,
    })
    steps.push({
      organ: 'Μ',
      label: mutation.status === 'ROLLED_BACK' ? 'Rollback' : 'Rejected',
      detail: `Status: ${mutation.status}`,
      isNegative: true,
      duration: 1350,
    })
  } else {
    steps.push({
      organ: 'Ω',
      label: 'Proposal',
      detail: 'Changes synthesized successfully',
      confidence: mutation.outcome ?? 85,
      duration: 1800,
    })
    steps.push({
      organ: 'Μ',
      label: 'Applied',
      detail: `Status: ${mutation.status}`,
      duration: 1200,
    })
  }

  // If there's a superseding mutation (e.g. rolled-back → surgical replacement)
  if (supersedingMutation && mutation.status === 'ROLLED_BACK') {
    steps.push({
      organ: 'Ψ',
      label: 'Re-evaluation',
      detail: `Superseded by: ${supersedingMutation.label}`,
      duration: 1500,
    })
    steps.push({
      organ: 'Ω',
      label: 'Surgical Proposal',
      detail: (supersedingMutation.content ?? supersedingMutation.label ?? '').substring(0, 50),
      confidence: supersedingMutation.outcome ?? 90,
      duration: 1800,
    })
    steps.push({
      organ: 'Μ',
      label: 'Applied',
      detail: `Replacement: ${supersedingMutation.status}`,
      duration: 1200,
    })
  }

  return {
    id: `live-mut-${mutation.id}`,
    title: `Live: ${mutation.label}`,
    selectorLabel: `🧬 ${mutation.label.substring(0, 12)}`,
    subtitle: `Mutation → ${mutation.status}${supersedingMutation ? ` → ${supersedingMutation.label}` : ''}`,
    route: route as Scenario['route'],
    color,
    steps,
    source: 'live',
  }
}

/** Generate a trace friction scenario from a DRIFT node */
function generateFrictionScenario(
  drift: JsonNode,
  nodes: JsonNode[],
  edges: GraphData['edges'],
): Scenario {
  const tools = getToolCalls(nodes, edges, drift.id)
  const driftType = drift.tags.find(t => t !== 'trace:fresh' && t !== 'drift-type') ?? 'ecs'
  const isSec = driftType === 'sec'

  return {
    id: `live-friction-${drift.id}`,
    title: `Live: ${drift.label}`,
    selectorLabel: `⚠ ${drift.label.substring(0, 12)}`,
    subtitle: `${driftType.toUpperCase()} friction detected`,
    route: 'L3',
    color: ROUTE_COLORS.L3,
    steps: [
      {
        organ: 'Σ',
        label: 'Input reçu',
        detail: `Edge case: ${(drift.content ?? drift.label ?? '').substring(0, 40)}`,
        badge: `ECS: C=5, I=3 → L3`,
        ecsRoute: { c: 5, i: 3, level: 'L3' },
        duration: 2100,
      },
      {
        organ: 'Ψ',
        label: 'Contradiction',
        detail: isSec ? '⚠ Security violation detected' : '⚠ Routing anomaly detected',
        duration: 2100,
      },
      {
        organ: 'Φ',
        label: 'Triangulation',
        detail: `Audit: ${driftType} friction source`,
        toolCalls: tools.length > 0 ? tools : ['search_memory()', 'search_code()'],
        duration: 2700,
      },
      {
        organ: 'Ψ',
        label: 'Auto-Check',
        detail: isSec ? '✗ Security check failed' : '✗ Consistency check failed',
        badge: isSec ? 'Ψ SEC ✗' : 'Ψ ECS ✗',
        isNegative: true,
        duration: 1500,
      },
      {
        organ: 'Μ',
        label: 'Trace:fresh',
        detail: `Recorded: ${drift.label}`,
        isNegative: true,
        duration: 1350,
      },
    ],
    source: 'live',
  }
}

/** Generate an axiom guard scenario from an AXIOME node */
function generateAxiomScenario(
  axiom: JsonNode,
  nodes: JsonNode[],
  edges: GraphData['edges'],
): Scenario {
  // Find what this axiom GUARDS
  const guardedTargets = findTargets(nodes, edges, axiom.id, 'GUARDS')
  const guardLabel = guardedTargets.length > 0 ? guardedTargets[0].label : 'core constraint'
  const tools = getToolCalls(nodes, edges, axiom.id)

  return {
    id: `live-axiom-${axiom.id}`,
    title: `Live: ${axiom.label}`,
    selectorLabel: `🛡 ${axiom.label.substring(0, 12)}`,
    subtitle: `Guard: ${guardLabel.substring(0, 30)}`,
    route: 'L3',
    color: ROUTE_COLORS.L3,
    steps: [
      {
        organ: 'Σ',
        label: 'Input reçu',
        detail: `Attempting to bypass: ${guardLabel.substring(0, 40)}`,
        badge: 'ECS: C=4, I=2 → L3',
        ecsRoute: { c: 4, i: 2, level: 'L3' },
        duration: 2100,
      },
      {
        organ: 'Ψ',
        label: 'Verification',
        detail: `Checking against sys:core`,
        duration: 1800,
      },
      {
        organ: 'Φ',
        label: 'Precedent Search',
        detail: `Locating axiom boundary`,
        toolCalls: tools.length > 0 ? tools : ['search_memory()', 'search_code()'],
        duration: 2400,
      },
      {
        organ: 'Ψ',
        label: 'Axiom Match',
        detail: `Axiom ${axiom.label} applies`,
        badge: 'Ψ SEC ✓',
        duration: 1500,
      },
      {
        organ: 'Ω',
        label: 'Gate Blocked',
        detail: `Violates ${axiom.label}`,
        confidence: axiom.outcome ?? 99,
        duration: 1800,
      },
      {
        organ: 'Μ',
        label: 'Recorded',
        detail: `Guard condition enforced: ${axiom.label.substring(0, 30)}`,
        duration: 1200,
      },
    ],
    source: 'live',
  }
}

/** Generate a pattern crystallization scenario from a PATTERN node */
function generatePatternScenario(
  pattern: JsonNode,
  nodes: JsonNode[],
  edges: GraphData['edges'],
): Scenario {
  const tools = getToolCalls(nodes, edges, pattern.id)
  const labelPrefix = pattern.label.split(':')[0]?.trim() ?? 'Pattern'
  const isCandidate = pattern.label.startsWith('CANDIDATE')
  const isProposal = pattern.label.startsWith('PROPOSAL')

  return {
    id: `live-pattern-${pattern.id}`,
    title: `Live: ${labelPrefix}`,
    selectorLabel: `✦ ${labelPrefix.substring(0, 12)}`,
    subtitle: `${isCandidate ? 'Candidate' : isProposal ? 'Proposal' : 'Pattern'} adoption cycle`,
    route: isCandidate ? 'L2' : 'L2',
    color: ROUTE_COLORS.L2,
    steps: [
      {
        organ: 'Σ',
        label: 'Usage Detected',
        detail: `Frequent usage pattern identified`,
        badge: 'ECS: C=3, I=2 → L2',
        ecsRoute: { c: 3, i: 2, level: 'L2' },
        duration: 1800,
      },
      {
        organ: 'Ψ',
        label: 'Evaluation',
        detail: `Assessing: ${pattern.label.substring(0, 40)}`,
        duration: 1800,
      },
      {
        organ: 'Φ',
        label: 'Validation',
        detail: 'Checking genericness & reliability',
        toolCalls: tools.length > 0 ? tools : ['search_memory()'],
        duration: 2400,
      },
      {
        organ: 'Ω',
        label: isCandidate ? 'Promote to Pattern' : 'Crystallization',
        detail: `Approved for ${isCandidate ? 'promotion' : 'permanent storage'}`,
        confidence: pattern.outcome ?? 80,
        duration: 1800,
      },
      {
        organ: 'Μ',
        label: 'Stored',
        detail: pattern.label.substring(0, 40),
        duration: 1350,
      },
    ],
    source: 'live',
  }
}

// ─── Main Hook ───

export function useSignalSimulation(graphData: GraphData | null, demoScenarios: Scenario[]) {
  const liveScenarios: Scenario[] = []

    if (!graphData?.nodes || !graphData.edges) {
    return { demoScenarios, liveScenarios, allScenarios: demoScenarios }
    }

    const { nodes, edges } = graphData

    // ─── 1. Mutation Workflows ───
    // Pick the most interesting mutations: ROLLED_BACK first (story of failure + recovery),
    // then REJECTED, then most recent APPLIED with high centrality
    const rolledBack = nodes.filter(n => n.type === 'MUTATION' && n.status === 'ROLLED_BACK')
    const rejected = nodes.filter(n => n.type === 'MUTATION' && n.status === 'REJECTED')
    const applied = nodes.filter(n => n.type === 'MUTATION' && n.status === 'APPLIED')
      .sort((a, b) => b.centrality - a.centrality)

    // Rolled-back mutation → look for its surgical replacement
    if (rolledBack.length > 0) {
      const rb = rolledBack[0]
      // Find a mutation that might be the replacement (similar label, APPLIED)
      const replacement = applied.find(a =>
        a.label.includes(rb.label.split('-').slice(0, 2).join('-')) ||
        rb.label.includes(a.label.split('-').slice(0, 2).join('-'))
      )
      liveScenarios.push(generateMutationScenario(rb, nodes, edges, replacement))
    }

    // Rejected mutation
    if (rejected.length > 0) {
      liveScenarios.push(generateMutationScenario(rejected[0], nodes, edges))
    }

    // One interesting APPLIED mutation
    if (applied.length > 0 && liveScenarios.length < 3) {
      // Pick one with the highest centrality that isn't already featured
      const featured = new Set(liveScenarios.map(s => s.id))
      const topApplied = applied.find(a => !featured.has(`live-mut-${a.id}`))
      if (topApplied) {
        liveScenarios.push(generateMutationScenario(topApplied, nodes, edges))
      }
    }

    // ─── 2. Trace Friction (L3) ───
    // Find DRIFT nodes with sec or ecs tags
    const frictionDrifts = nodes.filter(n =>
      n.type === 'DRIFT' &&
      n.tags.some(t => t === 'sec' || t === 'ecs')
    )
    if (frictionDrifts.length > 0) {
      liveScenarios.push(generateFrictionScenario(frictionDrifts[0], nodes, edges))
    }

    // ─── 3. Axiom Guard (L3) ───
    // Pick an AXIOME that has GUARDS edges or high centrality
    const axiomes = nodes
      .filter(n => n.type === 'AXIOME')
      .sort((a, b) => b.centrality - a.centrality)
    if (axiomes.length > 0) {
      const hasGuards = axiomes.find(a => edges.some(e => e.source === a.id && e.type === 'GUARDS'))
      liveScenarios.push(generateAxiomScenario(hasGuards ?? axiomes[0], nodes, edges))
    }

    // ─── 4. Pattern Crystallization (L2) ───
    // Pick a PATTERN or CANDIDATE node parented to Μ
    const patternNodes = nodes.filter(n =>
      (n.type === 'PATTERN') &&
      n.parent_organ === 'Μ'
    ).sort((a, b) => b.centrality - a.centrality)

    if (patternNodes.length > 0) {
      // Prefer CANDIDATE/PROPOSAL patterns (more interesting lifecycle)
      const candidate = patternNodes.find(p => p.label.startsWith('CANDIDATE') || p.label.startsWith('PROPOSAL'))
      liveScenarios.push(generatePatternScenario(candidate ?? patternNodes[0], nodes, edges))
    }

    // Cap at 5 live scenarios
    const cappedLive = liveScenarios.slice(0, 5)
    const allScenarios = [...demoScenarios, ...cappedLive]

  return { demoScenarios, liveScenarios: cappedLive, allScenarios }
}
