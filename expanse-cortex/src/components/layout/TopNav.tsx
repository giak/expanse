import type { Route } from '../../hooks/useHashRouter'

const NAV_ITEMS: { route: Route; label: string; icon: string }[] = [
  { route: 'signal', label: 'Signal', icon: '⚡' },
  { route: 'heart', label: 'Cœur', icon: '🫀' },
  { route: 'timeline', label: 'Timeline', icon: '◷' },
  { route: 'memory', label: 'Mémoire', icon: '🧬' },
  { route: 'layered', label: 'Couches', icon: '▦' },
  { route: 'organic', label: 'Organique', icon: '⊛' },
  { route: 'pipeline', label: 'Pipeline', icon: '⟶' },
  { route: 'dashboard', label: 'Données', icon: '▥' },
]

interface TopNavProps {
  route: Route
  navigate: (r: Route) => void
}

export function TopNav({ route, navigate }: TopNavProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-mantle/90 backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5">
      {NAV_ITEMS.map(item => (
        <button
          key={item.route}
          onClick={() => navigate(item.route)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            route === item.route
              ? 'bg-blue/20 text-blue border border-blue/30'
              : 'text-overlay0 hover:text-fg hover:bg-white/5'
          }`}
        >
          <span className="mr-1.5">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  )
}
