// ══════════════════════════════════════════════════════════════
// STRATEGIES INDEX — aggregates all domain strategies into ALL_STRATEGIES
// ══════════════════════════════════════════════════════════════
// Each strategy declares its own `layer` field — the registry/index.ts
// handles layer grouping via groupByLayer(). No manual .filter() here.

import type { EffectStrategy } from '../types'
import { BOOT_STRATEGIES } from './boot'
import { MCP_STRATEGIES } from './mcp'
import { ECS_STRATEGIES } from './ecs'
import { AUDIT_STRATEGIES } from './audit'
import { SECURITY_STRATEGIES } from './security'
import { HALLUCINATION_STRATEGIES } from './hallucination'
import { DREAM_STRATEGIES } from './dream'
import { FOREGROUND_STRATEGIES } from './foreground'

export const ALL_STRATEGIES: EffectStrategy[] = [
  ...BOOT_STRATEGIES,
  ...MCP_STRATEGIES,
  ...ECS_STRATEGIES,
  ...AUDIT_STRATEGIES,
  ...SECURITY_STRATEGIES,
  ...HALLUCINATION_STRATEGIES,
  ...DREAM_STRATEGIES,
  ...FOREGROUND_STRATEGIES,
]
