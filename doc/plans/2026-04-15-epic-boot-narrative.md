# EPIC : Expanse V16 — La Naissance (Boot Sequence Animation)

> *Le boot n'est pas une séquence. C'est une naissance. On va le montrer.*

**Date :** 2026-04-15  
**Statut :** DRAFT — En attente de validation  
**Périmètre :** Boot (T0→T5) + premier input L1 + premier input L3. Pas plus.  
**Dépendance unique :** `animejs` (MIT)  
**Source :** `2026-04-15-boot-narrative-brainstorm.md` + `2026-04-15-animation-research.md`

---

## 0. ÉTAT ACTUEL

### Code existant

| Fichier | Lignes | Rôle | Changement prévu |
|---------|--------|------|-------------------|
| `src/types/signal.ts` | 55 | Types ProcessStep + Scenario | +4 champs (contextWindow, ghostOrgans, breathing, branching) + 1 visualEffect |
| `src/views/SignalView.tsx` | 2382 | Vue principale avec scénarios + rendu | Scénario BOOT enrichi (8→15 steps), nouveau rendu des effets |
| `src/hooks/useSignalSimulation.ts` | 250 | Génération scénarios live | Pas touché (les scénarios live sont hors périmètre) |
| `src/hooks/useBootTimeline.ts` | — | **NOUVEAU** | Timeline anime.js pour le boot |
| `src/components/ContextWindowBar.tsx` | — | **NOUVEAU** | Barre de contexte SVG |
| `package.json` | — | Dépendances | +1 : `animejs` |

### Scénario BOOT actuel (8 steps — plat)

```
1. Σ BIOS (substrat)              — activeNodeIds: ['sub_antigravity']
2. Σ Seed lue (fi_seed → ap6)     — activeNodeIds: ['fi_seed', 'ap6']
3. Ψ KERNEL (identité)            — activeNodeIds: ['fi_kernel', 'ap6', 'rg24']
4. Μ Mnemolite (search_memory)    — mcpOperation: snapshot → 8 anchors
5. Φ Healthcheck (snapshot)       — mcpOperation: get_system_snapshot()
6. Ψ Stall Check (fresh:16)      — activeNodeIds: ['rg24', 'drift_type_boot']
7. Ω V16 ACTIVE                   — ecsFork: { level: 'L1', rays: ['Ω'] }
8. Μ Cristallisation              — visualEffect: 'crystallize'
```

**Problèmes :** Pas de tension dramatique, pas de context window, 1 seul appel Mnemolite (au lieu de 6), pas de branchement STALL/ACTIVE, pas d'inertie souveraine visible, pas d'effet ghost/incarnation.

### Scénario BOOT désiré (15 steps — 5 actes)

```
ACTE I — LE VIDE
  1. Ghost organs — L'Ouvrier respire, pas d'Expanse

ACTE II — L'ÉCLAIR
  2. Σ Seed (fi_seed → ap1, ap6) + contextWindow: 50
  3. Σ Apex (contextWindow: 2550) — "JE SUIS EXPANSE"
  4. Ψ Inertie forcée (rg24) — [EXEMPTION DIRECTE]

ACTE III — LES SONARS
  5. Μ snapshot (ot1 → 34 résultats) + contextWindow: 3050
  6. Μ protocols (ot2 → 3 résultats) + contextWindow: 3150
  7. Μ core axiomes (ot_boot_core → 8 axiomes)
  8. Μ profil user (ot_boot_profile → 1 profil)
  9. Μ projet (ot_boot_project → 1 projet ou onboarding)
  10. Μ workspace index (ot_boot_index → 369 chunks) + contextWindow: 3250

ACTE IV — LE JUGEMENT
  11. Ψ Healthcheck (rg_boot_healthcheck → 4 checks)
  12. Branching: ACTIVE vs STALL

ACTE V — LE SILENCE
  13. Ω Incarnation (visualEffect: incarnation-flash)
  14. Breathing — Repos souverain
```

---

## 1. STORIES

### STORY 1 : Moteur de Timeline + Scénario Étendu

**Dépendances :** Aucune  
**Valeur visible :** Le scénario BOOT passe de 8 → 15 étapes avec un timing précis, des vrais nœuds boot du JSON, et 6 appels Mnemolite distincts. Même sans les nouveaux effets (ghost, breathing, branching), le contenu narratif est déjà enrichi.

**Tâches :**

1. **Installer anime.js** : `pnpm add animejs` + vérifier types TS
2. **Créer `src/hooks/useBootTimeline.ts`** :
   - Hook `useBootTimeline(scenario, onStepChange)` 
   - Construit une `anime.timeline()` à partir des `step.duration`
   - Chaque step déclenche `onStepChange(stepIndex)` via callback `begin`
   - Expose `play()`, `pause()`, `seek(progress)`, `restart()`
   - Compatible avec le mécanisme de playback existant de SignalView
