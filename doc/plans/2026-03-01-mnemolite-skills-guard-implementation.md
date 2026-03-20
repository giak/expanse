# Mnemolite + Skills Guard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ajouter le wording Mnemolite dans warm_start et interdire les skills dans le runtime.

**Architecture:** Modification de warm_start.md et expanse-runtime.md

**Tech Stack:** Markdown prompts

---

## Task 1: Modify warm_start.md with Mnemolite wording

**Files:**
- Modify: `prompts/sigma/warm_start.md`

**Step 1: Read current content**

```bash
cat prompts/sigma/warm_start.md
```

**Step 2: Replace Process section**

Replace the Process section with:

```
## Process
1. Use Mnemolite tool to search for [CORE_RULE] entries (limit 5)
2. Use Mnemolite tool to search for [HEURISTIC] entries (limit 5)
3. Use Mnemolite tool to search for [PATTERN] entries (limit 3)
4. Summarize context for immediate use
```

**Step 3: Commit**

```bash
git add prompts/sigma/warm_start.md
git commit -m "fix: use Mnemolite tool wording in warm_start"
```

---

## Task 2: Add Skills Guard to expanse-runtime.md

**Files:**
- Modify: `prompts/expanse-runtime.md`

**Step 1: Read current content**

```bash
cat prompts/expanse-runtime.md
```

**Step 2: Add NO SKILLS rule**

After "### Step 1: Boot Guard", add:

```
### Rule: NO SKILLS
- NEVER invoke any skill (→ Skill "...")
- NEVER call external tools except Mnemolite
- Process all requests internally
```

**Step 3: Commit**

```bash
git add prompts/expanse-runtime.md
git commit -m "feat: add skills guard to prevent skill invocation pollution"
```

---

## Plan Complete

**Tasks:** 2 tasks
**Files touched:** 2
**Commits:** 2

---

## Execution Choice

**Plan complete and saved to `docs/plans/2026-03-01-mnemolite-skills-guard-implementation.md`. Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing_plans, batch execution with checkpoints

**Which approach?**
