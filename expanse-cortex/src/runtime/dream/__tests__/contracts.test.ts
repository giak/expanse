import { describe, it, expect } from 'vitest'
import type { DreamConfig, RunDreamJob } from '../contracts'
import type { DreamReport, MutationProposal } from '../../types'

describe('dream/contracts', () => {
  it('barrel re-exports the contract types from dream/index', async () => {
    const barrel = await import('../index')
    expect(barrel).toBeDefined()
    const sample: DreamConfig = { dryRun: true }
    expect(sample.dryRun).toBe(true)
  })

  it('DreamConfig fields are all optional (defaults applied at impl layer)', () => {
    const minimal: DreamConfig = {} // empty config is valid
    expect(minimal.dryRun).toBeUndefined()
    expect(minimal.maxTraceTokens).toBeUndefined()
    expect(minimal.timestampOverride).toBeUndefined()
  })

  it('DreamConfig supports dryRun, maxTraceTokens, timestampOverride', () => {
    const full: DreamConfig = {
      dryRun: true,
      maxTraceTokens: 500,
      timestampOverride: '2026-07-02T10:00:00Z',
    }
    expect(full.dryRun).toBe(true)
    expect(full.maxTraceTokens).toBe(500)
    expect(full.timestampOverride).toContain('2026')
  })

  it('RunDreamJob signature compiles and returns a DreamReport-shaped Promise', async () => {
    // Toy runDreamJob for compile-time + signature verification only.
    const sampleJob: RunDreamJob = async (config) => {
      const isDry = config?.dryRun ?? false
      const proposal: MutationProposal = {
        slug: isDry ? 'dry-run-proposal' : 'live-proposal',
        type: 'rule',
        description: 'dry-run generated' + (isDry ? '' : ' (live)'),
        trace_ref: 'trace-fake',
        change: 'add',
        validation_test: 'S14 on 3 tasks',
      }
      const report: DreamReport = {
        timestamp: config?.timestampOverride ?? new Date().toISOString(),
        traces_collected: 0,
        drifts_collected: 0,
        mutations_proposed: isDry ? [] : [proposal],
        mutations_rejected: isDry ? [proposal] : [],
        traces_consumed: [],
      }
      return report
    }
    const dryReport = await sampleJob({ dryRun: true })
    expect(dryReport.mutations_proposed).toHaveLength(0)
    expect(dryReport.mutations_rejected).toHaveLength(1)
    expect(dryReport.mutations_rejected[0].slug).toBe('dry-run-proposal')

    const liveReport = await sampleJob()
    expect(liveReport.mutations_proposed).toHaveLength(1)
    expect(liveReport.mutations_proposed[0].type).toBe('rule')
  })

  it('DreamReport has all required fields (timestamp + counts + mutations)', () => {
    const report: DreamReport = {
      timestamp: '2026-07-02T10:00:00Z',
      traces_collected: 5,
      drifts_collected: 1,
      mutations_proposed: [],
      mutations_rejected: [],
      traces_consumed: ['t1', 't2', 't3'],
    }
    expect(report.traces_collected).toBe(5)
    expect(report.traces_consumed).toHaveLength(3)
  })

  it('RunDreamJob accepts no config (all-optional contract)', async () => {
    const sampleJob: RunDreamJob = async () => ({
      timestamp: '2026-07-02T10:00:00Z',
      traces_collected: 0,
      drifts_collected: 0,
      mutations_proposed: [],
      mutations_rejected: [],
      traces_consumed: [],
    })
    const out = await sampleJob()
    expect(out.traces_collected).toBe(0)
  })
})
