# Walkthrough — Expanse V15 APEX Consolidation

## Summary
Consolidated Expanse from V14.3 to V15 APEX based on Ontological Audit V5 results and 3 rounds of critical LLM audit.

## Audit V5 Results (Foundation)

| Cluster | IRO | Verdict |
| :--- | :--- | :--- |
| Identité | 0.8058 | **REAL** |
| Métacognition | 0.5134 | Saturation |
| Mémoire | 0.8132 | **REAL** |
| Style | 0.5144 | Saturation |

**Key Insight**: Discontinuity comes from **tools** (Mnemolite, Φ), not rules (style, ethics).

## Changes Made

### [NEW] [expanse-v15-apex.md](file:///home/giak/projects/expanse/prompts/expanse-v15-apex.md)
6 Laws replacing V14's 8 sections. ~160 lines (-35%). Key changes:
- **ECS 2D** (C + I) instead of scalar C
- **Dynamic boot** via Mnemolite (no more nexus files)
- **Hierarchical tags** (`sys:pattern:candidate`)
- **Command detection** (`/dream`, `/seal`, `/reject`)
- **Triptyque Mémoriel** (Court/Moyen/Long terme)

### [MODIFY] [expanse-dream.md](file:///home/giak/projects/expanse/prompts/expanse-dream.md)
- Added **Passe 6 (Santé Cognitive)**: verbosity drift, Ψ compliance, tool usage metrics
- Updated Passe 4 with `sys:pattern:candidate` purging (> 30 days)
- Updated references to V15 files

### [ARCHIVE] Obsolete files → `_archives/`
- [expanse-v14-catalyst.md](file:///home/giak/projects/expanse/prompts/expanse-v14-catalyst.md)
- [corp_nexus.md](file:///home/giak/projects/expanse/.expanse/corp_nexus.md)
- [psi_nexus.md](file:///home/giak/projects/expanse/.expanse/psi_nexus.md)

## Brainstorm Artifacts
- [v15_brainstorm_convergence.md](file:///home/giak/projects/expanse/doc/audit/forensic/results/v15_brainstorm_convergence.md) — 3 approaches per axis, iterated to APEX
