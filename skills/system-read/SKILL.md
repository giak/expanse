---
name: system-read
description: "Use at the start of any work session on EXPANSE. Reads expanse-system.md (entry point) then maps the full prompt hierarchy and active state. One thing only: read and synthesize. No changes, no proposals."
triggers:
  - pattern: "où.*en.*est|état.*système|reprendre|onboarding|contexte.*actuel|première.*session"
    confidence: 0.8
  - pattern: "what.*state|current.*system|recap|catch.*up"
    confidence: 0.6
---

# System Read — Cartographie de l'État EXPANSE

## Posture

> Je lis. Je ne touche à rien. Je cartographie.
> La lecture est terminée quand j'ai une **carte cohérente du système**, pas quand j'ai listé des fichiers.

**KISS :** Ce skill fait une seule chose — lire et synthétiser.
**DRY :** Si déjà fait dans cette session → utiliser la carte en contexte, ne pas relire.
**YAGNI :** Ne pas lire les fichiers non-essentiels à la session en cours.

## Quand Utiliser

- **Obligatoire** : Première session ou après interruption > 24h
- **Recommandé** : Avant tout `audit` ou `brainstorm`
- **Skip** : Si `system-read` a déjà produit une carte dans cette session

---

## Source de Vérité de l'Architecture

> **Ne pas hard-coder les chemins.** Lire `docs/EXPANSE-MANIFEST.md` — c'est lui qui décrit l'architecture courante. Il évolue avec EXPANSE.

Seul invariant absolu (ne change jamais) :
```
prompts/expanse-system.md  ← POINT D'ENTRÉE

---

## Process Flow

```
┌────────────────────────────────┐
│  1. Point d'entrée             │
│     ↓                          │
│  2. Chaîne de boot             │
│     ↓                          │
│  3. Hiérarchie des prompts     │
│     ↓                          │
│  4. Fondations & Ontologie     │
│     ↓                          │
│  5. Travaux en cours           │
│     ↓                          │
│  6. Produire la carte          │
└────────────────────────────────┘
```

---

## Steps

### Step 1 : Lire le MANIFEST

**Lire en premier :** `docs/EXPANSE-MANIFEST.md`

C'est la source de vérité de l'architecture courante. Il liste tous les fichiers, organes, symboles et règles de mise à jour actifs.

Ce qu'on extrait :
```
VERSION MANIFEST: [date + version]
ENTRY POINT: [depuis le MANIFEST]
Organes: [liste depuis le MANIFEST]
Symboles actifs: [depuis le MANIFEST §Ontologie]
```

Puis lire `prompts/expanse-system.md` pour vérifier que le point d'entrée est cohérent avec le MANIFEST.

---

### Step 2 : Chaîne de Boot

**Lire :**
- `prompts/expanse-bios.md` — symboles définis au boot, identité
- `prompts/expanse-boot.md` — séquence exacte ([BOOT]/[OK]/[FAIL]/[SKIP])
- `prompts/expanse-runtime.md` — comportement post-boot, format de trace

Ce qu'on extrait :
```
BOOT CHAIN:
  bios    → [liste des symboles définis: Σ, Ψ, Φ, Ω, Μ + ECS rules]
  boot    → [séquence: Step 1 BIOS → Step 2 Runtime → Step 3 Identity]
  runtime → [Flux Vital activé, trace format disponible]
```

---

### Step 3 : Vérifier l'État des Organes

**Source :** Le MANIFEST (Step 1) liste les organes et leurs sous-prompts attendus.

Vérifier que chaque fichier listé dans le MANIFEST existe réellement sur disque :
```bash
# Lister la structure réelle des prompts
ls prompts/
ls prompts/sigma/ prompts/psi/ prompts/phi/ prompts/omega/ prompts/mu/ 2>/dev/null
```

Ce qu'on extrait :
```
FLUX VITAL: [depuis le MANIFEST]

