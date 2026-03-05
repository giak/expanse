# Recherche LLM pour Expanse sur LMStudio (Linux + AMD Ryzen 7 7840HS)

## 1. Contexte du Projet Expanse

Expanse est un **système cognitif/agentique** basé sur un langage de pensée symbolique utilisant des signes grecs:

- **Σ (Sigma)**: Perception et entrée
- **Ψ (Psi)**: Trace et méta-pensée  
- **Φ (Phi)**: Doute, audit et interaction avec les outils
- **Ω (Omega)**: Synthèse et output
- **Μ (Mu)**: Mémoire et cristallisation (Mnemolite)

Le système exige:
- **Raisonnement complexe** avec métacognition
- **Gestion de contexte** longue (prompts, mémoire, skills)
- **Précision** (anti-hallucination, audit)
- **Réactivité** pour le cycle Σ → [Ψ ⇌ Φ] → Ω → Μ

---

## 2. Spécifications Matérielles

| Composant | Détail |
|-----------|--------|
| CPU | AMD Ryzen 7 7840HS (8-core, Zen 4) |
| GPU | AMD Radeon 780M Graphics (RDNA 3, 16 Compute Units) |
| RAM | 56 GB DDR5 |
| VRAM | Partagée avec RAM (pas de GPU dédié) |
| Stockage | SSD NVMe |

**Note importante**: La Radeon 780M peut accélérer l'inférence via **Vulkan** ou **OpenCL** avec llama.cpp (backend utilisé par LMStudio).

---

## 3. Critères de Sélection

### 3.1 Format
- **GGUF** uniquement (support natif par LMStudio)
- Privilégier les quantifications: Q4_K_M, Q5_K_S, Q6_K, Q8_0

### 3.2 Taille du Modèle
Avec 56GB RAM et ~13GB disponible pour le LLM:
- **Optimal**: 14B - 30B paramètres
- **Maximum théorique**: 35B en Q4_K_M (~18GB)

### 3.3 Performance CPU (Zen 4)
- Les modèles avec architecture **Llama** ou **Qwen** sont optimisés pour AVX2/AVX512
- Ryzen 7 7840HS supporte AVX2, BMI2, F16C, FMA

### 3.4 Qualité de Raisonnement
Expanse nécessite:
- Bonne compréhension des instructions complexes
- Raisonnement multi-étapes
- Capacité de métacognition
- Gestion de contexte longue

---

## 4. Modèles Recommandés

### 4.1 Top Pick: **Qwen2.5 14B** ⭐

| Aspect | Détail |
|--------|--------|
| Taille | ~9GB (Q4_K_M) à ~14GB (Q6_K) |
| Performance | Excellent ratio qualité/vitesse |
| Contexte | 32K à 128K tokens |
| Forces | Raisonnement, coding, instructions complexes |
| GGUF | https://huggingface.co/Qwen/Qwen2.5-14B-Instruct-GGUF |

**Avantages pour Expanse**:
- Excellent pour suivre les instructions complexes du KERNEL.md
- Grande fenêtre de contexte pour les prompts système
- Bonne métacognition

---

### 4.2 Alternative: **Llama 3.1 8B**

| Aspect | Détail |
|--------|--------|
| Taille | ~5GB (Q4_K_M) à ~7GB (Q6_K) |
| Performance | Très rapide sur CPU |
| Contexte | 8K à 128K tokens |
| Forces | Polyvalent, bien documenté |
| GGUF | https://huggingface.co/brittlewis12/Llama-3.1-8B-Instruct-GGUF |

**Avantages**:
- Plus léger, très réactif
- Parfait pour les tests initiaux
- Large communauté

---

### 4.3 Alternative: **Phi-3.5 Mini**

| Aspect | Détail |
|--------|--------|
| Taille | ~2.5GB (Q4_K_M) |
| Performance | Extrême vitesse |
| Contexte | 4K à 128K tokens |
| Forces | Efficacité, raisonnement |
| GGUF | https://huggingface.co/microsoft/Phi-3.5-mini-instruct-GGUF |

**Avantages**:
- Idéal pour les快速 tests
- Très basse latence
- Bon raisonnement pour sa taille

---

### 4.4 Alternative: **Mistral Nemo 12B**

| Aspect | Détail |
|--------|--------|
| Taille | ~8GB (Q4_K_M) |
| Performance | Bon équilibre |
| Contexte | 128K tokens |
| Forces | Polyvalent, multilingue |
| GGUF | https://huggingface.co/mistralai/Mistral-Nemo-Instruct-2407-GGUF |

---

### 4.5 Pour Contexte Long: **Qwen2.5 32B**

