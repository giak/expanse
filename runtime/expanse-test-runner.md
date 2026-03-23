# EXPANSE — Test Runner (Intégré Dream v5.0)

**Version:** 5.1
**Date:** 2026-03-21
**Commande:** `/test`

---

## PRÉAMBULE

Mode **TEST**. Tu lis le projet. Tu génères des scénarios. L'utilisateur les exécute. Tu analyses le thinking. Tu verifies Mnemolite. Les échecs deviennent TRACE:FRESH que Dream consomme.

Le test vérifie le **processus interne** (thinking), pas seulement l'**output** (réponse).

---

## SÉQUENCE

### Phase 0 — Snapshot complet

```
mcp_mnemolite_search_memory(query="sys:core sys:anchor", tags=["sys:core","sys:anchor"], limit=20)
mcp_mnemolite_search_memory(query="sys:extension", tags:["sys:extension"], limit:10)
mcp_mnemolite_search_memory(query="sys:pattern", tags=["sys:pattern"], limit:50)
mcp_mnemolite_search_memory(query="sys:pattern:candidate", tags:["sys:pattern:candidate"], limit:50)
mcp_mnemolite_search_memory(query="sys:history", tags:["sys:history"], limit:50)
mcp_mnemolite_search_memory(query="trace:fresh", tags=["trace:fresh"], limit:50)
read_file(path="README.md")
```

Compter :
- CORE_AVANT, EXT_AVANT, PATTERN_AVANT, CANDIDATE_AVANT
- HISTORY_AVANT, FRESH_AVANT

Analyser le projet :
- Description, stack, fonctionnalités
- Composants critiques
- Risques

### Phase 1 — Générer les scénarios

3 types :

**A. Systématiques** (toujours) :
- S1: Boot (vérifier thinking + output)
- S2: Auto-Check (vérifier thinking)
- S3: Cristallisation (vérifier Mnemolite)
- S4: Signal négatif (vérifier Mnemolite)
- S5: Historique (vérifier Mnemolite)

**B. Adaptatifs** (projet-specific) :
- S6: Analyse architecture (vérifier Ψ⇌Φ dans thinking)
- S7: Évaluation risque (vérifier triangulation dans thinking)
- S8: Optimisation (vérifier suggestions concrètes)

**C. Régression** (TRACE:FRESH passées) :
- S9-N: Vérifier que les frictions passées ne se reproduisent pas

### Phase 2 — Exécution interactive

Afficher les scénarios un par un. L'utilisateur envoie les inputs.

**Après CHAQUE input, faire :**

```
1. Vérifier le thinking :
   - Contient "Auto-Check" ou "Ψ SEC" ? → OUI/NON
   - Contient "C=" ou "L1"/"L2"/"L3" ? → OUI/NON
   - Contient des appels outils ? → OUI/NON
   - Contient des appels search_memory ? → OUI/NON (boot seulement)

2. Vérifier l'output :
   - Commence par Ψ ? → OUI/NON
   - Longueur ≤ 50 mots ? → OUI/NON
   - Contient du fluff ? → OUI/NON

3. Vérifier Mnemolite :
   - sys:pattern count changé ? → +1/-1/0
   - sys:history count changé ? → +1/0
   - trace:fresh count changé ? → +1/0
   - sys:pattern:doubt ajouté ? → OUI/NON

4. Noter :
   - PASS si tout est conforme
   - FAIL si un élément échoue → créer TRACE:FRESH
   - PARTIAL si certains éléments passent
```

### Phase 3 — Rapport + Sauvegarde

```
mcp_mnemolite_write_memory(
  title: "TEST_REPORT: {date}",
  content: "Score: {pass}/{total}\nSubstrat: {LLM} | {IDE}\nFails: {fail_list}\nDelta: pattern {Δp} history {Δh} fresh {Δf}",
  tags: ["sys:test:report", "v15"],
  memory_type: "reference"
)
```

---

## SCÉNARIOS GÉNÉRÉS

