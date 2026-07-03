# 10 — Brainstorm Optimisations & Améliorations Mnemolite

> **Date :** 2026-03-26  
> **Méthode :** Recherche web (RRF, embedding models, pgvector, MCP 2026, agent memory) + analyse codebase  
> **Sources :** aboullaite.me, glaforge.dev, medium.com, dev.to, modelcontextprotocol.io, machinelearningmastery.com, blogs.oracle.com

---

## AXE 1 — Embeddings : Upgrade Modèles

**État actuel :** `intfloat/multilingual-e5-base` (278M, 768D) pour TEXT + `jina-embeddings-v2-base-code` (161M, 768D) pour CODE

> ⚠️ **Note :** Mnemolite tourne sur AMD Ryzen 7 7840HS — CPU uniquement. ROCm ne supporte pas la Radeon 780M intégrée. Modèles > 1B params = trop lourd. Voir [EMBEDDINGS-ANALYSIS.md](./EMBEDDINGS-ANALYSIS.md).

### Options Évaluées (corrigé 2026-03-26)

| Modèle | Params | MMTEB / MTEB Retrieval | Context | Dim | License | CPU Perf | Spécialité |
|--------|--------|----------------------|---------|-----|---------|----------|------------|
| `multilingual-e5-base` (actuel TEXT) | 278M | ~64 | 512 | 768 | MIT | ⭐⭐⭐⭐ | Multilingue |
| `jina-embeddings-v2-base-code` (actuel CODE) | 161M | ~62 | 8192 | 768 | Apache 2.0 | ⭐⭐⭐⭐⭐ | Code search |
| **jina-embeddings-v5-text-nano** | **239M** | **65.5** | **8K** | **768** | CC-BY-NC-4.0 | ⭐⭐⭐⭐⭐ | SOTA sub-1B, ultra rapide |
| **jina-embeddings-v5-text-small** | **677M** | **67.0** | **32K** | **1024** | CC-BY-NC-4.0 | ⭐⭐⭐ | SOTA sub-1B, LoRA adapters |
| **BGE-M3** | 568M | 63.0 | 8K | 1024 | MIT | ⭐⭐⭐⭐ | dense+sparse+multi-vector |
| `intfloat/multilingual-e5-large-v2` | 335M | ~64.5 | 512 | 1024 | MIT | ⭐⭐⭐⭐ | Upgrade direct |
| ~~Nomic Embed Code~~ | ~~7B~~ | ~~81.7% CodeSearchNet~~ | — | ~~768~~ | ~~Apache 2.0~~ | ❌ | **Trop gros pour CPU** |
| **Nomic CodeRankEmbed** | **137M** | **~75% CodeSearchNet** | 8K | 768 | Apache 2.0 | ⭐⭐⭐⭐⭐ | Code, léger, rapide |
| ~~Qwen3-Embedding-8B~~ | ~~8B~~ | ~~70.58~~ | ~~32K~~ | ~~7168~~ | ~~Apache 2.0~~ | ❌ | **Trop gros pour CPU** |

### Recommandation

**Option A (2j) :** Upgrade TEXT uniquement — `jina-embeddings-v5-text-nano` (239M)
- Plus rapide que l'actuel, meilleur score (65.5 vs ~64), 8K context
- CC-BY-NC-4.0 (OK pour Expanse/usage personnel)

**Option B (3j) :** Upgrade TEXT + CODE
- TEXT: `jina-embeddings-v5-text-small` (677M, MMTEB 67.0)
- CODE: `Nomic CodeRankEmbed` (137M, ~75% CodeSearchNet)
- TEXT CC-BY-NC-4.0, CODE Apache 2.0

**Option C (2j) :** Upgrade conservateur (MIT/Apache 2.0)
- TEXT: `intfloat/multilingual-e5-large-v2` (335M, ~64.5)
- CODE: `Nomic CodeRankEmbed` (137M, ~75% CodeSearchNet)
- License libre commercial

**Option D (3j) :** Un seul modèle — `BGE-M3` (568M)
- Dense + sparse + multi-vector, MIT license
- Remplacerait pg_trgm par sparse BM25
- Score MTEB inférieur (63.0)

---

## AXE 2 — Quantification : halfvec (Float16)

**Découverte critique :** pgvector 0.8+ supporte `halfvec` — float16 au lieu de float32.

### Bénéfices

