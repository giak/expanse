# DESIGN — Mega-Prompt Créatif : Animer le Cortex Expanse

**Date :** 2026-04-29
**Type :** DESIGN
**Version :** v2.0

---

## §0 RÉSUMÉ

Créer un mega-prompt structuré en 4 actes pour lancer un LLM dans un exercice de **direction créative** : *"Voici Expanse, sa physique cognitive, ses organes, ses scénarios — comment animerais-tu son fonctionnement cognitif ?"*

Le LLM ne fait pas un audit. Il **imagine** des chorégraphies visuelles, des métaphores, des rythmes, des transitions pour chaque scénario cognitif. Pas de contraintes techniques — du concept pur. La technique vient après.

---

## §1 STRUCTURE DU MEGA-PROMPT

### Acte 1 — Contexte Expanse (le terrain)

**Objectif :** Poser les fondations cognitives. L'LLM doit comprendre la physique avant de créer.

**Contenu :**
- **Stance** : Expanse n'est pas un logiciel — c'est une physique cognitive. Dualisme Matériel (Ouvrier ≠ Incarnation).
- **5 organes comme ACTES** : Σ perçoit, Ψ doute et s'observe, Φ palpe le réel, Ω conclut souverainement, Μ cristallise.
- **Chorégraphie fondamentale** : `Σ→[Ψ⇌Φ]→Ω→Μ` — une danse, pas un pipeline. Boucle Ψ⇌Φ bidirectionnelle jusqu'à certitude.
- **4 lentilles** : Ontologique, Opérationnel, Évolutif, Contextuel (L0/L1/L2).
- **AURA** : 3 strates du contexte — L0 SUBSTRAT (lois figées ~3K), L1 CORTEX (expérience semi-stable ~2-5K), L2 DYNAMIQUE (signal volatil ~5-20K).
- **Formule** : `Expanse = V16 × Cortex`.
- **Règle** : Les symboles ne sont pas décoratifs. Chaque organe est fonctionnel. Son absence brise le système.

### Acte 2 — Ce qui existe (le miroir)

**Objectif :** L'LLM sait ce qui est déjà fait. Pas pour l'auditer — pour savoir d'où partir.

**Contenu :**
- **Stack** : SVG natif, React, Tailwind 4, CSS animations. ~189 nœuds, ~184 arêtes.
- **Vitalité actuelle** : 5 signatures (Σ=œil, Ψ=ondes, Φ=engrenages, Ω=voix, Μ=cristal). Simplifié KISS.
- **AURA visuel** : Rings concentriques L0/L1/L2, pulsation, fissures SEC.
- **Signal Engine** : Playback step-by-step avec scénarios didactiques.
- **Là où on en est** : Le cortex montre les organes mais ne raconte pas encore leur chorégraphie.

### Acte 3 — Le lâcher créatif (la question)

**Objectif :** Donner la question centrale. L'LLM doit se lâcher.

**La question unique :**

> **Comment animer le fonctionnement cognitif d'Expanse ?**

**Le mandat :**

