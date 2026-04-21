// ─── Particle Overlay ───
// Canvas2D overlay that sits on top of the SVG view, perfectly synced with
// the pan/zoom transform. Runs the ParticleEngine at 60fps via requestAnimationFrame.

import { useRef, useEffect, useCallback, type Ref } from 'react'
import type { RenderNode } from '../../types/expanse'
import type { JsonEdge } from '../../types/expanse'
import { ParticleEngine } from './ParticleEngine'

interface ParticleOverlayProps {
  nodes: RenderNode[]
  edges: JsonEdge[]
  centerX: number
  centerY: number
  scale: number
  ref?: Ref<HTMLCanvasElement>
}

export function ParticleOverlay({ nodes, edges, centerX, centerY, scale, ref }: ParticleOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Merge external ref with local ref (parent needs canvas for Export PNG)
  const mergedRef = useCallback((node: HTMLCanvasElement | null) => {
    (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = node
  }, [ref])
  const engineRef = useRef<ParticleEngine | null>(null)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  // Create engine once
  useEffect(() => {
    engineRef.current = new ParticleEngine()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      engineRef.current?.reset()
    }
  }, [])

  // Update edges when they change
  useEffect(() => {
    engineRef.current?.setEdges(edges)
  }, [edges])

  // Update node positions every frame via the animation loop (not a separate effect)
  // We store the latest nodes in a ref so the animation loop always has fresh data
  const nodesRef = useRef(nodes)
  nodesRef.current = nodes

  // Store latest transform in refs for the animation loop
  const transformRef = useRef({ centerX, centerY, scale })
  transformRef.current = { centerX, centerY, scale }

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    const engine = engineRef.current
    if (!canvas || !engine) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Size canvas to window
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = (now: number) => {
      const dt = lastTimeRef.current ? Math.min((now - lastTimeRef.current) / 1000, 0.05) : 0.016
      lastTimeRef.current = now

      // Update node positions
      engine.setNodePositions(nodesRef.current)

      // Update particles
      engine.update(dt)

      // Clear and render
      const { centerX: cx, centerY: cy, scale: s } = transformRef.current
      ctx.save()
      // clearRect uses the current transform, so clear in logical (CSS) pixels, not physical
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Apply same transform as SVG: translate(centerX, centerY) scale(scale)
      ctx.translate(cx, cy)
      ctx.scale(s, s)

      engine.render(ctx)
      ctx.restore()

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, []) // Only runs once — reads from refs for dynamic data

  return (
    <canvas
      ref={mergedRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none', // pass through clicks to SVG below
        zIndex: 5,             // above SVG (z-index auto) but below HUD (z-10+)
      }}
    />
  )
}