| Métrique | Float32 (actuel) | Float16 (halfvec) | Gain |
|----------|-----------------|-------------------|------|
| Stockage/row (768D) | ~3,080 bytes | ~1,544 bytes | **-50%** |
| Index HNSW size | ~1.2GB (50K chunks) | ~600GB | **-50%** |
| Query QPS | baseline | ~2x | **+100%** |
| Build index time | baseline | -30% (avec RAM suffisante) | **-30%** |
| Recall | 100% | 99.2% | **-0.8%** |

### Migration SQL

```sql
-- Ajouter colonnes halfvec
ALTER TABLE code_chunks ADD COLUMN embedding_text_half halfvec(768);
ALTER TABLE code_chunks ADD COLUMN embedding_code_half halfvec(768);

-- Migrer données
UPDATE code_chunks SET embedding_text_half = embedding_text::halfvec(768);
UPDATE code_chunks SET embedding_code_half = embedding_code::halfvec(768);

-- Créer index halfvec (CONCURRENTLY = pas de lock)
CREATE INDEX CONCURRENTLY idx_code_emb_text_half
ON code_chunks USING hnsw (embedding_text_half halfvec_cosine_ops)
WITH (m = 16, ef_construction = 128);

CREATE INDEX CONCURRENTLY idx_code_emb_code_half
ON code_chunks USING hnsw (embedding_code_half halfvec_cosine_ops)
WITH (m = 16, ef_construction = 128);

-- Vérifier recall
-- (batch de queries connues, comparer top-10 float32 vs float16)
```

### Points d'Attention