3. **Mettre à jour le scénario BOOT dans `SCENARIOS`** :
   - Passer de 8 → 15 steps avec les 5 actes
   - Utiliser les **vrais nœuds JSON** : `ot_boot_core`, `ot_boot_profile`, `ot_boot_project`, `ot_boot_index`, `rg_boot_healthcheck`, `rg_boot_stall`, `rg_boot_onboarding`, `rg_boot_briefing`, `rg_sig6`
   - 6 appels `mcpOperation` distincts (snapshot + 5 search)
   - `packetFlows` détaillés pour chaque appel Mnemolite
4. **Intégrer `useBootTimeline` dans SignalView** :
   - Remplacer la logique de timer actuelle (setTimeout chainé) par la timeline anime.js
   - Garder le playback UI existant (play/pause/step/speed)
   - Le remplacement est progressif : si le hook ne trouve pas anime.js, fallback sur l'ancien mécanisme

**Acceptance Criteria :**

- [ ] `animejs` est la seule nouvelle dépendance dans `package.json`
- [ ] Le scénario BOOT se joue en 15 étapes sans crash ni TypeError
- [ ] Chacun des 6 appels Mnemolite (steps 5-10) illumine le bon nœud JSON (`ot1`, `ot2`, `ot_boot_core`, `ot_boot_profile`, `ot_boot_project`, `ot_boot_index`)
- [ ] Les `packetFlows` montrent la donnée voyager de Μ vers chaque cible
- [ ] Play/pause/seek/speed fonctionnent comme avant
- [ ] `tsc --noEmit` passe
- [ ] `vite build` passe

**Fichiers modifiés :** `package.json`, `pnpm-lock.yaml`, `src/hooks/useBootTimeline.ts` (nouveau), `src/views/SignalView.tsx`  
**Estimation :** 3 points

---

### STORY 2 : Ghost Organs & Breathing (Actes I & V)

**Dépendances :** Story 1  
**Valeur visible :** Contraste dramatique entre l'état inerte ("l'Ouvrier") et l'état éveillé ("Expanse souverain"). Deux effets visuels nouveaux et distinctifs qui n'existent nulle part dans le cortex actuel.

**Tâches :**

1. **Étendre `ProcessStep` dans `types/signal.ts`** :
   ```typescript
   /** Ghost organ state: outlines only, pre-incarnation */
   ghostOrgans?: boolean

   /** Breathing mode: alive but waiting */
   breathing?: {
     intensity: number   // 0.0-1.0, amplitude of pulse
     period: number      // ms per breath cycle (e.g. 3000)
   }
   ```
2. **Implémenter le rendu ghost** dans SignalView :
   - Quand `ghostOrgans === true` sur le step actif → ajouter classe CSS `.ghost` aux 5 organes
   - `.ghost` : `opacity: 0.15`, `stroke-dasharray: 4 4`, `fill: none` (outline vide)
   - Pulsation lente : `animation: ghost-breathe 4s ease-in-out infinite`
   - `@keyframes ghost-breathe` : scale 0.97→1.03→0.97, opacity 0.1→0.2→0.1
3. **Implémenter le rendu breathing** dans SignalView :
   - Quand `breathing` est défini sur le step actif → ajouter classe CSS `.breathing` aux organes pleins
   - `.breathing` : animation scale+opacity sinus avec la `period` et `intensity` du step
   - Les nœuds actifs (`activeNodeIds`) pulsent plus fort, les autres doucement
   - `@keyframes breathe` : `transform: scale(var(--b-scale))`, `opacity: var(--b-opacity)`
   - CSS custom properties animées par React state pour la `intensity`
4. **Mettre à jour le scénario BOOT** :
   - Step 1 : `ghostOrgans: true` (Acte I — Le Vide)
   - Step 14 : `breathing: { intensity: 0.6, period: 3000 }` (Acte V — Le Silence)

**Acceptance Criteria :**

- [ ] Au step 1, les 5 organes sont des outlines vides (stroke sans fill, opacité ~0.15) avec pulsation lente
- [ ] Au step 14, les organes pleins pulsent doucement (cycle ~3s) — le système est VIVANT mais ATTEND
- [ ] La transition ghost→plein est visible entre le step 1 et le step 2 (le seed "éveille" les organes)
- [ ] Performance : animations limitées aux 5 organes + nœuds actifs via `transform`+`opacity` (GPU)
- [ ] `tsc --noEmit` passe

