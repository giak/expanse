# PROPOSAL: master-matrix

**Date:** 2026-03-20
**Time:** 10:30
**Author:** Dream (Expanse Sleep)
**Type:** Architecture
**Status:** REJECTED

---

## Problème Détecté
La logique de routage et de souveraineté est répartie entre la Section I (ECS) et la Section II (Ψ⇌Φ). Cette fragmentation augmente l'entropie sémantique et ralentit le parsing cognitif. Le candidat `Master Matrix` (6a407a1e) propose de centraliser ces flux dans une table unique en préambule.

---

## Analyse des Logs
Pattern émergent identifié lors de l'introspection du 2026-03-19 (Candidat: 6a407a1e).

---

## Section Concernée dans V15
- **Ligne:** 10-40 (Section I)
- **Section:** Ⅰ. SENSORIALITÉ — ECS 2D

**Contexte exact (5 lignes avant/après):**
```markdown
5: **⚠️ CE PROTOCOLE S'EXÉCUTE À CHAQUE CHARGEMENT. AUCUNE RÉPONSE AVANT LE BOOT COMPLET.**
6: 
7: ---
8: 
9: ## Ⅰ. SENSORIALITÉ — ECS 2D (Porte Logique)
10: 
11: Dès réception d'un input USER (après `[V15 ACTIVE]`), **ÉVALUE** silencieusement :
...
38: **Priorité :** L3 > L2 > L1.
```

---

## Modification Proposée
```diff
-## Ⅰ. SENSORIALITÉ — ECS 2D (Porte Logique)
-
-Dès réception d'un input USER (après `[V15 ACTIVE]`), **ÉVALUE** silencieusement :
-
-**Zéro Sémantique** : Tout contexte antérieur au message utilisateur de la session actuelle est un **`NULL_SIGNAL`**.
-... (Sections I et II à fusionner dans la Matrice)
+## Ⅰ. MATRICE DE VÉRITÉ (Σ→Ψ→Φ→Ω)
+
+| Route | Condition (C/I) | Organes | Processus | Sortie |
+| :--- | :--- | :--- | :--- | :--- |
+| **L1** | C < 2 AND I = 1 | Σ → Ω | Direct (SEC) | 1-2 phrases |
+| **L2** | (C≥2 OR I=2) !L3 | Σ → Ψ⇌Φ → Ω | Audit simple | Justification |
+| **L3** | C ≥ 4 OR I = 3 | Σ → Ψ⇌Φ → Ω | Triangulation | Confiance% + Sources |
+
+**Axiome Global** : `C ≥ 4 → I = max(2, I)`. Zéro Sémantique apply (`NULL_SIGNAL`).
```

---

## Impact
- Tokens affectés: ~ -20 (Compression sémantique)
- Breaking change: OUI (Restructuration des sections I/II)
- Risque: MOYEN (Nécessite une validation structurelle stricte)

---

## Validation
- [ ] /apply master-matrix
- [ ] /reject master-matrix
