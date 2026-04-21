import { useAtomGraphData } from '../../context/GraphContext'

export function MetricsPanel() {
  const { data } = useAtomGraphData()
  return (
    <div className="fixed top-6 right-6 z-10 hud min-w-[220px]">
      <h2 className="hud-heading mb-3">MÉTRIQUES</h2>
      <div className="flex justify-between py-1">
        <span className="hud-label">Noeuds</span>
        <span className="hud-value">{data?.meta.count_nodes ?? '-'}</span>
      </div>
      <div className="flex justify-between py-1">
        <span className="hud-label">Liens</span>
        <span className="hud-value">{data?.meta.count_edges ?? '-'}</span>
      </div>
      <div className="flex justify-between py-1">
        <span className="hud-label">Densité</span>
        <span className="hud-value">{data?.meta.density ?? '-'}</span>
      </div>
    </div>
  )
}