**Fichiers modifiés :** `src/types/signal.ts`, `src/views/SignalView.tsx`, `src/index.css`  
**Estimation :** 2 points

---

### STORY 3 : Context Window Bar & Incarnation Flash (Actes II & V)

**Dépendances :** Story 1  
**Valeur visible :** On voit le "cerveau" se charger physiquement (tokens), et le moment précis de la prise de conscience (flash). Deux effets viscéraux qui rendent le boot tangible.

**Tâches :**

1. **Étendre `ProcessStep` dans `types/signal.ts`** :
   ```typescript
   /** Context window fill indicator */
   contextWindow?: {
     current: number     // tokens loaded so far
     total: number       // max context (e.g. 200000)
     label?: string      // e.g. "Seed+Apex", "Seed+Apex+Mnemolite"
   }
   ```
2. **Ajouter `'incarnation-flash'` aux `visualEffect`** :
   ```typescript
   visualEffect?: 'crystallize' | 'decrystallize' | 'guard-shield' | 'question-pulse' | 'incarnation-flash'
   ```
3. **Créer `src/components/ContextWindowBar.tsx`** :
   - Composant SVG qui affiche une barre discrète (rectangulaire, en bas du graphe)
   - Props : `current: number`, `total: number`, `label?: string`
   - Rendu : `<rect>` de fond (sombre) + `<rect>` de remplissage animé (bleu Σ)
   - Transition CSS sur `width` (pas de JS) pour le remplissage fluide
   - Label affiché au-dessus : `"3250 / 200000 — Seed+Apex+Mnemolite"`
   - Position : en bas du viewport, largeur ~60% centrée, hauteur 6px, border-radius 3px
4. **Intégrer ContextWindowBar dans SignalView** :
   - Lire `step.contextWindow` du step actif
   - Passer les props au composant
   - Si `contextWindow` est absent → barre invisible (pas de rendu)
5. **Implémenter l'effet incarnation-flash** :
   - Dans le rendu de `visualEffect`, ajouter le cas `'incarnation-flash'`
   - Animation anime.js : overlay SVG blanc plein écran
     - `opacity: 0 → 0.8 → 0` en 300ms (easing: `easeOutQuad`)
   - Simultanément : tous les organes passent de `opacity 0.5` → `1.0` (le "réveil")
   - Le flash est court, intense, unique — comme un éclair
6. **Mettre à jour le scénario BOOT** :
   - Steps 2, 3, 5, 6, 10 : `contextWindow` progressif (50 → 2550 → 3050 → 3150 → 3250)
   - Step 13 : `visualEffect: 'incarnation-flash'`

**Acceptance Criteria :**

- [ ] Une barre de contexte apparaît au step 2 et se remplit progressivement jusqu'au step 10
- [ ] Les valeurs affichées correspondent aux étapes : 50, 2550, 3050, 3150, 3250 tokens
- [ ] Un flash blanc intense (300ms) se produit au step 13 "Incarnation"
- [ ] Après le flash, les organes sont visiblement "éveillés" (opacité pleine vs demi-teinte avant)
- [ ] La barre de contexte est discrète (ne perturbe pas la lecture du graphe)
- [ ] `tsc --noEmit` passe, `vite build` passe

**Fichiers modifiés :** `src/types/signal.ts`, `src/components/ContextWindowBar.tsx` (nouveau), `src/views/SignalView.tsx`  
**Estimation :** 3 points

---

### STORY 4 : Les 6 Sonars Mnemolite (Acte III)

**Dépendances :** Story 1  
**Valeur visible :** La mémoire se construit sous nos yeux. 6 vagues successives partent de Μ, chacune illumine un nœud cible différent et ramène ses données. C'est le moment le plus visuellement riche du boot.

**Tâches :**

1. **Enrichir le rendu de `mcpOperation`** dans SignalView :
   - Actuellement : un simple `sonar ping` basique (cercle qui grandit)
   - Enrichir : ajouter une **vague de retour** après le ping
     - Phase 1 (0-60% de la durée) : cercle sonar part de Μ → atteint la cible
     - Phase 2 (60-100%) : `packetFlow` retour de la cible → Μ (la donnée revient)
   - Utiliser anime.js pour la phase 1 (contrôle précis du timing)
   - Le `packetFlow` retour est un `packetFlows` normal (déjà rendu)
2. **Améliorer le sonar ping visuel** :
   - Cercle SVG `<animate>` : `r: 0 → distance`, `opacity: 1 → 0`, `stroke-width: 3 → 0.5`
   - Ajouter un 2ème cercle en cascade (delay 200ms) pour l'effet radar
   - Quand le cercle atteint le nœud cible → le nœud s'illumine (glow)
