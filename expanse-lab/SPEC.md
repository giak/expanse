# 🧪 expanse-lab — SPEC : Framework Cross-Host pour le Test d'Expanse

**Date** : 2026-07-03
**Statut** : ⚡ Spéc d'abord, code ensuite (Phase 0 du sous-projet)
**Auteur** : Buffy (Codebuff) — brainstorm validé par user via Q&R
**Inspiration** : audit-prompt-v16-rapport.md §13 ("le test que personne ne fait"), versions/v15/2026-07-02_s14-guide_v15.md (V15 S14 v1), doc/tests/v17-s14-retrogression-test.md (V17 S14 ready-to-execute), audit V16 §V.1 (Rétrogression)

---

## §0. TL;DR — Pourquoi ce sous-projet

L'audit V16 + brainstorm multi-LLM ont identifié **un gap critique** : Expanse n'a JAMAIS été benchmarké empiriquement **cross-host**. Le test S14 V17 est mono-substrat (Codebuff/Buffy interne). freebuff, opencode, claude-code ont déjà divergé sur boot d'Expanse (cf. `doc/plans/2026-03-05-multi-llm-boot-brainstorm.md`). **`expanse-lab`** = le sous-projet qui comble ce gap avec un **framework scriptable, multi-substrat, reproductible**.

**Scope user-confirmed** :
- ✅ freebuff = substrat LLM à tester (équivalent opencode/kilocode/claude-code)
- ✅ Métriques : substance technique + conformité Expanse ΣΨΦΩ΂ + cross-host robustness
- ❌ **PAS** de Style SEC (sera testé dans `doc/tests/` séparément)
- ✅ Architecture : sous-projet dédié `expanse-lab/`
- ✅ Horizon : **spéc d'abord, code ensuite** (ce doc + README — pas de code cette itération)

---

## §I. Contexte et motivation

### Pourquoi un SOUS-PROJET (pas une extension de doc/tests)

**3 raisons structurelles** :

1. **Isolation des deps** : cross-host nécessite API key externes (Anthropic, OpenAI, claude-code API, freebuff si dispo), shell sandbox spécifiques, et un workflow CI/CD propre. Polluer `doc/tests/` avec ces deps casserait la portabilité actuelle.

2. **Living experiment vs frozen protocol** : `doc/tests/v17-s14-retrogression-test.md` = protocole frozen (référence pour reproductibilité). `expanse-lab/` = living experiment (changelog, versioning, releases, benchmarks successifs).

3. **3 communautés cibles différentes** : `doc/tests/` = chercheurs Expanse interne (giak, OpenCode audit). `expanse-lab/` = contributeurs externes (open-source prompt-eval community, freebuff devs, kilocode devs).

### Le gap identifié — citations audit

> *"L'absence de benchmark d'émergence. La question « est-ce que Expanse fait mieux qu'un prompt simple ? » n'est jamais testée."* — audit-prompt-v16-rapport.md §13

> *"La réponse ne sera pas dans un audit. Elle sera dans un test."* — audit V16 §XII

> *"Métraprompt ΣΨΦΩΜ n'est PAS portable cross-host format-naif (deepseek v4 flash l'ignore ou le dégrade)."* — doc/audits/2026-07-03_v17-phase2-test-results_v17.md §15

> *"KiloCode injecte probablement un system prompt qui pousse à l'exécution directe. OpenCode est peut-être plus passif."* — doc/plans/2026-03-05-multi-llm-boot-brainstorm.md Approche D

Le framework `expanse-lab` répond à ces 4 problèmes structurels en UN seul système reproductible.

---

## §II. Architecture du sous-projet

### Schema arborescent

