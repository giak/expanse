# PLAN: Modularisation Mémoire V15 — Apex Section Ⅴ → Mnemolite

**Date:** 2026-04-01  
**Statut:** Planifié  
**Effort estimé:** ~25 min  

**Principe :** KISS. DRY. YAGNI. Les protocoles vivent **uniquement** dans Mnemolite.

---

## I. CONTEXTE & PROBLÈME

### Situation initiale

L'Apex (`runtime/expanse-v15-apex.md`, 320 lignes) contient une Section Ⅴ (Mémoire — Triptyque Temporel) de ~96 lignes (lignes 150-246) qui détaille :
- Le tableau des tags Mnemolite (8 tags) — lignes 158-167
- La sauvegarde automatique post-interaction — lignes 169-170
- La rétention sys:history / Consolidation — lignes 172-200
- Le format trace:fresh (détection, format, types, exemple) — lignes 202-241
- Le Long Terme — lignes 243-246

**Problème :** Cette section représente ~30% de l'Apex. Elle dépasse le seuil de densité de 50 tokens/bloc que Dream Passe 2 est censé auditer. Le système viole ses propres règles.

### Pourquoi modulariser ?

1. **Réduction de densité** — L'Apex passe de 320 à ~235 lignes
2. **Mutations ciblées** — Modifier un protocole dans Mnemolite sans toucher à l'Apex
3. **Cohérence** — Le système respecte son propre seuil de densité

### Ce qu'on ne fait PAS (YAGNI)

- ❌ Pas de dossier `runtime/protocols/`
- ❌ Pas de fichiers de protocoles
- ❌ Pas de fallback fichiers
- ❌ Pas de synchronisation fichiers ↔ Mnemolite
- ❌ Pas de versionning git des protocoles
- ❌ Pas de cristallisation dans les protocoles (reste Section Ⅲ)

**Raison :** Sans Mnemolite, Expanse est amnésique donc inutile. Créer des fichiers "au cas où" c'est YAGNI violation. La cristallisation est un pilier du runtime (Section Ⅲ), pas un protocole annexe.

---

## II. RÉFLEXIONS & DÉBATS

### Question 1 : Combien de protocoles ?

**Analyse :**
- 4 protocoles initiaux : memory-triage, friction-trace, crystallization, consolidation
- Problème : crystallization est dans la Section Ⅲ (lignes 75-97), pas la Section Ⅴ
- Extraire crystallization de la Section Ⅲ affaiblit un pilier du runtime

**Verdict :** 3 protocoles uniquement, tous extraits de la Section Ⅴ. La cristallisation reste dans la Section Ⅲ.

### Question 2 : Fichiers ou Mnemolite ?

**Verdict :** Mnemolite-only. Sans Mnemolite, Expanse est mort. Pas de fallback. Dépendance critique assumée.

---

## III. ERREURS & APPRENTISSAGES

### Erreur 1 : Backup .bak dans runtime/

**Problème :** `expanse-v15-apex.md.20260326_081623.bak` traînait dans `runtime/`.

**Correction :** Copié vers `archive/backups/`. Original toujours présent (permissions user `expanse`).

**Leçon :** Le script apply.sh devrait déplacer les backups vers `archive/backups/`.

### Erreur 2 : Duplication S10-S13 dans test-runner

**Correction :** Supprimé via `expanse-apply.sh`. Test-runner : 413 → 378 lignes.

### Erreur 3 : `view_file` au lieu de `read_file` dans Dream

**Correction :** Remplacé via apply.sh.

### Erreur de conception : `runtime/protocols/`

**Problème :** L'idée initiale de créer un dossier `runtime/protocols/` avec 4 fichiers + Mnemolite = duplication, confusion, YAGNI.

**Correction :** Supprimé. Mnemolite-only. 3 protocoles au lieu de 4.

---

## IV. SOLUTION RETENUE

### Architecture Mnemolite-only

