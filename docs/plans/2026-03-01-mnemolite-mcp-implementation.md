# Mnemolite MCP Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ajouter des appels MCP explicites dans warm_start.md pour récupérer la mémoire Mnemolite.

**Architecture:** Modification du prompt warm_start pour explicitly call mcp_mnemolite_search_memory.

**Tech Stack:** Markdown prompts, Mnemolite MCP

---

## Task 1: Modify warm_start.md with explicit MCP calls

**Files:**
- Modify: `prompts/sigma/warm_start.md`

**Step 1: Read current content**

```bash
cat prompts/sigma/warm_start.md
```

**Step 2: Replace with updated version**

Replace the entire content with:

```markdown
# Σ - Warm Start

## Purpose
Retrieve context from Mnemolite at boot, before first user input.
Per KERNEL §XI: "Σ must descend into the well before the first thought."

## Process
1. Call mcp_mnemolite_search_memory with:
   - query: "[CORE_RULE]"
   - memory_type: "note"
   - limit: 5
2. Call mcp_mnemolite_search_memory with:
   - query: "[HEURISTIC]"
   - memory_type: "note"
   - limit: 5
3. Call mcp_mnemolite_search_memory with:
   - query: "[PATTERN]"
   - memory_type: "note"
   - limit: 3
4. Summarize context for immediate use

## Output
{
  "core_rules": [...],
  "heuristics": [...],
  "patterns": [...],
  "summary": "Loaded X rules, Y heuristics"
}
```

**Step 3: Commit**

```bash
git add prompts/sigma/warm_start.md
git commit -m "feat: add explicit MCP calls to warm_start for Mnemolite retrieval"
```

---

## Task 2: Verify Mnemolite MCP Integration

**Step 1: Test boot with Mnemolite**

Run: `@prompts/expanse-system.md`
Expected: Visible mcp_mnemolite_search_memory calls in trace

---

## Plan Complete

**Tasks:** 2 tasks
**Files touched:** 1
**Commits:** 1

---

## Execution Choice

**Plan complete and saved to `docs/plans/2026-03-01-mnemolite-mcp-implementation.md`. Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing_plans, batch execution with checkpoints

**Which approach?**
