import { LEGEND_ENTRIES, EDGE_COLORS, NATURE_LEGEND } from '../../constants/theme'

export function LegendPanel() {
  return (
    <div className="fixed bottom-6 left-6 z-10 hud min-w-[280px]">
      <h2 className="hud-heading mb-3">LÉGENDE</h2>
      {LEGEND_ENTRIES.map(entry => (
        <div key={entry.type} className="flex justify-between py-1">
          <span className="hud-label">
            <span style={{ color: entry.color }}>●</span> {entry.label}
          </span>
          <span className="hud-value">{entry.desc}</span>
        </div>
      ))}
      <div className="mt-2 pt-2 border-t border-white/10">
        <h3 className="hud-label text-[10px] uppercase tracking-wider mb-1">Natures</h3>
        {NATURE_LEGEND.map(entry => (
          <div key={entry.nature} className="flex justify-between py-0.5">
            <span className="hud-label">
              <span style={{ color: entry.color }}>{entry.icon}</span> {entry.label}
            </span>
            <span className="hud-value">{entry.desc}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-white/10">
        <h3 className="hud-label text-[10px] uppercase tracking-wider mb-1">Liens</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
          {Object.entries(EDGE_COLORS).map(([type, color]) => (
            <span key={type} className="text-overlay0 text-[10px]">
              <span style={{ color }}>—</span> {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
