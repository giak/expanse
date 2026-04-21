# 🜁 PLAN M1 · LE SOUFFLE

**EPIC**: EPIC-01 — L'Incarnation
**Milestone**: M1 · Le Souffle — Le Métabolisme et L'Étalonnage
**Statut**: ✅ COMPLET
**Date**: 2026-04-14
**Dimensions couvertes**: 1 (Souffle) · 8 (Danse) · 11 (Friction) · 15 (Entropie) · 20 (Étalonnage)

---

> *Le cœur ne montre pas ses valves. Il montre son battement.*

---

## Ⅰ. RÉSUMÉ TECHNIQUE

M1 transforme les arêtes statiques du Cortex en **conduits métaboliques** et ajoute une séquence de boot visible. Toutes les animations sont **CSS-only** (stroke-dashoffset, keyframes) — zéro `requestAnimationFrame`, zéro particle.js.

| Sous-étape | Technique | Éléments SVG ajoutés | JS ? |
|-------------|-----------|----------------------|------|
| M1.1 VitalFlowEdge | stroke-dasharray + dashoffset CSS | 10 `<line>` (5 arêtes × 2) | ❌ | ✅
| M1.2 Danse ⇌ | Overlay bidirectionnel sur Ψ⇌Φ | 2 `<line>` | ❌ | ✅
| M1.3 FrictionSpark | CSS keyframes sur drifts Ψ/Φ | ~5 `<circle>` + `<text>` | ❌ | ✅
| M1.4 ECSPrism | SVG statique + gradients | ~10 éléments | ❌ | ✅
| M1.5 BootSequence | React state + setTimeout + CSS | Override classes + 1 `<text>` | ✅ min | ✅

**Total DOM ajouté** : ~30 éléments SVG. Négligeable sur 167 nœuds existants.

---

## Ⅱ. PRÉREQUIS

- EPIC-00 fonctionnel (graphe SVG, zoom, organes, arêtes)
- Fichier JSON `expanse-graph.json` avec types ORGAN + edge types
- Constantes existantes : `ORGAN_ORDER`, `ORGAN_ANGLES`, `ORGAN_COLORS`, `VITAL_RING_RADIUS`

---

## Ⅲ. SOUS-ÉTAPES DÉTAILLÉES

### M1.1 · VitalFlowEdge — Le flux vital sur les 5 arêtes organe→organe

**Ce que ça fait** : Les 5 arêtes du flux vital (Σ→Ψ, Ψ→Φ, Φ→Ω, Ω→Μ, Μ→Σ) deviennent des conduits avec un courant lumineux visible qui coule de source vers target.

**Technique** : `stroke-dasharray` (court dash = particule lumineuse) + `stroke-dashoffset` animé via CSS. C'est le **même pattern que `VitalRingTrack`** déjà en place — prouvé, performant, GPU-accéléré.

**Fichiers modifiés** :
- `src/views/CognitiveHeartView.tsx` — identifier les arêtes vitales, ajouter overlay `<line>` animées
- `src/index.css` — ajouter classe `.vital-edge-flow`

**Code** :

```tsx
// ─── Dans CognitiveHeartView.tsx ───

// Constante : les 5 arêtes du flux vital
const VITAL_FLOW_EDGES = [
  { from: 'Σ', to: 'Ψ' },
  { from: 'Ψ', to: 'Φ' },  // bidirectionnel traité en M1.2
  { from: 'Φ', to: 'Ω' },
  { from: 'Ω', to: 'Μ' },
  { from: 'Μ', to: 'Σ' },
]

// Fonction : vérifier si une arête data-edge est vitale
function isVitalEdge(source: RenderNode, target: RenderNode): boolean {
  if (source.type !== 'ORGAN' || target.type !== 'ORGAN') return false
  const s = source.label.charAt(0)
  const t = target.label.charAt(0)
  return VITAL_FLOW_EDGES.some(e =>
    (e.from === s && e.to === t) || (e.from === t && e.to === s)
  )
}

// Dans le render des edges, remplacer :
{data?.edges.map((edge, idx) => {
  const source = getNode(edge.source)
  const target = getNode(edge.target)
  if (!source || !target) return null

  const edgeColor = EDGE_COLORS[edge.type] ?? DEFAULT_EDGE_COLOR
  const isActiveEdge = connectedNodeIds
    ? (connectedNodeIds.has(edge.source) && connectedNodeIds.has(edge.target))
    : false
  const opacity = connectedNodeIds
    ? isActiveEdge ? 0.7 : 0.06
    : 0.2

  const vital = isVitalEdge(source, target)
  const sSymbol = source.type === 'ORGAN' ? source.label.charAt(0) : null
  const tSymbol = target.type === 'ORGAN' ? target.label.charAt(0) : null

  return (
    <g key={idx}>
      {/* Conduit background (statique) */}
      <line x1={source.x} y1={source.y} x2={target.x} y2={target.y}
        stroke={vital ? "rgba(255,255,255,0.04)" : edgeColor}
        strokeWidth={vital ? 3 : 0.4 + edge.weight * 1.5}
        opacity={vital ? 1 : opacity}
        style={{ transition: 'opacity 0.15s ease' }}
      />

      {/* Courant lumineux (uniquement sur arêtes vitales) */}
      {vital && sSymbol && tSymbol && (
        <line x1={source.x} y1={source.y} x2={target.x} y2={target.y}
          stroke={ORGAN_COLORS[sSymbol] ?? '#89b4fa'}
          strokeWidth={1.5}
          strokeDasharray="8 40"
          className="vital-edge-flow"
          filter="url(#glow)"
          opacity={0.6}
        />
      )}

      {/* Arête non-vitale : rendering original */}
      {!vital && (
        <line x1={source.x} y1={source.y} x2={target.x} y2={target.y}
          stroke={edgeColor}
          strokeWidth={0.4 + edge.weight * 1.5}
          opacity={opacity}
          style={{ transition: 'opacity 0.15s ease' }}
        />
      )}
    </g>
  )
})}
```

