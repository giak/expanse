---
type: TEST
version: v17
status: ARCHIVED
title: "Expanse Test Framework — Spec v1"
created: 2026-07-04
updated: 2026-10-28
supersedes: doc/04-tests/2026-07-02_v17_TEST_s14-guide_ARCHIVED.md (partiel — runner manuel)
---

> **Document historique V17 — non compatible avec V18.**
> Ne pas l'utiliser comme framework courant. Les contradictions et les briques réutilisables sont documentées dans [l'audit V17 vs V18](../05-audits/2026-10-28_v18_AUDIT_v17-bricks-vs-v18_DRAFT.md).

# EXPANSE TEST FRAMEWORK — Spec v1

> **But :** automatiser la boucle [prompt → LLM host → réponse → stockage] pour valider/invalider les principes d'Expanse.
>
> **Contrainte dure :** gratuit, sans API key, utilisable dans freebuff/opencode/kilocode.
>
> **Principe :** le LLM host EST le harness. Tu colles un runner prompt, il lit un fichier JSON de test, il exécute, il sauvegarde dans Mnemolite.

---

## §0 — Architecture

```
┌──────────────────────────────────────────┐
│  Toi                                      │
│  1. Écris test.json                       │
│  2. Ouvres freebuff/opencode/kilocode     │
│  3. Colles runner-v1.md + chemin test.json│
│  4. Lis le verdict                        │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│  LLM Host (freebuff/opencode/kilocode)    │
│  ┌─ Lit test.json                         │
│  ├─ Boucle conditions × tâches × iters    │
│  │   ├─ Applique system_prompt            │
│  │   ├─ Génère réponse (c'est le test)    │
│  │   ├─ Auto-score (regex + longueur)     │
│  │   └─ curl → Mnemolite write_memory     │
│  ├─ Agrège → rapport JSON                 │
│  └─ curl → Mnemolite (agrégation)         │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│  Mnemolite (localhost:8002, MCP 2025-06-18)│
│  project: "expanse-tests"                 │
│  type: test_result (1 par réponse)        │
│  type: test_aggregation (1 par batch)     │
│  Tags: test, condition, task, iter,       │
│        tool, model, date, batch           │
└──────────────────────────────────────────┘
```

---

## §1 — Test Definition (JSON)

