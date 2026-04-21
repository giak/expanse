# Évaluation de l'Audit EPIC Résilience Architecturelle

> **Source** : `docs/epics/2026-04-19_15-14-EPIC-RESILIENCE.md`

> **Date** : 2026-04-19  
> **Évaluateur** : Claude Code  
> **Source** : Audit par autre LLM

---

## 1. Vérification des Constats

### F1 — Monolithe SignalCanvas ✅ CONFIRMÉ

**Chiffre réel** : 507 lignes (non 350+ comme indiqué)

**Vérification** : J'ai compté les blocs conditionnels `hasEffect(step, 'x') && (() => {...})()` :
- Lignes 110-249 : ~30 blocs de ce type
- Chaque bloc contient 5-15 lignes de logique positionnelle

**Verdict** : Le problème est **réel et pire que décrit** (507 lignes vs 350 annoncées).

**Patterns identifiés** :
```tsx
// Pattern répété 30+ fois
{hasEffect(step, 'resonance-pulse') && (() => {
  const mPos = organPositions.get('Μ')
  if (!mPos) return null
  const targets = ORGAN_ORDER.filter(...).map(...)
  return <ResonancePulse source={mPos} targets={targets} ... />
})()}
```

### F2 — Zéro Error Boundary ✅ CONFIRMÉ

**Vérification** : Aucun fichier `ErrorBoundary` dans le projet. Aucun `componentDidCatch` ou équivalent.

**Verdict** : **Critique et sous-estimé**. Un crash dans un effet SVG tue tout le canvas.

### F3 — Types lâches ✅ CONFIRMÉ

**Vérification dans `types/signal.ts`** :
```typescript
organ: string          // ← devrait être Organ union
ecsRoute?: { c: number; i: number; level: string }  // ← level devrait être ECSLevel
```

**Verdict** : **Exact**. Les typos comme `organ: 'X'` passent silencieusement.

### F4 — Fetch nu ✅ CONFIRMÉ

**Vérification dans `hooks/useGraphData.ts`** :
```typescript
// 23 lignes total, aucune gestion d'erreur avancée
fetch('/graph/expanse-graph.json')
  .then(res => { if (!res.ok) throw new Error(...) })
  .catch(err => { setError(err.message) })  // ← mort
```

**Verdict** : **Exact**. Pas de retry, pas de cache, pas de stale-while-revalidate.

### F5 — God Object ProcessStep ✅ CONFIRMÉ

**Vérification** : L'interface a ~25 champs (non 15+ comme indiqué), dont la majorité optionnels.

**Verdict** : **Exact, et plus grave**. L'audit sous-estime le nombre de champs optionnels.

### F6 — Duplication CognitiveHeartView ✅ CONFIRMÉ