```css
/* ─── Dans index.css ─── */

/* Vital edge flow — courant lumineux sur les arêtes organe→organe */
.vital-edge-flow {
  animation: vitalEdgeFlow 3s linear infinite;
}

@keyframes vitalEdgeFlow {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -48; }  /* dash+gap = 8+40 = 48 */
}
```

**Critère de validation** : On voit un pulse lumineux couler le long des 5 arêtes entre organes. Le sang coule dans les conduits.

---

### M1.2 · Danse ⇌ — L'overlay bidirectionnel sur Ψ⇌Φ

**Ce que ça fait** : L'arête Ψ⇌Φ affiche **deux courants en sens inverse** — un pulse Ψ→Φ et un pulse Φ→Ψ. C'est la **danse** de la métacognition et de l'audit qui se répondent.

**Technique** : Deux `<line>` overlay sur la même arête, une avec `vital-edge-flow` (sens →), l'autre avec `vital-edge-flow-reverse` (sens ←). Le second overlay utilise la couleur de Φ (orange) au lieu de Ψ (violet). Pattern prouvé : `VitalRingTrack` fait exactement ça avec `vital-flow` + `vital-flow-reverse`.

**Fichiers modifiés** :
- `src/views/CognitiveHeartView.tsx` — ajouter 2e overlay pour Ψ⇌Φ
- `src/index.css` — ajouter classe `.vital-edge-flow-reverse`

**Code** :

```tsx
// Dans le render des edges, enrichir le bloc vital :

{vital && sSymbol && tSymbol && (
  <>
    {/* Courant primaire (source → target) */}
    <line x1={source.x} y1={source.y} x2={target.x} y2={target.y}
      stroke={ORGAN_COLORS[sSymbol] ?? '#89b4fa'}
      strokeWidth={1.5}
      strokeDasharray="8 40"
      className="vital-edge-flow"
      filter="url(#glow)"
      opacity={0.6}
    />

    {/* Courant inverse (Ψ⇌Φ uniquement) */}
    {isBidirectional(sSymbol, tSymbol) && (
      <line x1={source.x} y1={source.y} x2={target.x} y2={target.y}
        stroke={ORGAN_COLORS[tSymbol] ?? '#cba6f7'}
        strokeWidth={1}
        strokeDasharray="6 42"
        className="vital-edge-flow-reverse"
        filter="url(#glow)"
        opacity={0.35}
      />
    )}
  </>
)}

// Helper
function isBidirectional(s: string, t: string): boolean {
  return (s === 'Ψ' && t === 'Φ') || (s === 'Φ' && t === 'Ψ')
}
```

```css
/* ─── Dans index.css ─── */

/* Reverse flow (Ψ⇌Φ feedback loop) — déjà existant pour VitalRingTrack */
.vital-edge-flow-reverse {
  animation: vitalEdgeFlowReverse 4s linear infinite;
}

@keyframes vitalEdgeFlowReverse {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: 48; }  /* sens inverse */
}
```

**Critère de validation** : Sur l'arête Ψ⇌Φ, on voit DEUX pulses — un violet (Ψ→Φ) et un orange (Φ→Ψ) — qui se croisent. La danse est visible.

