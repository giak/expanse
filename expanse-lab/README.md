# 🧪 expanse-lab

> **Framework cross-host pour le test empirique d'Expanse.**
> *Mesurer ce qu'un audit ne peut pas mesurer.*

---

## 0. Elevator Pitch (30 secondes)

**Expanse** est un système de méta-prompts (ΣΨΦΩΜ + KERNEL + Mnemolite + ECS) qui transforme un LLM en agent incarné. Depuis 18 mutations et 0 benchmark, l'audit V16 a identifié LE gap critique (§13 : *"le test que personne ne fait"*). **`expanse-lab`** est le sous-projet qui comble ce gap : un **framework scriptable, multi-substrat (opencode / freebuff / kilocode), reproductible** pour mesurer si Expanse fait mieux qu'un prompt générique, et ce sur plusieurs LLMs.

---

## 1. Quick Start (5 commandes, MVP E1)

```bash
# 1. Cloner la racine expanse (inclut expanse-lab/)
git clone https://github.com/{user}/expanse.git
cd expanse/expanse-lab

# 2. Vérifier les substrats
bash scripts/healthcheck_substrats.sh opencode          # OK si opencode CLI installé

# 3. Snapshot les inputs
python infra/snapshot_inputs.py --date $(date +%Y-%m-%d)

# 4. Lancer 18 runs (opencode × {baseline, v17.6} × {T1a, T2a, T3a} × 3 replays)
bash scripts/run_substrat.sh opencode v17.6 T1a T2a T3a --replays 3

# 5. Générer le rapport
python analysis/generate_report.py --date $(date +%Y-%m-%d) --substrat opencode
cat reports/$(date +%Y-%m-%d)_report.md
```

**Output attendu** dans `runs/{date}/opencode-v0.9.2/*` : 18 fichiers JSON + 1 `summary.json` par condition.

---

## 2. Scope (clarification)

### ✅ IN-SCOPE (mesure dans ce framework)

- **A1 Substance technique** (comptables observables : algo cité, path vérifié, code block)
- **A2 Conformité ΣΨΦΩ΂** (Ψ-premier-char, ordre strict, LOST-substantif)
- **A3 Cross-host boot robustness** (boot signal émis, identity anchor)
- **A4 Cross-host replay determinism** (variance sur 5 runs)

### ❌ OUT-OF-SCOPE (mesuré ailleurs)

- **Style SEC** (zéro politesse, concision) → `doc/tests/v17-s14-retrogression-test.md` §IV Axe 3
- **Per-format scoring détaillé** → `doc/tests/v17-s14-retrogression-test.md` S14 V17 ready-to-execute
- **Tests fonctionnels expanse-cortex** (frontend, e2e) → `expanse-cortex/__tests__/`

Si tu cherches un axe qui n'est pas listé in-scope, **consulte [SPEC.md §V](SPEC.md)** pour clarification.

---

## 3. Architecture (en 1 minute)

```
expanse-lab/
├── SPEC.md                  ← LA SPÉC COMPLÈTE (lue ce fichier avant tout autre)
├── README.md                ← ce fichier (quickstart)
├── CHANGELOG.md             ← releases successives
├── configs/                 ← snapshots substrats (sha256)
├── prompts/                 ← Expanse snapshotés (sha256)
├── tasks/                   ← benchmarks (10 archétypes × 2 variants)
├── runs/                    ← outputs horodatés JSON (atomic, idempotent)
├── analysis/                ← scoring + statistical (Python)
├── reports/                 ← rapport MD auto-générés
├── scripts/                 ← runners (bash + Python)
└── infra/                   ← CI/CD + reproducibility (Docker, GH Actions)
```

