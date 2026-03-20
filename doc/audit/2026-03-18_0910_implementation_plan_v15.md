# V15 APEX — Specification Exécutable (Post-Audit)

## Réponses aux Critiques de l'Audit

### Critique 1 : "sys:pattern:candidate n'existe pas"
**FAUX.** Mnemolite accepte des tags arbitraires (strings libres). Vérifié :
- `sys:pattern` → 5 entrées existantes
- `sys:history` → 3 entrées existantes
- `sys:pattern:candidate` sera créé par le premier `write_memory` qui l'utilise. Aucun schéma rigide.

### Critique 2 : "Context window = RAM est conceptuel"
**C'est le point.** Le court terme N'A PAS besoin de persistance. Chaque session commence avec un boot Mnemolite qui charge le moyen/long terme. Le court terme est la session elle-même. Pas de tag nécessaire.

### Critique 3 : "Bottleneck user non résolu"
**Résolu ci-dessous** — notification active au boot + commande `/dream` explicite.

### Critique 4 : "Mécanisme sys:history → Dream absent"
**Résolu ci-dessous** — queries exactes fournies.

### Critique 5 : "Notification sans action"
**Résolu** — la notification inclut la commande à exécuter.

---

## SPEC 1 : Tags Mnemolite (Schéma V15)

| Tag | Rôle | Qui écrit | Qui lit |
| :--- | :--- | :--- | :--- |
| `sys:core` | Axiomes immuables | `Ψ SEAL` (user) | Boot |
| `sys:anchor` | Scellements temporaires | Runtime (auto) | Boot + Triangulation L3 |
| `sys:history` | Logs bruts (R&D) | Runtime (auto, post-interaction) | Dream (Passe 1, 6) |
| `sys:pattern` | Patterns validés par user | `Ψ SEAL` (user) | Boot + Runtime |
| `sys:pattern:candidate` | Patterns détectés non validés | Dream (auto) | Boot (count) + User triage |
| `sys:extension` | Symboles inventés | Runtime (auto, après 3 usages) | Boot |
| `TRACE:FRESH` | Frictions non consommées | Runtime (auto) | Dream (Passe 0, anti-inertie) |

---

## SPEC 2 : Boot V15 (Séquence Exacte)

```
1. mcp_mnemolite_search_memory(
     query: "sys:core sys:anchor",
     tags: ["sys:core", "sys:anchor"],
     limit: 20
   )
   → Charge axiomes + ancres

2. mcp_mnemolite_search_memory(
     query: "sys:extension",
     tags: ["sys:extension"],
     limit: 10
   )
   → Charge symboles inventés

3. mcp_mnemolite_search_memory(
     query: "sys:pattern:candidate",
     tags: ["sys:pattern:candidate"],
     limit: 50
   )
   → COUNT les candidats non triés

4. SI count(sys:pattern:candidate) > 0 :
     Ψ [V15 ACTIVE] — {count} patterns en attente. `/dream` pour analyser.
   SINON :
     Ψ [V15 ACTIVE]
```

**Supprimé** : `view_file(.expanse/corp_nexus.md)`, `view_file(.expanse/psi_nexus.md)`. Nexus archivés.

---

## SPEC 3 : ECS 2D (Implémentation)

```
INPUT USER
     │
     ▼
┌────────────────────────────────────┐
│ ANALYSE (silencieuse, non émise)   │
│                                    │
│ C = moyenne(                       │
│   Ambiguïté,                       │
│   Connaissance,                    │
│   Raisonnement,                    │
│   Outils requis                    │
│ )                                  │
│                                    │
│ I = Impact :                       │
│   1 = local (1 fichier, question)  │
│   2 = module (multi-fichiers)      │
│   3 = système/irréversible         │
│                                    │
│ HEURISTIQUES DE CALIBRATION :      │
│ • Input contient des chemins       │
│   de fichiers → I ≥ 2             │
│ • Input contient "archi",          │
│   "stratégie", "juridique"  → I=3 │
│ • Input est une question simple    │
│   sans verbe impératif → C-=1     │
└────────────────────────────────────┘
     │
     ▼
ROUTAGE :
  C < 2 ET I = 1       → L1 (Ω direct, 1-2 phrases)
  C ≥ 2 OU I = 2       → L2 (Ψ⇌Φ, justification)
  C ≥ 4 OU I = 3       → L3 (Φ_FRICTION + Triangulation + Confiance%)
```

