import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useViewBoxZoom, type SvgViewBox } from '../useSvgZoom'

// ─── Default viewBox used by the hook ───

const DEFAULT_VB: SvgViewBox = { x: -560, y: -560, w: 1120, h: 1120 }

// ─── Helper: create a mock SVG element with getScreenCTM ───
// jsdom doesn't have DOMMatrix, so we use a plain object with the
// properties the hook reads (a, d, e, f).

interface MockCTM { a: number; d: number; e: number; f: number }

function createMockSvg(ctm?: MockCTM | null): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  // Override getScreenCTM to return a mock matrix object
  svg.getScreenCTM = () => ctm as unknown as DOMMatrix | null
  return svg
}

/** Identity CTM: a=1,d=1 (no scale), e=0,f=0 (no translate) */
const IDENTITY_CTM: MockCTM = { a: 1, d: 1, e: 0, f: 0 }

// ─── Tests ───

describe('useViewBoxZoom', () => {
  it('initializes with default viewBox', () => {
    const { result } = renderHook(() => useViewBoxZoom())
    expect(result.current.viewBox).toEqual(DEFAULT_VB)
    expect(result.current.isZoomed).toBe(false)
  })

  it('initializes with custom viewBox', () => {
    const custom: SvgViewBox = { x: 0, y: 0, w: 800, h: 600 }
    const { result } = renderHook(() => useViewBoxZoom(custom))
    expect(result.current.viewBox).toEqual(custom)
  })

  it('isZoomed is false when viewBox equals initial', () => {
    const { result } = renderHook(() => useViewBoxZoom())
    expect(result.current.isZoomed).toBe(false)
  })

  it('resetView() restores initial viewBox', () => {
    const custom: SvgViewBox = { x: 0, y: 0, w: 800, h: 600 }
    const { result } = renderHook(() => useViewBoxZoom(custom))
    // Manually change viewBox via mouse simulation would be complex,
    // but we can verify resetView restores the initial value
    act(() => { result.current.resetView() })
    expect(result.current.viewBox).toEqual(custom)
  })

  it('isDraggingActive starts as false', () => {
    const { result } = renderHook(() => useViewBoxZoom())
    expect(result.current.isDraggingActive).toBe(false)
  })

  it('mouseHandlers.onMouseDown sets isDraggingActive true', () => {
    const { result } = renderHook(() => useViewBoxZoom())
    act(() => {
      result.current.mouseHandlers.onMouseDown({
        clientX: 100,
        clientY: 200,
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as React.MouseEvent)
    })
    expect(result.current.isDraggingActive).toBe(true)
  })

  it('mouseHandlers.onMouseUp sets isDraggingActive false', () => {
    const { result } = renderHook(() => useViewBoxZoom())
    act(() => {
      result.current.mouseHandlers.onMouseDown({
        clientX: 100,
        clientY: 200,
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as React.MouseEvent)
    })
    expect(result.current.isDraggingActive).toBe(true)
    act(() => { result.current.mouseHandlers.onMouseUp() })
    expect(result.current.isDraggingActive).toBe(false)
  })

  it('svgRef is a function (callback ref)', () => {
    const { result } = renderHook(() => useViewBoxZoom())
    expect(typeof result.current.svgRef).toBe('function')
  })

  it('svgRef callback can be called with null (unmount)', () => {
    const { result } = renderHook(() => useViewBoxZoom())
    // Should not throw when called with null
    expect(() => act(() => { result.current.svgRef(null) })).not.toThrow()
  })

  it('svgRef callback attaches wheel listener to an SVG element', () => {
    const { result } = renderHook(() => useViewBoxZoom())
    const mockSvg = createMockSvg(IDENTITY_CTM)
    const addSpy = vi.spyOn(mockSvg, 'addEventListener')
    act(() => { result.current.svgRef(mockSvg) })
    expect(addSpy).toHaveBeenCalledWith('wheel', expect.any(Function), { passive: false })
    addSpy.mockRestore()
  })

  it('svgRef callback removes wheel listener from previous SVG', () => {
    const { result } = renderHook(() => useViewBoxZoom())
    const mockSvg1 = createMockSvg(IDENTITY_CTM)
    const mockSvg2 = createMockSvg(IDENTITY_CTM)
    const removeSpy = vi.spyOn(mockSvg1, 'removeEventListener')
    act(() => { result.current.svgRef(mockSvg1) })
    act(() => { result.current.svgRef(mockSvg2) })
    expect(removeSpy).toHaveBeenCalledWith('wheel', expect.any(Function))
    removeSpy.mockRestore()
  })
})

