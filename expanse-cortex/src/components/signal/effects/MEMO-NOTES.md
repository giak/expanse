# React.memo — Effect Component Notes

All effect components in this directory are wrapped in `React.memo` for
**pause-time optimization**: during active animation `progress` changes every
frame (60 fps) so memo never skips — the benefit is during pauses and when
the parent re-renders for unrelated reasons (e.g. `canvasHighlight` change).

## Prop Stability Categories

### A. Primitive-only props
**Pattern:** `x`, `y`, `color`, `progress`, `label`, `toolType`, `season`,
`level`, `converging`, `open`, `dense`, `proposalCount`, `targetPercent`, etc.

Default shallow comparison (`===`) is sufficient — primitives are equal by
value. `progress` changes every frame during animation (correctly triggers
re-renders).

**Components:** ActivationShockwave, BlockWall, ConfianceGauge,
ConstitutionalGuard, DreamGate, FirstLight, FogPatch, FreshTraceMark,
GrepBeam, GuardShield, HealthcheckDisplay, IncarnationBurst, LOSTStamp,
MCPRadarPing, MutationOrbit, OutputComparison, OuvrierShadow, ProposalBloom,
PruneShears, QuestionMarkShield, RedAlert, SeasonCycle, ToolFlash,
TriPoleOrbit, VesselRadar

### B. Position props from organPositions
**Pattern:** `psiPos`, `phiPos`, `sigmaPos`, `muPos`, `omegaPos`, `from`, `to`,
`source`

These come from `ctx.organPositions.get(sym)` — the module-level `Map`
returns the same object reference for each key. Same reference → shallow
`===` sees them as equal → memo skips correctly.

**Components:** AuditLoop, ContradictionBolt, LightningBoltL1, MCPDataStream,
RecallStream, ResonancePulse (source), NeuralBridge (psiPos, muPos)

### C. Module-level Map prop
**Pattern:** `organPositions` (the Map itself)

Passed directly — same module-level reference every time. Shallow comparison
sees it as equal.

**Components:** ECSPrism, OrganDendrites, PacketFlowRenderer

### D. No props (reads from SignalContext)
Memo prevents re-rendering when the parent re-renders for unrelated reasons.
Context updates still bypass memo (React guarantees this).

**Components:** AuraField, AuraBudget

### E. Special cases

| Component | Note |
|---|---|
| OrganDendrites | Default shallow comparison sufficient — `step` and `organPositions` are stable refs, `isDreamMode` is boolean, `progress` is primitive |
| DendriteTrunk (and DendriteLeafBranch) | Static/dynamic split: `TrunkStatic` memoized on `[from, angle, node, color]`, animation phases computed from `progress` at render time. DendriteLeafBranch receives precomputed leaf geometry as stable refs from the parent's useMemo |
| ResonancePulse | `targets` is precomputed `RESONANCE_TARGETS` (module-level constant). `source` from `organPositions.get('Μ')` (stable ref). `intensity` derived from step data |
| PacketFlowRenderer | `flows` from `step.packetFlows` (stable ref when step unchanged). `organPositions` is module-level Map |
| NeuralBridge | `psiPos`/`muPos` from organPositions (stable refs). `season` is string, `established` is boolean |
| PhaseBanner | `phase` is string enum, `route` is string or undefined, `progress` is primitive |
