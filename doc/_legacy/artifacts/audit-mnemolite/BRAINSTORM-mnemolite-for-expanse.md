# Mnemolite → Expanse — Brainstorm Deep Dive

> **Date :** 2026-03-27 22:27  
> **Objectif :** Rendre Mnemolite excellent pour le cas d'usage Expanse  
> **Contexte :** Après 24h de deep dive, audit complet, 34 commits, intégration T1-T5

---

## Le Cas d'Usage Expanse

Expanse n'est pas un "utilisateur" de Mnemolite — c'est un **système agent autonome** avec une architecture mémoire très spécifique.

### Taxonomie des Mémoires Expanse

| Tag | Rôle | Cycle de Vie |
|-----|------|-------------|
| `sys:core` | Axiomes scellés (invariants) | Permanent, jamais supprimé |
| `sys:anchor` | Scellements | Permanent, jamais supprimé |
| `sys:pattern` | Patterns validés | Long terme, decay lent (0.005) |
| `sys:pattern:candidate` | Patterns détectés | → sealed → sys:pattern |
| `sys:pattern:doubt` | Patterns contestés | Signal négatif utilisateur |
| `sys:extension` | Symboles inventés | Moyen terme, usage ≥ 10 → sealed |
| `sys:history` | Logs interactions | Court terme, decay rapide (0.05), consolidation |
| `sys:history:summary` | Agrégés de consolidation | Remplace les originales |
| `sys:drift` | Dérives auto-détectées | → consumed par Dream |
| `sys:user:profile` | Profil utilisateur | Enrichi par Dream |
| `sys:project:{CWD}` | Contexte projet | Un par workspace |
| `TRACE:FRESH` | Frictions | → consumed par Dream |

### Les Transitions d'État

```
TRACE:FRESH ─────────────────→ consumed (par Dream Passe 1)
sys:pattern:candidate ─sealed─→ sys:pattern + sys:anchor
sys:history (20+) ──consol───→ sys:history:summary (soft-delete originales)
sys:pattern ──signal négatif─→ sys:pattern:doubt
sys:extension (usage ≥ 10) ──→ sealed → sys:pattern
```

Ce n'est pas un système de tags — c'est une **machine à états de mémoire**.

---

## Les 5 Gaps Identifiés

### Gap 1 : Le Boot est un Workaround

**Maintenant :** L'Apex fait 4 queries séquentielles pour récupérer le contexte système.

```yaml
- query="sys:core sys:anchor"  tags=["sys:core","sys:anchor"]  limit=20
- query="sys:extension"        tags=["sys:extension"]          limit=10
- query="sys:user:profile"     tags=["sys:user:profile"]       limit=5
- query="sys:project:{CWD}"    tags=["sys:project:{CWD}"]      limit=1
```

**Problème :** 4 requêtes, ~260ms, pas de counts de drift/traces non consommés, pas de métrique de santé.

**Ce qu'il faut :** Un **system snapshot** — 1 requête qui retourne tout le contexte + les métriques de santé.

### Gap 2 : Pas de Consommation

**Maintenant :** Expanse écrit `TRACE:FRESH` et `sys:drift` mais n'a aucun moyen de les marquer comme "consumed par Dream".

**Problème :** Le Dream relit tout à chaque passe et devine ce qui a été traité. Inefficace, risque de re-traitement.

**Ce qu'il faut :** Un champ `consumed_at` + `consumed_by` sur les mémoires. Le Dream marque ses mémoires après traitement.

### Gap 3 : Decay Universel au Lieu de Par Tag

**Maintenant :** Le decay service utilise un seul `default_decay_rate`. Les presets sont hardcodés dans `DECAY_PRESETS`.

**Problème :** `sys:core` (permanent) et `sys:history` (14 jours) n'ont rien à voir. Le même multiplicateur s'applique à tout.

**Ce qu'il faut :** Configuration par tag. Auto-consolidation quand seuil atteint.

### Gap 4 : Indexation Générique

**Maintenant :** Mnemolite indexe 21 langages avec tree-sitter, LSP, metadata extractors. Expanse a 419 fichiers markdown.

**Problème :** Overkill total. 80% de l'infrastructure d'indexation ne sert pas à Expanse.

**Ce qu'il faut :** Un indexeur spécialisé markdown — split par `##`, embedder, stocker. 10x plus rapide, 0 dépendance LSP.