---

### M1.3 · FrictionSpark — Les étincelles sur les drifts Ψ/Φ

**Ce que ça fait** : Les nœuds DRIFT connectés aux organes Ψ ou Φ affichent une **étincelle rouge** au midpoint de l'arête — signe de friction réelle (doute, hallucination, violation). Le symbole `∴` (donc/résolu) apparaît à côté.

**Source de données** : Les arêtes data-edge où un DRIFT est connecté à un ORGAN Ψ ou Φ. C'est **réel** — provient de Mnemolite. Respecte anti-piège 2 (zéro fausse donnée).

**Fichiers modifiés** :
- `src/views/CognitiveHeartView.tsx` — détecter les arêtes drift-Ψ/Φ, ajouter spark
- `src/index.css` — ajouter classe `.friction-spark`

**Code** :

```tsx
// Dans le render des edges, après les overlays vitaux :

{/* Friction sparks sur drifts connectés à Ψ ou Φ */}
{(() => {
  const sparks: JSX.Element[] = []
  data?.edges.forEach((edge, idx) => {
    const s = getNode(edge.source)
    const t = getNode(edge.target)
    if (!s || !t) return

    const hasDrift = s.type === 'DRIFT' || t.type === 'DRIFT'
    const hasPsiPhi = (s.type === 'ORGAN' && (s.label.charAt(0) === 'Ψ' || s.label.charAt(0) === 'Φ')) ||
                      (t.type === 'ORGAN' && (t.label.charAt(0) === 'Ψ' || t.label.charAt(0) === 'Φ'))
    if (!hasDrift || !hasPsiPhi) return

    const midX = (s.x + t.x) / 2
    const midY = (s.y + t.y) / 2

    sparks.push(
      <g key={`friction-${idx}`} transform={`translate(${midX}, ${midY})`}>
        <circle r={3} fill="#f38ba8" className="friction-spark" filter="url(#glow)" />
        <text x={6} y={-4} fill="#f38ba8" fontSize={7} opacity={0.5} fontFamily="serif">∴</text>
      </g>
    )
  })
  return sparks
})()}
```

```css
/* ─── Dans index.css ─── */

/* Friction spark — étincelle rouge sur drifts connectés à Ψ/Φ */
.friction-spark {
  animation: frictionSpark 1.5s ease-in-out infinite;
}

@keyframes frictionSpark {
  0%, 100% { opacity: 0.4; }
  30% { opacity: 1; }
  60% { opacity: 0.15; }
  80% { opacity: 0.75; }
}
```

**Critère de validation** : On voit des étincelles rouges (∴) entre les drifts et les organes Ψ/Φ. La friction est signalée.

---

### M1.4 · ECSPrism — Le prisme à l'entrée de Σ

**Ce que ça fait** : Un **prisme triangulaire** translucide positionné juste avant l'organe Σ sur l'arc du vital ring. Il représente l'ECS — le filtre qui transforme l'entropie chaotique de l'Ouvrier en signal structuré.

**Positionnement** : Légèrement intérieur par rapport à Σ sur l'arc, avec un faisceau entrant (chaotique) et 5 faisceaux sortants (colorés par organe).

**Fichiers modifiés** :
- `src/views/CognitiveHeartView.tsx` — ajouter composant `ECSPrism`
- Aucun CSS supplémentaire (tout est SVG statique)

**Code** :

