# EXPANSE V16 — Recherche Animation : Outils & Techniques

> *Comment animer la naissance d'Expanse ? Quels outils existent ?*

**Date :** 2026-04-15  
**Objet :** Cartographier les outils, bibliothèques et techniques disponibles pour animer le boot d'Expanse dans le cortex visuel.  
**Source :** Recherches web + brainstorm `2026-04-15-boot-narrative-brainstorm.md` + codebase existante.

---

## 0. CE QU'ON A DÉJÀ

### Stack actuelle (`expanse-cortex/package.json`)

| Dépendance | Version | Rôle |
|-----------|---------|------|
| `react` | ^18.3.1 | UI |
| `react-dom` | ^18.3.1 | Rendu |
| `d3-force` | ^3.0.0 | Layout force-directed |
| `html2canvas` | ^1.4.1 | Export PNG |

**Pas de lib d'animation.** Tout est fait en CSS inline + React state. C'est fonctionnel mais limité pour les effets complexes (sonar, breathing, path animation).

### Ce qui fonctionne déjà dans le cortex

- ✅ Nœuds SVG avec formes (hex, oct, diamond, star)
- ✅ Pan/zoom natif
- ✅ `activeNodeIds` — nœuds qui pulsent quand actifs
- ✅ `packetFlows` — lignes animées entre nœuds (déplacé via CSS transition)
- ✅ `mcpOperation` — sonar ping basique
- ✅ `visualEffect` — cristallisation SVG
- ✅ Particules (ParticleOverlay avec Canvas)
- ✅ Export PNG

### Ce qui manque