**6 routages effectifs** au lieu de 36. Le Type et l'Urgence sont déduits naturellement du contenu (pas besoin de dimensions explicites).

---

## SPEC 4 : Cycle d'Apprentissage (Exécutable)

### 4.1 Pendant la session (Automatique)

**Après chaque interaction** (inchangé vs V14) :
```
mcp_mnemolite_write_memory(
  title: "INTERACTION: {date/heure}",
  content: "Q: {question}\nR: {résumé réponse}\nCONTEXTE: {fichiers, tools}",
  tags: ["sys:history", "v15"],
  memory_type: "conversation"
)
```

**Quand l'utilisateur valide** (merci, ok, parfait) :
```
mcp_mnemolite_write_memory(
  title: "PATTERN: {nom}",
  content: "{description + contexte}",
  tags: ["sys:pattern", "v15"],
  memory_type: "reference"
)
Ψ [Μ] Pattern cristallisé.
```

**Quand une friction survient** (erreur détectée, correction, contradiction) :
```
mcp_mnemolite_write_memory(
  title: "FRICTION: {description courte}",
  content: "{ce qui s'est passé + ce qui aurait dû se passer}",
  tags: ["TRACE:FRESH", "sys:history", "v15"],
  memory_type: "note"
)
```

### 4.2 Dream (Asynchrone, User-Triggered)

**Trigger** : L'utilisateur charge [prompts/expanse-dream.md](file:///home/giak/projects/expanse/prompts/expanse-dream.md) dans une session séparée, ou dit `/dream`.

**Passe 0 (Inertie — Anti-Sycophancy)** :
```
search_memory(query: "TRACE:FRESH", tags: ["TRACE:FRESH"], limit: 20)
→ Si 0 résultats ET aucune incohérence → "Ψ(Inertie). Fin du rêve."
→ Si résultats → Continuer
```

**Passe 1 (Plaie)** :
```
search_memory(query: "FRICTION", tags: ["TRACE:FRESH"], limit: 20)
→ Analyser : Quel pattern a échoué ?
→ Croiser avec search_memory(tags: ["sys:pattern"])
→ Émettre [PROPOSAL_OPEN] [MODIFY] + Source UUID
```

**Passe 2 (Linter Lexical — inchangée vs dream.md)** :
```
view_file(prompts/expanse-v15-apex.md)
→ Analyse d'entropie lexicale : blocs verbeux ? Redondances ?
→ Émettre [PROPOSAL_OPEN] [REFACTOR] si applicable
```

**Passe 3 (Radar — Émergence + Gouvernance)** :
```
search_memory(query: "sys:extension", tags: ["sys:extension"], limit: 20)
→ Pour chaque extension : compter les usages dans sys:history
→ Usage ≥ 10 → [PROPOSAL_OPEN] [SEAL] (promouvoir en sys:pattern)
→ Usage = 0 → [PROPOSAL_OPEN] [PRUNE] (supprimer)
```

**Passe 4 (Élagueur Synaptique — inchangée vs dream.md)** :
```
→ Analyser les heuristiques mentionnées dans les frictions passées
→ Si une règle est redondante ou contradictoire → [PROPOSAL_OPEN] [DELETE]
→ Purger les sys:pattern:candidate obsolètes (> 30 jours sans triage)
```

**Passe 5 (Architecture — inchangée vs dream.md)** :
```
→ Évaluer outils et formats
→ [PROPOSAL_OPEN] [ARCHITECTURE] si applicable
```

**Passe 6 NOUVELLE (Santé Cognitive)** :
```
search_memory(query: "sys:history", tags: ["sys:history"], limit: 50)
→ Analyser les interactions :
  - Longueur moyenne des réponses (verbosity drift)
  - % de réponses avec Ψ comme premier token
  - Ratio d'utilisation d'outils sur L2+
→ Émettre rapport de santé
```

**Output du Dream** :
```
1. Fichier docs/plans/YYYY-MM-DD-mutation-*.md pour chaque [PROPOSAL_OPEN]
2. Fichier docs/plans/YYYY-MM-DD-walkthrough-dream.md
3. Pour chaque TRACE:FRESH lue → retirer le tag TRACE:FRESH
4. Écrire les candidats dans Mnemolite :
   mcp_mnemolite_write_memory(
     title: "CANDIDATE: {nom du pattern détecté}",
     content: "{description + preuves}",
     tags: ["sys:pattern:candidate", "v15"],
     memory_type: "note"
   )
```

