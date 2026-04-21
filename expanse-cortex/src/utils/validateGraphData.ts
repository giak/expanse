// ══════════════════════════════════════════════════════════════
// VALIDATE GRAPH DATA — runtime validation for JSON from Mnemolite
// ══════════════════════════════════════════════════════════════
// Mnemolite data is untyped JSON. This validator uses the sealed
// type guards (isOrgan, isECSLevel) to catch invalid values early,
// emitting warnings instead of crashing.

import type { GraphData, JsonNode } from '../types/expanse'
import { isOrgan } from '../types/signal'

/** Validation result: data always present (best-effort), warnings for invalid fields */
export interface ValidationResult {
  data: GraphData
  warnings: string[]
}

/** Validate graph data from untrusted JSON source.
 *  Returns the data (cast to GraphData) plus warnings for any invalid fields.
 *  Never throws — invalid fields are logged as warnings, not errors.
 *  Note: isECSLevel is available for future ECS validation but not currently needed
 *  since ecsRoute levels come from demo scenarios (compile-time checked), not JSON. */
export function validateGraphData(raw: unknown): ValidationResult {
  const warnings: string[] = []

  if (!raw || typeof raw !== 'object') {
    warnings.push('Root must be an object, got: ' + typeof raw)
    return { data: raw as GraphData, warnings }
  }

  const root = raw as Record<string, unknown>

  // ── Validate nodes ──
  const nodes = Array.isArray(root.nodes) ? root.nodes as JsonNode[] : []
  for (const node of nodes) {
    if (!node.id) {
      warnings.push(`Node missing id: ${JSON.stringify(node).substring(0, 60)}`)
      continue
    }
    if (!node.type) {
      warnings.push(`Node ${node.id} missing type`)
    }
    if (node.parent_organ && !isOrgan(node.parent_organ)) {
      warnings.push(`Node ${node.id} has invalid parent_organ: "${node.parent_organ}" — expected one of Σ,Ψ,Φ,Ω,Μ`)
    }
  }

  // ── Validate edges ──
  const edges = Array.isArray(root.edges) ? root.edges : []
  for (const edge of edges as Array<Record<string, unknown>>) {
    if (!edge.source) {
      warnings.push(`Edge missing source: ${JSON.stringify(edge).substring(0, 60)}`)
    }
    if (!edge.target) {
      warnings.push(`Edge missing target: ${JSON.stringify(edge).substring(0, 60)}`)
    }
  }

  // ── Validate meta ──
  if (root.meta && typeof root.meta === 'object') {
    const meta = root.meta as Record<string, unknown>
    if (meta.density !== undefined && typeof meta.density !== 'number' && typeof meta.density !== 'string') {
      warnings.push(`Meta density has unexpected type: ${typeof meta.density}`)
    }
  }

  return { data: raw as GraphData, warnings }
}

/** Format warnings for console output */
export function formatWarnings(warnings: string[]): string {
  if (warnings.length === 0) return '✓ Graph data valid — no warnings'
  return warnings.map((w, i) => `  ${i + 1}. ${w}`).join('\n')
}
