// ─── Export PNG ───
// Phase 3: Captures the current SVG view + canvas overlay as a PNG file.
// Renders manually to an offscreen canvas to bypass cross-origin restrictions
// on html2canvas and produce high-quality output with the dark background.

import { useCallback } from 'react'
import { logger } from '../../utils/logger'

interface ExportPNGProps {
  /** SVG element ref to capture */
  svgRef: React.RefObject<SVGSVGElement | null>
  /** Canvas overlay ref (particles) — optional */
  canvasRef?: React.RefObject<HTMLCanvasElement | null>
  /** Filename prefix */
  filename?: string
}

export function useExportPNG({ svgRef, canvasRef, filename = 'expanse-cortex' }: ExportPNGProps) {
  const exportPNG = useCallback(() => {
    const svg = svgRef.current
    if (!svg) return

    const width = window.innerWidth
    const height = window.innerHeight
    const dpr = window.devicePixelRatio || 1

    // Create offscreen canvas at full resolution
    const offscreen = document.createElement('canvas')
    offscreen.width = width * dpr
    offscreen.height = height * dpr
    const ctx = offscreen.getContext('2d')
    if (!ctx) return

    // Scale for device pixel ratio
    ctx.scale(dpr, dpr)

    // 1. Dark background — must use raw hex, Canvas 2D cannot resolve CSS custom properties
    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0, 0, width, height)

    // 2. Render SVG content via manual drawing (avoid serializeToString issues)
    // We use the SVG as an image source instead of serializing to data URI
    // which can fail with external stylesheets and CSS animations
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)

    const svgImg = new Image()
    svgImg.onload = () => {
      ctx.drawImage(svgImg, 0, 0, width, height)
      URL.revokeObjectURL(svgUrl)

      // 3. Overlay particle canvas if available
      const particleCanvas = canvasRef?.current
      if (particleCanvas) {
        ctx.drawImage(particleCanvas, 0, 0, width, height)
      }

      // 4. Export as PNG
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')
      link.download = `${filename}-${timestamp}.png`
      link.href = offscreen.toDataURL('image/png')
      link.click()
    }
    svgImg.onerror = () => {
      // Fallback: just export the canvas without SVG if image loading fails
      URL.revokeObjectURL(svgUrl)

      const particleCanvas = canvasRef?.current
      if (particleCanvas) {
        ctx.drawImage(particleCanvas, 0, 0, width, height)
      }

      const link = document.createElement('a')
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')
      link.download = `${filename}-${timestamp}.png`
      link.href = offscreen.toDataURL('image/png')
      link.click()
    }
    svgImg.src = svgUrl
  }, [svgRef, canvasRef, filename])

  return { exportPNG }
}

// ─── HTML Export Hook ───
// For views that are pure HTML (no SVG), uses html2canvas to capture the DOM.

interface ExportHTMLProps {
  /** HTML element ref to capture */
  htmlRef: React.RefObject<HTMLDivElement | null>
  /** Filename prefix */
  filename?: string
}

export function useExportHTML({ htmlRef, filename = 'expanse-cortex' }: ExportHTMLProps) {
  const exportPNG = useCallback(async () => {
    const el = htmlRef.current
    if (!el) return

    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(el, {
        backgroundColor: '#0a0a0f', // html2canvas cannot resolve CSS custom properties
        scale: window.devicePixelRatio || 1,
        logging: false,
        useCORS: true,
      })

      const link = document.createElement('a')
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')
      link.download = `${filename}-${timestamp}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      logger.error('Export HTML failed:', err)
    }
  }, [htmlRef, filename])

  return { exportPNG }
}

// ─── Export Button Component ───
// Small button that can be placed in any view to trigger PNG export

interface ExportButtonProps {
  onClick: () => void
}

export function ExportButton({ onClick }: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mantle/80 backdrop-blur-md border border-white/10 text-overlay0 text-xs font-medium hover:bg-base hover:text-blue hover:border-blue/30 transition-all duration-200 cursor-pointer"
      title="Exporter en PNG"
    >
      <span className="text-xs">📷</span>
      <span>PNG</span>
    </button>
  )
}