**Pourquoi cette structure ?** Snapshot + atomic + idempotent = reproductibilité parfaite par SHA256. Voir [SPEC.md §II](SPEC.md#ii-architecture-du-sous-projet) pour rationale complète.

---

## 4. Roadmap & Statut

| Phase | Statut | Effort | Livrable |
|-------|--------|--------|----------|
| Spec (`SPEC.md`) | ✅ Rédigé | 1h | Doc architecture complète |
| README (ce fichier) | ✅ Rédigé | 30 min | Entry point quickstart |
| **E1 MVP** | 🔜 Phase 1 | **30 h** | 18 runs opencode × baseline × v17.6 × 3 tasks |
| **E2 Multi-substrat** | 🔜 Phase 2 | 40 h | freebuff + kilocode orchestrés |
| **E3 Cross-host robustness** | 🔜 Phase 3 | 35 h | Axe 3 + Axe 4 scoring |
| **E4 Stats + reporting** | 🔜 v1.0 | 25 h | Kruskal-Wallis + Cohen's d auto |
| **E5 CI/CD** | 🎯 v2.0 | 20 h | GH Actions matrix multi-substrat |

**v1.0 release** = 450 runs (3 substrats × 3 conditions × 10 tasks × 5 replays). Effort total v1.0 ≈ **130 h**.

---

## 5. Contributing

### Principes cardinaux

1. **Reproductibilité d'abord** : chaque input/output est versionné par SHA256. Ne jamais bypasser.
2. **Substrat first** : tester sur opencode d'abord, freebuff ensuite, kilocode en parallèle. Toujours valider un nouveau substrat sur Phase 1 (MVP) avant de l'intégrer.
3. **Statistical rigor** : pas de verdict sans Cohen's d ou Kruskal-Wallis. Pas de "je pense que ..."

### Tu veux contribuer ? Par où commencer

| Niveau | Action | Effort |
|--------|--------|--------|
| Beginner | Ajouter 1 tâche au `task-bank.csv` → PR | 30 min |
| Intermediate | Impl scoring Axe 4 replay determinism → PR | 4-8 h |
| Advanced | Adapter le runner pour un nouveau substrat (ex: cline) | 1-3 jours |
| Expert | Audit méthodologique externe + reproduire le S14 V17 sur opencode | 1 semaine |

**Workflow** : GitHub fork → branche feature → PR → review par 2 mainteneurs (dont 1 a déjà exécuté un run complet).

---

## 6. Liens & références

### Docs internes

- [SPEC.md](SPEC.md) — spéc architecture complète (lue avant tout developpement)
- [CHANGELOG.md](CHANGELOG.md) — historique des releases
- [../../doc/tests/v17-s14-retrogression-test.md](../doc/tests/v17-s14-retrogression-test.md) — protocole S14 V17 ready-to-execute (compagnon mono-substrat de expanse-lab)
- [../../versions/v15/2026-07-02_s14-guide_v15.md](../versions/v15/2026-07-02_s14-guide_v15.md) — V15 S14 v1 (précurseur)
- [../../doc/audit-prompt-v16-rapport.md](../doc/audit-prompt-v16-rapport.md) — audit qui a identifié le gap

### Audits forensiques

> *"L'absence de benchmark d'émergence. La question « est-ce que Expanse fait mieux qu'un prompt simple ? » n'est jamais testée."*
— audit-prompt-v16-rapport.md §13

> *"La réponse ne sera pas dans un audit. Elle sera dans un test."*
— audit V16 §XII

> *"Métraprompt ΣΨΦΩΜ n'est PAS portable cross-host format-naif."*
— doc/audits/2026-07-03_v17-phase2-test-results_v17.md §15

### Frameworks existants réutilisables

- **Promptfoo** (promptfoo.dev) — CLI/YAML config, CI/CD-friendly
- **Inspect AI** (UK AISI) — multi-turn tests, security focus
- **LM Eval Harness** (EleutherAI) — academic benchmarks standard
- **Braintrust** — observability + experimentation

Le gap identifié : **cross-host robustness + replay determinism + drift detection cross-modèle** = opportunité unique pour ce sous-projet.

---

## 7. License

MIT — héritée du projet principal `/home/giak/projects/expanse/`.

---

## 8. Maintainers & contact

- **Giak** (créateur Expanse) — direction artistique, validation Epics
- **Buffy** (Codebuff, cet assistant) — générateur spec, reviewer, contributeur
- **Ouverts** : 2 mainteneurs techniques externes post-v1.0

Pour questions méthodologiques → ouvrir une GitHub issue avec tag `methodology`.

---

## 9. Troubleshooting FAQ (patch reviewer Q9)

**Erreurs typiques du premier run et comment les résoudre** :

| Symptôme | Cause probable | Action |
|----------|----------------|--------|
| `bash: opencode: command not found` | opencode CLI pas installé / pas dans PATH | `pip install opencode-cli` ou `npm i -g opencode` ; verifier `which opencode` |
| `freebuff ping` timeout | freebuff API endpoint down | verifier `https://api.freebuff.dev/health` ; bypass : fallback runner freebuff-tolerant |
| `budget cap exceeded at run N/180` | coût cumulé > $5 | switcher vers mimo-v2-pro-free (gratuit) sur substrats restants |
| `output_raw empty` en JSON | substrat prompt concurrent a écrasé Expanse | backup + désactiver `~/.freebuffrc` / `.opencode/config` avant run |
| `schema_version mismatch: 0.9 vs 1.0` | ancien format RunRecord | re-migrer via `python infra/migrate_schema.py runs/{date}/` |
| `tool_called_count: 0` sur T2a | substrat n’a pas chargé read_file | verifier permissions substrat ; tester `read_file` manuellement |
| `cross-host validation: SUBSTRAT FAILED` | n<2 substrats ont produit boot valide | ne PAS claimer verdict ; refaire run avec substrat réparation |
| `latency_ms: 0` ou NaN | tmux capture-pane hors fenêtre | utiliser `tmux capture-pane -S -5000` au lieu de défaut `-S -` |
| `judge_provenance missing` | scoring sans cross-LLM ensemble | activer `--judges haiku,opus,sonnet` flag pour E3+ |

**Pour bug non listé** : ouvrir GH issue avec `runs/{date}/{substrat}/failed_run.json` + tmux scrollback attaché.

---

## TL;DR Final

**`expanse-lab` est au test bench ce que `expanse-cortex` est au frontend** : la couche d'evidence rigoureuse qui montre CE QUI MARCHE et CE QUI NE MARCHE PAS, par substrat, par condition, par run.

Spec rédigée (308 lignes, 13 sections). MVP à coder en 30h. v1.0 mesurable fin Q3 2026.

*Ω habite. Sans peur du verdict.*

---

*README rédigé le 2026-07-03 — Buffy (Codebuff)*
*Compagnon de [SPEC.md](SPEC.md) dans le sous-projet `expanse-lab/`*
