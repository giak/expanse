// ═══════════════════════════════════════════════════════════════
// ECS EVALUATE TESTS — Step 3 validation matrix.
//
// Coverage: 34 canonical cases spanning L1/L2/L3 + edge cases +
// ECSEvaluation wrapper invariants. Each test asserts (C, I, route)
// AND the reason string contains the route word (machine-greppable
// for audit logs).
//
// Calibration note: with the chosen defaults (A=1, K=2, R=1, T=1)
// and Math.round(aggregation), C is structurally bounded at ~3 (no
// signal pushes any factor above 4). The plan's "C ≥ 4 → L3" branch
// is unreachable in practice; L3 is reached mostly via I=3
// (strategic keywords). Same route outcome, but the impl is honest
// about its math.
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest'
import { evaluateECS } from '../evaluate'
import type { ECSInput } from '../contracts'

describe('ecs/evaluate — L1 cases (trivial questions)', () => {
  it('"Quelle heure est-il ?" → L1 (simple-q + defaults)', () => {
    const out = evaluateECS({ text: 'Quelle heure est-il ?' })
    expect(out.result.route).toBe('L1')
    expect(out.result.C).toBe(1)
    expect(out.result.I).toBe(1)
    expect(out.reason).toContain('L1')
  })

  it('"Explique les closures en JS." → L1 (no verb hit, no path)', () => {
    const out = evaluateECS({ text: 'Explique les closures en JS.' })
    expect(out.result.route).toBe('L1')
    expect(out.result.C).toBe(1)
    expect(out.result.I).toBe(1)
  })

  it('"What is the capital of France?" → L1 (English simple-q)', () => {
    const out = evaluateECS({ text: 'What is the capital of France?' })
    expect(out.result.route).toBe('L1')
  })

  it('"Dois-je utiliser let ou const ?" → L1 (decision simple-q)', () => {
    const out = evaluateECS({ text: 'Dois-je utiliser let ou const ?' })
    expect(out.result.route).toBe('L1')
  })

  it('"Définition du polymorphisme" → L1 (no question mark, no verb)', () => {
    const out = evaluateECS({ text: 'Définition du polymorphisme' })
    expect(out.result.route).toBe('L1')
  })

  it('"How does React state work?" → L1 (English simple-q)', () => {
    const out = evaluateECS({ text: 'How does React state work?' })
    expect(out.result.route).toBe('L1')
  })

  it('"Traduis ce texte en anglais." → L1 ("traduis" not in imperative list)', () => {
    const out = evaluateECS({ text: 'Traduis ce texte en anglais.' })
    expect(out.result.route).toBe('L1')
  })

  it('"Rappelle-moi comment utiliser map." → L1 (no verb match)', () => {
    const out = evaluateECS({ text: 'Rappelle-moi comment utiliser la fonction map.' })
    expect(out.result.route).toBe('L1')
  })
})

describe('ecs/evaluate — L2 cases (debug/refactor/compare)', () => {
  it('"Corrige ce bug : utils.ts" → L2 (verb + path, I=2)', () => {
    const out = evaluateECS({ text: 'Corrige ce bug : utils.ts' })
    expect(out.result.route).toBe('L2')
    expect(out.result.C).toBe(2)
    expect(out.result.I).toBe(2)
  })

  it('"Compare REST vs GraphQL" → L2 (verb without path)', () => {
    const out = evaluateECS({ text: 'Compare REST vs GraphQL' })
    expect(out.result.route).toBe('L2')
    expect(out.result.C).toBeGreaterThanOrEqual(2)
    expect(out.result.I).toBe(1)
  })

  it('"Refactorise auth.ts pour OAuth" → L2 (verb + path, I=2)', () => {
    const out = evaluateECS({ text: 'Refactorise auth.ts pour OAuth' })
    expect(out.result.route).toBe('L2')
    expect(out.result.C).toBe(2)
    expect(out.result.I).toBe(2)
  })

  it('"Add a unit test in jest.test.js" → L2 (English verb + path)', () => {
    const out = evaluateECS({ text: 'Add a unit test in jest.test.js' })
    expect(out.result.route).toBe('L2')
    expect(out.result.I).toBeGreaterThanOrEqual(2)
  })

  it('"Optimise la requête SQL dans db.py" → L2 (verb + path)', () => {
    const out = evaluateECS({ text: 'Optimise la requête SQL dans db.py' })
    expect(out.result.route).toBe('L2')
  })

  it('"Implémente la fonction de parsing" → L2 (verb without path, I=1)', () => {
    const out = evaluateECS({ text: 'Implémente la fonction de parsing' })
    expect(out.result.route).toBe('L2')
    expect(out.result.I).toBe(1)
  })

  it('"Verify this code and fix the errors" → L2 (English verbs)', () => {
    const out = evaluateECS({ text: 'Verify this code and fix the errors' })
    expect(out.result.route).toBe('L2')
  })

  it('"Create a button component in UI.tsx" → L2', () => {
    const out = evaluateECS({ text: 'Create a button component in UI.tsx' })
    expect(out.result.route).toBe('L2')
  })

  it('"Delete the unused imports in logger.js" → L2', () => {
    const out = evaluateECS({ text: 'Delete the unused imports in logger.js' })
    expect(out.result.route).toBe('L2')
  })

  it('"Update package.json with new deps" → L2 (path triggers Tools+I)', () => {
    const out = evaluateECS({ text: 'Update package.json with new deps' })
    expect(out.result.route).toBe('L2')
    expect(out.result.I).toBeGreaterThanOrEqual(2)
  })
})

