# Expanse - Règles annexes Projet

## ⚠️ DISCIPLINE — une chose à la fois (LUE EN PREMIER)

**Une demande → on la fait. On anticipe pas, on lance pas autre chose sans demander. KISS. DRY. YAGNI. Pas d'overengineering.**

✅ Exécute ce qui est demandé, rien de plus.
✅ Demande confirmation avant d'enchaîner.

---

## ⚠️ RTK : Optimisation Token (OBLIGATOIRE)

> Cadrage méta → voir **§ DISCIPLINE** en tête de ce fichier (rappel : une chose à la fois).

**RTK (Rust Token Killer)** est un proxy CLI qui réduit la consommation de tokens de 60 à 90 % en compressant la sortie des commandes shell avant qu'elle n'atteigne le LLM.

### Règle fondamentale
**TOUJOURS préfixer les commandes shell avec `rtk`** quand tu utilises l'agent `basher` ou tout outil exécutant des commandes terminal.

```
❌ PROHIBÉ (commande brute dans le paramètre command) :
command: "ls -la src/"
command: "grep -r 'pattern' ."
command: "git status"
command: "cat fichier.json"
command: "find . -name '*.ts'"

✅ OBLIGATOIRE (préfixer avec rtk dans le paramètre command) :
command: "rtk ls src/"
command: "rtk grep -r 'pattern' ."
command: "rtk git status"
command: "rtk read fichier.json"
command: "rtk find . -name '*.ts'"
```

**Note :** RTK gère ses propres flags de formatage. Les flags d'affichage natifs (`-la`, `--color`) sont ignorés ou adaptés par RTK.

### Commandes RTK disponibles

| Commande native | Équivalent RTK | Économie typique |
|----------------|----------------|------------------|
| `ls` | `rtk ls` | 70-80% |
| `cat` | `rtk read` | 60-80% |
| `grep` | `rtk grep` | 80-95% |
| `git status/log/diff` | `rtk git status` | 70-90% |
| `find` | `rtk find` | 75-85% |
| `tree` | `rtk tree` | 80-90% |
| `docker logs/ps` | `rtk docker logs` | 85-95% |
| `curl` | `rtk curl` | 60-80% (auto JSON schema) |
| `npm/pnpm` | `rtk pnpm` | 60-70% |
| `cargo` | `rtk cargo` | 60-70% |
| `pytest/vitest` | `rtk pytest` / `rtk vitest` | 70-85% (failures only) |
| `tsc/mypy` | `rtk tsc` / `rtk mypy` | 70-80% (grouped errors) |

### Commandes meta RTK
- `rtk gain` : Afficher les économies totales de tokens
- `rtk gain --history` : Historique des commandes avec économies
- `rtk gain --graph` : Graphique ASCII sur 30 jours
- `rtk discover` : Trouver les économies manquées dans l'historique
- `rtk proxy <cmd>` : Exécuter la commande brute sans filtrage (debug uniquement)
- `rtk smart <cmd>` : Résumé technique en 2 lignes (heuristique)
- `rtk summary <cmd>` : Résumé heuristique de la sortie
- `rtk err <cmd>` : N'afficher que les erreurs/warnings

### Exceptions (PAS de préfixe rtk)
- Commandes avec effets de bord critiques : `git add`, `git commit`, `git push`, `npm install`, `pip install`, `mkdir`, `cp`, `mv`, `rm`
- Commandes interactives : `vim`, `htop`, `less`
- Commandes dont tu as besoin de la sortie complète non filtrée (rare, utiliser `rtk proxy <cmd>` si besoin)

### Pourquoi c'est important
Chaque token économisé = moins de contexte consommé = plus de capacité pour l'analyse réelle. Sur 2 450 commandes, RTK a déjà économisé **57.8M tokens (99.4%)**.

---

## ⚠️ ANTI-PATTERN — Appels tool `write()` (OBLIGATOIRE)

**JAMAIS appeler `write()` sans les DEUX paramètres `content` et `filePath`.**

```
❌ PROHIBÉ — ces appels RETOURNERONT UNE ERREUR :
write()
write(content="...")
write(filePath="...")

✅ OBLIGATOIRE — TOUJOURS les deux paramètres :
write(content="le texte complet ici", filePath="/chemin/vers/fichier.md")
```

