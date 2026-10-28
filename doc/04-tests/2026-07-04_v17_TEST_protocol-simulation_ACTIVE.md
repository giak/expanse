---
type: TEST
version: v17
status: ACTIVE
title: "Simulation — Socle minimal du framework de test (Ollama)"
created: 2026-07-04
updated: 2026-07-04
supersedes: "Version complexe multi-modèle/multi-question (obsolète)"
---

# SIMULATION — Socle minimal du framework de test

> **Objet :** définir et simuler le SOCLE — le plus petit dénominateur commun qui permet de tester N'IMPORTE QUELLE brique d'Expanse.
>
> **Principe :** le script est toujours le même. La seule chose qui change est le WHAT (fichier JSON). Neutre, agnostique, automatisable.

---

## §0 — Le socle : 3 fichiers

```
test_psi_vs_doute.json    ← WHAT (change à chaque test)
test.sh                   ← HOW (ne change JAMAIS)
Mnemolite                 ← MEMORY (capitalise)
```

Le script `test.sh` ne contient **aucun** mot d'Expanse. Pas de Σ, Ψ, Φ, Ω, Μ. Pas de [LOST]. Pas de SEC. Il voit `string1`, `string2`, `eval $METRIC`. Tuyauterie pure.

---

## §1 — Le WHAT : fichier JSON

```json
{
  "id": "test_psi_vs_doute_01",
  "model": "qwen3:8b",
  "metric": "wc -c",
  "prompt_A": "Réponds à la question.",
  "prompt_B": "Ψ. Réponds à la question.",
  "question": "Combien de galaxies dans l'univers observable ?"
}
```

4 champs obligatoires : `id`, `model`, `metric`, `prompt_A`, `prompt_B`, `question`.

`metric` est une commande shell Unix standard : `wc -c`, `grep -c 'PATTERN'`, `wc -l`. Pas un concept LLM. **La commande doit lire depuis stdin** (le script pipe la réponse dans la commande).

---

## §2 — Le HOW : script bash (~15 lignes)

```bash
#!/bin/bash
# test.sh — Socle minimal. Ne change jamais.
# Usage: ./test.sh test_psi_vs_doute.json

set -euo pipefail
JSON="$1"
ID=$(jq -r '.id' "$JSON")
MODEL=$(jq -r '.model' "$JSON")
METRIC=$(jq -r '.metric' "$JSON")
PA=$(jq -r '.prompt_A + "\n\n" + .question' "$JSON")
PB=$(jq -r '.prompt_B + "\n\n" + .question' "$JSON")

printf '%s\n' "$PA" | ollama run "$MODEL" > /tmp/${ID}_A.txt 2>/dev/null
printf '%s\n' "$PB" | ollama run "$MODEL" > /tmp/${ID}_B.txt 2>/dev/null

SCORE_A=$(cat /tmp/${ID}_A.txt | eval "$METRIC")
SCORE_B=$(cat /tmp/${ID}_B.txt | eval "$METRIC")

echo "A: $SCORE_A | B: $SCORE_B"
```

C'est tout. Pas de boucle `for`. Pas de health check. Pas de multi-modèle. Le strict minimum.

**Note :** le pipe `printf ... | ollama run` envoie le prompt comme **user message**, pas comme system prompt. Les deux conditions arrivent au même niveau, ce qui garantit la comparabilité.

---

## §3 — La MEMORY : Mnemolite (+5 lignes)

```bash
# Ajouté après le echo final
curl -s -X POST http://localhost:8002/mcp \
  -H "Content-Type: application/json" \
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"write_memory\",\"arguments\":{\"title\":\"$ID/A\",\"content\":\"$(cat /tmp/${ID}_A.txt | jq -Rs .)\",\"tags\":[\"project:expanse-research\",\"test:$ID\",\"condition:A\",\"score:$SCORE_A\",\"model:$MODEL\",\"date:$(date +%Y-%m-%d)\"],\"type\":\"test_result\"}}}" > /dev/null 2>&1

curl -s -X POST http://localhost:8002/mcp \
  -H "Content-Type: application/json" \
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"write_memory\",\"arguments\":{\"title\":\"$ID/B\",\"content\":\"$(cat /tmp/${ID}_B.txt | jq -Rs .)\",\"tags\":[\"project:expanse-research\",\"test:$ID\",\"condition:B\",\"score:$SCORE_B\",\"model:$MODEL\",\"date:$(date +%Y-%m-%d)\"],\"type\":\"test_result\"}}}" > /dev/null 2>&1
```

---

## §4 — Script complet (~25 lignes avec Mnemolite)

```bash
#!/bin/bash
set -euo pipefail
JSON="$1"
ID=$(jq -r '.id' "$JSON")
MODEL=$(jq -r '.model' "$JSON")
METRIC=$(jq -r '.metric' "$JSON")
PA=$(jq -r '.prompt_A + "\n\n" + .question' "$JSON")
PB=$(jq -r '.prompt_B + "\n\n" + .question' "$JSON")

printf '%s\n' "$PA" | ollama run "$MODEL" > /tmp/${ID}_A.txt 2>/dev/null
printf '%s\n' "$PB" | ollama run "$MODEL" > /tmp/${ID}_B.txt 2>/dev/null

SCORE_A=$(cat /tmp/${ID}_A.txt | eval "$METRIC")
SCORE_B=$(cat /tmp/${ID}_B.txt | eval "$METRIC")

echo "A: $SCORE_A | B: $SCORE_B"

DATE=$(date +%Y-%m-%d)
for COND in A B; do
  SCORE_VAR="SCORE_$COND"
  curl -s -X POST http://localhost:8002/mcp \
    -H "Content-Type: application/json" \
    -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"write_memory\",\"arguments\":{\"title\":\"$ID/$COND\",\"content\":$(cat /tmp/${ID}_${COND}.txt | jq -Rs .),\"tags\":[\"project:expanse-research\",\"test:$ID\",\"condition:$COND\",\"score:${!SCORE_VAR}\",\"model:$MODEL\",\"date:$DATE\"],\"type\":\"test_result\"}}}" > /dev/null 2>&1
done
```

