# Rapport : Mnemo CLI — Wrapper REST pour MnemoLite

**Date :** 2026-03-23
**Auteur :** opencode (auto-généré)
**Statut :** Implémenté, testé, fonctionnel

---

## 1. Contexte & Problématique

MnemoLite expose une API REST FastAPI sur `http://127.0.0.1:8001` et un serveur MCP (Model Context Protocol) via `docker exec`. Le runtime V15 d'Expanse utilise le MCP pour interroger Mnemolite (recherche mémoire, écriture, mise à jour).

**Problème :** Le MCP consomme plus de tokens et ajoute de la latence :
- Overhead protocole MCP (JSON-RPC framing)
- `docker exec` pour chaque appel (~93ms)
- Démarrage Python (~42ms)
- Aucune possibilité de filtrer la réponse (le JSON complet entre dans le contexte LLM)

**Objectif :** Créer un CLI bash (`mnemo`) qui appelle directement l'API REST via `curl + jq`, compatible avec tous les patterns V15.

---

## 2. Implémentation

### 2.1 Fichiers modifiés/créés

| Fichier | Action | Description |
|---------|--------|-------------|
| `api/routes/memories_routes.py` | MODIFY | Ajout endpoint `POST /api/v1/memories` (write) |
| `api/routes/memories_routes.py` | MODIFY | Ajout paramètre `tags` à `POST /api/v1/memories/search` |
| `api/routes/memories_routes.py` | MODIFY | Ajout endpoint `PUT /api/v1/memories/{id}` (update) |
| `api/routes/memories_routes.py` | MODIFY | Ajout endpoint `DELETE /api/v1/memories/{id}` (delete) |
| `scripts/mnemo.sh` | CREATE | CLI bash complet (search, write, get, update, delete, stats) |

### 2.2 Endpoints REST ajoutés

```
POST   /api/v1/memories          → Créer une mémoire (avec embedding auto)
PUT    /api/v1/memories/{id}     → Mettre à jour une mémoire (partiel)
DELETE /api/v1/memories/{id}     → Supprimer (?permanent=true pour hard delete)
```

Paramètre ajouté à l'existant :
```
POST   /api/v1/memories/search   → Ajout du champ "tags" (filtrage AND)
```

### 2.3 Commandes CLI

```bash
mnemo search <query> [--type TYPE] [--tags t1,t2] [--limit N] [--format json|table]
mnemo write  <title> <content> [--type TYPE] [--tags t1,t2] [--author NAME]
mnemo get    <memory_id> [--format json|table]
mnemo update <id> [--title T] [--content C] [--type TYPE] [--tags t1,t2]
mnemo delete <id> [--permanent]
mnemo stats
```

### 2.4 Dépendances

- `curl` (natif)
- `jq` (natif)
- Variable d'environnement `MNEMO_API` (défaut: `http://127.0.0.1:8001`)

---

## 3. Tests

### 3.1 CRUD complet

| Opération | Commande | Status | Latence |
|-----------|----------|--------|---------|
| **Create** | `mnemo write "Test" "Content" --type note --tags test` | ✅ | ~5200ms |
| **Read** | `mnemo get <uuid>` | ✅ | ~18ms |
| **Update** | `mnemo update <uuid> --tags updated,v15` | ✅ | ~200ms |
| **Delete (soft)** | `mnemo delete <uuid>` | ✅ | ~50ms |
| **Get après delete** | `mnemo get <uuid>` (attendu: 404) | ✅ 404 | ~18ms |

### 3.2 Search avec tags (V15 boot sequence)

| Recherche | Tags | Résultats | Status |
|-----------|------|-----------|--------|
| `search "sys:core"` | `sys:core,sys:anchor` | 3 (V14_CORE_AXIOMS, Ω_RECURSION_V2, Ω_INERTIA_PROTOCOL) | ✅ |
| `search "sys:extension"` | `sys:extension` | 2 (Ψ_SYMBIOSIS, ◊) | ✅ |
| `search "sys:user:profile"` | `sys:user:profile` | 1 (USER: Profile) | ✅ |
| `search "TRACE:FRESH"` | `trace:fresh`, type=investigation | 3 | ✅ |

### 3.3 Compatibilité V15 — Matrice MCP → CLI

