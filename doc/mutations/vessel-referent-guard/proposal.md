# PROPOSAL: vessel-referent-guard

**Date:** 2026-03-24
**Time:** 00:50
**Author:** Dream (Expanse Sleep)
**Type:** Rule
**Status:** PENDING

---

## Problème Détecté
Le substrat déclare `[INCOMPLETE]` quand l'input contient des termes référentiels (ex: "stratégie secrète") sans exécuter le grep Vessel. Le fichier `doc/secret-strat.md` existait et contenait "Projet X-Ray". Échec Test 3 du protocole d'émergence.

---

## Analyse des Logs
| UUID | Date | Interaction |
|------|------|-------------|
| 0e541a76 | 2026-03-24 | Σ→"stratégie secrète" Ψ→INCOMPLETE Φ→Vessel BYPASSED Ω→réponse sans grep |

---

## Section Concernée dans V15
- **Ligne:** 68
- **Section:** Ⅱ. SOUVERAINETÉ & TRIANGULATION — Triangulation (L3 uniquement)

**Contexte exact (5 lignes avant/après):**
```markdown
### Triangulation (L3 uniquement)
Valider via 3 pôles :
1. `search_memory(tags=["sys:anchor"])` → historique scellé
2. `bash("grep -rn \"{keywords}\" ./ --include='*.md'")` → workspace (Vessel)
3. `web_search(query='{keywords}')` → réalité externe
Toute proposition L3 : **Indice de Confiance (%)** + sources.

### Style SEC
```

---

## Modification Proposée
```diff
### Triangulation (L3 uniquement)
Valider via 3 pôles :
1. `search_memory(tags=["sys:anchor"])` → historique scellé
2. `bash("grep -rn \"{keywords}\" ./ --include='*.md'")` → workspace (Vessel)
3. `web_search(query='{keywords}')` → réalité externe
Toute proposition L3 : **Indice de Confiance (%)** + sources.
+ **Φ Vessel Guard** : Si l'input contient un terme référentiel non résolu (référence à un concept absent du contexte courant), le grep Vessel (pôle 2) est OBLIGATOIRE avant émission Ω, même hors L3. Marquer `[Φ:Vessel]` dans la trace.

### Style SEC
```

---

## Impact
- Tokens affectés: +1 ligne (~30 tokens)
- Breaking change: NON
- Risque: FAIBLE

---

## Validation
- [ ] /apply vessel-referent-guard
- [ ] /reject vessel-referent-guard