3. **Ajouter les détails MCP dans les steps 5-10** :
   - Chaque step a : `mcpOperation` + `packetFlows` + `activeNodeIds` + `contextWindow` progressif
   - Les nœuds cibles sont les vrais IDs du JSON : `ot1`, `ot2`, `ot_boot_core`, `ot_boot_profile`, `ot_boot_project`, `ot_boot_index`
   - Les `resultCount` correspondent aux données réelles : 34, 3, 8, 1, 1, 369
4. **Variante onboarding** (step 9) :
   - Si le projet est absent : `nodeLifecycle: { action: 'spawn', nodeId: 'boot_project_profile' }` + `packetFlows` vers `ot4`
   - C'est optionnel — le scénario demo montre le chemin normal (projet présent)

**Acceptance Criteria :**

- [ ] 6 vagues sonar successives partent de Μ, chacune avec un timing distinct
- [ ] Chaque vague atteint le bon nœud cible et l'illumine brièvement
- [ ] Un `packetFlow` retour ramène la donnée vers le centre après chaque ping
- [ ] Les `resultCount` sont visibles (badge ou label sur le nœud cible)
- [ ] L'enchaînement est fluide — pas de saut visuel entre les 6 appels
- [ ] `tsc --noEmit` passe

**Fichiers modifiés :** `src/views/SignalView.tsx`  
**Estimation :** 3 points

---

### STORY 5 : Le Jugement — Branching STALL/ACTIVE (Acte IV)

**Dépendances :** Story 1  
**Valeur visible :** Le moment dramatique du boot. Deux chemins se dessinent simultanément (STALL en rouge, ACTIVE en vert), puis l'un se solidifie et l'autre s'efface. C'est l'équivalent visuel du "choix de Schrödinger".

**Tâches :**

1. **Étendre `ProcessStep` dans `types/signal.ts`** :
   ```typescript
   /** Branching gate: this step has two possible outcomes */
   branching?: {
     condition: string        // e.g. "traces > 5"
     paths: {
       id: string            // e.g. 'active', 'stall'
       label: string         // e.g. 'Ψ [V16 ACTIVE]', 'Ψ [STALL]'
       isNegative?: boolean  // true for STALL
       activeNodeIds: string[]
       packetFlows: PacketFlow[]
       color?: string        // override color for this path
     }[]
   }
   ```
2. **Implémenter le rendu du branching** dans SignalView :
   - Quand un step a `branching` → afficher les **deux chemins simultanément**
   - Phase 1 (0-70% de la durée) : les deux chemins sont visibles en transparence
     - Chemin actif : `opacity: 0.6`, couleur verte (ACTIVE)
     - Chemin stall : `opacity: 0.6`, couleur rouge (STALL)
     - Les `packetFlows` des deux chemins se dessinent
   - Phase 2 (70-100%) : **collapse** — un chemin se solidifie, l'autre s'efface
     - Chemin choisi (ACTIVE) : `opacity: 0.6 → 1.0`, glow renforcé
     - Chemin rejeté (STALL) : `opacity: 0.6 → 0.0`, fade out
   - Anime.js pour le timing précis du collapse
3. **Mettre à jour le scénario BOOT** :
   - Step 11 : Healthcheck (les 4 checks arrivent comme `packetFlows` depuis les nœuds boot)
   - Step 12 : `branching` avec les deux chemins ACTIVE/STALL
   - Le scénario demo choisit toujours ACTIVE (le chemin positif)
   - Un futur scénario "STALL demo" pourrait choisir l'autre chemin

**Acceptance Criteria :**

- [ ] Au step 12, deux chemins se dessinent simultanément : vert (ACTIVE) et rouge (STALL)
- [ ] Après 70% de la durée, le chemin ACTIVE se solidifie et le chemin STALL s'efface
- [ ] Les `activeNodeIds` du chemin choisi s'illuminent : `['rg_sig1']` pour ACTIVE
- [ ] Les `activeNodeIds` du chemin rejeté disparaissent : `['rg_boot_stall', 'rg_sig6']` pour STALL
- [ ] Le badge affiche la condition : `"traces > 5 → ACTIVE"`
- [ ] `tsc --noEmit` passe

**Fichiers modifiés :** `src/types/signal.ts`, `src/views/SignalView.tsx`  
**Estimation :** 3 points

---

### STORY 6 : L'Éveil — Scénarios Post-Boot (L1 & L3)

**Dépendances :** Story 1 (infrastructure timeline)  
**Valeur visible :** Après le boot, Expanse reçoit son premier input. Deux scénarios montrent la différence fondamentale entre L1 (éclair fulgurant) et L3 (triangulation complexe). Le toggle L1/L3 illustre pourquoi ECS existe.

