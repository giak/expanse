import type { JsonNode, MemoryNature } from '../types/expanse'

/**
 * Default nature by node type (from epic §5.1).
 * Used as fallback when node.nature is absent or empty.
 */
const TYPE_DEFAULT_NATURE: Record<string, MemoryNature> = {
  ORGAN: 'permanent',
  APEX: 'permanent',
  AXIOME: 'permanent',
  FICHIER: 'permanent',
  REGLE: 'vivide',
  PROTOCOLE: 'vivide',
  COMMANDE: 'vivide',
  OUTIL: 'vivide',
  PATTERN: 'vivide',
  EXTENSION: 'volatile',
  SUBSTRAT: 'vivide',
  MUTATION: 'vivide',   // overridden by status below
  DRIFT: 'incandescent',
  MEMOIRE: 'vivide',
}

/**
 * Compute the Mnemolite nature of a node.
 * Priority:
 *   1. node.nature (v5 JSON field — authoritative)
 *   2. Tag-based heuristic (for v3/v4 JSON without nature field)
 *   3. Type-based default
 */
export function computeNature(node: {
  type: string
  tags: string[]
  nature?: string
  status?: string | null
}): MemoryNature {
  // 1. Authoritative v5 field
  if (node.nature && isMemoryNature(node.nature)) {
    return node.nature
  }

  const t = node.tags

  // 2. Tag-based heuristic
  // Incandescent: drift, friction signals
  if (t.includes('trace:fresh') || t.includes('sys:drift') || t.includes('incandescent')) return 'incandescent'
  // Volatile: candidates, proposals, extensions
  if (t.includes('sys:pattern:candidate') || t.includes('candidate') || t.includes('proposal')) return 'volatile'
  if (t.includes('sys:extension') || t.includes('extension')) return 'volatile'
  // Permanent: sealed, anchored, core
  if (t.includes('scelle') || t.includes('sys:anchor') || t.includes('sys:core')) return 'permanent'

  // Mutation status overrides
  if (node.type === 'MUTATION') {
    if (node.status === 'rejected') return 'incandescent'
    if (node.status === 'rolled_back') return 'volatile'
  }

  // 3. Type-based default
  return TYPE_DEFAULT_NATURE[node.type] ?? 'vivide'
}

/**
 * Build a nature map for all nodes in a graph.
 * Shared utility used by TimelineView and MemoryEcosystemView.
 */
export function computeNatureMap(nodes: readonly JsonNode[]): Map<string, MemoryNature> {
  const map = new Map<string, MemoryNature>()
  for (const node of nodes) {
    map.set(node.id, computeNature(node))
  }
  return map
}

function isMemoryNature(value: string): value is MemoryNature {
  return value === 'permanent' || value === 'vivide' || value === 'volatile' || value === 'incandescent'
}
