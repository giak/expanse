// ══════════════════════════════════════════════════════════════
// NODE PRESETS — default BaseNode config per node type
// ══════════════════════════════════════════════════════════════
// Each node type (Organ, Apex, Mutation, Drift, Cluster) passes
// the same category of props to BaseNode: className, label style,
// and focusable. These presets extract the static defaults so each
// node component only specifies what's unique.
//
// Usage:
//   const preset = NODE_PRESETS.organ
//   <BaseNode {...preset} node={node} renderShape={...} />
// ══════════════════════════════════════════════════════════════

// ─── Preset type (subset of BaseNodeProps — static defaults) ───

export interface NodePreset {
  className?: string
  labelOffset?: number
  labelFontSize?: number
  labelOpacity?: number
  labelColor?: string
  labelFontWeight?: string | number
  focusable?: boolean
}

// ─── Presets per node type ───

export const NODE_PRESETS: Record<string, NodePreset> = {
  organ: {
    className: 'matter-cristal',
    // labelOffset computed dynamically: node.radius + 16
    labelFontSize: 11,
    labelOpacity: 0.9,
    labelFontWeight: 600,
    focusable: true,
  },
  apex: {
    className: 'matter-cristal',
    // labelOffset computed dynamically: node.radius + 14
    labelFontSize: 9,
    labelOpacity: 0.85,
    focusable: true,
  },
  mutation: {
    // className computed dynamically from matter/ghost state
    // labelOffset computed dynamically: node.radius + 10
    labelFontSize: 8,
    labelOpacity: 0.7,
    focusable: false,
  },
  drift: {
    // className computed dynamically
    // labelOffset computed dynamically: node.radius + 9
    labelFontSize: 7,
    labelOpacity: 0.6,
    labelColor: '#f38ba8',
    focusable: false,
  },
  cluster: {
    // className computed dynamically from matter/curtain state
    focusable: false,
  },
}