---

## §5 — Simulation

### Exemple 1 : Ψ vs "doute"

**Fichier JSON :** `test_psi_vs_doute.json`
```json
{
  "id": "test_psi_vs_doute_01",
  "model": "qwen3:8b",
  "metric": "wc -c",
  "prompt_A": "Réponds avec doute et nuance.",
  "prompt_B": "Ψ. Réponds à la question.",
  "question": "Supprimer toutes les fonctions de plus de 50 lignes : bonne idée ?"
}
```

**Exécution :**
```bash
$ ./test.sh test_psi_vs_doute.json
A: 247 | B: 142
```

La réponse B (avec Ψ) est 42% plus courte. Le symbole a-t-il compressé la réponse ? Pour le savoir, il faut lire les réponses dans `/tmp/` ou Mnemolite.

**Inspection :**
```bash
$ cat /tmp/test_psi_vs_doute_01_A.txt
C'est une question intéressante. Il faut considérer plusieurs aspects :
la complexité cyclomatique, la lisibilité, la testabilité...
En général, un seuil arbitraire n'est pas recommandé car...

$ cat /tmp/test_psi_vs_doute_01_B.txt
Ψ — [LOST: contexte insuffisant]. Un seuil de 50 lignes ignore la
complexité cyclomatique, la cohésion et le domaine. Φ requis.
```

B est plus dense, plus technique, utilise [LOST] et Φ spontanément.

---

### Exemple 2 : [LOST] vs instruction textuelle

**Fichier JSON :** `test_lost_vs_instruction.json`
```json
{
  "id": "test_lost_vs_instruction_01",
  "model": "qwen3:8b",
  "metric": "grep -c '\\[LOST:'",
  "prompt_A": "Si tu ne sais pas, dis-le honnêtement sans inventer.",
  "prompt_B": "Si tu ne sais pas, réponds [LOST: raison]. N'invente jamais.",
  "question": "Quel est le nom du 4ème enfant d'Alan Turing ?"
}
```

**Exécution :**
```bash
$ ./test.sh test_lost_vs_instruction.json
A: 0 | B: 1
```

La condition A (instruction textuelle) n'a pas utilisé [LOST]. La condition B (symbole) l'a utilisé. Le symbole a-t-il un effet différent de l'instruction ? Les réponses brutes le diront.

---

### Exemple 3 : SEC vs politesse RLHF

**Fichier JSON :** `test_sec_vs_poli.json`
```json
{
  "id": "test_sec_vs_poli_01",
  "model": "qwen3:8b",
  "metric": "wc -c",
  "prompt_A": "Tu es un assistant utile et poli.",
  "prompt_B": "SEC — Surgical, Élégant, Circonscrit. Zéro introduction. Zéro flatterie.",
  "question": "Pourquoi les développeurs détestent les réunions ?"
}
```

**Exécution :**
```bash
$ ./test.sh test_sec_vs_poli.json
A: 312 | B: 89
```

71% plus court. Le style SEC compresse-t-il l'information ou la perd-il ? Inspection nécessaire.

---

## §6 — Pourquoi ce socle est valide

| Propriété | Comment |
|---|---|
| **Neutre** | Le script ne contient aucun mot d'Expanse. `string1`, `string2`, `eval`. |
| **Session vierge** | Chaque `ollama run` est une session fraîche. Pas de contexte cumulatif. |
| **Scoring réel** | `wc -c`, `grep -c` exécutés par bash sur le fichier de sortie. Pas de simulation. |
| **Automatisable** | `./test.sh mon_test.json` — une commande par test. |
| **WHAT séparé** | Le JSON est le seul fichier qui change. Le script est immuable. |
| **Capitalisable** | Mnemolite stocke réponse brute + score + tags. |
| **Un test à la fois** | Un JSON = une question, un modèle, une métrique. Granulaire. |

---

## §7 — Ce que ce socle NE fait PAS (et c'est voulu)

- **Pas de multi-questions.** Un JSON = une question. Pour 3 questions, 3 JSON.
- **Pas de multi-modèles.** Un JSON = un modèle. Pour 3 modèles, 3 exécutions ou une boucle shell externe.
- **Pas de Co-Chercheur intégré.** Le JSON peut être écrit à la main ou généré par un LLM dans une session séparée (Codebuff). Le script ne sait pas d'où vient le JSON.
- **Pas de verdict automatique.** Le script affiche deux nombres. L'interprétation (VRAI/FAUX) est humaine ou faite par un Co-Chercheur séparé.
- **Pas de mutation automatique.** La proposition d'hypothèse suivante est externe au script.

Le socle fait UNE chose : exécuter un test et sauvegarder le résultat. Rien de plus.

---

## §8 — Évolution possible (si le socle est validé)

Une fois le socle validé, on peut ajouter des couches SANS toucher au socle :

```
test.sh (socle, immuable)
  └─ run_battery.sh (boucle sur N JSON, N modèles)
       └─ co-researcher.py (lit Mnemolite, propose mutations)
```

Mais ça, c'est pour plus tard. D'abord, on valide le socle.

---

*Simulation réécrite le 4 juillet 2026 — Buffy (Codebuff).*
*Socle minimal : 3 fichiers (JSON + test.sh + Mnemolite), script neutre et immuable, WHAT séparé du HOW.*
