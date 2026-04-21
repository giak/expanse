import { useState, useRef } from 'react'
import { useAtomGraphData } from '../context/GraphContext'
import { NODE_COLORS, EDGE_COLORS } from '../constants/theme'
import { useExportHTML, ExportButton } from '../components/svg/ExportPNG'

type Tab = 'nodes' | 'edges' | 'mutations' | 'patterns' | 'axiomes' | 'fichiers' | 'extensions' | 'substrats'

// ── Pure computation helpers (module-level, side-effect-free) ──

function computeTypeCounts(nodes: readonly { type: string }[]): Record<string, number> {
  const counts: Record<string, number> = {}
  nodes.forEach(n => { counts[n.type] = (counts[n.type] || 0) + 1 })
  return counts
}

export function DashboardView() {
  const { data } = useAtomGraphData()
  const [tab, setTab] = useState<Tab>('nodes')
  const [filter, setFilter] = useState('')
  const htmlRef = useRef<HTMLDivElement>(null)
  const { exportPNG } = useExportHTML({ htmlRef, filename: 'expanse-dashboard' })

  const tabs: { key: Tab; label: string; type?: string }[] = [
    { key: 'nodes', label: 'Noeuds' },
    { key: 'edges', label: 'Liens' },
    { key: 'mutations', label: 'Mutations', type: 'MUTATION' },
    { key: 'patterns', label: 'Patterns', type: 'PATTERN' },
    { key: 'axiomes', label: 'Axiomes', type: 'AXIOME' },
    { key: 'fichiers', label: 'Fichiers', type: 'FICHIER' },
    { key: 'extensions', label: 'Extensions', type: 'EXTENSION' },
    { key: 'substrats', label: 'Substrats', type: 'SUBSTRAT' },
  ]

  // React Compiler auto-memoizes pure computations
  const typeCounts = data ? computeTypeCounts(data.nodes) : {}

  if (!data) return <div className="text-overlay0 text-center mt-20">Chargement...</div>

  const activeTab = tabs.find(t => t.key === tab)
  const filteredNodes = data.nodes
    .filter(n => activeTab?.type ? n.type === activeTab.type : tab !== 'edges')
    .filter(n => filter === '' || n.label.toLowerCase().includes(filter.toLowerCase()) || n.type.toLowerCase().includes(filter.toLowerCase()))

  const filteredEdges = data.edges
    .filter(e => filter === '' || e.type.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="w-full h-full relative">
      <ExportButton onClick={exportPNG} />
      <div ref={htmlRef} className="w-full h-full overflow-auto p-6 pt-16">
        {/* Tab bar */}
        <div className="flex gap-2 mb-4">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setFilter('') }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                tab === t.key
                  ? 'bg-blue/20 text-blue border border-blue/30'
                  : 'text-overlay0 hover:text-fg hover:bg-white/5 border border-transparent'
              }`}
            >
              {t.label}
              <span className="ml-2 text-[10px] opacity-60">
                {t.key === 'nodes' ? data.nodes.length
                  : t.key === 'edges' ? data.edges.length
                  : t.type ? (typeCounts[t.type] || 0)
                  : 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filtrer par nom ou type..."
          className="w-full max-w-md mb-4 px-3 py-2 bg-mantle border border-white/10 rounded-lg text-fg text-xs placeholder:text-overlay0 focus:outline-none focus:border-blue/40"
        />

        {/* Nodes table */}
        {(tab === 'nodes' || tab === 'mutations' || tab === 'patterns') && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 px-3 text-[10px] text-overlay0 uppercase tracking-wider">Type</th>
                  <th className="py-2 px-3 text-[10px] text-overlay0 uppercase tracking-wider">Label</th>
                  <th className="py-2 px-3 text-[10px] text-overlay0 uppercase tracking-wider">Content</th>
                  <th className="py-2 px-3 text-[10px] text-overlay0 uppercase tracking-wider">Centrality</th>
                  <th className="py-2 px-3 text-[10px] text-overlay0 uppercase tracking-wider">Tags</th>
                </tr>
              </thead>
              <tbody>
                {filteredNodes.map(node => (
                  <tr key={node.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: NODE_COLORS[node.type] ?? 'var(--color-overlay0)' }} />
                        <span className="text-fg">{node.type}</span>
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs text-fg font-medium">{node.label}</td>
                    <td className="py-2 px-3 text-xs text-overlay2 max-w-[300px] truncate">{node.content}</td>
                    <td className="py-2 px-3 text-xs text-fg font-mono">{node.centrality}</td>
                    <td className="py-2 px-3">
                      <div className="flex gap-1 flex-wrap">
                        {node.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="bg-white/5 text-blue px-1.5 py-0.5 rounded text-[10px]">{tag}</span>
                        ))}
                        {node.tags.length > 3 && <span className="text-overlay0 text-[10px]">+{node.tags.length - 3}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 text-[10px] text-overlay0">{filteredNodes.length} résultats</div>
          </div>
        )}

        {/* Edges table */}
        {tab === 'edges' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 px-3 text-[10px] text-overlay0 uppercase tracking-wider">Source</th>
                  <th className="py-2 px-3 text-[10px] text-overlay0 uppercase tracking-wider">→</th>
                  <th className="py-2 px-3 text-[10px] text-overlay0 uppercase tracking-wider">Target</th>
                  <th className="py-2 px-3 text-[10px] text-overlay0 uppercase tracking-wider">Type</th>
                  <th className="py-2 px-3 text-[10px] text-overlay0 uppercase tracking-wider">Weight</th>
                </tr>
              </thead>
              <tbody>
                {filteredEdges.map((edge, idx) => {
                  const sourceNode = data.nodes.find(n => n.id === edge.source)
                  const targetNode = data.nodes.find(n => n.id === edge.target)
                  return (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-2 px-3 text-xs text-fg">{sourceNode?.label ?? edge.source}</td>
                      <td className="py-2 px-3 text-xs" style={{ color: EDGE_COLORS[edge.type] ?? 'var(--color-overlay0)' }}>→</td>
                      <td className="py-2 px-3 text-xs text-fg">{targetNode?.label ?? edge.target}</td>
                      <td className="py-2 px-3">
                        <span className="text-xs" style={{ color: EDGE_COLORS[edge.type] ?? 'var(--color-overlay0)' }}>{edge.type}</span>
                      </td>
                      <td className="py-2 px-3 text-xs text-fg font-mono">{edge.weight.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="mt-2 text-[10px] text-overlay0">{filteredEdges.length} résultats</div>
          </div>
        )}
      </div>
    </div>
  )
}
