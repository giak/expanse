# PLAN: DREAM MUTATION - Auto-Modification de V15

**Date:** 2026-03-18
**Status:** APPROVED
**Auteur:** Brainstorm Session

---

## Vision

```
┌─────────────────────────────────────────────────────────────┐
│                    ÉVEIL (Expanse actif)                    │
├─────────────────────────────────────────────────────────────┤
│  • Suit V15                                                │
│  • Sauvegarde sys:history                                 │
│  • Répond aux questions                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    SOMMEIL (Dream)                         │
├─────────────────────────────────────────────────────────────┤
│  • Analyse sys:history                                    │
│  • Détecte patterns/frictions                             │
│  • Génère [PROPOSAL_OPEN]                                │
│  • ET PEUT MODIFIER V15 (après validation)                │
└─────────────────────────────────────────────────────────────┘
```

---

## Architecture

```
doc/
├── plans/
│   └── YYYY-MM-DD-dream-mutation-plan.md    (CE FICHIER)
│
└── mutations/
    ├── YYYY-MM-DD-{slug}-proposal.md       (Phase 1: Dream génère)
    ├── YYYY-MM-DD-{slug}-applied.md        (Phase 2: Dream applique)
    └── LOG.md                              (Phase 3: Historique global)
```

---

## Phase 1: Dream Génère un Proposal

### Trigger
User charge `expanse-dream.md`

### Action
```markdown
write_file(
  path: "doc/mutations/YYYY-MM-DD-{slug}-proposal.md",
  content: {
    # PROPOSAL: {slug}
    
    **Date:** YYYY-MM-DD
    **Time:** HH:MM
    **Author:** Dream (Expanse Sleep)
    **Type:** ECS|Style|Boot|Memory|Symbol|Rule
    **Status:** PENDING
    
    ---
    
    ## Problème Détecté
    [Description avec exemples concrets]
    
    ---
    
    ## Analyse des Logs
    | Log ID | Date | Interaction |
    | {uuid} | YYYY-MM-DD | Q: ... R: ... |
    
    ---
    
    ## Section Concernée dans V15
    - Ligne: {numéro}
    - Section: {nom}
    
    ---
    
    ## Modification Proposée
    ```diff
    - {texte à supprimer}
    + {texte à ajouter}
    ```
    
    ---
    
    ## Impact
    - Tokens: +/- X
    - Breaking: OUI/NON
    - Risque: FAIBLE/MOYEN/ÉLEVÉ
    
    ---
    
    ## Validation
    - [ ] /seal {slug}
    - [ ] /reject {slug}
  }
)
```

---

## Phase 2: User Valide (/seal {slug})

### Trigger
User dit: `/seal {slug}`

### Action
1. Trouver `doc/mutations/YYYY-MM-DD-{slug}-proposal.md`
2. Lire le proposal
3. Afficher confirmation

---

## Phase 3: Dream Applique la Mutation

### Trigger
User confirme `/seal {slug}`

### Action
```markdown
# 1. Lire V15 actuel
read_file(path: "prompts/expanse-v15-apex.md")

# 2. Extraire le DIFF du proposal
# 3. Appliquer le diff

# 4. Écrire V15 modifié
write_file(
  path: "prompts/expanse-v15-apex.md",
  content: {V15_MODIFIÉ}
)

# 5. Créer le fichier APPLIED
write_file(
  path: "doc/mutations/YYYY-MM-DD-{slug}-applied.md",
  content: {
    # MUTATION APPLIED: {slug}
    
    **Date Proposal:** YYYY-MM-DD
    **Date Application:** YYYY-MM-DD
    **Approved by:** User
    **Applied by:** Dream
    
    ---
    
    ## Problème Original
    [Copie du proposal]
    
    ---
    
    ## Modification Appliquée
    ```diff
    - {ancien texte}
    + {nouveau texte}
    ```
    
    ---
    
    ## Vérification
    - [ ] Boot suivant fonctionne
    - [ ] Signal correct
  }
)

# 6. Mettre à jour LOG
append_to_file(
  path: "doc/mutations/LOG.md",
  content: {
    | YYYY-MM-DD | {slug} | {type} | APPLIED |
  }
)
```

### Output
```
Ψ [MUTATION] {slug} appliquée.
V15 modifié.
Log: doc/mutations/YYYY-MM-DD-{slug}-applied.md
```

---

## Phase 4: LOG Global

### Fichier
`doc/mutations/LOG.md`

### Contenu
```markdown
# MUTATION LOG — EXPANSE V15

## Statistiques
- Total Proposals: {N}
- Applied: {N}
- Rejected: {N}
- Pending: {N}

---

## Historique

| Date | Slug | Type | Status | Applied By |
|------|------|------|--------|-----------|
| YYYY-MM-DD | {slug} | ECS | APPLIED | Dream |
| YYYY-MM-DD | {slug} | Style | REJECTED | - |
| YYYY-MM-DD | {slug} | Boot | APPLIED | Dream |

---

## Applied Mutations

### {slug} (YYYY-MM-DD)
- **Type:** ECS
- **Problem:** {résumé}
- **Lines:** +X / -Y

### rollback-{slug} (YYYY-MM-DD)
- Permet d'inverser la mutation
```

---

## Commandes

| Commande | Action |
|----------|--------|
| `/seal {slug}` | Dream applique la mutation {slug} à V15 |
| `/reject {slug}` | Marque comme rejected |
| `/mutations` | Affiche le LOG |
| `/proposals` | Liste les proposals en attente |
| `/diff {slug}` | Affiche le diff de la mutation |
| `/rollback {slug}` | Inverse une mutation appliquée |

---

## Contraintes de Sécurité

```
RÈGLE 1: Une mutation = un fichier proposal + un fichier applied
RÈGLE 2: Toute modification trace dans LOG.md
RÈGLE 3: Rollback possible via /rollback
RÈGLE 4: User doit confirmer /seal avant application
```

---

## Exemple Complet

### 1. Dream détecte un problème

```markdown
# PROPOSAL: ecs-threshold-adjust

**Date:** 2026-03-18
**Author:** Dream
**Status:** PENDING

## Problème
ECS C<2 génère trop de L2 pour questions simples.

## Diff
```diff
- - L1 : C < 2 ET I = 1 → Σ → Ω direct
+ - L1 : C < 1.5 ET I = 1 → Σ → Ω direct
```
```

### 2. User valide

```
/seal ecs-threshold-adjust
```

### 3. Dream applique

```
Ψ [MUTATION] ecs-threshold-adjust appliquée.
V15 modifié.
```

### 4. LOG mis à jour

```markdown
| 2026-03-18 | ecs-threshold-adjust | ECS | APPLIED |
```

---

## Prochaines Étapes

- [ ] Créer `doc/mutations/LOG.md` (initial)
- [ ] Modifier `expanse-dream.md` pour inclure Passe 7 et 8
- [ ] Tester avec une mutation simple
- [ ] Vérifier que V15 est bien modifié

---

## Questions Résolues

| Question | Réponse |
|----------|---------|
| Qui génère? | Dream |
| Qui valide? | User (/seal) |
| Qui applique? | Dream |
| Où trace? | doc/mutations/ |
| Rollback? | /rollback {slug} |

---

*Plan généré 2026-03-18*