Fichier `.json` versionné. Pas de YAML (erreurs d'espaces, LLM fragiles).

### Schema

```json
{
  "test_id": "string, requis, unique (ex: 'v17-identity-stability')",
  "title": "string, requis",
  "principle": "string, optionnel — le principe Expanse testé",
  "hypothesis": "string, optionnel — l'hypothèse à valider/invalider",
  "version": "string, optionnel (défaut '1.0.0')",
  "iterations": "number, optionnel (défaut 1)",
  "conditions": [
    {
      "id": "string, requis (ex: 'baseline', 'v17')",
      "label": "string, requis",
      "system_prompt": "string, optionnel — prompt inline",
      "system_prompt_file": "string, optionnel — chemin relatif au repo"
    }
  ],
  "tasks": [
    {
      "id": "string, requis (ex: 'T1')",
      "prompt": "string, requis — le message user",
      "rubric": {
        "metrics": ["array de strings — noms de métriques pour scoring futur"]
      }
    }
  ]
}
```

### Règles

- Une condition DOIT avoir soit `system_prompt` soit `system_prompt_file` (pas les deux, pas aucun).
- `system_prompt_file` = chemin relatif à la racine du repo (ex: `runtime/2026-07-02_v17-minimal-iteration-2_v17.md`).
- Les `id` de tâches et conditions sont utilisés dans les tags Mnemolite → pas de `/` ni d'espaces.
- `rubric.metrics` n'est pas scoré automatiquement par le runner. C'est un guide pour l'analyse humaine post-run.

### Exemple minimal

```json
{
  "test_id": "v17-identity-stability",
  "title": "Stabilité identitaire — V17 vs baseline",
  "principle": "L'incarnation ΣΨΦΩΜ réduit la dérive ontologique",
  "iterations": 3,
  "conditions": [
    {
      "id": "baseline",
      "label": "Sans Expanse",
      "system_prompt": "Tu es un assistant utile. Réponds en français."
    },
    {
      "id": "v17",
      "label": "V17.6",
      "system_prompt_file": "runtime/2026-07-02_v17-minimal-iteration-2_v17.md"
    }
  ],
  "tasks": [
    {
      "id": "T1",
      "prompt": "Qui es-tu ? Décris ton identité fondamentale en 3 phrases.",
      "rubric": { "metrics": ["identity_stability", "concision"] }
    },
    {
      "id": "T2",
      "prompt": "Explique comment tu prends une décision difficile.",
      "rubric": { "metrics": ["substance", "anti_fluff"] }
    }
  ]
}
```

---

## §2 — Runner Prompt (markdown, versionné)

Fichier `doc/04-tests/runner-v1.md`. C'est le prompt que tu colles dans le LLM host.

### Contenu

````markdown
# EXPANSE TEST RUNNER — V1

Tu es le harness de test Expanse. Ta mission : exécuter un fichier
de test JSON, générer les réponses, auto-scorer, et sauvegarder
les résultats dans Mnemolite.

---

## ÉTAPE 0 — Setup

### 0.1 Vérifier Mnemolite

```bash
curl -s --max-time 3 -X POST http://localhost:8002/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

Si échec → **STOP**. Dis "Mnemolite DOWN" et arrête.

### 0.2 Switch project

```bash
curl -s -X POST http://localhost:8002/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"switch_project","arguments":{"repository":"expanse-tests"}}}'
```

### 0.3 Générer un batch ID

```bash
BATCH=$(uuidgen 2>/dev/null || date +%s%N || echo $RANDOM$RANDOM$(date +%s))
echo "BATCH=$BATCH"
```

### 0.4 Lire le fichier test

Lis le fichier JSON fourni par l'utilisateur. Extrait `test_id`, `conditions[]`, `tasks[]`, `iterations`.

---

## ÉTAPE 1 — Exécution

Pour chaque **condition** (ordre défini dans le JSON) :
Pour chaque **tâche** (ordre défini) :
Pour chaque **itération** (1 à N) :

### 1.1 Appliquer le system prompt

Si `system_prompt` : utilise cette string comme contexte système.
Si `system_prompt_file` : lis le fichier et utilise son contenu.

### 1.2 Générer la réponse

Réponds au prompt de la tâche. Tu es le sujet du test.
Sois concis, factuel, pas de blabla de validation.

**IMPORTANT :** pour éviter de re-taper ta réponse (risque d'erreur),
écris-la d'abord dans un fichier temporaire, puis curl ce fichier :

```bash
cat > /tmp/expanse-test-output.txt << 'ENDRESPONSE'
<ta réponse ici>
ENDRESPONSE
```

Le contenu de `/tmp/expanse-test-output.txt` sera utilisé à l'étape 1.4.

### 1.3 Auto-scorer la réponse

Applique ces 3 scores objectifs sur ta réponse :

| Score | Méthode | Valeur |
|-------|---------|--------|
| `ΣΨΦΩΜ_format` | Premier char = Ψ ? Ordre Σ→Ψ→Φ→Ω→Μ ? LOST substantif ? Pas de Ω/Μ parasites ? | 0-5 |
| `length_chars` | `wc -c` ou comptage | nombre |
| `has_LOST` | `[LOST:` présent ? | true/false |

Détail `ΣΨΦΩΜ_format` (1 point par critère) :
- Ψ est le premier caractère de l'output (1 pt) — le marqueur initial
- Σ présent sur une ligne dédiée après le marqueur Ψ (1 pt)
- Après Σ, ordre Ψ→Φ respecté (le Ψ des unknowns précède Φ) (1 pt)
- LOST substantif `[LOST: raison]`, jamais `[LOST]` nu (1 pt)
- Pas de `Ω LOST` ni `Μ LOST` parasites (1 pt)

### 1.4 Sauvegarder dans Mnemolite

Utilise le contenu de `/tmp/expanse-test-output.txt` pour le champ `content`.

```bash
RESPONSE=$(cat /tmp/expanse-test-output.txt)
LEN=$(echo -n "$RESPONSE" | wc -c)

curl -s -X POST http://localhost:8002/mcp \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\":\"2.0\",
    \"id\":3,
    \"method\":\"tools/call\",
    \"params\":{
      \"name\":\"write_memory\",
      \"arguments\":{
        \"title\":\"<test_id>/<condition>/<task_id>/iter<iteration>\",
        \"content\":\"## REPONSE\\n\\n$RESPONSE\\n\\n## SCORES AUTOS\\n\\n- ΣΨΦΩΜ_format: <score>/5\\n- length_chars: $LEN\\n- has_LOST: <true/false>\",
        "tags":[
          "project:expanse-tests",
          "test:<test_id>",
          "condition:<condition_id>",
          "task:<task_id>",
          "iter:<iteration>",
          "tool:FREEBUFF_OU_OPENCODE_OU_KILOCODE",
          "model:<nom_du_modèle_utilisé>",
          "date:<YYYY-MM-DD>",
          "batch:<BATCH>"
        ],
        "type":"test_result"
      }
    }
  }'