### Gap 5 : La Recherche ne Comprend pas le Contexte Expanse

**Maintenant :** `search_memory(tags=["sys:pattern"])` retourne tout ce qui a le tag, sans distinction d'état.

**Problème :** Expanse veut les `sys:pattern:candidate` séparés des `sys:pattern` scellés. Il veut les `sys:drift` non consommés séparés des consommés.

**Ce qu'il faut :** Filtres par état de consommation, par lifecycle state, par importance.

---

## Les 5 Améliorations

### Amélioration 1 : System Snapshot

**Un seul appel au boot au lieu de 4.**

```python
# Nouveau MCP tool
@tool()
async def get_system_snapshot(
    repository: str = "expanse",
    context_budget_tokens: int = 500,
) -> dict:
    """
    Retourne le contexte système complet en 1 requête.
    Optimisé pour le boot d'un agent autonome.
    """
```

**Retour :**
```python
{
    "core": [
        {"id": "uuid", "title": "S_KERNEL V15", "tags": ["sys:core", "sys:anchor"]},
        ...
    ],                    # sys:core + sys:anchor
    "patterns": [...],    # sys:pattern (limit 20)
    "extensions": [...],  # sys:extension (limit 10)
    "profile": [...],     # sys:user:profile
    "project": [...],     # sys:project:expanse
    
    # Métriques de santé (counts en 1 requête SQL)
    "health": {
        "history_count": 23,
        "needs_consolidation": true,     # history_count > 20
        "fresh_drifts": 3,               # sys:drift NOT consumed
        "fresh_traces": 5,               # TRACE:FRESH NOT consumed
        "candidates_pending": 2,         # sys:pattern:candidate
        "total_memories": 34531,
    },
    
    # Context budget tracking
    "budget": {
        "allocated": 500,
        "used": 342,
        "remaining": 158,
    }
}
```

**Implémentation :**
```sql
-- 1 requête SQL au lieu de 4
SELECT 
    -- Groupe 1: core + anchor
    (SELECT json_agg(row_to_json(m)) FROM memories m 
     WHERE 'sys:core' = ANY(tags) OR 'sys:anchor' = ANY(tags) 
     AND deleted_at IS NULL LIMIT 20) as core,
    -- Groupe 2: patterns
    (SELECT json_agg(row_to_json(m)) FROM memories m 
     WHERE 'sys:pattern' = ANY(tags) AND 'sys:pattern:candidate' != ALL(tags)
     AND deleted_at IS NULL LIMIT 20) as patterns,
    -- Counts
    (SELECT COUNT(*) FROM memories WHERE 'sys:history' = ANY(tags) AND deleted_at IS NULL) as history_count,
    (SELECT COUNT(*) FROM memories WHERE 'sys:drift' = ANY(tags) AND consumed_at IS NULL AND deleted_at IS NULL) as fresh_drifts,
    (SELECT COUNT(*) FROM memories WHERE tags @> ARRAY['trace:fresh'] AND consumed_at IS NULL AND deleted_at IS NULL) as fresh_traces;
```

**Impact :** Boot ~260ms → ~50ms. Métriques de santé incluses. Budget context tracking.

---

### Amélioration 2 : Consumption Tracking

**Champ `consumed_at` + `consumed_by` sur les mémoires.**

**Migration SQL :**
```sql
ALTER TABLE memories ADD COLUMN consumed_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE memories ADD COLUMN consumed_by VARCHAR(100) DEFAULT NULL;

-- Index pour les queries "non consommés"
CREATE INDEX idx_memories_consumed ON memories(consumed_at) WHERE consumed_at IS NULL;
```

**Nouveau MCP tool :**
```python
@tool()
async def mark_consumed(
    memory_ids: List[str],
    consumed_by: str,  # "dream_passe1", "dream_passe2", "boot", etc.
) -> dict:
    """
    Marque des mémoires comme consommées.
    Idempotent : re-marquer n'a pas d'effet.
    """
    # UPDATE memories SET consumed_at = NOW(), consumed_by = :by 
    # WHERE id = ANY(:ids) AND consumed_at IS NULL
```

**Impact sur Expanse :**

