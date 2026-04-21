import { useState, useRef, useEffect, useCallback } from 'react'

// ══════════════════════════════════════════════════════════════
// SVG ZOOM — unified module for SVG pan/zoom
// ══════════════════════════════════════════════════════════════
// Exports two hooks from one module, sharing types and constants:
//
//   useCssZoom()      — CSS transform mode (translate + scale via <g>)
//   useViewBoxZoom()  — SVG viewBox mode (zoom-toward-cursor via viewBox attr)
//
// useCssZoom:  State { x, y, scale } → transform={`translate(cx,cy) scale(s)`}
//   Supports: fitToView, animated zoomTo/zoomOut, computeViewForBounds
//
// useViewBoxZoom:  State { x, y, w, h } → viewBox="x y w h"
//   Supports: zoom-toward-cursor, resetView, isZoomed, svgRef
// ══════════════════════════════════════════════════════════════

// ─── Shared types ───

/** CSS transform state (used by useCssZoom) */
export interface CssViewBox {
  x: number
  y: number
  scale: number
}

/** SVG viewBox state (used by useViewBoxZoom) */
export interface SvgViewBox {
  x: number
  y: number
  w: number
  h: number
}

// ─── Animation constants ───

const ANIM_DURATION = 500
const ANIM_EASE = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 // easeInOutCubic

// ─── ViewBox mode defaults ───

const DEFAULT_VIEW_BOX: SvgViewBox = { x: -560, y: -560, w: 1120, h: 1120 }
const MIN_SCALE = 0.3
const MAX_SCALE = 5
const ZOOM_FACTOR = 0.1

// ─── Epsilon for float comparison (avoids sub-pixel drift in isZoomed) ───
const EPS = 0.5

// ══════════════════════════════════════════════════════════════
// CSS TRANSFORM MODE (was usePanZoom)
// ══════════════════════════════════════════════════════════════

export interface CssZoomApi {
  viewBox: CssViewBox
  setViewBox: React.Dispatch<React.SetStateAction<CssViewBox>>
  isDragging: React.MutableRefObject<boolean>
  isClickingNode: React.MutableRefObject<boolean>
  centerX: number
  centerY: number
  isZoomed: boolean
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void
    onMouseMove: (e: React.MouseEvent) => void
    onMouseUp: () => void
    onMouseLeave: () => void
    onWheel: (e: React.WheelEvent) => void
  }
  fitToView: (nodes: { x: number; y: number; radius: number }[]) => void
  zoomTo: (target: CssViewBox) => void
  zoomOut: () => void
  resetView: () => void
  computeViewForBounds: (
    nodes: { x: number; y: number; radius: number }[],
    padding?: number,
  ) => CssViewBox | null
}

export function useCssZoom(): CssZoomApi {
  const [viewBox, setViewBox] = useState<CssViewBox>({ x: 0, y: 0, scale: 1 })
  const isDragging = useRef(false)
  const isClickingNode = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const animFrameRef = useRef<number | null>(null)
  const homeViewBox = useRef<CssViewBox | null>(null)
  const [initialViewBox] = useState<CssViewBox>({ x: 0, y: 0, scale: 1 })

  // ── Mouse handlers ──

  const handleMouseDown = (e: React.MouseEvent) => {
    if (animFrameRef.current !== null) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null }
    if (isClickingNode.current) return
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    setViewBox(v => ({ ...v, x: v.x + dx, y: v.y + dy }))
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    isDragging.current = false
    isClickingNode.current = false
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (animFrameRef.current !== null) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null }
    e.preventDefault()
    e.stopPropagation()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setViewBox(v => ({ ...v, scale: Math.max(0.2, Math.min(3, v.scale * delta)) }))
  }

  // ── Bounds computation ──

  const computeViewForBounds = useCallback(
    (nodes: { x: number; y: number; radius: number }[], padding = 400) => {
      if (nodes.length === 0) return null
      const minX = Math.min(...nodes.map(n => n.x - n.radius))
      const maxX = Math.max(...nodes.map(n => n.x + n.radius))
      const minY = Math.min(...nodes.map(n => n.y - n.radius))
      const maxY = Math.max(...nodes.map(n => n.y + n.radius))
      const graphW = maxX - minX + padding
      const graphH = maxY - minY + padding
      const winW = window.innerWidth
      const winH = window.innerHeight
      const scale = Math.min(winW / graphW, winH / graphH, 1.5)
      const offsetX = -(minX + maxX) / 2 * scale
      const offsetY = -(minY + maxY) / 2 * scale
      return { x: offsetX, y: offsetY, scale }
    }, [],
  )

  const fitToView = useCallback(
    (nodes: { x: number; y: number; radius: number }[]) => {
      const target = computeViewForBounds(nodes)
      if (target) {
        setViewBox(target)
        homeViewBox.current = target
      }
    }, [computeViewForBounds],
  )

  // ── Animated zoom ──

  const viewBoxRef = useRef(viewBox)
  viewBoxRef.current = viewBox

  const zoomTo = useCallback((target: CssViewBox) => {
    if (animFrameRef.current !== null) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null }
    const start = { ...viewBoxRef.current }
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / ANIM_DURATION)
      const eased = ANIM_EASE(t)
      const next: CssViewBox = {
        x: start.x + (target.x - start.x) * eased,
        y: start.y + (target.y - start.y) * eased,
        scale: start.scale + (target.scale - start.scale) * eased,
      }
      setViewBox(next)
      if (t < 1) { animFrameRef.current = requestAnimationFrame(animate) }
      else { animFrameRef.current = null }
    }
    animFrameRef.current = requestAnimationFrame(animate)
  }, [])

  const zoomOut = useCallback(() => {
    if (homeViewBox.current) zoomTo(homeViewBox.current)
  }, [zoomTo])

  // ── Window size for centering ──

  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const centerX = windowSize.width / 2 + viewBox.x
  const centerY = windowSize.height / 2 + viewBox.y

  // ── isZoomed: compare current viewBox to home (fitted) position ──
  // Uses epsilon comparison to avoid sub-pixel drift after animated reset
  const home = homeViewBox.current ?? initialViewBox
  const isZoomed =
    Math.abs(viewBox.x - home.x) > EPS ||
    Math.abs(viewBox.y - home.y) > EPS ||
    Math.abs(viewBox.scale - home.scale) > EPS

  // ── Animated reset to home position ──
  const resetView = useCallback(() => {
    const target = homeViewBox.current ?? initialViewBox
    zoomTo(target)
  }, [zoomTo, initialViewBox])

  // ── Esc key to reset zoom (built into hook, no per-view duplication) ──
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) resetView()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isZoomed, resetView])

  return {
    viewBox, setViewBox,
    isDragging, isClickingNode,
    centerX, centerY, isZoomed,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onWheel: handleWheel,
    },
    fitToView, zoomTo, zoomOut, resetView, computeViewForBounds,
  }
}

