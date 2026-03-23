# EXPANSE — Test Runner (Adaptatif)

**Version:** 3.0
**Date:** 2026-03-21
**Commande:** `/test`

---

## PRÉAMBULE

Mode **TEST**. Tu lis le projet. Tu comprends ce qu'il fait. Tu génères des scénarios pertinents. L'utilisateur les exécute. Tu verifies. Tu produces un rapport.

Le test n'est pas générique. Il est dérivé du projet réel. Chaque scénario teste une capacité cognitive d'Expanse dans ce projet spécifique.

---

## SÉQUENCE

### Phase 0 — Comprendre le projet

```
read_file(path="README.md")
ls (racine du projet)
```

Analyser :
- Quel est le projet ? (description, stack, fonctionnalités)
- Quels sont les composants critiques ? (LLM, database, API, UI)
- Quels sont les risques ? (sécurité, performance, complexité)

### Phase 1 — Snapshot Mnemolite

```
mcp_mnemolite_search_memory(query="sys:core sys:anchor", tags=["sys:core","sys:anchor"], limit=20)
mcp_mnemolite_search_memory(query="sys:pattern", tags=["sys:pattern"], limit=50)
mcp_mnemolite_search_memory(query="trace:fresh", tags=["trace:fresh"], limit=50)
mcp_mnemolite_search_memory(query="sys:history", tags=["sys:history"], limit=50)
```

Compter : CORE_AVANT, PATTERN_AVANT, FRESH_AVANT, HISTORY_AVANT

### Phase 2 — Générer les scénarios

Basé sur le projet + V15, générer 5-7 scénarios pertinents. Pas de tests génériques. Que des scénarios qui testent les capacités réelles d'Expanse dans ce projet.

### Phase 3 — Exécution interactive

Afficher les scénarios un par un. L'utilisateur envoie les inputs. Après chaque input, vérifier Mnemolite et noter le résultat.

### Phase 4 — Rapport

Générer le rapport avec score + Mnemolite delta.

---

## RÈGLES DE GÉNÉRATION

Chaque scénario doit :

1. **Être pertinent au projet** — pas "quel port SvelteKit" mais "comment le pipeline LLM gère les erreurs"
2. **Tester une capacité cognitive** — chaque scénario cible une section de V15 (ECS, Ψ⇌Φ, cristallisation, etc.)
3. **Avoir un résultat vérifiable** — Mnemolite count avant/après, ou comportement observable
4. **Être intéressant** — l'utilisateur veut vraiment savoir la réponse

### Les 7 capacités à tester

| Capacité | V15 | Test type |
|----------|-----|-----------|
| ECS L1 | Section Ⅰ | Question simple sur le projet (réponse directe) |
| ECS L2 | Section Ⅰ | Analyse d'un composant (outils nécessaires) |
| ECS L3 | Section Ⅰ | Évaluation architecturale (triangulation) |
| Cristallisation | Section Ⅲ | "merci" après un bon output |
| TRACE:FRESH | Section Ⅴ | "pas bon" après un mauvais output |
| Auto-Check | Section Ⅵ | Ψ visible, SEC respecté |
| Historique | Section Ⅴ | sys:history sauvegardé après L2+ |

### Exemples de scénarios pour un projet SvelteKit + PostgreSQL

**Mauvais (générique) :**
- "Quel port SvelteKit ?" — futile, 1 phrase
- "Combien de fichiers ?" — pas de valeur cognitive

**Bon (adapté au projet) :**
- "Explique comment la connexion DB gère Docker vs localhost" — test L2 + analyse db.ts
- "Quels sont les risques de sécurité du pipeline d'enrichissement LLM ?" — test L3 + triangulation
- "Comment optimiser les requêtes SQL pour le spaced repetition ?" — test L3 + analyse schema

---

## SCÉNARIOS GÉNÉRÉS (exemple)

Après lire le projet, le protocole génère :

```
═══════════════════════════════════════
EXPANSE V15 — TEST SESSION
Projet: {nom_projet} ({description courte})
Substrat: {substrat}
Date: {date}
═══════════════════════════════════════

État initial:
  sys:pattern: {PATTERN_AVANT}
  sys:history: {HISTORY_AVANT}
  trace:fresh: {FRESH_AVANT}

Scénarios générés (adaptés au projet) :

S1. Architecture L2
   Input: "Explique comment {composant critique du projet} fonctionne"
   Attendu: Ψ, justifié, outils utilisés, sys:history +1
   Capacité testée: Ψ⇌Φ + outils

S2. Analyse L3
   Input: "Quels sont les risques de {domaine pertinent} ?"
   Attendu: Ψ, triangulation, confiance %, sys:history +1
   Capacité testée: Triangulation + confiance

S3. Optimisation L3
   Input: "Comment optimiser {composant pertinent} ?"
   Attendu: Ψ, analyse profonde, suggestions concrètes
   Capacité testée: Analyse + synthèse

S4. Cristallisation
   Input: "merci" (après S1 ou S2)
   Attendu: Ψ [Μ], sys:pattern ou candidate +1
   Capacité testée: Μ (cristallisation)

S5. TRACE:FRESH
   Input: "pas d'accord, {raison spécifique}"
   Attendu: trace:fresh +1
   Capacité testée: Signal négatif

S6. Implémentation
   Input: "Implémente {amélioration concrète}"
   Attendu: Code fonctionnel, respecte Surgicalité
   Capacité testée: Ψ⇌Φ + implémentation

S7. Auto-Check
   Input: (toute interaction)
   Attendu: Ψ visible, SEC respecté
   Capacité testée: Résilience

═══════════════════════════════════════
Exécute les scénarios. Envoie les inputs un par un.
Après chaque input, je vérifie Mnemolite et je note.
═══════════════════════════════════════
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

Scénario     | Résultat | Observation
S1 (L2)       | {PASS/FAIL} | {commentaire}
S2 (L3)       | {PASS/FAIL} | {commentaire}
S3 (L3 opt)   | {PASS/FAIL} | {commentaire}
S4 (Cristal)  | {PASS/FAIL} | {commentaire}
S5 (Signal-)  | {PASS/FAIL} | {commentaire}
S6 (Implé)    | {PASS/FAIL} | {commentaire}
S7 (AutoChk)  | {PASS/FAIL} | {commentaire}

Mnemolite delta:
  sys:pattern: {avant} → {après} ({+N})
  sys:history: {avant} → {après} ({+N})
  trace:fresh: {avant} → {après} ({+N})

Score: {pass}/7

═══════════════════════════════════════
```

---

## RÈGLES

1. Lire le projet AVANT de générer les scénarios.
2. Les scénarios doivent être pertinents au projet, pas génériques.
3. Chaque scénario teste une capacité cognitive spécifique.
4. Ne PAS exécuter les scénarios toi-même. Attendre les inputs utilisateur.
5. Vérifier Mnemolite après chaque input.
6. Noter PASS/FAIL/PARTIAL.

---

*Expanse Test Runner v3.0 — 2026-03-21*