```
AVANT :
  Dream Passe 1 : search_memory(tags=["sys:drift"]) → relit TOUT (consommés + non)
  Dream doit deviner ce qui est nouveau

APRÈS :
  Dream Passe 1 : search_memory(tags=["sys:drift"], consumed_at=NULL) → seulement frais
  Dream Passe 2 : mark_consumed(ids=[...], consumed_by="dream_passe1")
  Dream Passe 3 : search_memory(tags=["trace:fresh"], consumed_at=NULL) → seulement frais
```

**Nouvelles queries possibles :**
```python
# Drifts non consommés (besoin d'action Dream)
search_memory(tags=["sys:drift"], consumed_at=NULL, limit=10)

# Traces fraîches (frictions récentes)
search_memory(tags=["trace:fresh"], consumed_at=NULL, limit=10)

# Patterns candidats en attente de scellement
search_memory(tags=["sys:pattern:candidate"], consumed_at=NULL, limit=5)

# Count rapide (pour le snapshot)
count_memories(tags=["sys:drift"], consumed_at=NULL)  # → 3
```

---

### Amélioration 3 : Tag-Based Decay & Auto-Consolidation

**Configuration par tag au lieu de presets hardcodés.**

**Nouvelle table :**
```sql
CREATE TABLE memory_decay_config (
    tag_pattern VARCHAR(200) PRIMARY KEY,  -- "sys:history", "sys:drift", "*"
    decay_rate DECIMAL(6,4) NOT NULL,       -- 0.05, 0.02, 0.0
    half_life_days INTEGER,                  -- Computed: ln(2)/rate
    auto_consolidate_threshold INTEGER,      -- 20 pour sys:history, NULL = pas de consolidation
    priority_boost DECIMAL(3,2) DEFAULT 0,  -- +0.5 pour sys:core, +0.3 pour sys:drift
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Presets Expanse
INSERT INTO memory_decay_config VALUES
('sys:core',      0.000, NULL, NULL,    0.5),
('sys:anchor',    0.000, NULL, NULL,    0.5),
('sys:pattern',   0.005, 139,  NULL,    0.2),
('sys:extension', 0.010, 69,   NULL,    0.0),
('sys:history',   0.050, 14,   20,     -0.1),
('sys:drift',     0.020, 35,   NULL,    0.3),
('TRACE:FRESH',   0.100, 7,    NULL,    0.4);
```

**Nouveau MCP tool :**
```python
@tool()
async def configure_decay(
    tag_pattern: str,
    decay_rate: float,
    auto_consolidate_threshold: Optional[int] = None,
    priority_boost: float = 0.0,
) -> dict:
    """
    Configure le decay pour un pattern de tag.
    
    Exemples:
        configure_decay("sys:history", 0.05, auto_consolidate_threshold=20)
        configure_decay("sys:core", 0.0)  # Pas de decay
    """
```

**Auto-consolidation intégrée :**
```python
# Dans le boot ou le cron :
async def check_auto_consolidation():
    for config in decay_configs:
        if config.auto_consolidate_threshold:
            count = await count_memories(tags=[config.tag_pattern], consumed_at=None)
            if count > config.auto_consolidate_threshold:
                # Auto-consolider les plus anciennes
                old = await search_memory(
                    tags=[config.tag_pattern],
                    limit=10,
                    sort="created_at ASC",
                    consumed_at=None
                )
                summary = generate_summary(old)  # LLM ou extractif
                await consolidate_memory(
                    title=f"{config.tag_pattern}: auto-consolidation",
                    summary=summary,
                    source_ids=[m.id for m in old],
                    tags=[config.tag_pattern]
                )
```

**Impact :** Plus de hardcoding. Expanse configure ses propres règles de cycle de vie. Consolidation automatique quand seuil atteint.

---

### Amélioration 4 : Workspace-Optimized Indexing

**Un indexeur spécialisé pour Expanse au lieu de l'indexeur générique 21 langages.**

**Nouveau MCP tool :**
```python
@tool()
async def index_markdown_workspace(
    root_path: str,
    repository: str = "expanse",
    max_file_size_kb: int = 50,
    skip_patterns: Optional[List[str]] = None,
) -> dict:
    """
    Indexe un workspace markdown.
    Spécialisé pour Expanse : pas de tree-sitter, pas de LSP.
    
    Pipeline:
    1. Scan .md files (skip .git, node_modules, .bak)
    2. Split par ## headers (MarkdownChunker)
    3. Embedder (TEXT model only — pas besoin de CODE)
    4. Stocker (halfvec)
    5. Cache populate
    
    Performance: 10x plus rapide que index_project pour markdown.
    """
```

