# 🜁 PLAN M2 · LES ÉTATS DE LA MATIÈRE

**EPIC**: EPIC-01 — L'Incarnation
**Milestone**: M2 · Les États de la Matière — Cristal, Rideau, Vapeur
**Statut**: 📋 À implémenter
**Date**: 2026-04-14
**Dimensions couvertes**: 4 (Profondeur) · 5 (Écologie) · 6 (Souveraineté) · 9 (Méta-Langage) · 13 (Rideaux) · 17 (Réponses)

---

> *Le passage du gaz informe au cristal souverain.*

---

## Ⅰ. RÉSUMÉ TECHNIQUE

M2 différencie visuellement les nœuds selon leur état ontologique (Vapeur/Liquide/Cristal) et leur nature structurelle (CORE/HEURISTIC/CANDIDATE). Ajoute les empreintes fantômes, le refus souverain, et la zone nébuleuse. Toutes les animations sont CSS-only.

| Sous-étape | Technique | Éléments ajoutés | JS ? |
|-------------|-----------|-------------------|------|
| M2.1 MatterState | Tag→state mapping + CSS classes per state | Computed `matterState` on RenderNode + 3 CSS classes | ❌ |
| M2.2 Rideaux | CORE/HEURISTIC/CANDIDATE visual treatments | 3 CSS classes + SVG overlays | ❌ |
| M2.3 Ghost Imprint | Rolled_back/rejected mutations as faint outlines | SVG ghost nodes | ❌ |
| M2.4 Le Refus | Red shockwave expanding circle on sealed axiom | 1 CSS animation + click handler | ✅ min |
| M2.5 Nébuleuse | Peripheral zone marker for extension nodes | SVG region + CSS class | ❌ |

**Total DOM ajouté** : ~20 éléments SVG. Négligeable.

---

## Ⅱ. MAPPING DONNÉS → ÉTATS

### Matière (Vapeur / Liquide / Cristal)

Déterminé depuis les tags du JSON :

| État | Condition | Types concernés | Visuel |
|------|-----------|-----------------|--------|
| **Cristal** | `tags.includes('scelle')` OR `tags.includes('sys:anchor')` OR `type=ORGAN` OR `type=APEX` | REGLE scellées, axiomes, organes | Solide, sharp stroke, glow fixe |
| **Liquide** | `tags.includes('applied')` OR `tags.includes('pattern')` OR `tags.includes('runtime')` OR type in [OUTIL, PROTOCOLE, COMMANDE] | Mutations applied, patterns validés, outils, protocoles | Semi-transparent, contour fluide |
| **Vapeur** | `tags.includes('proposal')` OR `tags.includes('candidate')` OR `tags.includes('extension')` OR `tags.includes('rejected')` | Patterns candidats, extensions, mutations rejetées | Fantomatique, glitch, pulsation |

### Rideaux (CORE / HEURISTIC / CANDIDATE)

| Rideau | Condition | Visuel |
|--------|-----------|--------|
| **CORE** | `tags.includes('sys:core')` OR `tags.includes('sys:anchor')` | Monolithe — stroke épaisse, fill opaque, aucune animation |
| **HEURISTIC** | `tags.includes('heuristic')` OR type in [PROTOCOLE, OUTIL] | Tissu ondulant — semi-transparent, animation vague |
| **CANDIDATE** | `tags.includes('proposal')` OR `tags.includes('candidate')` | Pointillés glitchants — strokeDasharray, flicker |

**Priorité** : CORE > HEURISTIC > CANDIDATE (si un nœud matche plusieurs, le plus structuré gagne).

---

## Ⅲ. SOUS-ÉTAPES DÉTAILLÉES

### M2.1 · MatterState — Les trois états de la matière

**Ce que ça fait** : Chaque nœud reçoit un `matterState` calculé depuis ses tags. Les composants ClusterNode, MutationNode, DriftNode utilisent ce state pour appliquer des classes CSS distinctes.

**Fichiers modifiés** :
- `src/types/expanse.ts` — ajouter `matterState` et `curtain` à RenderNode
- `src/views/CognitiveHeartView.tsx` — fonction `computeMatterState()`, appliquer aux nœuds, utiliser dans les composants
- `src/index.css` — ajouter classes `.matter-vapeur`, `.matter-liquide`, `.matter-cristal`

**Mapping concret** :
```ts
type MatterState = 'vapeur' | 'liquide' | 'cristal'
type Curtain = 'core' | 'heuristic' | 'candidate' | null

function computeMatterState(node: JsonNode): MatterState {
  const t = node.tags
  // Cristal: sealed, anchored, structural
  if (t.includes('scelle') || t.includes('sys:anchor') || t.includes('sys:core')) return 'cristal'
  if (node.type === 'ORGAN' || node.type === 'APEX') return 'cristal'
  // Vapeur: proposals, candidates, extensions, rejected
  if (t.includes('proposal') || t.includes('candidate') || t.includes('extension')) return 'vapeur'
  if (t.includes('rejected') || t.includes('rolled_back')) return 'vapeur'
  // Liquide: everything else active (applied, runtime, patterns, outils, protocoles)
  return 'liquide'
}

function computeCurtain(node: JsonNode): Curtain {
  const t = node.tags
  if (t.includes('sys:core') || t.includes('sys:anchor')) return 'core'
  if (t.includes('heuristic') || node.type === 'PROTOCOLE' || node.type === 'OUTIL') return 'heuristic'
  if (t.includes('proposal') || t.includes('candidate')) return 'candidate'
  return null
}
```