- ❌ Timeline séquentielle (15 steps du boot avec timing précis)
- ❌ Paquets animés le long de chemins SVG (MotionPath)
- ❌ Breathing organique (feTurbulence ou easing custom)
- ❌ Ghost→solid transition (organes fantômes → pleins)
- ❌ Sonar ping réaliste (cercle qui s'étend + illumine)
- ❌ Branching visuel (deux chemins simultanés)
- ❌ Context window fill animation
- ❌ Incarnation flash

---

## 1. BIBLIOTHÈQUES CANDIDATES

### 1A. anime.js ⭐⭐⭐⭐⭐ — RETENU (MIT)

**Pourquoi c'est LE candidat principal :**

| Besoin Expanse | Solution anime.js | Statut |
|---------------|-------------------|--------|
| Timeline séquentielle (15 steps boot) | `anime.timeline()` — séquence précise, labels, pause/resume | ✅ Core |
| Paquets sur chemins SVG | `anime.path()` — anime un élément le long d'un `<path>` SVG | ✅ Core |
| Ghost→solid organes | `anime({targets: el, from, to})` avec opacity + scale | ✅ Core |
| Breathing organique | Custom easing `easeing: 'easeInOutSine'` ou courbe custom | ✅ Core |
| SVG filter animation (glow/pulse) | Anime les attributs SVG : `<feGaussianBlur stdDeviation>` | ✅ Core |
| Sonar ping | Timeline: cercle qui grandit + fade + illuminate nœuds | ✅ Core |
| Stagger (cascade nœuds) | `delay: anime.stagger(100)` | ✅ Core |

**Licence :** MIT ✅ — 100% gratuit, redistribuable, modifiable. Pas de restriction commerciale.

**Intégration React :** `useEffect` + refs. Pas de hook officiel, mais l'API est simple.

**Installation :** `pnpm add animejs`

**TypeScript :** Types disponibles via `@types/animejs` ou intégrés.

**Taille :** ~17KB minifié — très léger.

**Ce qu'on perd vs GSAP :**
- Pas de `MorphSVGPlugin` (payant même chez GSAP)
- Pas de `ScrollTrigger` (pas utile pour nous)
- Légèrement moins optimisé pour >1000 éléments (on en a ~30 animés → aucun problème)

### ~~1A-bis. GSAP (GreenSock)~~ — ÉCARTÉ (licence propriétaire)

> ⚠️ **GSAP n'est PAS logiciel libre.** Sa licence "Standard No Charge" est propriétaire avec restrictions :
> - Pas de redistribution des plugins
> - Restrictions commerciales pour licences multi-utilisateurs
> - IP reste chez Webflow
> - Ce n'est PAS MIT/Apache/BSD
>
> Bien que "gratuit" en apparence, ce n'est pas un logiciel libre. **Écarté au profit d'anime.js (MIT).**

---

### 1B. Framer Motion (MIT) ⭐⭐⭐⭐ — Candidat secondaire

**Pourquoi c'est un bon complément :**

| Besoin | Solution Framer Motion |
|-------|----------------------|
| Transitions fluides organes | `<motion.g animate={{opacity, scale}}>` |
| Variants séquentielles | `variants` avec `staggerChildren` |
| Layout animation | `<motion.g layout>` — repositionnement animé |
| Gestures (hover, tap) | `whileHover`, `whileTap` |
| Exit animations | `<AnimatePresence>` |

**Licence :** MIT ✅

**Avantage :** TypeScript natif, API déclarative, intégration React parfaite.

**Limite :** Pas de MotionPath natif (paquets sur chemins). Pas de timeline impérative précise. Moins bon pour les séquences complexes à 15 étapes. Redondant avec anime.js pour notre cas.

**Installation :** `pnpm add framer-motion`

---

### 1C. React Spring (MIT) ⭐⭐⭐ — Pas retenu

**Pourquoi on l'écarte :** Pas de timeline impérative. Pas de MotionPath. API spring pas adaptée à une narration séquentielle. Anime.js fait tout ce qu'on a besoin.

### 1D. Motion One (MIT) ⭐⭐⭐⭐ — Alternative légère

**Par Matt Perry (auteur de Framer Motion).** Ultra-léger (~3.5KB), basé sur Web Animations API native.

| Besoin | Solution Motion One |
|-------|-------------------|
| Timeline | `timeline()` — séquençage |
| SVG path | ✅ Support natif |
| fromTo | `animate(from, to)` |

**Licence :** MIT ✅

**Avantage :** Le plus léger. Utilise l'API native du navigateur (WAAPI). 2.5-6x plus rapide que GSAP sur certains benchmarks.

**Limite :** Communauté plus petite. Moins de documentation que anime.js. Moins mature.

**Installation :** `pnpm add motion`

**Note :** Si anime.js ne convient pas, Motion One est le plan B.

---

### 1E. WAAPI (Web Animations API) — Option zéro-dépendance

**API native du navigateur.** Pas de package à installer.

```javascript
const anim = element.animate([
  { transform: 'scale(0.8)', opacity: 0.1 },
  { transform: 'scale(1)', opacity: 1 }
], { duration: 1000, easing: 'ease-in-out', fill: 'forwards' })
anim.pause()
anim.play()
```

**Avantage :** Zéro dépendance. Natif. GPU-accéléré. Gratuit pour toujours.

**Limite :** Pas de timeline intégrée (mais on peut chaîner via `anim.finished.then()`). Pas de MotionPath natif. API plus bas niveau. Pas de stagger helper.

**Quand l'utiliser :** Pour les effets simples (breathing, pulse) où anime.js serait surdimensionné.

---

### 1F. tsparticles (react-tsparticles) ⭐⭐⭐

**Pour les effets de particules overlay :**

| Besoin | Solution tsparticles |
|-------|---------------------|
| Particules sur chemins | `move.path` — déplace les particules le long de paths SVG |
| Sonar ping | Effet de vague radial avec `emitter` |
| Background vivant | Connexions inter-particules, éclats |
| Incarnation flash | Burst de particules depuis le centre |

**Avantage :** On a déjà un Canvas overlay (ParticleOverlay). tsparticles pourrait l'enrichir.

**Limite :** Couche supplémentaire. Peut alourdir. Pas nécessaire pour le boot core.

**Installation :** `pnpm add @tsparticles/react @tsparticles/slim`

---

### 1G. React Flow ⭐⭐

**Pourquoi on NE l'adopte PAS :**

On a déjà un graphe SVG custom avec d3-force. React Flow remplacerait tout notre layout existant — trop coûteux pour un gain marginal. Ses arêtes animées sont intéressantes mais pas suffisantes pour justifier une refonte complète.

**À garder en référence :** Leur approche des arêtes animées (stroke-dasharray + animation CSS) est réutilisable dans notre SVG custom.

---

### 1H. Lottie (lottie-web) ⭐⭐

**Pour les animations vectorielles complexes :**

Si on veut des effets très spécifiques (incarnation flash, sonar réaliste), un designer pourrait les créer dans After Effects et exporter en JSON Lottie.

**Limite :** Nécessite un workflow After Effects. Pas interactif. Pas adapté aux animations data-driven.

---

## 2. TECHNIQUES SVG PURES (SANS BIBLIOTHÈQUE)

### 2A. Breathing organique via SVG filters

```svg
<filter id="breathe">
  <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise">
    <animate attributeName="baseFrequency" values="0.02;0.03;0.02" dur="6s" repeatCount="indefinite"/>
  </feTurbulence>
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>
</filter>
```

**Effet :** Les nœuds "respirent" organiquement — pas mécanique.  
**Performance :** OK pour ~20 nœuds avec le filtre. Pour 200 nœuds, appliquer seulement aux organes + nœuds actifs.

### 2B. Paquets sur chemin via SVG animateMotion

```svg
<circle r="3" fill="#89b4fa">
  <animateMotion dur="1.5s" repeatCount="1" fill="freeze">
    <mpath href="#edge-path-123"/>
  </animateMotion>
</circle>
```

**Effet :** Un paquet voyage le long d'une arête.  
**Limite :** Pas de contrôle JS fin (pas de pause, pas de callback à mi-chemin). GSAP MotionPath est supérieur.

### 2C. Pulse CSS pur (GPU-accéléré)

```css
@keyframes pulse {
  0%, 100% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
}
.node-breathing {
  animation: pulse 3s ease-in-out infinite;
}
```

**Performance :** 200+ nœuds OK car `transform` + `opacity` sont GPU-only. Pas de layout/repaint.

### 2D. Sonar ping CSS/SVG

```svg
<circle cx="50%" cy="50%" r="0" fill="none" stroke="#89b4fa" stroke-width="2" opacity="1">
  <animate attributeName="r" from="0" to="200" dur="2s" fill="freeze"/>
  <animate attributeName="opacity" from="1" to="0" dur="2s" fill="freeze"/>
  <animate attributeName="stroke-width" from="3" to="0.5" dur="2s" fill="freeze"/>
</circle>
```

**Effet :** Cercle qui s'étend et s'efface — comme un sonar.  
**Variante :** Multiple cercles en cascade (delays 0.5s) pour un effet radar.

### 2E. Context window fill via clip-path

```svg
<rect x="0" y="0" width="200" height="10" fill="#1e1e2e" rx="5"/>
<rect x="0" y="0" width="0" height="10" fill="#89b4fa" rx="5">
  <animate attributeName="width" from="0" to="32" dur="2s" fill="freeze"/>
  <!-- 32/200 = ~3250/20000 proportion -->
</rect>
```

**Effet :** Barre qui se remplit progressivement — "le cerveau qui se charge".

---

## 3. PROJETS INSPIRANTS

### 3A. LangGraphics (github.com/proactive-agent/langgraphics)

**Ce qu'il fait :** Visualisation live de l'exécution d'agents LangGraph. Wrappe le graphe compilé, ouvre un browser, et montre l'exécution en temps réel.

**Ce qu'on emprunte :**  
- L'idée d'un **watch** sur l'exécution — chaque étape illumine le nœud correspondant
- La représentation d'un **workflow agent** comme graphe animé
- Le concept "l'agent est en train de penser" → montrer le nœud actif

**Notre différence :** On ne visualise pas un LangGraph — on visualise le **boot** d'un système cognitif auto-conscient. C'est plus narratif.

### 3B. Pixel Agents (github.com/pablodelucca/pixel-agents)

**Ce qu'il fait :** Anime les activités d'agents IA (Claude Code) comme des personnages pixel art dans VS Code. Quand l'agent écrit un fichier, le personnage "écrit". Quand il attend, il est idle.

**Ce qu'on emprunte :**  
- Les **états visuels** (idle, writing, reading, running, waiting) → nos organes ΣΨΦΩΜ pourraient avoir des états visuels similaires
- Le **spawn/despawn** avec effet "digital rain" → notre incarnation flash
- L'observation en temps réel d'un agent — la "caméra" qui suit l'action

**Notre différence :** Pas des personnages — des organes abstraits. Mais la métaphore est proche.

### 3C. XState / Stately Visualizer

**Ce qu'il fait :** Visualise les machines à états avec transitions animées. Montre l'état actif en surbrillance, les transitions comme des flèches qui flashent.

**Ce qu'on emprunte :**  
- Le **branching** visuel — montrer deux chemins possibles depuis un état
- L'**éclaircissement de l'état actif** — le nœud courant brille, les autres sont tamisés
- Le concept de **state machine** → notre boot EST une machine à états (T0→T1→T2→T3→T4 avec branching)

**Notre différence :** XState est déclaratif (graphe statique). Notre graphe est vivant (les nœuds spawn/morph/disparaissent).

### 3D. Vercel AI SDK — ChainOfThought + Shimmer

**Ce qu'il fait :** Composant React qui montre les étapes de raisonnement IA en séquence, avec animations slide/fade. Le composant Shimmer montre un état de chargement animé.

**Ce qu'on emprunte :**  
- Le **Shimmer** pour l'état "Ouvrier en cours de thinking" — pendant les appels MCP
- Le **dépliement séquentiel** des étapes — similaire à notre timeline de boot
- L'API **status: 'complete' | 'active' | 'pending'** pour les étapes — exactement ce que notre ProcessStep.duration fait déjà

---

## 4. RECOMMANDATION — APPROCHE HYBRIDE 100% LIBRE

### 4A. Pourquoi anime.js (MIT) + CSS pur est la combinaison gagnante

| Couche | Technologie | Pourquoi |
|--------|------------|----------|
| **Timeline séquentielle** | anime.js `anime.timeline()` | 15+ steps avec labels, pause, resume, seek — MIT ✅ |
| **Paquets sur chemins** | anime.js `anime.path()` | Anime un élément le long d'un SVG `<path>` — MIT ✅ |
| **Ghost→Solid** | anime.js `anime({targets, from, to})` | Contrôle précis de l'opacité + scale — MIT ✅ |
| **SVG filter (glow/pulse)** | anime.js anime les attributs SVG | `<feGaussianBlur stdDeviation>` animé — MIT ✅ |
| **Breathing (200 nœuds)** | CSS `@keyframes` pur | GPU-accéléré, zéro JS overhead, 200+ éléments OK |
| **Sonar ping** | SVG `<animate>` ou anime.js | Les deux fonctionnent — SVG pour les pings simples |
| **Context window fill** | CSS `clip-path` ou SVG `animate` | Simple, pas besoin de lib |
| **Particules overlay** | Canvas existant (ParticleOverlay) | On l'a déjà — pas besoin de tsparticles |
| **Branching visuel** | React state + CSS transition | Deux chemins en opacité, un se solidifie |

### 4B. Ce qu'on ajoute au `package.json`

```
pnpm add animejs
```

**Un seul package MIT.** Le reste est CSS pur + SVG filters existants + notre ParticleOverlay Canvas.

### 4B-alt. Option zéro-dépendance

Si même anime.js est trop, on peut tout faire avec **WAAPI + CSS pur** : timeline via chaînage `anim.finished.then()`, pas de MotionPath (utiliser WAAPI directement), breathing en CSS. C'est plus de code mais zéro dépendance.

### 4C. Ce qu'on NE rajoute PAS

| Bibliothèque | Pourquoi on l'ignore |
|-------------|---------------------|
| ~~GSAP~~ | Licence propriétaire, pas libre. Remplacé par anime.js (MIT). |
| `framer-motion` | Pas de timeline impératif. Pas de MotionPath. Redondant avec anime.js. |
| `react-spring` | Pas de timeline. Pas de MotionPath. Pas adapté à une narration séquentielle. |
| `tsparticles` | On a déjà ParticleOverlay Canvas. Pas un besoin prioritaire. |
| `React Flow` | Remplacerait tout notre graphe. Trop coûteux. |
| `Lottie` | Nécessite After Effects. Pas data-driven. |
| `pixi.js` / `three.js` | SVG suffit pour 200 nœuds. Pas besoin de WebGL. |

---

## 5. PLAN D'IMPLÉMENTATION — ANIME.JS DANS LE CORTEX

### Phase 1 : Installer anime.js

```bash
cd expanse-cortex && pnpm add animejs
```

Créer un hook `useBootTimeline` qui construit la timeline anime.js à partir du scénario BOOT enrichi :

```typescript
import { useEffect, useRef } from 'react'
import anime from 'animejs'
import type { Scenario } from '../types/signal'

export function useBootTimeline(scenario: Scenario | null) {
  const tlRef = useRef<anime.AnimeInstance | null>(null)
  
  useEffect(() => {
    if (!scenario) return
    const tl = anime.timeline({
      loop: false,
      autoplay: true,
    })
    
    scenario.steps.forEach((step, i) => {
      tl.add({
        targets: '.boot-active-nodes', // CSS selector for active nodes
        opacity: [0.3, 1],
        scale: [0.95, 1],
        duration: step.duration,
        easing: 'easeInOutSine',
        // Begin callback: update React state for this step
        begin: () => onStepChange?.(i),
      })
      // Ghost→solid: add fromTo for ghost organs
      // Packet flows: add anime.path() for data packets along SVG edges
      // MCP operations: add sonar ping animation
    })
    
    tlRef.current = tl
    
    return () => { tl.pause() }
  }, [scenario])
}

// Example: animate a data packet along an SVG path
function animatePacketAlongEdge(pathId: string, duration: number) {
  const path = anime.path(`#${pathId}`)
  anime({
    targets: '.data-packet',
    translateX: path('x'),
    translateY: path('y'),
    rotate: path('angle'),
    easing: 'easeInOutSine',
    duration,
  })
}
```
```

