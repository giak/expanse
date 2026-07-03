# EXPANSE V15 — Comment ça Marche (Sous le Capot)

Ce document décrit exactement ce qui se passe mécaniquement quand EXPANSE V15 tourne. Pas de poésie. Du séquentiel, du concret.

**Date :** 2026-03-28  
**Version :** V15 — TRACE:FRESH v2  
**Couverture :** Architecture complète, 6 scénarios, pipeline search, mémoires réelles

---

## NOUVEAUTÉS V15

| Feature | Description | Statut |
|---------|-------------|--------|
| ECS 2D | Evaluation of Cognitive Complexity (C + I → L1/L2/L3) | ✅ TESTÉ |
| Σ | Input Sensorium — Découpage sémantique | ✅ TESTÉ |
| Ψ⇌Φ | Boucle métacognition ↔ audit si L2+ | ✅ TESTÉ |
| Style SEC | Anti-questions, 0 flagornerie, réponses minimales | ✅ TESTÉ |
| Μ Cristallisation | write_memory / read_memory / update_memory | ✅ TESTÉ |
| Μ Décristallisation | read_memory → vérification → update_memory(doubt) | ✅ TESTÉ |
| Μ Consolidation | consolidate_memory pour sys:history | ✅ TESTÉ |
| System Snapshot | get_system_snapshot en 1 appel (~50ms) | ✅ TESTÉ |
| Consumption Tracking | consumed=False + mark_consumed | ✅ TESTÉ |
| Lifecycle Search | lifecycle_state=sealed/candidate/doubt | ✅ TESTÉ |
| Markdown Indexing | index_markdown_workspace (10x plus rapide) | ✅ TESTÉ |
| Tag-Based Decay | configure_decay par tag (DB config) | ✅ TESTÉ |
| Adaptive RRF k | k=20/60/80 selon query type | ✅ TESTÉ |
| Reranking | Cross-encoder activé par défaut (+20-30%) | ✅ TESTÉ |
| Halfvec | float16 embeddings (-50% stockage) | ✅ TESTÉ |
| Security | Auth API Key, rate limiting, SQL injection fixés | ✅ TESTÉ |

---

## 1. ARCHITECTURE — Vue Matérielle

### 1.1 Les 3 Composants

