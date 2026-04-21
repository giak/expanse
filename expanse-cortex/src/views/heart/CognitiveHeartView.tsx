// ══════════════════════════════════════════════════════════════
// COGNITIVE HEART VIEW — layout + orchestration
// ══════════════════════════════════════════════════════════════
// Extracted sub-components live in ./heart/:
//   OrganNode, ApexNode, MutationNode, DriftNode, ClusterNode,
//   VitalFlowEdges, ECSPrism, NebulaZone, RefusalShockwave,
//   BootSequenceOverlay, HeartDefs

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useAtomGraphData, useProximityMap } from '../../context/GraphContext'
import { useCssZoom } from '../../hooks/useSvgZoom'
import { useNodeMap } from '../../hooks/useNodeMap'
import { NODE_COLORS, ORGAN_COLORS, EDGE_COLORS, DEFAULT_EDGE_COLOR } from '../../constants/theme'
import { ANATOMICAL_CLUSTER } from '../../constants/schema'
import { positionGraphNodes, organPositions as sharedOrganPositions } from '../../utils/positionGraphNodes'
import { groupNodesByTypeRecord } from '../../utils/groupNodes'
import { computeOrganClusterBounds, resolveHighlightedOrgan } from '../../utils/organCluster'
import type { FocusTarget } from '../../utils/organCluster'
import type { RenderNode } from '../../types/expanse'
import { SvgDefs } from '../../components/svg/SvgDefs'
import { ParticleOverlay } from '../../components/particles/ParticleOverlay'
import { useExportPNG, ExportButton } from '../../components/svg/ExportPNG'
import { VitalRingTrack, VitalRingArrows } from '../../components/vitals/VitalRingTrack'
import { edgeHopToOpacity, hopToBlur } from '../../utils/proximityBFS'

import { OrganNode } from './OrganNode'
import { ApexNode } from './ApexNode'
import { MutationNode } from './MutationNode'
import { DriftNode } from './DriftNode'
import { ClusterNode } from './ClusterNode'
import { VitalFlowEdges } from './VitalFlowEdges'
import { ECSPrism } from './ECSPrismInteractive'
import { NebulaZone } from './NebulaZone'
import { RefusalShockwave } from './RefusalShockwave'
import { BootSequenceOverlay, type BootStage } from './BootSequenceOverlay'
import { HeartDefs, NUCLEUS_GLOW_RADIUS, SWARM_GLOW_RADIUS } from './HeartDefs'

// ─── Main View ───