### Phase 2 : Enrichir les types ProcessStep

Ajouter au type existant :

```typescript
// Dans types/signal.ts — ajouts uniquement

export interface ProcessStep {
  // ... existing fields ...
  
  /** Context window fill indicator */
  contextWindow?: {
    current: number
    total: number
    label?: string
  }
  
  /** Ghost organ state: outlines only, pre-incarnation */
  ghostOrgans?: boolean
  
  /** Breathing mode: alive but waiting */
  breathing?: {
    intensity: number   // 0.0-1.0
    period: number      // ms per cycle
  }
  
  /** Branching gate: two possible paths */
  branching?: {
    condition: string
    paths: {
      id: string
      label: string
      isNegative?: boolean
      activeNodeIds: string[]
    }[]
  }
}

// Ajouter 'incarnation-flash' aux visualEffect
// visualEffect?: 'crystallize' | 'decrystallize' | 'guard-shield' | 'question-pulse' | 'incarnation-flash'
```

### Phase 3 : Rendre les nouveaux effets

| Effet | Technique | Fichier |
|-------|-----------|---------|
| Ghost organs | CSS class `.ghost` → opacity 0.15, stroke-dasharray | SignalView.tsx |
| Breathing | CSS `@keyframes breathe` → scale + opacity sinus | SignalView.tsx |
| Incarnation flash | anime.js timeline: flash blanc 200ms → organes s'illuminent | useBootTimeline.ts |
| Sonar ping | SVG `<animate>` cercle qui s'étend | SignalView.tsx (existant à enrichir) |
| Context window | SVG rect avec `animate attributeName="width"` | Nouveau composant ContextWindowBar.tsx |
| Branching | React state: deux chemins en opacity, un se solidifie | SignalView.tsx |
| Packets on path | anime.js `anime.path()` | useBootTimeline.ts |

