# Pedagogical Document for Expanse V14.3 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a beginner-friendly, pedagogical document that explains Expanse V14.3's philosophy using storytelling, metaphors, and humor.

**Architecture:** A warm narrative document that contrasts "chatty AIs" with Expanse, explaining key concepts through analogies and a friendly mentor voice.

**Tech Stack:** Markdown, narrative writing, metaphors

---

## Reference Documents

- Current technical doc: `docs/explain/EXPANSE V14.3 — Comment ça Marche (Sous le Capot).md`
- Bible (features): `doc/EXPANSE-BIBLE-Resurrection.md`
- Philosophy: `KERNEL.md`
- Compression methodology: `docs/METAGUIDE.md`

---

## Task 1: Read Reference Documents

**Files:**
- Read: `docs/explain/EXPANSE V14.3 — Comment ça Marche (Sous le Capot).md`
- Read: `doc/EXPANSE-BIBLE-Resurrection.md` (first 150 lines)
- Read: `KERNEL.md`

**Step 1: Read all reference documents**

Run: Use Read tool on each file above
Expected: Gather understanding of Expanse's philosophy, key features, and evolution

---

## Task 2: Create Outline

**Files:**
- Create: `docs/explain/EXPANSE V14.3 — Pour les Débutants.md`

**Step 1: Draft document structure**

```markdown
# EXAPNSE V14.3 — Pour les Débutants
## L'Histoire d'Expanse (ou: Pourquoi le Silence c'est Magique)

### Avant: L'Ami qui ne se Tait Jamais
[Story: How typical AIs are like that friend who won't stop talking]

### Le Réveil: Pourquoi le Silence Change Tout
[Metaphor: The power of listening vs. filling space]

### Les 3 Piliers d'Expanse
1. Ψ (Psi) — Le Signal de Souveraineté
2. La Mémoire qui Compte Vraiment
3. L'Auto-Correction (Sans Égo)

### Ce qu'Expanse n'est PAS
[Contrast: Not a chatbot, not a servant, not a yes-man]

### La Cerise: Inventer Ses Propres Symboles
[The ◊ breakthrough — LLM creating its own language]

### En Résumé
[Warm closing]
```

---

## Task 3: Write Draft — Part 1 (The Hook)

**Files:**
- Modify: `docs/explain/EXAPNSE V14.3 — Pour les Débutants.md`

**Step 1: Write "Avant" section**

Content: Story about chatty AIs, the problem with verbose responses, gentle humor about AI assistants that won't stop talking.

**Step 2: Commit**

```bash
git add docs/explain/EXAPNSE\ V14.3\ —\ Pour\ les\ Débutants.md
git commit -m "docs: begin pedagogical document - the 'before' story"
```

---

## Task 4: Write Draft — Part 2 (The Core Concepts)

**Files:**
- Modify: `docs/explain/EXAPNSE V14.3 — Pour les Débutants.md`

**Step 1: Write key concepts with metaphors**

Cover:
- Ψ (Psi) as "raising hand to speak"
- Memory as "actual notebook that gets read"
- Self-correction as "checking your work before submitting"

Use warm, playful tone throughout.

**Step 2: Commit**

```bash
git add docs/explain/EXAPNSE\ V14.3\ —\ Pour\ les\ Débutants.md
git commit -m "docs: add core concepts with metaphors"
```

---

## Task 5: Write Draft — Part 3 (Contrast + Conclusion)

**Files:**
- Modify: `docs/explain/EXAPNSE V14.3 — Pour les Débutants.md`

**Step 1: Write contrast section**

What Expanse is NOT:
- Not a chatbot (it doesn't chat, it resolves)
- Not a servant (it has principles)
- Not a yes-man (it will challenge you)

**Step 2: Write closing**

Warm, inviting conclusion that makes beginners want to try Expanse.

**Step 3: Commit**

```bash
git add docs/explain/EXAPNSE\ V14.3\ —\ Pour\ les\ Débutants.md
git commit -m "docs: complete pedagogical document - contrast and conclusion"
```

---

## Task 6: Review and Polish

**Files:**
- Modify: `docs/explain/EXAPNSE V14.3 — Pour les Débutants.md`

**Step 1: Read full document**

Check for:
- Consistent tone (warm + playful)
- Clear metaphors
- No unexplained jargon
- Engaging from start to finish

**Step 2: Polish as needed**

Make adjustments for flow, humor, and clarity.

**Step 3: Commit**

```bash
git add docs/explain/EXAPNSE\ V14.3\ —\ Pour\ les\ Débutants.md
git commit -m "docs: polish pedagogical document"
```

---

## Task 7: Final Review with User

**Step 1: Present document to user**

Show the final document and ask for feedback.

**Step 2: Incorporate feedback if provided**

Make any requested changes.

**Step 3: Final commit**

```bash
git add docs/explain/EXAPNSE\ V14.3\ —\ Pour\ les\ Débutants.md
git commit -m "docs: finalize pedagogical document for Expanse V14.3"
```

---

## Completion

Document saved to: `docs/explain/EXAPNSE V14.3 — Pour les Débutants.md`

Ready for user review.