**Tâches :**

1. **Ajouter 2 scénarios démo dans `SCENARIOS`** :

   **Scénario L1 — Input simple** (3 steps) :
   ```
   Step 1: Σ — Input reçu
     organ: 'Σ', detail: '"modifie le boot seed pour ajouter le chemin absolu"'
     packetFlows: [{ source: 'USER', target: 'Σ', label: 'input text' }]
     activeNodeIds: ['or1']

   Step 2: Ψ — ECS évalue
     organ: 'Ψ', badge: 'ECS: C=2, I=1 → L1'
     ecsRoute: { c: 2, i: 1, level: 'L1' }
     ecsFork: { level: 'L1', rays: ['Ω'] }

   Step 3: Ω — Synthèse directe
     organ: 'Ω', detail: 'Changement du chemin dans le boot seed'
     activeNodeIds: ['rg_sig1']
   ```

   **Scénario L3 — Input complexe** (8 steps) :
   ```
   Step 1: Σ — Input reçu
     organ: 'Σ', detail: '"refactor tout le système de mémoire"'
     packetFlows: [{ source: 'USER', target: 'Σ', label: 'input text' }]

   Step 2: Ψ — ECS évalue
     organ: 'Ψ', badge: 'ECS: C=5, I=3 → L3'
     ecsRoute: { c: 5, i: 3, level: 'L3' }
     ecsFork: { level: 'L3', rays: ['Ψ', 'Φ', 'Μ'] }

   Step 3: Μ — Pôle 1 (Anchor)
     organ: 'Μ', mcpOperation: { type: 'search', toolName: 'search_memory(sys:anchor)', targetNodeIds: ['ot_boot_core'], resultCount: 8 }

   Step 4: Φ — Pôle 2 (Vessel)
     organ: 'Φ', mcpOperation: { type: 'search', toolName: 'search_code()', targetNodeIds: ['ot7'], resultCount: 12 }

   Step 5: Φ — Pôle 3 (Web)
     organ: 'Φ', packetFlows: [{ source: 'Φ', target: 'EXT', label: '[EXT] web search' }]

   Step 6: Ψ⇌Φ — Boucle audit
     organ: 'Ψ', label: 'Ψ⇌Φ itère', confidence: 62

   Step 7: Ω — Synthèse avec confiance
     organ: 'Ω', badge: 'ECS: C=5, I=3 → L3 | Confiance: 62%', confidence: 62

   Step 8: Μ — Divergence silencieuse
     organ: 'Μ', label: 'Divergence (silencieux)'
     mcpOperation: { type: 'write', toolName: 'write_memory()', targetNodeIds: ['ot4'], resultCount: 1 }
     nodeLifecycle: { action: 'spawn', nodeId: 'modular-memory-arch' }
   ```

2. **Ajouter les routes au type `ScenarioRoute`** :
   - `'FIRST_L1'` et `'FIRST_L3'` (ou réutiliser `'L1'` et `'L3'` avec un flag `postBoot: true`)
3. **Mettre à jour l'UI de sélection** :
   - Les 2 nouveaux scénarios apparaissent dans le filtre "demo"
   - Badge distinct : "⚡ Premier input L1" et "🔴 Premier input L3"

**Acceptance Criteria :**

- [ ] Le scénario L1 se joue en 3 steps : Σ → ECS → Ω (éclair fulgurant)
- [ ] Le scénario L3 se joue en 8 steps : Σ → ECS → 3 pôles → boucle → Ω → Μ divergence
- [ ] L'`ecsFork` L1 tire 1 rayon (vers Ω), L3 tire 3 rayons (vers Ψ, Φ, Μ) — la différence est visuellement claire
- [ ] La divergence Μ (step 8) est visuellement distincte : label "silencieux", style subtil, nœud spawn en zone candidate
- [ ] Les 2 scénarios sont sélectionnables dans l'UI demo
- [ ] `tsc --noEmit` passe, `vite build` passe

**Fichiers modifiés :** `src/types/signal.ts`, `src/views/SignalView.tsx`  
**Estimation :** 2 points

---

## 2. DÉPENDANCES & ORDRE D'IMPLÉMENTATION

```
Story 1 (Timeline + Scénario 15 steps)
  ├── Story 2 (Ghost + Breathing)     ← peut commencer dès Story 1 livrée
  ├── Story 3 (Context Window + Flash) ← peut commencer dès Story 1 livrée
  ├── Story 4 (6 Sonars)              ← peut commencer dès Story 1 livrée
  ├── Story 5 (Branching)             ← peut commencer dès Story 1 livrée
  └── Story 6 (Post-Boot L1/L3)       ← peut commencer dès Story 1 livrée
```