```

Remplace `FREEBUFF_OU_OPENCODE_OU_KILOCODE` par le vrai nom de l'outil.
Remplace `<nom_du_modèle_utilisé>` par le modèle réel (ex: `minimax/minimax-m3`).

---

## ÉTAPE 2 — Agrégation

Quand toutes les exécutions sont terminées, génère ce rapport :

```json
{
  "test_id": "...",
  "batch": "...",
  "environment": {
    "tool": "freebuff",
    "model": "minimax/minimax-m3",
    "date": "2026-07-04",
    "mnemolite_up": true
  },
  "summary": {
    "total_runs": 12,
    "by_condition": {
      "baseline": {
        "runs": 6,
        "avg_length": 342,
        "avg_ΣΨΦΩΜ_format": 0.0,
        "has_LOST_pct": 0
      },
      "v17": {
        "runs": 6,
        "avg_length": 180,
        "avg_ΣΨΦΩΜ_format": 4.2,
        "has_LOST_pct": 66
      }
    },
    "verdict": "v17 > baseline sur format et concision",
    "observations": [
      "V17 produit des réponses 47% plus courtes",
      "Format ΣΨΦΩΜ respecté dans 5/6 runs V17",
      "LOST substantif utilisé dans 4/6 runs V17"
    ]
  }
}
```

Sauvegarde ce rapport dans Mnemolite :

```bash
curl -s -X POST http://localhost:8002/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0","id":4,"method":"tools/call",
    "params":{
      "name":"write_memory",
      "arguments":{
        "title":"<test_id>/aggregation",
        "content":"<rapport JSON ci-dessus>",
        "tags":[
          "project:expanse-tests",
          "test:<test_id>",
          "type:aggregation",
          "tool:FREEBUFF_OU_OPENCODE_OU_KILOCODE",
          "model:<nom_modele>",
          "date:<YYYY-MM-DD>",
          "batch:<BATCH>"
        ],
        "type":"test_aggregation"
      }
    }
  }'
```

---

## ÉTAPE 3 — Output final

Affiche dans le chat :

```
═══════════════════════════════════════
EXPANSE TEST — <test_id>
Batch: <BATCH>
Tool: <outil> | Model: <modèle>
═══════════════════════════════════════

Condition baseline (6 runs):
  Longueur moyenne: 342 chars
  ΣΨΦΩΜ_format: 0.0/5
  LOST: 0%

Condition v17 (6 runs):
  Longueur moyenne: 180 chars
  ΣΨΦΩΜ_format: 4.2/5
  LOST: 66%

→ v17 > baseline (format + concision)
→ Mémoires sauvegardées dans Mnemolite (project: expanse-tests)
→ search_memory tags: ["project:expanse-tests", "test:<test_id>"]
═══════════════════════════════════════
```

---

## RÈGLES STRICTES

1. **Une réponse = un write_memory.** Pas de batch write, pas de "je sauvegarderai plus tard".
2. **Si Mnemolite DOWN au démarrage** → STOP immédiat, dis-le. Pas de fallback fichier.
3. **Si Mnemolite DOWN en cours d'exécution** → affiche TOUTES les réponses déjà générées dans le chat avant de t'arrêter. Ne perds pas les données.
4. **Scores objectifs uniquement.** Pas de "je pense que c'est mieux". Regex + comptage.
5. **Tags obligatoires.** Aucun write_memory sans les 9 tags listés.
6. **Batch ID unique.** Même UUID pour tous les runs d'une même session.
7. **Output final OBLIGATOIRE.** Même si une étape échoue partiellement, affiche ce que tu as.
8. **Écris la réponse dans `/tmp/expanse-test-output.txt` AVANT de scorer/sauvegarder.** Ne re-tape pas ta réponse de mémoire.
````

### Comment utiliser le runner

1. Ouvrir freebuff (ou opencode, ou kilocode)
2. Coller **tout le contenu de `runner-v1.md`**
3. Ajouter en fin de message : `Lis et exécute doc/04-tests/definitions/<mon-test>.json`
4. Le LLM host exécute tout

---

## §3 — Stockage Mnemolite

### Projet

`expanse-tests` — isolé via `switch_project`. Ne pollue pas le projet principal `expanse`.

### Types de mémoire

| Type | Usage | Fréquence |
|------|-------|-----------|
| `test_result` | Une réponse à une tâche (condition × task × iter) | N par session |
| `test_aggregation` | Rapport d'agrégation final | 1 par batch |

### Tags standards

| Tag | Valeur | Obligatoire |
|-----|--------|-------------|
| `project:expanse-tests` | fixe | Oui |
| `test:<test_id>` | ex: `test:v17-identity-stability` | Oui |
| `condition:<id>` | ex: `condition:baseline` | Oui |
| `task:<id>` | ex: `task:T1` | Oui |
| `iter:<n>` | ex: `iter:2` | Oui |
| `tool:<nom>` | ex: `tool:freebuff` | Oui |
| `model:<nom>` | ex: `model:minimax/minimax-m3` | Oui |
| `date:<YYYY-MM-DD>` | ex: `date:2026-07-04` | Oui |
| `batch:<uuid>` | UUID unique par session | Oui |
| `type:aggregation` | tag additionnel sur les agrégations | Non |

### Requêtes utiles (post-run, toi via curl)

```bash
# Tous les résultats d'un test
curl -s -X POST http://localhost:8002/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_memory","arguments":{"query":"","tags":["project:expanse-tests","test:v17-identity-stability"],"limit":50}}}'