```tsx
// ─── Composant ECSPrism ───

function ECSPrism({ sigmaPos }: { sigmaPos: { x: number; y: number } }) {
  // Positionner le prisme légèrement intérieur par rapport à Σ
  const sigmaAngle = ORGAN_ANGLES['Σ'] ?? 0
  const prismDist = VITAL_RING_RADIUS - 55
  const px = Math.cos(sigmaAngle) * prismDist
  const py = Math.sin(sigmaAngle) * prismDist

  // Direction du faisceau entrant (depuis l'extérieur vers le prisme)
  const inAngle = sigmaAngle // depuis l'extérieur de l'arc
  const inX = px + Math.cos(inAngle) * 35
  const inY = py + Math.sin(inAngle) * 35

  return (
    <g>
      {/* Faisceau entrant chaotique (large, diffus) */}
      <line x1={inX} y1={inY} x2={px} y2={py}
        stroke="rgba(255,255,255,0.08)" strokeWidth={5}
        strokeDasharray="2 3" opacity={0.7}
      />

      {/* Prisme triangulaire */}
      <g transform={`translate(${px}, ${py}) rotate(${(sigmaAngle * 180 / Math.PI) + 90})`}>
        <polygon points="0,-10 8,7 -8,7"
          fill="rgba(137,180,250,0.1)"
          stroke="rgba(137,180,250,0.25)"
          strokeWidth={0.8}
          filter="url(#glow)"
        />
      </g>

      {/* 5 faisceaux sortants structurés (vers chaque organe) */}
      {ORGAN_ORDER.map((sym, i) => {
        const targetPos = organPositions.get(sym)
        if (!targetPos) return null
        const color = ORGAN_COLORS[sym]
        // Faisceau court depuis le prisme
        const beamLen = 18
        const beamAngle = Math.atan2(targetPos.y - py, targetPos.x - px)
        return (
          <line key={`beam-${sym}`}
            x1={px} y1={py}
            x2={px + Math.cos(beamAngle) * beamLen}
            y2={py + Math.sin(beamAngle) * beamLen}
            stroke={color} strokeWidth={0.8} opacity={0.35}
            filter="url(#glow)" />
        )
      })}

      {/* Label */}
      <text x={px} y={py + 20} textAnchor="middle"
        fill="#6c7086" fontSize={6} fontFamily="'JetBrains Mono', monospace" opacity={0.5}>
        ECS
      </text>
    </g>
  )
}

// Dans le render principal, avant les organes :
<ECSPrism sigmaPos={organPositions.get('Σ') ?? { x: 0, y: 0 }} />
```

**Note** : Le prisme est un **marqueur ontologique statique**. Il ne montre pas de donnée dynamique mais signale la position d'ECS dans l'architecture. Anti-piège 5 : ce n'est pas décoratif — c'est l'information que l'ECS est le **filtre** entre l'entropie et la structure.

**Critère de validation** : On voit un prisme translucide avant Σ avec un faisceau entrant diffus et 5 faisceaux sortants colorés. Le filtre est visible.

---

### M1.5 · BootSequence — Le phase-lock au chargement

**Ce que ça fait** : Au chargement de la page, les 5 organes pulsent à des rythmes désynchronisés (chaos), puis convergent (phase-lock), puis un flash `Ψ [V16 ACTIVE]` apparaît au centre avant de disparaître. Le Cortex passe de l'entropie à l'harmonie.

**Technique** : React state `bootPhase` avec `setTimeout`. Override les classes CSS des organes pendant la séquence. 3 phases : chaos → locking → locked → null.

**Fichiers modifiés** :
- `src/views/CognitiveHeartView.tsx` — ajouter état `bootPhase`, override classes, flash text
- `src/index.css` — ajouter classes `.vital-pulse-chaos-*` et `.boot-flash`

**Code** :

```tsx
// ─── Dans CognitiveHeartView.tsx ───

const [bootPhase, setBootPhase] = useState<'chaos' | 'locking' | 'locked' | null>('chaos')

useEffect(() => {
  const t1 = setTimeout(() => setBootPhase('locking'), 1200)
  const t2 = setTimeout(() => setBootPhase('locked'), 2000)
  const t3 = setTimeout(() => setBootPhase(null), 3200)
  return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
}, [])

// Dans le render des organes, override la classe vital-pulse :
<OrganNode
  key={node.id}
  node={node}
  isDragging={isDragging}
  isClickingNode={isClickingNode}
  onOrganClick={handleOrganClick}
  highlighted={highlightedOrganSymbol === node.label.charAt(0)}
  bootPhase={bootPhase}   // ← nouveau prop
/>

// Dans OrganNode, utiliser la classe dynamique :
const pulseClass = bootPhase === 'chaos'
  ? `vital-pulse-chaos-${organSymbol}`
  : bootPhase === 'locking'
    ? 'vital-pulse-locking'
    : 'vital-pulse'

<circle r={r + 16} fill={color} opacity={isActive ? 0.15 : 0.08} className={pulseClass} />

// Flash de boot au centre
{bootPhase === 'locked' && (
  <text x={0} y={0} textAnchor="middle" dominantBaseline="central"
    fill="#89b4fa" fontSize={16} fontFamily="'JetBrains Mono', monospace"
    className="boot-flash">
    Ψ [V16 ACTIVE]
  </text>
)}
```