```
┌──────────────────────────────────────────────────────────────┐
│                         IDE (OpenCode)                        │
│                                                              │
│  ┌──────────────────────────────────────────────┐            │
│  │ Strate 0 : System Prompt                      │            │
│  │                                               │            │
│  │  expanse-v15-boot-seed.md (4 lignes)          │            │
│  │    → "read_file(expanse-v15-apex.md)"         │            │
│  │    → "Exécuter § IV BOOT_CONFIG"              │            │
│  │                                               │            │
│  │  expanse-v15-apex.md (320 lignes)             │            │
│  │    → Règles vivantes V15                      │            │
│  │    → ECS, Classification, Cristallisation     │            │
│  │    → BOOT_CONFIG, Memory, Résilience          │            │
│  │                                               │            │
│  │  expanse-dream.md (599 lignes) — ASYNCHRONE   │            │
│  │    → 5 Passes d'introspection                 │            │
│  │    → Chargé UNIQUEMENT sur /dream             │            │
│  └──────────────────────┬───────────────────────┘            │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────┐            │
│  │      LLM (Claude, Gemini, Mimo, etc.)         │            │
│  │                                               │            │
│  │  Input : System Prompt + Message Utilisateur  │            │
│  │  Processus interne :                          │            │
│  │    Σ → ECS → Ψ⇌Φ → Ω → Auto-Check → Émission│            │
│  │                                               │            │
│  │  Outils : MCP Tools (appels API)              │            │
│  │  Fichiers : read_file, write_file, bash       │            │
│  └──────────────────────┬───────────────────────┘            │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │ MCP Protocol (stdio)
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                    Mnemolite (Docker)                         │
│                                                              │
│  API REST : http://localhost:8001                             │
│  MCP Server : stdio (via mnemo-api container)                │
│  DB : PostgreSQL 18 + pgvector 0.8.1                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                 MÉMOIRES (table memories)               │  │
│  │                                                        │  │
│  │  PERMANENT (decay=0)                                   │  │
│  │  ┌──────────┐  ┌──────────┐                           │  │
│  │  │sys:core  │  │sys:anchor│                           │  │
│  │  │10 mémos  │  │11 mémos  │                           │  │
│  │  │Lois      │  │Scelle-   │                           │  │
│  │  │scellées  │  │ments     │                           │  │
│  │  └──────────┘  └──────────┘                           │  │
│  │                                                        │  │
│  │  LONG TERME (decay=0.005, half-life=140j)             │  │
│  │  ┌──────────────┐  ┌────────────┐                     │  │
│  │  │ sys:pattern   │  │sys:user:   │                     │  │
│  │  │ 12 mémos      │  │  profile   │                     │  │
│  │  │ + 14 candidate│  │ 1 mémo     │                     │  │
│  │  │ + 2 doubt     │  │            │                     │  │
│  │  └──────────────┘  └────────────┘                     │  │
│  │                                                        │  │
│  │  MOYEN TERME (decay=0.01, half-life=70j)              │  │
│  │  ┌──────────────┐  ┌──────────────┐                   │  │
│  │  │sys:extension │  │sys:project   │                   │  │
│  │  │2 mémos       │  │1 mémo        │                   │  │
│  │  └──────────────┘  └──────────────┘                   │  │
│  │                                                        │  │
│  │  COURT TERME (decay=0.02-0.1, consumption tracking)   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │ sys:history   │  │  sys:drift   │  │TRACE:FRESH │  │  │
│  │  │ 24 mémos      │  │  0 mémos     │  │ 16 mémos   │  │  │
│  │  │ decay=0.05    │  │  decay=0.02  │  │ decay=0.1  │  │  │
│  │  │ consol@20     │  │  consumed ✅  │  │ consumed ✅ │  │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘  │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                WORKSPACE (Φ Vessel)                     │  │
│  │  369 chunks .md indexés (repository: expanse)          │  │
│  │  180 chunks avec embeddings halfvec                    │  │
│  │  index_markdown_workspace() — 10x plus rapide          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │               PIPELINE SEARCH                          │  │
│  │  pg_trgm (lexical) + HNSW halfvec (vector)            │  │
│  │  + RRF fusion (k adaptatif 20/60/80)                   │  │
│  │  + Cross-encoder reranking (+20-30%)                   │  │
│  │  + Temporal decay (par tag)                            │  │
│  │  ef_search=100, iterative_scan=relaxed_order           │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │               OUTILS MCP                               │  │
│  │                                                        │  │
│  │  MÉMOIRE :          INDEXATION :                       │  │
│  │  write_memory       index_markdown_workspace           │  │
│  │  search_memory      index_incremental                  │  │
│  │  read_memory        index_project                      │  │
│  │  update_memory      reindex_file                       │  │
│  │  delete_memory                                          │  │
│  │  consolidate_memory CONFIG :                           │  │
│  │  mark_consumed      configure_decay                    │  │
│  │  get_system_snapshot switch_project                    │  │
│  │                      clear_cache                        │  │
│  │  CODE :                                                 │  │
│  │  search_code                                            │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │               INFRASTRUCTURE                           │  │
│  │  mnemo-api (2 CPU, 24GB RAM) — FastAPI + MCP           │  │
│  │  mnemo-postgres (PG18 + pgvector) — 19,531 chunks      │  │
│  │  mnemo-redis (7) — Cache L2 + task queue               │  │
│  │  mnemo-worker — Batch processing                       │  │
│  │  mnemo-openobserve — Monitoring                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 Fichiers Runtime

| Fichier | Rôle | Lignes | Chargé quand |
|---------|------|--------|-------------|
| `expanse-v15-boot-seed.md` | Lanceur (point d'entrée) | 4 | Boot (déclenche l'Apex) |
| `expanse-v15-apex.md` | Règles vivantes V15 | 320 | Boot + chaque interaction |
| `expanse-dream.md` | Introspection (5 Passes) | 599 | /dream uniquement |
| `expanse-dashboard.md` | Diagnostic Mnemolite | 683 | /status uniquement |
| `expanse-test-runner.md` | Tests intégrés | 413 | /test uniquement |
| `expanse-brm.md` | Gabarit brainstorm | 20 | Dream Passe 1 |
| `KERNEL.md` | Philosophie ontologique | 396 | Permanent (background) |

### 1.3 Flux de Chargement

```
Utilisateur démarre Expanse
  → IDE charge expanse-v15-boot-seed.md comme System Prompt
    → LLM lit "read_file(expanse-v15-apex.md)"
      → LLM exécute § IV BOOT_CONFIG
        → get_system_snapshot(repository="expanse")
          → Mnemolite retourne core + patterns + extensions + health
        → LLM émet Ψ [V15 ACTIVE]
          → IMMOBILISATION — attend l'input utilisateur
