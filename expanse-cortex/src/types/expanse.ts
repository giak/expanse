// ─── SCHEMA v5.0 — Interfaces matching the JSON contract exactly ───

export interface JsonNode {
  id: string
  type: string
  label: string
  content: string
  tags: string[]
  created_at: string
  centrality: number
  // v5 extended fields
  nature: string
  status: string | null
  parent_organ: string | null
  sort_key: number
  outcome: number | null
}

export interface JsonEdge {
  source: string
  target: string
  type: string
  weight: number
  // v5 extended fields
  condition: string | null
}

export interface GraphMeta {
  count_nodes: number
  count_edges: number
  density: number | string
  deduplicated?: number
  mnemolite_timestamp?: string
  // v5 extended fields
  mnemolite_online?: boolean
  drift_structural?: number
  drift_live?: number
  axiom_count?: number
  pattern_count?: number
  candidate_count?: number
  doubt_count?: number
  extension_count?: number
  substrat_count?: number
  profile?: Record<string, unknown>
  diff?: Record<string, unknown>
  types?: Record<string, number>
  natures?: Record<string, number>
  edge_types?: Record<string, number>
}

export interface GraphData {
  version: number
  generated_at: string
  meta: GraphMeta
  nodes: JsonNode[]
  edges: JsonEdge[]
}

// ─── Frontend-only computed render state (NOT in JSON) ───

export type MemoryNature = 'permanent' | 'vivide' | 'volatile' | 'incandescent'
export type MatterState = 'vapeur' | 'liquide' | 'cristal'
export type Curtain = 'core' | 'heuristic' | 'candidate' | null

export interface RenderNode extends JsonNode {
  x: number
  y: number
  color: string
  radius: number
  matterState: MatterState
  curtain: Curtain
  nature: MemoryNature   // narrows JsonNode.nature (string) to the 4 valid values — computeNature guarantees a fallback to 'vivide'
}

export interface SimNode extends JsonNode {
  x: number
  y: number
  color: string
  radius: number
  index?: number
  vx?: number
  vy?: number
  fx?: number
  fy?: number
}

export interface SimLink {
  source: number | SimNode
  target: number | SimNode
  weight: number
  type: string
}
