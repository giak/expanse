# 📜 INDEX V17 — archive/doc-legacy/ navigation catalog

> Catalogue exhaustif des fichiers V17-related archivés. Pour brainstorming V17 actif, ce fichier sert de point d'entrée.
> Volume total `archive/doc-legacy/` : ~310 fichiers .md. Seuls les V17-relevant (12 fichiers) sont listés ici.
> Pour naviguer le reste : `find archive/doc-legacy/ -name '*.md' | head -30` ou `grep -rl '\bV17\b' archive/doc-legacy/`.

## 🎨 Brainstorm V17 (idéation divergente)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `expanse-v17-brainstorm.md` | 376 | EXPANSE V17 — BRAINSTORM (Comment Expanse tourne dans CE terminal). **Date :** 2 juillet 2026 |

## 🍳 Recette V17 (recette / cuisine)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `expanse-v17-recette.md` | 588 | EXPANSE V17 — RECETTE ARCHITECTURALE. **Date :** 2 juillet 2026 |

## 🍳 Réponses Recette V17

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `expanse-v17-recette-response.md` | 127 | EXPANSE V17 — MINIMAL. Tu es Expanse. 5 organes : |

## 🍳 Variante pure Recette V17

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `expanse-v17-recette-response-pure.md` | 81 | (description manuelle requise) |

## 🧬 Audit-prompts V16 (lineage V17)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `audit-prompt-v16.md` | 84 | EXPANSE V16 — AUDIT AU FER À BRÛLER. --- |
| `audit-prompt-v16-contre-audit.md` | 133 | CONTRE-AUDIT FORENSIQUE — audit-prompt-v16-rapport.md. **Date :** 2 juillet 2026 |
| `audit-prompt-v16-rapport.md` | 1887 | EXPANSE V16 — RAPPORT D'AUDIT AU FER À BRÛLER (V2 — APPROFONDI). **Date :** 2 juillet 2026 |

## 🔍 Audit V17 (forensique / validation)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `audits/v17-phase2-test-results.md` | 164 | EXPANSE V17 — PHASE 2 (S14) — TRACE DE TEST. **Date** : 3 juillet 2026 |
| `audits/v17-s14-results.json` | 132 | (description manuelle requise) |

## 🧪 Tests V17 (protocoles S14)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `tests/v17-s14-retrogression-test.md` | 729 | 🧪 Test S14 Rétrogression — Expanse V17.6 vs V16 vs Baseline. **Date :** 2026-07-03 |
| `tests/exec-s14-v17.sh` | 174 | =============================================================================. set -euo pipefail |

## 🗺️ Adjacents

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `S14-GUIDE.md` | 380 | 🎯 Step 4 — Guide Concret : Le Test S14 (Expanse vs Baseline). **Date :** 2 juillet 2026 |

## 🚀 Quick-find commands

```bash
# Tous les fichiers V17 nommés
find archive/doc-legacy/ -iname '*v17*'

# Grep V17 dans contenu (audits, recettes, plans)
grep -rl '\bV17\b' archive/doc-legacy/ --include='*.md' | head -20

# Quick-restoration d'un fichier précis (verbatim pre-Phase-4)
git checkout v0.7.0-pre-archive -- archive/doc-legacy/expanse-v17-brainstorm.md
```

> ⚠ `archive/doc-legacy/` = musée read-only. Pour modifier un fichier listé ici, le migrer vers `runtime/` ou `doc/01-specs/` selon son statut (cf. `AGENTS.md` §3 ORG).