export function CognitiveHeartView() {
  const { data } = useAtomGraphData()
  const proximityMap = useProximityMap()
  const [nodes, setNodes] = useState<RenderNode[]>([])
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null)

  // Phase 3: Enriched Boot Sequence — BIOS → KERNEL → CORTEX → ACTIVE
  const [bootStage, setBootStage] = useState<BootStage>('bios')
  useEffect(() => {
    const t1 = setTimeout(() => setBootStage('kernel'), 600)
    const t2 = setTimeout(() => setBootStage('cortex'), 1800)
    const t3 = setTimeout(() => setBootStage('active'), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  // Backward-compatible bootPhase for OrganNode pulse animation
  const bootPhase = bootStage === 'bios' ? 'chaos'
    : bootStage === 'kernel' ? 'chaos'
    : bootStage === 'cortex' ? 'locking'
    : null

  const [refusalOrigin, setRefusalOrigin] = useState<{ x: number; y: number; key: number } | null>(null)
  const handleRefusal = (node: RenderNode) => {
    if (!node.tags.includes('scelle')) return
    setRefusalOrigin({ x: node.x, y: node.y, key: Date.now() })
    setTimeout(() => setRefusalOrigin(null), 900)
  }
  const { viewBox, centerX, centerY, isDragging, isClickingNode, handlers, fitToView, zoomTo, zoomOut, computeViewForBounds } = useCssZoom()
  const { getNode } = useNodeMap(nodes)

  // Phase 3: Export PNG refs
  const svgRef = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { exportPNG } = useExportPNG({ svgRef, canvasRef, filename: 'expanse-coeur' })

  // Organ positions from shared utility (fixed on ring)
  const organPositions = sharedOrganPositions

  useEffect(() => {
    if (!data) return
    const positioned = positionGraphNodes(data)
    setNodes(positioned)
    fitToView(positioned)
  }, [data, fitToView])

  // React Compiler auto-memoizes pure computations
  const nodeGroups = groupNodesByTypeRecord(nodes)
  const organClusterBounds = computeOrganClusterBounds(nodes)

  // useMemo on edge elements — avoids recomputing proximity styling on every frame
  const edgeElements = useMemo(() => {
    if (!data) return null
    return data.edges.map((edge, idx) => {
      const source = getNode(edge.source)
      const target = getNode(edge.target)
      if (!source || !target) return null
      const edgeColor = EDGE_COLORS[edge.type] ?? DEFAULT_EDGE_COLOR
      const opacity = proximityMap
        ? edgeHopToOpacity(proximityMap.get(edge.source), proximityMap.get(edge.target))
        : 0.2
      const blur = proximityMap
        ? Math.max(
            hopToBlur(proximityMap.get(edge.source)),
            hopToBlur(proximityMap.get(edge.target)),
          )
        : 0

      return (
        <line
          key={idx}
          x1={source.x}
          y1={source.y}
          x2={target.x}
          y2={target.y}
          stroke={edgeColor}
          strokeWidth={0.4 + edge.weight * 1.5}
          opacity={opacity}
          style={{ transition: 'opacity 0.15s ease, filter 0.2s ease', filter: blur > 0 ? `blur(${blur}px)` : 'none' }}
        />
      )
    })
  }, [data, proximityMap, getNode])

  const handleOrganClick = (organSymbol: string) => {
    const clusterNodes = organClusterBounds.get(organSymbol)
    if (!clusterNodes || clusterNodes.length === 0) return
    const target = computeViewForBounds(clusterNodes, 200)
    if (target) {
      zoomTo(target)
      setFocusTarget({ kind: 'organ', symbol: organSymbol })
    }
  }

  const zoomToNodeWithConnections = (
    nodeId: string,
    focusTypes: string[],
    fallbackContextTypes: string[],
    newFocus: FocusTarget,
  ) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return

    const connectedIds = new Set<string>([nodeId])
    data?.edges.forEach(e => {
      if (e.source === nodeId) connectedIds.add(e.target)
      if (e.target === nodeId) connectedIds.add(e.source)
    })

    const primaryNodes = nodes.filter(n => connectedIds.has(n.id) && (focusTypes.includes(n.type) || n.id === nodeId))
    let boundedNodes = primaryNodes.length > 1 ? primaryNodes : nodes.filter(n => connectedIds.has(n.id))
    if (boundedNodes.length < 2) {
      const nearestContext = nodes
        .filter(n => fallbackContextTypes.includes(n.type))
        .sort((a, b) => {
          const da = Math.hypot(a.x - node.x, a.y - node.y)
          const db = Math.hypot(b.x - node.x, b.y - node.y)
          return da - db
        })[0]
      if (nearestContext) boundedNodes = [node, nearestContext]
    }
    if (boundedNodes.length === 0) return

    const target = computeViewForBounds(boundedNodes, 180)
    if (target) {
      zoomTo(target)
      setFocusTarget(newFocus)
    }
  }

  const handleMutationClick = (mutationId: string) => {
    const node = nodes.find(n => n.id === mutationId)
    if (!node) return
    zoomToNodeWithConnections(mutationId, ['APEX'], ['APEX'], { kind: 'mutation', id: mutationId, label: node.label })
  }

  const handleDriftClick = (driftId: string) => {
    const node = nodes.find(n => n.id === driftId)
    if (!node) return
    zoomToNodeWithConnections(driftId, [], ['ORGAN', 'APEX'], { kind: 'drift', id: driftId, label: node.label })
  }

  const handleClusterClick = (clusterId: string) => {
    const node = nodes.find(n => n.id === clusterId)
    if (!node) return
    const clusterConfig = ANATOMICAL_CLUSTER[node.type]
    if (!clusterConfig || clusterConfig.parentOrgan.startsWith('__')) {
      zoomToNodeWithConnections(clusterId, ['ORGAN', 'APEX'], ['ORGAN', 'APEX'], { kind: 'cluster', id: clusterId, label: node.label, nodeType: node.type })
      return
    }
    const clusterNodes = organClusterBounds.get(clusterConfig.parentOrgan)
    if (clusterNodes && clusterNodes.length > 0) {
      const target = computeViewForBounds(clusterNodes, 200)
      if (target) {
        zoomTo(target)
        setFocusTarget({ kind: 'cluster', id: clusterId, label: node.label, nodeType: node.type })
      }
    }
  }

  const highlightedOrganSymbol = resolveHighlightedOrgan(focusTarget, nodes)

  // Must stay as useCallback — flows into Esc key useEffect deps
  const handleZoomOut = useCallback(() => {
    zoomOut()
    setFocusTarget(null)
  }, [zoomOut])

  // Esc key to zoom out
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusTarget) {
        handleZoomOut()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [focusTarget, handleZoomOut])

  return (
    <div className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full cursor-grab" onClick={() => {}} {...handlers}>
      <SvgDefs />
      <HeartDefs />

      <g transform={`translate(${centerX}, ${centerY}) scale(${viewBox.scale})`}
        className={`${bootStage === 'bios' ? 'boot-dim' : bootStage === 'kernel' ? 'boot-faint' : bootStage === 'cortex' ? 'boot-emerging' : ''} opacity-transition-slow`}
      >

        {/* Background atmosphere layers (animated via SVG <animate>) */}
        <circle r={NUCLEUS_GLOW_RADIUS} fill="url(#nucleusGlow)">
          <animate attributeName="r" values={`${NUCLEUS_GLOW_RADIUS - 4};${NUCLEUS_GLOW_RADIUS + 4};${NUCLEUS_GLOW_RADIUS - 4}`} dur="4s" repeatCount="indefinite" />
        </circle>
        <circle r={SWARM_GLOW_RADIUS} fill="url(#swarmGlow)" className="mutation-pulse" />

        {/* M2.5: Nebula Zone — peripheral region for extensions */}
        <NebulaZone />

        {/* Vital Ring Track */}
        <VitalRingTrack organPositions={organPositions} />

        {/* M1.1: Vital Flow Edges — metabolic current per organ-to-organ segment */}
        <VitalFlowEdges organPositions={organPositions} />

        {/* M1.4: ECS Prism — translucent filter before Σ with chromatic beams */}
        <ECSPrism organPositions={organPositions} />

        {/* Edges (rendered behind nodes) — useMemo avoids recomputation on every render */}
        {edgeElements}

        {/* Drift nodes (outermost, behind everything) */}
        {nodeGroups.DRIFT?.map(node => (
          <DriftNode key={node.id} node={node} isDragging={isDragging} isClickingNode={isClickingNode} onDriftClick={handleDriftClick} />
        ))}

        {/* Cluster nodes (all non-organ, non-apex, non-mutation, non-drift types) */}
        {['AXIOME', 'FICHIER', 'EXTENSION', 'SUBSTRAT', 'MEMOIRE', 'PATTERN', 'OUTIL', 'PROTOCOLE', 'REGLE', 'COMMANDE'].flatMap(type =>
          nodeGroups[type]?.map(node => (
            <ClusterNode key={node.id} node={node} isDragging={isDragging} isClickingNode={isClickingNode} onClusterClick={handleClusterClick} onRefusal={handleRefusal} />
          )) ?? []
        )}

        {/* Mutation swarm */}
        {nodeGroups.MUTATION?.map(node => (
          <MutationNode key={node.id} node={node} isDragging={isDragging} isClickingNode={isClickingNode} onMutationClick={handleMutationClick} onRefusal={handleRefusal} />
        ))}

        {/* APEX nucleus */}
        {nodeGroups.APEX?.map(node => (
          <ApexNode key={node.id} node={node} isDragging={isDragging} isClickingNode={isClickingNode} onApexClick={() => handleOrganClick('APEX')} />
        ))}

        {/* Organ nodes (topmost, on vital ring) — M1.5: bootPhase passed */}
        {nodeGroups.ORGAN?.map(node => (
          <OrganNode key={node.id} node={node} isDragging={isDragging} isClickingNode={isClickingNode} onOrganClick={handleOrganClick} highlighted={highlightedOrganSymbol === node.label.charAt(0)} bootPhase={bootPhase} />
        ))}

        {/* Phase 3: Enriched Boot Sequence overlays */}
        <BootSequenceOverlay stage={bootStage} />

        {/* Directional arrows on vital ring (Σ→Ψ→Φ→Ω→Μ) */}
        <VitalRingArrows organPositions={organPositions} />

        {/* M2.4: Le Refus — red shockwave from sealed axiom */}
        <RefusalShockwave origin={refusalOrigin} />
      </g>

      </svg>

      {/* Particle overlay — metabolic flow on active edges */}
      {data && nodes.length > 0 && (
        <ParticleOverlay
          ref={canvasRef}
          nodes={nodes}
          edges={data.edges}
          centerX={centerX}
          centerY={centerY}
          scale={viewBox.scale}
        />
      )}

      {/* Phase 3: Export PNG button */}
      <ExportButton onClick={exportPNG} />

      {/* Zoom-out overlay when focused — lower z-index than export button */}
      {focusTarget && (
        <button
          onClick={handleZoomOut}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-5 py-2.5 rounded-full bg-mantle/90 backdrop-blur-md border border-white/10 text-fg text-sm font-medium hover:bg-base hover:border-blue/30 transition-all duration-200 cursor-pointer focus-shadow"
        >
          {focusTarget.kind === 'organ' ? (
            <>
              <span style={{ color: ORGAN_COLORS[focusTarget.symbol] ?? 'var(--color-blue)', fontSize: 18 }}>{focusTarget.symbol}</span>
              <span>{nodes.find(n => n.type === 'ORGAN' && n.label.charAt(0) === focusTarget.symbol)?.label ?? focusTarget.symbol}</span>
            </>
          ) : focusTarget.kind === 'mutation' ? (
            <>
              <span style={{ color: NODE_COLORS.MUTATION, fontSize: 14 }}>●</span>
              <span>{focusTarget.label}</span>
            </>
          ) : focusTarget.kind === 'drift' ? (
            <>
              <span style={{ color: NODE_COLORS.DRIFT, fontSize: 14 }}>⚡</span>
              <span>{focusTarget.label}</span>
            </>
          ) : (
            <>
              <span style={{ color: NODE_COLORS[focusTarget.nodeType] ?? 'var(--color-blue)', fontSize: 14 }}>◆</span>
              <span>{focusTarget.label}</span>
            </>
          )}
          <span>· Zoom out</span>
          <span className="text-overlay0 text-xs">← Esc</span>
        </button>
      )}
    </div>
  )
}