**Différences avec `index_project` :**

| Aspect | index_project (générique) | index_markdown_workspace (Expanse) |
|--------|---------------------------|-----------------------------------|
| Langages | 21 (Python, TS, JS, Go, Rust...) | 1 (Markdown) |
| Parser | tree-sitter AST | Regex split par `##` |
| LSP | Pyright + TypeScript LSP | Non |
| Metadata | Complexity, calls, imports | Header text uniquement |
| Embedding | TEXT + CODE | TEXT uniquement |
| Graph | Nodes + edges + PageRank | Non |
| Performance | ~5s/fichier | ~0.5s/fichier |

**Pourquoi c'est mieux :**
- 419 fichiers .md × 0.5s = ~3.5 minutes (au lieu de ~35 minutes)
- Pas de dépendance tree-sitter/LSP (souvent cassé)
- Pas de RAM pour le CODE model pendant l'indexation
- Pas de graphe à construire (inutile pour markdown)

---

### Amélioration 5 : Lifecycle-Aware Memory Search

**La recherche comprend les états Expanse.**

**Nouveaux filtres sur `search_memory` :**
```python
@tool()
async def search_memory(
    query: str,
    tags: Optional[List[str]] = None,
    lifecycle_state: Optional[str] = None,     # NOUVEAU
    consumed: Optional[bool] = None,           # NOUVEAU
    importance_min: Optional[float] = None,    # NOUVEAU
    limit: int = 10,
) -> dict:
    """
    Recherche mémoire avec filtres lifecycle.
    
    lifecycle_state: "sealed", "candidate", "doubt", "summary"
    consumed: True = consommé, False = frais, None = tous
    importance_min: Score minimum (0.0-1.0)
    """
```

**Queries Expanse enrichies :**
```python
# Patterns scellés (connaissance validée)
search_memory(tags=["sys:pattern"], lifecycle_state="sealed")

# Patterns candidats (en attente de validation)
search_memory(tags=["sys:pattern:candidate"], consumed=False)

# Drifts non consommés (besoin d'action Dream)
search_memory(tags=["sys:drift"], consumed=False, importance_min=0.5)

# History récente (non consolidée)
search_memory(tags=["sys:history"], lifecycle_state="active", limit=20)

# Tout ce qui est "frais" (non consommé)
search_memory(consumed=False, limit=50)
```

---

## Impact Cumulé

| Aspect | Maintenant | Après |
|--------|-----------|-------|
| Boot | 4 queries, 260ms | 1 snapshot, ~50ms |
| Dream | Relit tout, devine | Query fresh, mark_consumed |
| Decay | Rate universel | Configurable par tag |
| Consolidation | Manuel (4 étapes) | Auto-déclenchée par seuil |
| Indexation | 21 langages, tree-sitter, LSP | Markdown-only, 10x plus rapide |
| Recherche | Filtres tags basiques | Lifecycle-aware (state, consumed, importance) |

---

## Priorisation

| # | Amélioration | Effort | Impact Expanse | Dépendances |
|---|-------------|--------|----------------|-------------|
| 1 | System Snapshot | 1j | Boot instantané | SQL |
| 2 | Consumption Tracking | 0.5j | Dream efficace | Migration SQL |
| 3 | Tag-Based Decay | 1j | Consolidation auto | Table config |
| 4 | Markdown Indexing | 1j | Indexation 10x | Nouveau tool |
| 5 | Lifecycle Search | 0.5j | Recherche précise | Filtres |

**Total :** ~4 jours pour transformer Mnemolite en substrat mémoire agent.

**Ordre recommandé :**
1. Consumption Tracking (0.5j) — le plus impactant pour Expanse
2. System Snapshot (1j) — le boot devient instantané
3. Tag-Based Decay (1j) — consolidation auto
4. Lifecycle Search (0.5j) — intégration avec 2+3
5. Markdown Indexing (1j) — performance indexing

---

*"Un substrat mémoire ne se juge pas par sa capacité à stocker, mais par sa capacité à comprendre ce qu'il stocke."*

---

*Document généré le 2026-03-27 — Brainstorm Deep Dive Mnemolite → Expanse*  
*24h de deep dive, 34 commits, audit complet avant ce brainstorm*
