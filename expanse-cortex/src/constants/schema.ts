// ─── Layout constants for Layered View ───

export const LAYERS: Record<string, number> = {
  ORGAN:     0,
  APEX:      1,
  AXIOME:    1,
  COMMANDE:  1,
  REGLE:     2,
  OUTIL:     2,
  PROTOCOLE: 2,
  FICHIER:   2,
  MUTATION:  3,
  PATTERN:   3,
  EXTENSION: 3,
  MEMOIRE:   4,
  SUBSTRAT:  4,
  DRIFT:     4,
}

export const LAYER_COUNT = Object.values(LAYERS).reduce((a, b) => Math.max(a, b), 0) + 1
export const MAX_PER_COLUMN = 20
export const COLUMN_WIDTH = 350
export const NODE_SPACING = 70
export const DEFAULT_LAYER = 3

// ─── Layout constants for Organic View (d3-force clustering) ───

export const CLUSTER_X: Record<string, number> = {
  ORGAN:     -600,
  APEX:      -300,
  AXIOME:    -300,
  COMMANDE:  -300,
  REGLE:       0,
  OUTIL:       0,
  PROTOCOLE:   0,
  FICHIER:     0,
  MUTATION:   300,
  PATTERN:    300,
  EXTENSION:  300,
  MEMOIRE:    600,
  SUBSTRAT:   600,
  DRIFT:      600,
}

export const CLUSTER_Y: Record<string, number> = {
  ORGAN:      -200,
  APEX:        -50,
  AXIOME:      -80,
  COMMANDE:     50,
  REGLE:      -100,
  OUTIL:         0,
  PROTOCOLE:   100,
  FICHIER:      30,
  MUTATION:   -100,
  PATTERN:      50,
  EXTENSION:    80,
  MEMOIRE:    -100,
  SUBSTRAT:    -60,
  DRIFT:        50,
}

export const DEFAULT_CLUSTER_X = 0
export const DEFAULT_CLUSTER_Y = 0
export const CLUSTER_STRENGTH_X = 0.06
export const CLUSTER_STRENGTH_Y = 0.04

// ─── Layout constants for Cognitive Heart (Anatomical Radial) ───

// Vital Ring: 5 organs positioned on a circle
export const VITAL_RING_RADIUS = 280

// Organ angles (radians) — clockwise from top
// Σ at top (Perception/input), then clockwise: Ψ, Φ, Ω, Μ
export const ORGAN_ANGLES: Record<string, number> = {
  'Σ': -Math.PI / 2,       // top
  'Ψ': -Math.PI / 10,      // upper-right
  'Φ': Math.PI * 3 / 10,   // lower-right
  'Ω': Math.PI * 7 / 10,   // lower-left
  'Μ': Math.PI * 11 / 10,  // upper-left
}

// Nucleus: APEX cluster at dead center
export const NUCLEUS_RADIUS = 60

// Mutation swarm: orbital ring around nucleus
export const SWARM_INNER_RADIUS = 100
export const SWARM_OUTER_RADIUS = 180

// M2.5: Nebula zone — peripheral region for extension MEMOIRE nodes
export const NEBULA_RADIUS = VITAL_RING_RADIUS + 300

// Cluster offsets from parent organ (direction + distance)
// Each type maps to which organ it orbits, and at what angle offset + spread
export const ANATOMICAL_CLUSTER: Record<string, {
  parentOrgan: string    // which organ this type clusters around
  angleOffset: number    // radians offset from parent organ (0 = same direction as organ from center)
  spreadRadius: number  // how far from the organ the cluster spreads
  radialBias: number    // push outward (>0) or inward (<0) from center
}> = {
  APEX:      { parentOrgan: '__nucleus__', angleOffset: 0, spreadRadius: 50, radialBias: 0 },
  AXIOME:    { parentOrgan: 'Ψ', angleOffset: -0.6, spreadRadius: 70, radialBias: 20 },
  COMMANDE:  { parentOrgan: 'Ψ', angleOffset: -0.3, spreadRadius: 90, radialBias: 30 },
  REGLE:     { parentOrgan: 'Ψ', angleOffset: 0.3, spreadRadius: 120, radialBias: 50 },
  PROTOCOLE: { parentOrgan: 'Ψ', angleOffset: 0.8, spreadRadius: 70, radialBias: 40 },
  OUTIL:     { parentOrgan: 'Φ', angleOffset: 0, spreadRadius: 80, radialBias: 60 },
  FICHIER:   { parentOrgan: 'Φ', angleOffset: 0.4, spreadRadius: 60, radialBias: 40 },
  MUTATION:  { parentOrgan: '__swarm__', angleOffset: 0, spreadRadius: 0, radialBias: 0 },
  PATTERN:   { parentOrgan: 'Ω', angleOffset: 0, spreadRadius: 100, radialBias: 60 },
  EXTENSION: { parentOrgan: 'Ω', angleOffset: 0.5, spreadRadius: 60, radialBias: 50 },
  MEMOIRE:   { parentOrgan: 'Μ', angleOffset: 0.3, spreadRadius: 110, radialBias: 60 },
  SUBSTRAT:  { parentOrgan: 'Μ', angleOffset: -0.3, spreadRadius: 50, radialBias: 40 },
  DRIFT:     { parentOrgan: '__scattered__', angleOffset: 0, spreadRadius: 0, radialBias: 0 },
}

// Shape types for each node type (SVG rendering)
export const NODE_SHAPES: Record<string, 'circle' | 'octagon' | 'diamond' | 'hexagon' | 'star'> = {
  ORGAN:     'hexagon',
  APEX:      'octagon',
  AXIOME:    'hexagon',
  COMMANDE:  'diamond',
  REGLE:     'circle',
  PROTOCOLE: 'star',
  FICHIER:   'circle',
  OUTIL:     'diamond',
  MUTATION:  'circle',  // rendered by MutationNode
  PATTERN:   'diamond',
  EXTENSION: 'star',
  MEMOIRE:   'diamond',
  SUBSTRAT:  'circle',
  DRIFT:     'circle',  // rendered by DriftNode
}
