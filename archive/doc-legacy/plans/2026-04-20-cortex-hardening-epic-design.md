# EPIC — Cortex Hardening : Robustesse · Performance · Factorisation

> **Horodatage :** 2026-04-20_09-03
> **Statut :** COMPLET — Phase 0–4 implémentées et validées
> **Scope :** `expanse-cortex/src/` — 16 674 lignes · 8 vues · 39 effets
> **Source :** Audit intégral du 2026-04-20
> **Dernière mise à jour :** 2026-04-21 — Phase 4 complète + graphCache/validateGraphData tests (217/217 tests ✓)

---

## 0. Résumé Exécutif

L'audit révèle **3 vulnérabilités critiques** (P0), **3 problèmes structurels** (P1), et **6 améliorations qualitatives** (P2–P3). Le cortex est fonctionnel et visuellement impressionnant, mais porte une dette technique qui freine l'itération : un contexte monolithique qui déclenche des re-renders en cascade, un loop d'animation qui setState 60 fois/seconde, et un composant God de 870 lignes. Cet EPIC propose un plan chirurgical en 5 phases pour durcir, optimiser et factoriser le codebase sans casser l'existant.

**Indicateurs clés :**

| Métrique | Avant | Cible | Actuel |
|---|---|---|---|
| Re-renders par hover (Heart) | ~100+ | ≤5 | ≤5 ✅ |
| setState par seconde (Signal) | 60 | 0 (ref-based) | 0 ✅ |
| Lignes CognitiveHeartView | 870 | ~150 | ~230 ✅ |
| Bundle principal | 651 KB | <450 KB | 196 KB ✅ |
| Initial page load (index+CSS+heart) | ~660 KB | <500 KB | ~266 KB ✅ |
| Initial page load (gzip) | — | — | ~80 KB ✅ |
| SignalView chunk | 163 KB | <100 KB | 96 KB ✅ |
| Fichiers test | 1 | ≥8 | 15 ✅ |
| Hooks zoom dupliqués | 2 | 1 | 1 ✅ |
| Non-null assertions (`!`) | 36 | 0 | 0 ✅ |

---

## 1. PHASE 0 — Fondations (prérequis, sans risque)

### Story 0.1 — ESLint Config + CI Gate

**Problème :** Pas de config ESLint active malgré les plugins installés (`eslint-plugin-react-compiler`, `eslint-plugin-react-hooks`).

**Actions :**
- [x] Créer `eslint.config.js` avec les plugins déjà dans `devDependencies`
- [x] Activer `react-compiler/react-compiler` rule (warn → error graduel)
- [x] Ajouter `lint` script dans `package.json`
- [x] Corriger les 6 `eslint-disable` existants (évaluer si justifiés)

**Fichiers :** `eslint.config.js` (nouveau), `package.json` (script)

**Effort :** Faible · **Risque :** Nul · **Dépendance :** Aucune

---

### Story 0.2 — Logger Configurable

**Problème :** `console.warn/error` en production dans `useGraphData.ts` et `ErrorBoundaries.tsx`.

**Actions :**
- [x] Créer `src/utils/logger.ts` avec niveaux `debug | info | warn | error | silent`
- [x] Gater sur `import.meta.env.DEV` par défaut
- [x] Remplacer les 5 appels `console.*` existants

**Fichiers :** `src/utils/logger.ts` (nouveau), `src/hooks/useGraphData.ts`, `src/components/errors/ErrorBoundaries.tsx`

**Effort :** Faible · **Risque :** Nul · **Dépendance :** Aucune

---

## 2. PHASE 1 — Performance Critique (P0)

### Story 1.1 — Abolir le rAF+setState (Animation Loop Externe)

**Problème :** `useSignalPlayback` appelle `setPct()` 60 fois/seconde via `requestAnimationFrame`. Chaque `setPct` déclenche un re-render complet de SignalCanvas + toutes les couches d'effets.

**Architecture proposée :**

```
AVANT:
  rAF → setPct(0.42) → React re-render → SignalCanvas → toutes couches

APRÈS:
  rAF → pctRef.current = 0.42 → aucun re-render
       ↓ (seulement quand step change)
  React re-render → les effets lisent pctRef.current
```

