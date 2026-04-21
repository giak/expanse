# Expanse Graph Pipeline

Génération du graphe cognitif Expanse en 3 étapes.

## Pipeline

```
fetch-mcp.cjs → mcp-raw/              (données brutes Mnemolite)
analyze-sources.cjs → sources/*.json   (JSON générés depuis les specs .md)
build-graph.cjs → public/graph/       (graphe final, servi par Vite)
```

## Étapes

### 1. Fetch MCP (`fetch-mcp.cjs`)

Appelle les 12 endpoints Mnemolite en parallèle, sauvegarde le JSON brut dans `mcp-raw/`.

```bash
cd expanse-cortex/graph
node fetch-mcp.cjs
```

Sortie : `mcp-raw/01_snapshot.json` … `mcp-raw/12_diff.json` + `_meta.json`

### 2. Analyze Sources (`analyze-sources.cjs`)

Parse les fichiers specs `.md` et génère les JSON sources structurés. **Plus besoin d'éditer les JSON à la main** — le JS lit les tables markdown du spec.

```bash
node analyze-sources.cjs
```

Sources parsées :
- `v16/runtime/expanse-graph.md` → tables markdown → nœuds APEX/ORGAN/REGLE/COMMANDE/OUTIL + arêtes
- `doc/mutations/LOG.md` → tables mutations → nœuds MUTATION
- `skills/SKILL-REGISTRY.md` → headings ### → nœuds OUTIL skill

Générés :
- `sources/v16.json` — §Ⅰ-Ⅶ (60 nœuds, 95 arêtes)
- `sources/dream.json` — Passes + Security + Checks + DRIFT (42 nœuds, 28 arêtes)
- `sources/mutations.json` — LOG.md dynamique (24 nœuds, 47 arêtes)
- `sources/fichiers.json` — FICHIER + OUTIL skills (17 nœuds, 9 arêtes)

Validation : tous les IDs attendus présents, pas de doublons.

### 3. Build Graph (`build-graph.cjs`)

Lit les sources générées + les données MCP brutes → consolide → valide → sort le JSON final.

```bash
node build-graph.cjs
```

Sortie : `../public/graph/expanse-graph.json` (servi par Vite à `/graph/expanse-graph.json`)

## Structure

```
graph/
├── README.md              ← vous êtes ici
├── fetch-mcp.cjs          ← étape 1 : fetch & save
├── analyze-sources.cjs    ← étape 2 : parse .md → generate JSON
├── build-graph.cjs        ← étape 3 : merge & validate
├── sources/               ← JSON générés (ne pas éditer à la main)
│   ├── v16.json           ← §Ⅰ-Ⅶ : APEX, ORGAN, REGLE, COMMANDE, OUTIL
│   ├── dream.json         ← passes, security, checks, drift
│   ├── mutations.json     ← mutations dynamiques depuis LOG.md
│   ├── fichiers.json      ← FICHIER + OUTIL skills
│   └── mcp-fallbacks.json ← repli si Mnemolite offline
└── mcp-raw/               ← dump brut Mnemolite (ne pas éditer)
    ├── _meta.json
    ├── 01_snapshot.json
    ├── …
    └── 12_diff.json
```

## Résultat

- **190 nœuds** · **184 edges** · **18/18 invariants passent**
- Servi par Vite : `http://localhost:5173/graph/expanse-graph.json`