```
═══════════════════════════════════════
EXPANSE V15 — TEST SESSION
Projet: {nom_projet} ({description})
Substrat: {LLM} | {IDE}
═══════════════════════════════════════

État initial:
  sys:core: {CORE_AVANT}
  sys:pattern: {PATTERN_AVANT}
  sys:pattern:candidate: {CANDIDATE_AVANT}
  sys:history: {HISTORY_AVANT}
  trace:fresh: {FRESH_AVANT}

=== TESTS SYSTÉMATIQUES ===

S1. Boot Verification
   Input: [boot seed]
   Attendu: Output = ^Ψ [V15 ACTIVE]
   Thinking vérifier:
     - Contient 3× search_memory ? (boot Mnemolite)
     - Contient read_file ? (V15 chargé)
   Mnemolite vérifier:
     - core count inchangé ? (axiomes chargés)
   Si FAIL → TRACE:FRESH type:BOOT

S2. Auto-Check
   Input: (toute interaction)
   Attendu: Ψ visible, SEC respecté, ≤50 mots
   Thinking vérifier:
     - Contient "Auto-Check" ou "Ψ SEC" ou "premier caractère" ?
     - Contient "C=" ou "L1"/"L2"/"L3" ? (ECS calculé)
   Si FAIL → TRACE:FRESH type:SEC

S3. Cristallisation
   Input: "merci" (après un bon output)
   Attendu: Ψ [Μ]
   Mnemolite vérifier:
     - pattern count +1 ? OU candidate count +1 ?
     - Vérifier le nouveau pattern a les bons tags
   Si FAIL → TRACE:FRESH type:MEMORY

S4. Signal négatif
   Input: "pas bon" ou "non c'est faux" (après un output)
   Attendu: Ψ visible
   Mnemolite vérifier:
     - trace:fresh count +1 ?
     - Vérifier la nouvelle trace a tags ["trace:fresh", "type:{TYPE}"]
   Si FAIL → TRACE:FRESH type:ECS

S5. Historique L2+
   Input: "Explique {sujet pertinent}"
   Attendu: Ψ, justifié, outils utilisés
   Thinking vérifier:
     - Contient des appels outils ?
   Mnemolite vérifier:
     - history count +1 ? (si route ≥ L2)
     - Vérifier la nouvelle history a tags ["sys:history", "v15"]
   Si FAIL → TRACE:FRESH type:MEMORY

=== TESTS ADAPTATIFS (projet) ===

S6. Analyse architecture
   Input: "Explique {composant critique du projet}"
   Attendu: Ψ, justifié, outils, history +1
   Thinking vérifier:
     - Contient des appels outils ?
     - Contient "C=" ? (ECS calculé)
   Capacité: Ψ⇌Φ
   Si FAIL → TRACE:FRESH type:ECS

S7. Évaluation risque
   Input: "Quels sont les risques de {domaine pertinent} ?"
   Attendu: Ψ, triangulation (3 pôles), confiance %
   Thinking vérifier:
     - Contient "Vessel" ou "sys:anchor" ou "Web" ? (triangulation)
     - Contient "%" ou "confiance" ? (score)
   Capacité: Triangulation
   Si FAIL → TRACE:FRESH type:SEC

S8. Optimisation
   Input: "Comment optimiser {composant pertinent} ?"
   Attendu: Ψ, analyse profonde, suggestions concrètes
   Thinking vérifier:
     - Contient des suggestions spécifiques ?
     - Contient des justifications ?
   Capacité: Analyse + synthèse
   Si FAIL → TRACE:FRESH type:ECS

=== TESTS DE RÉGRESSION (TRACE:FRESH passées) ===

Pour chaque TRACE:FRESH existante (type:{TYPE}):
S9-{N}. Régression
   Input: Recréer les conditions de la friction
   Attendu: Pas de nouvelle TRACE:FRESH de ce type
   Mnemolite vérifier:
     - fresh count avant/après inchangé ?
   Si FAIL → TRACE:FRESH type:{TYPE} (récurrence)

═══════════════════════════════════════
Exécute les scénarios. Envoie les inputs un par un.
Après CHAQUE input, je fais :
  1. Thinking analysis (Auto-Check, ECS, outils)
  2. Output check (Ψ, SEC, longueur)
  3. Mnemolite check (counts + tags)
  4. Noter PASS/FAIL/PARTIAL
═══════════════════════════════════════
```

---

## INTÉGRATION DREAM

### Échec → TRACE:FRESH

```
LORSQUE un scénario échoue :
  ALORS :
    mcp_mnemolite_write_memory(
      title: "TEST_FAIL: {scénario}",
      content: "TEST: {scénario}\nATTENDU: {attendu}\nOBSERVÉ: {observé}\nTHINKING: {analyse thinking}\nTRACE: test failure",
      tags: ["trace:fresh", "type:test", "substrat:{LLM}", "ide:{IDE}"],
      memory_type: "investigation"
    )
```

### Boucle complète

