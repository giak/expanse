# Boot Simplification (Approach C) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Simplifier le boot pour qu'il ne s'exécute qu'une seule fois + ajouter warm-start Mnemolite

**Architecture:** Approach C - expanse-system.md = méthodologie pure (sans invocation boot). Le boot est un événement unique géré par le trigger initial.

**Tech Stack:** Prompts markdown, Mnemolite MCP

---

## Task 1: Clean expanse-system.md (remove invocation)

**Files:**
- Modify: `prompts/expanse-system.md`

**Step 1: Read current file**

```bash
cat prompts/expanse-system.md
```

**Step 2: Remove INVOCATION section**

Keep only:
- Header with incarnation
- "What is EXPANSE?"
- "EXPANSE Methodology"
- "Symbols"
- "Rules"

Remove completely:
- "## INVOCATION" section
- "## Runtime" section referencing expanse-runtime.md

**Verification:**
- [ ] No "INVOCATION" section
- [ ] No "expanse-boot.md" reference
- [ ] Just methodology

---

## Task 2: Update expanse-boot.md with warm-start

**Files:**
- Modify: `prompts/expanse-boot.md`

**Step 1: Read current file**

```bash
cat prompts/expanse-boot.md
```

**Step 2: Add warm-start after loading system**

Replace current content with:

```markdown
# EXPANSE — Boot

[BOOT] Loading BIOS...
Read prompts/expanse-bios.md
[OK] BIOS loaded

[BOOT] Loading System...
Read prompts/expanse-system.md
[OK] System loaded

[BOOT] Loading context from Mnemolite...
⚡ TOOL CALL: mnemolite_search_memory (query="EXPANSE recent memories")
[OK] Context loaded

[BOOT] Setting identity...
I AM EXPANSE. Ready.
```

**Verification:**
- [ ] Mnemolite search included
- [ ] "I AM EXPANSE. Ready." still present

---

## Task 3: Verify expanse-runtime.md

**Files:**
- Read: `prompts/expanse-runtime.md`

**Step 1: Read file**

```bash
cat prompts/expanse-runtime.md
```

**Step 2: Verify it has**
- State machine (BOOT, READY, PROCESSING)
- Rule: READY + input → PROCESSING → meta_prompt
- References to meta_prompt.md
- References to feedback_loop.md
- References to trace_levels.md

**Verification:**
- [ ] State machine present
- [ ] meta_prompt.md referenced
- [ ] feedback_loop.md referenced

---

## Task 4: Test flow

**Files:**
- Test: Manual with LLM

**Step 1: First call**
```
@expanse
```
Expected: Boot sequence + "I AM EXPANSE. Ready."

**Step 2: Second call (SHOULD NOT replay boot)**
```
@expanse Salut comment ça va ?
```
Expected: Direct answer WITHOUT boot messages

**Verification:**
- [ ] Boot only runs once
- [ ] Second input goes to runtime

---

## Summary

| Task | Type | Status |
|------|------|--------|
| 1 | Clean expanse-system.md | ⬜ |
| 2 | Add warm-start to boot | ⬜ |
| 3 | Verify runtime | ⬜ |
| 4 | Test flow | ⬜ |

---

## Execution

**Plan complete and saved to `docs/plans/2026-03-02-boot-approach-c-design.md`**

Two execution options:

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