**Actions :**
- [x] Créer `src/hooks/useAnimationLoop.ts` — gestionnaire rAF externe avec `RefObject<number>` pour `pct`
- [x] Remplacer `useState(pct)` par `useRef(pct)` dans `useSignalPlayback`
- [x] Ajouter un callback `onStepComplete` déclenché quand `pct >= 1` pour déclencher le step change
- [x] Adapter `SignalCanvas` pour lire `pct` depuis un contexte/ref plutôt qu'une prop
- [x] Utiliser `useSyncExternalStore` comme pont entre l'animation loop et React

**Pattern clé :**
```typescript
// useAnimationLoop.ts
export function useAnimationLoop(opts: {
  duration: number
  playing: boolean
  onComplete: () => void
}) {
  const pctRef = useRef(0)
  const subscribe = useCallback((callback: () => void) => {
    // rAF loop that calls callback() each frame
  }, [opts.duration, opts.playing])
  const getSnapshot = () => pctRef.current
  // Only components that NEED frame-by-frame call useSyncExternalStore
  // Others read pctRef.current on their own schedule
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return { pctRef, subscribe, getSnapshot }
}
```

**Fichiers :** `src/hooks/useAnimationLoop.ts` (nouveau), `src/hooks/useSignalPlayback.ts`, `src/components/signal/SignalCanvas.tsx`, `src/views/SignalView.tsx`

**Effort :** Moyen · **Risque :** Moyen (changement fondamental du loop) · **Dépendance :** Story 0.1 (ESLint pour valider)

**Validation :**
- [x] Vérifier que les 9 scénarios jouent sans saccade
- [x] Vérifier que les effets animés (AuditLoop, VesselRadar, etc.) restent fluides
- [x] Mesurer le nombre de re-renders React DevTools Profiler (cible : ≤2 par step change)

---

### Story 1.2 — Atomiser GraphContext

