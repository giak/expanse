// ─── Catppuccin Mocha color mappings ───

export const NODE_COLORS: Record<string, string> = {
  APEX:      '#f38ba8',
  ORGAN:     '#f5c2e7',
  AXIOME:    '#d9b3f0',
  REGLE:     '#fab387',
  PROTOCOLE: '#f9e2af',
  PATTERN:   '#a6e3a1',
  FICHIER:   '#74c7ec',
  MEMOIRE:   '#89b4fa',
  OUTIL:     '#cba6f7',
  COMMANDE:  '#89dceb',
  MUTATION:  '#eba0ac',
  EXTENSION: '#94e2d5',
  SUBSTRAT:  '#b4befe',
  DRIFT:     '#f38ba8',
}

export const EDGE_COLORS: Record<string, string> = {
  FEEDS_INTO:     '#89b4fa',
  DERIVES_FROM:   '#fab387',
  IMPLEMENTS:     '#a6e3a1',
  CALLS:          '#cba6f7',
  RELATES_TO:     '#89b4fa',
  GUARDS:         '#f5c2e7',
  TRIGGERS:       '#f9e2af',
  CONTAINS:       '#74c7ec',
  CHECKS:         '#a6e3a1',
  STALLS:         '#eba0ac',
  PRODUCES:       '#94e2d5',
  DRAFTS:         '#89dceb',
  RESOLVES:       '#b4befe',
  RATE_POSITIVE:  '#a6e3a1',
  RATE_NEGATIVE:  '#f38ba8',
  ALTERS:         '#f9e2af',
}

export const NATURE_COLORS: Record<string, string> = {
  permanent: '#b4befe',     // lavender — cristallin, inébranlable
  vivide: '#a6e3a1',        // green — stable et actif
  volatile: '#f9e2af',      // yellow — en incubation
  incandescent: '#f38ba8',  // red — braise à consumer
}

export const DEFAULT_NODE_COLOR = '#6c7086'
export const DEFAULT_EDGE_COLOR = '#45475a'

export const ORGAN_ORDER = ['Σ', 'Ψ', 'Φ', 'Ω', 'Μ'] as const

export const ORGAN_COLORS: Record<string, string> = {
  'Σ': '#89b4fa',
  'Ψ': '#cba6f7',
  'Φ': '#fab387',
  'Ω': '#a6e3a1',
  'Μ': '#f38ba8',
}

// Legend entries for HUD
export const LEGEND_ENTRIES = [
  { type: 'APEX', color: NODE_COLORS.APEX, label: 'APEX', desc: 'Sections V16' },
  { type: 'ORGAN', color: NODE_COLORS.ORGAN, label: 'ORGANE', desc: 'ΣΨΦΩΜ' },
  { type: 'AXIOME', color: NODE_COLORS.AXIOME, label: 'AXIOME', desc: 'Décisions scellées' },
  { type: 'REGLE', color: NODE_COLORS.REGLE, label: 'RÈGLE', desc: 'Règles' },
  { type: 'PROTOCOLE', color: NODE_COLORS.PROTOCOLE, label: 'PROTOCOLE', desc: 'Dream Passes' },
  { type: 'PATTERN', color: NODE_COLORS.PATTERN, label: 'PATTERN', desc: 'Scellés' },
  { type: 'FICHIER', color: NODE_COLORS.FICHIER, label: 'FICHIER', desc: 'Fichiers système' },
  { type: 'MEMOIRE', color: NODE_COLORS.MEMOIRE, label: 'MÉMOIRE', desc: 'Évènements' },
  { type: 'OUTIL', color: NODE_COLORS.OUTIL, label: 'OUTIL', desc: 'MCP + Skills' },
  { type: 'COMMANDE', color: NODE_COLORS.COMMANDE, label: 'COMMANDE', desc: 'Commandes' },
  { type: 'MUTATION', color: NODE_COLORS.MUTATION, label: 'MUTATION', desc: 'Évolution' },
  { type: 'EXTENSION', color: NODE_COLORS.EXTENSION, label: 'EXTENSION', desc: 'Symbiose' },
  { type: 'SUBSTRAT', color: NODE_COLORS.SUBSTRAT, label: 'SUBSTRAT', desc: 'IDE/Modèle' },
  { type: 'DRIFT', color: NODE_COLORS.DRIFT, label: 'DRIFT', desc: 'Traces' },
] as const

// Nature legend entries (for LegendPanel)
export const NATURE_LEGEND = [
  { nature: 'permanent', color: NATURE_COLORS.permanent, label: 'PERMANENT', desc: 'Inébranlable', icon: '◆' },
  { nature: 'vivide', color: NATURE_COLORS.vivide, label: 'VIVIDE', desc: 'Stable & actif', icon: '●' },
  { nature: 'volatile', color: NATURE_COLORS.volatile, label: 'VOLATILE', desc: 'En incubation', icon: '◇' },
  { nature: 'incandescent', color: NATURE_COLORS.incandescent, label: 'INCANDESCENT', desc: 'Braise à consumer', icon: '✦' },
] as const