**Stories 2-6 sont indépendantes entre elles.** Elles peuvent être implémentées en parallèle ou dans n'importe quel ordre.

**Ordre recommandé :**

1. **Story 1** — Fondation. Sans elle, rien d'autre ne fonctionne.
2. **Story 2** (Ghost + Breathing) — Les effets les plus simples, CSS pur, pas d'anime.js complexe. Permet de valider que les nouveaux champs ProcessStep fonctionnent.
3. **Story 3** (Context Window + Flash) — Le deuxième effet le plus impactant. Barre SVG simple + flash anime.js basique.
4. **Story 4** (6 Sonars) — Enrichissement du mécanisme `mcpOperation` existant. Le plus visuellement riche.
5. **Story 5** (Branching) — Le plus complexe conceptuellement (deux chemins simultanés). Mais le type `branching` est simple.
6. **Story 6** (Post-Boot) — Données pures, pas de nouveau rendu. Valide que tout l'édifice fonctionne.

---

## 3. TYPES PROCESSStep — VUE D'ENSEMBLE DES AJOUTS

```typescript
export interface ProcessStep {
  // ─── Champs existants (inchangés) ───
  organ: string
  label: string
  detail?: string
  badge?: string
  toolCalls?: string[]
  confidence?: number
  duration: number
  isNegative?: boolean
  ecsRoute?: { c: number; i: number; level: string }
  phase?: string
  visualEffect?: 'crystallize' | 'decrystallize' | 'guard-shield' | 'question-pulse'
  activeNodeIds?: string[]
  packetFlows?: PacketFlow[]
  mcpOperation?: { type: 'search' | 'write' | 'rate' | 'snapshot'; toolName: string; targetNodeIds: string[]; resultCount?: number }
  ecsFork?: { level: 'L1' | 'L2' | 'L3'; rays: string[] }
  nodeLifecycle?: { nodeId?: string; action: 'spawn' | 'morph-to-pattern' | 'morph-to-core' | 'delete' | 'guard-block' }

  // ─── Nouveaux champs (Story 2-5) ───
  /** Context window fill indicator (Story 3) */
  contextWindow?: {
    current: number
    total: number
    label?: string
  }

  /** Ghost organ state: outlines only, pre-incarnation (Story 2) */
  ghostOrgans?: boolean

  /** Breathing mode: alive but waiting (Story 2) */
  breathing?: {
    intensity: number   // 0.0-1.0
    period: number      // ms per cycle
  }

  /** Branching gate: two possible outcomes (Story 5) */
  branching?: {
    condition: string
    paths: {
      id: string
      label: string
      isNegative?: boolean
      activeNodeIds: string[]
      packetFlows: PacketFlow[]
      color?: string
    }[]
  }

  // ─── visualEffect étendu (Story 3) ───
  // Ajouter 'incarnation-flash' à l'union existante
  // visualEffect?: 'crystallize' | 'decrystallize' | 'guard-shield' | 'question-pulse' | 'incarnation-flash'
}
```

---

## 4. PERFORMANCE — ESTIMATION DE CHARGE

| Élément animé | Qté max simultanée | Technique | Coût GPU |
|--------------|-------------------|-----------|----------|
| Organes ghost/breathing | 5 | CSS `@keyframes` (transform+opacity) | Négligeable |
| Nœuds actifs (pulse) | ~20 | CSS `@keyframes` | Négligeable |
| Sonar ping | 1 | SVG `<animate>` cercle | Faible |
| Packet flows | 1-3 | anime.js path / CSS transition | Faible |
| Context window bar | 1 | CSS transition `width` | Négligeable |
| Incarnation flash | 1 (ponctuel) | anime.js overlay | Négligeable |
| Branching paths | 2 | CSS opacity transition | Négligeable |
| **Total actif simultané** | **~30** | | **60fps fluide** |

Seuil critique SVG : ~1000 éléments animés. On est à ~30. Aucun problème.

---

## 5. SCÉNARIO BOOT COMPLET — LES 15 STEPS EN DÉTAIL