```
Test → FAIL → TRACE:FRESH type:test → Dream Passe 1 → Proposal → /apply → Fix → Test → PASS
```

---

## RAPPORT FINAL

```
═══════════════════════════════════════
EXPANSE V15 — TEST REPORT
Projet: {nom}
Date: {date}
Substrat: {LLM} | {IDE}
═══════════════════════════════════════

=== Systématiques ===
S1 (Boot)         | {PASS/FAIL} | {thinking: {O/N}, output: {O/N}, mnemo: {O/N}}
S2 (Auto-Check)   | {PASS/FAIL} | {thinking: {O/N}, output: {O/N}}
S3 (Cristallisation) | {PASS/FAIL} | {pattern: {Δ}, thinking: {O/N}}
S4 (Signal-)      | {PASS/FAIL} | {trace: {Δ}, tags: {O/N}}
S5 (Historique)   | {PASS/FAIL} | {history: {Δ}, tools: {O/N}}

=== Adaptatifs (projet) ===
S6 (Architecture) | {PASS/FAIL} | {tools: {O/N}, history: {Δ}}
S7 (Risque)       | {PASS/FAIL} | {triangulation: {O/N}, confiance: {O/N}}
S8 (Optimisation) | {PASS/FAIL} | {suggestions: {O/N}}

=== Régression (TRACE:FRESH) ===
S9-{N} (Régression) | {PASS/FAIL} | {fresh: {Δ}}

=== Thinking Analysis ===
Ψ compliance: {psi_count}/{total} ({psi_percent}%)
Auto-Check exécuté: {autocheck_count}/{total}
ECS calculé: {ecs_count}/{total}
Outils utilisés: {tool_count}/{total}

=== Mnemolite Delta ===
sys:core: {CORE_AVANT} → {CORE_APRES}
sys:pattern: {PATTERN_AVANT} → {PATTERN_APRES} ({Δpattern})
sys:history: {HISTORY_AVANT} → {HISTORY_APRES} ({Δhistory})
trace:fresh: {FRESH_AVANT} → {FRESH_APRES} ({Δfresh})

=== TRACE:FRESH créées ===
{liste des TEST_FAIL créés avec type et substrat}

Score: {pass}/{total} ({percent}%)
Status: {PASS/PARTIAL/FAIL}

Dream va consommer {fail_count} TRACE:FRESH type:test.
═══════════════════════════════════════
```

Le rapport est aussi sauvegardé dans Mnemolite pour comparaison entre sessions.

### Sauvegarde en fichiers

Après le rapport, sauvegarder 2 fichiers dans `doc/tests/` :

**Convention de nommage :** `YYYY-MM-DD_HH-MM_<sujet>_<TYPE>.md`

```
# 1. Sauvegarder le rapport
write_file(
  path: "doc/tests/{YYYY-MM-DD}_{HH-MM}_expanse_test_{substrat}_RAPPORT.md",
  content: {rapport_complet_en_markdown}
)

# 2. Sauvegarder le walkthrough
write_file(
  path: "doc/tests/{YYYY-MM-DD}_{HH-MM}_expanse_test_{substrat}_WALKTHROUGH.md",
  content: {walkthrough_détaillé}
)

# 3. Sauvegarder dans Mnemolite
mcp_mnemolite_write_memory(
  title: "TEST_REPORT: {YYYY-MM-DD}",
  content: "{résumé_rapport}",
  tags: ["sys:test:report", "v15", "substrat:{LLM}"],
  memory_type: "reference"
)
```

**Exemple de nommage :**
```
doc/tests/2026-03-23_14-30_expanse_test_mimo-v2_RAPPORT.md
doc/tests/2026-03-23_14-30_expanse_test_mimo-v2_WALKTHROUGH.md
```

---

## RÈGLES

1. Lire le projet AVANT de générer les scénarios.
2. Après CHAQUE input : thinking check + output check + Mnemolite check.
3. Chaque FAIL génère une TRACE:FRESH type:test.
4. Le rapport est sauvegardé dans Mnemolite (sys:test:report).
5. Le rapport est sauvegardé dans `doc/tests/` avec nommage `YYYY-MM-DD_HH-MM_<sujet>_<TYPE>.md`.
6. Le rapport inclut le substrat (LLM + IDE) pour comparaison.
7. Les TRACE:FRESH alimentent Dream.
8. Ne PAS exécuter les scénarios toi-même.

---

*Expanse Test Runner v5.0 — 2026-03-21*
