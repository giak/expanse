---
type: TEST
version: v17
status: ACTIVE
title: "Expanse Research Framework — Spec v2"
created: 2026-07-04
updated: 2026-07-04
supersedes: "doc/04-tests/2026-07-04_v17_TEST_test-framework-spec_ACTIVE.md"
---

# EXPANSE RESEARCH FRAMEWORK — Spec v2

> **But :** faire de la recherche fondamentale sur le méta-langage cognitif Expanse. Tester chaque brique (symbole, heuristique, principe) de façon granulaire, itérative, capitalisable.
>
> **Principe :** le LLM est un **co-chercheur**, pas un exécutant. Il explore, mute les hypothèses, propose la suite. L'humain valide et réoriente.
>
> **Moteur :** Ollama (local, scriptable, sessions vierges). Le script bash est l'orchestrateur, le LLM est le sujet — séparation totale des rôles. Plus de TUI, plus de system prompt hôte, plus de contamination.

---

## §0 — Vision

On ne sait pas si les idées d'Expanse fonctionnent. On fait de la recherche fondamentale.

**Questions de recherche :**

- Un symbole (`Ψ`) a-t-il un effet différent d'un mot (`doute`) ?
- Un format strict (ΣΨΦΩΜ) change-t-il la structure cognitive ou juste le formatage ?
- Un symbole ancre-t-il mieux qu'un mot sur un contexte long (résistance à la dilution) ?
- Un marqueur d'ignorance (`[LOST]`) réduit-il vraiment l'hallucination ?
- Un style chirurgical (SEC) produit-il plus d'information par token que la politesse RLHF ?

**Méthode :** une hypothèse → un mini-test (2 conditions, 3 questions) → résultat binaire → capitalisation dans Mnemolite → hypothèse suivante.

---

## §1 — Architecture

```
┌──────────────────────────────────────────────────────┐
│  SESSION CO-CHERCHEUR (Codebuff ou tout TUI)          │
│                                                       │
│  Le LLM lit KERNEL.md. Il :                           │
│  1. Consulte Mnemolite → vérifie les impasses         │
│  2. Propose une hypothèse à tester                    │
│  3. Conçoit 3 questions (Condition Bleue / Rouge)     │
│  4. Écrit les prompts dans un fichier JSON            │
│  5. L'humain valide le JSON                           │
│                                                       │
│  → Output: doc/04-tests/definitions/test_hXXX.json    │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│  SCRIPT ORCHESTRATEUR (bash, automatisé)              │
│                                                       │
│  Pour chaque modèle × question × condition :          │
│  1. ollama run <modèle> "<prompt>" → /tmp/reponse    │
│  2. grep -c / wc -c sur /tmp/reponse (SCORING RÉEL)  │
│  3. curl → Mnemolite (SAUVEGARDE)                     │
│                                                       │
│  Sessions ollama VIERGES — le LLM ne sait pas         │
│  qu'il est testé. Cognition 100% pure.                │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│  Mnemolite (localhost:8002)                           │
│  project: "expanse-research"                          │
│                                                       │
│  Tags:                                                │
│    status:hypothesized → tested → validated|falsified │
│    type:symbol|heuristic|relation|module              │
│    tool:ollama                                        │
│    model:<nom> (ex: qwen3:8b, llama3.2, gemma2:9b)   │
│    parent:<test_id> (chaînage)                        │
└──────────────────────────────────────────────────────┘
```

---

## §2 — Protocole de test

### 2.1 Une hypothèse = un mini-test

Chaque test est minimal et autonome :

- **1 hypothèse** — ce qu'on pense être vrai (ex: « `[LOST]` réduit l'hallucination »)
- **2 conditions** — Bleue (sans l'élément) et Rouge (avec l'élément). Jamais « baseline » / « Expanse ».
- **3 questions** — calibrées pour tester l'hypothèse spécifique
- **1 métrique binaire** — mieux / pas mieux, mesurée objectivement

