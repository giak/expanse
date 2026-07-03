# 🧠 EPIC : EXPANSE Cortex — Extension Immersive

**Status** : 📋 À FAIRE
**Version** : 1.0
**Date** : 2026-04-14
**Stack** : React + SVG + Canvas2D (intégré dans expanse-cortex/)
**Approche** : Enrichir l'app React existante, pas recréer depuis zéro

---

## 1. VISION

> **Entrer dans le cristal cognitif.**

Un organisme bioluminescent des abysses. Pas un diagramme UML — un système nerveux vivant où les données courent comme des impulsions électriques, où les organes respirent, où la mémoire cristallise en temps réel.

Le Cortex Immersif est pour la **perception** — sentir le système. Le React app existant (expanse-cortex/) est pour l'**analyse**. Les deux cohabitent dans la même application, sous des routes différentes.

**Sensation** : Chirurgical. Souverain. Infini.

---

## 2. PRINCIPES

| # | Principe | Description |
|---|----------|-------------|
| P1 | **Respiration, pas statisme** | Chaque nœud pulse (matter states), chaque arête coule, rien n'est immobile |
| P2 | **Anatomie data-driven** | Zéro coordonnée hardcodée. Positions dérivées des rôles et connexions |
| P3 | **Réutilisation maximale** | Capitaliser sur les 5 vues, hooks, context, types, constantes existants |
| P4 | **Cohérence sémantique** | Visuels reflètent les 4 natures Mnemolite et les 5 organes ΣΨΦΩΜ |
| P5 | **Canvas pour le vivant, SVG pour le structurel** | Particules et flux sur Canvas2D overlay. Nœuds et arêtes sur SVG |
| P6 | **Progressif** | Phase 1 = particules + timeline + écosystème mémoire. Phase 2 = boot + ECS |

---

## 3. ÉTAT EXISTANT — Ce qu'on a déjà

### 5 vues opérationnelles

| Vue | Route | Description | Richesse |
|-----|-------|-------------|----------|
| Cœur Cognitif | `#/heart` | Anatomique radial, organes sur anneau vital, APEX en noyau, mutations en essaim, clusters par organe | ★★★★★ |
| Couches | `#/layered` | Layout horizontal par type (ORGAN→APEX→REGLE→MUTATION→MEMOIRE) | ★★☆☆☆ |
| Organique | `#/organic` | d3-force avec clustering par type | ★★★☆☆ |
| Pipeline | `#/pipeline` | Colonnes par organe (Σ\|Ψ\|Φ\|Ω\|Μ) | ★★☆☆☆ |
| Tableau de bord | `#/dashboard` | Tables filtrables (nœuds, liens, mutations, patterns) | ★★★☆☆ |

### Infrastructure existante (réutilisable)

