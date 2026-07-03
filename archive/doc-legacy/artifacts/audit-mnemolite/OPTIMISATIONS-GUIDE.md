# Optimisations Mnemolite — Guide Pragmatique

> **Quoi :** Les 17 optimisations identifiées par l'audit du 2026-03-26  
> **Status :** 8/22 faites (36%) — 6 quick wins + court terme + 1 moyen terme  
> **Référence :** [SUIVI-optimisations.md](./SUIVI-optimisations.md) · [Brainstorm complet](./10-optimisations-brainstorm.md) · [Embeddings analysis](./EMBEDDINGS-ANALYSIS.md)

---

## Ce qui a été fait

### 1. Iterative Scan pgvector 0.8 — `1c97600`

**Quoi :** Active `hnsw.iterative_scan = 'on'` dans les requêtes vectorielles.

**Pourquoi :** Sans ça, un filtre `WHERE language='python'` sur un index HNSW peut retourner **0 résultats** même si des matches existent. Le filtre élimine trop de candidats pendant la traversée du graphe. Avec iterative scan, pgvector continue à chercher jusqu'à trouver assez de candidats matching les filtres.

**Impact :** Corrige le bug "0 résultats avec filtre". Aucun impact sur la latence.

**Fichiers modifiés :**
- `api/services/vector_search_service.py` — `SET hnsw.iterative_scan = 'on'`
- `api/db/repositories/memory_repository.py` — même SET dans les requêtes
- `api/db/repositories/code_chunk_repository.py` — refactorisé avec conn directe

---

### 2. HNSW Tuning (ef_search=100) — `1c97600`

**Quoi :** Passe `ef_search` de 40 (défaut) à 100 dans les requêtes.

**Pourquoi :** `ef_search` contrôle combien de candidats le graphe HNSW explore pendant une requête. Plus c'est haut, meilleur est le rappel, mais plus c'est lent.

| ef_search | Recall | Latence | Usage |
|-----------|--------|---------|-------|
| 40 (défaut) | ~92% | 1-2ms | Prototypage |
| **100** | **~97%** | **2-4ms** | **Production RAG** ✅ |
| 200 | ~99% | 4-8ms | Haute précision |

**Impact :** Recall passe de ~92% à ~97% (+5 points). Latence +1-2ms. Trade-off excellent.

---

### 3. Halfvec Quantification — `b18ddae`

**Quoi :** Ajoute des colonnes `halfvec(768)` (float16) au lieu de `vector(768)` (float32) pour les embeddings. Les requêtes utilisent `::halfvec`.

**Pourquoi :** Float16 = moitié moins de mémoire, ~2x plus rapide sur les recherches, seulement 0.8% de recall perdu.

| Métrique | Float32 | Float16 | Gain |
|----------|---------|---------|------|
| Stockage/row (768D) | ~3,080 bytes | ~1,544 bytes | **-50%** |
| Index HNSW (50K chunks) | ~1.2GB | ~600MB | **-50%** |
| Query QPS | baseline | ~2x | **+100%** |
| Recall | 100% | 99.2% | -0.8% |

**Implémentation :**
- Migration Alembic : colonnes `embedding_text_half` / `embedding_code_half` sur `code_chunks` et `memories`
- Index HNSW sur les colonnes halfvec
- Trigger PostgreSQL qui synchronise automatiquement : quand `embedding_text` (float32) est inséré, le trigger copie en `::halfvec`
- Les writes restent en `::vector` — les reads utilisent `::halfvec`

**Fichiers modifiés :**
- `api/services/vector_search_service.py` — `::halfvec` pour les requêtes
- `api/db/repositories/code_chunk_repository.py` — `::halfvec`
- `api/db/repositories/memory_repository.py` — `embedding_half`
- `api/services/hybrid_memory_search_service.py` — `::halfvec` + pgvector tuning
- Migration Alembic + triggers

---

### 4. Reranking activé par défaut — `4bf546e`

**Quoi :** Le `CrossEncoderRerankService` (qui existait déjà mais était optionnel) est maintenant activé par défaut. Lazy-loaded au premier search.

**Pourquoi :** Le reranking cross-encoder est beaucoup plus précis que la recherche vectorielle seule. Il relit les 30 premiers résultats et les re-classe avec un modèle spécialisé.

```
Hybrid Search → Top-30 candidats → Cross-Encoder Rerank → Top-5 final
```

| Métrique | Sans Reranking | Avec Reranking | Gain |
|----------|---------------|----------------|------|
| Precision@5 | ~60% | ~78% | **+30%** |
| Latence | ~50ms | ~350ms | +300ms |

**Modèle utilisé :** `BAAI/bge-reranker-base` (110M params, multilingual)

**Fichiers modifiés :**
- `api/services/hybrid_code_search_service.py` — `default_enable_reranking=True`
- `api/services/hybrid_memory_search_service.py` — `default_enable_reranking=True`

---

### 5. Adaptive RRF k — `9cc222e`

**Quoi :** La constante `k` de la fusion RRF s'adapte au type de query au lieu d'être fixée à 60.

