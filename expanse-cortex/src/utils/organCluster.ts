/**
 * Organ cluster computation helpers for the Cognitive Heart view.
 * Extracted from CognitiveHeartView for reuse and testability.
 */

import { ORGAN_ORDER } from '../constants/theme'
import { ANATOMICAL_CLUSTER } from '../constants/schema'

// ── Focus target for zoom-to-feature ──

export type FocusTarget =
  | { kind: 'organ'; symbol: string }
  | { kind: 'mutation'; id: string; label: string }
  | { kind: 'drift'; id: string; label: string }
  | { kind: 'cluster'; id: string; label: string; nodeType: string }

/**
 * Compute the bounding cluster for each organ symbol.
 * Each organ's cluster includes the organ node itself plus all
 * anatomical cluster child types whose parentOrgan matches the symbol.
 * APEX nodes are added as a separate cluster.
 */
export function computeOrganClusterBounds<T extends { type: string; label: string }>(
  nodes: readonly T[],
): Map<string, T[]> {
  const bounds = new Map<string, T[]>()
  ORGAN_ORDER.forEach((symbol: string) => {
    const organNode = nodes.find(n => n.type === 'ORGAN' && n.label.charAt(0) === symbol)
    if (!organNode) return
    const clusterNodes = [organNode]
    Object.entries(ANATOMICAL_CLUSTER).forEach(([type, config]) => {
      if (config.parentOrgan === symbol) {
        nodes.filter(n => n.type === type).forEach(n => clusterNodes.push(n))
      }
    })
    bounds.set(symbol, clusterNodes)
  })
  const apexNodes = nodes.filter(n => n.type === 'APEX')
  if (apexNodes.length > 0) bounds.set('APEX', apexNodes)
  return bounds
}

/**
 * Resolve which organ symbol should be highlighted based on the current focus target.
 * Returns null if no organ should be highlighted.
 */
export function resolveHighlightedOrgan<T extends { id: string; type: string }>(
  focusTarget: FocusTarget | null,
  nodes: readonly T[],
): string | null {
  if (!focusTarget) return null
  if (focusTarget.kind === 'organ') return focusTarget.symbol
  if (focusTarget.kind === 'cluster') {
    const node = nodes.find(n => n.id === focusTarget.id)
    if (!node) return null
    const clusterConfig = ANATOMICAL_CLUSTER[node.type]
    if (!clusterConfig || clusterConfig.parentOrgan.startsWith('__')) return null
    return clusterConfig.parentOrgan
  }
  return null
}
