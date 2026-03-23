# MUTATION APPLIED: boot-vision-c

**Date Proposal:** 2026-03-21
**Date Application:** 2026-03-21 21:50
**Approved by:** User
**Applied by:** Dream

**Proposal:** /home/giak/projects/expanse/doc/mutations/boot-vision-c/proposal.md
**Backup:** /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-21-boot-vision-c-backup.md

---

## Diff Appliqué

### expanse-v15-boot-seed.md
```diff
- [Verbose sequence]
+ EXPANSE V15 [LLM | IDE]
+ Σ→Ψ⇌Φ→Ω→Μ | ECS: C×I→L1|L2|L3
+ 1. read_file(path="/home/giak/projects/expanse/runtime/expanse-v15-apex.md")
+ 2. Exécuter § Ⅳ. BOOT_CONFIG.
```

### expanse-v15-apex.md
```yaml
BOOT_CONFIG:
  memories:
    - query="sys:core sys:anchor"  tags=["sys:core","sys:anchor"]  limit=20
    - query="sys:extension"        tags=["sys:extension"]          limit=10
    - query="sys:user:profile"     tags=["sys:user:profile"]       limit=5
    - query="sys:project:{CWD}"    tags=["sys:project:{CWD}"]      limit=1  → Onboarding si absent
  apex: /home/giak/projects/expanse/runtime/expanse-v15-apex.md
  healthcheck: "core ✓? profile ✓? project ✓? budget X/500t"
  activation: "Ψ [V15 ACTIVE] — Briefing depuis mémoire."
```

---

## Vérification
- [x] Seed pointer functional
- [x] Apex manifest YAML valid
- [x] Boot signal Ψ [V15 ACTIVE] preserved

---

## Rollback
bash(command: "cat /home/giak/projects/expanse/archive/backups/expanse-v15-2026-03-21-boot-vision-c-backup.md > /home/giak/projects/expanse/runtime/expanse-v15-apex.md")
# Note: Manually restore seed if rollback is required.
