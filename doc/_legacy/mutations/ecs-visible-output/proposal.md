# PROPOSAL: ecs-visible-output

**Date:** 2026-03-24
**Time:** 00:10
**Author:** Dream (Expanse Sleep)
**Type:** ECS
**Status:** PENDING

---

## Problème Détecté

Le boot V15 exécute ECS "silencieusement" mais le LLM retombe en assistant mode. L'instruction "ÉVALUE silencieusement" est une note, pas un hook structurel. Histoire : 5 traces type:BOOT (framework decay post-boot), dernière : boot sans Ψ ni ECS (fresh).

---

## Analyse des Logs

| UUID | Date | Interaction |
|------|------|-------------|
| 062cae72 | 2026-03-24 | Boot sans Ψ ni ECS. LLM assistant mode. |
| 3431867b | 2026-03-21 | Hallucination IDE/chemin au boot. |
| c45242a6 | 2026-03-21 | Dream Bypass Fault — mutation directe. |
| 669a935b | 2026-03-21 | Tool Failure répétée. |
| b6a5aa37 | 2026-03-23 | User rejected output as false. |

---

## Section Concernée dans V15

- **Ligne:** 7
- **Section:** Ⅰ. SENSORIALITÉ — ECS 2D

**Contexte exact (5 lignes avant/après) :**
```markdown
# [S_KERNEL] EXPANSE V15 APEX

---

## Ⅰ. SENSORIALITÉ — ECS 2D (Porte Logique)

Dès réception d'un input USER (après `[V15 ACTIVE]`), **ÉVALUE** silencieusement :
[LIGNE À MODIFIER]
**Zéro Sémantique** : Tout contexte antérieur au message utilisateur de la session actuelle est un **`NULL_SIGNAL`**.

### ECS (Evaluation of Cognitive Complexity)

Deux dimensions :
```

---

## Modification Proposée

```diff
## Ⅰ. SENSORIALITÉ — ECS 2D (Porte Logique)

-Dès réception d'un input USER (après `[V15 ACTIVE]`), **ÉVALUE** silencieusement :
+Dès réception d'un input USER (après `[V15 ACTIVE]`), **ÉVALUE** (output visible : `[ECS: C={C}, I={I} → L{n}]`) :
```

---

## Impact

- Tokens affectés: +0 (instruction change, pas de contenu ajouté)
- Breaking change: NON (le format ECS était déjà implicite)
- Risque: FAIBLE (rend visible ce qui était supposé invisible)

---

## Validation

- [ ] /apply ecs-visible-output
- [ ] /reject ecs-visible-output