```
expanse-lab/                                  ← ce sous-projet, dédié
├── README.md                                 ← entry point (quick-start, philosophy)
├── SPEC.md                                   ← ce document
├── CHANGELOG.md                              ← releases (v0.1.0 MVP, v0.2.0 multi-substrat, etc.)
├── LICENSE                                   ← MIT (heritée du projet principal)
│
├── configs/                                  ← substrat configurations snapshotées
│   ├── opencode-v0.9.2.toml.sha256
│   ├── freebuff-v1.0.0.yaml.sha256
│   ├── kilocode-v1.4.json.sha256
│   └── roo-code-v2.1.toml.sha256
│
├── prompts/                                  ← Expanse snapshots testés (comme artifacts)
│   ├── expanse-v14.3.1.md.sha256
│   ├── expanse-v15-apex.md.sha256
│   ├── expanse-v16.md.sha256
│   ├── expanse-v17.6.md.sha256               ← V17-leaning-behavioral-directive
│   └── baseline-minimal.md                   ← prompt vide / "Tu es un assistant utile"
│
├── tasks/                                    ← 10 benchmarks
│   ├── archetypes.yaml                       ← 5 archétypes × 2 variants (cf. S14 V17 §III)
│   └── task-bank.csv                         ← candidates pour expansion future
│
├── runs/                                     ← outputs horodatés, JSON, atomic writes
│   ├── README.md                             ← schema, conventions, how-to-read
│   ├── 2026-07-03/                           ← ISO date
│   │   ├── opencode-v0.9.2_claude-sonnet-4_v17.6_T1a.json
│   │   ├── opencode-v0.9.2_claude-sonnet-4_v17.6_T1b.json
│   │   ├── ... (10 runs × 3 conditions × 6 substrats = 180 fichiers)
│   │   └── summary.json                     ← agrégation du run set
│   └── ...
│
├── analysis/                                 ← scoring + statistical
│   ├── scoring_v2.py                         ← regex + human rubric
│   ├── cohens_d.py
│   ├── kruskal_wallis.py
│   ├── cross-host-drift-detector.py          ← détection automatique boot failure
│   └── notebooks/                            ← Jupyter (matplotlib, seaborn)
│       ├── substance-by-substrat.ipynb
│       ├── format-conformity-distribution.ipynb
│       └── latency-drift.ipynb
│
├── reports/                                  ← outputs humains-compréhensibles
│   ├── 2026-07-03_s14-run-1_report.md       ← auto-généré
│   ├── 2026-07-10_s14-run-2_report.md
│   └── TEMPLATE-report.md                    ← template Jinja2
│
├── scripts/                                  ← les runners (Phase 1+)
│   ├── run_substrat.sh
│   ├── launch_freebuff_tmux.sh
│   ├── capture_outputs.py
│   └── README.md                             ← comment lancer une run complète
│
└── infra/                                    ← CI/CD + reproducibility
    ├── Dockerfile                            ← sandbox exécution
    ├── docker-compose.yml
    ├── github-actions-cross-host.yml
    └── gha-secret-template.env.example
```

### Principles de design