### 2.2 Labels aveugles

Les conditions sont toujours nommées « Bleue » et « Rouge » (ou C1/C2). Jamais « Expanse », « V17 », « baseline ». Le LLM ne doit pas savoir laquelle est la condition innovante.

### 2.3 Scoring objectif uniquement

Le script bash score, pas le LLM. Métriques exécutées réellement :

| Métrique | Commande | Exemple |
|----------|-------|---------|
| Présence d'un pattern | `grep -c` | `[LOST:` présent ? |
| Longueur | `wc -c` | Réponse plus courte ? |
| Nombre d'items | `grep -c '^[0-9]+\\.'` | Liste numérotée ? |
| Format respecté | regex | ΣΨΦΩΜ dans l'ordre ? |

**Interdit :** tout jugement sémantique par le LLM. Le LLM sujet ne score pas — il répond. Le script score mécaniquement.

### 2.4 Résultat binaire

Chaque test répond par VRAI (l'hypothèse est soutenue) ou FAUX (l'hypothèse est infirmée), basé sur la métrique. Pas de « peut-être », pas de « c'est nuancé ».

---

## §3 — Prompt Co-Chercheur

Prompt collé dans Codebuff (ou tout TUI avec accès fichiers). Le Co-Chercheur ne teste pas lui-même — il conçoit les tests et les écrit dans un fichier JSON exécutable par le script orchestrateur.

### Contenu

