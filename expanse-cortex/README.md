# 🧠 EXPANSE CORTEX

Visualiseur du Cortex Expanse.

Exactement comme le dashboard. 100% autonome.

---

## 🚀 Lancer

```bash
pnpm install
pnpm dev
```

Ouvrir http://localhost:5173

Le graphe est chargé depuis `/graph/expanse-graph.json` (généré par le pipeline `graph/` : `fetch-mcp.cjs` → `analyze-sources.cjs` → `build-graph.cjs`).

---

## 🛠️ Stack

- Vite 8.0.8
- React 18.3.1
- SVG natif (React)
- Tailwind CSS 4.2.2

---

## 📋 Fonctionnalités

- ✅ Charge `/graph/expanse-graph.json` (v5, 189 nœuds, 184 liens)
- ✅ Graphe SVG interactif avec couches par type
- ✅ Zoom / Pan / Sélection / Hover highlight
- ✅ Inspecteur de noeud (type, centralité, tags, contenu)
- ✅ Métriques en temps réel
- ✅ Légende noeuds + liens
- ✅ Couleurs différenciées par type d'arête
- ✅ Design identique au dashboard Expanse (Catppuccin Mocha)

---

## 📦 Build

```bash
pnpm run build
```

Le build est généré dans `dist/` (~160 KB). L'application fonctionne en ouvrant `dist/index.html` dans Chrome. Aucun serveur nécessaire.

---

## 📚 Documentation

→ [Index complet de la documentation](./docs/README.md) — EPICs, plans, scénarios, référence schema.
→ [Workflow Runtime → Scénario](./docs/2026-04-18_22-27-WORKFLOW-RUNTIME-TO-SCENARIO.md) — Pipeline ①Lire → ②Écrire → ③Implémenter.

---

*Expanse Cortex v5.0 — 2026-04-15*
