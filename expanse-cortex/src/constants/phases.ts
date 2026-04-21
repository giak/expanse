// ══════════════════════════════════════════════════════════════
// PHASE CONSTANTS — Cognitive operation phase mappings
// ══════════════════════════════════════════════════════════════

/** Map phase → color reflecting cognitive operation type.
 *  Unknown phases fall back to route-based palette (see phaseColorForRoute). */
export const PHASE_COLORS: Record<string, string> = {
  // Boot phases
  INIT: '#89b4fa',      // Blue — system init
  SEED: '#89b4fa',      // Blue — file read
  APEX: '#cba6f7',      // Purple — incarnation (most dramatic)
  INDEX: '#89b4fa',     // Blue — IDE access
  MEMORY: '#f38ba8',    // Pink — Mnemolite loading
  CHECK: '#a6e3a1',     // Green — verification
  BRIEFING: '#f9e2af',  // Yellow — first light
  READY: '#6c7086',     // Gray — inertie
  LISTEN: '#89b4fa',    // Blue — awaiting input
  // Bonjour phases (first perceptual cycle)
  PERCEIVE: '#89b4fa',  // Blue — input received
  EVALUATE: '#a6e3a1',  // Green — ECS classification
  ROUTE: '#a6e3a1',     // Green — L1 fulgurance
  VERIFY: '#f9e2af',    // Yellow — Auto-Check / SEC
  EMIT: '#cba6f7',      // Purple — controlled emission
  RECORD: '#f38ba8',    // Pink — signal classification
  IDLE: '#6c7086',      // Gray — return to inertie
  // L2 Audit phases
  AUDIT: '#f9e2af',     // Yellow — boucle Ψ⇌Φ
  TOOL_CALL: '#fab387', // Orange — Φ active un outil
  RECALL: '#f38ba8',    // Pink — Μ rappelle les patterns
  SYNTHESIZE: '#a6e3a1', // Green — Ω construit la réponse
  // L3 Triangulation phases
  TRIANGULATE: '#f38ba8',  // Rose — triangulation 3 pôles
  ANCHOR_POLE: '#b4befe',  // Lavande — pôle 1 Mnemolite
  VESSEL_POLE: '#74c7ec',  // Cyan — pôle 2 code local
  WEB_POLE: '#94e2d5',     // Teal — pôle 3 réalité externe
  // Violation / SEC phases
  DETECT: '#f38ba8',       // Rouge — contradiction détectée
  BLOCK: '#f38ba8',        // Rouge — émission bloquée
  CHALLENGE: '#f9e2af',    // Jaune — « Évolution ou Erreur ? »
  // Hallucination block phases
  MISSING: '#6c7086',       // Gris — donnée absente
  LOST_EMIT: '#6c7086',     // Gris — émission [LOST]
  // Momentum resist phases
  RHETORIC_DETECT: '#f9e2af', // Jaune — question sans impératif détectée
  // Vessel guard phases
  VESSEL_SEARCH: '#74c7ec',  // Cyan — Φ scanne le Vessel
  VESSEL_FOUND: '#a6e3a1',   // Vert — trouvé dans le code
  // Dream cycle phases
  DREAM_INIT: '#89b4fa',    // Bleu — rêve initialisé
  WINTER: '#6c7086',        // Gris — hiver, inertie du rêve
  FRESH_COUNT: '#f38ba8',   // Rose — comptage des traces
  DEGEL: '#89b4fa',         // Bleu — dégeler les frictions
  LINTER: '#cba6f7',        // Violet — audit lexical
  EMERGENCE: '#a6e3a1',     // Vert — émergence de patterns
  ELAGAGE: '#fab387',       // Orange — élagage
}