- **GCC >= 9 requis** pour la compilation pgvector avec support halfvec SIMD (issue pgvector#967)
- **Bouger `maintenance_work_mem`** avant le build index : `SET maintenance_work_mem = '4GB';`
- **Tester recall** sur le corpus Expanse avant de supprimer les anciennes colonnes float32

### Effort : 1 jour

---

## AXE 3 — RRF Tuning & Query Understanding

**État actuel :** k=60 (industry standard), weights 50/50 (memory) ou 40/60 (code, auto-heuristic)

### 3a. Adaptive k par Query Type

La constante k contrôle la sensibilité de RRF aux top ranks :

| k | Sensibilité | Usage Optimal |
|---|-------------|---------------|
| 10-20 | Très sensible aux top ranks | Code exact (noms de fonction, signatures) |
| 60 | Équilibré (défaut) | Recherche générale |
| 80-100 | Plus démocratique | Recherche naturelle, concepts |

```python
def get_rrf_k(query: str) -> int:
    code_indicators = sum(1 for c in "(){}.->::" if c in query)
    if code_indicators >= 3:
        return 20  # Précision : favorise top ranks
    elif len(query.split()) > 5:
        return 80  # Recall : plus démocratique
    else:
        return 60  # Défaut
```

**Impact :** +5-10% précision sur queries code, +3-5% recall sur queries naturelles.  
**Effort :** 4h

### 3b. RAG-Fusion : Multi-Query Expansion

```python
# Générer 3 reformulations via LLM
queries = [original, reformulation_1, reformulation_2]
# Rerun search sur chaque, fusionner via RRF
fused = rrf_service.fuse(*[search(q) for q in queries], k=60)
```

**Impact :** +10-15% recall sur queries ambiguës.  
**Coût :** 3x embeddings (parallélisable).  
**Effort :** 2j

### 3c. Cross-Encoder Reranking : Activer par Défaut

**État actuel :** `CrossEncoderRerankService` existe mais optionnel, lazy-loaded.

**Recommandation :** Activer par défaut pour top-30 candidats avec `BAAI/bge-reranker-base` (110M, multilingual).

```
Hybrid Search → Top-30 candidats → Cross-Encoder Rerank → Top-5 final
```

| Métrique | Sans Reranking | Avec Reranking | Gain |
|----------|---------------|----------------|------|
| Precision@5 | ~60% | ~78% | **+30%** |
| Latence | ~50ms | ~350ms | +300ms |
| RAM | baseline | +110M (~200MB) | +200MB |

**Trade-off acceptable** pour search_code (précision > latence).  
**Effort :** 2h

---

## AXE 4 — pgvector Optimisation Production

### 4a. HNSW Tuning

**État actuel :** m=16, ef_construction=64 (défaut pgvector)

```sql
-- Recommandé production
CREATE INDEX CONCURRENTLY idx_optimized
ON code_chunks USING hnsw (embedding_code vector_cosine_ops)
WITH (m = 24, ef_construction = 128);

-- Query-time
SET hnsw.ef_search = 100;  -- défaut 40
```

| ef_search | Recall | Latence (1M vectors) | Usage |
|-----------|--------|---------------------|-------|
| 40 (défaut) | ~92% | 1-2ms | Prototypage |
| **100** | **~97%** | **2-4ms** | **Production RAG** |
| 200 | ~99% | 4-8ms | Haute précision |
| 400 | ~99.5% | 8-15ms | Recall quasi-exact |

**Effort :** 30min

### 4b. Iterative Scans (pgvector 0.8)

```sql
SET hnsw.iterative_scan = 'on';
```

**Problème résolu :** Overfiltering. Sans iterative scan, un filtre `WHERE language='python'` sur un index HNSW peut retourner 0 résultats même si des matches existent (le filtre élimine trop de candidats pendant la traversée du graphe).

Avec iterative scan, pgvector continue à chercher jusqu'à trouver suffisamment de candidats matching les filtres.

**Effort :** 5min (1 ligne SQL)

### 4c. Dimensionality Reduction (PCA)

```python
# PCA de 768D → 512D (97% variance retained)
# 33% de réduction mémoire, ~5% perte de qualité
# Utilisable pour search_code (pas besoin de précision parfaite)
```

| Dimensions | Mémoire (50K chunks) | Recall | Latence |
|------------|---------------------|--------|---------|
| 768 (actuel) | ~600MB | 100% | baseline |
| 512 (PCA) | ~400MB | ~95% | -20% |
| 256 (PCA agressif) | ~200MB | ~85% | -40% |

**Effort :** 1 semaine (entraîner PCA, valider recall, migrer)

### 4d. Connection Pooling AI

```python
# Pool dédié pour les requêtes vectorielles
# (les queries vector sont mémoire-intensives)
pool = asyncpg.create_pool(
    min_size=5,
    max_size=15,  # Plus que le pool standard
    server_settings={
        'work_mem': '256MB',      # Pour RRF fusion
        'maintenance_work_mem': '4GB'  # Pour index builds
    }
)
```

---

## AXE 5 — Architecture Mémoire Agent

Le rapport Oracle (2026) et les recherches ML Mastery identifient 4 types de mémoire agent convergents dans l'industrie.

### Taxonomie Mémoire Agent

| Type | Humain | Agent | Mnemolite | Gap |
|------|--------|-------|-----------|-----|
| **Working** | Contexte courant | Context window LLM | ❌ Hors scope | — |
| **Procedural** | Mémoire musculaire | System prompts, patterns | ⚠️ sys:pattern (tag) | Manque évolution auto |
| **Semantic** | Faits/concepts | Knowledge base | ✅ write_memory + search_memory | OK |
| **Episodic** | Souvenirs | Logs interactions | ✅ sys:history | Manque consolidation |

### 5a. Memory Consolidation (Compression)

**Déjà prévu** dans Expanse Apex §V mais non implémenté.

```
Quand count(sys:history) > 20 :
  1. LLM résume les 10 plus anciennes en 1 agrégée
  2. Soft-delete les originales
  3. Nouvelle mémoire : tags=["sys:history:summary", "v15"]
```

**Nouveau endpoint Mnemolite :**
```python
POST /api/v1/memories/consolidate
{
    "query": "sys:history",
    "threshold": 20,
    "batch_size": 10,
    "summary_prompt": "Résume ces interactions en patterns clés"
}
```

**Impact :** Réduction exponentielle du nombre de mémoires. 100 interactions → 10 summaries → 1 aggregate.  
**Effort :** 2j

### 5b. Memory Decay (Scoring Temporel)

```python
import math

def score_memory(memory, query_embedding, decay_rate=0.01):
    """
    Score = semantic_similarity × temporal_decay × importance_weight
    - semantic : cosinus similarity avec la query
    - temporal : decay exponentiel basé sur l'âge
    - importance : poids manuel ou auto-détecté
    """
    semantic = cosine_similarity(memory.embedding, query_embedding)
    age_days = (now - memory.created_at).days
    temporal = math.exp(-decay_rate * age_days)
    importance = memory.metadata.get("importance", 1.0)
    return semantic * temporal * importance
```

| Paramètre | Effet | Défaut |
|-----------|-------|--------|
| decay_rate=0.001 | Très lent : mémoires utiles des mois | Pour sys:core, sys:anchor |
| decay_rate=0.01 | Modéré : ~50% score après 70 jours | Pour sys:pattern |
| decay_rate=0.1 | Rapide : ~50% score après 7 jours | Pour sys:history |

**Impact :** Les mémoires récentes et importantes remontent en priorité. Les vieilles mémoires non-utilisées s'atténuent naturellement.  
**Effort :** 1j

### 5c. Memory Graph (Relations)

```python
# Utiliser les tables nodes/edges existantes
# Mémoire A --[extends]--> Mémoire B
# Mémoire A --[contradicts]--> Mémoire C
# Mémoire A --[supports]--> Mémoire D

# Dream peut naviguer le graphe pour détecter contradictions
contradictions = graph_traversal.traverse(
    start_node_id=memory_a_node_id,
    relationship="contradicts",
    max_depth=2
)
```

**Impact :** Détection automatique de contradictions entre patterns. Navigation sémantique des mémoires.  
**Effort :** 3j

### 5d. Memory Frameworks Externes (Benchmark)

| Framework | Type | Stockage | License | Stars | Points Forts |
|-----------|------|----------|---------|-------|--------------|
| **Mem0** | Personalization + institutional | Vector + Graph | Apache 2.0 | ~48K | Entity resolution, graph features |
| **Hindsight** | Institutional | Multi-strategy hybrid | MIT | ~4K | Reflect (synthèse), 4 stratégies parallèles |
| **Letta** (MemGPT) | Both | Tiered (OS-inspired) | Apache 2.0 | ~21K | Self-editing memory, 3 tiers |
| **Zep/Graphiti** | Temporal | Temporal KG | Open | ~24K | Temporal reasoning |

**Recommandation :** Ne pas remplacer Mnemolite. S'inspirer de Hindsight pour le pattern `reflect` (synthèse LLM) et de Letta pour le modèle à 3 tiers (core/recall/archival).

---

## AXE 6 — MCP Protocol : Évolutions 2026

Le roadmap MCP 2026 (blog.modelcontextprotocol.io, 2026-03-09) identifie 4 priorités.

### 6a. Streamable HTTP Transport (Priorité #1 MCP)

**État actuel :** stdio uniquement. TODO Story 23.8.

**Roadmap MCP 2026 :** Streamable HTTP = transport préféré. SSE en dépréciation. Spec juin 2026 introduira sessions stateless.

```
Actuel :  Claude Desktop → stdio → MnemoLite MCP
Futur :   Claude Desktop → HTTP POST → MnemoLite HTTP → JSON-RPC
          Expanse → HTTP POST → MnemoLite HTTP → JSON-RPC
          IDE → HTTP POST → MnemoLite HTTP → JSON-RPC
```

**Avantages :**
- Déploiement Mnemolite comme service HTTP standard (Docker, K8s)
- Scaling horizontal sans sticky sessions (stateless)
- Expanse peut appeler Mnemolite par HTTP au lieu de REST (un seul protocole)
- Supporte l'auth OAuth 2.1 (standard MCP 2026)

**Effort :** 2j

### 6b. MCP Server Cards (.well-known)

```json
// GET /.well-known/mcp-server.json
{
  "name": "mnemolite",
  "version": "1.0.0",
  "description": "Code intelligence + persistent memory",
  "transport": ["stdio", "streamable-http"],
  "tools": [...],
  "resources": [...],
  "authentication": { "type": "oauth2", "scopes": [...] }
}
```

**Impact :** Discovery automatique des capacités sans connexion. Les clients MCP peuvent scanner les serveurs disponibles.

### 6c. Tasks Primitive (SEP-1686)

Call-now / fetch-later pour opérations longues.

```python
# Avant (bloquant) :
result = await mcp.call_tool("index_project", {...})  # Attend 5 min

# Après (non-bloquant) :
task = await mcp.call_tool("index_project", {...})  # Retourne immédiatement
# task_id = "task_abc123"
# ... le client fait autre chose ...
status = await mcp.get_task("task_abc123")  # Poll status
# status.state = "completed"
```

**Impact :** `index_project` ne bloque plus le client. Progress temps réel via polling.

### 6d. Triggers & Event-Driven Updates (Horizon)

```python
# Serveur notifie le client quand un événement se produit
# Au lieu de polling :
await mcp.subscribe("indexing:completed", callback)
# MnemoLite envoie : {"event": "indexing:completed", "data": {...}}
```

---

## AXE 7 — Pipeline Indexation : Incremental & Streaming

### 7a. Incremental Indexing (Watch Mode)

**État actuel :** Re-index complet à chaque appel.

```python
async def incremental_index(repository: str):
    # 1. Dernière indexation
    last_indexed = await get_last_indexed_at(repository)
    
    # 2. Git diff pour détecter changements
    changed_files = git_diff(since=last_indexed, repository_root)
    
    # 3. Re-indexer uniquement les modifiés
    if changed_files:
        await indexing_service.index_repository(changed_files)
    
    # 4. Supprimer chunks des fichiers supprimés
    deleted_files = git_deleted(since=last_indexed)
    for f in deleted_files:
        await chunk_repo.delete_by_file_path(f)
```

| Scénario | Full Index | Incremental | Gain |
|----------|-----------|-------------|------|
| 782 fichiers (Expanse) | ~6.5h | — | — |
| 10 fichiers modifiés | ~6.5h | **~50s** | **99%** |
| 1 fichier modifié | ~6.5h | **~5s** | **99.9%** |

**Effort :** 3j

### 7b. Filesystem Watcher (Real-time)

```python
# Utiliser watchdog ou inotify pour détecter les changements en temps réel
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class MnemoIndexHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith(tuple(SUPPORTED_EXTENSIONS)):
            enqueue_reindex(event.src_path)
```

**Impact :** Indexation automatique dès la sauvegarde d'un fichier. Zero intervention manuelle.  
**Effort :** 2j

### 7c. Git-Aware Indexing

```python
# Indexer par commit hash
# Permettre search_code sur des branches spécifiques
# Diff viewer : montrer changements entre commits

class GitAwareIndexing:
    async def index_commit(self, commit_hash: str):
        files = git_show_commit(commit_hash)
        tag_chunks_with_commit(chunks, commit_hash)
    
    async def diff_search(self, query: str, from_commit: str, to_commit: str):
        # Chercher dans les chunks modifiés entre deux commits
        pass
```

**Effort :** 1 semaine

---

## Matrice de Priorisation Finale

| # | Amélioration | Impact | Effort | ROI | Priorité |
|---|-------------|--------|--------|-----|----------|
| 1 | Iterative scan pgvector 0.8 | Fix overfiltering | 5min | ██████████ | 🔴 Immédiat |
| 2 | HNSW tuning (ef_search=100) | Recall 92%→97% | 30min | ██████████ | 🔴 Immédiat |
| 3 | halfvec quantification | 50% mémoire, 2x QPS | 1j | █████████ | 🔴 Immédiat |
| 4 | Activer reranking par défaut | +20-30% précision | 2h | ████████ | 🟡 Court terme |
| 5 | Adaptive RRF k | Meilleur recall/precision | 4h | ███████ | 🟡 Court terme |
| 6 | Streamable HTTP transport | Déploiement production | 2j | ███████ | 🟡 Court terme |
| 7 | Nomic Embed Code | Meilleur code search | 2j | ██████ | 🟢 Moyen terme |
| 8 | Incremental indexing | Perf indexation 99% | 3j | ██████ | 🟢 Moyen terme |
| 9 | Memory consolidation API | Compression historique | 2j | █████ | 🟢 Moyen terme |
| 10 | Memory decay scoring | Pertinence temporelle | 1j | █████ | 🟢 Moyen terme |
| 11 | Memory graph (relations) | Détection contradictions | 3j | ████ | 🟢 Moyen terme |
| 12 | Tasks primitive MCP | UX non-bloquante | 3j | ████ | 🔵 Long terme |
| 13 | RAG-Fusion multi-query | +10-15% recall | 2j | ████ | 🔵 Long terme |
| 14 | PCA dimensionality reduction | -33% mémoire | 1sem | ███ | 🔵 Long terme |
| 15 | Filesystem watcher | Auto-index temps réel | 2j | ███ | 🔵 Long terme |
| 16 | BGE-M3 (TEXT upgrade) | Multilingue | 3j | ██ | 🔵 Long terme |
| 17 | Git-aware indexing | Search par commit | 1sem | ██ | 🔵 Long terme |

---

## Quick Wins (Implémentables en 1 Jour)

```sql
-- 1. Iterative scan (5 min)
SET hnsw.iterative_scan = 'on';

-- 2. ef_search tuning (30 min)
SET hnsw.ef_search = 100;

-- 3. halfvec migration (quelques heures)
ALTER TABLE code_chunks ADD COLUMN embedding_code_half halfvec(768);
UPDATE code_chunks SET embedding_code_half = embedding_code::halfvec(768);
CREATE INDEX CONCURRENTLY idx_half ON code_chunks
    USING hnsw (embedding_code_half halfvec_cosine_ops)
    WITH (m = 16, ef_construction = 128);
```

```python
# 4. Activer reranking (2h)
# Dans HybridCodeSearchService.__init__ :
self.reranker = CrossEncoderRerankService(model_name="BAAI/bge-reranker-base")
self.enable_reranking = True  # Défaut ON

# 5. Adaptive RRF k (4h)
# Dans RRFFusionService.fuse() :
if query_analysis.is_code_heavy(query):
    k = 20
elif query_analysis.is_natural_language(query):
    k = 80
else:
    k = 60
```

---

## Statut d'Implémentation (2026-03-27 14:00)

| # | Item | Status | Commit | Décisions & Erreurs |
|---|------|--------|--------|---------------------|
| 1 | Iterative scan | ✅ | `1c97600` | **Erreur :** `'on'` invalide pgvector 0.8.1 → `'relaxed_order'` |
| 2 | ef_search=100 | ✅ | `1c97600` | **Erreur :** asyncpg ne supporte pas multi-SET → loop séparé |
| 3 | halfvec | ✅ | `b18ddae` | Triggers PostgreSQL auto-sync, migration-free swap |
| 4 | Reranking | ✅ | `4bf546e` | 2 lignes : `default_enable_reranking=False` → `True` |
| 5 | Adaptive RRF k | ✅ | `9cc222e` | `get_optimal_k()` heuristique : `(){}.→::` count |
| 6 | HTTP transport | ✅ | `9b904e9` | 1 ligne : `mcp.run(transport='streamable-http')` |
| 7 | jina-v5 support | ✅ | `175e263` | Config only, pas de migration (même 768D) |
| 8 | Incremental indexing | ✅ | `7594d96` | mtime vs `MAX(indexed_at)`, pas besoin de git |
| 9 | Consolidation | ✅ | `95de1a9` | Outil MCP `consolidate_memory` — intégré Apex §V |
| 10 | Decay scoring | ✅ | `dd2bb1a` | `exp(-rate * age_days)`, presets par tag |

## Intégration Expanse (5/5 ✅)

| # | Tâche | Commit | Résultat |
|---|-------|--------|----------|
| T1 | Indexer workspace Expanse | `661ad67` | 413 fichiers .md, 369 chunks, 180 embeddings |
| T2 | Consolidation sys:history | `a713500` | Protocole 4 étapes dans l'Apex §V |
| T3 | Boot optimisé | `a713500` | 1 query regroupée (~65ms vs ~260ms) |
| T4 | read_memory décristallisation | `a713500` | 3 étapes : lire → vérifier → marquer |
| T5 | Documentation | `a713500` | Vessel + consolidation dans BOOT_CONFIG |

### Bugs trouvés pendant l'intégration

| Bug | Cause | Fix | Commit |
|-----|-------|-----|--------|
| `cache.get_chunks()` n'existe pas | Méthode est `get()`, code_indexing_service appelait `await get_chunks()` | `get_chunks = get` alias, remove `await` | `661ad67` |
| Circuit breaker CODE ouvert pendant indexation | Timeout HuggingFace depuis container | Recovery auto après 60s, code temporaire sans embeddings | — |

## Non implémenté (raisons)

| # | Action | Raison |
|---|--------|--------|
| 11 | Memory graph | Tables nodes/edges existent, mais API non prioritaire |
| 12 | Tasks MCP | SEP-1686, spec MCP 2026 non finalisée |
| 13 | RAG-Fusion | 3× embedding cost, usage personnel Expanse overkill |
| 14 | PCA reduction | Gain marginal — halfvec déjà -50% |
| 15 | Filesystem watcher | Useful mais low priority — index_incremental suffit |
| 16 | BGE-M3 | jina-v5 suffisant, BGE-M3 si besoin multilingue |
| 17 | Git-aware indexing | Complexe (1sem), pas prioritaire |

---

*"The best optimization is the one you ship today. The second best is the one you measure tomorrow."*

---

*Document généré le 2026-03-26 — Brainstorm optimisations MnemoLite*  
*Mis à jour le 2026-03-27 — Statut + erreurs + décisions + intégration Expanse*  
*Sources : RAG best practices 2026, pgvector production guides, MCP 2026 roadmap, agent memory architectures, EMBEDDINGS-ANALYSIS.md, ROBUSTESSE-AUDIT.md
