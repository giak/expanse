# 📚 INDEX V18 — navigation Phase 1

## §BOOT — Cold-start protocol ⚠️ LIRE EN PREMIER

> **Ce bloc est la première chose à lire** par tout LLM ouvrant INDEX_V18 avec contexte vierge. Il impose séquence + invariants non-négociables + orchestration IDs. Tout reste de l'INDEX (sections ci-dessous) reste inchangé.

### §BOOT.1 — Statut de machine (2026-07-04)

- **Phase 1** : techniquement débloquée (audit antagoniste profond #4 vs `truth-engine v2` → 3 modifs PFD/PRD appliquées). État détaillé cf. §3.1.
- **Harness** : non livré, dette §6 (4 items : schema JSON test.json + run_test.sh + fixture smoke-suite + pilote Phase 1).
- **Golden Record** : **0 cellule archivée**. Cadre prêt, tests réels non exécutés.
- **Phase 2 (implémentation méta-langage)** : **interdite** tant que ≥ 3 briques `VALIDÉ fort` non documentées par Golden Record (cf. VISION §8 conditions d'arrêt).

### §BOOT.2 — FIRST CONTACT (séquence imposée d'ouverture)

À l'ouverture d'INDEX_V18 avec contexte vierge, lire **dans cet ordre strict** :

1. **Ce §BOOT** (50 lignes, ~2 min de lecture) — fixe le cadre opérationnel.
2. `doc/VISION.md` v18 — `§2` (Q1-Q7) + `§5` (verdict graduel 4 niveaux) + `§6` (contraintes non-négociables) + `§7` (exclusions Phase 1/2).
3. `doc/PFD.md` v6 — `§3` (5 livrables) + `§4` (H1-H5) + `§7` (Golden Record) + `§8` (D1-D8).
4. `doc/PRD.md` v1.1 — `§3.2` (objectifs SMART O1-O6) + `§5` (14 exigences fonctionnelles EF-1 à EF-14) + `§8` (19 critères d'acceptation).
5. `doc/01-specs/2026-07-04_v18_SPEC_juge-semantique-d8_ACTIVE.md` v18.1 — `§2` (system prompt figé) + `§3.3` (bridge MCP Mnemolite) + `§5.4` (smoke-suite vérité-terrain).

### §BOOT.3 — DO NOT TOUCH (consignes anti-drift)

| Interdit | Source | Raison |
|---|---|---|
| ❌ Fine-tuning des poids | PRD ENF-9 + VISION §7 | Pollution des effets testés |
| ❌ API cloud payante (OpenAI/Anthropic/Cohere) | PRD ENF-8 + PFD §5 | Hors-périmètre budget |
| ❌ Support OS non-Linux (Windows/macOS) | PRD §7.9 | Stack `Bash+Ollama+chmod` Linux-only |
| ❌ Bundles multi-briques dans 1 test | PRD EF-1 | Viole granularité stricte |
| ❌ Formulation intermédiaire hors verdict 4-niveaux | PRD EF-8 + PFD D2 | « Prometteur / nuancé » INTERDIT |
| ❌ Implémentation méta-langage en Phase 1 | PFD D5 + PRD §7.1 | Bascule Phase 2 conditionnée à Golden Record |
| ❌ Thèmes sensibles RLHF dans tests | PFD v6 H5 + PRD v1.1 EF-1 corollaire Anti-TE + PRD v1.1 CA-S-4 | RLHF fausse mesure Q1 |
| ❌ Lecture J+0 (aveugle dilué obligatoire) | PRD EF-11 + PFD §5 | Auto-biais opérateur (VISION §9-g) |
| ❌ Session Ollama contaminée par test précédent | PRD EF-4 + VISION §6 | Pas de pollution inter-tests |
| ❌ Drift de scope sans audit antagoniste | PFD R2 + PRD EF-14 | Mutation doit être tracée |

→ **Toute violation ⇒ audit antagoniste ciblé (PRD EF-14) avant continuation.**

### §BOOT.4 — Orchestration IDs Mnemolite (live)

**Endpoints** (PFD D7, confirmé 2026-07-04 — `/home/giak/Work/MnemoLite/MCP_SETUP.md`) :

- **MCP** : `http://localhost:8002/mcp` — 29 outils `mcp_mnemolite_*`. Les 2 outils **explicitement critiques** (à utiliser en priorité) :
  - **`mcp_mnemolite_write_memory`** (archivage — cf. mapping payload ci-dessous).
  - **`mcp_mnemolite_search_memory`** (récupération par query + tags).
  - Les 27 autres outils (`update_memory`, `delete_memory`, `link_memory`, etc.) sont disponibles mais **non-canoniques** pour Phase 1 : ne pas les utiliser par défaut.
- **REST** : `http://localhost:8001/rest` — API parallèle.

**Mapping `mcp_mnemolite_write_memory` (SPEC v18.1 §3.3)** — payload obligatoire :

```json
{
  "title": "<Q-id-cell-NNN>",
  "content": "<JSON sérialisé complet de la sortie (juge + candidat)>",
  "memory_type": "judge_run",
  "tags": ["kind:judge_run", "phase:1", "q:Q1", "model:<judge_id>"]
}
```

**Tags canoniques** (PRD ENF-15 + PFD §3 livrable 5) — obligatoires vs conditionnels :

| Tag | Type | Usage |
|---|---|---|
| `kind:golden_cell` | obligatoire | Cellule Golden Record (~30 mesures, p<0.05) |
| `kind:judge_run` | obligatoire | Sortie juge D8 (Q2/Q5) |
| `kind:anti_artefact_check` | obligatoire si EF-9 | Vérification anti-artefact datée J+1, signée |
| `phase:1` | obligatoire | Phase 1 recherche |
| `q:Q1`..`q:Q7` | obligatoire | Question couverte |
| `model:<id>` | obligatoire | Modèle candidat |
| `judge:<id>` | obligatoire Q2/Q5 | Modèle juge |
| `lang:<iso>` | conditionnel | Langue (cf. SPEC v18.1 §5.4 cross-language) |
| `parse_status:<X>` | conditionnel | Statut parsing |
| `variance_high:true` | conditionnel | Si variance ≥ 0.30 (SPEC v18.1 §5.2 → verdict NOISE) |

### §BOOT.5 — Péremption

> ℹ️ Dates en dur — à **actualiser** à chaque bump de INDEX_V18 (sinon le cold-start LLM pourrait les traiter comme immuables).

- **INDEX_V18 valide jusqu'au 2026-08-04** (J+30 après création).
- **Au-delà** : re-validation obligatoire via `rtk head -8 doc/VISION.md doc/PFD.md doc/PRD.md doc/01-specs/*ACTIVE.md` ; vérifier que `version:` reste ACTIVE.
- **Audits > J+90 à re-jouer** (audit #4 truth-engine valide jusqu'au 2026-10-03 ; SPEC v18.1 audit_trail #3 valide jusqu'au 2026-10-03).

---

> **Catalogue de navigation rapide** des 4 documents actifs Phase 1 d'Expanse (VISION → PFD → PRD + SPEC). Pour brainstorming/recettes V17 archivés (12 fichiers), voir `doc/INDEX_V17.md` (musée read-only).
>
> Ce fichier est créé le **2026-07-04**, simultanément à la clôture de la dette cross-doc (VISION v17 → v18 + PFD v5 → v6 + PRD v1 → v1.1 + audit antagoniste profond #4 vs truth-engine v2).

---

## §0 — Hiérarchie documentaire (du macro au micro)

```
        ┌────────────────────────────────┐
        │  VISION v18  (doc racine)      │  Pourquoi + Quoi : 9 sections, Q1-Q7, verdict graduel
        │  166 lignes / 18 KB            │  agnosticité, exclusions, critères d'arrêt
        └─────────────┬──────────────────┘
                      │ op.érationnalise
        ┌─────────────▼──────────────────┐
        │  PFD v6     (cadrage)          │  Comment Phase 1 : D1-D8, H1-H5, R1-R3
        │  129 lignes / 18 KB            │  Golden Record, livrables concrets, audit_trail v1→v6
        └─────────────┬──────────────────┘
                      │ formalise + exigences testables
        ┌─────────────▼──────────────────┐
        │  PRD v1.1   (exigences)        │  9 sections : 14 EF + 16 ENF + 9 CA-I + 10 CA-S
        │  401 lignes / 38 KB            │  + 3 personas + 4 R-PRD
        └─────────────┬──────────────────┘
                      │
        ┌─────────────┴──────────────────────────────────────────┐
        │                                                         │
┌───────▼────────┐                                    ┌──────────▼─────────┐
│  SPEC v18.1    │                                    │  FUTUR Phase 2     │
│  (juge D8)     │                                    │  (méta-langage)    │
│  293 lignes    │                                    │  (hors-périmètre)  │
│  / 22 KB       │                                    │  cf. VISION §7+§8  │
└────────────────┘                                    └────────────────────┘
```

**Note sémantique** (v18) : VISION est **racine** ; les 3 docs inférieurs sont des **descendants** qui op.érationnalisent VISION. Le label `depends_on` dans le frontmatter VISION est conservé par convention croisée avec PFD/PRD (qui eux dépendent littéralement de VISION) — l'inversion est documentée cf. VISION v18 frontmatter commentaire YAML.

---

## §1 — Documents actifs Phase 1 (4 entrées)

> **Convention de labels** (pour cette section et toutes références suivantes) : **`W = Writing pass`** (couche documentaire Expanse), **0=racine/absolu**, **1-3=profondeur décroissante**. `W0` < `W1` < `W2` < `W3` du macro vers le micro. Cette convention est strictement mnémonique — elle ne reflète pas une date de rédaction ou une priorité d'édition.

| Label | Fichier | Version | Statut | Lignes | Taille | Rôle |
|---|---|---|---|---|---|---|
| **W0** `(racine)` | `doc/VISION.md` | **v18** | ACTIVE | 166 | 18 KB | Cadrage macroscopique — pourquoi + quoi (Q1-Q7, verdict graduel, exclusions, arrêt) |
| **W1** `(cadrage)` | `doc/PFD.md` | **v6** | ACTIVE | 129 | 18 KB | Cadrage opérationnel — D1-D8, H1-H5, R1-R3, Golden Record, livrables |
| **W2** `(exigences)` | `doc/PRD.md` | **v1.1** | ACTIVE | 401 | 38 KB | Exigences produit concrètes — 14 EF + 16 ENF + 9 CA-I + 10 CA-S + 3 personas + 4 R-PRD |
| **W3** `(spécification)` | `doc/01-specs/2026-07-04_v18_SPEC_juge-semantique-d8_ACTIVE.md` | **v18.1** | ACTIVE | 293 | 22 KB | Spécification opérationnelle du juge LLM tiers local (opérationnalise PFD D8 pour Q2/Q5) |

**Total Phase 1 actif** : 989 lignes, ~96 KB.

---

## §2 — Section maps cross-docs (navigation rapide)

### §2.1 — Verdict graduel (4 niveaux)

| Définition | Doc | Section |
|---|---|---|
| 4 niveaux : `VALIDÉ fort/INVALIDÉ artefact/bruit/VALIDÉ partiel` | **VISION.md** | `§5` |
| Adoption comme D2 | **PFD.md** | `§8 D2` |
| Application stricte au framework (EF-8) | **PRD.md** | `§5.3 EF-8` |
| Audit grep anti-formulations intermédiaires | **PRD.md** | `§8.1 CA-I-7` |

### §2.2 — 7 questions de recherche (Q1-Q7)

| Localisation | Doc | Section |
|---|---|---|
| Définition + catégorisation haute/standard | **VISION.md** | `§2` |
| Couverture obligatoire pour Phase 1 (≥ 5 sur 7) | **PFD.md** | `§7 Golden Record` |
| Critère d'acceptation (CA-S-3 + CA-S-8) | **PRD.md** | `§8.2` |

### §2.3 — Hypothèses fondationnelles (H1-H5)

| Hyp. | Énoncé court | VISION | PFD | PRD |
|---|---|---|---|---|
| **H1** | Quantif. locale suffisamment représentative | — | `§4 H1` | (réf implicite) |
| **H2** | Parsing Bash suffit pour artefacts, pas pour sémantique | §4.3 | `§4 H2` | `§5.3 EF-9` |
| **H3** | Stockage plat supporte charge cognitive | §7 gouvernance | `§4 H3` | (réf implicite) |
| **H4** | Multi-substrat = familles architecturales distinctes | §6 multi-substrat | `§4 H4` | `§5.2 EF-6` |
| **H5** *(v6)* | RLHF-faune-mesure Q1 → prompts sur données neutres | §6 agnosticité + §9-a témoins neutres | `§4 H5` | `§5.1 EF-1 corollaire Anti-TE` + `§8.2 CA-S-4` |

### §2.4 — Décisions actées (D1-D8, PFD §8)

| Déc. | Énoncé court | PRD (réf) | SPEC (réf) |
|---|---|---|---|
| **D1** | Stack ultraléger Bash + JSON + jq (pas Python) | `§6.4 ENF-11` | — |
| **D2** | Verdict graduel 4 niveaux | `§5.3 EF-8` | (§4 sortie) |
| **D3** | Harness agnostique des hypothèses | `§6 R-PRD-3` | — |
| **D4** | Rigueur forensique (audit antagoniste) | `§5.4 EF-14` | — |
| **D5** | Séparation dure Phase 1 ↔ Phase 2 | `§7.1` | — |
| **D6** | Format canonique `{id, model, metric, prompts[3]}` | `§5.1 EF-2` | — |
| **D7** | Mnemolite live (`localhost:8002/mcp`) | `§9.1` | `§3.3 bridge MCP` |
| **D8** | LLM-as-a-Judge tiers local + SPEC opérationnelle | `§5.3 EF-10` | **TOUT** le SPEC |

### §2.5 — Risques (VISION §9 + PFD §6 + PRD §9.4)

| Risque | Doc original | PRD-spécifique (R-PRD) |
|---|---|---|
| VISION §9-a → PFD §5 → PRD ENF-3 | témoins neutres de tokenization | (`EF-1` corollaire Anti-TE) |
| VISION §9-b → PFD §5 → PRD ENF-8/ENF-9 | RLHF pénalité | (CA-S-4 domaines neutres) |
| VISION §9-g → PFD §5/R1 → PRD EF-11/EF-12 | auto-biais investigator | (`§6 R-PRD-3 surcharge cognitive`) |
| PFD §6 R2 | drift de scope | (`§7.1` Phase 2 exclusion) |
| PFD §6 R3 | fragilité scripts | (PRD `§6.2 ENF-3`) |
| **(non couverts VISION/PFD)** | — | **R-PRD-1 à R-PRD-4** — fossilisation par rigueur, inflation documentaire, surcharge cognitive, verrouillage de format |

---

## §3 — Sets cohérents emboîtés (chaines de contraintes)

### §3.1 — Neutralité thématique (truth-engine → Expanse)

> **Daté du 2026-07-04** : verrouillage méthodologique livré via audit antagoniste profond #4 vs `truth-engine v2`. Trois modifications emboîtées, chacune datée :

| Niveau | Doc / Section | Contrainte | Date livraison |
|---|---|---|---|
| Macro | VISION v18 §6 agnosticité | Le harnais ne contient aucune des hypothèses qu'il évalue | (initial VISION) |
| Macro | VISION v18 §9-a témoins neutres | Comptage tokens par tokenizer, condition témoin obligatoire | (initial VISION) |
| Meso | PFD v6 §4 H5 | RLHF sur thèmes sensibles fausse Q1 → prompts Phase 1 sur données neutres | 2026-07-04 (audit #4) |
| Micro | PRD v1.1 §5.1 EF-1 corollaire Anti-TE | **Aucune** contexte narratif externe / clusters / glossaires dans les tests | 2026-07-04 (audit #4) |
| Micro | PRD v1.1 §8.2 CA-S-4 | **≥ 2 domaines neutres** (logique, tri, parsing) ; thèses géopolitiques **interdites** | 2026-07-04 (audit #4) |

→ **Verrouillage méthodologique complet** : une violation locale (EF-1) serait filtrée par la contrainte meso (H5) et l'acceptation macro (CA-S-4 ≥ 2 neutres). Datation forensique : 2026-07-04 = ajout simultané des 3 niveaux Meso/Micro (Macro étaient déjà en place depuis VISION v17).

### §3.2 — Mesure bicéphale (mesure primaire + contrôle anti-artefact)

| Niveau | Doc / Section | Contrainte |
|---|---|---|
| Macro | VISION §4 fonctionnalités de haut niveau | Mesure mécanique déterministe + contrôle séparé |
| Meso | PFD D8 | LLM tiers local comme juge ; jamais verdict final seul |
| Micro | PRD §5.3 EF-9 | Vérification grep `kind:anti_artefact_check` J+1 signé |

### §3.3 — Aveugle dilué obligatoire

| Niveau | Doc / Section | Contrainte |
|---|---|---|
| Macro | VISION §9-g mitigation | Aveugle strict + revue extérieur |
| Meso | PFD §5 (3 dispositions : J+1, dilution 30+, scellage) | Auto-biais opérateur mitigé structurellement |
| Micro | PRD §5.4 EF-11/EF-12 | (1) Délai J+1, (2) ≥ 30 distracteurs, (3) `chmod 444` |
| Micro | PFD §6 R1 | Plafond 1 session/jour ; pause après 3 INVALIDATIONS |

---

## §4 — Audits livrés (traçabilité forensique)

> **Mapping audit antagoniste profond #N → fichier** (explicite, lève l'ambiguïté de la PFD v6 `audit_trail` qui mentionnait #1-#4 sans préciser le fichier) :
> - **Audit antagoniste profond #1** = `doc/05-audits/audit-prompt-v16.md` (84 lignes, 2026-07-02) — audit initial V16, baseline « au fer à brûler ».
> - **Audit antagoniste profond #2** = `doc/05-audits/audit-prompt-v16-rapport.md` (1 887 lignes, 2026-07-02) — version V2 approfondie, dialectique (Tèse→Antithèse→Synthèse). Score baseline 3.5/10 → 7/10 post-corrections (cf. PFD v6 audit_trail « v1 → v2 »).
> - **Audit antagoniste profond #2bis** = `doc/05-audits/audit-prompt-v16-contre-audit.md` (133 lignes, 2026-07-02) — contre-audit forensique du #2 — correction des hallucinations factuelles du rapport.
> - **Audit antagoniste profond #3** = **PAS de fichier dédié** ; **chaînage dans le pied de** `doc/01-specs/2026-07-04_v18_SPEC_juge-semantique-d8_ACTIVE.md` (footer « v18 (2026-07-04) : 5 corrections de l'audit antagoniste profond #3 » + audit_trail PFD v6 entrée « v3 → v4 »). 5 corrections appliquées : dissociation system/user prompt, bridge MCP Mnemolite, anti-prompt-injection `<answer>`, smoke-suite vérité-terrain, cross-language CA-S. Score 4/10 → 9/10 post-review.
> - **Audit antagoniste profond #4** = `doc/05-audits/2026-07-04_truth-engine-vs-expanse_AUDIT-04.md` (178 lignes, 2026-07-04) — confrontation empirique truth-engine v2 vs Expanse Phase 1. Score 6.5/10 APPROUVÉ conditionnel, **3 modifications appliquées** (PFD v6 H5 + PRD v1.1 EF-1 corollaire Anti-TE + PRD v1.1 CA-S-4).

| Référence interne | Fichier cible | Date | Score (avant/après) | Verdict (post-correction) |
|---|---|---|---|---|
| Antagoniste #1 | `doc/05-audits/audit-prompt-v16.md` | 2026-07-02 | n/a (initial) | Baseline de référence |
| Antagoniste #2 | `doc/05-audits/audit-prompt-v16-rapport.md` | 2026-07-02 | 3.5/10 → 7/10 | APPROFONDI dialectique |
| Antagoniste #2bis | `doc/05-audits/audit-prompt-v16-contre-audit.md` | 2026-07-02 | n/a (contre-audit) | Forensique correctif |
| Antagoniste #3 | *(chaînage dans pied SPEC v18.1 + PFD v6 audit_trail)* | 2026-07-04 | 4/10 → 9/10 | APPROVED (5 + 3 corrections) |
| Antagoniste #4 | `doc/05-audits/2026-07-04_truth-engine-vs-expanse_AUDIT-04.md` | 2026-07-04 | 6.5/10 | APPROVED conditionnel (3 modifs PFD/PRD) |

---

## §5 — Quick-find navigation (commands rtk)

```bash
# Toutes les versions ACTIVE d'un coup
cd /home/giak/projects/expanse
rg --no-line-number '^version: ' doc/VISION.md doc/PFD.md doc/PRD.md doc/01-specs/*ACTIVE.md

# Section maps : localiser un sujet cross-doc
rtk grep -nE 'aveugle|R1|R-PRD-3|témoins neutres|H5|EF-1 corollaire' doc/VISION.md doc/PFD.md doc/PRD.md | head -20

# Vérifier la cohérence cross-doc (chaîne de contraintes §3)
rtk grep -c 'RLHF\|neutralité\|corollaire Anti-TE\|≥ 2 domaines neutres' doc/PFD.md doc/PRD.md

# Audits livrés + leurs bumps
rtk grep -nE 'v\d+\s*→\s*v\d+|audit antagoniste' doc/VISION.md doc/PFD.md doc/PRD.md doc/05-audits/2026-07-04_truth-engine-vs-expanse_AUDIT-04.md

# Frontmatter integrity check
for f in doc/VISION.md doc/PFD.md doc/PRD.md; do echo "=== $f ==="; head -15 "$f"; done
```

---

## §6 — Dette restante (post-Phase 1 activation)

| Dette | Doc référence | Statut |
|---|---|---|
| **Harness `run_test.sh`** | PFD §3 livrable 2 + D6 | Non livré (implémentation) |
| **Fixture smoke-suite** 10 réponses (≥ 2 non-EN incorrectes + ≥ 1 non-EN correctes) | PRD v1.1 §5.4 + SPEC v18.1 §5.4 | Non livré (implémentation) |
| **Schéma JSON strict** de définition de test conforme à PFD D6 | PFD §3 livrable 1 + PRD §5.1 EF-2 | Non livré (implémentation) |
| **Exécution pilote Q1 sur données neutres** | PRD §5.1 EF-1 corollaire + §8.2 CA-S-4 | **Prochaine étape recommandée** |

---

*INDEX V18 rédigé le 4 juillet 2026 — point d'entrée navigation Phase 1.*
*Complémentaire (pas remplacement) à `doc/INDEX_V17.md` (musée read-only V17, 12 fichiers V17-relevant).*
*Pour toute question de fond : voir VISION (au-dessus) → PFD → PRD + SPEC (en-dessous).*
