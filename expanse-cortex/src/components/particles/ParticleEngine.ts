// ─── Particle Engine ───
// Manages particle lifecycle, spawning, updating, and rendering on a Canvas2D context.
// Coordinates are in graph-space (same as SVG). The overlay component applies the
// pan/zoom transform before calling render().

import type { JsonEdge } from '../../types/expanse'
import type { Particle } from './Particle'
import { EDGE_TYPE_TO_PARTICLE, STATIC_EDGE_TYPES } from './particleTypes'

const MAX_PARTICLES = 150
const FADE_OUT_DURATION = 0.4 // seconds after reaching target
const SPAWN_INTERVAL = 0.8 // seconds between spawn batches

// ─── Glow texture cache ───
// Pre-render a radial gradient circle to an OffscreenCanvas so we never
// use shadowBlur in the hot loop. One texture per (color, radius) pair.

const glowCache = new Map<string, OffscreenCanvas>()

function getGlowTexture(color: string, radius: number): OffscreenCanvas {
  const key = `${color}_${radius}`
  const cached = glowCache.get(key)
  if (cached) return cached

  const size = Math.ceil(radius * 4)
  const canvas = new OffscreenCanvas(size, size)
  const ctx = canvas.getContext('2d')!
  const cx = size / 2
  const cy = size / 2

  // Radial gradient: bright center → transparent edge
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2)
  grad.addColorStop(0, color)
  grad.addColorStop(0.3, color)
  grad.addColorStop(1, 'transparent')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  glowCache.set(key, canvas)
  return canvas
}

// ─── Engine ───

export class ParticleEngine {
  particles: Particle[] = []
  edges: JsonEdge[] = []

  // Node positions indexed by id (graph-space)
  nodePositions = new Map<string, { x: number; y: number; color: string }>()

  // Active edge indices (those with particle-spawning types)
  private activeEdgeIndices: number[] = []
  // Spawn timers per active edge
  private spawnTimers: Float64Array = new Float64Array(0)
  // Accumulated time since last spawn batch
  private spawnAccum = 0
  // Round-robin cursor for fair spawning across all active edges
  private spawnCursor = 0

  // ─── Setup ───

  /** Set the edge data and rebuild the active edge list */
  setEdges(edges: JsonEdge[]) {
    this.edges = edges
    this.activeEdgeIndices = []
    for (let i = 0; i < edges.length; i++) {
      if (!STATIC_EDGE_TYPES.has(edges[i].type)) {
        this.activeEdgeIndices.push(i)
      }
    }
    // Initialize spawn timers with staggered offsets
    this.spawnTimers = new Float64Array(this.activeEdgeIndices.length)
    for (let i = 0; i < this.activeEdgeIndices.length; i++) {
      this.spawnTimers[i] = Math.random() * SPAWN_INTERVAL
    }
  }

  /** Update node positions from rendered nodes */
  setNodePositions(nodes: { id: string; x: number; y: number; color: string }[]) {
    this.nodePositions.clear()
    for (const n of nodes) {
      this.nodePositions.set(n.id, { x: n.x, y: n.y, color: n.color })
    }
  }

  // ─── Update ───

  /** Advance all particles by dt seconds. Call once per frame. */
  update(dt: number) {
    // 1. Update existing particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      if (!p.alive) {
        this.particles.splice(i, 1)
        continue
      }

      // Update source/target positions from node map
      const src = this.nodePositions.get(this.edges[p.edgeIdx].source)
      const tgt = this.nodePositions.get(this.edges[p.edgeIdx].target)
      if (src) { p.sx = src.x; p.sy = src.y }
      if (tgt) { p.tx = tgt.x; p.ty = tgt.y }

      // Advance progress
      if (p.progress < 1) {
        p.progress += p.speed * dt
        if (p.progress >= 1) {
          p.progress = 1
          p.fadeOut = FADE_OUT_DURATION
        }
      } else {
        // Fade out phase
        p.fadeOut -= dt
        if (p.fadeOut <= 0) {
          p.alive = false
        }
      }