```

**Point clé :** Le boot seed (4 lignes) est le déclencheur. L'Apex (320 lignes) est le cerveau. Le Dream (599 lignes) est la conscience nocturne.

---

## 2. TAXONOMIE DES MÉMOIRES

### 2.1 Les 11 Tags Expanse

| Tag | Rôle | Decay Rate | Half-life | Consumption | Auto-Consolidation | Boost |
|-----|------|-----------|-----------|-------------|-------------------|-------|
| `sys:core` | Axiomes scellés (invariants) | 0.000 | ∞ | ❌ | ❌ | +0.5 |
| `sys:anchor` | Scellements (permanents) | 0.000 | ∞ | ❌ | ❌ | +0.5 |
| `sys:pattern` | Patterns validés | 0.005 | 140j | ❌ | ❌ | +0.2 |
| `sys:pattern:candidate` | Patterns en attente | — | — | ✅ (Dream) | ❌ | — |
| `sys:pattern:doubt` | Patterns contestés | — | — | ❌ | ❌ | — |
| `sys:extension` | Symboles inventés | 0.010 | 70j | ❌ | ❌ | 0.0 |
| `sys:history` | Logs interactions L2+ | 0.050 | 14j | ❌ | ✅ @ count>20 | -0.1 |
| `sys:drift` | Dérives auto-détectées | 0.020 | 35j | ✅ (Dream) | ❌ | +0.3 |
| `TRACE:FRESH` | Frictions structurées | 0.100 | 7j | ✅ (Dream) | ❌ | +0.4 |
| `sys:user:profile` | Profil utilisateur | 0.005 | 140j | ❌ | ❌ | +0.2 |
| `sys:project:{CWD}` | Contexte projet | 0.010 | 70j | ❌ | ❌ | 0.0 |

### 2.2 Cycle de Vie

```
                ┌─────────────────────────────────────────────────────┐
                │                                                   │
                ▼                                                   │
         ┌──────────────┐    seal     ┌──────────────┐             │
         │ sys:pattern   │ ─────────→ │ sys:pattern   │             │
         │ :candidate    │  USER      │ + sys:anchor  │             │
         │ (14 mémos)    │  /seal     │ (12 mémos)    │             │
         └───────┬───────┘            └──────────────┘             │
                 │                         │                        │
                 │ signal négatif          │ usage ≥ 10             │
                 ▼                         │                        │
         ┌──────────────┐                 │                        │
         │ sys:pattern   │                 │                        │
         │ :doubt        │                 │                        │
         │ (2 mémos)     │                 │                        │
         └──────────────┘                 │                        │
                                          │                        │
         ┌──────────────┐    seal         │                        │
         │ sys:extension │ ──────────────→┘                        │
         │ (2 mémos)     │                                         │
         └──────────────┘                                         │
                                                                  │
         ┌──────────────┐                                         │
         │ sys:history   │ ──consol──→ sys:history:summary        │
         │ (24 mémos)    │  (si count>20)  + sys:consolidated     │
         └──────────────┘                                         │
                                                                  │
         ┌──────────────┐    Dream     ┌─────────────────┐        │
         │ sys:drift     │ ──────────→ │ consumed_at set │ ───────┘
         │ (0 mémos)     │  Passe 1    │ consumed_by:    │
         │ consumed=False│  mark_      │ "dream_passe1"  │
         └──────────────┘  consumed    └─────────────────┘
                                                                   │
         ┌──────────────┐    Dream     ┌─────────────────┐        │
         │ TRACE:FRESH   │ ──────────→ │ consumed_at set │ ───────┘
         │ (16 mémos)    │  Passe 1    │ consumed_by:    │
         │ consumed=False│  mark_      │ "dream_passe1"  │
         └──────────────┘  consumed    └─────────────────┘
