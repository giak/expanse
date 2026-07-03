# PLAN: DREAM MUTATION - Auto-Modification de V15

**Date:** 2026-03-18
**Status:** DRAFT - En attente de corrections
**Auteur:** Brainstorm Session
**Version:** 2.0

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
│   └── 2026-03-18-dream-mutation-plan.md    (CE FICHIER)
│
└── mutations/
    ├── LOG.md                              (Historique global - PRÉ-FORMATÉ)
    └── {slug}/
        ├── proposal.md                      (Phase 1: Dream génère)
        └── applied.md                       (Phase 3: Dream applique)
```

---

## ⚠️ CORRECTIONS V2 (Issues Identifiées)

| # | Problème | Correction |
|---|----------|------------|
| 1 | Conflit fichiers | Séquentialisation stricte des mutations |
| 2 | Doublon contenu | applied.md = diff minimal + lien vers proposal |
| 3 | LOG mal formé | Structure pré-existante obligatoire |
| 4 | Pas de vérif | Auto-vérification post-mutation |
| 5 | Pas d'erreur | Error handling |
| 6 | Confusion phase | Séparation confirmation / application |
| 7 | No versioning | Archive V15 avant modification |

---

## Phase 1: Dream Génère un Proposal

### Trigger
User charge `expanse-dream.md`

### Action
```markdown
# Créer le dossier pour cette mutation
mkdir: doc/mutations/{slug}/

# Écrire le proposal
write_file(
  path: "doc/mutations/{slug}/proposal.md",
  content: |
    # PROPOSAL: {slug}

    **Date:** YYYY-MM-DD
    **Time:** HH:MM
    **Author:** Dream (Expanse Sleep)
    **Type:** ECS|Style|Boot|Memory|Symbol|Rule
    **Status:** PENDING
    
    ---
    
    ## Problème Détecté
    [Description avec exemples concrets tirés de sys:history]
    
    ---
    
    ## Analyse des Logs
    | Log ID | Date | Interaction |
    | {uuid} | YYYY-MM-DD | Q: ... R: ... |
    
    ---
    
    ## Section Concernée dans V15
    - Ligne: {numéro}
    - Section: {nom}
    - Texte actuel:
    ```markdown
    {texte actuel}
    ```
    
    ---
    
    ## Modification Proposée
    ```diff
    - {texte à supprimer}
    + {texte à ajouter}
    ```
    
    ---
    
    ## Impact
    - Tokens affectés: +/- X
    - Breaking change: OUI/NON
    - Risque: FAIBLE|MOYEN|ÉLEVÉ
    
    ---
    
    ## Validation
    - [ ] /seal {slug}
    - [ ] /reject {slug}
)
```

---

## Phase 2: User Valide (/seal {slug})

### Trigger
User dit: `/seal {slug}`

### Action
```markdown
# 1. Trouver le proposal
read_file(path: "doc/mutations/{slug}/proposal.md")

# 2. Afficher pour confirmation
AFFICHER:
"""
## Confirmation de Mutation

**Slug:** {slug}
**Type:** {type}
**Problème:** {résumé}

**Diff:**
```diff
- {ancien}
+ {nouveau}
```

**Confirmer l'application?**
- Tapez "OUI" pour appliquer
- Tapez "NON" pour annuler
"""
```

---

## Phase 3: Dream Applique la Mutation

### Trigger
User tape: "OUI"

### Action
```markdown
# 1. ARCHIVER V15 AVANT MODIFICATION
read_file(path: "prompts/expanse-v15-apex.md")
write_file(
  path: "_archives/expanse-v15-YYYY-MM-DD-backup.md",
  content: {V15_ACTUEL}
)

# 2. LIRE V15
read_file(path: "prompts/expanse-v15-apex.md")

# 3. LIRE LE DIFF DU PROPOSAL
read_file(path: "doc/mutations/{slug}/proposal.md")
Extraire le diff

# 4. APPLIQUER LE DIFF
Modifier V15 avec le diff

