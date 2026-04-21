import { useState, useRef, useEffect } from 'react'
import { ORGAN_COLORS } from '../constants/theme'
import { colorAlpha } from '../utils/colorAlpha'
import type { ManifestConcept, StepDidactic, GlossaryEntry } from '../data/bootDidactic'
import type { ProcessStep, Divergence } from '../types/signal'

// ══════════════════════════════════════════════════════════════
// GLOSSARY POPOVER
// ══════════════════════════════════════════════════════════════

function GlossaryPopover({
  entry,
  anchorRect,
  onClose,
  manifestConcepts,
}: {
  entry: { term: string; definition: string; relatedConcepts?: string[] }
  anchorRect: DOMRect | null
  onClose: () => void
  manifestConcepts: ManifestConcept[]
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  if (!anchorRect) return null

  // Position: below the term, clamped to viewport
  const popW = 288 // w-72 = 18rem = 288px
  const popH = 160 // estimated
  const vW = window.innerWidth
  const vH = window.innerHeight
  const left = Math.max(8, Math.min(anchorRect.left - 40, vW - popW - 8))
  const top = anchorRect.bottom + 6 > vH - popH
    ? anchorRect.top - popH - 6
    : anchorRect.bottom + 6

  return (
    <div
      ref={ref}
      className="fixed z-50 w-72 rounded-lg bg-base border border-white/10 shadow-xl shadow-black/40 p-3 space-y-2"
      style={{ left, top }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-mono font-bold text-fg">{entry.term}</span>
        <button onClick={onClose} className="text-surface2 hover:text-fg text-xs">✕</button>
      </div>
      <p className="text-[12px] text-overlay2 leading-relaxed">{entry.definition}</p>
      {entry.relatedConcepts && entry.relatedConcepts.length > 0 && (
        <div className="flex gap-1 flex-wrap pt-1 border-t border-white/5">
          {entry.relatedConcepts.map(c => {
            const concept = manifestConcepts.find(mc => mc.id === c)
            if (!concept) return null
            return (
              <span key={c} className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                style={{ color: concept.color, background: colorAlpha(concept.color, 0x12) }}>
                {concept.icon} {concept.label}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// PROSE RENDERER — highlights glossary terms with dotted underline
// ══════════════════════════════════════════════════════════════

function ProseWithGlossary({
  text,
  glossary,
  glossaryRegex,
  onGlossaryClick,
  onGlossaryHover,
}: {
  text: string
  glossary: Record<string, GlossaryEntry>
  glossaryRegex: RegExp
  onGlossaryClick: (term: string, rect: DOMRect) => void
  onGlossaryHover: (conceptId: string | null) => void
}) {
  // Split text using pre-built regex (word-boundary safe, longest-first)
  const parts = text.split(glossaryRegex)

  return (
    <span>
      {parts.map((part, i) => {
        const entry = glossary[part]
        if (!entry) return <span key={i}>{part}</span>

        // Find related manifest concept for hover highlight
        const relatedConcept = entry.relatedConcepts?.[0]

        return (
          <span
            key={i}
            className="border-b border-dotted border-blue/50 cursor-pointer hover:border-blue hover:text-blue transition-colors skip-ink-none"
            onClick={(e) => {
              e.stopPropagation()
              const rect = (e.target as HTMLElement).getBoundingClientRect()
              onGlossaryClick(part, rect)
            }}
            onMouseEnter={() => onGlossaryHover(relatedConcept ?? null)}
            onMouseLeave={() => onGlossaryHover(null)}
          >
            {part}
          </span>
        )
      })}
    </span>
  )
}

// ══════════════════════════════════════════════════════════════
// ANTI-PATTERN BLOCK
// ══════════════════════════════════════════════════════════════

function AntiPatternBlock({ standard, expanse }: { standard: string; expanse: string }) {
  return (
    <div className="rounded-lg overflow-hidden border border-white/[0.06]">
      <div className="px-3 py-2 bg-red/[0.06] border-b border-white/[0.04]">
        <div className="text-[10px] font-mono uppercase tracking-wider text-red mb-1">⚠️ IA Standard</div>
        <div className="text-[12px] text-red/80 italic leading-relaxed">{standard}</div>
      </div>
      <div className="px-3 py-2 bg-green/[0.06]">
        <div className="text-[10px] font-mono uppercase tracking-wider text-green mb-1">🛡️ Expanse</div>
        <div className="text-[12px] text-green/90 leading-relaxed">{expanse}</div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// MAIN DIDACTIC PANEL
// ══════════════════════════════════════════════════════════════

interface DidacticPanelProps {
  step: ProcessStep | null
  stepIdx: number
  scenarioId: string
  scenarioTitle: string
  didactics: StepDidactic[]
  manifestConcepts: ManifestConcept[]
  glossary: Record<string, GlossaryEntry>
  glossaryRegex: RegExp
  divergences?: Divergence[]
  onCanvasHighlight: (conceptId: string | null) => void
}

export function DidacticPanel({ step, stepIdx, scenarioId, scenarioTitle, didactics, manifestConcepts, glossary, glossaryRegex, divergences, onCanvasHighlight }: DidacticPanelProps) {
  const [glossaryTerm, setGlossaryTerm] = useState<string | null>(null)
  const [glossaryRect, setGlossaryRect] = useState<DOMRect | null>(null)

  const didactic = didactics[stepIdx] ?? null
  const col = step ? (step.isNegative ? 'var(--color-red)' : ORGAN_COLORS[step.organ] ?? 'var(--color-blue)') : 'var(--color-overlay0)'

  // Clear glossary popover when scenario switches
  useEffect(() => { setGlossaryTerm(null); setGlossaryRect(null) }, [scenarioId])

  const handleGlossaryClick = (term: string, rect: DOMRect) => {
    setGlossaryTerm(term)
    setGlossaryRect(rect)
  }

  const handleCloseGlossary = () => {
    setGlossaryTerm(null)
    setGlossaryRect(null)
  }

  const handleGlossaryHover = (conceptId: string | null) => {
    onCanvasHighlight(conceptId)
  }

  return (
    <div className="w-96 flex-shrink-0 border-l border-white/[0.06] bg-sidebar flex flex-col overflow-hidden">

      {/* ── Manifest Gauge ── */}
      <div className="px-4 pt-3 pb-2.5 border-b border-white/[0.06]">
        <div className="text-[10px] font-mono uppercase tracking-wider text-overlay0 mb-2">Manifeste</div>
        <div className="flex items-center gap-2.5">
          {manifestConcepts.map(mc => {
            const revealed = stepIdx >= mc.revealedAtStepIdx
            return (
              <div
                key={mc.id}
                className="flex items-center gap-1 transition-all duration-500"
                title={mc.label}
                onMouseEnter={() => revealed && onCanvasHighlight(mc.id)}
                onMouseLeave={() => onCanvasHighlight(null)}
              >
                <span className="text-[14px]" style={{ opacity: revealed ? 1 : 0.2, filter: revealed ? 'none' : 'grayscale(1)' }}>
                  {mc.icon}
                </span>
                <span className="text-[10px] font-mono font-semibold transition-all duration-500"
                  style={{ color: revealed ? mc.color : 'var(--color-surface0)' }}>
                  {mc.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Step Prose ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 step-log-scroll">
        {didactic ? (
          <>
            {/* Phase breadcrumb */}
            {step?.phase && (
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-surface2">
                <span>{scenarioTitle}</span>
                <span>/</span>
                <span style={{ color: col }}>{step.phase}</span>
              </div>
            )}

            {/* Concept pill */}
            {didactic.concept && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                style={{ background: colorAlpha(col, 0x10), border: `1px solid ${colorAlpha(col, 0x20)}` }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col }} />
                <span className="text-[12px] font-semibold" style={{ color: col }}>{didactic.concept}</span>
              </div>
            )}

            {/* Prose with glossary highlights */}
            <p className="text-[13px] text-subtext1 leading-relaxed">
              <ProseWithGlossary
                text={didactic.prose}
                glossary={glossary}
                glossaryRegex={glossaryRegex}
                onGlossaryClick={handleGlossaryClick}
                onGlossaryHover={handleGlossaryHover}
              />
            </p>

            {/* Anti-pattern */}
            {didactic.antiPattern && (
              <AntiPatternBlock
                standard={didactic.antiPattern.standard}
                expanse={didactic.antiPattern.expanse}
              />
            )}
          </>
        ) : (
          <div className="text-[12px] text-overlay0 italic">Sélectionnez une étape pour voir l'explication.</div>
        )}

        {/* Divergences between sources (Garde 9) — always visible when present */}
        {divergences && divergences.length > 0 && (
          <div className="border-t border-white/[0.06] pt-3 mt-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-yellow mb-2 flex items-center gap-1.5">
              <span>⚠️</span> Divergences entre sources
            </div>
            <div className="space-y-2">
              {divergences.map((d, i) => (
                <div key={i} className="rounded-lg p-2.5 tint-yellow">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono mb-1">
                    <span className="text-blue">{d.source1}</span>
                    <span className="text-surface2">⇌</span>
                    <span className="text-mauve">{d.source2}</span>
                  </div>
                  <p className="text-[11px] text-overlay2 leading-relaxed mb-1">{d.description}</p>
                  <p className="text-[11px] text-green/80 leading-relaxed italic">↳ {d.resolution}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Glossary Popover ── */}
      {glossaryTerm && glossary[glossaryTerm] && (
        <GlossaryPopover
          entry={glossary[glossaryTerm]}
          anchorRect={glossaryRect}
          onClose={handleCloseGlossary}
          manifestConcepts={manifestConcepts}
        />
      )}
    </div>
  )
}
