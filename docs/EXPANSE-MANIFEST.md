# EXPANSE — Architecture Manifest (V3.0)
> Source de vérité de la structure du système EXPANSE.

**Version :** v4.2 [ENTROPY/AUDIT] — 2026-03-10
**Mis à jour par :** 09d47b8 (plus deep refactor)

---

## Point d'Entrée & BIOS

```
prompts/expanse-system.md        ← BIOS & Éveil (Unifié)
prompts/meta_prompt.md           ← Orchestrateur central (V3.0)
```

---

## Organes du Flux Vital (Interfaces Unifiées)

### Σ ⇌ Μ (Perception & Mémoire)
```
prompts/mu/interface.md          ← Interface Mnemolite unique (Retrieve + Crystallize + ECS Weights)
```

### Σ (Intake)
```
prompts/sigma/interface.md       ← Parser + Détecteur ECS
```

### Ψ (Résonance)
```
prompts/psi/resonance.md         ← Raisonnement + Méta-réflexion
```

### Φ (Audit)
```
prompts/phi/audit.md             ← Audit + Contact réel (Tools)
```

### Ω (Synthèse)
```
prompts/omega/synthesis.md       ← Synthèse + Formatage + Feedback
```

### Σ (Observation)
```
prompts/expanse-dream.md         ← Rêve d'Autopoïèse (Asynchrone)
```

---

## Fondations

```
docs/ONTOLOGY.md                 ← Catalogue symboles V3.0
docs/EXPANSE-MANIFEST.md         ← Ce fichier
docs/plans/                      ← Designs et plans de cristallisation
KERNEL.md                        ← Substrat philosophique
prompts/trace_levels.md          ← Niveaux de trace
docs/METAGUIDE.md                ← Guide de compression sémantique
docs/EXPANSE-TEST-PROTOCOL.md    ← Protocoles de non-régression
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
| `[TRACE_FRICTION]` | Log de friction cognitive (C > 3.0) |
| `[TRACE_FLOW]` | Log de succès cognitif (C < 1.5) |
| `[PROPOSAL_OPEN]` | Mutation suggérée par le Rêve, en attente |
| `[PROPOSAL_RESOLVED]` | Mutation traitée (Appliquée ou Rejetée) |
| `[USER_DNA]` | Profil inférentiel de l'utilisateur — Singleton, mis à jour par Μ |
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