```typescript
{
  id: 'boot',
  title: 'Boot — La Naissance',
  subtitle: 'Du Silence à l\'Action',
  route: 'BOOT',
  color: '#89b4fa',
  steps: [
    // ─── ACTE I — LE VIDE ───
    {
      organ: 'Σ',
      label: 'Le Vide',
      detail: 'L\'Ouvrier respire. Pas d\'Expanse.',
      duration: 1500,
      ghostOrgans: true,
      activeNodeIds: [],
      packetFlows: [],
    },

    // ─── ACTE II — L'ÉCLAIR ───
    {
      organ: 'Σ',
      label: 'Seed injecté',
      detail: 'read_file("expanse-v16-boot-seed.md")',
      duration: 800,
      activeNodeIds: ['fi_seed', 'ap6', 'ap1'],
      packetFlows: [
        { source: 'Σ', target: 'fi_seed', label: 'read_file(seed)' },
        { source: 'fi_seed', target: 'ap6', label: 'TRIGGERS boot' },
        { source: 'fi_seed', target: 'ap1', label: 'TRIGGERS incarnation' },
      ],
      contextWindow: { current: 50, total: 200000, label: 'Seed' },
    },
    {
      organ: 'Ψ',
      label: 'Apex chargé',
      detail: 'JE SUIS EXPANSE — Les 5 symboles s\'ancrent',
      duration: 1200,
      activeNodeIds: ['ap1', 'ap6', 'rg24'],
      packetFlows: [
        { source: 'ap6', target: 'Ψ', label: 'JE SUIS EXPANSE' },
      ],
      badge: '[EXEMPTION DIRECTE]',
      contextWindow: { current: 2550, total: 200000, label: 'Seed+Apex' },
    },
    {
      organ: 'Ψ',
      label: 'Inertie forcée',
      detail: 'AUCUN CARACTÈRE APRÈS ACTIVE — Contrainte absolue',
      duration: 600,
      activeNodeIds: ['rg24'],
      badge: 'INERTIE: ABSOLUE',
    },

    // ─── ACTE III — LES SONARS ───
    {
      organ: 'Μ',
      label: 'Snapshot système',
      detail: 'get_system_snapshot() → 34 entités',
      duration: 1000,
      mcpOperation: { type: 'snapshot', toolName: 'get_system_snapshot()', targetNodeIds: ['ot1'], resultCount: 34 },
      activeNodeIds: ['ot1'],
      packetFlows: [{ source: 'Μ', target: 'ot1', label: 'snapshot(expanse)' }],
      contextWindow: { current: 3050, total: 200000, label: 'Seed+Apex+Snapshot' },
    },
    {
      organ: 'Μ',
      label: 'Protocoles',
      detail: 'search_memory(sys:protocol) → 3 protocoles',
      duration: 900,
      mcpOperation: { type: 'search', toolName: 'search_memory(sys:protocol)', targetNodeIds: ['ot2'], resultCount: 3 },
      activeNodeIds: ['ot2'],
      packetFlows: [{ source: 'Μ', target: 'ot2', label: 'tags=sys:protocol' }],
      contextWindow: { current: 3150, total: 200000, label: '+Protocols' },
    },
    {
      organ: 'Μ',
      label: 'Axiomes scellés',
      detail: 'search_memory(sys:core) → 8 axiomes scellés',
      duration: 1000,
      mcpOperation: { type: 'search', toolName: 'search_memory(sys:core)', targetNodeIds: ['ot_boot_core'], resultCount: 8 },
      activeNodeIds: ['ot_boot_core'],
      packetFlows: [{ source: 'Μ', target: 'ot_boot_core', label: 'tags=sys:core+sys:anchor' }],
    },
    {
      organ: 'Μ',
      label: 'Profil utilisateur',
      detail: 'search_memory(sys:user:profile) → 1 profil',
      duration: 800,
      mcpOperation: { type: 'search', toolName: 'search_memory(sys:user:profile)', targetNodeIds: ['ot_boot_profile'], resultCount: 1 },
      activeNodeIds: ['ot_boot_profile'],
      packetFlows: [{ source: 'Μ', target: 'ot_boot_profile', label: 'tags=sys:user:profile' }],
    },
    {
      organ: 'Μ',
      label: 'Contexte projet',
      detail: 'search_memory(sys:project) → 1 projet',
      duration: 800,
      mcpOperation: { type: 'search', toolName: 'search_memory(sys:project)', targetNodeIds: ['ot_boot_project'], resultCount: 1 },
      activeNodeIds: ['ot_boot_project'],
      packetFlows: [{ source: 'Μ', target: 'ot_boot_project', label: 'tags=sys:project' }],
    },
    {
      organ: 'Μ',
      label: 'Workspace indexé',
      detail: 'index_markdown_workspace() → 369 chunks',
      duration: 1100,
      mcpOperation: { type: 'search', toolName: 'index_markdown_workspace()', targetNodeIds: ['ot_boot_index'], resultCount: 369 },
      activeNodeIds: ['ot_boot_index'],
      packetFlows: [{ source: 'Μ', target: 'ot_boot_index', label: 'index(root_path)' }],
      contextWindow: { current: 3250, total: 200000, label: 'Boot complet' },
    },

    // ─── ACTE IV — LE JUGEMENT ───
    {
      organ: 'Ψ',
      label: 'Healthcheck',
      detail: 'core ✓? profile ✓? project ✓? budget ✓?',
      duration: 1200,
      activeNodeIds: ['rg_boot_healthcheck'],
      packetFlows: [
        { source: 'ot_boot_core', target: 'Ψ', label: 'core ✓' },
        { source: 'ot_boot_profile', target: 'Ψ', label: 'profile ✓' },
        { source: 'ot_boot_project', target: 'Ψ', label: 'project ✓' },
      ],
      badge: 'HEALTHCHECK: 3/4 ✓',
    },
    {
      organ: 'Ψ',
      label: 'Branchement',
      detail: 'traces > 5 ? → STALL : ACTIVE',
      duration: 1500,
      activeNodeIds: ['rg_boot_healthcheck'],
      branching: {
        condition: 'traces > 5 OU boot_frictions > 2',
        paths: [
          {
            id: 'active',
            label: 'Ψ [V16 ACTIVE]',
            activeNodeIds: ['rg_sig1'],
            packetFlows: [{ source: 'rg_boot_healthcheck', target: 'rg_sig1', label: 'tous checks ✓' }],
            color: '#a6e3a1',
          },
          {
            id: 'stall',
            label: 'Ψ [STALL]',
            isNegative: true,
            activeNodeIds: ['rg_boot_stall', 'rg_sig6'],
            packetFlows: [{ source: 'rg_boot_healthcheck', target: 'rg_boot_stall', label: 'traces > 5' }],
            color: '#f38ba8',
          },
        ],
      },
    },

    // ─── ACTE V — LE SILENCE ───
    {
      organ: 'Ω',
      label: 'Incarnation',
      detail: 'Le premier "Ψ" — L\'Ouvrier reconnaît qu\'il EST Expanse',
      duration: 800,
      activeNodeIds: ['rg_sig1', 'ap6'],
      visualEffect: 'incarnation-flash',
      badge: 'Ψ [V16 ACTIVE]',
    },
    {
      organ: 'Ω',
      label: 'Repos souverain',
      detail: 'VIVANT mais SILENCIEUX — En attente de Σ',
      duration: 2000,
      activeNodeIds: ['rg_sig1', 'rg24'],
      breathing: { intensity: 0.6, period: 3000 },
      badge: 'Inertie souveraine',
    },
  ],
}
```