/** Human-readable labels for phases (used by PhaseBanner and StepSidebar) */
export const PHASE_LABELS: Record<string, string> = {
  INIT: 'INITIALISATION', SEED: 'CHARGEMENT SEED', APEX: 'INCARNATION',
  INDEX: 'INDEXATION', MEMORY: 'MÉMOIRE', CHECK: 'VÉRIFICATION',
  BRIEFING: 'ACTIVATION', READY: 'INERTIE', LISTEN: 'EN ATTENTE',
  // Bonjour phases
  PERCEIVE: 'PERCEPTION', EVALUATE: 'ÉVALUATION', ROUTE: 'ROUTAGE',
  VERIFY: 'VÉRIFICATION', EMIT: 'ÉMISSION', RECORD: 'ENREGISTREMENT',
  IDLE: 'INERTIE',
  // L2 Audit phases
  AUDIT: 'BOUCLE AUDIT', TOOL_CALL: 'APPEL OUTIL',
  RECALL: 'RAPPEL Μ', SYNTHESIZE: 'SYNTHÈSE Ω',
  // L3 Triangulation phases
  TRIANGULATE: 'TRIANGULATION', ANCHOR_POLE: 'PÔLE ANCHOR',
  VESSEL_POLE: 'PÔLE VESSEL', WEB_POLE: 'PÔLE WEB',
  // Violation / SEC phases
  DETECT: 'CONTRADICTION', BLOCK: 'BLOCAGE', CHALLENGE: 'ÉVOLUTION OU ERREUR',
  // Hallucination block phases
  MISSING: 'DONNÉE ABSENTE', LOST_EMIT: '[LOST]',
  // Momentum resist phases
  RHETORIC_DETECT: 'RHÉTORIQUE DÉTECTÉE',
  // Vessel guard phases
  VESSEL_SEARCH: 'RECHERCHE VESSEL', VESSEL_FOUND: 'TROUVÉ',
  // Dream cycle phases
  DREAM_INIT: 'RÊVE INIT', WINTER: 'HIVER', FRESH_COUNT: 'TRACES FRAÎCHES',
  DEGEL: 'DÉGEL', LINTER: 'LINTER LEXICAL', EMERGENCE: 'ÉMERGENCE', ELAGAGE: 'ÉLAGAGE',
}

/** Dream cycle phases — when active, Ψ and Μ are the focus, other organs fade */
export const DREAM_PHASES = new Set(['DREAM_INIT', 'WINTER', 'FRESH_COUNT', 'DEGEL', 'LINTER', 'EMERGENCE', 'ELAGAGE'])

/** Season mapping for Dream phases */
export const DREAM_SEASON_MAP: Record<string, 'winter' | 'spring' | 'summer' | 'autumn'> = {
  DREAM_INIT: 'winter', WINTER: 'winter', FRESH_COUNT: 'winter',
  DEGEL: 'spring', LINTER: 'spring',
  EMERGENCE: 'summer',
  ELAGAGE: 'autumn',
}

/** Phases where MCP search_memory streams data from Μ→Ψ */
export const MCP_PHASES = new Set(['MEMORY', 'RECALL', 'ANCHOR_POLE'])

/** Step where incarnation happens — Ouvrier becomes Expanse */
export const INCARNATION_PHASE = 'APEX'

/** Step where first visible character is emitted */
export const FIRST_LIGHT_PHASE = 'BRIEFING'

/** Phase where system awaits user input — Σ gently pulses */
export const LISTEN_PHASE = 'LISTEN'

/** Phases where the Ouvrier shadow should NOT appear (emission, recording, waiting) */
export const SHADOW_PHASES = new Set(['BRIEFING', 'READY', 'EMIT', 'RECORD', 'IDLE', LISTEN_PHASE, 'BLOCK', 'CHALLENGE', 'MISSING', 'LOST_EMIT'])