| Composant | Fichier | Rôle |
|-----------|---------|------|
| `GraphContext` | `context/GraphContext.tsx` | data, selectedNode, activeNode, shared state |
| `useGraphData` | `hooks/useGraphData.ts` | fetch + parse expanse-graph.json |
| `usePanZoom` | `hooks/usePanZoom.ts` | pan/zoom avec animation, fitToView, zoomTo, zoomOut |
| `useNodeMap` | `hooks/useNodeMap.ts` | Map<id, RenderNode> pour lookup rapide |
| `useHashRouter` | `hooks/useHashRouter.ts` | routing par hash (#/heart, #/layered, etc.) |
| `computeMatterState` | `utils/matterState.ts` | cristal/liquide/vapeur + curtain core/heuristic/candidate |
| `computeRadius` | `utils/computeRadius.ts` | radius = 8 + min(centrality, 15) × 1.5 |
| `SvgDefs` | `components/svg/SvgDefs.tsx` | Filtres SVG (glow, shadow) partagés |
| `NodeGfx` | `components/svg/NodeGfx.tsx` | Rendu nœud générique (cercle + label + hover) |
| `EdgeGfx` | `components/svg/EdgeGfx.tsx` | Rendu arête générique |
| `TopNav` | `components/layout/TopNav.tsx` | Navigation entre vues |
| `MetricsPanel` | `components/hud/MetricsPanel.tsx` | Métriques (nœuds, liens, densité) |
| `LegendPanel` | `components/hud/LegendPanel.tsx` | Légende types + edge types |
| `InspectorPanel` | `components/hud/InspectorPanel.tsx` | Inspecteur nœud sélectionné |

### Types existants

```typescript
// JsonNode (7 champs du JSON — SCHEMA v3.0)
interface JsonNode { id, type, label, content, tags, created_at, centrality }

// RenderNode (JSON + computed render state)
interface RenderNode extends JsonNode { x, y, color, radius, matterState, curtain }

// SimNode (pour d3-force)
interface SimNode extends JsonNode { x, y, color, radius, vx?, vy?, fx?, fy? }
```

### Constantes existantes

```typescript
// theme.ts — Catppuccin Mocha
NODE_COLORS: 10 types → couleurs
EDGE_COLORS: 7 types → couleurs
ORGAN_COLORS: ΣΨΦΩΜ → couleurs
ORGAN_ORDER: ['Σ', 'Ψ', 'Φ', 'Ω', 'Μ']

// schema.ts — Layout constants
LAYERS: type → couche horizontale (0-4)
ANATOMICAL_CLUSTER: type → { parentOrgan, angleOffset, spreadRadius, radialBias }
VITAL_RING_RADIUS, ORGAN_ANGLES, NUCLEUS_RADIUS, SWARM_*_RADIUS, NEBULA_RADIUS
```

### Animations CSS existantes (index.css)

- `vital-pulse` : organes respirent (opacity cycle)
- `vital-flow` / `vital-flow-reverse` : anneau vital animé (stroke-dashoffset)
- `vital-edge-flow` / `vital-edge-flow-reverse` : courant métabolique par segment
- `nucleus-breath` : APEX noyau pulse
- `mutation-pulse` : mutations glow doux
- `drift-spark` / `friction-spark` : dérives flicker
- `matter-cristal` / `matter-liquide` / `matter-vapeur` : états de matière
- `curtain-core` / `curtain-heuristic` / `curtain-candidate` : natures structurelles
- `ghost-imprint` : mutations rejected/rolled_back fantomatiques
- `refusal-shockwave` : choc rouge quand axiome scellé cliqué
- `boot-flash` / `vital-pulse-chaos-*` / `vital-pulse-locking` : séquence boot

---

## 4. CE QU'ON AJOUTE

### S1 — Particle Engine (système de particules Canvas2D)

**Problème** : Les vues SVG existantes sont structurellement riches mais "mortes" — les arêtes sont statiques, le flux métabolique est simulé par CSS dash-offset mais sans véritables particules qui voyagent.

**Solution** : Un composant React `<ParticleOverlay>` qui superpose un `<canvas>` sur le SVG. Les particules suivent les arêtes existantes en utilisant les positions `RenderNode` déjà calculées par chaque vue.

#### Architecture

```
components/particles/
  ParticleOverlay.tsx    ← Composant React wrapper (canvas overlay)
  ParticleEngine.ts      ← Moteur de particules (update/render loop)
  Particle.ts            ← Particule individuelle (position, vitesse, couleur, trail)
  particleTypes.ts       ← Types de particules (métabolique, cristallisation, mutation, drift)
```

#### Types de particules

| Type | Source | Cible | Couleur | Vitesse | Quand |
|------|--------|-------|---------|---------|-------|
| **Métabolique** | Organe N | Organe N+1 | Couleur organe source | Rapide (2-4s) | Toujours (anneau vital) |
| **Cristallisation** | Ω (synthèse) | Μ (mémoire) | Vert → Rose | Moyenne (3s) | Quand write_memory |
| **Lecture** | Μ (mémoire) | Σ (perception) | Rose → Bleu | Moyenne (3s) | Quand search_memory |
| **Mutation** | DRIFT | APEX | Orange → Rouge | Lente (5s) | Quand ALTERS edge |
| **Drift spark** | → DRIFT node | — | Rouge, éphémère | Très rapide (0.5s) | Quand drift apparaît |

#### Comportement

- Chaque particule suit une arête (source→target) via interpolation linéaire
- Vitesse dérivée du `weight` de l'arête (weight élevé = plus rapide = plus confiance)
- Trail : chaque particule laisse une traînée de 5-10 positions précédentes (dégradé)
- Cycle : quand une particule atteint sa cible, elle réapparaît à la source (boucle)
- Budget : max ~150 particules actives simultanément (performance)

#### Intégration

- `<ParticleOverlay>` reçoit les mêmes données que le SVG (RenderNode[], JsonEdge[])
- Positionné en `position: absolute; pointer-events: none;` au-dessus du SVG
- Coordonnées Canvas alignées sur le transform SVG (translate + scale du viewBox)
- Synchronisé avec `requestAnimationFrame` — indépendant du render React

#### Performance

- OffscreenCanvas pour pré-rendre les glow stencils (1 par couleur)
- `globalCompositeOperation = 'lighter'` pour blending lumineux
- Pas de shadowBlur en temps réel (trop coûteux)
- Budget particules = 150 max → ~0.5ms/frame sur machine moderne

---

### S2 — Vue Timeline (Rivière Temporelle)

**Problème** : Aucune vue existante ne montre la dimension temporelle — quand les mutations ont été appliquées, comment les patterns cristallisent, l'évolution du système.

**Solution** : Nouvelle vue `TimelineView.tsx` avec axe X temporel.

#### Layout

```
Y ↑
  │  MUTATION  ●  ●        ●  ●  ●  ●  ●  ●
  │  PATTERN      ◆  ◆  ◆        ◆  ◆  ◆
  │  DRIFT    ✦  ✦  ✦    ✦      ✦
  │  REGLE    ■  ■  ■  ■  ■  ■  ■  ■  ■  ■
  │  PROTO    ★      ★  ★     ★  ★
  │  APEX     ◼     ◼  ◼  ◼  ◼  ◼  ◼
  │  ORGAN    ⬡                               (fixé à gauche, permanent)
  │  OUTIL    ◆  ◆  ◆  ◆  ◆  ◆  ◆  ◆  ◆  ◆
  │  MEMOIRE  ◇  ◇  ◇  ◇  ◇  ◇  ◇  ◇  ◇  ◇
  │  COMMANDE ◇  ◇  ◇  ◇  ◇  ◇  ◇  ◇  ◇  ◇
  └──────────────────────────────────────────────→ X temps
  2026-03-13          2026-03-20         2026-04-06
```

#### Composants

```
views/TimelineView.tsx          ← Vue principale
components/timeline/
  TimelineAxis.tsx              ← Axe temporel (graduations, labels)
  TimelineSlider.tsx            ← Slider draggable
  TimelineEventMarker.tsx       ← Marqueur événement mutation/pattern
  TimelineLane.tsx              ← Lane horizontale par type
```

#### Interactions

- **Slider temporel** : draggable, montre les nœuds actifs à une date donnée
- **Hover nœud** : tooltip avec label, content, date
- **Click nœud** : inspecteur (réutilise InspectorPanel)
- **Click mutation** : zoom sur ses connexions (réutilise zoomToNodeWithConnections)
- **Double-click date** : fit to view à cette période

#### Données

- `created_at` des JsonNode → tri chronologique
- Mutations : tags `applied`/`rejected`/`rolled_back` → couleurs
- Graduations : min(created_at) → max(created_at), auto-échelle

#### Route

`#/timeline`

---

### S3 — Vue Écosystème Mémoire (Jardin Mnemolite)

**Problème** : Les nœuds MEMOIRE sont des diamants génériques dans les vues existantes. Aucune vue ne montre la mémoire comme un écosystème vivant avec ses zones de nature, ses outils MCP, son cycle de vie.

**Solution** : Nouvelle vue `MemoryEcosystemView.tsx` avec layout concentrique par nature.

#### Layout

```
                    ╔══════════════════════════════════╗
                    ║  INCANDESCENT (braises à consumer) ║  ← trace:fresh, sys:drift
                    ║  🔴 Glow rouge+violet             ║     particules s'échappent
                    ╠══════════════════════════════════╣
                    ║  VOLATILE (en incubation)          ║  ← sys:pattern:candidate, sys:extension
                    ║  🟡 Pulse jaune+orange             ║     partiellement transparent
                    ╠══════════════════════════════════╣
                    ║  VIVIDE (stables et actifs)        ║  ← sys:pattern, sys:history
                    ║  🟢 Glow vert stable               ║     plein format
                    ╠══════════════════════════════════╣
                    ║  PERMANENT (inébranlables)         ║  ← sys:core, sys:anchor, sys:snapshot
                    ║  🔵 Cristallin, lavender           ║     épais, inamovible
                    ╠══════════════════════════════════╣
                    ║  OUTILS MCP (au centre)             ║  ← search_memory, write_memory, ...
                    ║  🟣 Araignées tissant des fils     ║     lignes vers mémoires
                    ╚══════════════════════════════════╝
```

#### Composants

```
views/MemoryEcosystemView.tsx   ← Vue principale
components/memory/
  NatureZone.tsx                ← Zone concentrique (incandescent/volatile/vivide/permanent)
  MCPToolNode.tsx               ← Nœud outil MCP au centre
  MemoryNode.tsx                ← Nœud mémoire positionné par nature
  TagRootLink.tsx               ← Lien racine entre mémoires partageant un tag
```

#### Interactions

- **Click nature zone** : filtre pour ne montrer que cette zone
- **Hover mémoire** : tooltip avec tags, content, date
- **Click mémoire** : inspecteur + zoom sur son voisinage tag
- **Click outil MCP** : montre toutes les mémoires accessibles par cet outil
- **Toggle tags** : afficher/masquer les liens racines par tag

#### Algorithmique de positionnement

- 4 zones concentriques : rayon croissant de Permanent (centre) → Incandescent (périphérie)
- Dans chaque zone : distribution angulaire uniforme, avec jitter par centrality
- Outils MCP : centre absolu, rayon fixe, positionnement en cercle
- Tags racines : arêtes entre mémoires partageant un tag commun

#### Données

- Nature déduite des tags (computeNature — cf. S4)
- Outils MCP : nœuds type=OUTIL avec tag `mnemolite`
- Tags : extraire tags uniques, grouper les mémoires par tag

#### Route

`#/memory`

---

### S4 — Natures Mnemolite (enrichissement transversal)

**Problème** : L'utilitaire existant `computeMatterState` distingue cristal/liquide/vapeur mais pas les 4 natures documentées dans le Blueprint Mémoire (Incandescent/Volatile/Vivide/Permanent). Ces natures sont des concepts orthogonaux aux matter states.

**Solution** : Nouvel utilitaire `computeNature.ts` + enrichissement du type `RenderNode` + enrichissement du rendu dans toutes les vues.

#### Natures

| Nature | Tags déclencheurs | Visuel | Sémantique |
|--------|-------------------|--------|------------|
| **Permanent** | `sys:core`, `sys:anchor`, `sys:snapshot`, `sys:diff` | Bleu/lavender, cristallin, stroke épais, inamovible | Scellé, immuable |
| **Vivide** | `sys:pattern`, `sys:history`, `sys:protocol` | Vert stable, plein format, pulse doux | Actif, validé |
| **Volatile** | `sys:pattern:candidate`, `sys:pattern:doubt`, `sys:extension` | Jaune/orange, pulse, semi-transparent | En incubation |
| **Incandescent** | `trace:fresh`, `sys:drift` | Rouge/violet, glow intense, particules qui s'échappent | Frais, à consumer |

#### Fichier

```
utils/computeNature.ts          ← Nouveau
```

#### Enrichissement du type RenderNode

```typescript
export type MemoryNature = 'permanent' | 'vivide' | 'volatile' | 'incandescent' | null

export interface RenderNode extends JsonNode {
  x: number
  y: number
  color: string
  radius: number
  matterState: MatterState
  curtain: Curtain
  nature: MemoryNature        ← NOUVEAU
}
```

#### Enrichissement des constantes

```typescript
// theme.ts — ajout
export const NATURE_COLORS: Record<string, string> = {
  permanent:     '#b4befe',    // lavender
  vivide:        '#a6e3a1',    // green
  volatile:      '#f9e2af',    // yellow
  incandescent:  '#f38ba8',    // red
}
```

#### Enrichissement du CSS (index.css)

```css
/* Natures Mnemolite — visual differentiation */
.nature-permanent { /* cristallin, inébranlable */ }
.nature-vivide    { /* vert stable, pulse doux */ }
.nature-volatile  { /* jaune, pulse, semi-transparent */ }
.nature-incandescent { /* rouge, glow, particules s'échappent */ }
```

#### Impact transversal

- Toutes les vues existantes peuvent afficher la nature (via CSS class ou couleur)
- CognitiveHeartView : les mémoires incandescentes ont un glow rouge
- DashboardView : colonne "Nature" dans la table
- InspectorPanel : champ "Nature" dans l'inspecteur

---

### S5 — Enrichissement HUD

**Ce qui manque** dans les HUD existants :

| Élément | Description | Emplacement |
|---------|-------------|-------------|
| **Mode switcher enrichi** | Ajouter Timeline + Memory aux 5 modes existants | TopNav |
| **Nature légende** | 4 natures Mnemolite dans la légende | LegendPanel |
| **Timeline slider** | Slider temporel (uniquement en mode Timeline) | Bottom overlay |
| **Compteurs par nature** | "Permanent: 8 · Vivide: 24 · Volatile: 0 · Incandescent: 16" | MetricsPanel |

---

## 5. ARCHITECTURE DES FICHIERS

```
expanse-cortex/src/
├── App.tsx                          ← enrichir (routes timeline + memory)
├── index.css                        ← enrichir (nature CSS, particules CSS)
├── components/
│   ├── particles/                   ← NOUVEAU
│   │   ├── ParticleOverlay.tsx      ← Canvas2D overlay wrapper
│   │   ├── ParticleEngine.ts        ← Moteur de particules
│   │   ├── Particle.ts              ← Particule individuelle
│   │   └── particleTypes.ts         ← Types de particules
│   ├── timeline/                    ← NOUVEAU
│   │   ├── TimelineAxis.tsx         ← Axe temporel
│   │   ├── TimelineSlider.tsx       ← Slider draggable
│   │   ├── TimelineEventMarker.tsx  ← Marqueur événement
│   │   └── TimelineLane.tsx         ← Lane par type
│   ├── memory/                      ← NOUVEAU
│   │   ├── NatureZone.tsx           ← Zone concentrique
│   │   ├── MCPToolNode.tsx          ← Nœud outil MCP
│   │   ├── MemoryNode.tsx           ← Nœud mémoire
│   │   └── TagRootLink.tsx          ← Lien racine par tag
│   ├── svg/                         ← existant (enrichir)
│   │   ├── SvgDefs.tsx
│   │   ├── NodeGfx.tsx              ← enrichir avec nature
│   │   └── EdgeGfx.tsx
│   ├── layout/                      ← existant
│   │   └── TopNav.tsx               ← enrichir (2 nouvelles routes)
│   └── hud/                         ← existant (enrichir)
│       ├── MetricsPanel.tsx          ← enrichir (compteurs nature)
│       ├── LegendPanel.tsx           ← enrichir (légende natures)
│       └── InspectorPanel.tsx       ← enrichir (champ nature)
├── views/
│   ├── CognitiveHeartView.tsx       ← existant (+ ParticleOverlay)
│   ├── LayeredView.tsx              ← existant (+ ParticleOverlay)
│   ├── OrganicView.tsx              ← existant (+ ParticleOverlay)
│   ├── PipelineView.tsx             ← existant (+ ParticleOverlay)
│   ├── DashboardView.tsx            ← existant (enrichir avec nature)
│   ├── TimelineView.tsx             ← NOUVEAU
│   └── MemoryEcosystemView.tsx      ← NOUVEAU
├── hooks/                           ← existant
├── context/                         ← existant
├── utils/
│   ├── matterState.ts               ← existant
│   ├── computeRadius.ts             ← existant
│   └── computeNature.ts             ← NOUVEAU
├── constants/
│   ├── schema.ts                    ← enrichir (zones mémoire, timeline layout)
│   └── theme.ts                     ← enrichir (NATURE_COLORS, nature légende)
└── types/
    └── expanse.ts                   ← enrichir (MemoryNature, RenderNode.nature)
```

---

## 6. CONTRAT DE DONNÉES

### Ce que expanse-graph.json fournit (95%)

| Donnée | Champs | Utilisation |
|--------|--------|-------------|
| Nœuds | id, type, label, content, tags, created_at, centrality | Toutes les vues |
| Arêtes | source, target, type, weight | Particules, liens |
| Types de nœuds | 10 types (APEX..DRIFT) | Layout, couleurs |
| Types d'arêtes | 7 types (DERIVES_FROM..ALTERS) | Couleurs, particules |
| Temporalité | created_at | Timeline |
| Tags | tags[] | Natures, filtres, racines mémoire |

### Ce qui est calculé côté frontend (5%)

| Donnée | Source | Calcul |
|--------|--------|--------|
| Matter state | tags | computeMatterState() — existant |
| Curtain | tags, type | computeCurtain() — existant |
| **Nature Mnemolite** | tags | computeNature() — NOUVEAU |
| Position organes | type | Layout trigonométrique — existant |
| Rayon | centrality | computeRadius() — existant |
| Couleur | type, nature | theme.ts — enrichir |
| Tri temporel | created_at | sort() — trivial |

### Données manquantes (à ajouter au générateur en Phase 2)

| Donnée | Actuellement | Idéalement |
|--------|-------------|------------|
| Mutation status (APPLIED/REJECTED/ROLLED_BACK) | Dans tags[] | Champ dédié `status` |
| Outcome score (rate_memory) | Absent | Champ `outcome` sur MEMOIRE |
| Consommé (mark_consumed) | Absent | Champ `consumed` sur MEMOIRE |

**Conclusion Phase 1** : Le JSON existant suffit. Pas besoin de modifier le générateur.

---

## 7. PLAN DE LIVRAISON

### Phase 1a — Natures Mnemolite (0.5 jour)

- [ ] Créer `utils/computeNature.ts`
- [ ] Enrichir `types/expanse.ts` (MemoryNature, RenderNode.nature)
- [ ] Enrichir `constants/theme.ts` (NATURE_COLORS)
- [ ] Enrichir `index.css` (nature- CSS classes)
- [ ] Enrichir NodeGfx avec affichage nature (couleur + CSS class)
- [ ] Enrichir InspectorPanel avec champ "Nature"
- [ ] Enrichir LegendPanel avec légende 4 natures
- [ ] Enrichir MetricsPanel avec compteurs par nature
- [ ] Vérifier : `pnpm run build` passe

### Phase 1b — Particle Engine (1 jour)

- [ ] Créer `components/particles/Particle.ts`
- [ ] Créer `components/particles/ParticleEngine.ts`
- [ ] Créer `components/particles/particleTypes.ts`
- [ ] Créer `components/particles/ParticleOverlay.tsx`
- [ ] Intégrer ParticleOverlay dans CognitiveHeartView
- [ ] Intégrer dans les autres vues (optionnel, via prop)
- [ ] Tester performance (150 particules à 60fps)
- [ ] Vérifier : `pnpm run build` passe

### Phase 1c — Vue Timeline (1 jour)

- [ ] Créer `components/timeline/TimelineAxis.tsx`
- [ ] Créer `components/timeline/TimelineSlider.tsx`
- [ ] Créer `components/timeline/TimelineEventMarker.tsx`
- [ ] Créer `components/timeline/TimelineLane.tsx`
- [ ] Créer `views/TimelineView.tsx`
- [ ] Enrichir `hooks/useHashRouter.ts` (route `#/timeline`)
- [ ] Enrichir `components/layout/TopNav.tsx` (bouton Timeline)
- [ ] Enrichir `constants/schema.ts` (timeline layout constants)
- [ ] Vérifier : `pnpm run build` passe + rendu navigateur

### Phase 2 — Vue Écosystème Mémoire (1 jour)

- [ ] Créer `components/memory/NatureZone.tsx`
- [ ] Créer `components/memory/MCPToolNode.tsx`
- [ ] Créer `components/memory/MemoryNode.tsx`
- [ ] Créer `components/memory/TagRootLink.tsx`
- [ ] Créer `views/MemoryEcosystemView.tsx`
- [ ] Enrichir `hooks/useHashRouter.ts` (route `#/memory`)
- [ ] Enrichir `components/layout/TopNav.tsx` (bouton Memory)
- [ ] Enrichir `constants/schema.ts` (memory layout constants)
- [ ] Vérifier : `pnpm run build` passe + rendu navigateur

### Phase 3 — Enrichissements avancés (0.5 jour)

- [ ] Boot Sequence enrichi (animation processuelle étape par étape)
- [ ] ECS Prism interactif (C×I → L1/L2/L3 décomposition)
- [ ] Particules Mnemolite spécifiques (read/write)
- [ ] Replay temporel (play/pause sur timeline)
- [ ] Export PNG

---

## 8. RISQUES & QUESTIONS OUVERTES

### Risques

| # | Risque | Probabilité | Impact | Mitigation |
|---|--------|-------------|--------|------------|
| R1 | **Performance Canvas2D** avec 150 particules + glow | Moyen | Élevé | OffscreenCanvas pré-rendu. Pas de shadowBlur en temps réel. Budget strict. |
| R2 | **Alignement Canvas ↔ SVG** (coordonnées) | Élevé | Moyen | Même transform (translate+scale). Sync sur viewBox state. Test visuel manuel. |
| R3 | **Timeline surcharge** (167 nœuds en ligne) | Faible | Faible | Lanes par type. Clustering temporel. Slider pour zoom. |
| R4 | **Écosystème mémoire layout** complexe | Moyen | Moyen | Layout déterministe (zones concentriques + angle uniforme). Pas de force sim. |
| R5 | **Collision de noms** (nature vs matter state) | Faible | Faible | Natures = ontologiques (4 niveaux Mnemolite). Matter states = dynamiques (cristal/liquide/vapeur). Ce sont des axes orthogonaux. |

### Questions ouvertes

| # | Question | Proposition |
|---|----------|-------------|
| Q1 | Les particules doivent-elles apparaître sur TOUTES les vues ou juste le Cœur ? | Phase 1b : Cœur Cognitif uniquement. Phase 2 : prop optionnelle sur chaque vue. |
| Q2 | La Timeline doit-elle avoir un mode "replay" (animation automatique) ? | Phase 3. Phase 1c : slider manuel uniquement. |
| Q3 | Faut-il modifier le générateur `generate-graph.js` pour ajouter des données ? | Phase 1 : Non. Les tags suffisent pour déduire les natures. Phase 2 : peut-être (status, outcome). |
| Q4 | Le Cœur Cognitif existant doit-il être refactoré pour accommoder les particules ? | Minimal. Ajouter `<ParticleOverlay>` comme enfant du `<div>` existant. Pas de refactor du SVG. |
| Q5 | Quelle couleur pour les zones de nature dans l'Écosystème Mémoire ? | Incandescent=rouge/violet, Volatile=jaune/orange, Vivide=vert, Permanent=bleu/lavender. Cohérent avec le Blueprint Mémoire. |

---

## 9. CRITÈRES D'ACCEPTATION

L'EPIC Phase 1 est complète quand :

1. ✅ `pnpm dev` affiche le cortex avec 7 vues (5 existantes + Timeline + Memory)
2. ✅ Les particules courent le long des arêtes du Cœur Cognitif à 60fps
3. ✅ La Timeline montre les mutations et patterns dans l'ordre chronologique
4. ✅ L'Écosystème Mémoire montre les 4 zones de nature avec les outils MCP au centre
5. ✅ Toutes les vues affichent la nature Mnemolite (couleur + CSS)
6. ✅ L'inspecteur montre le champ "Nature"
7. ✅ `pnpm run build` passe sans erreur TypeScript
8. ✅ Aucun cast `any`, aucun champ UI dans le JSON

---

> Ce n'est pas un projet. C'est un organisme. Il ne fait rien d'autre que montrer Expanse tel qu'il respire. Exactement comme le dashboard, mais vivant.