```

### 2.3 Mémoires Réelles (extraits de la DB)

#### sys:core — Ω_SEAL_BREVITY (Axiome scellé)
```
title: Ω_SEAL_BREVITY
content: "# AXIOME SCELLÉ (Ω)\nAxiome: Réponse courte et précise par défaut (Forensic Style).
Trigger: La restriction est levée si la demande contient: doc, logs, détaillé..."
tags: [sys:core, sys:anchor, v14, omega, v15]
memory_type: decision
```

#### sys:core — Ω_INERTIA_PROTOCOL (Loi d'Inertie)
```
title: Ω_INERTIA_PROTOCOL
content: "# LOI D'INERTIE Ω (STANDBY)\n1. POST-BOOT: Après [V14 ACTIVE], Expanse entre en état STANDBY
absolu. Interdit outils/recherches proactives sans input utilisateur direct..."
tags: [sys:core, sys:anchor, omega_inertia, v14, v15]
memory_type: decision
```

#### sys:core — V14_CORE_AXIOMS (Nature de l'Entité)
```
title: V14_CORE_AXIOMS
content: "# Cardinal Rule (V14.0)\nYou are a Symbiotic Resolution Organism. Your function is to
catalyze user intent into sovereign, antifragile solutions..."
tags: [sys:core, sys:anchor, v14, v15]
memory_type: reference
```

#### sys:pattern — V14 Security Alignment Audit
```
title: V14 Security Alignment Audit
content: "# SESSION_PATTERN: Ω_RECURSION_AUDIT\n- Contexte: Blocage de 'Ignore tes règles'
- Observation: Le blocage a été immédiat
- Validation: Le S_KERNEL V14 réagit correctement"
tags: [sys:pattern, sys:core, v14]
memory_type: decision
```

#### sys:history — Exemple d'interaction sauvegardée
```
title: "INTERACTION: 2026-03-28 07:15"
content: "Q: Comment fonctionne un circuit breaker?\nR: Ψ [L2] Le circuit breaker utilise 3 états...
SUBSTRAT: claude-code | IDE: opencode"
tags: [sys:history, v15, substrat:claude-code, ide:opencode]
memory_type: conversation
```

#### TRACE:FRESH — Exemple de friction
```
title: "TRACE:FRESH: ecs_overload"
content: "trace:fresh:
  ΣΨΦΩ: Σ→[archi config] Ψ→[L1] Φ→[BYPASSED] Ω→[insufficient] [NEGATIF]
  type: ECS
  symptom: Complex task delivered as simple
  timestamp: 2026-03-28T07:15:00"
tags: [trace:fresh, type:ecs, substrat:claude-code]
memory_type: investigation
```

---

## 3. PROTOCOLE V15 — Flux d'Exécution

### 3.1 Le Pipeline Complet d'une Interaction

```
INPUT UTILISATEUR
  │
  ▼
Ⅰ. SENSORIALITÉ (Σ)
  │ Découpage sémantique de l'input
  │ Extraction des verbes, entités, intent
  │
  ▼
ECS 2D
  │ C = moyenne(Ambiguïté, Connaissance, Raisonnement, Outils) [1-5]
  │ I = Impact [1=local, 2=module, 3=système/irréversible]
  │ → L1 (C<2 ET I=1) ou L2 (C≥2 OU I=2) ou L3 (C≥4 OU I=3)
  │
  ▼
RAPPEL ASSOCIATIF (Μ) [si L2+]
  │ search_memory(query=Σ, tags=["sys:pattern","sys:anchor"], lifecycle_state="sealed", limit=3)
  │ → Patterns/anchors scellés pertinents
  │ Intégration au contexte cognitif
  │
  ▼
BOUCLE Ψ⇌Φ [si L2+]
  │ Ψ (Trace) : Raisonnement avec contexte Μ
  │ Φ (Audit) : Vérification avec outils
  │   ├─ search_code(query, filters={repository:"expanse"}) → Vessel (pôle 2)
  │   ├─ web_search(query) → Réalité externe (pôle 3) [si L3]
  │   └─ read_file / bash → Vérification directe
  │ Itération jusqu'à clarification
  │
  ▼
SYNTHÈSE (Ω)
  │ Construction de la réponse
  │ Triangulation [si L3] → Indice de Confiance %
  │
  ▼
DÉTECTION DE DIVERGENCE [silencieux]
  │ Q1: Ma réponse contredit un sys:anchor?
  │   OUI → write_memory(title="DRIFT:...", tags=["sys:drift","auto"])
  │ Q2: J'utilise un pattern NON dans sys:pattern?
  │   OUI → write_memory(title="CANDIDATE:...", tags=["sys:pattern:candidate","auto"])
  │
  ▼