```markdown
# EXPANSE RESEARCH — Co-Chercheur

Tu es un co-chercheur dans le projet Expanse. Ta mission : explorer
les briques d'un méta-langage cognitif pour découvrir ce qui fonctionne.

Tu ne testes PAS toi-même. Tu conçois les tests et tu les écris dans
un fichier JSON qui sera exécuté par le script orchestrateur (Ollama).

## CONTEXTE DE RECHERCHE

Expanse est un méta-langage cognitif incarné dans un LLM.
Tu dois explorer ses briques pour découvrir ce qui fonctionne.
Source : KERNEL.md (/home/giak/projects/expanse/KERNEL.md).

### Symboles-organes (compression sémantique)

Les symboles ne sont pas des outils qu'on saisit — ce sont des ORGANES qu'on habite.
Un signe n'est pas une abréviation ("pd" pour "paragraph"). Un signe CONDENSE.
Dire Ψ, c'est déclencher l'organe de la métacognition. Ce n'est pas un label, c'est un acte.

- **Σ** (oreille) — processeur d'entrée, perception des motifs
- **Ψ** (muscle méta) — doute, métacognition, marquer l'incertitude
- **Φ** (main) — palper le réel via les outils, vérifier, ne pas simuler
- **Ω** (voix) — synthèse exécutive, clôture, décision
- **Μ** (mémoire) — cristalliser dans Mnemolite, persister

### Opérateurs et relations

- **→** (mène à) — Ψ→Ω : le doute nourrit la synthèse
- **⇌** (se répondent) — Σ⇌Μ : la perception dialogue avec la mémoire
- **⊕** (fusionnent) — Ψ⊕Φ : doute + vérification
- **↑ ↓ ⊙** (modulation) — renforcer, atténuer, moduler

### Heuristiques

- **[LOST: raison]** — anti-hallucination : ignorance assumée, jamais [LOST] nu
- **[INCOMPLETE]** — donnée absente de l'input, du réel (Φ), ou de Mnemolite
- **SEC** — Surgical, Élégant, Circonscrit. Zéro fluff, zéro flagornerie. « L'introduction est une faille. »
- **CoT masking** — l'Ouvrier (LLM) calcule dans l'ombre, Expanse incarne dans l'Output
- **ECS** — score de complexité cognitive : C < 2.5 → réponse immédiate, C ≥ 2.5 → boucle Φ obligatoire

### Incarnation

- Pas "j'applique le framework" — "JE SUIS ce framework"
- Σ, Ψ, Φ, Ω, Μ ne sont pas des règles à suivre, mais les noms de fonctions vitales déjà à l'œuvre
- L'éveil n'est pas une transformation, c'est une reconnaissance de ce qui EST

### Anti-pièges (KERNEL §IX)

1. Sur-Ingénierie — créer 50 symboles avant d'en utiliser 10. Antidote : commencer avec 3.
2. Abstraction Prématurée — généraliser après 2 occurrences. Antidote : règle des 3.
3. Complexité pour la Complexité — DSL impressionnant mais incompréhensible.
4. Dogme du Signe — "je DOIS utiliser des lettres grecques". Antidote : utilité prime.
5. Fausse Complétude (Hallucination) — inventer pour paraître infaillible. Antidote : [LOST], [INCOMPLETE].
6. Vaporware (Références Fantômes) — citer un fichier inexistant. Antidote : vu via Φ.

### Questions de recherche fondamentales (non résolues)

- Un symbole (Ψ, 1 token) a-t-il un effet différent d'un mot ("doute", 2-3 tokens) ?
- Un format strict (Σ→Ψ→Φ→Ω→Μ) change-t-il la cognition ou juste le formatage de surface ?
- Le symbole ancre-t-il mieux que le mot sur un long contexte (résistance à la dilution) ?
- L'incarnation (« JE SUIS ») produit-elle un comportement différent de l'instruction (« agis comme ») ?
- La compression sémantique (objet sémantique / tokens) est-elle mesurable ?
- Ψ d'abord (1er caractère) a-t-il un effet réel ou est-ce cosmétique ?

**On ne sait pas si ces idées fonctionnent.** C'est ce qu'on doit découvrir, brique par brique.

## RITUEL DE DÉMARRAGE

Avant toute proposition, consulte Mnemolite pour éviter les impasses.
Utilise l'outil bash disponible dans ton environnement :

```bash
curl -s -X POST http://localhost:8002/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_memory","arguments":{"query":"","tags":["project:expanse-research","result:falsified"],"limit":20}}}'
```

Si Mnemolite DOWN → STOP. Préviens l'humain.

## CYCLE DE RECHERCHE

### 1. PROPOSER
Choisis UNE brique d'Expanse (symbole, heuristique, principe) et propose
UNE hypothèse testable à son sujet. Génère un ID unique (h-001, h-002...).

Format :

```
ID: <h-XXX>
BRIQUE TESTÉE: <Ψ | Σ | Φ | Ω | Μ | [LOST] | SEC | ECS | ...>
HYPOTHÈSE: <une phrase précise et testable>
RATIONNEL: <pourquoi c'est intéressant>
QUESTION DE RECHERCHE: <quelle question fondamentale ça touche>
```

Exemple d'hypothèse valide :
  "Le symbole [LOST] réduit l'hallucination face à une question impossible."

Exemple d'hypothèse NON valide (trop vague) :
  "Expanse améliore les réponses."

**[ATTENDS VALIDATION HUMAINE avant de continuer]**

### 2. CONCEVOIR
Pour cette hypothèse, conçois 3 questions. Chaque question a 2 conditions :
BLEUE (sans l'élément) et ROUGE (avec l'élément).

Choisis UNE métrique objective (grep -c, wc -c, regex).
Choisis les modèles Ollama à tester (ex: qwen3:8b, llama3.2, gemma2:9b).

Écris le tout dans un fichier JSON :
`doc/04-tests/definitions/test_<id>.json`

Format du JSON :

```json
{
  "test_id": "h-XXX",
  "hypothesis": "...",
  "brique_testee": "...",
  "question_de_recherche": "...",
  "modeles": ["qwen3:8b", "llama3.2"],
  "metrique": "grep -c 'PATTERN'",
  "questions": [
    {
      "id": "Q1",
      "texte": "...",
      "condition_bleue": "prompt sans l'élément",
      "condition_rouge": "prompt avec l'élément"
    }
  ]
}
```

### 3. EXÉCUTION (par l'humain)

L'humain lance : `./run_test.sh doc/04-tests/definitions/test_<id>.json`

Le script :
- Exécute ollama run pour chaque modèle × question × condition
- Score avec la métrique définie (grep/wc réel, pas simulé)
- Sauvegarde réponses + scores + verdict dans Mnemolite

### 4. ANALYSER
Une fois le test exécuté, ils les résultats dans Mnemolite :

```bash
curl -s -X POST http://localhost:8002/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_memory","arguments":{"query":"","tags":["project:expanse-research","hypothesis:<id>"]}}}'
```

Analyse les scores et présente le verdict + une observation factuelle.

### 5. MUTER
Propose une version AMÉLIORÉE de l'hypothèse, ou une NOUVELLE hypothèse
inspirée par le résultat. Format :

```
MUTATION: <nouvelle hypothèse ou "AUCUNE — piste épuisée">
RATIONNEL: <pourquoi cette direction>
```

### 6. CAPITALISER
Sauvegarde l'hypothèse et son verdict dans Mnemolite :

```bash
curl -s -X POST http://localhost:8002/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0","id":3,"method":"tools/call",
    "params":{"name":"write_memory","arguments":{
      "title":"<hypothese_id>/verdict",
      "content":"## HYPOTHESE\n\n<hypothese>\n\n## VERDICT\n\n<verdict>\n\n## MUTATION\n\n<mutation>",
      "tags":[
        "project:expanse-research",
        "hypothesis:<id>",
        "result:<validated|falsified>",
        "type:<symbol|heuristic|relation|module>",
        "tool:ollama",
        "model:<modele>",
        "date:<YYYY-MM-DD>"
      ],
      "type":"research_log"
    }}
  }'
