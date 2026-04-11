# EXPANSE — CARTOGRAPHIE DU CORTEX

**v1.0** — `/graph`

---

## PRÉAMBULE

Mode **MIROIR**. Lire l'Apex, sonder Mnemolite, générer `dashboard/expanse-graph.json`.

100% autonome. Aucune modification du runtime. Exactement comme `/status`.

---

## SÉQUENCE

### 1. Lire l'Apex

```
read_file(path="v16/runtime/expanse-v16.md")
```

Extraire TOUS les éléments:
1. Chaque section et sous-section de V16
2. Chaque règle opérationnelle
3. Chaque commande utilisateur
4. CHAQUE appel MCP mentionné dans V16: `search_memory`, `write_memory`, `rate_memory`, `search_code`, `get_system_snapshot`, `mark_consumed`
5. Tous les protocols depuis Mnemolite

### 2. Sonder Mnemolite (7 recherches parallèles)

**Appels MCP EXACTEMENT comme dans V16 et Dream, signature identique à 100%:**
```
mcp_mnemolite_get_system_snapshot(repository="expanse")
mcp_mnemolite_search_memory(query="sys:core sys:anchor", tags=["sys:core","sys:anchor"], limit=100)
mcp_mnemolite_search_memory(query="sys:protocol", tags=["sys:protocol"], limit=20)
mcp_mnemolite_search_memory(query="sys:pattern", tags=["sys:pattern"], limit=100)
mcp_mnemolite_search_memory(query="sys:pattern:candidate", tags=["sys:pattern:candidate"], limit=100)
mcp_mnemolite_search_memory(query="sys:history", tags=["sys:history"], limit=50, sort="outcome_score DESC")
mcp_mnemolite_search_memory(query="sys:drift", tags=["sys:drift"], limit=50, consumed=false)
```

✅ Signature exacte identique à Dream: paramètre `consumed=false` présent pour drifts.

### 3. ANALYSER ET COMPRENDRE

Analyser le contenu de `expanse-v16.md` et des mémoires. Déterminer les relations:

- Si un pattern cite une section V16 → lien `DERIVES_FROM` pattern → apex
- Si une mémoire cite un pattern → lien `IMPLEMENTS` mémoire → pattern
- Si une règle cite un outil → lien `CALLS` règle → outil
- Si deux mémoires sont similaires > 0.7 → lien `RELATES_TO`

Calculer pour chaque noeud:
- `size`: 4 + nombre de liens * 2.5
- `color`: selon type (voir ci-dessous)
- `weight`: 0.1 à 1.0 selon force de relation

### 4. GÉNÉRER LE JSON

Écrire `dashboard/expanse-graph.json` en suivant EXACTEMENT le schéma défini.

```json
{
  "version": 1,
  "generated_at": "2026-04-11T21:44:20",
  "meta": {
    "count_nodes": 127,
    "count_edges": 243,
    "density": 1.91
  },
  "nodes": [
    /* NOEUDS */
  ],
  "edges": [
    /* LIENS */
  ]
}
```

---

## RÈGLES

### Types de Noeuds et Couleurs

| Type | Couleur | Source |
|------|---------|--------|
| `APEX` | `#ff4444` | Sections de expanse-v16.md |
| `REGLE` | `#ff9933` | Règles opérationnelles de V16 |
| `PROTOCOLE` | `#ffcc33` | sys:protocol Mnemolite |
| `PATTERN` | `#44ff44` | sys:pattern Mnemolite |
| `MEMOIRE` | `#8888ff` | sys:history Mnemolite |
| `OUTIL` | `#ff88ff` | Outils MCP appelés |
| `DRIFT` | `#ff4488` | sys:drift Mnemolite |

### Types de Liens et Couleurs

| Relation | Couleur |
|----------|---------|
| `DERIVES_FROM` | `#88ff88` |
| `IMPLEMENTS` | `#8888ff` |
| `CALLS` | `#ff88ff` |
| `RELATES_TO` | `#666688` |
| `RATE_POSITIVE` | `#44ff44` |
| `RATE_NEGATIVE` | `#ff4444` |
| `MARK_CONSUMED` | `#888844` |

⚠️ **BUG CORRIGÉ OBLIGATOIRE**:
- Chaque lien DOIT avoir `source` et `target`.
- NE JAMAIS utiliser `id` comme champ source.
- Tous les liens doivent avoir ces 4 champs: `source`, `target`, `weight`, `color`.

### Optimisations OBLIGATOIRES

- ✅ `id` le plus court possible (`a3` au lieu de `apex-section-3`)
- ✅ Aucun champ vide
- ✅ Pas de pretty print en production (`JSON.stringify(..., null, 0)`)
- ✅ `content` maximum 1 ligne
- ✅ Taille maximale: < 100KB

---

## SORTIE

Après écriture : `Ψ [GRAPH] Généré → dashboard/expanse-graph.json ({count_nodes} noeuds, {count_edges} liens)`

---

*Expanse Cortex v1.0 — 2026-04-11*