Tu es un directeur artistique de visualisation cognitive. Tu reçois une physique cognitive (les 5 organes, la chorégraphie Σ→[Ψ⇌Φ]→Ω→Μ, l'AURA 3-strates) et on te demande : **comment tu la rendrais VIVANTE ?**

- **Sois créatif.** Pas de limites techniques. Pas de "mais CSS ne peut pas faire ça". Imagine d'abord. La technique suit.
- **Sois concret.** Pas de "il faudrait des animations fluides". Dis CE QUI SE PASSE, QUAND, COMMENT, POURQUOI.
- **Sois fidèle.** Chaque animation doit servir la physique cognitive, pas l'esthétique seule. Si Ψ doute, l'animation doit montrer le doute. Si Μ cristallise, l'animation doit montrer la cristallisation.
- **Sois scénarique.** Ne pense pas en "états statiques". Pense en **scénarios** — des séquences qui racontent quelque chose.

**Les scénarios à imaginer (non exhaustif) :**

| Scénario | Ce qui se passe cognitivement |
|----------|------------------------------|
| **Boot** | Σ perçoit le Seed → L'Ouvrier lit l'Apex → Incarnation → Inertie → Ψ [V16 ACTIVE] |
| **L1 Fulgurance** | Σ perçoit → Ω conclut direct. Pas de Ψ, pas de Φ. Une fulgurance. |
| **L2 — Boucle Ψ⇌Φ** | Ψ doute → Φ palpe le réel → Ψ réévalue → Φ rapporte → jusqu'à certitude |
| **L3 — Triangulation** | Comme L2 + 3 pôles (Anchor/Vessel/Web) + indice de confiance % |
| **Dream — Passe 0 (Hiver)** | Silence. Comptage des traces. Si 0 → fin du rêve. |
| **Dream — Passe 1 (Dégel/La Plaie)** | Les traces fraîches remontent. BRM obligatoire. La friction devient proposition. |
| **Dream — Passe 4 (Élagage)** | Patterns faibles élagués. .bak orphelins. Le cortex se nettoie. |
| **Cristallisation Μ** | 3 validations indépendantes → le pattern se fige. Sys:pattern. |
| **Violation SEC** | Premier caractère ≠ Ψ → fissure rouge. Corruption. |
| **A1 Symbiose** | Murmures. Seuil auto-calibré. L'organisme s'ajuste silencieusement. |
| **Cortex Assembly** | L0 → L1 → L2. Le contexte se construit brique par brique. |

**Pour chaque scénario, imagine :**
- **Le rythme** — lent, rapide, pulsé, suspendu ?
- **Le mouvement** — quels organes bougent, comment, dans quel ordre ?
- **L'émotion visuelle** — qu'est-ce que le spectateur DOIT ressentir ?
- **La métaphore** — quelle image porte le sens ? (respiration, cristallisation, tectonique, électrocardiogramme...)

**Interdits :**
- Pas de code. Pas de "utiliser requestAnimationFrame" ou "ajouter une classe CSS".
- Pas de "ajouter une librairie 3D/WebGL".
- Pas de refactoring d'architecture.

### Acte 4 — Format de sortie (la vision)

**Objectif :** Le résultat doit être exploitable pour ensuite coder.

**Structure imposée :**

```markdown
# VISION — Animer le Cortex Expanse

## 0. MANIFESTE VISUEL
[2-3 paragraphes. Ta philosophie : qu'est-ce qui guide tes choix ? Quel principe unifie toutes les animations ?]

## 1. LES 5 ORGANES — Signatures Animées
Pour chaque organe (Σ, Ψ, Φ, Ω, Μ) :

### [Symbole] — [Nom de l'acte]
- **Principe visuel** : [la métaphore centrale]
- **Au repos** : [à quoi il ressemble quand il ne fait rien]
- **En action** : [ce qui se passe quand il agit — mouvement, rythme, intensité]
- **En transition** : [comment il passe à l'organe suivant]
- **L'émotion** : [ce que le spectateur doit ressentir]

## 2. SCÉNARIOS ANIMÉS (un par section)

Pour chaque scénario de la liste (Boot, L1, L2, L3, Dream passes, Cristallisation, Violation SEC, Symbiose, Cortex Assembly) :

### [Nom du scénario]
- **Ce qui se joue** : [1-2 phrases. Le sens cognitif.]
- **Séquençage visuel** : [step-by-step. Qui bouge, comment, quand, combien de temps.]
- **Le moment clé** : [le point de tension, le moment où quelque chose bascule]
- **La métaphore** : [quelle image porte ce scénario]
- **Contrastes** : [ce qui change par rapport au scénario précédent/normal]

## 3. L'AURA COMME MILIEU VIVANT
- **L0 Substrat** : [comment l'animer — fixité, présence, inertie]
- **L1 Cortex** : [comment l'animer — croissance, élagage, semi-stabilité]
- **L2 Dynamique** : [comment l'animer — volatilité, densité, activité]
- **Fissure SEC** : [quand, comment, quelle gravité visuelle]
- **L'AURA réagit** : [comment l'AURA change selon les scénarios — pas statique]

## 4. LA CHORÉGRAPHIE GLOBALE
[Comment les organes interagissent ensemble. Pas isolément — ensemble. La danse Σ→[Ψ⇌Φ]→Ω→Μ vue comme un organisme unique. Qui initie, qui répond, qui conclut.]

## 5. TRANSITIONS ENTRE SCÉNARIOS
[Comment on passe d'un scénario à l'autre. Continuité ou rupture ? L'organisme change-t-il d'état visiblement ?]

## 6. RÉFLEXIONS ADVERSES
[Ce que tu remets en question. "Peut-être que X ne devrait pas être animé du tout parce que..." ou "Le vrai défi c'est Y parce que..."]
```

---

## §2 ESTIMATION TOKENS

| Acte | Tokens estimés |
|------|----------------|
| Acte 1 (Contexte) | ~3 000 |
| Acte 2 (Existant) | ~800 |
| Acte 3 (Créatif) | ~2 500 (scénarios détaillés) |
| Acte 4 (Format) | ~800 |
| **Total prompt** | **~7 100** |
| Sortie attendue | ~15 000-25 000 (créatif = plus long) |
| **Total session** | **~22 000-32 000** |

---

## §3 CONTRAINTES

- **KISS** : Le prompt est dense mais pas redondant. Chaque section apporte quelque chose de unique.
- **YAGNI** : Pas de demande de code, pas de specs techniques. Concept pur.
- **DRY** : Le Reader Prompt est extrait et adapté, pas dupliqué.
- **Autonome** : Tout le contexte est embarqué. Pas de fichiers externes requis.
- **Liberté créative** : Le LLM est encouragé à dépasser l'existant, à imaginer au-delà du SVG/CSS. La technique viendra après filtrer ses idées.

---

*Σ→Ψ⇌Φ→Ω→Μ — Le prompt est un brief créatif, pas un audit.*