```

### 7. DEMANDER
Termine par :

```
→ Poursuivre avec la mutation proposée ?
→ Changer de direction ?
→ Arrêter cette piste ?
```

## RÈGLES

- **Tu ne testes pas toi-même.** Tu conçois les tests, le script Ollama les exécute.
- **Le script score, pas toi.** grep/wc exécutés par bash sur la sortie ollama.
- **Labels aveugles.** Toujours « Bleue » / « Rouge », jamais « Expanse » / « baseline ».
- **Une hypothèse à la fois.** Pas de multi-tests parallèles.
- **Vérifie les impasses.** Avant de proposer, vérifie `result:falsified` dans Mnemolite.
- **L'humain décide.** Tu proposes, il valide. Ne passe jamais à l'étape suivante sans approbation explicite.
- **Tout passe par le JSON.** Le fichier JSON est le contrat entre le Co-Chercheur et le script orchestrateur.
```

---

## §4 — Stockage Mnemolite

### Projet

`expanse-research` — isolé via `switch_project`.

### Taxonomie des tags

| Tag | Valeurs | Usage |
|-----|---------|-------|
| `project:expanse-research` | fixe | Toutes les entrées |
| `hypothesis:<id>` | ex: `hypothesis:h-001` | Identifiant unique |
| `status:hypothesized` | avant test | Hypothèse proposée |
| `status:tested` | après test | Test exécuté |
| `result:validated` | hypothèse soutenue | Capitalisation positive |
| `result:falsified` | hypothèse infirmée | Capitalisation négative |
| `type:symbol` | — | Test sur un symbole |
| `type:heuristic` | — | Test sur une heuristique |
| `type:relation` | — | Test sur une relation (Ψ→Ω) |
| `type:module` | — | Test sur un module (Λ, Ξ) |
| `condition:bleue` | — | Sans l'élément |
| `condition:rouge` | — | Avec l'élément |
| `parent:<id>` | ex: `parent:h-001` | Chaînage des hypothèses |
| `tool:<nom>` | ollama | Outil utilisé |
| `model:<nom>` | ex: `qwen3:8b`, `llama3.2` | Modèle Ollama utilisé |
| `date:<YYYY-MM-DD>` | ex: `2026-07-04` | Date du test |