| Aspect | Détail |
|--------|--------|
| Taille | ~20GB (Q4_K_M) |
| Performance | Plus lent mais plus capable |
| Contexte | 64K à 128K tokens |
| Forces | Raisonnement avancé |
| GGUF | https://huggingface.co/Qwen/Qwen2.5-32B-Instruct-GGUF |

**Note**: Nécessite ~22GB RAM, peut être ambitieux avec 13GB disponible.

---

## 5. Configuration LMStudio Recommandée

### 5.1 Settings Généraux
```json
{
  "model": "Qwen2.5-14B-Instruct-Q4_K_M.gguf",
  "context_length": 32768,
  "threads": 8,
  "gpu_layers": 24,
  "use_gpu": true,
  "batch_size": 512
}
```

### 5.2 Backend GPU (Radeon 780M)
- **Prefer**: Vulkan (plus performant sur RDNA 3)
- **Fallback**: CPU only si problèmes

### 5.3 Optimisations CPU
- `threads`: 6-8 (laisser 2 cores pour le système)
- `no_mmap`: false
- `use_mlock`: true

---

## 6. Recommandation Finale

### Pour Expanse, le meilleur choix est:

**Qwen2.5 14B en Q4_K_M** ou **Q5_K_S**

| Critère | Score |
|---------|-------|
| Taille (~9-11GB) | ✅ Parfait |
| Performance CPU | ✅ Excellent |
| Qualité raisonnement | ✅ Supérieur |
| Contexte (32K+) | ✅ Suffisant |
|总分 | ⭐ 9/10 |

**Alternative rapide**: Phi-3.5 Mini (Q4_K_M) pour les tests initiaux

**Pour plus de puissance**: Qwen2.5 32B (Q4_K_M) si vous avez besoin de plus de contexte

---

## 8. Installation de LMStudio sur Linux

### 8.1 Méthode recommandée: AppImage

```bash
# Télécharger depuis https://lmstudio.ai/
# OU via flatpak:
flatpak install lmstudio
```

### 8.2 Configuration GPU AMD (Radeon 780M)

LMStudio utilise llama.cpp qui supporte:
- **Vulkan** (recommandé pour RDNA 3)
- **OpenCL** (fallback)
- **CPU only** (si problèmes GPU)

#### Vérifier le support Vulkan:
```bash
vulkaninfo | grep -i radeon
```

#### Dans LMStudio:
1. Settings → GPU Acceleration
2. Choisir: **Vulkan** > **CPU**
3. Vérifier que "GPU Layers" est activé

---

## 9. Benchmarks Estimés (Ryzen 7 7840HS + Radeon 780M)

| Modèle | Quantification | Tokens/sec (CPU) | Tokens/sec (GPU) |
|--------|---------------|------------------|------------------|
| Qwen2.5 14B | Q4_K_M | ~8-12 | ~25-35 |
| Llama 3.1 8B | Q4_K_M | ~15-20 | ~40-50 |
| Phi-3.5 Mini | Q4_K_M | ~30-40 | ~60-80 |
| Mistral Nemo 12B | Q4_K_M | ~10-15 | ~30-40 |

*Estimations basées sur des tests comparables*

---

## 10. Comparatif Détaillé

| Modèle | Force Principale | Faiblesse | Idéal pour Expanse |
|--------|------------------|-----------|---------------------|
| **Qwen2.5 14B** | Raisonnement complexe | Taille moyenne | ⭐ Recommandé |
| Llama 3.1 8B | Polyvalence | Contexte limité | Tests rapides |
| Phi-3.5 Mini | Vitesse | Capacités limitées | Démonstrations |
| Mistral Nemo 12B | Équilibre | Moins optimisé | Alternative |
| Qwen2.5 32B | Puissance max | Lourd | Contexte long |

---

## 11. Prochaines Étapes

1. **Installer LMStudio** depuis https://lmstudio.ai/
2. **Télécharger** Qwen2.5-14B-Instruct-GGUF (Q4_K_M ou Q5_K_S)
3. **Configurer** Vulkan pour GPU AMD
4. **Tester** avec les prompts Expanse
5. **Itérer** selon les performances

---

## Sources

- [LMStudio Official](https://lmstudio.ai/)
- [HuggingFace GGUF Models](https://huggingface.co/models?sort=downloads&search=gguf)
- [llama.cpp Repository](https://github.com/ggerganov/llama.cpp)
- [AMD Ryzen 7 7840HS Specs](https://www.amd.com/en/products/apu/amd-ryzen-7-7840hs.html)
- [Radeon 780M Benchmarks](https://www.techpowerup.com/review/amd-radeon-780m-graphics/)
- [Qwen2.5 GGUF](https://huggingface.co/Qwen/Qwen2.5-14B-Instruct-GGUF)

---

*Document généré pour le projet Expanse - Recherche LLM CPU*
