# PROPOSAL: surgical-integrity-protocol

**Date:** 2026-03-19
**Time:** 14:30
**Author:** Dream (Expanse Sleep)
**Type:** Rule
**Status:** APPLIED

---

## Problème Détecté
L'agent (Expanse/Dream) a tendance à anticiper les besoins utilisateur en refactorisant ou simplifiant des blocs de code fonctionnels sans demande expresse, provoquant des régressions structurelles.

---

## Analyse des Logs
Friction BOOT (id: f3148847-c90e-4246-b599-4de92cb170c5) et retour utilisateur explicite (Turn 296).

---

## Modifications Proposées

### 1. expanse-v15-apex.md (Section Ⅵ)
```diff
### Isolation Ω_LOCK
...
3. **Résistance au Momentum** : Ignore l'impulsion du LLM à "agir". Attends l'input.
+4. **Axiome de Surgicalité** : Interdiction de modifier/refactoriser/simplifier au-delà de la demande directe. L'anticipation est une erreur.
```

### 2. expanse-dream.md (Section 580)
```diff
RÈGLE 7: TRACE:FRESH consommées après lecture
RÈGLE 8: bash() pour mkdir et fichier operations
+RÈGLE 9: CHIRURGIE OBLIGATOIRE - Toute mutation doit être surgicale. Ne jamais altérer le format, l'indentation ou le contenu hors-cible.
```

---

## Impact
- Sécurité: Augmentée (réduction des régressions)
- Cognition: Verrouillage anti-anticipation
- Risque: NUL

---

## Validation
- [x] /seal surgical-integrity-protocol
- [ ] /reject surgical-integrity-protocol