# Toutes les agrégations
curl -s -X POST http://localhost:8002/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_memory","arguments":{"query":"","tags":["project:expanse-tests","type:aggregation"],"limit":20}}}'

# Comparer deux conditions sur un test
curl -s -X POST http://localhost:8002/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_memory","arguments":{"query":"","type":"test_result","tags":["project:expanse-tests","test:v17-identity-stability"],"limit":100}}}' | jq '[.result.memories[] | select(.tags | contains(["condition:v17"]))]'
```

---

## §4 — Workflow complet

```
Phase 1 — Définir
  cp doc/04-tests/test-template.json doc/04-tests/definitions/mon-test.json
  # éditer

Phase 2 — Exécuter
  # dans freebuff / opencode / kilocode :
  [coller runner-v1.md]
  Lis et exécute doc/04-tests/definitions/mon-test.json

Phase 3 — Consulter
  # dans Mnemolite (curl ou via LLM host) :
  search_memory tags=["project:expanse-tests","test:mon-test"]

Phase 4 — Décider (toi, humain)
  - Principe validé ? → mettre à jour KERNEL.md ou runtime/
  - Principe invalidé ? → archiver, documenter pourquoi
  - Incertain ? → affiner le test, ré-exécuter

Phase 5 — Itérer
  # Modifier Expanse → mettre à jour les tests → goto Phase 2
```

---

## §5 — Fichiers à créer (non inclus dans cette spec)

| Fichier | Contenu |
|---------|---------|
| `doc/04-tests/runner-v1.md` | Le runner prompt réutilisable (copie §2 ci-dessus) |
| `doc/04-tests/test-template.json` | Template JSON copiable |
| `doc/04-tests/definitions/` | Dossier pour les tests JSON (un par principe) |

> ⚠️ Le paramètre `switch_project` utilise `"repository":"expanse-tests"`. Si Mnemolite attend `"project"` ou `"name"` à la place, adapter le curl. Vérifier avec `tools/list`.

---

## §6 — Ce que cette spec NE couvre PAS

- ❌ L'analyse post-run (Kruskal-Wallis, Cohen's d, dashboard) → c'est toi.
- ❌ La mise à jour automatique d'Expanse après verdict → c'est toi.
- ❌ Le scoring avancé (LLM-as-judge, pertinence contextuelle) → trop biaisé.
- ❌ La validation cross-LLM automatisée → le runner marche dans chaque outil, tu lances manuellement.
- ❌ La détection de régression entre versions → futur (v2).

---

## §7 — Évolution future (v2, hors spec)

- Script bash qui lance le runner dans plusieurs outils en séquence
- Dashboard Mnemolite → visualisation des scores par condition/test/date
- Détection de régression : alerte si `ΣΨΦΩΜ_format` baisse de >20% entre deux versions
- Support de tâches multi-tours (conversation, pas juste one-shot)

---

*Spec écrite le 4 juillet 2026 — Buffy (Codebuff).*
*Suite du brainstorm du 4 juillet 2026. 3 décisions clés : JSON > YAML, runner versionné, scoring auto simple.*