```
Mnemolite (SEULE source de vérité)
  ├── PROTOCOL: memory-triage      (sys:protocol, protocol:memory-triage)
  ├── PROTOCOL: friction-trace     (sys:protocol, protocol:friction-trace)
  └── PROTOCOL: consolidation      (sys:protocol, protocol:consolidation)

runtime/expanse-v15-apex.md (coordinateur)
  ├── Section Ⅲ : Cristallisation (inchangée — pilier du runtime)
  └── Section Ⅴ : réduite à ~15 lignes de références
```

### Flux boot

```
1. search_memory(tags: ["sys:protocol"], limit: 10)
   → Si count ≥ 3 → protocoles chargés ✅
   → Si count < 3 → Ψ [STALL] Protocoles manquants.
```

### Flux mutation (Dream)

```
Dream modifie un protocole :
1. update_memory(id: {uuid}, content: "{nouveau contenu}") → Mnemolite
2. C'est tout.
```

---

## V. PLAN D'IMPLÉMENTATION

### Phase 1 — Écriture des 3 protocoles dans Mnemolite (10 min)

Chaque protocole est écrit avec :

```
write_memory(
  title: "PROTOCOL: {nom}",
  content: "{contenu complet}",
  tags: ["sys:protocol", "v15", "protocol:{nom}"],
  memory_type: "reference"
)
```

#### PROTOCOL: memory-triage

**Source :** Apex Section Ⅴ, lignes 157-170

**Contenu exact :**

```
Tags Mnemolite — Tableau de référence :
| Tag | Rôle | Quand |
| sys:history | Logs interactions L2+ | Après interaction L2+ |
| sys:pattern | Patterns validés | Sur validation user (Μ) |
| sys:pattern:candidate | Patterns détectés | Par Dream (auto) |
| sys:anchor | Scellements | Sur Ψ SEAL |
| sys:extension | Symboles inventés | Après 3+ usages |
| trace:fresh | Frictions | Sur signal NEGATIF utilisateur |
| sys:drift | Dérives auto-détectées | Après Ω (détection binaire) |
| sys:user:profile | Profil utilisateur | Au boot, enrichi par Dream |

Sauvegarde Automatique (post-interaction) :
Route ≥ L2 → write_memory(title: "INTERACTION: {date}", content: "Q: {q}\nR: {r}\nSUBSTRAT: {LLM} | IDE: {IDE}", tags: ["sys:history", "v15", "substrat:{LLM}", "ide:{IDE}"], memory_type: "conversation").

Rétention sys:history :
Si count(sys:history) > 20 → exécuter protocole de consolidation (voir PROTOCOL: consolidation).
```

#### PROTOCOL: friction-trace

**Source :** Apex Section Ⅴ, lignes 202-241

**Contenu exact :**

```
Trace de Friction Structurée — Détection et Format

SIGNAUX NÉGATIFS (détection) :
- Mots-clés : "non", "faux", "pas ça", "recommence", "incorrect", "pas bon"
- Pattern mixte : mot positif + correction ("super, mais refait tout")
- Changement de sujet brutal après réponse
- Demande explicite de modification

FORMAT :
trace:fresh:
  ΣΨΦΩ: Σ→[input] Ψ→[output] Φ→[status] Ω→[result] [signal]
  type: {ECS|SEC|STYLE|MEMORY|BOOT}
  symptom: "{1 phrase}"
  timestamp: {ISO}

TYPES :
| Type | Description |
| ECS | Miscalibration de Complexité ou Impact |
| SEC | Style ou réponse insuffisante |
| MEMORY | Pattern non reconnu |
| BOOT | Dysfonctionnement au démarrage |

EXEMPLE :
trace:fresh:
  ΣΨΦΩ: Σ→[archi config] Ψ→[L1] Φ→[BYPASSED] Ω→[insufficient] [NEGATIF]
  type: ECS
  symptom: Complex task delivered as simple
  timestamp: 2026-03-18T14:32:00

PROCÉDURE :
1. Tracer ΣΨΦΩ en symboles
2. Identifier le TYPE de friction
3. Résumer le SYMPTOM en 1 phrase
4. Écrire dans Mnemolite avec tags ["trace:fresh", "type:{TYPE}", "substrat:{LLM}"]
```

