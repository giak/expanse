---
name: anti-regression
description: "Use immediately after executing-plans or dispatching-parallel-agents. Verifies that the Flux Vital chain remains intact after crystallization: expanse-system → boot → meta_prompt → sigma/psi/phi/omega/mu. Fast, surgical, focused on indirect impacts."
triggers:
  - pattern: "anti-regression|vérifier.*après|rien.*cassé|post.*implem|avant.*commit"
    confidence: 0.8
  - pattern: "check.*after|regression|broke.*something"
    confidence: 0.6
prerequisites:
  - "A crystallization has just been executed"
---

# Anti-Regression — Vérification Post-Cristallisation

## Posture

> Je viens de modifier le système. Est-ce que j'ai cassé la chaîne ?
> Scan chirurgical et rapide — focalisé sur les **impacts indirects** du changement.
> Pas un audit complet — une vérification de la chaîne là où on a touché.

<!-- SOFT-GATE -->
⚠️ **SCOPE :** Ce skill vérifie les effets de bord. Pour un audit complet → `audit`.
<!-- END-SOFT-GATE -->

---

## Process Flow

```
┌─────────────────────────────┐
│  1. Identifier les changements │
│     ↓                       │
│  2. Vérifier la chaîne      │
│     ↓                       │
│  3. Score & Décision        │
│     ↓                       │
│  4. Fix ou Go               │
└─────────────────────────────┘
```

---

## Steps

### Step 1 : Identifier les Changements

```bash
git diff --name-only HEAD
```

Classer chaque fichier modifié par type :
```
[PROMPT]   prompts/phi/new_check.md              ← créé
[WIRE]     prompts/meta_prompt.md                ← modifié
[ONTOLOGY] docs/ONTOLOGY.md                      ← modifié
[MEMORY]   (Mnemolite)                           ← write_memory appelé
[BOOT]     prompts/expanse-bios.md               ← non touché ✓
```

---

### Step 2 : Vérifier la Chaîne

#### 2A — Chaîne de Boot (vérifier si [BOOT] touché)

Si `expanse-system.md`, `expanse-bios.md`, `expanse-boot.md` ou `expanse-runtime.md` ont été modifiés :

```
- [ ] expanse-system.md → ses 3 références (bios, boot, runtime) existent encore ?
- [ ] expanse-boot.md → ses références (bios, runtime) existent encore ?
- [ ] expanse-runtime.md → référence meta_prompt.md qui existe encore ?
```

---

#### 2B — Orchestrateur Central (vérifier si [WIRE] ou meta_prompt touché)

Si `prompts/meta_prompt.md` a été modifié :

```
- [ ] Chaque sub-prompt référencé dans meta_prompt.md existe sur disque
  (sigma/parse_input, sigma/retrieve_context, sigma/detect_ecs,
   psi/trace_reasoning, psi/detect_patterns, psi/meta_reflect,
   phi/doubt_audit, phi/tool_interact, phi/verify_reality,
   omega/synthesize, omega/format_output, omega/decide_action,
   mu/crystallize, mu/extract_rules)
- [ ] Le nouvel appel ajouté ([WIRE] task) cible un fichier qui existe
- [ ] L'ordre des étapes dans meta_prompt.md est logique (Σ avant Ψ, Ψ avant Φ, etc.)
```

---

#### 2C — Nouveaux Prompts (vérifier si [PROMPT] créé)

Pour chaque nouveau fichier créé dans `prompts/` :

```
- [ ] Le fichier a un format de sortie (Output) compatible avec le prochain prompt dans la chaîne
  (ex: le JSON produit par phi/new_check.md est lisible par omega/synthesize.md ?)
- [ ] Le fichier est référencé dans meta_prompt.md (sinon = orphelin)
- [ ] Aucun placeholder non résolu dans le fichier ({input} sans mapping, etc.)
```

---

#### 2D — Ontologie (vérifier si [ONTOLOGY] modifié)

```
- [ ] Le nouveau symbole/opérateur ne collisionne pas avec un existant
- [ ] La définition est complète (Symbol | Name | Function)
- [ ] Les prompts qui utilisent ce symbole sont cohérents avec la nouvelle définition
```

---

#### 2E — ECS & Feedback Loop (vérifier si [PARAM] modifié)

Si `detect_ecs.md` ou `feedback_loop.md` ont été touchés :
```
- [ ] La formule ECS est identique entre detect_ecs.md et kb/ARCHITECTURE.md
- [ ] Les poids par défaut restent normalisés (somme = 1.0)
- [ ] La règle C < 2.5 / C ≥ 2.5 est inchangée dans les deux fichiers
```

---

#### 2F — Drift du MANIFEST (vérifier si ADD/DELETE/RENAME effectué)

Si la cristallisation a modifié la structure des fichiers :

```
- [ ] Chaque fichier créé/renommé est listé dans `docs/EXPANSE-MANIFEST.md`
- [ ] Chaque fichier supprimé a été retiré de `docs/EXPANSE-MANIFEST.md`
- [ ] La section §Ontologie du MANIFEST est cohérente avec les changements récents
```

> **Note :** Si drift détecté → la tâche `[MANIFEST]` du plan a probablement été mal exécutée ou oubliée.

---

### Step 3 : Score & Décision

```markdown
## Anti-Regression Report — [Date]
### Cristallisation vérifiée : [nom]
### Fichiers touchés : [N] ([types])

| Check | Résultat |
|-------|---------|
| Chaîne de boot | 🟢 OK / 🔴 [problème] |
| Orchestrateur meta_prompt | 🟢 OK / 🔴 [référence cassée] |
| Nouveaux prompts | 🟢 OK / 🟡 [orphelin détecté] |
| Ontologie | 🟢 OK / 🔴 [collision] |
| ECS / feedback_loop | 🟢 OK / 🟡 [incohérence] |
| Drift MANIFEST | 🟢 OK / 🔴 [obsolescence] |

### Score : 🟢 PASS / 🟡 PASS WITH WARNINGS / 🔴 FAIL
```

**Seuils :**
- 🟢 PASS → commit possible
- 🟡 PASS WITH WARNINGS → commit possible + dette notée
- 🔴 FAIL → STOP — ne pas committer — fix immédiat

---

### Step 4 : Fix ou Go

**PASS 🟢 :**
```
✅ Anti-regression passed. Chaîne Flux Vital intacte.
→ Commit : git commit -m "crystallize: [composant]"
```

**WARNINGS 🟡 :**
```
⚠️ Warnings. Corrections mineures recommandées :
1. [Prompt orphelin] `prompts/phi/new_check.md` non référencé dans meta_prompt.md
   Fix : ajouter référence dans meta_prompt.md Step 4

Corriger maintenant ou noter en dette ?
```

**FAIL 🔴 :**
```
🚨 FAIL — Ne pas committer.

Problème : [description précise]
Fichier : [chemin]
Fix requis : [action concrète]

→ Fix + relancer anti-regression sur [check] uniquement.
```

---

## Anti-Patterns

| ❌ | ✅ |
|---|---|
| Sauter si "c'est un petit changement" | Vérifier — meta_prompt.md est le point central |
| Faire un audit complet | Anti-regression = scan ciblé sur ce qui a bougé |
| Committer si FAIL 🔴 | STOP — fix d'abord |
| Vérifier seulement les fichiers créés | Vérifier aussi les fichiers **modifiés** et leurs dépendants |

---

## Intégration Workflow

```
executing-plans → anti-regression → [commit | retrospective]
                       ↓ si FAIL
                  fix rapide → re-check du point cassé
```