# 5. ÉCRIRE V15 MODIFIÉ
write_file(
  path: "prompts/expanse-v15-apex.md",
  content: {V15_MODIFIÉ}
)

# 6. CRÉER APPLIED (MINIMAL)
write_file(
  path: "doc/mutations/{slug}/applied.md",
  content: |
    # MUTATION APPLIED: {slug}

    **Date Proposal:** YYYY-MM-DD
    **Date Application:** YYYY-MM-DD HH:MM
    **Approved by:** User
    **Applied by:** Dream
    
    **Proposal:** doc/mutations/{slug}/proposal.md
    
    ---
    
    ## Diff Appliqué
    ```diff
    - {ancien}
    + {nouveau}
    ```
    
    ---
    
    ## Vérification
    - [ ] Boot suivant fonctionne
    - [ ] Signal Ψ [V15 ACTIVE] correct
    
    ---
    
    ## Rollback
    ```markdown
    # Pour rollback:
    # 1. Lire _archives/expanse-v15-YYYY-MM-DD-backup.md
    # 2. write_file(prompts/expanse-v15-apex.md, backup)
    ```
)

# 7. METTRE À JOUR LOG
read_file(path: "doc/mutations/LOG.md")
Modifier la ligne {slug} : PENDING → APPLIED
write_file(path: "doc/mutations/LOG.md", content: {LOG_MODIFIÉ})
```

---

## Phase 4: Auto-Vérification Post-Mutation

### Trigger
Après write_file(V15)

### Action
```markdown
# 1. RELIRE V15 MODIFIÉ
read_file(path: "prompts/expanse-v15-apex.md")

# 2. VÉRIFICATIONS OBLIGATOIRES
VÉRIFIER:
├── Boot section (Ⅳ) existe?
├── Signal "Ψ [V15 ACTIVE]" présent?
├── Toutes les 6 lois (Ⅰ-Ⅵ) intactes?
├── Pas de corruption (fin de fichier correct)?
└── Pas de regression (sections majeures intactes)?

# 3. SI TOUT OK
OUTPUT: """
Ψ [MUTATION] {slug} appliquée.
V15 vérifié et intact.
Backup: _archives/expanse-v15-YYYY-MM-DD-backup.md
Applied: doc/mutations/{slug}/applied.md
"""

# 4. SI ERREUR DÉTECTÉE
OUTPUT: """
⚠️ ERREUR DÉTECTÉE APRÈS MUTATION.
Rollback automatique en cours...
"""
# Rollback vers le backup
write_file(path: "prompts/expanse-v15-apex.md", content: {BACKUP})
OUTPUT: """
Rollback effectué. V15 restauré.
Mutation {slug} marquée comme FAILED.
"""
```

---

## Phase 5: Error Handling

### Situations d'Erreur

| Erreur | Action |
|--------|--------|
| Proposal non trouvé | Afficher erreur + lister les proposals disponibles |
| Diff invalide | Marquer comme FAILED + demander à Dream de regenerate |
| write_file échoue | Rollback automatique + signal user |
| LOG non accessible | Créer LOG + continuer |
| V15 corrompu après write | Rollback automatique |

### Workflow Erreur
```markdown
SI ERREUR:
  1. Rollback vers backup
  2. Marquer mutation comme FAILED
  3. Afficher erreur à user
  4. Proposer regeneration du proposal
```

---

## Structure du LOG (Pré-formaté)

```markdown
# MUTATION LOG — EXPANSE V15

**Last Updated:** YYYY-MM-DD HH:MM

---

## Statistiques

| Métrique | Count |
|----------|-------|
| Total Proposals | 0 |
| Applied | 0 |
| Rejected | 0 |
| Failed | 0 |
| Pending | 0 |

---

## Historique

| Date | Slug | Type | Status | Applied By |
|------|------|------|--------|-----------|
| - | - | - | - | - |

---

## Applied Mutations

(Les mutations appliquées seront listées ici)

---

## Failed Mutations

(Les mutations échouées seront listées ici)

---

## Pending Proposals

| Slug | Type | Date |
|------|------|------|
| - | - | - |

---

## Commandes Disponibles