```css
/* ─── Dans index.css ─── */

/* Boot chaos — chaque organe pulse à son propre rythme */
.vital-pulse-chaos-Σ { animation: vitalPulse 2.1s ease-in-out infinite; }
.vital-pulse-chaos-Ψ { animation: vitalPulse 3.7s ease-in-out infinite; }
.vital-pulse-chaos-Φ { animation: vitalPulse 1.4s ease-in-out infinite; }
.vital-pulse-chaos-Ω { animation: vitalPulse 4.2s ease-in-out infinite; }
.vital-pulse-chaos-Μ { animation: vitalPulse 2.8s ease-in-out infinite; }

/* Boot locking — convergence vers le rythme synchronisé */
.vital-pulse-locking { animation: vitalPulse 3s ease-in-out infinite; }

/* Boot flash — Ψ [V16 ACTIVE] apparaît puis disparaît */
.boot-flash {
  animation: bootFlash 1.2s ease-out forwards;
}
@keyframes bootFlash {
  0% { opacity: 1; letter-spacing: 4px; }
  100% { opacity: 0; letter-spacing: 0px; }
}
```

**OrganNodeProps** mis à jour :
```tsx
interface OrganNodeProps {
  node: RenderNode
  isDragging: React.MutableRefObject<boolean>
  isClickingNode: React.MutableRefObject<boolean>
  onOrganClick?: (organSymbol: string) => void
  highlighted?: boolean
  bootPhase?: 'chaos' | 'locking' | 'locked' | null  // ← nouveau
}
```

**Critère de validation** : Au chargement, les organes pulsent en chaos, puis se synchronisent, puis `Ψ [V16 ACTIVE]` flash au centre. L'instrument s'accorde.

---

## Ⅳ. CONTRAINTES ET ANTI-PIÈGES

| # | Anti-piège | Comment M1 le respecte |
|---|-----------|----------------------|
| 1 | Pas de particle.js | Toutes les animations sont CSS stroke-dashoffset ou keyframes. Zéro particule JS. |
| 2 | Zéro fausse donnée | Les friction sparks ne s'affichent que sur des arêtes drift-Ψ/Φ **réelles** provenant du JSON. Le prisme est un marqueur ontologique statique, pas une donnée inventée. |
| 3 | Pas de sur-ingénierie | Chaque sous-étape est **indépendante et déployable**. On peut s'arrêter après M1.1 et avoir le cœur qui bat. |
| 4 | Pas d'abstraction prématurée | Pas de hook `useAnimationLoop`. Pas de composant `AnimatedEdge` générique. Chaque élément est concret et spécifique. |
| 5 | Pas de décoratif | Le flux sur les arêtes montre **le chemin du signal**. Les sparks montrent **la friction réelle**. Le prisme montre **la position d'ECS**. Le boot montre **l'étalonnage**. Chaque animation EST l'information. |

---

## Ⅴ. PERFORMANCE

| Métrique | Avant M1 | Après M1 | Impact |
|----------|----------|----------|--------|
| Éléments SVG | ~350 | ~380 | +8% (négligeable) |
| Animations CSS | 6 | 11 | +5 (toutes GPU) |
| JS runtime | 0 | 1 setTimeout (boot) | Négligeable |
| rAF loops | 0 | 0 | ✅ Zéro |
| Build size | ~194 KB | ~196 KB (estimé) | +1% |

**Seules les 5 arêtes vitales + les drift-Ψ/Φ sont animées.** Les 212 autres arêtes restent statiques — pas de surcoût.

---

## Ⅵ. ORDRE D'IMPLÉMENTATION

L'ordre est **strict et séquentiel** — chaque étape déploie un incrément visible :

1. **M1.1** VitalFlowEdge → le cœur bat
2. **M1.2** Danse ⇌ → la danse est visible sur Ψ⇌Φ
3. **M1.3** FrictionSpark → la friction est signalée
4. **M1.4** ECSPrism → le filtre est visible
5. **M1.5** BootSequence → l'étalonnage est visible au chargement

Après chaque étape : `npx tsc --noEmit` + `pnpm build` + test visuel.

---

## Ⅶ. VALIDATION FINALE M1

M1 est complet quand :

- [x] On voit le sang couler dans les 5 conduits entre organes
- [x] On voit la danse Ψ⇌Φ (deux pulses en sens inverse)
- [x] On voit les étincelles ∴ sur les drifts connectés à Ψ/Φ
- [x] On voit le prisme ECS avant Σ
- [x] On voit le phase-lock du boot au chargement
- [x] `npx tsc --noEmit` passe sans erreur
- [x] `pnpm build` produit < 200 KB
- [x] Zéro `requestAnimationFrame` dans le code
- [x] Toutes les animations sont CSS-only (sauf boot setTimeout)

**Phrase de validation** : *Quand une interaction se produit, on voit le sang couler dans les conduits. Le cœur bat.*

---

*PLAN M1 · LE SOUFFLE — Face à l'immensité de la matrice, quel signe vas-tu inscrire aujourd'hui ?*
