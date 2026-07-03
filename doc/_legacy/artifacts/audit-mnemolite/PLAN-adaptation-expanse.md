# Plan d'Intégration Mnemolite → Expanse — Utilisation des Nouveaux Outils

> **Date :** 2026-03-28 06:39  
> **Contexte :** 5 outils Mnemolite créés, l'Apex doit les utiliser  
> **Référence :** `expanse-v15-apex.md`, `expanse-dream.md`

---

## État Actuel vs Disponible

| Section | Aujourd'hui | Nouvel Outil | Gain |
|---------|-------------|-------------|------|
| §IV Boot | 1 search_memory regroupée | `get_system_snapshot()` | +health metrics |
| §I Rappel | `search_memory(tags=["sys:pattern"])` | +`lifecycle_state="sealed"` | Précision |
| Dream Passe 0 | `search_memory(tags=["trace:fresh"])` | +`consumed=False` | Fresh only |
| Dream Passe 1 | `search_memory(tags=["trace:fresh"])` | +`consumed=False` + `mark_consumed()` | **Pas de re-traitement** |
| Dream Passe 1 | `search_memory(tags=["sys:drift"])` | +`consumed=False` + `mark_consumed()` | **Pas de re-traitement** |
| Indexation | Manuelle | `index_markdown_workspace()` | 10x plus rapide |
| Decay | Hardcodé | `configure_decay()` | Runtime configurable |

---

## Modifications Prioritaires (par impact)

### 1. Dream : Consumption Tracking (IMPACT CRITIQUE)

**Problème actuel :** Le Dream relit TOUT (traces + drifts) à chaque passe. Après 5 sessions, il re-traite les mêmes traces. Inefficace, gaspille de tokens.

**Solution :** Ajouter `consumed=False` aux queries Dream + `mark_consumed()` après traitement.

#### Dream Passe 0 (L'Inertie)

```
AVANT :
  search_memory(tags=["trace:fresh"], limit=20)

APRÈS :
  search_memory(tags=["trace:fresh"], consumed=False, limit=20)
  → Seulement les traces NON consommées par un Dream précédent
```

#### Dream Passe 1 (La Plaie)

```
AVANT :
  1. search_memory(query="TRACE:FRESH", tags=["trace:fresh"], limit=20)
  2. search_memory(query="sys:drift", tags=["sys:drift"], limit=20)
  3. ... analyse et génération de proposals ...

APRÈS :
  1. traces = search_memory(tags=["trace:fresh"], consumed=False, limit=20)
  2. drifts = search_memory(tags=["sys:drift"], consumed=False, limit=20)
  3. ... analyse et génération de proposals ...
  4. mark_consumed(memory_ids=[t.id for t in traces], consumed_by="dream_passe1")
  5. mark_consumed(memory_ids=[d.id for d in drifts], consumed_by="dream_passe1")
  → Les traces/drifts traités ne seront plus vus par les Dream suivants
```

**Impact :**
- Session 1 : Dream traite 10 traces → mark_consumed → 0 fresh
- Session 2 : Dream traite 3 nouvelles traces seulement
- Sans consumption : Dream re-traite les 13 traces à chaque fois

---

### 2. Boot : System Snapshot (IMPACT MOYEN)

**Problème actuel :** Le boot fait 1 search_memory mais ne sait pas combien de drifts/traces sont en attente.

**Solution :** Utiliser `get_system_snapshot()` au lieu de `search_memory`.

```
AVANT :
  search_memory(query="sys:core sys:anchor sys:extension sys:user:profile",
    tags=["sys:core","sys:anchor","sys:extension","sys:user:profile"], limit=36)

APRÈS :
  snapshot = get_system_snapshot(repository="expanse")
  → snapshot.core, snapshot.patterns, snapshot.extensions, snapshot.profile
  → snapshot.health = {fresh_drifts: 3, fresh_traces: 5, needs_consolidation: true}
```

**Briefing enrichi :**
```
Ψ [V15 ACTIVE]
   PROJECT: Expanse — personal agent
   USER: analytique
   AUTONOMY: A1
   HEALTH: 3 drifts, 5 traces en attente | consolidation: oui
```

---

### 3. Rappel Associatif : Lifecycle Filter (IMPACT MOYEN)

**Problème actuel :** `search_memory(tags=["sys:pattern"])` retourne les candidats ET les scellés.

**Solution :** Ajouter `lifecycle_state="sealed"`.

```
AVANT :
  search_memory(query=Σ_input, tags=["sys:pattern","sys:anchor"], limit=3)

APRÈS :
  search_memory(query=Σ_input, tags=["sys:pattern","sys:anchor"],
    lifecycle_state="sealed", limit=3)
  → Seulement les patterns validés (pas :candidate, pas :doubt)
```

---

### 4. Indexation : Markdown Workspace (IMPACT MOYEN)

**Problème actuel :** L'indexation utilise `index_project` (21 langages, tree-sitter, LSP).

**Solution :** Utiliser `index_markdown_workspace()` pour re-indexer.

```
AVANT :
  index_project(project_path="/home/giak/projects/expanse", repository="expanse")
  → ~35 minutes pour 419 fichiers

APRÈS :
  index_markdown_workspace(root_path="/home/giak/projects/expanse", repository="expanse")
  → ~3.5 minutes pour 419 fichiers
```

---

### 5. Decay Configuration (IMPACT FAIBLE)

**Problème actuel :** Decay hardcodé dans `MemoryDecayService`.

**Solution :** La table `memory_decay_config` est déjà peuplée avec 7 presets Expanse. Pas de changement nécessaire dans l'Apex. Le decay service lit maintenant la config de la DB.

**Optionnel :** L'Apex peut ajuster les presets via `configure_decay()` si nécessaire.

---

## Matrice de Décision

| Modification | Effort | Impact | Priorité | Statut |
|-------------|--------|--------|----------|--------|
| Dream: consumed=False + mark_consumed | 30min | **Critique** | #1 | ⬜ |
| Boot: get_system_snapshot | 15min | Moyen | #2 | ⬜ |
| Rappel: lifecycle_state=sealed | 5min | Moyen | #3 | ⬜ |
| Indexation: index_markdown_workspace | 5min | Moyen | #4 | ⬜ |
| Decay: configure_decay | 0min | Faible | #5 | ✅ Déjà configuré |

---

## Risques et Limites

### Dream : mark_consumed est permanent
- Une fois mark_consumed, la trace n'est plus visible par Dream
- Si Dream échoue après mark_consumed mais avant la proposal → la trace est perdue
- **Mitigation :** mark_consumed après la proposal (pas avant)

### Boot : get_system_snapshot retourne plus de données
- Le snapshot retourne core + patterns + extensions + profile + health
- Budget context de 500 tokens peut être dépassé
- **Mitigation :** Tronquer les contenus, ne retourner que les titles + tags

### Lifecycle filter : sémantique implicite
- `lifecycle_state="sealed"` mappe vers des conditions SQL sur les tags
- Si un tag contient `:candidate` mais n'est pas un pattern → faux positif
- **Mitigation :** Convention de tags stricte dans Expanse (déjà en place)

---

*Document généré le 2026-03-28 06:39*
