import { describe, it, expect } from 'vitest'
import { colorAlpha } from '../colorAlpha'

describe('colorAlpha', () => {
  it('appends alpha hex suffix to raw hex colors', () => {
    expect(colorAlpha('#89b4fa', 0x12)).toBe('#89b4fa12')
    expect(colorAlpha('#f38ba8', 0x20)).toBe('#f38ba820')
  })

  it('pads single-digit alpha hex with leading zero', () => {
    expect(colorAlpha('#89b4fa', 0x0a)).toBe('#89b4fa0a')
    expect(colorAlpha('#89b4fa', 0x05)).toBe('#89b4fa05')
  })

  it('uses color-mix() for var() references', () => {
    expect(colorAlpha('var(--color-blue)', 0x12)).toBe(
      'color-mix(in srgb, var(--color-blue) 7%, transparent)'
    )
    expect(colorAlpha('var(--color-red)', 0x20)).toBe(
      'color-mix(in srgb, var(--color-red) 13%, transparent)'
    )
  })

  it('handles 0% alpha (fully transparent)', () => {
    expect(colorAlpha('#89b4fa', 0x00)).toBe('#89b4fa00')
    expect(colorAlpha('var(--color-blue)', 0x00)).toBe(
      'color-mix(in srgb, var(--color-blue) 0%, transparent)'
    )
  })

  it('handles 100% alpha (fully opaque)', () => {
    expect(colorAlpha('#89b4fa', 0xff)).toBe('#89b4faff')
    expect(colorAlpha('var(--color-blue)', 0xff)).toBe(
      'color-mix(in srgb, var(--color-blue) 100%, transparent)'
    )
  })

  it('handles common alpha values correctly', () => {
    // 0x26 ≈ 15% (used for negative badge fill)
    expect(colorAlpha('var(--color-red)', 0x26)).toBe(
      'color-mix(in srgb, var(--color-red) 15%, transparent)'
    )
    // 0x66 ≈ 40% (used for ghost organ fill)
    expect(colorAlpha('var(--color-base)', 0x66)).toBe(
      'color-mix(in srgb, var(--color-base) 40%, transparent)'
    )
  })
})