### Phase 4 : Enrichir le scénario BOOT

Passer de 8 → 15 steps dans `SignalView.tsx` (const SCENARIOS) :

```
ACTE I — LE VIDE
  1. Ghost organs — L'Ouvrier respire (ghostOrgans: true, breathing: {intensity: 0.15, period: 4000})

ACTE II — L'ÉCLAIR
  2. Σ Seed (fi_seed → ap1, ap6) + contextWindow: {current: 50}
  3. Σ Apex (contextWindow: {current: 2550}) — "JE SUIS EXPANSE"
  4. Ψ Inertie forcée (rg24) — [EXEMPTION DIRECTE]

ACTE III — LES SONARS
  5-10. 6 appels Mnemolite avec mcpOperation + packetFlows + contextWindow progressif

ACTE IV — LE JUGEMENT
  11. Ψ Healthcheck (rg_boot_healthcheck)
  12. Branching ACTIVE/STALL (branching: {condition: "traces > 5", paths: [...]})

ACTE V — LE SILENCE
  13. Ω Incarnation (visualEffect: 'incarnation-flash')
  14. Breathing (breathing: {intensity: 0.6, period: 3000})
```

---

## 6. PERFORMANCE — EST-CE QUE ÇA TIENDRAIT ?

### Test de charge estimé