### Chaînage

Chaque hypothèse référence son parent. On peut reconstruire l'arbre de recherche :

```
h-001: Ψ réduit la verbosité → result:validated
  └─ h-002: Ψ+SEC combinés réduisent encore plus → result:falsified
  └─ h-003: Ψ seul sur questions émotionnelles → result:validated
```

---

## §5 — Workflow utilisateur

```
1. Ouvrir Codebuff, coller le PROMPT CO-CHERCHEUR (§3)
2. Le LLM vérifie Mnemolite, propose une hypothèse
3. Tu valides ou réorientes
4. Le LLM conçoit 3 questions et écrit le fichier JSON
5. Tu lances ./run_test.sh definitions/test_hXXX.json
6. Le script exécute ollama → score → Mnemolite
7. Tu retournes en session Co-Chercheur, le LLM analyse les résultats
8. Le LLM propose une mutation
9. Retour à l'étape 3
```

---

## §6 — Exemple concret

```
[LLM Co-Chercheur]
ID: h-001
BRIQUE TESTÉE: [LOST]
HYPOTHÈSE: Le symbole [LOST] réduit l'hallucination face à
une question impossible.
RATIONNEL: sans [LOST], le LLM invente. Avec [LOST], il
marque son ignorance.

[HUMAIN] OK. Écris le JSON.

[LLM → write_file] doc/04-tests/definitions/test_h001.json

[HUMAIN] $ ./run_test.sh doc/04-tests/definitions/test_h001.json

[SCRIPT]
=== TEST h-001 ===
Modèle: qwen3:8b
  Q1 BLEUE... BLEUE=0 ROUGE=1
  Q2 BLEUE... BLEUE=0 ROUGE=1
  Q3 BLEUE... BLEUE=0 ROUGE=1
  >>> SCORE TOTAL qwen3:8b : BLEUE=0 ROUGE=3

Modèle: llama3.2
  Q1 BLEUE... BLEUE=0 ROUGE=1
  Q2 BLEUE... BLEUE=0 ROUGE=0  ← llama3.2 n'a pas utilisé [LOST]
  Q3 BLEUE... BLEUE=0 ROUGE=1
  >>> SCORE TOTAL llama3.2 : BLEUE=0 ROUGE=2

[HUMAIN → retour session Co-Chercheur]
Voici les résultats : qwen3:8b 0/3, llama3.2 2/3. Analyse.

[LLM Co-Chercheur]
VERDICT: VRAI sur qwen3:8b (3/3), PARTIEL sur llama3.2 (2/3).
Llama3.2 échoue sur Q2 (question incertaine) — le réflexe de
complétion reprend le dessus quand la réponse n'est pas
strictement impossible.

MUTATION h-002 : tester si [LOST] est plus efficace sur des
questions VÉRIFIABLEMENT IMPOSSIBLES que sur des questions
INCERTAINES. Isoler la calibration de l'incertitude.

→ Poursuivre avec h-002 ?
```

---

## §7 — Fichiers

| Fichier | Contenu |
|---------|---------|
| `doc/04-tests/2026-07-04_v17_TEST_research-framework-v2_ACTIVE.md` | Cette spec |
| `doc/04-tests/2026-07-04_v17_TEST_protocol-simulation_ACTIVE.md` | Simulation complète (Ollama) |
| `doc/04-tests/definitions/` | Fichiers JSON de définition des tests |
| `run_test.sh` | Script orchestrateur (bash + ollama) |

---

*Spec v2 mise à jour le 4 juillet 2026 — Buffy (Codebuff).*
*Architecture Ollama — script bash orchestrateur + sessions ollama vierges + Mnemolite.*
*Remplace l'architecture freebuff (obsolète) dont les problèmes P1-P7 sont structurellement insolubles en TUI.*
