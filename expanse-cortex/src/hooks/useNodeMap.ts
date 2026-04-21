import type { RenderNode } from '../types/expanse'

export function useNodeMap(nodes: RenderNode[]) {
  const nodeMap = new Map<string, RenderNode>()
  nodes.forEach(n => nodeMap.set(n.id, n))

  const getNode = (id: string) => nodeMap.get(id)

  return { nodeMap, getNode }
}
