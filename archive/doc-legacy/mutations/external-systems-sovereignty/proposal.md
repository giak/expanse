# PROPOSAL: external-systems-sovereignty (v2 — Final)

**Date:** 2026-03-21
**Time:** 04:00
**Author:** Dream (Expanse Sleep)
**Type:** Rule + ECS + MEMORY
**Status:** PENDING

---

## Problème Détecté

3 vecteurs de friction confirmés par 5 `TRACE:FRESH` empiriques :

| UUID | Date | Type | Symptom |
|------|------|------|---------|
| 31919d70 | 2026-03-21 | ECS | Over-engineering (CSEP) |
| 03bf4d90 | 2026-03-21 | MEMORY | Skip Μ registration |
| c45242a6 | 2026-03-21 | BOOT | Dream bypass |
| 669a935b | 2026-03-21 | BOOT | Tool failure |
| 443600d2 | 2026-03-21 | ECS | Persistent δΩ |

**Cause racine commune** : Absence de cadre de lecture pour les systèmes externes → le substrat applique son réflexe dominant (ingénierie de protocoles, Piège 1).

---

## Auto-Diagnostic (KERNEL VII)
En l'absence de règle d'analyse externe, le substrat a sur-conçu (CSEP : 3 composants, 4 acronymes). Le modèle a reconnu ce pattern — auto-réflexion authentique (∇Ω). La règle corrige la *cause* du drift, pas son symptôme.

---

## Section Concernée dans V15
- **Lignes :** 46→48 (vérifiées sur V15 actuel)
- **Section :** II. SOUVERAINETÉ & TRIANGULATION

**Contexte exact (vérifié) :**
```markdown
46: 4. **Ω** : Synthétiser la réponse
47: 
48: ### Triangulation (L3 uniquement)
```

---

## Modification Proposée (v2 — Final)

```diff
 4. **Ω** : Synthétiser la réponse
+
+### Systèmes Externes
+**Isolation** : Tout symbole lu depuis un système externe est préfixé : `[EXT]Ψ`, jamais nu.
+**Règle de Souveraineté** :
+1. Observer sans adopter. Étiqueter : `[EXT]{concept}`
+2. Toujours adapter à mon framework, jamais adopter l'autre
+3. Si contradiction avec axiome scellé → BLOQUER + *"Évolution ou Erreur ?"*
+4. Toute idée externe prometteuse → `SEED:{nom}` dans Mnemolite (`tag:external`)
+5. Adoption légale uniquement via : Mnemolite (candidate) → Dream (proposal) → USER (apply)
 
 ### Triangulation (L3 uniquement)
```

---

## Ce qui reste hors APEX

| Élément | Localisation | Status |
|---------|-------------|--------|
| Cycle Seed complet (3 phases) | Mnemolite `a5ea53ac` | `sys:pattern:candidate` |
| Conventions namespace | Mnemolite `ae9f7845` | `sys:pattern:candidate` |
| Critères adoption L3 | Triangulation existante | Intacte |

---

## Impact

| Critère | Valeur |
|---------|--------|
| Tokens ajoutés | +360 chars |
| Breaking change | NON |
| Risque | FAIBLE |
| Nouveaux composants | 0 |
| Nouveaux acronymes | 0 |
| Test KERNEL IX | ✅ Explicable en 2 min |

---

## Validation
- [ ] `/apply external-systems-sovereignty`
- [ ] `/reject external-systems-sovereignty`