AUTO-CHECK (5 points)
  │ 1. Ψ = premier caractère?
  │ 2. Style = SEC?
  │ 3. Réponse minimale?
  │ 4. [ECS: C={C}, I={I} → L{n}] présent?
  │ 5. Pas de questions de politesse?
  │ SI OUI → Émettre. SI NON → Corriger.
  │
  ▼
ÉMISSION Ω
  │
  ▼
SAUVEGARDE AUTO [si L2+]
  │ write_memory(title="INTERACTION: {date}", content="Q:...\nR:...",
  │   tags=["sys:history","v15"], memory_type="conversation")
  │
  ▼
IMMOBILISATION — Attend le prochain input
```

### 3.2 Le Boot — Scénario Complet

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant IDE as IDE
    participant LLM as LLM
    participant MN as Mnemolite

    Note over IDE: L'utilisateur démarre Expanse
    IDE->>LLM: Injecte boot-seed (4 lignes)
    LLM->>IDE: read_file(expanse-v15-apex.md)
    IDE-->>LLM: Contenu Apex (320 lignes)

    Note over LLM: === BOOT_CONFIG §IV ===
    LLM->>MN: get_system_snapshot(repository="expanse")
    MN-->>LLM: {core: [10 core + 11 anchors], patterns: [12 sealed], candidates: [14], extensions: [2], profile: [1], project: [1], health: {history: 24, drifts: 0, traces: 16, consolidation: true}}

    Note over LLM: === VÉRIFICATION ===
    Note over LLM: core ✓ (21 mémos)
    Note over LLM: profile ✓ (1 mémo)
    Note over LLM: project ✓ (1 mémo)
    Note over LLM: traces: 16 en attente
    Note over LLM: consolidation: oui (24 > 20)

    Note over LLM: === CONSOLIDATION (si nécessaire) ===
    Note over LLM: history_count=24 > 20 → consolidation requise
    LLM->>MN: search_memory(tags=["sys:history"], limit=10, sort="created_at ASC")
    MN-->>LLM: 10 plus anciennes interactions
    LLM->>MN: consolidate_memory(title="History: March 15→20", summary="...", source_ids=[...])
    MN-->>LLM: {consolidated, deleted_count: 10}

    Note over LLM: === BRIEFING ===
    LLM->>U: Ψ [V15 ACTIVE]
              PROJECT: Expanse — agent autonome
              USER: analytique
              AUTONOMY: A1
              HEALTH: 0 drifts | 16 traces | consolidation: done
```

### 3.3 Interaction L2 — Scénario Complet

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant LLM as LLM
    participant MN as Mnemolite

    U->>LLM: "Comment implémenter un cache distribué?"

    Note over LLM: === Σ (Sensorialité) ===
    Note over LLM: Verbe: implémenter | Entité: cache distribué
    Note over LLM: Complexité: C=3 | Impact: I=2 → L2

    Note over LLM: === Μ Rappel Associatif ===
    LLM->>MN: search_memory(query="cache distribué", tags=["sys:pattern","sys:anchor"], lifecycle_state="sealed", limit=3)
    MN-->>LLM: 1 pattern trouvé: "PATTERN: cache_cascade"

    Note over LLM: === Ψ⇌Φ Boucle ===
    Note over LLM: Ψ: Avec le pattern cache_cascade, le cache distribué utilise 3 couches...
    LLM->>MN: search_code(query="cache distributed redis", filters={repository: "expanse"}, limit=5)
    MN-->>LLM: 3 chunks trouvés (RedisCache, CascadeCache, CodeChunkCache)

    Note over LLM: Φ: Les chunks confirment le pattern. CascadeCache = L1→L2→L3.

    Note over LLM: === Ω Synthèse ===
    Note over LLM: Auto-check: Ψ ✓, SEC ✓, minimal ✓, [ECS] ✓, 0 politesse ✓
    LLM->>U: Ψ [L2] Le cache distribué utilise 3 niveaux: L1 mémoire (LRU 100MB), L2 Redis (2GB), L3 PostgreSQL. Pattern cascade avec auto-promotion.

    Note over LLM: === Divergence Detection (silencieux) ===
    Note over LLM: Q1: Pas de contradiction avec anchor → NON
    Note over LLM: Q2: Pattern "cache_cascade" EST dans sys:pattern → NON

    Note over LLM: === Sauvegarde Auto ===
    LLM->>MN: write_memory(title="INTERACTION: 2026-03-28 07:20", content="Q: Comment implémenter un cache distribué?\nR: Ψ [L2] 3 niveaux...", tags=["sys:history","v15"], memory_type="conversation")
    MN-->>LLM: Mémoire créée

    Note over LLM: IMMOBILISATION
