import { Component, type ReactNode, type ErrorInfo } from 'react'
import { useHashRouter } from '../../hooks/useHashRouter'
import { logger } from '../../utils/logger'

// ══════════════════════════════════════════════════════════════
// CUSTOM ERROR BOUNDARY — replaces react-error-boundary (YAGNI)
// ══════════════════════════════════════════════════════════════

interface ErrorBoundaryProps {
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  children: ReactNode
  resetKeys?: unknown[]
  onError?: (error: Error, info: ErrorInfo) => void
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/** Minimal ErrorBoundary class component — same API as react-error-boundary.
 *  Supports fallback function pattern (error+reset → JSX),
 *  resetKeys for auto-reset on prop change, and onError/onReset callbacks. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Auto-reset when resetKeys elements change (shallow element comparison,
    // not reference equality — avoids infinite loop since resetKeys={[val]} creates new array each render)
    if (this.state.hasError && !shallowEqualArrays(this.props.resetKeys, prevProps.resetKeys)) {
      this.reset()
    }
  }

  reset = () => {
    this.props.onReset?.()
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children
    if (typeof this.props.fallback === 'function' && this.state.error) {
      return this.props.fallback(this.state.error, this.reset)
    }
    // fallback is a ReactNode (not a function) or undefined → return it or null
    return (this.props.fallback as ReactNode | undefined) ?? null
  }
}

/** Shallow-equal comparison for resetKeys arrays — avoids infinite reset loop
 *  since resetKeys={[val]} creates a new array reference every render. */
function shallowEqualArrays(a?: unknown[], b?: unknown[]): boolean {
  if (a === b) return true
  if (!a || !b || a.length !== b.length) return false
  return a.every((v, i) => Object.is(v, b[i]))
}

/** Fallback props type — matches react-error-boundary's FallbackProps for compat */
export interface FallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

// ══════════════════════════════════════════════════════════════
// ERROR BOUNDARIES — Cascade Failure Principle
// ══════════════════════════════════════════════════════════════
// Une erreur dans un sous-système ne doit jamais propager à un
// sur-système. Chaque couche a son propre bouclier.
//
// Architecture:
//   App
//   └─ ViewErrorBoundary (1 per view)
//      └─ EffectErrorBoundary (1 per SVG effect — null fallback)
//   └─ SidebarErrorBoundary (StepSidebar + DidacticPanel)

// ── ViewErrorBoundary fallback ──
function ViewCrashRecovery({ error, resetErrorBoundary }: FallbackProps) {
  const { navigate } = useHashRouter()
  const message = error instanceof Error ? error.message : 'Erreur inattendue'

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-app-bg">
      {/* Logo */}
      <div className="text-2xl font-mono font-bold text-overlay0 mb-4 tracking-widest">
        Σ→Ψ⇌Φ→Ω→Μ
      </div>

      {/* Error message */}
      <div className="text-sm font-mono text-red mb-2">
        Vue indisponible
      </div>
      <div className="text-xs font-mono text-surface2 mb-6 max-w-md text-center">
        {message}
      </div>

      {/* Recovery buttons */}
      <div className="flex gap-3">
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 rounded-md bg-mantle border border-white/10 text-fg text-xs font-mono
            hover:bg-base hover:border-blue/30 transition-all duration-200 cursor-pointer"
        >
          Réessayer
        </button>
        <button
          onClick={() => { resetErrorBoundary(); navigate('heart') }}
          className="px-4 py-2 rounded-md bg-mantle border border-blue/20 text-blue text-xs font-mono
            hover:bg-blue/10 hover:border-blue/40 transition-all duration-200 cursor-pointer"
        >
          Retour au Cœur
        </button>
      </div>
    </div>
  )
}

// ── SidebarErrorBoundary fallback ──
function SidebarCrashFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex-1 min-w-[24rem] border-l border-white/[0.06] bg-crust/95 backdrop-blur-md
      flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-xs font-mono text-surface2 mb-3">
          Section temporairement indisponible
        </div>
        <button
          onClick={resetErrorBoundary}
          className="px-3 py-1.5 rounded-md bg-mantle border border-white/10 text-overlay0 text-xs font-mono
            hover:bg-base hover:text-fg transition-all duration-200 cursor-pointer"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// EXPORTS — Composants ErrorBoundary pré-configurés
// ══════════════════════════════════════════════════════════════

/** Error Boundary pour une vue entière (heart, signal, etc.).
 *  Fallback : écran Catppuccin avec logo + bouton « Retour au Cœur ». */
export function ViewErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => <ViewCrashRecovery error={error} resetErrorBoundary={reset} />}
      onReset={() => { /* View re-renders from scratch */ }}
    >
      {children}
    </ErrorBoundary>
  )
}

/** Error Boundary pour un effet visuel SVG.
 *  Fallback : null (l'effet disparaît silencieusement, le canvas continue). */
export function EffectErrorBoundary({
  children,
  effectKey,
}: {
  children: React.ReactNode
  /** Unique key for this effect — used as resetKeys so the boundary
   *  resets when the effect changes (new step = new chance). */
  effectKey?: string
}) {
  return (
    <ErrorBoundary
      fallback={null}
      resetKeys={[effectKey]}
      onError={(error) => {
        const msg = error instanceof Error ? error.message : String(error)
        logger.warn(`Effect crashed (${effectKey ?? 'unknown'}):`, msg)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

/** Error Boundary pour StepSidebar + DidacticPanel.
 *  Fallback : panneau grisé avec « Section temporairement indisponible ». */
export function SidebarErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => <SidebarCrashFallback error={error} resetErrorBoundary={reset} />}
    >
      {children}
    </ErrorBoundary>
  )
}