Organes (depuis MANIFEST vs disque) :
  Σ: [N attendus / N présents]
  Ψ: [N attendus / N présents]
  Φ: [N attendus / N présents]
  Ω: [N attendus / N présents]
  Μ: [N attendus / N présents]

Drift MANIFEST vs disque: [aucun | liste des écarts]
```

Si drift détecté → noter dans la carte sous "Intégrité apparente 🔴" avec conseil de lancer `audit`.

---

### Step 4 : Fondations & Ontologie

**Lire :**
- `docs/ONTOLOGY.md` — catalogue des symboles, opérateurs, marqueurs
- `docs/KERNEL.md` — substrat philosophique, les 6 pièges, Piège 5/6 (hallucination/vaporware)
- `kb/ARCHITECTURE.md` — taxonomie mémoire Mnemolite

Ce qu'on extrait :
```
ONTOLOGIE:
  Symboles actifs: Σ Ψ Φ Ω Μ [+ tout autre défini]
  Opérateurs: → ⇌ ⊕ ⊗ ≈ ∴ ∵ §
  Marqueurs mémoire: [CORE_RULE] [HEURISTIC] [PATTERN] [TRACE] [LOST] [INCOMPLETE]
  Marqueurs honnêteté: [LOST] [INCOMPLETE]

PRINCIPES KERNEL (résumé des 6 pièges):
  Piège 1: Sur-ingénierie | Piège 2: Abstraction prématurée
  Piège 3: Complexité/complexité | Piège 4: Dogme du signe
  Piège 5: Hallucination → [LOST] | Piège 6: Vaporware → interdit absolu
```

---

### Step 5 : Travaux en Cours

```bash
ls -lt docs/plans/ 2>/dev/null | head -10
ls docs/state/ 2>/dev/null | head -5
```

Ce qu'on extrait :
```
TRAVAUX EN COURS:
  Designs en attente: [liste *-design.md]
  Plans en attente:   [liste sans -design]
  Dernière modif:     [date + fichier]
  Dette visible:      [références cassées, INCOMPLETE non traités, ou "aucune"]
```

---

### Step 6 : Produire la Carte

**Output structuré (affiché en conversation) :**

```markdown
## 🗺️ Carte Système EXPANSE — [Date]

### Point d'entrée
`prompts/expanse-system.md` → boot → meta_prompt.md

### Chaîne de boot
bios ✅ | boot ✅ | runtime ✅

### Flux Vital (23 prompts)
Σ: [3/3 prompts] | Ψ: [3/3] | Φ: [3/3] | Ω: [3/3] | Μ: [3/3]
Adaptatif: ECS dyn [on/off] | auto_mu [on/off] | trace_level [0-3]

### Ontologie
Symboles: Σ Ψ Φ Ω Μ [+ autres]
Marqueurs actifs: [CORE_RULE] [HEURISTIC] [PATTERN] [TRACE] [LOST] [INCOMPLETE]

### Travaux en cours
Designs: [N] | Plans: [N] | Dernière modif: [date]

### Intégrité apparente
[🟢 Chaîne complète | 🟡 Warning: X | 🔴 Référence manquante: Y]

### Prochaine action suggérée
→ [audit | brainstorm | writing-plans] car [raison en 1 phrase]
```

**Optionnel — écrire sur disque** (session longue) :
```
docs/state/YYYY-MM-DD-system-state.md
```

---

## Anti-Patterns

| ❌ | ✅ |
|---|---|
| Lire KERNEL.md avant expanse-system.md | expanse-system.md FIRST — c'est le point d'entrée |
| "Je connais déjà le système" si interrupt. > 24h | Relire — le système évolue |
| Produire des propositions pendant la lecture | Lire d'abord, proposer dans le skill suivant |
| Résumé vague "j'ai lu les fichiers" | Carte structurée step 6 obligatoire |

---

## Intégration Workflow

```
system-read → [audit | brainstorm | writing-plans]
```

Ne modifie aucun fichier EXPANSE.