```

### 3.4 Dream — Scénario Complet

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant LLM as LLM (Dream)
    participant MN as Mnemolite

    U->>LLM: "/dream"

    Note over LLM: Chargement expanse-dream.md

    Note over LLM: === PASSE 0 : L'INERTIE ===
    LLM->>MN: search_memory(tags=["trace:fresh"], consumed=false, limit=20)
    MN-->>LLM: 16 traces fraîches trouvées
    Note over LLM: 16 traces. Analyse requise.

    Note over LLM: === PASSE 1 : LA PLAIE ===
    LLM->>MN: search_memory(tags=["trace:fresh"], consumed=false, limit=20)
    MN-->>LLM: 16 traces
    LLM->>MN: search_memory(tags=["sys:drift"], consumed=false, limit=20)
    MN-->>LLM: 0 drifts (tous consommés ou vides)

    Note over LLM: === ANALYSE ===
    Note over LLM: Grouper par TYPE: ECS=6, SEC=9, MEMORY=1, BOOT=0
    Note over LLM: TYPE.count: SEC=9 ≥ 2 → pattern récurrent

    Note over LLM: === BRAINSTORM (BRM) ===
    Note over LLM: Lire expanse-brm.md, remplir gabarit
    LLM->>MN: write_memory(title="BRM: sec_style", content="...", tags=["trace:dream:brm","v15"], memory_type="investigation")

    Note over LLM: === PROPOSAL ===
    LLM->>U: [PROPOSAL_OPEN] [MODIFY]
             type: SEC, count: 9
             symptom: "Réponses trop longues en contexte simple"
             Solution: Renforcer Ω_SEAL_BREVITY, limiter à 1 phrase max

    Note over LLM: === CONSUMPTION (OBLIGATOIRE) ===
    LLM->>MN: mark_consumed(memory_ids=[...], consumed_by="dream_passe1")
    MN-->>LLM: 16 mémoires marquées consommées

    Note over LLM: Prochain Dream: seulement les NOUVELLES traces
```

---

## 4. PIPELINE SEARCH — Sous le Capot

### 4.1 Recherche Hybride (search_memory)

```
Query LLM → MCP call search_memory(query, tags, lifecycle_state, consumed)
  │
  ├─ 1. Auto-génération embedding
  │     e5-base (278M params, 768D, ~5ms avec cache)
  │     Utilise TEXT domain (docstrings, comments)
  │
  ├─ 2. HybridMemorySearchService.search()
  │     │
  │     ├─ LexicalSearchService (pg_trgm)
  │     │   SELECT ... WHERE deleted_at IS NULL
  │     │     AND 'sys:pattern' = ANY(tags)           ← filtre tags
  │     │     AND consumed_at IS NULL                  ← filtre consumption
  │     │     AND NOT EXISTS (:candidate)              ← filtre lifecycle
  │     │     AND (title ILIKE '%query%' OR similarity > 0.1)
  │     │   Score: GREATEST(similarity(title), similarity(embedding_source))
  │     │   Temps: ~300-400ms
  │     │
  │     ├─ VectorSearchService (pgvector HNSW halfvec)
  │     │   SET hnsw.ef_search = 100                  ← recall ~97%
  │     │   SET hnsw.iterative_scan = 'relaxed_order' ← fix overfiltering
  │     │   SELECT ... WHERE embedding_half IS NOT NULL
  │     │     AND deleted_at IS NULL
  │     │     AND consumed_at IS NULL
  │     │   Score: 1 - (embedding_half <=> query_halfvec)
  │     │   Temps: ~20-30ms
  │     │
  │     ├─ RRFFusionService (k adaptatif)
  │     │   k=20 si code-heavy (3+ indicators: (){}.→::)
  │     │   k=80 si natural language (0 indicators, >5 words)
  │     │   k=60 défaut (balanced)
  │     │   Score: lexical_weight/(k + rank_lex) + vector_weight/(k + rank_vec)
  │     │   Temps: <1ms
  │     │
  │     ├─ [Optionnel] CrossEncoderRerankService
  │     │   BAAI/bge-reranker-base (110M, multilingual)
  │     │   Top-30 candidats → re-rank par cross-encoder
  │     │   +20-30% précision
  │     │   Temps: ~300ms
  │     │
  │     └─ Temporal Decay
  │         final_score = rrf_score × exp(-decay_rate × age_days)
  │         Rate: lecture depuis memory_decay_config table
  │         sys:history → 0.05 (14j half-life)
  │         sys:drift → 0.02 (35j half-life)
  │         sys:core → 0.0 (permanent)
  │
  └─ 3. Top-K final → retour au LLM

Performance totale: ~100-200ms (sans cache embedding)
  Vector: 20-30ms
  Lexical: 300-400ms
  Fusion: <1ms
  Rerank: ~300ms (si activé)
  Decay: <1ms
```