**Pourquoi :** RRF fusionne les résultats du search lexical et vectoriel. La constante `k` contrôle la sensibilité aux top ranks :
- **k=20** (code heavy) : très sensible aux top ranks → meilleure précision
- **k=60** (équilibré) : défaut industry standard
- **k=80** (langage naturel) : plus démocratique → meilleur rappel

```python
# Heuristique simple
if "()" in query or "->" in query:  # code
    k = 20
elif len(query.split()) > 5:         # phrase naturelle
    k = 80
else:
    k = 60                           # équilibré
```

**Impact :** +5-10% précision sur queries code, +3-5% recall sur queries naturelles.

**Fichiers modifiés :**
- `api/services/rrf_fusion_service.py` — `get_optimal_k(query)`
- `api/services/hybrid_code_search_service.py` — param `rrf_k` sur `search()`
- 9 tests TDD ajoutés

---

### 6. Streamable HTTP Transport — `9b904e9`

**Quoi :** Le serveur MCP supporte maintenant `streamable-http` en plus de `stdio`.

**Pourquoi :** Le roadmap MCP 2026 fait de HTTP le transport préféré. SSE est en dépréciation. HTTP permet :
- Déploiement comme service Docker/K8s standard
- Scaling horizontal (stateless)
- Expanse peut appeler Mnemolite par HTTP
- Supporte OAuth 2.1

**Avant :** `Claude Desktop → stdio → MnemoLite MCP`  
**Après :** `Claude Desktop → HTTP POST → MnemoLite HTTP → JSON-RPC`

**Fichiers modifiés :**
- `api/mnemo_mcp/server.py` — `mcp.run(transport='streamable-http')`
- `api/mnemo_mcp/transport/__init__.py` — documentation des 2 transports
- 4 tests TDD ajoutés

---

### 7. Memory Decay Scoring — `dd2bb1a`

**Quoi :** Les mémoires anciennes obtiennent un score temporel décroissant. Les mémoires récentes et importantes remontent en priorité.

**Pourquoi :** Sans decay, une mémoire de 6 mois a le même poids qu'une mémoire d'hier. Le decay fait décroître le score exponentiellement :

```python
score = semantic_similarity × temporal_decay × importance
# temporal_decay = exp(-decay_rate × age_days)
```

| Paramètre | Effet | Usage |
|-----------|-------|-------|
| decay_rate=0.001 | Très lent (~50% après 700 jours) | sys:core, sys:anchor |
| decay_rate=0.01 | Modéré (~50% après 70 jours) | sys:pattern |
| decay_rate=0.1 | Rapide (~50% après 7 jours) | sys:history |

**Impact :** Les mémoires pertinentes remontent, les obsolètes s'atténuent naturellement.

---

### 8. BUG-01 fix — `98724a1`

