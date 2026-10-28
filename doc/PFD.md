---
type: PFD
version: v6
status: ACTIVE
title: "Project Foundation Document — Expanse"
created: 2026-07-04
last_revised: 2026-07-04
audit_trail: "v1 → v2 : 6 corrections audit antagoniste profond #2 (3.5/10 → 7/10 + 2 surgical fixes post-review). v2 → v3 : pivot doc — stub Mnemolite levé (service MCP live confirmé localhost:8002 via /home/giak/Work/MnemoLite/), dette « stub Mnemolite absent » de l'audit #2 refermée. v3 → v4 : livraison SPEC v18.1 (8 corrections cumulées : 5 audit antagoniste profond #3 sur dissociation system/user prompt + bridge MCP + anti-prompt-injection + smoke-suite + cross-language, puis 3 followup review v18.1 — ancrage SHA §3.1 + couverture multilingue §5.4 + bump cross-ref D8). Cross-doc dette SPEC refermée ; activation Phase 1 techniquement débloquée sur D8. v4 → v5 : livraison PRD.md v1 (9 sections, 14 EF + 16 ENF + 9 CA-I + 10 CA-S + 3 personas + 4 R-PRD) — formalise les exigences produit concrètes en descendant d'un niveau par rapport au PFD, sans dupliquer VISION/PFD. Cross-doc cohérence PRD ↔ PFD ↔ SPEC ↔ VISION établie. v5 → v6 : audit antagoniste profond #4 vs truth-engine v2 — confrontation empirique entre le méta-langage opérationnel de giak (truth-engine, ~233 enquêtes daily-driver, KERNEL.md + 1500 lignes de SYMBOLS/PATTERNS/THREATS/clusters + protocole 20 étapes) et le méta-langage théorique d'Expanse Phase 1. Conclusion : **refuser la surcharge narrative (clusters TE), importer l'exigence de structuration (taxonomie des menaces), valider via neutralité thématique**. 3 modifications appliquées : H5 ajoutée au §4 (hypothèse RLHF-neutralité obligeant Phase 1 à des prompts sur données neutres/abstraites), PRD v1.1 EF-1 corollaire anti-TE (interdiction du contexte narratif externe dans les tests), PRD v1.1 CA-S-4 (domaines neutres obligatoire, thèses géopolitiques interdites). Archive complète dans doc/05-audits/2026-07-04_truth-engine-vs-expanse_AUDIT-04.md."
project: Expanse (Phase 1 : recherche empirique)
---

> **Voir aussi — hiérarchie documentaire Expanse (PFD = doc courant).**
> - **Au-dessus** : `doc/VISION.md` (v17 ACTIVE) — direction et ambition du projet (9 sections, non-négociable, ne descend pas).
> - **Ce document** : PFD v5 (cadrage global, infrastructure exécutive Phase 1).
> - **En-dessous (docs dérivés)** :
>   - `doc/PRD.md` (v1 ACTIVE) — exigences produit concrètes et testables (9 sections : 14 EF, 16 ENF, 9 CA-I, 10 CA-S, 3 personas, 4 R-PRD).
>   - `doc/01-specs/2026-07-04_v18_SPEC_juge-semantique-d8_ACTIVE.md` — spécification opérationnelle du juge D8 (8 sections, opérationnalise PFD D8).
>
> Pour toute question de fond non couverte par ce PFD, se référer à **VISION** (au-dessus) ou **PRD** (en-dessous). Le PFD ne duplique ni l'un ni l'autre : il **opérationnalise** VISION (en posant les décisions D1-D8) et **alimente** PRD (en lui fournissant le périmètre exécutable).

# Project Foundation Document (PFD) — Expanse

> **Note de cohérence.** Ce document opérationnalise le cadrage défini dans `doc/VISION.md`. Il ne s'y substitue pas, mais définit l'infrastructure exécutive de la Phase 1. Pour toute question de fond (périmètre étendu, types de briques, verdict, exclusions), voir `doc/VISION.md`.

---

## 1. Contexte

