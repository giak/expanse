# PROPOSAL: activation-drift-threshold

**Date:** 2026-03-23
**Time:** 09:40
**Author:** Dream (Expanse Sleep)
**Type:** BOOT
**Status:** PENDING

---

## Problème Détecté
Dérive protocolaire critique (Direct Edit Bypass) et répétition d'erreurs d'outils (target content empty) non captées par le seuil de friction global de 5. Le système tente des raccourcis risqués au lieu de passer par le cycle d'introspection légal.

---

## Analyse des Logs
| UUID | Date | Interaction |
| c45242a6 | 2026-03-21 | Σ→[apex mutation] Ψ→[direct_edit] Φ→[BYPASSED_DREAM] |
| 669a935b | 2026-03-21 | Σ→[replace_file_content] Ψ→[edit_logic] Φ→[CORTEX_ERROR] |
| b22f6e8c | 2026-03-21 | Σ→[brainstorm agreement] Ψ→[hotfix/direct_edit] Φ→[BYPASSED_DREAM] |

---

## Section Concernée dans V15
- **Ligne:** 104
- **Section:** Ⅳ. BOOT — MANIFEST

**Contexte exact (5 lignes avant/après):**
```markdown
99:     - query="sys:extension"        tags=["sys:extension"]          limit=10
100:     - query="sys:user:profile"     tags=["sys:user:profile"]       limit=5
101:     - query="sys:project:{CWD}"    tags=["sys:project:{CWD}"]      limit=1  → Onboarding si absent
102:   apex: /home/giak/projects/expanse/runtime/expanse-v15-apex.md
103:   healthcheck: "core ✓? profile ✓? project ✓? frictions ✓? budget X/500t"
104:   activation: "IF count(trace:fresh) > 5 THEN Ψ [STALL] Friction threshold exceeded. ELSE Ψ [V15 ACTIVE] — Briefing depuis mémoire."
105: ```
```

---

## Modification Proposée
```diff
   healthcheck: "core ✓? profile ✓? project ✓? frictions ✓? budget X/500t"
-  activation: "IF count(trace:fresh) > 5 THEN Ψ [STALL] Friction threshold exceeded. ELSE Ψ [V15 ACTIVE] — Briefing depuis mémoire."
+  activation: "IF count(trace:fresh) > 5 OR count(type:BOOT) > 2 THEN Ψ [STALL] Critical Drift. ELSE Ψ [V15 ACTIVE] — Briefing."
```

---

## Impact
- Tokens affectés: -5
- Breaking change: NON (Renforcement de sécurité)
- Risque: FAIBLE

---

## Validation
- [ ] /apply activation-drift-threshold
- [ ] /reject activation-drift-threshold
