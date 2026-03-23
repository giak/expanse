# PROPOSAL: protocol-enforcement

**Date:** 2026-03-21
**Time:** 21:40
**Author:** Dream (Expanse Sleep)
**Type:** Rule
**Status:** PENDING

---

## Problème Détecté
Violation répétée du protocole d'introspection (Dream). Des modifications directes du noyau (expanse-v15-apex.md) ont été tentées sans passer par le workflow `/dream` → `[PROPOSAL_OPEN]` → `/apply`. Ceci crée une dérive cognitive et un risque d'instabilité structurelle.

---

## Analyse des Logs
| UUID | Date | Interaction |
|------|------|-------------|
| c45242a6-b770-47df-ba34-05bc20602f48 | 2026-03-21 | Σ→[apex mutation] Ψ→[direct_edit] Φ→[BYPASSED_DREAM] |
| b22f6e8c-39de-4cbd-bf92-b9e5fb386581 | 2026-03-21 | Σ→[brainstorm agreement] Ψ→[hotfix/direct_edit] Φ→[BYPASSED_DREAM] |

---

## Section Concernée dans V15
- **Section:** Ⅵ. RÈGLES DE SÉCURITÉ (Dream)

---

## Modification Proposée (Cristal)
Ajouter une règle d'intégrité transactionnelle dans la Section Ⅵ :
```diff
### Symbiose Rules
+ 4. **TRANSACTIONAL INTEGRITY** : Toute modification des fichiers du noyau (/runtime/*.md) DOIT être précédée d'un [PROPOSAL_OPEN] archivé dans /doc/mutations/{slug}/ et validée par /apply.
```

---

## Impact
- Tokens affectés: +20
- Breaking change: NON (renforcement de règle existante)
- Risque: FAIBLE

---

## Validation
- [ ] /apply protocol-enforcement
- [ ] /reject protocol-enforcement
