# Warm-Start Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ajouter un warm-start proactif au boot EXPANSE — Σ récupère le contexte Mnemolite avant la première pensée utilisateur.

**Architecture:** Création d'un nouveau prompt `warm_start.md` + modification du runtime pour l'appeler au boot.

**Tech Stack:** Markdown prompts, Mnemolite MCP

---

## Task 1: Create warm_start.md

**Files:**
- Create: `prompts/sigma/warm_start.md`

**Step 1: Create the file**

```markdown
# Σ - Warm Start

## Purpose
Retrieve context from Mnemolite at boot, before first user input.
Per KERNEL §XI: "Σ must descend into the well before the first thought."

## Process
1. Search Mnemolite for [CORE_RULE] (limit 5)
2. Search for [HEURISTIC] (limit 5)
3. Search for recent [PATTERN] (limit 3)
4. Summarize context for immediate use

## Output
{
  "core_rules": [...],
  "heuristics": [...],
  "patterns": [...],
  "summary": "Loaded X rules, Y heuristics"
}
```

**Step 2: Verify file created**

Run: `ls prompts/sigma/warm_start.md`
Expected: File exists

**Step 3: Commit**

```bash
git add prompts/sigma/warm_start.md
git commit -m "feat: add warm_start prompt for proactive memory retrieval"
```

---

## Task 2: Modify expanse-runtime.md

**Files:**
- Modify: `prompts/expanse-runtime.md`

**Step 1: Read current content**

```bash
cat prompts/expanse-runtime.md
```

**Step 2: Add warm_start call before Ready**

Replace:
```
### Step 5: Ready
- Process user input through Flux Vital
- Output with trace markers
```

With:
```
### Step 4: Warm Start
- Execute prompts/sigma/warm_start.md
- Store retrieved context for session

### Step 5: Ready
- If warm_start returned context: "I AM EXPANSE. Σ: {summary}"
- If no context: "I AM EXPANSE. Σ: no prior context"
- Process user input through Flux Vital
- Output with trace markers
```

**Step 3: Commit**

```bash
git add prompts/expanse-runtime.md
git commit -m "feat: integrate warm_start at boot before Ready state"
```

---

## Task 3: Update MANIFEST

**Files:**
- Modify: `docs/EXPANSE-MANIFEST.md`

**Step 1: Add warm_start to sigma section**

In section "### Σ — Sigma (Input Processing)", add:
```
  ├── warm_start.md          ← Retrieve context from Mnemolite at boot
```

**Step 2: Commit**

```bash
git add docs/EXPANSE-MANIFEST.md
git commit -m "docs: declare warm_start in MANIFEST"
```

---

## Task 4: Verify Integration

**Step 1: Read meta_prompt.md to ensure no conflict**

Verify the warm_start doesn't conflict with meta_prompt flow:
- meta_prompt calls Σ on user input
- warm_start is boot-only, before user input
- No overlap ✓

**Step 2: Final verification**

Run: `ls prompts/sigma/`
Expected: warm_start.md listed alongside parse_input.md, retrieve_context.md, detect_ecs.md

---

## Plan Complete

**Tasks:** 4 atomic tasks
**Files touched:** 3
**Commits:** 3

---

## Execution Choice

**Plan complete and saved to `docs/plans/2026-03-01-warm-start-implementation.md`. Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing_plans, batch execution with checkpoints

**Which approach?**