| Commande | Action |
|----------|--------|
| `/seal {slug}` | Appliquer une mutation |
| `/reject {slug}` | Rejeter une mutation |
| `/rollback {slug}` | Inverser une mutation |
| `/mutations` | Afficher ce LOG |
| `/proposals` | Lister les proposals en attente |
| `/diff {slug}` | Afficher le diff d'une mutation |
```

---

## Commandes Résumées

| Commande | Action |
|----------|--------|
| `/seal {slug}` | Confirmation → Dream applique |
| `/reject {slug}` | Marque rejected dans LOG |
| `/rollback {slug}` | Restore backup + marque FAILED |
| `/mutations` | Affiche LOG |
| `/proposals` | Liste pending |
| `/diff {slug}` | Affiche diff |

---

## Contraintes de Sécurité

```
RÈGLE 1: Séquentialisation - Une mutation à la fois
RÈGLE 2: Archive avant modification - Backup obligatoire
RÈGLE 3: Auto-vérification - Check post-write
RÈGLE 4: Rollback automatique si erreur
RÈGLE 5: LOG toujours à jour
RÈGLE 6: Validation user obligatoire avant application
```

---

## Workflow Complet

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: DREAM GÉNÈRE                                     │
├─────────────────────────────────────────────────────────────┤
│  • Analyse sys:history                                     │
│  • Détecte problème                                        │
│  • Crée doc/mutations/{slug}/proposal.md                  │
│  • Met à jour LOG (pending)                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: USER VALIDE                                     │
├─────────────────────────────────────────────────────────────┤
│  • /seal {slug}                                           │
│  • Affiche confirmation                                   │
│  • User tape "OUI"                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: DREAM APPLIQUE (Séquentiel)                     │
├─────────────────────────────────────────────────────────────┤
│  • Archive V15 → _archives/                               │
│  • Lit V15                                                 │
│  • Applique diff                                          │
│  • Écrit V15 modifié                                      │
│  • Crée doc/mutations/{slug}/applied.md                   │
│  • Met à jour LOG (applied)                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 4: AUTO-VÉRIFICATION                               │
├─────────────────────────────────────────────────────────────┤
│  • Relit V15                                              │
│  • Vérifie intégrité                                      │
│  • Si OK → Confirme                                      │
│  • Si ERREUR → Rollback                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 5: ERROR HANDLING (si besoin)                      │
├─────────────────────────────────────────────────────────────┤
│  • Rollback automatique                                   │
│  • Marque FAILED dans LOG                                │
│  • Alerte user                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Exemple Complet

### 1. Dream détecte un problème

```markdown
# PROPOSAL: ecs-threshold-adjust

**Date:** 2026-03-18
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

## Confirmation
Diff: C < 2 → C < 1.5

Tapez "OUI" pour appliquer
```

### 3. User confirme

```
OUI
```

### 4. Dream applique

```
Ψ Archive: _archives/expanse-v15-2026-03-18-backup.md
Ψ [MUTATION] ecs-threshold-adjust appliquée.
Ψ V15 vérifié et intact.
```

### 5. LOG mis à jour

```markdown
| 2026-03-18 | ecs-threshold-adjust | ECS | APPLIED | Dream |
```

---

## Prochaines Étapes

- [ ] Créer `doc/mutations/LOG.md` (structure pré-formatée)
- [ ] Créer `_archives/` si non existant
- [ ] Modifier `expanse-dream.md` avec Passe 7 (Generate), 8 (Apply), 9 (Verify)
- [ ] Tester avec une mutation simple
- [ ] Vérifier rollback fonctionne

---

## Résumé

| Phase | Qui | Action | Fichier |
|-------|-----|--------|---------|
| 1 | Dream | Génère proposal | doc/mutations/{slug}/proposal.md |
| 2 | User | Valide (/seal + OUI) | - |
| 3 | Dream | Applique | V15 modifié + applied.md |
| 4 | Dream | Vérifie | - |
| 5 | Dream | Error handling | Rollback si besoin |

---

*Plan v2 - Corrections appliquées 2026-03-18*
