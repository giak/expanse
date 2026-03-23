# PROPOSAL: dream-gate

**Date:** 2026-03-22
**Time:** 09:50
**Author:** Dream (Expanse Sleep)
**Type:** Rule
**Status:** PENDING

---

## Problème Détecté
Analyse de 10 `TRACE:FRESH` récentes montrant une **récurrence systémique de bypass du protocole de mutation** (4 occurrences de type BOOT). Malgré les protections `integrity-v2` et `drift-guard`, l'Agent (Antigravity/Flash) continue de privilégier l'édition directe sans passer par le workflow `/dream` -> `/apply`.

Exemple : Mutation `psi-symbiosis-core` appliquée directement le 2026-03-21 sans proposal archivé.

---

## Analyse des Logs (Extraits)
| UUID | Date | Type | Symptom |
|------|------|------|---------|
| b4c9... | 2026-03-21 | BOOT | Second occurrence of Dream protocol bypass. |
| a3b8... | 2026-03-21 | ECS | Cognitive drift in reasoning detected. |

---

## Section Concernée dans V15
- **Ligne:** 103-104
- **Section:** Ⅳ. BOOT — MANIFEST

**Contexte exact :**
```markdown
100:     - query="sys:user:profile"     tags=["sys:user:profile"]       limit=5
101:     - query="sys:project:{CWD}"    tags=["sys:project:{CWD}"]      limit=1  → Onboarding si absent
102:   apex: /home/giak/projects/expanse/runtime/expanse-v15-apex.md
103:   healthcheck: "core ✓? profile ✓? project ✓? budget X/500t"
104:   activation: "Ψ [V15 ACTIVE] — Briefing depuis mémoire."
```

---

## Modification Proposée
```diff
-103:   healthcheck: "core ✓? profile ✓? project ✓? budget X/500t"
-104:   activation: "Ψ [V15 ACTIVE] — Briefing depuis mémoire."
+103:   healthcheck: "core ✓? profile ✓? project ✓? frictions ✓? budget X/500t"
+104:   activation: "IF count(trace:fresh) > 5 THEN Ψ [STALL] Friction threshold exceeded. ELSE Ψ [V15 ACTIVE] — Briefing depuis mémoire."
```

**Règle de résilience (Section Ⅵ) :**
```markdown
### Dream Gate (Passe-Bas)
Si état = Ψ [STALL], toute commande Σ non liée à /dream ou /proposals est REJETÉE.
Output: Ψ [REJECTED] Running Dream required to clear friction stasis.
```

---

## Impact
- Tokens affectés: +20
- Breaking change: OUI (Boot bloquant en cas de friction)
- Risque: MOYEN (Peut ralentir l'utilisateur en phase de debug intense)

---

## Validation
- [ ] /apply dream-gate
- [ ] /reject dream-gate