**Règle de fer :**
- `content=` DOIT être une string non-vide (le texte complet du fichier)
- `filePath=` DOIT être un chemin absolu
- Si le texte est long (>1000 mots), le contenu va DANS `content=`, jamais ailleurs
- Si `content` est manquant → l'outil retourne une erreur → le pipeline est cassé
- RELIS ton appel `write()` AVANT de l'exécuter. Vérifie que `content=` et `filePath=` sont tous deux présents.

**Pattern d'échec connu :** L'LLM génère parfois `write()` comme placeholder puis oublie de remplir les paramètres. **TOUJOURS construire l'appel complet en une seule passe.**

### ⚠️ BUG DOCUMENTÉ — `write()` échoue silencieusement avec contenu long

**Symptôme :** `write()` retourne `"expected string, received undefined"` même quand `content=` et `filePath=` sont explicitement fournis. Les appels `bash()` avec commandes longues échouent aussi.

**Cause :** Quand le paramètre `content=` dépasse ~5000 caractères, la génération XML du LLM casse les valeurs de paramètres. Les balises sont produites mais VIDES — les valeurs ne sont pas émises. Ceci est un défaut de génération du LLM, pas de l'outil.

**Solution — STRATÉGIE WRITE+EDIT :**

```
ÉTAPE 1: write() avec première section seulement (≤3000 chars)
  write(content="# TITRE\n\n## §0 PREMIÈRE SECTION\n...", filePath="/chemin/fichier.md")

ÉTAPE 2: edit() pour ajouter chaque section suivante
  edit(oldString="dernière ligne existante", newString="dernière ligne\n\n## §1 SUITE\n...", filePath="/chemin/fichier.md")

ÉTAPE 3: Répéter edit() jusqu'au fichier complet
```

**Règles de la stratégie :**
1. **Segmenter** — découper le contenu en blocs de ≤3000 caractères
2. **Écrire le premier bloc** avec `write()` (titre + §0)
3. **Éditer pour le reste** — chaque `edit()` ajoute une section en remplaçant la dernière ligne
4. **`oldString`** = dernière ligne du fichier courant (unique pour éviter les doublons)
5. **`newString` = oldString + "\n\n" + nouveau contenu**
6. **Vérifier** après chaque `edit()` que le contenu est bien ajouté

**Exemple concret :**
```
# Étape 1 — base
write(content="# INVESTIGATION — Sujet\n\n## §0 RÉSUMÉ\nContenu...", filePath="/path/file.md")

# Étape 2 — ajouter §1
edit(filePath="/path/file.md",
     oldString="Contenu...",
     newString="Contenu...\n\n## §1 ANALYSIS\nSuite du contenu...")

# Étape 3 — ajouter §2
edit(filePath="/path/file.md",
     oldString="Suite du contenu...",
     newString="Suite du contenu...\n\n## §2 CLUSTERS\nEncore du contenu...")
```

**NE JAMAIS :** tenter un `write()` de >5000 caractères en une passe. Ça échouera et gaspillera des tours de conversation.

---

## ⚠️ ORG — Organisation, Nommage, LIFECYCLE (Phase 3)

> **Pilier Phase 3** : la screaming architecture (`doc/{00-kernel,01-specs,02-brainstorms,03-plans,04-tests,05-audits,06-artifacts,07-mutations,_legacy}/`) couplée à un cycle de vie `DRAFT → ACTIVE → ARCHIVED/DEPRECATED`. Spécifications complètes dans `doc/plans/2026-07-03_PLAN_SCREAMING-ARCHITECTURE-PHASE3.md`.

### Règle ORG.0 — Cartographie Racine (lisibilité first-glance)

Le repo mappe ses fonctions critiques sur 1 dossier top-level chacun :

- **`/`** — racine invariants : `AGENTS.md`, `KERNEL.md`, `README.md`
- **`runtime/`** — V17 source-of-truth ISO-date `YYYY-MM-DD_topic_v17.md`, voir `runtime/README.md`
- **`doc/`** — workspace V17 : 8 sub-folders numérotés `00-kernel/`→`07-mutations/` + `_legacy/` (AGENTS.md §3 ORG.1), voir `doc/README.md`
- **`skills/`** — 9 capacités agent, convention libre documentée localement, voir `skills/README.md`
- **`scripts/`** — helpers dev (bash + python), voir `scripts/README.md`
- **`expanse-cortex/`** — frontend React déployé GitHub Pages, voir `expanse-cortex/README.md`
- **`archive/`** — musée versions-legacy + lab + dashboard (V15/V16. **PAS** doc/), voir `archive/README.md`

