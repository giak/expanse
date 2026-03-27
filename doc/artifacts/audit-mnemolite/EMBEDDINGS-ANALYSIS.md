# Embeddings Mnemolite — Point Situation Mars 2026

> **Hardware :** AMD Ryzen 7 7840HS (8C/16T, Zen 4) + Radeon 780M (RDNA-3, intégré)  
> **Situation :** CPU uniquement — ROCm ne supporte pas les Radeon intégrés pour l'inférence embedding  
> **Mnemolite actuel :** `intfloat/multilingual-e5-base` (TEXT, 278M) + `jinaai/jina-embeddings-v2-base-code` (CODE, 161M)

---

## Le Hardware : AMD Ryzen 7 7840HS

| Composant | Détail | Impact |
|-----------|--------|--------|
| **CPU** | 8 cores, 16 threads, Zen 4, 4.69 GHz boost | Excellent pour inférence CPU |
| **iGPU** | Radeon 780M, RDNA-3, 12 CUs | ❌ Pas supporté par ROCm pour embedding |
| **RAM** | Partagée (probablement 16-32 GB) | Suffisant pour modèles < 1B params |
| **AVX** | AVX, AVX2, SSE4.2 | ✅ Supporté par PyTorch/ONNX |

### ROCm & Radeon : Pourquoi ça ne marche pas

