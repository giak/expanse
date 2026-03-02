# EXPANSE — Architecture Manifest
> Source de vérité de la structure du système EXPANSE.
> **Maintenu par les skills** : toute modification de la structure (ADD/DELETE/RENAME de fichier ou dossier) doit être reflétée ici via une tâche `[MANIFEST]` dans le plan de cristallisation.

**Version :** 1.0 — 2026-03-01
**Mis à jour par :** skills/writing-plans (tâche `[MANIFEST]`)

---

## Point d'Entrée

```
prompts/expanse-system.md        ← Point d'entrée EXECUTABLE
```

C'est l'**invariant absolu** du système. Charger ce fichier = activer EXPANSE.

---

## Runtime EXECUTABLE

```
prompts/expanse-executable.md   ← Runtime EXECUTABLE (nouveau format)
```

---

## Chaîne de Boot

```
prompts/expanse-system.md
  ├── prompts/expanse-bios.md       ← BIOS : symboles, EXECUTE
  ├── prompts/expanse-boot.md       ← Séquence boot ([BOOT]/[OK]/[FAIL]/[SKIP])
  └── prompts/expanse-runtime.md    ← Runtime : Flux Vital + Identity CHECK
```

---

## Orchestrateur

```
prompts/meta_prompt.md              ← Orchestrateur central du Flux Vital
```

Toute modification du Flux Vital passe par ce fichier.

---

## Organes du Flux Vital

### Σ — Sigma (Input Processing)
```
prompts/sigma/
  ├── parse_input.md        ← Parser l'input brut, détecter ton et ambiguïtés
  ├── retrieve_context.md   ← Récupérer mémoire Mnemolite
  ├── warm_start.md         ← Retrieve context from Mnemolite at boot
  ├── detect_ecs.md         ← Calculer ECS (C < 2.5 léger / C ≥ 2.5 structuré)
  └── ecs_weights.md        ← Load/save ECS weights from Mnemolite
```

### Ψ — Psi (Metacognition & Reasoning)
```
prompts/psi/
  ├── trace_reasoning.md    ← Tracer le raisonnement
  ├── detect_patterns.md    ← Détecter les patterns émergents
  └── meta_reflect.md       ← Méta-réflexion (∇Ω)
```

### Φ — Phi (Verification & Reality Check)
```
prompts/phi/
  ├── doubt_audit.md        ← Challenger chaque assumption
  ├── tool_interact.md      ← Utiliser les outils (Mnemolite, search, etc.)
  └── verify_reality.md     ← Ancrer dans le réel, éliminer hallucinations
```

### Ω — Omega (Synthesis & Output)
```
prompts/omega/
  ├── synthesize.md         ← Synthèse finale
  ├── format_output.md      ← Format de sortie selon trace_level
  └── decide_action.md      ← Décision sur l'action suivante
```

### Μ — Mu (Memory & Crystallization)
```
prompts/mu/
  ├── crystallize.md        ← Archiver dans Mnemolite (auto si auto_mu=true)
  ├── extract_rules.md      ← Extraire [CORE_RULE] / [HEURISTIC]
  └── memory_dump.md        ← Dump de mémoire
```

---

## Systèmes Adaptatifs

```
prompts/feedback_loop.md    ← Évaluation qualité (0-1) + mise à jour poids ECS
prompts/trace_levels.md     ← 4 niveaux : 0=silent | 1=minimal | 2=standard | 3=debug
```

---

## Documentation & Fondations

```
docs/ONTOLOGY.md            ← Catalogue symboles, opérateurs, marqueurs
docs/METAGUIDE.md           ← Règles de compression sémantique
docs/EXPANSE-MANIFEST.md    ← Ce fichier — architecture courante
docs/plans/                 ← Designs et plans de cristallisation
docs/state/                 ← Cartes système (optionnel, générées par system-read)
docs/retrospectives/        ← Rétrospectives (optionnel, générées par retrospective)

KERNEL.md                   ← Substrat philosophique, principes fondateurs
kb/ARCHITECTURE.md          ← Intégration Mnemolite, taxonomie mémoire, ECS
```

---

## Ontologie Courante

### Organes Cognitifs
| Symbole | Nom | Fonction |
|---------|-----|----------|
| Σ | Sigma | Input processing, retrieval |
| Ψ | Psi | Metacognition, reasoning trace |
| Ω | Omega | Executive output, synthesis |
| Φ | Phi | Self-correction, tool interaction, audit |
| Μ | Mu | Memory, crystallization, Mnemolite |

### Marqueurs Mémoire
| Marqueur | Usage |
|----------|-------|
| `[CORE_RULE]` | Règle architecturale immuable |
| `[HEURISTIC]` | Raccourci validé (8/10) |
| `[PATTERN]` | Séquence récurrente extraite |
| `[TRACE]` | Résultat d'investigation notable |
| `[LOST]` | Information non fournie |
| `[INCOMPLETE]` | Connaissance partielle |

### ECS (Evaluation of Cognitive Complexity)
- `C < 2.5` → Lightweight mode
- `C ≥ 2.5` → Structured mode (boucle Ψ⇌Φ activée)
- Formule : `C = (ambiguity + knowledge + reasoning + tools) / 4`
- Poids adaptatifs : stockés dans Mnemolite si `ecs_dyn=true`

---

## Règles de Mise à Jour

> Ces règles sont appliquées par les skills — pas manuellement.

1. **Toute tâche `[ADD]` de fichier/dossier** → ajouter au MANIFEST dans la section correspondante
2. **Toute tâche `[DELETE]` de fichier/dossier** → retirer du MANIFEST
3. **Toute tâche `[RENAME]`** → mettre à jour le chemin dans le MANIFEST
4. **Tout `[ADD]` d'organe entier** → créer une nouvelle section `## [Symbole] — Nom`
5. **Tout `[ADD]` de symbole** → ajouter à la table Ontologie Courante
6. **La tâche `[MANIFEST]`** est systématiquement ajoutée par `writing-plans` dès qu'un plan contient une mutation structurelle (ADD/DELETE/RENAME/REFACTOR de fichiers)