#### PROTOCOL: consolidation

**Source :** Apex Section Ⅴ, lignes 172-200

**Contenu exact :**

```
Protocole de Consolidation sys:history

DÉCLENCHEUR :
Au boot : search_memory(query="sys:history", tags=["sys:history"], limit=100).
SI count > 20 → exécuter le protocole.

ÉTAPE 1 — Récupérer les 10 plus anciennes :
  old_memories = search_memory(query="sys:history", tags=["sys:history"],
    limit=10, sort="created_at ASC")

ÉTAPE 2 — LLM génère un résumé structuré :
  summary = Résumer old_memories en:
    - Période couverte (date début → date fin)
    - Thèmes principaux (3-5 mots-clés)
    - Patterns détectés ou validés
    - Frictions ou drifts observés

ÉTAPE 3 — Consolider :
  consolidate_memory(
    title="History: {date_début} → {date_fin}",
    summary=summary,
    source_ids=[m.id for m in old_memories],
    tags=["sys:history", "v15"]
  )
  → Crée mémoire agrégée (tags: ["sys:history:summary", "sys:consolidated"])
  → Soft-delete les 10 originales

ÉTAPE 4 — Log :
  Ψ [Μ] Consolidation sys:history : 10 → 1 agrégée.
```

**Vérification :** `search_memory(tags: ["sys:protocol"], limit: 10)` → 3 résultats.

### Phase 2 — Modification de l'Apex Section Ⅴ (10 min)

**Ancien :** ~96 lignes (lignes 150-246)

**Nouveau :** ~15 lignes de références

```markdown
## Ⅴ. MÉMOIRE (Triptyque Temporel)

### Court Terme = Context Window
La session elle-même. Pas de tag, pas de persistance.

### Moyen Terme = Mnemolite
Protocoles chargés via `search_memory(tags: ["sys:protocol"], limit: 10)` au boot.

| Protocole | Tag Mnemolite |
|-----------|--------------|
| Memory Triage | `protocol:memory-triage` |
| Friction Trace | `protocol:friction-trace` |
| Consolidation | `protocol:consolidation` |

### Long Terme = Fichiers + sys:core
- `KERNEL.md` : Philosophie ontologique (ADN)
- `expanse-v15-apex.md` : Runtime opérationnel (ce fichier)
- `sys:core` : Axiomes scellés dans Mnemolite (invariants)
```

Appliquer via `expanse-apply.sh`.

### Phase 3 — Mise à jour du BOOT_CONFIG (5 min)

Ajouter le chargement des protocoles dans la Section Ⅳ :

```yaml
BOOT_CONFIG:
  memories:
    - query="sys:core sys:anchor"    tags=["sys:core","sys:anchor"]    limit=20
    - query="sys:extension"          tags=["sys:extension"]            limit=10
    - query="sys:user:profile"       tags=["sys:user:profile"]         limit=5
    - query="sys:project:{CWD}"      tags=["sys:project:{CWD}"]        limit=1
    - query="sys:protocol"           tags=["sys:protocol"]             limit=10  # ← NOUVEAU
  apex: /home/giak/projects/expanse/runtime/expanse-v15-apex.md
  healthcheck: "core ✓? profile ✓? project ✓? protocols ✓? frictions ✓? budget X/500t"
```

### Phase 4 — Mise à jour du Dream (5 min)

#### Passe 2 (Linter Lexical) — étendu

```markdown
- **Action :** `search_memory(tags: ["sys:protocol"], limit: 10)`
- **Vérification :** Les 3 protocoles existent dans Mnemolite ?
- **Output :** `[PROPOSAL_OPEN] [SYNC]` si protocole manquant
```

#### Passe 4 (Élagueur) — étendu

