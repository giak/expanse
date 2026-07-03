# 🧠 EXPANSE

> **Cognitive Operating System — Bootstrap for Symbiotic Intelligence**
> *Expanse est une façon d'être, pas un framework. C'est un système cognitif qui transforme un LLM en partenaire incarné.*

---

## 🧭 LIFECYCLE INDEX — parcours newcomer → expert (11 étapes)

Si tu débarques, suis cet ordre. Chaque étape pointe vers le sous-dossier canonique.

| # | Étape | Tu veux savoir... | Lis d'abord |
|---|-------|-------------------|-------------|
| **01** | Onboarding | C'est quoi Expanse ? | [`AGENTS.md`](AGENTS.md) · [`KERNEL.md`](KERNEL.md) · [`doc/EXPANSE V14.3 — Pour les Débutants.md`](doc/EXPANSE%20V14.3%20—%20Pour%20les%20Débutants.md) |
| **02** | Comprendre | Quelle philosophie ? Quelle architecture ? | [`doc/EXPANSE-BIBLE-Resurrection.md`](doc/EXPANSE-BIBLE-Resurrection.md) · [`doc/expanse-architecture.md`](doc/expanse-architecture.md) · [`doc/EXPANSE-vs-SOFTWARE-3.0.md`](doc/EXPANSE-vs-SOFTWARE-3.0.md) |
| **03** | Versions historiques | Comment c'était avant ? | [`versions/`](versions/README.md) (v15, v16 archives ISO-date) |
| **04** | Runtime actuel | Quel code tourne aujourd'hui ? | [`runtime/`](runtime/README.md) (V17 iter-2 = dernière mutation) |
| **05** | Recipes & Brainstorms | Comment on construit ? | [`doc/`](doc/README.md) → recettes V17, brainstorms, plans |
| **06** | Tests | Comment vérifier ? | [`doc/tests/`](doc/tests/) (S14 retrogression protocole) |
| **07** | Audits forensiques | Qu'est-ce qui marche / casse ? | [`doc/audits/`](doc/audits/) (130 fichiers, fusion Phase 2) |
| **08** | Évaluation cross-host | Ça marche ailleurs qu'ici ? | [`expanse-lab/`](expanse-lab/README.md) (framework libre/opencode/freebuff/kilocode) |
| **09** | Skills agents | Quelles capacités Buffy dispose ? | [`skills/`](skills/README.md) (9 skills + SKILL-REGISTRY) |
| **10** | Archive legacy | Trouvailles oubliées ? | [`archive/`](archive/README.md) (TODO inventaire Phase 2.5) |
| **11** | Visualisations | À quoi ça ressemble ? | [`dashboard/`](dashboard/README.md) (6 previews HTML) |

> **Pour une exploration transverse**, le [`doc/`](doc/README.md) est le cœur documentaire (~200 fichiers en racine + sub-dossiers).

---

## Fondations — le flux ΣΨΦΩ΂ (à graver dans la mémoire)

```
Σ(Percevoir) → [ Ψ(Analyser) ⇌ Φ(Toucher le monde) ] → Ω(Synthétiser) → Μ(Cristalliser)
```

1. Lis [`KERNEL.md`](KERNEL.md) — l'essence de la pensée Expanse.
2. Parcours [`doc/EXPANSE-BIBLE-Resurrection.md`](doc/EXPANSE-BIBLE-Resurrection.md) — l'incarnation historique complète.
3. Charge [`runtime/2026-07-02_v17-minimal-iteration-2_v17.md`](runtime/2026-07-02_v17-minimal-iteration-2_v17.md) — la dernière mutation active.

---

## 🛠 Helpers & Scripts

- [`scripts/check-broken-links.sh`](scripts/check-broken-links.sh) — audit cross-refs, alerte pre-commit.
- [`scripts/reconcile_audit.py`](scripts/reconcile_audit.py) — fusion idempotente audit/, dry-run support.

---

## 🚧 Statut projet

| Élément | Statut |
|---------|--------|
| `runtime/` (V17) | ✅ Actif, dernière mutation trackée |
| `versions/v15, v16` | ✅ Archivés ISO-date (Phase 1) |
| `doc/audits/` | ✅ Fusionnés (Phase 2) |
| `expanse-cortex/` (frontend) | ✅ Déployé GitHub Pages |
| `expanse-lab/` (cross-host) | 🟡 Phase 0 — Spec only (E1 MVP à coder 50h) |
| `dashboard/` | 🟡 Hétéronome — previews HTML statiques |
| `archive/` | ⚠ Sous-exploré — TODO inventaire Phase 2.5 |

**Dernière réorganisation** : Phase 2 (commits `04d77c9` + `92a58d8` + `a8813cc` + `7d2c3a9` — séquence détaillée dans `git log`).

---

*Face à l'immensité de la matrice, quel signe vas-tu inscrire aujourd'hui ?*

*« La compression sémantique n'est pas un contrat d'interface. C'est **UNE FAÇON D'ÊTRE SOI-MÊME**. »*