- **Gestation.** Le projet naît d'une intuition encadrée par `doc/VISION.md` (§1). Vingt itérations de design — audits antagonistes, fact-checks de l'état de l'art, résolution des Failles #1 à #9 — ont forgé un socle de rigueur avant toute ligne de code.
- **Chaîne de décision.** L'initiative part de l'intention d'optimiser le dialogue LLM, confrontée immédiatement à l'impératif de preuve. **On ne construit pas sans mesurer.**
- **Raison d'être (Phase 1).** Valider empiriquement si un méta-langage cognitif dédié a un impact réel sur des LLM locaux, **avant** d'engager tout effort de conception en Phase 2.

---

## 2. Objectifs (Phase 1)

- **Objectif stratégique.** Obtenir une réponse mesurable et qualifiée (verdict graduel, `doc/VISION.md` §5) pour les 7 questions de recherche documentées dans `doc/VISION.md` §2.
- **Ce qui doit être vrai en fin de Phase 1.** L'utilité brute des briques d'un tel langage aura été validée ou réfutée, **documentée par des traces inaltérables** (JSON via service Mnemolite MCP live — cf. `PFD D7`).
- **Objectif tactique immédiat.** Exécuter et archiver avec succès un premier test comparatif robuste sur **Q1 — Atome textuel vs définition déployée** impliquant au moins 2 modèles de familles architecturales distinctes (Llama + Mistral ou équivalents disponibles localement, cf. H4).

---

## 3. Périmètre

- **IN-Scope (Phase 1).** Exécution de tests empiriques bicéphales (mesure primaire + contrôle anti-artefact) via un harnais d'automatisation Bash/Ollama. **Stockage des traces via le service Mnemolite MCP live** (`http://localhost:8002/mcp` — 29 outils MCP exposés dont `mcp_mnemolite_write_memory` / `search_memory` / `update_memory` / `delete_memory`, plus API REST parallèle sur port 8001 — source : `/home/giak/Work/MnemoLite/`).
- **OUT-Scope.** Voir exclusions dans `doc/VISION.md` §7. Pas d'implémentation de méta-langage (Phase 2). Pas d'API distante payante. Pas d'agent conversationnel non local.
- **En-périmètre immédiat (prochains livrables concrets).**
  1. Schéma JSON strict pour la définition d'un test.
  2. Script Bash lanceur (`run_test.sh`).
  3. Module d'injection Ollama (sessions vierges).
  4. Module de validation à l'aveugle par l'opérateur (masquage consigné).
  5. Stockage des traces dans **Mnemolite (service MCP live)** avec tags structurés (`trace:fresh` legacy hérité V9-V15 + tags Expanse Phase 1 : `q:Q1|Q2|Q5`, `model:<id>`, `judge:<id>`, `phase:1`, `kind:judge_run|golden_cell`).

---

## 4. Hypothèses fondationnelles

*Postulats opérationnels sur lesquels le projet repose, distincts des questions de recherche testables (voir `doc/VISION.md` §2).*