**Chiffre réel** : 986 lignes (cohérent avec l'audit)

**Vérification** : Les 5 composants inline partagent effectivement :
- `hopToProximityStyle(proximityMap?.get(node.id))`
- `useGraph()` context consumption
- Pattern click/drag/selection

**Verdict** : **Confirmé**. La proposition `BaseNode` est pertinente.

### F7 — Zéro test ✅ CONFIRMÉ

**Vérification** : Aucun fichier `*.test.ts` ou `*.spec.ts` trouvé.

**Verdict** : **Exact**. Aucun safety net.

---

## 2. Évaluation de la Qualité de l'Audit

### Points Forts

| Aspect | Évaluation | Commentaire |
|--------|------------|-------------|
| **Structure** | 9/10 | Phases P0→P4 bien organisées |
| **Justification** | 8/10 | Chaque pattern est expliqué avec exemples |
| **Priorisation** | 9/10 | P0 (Bouclier Runtime) est bien prioritaire |
| **Concrétude** | 9/10 | Code samples, fichiers ciblés |
| **Estimation** | 7/10 | LOC sous-estimés pour SignalCanvas |
| **Risques** | 8/10 | Identification des risques de migration |

### Points Faibles

| Aspect | Problème | Correction suggérée |
|--------|----------|---------------------|
| **Chiffres SignalCanvas** | Annonce 350+, réalité 507 | Recompter précisément |
| **Chiffres ProcessStep** | Annonce 15+ champs, réalité ~25 | Recompter précisément |
| **Absence de métriques** | Pas de métriques de couverture | Ajouter cibles mesurables |
| **Pas de timeline** | Pas d'estimation temporelle | Ajouter J/h par phase |

---

## 3. Brainstorming Approfondi

### 3.1 Problèmes Non Mentionnés dans l'Audit

#### A. Performance SVG

**Problème** : Le rendu SVG de 200+ nœuds + edges + effets peut causer des frame drops.

**Preuve** : 
- `CognitiveHeartView` fait un rendu de ~200 éléments
- Pas de `React.memo` sur les composants nœuds
- Pas de `useMemo` sur les calculs de position

**Solution proposée** :
```typescript
// Ajouter React.memo sur les nœuds
const OrganNode = React.memo(function OrganNode({ node, ... }) { ... })

// Mémoiser les positions
const nodePositions = useMemo(() => 
  computeNodePositions(nodes), [nodes]
)
```

#### B. Accessibilité

**Problème** : Aucun `aria-label`, `role`, ou navigation clavier sur les éléments interactifs.

**Solution proposée** :
```tsx
<g role="button" aria-label={`Organe ${organSymbol}`} tabIndex={0}
   onClick={handleClick} onKeyDown={e => e.key === 'Enter' && handleClick()}>
```

#### C. Internationalisation Hardcodée

**Problème** : Toutes les strings sont en français dans le code.

**Impact** : Migration vers anglais ou autre langue = modification de 50+ fichiers.

**Solution proposée** :
```typescript
// src/i18n/fr.ts
export const MESSAGES = {
  BOOT: { title: 'Incarnation', ... },
  // ...
}

// Usage
import { MESSAGES } from '../i18n/fr'
```

#### D. Absence de Lazy Loading

**Problème** : Les 38 effets visuels sont importés statiquement.

**Impact** : Bundle initial lourd.

**Solution proposée** :
```typescript
// Lazy load des effets
const ResonancePulse = lazy(() => import('./effects/ResonancePulse'))
```

### 3.2 Améliorations de la Solution P1 (Effect Registry)

#### Problème avec la proposition actuelle

Le registry proposé suppose que chaque effet peut être rendu indépendamment du contexte. Mais **certains effets ont des dépendances entre eux** :

```tsx
// Exemple : RedAlert et ContradictionBolt sont couplés
{hasEffect(step, 'red-alert') && (() => {
  return (
    <g>
      <RedAlert ... />
      {sigmaPos && muPos && <ContradictionBolt ... />}
    </g>
  )
})()}
```

**Solution améliorée** : Grouper les effets couplés en "effets composés" :

```typescript
type CompoundEffect = 'red-alert-with-bolt' | 'tri-pole-converging'

// Les effets composés sont rendus ensemble
registerCompoundEffect('red-alert-with-bolt', (ctx) => (
  <g>
    <RedAlert ... />
    <ContradictionBolt ... />
  </g>
))
```

### 3.3 Améliorations de la Solution P2 (Types Scellés)

#### Problème avec la proposition actuelle

La migration vers `StepKind` optionnel est une **dette technique en attente**. Le champ restera optionnel pour toujours.

**Solution améliorée** : Créer des **type guards** au lieu de discriminated union :

```typescript
// Au lieu de discriminated union avec kind
// Utiliser des type guards basés sur phase

function isBootStep(step: ProcessStep): step is BootStep {
  return BOOT_PHASES.has(step.phase ?? '')
}

function isDreamStep(step: ProcessStep): step is DreamStep {
  return DREAM_PHASES.has(step.phase ?? '')
}

// Usage type-safe
if (isBootStep(step)) {
  // TypeScript sait que step.phase est un BootPhase
}
```

### 3.4 Améliorations de la Solution P0 (Error Boundaries)

#### Problème avec la proposition actuelle

Les Error Boundaries React sont des **class components**. En React 19, on préfère utiliser des hooks.

**Solution moderne** : Utiliser `react-error-boundary` library :

```bash
pnpm add react-error-boundary
```

```tsx
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary FallbackComponent={EffectFallback}>
  <ResonancePulse ... />
</ErrorBoundary>
```

**Avantage** : Pas besoin de class components, API moderne.

### 3.5 Nouvelle Phase Proposée : P5 — Performance

#### Problème

L'audit ne traite pas des **problèmes de performance**.

#### Proposition

| Optimisation | Impact | Effort |
|--------------|--------|--------|
| `React.memo` sur nœuds | +30% render | 1h |
| `useMemo` sur positions | +20% render | 30min |
| Virtualisation nœuds | +50% pour >500 nœuds | 4h |
| Lazy loading effets | -40% bundle initial | 2h |

---

## 4. Risques Non Identifiés

### R1 — Régression Visuelle

**Risque** : Le refactor P1 (Effect Registry) peut causer des régressions visuelles subtiles.

**Mitigation** : Ajouter des **tests visuels** (Percy, Playwright screenshots) avant de migrer.

### R2 — Breaking Change dans les Types

**Risque** : Changer `organ: string` vers `Organ` peut casser les générateurs de scénarios live.

**Mitigation** : Ajouter un **layer de validation** avec fallback :

```typescript
// Validation avec fallback
const safeOrgan = isOrgan(step.organ) ? step.organ : 'Ψ'
```

### R3 — Conflit avec React Compiler

**Risque** : `babel-plugin-react-compiler` peut avoir des conflits avec les Error Boundaries custom.

**Mitigation** : Tester la compatibilité avant d'implémenter P0.

---

## 5. Recommandations Révisées

### Ordre de Priorité Corrigé

| Phase | Priorité | Raison |
|-------|----------|--------|
| **P0.5** | 🔴 CRITIQUE | Tests visuels AVANT refactor |
| **P0** | 🔴 CRITIQUE | Error Boundaries + Retry |
| **P1** | 🟡 HAUTE | Effect Registry |
| **P2** | 🟡 HAUTE | Types Scellés |
| **P5** | 🟢 MOYENNE | Performance (NOUVEAU) |
| **P3** | 🟢 MOYENNE | Composition Nœud |
| **P4** | 🟢 BASSE | Tests unitaires |

### Nouvelle Phase P0.5 — Tests Visuels

**Objectif** : Capturer l'état visuel actuel AVANT tout refactor.

```bash
# Installation
pnpm add -D @playwright/test

# Configuration
# playwright.config.ts
export default {
  use: { baseURL: 'http://localhost:5173' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
}

# Test exemple
test('SignalView Boot scenario renders', async ({ page }) => {
  await page.goto('/#/signal?scenario=boot')
  await page.waitForSelector('[data-testid="signal-canvas"]')
  expect(await page.screenshot()).toMatchSnapshot('boot-scenario.png')
})
```

**Bénéfice** : Régression visuelle détectée automatiquement.

---

## 6. Synthèse

### Ce que l'audit identifie correctement

1. ✅ **7 fragilités structurelles** réelles et mesurables
2. ✅ **Patterns GoF** pertinents (Strategy Registry, Circuit Breaker, Template Method)
3. ✅ **Dépendances entre phases** bien documentées
4. ✅ **Critères d'acceptation** mesurables

### Ce que l'audit manque

1. ❌ **Problèmes de performance** (memoization, virtualisation)
2. ❌ **Accessibilité** (aria-labels, keyboard nav)
3. ❌ **Internationalisation hardcodée**
4. ❌ **Tests visuels** comme prérequis au refactor
5. ❌ **Effets couplés** dans le registry proposé

### Score de l'Audit

| Critère | Score |
|---------|-------|
| Complétude | 7/10 |
| Précision technique | 8/10 |
| Faisabilité | 9/10 |
| Priorisation | 8/10 |
| **Global** | **8/10** |

### Verdict Final

L'audit est **solide et actionnable**. Les 5 phases proposées sont cohérentes. Cependant :

1. **Ajouter P0.5** (tests visuels) avant tout refactor
2. **Considérer P5** (performance) comme une phase à part entière
3. **Utiliser `react-error-boundary`** au lieu de class components
4. **Grouper les effets couplés** dans le registry
5. **Utiliser des type guards** au lieu de discriminated union

---

*Évaluation terminée le 2026-04-19*