**Quoi :** Corrige `self.services` → `self._services` (typo dans l'accès aux attributs).

---

## Ce qui reste

### 7. Upgrade Code Embedding — ⬜ À faire (2j)

**Quoi :** Remplacer `jina-embeddings-v2-base-code` (161M) par **Nomic CodeRankEmbed** (137M).

**Pourquoi :** Basé sur CoRNStack avec dual-consistency filtering. Modèle léger (137M), rapide sur CPU (~12ms/embedding), Apache 2.0. Score : ~75% CodeSearchNet vs ~70% pour jina v2.

> ⚠️ **Correction :** Le modèle "Nomic Embed Code" cité dans le brainstorm est un modèle de **7B params** — trop gros pour inférence CPU (~14GB RAM). Le modèle adapté est **Nomic CodeRankEmbed** (137M). Voir [EMBEDDINGS-ANALYSIS.md](./EMBEDDINGS-ANALYSIS.md).

**Impact :** +5% code search quality. Modèle plus rapide et plus léger.

**Alternatives :**
- **jina-embeddings-v5-text-small** (677M) avec LoRA retrieval — MMTEB 67.0, 32K context, CC-BY-NC-4.0
- **jina-embeddings-v5-text-nano** (239M) — MMTEB 65.5, ultra rapide CPU (~20ms), CC-BY-NC-4.0
- **BGE-M3** (568M) — dense+sparse+multi-vector, MIT, mais score MTEB inférieur (63.0)

---

### 8. Incremental Indexing — ⬜ À faire (3j)

**Quoi :** Au lieu de re-indexer tout le projet à chaque appel, ne re-indexer que les fichiers modifiés.

**Pourquoi :** Full index d'Expanse = ~6.5h. Incremental = ~50s pour 10 fichiers modifiés.

```python
# 1. Dernière indexation → last_indexed_at
# 2. git diff depuis last_indexed → changed_files
# 3. Re-index uniquement les modifiés
# 4. Supprimer chunks des fichiers supprimés
```

| Scénario | Full Index | Incremental | Gain |
|----------|-----------|-------------|------|
| 10 fichiers modifiés | ~6.5h | **~50s** | **99%** |
| 1 fichier modifié | ~6.5h | **~5s** | **99.9%** |

---

### 9. Memory Consolidation API — ⬜ À faire (2j)

**Quoi :** API pour compresser l'historique : quand `count(sys:history) > 20`, un LLM résume les 10 plus anciennes en 1 mémoire agrégée, puis soft-delete les originales.

**Pourquoi :** 100 interactions → 10 summaries → 1 aggregate. Réduction exponentielle du nombre de mémoires.

```
POST /api/v1/memories/consolidate
{
    "query": "sys:history",
    "threshold": 20,
    "batch_size": 10,
    "summary_prompt": "Résume ces interactions en patterns clés"
}
```

---

### 11. Memory Graph (Relations) — ⬜ À faire (3j)

**Quoi :** Utiliser les tables `nodes`/`edges` existantes pour créer des relations entre mémoires.

```
Mémoire A --[extends]--> Mémoire B
Mémoire A --[contradicts]--> Mémoire C
Mémoire A --[supports]--> Mémoire D
```

**Pourquoi :** Dream peut naviguer le graphe pour détecter automatiquement des contradictions entre patterns.

---

### 12. Tasks Primitive MCP — ⬜ À faire (3j)

**Quoi :** Call-now / fetch-later pour les opérations longues comme `index_project`.

**Pourquoi :** Actuellement, `index_project` bloque le client pendant 5 minutes. Avec Tasks, il retourne immédiatement un `task_id` et le client poll pour le status.

```python
task = await mcp.call_tool("index_project", {...})  # Retourne immédiatement
status = await mcp.get_task(task_id)                 # Poll status
```

---

### 13. RAG-Fusion Multi-Query — ⬜ À faire (2j)

**Quoi :** Générer 3 reformulations de la query via LLM, faire 3 recherches, fusionner via RRF.

```python
queries = [original, reformulation_1, reformulation_2]
fused = rrf_service.fuse(*[search(q) for q in queries], k=60)
```

**Impact :** +10-15% recall sur queries ambiguës. Coût : 3x embeddings (parallélisable).

---

### 14. PCA Dimensionality Reduction — ⬜ À faire (1 semaine)

**Quoi :** Réduire les embeddings de 768D à 512D via PCA (97% variance retained).

| Dimensions | Mémoire (50K) | Recall | Latence |
|------------|---------------|--------|---------|
| 768 (actuel) | ~600MB | 100% | baseline |
| 512 (PCA) | ~400MB | ~95% | -20% |

---

### 15. Filesystem Watcher — ⬜ À faire (2j)

**Quoi :** Utiliser `watchdog` ou `inotify` pour détecter les changements de fichiers en temps réel et déclencher l'indexation automatiquement.

---

### 16. BGE-M3 (TEXT upgrade) — ⬜ À faire (3j)

**Quoi :** Remplacer les modèles TEXT+CODE actuels par **BGE-M3** (568M) — un seul modèle pour dense + sparse + multi-vector.

**Pourquoi :** BGE-M3 supporte dense + sparse + multi-vector dans un seul modèle. Permettrait de remplacer le pg_trgm par du sparse BM25 intégré. License MIT. Score MTEB 63.0.

**Hardware :** AMD Ryzen 7 7840HS (CPU uniquement, pas de GPU). Inférence CPU ~50ms/embedding, ~400MB RAM (quantizé). Voir [EMBEDDINGS-ANALYSIS.md](./EMBEDDINGS-ANALYSIS.md).

**Alternatives :**
- **jina-embeddings-v5-text-small** (677M) — MMTEB 67.0, CC-BY-NC-4.0
- **jina-embeddings-v5-text-nano** (239M) — MMTEB 65.5, ultra rapide, CC-BY-NC-4.0
- **intfloat/multilingual-e5-large-v2** (335M) — MTEB ~64.5, MIT

---

### 17. Git-Aware Indexing — ⬜ À faire (1 semaine)

**Quoi :** Indexer par commit hash. Permettre `search_code` sur des branches spécifiques. Diff viewer entre commits.

---

## Bugs & Dette Technique

| # | Bug | Impact | Status |
|---|-----|--------|--------|
| BUG-02 | Filtre tags `search_by_vector` ignoré | Recherche par tag non fonctionnelle | ⬜ |
| BUG-03 | `cache_hit` hardcodé à `false` | Cache non mesurable | ⬜ |
| SEC-01 | Pas d'authentification API | API ouverte | ⬜ |
| SEC-02 | Secrets hardcodés | Fuite potentielle | ⬜ |

---

## Progression

```
Quick Wins    : ███ 3/3   (100%)  ✅
Court Terme   : ███ 3/3   (100%)  ✅
Moyen Terme   : █░░ 1/5   (20%)
Long Terme    : ░░░ 0/6   (0%)
Fixs/Dette    : █░░ 1/5   (20%)
─────────────────────────────
TOTAL         : ██░ 8/22  (36%)
```

---

*Document généré le 2026-03-26 — Optimisations MnemoLite*  
*Source : [SUIVI-optimisations.md](./SUIVI-optimisations.md) · [10-optimisations-brainstorm.md](./10-optimisations-brainstorm.md) · [EMBEDDINGS-ANALYSIS.md](./EMBEDDINGS-ANALYSIS.md)*