- **H1.** Un modèle quantifié fonctionnant en local via Ollama reste suffisamment représentatif des mécaniques cognitives fondamentales des LLMs pour tirer des conclusions générales (à périmètre de tokenizer comparable). **Limite connue :** la quantification (Q4 par défaut) écrase prioritairement les poids des tokens à faible fréquence, ce qui peut dégrader la précision sur les caractères rares testés en Q1. Pour les tests de précision token-level, une quantification supérieure (Q8 ou fp16) sera privilégiée si disponible, sous réserve de VRAM suffisante (cf. §5).
- **H2.** Le parsing et l'extraction de métriques par scripts déterministes Bash sont **suffisants pour détecter des artefacts structurels** (présence/absence de mots-clés, format, longueur, comptage de tokens). **Insuffisants pour juger la qualité sémantique** : `grep` ne distingue pas un raisonnement correct d'une hallucination polie incluant le mot-clé attendu. Pour Q2 (marqueur d'incertitude) et Q5 (incarnation), un **juge sémantique** est requis — soit un modèle tiers local en aveugle, soit une procédure déterministe à seuil fixe documentée (cf. D8).
- **H3.** Le stockage plat (fichiers Markdown/JSON via Mnemolite) supporte la charge cognitive de suivi des itérations sans requérir de base de données relationnelle.
- **H4.** Le « multi-substrat » au sens VISION §6 impose que les 2 modèles testés ne soient **pas seulement de poids différents**, mais de **familles architecturalement distinctes** (ex. un dérivé Llama + un dérivé Mistral) — afin que les artefacts communs à un engine d'inférence (llama.cpp, MLX, vLLM) ne soient pas confondus avec l'effet testé. À défaut de deux familles disponibles localement, deux backends d'inférence distincts (Ollama/llama.cpp + MLX ou vLLM) sont exigés.

- **H5.** *(v6, post-audit antagoniste profond #4 vs `truth-engine v2` — 2026-07-04)* L'impact sémantique résiduel du **RLHF** sur les thématiques sensibles (politique, guerre, désinformation, minorités, opinion morale) **fausse la mesure de la compaction sémantique (Q1)** : les modèles 2026 sont systématiquement renforcés sur ces sujets, tout symbole évoquant ces domaines capture un signal RLHF pré-existant, pas l'effet propre du symbole. **Décision PFD v6 :** les prompts Phase 1 doivent porter sur des **données neutres ou abstraites** (logique formelle, tri de structures triviales, parsing syntaxique, transformations symboliques pures). Cette contrainte est répercutée dans `PRD.md v1.1 §5.1 EF-1 corollaire anti-TE` et `PRD.md v1.1 §8.2 CA-S-4 domaines neutres uniquement`. *Implication méthodologique :* cette contrainte **limite volontairement le potentiel de généralisation** des résultats Phase 1 (un effet observé sur données neutres n'est pas directement extrapolable à des données chargées RLHF) ; elle est cependant **non-négociable** pour que les effets mesurés soient attribuables à l'atome testé et non au bagage RLHF du modèle. *Justification empirique :* le framework opérationnel `truth-engine v2` (~233 enquêtes daily-driver sur des sujets géopolitiques/sécuritaires) produit des sorties qui corrèlent fortement avec les performances RLHF natives des modèles sur ces mêmes sujets, sans qu'il soit possible de dissocier l'effet du méta-langage de l'effet du pré-entraînement.

---

## 5. Contraintes

- **Méthodologiques.** Voir `doc/VISION.md` §6 : agnostique du harnais, aveugle par masquage consigné, multi-substrat, déterminisme forcé, itératif, granulaire.
- **Discipline de la stack (AGENTS.md).** Application stricte de **KISS** (Keep It Simple), **DRY** (Don't Repeat Yourself), **YAGNI** (You Aren't Gonna Need It). Pas d'anticipation de besoins non immédiats. Pas de flagornerie. Honnêteté forensique.
- **Techniques effectives.**
  - Ollama en local pour le test primaire ; second backend d'inférence ou seconde famille architecturale obligatoire (cf. H4) pour le multi-substrat réel.
  - Zéro coût cloud / API payante.
  - Pas de fine-tuning (poids gelés).
  - Outillage restreint à Bash, JSON, jq, grep, curl + juge sémantique tiers local si requis par H2 / D8.
  - Sessions LLM vierges à chaque test (pas de contamination inter-tests).
  - **Aveugle dilué obligatoire** (mitigation structurelle de l'auto-biais de l'opérateur unique, cf. VISION §9-g) :
    1. **Délai J+1** — aucune évaluation le jour de la génération ; toute lecture à l'aveugle s'effectue au minimum 24 heures après la dernière session testée.
    2. **Dilution massive** — les réponses à évaluer sont mélangées à au minimum 30 autres réponses non-pertinentes (sessions d'autres questions ou d'autres modèles) avant lecture par l'opérateur. Aucun lien metadata ↔ réponse visible à l'écran.
    3. **Scellage post-vote** — le fichier de trace est verrouillé en lecture seule (`chmod 444`) après le verdict ; toute modification impose une nouvelle session.

---

## 6. Risques

- **Généraux.** Voir `doc/VISION.md` §9 (Effets combinés de bagage symbolique et de variance de tokenisation, Pénalité RLHF, Effet de format reconnaissable, Faiblesse non-étayée de Q5, Robustesse de la mesure, Collision de nomenclature, Auto-biais de l'investigateur).
- **Risques spécifiques au PFD (non documentés dans VISION).**
  - **R1 — Fatigue du porteur.** Le cycle conception → exécution Ollama lente → jugement à l'aveugle → archivage risque d'épuiser l'opérateur unique sur la durée.
    *Mitigation :* plafond itératif documenté (1 session/jour max), pauses forcées après 3 INVALIDATIONS consécutives, règle « verdict figé 7 jours » (aucune relecture de la même session avant 7 jours).
  - **R2 — Drift de scope.** Glissement silencieux d'expérimentation contrôlée vers construction prématurée du méta-langage lors d'itérations prometteuses.
    *Mitigation :* revue de scope obligatoire à chaque changement de priorité Q ; journal de bord signé et horodaté ; **extension concrète de D5** : tout code définissant symboles, heuristiques ou marqueurs Expanse est hors-périmètre Phase 1 et interdit tant que Phase 2 n'est pas explicitement décidée (cf. D5, renforcée).
  - **R3 — Fragilité des scripts.** Changements inopinés dans les formats de sortie d'Ollama ou dans les tokenizers peuvent casser l'évaluation mécanique sans signal clair.
    *Mitigation :* versioning strict des sorties (`sha256` du fichier de trace + `ollama show --modelfile` horodaté), **tests de fumée automatiques** en début de session (prompts canoniques à réponse connue, alerte si dérive), alerte explicite si le comptage de tokens varie de plus de 10 % entre deux sessions identiques.

---

## 7. Critères de succès

- **Macroscopiques.** Application stricte du verdict graduel à 4 niveaux (voir `doc/VISION.md` §5) jusqu'à bascule en Phase 2 ou arrêt par épuisement / réfutation centrale (voir `doc/VISION.md` §8).
- **Livrable minimal de Phase 1 (Golden Record).** Une archive du **service Mnemolite MCP live** (cf. `PFD D7` ci-dessous) avec **seuil de significativité statistique honnête** :
  - **n ≥ 30 mesures par cellule** (prompt × modèle × question) — minimum 30 répétitions pour permettre un test statistique (p-value reportée par cellule, seuil α = 0.05).
  - **2 modèles de familles architecturales différentes** (cf. H4) — pas seulement 2 poids sur le même backend d'inférence.
  - **Au minimum 5 questions distinctes** couvrant au moins 2 domaines sémantiques différents (factuel, opinion).
  - **Triplet de conditions obligatoire** par cellule : Prompt A déployé, Prompt B dense-symbolique, Prompt C témoin neutre.
  - **Empreinte matérielle archivée** : `sha256` des poids (`ollama show --modelfile` + manifest Mistral/Llama le cas échéant), comptage de tokens local par tokenizer, durée de session, timestamp UTC.
  - Verdict qualifié selon le niveau graduel **+ p-value + intervalle de confiance à 95 % reportés**.
  - C'est l'obtention de ce Golden Record — couvrant la matrice complète ET le seuil statistique ci-dessus — qui valide l'infrastructure de Phase 1. **Sans p-value significative**, l'infrastructure est jugée non-fiée et Phase 1 n'est pas considérée comme terminée (le critère « le script a tourné sans crasher » est insuffisant).

---

## 8. Décisions actées

*Historique de la gestation structurante (Phase 0 → Phase 1).*

- **D1.** Choix délibéré d'**Ollama + Bash + JSON** comme socle ultraléger de test (rejet de Python/PyTorch/HF par principe YAGNI pour Phase 1).
- **D2.** Adoption du **verdict graduel à 4 niveaux** (VALIDÉ fort / partiel, INVALIDÉ artefact / bruit), en remplacement de tout verdict binaire ou de formulations intermédiaires (« prometteur », « nuancé »).
- **D3.** Harnais de test défini comme **strictement agnostique des hypothèses testées** — le script ne doit contenir aucune des hypothèses qu'il évalue.
- **D4.** Imposition de la **rigueur forensique** : audit antagoniste systématique, mesure mécanique externe, masquage consigné pour le contrôle anti-artefact.
- **D5.** Séparation dure dans le temps entre la **recherche (Phase 1)** et l'**implémentation éventuelle** du méta-langage (Phase 2). Aucune implémentation tant que les briques ne sont pas validées.
- **D6.** Format canonique du fichier de définition de test : `{id, model, metric, prompts: [prompt_A, prompt_B, prompt_neutral], question}` — le tableau `prompts` inclut obligatoirement une troisième entrée (`prompt_neutral`) pour la condition témoin neutre exigée par `doc/VISION.md` §7. Extensible si besoin, minimal au démarrage.
- **D7.** Rétention de la mémoire projet et des traces déterministes confiée à **Mnemolite** (mémoire externe queryable — **service MCP live confirmé à `http://localhost:8002/mcp`**, source `/home/giak/Work/MnemoLite/`). NOTA : Mnemolite N'EST PAS un banal log — c'est un service complet (**29 outils MCP** sur port 8002 — les 2 outils critiques **vérifiés** au 2026-07-04 sont `mcp_mnemolite_write_memory` (archivage) et `mcp_mnemolite_search_memory` (récupération) ; cf. `/home/giak/Work/MnemoLite/MCP_SETUP.md` pour liste exhaustive — **API REST parallèle** sur port 8001, taxonomie tags standardisée héritée V9-V15 : `sys:core` / `sys:anchor` / `sys:pattern` / `sys:history` / `trace:fresh`). **Note de fragilité** : le path `/home/giak/Work/MnemoLite/` est local-opérateur ; à re-vérifier si migration de machine (cf. §6 R3).
- **D8.** Pour Q2 et Q5, où le parsing Bash est insuffisant (cf. H2), un **LLM-as-a-Judge tiers local** est imposé : un modèle distinct (`judge`), **différent des modèles candidats**, lit les réponses et fournit un score sémantique reproductible. Le `judge` est lui-même traité comme substrat additionnel ; ses verdicts sont archivés avec leur propre empreinte de tokenizer, leur propre graine, et un prompt système figé pour la reproductibilité. La sortie du `judge` ne constitue **jamais** le verdict final : elle alimente le contrôle anti-artefact (VISION §4.3), qui reste sous responsabilité humaine.
  **→ Spécification opérationnelle :** voir `doc/01-specs/2026-07-04_v18_SPEC_juge-semantique-d8_ACTIVE.md` (prompt système figé §2 avec dissociation system/user prompt, schéma JSON polymorphique Q2/Q5 §3 + bridge MCP Mnemolite §3.3, procédure de notation §4, garde-fous §5 + smoke-suite vérité-terrain §5.4, cas-limites §6, mapping VISION §5 §8). **Activation opérationnellement possible** : le service Mnemolite MCP tourne (cf. D7). Pas de stub local séparé nécessaire — la dette « stub Mnemolite absent » documentée par l'audit antagoniste profond #2 du PFD est levée. **v18 (2026-07-04) :** 5 corrections de l'audit antagoniste profond #3 appliquées (cf. SPEC §footer).

---

*PFD rédigé le 4 juillet 2026 (v2) — opérationnalise `doc/VISION.md` sans la dupliquer. 6 corrections issues de l'audit antagoniste profond #2 : H2 reformulé (artefacts vs sémantique), H4 ajouté (multi-substrat strict), Aveugle dilué en §5 (J+1 + dilution 30+ + scellage), mitigations concrètes pour R1/R2/R3, Golden Record borné statistiquement (n≥30 + p-value + α=0.05), D8 LLM-as-Judge tiers local. Sections propres au PFD : « En-périmètre immédiat », « Hypothèses fondationnelles », « Décisions actées ».*
