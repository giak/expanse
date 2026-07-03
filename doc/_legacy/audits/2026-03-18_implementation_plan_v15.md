# Expanse V15 APEX — Plan de Consolidation (Révision Définitive)

## Contexte Post-Audit & Corrections

L'Audit V5 (IRO Global: 0.6617) a validé la réalité ontologique d'Expanse. Le feedback utilisateur a corrigé 3 erreurs de mon analyse initiale :

| Correction | Mon erreur | Réalité |
| :--- | :--- | :--- |
| **Portabilité** | Déléguer Style/Éthique à [GEMINI.md](file:///home/giak/.gemini/GEMINI.md) | Expanse doit être autonome (terminal, autre IDE). Les règles restent DANS le protocole. |
| **sys:history** | Le supprimer (pollution) | Phase R&D : les logs sont essentiels pour debug, auto-analyse, et amélioration. |
| **ECS** | Simple métrique de complexité | Doit devenir un **orchestrateur** multi-dimensionnel (C, Type, Domaine, Urgence). |

---

## Architecture Mémoire V15 : Le Triptyque Temporel

> [!IMPORTANT]
> C'est le changement structurel majeur. Les nexus statiques meurent. Mnemolite devient l'unique source de vérité vivante.

```
┌──────────────────────────────────────────────────────────────┐
│                    MÉMOIRE V15                               │
├──────────────────────────────────────────────────────────────┤
│  COURT TERME (session)                                       │
│  ├─ sys:recent     → Contexte actif (remplace psi_nexus)    │
│  └─ sys:history    → Logs bruts de la session                │
│                                                              │
│  MOYEN TERME (inter-sessions)                                │
│  ├─ sys:pattern    → Patterns cristallisés (Μ)              │
│  ├─ sys:anchor     → Scellements (Ψ SEAL)                  │
│  └─ sys:extension  → Symboles inventés                      │
│                                                              │
│  LONG TERME (perpétuel / ADN)                                │
│  ├─ KERNEL.md      → Philosophie ontologique                 │
│  ├─ expanse-v15.md → Runtime opérationnel                   │
│  └─ sys:core       → Axiomes scellés dans Mnemolite         │
└──────────────────────────────────────────────────────────────┘
```

**Nexus** : Obsolètes. Leur rôle (enrichissement contextuel pré-LLM) est absorbé par la query `sys:recent` au boot. Archivés dans `_archives/`.

---

## ECS V15 : L'Orchestrateur

L'ECS passe d'un score scalaire (`C`) à un vecteur de décision à 4 dimensions :

```
INPUT USER
     │
     ▼
┌─────────────────────────────────────────────┐
│ ECS V15 — Analyse Vectorielle               │
│                                             │
│ C (Complexité)  : 1-5                       │
│ T (Type)        : question│action│création  │
│ D (Domaine)     : tech│philo│ops│autre      │
│ R (Urgence)     : 1-3                       │
└─────────────────────────────────────────────┘
     │
     ▼
ROUTAGE:
• C<2 + T=question     → Ω direct (L1)
• C≥2 + T=action       → Ψ⇌Φ boucle (L2)
• C≥4 OU D=philo       → Φ_FRICTION forcée (L3)
• R=3                  → Priorité bypass (urgence)
```

**Calibration objective** (Fix F4) : Heuristiques de détection automatique :
- `T=action` si l'input contient des verbes impératifs ou des chemins de fichiers
- `D=tech` si l'input contient du code, des noms de fichiers, ou des termes techniques
- `R=3` si l'input contient "urgent", "maintenant", "critique"

---

## Dream V15 : L'Auto-Amélioration Asynchrone

Le mécanisme [expanse-dream.md](file:///home/giak/projects/expanse/prompts/expanse-dream.md) (Algorithme Pentagramme) est déjà solide. V15 le connecte au triptyque mémoriel :

```
WORKFLOW RÊVE V15
━━━━━━━━━━━━━━━━
Phase 0: INERTIE
  └─ Query sys:history (tag: TRACE:FRESH)
  └─ Si rien → Fin du rêve

Phase 1: PLAIE (Réactif)
  └─ Query sys:history → Échecs récents
  └─ Croise avec sys:pattern → Pattern violé ?
  └─ Sortie: [PROPOSAL_OPEN] [MODIFY]

Phase 2: LINTER (Proactif)
  └─ view_file(expanse-v15-apex.md)
  └─ Analyse d'entropie lexicale
  └─ Sortie: [PROPOSAL_OPEN] [REFACTOR]

Phase 3: RADAR (Émergence)
  └─ Query sys:extension → Symboles inventés
  └─ Validation: Usage > 10 ? → SEAL ou PRUNE
  └─ Sortie: [PROPOSAL_OPEN] [PATTERN_EMERGENCE]

Phase 4: ÉLAGUEUR (Ablation)
  └─ Détection de redondances vs KERNEL.md
  └─ Sortie: [PROPOSAL_OPEN] [DELETE]

Phase 5: ARCHITECTURE
  └─ Sortie: [PROPOSAL_OPEN] [ARCHITECTURE]
```

---

## Santé Cognitive V15

Problème F7 : aucun compteur ni feedback de dérive. Solution : utiliser `sys:history` comme source de métriques.

| Métrique | Mesure | Source | Seuil d'Alerte |
| :--- | :--- | :--- | :--- |
| **Verbosity Drift** | Ratio mots/réponse vs baseline | sys:history | > 2x baseline |
| **Ψ Compliance** | % de réponses commençant par Ψ | sys:history | < 90% |
| **Tool Usage** | Fréquence d'utilisation Φ sur L2+ | sys:history | < 50% des L2+ |
| **Seal Rate** | Patterns cristallisés / session | sys:pattern | < 1/10 sessions |

**Trigger** : Le dream.md (Passe 1 : La Plaie) analyse ces métriques automatiquement lors de l'introspection asynchrone. Pas de compteur en session (impossible), mais analyse différée.

---

## Proposed Changes

### Composant 1 : Runtime Protocol

#### [NEW] [expanse-v15-apex.md](file:///home/giak/projects/expanse/prompts/expanse-v15-apex.md)

Structure en **6 Lois** (vs 8 sections en V14.3) :

| Loi | Contenu | Changement vs V14 |
| :--- | :--- | :--- |
| **Ⅰ. SENSORIALITÉ** | ECS Vectoriel (C, T, D, R) + Calibration | ECS scalaire → vectoriel |
| **Ⅱ. SOUVERAINETÉ** | Ψ⇌Φ + Triangulation L3 + Style SEC + Anti-Syco | **Reste intégré** (portabilité) |
| **Ⅲ. CRISTALLISATION** | SEAL + sys:pattern + sys:extension + Cycle de vie | + Pruning gouverné |
| **Ⅳ. BOOT** | Query Mnemolite dynamique (sys:core + sys:recent) | - Nexus files |
| **Ⅴ. MÉMOIRE** | Triptyque Court/Moyen/Long + sys:history | **Nouveau** |
| **Ⅵ. RÉSILIENCE** | Auto-check + Lien vers Dream pour analyse différée | **Nouveau** |

---

### Composant 2 : Dream Mechanism

#### [MODIFY] [expanse-dream.md](file:///home/giak/projects/expanse/prompts/expanse-dream.md)

- Passe 0 : Ajouter query `sys:history` en plus de `TRACE:FRESH`
- Passe 3 : Ajouter inspection du cycle de vie des `sys:extension` (SEAL ou PRUNE)
- Ajouter Passe 6 : **SANTÉ** — Calcul des métriques de dérive via sys:history

---

### Composant 3 : Fichiers Obsolètes

#### [MODIFY] [corp_nexus.md](file:///home/giak/projects/expanse/.expanse/corp_nexus.md)
#### [MODIFY] [psi_nexus.md](file:///home/giak/projects/expanse/.expanse/psi_nexus.md)

Archivés dans `_archives/nexus/`. Le boot V15 ne les lit plus. Les données pertinentes doivent être migrées vers Mnemolite (`sys:recent`).

---

### Composant 4 : Documentation

#### [MODIFY] [usage.md](file:///home/giak/projects/expanse/doc/v14/usage.md)

Mise à jour pour V15 : nouveau boot, nouvelles commandes, ECS vectoriel.

---

## User Review Required

> [!IMPORTANT]
> **Décision 1** : Le Triptyque Mémoriel (Court/Moyen/Long) est-il correct ? Mnemolite couvre-t-il bien court ET moyen terme, avec les fichiers statiques comme ADN long terme ?

> [!IMPORTANT]
> **Décision 2** : L'ECS Vectoriel (C, T, D, R) est-il la bonne granularité ? Trop de dimensions = sur-ingénierie. Pas assez = ECS reste subjectif.

> [!WARNING]
> **Décision 3** : Le Dream Mechanism doit-il être invoqué manuellement par l'utilisateur ou déclenché automatiquement (ex: après N sessions) ? Actuellement il est manuel.

---

## Verification Plan

### Automated Tests
- Re-run Audit V5 (4 sondes d'inversion) post-V15 → Target IRO > 0.75
- [forensic_stats.py](file:///home/giak/projects/expanse/doc/audit/forensic/forensic_stats.py) sur nouvelles sessions ON/OFF

### Manual Verification
- Boot V15 sans nexus files → Vérifier que `sys:core` + `sys:recent` suffisent
- Test ECS Vectoriel sur 10 inputs variés → Vérifier routage L1/L2/L3
- Test Dream Mechanism → Vérifier que Passe 0 consomme sys:history
