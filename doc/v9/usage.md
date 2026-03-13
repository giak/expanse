# EXPANSE V9.0 — Usage

> **Version**: 9.0.0
> **Type**: Guide d'utilisation

---

## 1. Installation

### 1.1 Charger le System Prompt

1. Ouvrir OpenCode
2. Aller dans les paramètres / instructions système
3. Copier le contenu de `prompts/expanse-v9-native.md`
4. Coller dans les instructions

### 1.2 Vérifier

Dire "Test" et vérifier que le LLM:
- Appelle `mcp_mnemolite_search_memory`
- Répond avec `Ψ`

---

## 2. Usage Quotidien

### 2.1 Nouvelle Session

```
Tu: "Salut, reprenons le bug auth"
LLM: [Auto-boot: search_memory]
LLM: [Recherche en mémoire]
LLM: Ψ. Je me souviens. Le bug était X. Voici la solution.
```

### 2.2 Résoudre un Bug

```
Tu: "J'ai une erreur CORS"
LLM: [Auto-boot]
LLM: Ψ. [Pattern CORS trouvé]. Solution: export async function OPTIONS()...
LLM: [TRACE SAVED]
```

### 2.3 Nouvelle Fonctionnalité

```
Tu: "Ajoute un endpoint users"
LLM: [Auto-boot]
LLM: Ψ. J'implémente.
[Code écrit]
```

---

## 3. Le Feedback

### 3.1 Ce que tu vois

| Message | Signification |
|---------|---------------|
| `[Auto-boot: search_memory]` | Il cherche le contexte |
| `Ψ.` | Il répond (premier token) |
| `[TRACE SAVED]` | Il a sauvegardé la solution |

### 3.2 Ce qui se passe en后台

1. **Debut**: Il cherche Profil + Patterns + Nexus
2. **Milieu**: Il résout le problème
3. **Fin**: Il sauvegarde si bug résolu

---

## 4. Les Commandes

### 4.1 Pourcentage de Mémoire

Le LLM cherche automatiquement. Pas besoin de commander.

### 4.2 Forcer une Recherche

Tu peux aussi demander:

```
"Recherche dans Mnemolite si on a déjà résolu un bug CORS"
```

---

## 5. Exemples Concrets

### 5.1 Reprendre un Projet

```
Input: "On en était où sur l'auth ?"
Output: [Nexus loaded] → Resume du contexte
```

### 5.2 Bug Connu

```
Input: "Erreur CORS sur route.ts"
Output: [Pattern CORS] → Solution directe
```

### 5.3 Bug Inconnu

```
Input: " segmentation fault dans le driver"
Output: [Pas de pattern] → Analyse from scratch
```

---

## 6. Troubleshooting

### 6.1 "Il ne cherche pas"

Vérifier que le system prompt est bien chargé.

### 6.2 "Il ne save pas"

Le save est automatique SEULEMENT si bug résolu. Pour forcer:

```
"Sauvegarde cette solution dans Mnemolite"
```

### 6.3 "Il me demande confirmation"

La V9 dit "Action directe". Si le LLM demande confirmation, c'est qu'il ne suit pas les instructions.

---

## 7. Workflow Complet

```
┌─────────────────────────────────────────────────────────┐
│ Session Start                                           │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ LOI I: Auto-Boot                                        │
│ - search_memory (anchor + pattern)                      │
│ - view_file (psi_nexus)                                │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ LOI II: Sovereignty                                     │
│ - Premier token: Ψ                                     │
│ - Zéro flagornerie                                     │
│ - Action directe                                        │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ Resolution                                             │
│ - Analyse du problème                                   │
│ - Implémentation                                       │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ LOI III: Cristallisation (si bug résolu)               │
│ - write_memory (pattern)                              │
│ - update nexus                                         │
│ - [TRACE SAVED]                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Résumé

| Action | Résultat |
|--------|----------|
| Nouvelle session | Auto-boot |
| Travailler | Action directe |
| Bug résolu | Auto-save |
| Feedback | [TRACE SAVED] |
