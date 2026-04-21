// ─── Reset View Button ───
// Shared reset button for SVG zoom/pan views.
// Appears only when the view is zoomed/panned away from home position.

interface ResetViewButtonProps {
  isZoomed: boolean
  resetView: () => void
}

export function ResetViewButton({ isZoomed, resetView }: ResetViewButtonProps) {
  if (!isZoomed) return null

  return (
    <button
      onClick={resetView}
      className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-mantle/90 backdrop-blur-md border border-white/10 text-fg text-xs font-medium hover:bg-base hover:border-blue/30 transition-all duration-200 cursor-pointer"
    >
      <span className="text-blue">⌂</span>
      <span>Reset</span>
      <span className="text-overlay0 text-[10px]">Esc</span>
    </button>
  )
}
