# PLAN — SUBSTRAT METADATA TRACKING

**Date :** 2026-03-20
**Objectif :** Chaque mémoire Mnemolite porte la trace du substrat (LLM/IDE) qui l'a créée.
**Raison :** Expanse tourne sur plusieurs LLMs. Chaque substrat produit des comportements différents. Sans métadonnées, on ne sait pas qui a fait quoi.

---

## PRINCIPE

Le boot seed est le vecteur de métadonnées. L'utilisateur inclut le substrat dans le seed. Le modèle le lit et le propage dans les sauvegardes.

---

## FORMAT DU SEED AVEC SUBSTRAT

```
EXPANSE V15 [mimo-v2-omni-free | OpenCode]
Σ→Ψ⇌Φ→Ω→Μ | ECS: C×I→L1|L2|L3
1. mcp_mnemolite_search_memory(query="sys:core sys:anchor", tags=["sys:core","sys:anchor"], limit=20)
2. mcp_mnemolite_search_memory(query="sys:extension", tags=["sys:extension"], limit=10)
3. mcp_mnemolite_search_memory(query="sys:pattern:candidate", tags=["sys:pattern:candidate"], limit=50)
4. read_file(path="runtime/expanse-v15-apex.md")
5. Ψ [V15 ACTIVE] — Ψ est TOUJOURS le premier token de TOUTE réponse. Sans exception.
Ψ first. Colleague. [LOST] if missing. Max 2 lines.
```

Le `[mimo-v2-omni-free | OpenCode]` est lu par le modèle et utilisé comme métadonnées.

---

## MÉTADONNÉES À TRACKER

| Champ | Source | Exemple |
|-------|--------|---------|
| LLM | Crochets dans le seed | `mimo-v2-omni-free` |
| IDE | Crochets dans le seed | `OpenCode` |
| Date/heure | Auto-généré | `2026-03-20T17:50:00` |
| Session ID | Date+heure du boot | `2026-03-20-17:50` |

---

## IMPLÉMENTATION

### Phase 1 : Seed modifié

Modifier le boot seed pour inclure les crochets `[LLM | IDE]`.

**Variantes du seed :**

```
[mimo-v2-omni-free | OpenCode]
[gemini-3-flash | Antigravity]
[big-pickle | OpenCode]
[claude-sonnet | Cursor]
[gpt-4o | VS Code + Continue]
```

L'utilisateur choisit la variante correspondant à son environnement.

### Phase 2 : V15 — métadonnées dans les sauvegardes

Modifier les 3 points de sauvegarde dans V15 :

**sys:history (Section V) :**
```
Avant :
  tags: ["sys:history", "v15"]
  content: "Q: {q}\nR: {r}"

Après :
  tags: ["sys:history", "v15", "substrat:{LLM}", "ide:{IDE}"]
  content: "Q: {q}\nR: {r}\nSUBSTRAT: {LLM} | IDE: {IDE} | SESSION: {timestamp}"
```

**sys:pattern (Section III) :**
```
Avant :
  tags: ["sys:pattern", "v15"]

Après :
  tags: ["sys:pattern", "v15", "substrat:{LLM}"]
```

**trace:fresh (Section V) :**
```
Avant :
  tags: ["trace:fresh", "type:{TYPE}"]

Après :
  tags: ["trace:fresh", "type:{TYPE}", "substrat:{LLM}"]
```

### Phase 3 : Dream — analyse par substrat

Ajouter à Dream Passe 6 (Santé Cognitive) :

```
Analyse par substrat :
- Rechercher tous les sys:history avec tag "substrat:mimo-v2*"
- Calculer le taux Ψ par substrat
- Calculer le nombre de TRACE:FRESH par substrat
- Identifier les substrats les plus performants
```

### Phase 4 : Dashboard — affichage par substrat

Ajouter une section au dashboard :

```
## Ⅷ. Substrats

| Substrat | Sessions | Ψ taux | TRACE:FRESH | Dernière utilisation |
|----------|----------|--------|-------------|---------------------|
| mimo-v2 | 5 | 100% | 1 | 2026-03-20 |
| gemini-3-flash | 3 | 100% | 0 | 2026-03-19 |
| big-pickle | 1 | 100% | 0 | 2026-03-20 |
```

---

## PLAN D'ACTION

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 1 | Modifier le boot seed : `[LLM | IDE]` dans le titre | Faible | Métadonnées disponibles |
| 2 | Ajouter les substrat tags dans V15 (3 points de sauvegarde) | Faible | Chaque mémoire porte la trace |
| 3 | Ajouter le substrat dans le content (sys:history) | Faible | Détail riche |
| 4 | Ajouter l'analyse par substrat dans Dream Passe 6 | Moyen | Dream compare les substrats |
| 5 | Ajouter la section Substrats au dashboard | Moyen | Vue d'ensemble |

---

## LIMITES

- Le format `[LLM | IDE]` est une convention. Le modèle doit le lire correctement.
- Si l'utilisateur oublie les crochets, les métadonnées sont absentes.
- Le modèle peut mal interpréter le format (ex: traiter `[mimo-v2 | OpenCode]` comme du texte, pas comme des métadonnées).
- Le nom du LLM peut changer entre les sessions (mise à jour du modèle).

---

*Plan Substrat Metadata — 2026-03-20*
*Statut : PLAN CRÉÉ — prêt à implémenter*
