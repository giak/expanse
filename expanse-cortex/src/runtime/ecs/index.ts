// ─── ECS submodule — evaluateECS pure function (Step 3) ───
// Logic implemented in ecs/evaluate.ts. This barrel re-exports both
// the contracts AND the implementation so consumers can:
//   `import type { ECSInput, ECSEvaluation } from '@/runtime/ecs'`
//   `import { evaluateECS } from '@/runtime/ecs'`
export * from './contracts'
export { evaluateECS } from './evaluate'
