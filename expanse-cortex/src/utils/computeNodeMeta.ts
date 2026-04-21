// ─── COMPUTE NODE META — unified computation of data-driven properties ───
// Every view that converts JsonNode → RenderNode calls the same triple:
//   computeMatterState, computeCurtain, computeNature.
// This function unifies them into a single call, reducing duplication
// and ensuring the three properties are always computed together.

import type { MatterState, Curtain, MemoryNature } from '../types/expanse'
import { computeMatterState, computeCurtain } from './matterState'
import { computeNature } from './computeNature'

/** Computed data-driven properties shared by all node render types. */
export interface NodeMeta {
  matterState: MatterState
  curtain: Curtain
  nature: MemoryNature
}

/**
 * Compute all data-driven properties for a node in a single call.
 * Accepts any object with { type, tags, nature?, status? } —
 * compatible with JsonNode, SimNode, and partial node objects.
 */
export function computeNodeMeta(node: {
  type: string
  tags: string[]
  nature?: string
  status?: string | null
}): NodeMeta {
  return {
    matterState: computeMatterState(node),
    curtain: computeCurtain(node),
    nature: computeNature(node),
  }
}
