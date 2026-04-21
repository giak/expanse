import { describe, it, expect } from 'vitest'
import { hasEffect } from '../visualEffects'
import type { ProcessStep, VisualEffect } from '../../types/signal'

describe('hasEffect', () => {
  it('returns false for null step', () => {
    expect(hasEffect(null, 'resonance-pulse')).toBe(false)
  })

  it('returns false for step without visualEffects', () => {
    const step: ProcessStep = { organ: 'Ψ', label: 'test', duration: 1000 }
    expect(hasEffect(step, 'resonance-pulse')).toBe(false)
  })

  it('returns false for step with visualEffects but not the requested one', () => {
    const step: ProcessStep = {
      organ: 'Ψ', label: 'test', duration: 1000,
      visualEffects: ['guard-shield' as VisualEffect],
    }
    expect(hasEffect(step, 'resonance-pulse')).toBe(false)
  })

  it('returns true when effect is present', () => {
    const step: ProcessStep = {
      organ: 'Ψ', label: 'test', duration: 1000,
      visualEffects: ['resonance-pulse' as VisualEffect],
    }
    expect(hasEffect(step, 'resonance-pulse')).toBe(true)
  })

  it('returns true when effect is among multiple effects', () => {
    const step: ProcessStep = {
      organ: 'Ψ', label: 'test', duration: 1000,
      visualEffects: ['guard-shield' as VisualEffect, 'audit-loop' as VisualEffect, 'resonance-pulse' as VisualEffect],
    }
    expect(hasEffect(step, 'audit-loop')).toBe(true)
  })

  it('narrows type when true (type guard)', () => {
    const step: ProcessStep | null = {
      organ: 'Ψ', label: 'test', duration: 1000,
      visualEffects: ['resonance-pulse' as VisualEffect],
    }
    if (hasEffect(step, 'resonance-pulse')) {
      // TypeScript should know step.visualEffects is defined here
      expect(step.visualEffects.length).toBe(1)
    }
  })
})
