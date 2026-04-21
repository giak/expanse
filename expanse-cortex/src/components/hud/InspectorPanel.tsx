import { useSelectedNode } from '../../context/GraphContext'
import { NATURE_COLORS } from '../../constants/theme'
import type { MemoryNature } from '../../types/expanse'

export function InspectorPanel() {
  const [selectedNode, setSelectedNode] = useSelectedNode()

  if (!selectedNode) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-10 hud min-w-[320px] max-w-[400px] max-h-[40vh] overflow-auto"
      onClick={e => e.stopPropagation()}
    >
      <h3 className="text-mauve text-sm font-semibold mb-3">{selectedNode.label}</h3>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between">
          <span className="hud-label">Type</span>
          <span className="hud-value uppercase">{selectedNode.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="hud-label">Nature</span>
          <span className="hud-value uppercase" style={{ color: NATURE_COLORS[selectedNode.nature as MemoryNature] ?? 'var(--color-fg)' }}>
            {selectedNode.nature}
          </span>
        </div>
        {selectedNode.status && (
          <div className="flex justify-between">
            <span className="hud-label">Status</span>
            <span className={`text-xs uppercase ${selectedNode.status === 'applied' ? 'text-green' : selectedNode.status === 'rejected' ? 'text-red' : selectedNode.status === 'rolled_back' ? 'text-peach' : 'text-fg'}`}>
              {selectedNode.status}
            </span>
          </div>
        )}
        {selectedNode.parent_organ && (
          <div className="flex justify-between">
            <span className="hud-label">Organe</span>
            <span className="hud-value">{selectedNode.parent_organ}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="hud-label">ID</span>
          <span className="hud-value font-mono">{selectedNode.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="hud-label">Centralité</span>
          <span className="hud-value">{selectedNode.centrality}</span>
        </div>
        {selectedNode.outcome !== null && selectedNode.outcome !== undefined && (
          <div className="flex justify-between">
            <span className="hud-label">Outcome</span>
            <span className={`text-xs ${(selectedNode.outcome ?? 0) >= 0.7 ? 'text-green' : (selectedNode.outcome ?? 0) >= 0.4 ? 'text-yellow' : 'text-red'}`}>
              {(selectedNode.outcome * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {selectedNode.tags.length > 0 && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {selectedNode.tags.map(tag => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
      )}

      {selectedNode.content && (
        <div className="mt-2 pt-2 border-t border-white/10">
          <p className="text-xs text-fg leading-relaxed opacity-90">{selectedNode.content}</p>
        </div>
      )}

      {selectedNode.created_at && (
        <div className="mt-2 pt-2 border-t border-white/10">
          <span className="hud-label">Créé le: {new Date(selectedNode.created_at).toLocaleString()}</span>
        </div>
      )}

      <button
        onClick={() => setSelectedNode(null)}
        className="mt-3 w-full text-center text-[10px] hud-label hover:text-fg transition-colors"
      >
        fermer ✕
      </button>
    </div>
  )
}