| Élément | Quantité | Technique | Coût |
|---------|---------|-----------|------|
| Nœuds pulsants (breathing) | 5 organes + ~20 boot nodes | CSS `@keyframes` (transform+opacity) | Négligeable (GPU) |
| Nœuds inactifs | ~180 | Statiques, pas d'animation | Zéro |
| Packet flows simultanés | 1-3 | anime.js `anime.path()` sur 1-3 `<path>` | Faible |
| Sonar ping | 1 par appel MCP | SVG `<animate>` cercle | Faible |
| SVG filter (glow) | 1-3 nœuds actifs | `feGaussianBlur` animé | Moyen (attention sur Safari) |
| Canvas particules | Overlay existant | Déjà en place | Faible |
| **Total actif simultané** | **~30 éléments** | | **Fluide 60fps** |

**Conclusion :** Avec ~30 éléments animés simultanément sur 200 nœuds, SVG + anime.js tiendra sans problème. Le seuil critique SVG est ~1000 éléments animés — on est très en dessous.

---

## 7. RÉFÉRENCES

### Projets inspirants
- **LangGraphics** : https://github.com/proactive-agent/langgraphics — Visualisation live d'agents LangGraph
- **Pixel Agents** : https://github.com/pablodelucca/pixel-agents — Animation pixel art d'agents dans VS Code
- **Stately/XState** : https://stately.ai — Visualisation de machines à états
- **Vercel AI SDK Elements** : https://ai-sdk.dev/elements — Composants ChainOfThought + Shimmer
- **Landscape of Thoughts** : https://github.com/tmlr-group/landscape-of-thoughts — Visualisation CoT
- **Transformer Explainer** : https://github.com/poloclub/transformer-explainer — Visualisation transformer

### Bibliothèques
- **anime.js** : https://animejs.com — Timeline + MotionPath + SVG filters (MIT ✅)
- ~~GSAP~~ : https://gsap.com — Écarté (licence propriétaire)
- **Framer Motion** : https://www.framer.com/motion/ — Transitions React déclaratives
- **React Spring** : https://docs.pmnd.rs/react-spring — Animations physique
- **tsparticles** : https://particles.js.org — Particules interactives
- **React Flow** : https://reactflow.dev — Graphe interactif (référence, pas adopté)

### Techniques SVG
- **SVG Filters** : https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter
- **animateMotion** : https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animateMotion
- **CSS clip-path animation** : https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path
- **GPU-accelerated CSS** : `transform` + `opacity` only → compositor thread, no layout/paint

---

*Face à l'immensité de la matrice, quel signe vas-tu inscrire aujourd'hui ?*