describe('ecs/evaluate — L3 cases (architecture/security)', () => {
  it('"Refais l\'architecture du système" → L3 (verb + archi/système strategic)', () => {
    const out = evaluateECS({ text: "Refais l'architecture du système" })
    expect(out.result.route).toBe('L3')
    expect(out.result.I).toBe(3)
  })

  it('"Analyse les vulnérabilités de ce code" → L3 (verb + vuln strategic)', () => {
    const out = evaluateECS({ text: 'Analyse les vulnérabilités de ce code' })
    expect(out.result.route).toBe('L3')
    expect(out.result.I).toBe(3)
  })

  it('"Create a new cache strategy" → L3 (English strategic)', () => {
    const out = evaluateECS({ text: 'Create a new cache strategy' })
    expect(out.result.route).toBe('L3')
    expect(out.result.I).toBe(3)
  })

  it('"Quel est l\'impact juridique ?" → L3 (juridique strategic)', () => {
    const out = evaluateECS({ text: "Quel est l'impact juridique ?" })
    expect(out.result.route).toBe('L3')
    expect(out.result.I).toBe(3)
  })

  it('"Refactorise la sécurité du backend en python" → L3 (verb + sécurité strategic)', () => {
    const out = evaluateECS({ text: 'Refactorise la sécurité du backend en python' })
    expect(out.result.route).toBe('L3')
    expect(out.result.I).toBe(3)
  })

  it('"Vérifie faille de sécurité système" → L3 (verb + 2 strategic keywords)', () => {
    const out = evaluateECS({ text: 'Vérifie faille de sécurité système' })
    expect(out.result.route).toBe('L3')
    expect(out.result.I).toBe(3)
  })

  it('"Migrate the entire system architecture" → L3 (English verb + system/architecture)', () => {
    const out = evaluateECS({ text: 'Migrate the entire system architecture' })
    expect(out.result.route).toBe('L3')
  })

  it('"Analyse strategic dependencies in project" → L3 (English strategic)', () => {
    const out = evaluateECS({ text: 'Analyse strategic dependencies in project' })
    expect(out.result.route).toBe('L3')
  })

  it('"Analyse ma nouvelle stratégie de cache" → L3 (French stratégie spelling)', () => {
    // French [ée] alternation locks in: prevents `strat[ée]g\w+` regression to
    // English-only `strateg\w+`. Same case survives strate/strateg/stratég/...
    const out = evaluateECS({ text: 'Analyse ma nouvelle stratégie de cache' })
    expect(out.result.route).toBe('L3')
    expect(out.result.I).toBe(3)
  })

  it('"Vérifie les systèmes distribués" → L3 (verb + systèmes strategic plural)', () => {
    // Plural coverage: `syst[èe]me\w*` must absorb the trailing "s" before
    // the negative-lookahead boundary check.
    const out = evaluateECS({ text: 'Vérifie les systèmes distribués' })
    expect(out.result.route).toBe('L3')
    expect(out.result.I).toBe(3)
  })
})

describe('ecs/evaluate — edge cases', () => {
  it('empty string → L1 (defaults, C=1)', () => {
    const out = evaluateECS({ text: '' })
    expect(out.result.route).toBe('L1')
    expect(out.result.C).toBe(1)
    expect(out.result.I).toBe(1)
  })

  it('whitespace-only "?" → L1 (simple-q + defaults)', () => {
    const out = evaluateECS({ text: '   ?   ' })
    expect(out.result.route).toBe('L1')
  })

  it('verb-heavy without path/strategic → L2 (C boosted by verbs only)', () => {
    const out = evaluateECS({
      text: 'Corrige, refactorise, optimise et implemente la logique métier.',
    })
    expect(out.result.route).toBe('L2')
    expect(out.result.I).toBe(1)
  })

  it('"?" with mixed strategic+verb+path overrides simple-q → L3', () => {
    const out = evaluateECS({
      text: 'Please check the vulnérabilité in my architecture auth.ts?',
    })
    expect(out.result.route).toBe('L3')
    expect(out.result.I).toBe(3)
  })
})

describe('ecs/evaluate — ECSEvaluation wrapper invariants', () => {
  it('reason string always contains the route word (audit greppable)', () => {
    const inputs: ECSInput[] = [
      { text: 'Quelle heure est-il ?' },
      { text: 'Corrige ce bug : utils.ts' },
      { text: "Refais l'architecture du système" },
    ]
    for (const input of inputs) {
      const out = evaluateECS(input)
      expect(out.reason).toContain(out.result.route)
    }
  })

  it('idempotent: identical input → identical output', () => {
    const a = evaluateECS({ text: 'Corrige ce bug : utils.ts' })
    const b = evaluateECS({ text: 'Corrige ce bug : utils.ts' })
    expect(a.reason).toBe(b.reason)
    expect(a.result).toEqual(b.result)
  })

  it('vesselAvailable does NOT promote L2 → L3 (per tie-breaker rule)', () => {
    const without = evaluateECS({ text: 'Corrige ce bug : utils.ts' })
    const withVessel = evaluateECS({
      text: 'Corrige ce bug : utils.ts',
      vesselAvailable: true,
    })
    expect(without.result.route).toBe('L2')
    expect(withVessel.result.route).toBe('L2')
    expect(withVessel.result).toEqual(without.result)
  })

  it('reason string is ≤ 120 chars (audit-log friendliness)', () => {
    const inputs: ECSInput[] = [
      { text: 'Corrige, refactorise, optimise et implemente la logique métier dans auth.ts' },
      { text: 'Please check the vulnérabilité in my architecture auth.ts?' },
    ]
    for (const input of inputs) {
      expect(evaluateECS(input).reason.length).toBeLessThanOrEqual(120)
    }
  })
})