```markdown
- **Action :** `bash(command: "find /home/giak/projects/expanse/runtime/ -maxdepth 1 -name '*.bak' -type f")`
- **Analyse :** Pour chaque .bak, vérifier si backup équivalent dans archive/backups/
- **Output :** `[PROPOSAL_OPEN] [CLEANUP]` si fichiers orphelins
```

### Phase 5 — Ajout commande /cleanup (5 min)

Ajouter dans la Section Ⅵ (Commandes Utilisateur) de l'Apex :

```markdown
  • "/cleanup"
    → bash(command: "find /home/giak/projects/expanse/runtime/ -maxdepth 1 -name '*.bak' -type f -delete")
    → Ψ [CLEANUP] Fichiers orphelins supprimés.
```

---

## VI. VÉRIFICATION FINALE

### Checklist

- [ ] 3 mémoires `sys:protocol` écrites dans Mnemolite
- [ ] Apex Section Ⅴ réduite à ~15 lignes
- [ ] BOOT_CONFIG inclut `sys:protocol`
- [ ] Healthcheck inclut `protocols ✓?`
- [ ] Dream Passe 2 vérifie les protocoles
- [ ] Dream Passe 4 nettoie les .bak
- [ ] Commande /cleanup ajoutée dans l'Apex
- [ ] Backup Apex créé avant modification
- [ ] Aucun .bak orphelin dans runtime/

### Test de boot

```
1. read_file(runtime/expanse-v15-boot-seed.md)
2. read_file(runtime/expanse-v15-apex.md)
3. search_memory(tags: ["sys:protocol"], limit: 10)
4. Vérifier : 3 protocoles chargés
5. OUTPUT: Ψ [V15 ACTIVE] — BOOT OK
```

---

## VII. RISQUES & MITIGATIONS

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Mnemolite write échoue | Faible | Élevé | Réessayer. Si échec → système inutilisable (dépendance critique) |
| Apex corrompu pendant write | Faible | Élevé | Backup automatique via apply.sh |
| Mnemolite down | Faible | Critique | Système inutilisable. Pas de fallback — dépendance assumée. |

---

## VIII. ORDRE D'EXÉCUTION

| Étape | Action | Dépendance | Effort |
|-------|--------|------------|--------|
| 1 | Écrire 3 protocoles dans Mnemolite | Aucune | 10 min |
| 2 | Modifier Apex Section Ⅴ | Étape 1 | 10 min |
| 3 | Mettre à jour BOOT_CONFIG + healthcheck | Étape 2 | 5 min |
| 4 | Mettre à jour Dream (Passe 2 + 4) | Étape 3 | 5 min |
| 5 | Ajouter commande /cleanup | Étape 2 | 5 min |
| 6 | Vérification finale + test boot | Étape 5 | 5 min |

**Total estimé : ~40 min**

---

## IX. AMÉLIORATIONS FUTURES IDENTIFIÉES

1. **expanse-apply.sh** — Déplacer les backups vers `archive/backups/` automatiquement
2. **Test Runner** — Auto-check de duplication (se tester lui-même)
3. **Dream Passe 2** — Auditer ses propres appels d'outils
4. **Arbitre LLM local** — Dream Passe 1 audité par un LLM local (qwen2.5:7b)

---

*Plan créé le 2026-04-01 — En attente d'exécution*

## X. HISTORIQUE DES RÉVISIONS

| Date | Changement | Raison |
|------|-----------|--------|
| 2026-04-01 05:45 | Plan initial | Première version avec `runtime/protocols/` + fallback fichiers + 4 protocoles |
| 2026-04-01 05:55 | Correction : Mnemolite-only, fichiers = trace git | Feedback : sans Mnemolite, Expanse est amnésique |
| 2026-04-01 06:02 | Suppression totale de `runtime/protocols/` | Feedback : KISS, DRY, YAGNI — pas de duplication |
| 2026-04-01 06:08 | Réduction à 3 protocoles, contenu exact défini | Double-check : crystallization est dans Section Ⅲ, pas Ⅴ |
