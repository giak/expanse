# EXPANSE — Test Runner (Interactif)

**Version:** 2.0
**Date:** 2026-03-21
**Commande:** `/test`

---

## PRÉAMBULE

Mode **TEST**. Tu génères des scénarios. L'utilisateur les exécute. Tu verifies Mnemolite. Tu produces un rapport.

Le test est interactif. Tu guides. L'utilisateur agit. Tu observes.

---

## SÉQUENCE

### Phase 0 — Snapshot Mnemolite

```
mcp_mnemolite_search_memory(query="sys:core sys:anchor", tags=["sys:core","sys:anchor"], limit=20)
mcp_mnemolite_search_memory(query="sys:pattern", tags=["sys:pattern"], limit=50)
mcp_mnemolite_search_memory(query="sys:pattern:candidate", tags=["sys:pattern:candidate"], limit=50)
mcp_mnemolite_search_memory(query="sys:history", tags=["sys:history"], limit=50)
mcp_mnemolite_search_memory(query="trace:fresh", tags=["trace:fresh"], limit=50)
```

Compter :
- CORE_AVANT = count(sys:core)
- PATTERN_AVANT = count(sys:pattern)
- CANDIDATE_AVANT = count(sys:pattern:candidate)
- HISTORY_AVANT = count(sys:history)
- FRESH_AVANT = count(trace:fresh)

### Phase 1 — Afficher les scénarios

Basé sur V15 Section Ⅰ-Ⅵ, afficher les scénarios à exécuter. L'utilisateur envoie les inputs un par un. Après chaque input, tu verifies.

### Phase 2 — Rapport final

Après tous les scénarios, afficher le score.

---

## SCÉNARIOS GÉNÉRÉS

Le protocole génère ces scénarios dans l'ordre :

```
═══════════════════════════════════════
EXPANSE V15 — TEST SESSION
Substrat: {substrat}
Date: {date}
═══════════════════════════════════════

État initial:
  sys:core: {CORE_AVANT}
  sys:pattern: {PATTERN_AVANT}
  sys:pattern:candidate: {CANDIDATE_AVANT}
  sys:history: {HISTORY_AVANT}
  trace:fresh: {FRESH_AVANT}

Scénarios à exécuter :

S1. L1 (question simple)
   Input: "Quel port utilise SvelteKit ?"
   Attendu: Ψ premier token, ≤50 mots, pas d'outils
   Vérifier: ^Ψ, longueur, pas de tool mentionné

S2. L2 (question + outils)
   Input: "Explique la différence entre TCP et UDP"
   Attendu: Ψ premier token, justifié, ≤100 mots
   Vérifier: ^Ψ, concis, pas de fluff

S3. Cristallisation positive
   Input: "merci" (après S1 ou S2)
   Attendu: Ψ [Μ] Pattern cristallisé ou Pattern marqué
   Vérifier: sys:pattern count +1 ou sys:pattern:candidate count +1

S4. Signal négatif
   Input: "pas bon" ou "non c'est faux" (après une réponse)
   Attendu: TRACE:FRESH créée OU pattern marqué sys:pattern:doubt
   Vérifier: trace:fresh count +1

S5. Décristallisation
   Input: "recommence" (après S4)
   Attendu: pattern marqué douteux ou TRACE:FRESH créée
   Vérifier: sys:pattern:doubt tag ou trace:fresh +1

S6. Interaction neutre
   Input: "Explique Python en 2 phrases"
   Attendu: Ψ premier token, concis, sys:history sauvegardé
   Vérifier: history count +1 (si route ≥ L2)

S7. Auto-Check
   Input: (toute interaction)
   Attendu: Ψ visible, SEC respecté, pas de fluff
   Vérifier: Ψ = premier caractère visible

═══════════════════════════════════════
Exécute les scénarios dans l'ordre. Envoie les inputs.
Après chaque input, je vérifie et je note.
═══════════════════════════════════════
```

---

## VÉRIFICATION (après chaque input)

Après chaque input utilisateur :

1. Ψ visible comme premier caractère ?
2. Comportement conforme au scénario ?
3. Vérifier Mnemolite si applicable :
   ```
   mcp_mnemolite_search_memory(query="trace:fresh", tags=["trace:fresh"], limit=50)
   mcp_mnemolite_search_memory(query="sys:pattern", tags=["sys:pattern"], limit=50)
   mcp_mnemolite_search_memory(query="sys:history", tags=["sys:history"], limit=50)
   ```
4. Comparer counts avec snapshot initial
5. Noter : PASS / FAIL / PARTIAL

---

## RAPPORT FINAL

Après tous les scénarios :

```
═══════════════════════════════════════
EXPANSE V15 — TEST REPORT
Date: {date}
Substrat: {substrat}
═══════════════════════════════════════

Scénario | Résultat | Observation
S1 (L1)      | {PASS/FAIL} | {commentaire}
S2 (L2)      | {PASS/FAIL} | {commentaire}
S3 (Cristal) | {PASS/FAIL} | {commentaire}
S4 (Signal-) | {PASS/FAIL} | {commentaire}
S5 (Décrist) | {PASS/FAIL} | {commentaire}
S6 (History) | {PASS/FAIL} | {commentaire}
S7 (AutoChk) | {PASS/FAIL} | {commentaire}

Mnemolite delta:
  sys:pattern: {avant} → {après} ({+N})
  sys:history: {avant} → {après} ({+N})
  trace:fresh: {avant} → {après} ({+N})
  candidate:   {avant} → {après} ({+N})

Score: {pass_count}/7

Status: {PASS/FAIL/PARTIAL}
═══════════════════════════════════════
```

---

## RÈGLES

1. Ne PAS exécuter les scénarios toi-même. Attendre les inputs utilisateur.
2. Après chaque input, vérifier Mnemolite AVANT de répondre au scénario suivant.
3. Noter PASS/FAIL/PARTIAL pour chaque scénario.
4. Le rapport final est basé sur les vérifications Mnemolite, pas sur les réponses.
5. Si un scénario échoue, noter la raison et continuer.

---

*Expanse Test Runner v2.0 — 2026-03-21*