// ══════════════════════════════════════════════════════════════
// SVG VIEWBOX MODE (was useViewBoxZoom)
// ══════════════════════════════════════════════════════════════

export interface ViewBoxZoomApi {
  viewBox: SvgViewBox
  svgRef: (node: SVGSVGElement | null) => void
  isDragging: React.MutableRefObject<boolean>
  hasDragged: React.MutableRefObject<boolean>
  isDraggingActive: boolean
  isZoomed: boolean
  resetView: () => void
  mouseHandlers: {
    onMouseDown: (e: React.MouseEvent) => void
    onMouseMove: (e: React.MouseEvent) => void
    onMouseUp: () => void
    onMouseLeave: () => void
  }
}

export function useViewBoxZoom(initial: SvgViewBox = DEFAULT_VIEW_BOX): ViewBoxZoomApi {
  const [viewBox, setViewBox] = useState<SvgViewBox>(initial)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const isDragging = useRef(false)
  const hasDragged = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const viewBoxRef = useRef<SvgViewBox>(initial)
  const [isDraggingActive, setIsDraggingActive] = useState(false)

  // Keep viewBoxRef in sync for animated reset
  viewBoxRef.current = viewBox

  // ── Wheel zoom: zoom toward cursor position ──

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const svg = svgRef.current
    if (!svg) return
    const ctm = svg.getScreenCTM()
    if (!ctm) return

    const svgX = (e.clientX - ctm.e) / ctm.a
    const svgY = (e.clientY - ctm.f) / ctm.d
    const direction = e.deltaY > 0 ? 1 : -1
    const factor = 1 + direction * ZOOM_FACTOR

    setViewBox(vb => {
      const newW = vb.w * factor
      const newH = vb.h * factor
      const scaleRatio = initial.w / newW
      if (scaleRatio > MAX_SCALE || scaleRatio < MIN_SCALE) return vb
      const newX = svgX - (svgX - vb.x) * factor
      const newY = svgY - (svgY - vb.y) * factor
      return { x: newX, y: newY, w: newW, h: newH }
    })
  }, [initial])

  // ── Pan: drag to translate viewBox ──

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    hasDragged.current = false
    setIsDraggingActive(true)
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged.current = true

    const svg = svgRef.current
    if (!svg) return
    const ctm = svg.getScreenCTM()
    if (!ctm) return

    const svgDx = dx / ctm.a
    const svgDy = dy / ctm.d
    setViewBox(vb => ({ ...vb, x: vb.x - svgDx, y: vb.y - svgDy }))
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
    setIsDraggingActive(false)
  }, [])

  // ── Animated reset / isZoomed ──

  const animFrameRef = useRef<number | null>(null)

  const resetView = useCallback(() => {
    if (animFrameRef.current !== null) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null }
    const start = { ...viewBoxRef.current }
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / ANIM_DURATION)
      const eased = ANIM_EASE(t)
      const next: SvgViewBox = {
        x: start.x + (initial.x - start.x) * eased,
        y: start.y + (initial.y - start.y) * eased,
        w: start.w + (initial.w - start.w) * eased,
        h: start.h + (initial.h - start.h) * eased,
      }
      setViewBox(next)
      if (t < 1) { animFrameRef.current = requestAnimationFrame(animate) }
      else { animFrameRef.current = null }
    }
    animFrameRef.current = requestAnimationFrame(animate)
  }, [initial])

  // ── isZoomed with epsilon comparison ──
  const isZoomed =
    Math.abs(viewBox.x - initial.x) > EPS ||
    Math.abs(viewBox.y - initial.y) > EPS ||
    Math.abs(viewBox.w - initial.w) > EPS ||
    Math.abs(viewBox.h - initial.h) > EPS

  // ── Esc key to reset zoom (built into hook, no per-view duplication) ──
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) resetView()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isZoomed, resetView])

  // ── Register wheel listener (passive:false for preventDefault) ──

  const svgRefCallback = useCallback((node: SVGSVGElement | null) => {
    if (svgRef.current) svgRef.current.removeEventListener('wheel', handleWheel as EventListener)
    svgRef.current = node
    if (node) node.addEventListener('wheel', handleWheel as EventListener, { passive: false })
  }, [handleWheel])

  return {
    viewBox,
    svgRef: svgRefCallback,
    isDragging,
    hasDragged,
    isDraggingActive,
    isZoomed,
    resetView,
    mouseHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  }
}

