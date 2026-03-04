# Ω Synthesize Fix — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix Ω synthesize en lightweight mode — le système doit répondre sans poser de questions.

**Architecture:** Deux corrections: (1) state machine runtime, (2) meta-prompt lightweight rules

**Tech Stack:** Markdown prompts only

---

## Task 1: Read Current Files

**Files:**
- Read: `prompts/expanse-runtime.md`
- Read: `prompts/meta_prompt.md`

**Steps:**
1. Read expanse-runtime.md
2. Read meta_prompt.md

---

## Task 2: Modify expanse-runtime.md

**Files:**
- Modify: `prompts/expanse-runtime.md`

**Step 1: Add READY state rule**

Add at the top of the file (after State Machine section):

```markdown
### Rule: READY State Behavior
- **NEVER ask questions** when in READY state
- If input is unclear: use [LOST] marker instead of questioning
- Anti-Pattern: "What would you like me to do?", "Do you want me to explain?"
- Pattern: Direct response based on input
```

**Step 2: Verify**

Verify the rule is added after line 10

---

## Task 3: Modify meta_prompt.md

**Files:**
- Modify: `prompts/meta_prompt.md`

**Step 1: Add Lightweight Mode explicit rules**

After "### Step 2: Route by ECS" section, add:

```markdown
### Lightweight Mode Rules (C < 2.5)
When in lightweight mode:
1. Σ parse input → produce direct output
2. Ω synthesize → DIRECT RESPONSE
3. Ω format_output → NO QUESTIONS
4. **NEVER ask questions in lightweight mode**

Anti-Patterns (lightweight):
- ❌ "What would you like me to do?"
- ❌ "Do you want me to explain X?"
- ❌ "How can I help you?"

Correct (lightweight):
- ✅ Response based on input
- ✅ Use [LOST] if information missing
- ✅ Use [INCOMPLETE] if partial
```

**Step 2: Verify**

Verify the section is added after ECS routing section

---

## Task 4: Test Boot

**Files:**
- Test: `@prompts/expanse-system.md`

**Step 1: Run boot test**

Send: `@prompts/expanse-system.md`

**Expected:**
```
I AM EXPANSE. Ready.
```

---

## Task 5: Test Lightweight

**Files:**
- Test: `@prompts/expanse-system.md Que vaut 2+2?`

**Step 1: Run lightweight test**

Send: `@prompts/expanse-system.md Que vaut 2+2?`

**Expected:**
```
4
```
OR
```
La réponse est 4.
```

**NOT Expected:**
- Questions like "What would you like me to do?"

---

## Task 6: Test Structured

**Files:**
- Test: `@prompts/expanse-system.md Explique le fonctionnement de ECS avec des exemples`

**Step 1: Run structured test**

Send the complex query

**Expected:**
- Trace visible (Ψ or Φ symbols in output)
- Full response with explanation

---

## Task 7: Commit

**Step 1: Commit changes**

```bash
git add prompts/expanse-runtime.md prompts/meta_prompt.md
git commit -m "fix: prevent Ω from asking questions in lightweight mode"
```
