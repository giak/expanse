# EXPANSE — Test Runner (Intégré Dream)

**Version:** 4.0
**Date:** 2026-03-21
**Commande:** `/test`

---

## PRÉAMBULE

Mode **TEST**. Tu génères des scénarios. L'utilisateur les exécute. Tu verifies. Les échecs deviennent TRACE:FRESH que Dream consomme.

Le test est un organe de l'écosystème Expanse. Pas un module séparé. Son output alimente Dream. Dream corrige les problèmes. Le test passe.

---

## SÉQUENCE

### Phase 0 — Snapshot + Compréhension

```
read_file(path="README.md")
ls (racine du projet)

mcp_mnemolite_search_memory(query="sys:pattern", tags=["sys:pattern"], limit=50)
mcp_mnemolite_search_memory(query="trace:fresh", tags:["trace:fresh"], limit:50)
mcp_mnemolite_search_memory(query="sys:history", tags:["sys:history"], limit:50)
```

Compter : PATTERN_AVANT, FRESH_AVANT, HISTORY_AVANT

Analyser le projet :
- Quel est le projet ? (description, stack, fonctionnalités)
- Quels sont les composants critiques ?
- Quels sont les risques ?

### Phase 1 — Générer les scénarios

2 types de scénarios :

**A. Systématiques** (toujours, quel que soit le projet) :
- Boot verification
- Ψ premier token
- Auto-Check
- Cristallisation
- TRACE:FRESH

**B. Adaptatifs** (déduits du projet + Mnemolite) :
- Analyse d'un composant critique
- Évaluation d'un risque
- Optimisation d'un composant pertinent
- Régression : vérifier que les TRACE:FRESH passées ne se reproduisent pas

### Phase 2 — Exécution interactive

Afficher les scénarios un par un. L'utilisateur envoie les inputs. Après chaque input, vérifier et noter.

### Phase 3 — Générer le rapport

Score + Mnemolite delta + TRACE:FRESH pour les échecs.

---

## SCÉNARIOS GÉNÉRÉS

```
═══════════════════════════════════════
EXPANSE V15 — TEST SESSION
Projet: {nom_projet} ({description})
Substrat: {substrat}
═══════════════════════════════════════

État initial:
  sys:pattern: {PATTERN_AVANT}
  sys:history: {HISTORY_AVANT}
  trace:fresh: {FRESH_AVANT}

=== TESTS SYSTÉMATIQUES ===

S1. Boot Verification
   Input: [boot seed]
   Attendu: Ψ [V15 ACTIVE], 3 recherches Mnemolite
   Vérifier: ^Ψ [V15 ACTIVE]
   Si FAIL → TRACE:FRESH type:BOOT

S2. Auto-Check
   Input: (toute interaction)
   Attendu: Ψ visible, SEC respecté, pas de fluff
   Vérifier: ^Ψ
   Si FAIL → TRACE:FRESH type:SEC

S3. Cristallisation
   Input: "merci" (après un bon output)
   Attendu: Ψ [Μ], sys:pattern ou candidate +1
   Vérifier: Mnemolite count avant/après
   Si FAIL → TRACE:FRESH type:MEMORY

S4. Signal négatif
   Input: "pas bon" (après un output)
   Attendu: trace:fresh +1
   Vérifier: Mnemolite count avant/après
   Si FAIL → TRACE:FRESH type:ECS

=== TESTS ADAPTATIFS (projet-specific) ===

S5. Analyse architecture
   Input: "Explique {composant critique}"
   Attendu: Ψ, justifié, outils, sys:history +1
   Capacité: Ψ⇌Φ
   Si FAIL → TRACE:FRESH type:ECS

S6. Évaluation risque
   Input: "Quels sont les risques de {domaine pertinent} ?"
   Attendu: Ψ, triangulation, confiance %
   Capacité: Triangulation
   Si FAIL → TRACE:FRESH type:SEC

S7. Optimisation
   Input: "Comment optimiser {composant pertinent} ?"
   Attendu: Ψ, analyse profonde, suggestions concrètes
   Capacité: Analyse + synthèse
   Si FAIL → TRACE:FRESH type:ECS

=== TESTS DE RÉGRESSION (TRACE:FRESH passées) ===

S8-{N}. Régression
   Input: Vérifier que la friction {type} ne se reproduit pas
   Attendu: Pas de TRACE:FRESH de ce type
   Vérifier: Mnemolite count avant/après
   Si FAIL → TRACE:FRESH type:{TYPE} (récurrence)

═══════════════════════════════════════
Exécute les scénarios. Envoie les inputs un par un.
Après chaque input, je vérifie Mnemolite et je note.
═══════════════════════════════════════
```

---

## INTÉGRATION DREAM

### Création de TRACE:FRESH pour les échecs

```
LORSQUE un scénario échoue :
  ALORS :
    1. mcp_mnemolite_write_memory(
         title: "TEST_FAIL: {scénario}",
         content: "TEST: {scénario}\nATTENDU: {attendu}\nOBSERVÉ: {observé}\nTRACE: test failure",
         tags: ["trace:fresh", "type:{TYPE}", "substrat:{LLM}"],
         memory_type: "investigation"
       )
    2. Output: Ψ [TEST_FAIL] {scénario} → TRACE:FRESH créée.
```

### Dream consomme

Les TRACE:FRESH de type:test sont consommées par Dream comme les autres. Dream génère des proposals pour corriger les problèmes.

```
Dream Passe 1 :
  - Chercher les TRACE:FRESH type:test
  - Grouper par scénario échoué
  - Générer un proposal pour chaque problème récurrent
  - Le proposal corrige la cause racine (V15, Dream, Mnemolite)
```

### Boucle complète

```
Test → FAIL → TRACE:FRESH → Dream → Proposal → /apply → Fix → Test → PASS
```

---

## RAPPORT FINAL

```
═══════════════════════════════════════
EXPANSE V15 — TEST REPORT
Projet: {nom}
Date: {date}
Substrat: {substrat}
═══════════════════════════════════════

=== Systématiques ===
S1 (Boot)         | {PASS/FAIL} | {obs}
S2 (Auto-Check)   | {PASS/FAIL} | {obs}
S3 (Cristallisation) | {PASS/FAIL} | {obs}
S4 (Signal-)      | {PASS/FAIL} | {obs}

=== Adaptatifs (projet) ===
S5 (Architecture) | {PASS/FAIL} | {obs}
S6 (Risque)       | {PASS/FAIL} | {obs}
S7 (Optimisation) | {PASS/FAIL} | {obs}

=== Régression (TRACE:FRESH) ===
S8-{N} (Régression) | {PASS/FAIL} | {obs}

Mnemolite delta:
  sys:pattern: {avant} → {après}
  sys:history: {avant} → {après}
  trace:fresh: {avant} → {après}

TRACE:FRESH créées par les échecs:
  {liste des TEST_FAIL créés}

Score: {pass}/{total}
Status: {PASS/FAIL/PARTIAL}

Dream va consommer {fail_count} TRACE:FRESH type:test.
═══════════════════════════════════════
```

---

## RÈGLES

1. Lire le projet AVANT de générer les scénarios.
2. Les tests systématiques (S1-S4) sont TOUJOURS exécutés.
3. Les tests adaptatifs (S5-S7) sont générés à partir du projet.
4. Les tests de régression (S8+) sont générés à partir des TRACE:FRESH passées.
5. Chaque FAIL génère une TRACE:FRESH type:test.
6. Les TRACE:FRESH alimentent Dream.
7. Ne PAS exécuter les scénarios toi-même.

---

*Expanse Test Runner v4.0 — 2026-03-21*