/** Map concept IDs (from didactic panel) to organ symbols for canvas highlight glow */
export const HIGHLIGHT_ORGAN_MAP: Record<string, string> = {
  // Boot concepts
  sigma: 'Σ', ouvrier: 'Ψ', psi: 'Ψ', omega: 'Ω',
  mcp_stream: 'Μ', first_light: 'Ω',
  exemption: 'Σ', incarnation: 'Ψ', 'boot-config': 'Ψ', 'null-signal': 'Σ', inertia: 'Ω',
  // Bonjour concepts
  perception: 'Σ', routing: 'Ψ', sec: 'Ψ', emission: 'Ω',
  // L2 Audit concepts
  audit: 'Ψ', 'tool-use': 'Φ', recall: 'Μ', synthesis: 'Ω',
  // L3 Triangulation concepts
  triangulation: 'Ψ', anchor: 'Μ', vessel: 'Φ', 'web-pole': 'Φ', confiance: 'Ω',
  // Violation concepts
  contradiction: 'Μ', blockage: 'Ψ', 'evolution-or-error': 'Ψ',
  // Hallucination block concepts
  'fog': 'Φ', 'lost': 'Ω', 'anti-hallucination': 'Ψ',
  // Momentum resist concepts
  'momentum-resist': 'Ψ', 'rhetoric': 'Ψ', 'question-shield': 'Φ',
  // Vessel guard concepts
  'vessel-guard': 'Φ', 'vessel-search': 'Φ', 'vessel-found': 'Φ',
  // Dream cycle concepts
  'dream-gate': 'Ψ', 'winter': 'Μ', 'fresh-count': 'Μ', 'degel': 'Ψ', 'linter': 'Ψ',
  'emergence': 'Ψ', 'elagage': 'Μ', 'mutation-orbit': 'Ψ', 'proposal-bloom': 'Μ', 'season': 'Ψ',
  'prune-shears': 'Μ',
}

/** Map concept IDs to phase colors for the highlight glow */
export const HIGHLIGHT_COLOR_MAP: Record<string, string> = {
  // Boot
  exemption: 'SEED', incarnation: 'APEX', 'boot-config': 'APEX', 'null-signal': 'INIT', inertia: 'READY',
  // Bonjour
  perception: 'PERCEIVE', routing: 'EVALUATE', sec: 'VERIFY', emission: 'EMIT',
  // L2 Audit
  audit: 'AUDIT', 'tool-use': 'TOOL_CALL', recall: 'RECALL', synthesis: 'SYNTHESIZE',
  // L3 Triangulation
  triangulation: 'TRIANGULATE', anchor: 'ANCHOR_POLE', vessel: 'VESSEL_POLE', 'web-pole': 'WEB_POLE', confiance: 'SYNTHESIZE',
  // Violation
  contradiction: 'DETECT', blockage: 'BLOCK', 'evolution-or-error': 'CHALLENGE',
  // Hallucination block
  'fog': 'MISSING', 'lost': 'LOST_EMIT', 'anti-hallucination': 'VERIFY',
  // Momentum resist
  'momentum-resist': 'VERIFY', 'rhetoric': 'RHETORIC_DETECT', 'question-shield': 'RHETORIC_DETECT',
  // Vessel guard
  'vessel-guard': 'VESSEL_SEARCH', 'vessel-search': 'VESSEL_SEARCH', 'vessel-found': 'VESSEL_FOUND',
  // Dream cycle
  'dream-gate': 'DREAM_INIT', 'winter': 'WINTER', 'fresh-count': 'FRESH_COUNT',
  'degel': 'DEGEL', 'linter': 'LINTER', 'emergence': 'EMERGENCE', 'elagage': 'ELAGAGE',
  'mutation-orbit': 'PROPOSE', 'proposal-bloom': 'EMERGENCE', 'season': 'DEGEL',
  'prune-shears': 'ELAGAGE',
}

/** Route-based fallback palette — used when a phase is not in PHASE_COLORS */
const ROUTE_PALETTE: Record<string, string> = {
  BOOT: '#89b4fa',    // Blue
  L1: '#a6e3a1',      // Green
  L2: '#f9e2af',      // Yellow
  L3: '#f38ba8',      // Red
  DREAM: '#cba6f7',   // Purple
  MUT: '#fab387',     // Peach
  CRYS: '#a6e3a1',    // Green
  DCRY: '#eba0ac',    // Mauve
  GARD: '#94e2d5',    // Teal
  NEG: '#f38ba8',     // Red
  A1: '#b4befe',      // Lavender
  A2: '#89dceb',      // Sky
  LIVE: '#f5c2e7',    // Pink
}
const DEFAULT_ROUTE_COLOR = '#89b4fa'

/** Resolve a phase color with route-based fallback for unknown phases */
export function phaseColorWithFallback(phase: string | undefined, route?: string): string {
  if (!phase) return route ? (ROUTE_PALETTE[route] ?? DEFAULT_ROUTE_COLOR) : DEFAULT_ROUTE_COLOR
  return PHASE_COLORS[phase] ?? (route ? ROUTE_PALETTE[route] : undefined) ?? DEFAULT_ROUTE_COLOR
}