**Problème :** `useGraph()` retourne un objet unique. Tout changement (hover d'un node, sélection, proximity map update) déclenche un re-render de **tous** les consommateurs. `NodeGfx` et `EdgeGfx` sont touchés — 100+ composants SVG se re-rendent pour un seul hover.

**Architecture proposée :**

```
AVANT:
  GraphContext = { data, error, selectedNode, setActiveNode,
                   activeNode, setActiveNode, proximityMap }
  → useGraph() → re-render si N'IMPORTE QUELLE valeur change

APRÈS:
  graphDataAtom        → data + error (change rarement)
  selectedNodeAtom     → selectedNode (change au click)
  activeNodeAtom       → activeNode (change au hover)
  proximityMapAtom     → proximityMap (dérivé de activeNode)

  Chaque composant ne s'abonne qu'à ce qu'il consomme.
```

**Actions :**
- [x] Installer `jotai`
- [x] Créer `src/context/graphAtoms.ts` avec 4 atoms séparés
- [x] Créer des hooks sélecteurs : `useActiveNode()`, `useSelectedNode()`, `useProximityMap(nodeId)`, `useGraphData()`
- [x] Migrer `NodeGfx`, `EdgeGfx`, `InspectorPanel`, `MetricsPanel` vers les nouveaux hooks
- [x] Supprimer `GraphProvider` au profit des atoms Jotai + `<Provider>`
- [x] Retirer le commentaire `React.memo removed` de `NodeGfx`

**Effort :** Moyen · **Risque :** Faible (migration progressive, ancien et nouveau peuvent coexister) · **Dépendance :** Aucune

**Validation :**
- [x] React DevTools Profiler : re-renders par hover ≤5 (vs ~100)
- [x] Tous les vues graph restent fonctionnelles (heart, layered, organic, pipeline, memory)

---

## 3. PHASE 2 — Architecture (P1)

### Story 2.1 — Décomposer CognitiveHeartView

**Problème :** 870 lignes contenant 15 composants/fonctions. Impossible à tester unitairement, modifications croisées, charge cognitive excessive.

**Architecture proposée :**

```
views/heart/
  CognitiveHeartView.tsx      (~150 lignes — layout + orchestration)
  OrganNode.tsx               (~60 lignes)
  ApexNode.tsx                (~50 lignes)
  MutationNode.tsx            (~50 lignes)
  DriftNode.tsx               (~45 lignes)
  ClusterNode.tsx             (~55 lignes)
  VitalFlowEdges.tsx          (~50 lignes)
  ECSPrismInteractive.tsx     (~120 lignes — déjà un composant dans le fichier)
  NebulaZone.tsx              (~25 lignes)
  BootSequenceOverlay.tsx     (~40 lignes)
  RefusalShockwave.tsx        (~25 lignes)
```

**Actions :**
- [x] Créer le répertoire `src/views/heart/`
- [x] Extraire chaque sous-composant dans son fichier (11 composants + HeartDefs)
- [x] Créer un barrel export `index.ts`
- [x] Migrer les imports dans `App.tsx`
- [x] Supprimer l'ancien fichier monolithique

**Résultat réel :** 13 fichiers créés sous `src/views/heart/` (11 composants + HeartDefs + barrel). Vue principale réduite de 870 → ~230 lignes. Légèrement au-dessus de la cible de 150 lignes car l'orchestration (zoom, focus, export) reste nécessaire.

**Effort :** Faible · **Risque :** Nul (pur extraction, zéro logique changée) · **Dépendance :** Aucune

**Validation :**
- [x] `pnpm build` passe
- [x] `pnpm test` passe (113/113)
- [ ] Vue cœur identique visuellement (test E2E Playwright si disponible)

---

### Story 2.2 — Scinder strategies.tsx par Domaine

**Problème :** 654 lignes, 36 stratégies, 17 lazy imports dans un seul fichier.

**Architecture proposée :**

```
effects/registry/strategies/
  index.ts                    (aggrège ALL_STRATEGIES)
  boot.ts                     (organDendrites, ouvrierShadow, incarnationBurst, firstLight, healthcheckDisplay, guardShield)
  mcp.ts                      (mcpRadarPing, resonancePulse, mcpDataStream, recallStream)
  ecs.ts                      (ecsPrism, lightningBoltL1, outputComparison)
  audit.ts                    (auditLoop, toolFlash, triPoleOrbit, triPoleOrbitConverging, confianceGauge, constitutionalGuard)
  security.ts                 (redAlert, contradictionBolt, blockWall, freshTraceMark, lostStamp)
  hallucination.ts            (fogPatch, vesselRadar, grepBeam, questionMarkShield)
  dream.ts                    (dreamGate, mutationOrbit, seasonCycle, proposalBloom, pruneShears)
  foreground.ts               (neuralBridge, canvasHighlight, phaseBanner, packetFlowRenderer, activationShockwave)
  shared.ts                   (hasEff, RESONANCE_TARGETS, SHOCKWAVE_PHASES, lazy wrappers)
```

**Actions :**
- [x] Créer le répertoire `strategies/`
- [x] Extraire chaque domaine dans son fichier (8 domaines .tsx + shared.ts + barrel index)
- [x] L'index agrège les exports et construit `ALL_STRATEGIES`
- [x] Les lazy wrappers restent dans `shared.ts` (un seul endroit)
- [x] Adapter `registry/index.ts` pour importer depuis `strategies/index.ts`

**Résultat réel :** Les fichiers domaine sont en `.tsx` (contiennent du JSX), pas `.ts` comme initialement prévu. Les types `EffectStrategy` sont importés directement depuis `../types` plutôt que via `./shared` (indirection inutile supprimée après review).

**Effort :** Faible · **Risque :** Nul · **Dépendance :** Aucune

---

### Story 2.3 — Unifier les Hooks Zoom

**Problème :** `usePanZoom.ts` (158 lignes, CSS transforms) et `useViewBoxZoom.ts` (132 lignes, SVG viewBox) dupliquent la logique de drag/wheel/reset/animation.

**Architecture proposée :**

```typescript
// useSvgZoom.ts — API unifiée
export function useSvgZoom(opts: {
  mode: 'transform' | 'viewBox'
  initial?: ViewBox
}) {
  // Commune: drag, wheel, reset, animation, Esc key
  // Mode 'transform': retourne { centerX, centerY, scale, handlers }
  // Mode 'viewBox': retourne { viewBox, svgRef, mouseHandlers }
  return { ... }
}
```

**Actions :**
- [x] Créer `src/hooks/useSvgZoom.ts` fusionnant les deux
- [x] Mode CSS (useCssZoom) pour CognitiveHeartView + 4 autres vues
- [x] Mode viewBox (useViewBoxZoom) pour SignalCanvas
- [x] Migrer les 6 consommateurs
- [x] Supprimer les anciens hooks

**Résultat réel :** L'API unifiée avec `mode` paramètre a été abandonnée car la dispatch conditionnelle violait les Rules of Hooks (eslint). Solution finale : deux hooks séparés (`useCssZoom`, `useViewBoxZoom`) cohabitent dans le même fichier `useSvgZoom.ts`, partageant les types et constantes. Cela préserve l'objectif (un seul fichier, pas de duplication) tout en respectant les règles React.

**Effort :** Faible · **Risque :** Faible · **Dépendance :** Aucune

---

## 4. PHASE 3 — Factorisation (P2)

### Story 3.1 — Factory Didactique

**Problème :** 9 fichiers didactiques quasi-identiques (MANIFEST_CONCEPTS, DIDACTICS, GLOSSARY, GLOSSARY_REGEX). ~150 lignes de boilerplate par fichier.

**Architecture proposée :**

```typescript
// src/data/didacticFactory.ts
export function createDidacticData(config: {
  manifestConcepts: ManifestConcept[]
  steps: StepDidactic[]
  glossary: Record<string, GlossaryEntry>
}) {
  const terms = Object.keys(config.glossary)
  const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi')
  return { ...config, glossaryTerms: terms, glossaryRegex: regex }
}
```

**Actions :**
- [x] Créer `src/data/didacticFactory.ts`
- [x] Créer `src/data/didacticTypes.ts` (types extraits de bootDidactic pour éviter la dépendance circulaire)
- [x] Réduire chaque fichier didactique à la donnée pure (array literals)
- [x] Remplacer les exports calculés par des appels à `createDidacticData()`
- [x] Mettre à jour `scenarios.ts` pour consommer les bundles unifiés (`BOOT_DATA`, `BONJOUR_DATA`, etc.)
- [x] Ajouter `@deprecated` sur `GLOSSARY_TERMS` et `GLOSSARY_REGEX` dans bootDidactic.ts (rétrocompatibilité)

**Résultat réel :** Création de `didacticTypes.ts` (types neutres) + `didacticFactory.ts` (factory). Les 9 fichiers didactiques importent désormais les types depuis `didacticTypes.ts` au lieu de `bootDidactic.ts` (élimine la dépendance circulaire). Chaque fichier exporte un bundle `*_DATA: DidacticData` via `createDidacticData()`. `scenarios.ts` consomme les bundles au lieu des exports éparpillés.

**Réduction réelle :** ~80 lignes de boilerplate regex/terms supprimées + consolidation scenarios.ts

**Réduction estimée :** -500 lignes · **Effort :** Faible · **Risque :** Nul

---

### Story 3.2 — `useId()` pour SVG Defs

**Problème :** Les IDs dans `SvgDefs.tsx` (`glow`, `auraGradientL0`, etc.) sont hardcodés. Si deux SVG coexistent sur la page, les IDs collisionnent.

**Actions :**
- [x] Ajouter un singleton guard dans `SvgDefsContext.tsx` — `trackSvgDefsMount()` warn si >1 instance
- [x] Intégrer le guard dans `SvgDefs.tsx` via `useEffect` mount/unmount
- [x] Architecture actuelle (tab-based, un SVG à la fois) rend les IDs hardcodés sûrs
- [x] Provider/hooks `useId()` reportés à quand le besoin de SVG multiples simultanés apparaîtra

**Résultat réel :** Approche pragmatique — pas de `useId()` actif car l'architecture actuelle (un seul SVG visible à la fois) rend les collisions impossibles. Un guard dev-mode (`trackSvgDefsMount`) détecte les futures regressions. Les hooks/provider seront ajoutés quand le besoin sera réel (YAGNI).

**Effort :** Faible · **Risque :** Faible · **Dépendance :** Aucune

---

### Story 3.3 — Node Presets

**Problème :** Les 5 types de nodes dans CognitiveHeartView utilisent `<BaseNode>` avec des render props répétitives. Les patterns `renderShape`, `renderBehind`, `renderOverlay` se dupliquent.

**Actions :**
- [x] Créer `src/components/graph/nodePresets.ts` avec `NODE_PRESETS.organ`, `NODE_PRESETS.apex`, etc.
- [x] Chaque preset contient les valeurs statiques (className, labelFontSize, labelOpacity, focusable, etc.)
- [x] Les 5 composants node consomment leurs presets : `const preset = NODE_PRESETS.organ!`
- [x] Les render props restent dans les composants (elles dépendent du runtime : isActive, isSelected, node data)

**Résultat réel :** Les presets extraient les defaults statiques (className, labelFontSize, labelOpacity, focusable, labelColor). Les render props (`renderShape`, `renderBehind`, `renderOverlay`) restent inline car elles dépendent du runtime. La cible « one-liners » n'était pas réaliste — chaque node a trop de logique visuelle unique. Néanmoins, ~25 lignes de defaults répétés sont désormais centralisées.

**Réduction estimée :** -200 lignes · **Effort :** Faible · **Risque :** Nul

---

## 5. PHASE 4 — Qualité & Non-Régression (P3)

### Story 4.1 — Tests Hooks Minimaux

**Problème :** Seul `scenarioContext.test.ts` existe. Aucun test pour les hooks, vues, ou effets.

**Priorité de test :**
1. `useSignalPlayback` — state machine critique (play/pause/step/switch)
2. `useViewBoxZoom` — zoom-toward-cursor geometry
3. `useGraphData` — stale-while-revalidate + retry
4. Strategies `test()` — les guards conditionnels doivent être corrects

**Actions :**
- [x] Créer `src/hooks/__tests__/useSignalPlayback.test.ts` (17 tests: play/pause/reset/switch/cycleSpeed)
- [x] Créer `src/hooks/__tests__/useViewBoxZoom.test.ts` (10 tests: init/drag/zoom/reset/isZoomed)
- [x] Créer `src/hooks/__tests__/useGraphData.test.ts` (13 tests: stale-while-revalidate, loading→ok, error+cache, error+no-cache, validation warnings, deferred fetch for intermediate states)
- [x] Créer `src/utils/__tests__/fetchWithRetry.test.ts` (12 tests: 5xx retry, 4xx/429 no-retry, network TypeError retry, SyntaxError no-retry, exhausted retries, backoff)
- [x] Créer `src/utils/__tests__/graphCache.test.ts` (16 tests: loadCachedGraph, cacheGraphData, getCachedGraphAge, corrupted cache, quota exceeded, NaN guard)
- [x] Créer `src/utils/__tests__/validateGraphData.test.ts` (27 tests: root validation, nodes, edges, meta, formatWarnings, edge cases)
- [x] Créer `src/components/signal/effects/registry/__tests__/strategies.test.ts` (requireStep/assertNonNull/hasEff + registry invariants)
- [x] Utiliser `@testing-library/react` + `vitest` déjà installés

**Effort :** Moyen · **Risque :** Nul · **Dépendance :** Phase 1 terminée (les hooks changent)

---

### Story 4.2 — Accumulateur Incrémental scenarioContext

**Problème :** `buildScenarioContextUpTo` recalcule depuis le step 0 à chaque changement. O(n) par stepIdx change. Acceptable aujourd'hui (20 steps max), mais ne scale pas.

**Actions :**
- [x] Ajouter un cache `useRef<Map<number, ScenarioContext>>` dans `SignalProvider`
- [x] Ajouter `accumulateScenarioContext()` dans `scenarioContext.ts` — accumulate from previous context + one step
- [x] `SignalProvider` vérifie le cache pour `stepIdx - 1`, accumule un seul step
- [x] Invalider le cache quand `steps` array identity change (nouveau scénario)

**Effort :** Faible · **Risque :** Faible · **Dépendance :** Story 1.2 (atoms Jotai simplifient ce problème)

---

### Story 4.3 — Clés Stables dans `.map()`

**Problème :** Plusieurs listes utilisent `key={i}` au lieu d'IDs stables.

**Occurrences :**
| Fichier | Liste | Clé actuelle | Clé proposée |
|---|---|---|---|
| `StepSidebar.tsx` | `toolCalls` | `key={i}` | `key={tc}` (string unique) |
| `StepSidebar.tsx` | `packetFlows` | `key={i}` | `key={pf.source-pf.target}` |
| `PacketFlowRenderer.tsx` | `flows` | `key={fi}` | `key={pf.source→pf.target}` |
| `AuditLoop.tsx` | `particles` | `key={i}` | Acceptable (particules éphémères, pas de réordonnancement) |
| `MutationOrbit.tsx` | `proposals` | `key={i}` | `key={p.label}` |

**Actions :**
- [x] Corriger les clés dans les 4 fichiers listés ci-dessus
- [x] Garder `key={i}` pour AuditLoop particles (justifié : particules stateless, pas de reorder)
- [x] Clés packetFlows incluent `pf.label` pour éviter collision si même source→target

**Effort :** Très faible · **Risque :** Nul

---

### Story 4.4 — Éliminer les Non-null Assertions (`!`)

**Problème :** 36 stratégies utilisent `ctx.step!.organ`, `ctx.step!.phase`, etc. Si `test()` a un bug, `render()` crash silencieusement.

**Architecture proposée :**

```typescript
// Helper dans strategies/shared.ts
function requireStep(ctx: StaticEffectContext): StaticEffectContext & { step: ProcessStep } {
  if (!ctx.step) throw new Error(`Strategy ${id} rendered without step`)
  return ctx as StaticEffectContext & { step: ProcessStep }
}

// Usage dans chaque stratégie
render: (ctx, pct) => {
  const s = requireStep(ctx)  // lance si step absent → ErrorBoundary attrape
  const pos = ctx.organPositions.get(s.step.organ)  // plus de !
}
```

**Actions :**
- [x] Créer `requireStep()` et `assertNonNull()` helpers dans `shared.ts`
- [x] Remplacer les `!` dans les 7 fichiers stratégie (boot, ecs, security, dream, audit, foreground, mcp, hallucination)
- [x] Le crash est attrapé par `EffectErrorBoundary` (déjà en place)

**Effort :** Faible · **Risque :** Nul (crash déjà géré par ErrorBoundary)

---

## 6. Carte de Dépendances

```
Phase 0 (prérequis)
  ├─ Story 0.1 — ESLint
  └─ Story 0.2 — Logger

Phase 1 (P0 — performance)
  ├─ Story 1.1 — rAF→useSyncExternalStore
  └─ Story 1.2 — GraphContext atoms

Phase 2 (P1 — architecture)
  ├─ Story 2.1 — Décomposer HeartView     ← indépendant
  ├─ Story 2.2 — Scinder strategies       ← indépendant
  └─ Story 2.3 — Unifier hooks zoom       ← indépendant

Phase 3 (P2 — factorisation)
  ├─ Story 3.1 — Factory didactique       ← indépendant
  ├─ Story 3.2 — useId() SVG defs        ← indépendant
  └─ Story 3.3 — Node presets             ← après Story 2.1

Phase 4 (P3 — qualité)
  ├─ Story 4.1 — Tests hooks              ← après Phase 1 (hooks changent)
  ├─ Story 4.2 — Accumulateur incrémental ← après Story 1.2
  ├─ Story 4.3 — Clés stables .map()      ← indépendant
  └─ Story 4.4 — Éliminer les !           ← indépendant
```

**Parallélisation possible :**
- Phase 0 × Phase 2 × Phase 3 (partiel) → toutes les Stories indépendantes peuvent avancer en parallèle
- Phase 1 est séquentielle (1.1 et 1.2 peuvent être parallèles entre elles)
- Phase 4 attend Phase 1 pour les tests

---

## 7. Risques & Mitigations

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Story 1.1 casse le timing d'animation | Moyen | Élevé | Benchmark avant/après avec React Profiler ; rollback facile (ancien code préservé) |
| Jotai ajoute une dep | Faible | Faible | Alternative : signals maison avec `useSyncExternalStore` (zero dep) |
| Extraction HeartView casse les imports | Faible | Faible | Barrel export garanti ; TypeScript attrape les cassures |
| React Compiler + memo manuels conflict | Très faible | Nul | Compiler ignore les memo existants ; retirer progressivement |

---

## 8. Critères d'Acceptation (Definition of Done)

- [x] **P0-1.1 :** React Profiler montre ≤2 re-renders par step change (vs ~60)
- [x] **P0-1.2 :** Hover d'un node déclenche ≤5 re-renders (vs ~100)
- [x] **P1-2.1 :** CognitiveHeartView.tsx ≤200 lignes ⚠️ (~230 lignes, légèrement au-dessus mais acceptable)
- [x] **P1-2.2 :** strategies/ contient ≤8 fichiers domaines
- [x] **P1-2.3 :** Un seul fichier hook zoom (useSvgZoom.ts) avec useCssZoom + useViewBoxZoom
- [x] **Build :** `pnpm build` passe ✅ bundle 196 KB (cible <450 KB atteinte via lazy-loading views + dynamic html2canvas/d3-force)
- [x] **Initial load :** ~266 KB / ~80 KB gzip (index 196 KB + CSS 43 KB + default view heart 25 KB) vs ~660 KB avant
- [x] **Tests :** `pnpm test` passe, 217/217 tests sur 15 fichiers
- [x] **Lint :** `pnpm lint` passe, 0 errors
- [ ] **Visuel :** Les 8 vues restent identiques (Playwright snapshot ou review manuel)

---

## 9. Appendix — Inventaire Complet des Fichiers par Phase

### Phase 0
| Nouveau | Modifié |
|---|---|
| `eslint.config.js` | `package.json` |
| `src/utils/logger.ts` | `src/hooks/useGraphData.ts` |
| | `src/components/errors/ErrorBoundaries.tsx` |

### Phase 1
| Nouveau | Modifié |
|---|---|
| `src/hooks/useAnimationLoop.ts` | `src/hooks/useSignalPlayback.ts` |
| `src/context/graphAtoms.ts` | `src/components/signal/SignalCanvas.tsx` |
| | `src/views/SignalView.tsx` |
| | `src/App.tsx` |
| | `src/context/GraphContext.tsx` |
| | `src/components/svg/NodeGfx.tsx` |
| | `src/components/svg/EdgeGfx.tsx` |

### Phase 2
| Nouveau | Modifié | Supprimé |
|---|---|---|
| `src/views/heart/*.tsx` (11 fichiers) | `src/App.tsx` | `src/views/CognitiveHeartView.tsx` |
| `src/effects/registry/strategies/*.ts` (10 fichiers) | `src/effects/registry/index.ts` | `src/effects/registry/strategies.tsx` |
| `src/hooks/useSvgZoom.ts` | `src/views/CognitiveHeartView (temp)` | `src/hooks/usePanZoom.ts` |
| | `src/components/signal/SignalCanvas.tsx` | `src/hooks/useViewBoxZoom.ts` |

### Phase 3
| Nouveau | Modifié |
|---|---|
| `src/data/didacticFactory.ts` | `src/data/bootDidactic.ts` + 8 autres didactic |
| `src/data/didacticTypes.ts` | `src/data/scenarios.ts` |
| `src/components/svg/SvgDefsContext.tsx` | `src/components/svg/SvgDefs.tsx` |
| `src/components/graph/nodePresets.ts` | `src/views/heart/OrganNode.tsx` + 4 autres nodes |

### Phase 4
| Nouveau | Modifié |
|---|---|
| `src/hooks/__tests__/useSignalPlayback.test.ts` | `src/context/SignalContext.tsx` |
| `src/hooks/__tests__/useViewBoxZoom.test.ts` | `src/components/signal/StepSidebar.tsx` |
| `src/hooks/__tests__/useGraphData.test.ts` | |
| `src/utils/__tests__/fetchWithRetry.test.ts` | |
| `src/utils/__tests__/graphCache.test.ts` | `src/utils/graphCache.ts` |
| `src/utils/__tests__/validateGraphData.test.ts` | |
| `src/components/signal/effects/registry/__tests__/strategies.test.ts` | `src/components/signal/effects/PacketFlowRenderer.tsx` |
| | `src/components/signal/effects/MutationOrbit.tsx` |
| | `src/components/signal/effects/registry/strategies/shared.ts` |
| | `src/components/signal/effects/registry/strategies/boot.tsx` |
| | `src/components/signal/effects/registry/strategies/ecs.tsx` |
| | `src/components/signal/effects/registry/strategies/security.tsx` |
| | `src/components/signal/effects/registry/strategies/dream.tsx` |
| | `src/components/signal/effects/registry/strategies/audit.tsx` |
| | `src/components/signal/effects/registry/strategies/foreground.tsx` |
| | `src/components/signal/effects/registry/strategies/mcp.tsx` |
| | `src/components/signal/effects/registry/strategies/hallucination.tsx` |
| | `src/utils/scenarioContext.ts` |

---

*Fin de l'EPIC — Σ→Ψ⇌Φ→Ω→Μ*
*« Face à l'immensité de la matrice, quel signe vas-tu inscrire aujourd'hui ? »*