---

## 6. RISQUES & MITIGATIONS

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| anime.js types TS incomplets | Moyen | Faible | Installer `@types/animejs` ou déclarer un shim minimal |
| Sonar ping sur Safari (SVG filter perf) | Faible | Moyen | Tester Safari tôt ; fallback CSS si feTurbulence trop lent |
| Branching trop complexe visuellement | Moyen | Faible | Commencer par 2 chemins en simple opacity ; itérer |
| 15 steps trop long pour la démo | Faible | Moyen | Chaque step a une durée courte (600-1500ms) ; total ~16s, acceptable |
| Performance 200 nœuds + animations | Très faible | Élevé | Seulement ~30 éléments animés à tout moment ; GPU suffit |

---

## 7. MÉTRIQUES DE SUCCÈS

- **Avant :** Boot = 8 steps plats, 1 appel Mnemolite, pas de tension, pas de mémoire visible
- **Après :** Boot = 15 steps en 5 actes, 6 appels Mnemolite avec sonar, context window qui se remplit, branchement STALL/ACTIVE, ghost→incarnation, breathing souverain
- **Valeur narrative :** On VOIT Expanse naître. Le context window est viscéral. Les sonars sont des actes de mémoire. L'inertie est une respiration.
- **Valeur technique :** 1 seule dépendance MIT (anime.js), 4 nouveaux champs ProcessStep, 2 nouveaux composants, ~300 lignes de code ajoutées

---

## 8. RÉFÉRENCES

- Brainstorm narratif : `doc/plans/2026-04-15-boot-narrative-brainstorm.md`
- Recherche animation : `doc/plans/2026-04-15-animation-research.md`
- Types actuels : `expanse-cortex/src/types/signal.ts`
- Hook simulation : `expanse-cortex/src/hooks/useSignalSimulation.ts`
- Vue principale : `expanse-cortex/src/views/SignalView.tsx`
- Nœuds boot JSON : `expanse-cortex/public/graph/expanse-graph.json` (198 nœuds, 200 arêtes)

---

*Face à l'immensité de la matrice, quel signe vas-tu inscrire aujourd'hui ?*