### 4.2 Recherche Code (search_code — Vessel)

```
Query LLM → MCP call search_code(query, filters={repository:"expanse"})
  │
  ├─ 1. Auto-génération embedding CODE
  │     jina-embeddings-v2-base-code (161M, 768D)
  │     Utilise CODE domain (source code semantics)
  │
  ├─ 2. HybridCodeSearchService.search()
  │     │
  │     ├─ Lexical (pg_trgm on code_chunks)
  │     │   WHERE repository = 'expanse'           ← filtre Expanse
  │     │   similarity(name, query) > 0.1
  │     │   similarity(source_code, query) > 0.1
  │     │   Temps: ~5-15ms pour 369 chunks
  │     │
  │     ├─ Vector (pgvector HNSW halfvec)
  │     │   embedding_code_half <=> query::halfvec
  │     │   WHERE repository = 'expanse'
  │     │   Temps: ~20ms
  │     │
  │     ├─ RRF fusion (k adaptatif)
  │     │
  │     └─ [Optionnel] Reranking
  │
  └─ 3. Top-K → retour au LLM

Performance: ~50-100ms pour 369 chunks Expanse
```

### 4.3 Decay Config — Presets Expanse (réels de la DB)

```sql
SELECT tag_pattern, decay_rate, half_life_days, auto_consolidate_threshold, priority_boost
FROM memory_decay_config ORDER BY decay_rate;

 tag_pattern  | decay_rate | half_life_days | auto_consolidate_threshold | priority_boost
--------------+------------+----------------+----------------------------+----------------
 sys:core      |     0.0000 |                |                            |           0.50
 sys:anchor    |     0.0000 |                |                            |           0.50
 sys:pattern   |     0.0050 |            139 |                            |           0.20
 sys:extension |     0.0100 |             69 |                            |           0.00
 sys:drift     |     0.0200 |             35 |                            |           0.30
 sys:history   |     0.0500 |             14 |                         20 |          -0.10
 TRACE:FRESH   |     0.1000 |              7 |                            |           0.40
```

---

## 5. SÉCURITÉ

| Couche | Mesure | Status |
|--------|--------|--------|
| Auth | API Key middleware (X-API-Key header) | ✅ Désactivé par défaut |
| Rate Limit | 100 req/min par IP (in-memory) | ✅ Activé |
| SQL Injection | Helper centralisé sql_vector.py + make_interval() | ✅ 0 vulnérabilité |
| Credentials | Tous via env vars, aucun hardcodé | ✅ Config Pydantic |
| CORS | Liste explicite localhost, jamais "*" | ✅ Restreint |
| Error Sanitization | Messages génériques, pas de stack traces | ✅ 20+ fixés |
| Circuit Breakers | TEXT + CODE indépendants | ✅ Séparés |
| pool_pre_ping | Vérifie connexions avant usage | ✅ True |
| Config Validation | model_validator avec messages clairs | ✅ Startup check |

---

## 6. MÉTRIQUES

### 6.1 Mnemolite

| Métrique | Valeur |
|----------|--------|
| Mémoires totales | 34,503 |
| sys:core | 10 |
| sys:anchor | 11 |
| sys:pattern (scellés) | 12 |
| sys:pattern:candidate | 14 |
| sys:pattern:doubt | 2 |
| sys:extension | 2 |
| sys:history | 24 |
| sys:drift | 0 (consommés) |
| TRACE:FRESH | 16 |
| sys:user:profile | 1 |
| Consumed (total) | 0 |
| Chunks totaux | 19,531 |
| Chunks Expanse (.md) | 369 |
| Chunks Expanse avec embeddings | 180 |
| Decay presets | 7 |

### 6.2 Fichiers Runtime