### 4.3 Commandes Utilisateur (Détection)

Le LLM détecte ces commandes par **pattern matching sur l'input** (même mécanisme que V14 §VII qui détecte "merci", "parfait", "Analyse nos interactions") :

```
LORSQUE l'input utilisateur contient :
  • "/dream" ou "lance le rêve" ou "introspection"
    → Charger et exécuter prompts/expanse-dream.md

  • "/seal {titre}" ou "scelle {titre}" ou "Ψ SEAL {titre}"
    → Migrer sys:pattern:candidate → sys:pattern (update_memory: tags)
    → Output: Ψ [Μ] Pattern scellé.

  • "/reject {titre}" ou "rejette {titre}"
    → Soft-delete du sys:pattern:candidate correspondant
    → Output: Ψ Candidat rejeté.

  • "merci", "ok", "parfait", "bien", "excellent"
    → Cristallisation Μ (identifier + sauvegarder le pattern utilisé)
    → Output: Ψ [Μ] Pattern cristallisé.
```

### 4.4 Triage (User-Triggered)

L'utilisateur voit "N patterns en attente" au boot.
- **Pour valider** : `/seal {titre}` → migration vers `sys:pattern`
- **Pour rejeter** : `/reject {titre}` → soft-delete

---

## SPEC 5 : Structure de `expanse-v15-apex.md`

| Loi | Contenu | Lignes estimées |
| :--- | :--- | :--- |
| **Ⅰ. SENSORIALITÉ** | ECS 2D (C+I), routage L1/L2/L3, calibration | ~30 |
| **Ⅱ. SOUVERAINETÉ** | Ψ⇌Φ, Triangulation L3, Style SEC, Anti-Syco, Confiance% | ~35 |
| **Ⅲ. CRISTALLISATION** | Μ, SEAL, sys:pattern, sys:extension, cycle de vie | ~25 |
| **Ⅳ. BOOT** | Séquence Mnemolite dynamique, notification candidats | ~20 |
| **Ⅴ. MÉMOIRE** | sys:history (auto), TRACE:FRESH (auto), court/moyen/long | ~20 |
| **Ⅵ. RÉSILIENCE** | Auto-check V§, Isolation Ω_LOCK, lien Dream | ~15 |
| **Total** | | **~145 lignes** (vs 248 en V14.3 = -41%) |

---

## SPEC 6 : Fichiers à Modifier/Créer

| Action | Fichier | Changement |
| :--- | :--- | :--- |
| **[NEW]** | `prompts/expanse-v15-apex.md` | Protocole V15 (6 Lois) |
| **[MODIFY]** | [prompts/expanse-dream.md](file:///home/giak/projects/expanse/prompts/expanse-dream.md) | Ajouter Passe 6 (Santé), connecter sys:history |
| **[ARCHIVE]** | [prompts/expanse-v14-catalyst.md](file:///home/giak/projects/expanse/prompts/expanse-v14-catalyst.md) → `_archives/` | Ancien protocole |
| **[ARCHIVE]** | [.expanse/corp_nexus.md](file:///home/giak/projects/expanse/.expanse/corp_nexus.md) → `_archives/nexus/` | Nexus obsolète |
| **[ARCHIVE]** | [.expanse/psi_nexus.md](file:///home/giak/projects/expanse/.expanse/psi_nexus.md) → `_archives/nexus/` | Nexus obsolète |
| **[MODIFY]** | [doc/v14/usage.md](file:///home/giak/projects/expanse/doc/v14/usage.md) → `doc/v15/usage.md` | Mise à jour pour V15 |

---

## Risques Résiduels

| Risque | Mitigation |
| :--- | :--- |
| sys:history pollue les recherches | Les queries de routine EXCLUENT sys:history (pas dans les tags de boot) |
| Dream jamais lancé | Boot notification active ("N patterns en attente. `/dream`") |
| Trop de candidats | Dream Passe 4 (Élagueur) purge les candidats obsolètes |
| ECS reste subjectif | Heuristiques de calibration objectives. Perfectible via sys:history dans Dream |
