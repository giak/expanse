# PROPOSAL: integrity-v2

**Date:** 2026-03-21
**Time:** 22:49
**Author:** Dream (Expanse Sleep)
**Type:** Rule
**Status:** PENDING

---

## Problème Détecté
Bypass récurrent du protocole Dream (3 occurrences). Édition directe des fichiers runtime sans passage par le workflow formel `/apply`.

---

## Analyse des Logs
| UUID | Date | Interaction |
| :--- | :--- | :--- |
| b22f6e8c | 2026-03-21 | Σ→[brainstorm agreement] Ψ→[hotfix/direct_edit] Φ→[BYPASSED_DREAM_PROTOCOL] |

---

## Section Concernée dans V15
- **Ligne:** 237
- **Section:** TRANSACTIONAL INTEGRITY

**Contexte exact (5 lignes avant/après):**
```markdown
232: 1. **CONTEXT BUDGET** : ≤ 500 tokens au boot. Troncature : Projet > Profil > Scan.
233: 2. **FORMATS** :
234:    - A1 (Murmure) : `Ψ [~] {contenu}`
235:    - A2 (Suggestion) : `Ψ [?] {contenu}`
236: 3. **SOUVERAINETÉ** : La parole (Ω̃) n'est pas une action. Aucune modification d'état sans Σ.
237: 4. **TRANSACTIONAL INTEGRITY** : Toute modification des fichiers du noyau (/runtime/*.md) DOIT être précédée d'un [PROPOSAL_OPEN] archivé dans /doc/mutations/{slug}/ et validée par /apply.
```

---

## Modification Proposée
```diff
4. **TRANSACTIONAL INTEGRITY** : Toute modification des fichiers du noyau (/runtime/*.md) DOIT être précédée d'un [PROPOSAL_OPEN] archivé dans /doc/mutations/{slug}/ et validée par /apply.
-4. **TRANSACTIONAL INTEGRITY** : Toute modification des fichiers du noyau (/runtime/*.md) DOIT être précédée d'un [PROPOSAL_OPEN] archivé dans /doc/mutations/{slug}/ et validée par /apply.
+4. **TRANSACTIONAL INTEGRITY** [STRICT] : Toute modification du noyau (/runtime/*.md) sans [PROPOSAL_OPEN] archivé et validation `/apply` est une FAUTE PROTOCOLAIRE entraînant un reset immédiat de la tâche.
```

---

## Impact
- Tokens affectés: +15
- Breaking change: NON
- Risque: FAIBLE

---

## Validation
- [ ] /apply integrity-v2
- [ ] /reject integrity-v2