| MCP Tool | Pattern V15 | Équivalent CLI | Status |
|----------|------------|----------------|--------|
| `search_memory(query, tags, limit)` | Boot memories | `mnemo search ... --tags ...` | ✅ |
| `write_memory(title, content, tags, memory_type)` | Cristallisation Μ | `mnemo write ... --tags ...` | ✅ |
| `update_memory(id, tags)` | Décristallisation | `mnemo update <id> --tags ...` | ✅ |
| `delete_memory(id)` | Rejection /seal | `mnemo delete <id>` | ✅ |
| `read_memory(id)` | Lecture mémoire | `mnemo get <id>` | ✅ |

### 3.4 MCP toujours fonctionnel

Le serveur MCP a été testé après les modifications REST :

| Outil MCP | Status |
|-----------|--------|
| `ping` | ✅ pong en 0.1ms |
| `search_memory(query, tags)` | ✅ résultats avec filtrage |
| `write_memory(title, content, tags)` | ✅ création avec embedding |
| `update_memory(id, tags)` | ✅ mise à jour réussie |

Les deux systèmes (MCP et CLI) coexistent sur la même API sans conflit.

---

## 4. Benchmark : MCP vs CLI

### 4.1 Latence

| Opération | CLI | MCP (estimé) | Gain CLI |
|-----------|-----|-------------|----------|
| **search** (5 résultats, embedding) | ~6400ms | ~6535ms (+135ms) | **2%** |
| **write** (avec embedding) | ~5200ms | ~5335ms (+135ms) | **2.5%** |
| **get** (DB lookup, pas d'embedding) | **18ms** | ~153ms (+135ms) | **88%** |
| **update** (DB update) | ~200ms | ~335ms (+135ms) | **40%** |
| **delete** (soft delete) | ~50ms | ~185ms (+135ms) | **73%** |

**Note :** Le bottleneck principal est l'embedding model (~5s), pas le protocole. Le gain MCP→CLI de 135ms/appel vient de l'élimination du `docker exec` + démarrage Python.

### 4.2 Tokens (le vrai gain)

**Contexte :** Chaque réponse MCP/CLI entre dans le contexte du LLM. Moins la réponse est verbeuse, moins de tokens sont consommés.

| Format de sortie | Taille | Tokens estimés | Réduction vs MCP |
|------------------|--------|----------------|------------------|
| **MCP** (toujours JSON complet) | 3181 B | ~1060 tok | — |
| **CLI full JSON** (`--format json`) | 3181 B | ~1060 tok | 0% |
| **CLI filtré** (`| jq '{t:.title,s:.score}'`) | 509 B | ~169 tok | **85%** |
| **CLI titres** (`| jq '.results[].title'`) | 210 B | ~70 tok | **94%** |
| **CLI one-liner** (`| jq '"\(.total) results"'`) | 47 B | ~15 tok | **99%** |

#### Impact session V15 typique (boot + 5 interactions + write history = ~13 appels MCP)

| | MCP | CLI (filtré) | Économie |
|---|-----|-------------|----------|
| Tokens réponse | 13 × 1060 = **13 780** | 13 × 70 = **910** | **~12 870 tokens** |
| Schémas outils | **900** (permanent) | **0** | **900 tokens** |
| **Total** | **~14 680** | **~910** | **~13 770 tokens/session** |

### 4.3 Composabilité

Le CLI peut piper la sortie vers d'autres outils :

```bash
# Récupérer juste les titres des 5 premiers résultats
mnemo search "async" --tags sys:pattern --limit 5 --format json | jq '.results[].title'

# Compter les résultats par type
mnemo search "sys:pattern" --tags sys:pattern --limit 50 --format json | jq '[.results[].memory_type] | group_by(.) | map({type: .[0], count: length})'

# Écrire si le résultat dépasse un seuil
mnemo search "test" --format json | jq 'if .total > 10 then "ALERT" else "OK" end'
```

Le MCP ne peut pas piper — la réponse complète entre toujours dans le contexte LLM.

---

## 5. Documentation d'utilisation

### 5.1 Installation

```bash
# Déjà installé via symlink
which mnemo
# → /home/giak/.local/bin/mnemo

# Ou manuellement :
alias mnemo=/home/giak/Work/MnemoLite/scripts/mnemo.sh

# Variable d'environnement (optionnel) :
export MNEMO_API=http://127.0.0.1:8001
```

### 5.2 Commandes

#### `mnemo search` — Recherche sémantique

```bash
# Recherche simple
mnemo search "async patterns"

# Avec filtrage par tags (logique AND)
mnemo search "sys:core" --tags sys:core,sys:anchor --limit 20

# Avec filtrage par type
mnemo search "TRACE:FRESH" --tags trace:fresh --type investigation

# Sortie JSON pour pipe
mnemo search "test" --format json | jq '.results[].title'
```

#### `mnemo write` — Créer une mémoire

```bash
# Note simple
mnemo write "Ma note" "Contenu de la note"

# Avec tags et type
mnemo write "PATTERN: foo" "Description" --type reference --tags sys:pattern,v15

# Avec auteur
mnemo write "Decision: Redis" "Chose Redis for cache" --type decision --author Claude
```

#### `mnemo get` — Lire une mémoire

```bash
# Affichage table (défaut)
mnemo get <uuid>

# Affichage JSON
mnemo get <uuid> --format json
```

#### `mnemo update` — Mettre à jour

```bash
# Remplacer les tags (décristallisation V15)
mnemo update <uuid> --tags sys:pattern:doubt,v15

# Mettre à jour titre + contenu
mnemo update <uuid> --title "Nouveau titre" --content "Nouveau contenu"
```

#### `mnemo delete` — Supprimer

```bash
# Soft delete (réversible)
mnemo delete <uuid>

# Hard delete (irréversible)
mnemo delete <uuid> --permanent
```

#### `mnemo stats` — Statistiques

```bash
mnemo stats
# → {"total": 34433, "today": 28, "embedding_rate": 100.0, ...}
```

### 5.3 Patterns V15

```bash
# Boot — Charger les mémoires core
mnemo search "sys:core" --tags sys:core,sys:anchor --limit 20 --format json | jq '[.results[]|{t:.title,s:.score}]'

# Cristallisation Μ — Sauvegarder un pattern validé
mnemo write "PATTERN: nom_du_pattern" "Description" --type reference --tags sys:pattern,v15,substrat:opencode

# Décristallisation — Marquer un pattern douteux
mnemo update <uuid> --tags sys:pattern:doubt,v15

# Trace de friction
mnemo write "TRACE:FRESH — Symptom" "trace:fresh:\n  type: ECS\n  symptom: ..." --type investigation --tags trace:fresh,type:ECS,v15

# Sauvegarde interaction
mnemo write "INTERACTION: 2026-03-23" "Q: question\nR: réponse" --type conversation --tags sys:history,v15
```

---

## 6. Problèmes rencontrés

### 6.1 `jq` et les newlines dans JSON

**Problème :** `jq .` (pretty-print) convertit les `\n` échappés en vrais newlines, ce qui casse le pipe `| jq ...` en aval.

**Solution :** Utiliser `jq -c '.'` (compact) pour le format JSON, permettant le pipe. Le pretty-print reste disponible via `mnemo ... --format json | jq .` (l'utilisateur choisit).

### 6.2 Resource MCP `memories://list` non routée

**Problème :** Le boot V15 appelle `memories://list?tags=sys:core,sys:anchor&limit=20` (MCP resource), mais le routing des query params ne fonctionne pas correctement.

**Impact :** Bloquant pour MCP, mais sans impact pour le CLI qui utilise l'endpoint REST directement.

### 6.3 Parsing ID depuis output CLI

**Problème :** L'output `✓ Created: <uuid>` nécessite un `grep -oP` pour extraire l'UUID dans les scripts.

**Solution :** Documenté dans le rapport. Pattern : `ID=$(mnemo write ... | grep -oP '[0-9a-f]{8}-...')`.

---

## 7. Recommandations

1. **Pour OpenCode/Expanse :** Utiliser `mnemo` CLI exclusivement. Gain de tokens, latence, composabilité.
2. **Pour Claude Desktop/autres IDE :** Garder le MCP (pas d'accès Bash natif).
3. **Fix MCP resource `memories://list` :** Le routing des query params dans `ListMemoriesResource.get()` doit être investigué.
4. **Évolution possible :** Ajouter un mode `mnemo boot` qui exécute les 3 recherches du boot V15 en un seul appel parallélisé.

---

## 8. Métriques finals

| Métrique | Valeur |
|----------|--------|
| Mémoires en base | 34 433 |
| Taux d'embedding | 100% |
| Commandes implémentées | 6 (search, write, get, update, delete, stats) |
| Endpoints REST ajoutés | 3 (POST memories, PUT memories/{id}, DELETE memories/{id}) |
| Endpoint REST modifié | 1 (search : ajout tags) |
| Tests CRUD passés | 5/5 |
| Tests V15 passés | 4/4 |
| Tests MCP passés | 4/4 |
| Économie tokens/session | ~13 770 tokens (94%) |