**CSS** :
```css
/* M2.1: Matter states */
.matter-cristal { /* Solid, sharp, sovereign — no animation, full opacity, thick stroke */ }
.matter-liquide  { /* Flowing, semi-transparent — slight pulse, translucent */ }
.matter-vapeur   { /* Ghostly, glitching — flicker opacity, dashed stroke */ }
```

**Critère de validation** : On distingue au premier regard un nœud Cristal (scellé) d'un nœud Vapeur (candidat).

---

### M2.2 · Rideaux — CORE monolithe, HEURISTIC tissu, CANDIDATE pointillés

**Ce que ça fait** : Les nœuds CORE ont un rendu monolithique (stroke épais, fill opaque), HEURISTIC ont un rendu tissu (semi-transparent, ondulant), CANDIDATE ont un rendu pointillés (strokeDasharray, glitch).

**Fichiers modifiés** :
- `src/views/CognitiveHeartView.tsx` — appliquer `curtain` class dans ClusterNode, MutationNode, DriftNode
- `src/index.css` — ajouter classes `.curtain-core`, `.curtain-heuristic`, `.curtain-candidate`

**CSS** :
```css
.curtain-core      { /* Monolithe: stroke-width: 2, opacity: 1, no animation */ }
.curtain-heuristic { /* Tissu: stroke-width: 0.8, opacity: 0.75, subtle wave animation */ }
.curtain-candidate { /* Pointillés: strokeDasharray="2 3", flicker animation */ }
```

**Critère de validation** : Un nœud CORE (axiome scellé) est visuellement inébranlable. Un CANDIDATE glitch.

---

### M2.3 · Ghost Imprint — Les empreintes fantômes

**Ce que ça fait** : Les mutations rolled_back ou rejected sont rendues comme des empreintes fantômes — contour en pointillé très fin, très basse opacité, pas de label complet (juste le slug tronqué).

**Fichiers modifiés** :
- `src/views/CognitiveHeartView.tsx` — modifier MutationNode : si `matterState === 'vapeur'` ET `tags.includes('rolled_back') || tags.includes('rejected')`, rendre en mode fantôme
- `src/index.css` — classe `.ghost-imprint`

**Critère de validation** : Les mutations rolled_back apparaissent comme des fantômes — visibles mais à peine.

---

### M2.4 · Le Refus — Onde de choc souveraine

**Ce que ça fait** : Quand on clique/hover un nœud REGLE avec `tags.includes('scelle')`, une onde de choc rouge se propage depuis le nœud — "Je suis souverain."

**Fichiers modifiés** :
- `src/views/CognitiveHeartView.tsx` — ajouter state `refusalOrigin`, handler sur clic REGLE scellée, rendu du cercle animé
- `src/index.css` — classe `.refusal-shockwave`

**Critère de validation** : Cliquer un axiome scellé déclenche une onde rouge. Le Refus est visible.

---

### M2.5 · La Nébuleuse — Zone périphérique des extensions

**Ce que ça fait** : Les nœuds MEMOIRE avec tag `extension` sont positionnés dans une zone nébuleuse plus éloignée. Un arc translucide marque cette zone.

**Fichiers modifiés** :
- `src/views/CognitiveHeartView.tsx` — repositionner les MEMOIRE extension plus loin, ajouter composant NebulaZone
- `src/constants/schema.ts` — ajouter constante NEBULA_RADIUS

**Critère de validation** : Les extensions flottent dans une zone périphérique visible.

---

## Ⅳ. CONTRAINTES ET ANTI-PIÈGES

| # | Anti-piège | Comment M2 le respecte |
|---|-----------|----------------------|
| 1 | Pas de particle.js | Toutes animations CSS keyframes uniquement |
| 2 | Zéro fausse donnée | matterState et curtain calculés depuis les tags réels du JSON |
| 3 | Pas de sur-ingénierie | Chaque sous-étape est indépendante. M2.1 seul donne déjà la profondeur |
| 4 | Pas d'abstraction prématurée | Pas de hook useMatterState. Fonction simple computeMatterState |
| 5 | Pas de décoratif | Cristal = souveraineté info. Vapeur = instabilité info. Refus = blocage info |

---

## Ⅴ. VALIDATION FINALE M2

M2 est complet quand :

- [ ] On distingue au premier regard un CORE d'un CANDIDATE
- [ ] On voit la cristallisation (Cristal vs Vapeur vs Liquide)
- [ ] Les mutations rolled_back apparaissent comme des fantômes
- [ ] Cliquer un axiome scellé déclenche Le Refus
- [ ] Les extensions flottent dans la Nébuleuse
- [ ] `npx tsc --noEmit` passe sans erreur
- [ ] `pnpm build` produit < 210 KB
- [ ] Zéro `requestAnimationFrame` dans le code

---

*PLAN M2 · LES ÉTATS DE LA MATIÈRE — Face à l'immensité de la matrice, quel signe vas-tu inscrire aujourd'hui ?*