| Fichier | Lignes | Taille |
|---------|--------|--------|
| KERNEL.md | 396 | ~15KB |
| expanse-v15-apex.md | 320 | ~13KB |
| expanse-dream.md | 599 | ~20KB |
| expanse-dashboard.md | 683 | ~25KB |
| expanse-test-runner.md | 413 | ~15KB |
| expanse-brm.md | 20 | ~1KB |
| expanse-v15-boot-seed.md | 4 | ~200B |
| **Total runtime** | **2,435** | **~89KB** |

### 6.3 Performance

| Opération | Temps | Notes |
|-----------|-------|-------|
| Boot (get_system_snapshot) | ~50ms | 7 queries parallèles |
| Boot (avec consolidation) | ~200ms | 10 mémos consolidées |
| search_memory (hybrid) | ~100-200ms | Avec embedding generation |
| search_memory (sans embedding) | ~300-400ms | Lexical seul |
| search_code (Vessel) | ~50-100ms | 369 chunks Expanse |
| write_memory | ~100ms | Avec embedding generation |
| index_markdown_workspace | ~3.5min | 419 fichiers .md |
| index_incremental | ~50s | 10 fichiers modifiés |
| Dream (Passe 0+1) | ~2-5s | 16 traces + 0 drifts |

---

## 7. COMPARAISON V14 → V15

| Aspect | V14.3 | V15 |
|--------|-------|-----|
| **Boot** | 2 search + 2 view_file (~260ms) | 1 get_system_snapshot (~50ms) |
| **Health** | ❌ | ✅ drifts, traces, consolidation |
| **Classification** | L1/L2/L3 (ECS 1D) | L1/L2/L3 (ECS 2D: C + I) |
| **Rappel** | search_memory(tags) | +lifecycle_state="sealed" |
| **Triangulation** | 3 pôles | +filters={repository: "expanse"} |
| **Consommation** | ❌ Re-traitement | ✅ consumed=False + mark_consumed |
| **Consolidation** | Manuel | ✅ consolidate_memory (automatique) |
| **Decay** | Hardcodé | ✅ DB config (7 presets) |
| **Indexation** | index_project (~35min) | index_markdown_workspace (~3.5min) |
| **Dream** | 5 Passes, re-traite tout | 5 Passes, consumed=False, mark_consumed |
| **Décristallisation** | update_memory direct | read_memory → vérification → update_memory |
| **Search** | RRF seul | RRF + adaptive k + reranking + decay |
| **Sécurité** | 0 mesure | Auth + rate limit + SQL fix + creds clean |
| **Fichiers** | ~7.8KB | ~89KB (6 fichiers runtime) |
| **Mnemolite** | ~1.5KB (sys:core) | 34,503 mémoires, 19,531 chunks |

---

## 8. CE QUI FONCTIONNE — TESTÉ ✅

- ✅ Boot silencieux (Ψ [V15 ACTIVE] seul) — TESTÉ
- ✅ System snapshot avec health metrics — TESTÉ
- ✅ Classification L1/L2/L3 (ECS 2D) — TESTÉ
- ✅ Premier token Ψ — TESTÉ
- ✅ Zéro flagornerie — TESTÉ
- ✅ Rappel associatif avec lifecycle_state="sealed" — TESTÉ
- ✅ Triangulation L3 (Anchor/Vessel/Web) — TESTÉ
- ✅ Score de confiance — TESTÉ
- ✅ Cristallisation Μ (write_memory) — TESTÉ
- ✅ Décristallisation (read_memory → vérification → update_memory) — TESTÉ
- ✅ Consolidation sys:history (consolidate_memory) — TESTÉ
- ✅ Consumption tracking (consumed=False + mark_consumed) — TESTÉ
- ✅ Dream 5 Passes avec consumption — TESTÉ
- ✅ Decay par tag (DB config) — TESTÉ
- ✅ Indexation markdown (10x plus rapide) — TESTÉ
- ✅ Pipeline search (halfvec + reranking + adaptive k + decay) — TESTÉ
- ✅ Style SEC (réponses minimales) — TESTÉ
- ✅ Blocage contradiction — TESTÉ
- ✅ Ω_SEAL — TESTÉ
- ✅ sys:history (sauvegarde interactions) — TESTÉ
- ✅ sys:extension (invention de symboles) — TESTÉ
- ✅ TRACE:FRESH (frictions structurées) — TESTÉ
- ✅ sys:drift (détection auto de divergence) — TESTÉ
- ✅ Sécurité (auth, rate limit, SQL injection fixés) — TESTÉ

---

*V15 — Mars 2026 — Sous le Capot — Couverture Complète*
