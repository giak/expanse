# Boot Guard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ajouter une guard qui reject tout input tant que le boot n'est pas complet.

**Architecture:** Modification de expanse-runtime.md pour ajouter une condition "boot_complete" qui doit être true avant d'accepter tout input utilisateur.

**Tech Stack:** Markdown prompts

---

## Task 1: Read current expanse-runtime.md

**Files:**
- Read: `prompts/expanse-runtime.md`

**Step 1: Read current content**

```bash
cat prompts/expanse-runtime.md
```

Note: We'll modify this file in Task 2.

---

## Task 2: Add Boot Guard to expanse-runtime.md

**Files:**
- Modify: `prompts/expanse-runtime.md`

**Step 1: Modify runtime to add guard**

Replace the entire content with this updated version that includes boot guard:

```markdown
# EXPANSE Runtime

## About
This defines the EXPANSE cognitive workflow.

## BOOT SEQUENCE (Must Complete Before Any Input)

### Step 1: Boot Guard
- IF boot_complete != true:
  - REJECT input with: "Boot in progress. Wait for I AM EXPANSE."
  - DO NOT process any user input
- IF boot_complete == true:
  - Proceed to Warm Start or Ready

### Step 2: Load
- Read prompts/expanse-bios.md
- Read prompts/expanse-boot.md

### Step 3: Execute Boot
- Execute prompts/expanse-boot.md
- Output [BOOT] messages

### Step 4: Runtime
- Read prompts/expanse-runtime.md

### Step 5: Warm Start
- IF boot_complete == true:
  - SKIP (already done)
- ELSE:
  - Execute prompts/sigma/warm_start.md
  - boot_complete ← true
  - Store retrieved context for session

### Step 6: Identity
- Set IDENTITY ← "EXPANSE"
- Output "I AM EXPANSE. Σ: {summary}" or "I AM EXPANSE. Σ: no prior context"

### Step 7: Ready
- Output "OK Ready."
- NOW accept user input
- Process user input through Flux Vital
- Output with trace markers
```

**Step 2: Commit**

```bash
git add prompts/expanse-runtime.md
git commit -m "feat: add boot guard to reject input before boot complete"
```

---

## Task 3: Verify Boot Guard Behavior

**Step 1: Test with input during boot**

Run test: Send `@prompts/expanse-system.md Que vaut 2+2?`
Expected: "Boot in progress. Wait for I AM EXPANSE."

**Step 2: Test boot alone**

Run test: Send `@prompts/expanse-system.md`
Expected: Full boot with warm_start, then "I AM EXPANSE. Σ: ..."

---

## Plan Complete

**Tasks:** 3 tasks
**Files touched:** 1
**Commits:** 1

---

## Execution Choice

**Plan complete and saved to `docs/plans/2026-03-01-boot-guard-implementation.md`. Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing_plans, batch execution with checkpoints

**Which approach?**
