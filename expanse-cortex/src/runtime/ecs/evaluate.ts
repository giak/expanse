// ══════════════════════════════════════════════════════════════
// ECS EVALUATION — Step 3 of the reconstruction plan.
//
// Deterministic pure function replacing LLM-internal judgment with
// regex + arithmetic. Contract: `(input: ECSInput) => ECSEvaluation`
// (see ./contracts for shapes).
//
// Heuristics ported from the plan doc Step 3 (V15 §Ⅰ calibration,
// audit §8.1 — eliminator of self-eval bias).
//
// Decision matrix:
//   C aggregation: round(mean(Ambiguity, Knowledge, Reasoning, Tools))
//   Route:        L3 if C ≥ 4 OR I = 3 ; else L1 if C < 2 AND I = 1 ; else L2
//
// Test matrix: see __tests__/evaluate.test.ts (30+ canonical cases).
//
// Note: vesselAvailable is informational only — it does NOT promote
// a borderline L2 to L3. Routing is intrinsic to the request, not
// to available instrumentation. Step 5 (prompt distillation) will
// consume vesselAvailable separately for tie-breaker logic.
// ══════════════════════════════════════════════════════════════

import type { ECSInput, ECSEvaluation } from './contracts'
import type { ECSResult, ECSRoute } from '../types'

// ─── Heuristic triggers (regex-driven, case-insensitive) ───────

/** Detects file paths in code/config extensions. Boosts Tools ≥ 3 AND I ≥ 2.
 *  ASCII-only extensions, so `\b` works without Unicode property escape. */
const PATH_REGEX = /[a-z_][a-z0-9_-]*\.(ts|js|tsx|jsx|py|md|json|ya?ml|toml|css|scss|html)\b/i

/** Strategic / irreversible keywords. Boosts Reasoning ≥ 4 AND I = 3.
 *  Why negative lookaround + `\p{L}` instead of `\b`:
 *    - JS `\b` is ASCII-only by default, AND even with `/u` flag, the
 *      engine doesn't reliably recognize é/è as `\w` for boundary
 *      detection. So `\bsécurité\b` silently misses when followed by a
 *      space (verified empirically in Node 22). Real fix is explicit
 *      Unicode letter class via `\p{L}` with negative lookbehind/
 *      lookahead so accented French keywords behave as whole words.
 *  `strat[ée]g\w+` covers BOTH English (strategy/strategic/strategies
 *  via `strat`+`e`+`g`+word) AND French (stratégie/stratégique/
 *  stratégies via `strat`+`é`+`g`+word). The literal "i" is correctly
 *  eaten by `\w+` (works for English "y" too). */
const STRATEGIC_REGEX =
  /(?<![\p{L}\p{N}_])(archi\w*|strat[ée]g\w+|juridi\w*|syst[èe]me\w*|vuln[ée]rabilit[ée]\w*|s[ée]curit[ée]\w*)(?![\p{L}\p{N}_])/iu

/** Imperative verbs (French + English). Boosts Reasoning ≥ 3.
 *  Final `\w*` catches conjugation/plural: corrige/corriges/corrigé…
 *  Same Unicode-property-class boundary technique as STRATEGIC_REGEX
 *  (necessary because some French verbs end in é/è: cr[ée]\w*, etc.). */
const VERB_REGEX =
  /(?<![\p{L}\p{N}_])(corrige|refactoris\w*|refais|optimis\w*|analys\w*|cr[ée]\w*|g[ée]n[èe]r\w*|impl[ée]ment\w*|document\w*|ajout\w*|supprim\w*|rempla[cç]\w*|v[ée]rif\w*|compar\w*|fix\w*|refactor\w*|optimiz\w*|analyz\w*|creat\w*|generat\w*|implement\w*|add\w*|delet\w*|remov\w*|replac\w*|verif\w*|check\w*|migrat\w*)(?![\p{L}\p{N}_])/iu

// ─── Default factor values (when no signal triggers a booster) ─

/** When no signal: mean = (1+2+1+1)/4 = 1.25 → round → 1 (L1 baseline). */
const DEFAULT_A = 1 // Ambiguity — single sentence ⇒ 1
const DEFAULT_K = 2 // Knowledge — domain noun present ⇒ 2
const DEFAULT_R = 1 // Reasoning — no imperative + no strategy ⇒ 1
const DEFAULT_T = 1 // Tools — no path ⇒ 1

// ─── evaluateECS — deterministic evaluator ────────────────────

export function evaluateECS(input: ECSInput): ECSEvaluation {
  const text = input.text ?? ''

  // 1. Signal detection (single regex pass per category)
  const pathHit = PATH_REGEX.test(text)
  const strategicHit = STRATEGIC_REGEX.test(text)
  const verbHit = VERB_REGEX.test(text)
  const isSimpleQ =
    text.trim().endsWith('?') && !verbHit && !pathHit && !strategicHit

  // 2. Per-factor boosters (max wins — sequential, locally applied).
  // A and K are never reassigned → const; R/T may be boosted below.
  const A = DEFAULT_A // Ambiguity baseline
  const K = DEFAULT_K // Knowledge baseline
  let R = DEFAULT_R // Reasoning — boosted by verb + strategic hits
  let T = DEFAULT_T // Tools — boosted by path hits
  if (pathHit) T = Math.max(T, 3)
  if (strategicHit) R = Math.max(R, 4)
  if (verbHit) R = Math.max(R, 3)

  // 3. Aggregate C (mean, rounded to nearest integer)
  let C = Math.round((A + K + R + T) / 4)

  // 4. C-level modifier (simple-question reduction, applied last)
  const cClues: string[] = []
  if (isSimpleQ) {
    C = Math.max(1, C - 1)
    cClues.push('simple-q(-1)')
  }
  if (verbHit) cClues.push('verb:R3')
  if (strategicHit) cClues.push('archi:R4')
  if (pathHit) cClues.push('path:T3')
  if (cClues.length === 0) cClues.push('default')

  // 5. Compute I (cumulative boosters, then C-based lift)
  let I = 1
  let iClue = 'default'
  if (pathHit) {
    I = Math.max(I, 2)
    iClue = 'path→I=2'
  }
  if (strategicHit) {
    I = 3
    iClue = 'strategic→I=3'
  }
  if (C >= 4 && I < 2) {
    I = Math.max(I, 2)
    iClue += '+C≥4'
  }

  // 6. Determine route (L3 first — short-circuit on either trigger)
  const route: ECSRoute =
    C >= 4 || I === 3 ? 'L3' : C < 2 && I === 1 ? 'L1' : 'L2'

  // 7. Compose deterministic reason string (always ≤ 80 chars,
  //    always contains the route word)
  const reason = `Route ${route}, C=${C} (${cClues.join(',')}), I=${I} (${iClue})`

  const result: ECSResult = { C, I, route }
  return { result, reason }
}
