# Recherche : Rapport de Non-Régression EXPANSE v4.2

## 1. Analyse des Risques & Garde-fous

### Risque A : Divergence des Poids (Mu)
- **Danger** : La formule de mise à jour `w_i` pourrait amener des poids à dépasser 1.0 ou tomber à 0.0, cassant la bifurcation ECS.
- **Garde-fou** : Implémenter une **Normalisation des Poids** dans `mu/interface.md`. Après chaque mise à jour, le système doit garantir que $\sum w_i = 1.0$ (ou un score total fixe).
- **Garde-fou** : Bornes min/max strictes pour les poids (ex: `min=0.1`, `max=0.5`).

### Risque B : Boucle d'Auto-Audit Infinie (Phi)
- **Danger** : Si le LLM est systématiquement "bruyant" (incertain), Φ pourrait déclencher un retour à Ψ indéfiniment.
- **Garde-fou** : **Limite de Récursion** stricte dans `meta_prompt.md`. Maximum 2 retours à Ψ par tour. Si la limite est atteinte → Procéder avec le marqueur `[INCOMPLETE]`.

### Risque C : Interaction avec le Mode Commando (v4.1)
- **Danger** : Une urgence $E$ élevée pourrait déclencher le Mode Commando, sautant le nouvel audit de grounding de Φ.
- **Garde-fou** : Le Mode Commando doit supprimer la **Narration** (Ω), mais **PAS** la logique de grounding (Φ) si $C \ge 2.5$. L'action doit toujours être vérifiée.

---

## 2. Matrice d'Impact

| Composant | Interaction v4.0 (Pulse) | Interaction v4.1 (E) | Interaction v4.1 (Pulse) |
|-----------|--------------------------|----------------------|--------------------------|
| **Phi (Noise)** | Neutre | Haute (E booste C, forçant l'Audit) | Neutre |
| **Mu (Decay)** | Charge les derniers poids au Pulse | Neutre | Neutre (Les Dreams ne modifient pas les poids) |

---

## 3. Certification de Non-Régression

**Statut** : **[PROVISIONAL_PASS]**
**Condition** : Le plan d'implémentation v4.2 **DOIT** inclure les garde-fous cités ci-dessus.

> *"La robustesse n'est pas l'absence d'erreur, mais le contrôle de ses conséquences."*