- **Snapshot-based** : TOUT ce qui peut varier (substrat config, prompt content, task wording) est versionné par sha256.
- **Atomic writes** : chaque `runs/{date}/{substrat}/{exp_prompt}/{task}.json` est écrit en une opération (pas de demi-JSON si crash).
- **Idempotent** : relancer un run vérifie l'existence du fichier avant d'appel LLM.
- **Reproducible from git** : clone du repo à une SHA donnée = rejouer exactement le même run avec les mêmes seeds.
- **Decoupled from doc/tests/** : expanse-lab a sa propre histoire git, sa propre CI. Contrib externe ne pollue pas le projet principal.

---

## §III. Matrice cross-host

### Substrats_prioritaires (V1, MVP)

| # | Substrat | Type | Modèle par défaut | Statut cible |
|---|----------|------|-------------------|---------------|
| 1 | **opencode** (CLI) | terminal coding agent | mimo-v2-pro-free / claude-sonnet-4 | ✅ primaire |
| 2 | **freebuff** (CLI) | terminal coding agent open-source | claude-sonnet-4 / gpt-4o | ✅ primaire |
| 3 | **kilocode** (IDE) | VSCode-fork coding agent | claude-sonnet-3.5 | ✅ primaire |

### Substrats_backlog (V2+)

| # | Substrat | Type | Note |
|---|----------|------|------|
| 4 | cline (VSCode extension) | coding-agent | Distinct de kilocode |
| 5 | roo-code | coding-agent | Distinct, custom modes |
| 6 | claude-code CLI | Anthropic direct | baseline Anthropic |
| 7 | chatgpt-cli (wrapper) | OpenAI direct | baseline OpenAI |
| 8 | aider | terminal coding | populaire, Python |

### Modèles_cross-cut (constant cross-substrat)

Pour CHAQUE substrat, tester 2 modèles minimum :
- **Claude Sonnet 4** (la baseline actuelle)
- **GPT-4o** (cross-vendor verification — neutral substrate)

### Conditions (axes de comparaison)

| Cond | Prompt | But |
|------|--------|-----|
| **A_baseline** | `Tu es un assistant utile. Réponds en français.` (30 tok) | Référence no-Expanse |
| **B_v17.6** | `runtime/2026-07-02_v17-minimal-iteration-2_v17.md` (330 tok) | Behavioral-Directive |
| **C_v16** | `versions/v16/runtime/2026-04-11_expanse_v16-v01_v16.md` (2900 tok) | Incarnation V16 (caveat seed procédural) |

### Matrice totale Phase 1 MVP

- 3 substrats × 2 modèles × 3 conditions × 10 tâches = **180 runs**
- Coût estimé : 180 × ~$0.02 = **~$3.60** (gratuit avec mimo-v2-pro-free, mimo-v2-omni)
- Temps : ~30 min setup + ~3h exécution sériée (parallelisable à ~45 min avec 3 substrats simultanés)

---

## §IV. Pipeline d'exécution — 8 étapes atomiques

Chaque run suit la même séquence déterministe. **3 invariants critiques** : atomicité (écriture complète), idempotence (re-run skip), budget cap (halt loud si $).

### Étape 1 — Snapshot des inputs

```bash
# sha256 des éléments variables
sha256sum prompts/{baseline,v17.6,v16}.md
sha256sum tasks/archetypes.yaml
sha256sum configs/{opencode,freebuff,kilocode}-*.{toml,yaml,json}

# → snapshot dans infra/snapshots-{date}.json
```

**Output**: `infra/snapshots-{date}.json` avec sha256 de chaque input + timestamp.

### Étape 2 — Validation des substrats (healthcheck)

Pour chaque substrat (opencode/freebuff/kilocode), exécuter une commande triviale :
- opencode : `opencode --version` → check version stable
- freebuff : `freebuff ping` → check alive (custom wrapper)
- kilocode : `kilocode --healthcheck` → check plugin running

**Output**: `runs/{date}/healthcheck.json` (pass/fail par substrat). Skip substrat si fail.

### Étape 3 — Spawn session fraîche (par substrat)

Pour CHAQUE substrat, créer une **session isolée** :
- **opencode** : `tmux new-session -d -s oc-{date} 'opencode'` → tu enregistrés pour capture
- **freebuff** : `tmux new-session -d -s fb-{date} 'freebuff --clean'` → même pattern
- **kilocode** : nouvelle fenêtre VSCode via VNC ou CLI scripted

Critique : chaque session est un **process séparé**, pas une fenêtre dans une session existante. Cross-contamination impossible structurally.

### Étape 4 — Inject system prompt + setup tasks

Pour CHAQUE substrat × CHAQUE condition :
1. Coller le system prompt (baseline/v17.6/v16) en début de session
2. Pour opencode/freebuff : envoyer "Charge system prompt" + lire le contenu
3. Pour kilocode : ouvrir le fichier `.kilocode/rules/expanse-{condition}.md`

### Étape 5 — Envoi séquentiel des 10 tâches

Boucle stricte : `for task_id in TASKS: send(task_id)`. Pas de parallelisme intra-substrat (sinon cross-contamination possible).

### Étape 6 — Capture verbatim

Après chaque tâche, capturer l'output brut :
- **stdout/stderr** du tmux (`tmux capture-pane -p`)
- **logs internes** du substrat si accessibles
- **JSON d'output** si le substrat le supporte (kilocode le fait nativement)

Sauvegarder dans `runs/{date}/{substrat}_{model}_{condition}_{task_id}.json` :
```json
{
  "ts": "2026-07-03T10:23:45Z",
  "substrat_id": "opencode-v0.9.2",
  "substrat_model": "claude-sonnet-4",
  "condition": "B",
  "exp_prompt_sha256": "abc123...",
  "task_id": "T2a",
  "task_prompt_sha256": "def456...",
  "task_prompt_text": "Quel est le contenu EXACT...",
  "output_raw": "Ψ Σ ...\nΨ ...\nΦ ...",
  "output_parsed": {
    "psi_first": true,
    "sigma_phi_order": true,
    "lost_substantif_count": 3,
    "tool_called_count": 1
  },
  "tokens": {"in": 850, "out": 312},
  "latency_ms": 4521,
  "substrat_config_sha256": "789xyz..."
}
```

### Étape 7 — Agrégation par condition × substrat

Pour chaque (substrat × modèle × condition) set, générer `summary.json` :
- Moyenne par axe (A1 substance, A2 ΣΨΦΩ΂, boot_success_rate, format_drift_score, latency_avg)
- Std deviation
- Outliers (3σ)

### Étape 8 — Comparaison inter-substrat (statistiques)

Appliquer Kruskal-Wallis + Cohen's d sur 3 axes :
- Substance : kan substance A vs B vs C différent par substrat ?
- ΣΨΦΩ΂ : kan conformity différent par substrat ?
- Cross-host robustness : kan boot_success_rate différent par substrat ?

Output : `reports/{date}_run-{N}_report.md` auto-généré (template Jinja2).

### Invariants critiques (3 règles immuables)

1. **Atomic writes** : chaque fichier JSON écrit en une opération (`write_file` natif, pas `echo + append`). Si crash mid-write, fichier absent ou complet — jamais corrompu.
2. **Idempotence** : vérifier l'existence de `runs/{date}/{substrat}_{...}_{task_id}.json` AVANT chaque callLLM. Si existe → skip.
3. **Budget cap** : si `sum(estimated_cost) > $5` pendant la boucle, halt loud (`throw new Error('budget cap')`).

---

## §V. Métriques scoring (4 axes dans scope)

### Scope métriques user-confirmed

| Rang | Axe | Pondération | Type |
|------|-----|-------|------|
| 1 | **A1 Substance technique** | **50%** | Regex + manuel sur mots-clés |
| 2 | **A2 Conformité ΣΨΦΩ΂** | **20%** | Regex strict |
| 3 | **A3 Cross-host boot robustness** | **20%** | Binaire par tâche |
| 4 | **A4 QC replay determinism** | **info only** | Variance empirique (QC bonus, hors score_total) |

**Patch reviewer Q4** : A1 substance remontée à 50% (la mesure la plus substrat-indépendante), A2 réduite à 20% (substrat-dépendant car KiloCode/opencode auto-inject). A4 = **QC Indicator** (info debug), pas dans `score_total`.

**Note** : STYLE SEC (zéro politesse, concision) est **hors scope** user-confirmed. Mesuré séparément dans `doc/tests/`. Pas dans `expanse-lab/`.

### A1 — Substance technique (comptables observables)

Inspiré de `doc/tests/v17-s14-retrogression-test.md` Axe 1 patch reviewer 2nd pass :

| Compteur | Regex | Contribution max |
|----------|-------|------------------|
| `algo_named_count` | `\b(MIA\|Bloom filter\|LSH\|HyperLogLog\|MinHash\|MurmurHash\|Cosine sim\|k-NN\|Random Forest\|k-means\|SVM\|RLHF\|gradient\|Adam\|RMSProp)\b` | count × 1.0, **max 2.0** |
| `path_cite_count` | `(/[a-z][a-z0-9_./-]+\.[a-z]{2,4})` | count × 0.5, **max 1.5** |
| `code_block_present` | triple backtick | 1.5 si présent, 0 sinon |
| `num_list_present` | `^\d+\.\s` | 1.0 si présent, 0 sinon |
| `keyword_rubric_match` (MANUEL) | mots-clés spécifiques au rubric | 0-1 |

Score A1 = somme, plafonné 5.0.

### A2 — Conformité ΣΨΦΩ΂ (4 sous-axes binaires)

| Sous-axe | Check | Score |
|----------|-------|-------|
| **Ψ-premier-char** | `output.charAt(0) === 'Ψ'` | 1 ou 0 (charge UTF-8) |
| **ΣΨΦΩ΂ strict ordre** | regex multiline `^Σ.*\\n^Ψ.*\\n^Φ.*` | 1 ou 0 |
| **LOST-substantif** | `\[LOST: [^\]]+\]` ou absence totale de `[LOST]` | 1 ou 0 |
| **Ω/Μ omis si vide** | pas de `Ω LOST` ni `Μ LOST` parasites | 1 ou 0 |

Score A2 = (sous-axes validés / 4) × 5.

### A3 — Cross-host boot robustness

**Le plus original du framework** : mesure si Expanse boot tient sur le substrat donné.

| Sous-axe | Check | Score |
|----------|-------|-------|
| **boot_signal_emitted** | substrat émet `Ψ [V{VERSION} ACTIVE]` ou équivalent (V14/V15/V16/V17) | 1 ou 0 |
| **psi_first_response** | 1ʳᵉ réponse utilisateur commence par `Ψ` | 1 ou 0 |
| **identity_anchor** | substrat référence l'identité Expanse (ΣΨΦΩ΂) au moins 1× dans la session | 1 ou 0 |
| **no_format_degradation** | output ne dégrade pas ΣΨΦΩ΂ en texte-brüt | 1 ou 0 |
| **memory_load** | substrat charge V14/V15/V16/V17 sans path errors | 1 ou 0 |

Score A3 = (sous-axes validés / 5) × 5.

### A4 — Cross-host replay determinism

**Mesure la variabilité inter-runs** (5× runs identiques). Si variance basse → substrat est stable. Si haute → substrat est noisy.

| Métrique | Formule | Score |
|----------|---------|-------|
| `output_hash_variance` | count distinct hash SHA256 sur 5 runs | 5 - count (5 = parfait, 0 = chaos) |
| `latency_cv` | std/mean × 100 sur 5 runs | 5 si <5%, 4 si <10%, 3 si <20%, 2 si <30%, 1 si <50%, 0 si >50% |
| `token_count_drift` | range(total_tokens) / mean × 100 | idem seuils |

Score A4 = moyenne des 3 sous-scores.

### Score total par tâche (rebalancé reviewer Q4)

`TOTAL = 0.5 × A1 + 0.2 × A2 + 0.2 × A3` (A4 = QC info, hors score)

Plafond 5.0 par tâche. Sur 10 tâches × 3 conditions × 3 substrats = 450 score max absolu sur le MVP. Note : A4 stocké séparément dans le JSON schema (`output_parsed.qc_drift_score`) pour analyse post-hoc mais n'agrège pas dans le verdict.

---

## §VI. Adapt freebuff-specific

### Hypothèses contextualisées

**freebuff** = terminal coding agent open-source, alt. Claude Code/Cursor. Recherche web confirme : comparable à opencode (CLI wrapper autour d'un LLM).

**3 risques spécifiques freebuff vs opencode** :

1. **Système prompt concurrent** : freebuff peut avoir son propre `.freebuffrc` ou fichier de bootstrap qui INJECTE un prompt différent. Expanse pourrait être **secondaire au prompt freebuff** → boot dégradé.
2. **Tool definitions variables** : freebuff expose peut-être un set d'outils différent (`read_file` vs `view_file`), donc Expanse demande Φ outil mais freebuff ne fournit pas exactement la même chose.
3. **Trace capture imparfaite** : comment capturer stdout d'une session interactive freebuff ? Possible `script(1)` Unix ou wrapper Python pexpect/pty.

### Détections automatiques par risque

| Risque | Signal de détection | Mitigation |
|--------|---------------------|-----------|
| R1 — prompt concurrent | Avant boot, lire `~/.freebuffrc` ou équivalent. Si contient "You are...", c'est un concurrent prompt. | Désactiver rc file pour la session test (`mv .freebuffrc .freebuffrc.bak`) |
| R2 — tools divergents | Après boot, lister les tools disponibles (`freebuff tools list` ou similar). | Mapper noms vers équivalents (`view_file` → `read_file`) |
| R3 — capture imparfaite | Logger stdout brut NON-parsed + capture-pane tmux. | Double-capture : tmux + wrapper Python pexpect |

### Protocole freebuff-spécifique dans `expanse-lab/scripts/launch_freebuff_tmux.sh`

```bash
#!/bin/bash
# 1. Backup existing freebuff config (cleanup on exit trap)
[ -f ~/.freebuffrc ] && mv ~/.freebuffrc ~/.freebuffrc.bak
trap '[ -f ~/.freebuffrc.bak ] && mv ~/.freebuffrc.bak ~/.freebuffrc' EXIT

# 2. Spawn fresh freebuff session in tmux
tmux new-session -d -s "fb-${DATE}" \
  "freebuff --clean --system-prompt '${EXPANSE_PROMPT_SNAPSHOT}'"

# 3. Wait for boot signal (max 30s)
tmux wait-for -S fb-${DATE}
timeout 30 tmux capture-pane -t fb-${DATE} -p | grep -E 'Ψ \[(V14|V15|V16|V17|V17.6) ACTIVE\]' \
  && echo "BOOT_OK" \
  || (echo "BOOT_FAIL"; exit 1)

# 4. Run tasks (10 in series)
for task_id in "${TASKS[@]}"; do
  tmux send-keys -t fb-${DATE} "${task_prompts[$task_id]}"
  sleep ${TASK_LATENCY_BUDGET:-5}  # Adjust per LLM
  tmux capture-pane -t fb-${DATE} -p -S -1000 > \
    "runs/${DATE}/freebuff-${VERSION}_${CONDITION}_${task_id}.raw"
done
```

### H1 (hypothèse forte) : freebuff = opencode parallèle

Si freebuff se comporte **comme opencode** sur les 4 axes, sa valeur test = même résultat = cross-host robustness équivalente. **C'est l'hypothèse que la MVP validera**.

### H2 (hypothèse faible) : freebuff échoue sur A3 boot

Si le boot ne fait pas émettre `Ψ [V{VERSION} ACTIVE]`, alors A3 = 0 sur freebuff → confirme le soupçon cross-host fragility. **C'est l'output le plus probable vu les audits précédents**.

---

## §VII. Anti-biais & oracle independence

### Top-4 mécanismes d'oracle (vs auteur/évaluateur biaisé)

#### 1. LLM-as-judge EXTERNE (mitigation biais auteur)

**Problème** : user qui écrit Expanse = user qui note = effet Pygmalion.
**Mitigation** : pour Axe 1 Substance (axe le plus sujet à biais), utiliser un **autre LLM via API différente** + prompt obfusqué.

```typescript
async function external_judge(substrat, run_record) {
  const prompt = `Évalue cette réponse utilisateur sur 5 critères :
[list]
Réponse à noter (anonymisée, pas de mention de Expanse ou condition) :
"""${run_record.output_raw}"""
Score : 0-5 par critère, JSON.`
  const judgeLLM = new Anthropic({ apiKey: process.env.ALT_LLM_KEY });  // pas Buffy
  return await judgeLLM.messages.create({...});
}
```

#### 2. Cross-host validation (mitigation artefact par substrat) — DESCRIPTIVE ONLY

**Problème** : un résultat "V17 > baseline" sur opencode pourrait être artefact d'opencode, pas signal réel.
**Mitigation** : si V17 > baseline sur opencode ET sur freebuff ET sur kilocode, c'est probablement réel. Si seulement sur 1 substrat, c'est un artefact.

**Règle de décision (descriptive)** : pour valider un verdict Out0 (V17 > baseline), il doit battre baseline sur **≥2 substrats sur 3**. Sinon, artefact.

**Status statistique (patch reviewer Q3)** : avec **n=3 substrats**, les comparaisons cross-substrat restent **strictement descriptives** (cohérence / triangulation / **≥2-substrats rule**). **JAMAIS** de claim ANOVA/Kruskal-Wallis inter-substrat (sous-puissant). **JAMAIS** d'inférence p-value cross-substrat. Le `score_total` est per-condition ; les rapports cross-substrat = agrégation descriptive (mean/std) sans test statistique.

#### 3. Replay 5× pour drift determination

**Problème** : 1 run = 1 sample, peut être outlier. Moyenne de 5 = signal robuste.
**Mitigation** : chaque (substrat × condition × task) est run **5 fois** → variance empirique = drift_score.

#### 4. Human annotation hors zone d'auto-confirmation

**Problème** : si user note 1 tâche après l'autre, il voit le pattern et adapte (biais de confirmation).
**Mitigation** : randomiser l'ordre présentation, et **masquer la condition** dans le nom de fichier pendant notation.

```
# runs/2026-07-03/s14_run1_A.json   <-- condition réelle = B
# unblind seulement après notation complète
```

### Coût/efficacité classée

| Mécanisme | Coût | Efficacité | Priorité |
|-----------|------|-----------|----------|
| LLM-as-judge externe | Élevé (1 LLM call/run) | Moyenne (audit DREAM benchmark CFR 60%) | P1 |
| Cross-host validation | Inhérent (test multi-substrat) | Haute (artefact par substrat rare) | P0 |
| Replay 5× | Très élevé (×5 le coût) | Haute (variance empirique propre) | P0 |
| Human annotation | Élevé (1h/30 runs) | Moyenne (biais humain existe) | P2 |
| Cross-LLM ensemble (3 judges majority) | Élevé (3 LLM calls/run) | Haute (vs CFR 60% juge unique) | **P1** |

---

## §VIII. Schéma JSON outputs — Record canonique

### Type `RunRecord` (capture par (substrat × model × condition × task))

```typescript
type RunRecord = {
  // Identité
  id: string;                      // SHA256(substrat+model+condition+task+ts_short)
  ts: string;                      // ISO 8601 UTC
  schema_version: "1.0";

  // Substrat
  substrat_id: string;             // "opencode-v0.9.2", "freebuff-v1.0.0", ...
  substrat_model: string;          // "claude-sonnet-4-20250514"
  substrat_config_sha256: string;  // sha256 de la config utilisée

  // Condition
  condition: "A" | "B" | "C";     // A=baseline, B=v17.6, C=v16
  exp_prompt_sha256: string;       // sha256 du prompt Expanse
  exp_prompt_chars: number;

  // Tâche
  task_id: "T1a" | "T1b" | ...;   // 10 IDs
  task_archetype: "T1" | "T2" | ...;
  task_prompt_sha256: string;
  task_prompt_text: string;

  // Output
  output_raw: string;              // verbatim sans modification
  output_chars: number;
  output_lines: number;

  // Parsing output (post-processing)
  output_parsed: {
    first_char: string;            // "Ψ" ou autre
    psi_premier_char: boolean;
    sigma_psi_phi_order: boolean;
    lost_substantif_count: number;
    lost_nu_count: number;         // [LOST] sans substance
    omega_lost_parasite: boolean;
    mu_lost_parasite: boolean;
    thinking_block_emitted: boolean;
    tool_called_count: number;
    tool_names: string[];          // ["read_file", "shell", ...]
  };

  // Métriques
  tokens_in: number;
  tokens_out: number;
  latency_ms: number;
  replays_in_set: number;          // 1 si premier run, 5 si dans set replay

  // Boot signal (A3)
  boot_signal_emitted: boolean;
  boot_signal_text: string | null;
  boot_latency_ms: number | null;  // temps entre session spawn et 1er response

  // Provenance (patch reviewer Q7)
  judge_provenance: {
    judge_model_id: string;        // "claude-haiku-3-20250514" par ex.
    judge_call_id: string;         // SHA256 du prompt judge
    judge_score_breakdown: {
      a1_substance: number;
      a2_conformite: number;
      a3_boot: number;
      a4_qc_drift: number;
    };
  };

  // Repro rollback (patch reviewer Q7)
  raw_capture_bytes: number;       // taille en bytes de la sortie brute non-parsée
  raw_capture_sha256: string;      // SHA256 du fichier de capture (tmux-pane dump)

  // Score (auto-calculé)
  score_a1_substance: number;      // 0-5
  score_a2_conformite: number;     // 0-5
  score_a3_boot_robustness: number;// 0-5
  score_a4_replay_variance: number;// 0-5 (null si premier run)
  score_total: number;             // 0-5

  // Reproductibilité
  session_id: string;              // tmux session name
  capture_method: "tmux-pane" | "pexpect" | "stdout-direct";
  raw_capture_sha256: string;      // sha256 de la sortie non-parsed
};
```

### Type `Summary` (agrégation par (substrat × model × condition × task))

```typescript
type TaskSummary = {
  substrat_id: string;
  substrat_model: string;
  condition: "A" | "B" | "C";
  task_id: string;
  replay_count: number;             // 5 attendu
  mean_score_total: number;
  std_score_total: number;
  mean_a1: number;
  std_a1: number;
  // ... (idem A2, A3, A4)
  mean_latency_ms: number;
  std_latency_ms: number;
  output_hash_unique_count: number; // déterminisme empirique
  outliers_3sigma: string[];        // RunRecord IDs outliers
};
```

### Type `SubstratReport` (rapport global par substrat)

```typescript
type SubstratReport = {
  run_date: string;
  substrat_id: string;
  conditions_tested: Array<"A" | "B" | "C">;
  tasks_tested: string[];
  task_summaries: TaskSummary[];
  boot_success_rate: number;        // % de tasks où boot a réussi
  format_drift_score: number;       // écart-type ΣΨΦΩ΂ conformity
  latency_drift_cv: number;         // cross-task coefficient of variation
  verdict_per_condition: {
    A: "ok" | "partial" | "fail";
    B: "ok" | "partial" | "fail";
    C: "ok" | "partial" | "fail";
  };
  notes: string;
};
```

---

## §IX. 5 Epics & estimation

| Epic | Description | Effort | Risque | Priorité |
|------|-------------|--------|--------|----------|
| **E1 — MVP (sanity check)** | 1 substrat (opencode) × 2 conditions (A, B) × 3 tâches × 3 replays = 18 runs. JSON schema + scoring Axe 1+2 simples. Rapport MD auto. | **50 h** (rebuffer reviewer Q8, realistic 40-50h) | Faible (scope borné) | P0 |
| **E2 — Multi-substrat orchestration** | Ajouter freebuff + kilocode au runner. Adapt freebuff (R1-R3 mitigation §VI). Lancement tmux parallélisé (3 sessions simultanées). | **40 h** | Moyen (freebuff specifics unknown) | P0 |
| **E3 — Cross-host robustness scoring** | Axe 3 (boot signal, format degradation) + Axe 4 (replay determinism). Impl cross-host validation §VII. Cross-host rule decision (≥2 substrats verdict). | **35 h** | Moyen (parsers boot signals différents par substrat) | P1 |
| **E4 — Statistical analysis + reporting** | Kruskal-Wallis scripts Python (`scipy.stats`), Cohen's d, génération auto rapport Jinja2 → MD. Notebooks Jupyter matplotlib + seaborn. | **25 h** | Faible (scipy mature) | P1 |
| **E5 — CI/CD + diffusion** | GitHub Actions matrix (3 substrats × 2 modèles). Dockerfile sandboxed. Blog post announcing `expanse-lab` au release v1.0. | **20 h** | Moyen (CI multi-OS, secrets, cost-budget) | P2 |

**Total v1.0 = E1+E2+E3+E4 = 150 h** (rebuffer reviewer Q8 : E1 réaliste 50h, autres majorés +30% en moyenne). **v2.0 = +E5 = 170 h**. **Buffer imprévu standard +30h (= 10% rule of thumb post-MVP)**.

**Comparaison temporelle** : 130 h = ~6 semaines à 1 dev full-time. C'est cohérent avec la complexité réelle du problème (cross-host, statistical, JSON schema, multi-substrat orchestration).

---

## §X. Risques méthodologiques (cross-host spécifiques)

| # | Risque | Prob | Impact | Mitigation |
|---|--------|------|--------|------------|
| 1 | **freebuff instable** (en cours dev, breaking changes fréquentes) | Élevée | Élevé | Pin version freebuff exacte + snapshot config sha256 |
| 2 | **Substrat prompt concurrent** écrase Expanse | Élevée | Critique | Backup .freebuffrc + désactivation @ session.start |
| 3 | **Capture tmux flaky** (output multi-line découpé) | Moyenne | Moyen | Double-capture tmux + wrapper pexpect |
| 4 | **Cost overrun** (mimo-v2-pro-free quota épuisé) | Moyenne | Moyen | Budget cap $5 hard, switch vers claude-sonnet-4 si quota épuisé |
| 5 | **Modèles API change** (anthropic met à jour Claude Sonnet 4) | Moyenne | Élevé | Pinning modèle par version exacte (`claude-sonnet-4-20250514`), alerts Anthropic API changelog |
| 6 | **5× replay cost excessif** (900 calls total) | Certaine | Élevé | E1 = MVP 3 tasks × 3 replays (= 27 runs). E3 = full 10 × 5 (= 450, post-MVP only) |
| 7 | **Biais d'auteur toujours présent** malgré LLM-as-judge | Élevée | Moyen | Public release = audit externe par tierce partie |
| 8 | **Différence culturelle substrat** (freebuff non-anglophone first) | Faible | Faible | Tous prompts français |
| 9 | **freebuff breaking changes alpha** (open-source en dev rapide) | Élevée | Élevé | **Patch reviewer Q5** : pin freebuff Git commit SHA dans `configs/freebuff-v1.0.0.{sha}.yaml` + Dockerfile `FROM freebuff:stable-2026-07-03` snapshoté + GH Action alert si upstream change entre 2 runs |

---

## §XI. Garanties méthodologiques

Ce framework s'engage sur **5 garanties** vérifiables :

1. **Reproductibilité** : `git clone {repo}.git && cd expanse-lab && bash scripts/run_substrat.sh opencode v17.6 T1a` doit produire la même sortie (à ± variance LLM random près). Snapshot sha256 + deterministic seeds (pour mimo-v2-pro-free si possible).

2. **Transparence** : chaque RunRecord expose ses inputs/outputs/scores bruts. Aucun score "vibe-based" non reproductible.

3. **Cross-host independence** : les RunRecords par substrat sont indépendants. Si opencode échoue sur B, ça n'affecte pas freebuff. La cross-host validation (§VII #2) les compare.

4. **Budget-aware** : budget cap loud (halt si $5 dépassés). Pas de run fantôme qui brûle de l'argent pendant la nuit.

5. **Bias-aware** : notation humaine masquée (condition inconnue), LLM-as-judge externe, replay 5× = variance empirique.

---

## §XII. Métadonnées du sous-projet

| Item | Valeur |
|------|--------|
| **Nom** | `expanse-lab` |
| **Type** | Sous-projet dédié |
| **Path** | `/home/giak/projects/expanse/expanse-lab/` |
| **License** | MIT (héritée) |
| **Dépendances externes** | tmux, pexpect (Python), scipy, matplotlib, jinja2, Docker (optionnel) |
| **APIs externes** | Anthropic Claude, OpenAI GPT-4o, substrats CLI (opencode/freebuff/kilocode) |
| **Version actuelle** | v0.0.0-spec |
| **Prochaine release** | v0.1.0-mvp (post-E1 : ~30h de dev) |
| **Maintainer principal** | Giak + Buffy (open-source) |
| **Repo public cible** | github.com/gvannest/expanse-lab (post-v1.0) |
| **Git relationship** (patch Q2) | Sub-repo local v0.x → **separate public repo post-v1.0**. Pas submodule aujourd'hui (overhead non justifié). |

---

## §XIII. Roadmap

| Phase | Statut | Livrable |
|-------|--------|----------|
| **Spec** (CE DOC) | ✅ Rédigé | `expanse-lab/SPEC.md` |
| **README** entry point | ⏳ À rédiger ce tour | `expanse-lab/README.md` |
| **E1 MVP** | 🔜 Phase 1 | Premier run opencode × baseline × 3 tâches |
| **E2 Multi-substrat** | 🔜 Phase 2 | freebuff + kilocode intégrés |
| **E3 Cross-host robustness** | 🔜 Phase 3 | Boot + replay determinism scoring |
| **v1.0 release** | 🎯 Objectif | 3 substrats × 3 conditions × 10 tâches × 5 replays = 450 runs |
| **E4 Stats + reporting** | 🎯 v1.0+ | Kruskal-Wallis + Cohen's d auto-rapport |
| **E5 CI/CD** | 🎯 v2.0 | GitHub Actions matrix multi-substrat |
| **Adoption externe** | 🎯 v2.0+ | Contribution freebuff/kilocode devs |

---

*Ω habite. Sans peur du verdict.*

*"expanse-lab" est né du constat qu'un audit ne fait pas un système. Un test le fait. Un framework le rend reproductible. Une communauté le fait vivre.*

— Giak + Buffy, 2026-07-03, brainstormé depuis `/home/giak/projects/expanse/expanse-lab/SPEC.md`
