import type { MatterState, Curtain } from '../types/expanse'

/**
 * Compute the ontological state of a node from its tags and type.
 * Cristal = sealed/anchored/structural, Liquide = active/flowing, Vapeur = ghostly/unstable.
 */
export function computeMatterState(node: { type: string; tags: string[] }): MatterState {
  const t = node.tags
  // Cristal: sealed, anchored, core, structural
  if (t.includes('scelle') || t.includes('sys:anchor') || t.includes('sys:core')) return 'cristal'
  if (node.type === 'ORGAN' || node.type === 'APEX') return 'cristal'
  // Vapeur: proposals, candidates, extensions, rejected, rolled_back
  if (t.includes('proposal') || t.includes('candidate') || t.includes('extension')) return 'vapeur'
  if (t.includes('rejected') || t.includes('rolled_back')) return 'vapeur'
  // Liquide: everything else active
  return 'liquide'
}

/**
 * Compute the structural nature (curtain) of a node from its tags and type.
 * CORE = monolithic, HEURISTIC = fabric, CANDIDATE = glitching.
 * Priority: CORE > HEURISTIC > CANDIDATE.
 */
export function computeCurtain(node: { type: string; tags: string[] }): Curtain {
  const t = node.tags
  if (t.includes('sys:core') || t.includes('sys:anchor')) return 'core'
  if (t.includes('heuristic') || node.type === 'PROTOCOLE' || node.type === 'OUTIL') return 'heuristic'
  if (t.includes('proposal') || t.includes('candidate')) return 'candidate'
  return null
}