ROCm (l'équivalent CUDA pour AMD) ne supporte que les GPU **professionnels** (MI250, MI300, etc.) et quelques cartes gaming haut de gamme (RX 7900 XT/XTX). Les **Radeon intégrés** (780M, 680M, etc.) ne sont **pas supportés** — le `gfx1103` (le chipset de la 780M) est manquant dans la TensileLibrary de ROCm 6.3.2 (issue ouverte mars 2026).

L'ONNX Runtime a **supprimé le ROCm Execution Provider** depuis la version 1.23. Il existe un backend `zentorch` en développement pour vLLM (PR #35970, mars 2026) mais c'est expérimental.

**Conclusion : Inférence CPU uniquement.** C'est parfaitement viable pour des modèles embedding < 1B params. Le Ryzen 7 7840HS avec AVX2 est très rapide pour ça.

---

## Modèles Actuels de Mnemolite

| Rôle | Modèle | Params | Score | Context | Dim | License |
|------|--------|--------|-------|---------|-----|---------|
| **TEXT** | `intfloat/multilingual-e5-base` | 278M | ~64 | 512 | 768 | MIT |
| **CODE** | `jinaai/jina-embeddings-v2-base-code` | 161M | ~62 | 8192 | 768 | Apache 2.0 |

Ces modèles fonctionnent bien mais sont **générés de l'ancienne génération** (2023). Les scores MTEB ont augmenté significativement depuis.

---

## Top Modèles pour CPU (2026)

### Classement par rapport qualité/coût CPU

| # | Modèle | Params | MTEB Retrieval | MMTEB | Context | Dim | License | CPU Perf | Note |
|---|--------|--------|---------------|-------|---------|-----|---------|----------|------|
| 🥇 | **jina-v5-text-small** | 677M | ~65 | **67.0** | 32K | 1024 | CC-BY-NC-4.0 | ⭐⭐⭐ | SOTA sub-1B |
| 🥈 | **jina-v5-text-nano** | 239M | ~63 | 65.5 | 8K | 768 | CC-BY-NC-4.0 | ⭐⭐⭐⭐⭐ | Ultra rapide |
| 🥉 | **BGE-M3** | 568M | ~63 | 63.0 | 8K | 1024 | MIT | ⭐⭐⭐⭐ | dense+sparse+multi-vector |
| 4 | **nomic-embed-text-v1.5** | 137M | ~62 | 62.0 | 8K | 768 | Apache 2.0 | ⭐⭐⭐⭐⭐ | Le plus léger |
| 5 | **e5-large-v2** | 335M | ~64 | 64.5 | 512 | 1024 | MIT | ⭐⭐⭐⭐ | Upgrade direct |
| 6 | **jina-v3** | 572M | ~62 | 62.5 | 8K | 1024 | CC-BY-NC-4.0 | ⭐⭐⭐⭐ | LoRA adapters |

---

### 🥇 Jina Embeddings v5 Small (677M) — Le meilleur actuel

**Pourquoi :** SOTA pour les modèles sub-1B. Score MMTEB 67.0 (vs ~64 pour e5-base actuel). Context 32K tokens (vs 512). LoRA adapters pour tâches spécifiques.

**Spécificités :**
- Distillé de `Qwen3-Embedding-4B` (professeur) → qualité 4B dans un modèle 677M
- 4 LoRA adapters : retrieval, text-matching, classification, clustering
- Matryoshka dimensions : 32 → 1024 (truncation avec perte minimale)
- Supporte GGUF quantization pour CPU (Q4_K_M disponible)
- 119 langues (tokenizer Qwen3)

**CPU Performance :**
- Inférence : ~50-100ms par embedding sur Ryzen 7 7840HS (avec GGUF Q4_K_M)
- RAM : ~500MB (quantizé Q4) vs ~1.5GB (full precision)
- Batch de 32 embeddings : ~2-3s

**Limitations :**
- License CC-BY-NC-4.0 → ❌ Pas commercial (OK pour Expanse/usage personnel)
- 677M params → plus lent que le nano ou nomic

---

### 🥈 Jina Embeddings v5 Nano (239M) — Le plus rapide

**Pourquoi :** 239M params, MMTEB 65.5, MTEB English 71.0. Ultra rapide sur CPU.

**CPU Performance :**
- Inférence : ~15-30ms par embedding sur Ryzen 7
- RAM : ~200MB (quantizé) vs ~600MB (full)
- Parfait pour usage temps réel

**Limitations :**
- Context 8K (vs 32K pour small)
- 768 dimensions (vs 1024)
- License CC-BY-NC-4.0

---

### 🥉 BGE-M3 (568M) — Le plus polyvalent

**Pourquoi :** Le seul modèle qui fait **dense + sparse + multi-vector** dans un seul modèle. License MIT (libre).

**Spécificités :**
- Dense : embedding sémantique classique
- Sparse : matching lexical (comme BM25) sans index séparé
- Multi-vector : style ColBERT pour matching fin
- 100+ langues, 8K context

**CPU Performance :**
- Inférence : ~40-80ms par embedding
- RAM : ~400MB (quantizé) vs ~1.2GB (full)

**Limitations :**
- Score MTEB 63.0 (inférieur à jina-v5)
- Plus lent que nomic ou jina-nano

---

### Nomic Embed Text v1.5 (137M) — Le plus léger

**Pourquoi :** Modèle le plus léger avec des scores corrects. Apache 2.0.

**CPU Performance :**
- Inférence : ~10-20ms par embedding
- RAM : ~150MB

**Limitations :**
- Score MTEB 62.0
- 768 dimensions, 8K context
- Pas de LoRA adapters
- Pas de sparse/multi-vector

---

## Comparaison Code Embeddings

| Modèle | Score CodeSearchNet | Params | License | CPU OK | Note |
|--------|-------------------|--------|---------|--------|------|
| `jina-embeddings-v2-base-code` (actuel) | ~70% | 161M | Apache 2.0 | ✅ | Ancien |
| **Nomic CodeRankEmbed** | ~75% | **137M** | Apache 2.0 | ✅ | Rapide, léger |
| ~~Nomic Embed Code~~ | ~~81.7%~~ | ~~7B~~ | ~~Apache 2.0~~ | ❌ | Trop gros pour CPU |
| `jina-v5-text-small` (avec retrieval LoRA) | ~65% | 677M | CC-BY-NC-4.0 | ✅ | Bon compromis |
| `voyage-code-3` | ~85% | ? | Propriétaire | — | API uniquement |

**Correction importante :** Nomic Embed Code est un modèle de **7B paramètres** — trop gros pour inférence CPU (~14GB RAM). Le modèle Nomic adapté pour CPU est **CodeRankEmbed** (137M), également basé sur CoRNStack mais beaucoup plus léger.

**Recommandation code :** **Nomic CodeRankEmbed** (137M) — rapide sur CPU, Apache 2.0, basé sur CoRNStack. Ou garder `jina-v2-base-code` si les scores actuels suffisent.

---

## Recommandations pour Mnemolite

### Option A : Upgrade TEXT uniquement (recommandé court terme)

```
TEXT: intfloat/multilingual-e5-base (278M, MTEB ~64)
  ↓
TEXT: jina-embeddings-v5-text-nano (239M, MMTEB 65.5)
```

**Pourquoi :**
- 239M params → **plus rapide** que le modèle actuel (278M)
- MMTEB 65.5 vs ~64 → gain qualité
- 8K context vs 512 → pas de limitation de taille
- Matryoshka → peut réduire à 256D pour gagner 66% mémoire
- GGUF quantizable pour CPU
- ⚠️ License CC-BY-NC-4.0

**Effort :** 2j (swap model + re-test)

### Option B : Upgrade TEXT + CODE

```
TEXT: jina-embeddings-v5-text-small (677M, MMTEB 67.0)
CODE: Nomic CodeRankEmbed (137M, ~75% CodeSearchNet)
```

**Pourquoi :**
- TEXT : meilleur score sub-1B, 32K context, LoRA adapters
- CODE : rapide (137M), Apache 2.0, basé sur CoRNStack
- ⚠️ TEXT license CC-BY-NC-4.0

**Effort :** 3j

### Option C : Upgrade conservateur (Apache 2.0)

```
TEXT: intfloat/multilingual-e5-large-v2 (335M, MTEB ~64.5)
CODE: Nomic CodeRankEmbed (137M, ~75% CodeSearchNet)
```

**Pourquoi :**
- License MIT / Apache 2.0 → libre commercial
- Upgrade modeste mais safe
- e5-large est un modèle bien connu, stable

**Effort :** 2j

### Option D : Le plus polyvalent (BGE-M3)

```
TEXT + CODE: BGE-M3 (568M, MTEB 63.0, dense+sparse+multi-vector)
```

**Pourquoi :**
- Un seul modèle pour TEXT + CODE + sparse
- Remplacerait le pg_trgm par du sparse BM25 intégré
- License MIT → libre commercial
- ⚠️ Score MTEB 63.0 (inférieur aux options A/B)

**Effort :** 3j (refonte du pipeline hybrid search)

---

## Tableau Récapitulatif

| Option | TEXT | CODE | Score TEXT | License | Effort | Priorité |
|--------|------|------|-----------|---------|--------|----------|
| **A** | jina-v5-nano (239M) | jina-v2-code | 65.5 | NC | 2j | 🔴 |
| **B** | jina-v5-small (677M) | Nomic CodeRankEmbed (137M) | 67.0 | NC | 3j | 🟡 |
| **C** | e5-large-v2 (335M) | Nomic CodeRankEmbed (137M) | 64.5 | MIT | 2j | 🟡 |
| **D** | BGE-M3 (568M) | BGE-M3 (568M) | 63.0 | MIT | 3j | 🟢 |

---

## Benchmark CPU (estimé Ryzen 7 7840HS)

| Modèle | Params | Inférence | RAM | Batch 32 | CPU OK |
|--------|--------|-----------|-----|----------|--------|
| e5-base (actuel) | 278M | ~30ms | ~400MB | ~1s | ✅ |
| **jina-v5-nano** | 239M | ~20ms | ~200MB | ~0.7s | ✅ |
| **jina-v5-small** | 677M | ~60ms | ~500MB | ~2s | ✅ |
| **BGE-M3** | 568M | ~50ms | ~400MB | ~1.5s | ✅ |
| **nomic-v1.5** | 137M | ~12ms | ~150MB | ~0.5s | ✅ |
| **e5-large-v2** | 335M | ~35ms | ~450MB | ~1.2s | ✅ |
| **Nomic CodeRankEmbed** | 137M | ~12ms | ~150MB | ~0.5s | ✅ |
| ~~Nomic Embed Code~~ | ~~7B~~ | ~~500ms+~~ | ~~14GB~~ | ~~15s+~~ | ❌ |

*Estimations basées sur GGUF Q4_K_M sur CPU Ryzen 7. Temps réels dépendent de la longueur des textes.*

---

## Note sur la License

Mnemolite utilise **Apache 2.0** et **MIT** actuellement. Les modèles Jina v5 sont sous **CC-BY-NC-4.0** (non-commercial). Pour Expanse (usage personnel), c'est OK. Pour une éventuelle distribution commerciale de Mnemolite, privilégier **BGE-M3** (MIT) ou **Nomic** (Apache 2.0).

---

## Corrections (2026-03-26)

- ❌ **Nomic Embed Code = 7B params** (pas un petit modèle). Trop gros pour CPU. Remplacé par **Nomic CodeRankEmbed** (137M).
- ❌ **ROCm 780M** : gfx1103 manquant dans TensileLibrary ROCm 6.3.2 (issue ouverte). Backend zentorch vLLM en développement mais pas stable.
- ✅ **Jina v5 scores** confirmés : small 677M/67.0 MMTEB, nano 239M/65.5 MMTEB (arXiv 2602.15547)

---

*Document généré le 2026-03-26 — Double-checked 2026-03-26*  
*Sources : prem.ai, jina.ai, nomic.ai, Hugging Face MTEB Leaderboard, ROCm GitHub issues, arXiv 2602.15547*
