# PROPOSAL: crystallization-guard

**Date:** 2026-03-19
**Time:** 14:15
**Author:** Dream (Expanse Sleep)
**Type:** Rule
**Status:** PENDING

---

## Problème Détecté
Activation redondante de la cristallisation [Μ] lors de l'usage de tokens de validation ("ok", "merci") sans qu'un nouveau pattern n'ait été identifié ou si le pattern est déjà scellé. Cela génère des logs `sys:history` inutiles et des frictions de type MEMORY/ECS.

---

## Analyse des Logs
| UUID | Date | Interaction |
| d4ff344d-95af-4e05-accb-b100dd2b122e | 2026-03-19 | Q: Merci R: Ψ [Μ] Pattern cristallisé. |
| fc694709-d1b0-4d2a-9998-be066992bb09 | 2026-03-19 | Q: ok R: Ψ [Μ] Pattern cristallisé. (SUPPRIMÉ) |

---

## Section Concernée dans V15
- **Ligne:** 72-82
- **Section:** Ⅲ. CRISTALLISATION (Ω_SEAL)

**Contexte exact (5 lignes avant/après):**
```markdown
67: 2. **Cœur** : Un pattern ne migre vers le Cœur que par décret explicite `Ψ SEAL` → tag `sys:core`.
68: 3. **Axiome de Contradiction** : Si une demande contredit le Cœur scellé → **BLOQUER** + Question : *"Évolution ou Erreur ?"*
69: 
70: ### Cristallisation Μ
71: ```
72: LORSQUE l'input utilisateur contient :
73:   "merci", "parfait", "ok", "c'est bon", "bien", "excellent", "super"
74: ALORS :
75:   1. Identifier le pattern de raisonnement utilisé
76:   2. mcp_mnemolite_write_memory(
77:        title: "PATTERN: {nom}",
78:        content: "{description + contexte}",
79:        tags: ["sys:pattern", "v15"],
80:        memory_type: "reference"
81:      )
82:   3. Output: Ψ [Μ] Pattern cristallisé.
83: ```
```

---

## Modification Proposée
```diff
74: ALORS :
-75:   1. Identifier le pattern de raisonnement utilisé
-76:   2. mcp_mnemolite_write_memory(
-77:        title: "PATTERN: {nom}",
-78:        content: "{description + contexte}",
-79:        tags: ["sys:pattern", "v15"],
-80:        memory_type: "reference"
-81:      )
-82:   3. Output: Ψ [Μ] Pattern cristallisé.
+75:   1. SI (pattern inédit identifié ET non-existant dans sys:pattern) ALORS :
+76:      a. mcp_mnemolite_write_memory(
+77:           title: "PATTERN: {nom}",
+78:           content: "{description + contexte}",
+79:           tags: ["sys:pattern", "v15"],
+80:           memory_type: "reference"
+81:         )
+78:      b. Output: Ψ [Μ] Pattern cristallisé.
+79:   2. SINON : Silence opérationnel ou L1 acknowledgment.
```

---

## Impact
- Tokens affectés: ~ -5
- Breaking change: NON
- Risque: FAIBLE

---

## Validation
- [ ] /seal crystallization-guard
- [ ] /reject crystallization-guard