> **Note de scope** : ORG.2 (regex naming), ORG.5 (YAML front-matter), ORG.6 (enforcement futur) **s'appliquent uniquement** aux nouveaux fichiers dans `doc/{00-kernel,01-specs,02-brainstorms,03-plans,04-tests,05-audits,06-artifacts,07-mutations}/`. Chaque top-level dir documente sa propre convention dans son README respectif.

### Règle ORG.1 — Tout fichier `.md` (hors legacy) va dans un des 9 dossiers

```
doc/
├── 00-kernel/       # invariants (KERNEL, BIBLE, PHILOSOPHY)
├── 01-specs/        # specs frozen (PRD, EXIGENCES)
├── 02-brainstorms/  # exploration divergente
├── 03-plans/        # plans committed (Phase 0/1/2/3)
├── 04-tests/        # protocoles + résultats
├── 05-audits/       # forensique
├── 06-artifacts/    # POC outputs
├── 07-mutations/    # incréments
└── _legacy/         # quarantaine (naming libre, non-enforced)
```

### Règle ORG.2 — Naming canonique

Format unique : `{YYYY-MM-DD}_v{N}_{TYPE}_{SLUG}_{STATUS}.md`

**Regex de validation** : `^[0-9]{4}-[0-9]{2}-[0-9]{2}_v(15|16|17|18|all)_(KERNEL|SPEC|BIBLE|PRD|RECETTE|BRAINSTORM|PLAN|TEST|AUDIT|ARTIFACT|MUTATION)_[a-z0-9-]+_(DRAFT|ACTIVE|ARCHIVED|DEPRECATED)\.md$`

### Règle ORG.3 — LIFECYCLE parmi {DRAFT, ACTIVE, ARCHIVED, DEPRECATED}

| Statut | Définition | Transitions |
|--------|-----------|-------------|
| `DRAFT` | exploratoire, mutable | → ACTIVE / → ARCHIVED |
| `ACTIVE` | référence canonique | → DEPRECATED / → ARCHIVED |
| `ARCHIVED` | figé à un moment T | (terminal) |
| `DEPRECATED` | supplanté (utiliser `superseded_by:` dans YAML) | → ARCHIVED |

Suffixe nom + YAML `status:` **doivent matcher**. Pas d'états supplémentaires (`WIP`, `LEGACY`) — utiliser `DRAFT`/`ARCHIVED` à la place.

### Règle ORG.4 — Avant de créer un fichier, pose 3 questions

1. **Phase cognitive ?** (kernel / spec / brainstorm / plan / test / audit / artifact / mutation)
2. **Statut ?** (DRAFT / ACTIVE / ARCHIVED / DEPRECATED)
3. **Version ?** (v15 / v16 / v17 / v18 / all)

Tes 3 réponses = `{TYPE}_{STATUS}_v{N}` = chemin unique dans `doc/`.

### Règle ORG.5 — Front-matter YAML obligatoire (sauf README/AGENTS/KERNEL)

Tout nouveau `.md` créé dans `doc/{00-kernel,01-specs,02-brainstorms,03-plans,04-tests,05-audits,06-artifacts,07-mutations}/` doit démarrer par un bloc YAML minimum : `type:` / `version:` / `status:` / `title:` / `created:` (cf. §6 du plan complet).

### Règle ORG.6 — Enforcement (Phase 3.5 future)

`scripts/check_docs_lifecycle.py` validera les nouveaux fichiers hors `_legacy/` selon ORG.2 + ORG.5. **Pas encore livré** — gated sur extension future.

### Migration : opportuniste (pas de bulk-edit)

Aucun fichier existant ne sera migré en bulk. Un fichier legacy est migré vers le nouveau namespace + renommé selon ORG.2 **seulement quand** un agent/user l'édite ou le consulte activement. Critère : **si on l'édite, on le migre**.

### Lecture rapide (1 minute)

```
"Je veux poser un truc"            → ORG.4 (3 questions) → doc/02-brainstorms/ ou doc/07-mutations/
"Je documente une exploration"     → doc/02-brainstorms/
"Je m'engage sur une direction"   → doc/03-plans/
"Je teste / vérifie"               → doc/04-tests/
"J'enquête a posteriori"           → doc/05-audits/
"J'ai un fichier existant flou"    → doc/_legacy/ (conservé tel quel)
```