      // Interpolate position
      p.x = p.sx + (p.tx - p.sx) * p.progress
      p.y = p.sy + (p.ty - p.sy) * p.progress
    }

    // 2. Spawn new particles
    if (this.particles.length < MAX_PARTICLES) {
      this.spawnAccum += dt
      if (this.spawnAccum >= SPAWN_INTERVAL) {
        this.spawnAccum -= SPAWN_INTERVAL
        this.spawnBatch()
      }
    }
  }

  private spawnBatch() {
    const len = this.activeEdgeIndices.length
    if (len === 0) return

    // Round-robin: start from the cursor and wrap around
    // This ensures all edges get fair particle coverage over time
    let spawned = 0
    const maxSpawnPerBatch = Math.min(len, 8) // cap spawns per batch for budget

    for (let step = 0; step < len && spawned < maxSpawnPerBatch; step++) {
      const i = (this.spawnCursor + step) % len
      if (this.particles.length >= MAX_PARTICLES) break

      const edgeIdx = this.activeEdgeIndices[i]
      const edge = this.edges[edgeIdx]
      const config = EDGE_TYPE_TO_PARTICLE.get(edge.type)
      if (!config) continue

      // Check spawn timer for this edge
      this.spawnTimers[i] -= SPAWN_INTERVAL
      if (this.spawnTimers[i] > 0) continue
      this.spawnTimers[i] = SPAWN_INTERVAL * (0.8 + Math.random() * 0.4)

      // Spawn 'density' particles per edge, staggered
      const src = this.nodePositions.get(edge.source)
      const tgt = this.nodePositions.get(edge.target)
      if (!src || !tgt) continue

      for (let d = 0; d < config.density; d++) {
        const progress = d / config.density // stagger across edge
        this.particles.push({
          edgeIdx,
          progress,
          speed: 1 / config.duration,
          config,
          sx: src.x, sy: src.y,
          tx: tgt.x, ty: tgt.y,
          x: src.x + (tgt.x - src.x) * progress,
          y: src.y + (tgt.y - src.y) * progress,
          fadeOut: 0,
          alive: true,
        })
      }
      spawned++
    }

    // Advance cursor for next batch
    this.spawnCursor = (this.spawnCursor + spawned) % len
  }

  // ─── Render ───

  /** Draw all particles. Context must already have the pan/zoom transform applied. */
  render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'

    for (const p of this.particles) {
      if (!p.alive) continue

      const cfg = p.config
      // Compute alpha: full during travel, fading after arrival
      const alpha = p.progress < 1
        ? cfg.opacity
        : cfg.opacity * Math.max(0, p.fadeOut / FADE_OUT_DURATION)

      if (alpha < 0.01) continue

      // Draw tail (fading line from slightly behind current position)
      if (cfg.tailLength > 0) {
        const tailProgress = Math.max(0, p.progress - cfg.tailLength * p.speed * cfg.duration)
        const tailX = p.sx + (p.tx - p.sx) * tailProgress
        const tailY = p.sy + (p.ty - p.sy) * tailProgress

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(p.x, p.y)
        ctx.strokeStyle = cfg.color
        ctx.lineWidth = cfg.radius * 0.6
        ctx.globalAlpha = alpha * 0.35
        ctx.stroke()
      }

      // Draw glow texture (pre-rendered radial gradient)
      if (cfg.glowIntensity > 0) {
        const tex = getGlowTexture(cfg.color, cfg.radius)
        const drawSize = cfg.radius * 4
        ctx.globalAlpha = alpha * cfg.glowIntensity
        ctx.drawImage(tex, p.x - drawSize / 2, p.y - drawSize / 2, drawSize, drawSize)
      }

      // Draw core dot
      ctx.globalAlpha = alpha
      ctx.fillStyle = cfg.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, cfg.radius, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  /** Get current particle count */
  get count(): number {
    return this.particles.length
  }

  /** Reset: clear all particles and spawn timers */
  reset() {
    this.particles = []
    this.spawnAccum = 0
    glowCache.clear()
  }
}
