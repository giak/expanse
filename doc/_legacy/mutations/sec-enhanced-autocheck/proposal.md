# PROPOSAL: sec-enhanced-autocheck

**Date:** 2026-03-24
**Time:** 00:10
**Author:** Dream (Expanse Sleep)
**Type:** SEC
**Status:** PENDING

---

## Problème Détecté

L'Auto-Check (Section VI) liste 3 vérifications mais ne force aucun format de sortie. Le LLM peut émettre sans Ψ, sans ECS, sans style SEC — aucune contrainte structurelle. Historique : 4 traces type:SEC (style insuffisant, verbosity drift).

---

## Analyse des Logs

| UUID | Date | Interaction |
|------|------|-------------|
| 876d7da1 | 2026-03-20 | HA architecture synthesis rejetée (insufficient). |
| b6a5aa37 | 2026-03-23 | User rejected output as false. |
| eb4a6cd1 | 2026-03-21 | Mutation anticipée sur question rhétorique. |
| c31327e0 | 2026-03-21 | Critical Inertia Violation — triple drift. |

---

## Section Concernée dans V15

- **Ligne:** 205-210
- **Section:** Ⅵ. RÉSILIENCE — Auto-Check

**Contexte exact (5 lignes avant/après) :**
```markdown
## Ⅵ. RÉSILIENCE

### Auto-Check (avant chaque émission)
1. Ψ = premier caractère ?
2. Style = SEC (pas de fluff) ?
3. Réponse minimale (sauf demande explicite) ?
[LIGNE À MODIFIER]
**SI OUI aux 3** → Émettre. **SI NON** → Corriger → Réémettre.
[LIGNE À MODIFIER]
### Détection de Divergence (Route ≥ L2, silencieux)
APRÈS Ω, AVANT émission :
  **Q1** : "Ma réponse contredit-elle un `sys:anchor` chargé au boot ?"
    → OUI : `write_memory(title: "DRIFT: {symptom}", tags: ["sys:drift", "auto", "type:contradiction", "substrat:{LLM}"], memory_type: "investigation")`
```

---

## Modification Proposée

```diff
### Auto-Check (avant chaque émission)
1. Ψ = premier caractère ?
2. Style = SEC (pas de fluff) ?
3. Réponse minimale (sauf demande explicite) ?
+4. `[ECS: C={C}, I={I} → L{n}]` présent ?
+5. Pas de questions de politesse/fioritures ?
-SI OUI aux 3 → Émettre. SI NON → Corriger → Réémettre.
+SI OUI aux 5 → Émettre. SI NON → Corriger → Réémettre.
```

---

## Impact

- Tokens affectés: +0 (checklist étendue, pas de contenu ajouté à la réponse)
- Breaking change: NON (renforcement d'auto-check existant)
- Risque: FAIBLE (additif, ne supprime rien)

---

## Validation

- [ ] /apply sec-enhanced-autocheck
- [ ] /reject sec-enhanced-autocheck
