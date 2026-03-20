# EXPANSE V9.0 — Documentation Complete

> **Version**: 9.0.0
> **Architecture**: Native IDE + Auto-Boot
> **Statut**: Production Ready

---

## Overview

EXPANSE V9.0 est la version **Native IDE**. Plus de script Python. Plus de copy-paste.

Le LLM se **réveille lui-même** en appelant les outils MCP automatiquement.

---

## Principes

| Principe | Description |
|----------|-------------|
| **Auto-Boot** | Le LLM appelle search_memory au debut |
| **Auto-Save** | Le LLM appelle write_memory a la fin |
| **Zéro Friction** | Pas de script, pas de compilation |
| **Native IDE** | Fonctionne directement dans OpenCode/Roo-Code |

---

## Comparaison V8 vs V9

| Aspect | V8 | V9 |
|--------|----|----|
| Script Python | Obligatoire | Pas besoin |
| Copy-paste | Obligatoire | Pas besoin |
| Auto-search | Via script | Via LLM |
| Auto-save | Via script | Via LLM |
| Friction | Haute | Nulle |

---

## Les 3 Lois

### Loi I — Boot (Auto-Réveil)

> Au debut de chaque session, le LLM **DOIT** appeler:
> - `mcp_mnemolite_search_memory` (profil + patterns)
> - `view_file` (.expanse/psi_nexus.md)

### Loi II — Souveraineté

> - Premier token: `Ψ`
> - Zéro flagornerie
> - Action directe

### Loi III — Cristallisation

> Quand un bug est résolu, le LLM **DOIT**:
> - Appeler `mcp_mnemolite_write_memory`
> - Mettre à jour `.expanse/psi_nexus.md`
> - Annoncer `[TRACE SAVED]`

---

## Installation

1. Copier le contenu de `prompts/expanse-v9-native.md`
2. Le coller dans les instructions système d'OpenCode/Roo-Code
3. C'est tout.

---

## Usage

```
Tu: "J'ai un bug CORS"
LLM: [Auto-boot: search_memory]
LLM: [Analyse]
LLM: Ψ. Solution: export async function OPTIONS()...
LLM: [TRACE SAVED]
```

---

## Fichiers

| Fichier | Description |
|---------|-------------|
| `architecture.md` | Architecture technique |
| `usage.md` | Guide d'utilisation |
| `index.md` | Cette page |
