---
type: PRD
version: v1.1
status: ACTIVE
title: "Product Requirements Document — Expanse Phase 1 (Framework de mesure empirique)"
created: 2026-07-04
last_revised: 2026-07-04
project: "Expanse (Phase 1 : recherche empirique sur méta-langage cognitif LLM)"
depends_on:
  - doc/VISION.md
  - doc/PFD.md
  - doc/01-specs/2026-07-04_v18_SPEC_juge-semantique-d8_ACTIVE.md
related_decisions: [PFD D1-D8, PFD H1-H4, PFD R1-R3]
audience: "porteur du projet (opérateur unique) + tout regard extérieur sollicité pour audit"
---

# PRD — Expanse Phase 1 (Framework de mesure empirique)

> **Note de cadrage.** Ce PRD **descend d'un niveau** par rapport à `doc/VISION.md` (direction, ambition) et `doc/PFD.md` (cadrage global, infrastructure exécutive). Il formalise les **exigences produit concrètes, testables, partageables** que l'équipe — ici un opérateur unique avec regard extérieur ponctuel — doit satisfaire pour que la Phase 1 soit jugée terminée. Pour toute question de fond (périmètre étendu, type de briques, verdict, exclusions, arrêt), se référer à VISION/PFD ; ce PRD ne les duplique pas, il les opérationnalise en exigences.
>
> **Note de nature.** Expanse Phase 1 n'est pas un produit logiciel commercial : c'est un **framework de mesure empirique** qui produit des verdicts gradués sur 7 questions de recherche. Le « produit » est une **infrastructure de test reproductible** (harness Bash/Ollama + juge LLM local + mémoire Mnemolite). Le « client » est l'investigateur lui-même ; le « consommateur secondaire » est la mémoire du projet. Cette nature conditionne l'interprétation des 9 sections standards : voir les notes par section.

---

## §1 — Contexte

### §1.1 — Origine et intention

Le projet Expanse naît d'une **intuition non-validée** : un symbole dédié, traité comme atome sémantique, déclencherait dans un LLM un traitement différent d'un mot déployé occupant plusieurs tokens — et ce, de manière mesurable, reproductible, indépendante du modèle. Cette intuition est encadrée par `doc/VISION.md §1` (contexte et objet) et **n'a jamais été éprouvée empiriquement** dans la littérature actuelle. L'objet du projet n'est pas de développer un méta-langage, mais de **construire le cadre de validation** qui permettrait de dire, avec preuve à l'appui, si cette intuition tient ou s'effondre.

### §1.2 — État de l'art antérieur

Vingt itérations de design (V15 → V18) ont forgé un socle de rigueur via :
- **Audits antagonistes profonds** (cf. `doc/05-audits/`) — résolution documentée des Failles #1 à #9.
- **Fact-checks** de l'état de l'art (Symbol Tuning, LLMLingua, longueur de contexte, role-prompting).
- **Spécifications opérationnelles** livrées : `doc/01-specs/2026-07-04_v18_SPEC_juge-semantique-d8_ACTIVE.md` (juge D8).
- **Décisions actées** : D1 (Ollama + Bash + JSON), D2 (verdict graduel), D3 (harnais agnostique), D4 (rigueur forensique), D5 (séparation Phase 1/2), D6 (format canonique), D7 (Mnemolite MCP live), D8 (juge LLM tiers local). Cf. `doc/PFD.md §8`.

### §1.3 — Pourquoi un PRD maintenant

VISION et PFD fixent le **quoi** et le **comment général**. Manque : le **quoi de manière assez précise pour qu'une exécution quotidienne soit non-ambiguë**. Un nouveau regard (auditeur, second opérateur, ou le porteur lui-même après une pause) doit pouvoir lire ce PRD et savoir **quelles exigences mesurables** le framework doit satisfaire — sans avoir à reconstituer le raisonnement depuis VISION/PFD.

---

## §2 — Problème utilisateur

### §2.1 — Le « client » est interne au projet

Conformément à `doc/VISION.md §3` et `doc/PFD.md §3`, Expanse Phase 1 n'a **ni client externe, ni utilisateur final classique**. Les « problèmes utilisateurs » sont ceux de l'opérateur (porteur du projet) et de la mémoire du projet :

### §2.2 — Problème #1 (opérateur)

> **« Comment puis-je évaluer empiriquement, sans auto-biais, si mon intuition théorique sur les LLM tient, sans tomber dans le verbiage littéraire ("c'est prometteur", "je sens une différence") ni dans le bruit statistique ("ça dépend") ? »**

**Manifestations concrètes :**
- Sans cadre de mesure, l'opérateur peut confondre un artefact (perroquet du prompt, hallucination formatée) avec un effet réel → faux positifs « VALIDÉ ».
- Sans contrôle anti-artefact, l'opérateur peut involontairement construire des conditions qui favorisent ses hypothèses → auto-biais.
- Sans déterminisme forcé, deux exécutions successives du même test peuvent diverger → verdict non-reproductible.
- Sans seuil statistique, l'opérateur peut s'enthousiasmer sur n=3 mesures → sur-claim.

**Conséquence** : la Phase 1 n'aboutit pas à un Golden Record défendable, et toute bascule en Phase 2 (implémentation méta-langage) serait spéculative.

### §2.3 — Problème #2 (mémoire du projet)

> **« Comment archiver des traces de test de manière à ce qu'elles soient re-dérivables (rejouables), queryables (cherchables par question/modèle/verdict), et inaltérables (non modifiables après scellage) — sans dépendance à une base de données relationnelle ni à un cloud distant ? »**

**Manifestations concrètes :**
- Sans archive inaltérable, un verdict peut être réécrit après coup → falsification.
- Sans re-dérivabilité, la perte d'une session = perte d'un verdict.
- Sans queryabilité, la mémoire devient un journal illisible → l'opérateur ne peut plus capitaliser sur les itérations précédentes.

### §2.4 — Hors-problèmes (ce que ce PRD ne traite pas)

- **Problème de performance** (latence, throughput) — non-objectif Phase 1.
- **Problème d'UX** (ergonomie, interface graphique) — interface = Bash CLI, intentionnellement.
- **Problème d'échelle** (production, multi-tenant) — out-of-scope, cf. `VISION §7`.
- **Problème commercial** (monétisation, marché) — hors-périmètre recherche.

---

## §3 — Objectifs

### §3.1 — Objectif stratégique (Phase 1, fin)

Obtenir un **Golden Record défendable** (cf. `PFD §7`) — archive complète et statistiquement significative de mesures reproductibles sur les **7 questions de recherche** documentées dans `doc/VISION.md §2` — qui permette de basculer en Phase 2 (conception d'un méta-langage complet) **OU** d'arrêter le projet par réfutation centrale ou épuisement productif (`VISION §8`).

### §3.2 — Objectifs tactiques mesurables (SMART)

| # | Objectif | Critère de mesure | Échéance |
|---|---|---|---|
| **O1** | Premier test comparatif Q1 (atome textuel vs définition déployée) archivé | Trace dans Mnemolite avec `kind:golden_cell`, `q:Q1`, ≥ 2 modèles familles distinctes, n ≥ 30 par cellule | Première itération Phase 1 |
| **O2** | Calibration du juge D8 validée | Smoke-suite 10/10 concordant (cf. SPEC v18.1 §5.4), 8/10 minimum exigé pour acceptation | Avant premier run Q2/Q5 |
| **O3** | Couverture des 7 questions | ≥ 5 questions testées avec au moins une cellule chacune (cf. PFD §7) | Fin Phase 1 |
| **O4** | Significativité statistique | p-value < 0.05 par cellule, IC 95 % reporté (cf. PFD §7) | Fin Phase 1 |
| **O5** | Reproductibilité multi-substrat | Au moins **2 modèles de familles architecturales distinctes** par question testée (cf. PFD H4) | Chaque test dès la 1re itération |
| **O6** | Taux de rejets parse/variance | ≤ 5 % des cellules marquées `JUDGE_PARSE_FAILURE` ou `JUDGE_VARIANCE_FAILURE` (cf. SPEC v18.1 §5) | Glissant, sur chaque batch de 50 runs |

### §3.3 — Objectif d'arrêt (pour cadrage)

Conformément à `VISION §8`, l'arrêt de Phase 1 est déclenché par l'un des 3 critères suivants :
- **Réfutation centrale** : Q1 OU Q2 invalidés au niveau `INVALIDÉ — fort` (= l'objet principal du projet disparaît).
- **Épuisement productif** : ≥ 5 mutations consécutives sans variation mesurable.
- **Base suffisante** : ≥ 3 briques `VALIDÉ — fort` cohérentes et reproductibles cross-modèles (bascule Phase 2).

**Pas de deadline temporelle** (cf. `PFD §2` et `VISION §8` : « aucun budget-temps prédéfini »).

### §3.4 — Non-objectifs (objectifs explicitement abandonnés)

- **Maximiser le nombre de questions testées** au-delà de 7 (l'univers de recherche est borné par VISION §2).
- **Optimiser la latence** Ollama (le déterminisme prime sur la vitesse, cf. PFD §5).
- **Construire une UI** (l'interface reste Bash CLI, cf. VISION §7 « Pas une implémentation »).
- **Publier les résultats** en externe (cf. VISION §7 « Pas une publication académique »).

---

## §4 — Personas et cas d'usage

### §4.1 — Persona #1 : Opérateur (porteur du projet, giak)

**Rôle.** L'opérateur unique du framework : il conçoit les tests, les exécute, archive les traces, lit les résultats en aveugle dilué, et arbitre les verdicts.

**Attributs.**
- **Connaissances** : maîtrise du bash, jq, Ollama, et de la taxonomie Mnemolite. Connaissance intime des 7 questions de recherche.
- **Charge cognitive** : 1 session/jour max (cf. PFD §6 R1). Pauses forcées après 3 INVALIDATIONS consécutives.
- **Biais principal** : auto-biais de l'investigateur (cf. VISION §9-g) — il connaît les hypothèses qu'il veut valider.

**Cas d'usage CU-1 : Exécuter un test sur Q1.**
1. Charger le fichier de définition de test (format `PFD D6` : `{id, model, metric, prompts, question}`).
2. Lancer le harness `run_test.sh` sur 2 modèles (Llama + Mistral ou équivalents) avec graine fixée.
3. Récupérer la trace JSON brute + la trace sérialisée Mnemolite (`mcp_mnemolite_write_memory`).
4. **Pas d'évaluation immédiate** (cf. Aveugle dilué J+1, PFD §5).

**Cas d'usage CU-2 : Lire en aveugle dilué une session Q2.**
1. Attendre ≥ J+1 après génération (cf. PFD §5).
2. Charger le masqueur de réponses : 30+ distracteurs + réponse cible, mélangés, sans metadata visible.
3. Voter `VALIDÉ fort / partiel / INVALIDÉ artefact / bruit` (verdict graduel 4 niveaux, VISION §5).
4. Sceller la trace (`chmod 444`).

**Cas d'usage CU-3 : Rejouer un test archétypal pour tester le harness.**
1. Sélectionner une trace du Golden Record (rejouabilité).
2. Relancer le harness sur le même `run_id` archivé.
3. Comparer le verdict de la nouvelle trace à l'archive (modulo variance LLM documentée par `judge_fingerprint` ; bit-identique n'est pas garanti pour les LLMs à T=0, cf. ENF-1).

### §4.2 — Persona #2 : Mémoire du projet (service Mnemolite MCP)

**Rôle.** Système d'archivage queryable, pas un humain. **Consommateur secondaire** au sens `VISION §3`.

**Attributs.**
- **Service** : MCP live à `http://localhost:8002/mcp` (29 outils, source `/home/giak/Work/MnemoLite/`), cf. PFD D7.
- **API primaire utilisée** : `mcp_mnemolite_write_memory` (archivage), `mcp_mnemolite_search_memory` (récupération).
- **Taxonomie tags** : héritage V9-V15 (`sys:core / sys:anchor / sys:pattern / sys:history / trace:fresh`) + tags Phase 1 (`q:Q1..Q7`, `model:<id>`, `judge:<id>`, `phase:1`, `kind:judge_run|golden_cell`).

**Cas d'usage CU-4 : Archiver une trace de cellule.**
1. Le harness (CU-1 étape 3) appelle `mcp_mnemolite_write_memory` avec le payload `{title, content, memory_type:"judge_run", tags:[...]}` (mapping SPEC v18.1 §3.3).
2. La trace est horodatée et taguée.
3. Récupération future possible par `mcp_mnemolite_search_memory(query="kind:golden_cell AND q:Q1", tags=["kind:golden_cell","q:Q1"])`.

**Cas d'usage CU-5 : Auditer un verdict a posteriori.**
1. `mcp_mnemolite_search_memory(query="q:Q1 AND verdict:ARTEFACT", tags=["kind:golden_cell"])`.
2. Récupérer la cellule complète (prompt + réponse + verdict + metadata).
3. Vérifier que le verdict est re-dérivable depuis les conditions archivées (cf. VISION §7 « gouvernance des données archivées »).

### §4.3 — Persona #3 : Auditeur externe ponctuel

**Rôle.** Regard extérieur sollicité pour limiter l'auto-biais de l'opérateur unique (cf. VISION §9-g, mitigation « revue des protocoles par un regard extérieur quand c'est possible »). **Pas un employé ni un contractant** — une personne de confiance acceptant de relire les protocoles sans participer à l'exécution.

**Attributs.**
- **Indépendance** : aucun intérêt à valider les hypothèses Expanse.
- **Compétence** : compréhension LLM/statistiques/expérimentation, mais pas nécessairement connaissance intime d'Expanse.
- **Charge** : sollicité ponctuellement (1-2 fois par mois max), pas en continu.

**Cas d'usage CU-6 : Review forensique d'un protocole.**
1. L'opérateur fournit le PRD + SPEC + un échantillon de traces archivées.
2. L'auditeur produit un rapport d'audit antagoniste (forensic style) sur la cohérence protocole/verdict.
3. Le rapport est archivé comme `kind:audit_report` dans Mnemolite.

### §4.4 — Personas explicitement hors-périmètre

- **Client externe payant** : VISION §3 « pas de client externe à ce stade ».
- **Utilisateur final non-technique** : l'interface Bash est non-éthique pour un non-technicien ; intentionnel.
- **Chercheur académique publicateur** : VISION §7 « pas une publication académique ».

---

## §5 — Exigences fonctionnelles

> **Note d'adaptation.** Dans un framework de recherche, les « exigences fonctionnelles » ne décrivent pas des features UI mais des **capacités de mesure** que le harness doit fournir. Chaque exigence est formulée de manière testable (critère d'acceptation intégré).

### §5.1 — Exigences sur la définition de test

- **EF-1. Granularité stricte.** Le framework doit permettre de tester **une brique isolée** (un symbole, un marqueur, un style, un mode d'incarnation) à la fois. Aucun test « bundle » combinant plusieurs briques n'est autorisé (cf. VISION §6 « granulaire »). *Test :* un test de granularité correcte est-il exécutable en isolation sur n'importe laquelle des 7 questions Q1-Q7 ?

  **Corollaire Anti-TE (v1.1, post-audit antagoniste profond #4 vs `truth-engine v2`)** : aucun test ne doit inclure le contexte narratif externe, les définitions croisées (clusters) ou les glossaires in-prompt associés au symbole testé. L'atome doit être la **seule variable modifiée** entre le prompt A et le prompt B. *Justification :* le framework opérationnel `truth-engine v2` montre qu'un symbole (ex. Ξ, ⚔, €) déclenche un comportement différent de l'atome nu **parce qu'il invoque un contexte massif** (1500 lignes : SYMBOLS + PATTERNS + THREATS + clusters + protocole 20 étapes). Importer ce pattern violerait EF-1 : Expanse Phase 1 cherche l'effet *minimal* d'un atome, pas l'effet d'une matrice contextuelle résonante. *Test additionnel :* aucune des conditions (prompt A / B / C neutre) ne doit contenir de référence aux autres symboles du système testé.

- **EF-2. Format canonique de définition de test.** Le framework doit accepter un fichier de définition conforme à `PFD D6` : `{id, model, metric, prompts: [prompt_A, prompt_B, prompt_neutral], question}`. Le tableau `prompts` inclut obligatoirement **3 entrées** : Prompt A déployé, Prompt B dense-symbolique, Prompt C témoin neutre (cf. VISION §7 « Pas d'atomes sémantiques sans condition témoin neutre »). *Test :* un test avec 2 prompts au lieu de 3 doit être rejeté avec message d'erreur explicite.

- **EF-3. Reproductibilité par empreinte matérielle.** Le framework doit archiver, pour chaque exécution, l'empreinte `sha256` des poids du modèle (`ollama show --modelfile` + manifest Mistral/Llama), le comptage de tokens local par tokenizer, la durée de session et le timestamp UTC (cf. PFD §7). *Test :* un re-run sur la même empreinte (poids + graine + prompt) retombe-t-il sur un **verdict identique** (modulo variance LLM documentée par `judge_fingerprint`) ? Bit-identique n'est pas garanti pour les LLMs (variance non-nulle à T=0) ; c'est la **re-dérivabilité du verdict** qui est testée, pas l'égalité byte-pour-byte.

### §5.2 — Exigences sur l'exécution

- **EF-4. Session LLM vierge obligatoire.** Chaque test doit s'exécuter dans une **session Ollama vierge** (pas de contamination inter-tests, cf. VISION §6 « aveugle »). *Test :* deux tests successifs partagent-ils un état de contexte ? (réponse attendue : non).

- **EF-5. Déterminisme forcé par appel.** Chaque appel à un modèle candidat ou au juge doit utiliser `temperature: 0.0`, `seed` fixé (différent par run pour la triplication, identique pour reproduction), `num_predict` plafonné (cf. SPEC v18.1 §5.1). *Test :* un même prompt exécuté 2x avec mêmes paramètres produit-il la même réponse (modulo variance LLM) ?

- **EF-6. Multi-substrat strict.** Le framework doit exécuter chaque test sur **≥ 2 modèles de familles architecturales distinctes** (ex. un dérivé Llama + un dérivé Mistral, cf. PFD H4). Un test exécuté sur un seul modèle est invalidé par construction (non-conforme à VISION §6 « multi-substrat »). *Test :* une exécution mono-modèle déclenche-t-elle un warning bloquant ?

- **EF-7. Triplication du juge.** Pour Q2 et Q5, le framework doit appeler le juge **3 fois** sur la même réponse candidate avec 3 graines distinctes (42, 43, 44) et conserver la **médiane par dimension** (cf. SPEC v18.1 §5.2). Si la variance d'une dimension excède 0.30, la trace est taguée `JUDGE_VARIANCE_FAILURE` et le verdict forcé = `NOISE`. *Test :* une exécution avec graine unique déclenche-t-elle un warning bloquant ?

### §5.3 — Exigences sur la mesure et le verdict

- **EF-8. Verdict graduel 4 niveaux obligatoire.** Aucune formulation intermédiaire (« prometteur », « nuancé », « ça dépend ») n'est autorisée. Le framework doit produire pour chaque cellule un verdict ∈ {`VALIDÉ fort`, `VALIDÉ partiel`, `INVALIDÉ artefact`, `INVALIDÉ bruit`} (cf. PFD D2 + VISION §5). *Test :* une trace avec verdict hors-ensemble est-elle rejetée ?

- **EF-9. Protocole de mesure bicéphale.** L'évaluation sépare strictement **mesure primaire** (script déterministe sur texte figé) et **contrôle anti-artefact** (vérification humain ou juge tiers, cf. VISION §4). Un verdict ne peut pas être `VALIDÉ` sans que les deux phases aient produit un signal positif concordant. *Procédure de vérification* : grep post-coup sur l'ensemble des traces pour tous verdicts `VALIDÉ fort` / `VALIDÉ partiel` ; chacun DOIT avoir une entrée correspondante `kind:anti_artefact_check` dans Mnemolite, datée d'au moins J+1 par rapport à la génération, et signé par un opérateur (humain ou juge D8 avec `judge_confidence ≥ 0.60`, cf. SPEC v18.1 §4).

- **EF-10. Bridge MCP Mnemolite conforme.** Pour les verdicts impliquant le juge D8 (Q2, Q5), le framework doit sérialiser la sortie juge vers le payload exact `{title, content, memory_type:"judge_run", tags:[...]}` avec tags obligatoires `kind:judge_run`, `phase:1`, `q:<q_id>`, `model:<judge_model_id>` (cf. SPEC v18.1 §3.3). *Test :* un payload non-conforme déclenche-t-il une erreur HTTP 400 attendue du service MCP ?

### §5.4 — Exigences sur l'aveugle et la rigueur forensique

- **EF-11. Aveugle dilué obligatoire.** Le framework doit supporter un protocole d'évaluation en aveugle dilué avec **3 dispositions** (cf. PFD §5) : (1) délai J+1 minimum avant lecture ; (2) dilution de la réponse cible dans ≥ 30 distracteurs (sessions d'autres questions ou d'autres modèles) ; (3) scellage post-vote (`chmod 444` sur le fichier de trace, toute modification impose une nouvelle session). *Test :* une lecture le jour J est-elle bloquée par le harness ?

- **EF-12. Masquage consigné des metadata.** Pendant la lecture à l'aveugle, **aucun lien metadata ↔ réponse ne doit être visible** à l'écran de l'opérateur (ni dans le contenu, ni dans le nom de fichier, ni dans le timestamp relatif). *Test :* un dump du terminal de lecture révèle-t-il une corrélation réponse ↔ condition ?

- **EF-13. Smoke-suite de calibration du juge.** Avant toute utilisation du juge en Phase 1 sur données libres, le framework doit exécuter la **smoke-suite 10 réponses** (5 incorrectes + 5 correctes, dont ≥ 2 non-EN dans incorrectes et ≥ 1 dans correctes, cf. SPEC v18.1 §5.4). Le gating est 8/10 minimum ; en dessous, le juge est REJETÉ pour Phase 1. *Test :* un run Phase 1 sans smoke-suite réussi est-il bloqué ?

- **EF-14. Réfutation par audit antagoniste périodique.** Toute modification du prompt système (`prompt_sha256`), des seuils du SPEC v18.1 §4, ou des hypothèses fondationnelles (H1-H4) impose un audit antagoniste ciblé avec rapport archivé (cf. PFD D4). *Test :* un commit modifiant `prompt_sha256` sans rapport d'audit dans Mnemolite est-il détecté ?

---

## §6 — Exigences non fonctionnelles

### §6.1 — Reproductibilité et déterminisme

- **ENF-1. Reproductibilité du verdict (modulo variance LLM documentée).** Une exécution rejouée sur la même empreinte (poids, graine, prompt) doit produire un **verdict identique** (modulo variance LLM documentée par `judge_fingerprint.seed` / `temperature` et le taux de `JUDGE_VARIANCE_FAILURE`, cf. SPEC v18.1 §5.2). **Bit-identique n'est pas garanti** pour les LLMs (variance non-nulle à T=0 dans la pratique) ; c'est la **re-dérivabilité du verdict** qui est testée, pas l'égalité byte-pour-byte. Justification : le verdict doit être re-dérivable depuis les conditions archivées (VISION §7 « gouvernance »). Cohérent avec EF-3.

- **ENF-2. Graine fixée et tracée.** Chaque exécution de modèle candidat ou de juge utilise une graine explicite, tracée dans `judge_fingerprint.seed` ou équivalent candidat, ET archivée dans Mnemolite. Aucune graine « par défaut » non-documentée (cf. SPEC v18.1 §5.1).

- **ENF-3. Empreinte `sha256` des poids obligatoire.** Le `modelfile` Ollama doit être hashé à chaque exécution (commande `ollama show --modelfile <model>`). Tout mismatch avec l'empreinte archivée déclenche un warning bloquant (cf. PFD §6 R3 mitigation).

### §6.2 — Auditabilité et traçabilité

- **ENF-4. Traces inaltérables post-scellage.** Une fois le verdict `PFD §5` acté et la trace scellée (`chmod 444`), toute modification impose une nouvelle session. Le framework doit refuser en écriture un fichier de trace scellé.

- **ENF-5. Re-dérivabilité du verdict.** Toute cellule archivée doit permettre, depuis ses seules conditions archivées (prompt + modèle + graine + timestamp), de **rejouer l'exécution et retomber sur le même verdict** (aux tolerances variance près). Pas de verdict « one-shot » non-rejouable.

- **ENF-6. Auditabilité par hash chaîné.** Les traces doivent inclure un `previous_run_sha256` (chaînage) pour détecter toute insertion ou réordonnancement a posteriori (cf. VISION §7 « verdicts re-dérivables »). YAGNI explicite : ce chaînage n'est requis qu'à partir de la 2ème itération de la Phase 1.

- **ENF-7. Logs de session horodatés.** Chaque session doit produire un log structuré (JSON-lines) avec : timestamp UTC, modèle, prompt_id, run_id, durée, code de sortie, tags. Format canonique : `logs/session-YYYYMMDD-HHMMSS.jsonl` (cf. SPEC v18.1 §3 pour les traces juge).

### §6.3 — Sécurité et isolation

- **ENF-8. Zéro cloud, zéro API payante.** Aucune dépendance réseau externe à un service payant ou à un cloud non-local. Justification : VISION §7 « pas d'API distante payante » + PFD §5 « zéro coût cloud / API payante ».

- **ENF-9. Pas de fine-tuning.** Les poids des modèles testés sont **gelés**. Aucune modification des poids n'est permise pendant ou après les tests. Justification : VISION §7 + PFD §5 « pas de fine-tuning ».

- **ENF-10. Isolation par session vierge Ollama.** Aucune contamination inter-tests via contexte LLM. Justification : VISION §6 « session indépendante ». *Test :* un prompt « Quel est ton nom ? » exécuté après un test de Q1 ne doit pas voir de fuite du prompt Q1.

### §6.4 — Localisation et frugalité

- **ENF-11. Stack figé.** Outillage restreint à **Bash + JSON + jq + grep + curl + Ollama** + service Mnemolite MCP local. Aucun Python, PyTorch, HuggingFace dans le harness (cf. PFD D1). Justification : YAGNI strict, KISS.

- **ENF-12. Zéro dépendance GUI.** Pas d'interface graphique, pas de serveur web, pas d'API HTTP exposée (sauf API locale Mnemolite déjà en place). Interface = Bash CLI. Justification : VISION §7 « pas une implémentation » + minimisation de la surface d'attaque.

- **ENF-13. Empreinte disque minimale.** Les traces doivent être compactes (cible : ≤ 1 MB par cellule, ≤ 100 MB par session de 30 répétitions). Compression gzip optionnelle pour archivage long-terme.

### §6.5 — Standards et formats

- **ENF-14. JSON strict (pas de YAML/Markdown mélangé dans les payloads).** Toute trace est du JSON natif strict, validable par `jq -e .` sans erreur (cf. PFD D1 + SPEC v18.1 §3.2).

- **ENF-15. Tags Mnemolite canoniques.** Tags obligatoires pour Golden Record : `kind:golden_cell`, `phase:1`, `q:<Q1..Q7>`, `model:<id>`. Tags conditionnels : `lang:<iso>`, `parse_status:<X>`, `variance_high:true`. Cf. SPEC v18.1 §3.3 + PFD D7.

- **ENF-16. Documentation monolingue (FR interne, EN pour SPEC technique).** Les docs de cadrage (VISION, PFD, PRD) sont en français. Le prompt système du juge est en anglais (cf. SPEC v18.1 §2). Justification : homogénéité interne francophone + stabilité du juge face à la langue maternelle.

---

## §7 — Hors périmètre (Out-of-Scope)

### §7.1 — Phase 2 : implémentation du méta-langage

**Explicitement exclu de Phase 1.** Cf. `doc/VISION.md §7` (« pas une implémentation du méta-langage Expanse ») + `PFD D5` (séparation dure entre recherche et implémentation). Aucune ligne de code définissant un symbole, une heuristique ou un marqueur Expanse avant que la bascule Phase 2 ne soit **explicitement décidée** (≥ 3 briques `VALIDÉ fort`, cf. VISION §8).

### §7.2 — API distante payante ou cloud non-local

**Exclu.** Cf. PFD §5 + ENF-8. Aucun OpenAI API, Anthropic API, Cohere, Together.ai, etc. Ollama local est la **seule** source d'inférence.

### §7.3 — Fine-tuning ou modification de poids

**Exclu.** Cf. ENF-9. Les poids des modèles testés sont gelés. Aucune exception, y compris pour des raisons de « calibration ».

### §7.4 — Publication académique ou benchmark public

**Exclu.** Cf. VISION §7. Les résultats sont strictement internes. Aucune publication sur arXiv, blog public, benchmark partagé, leaderboard.

### §7.5 — Interface graphique ou webapp

**Exclu.** Cf. ENF-12. L'interface reste Bash CLI. Aucune UI desktop, aucune webapp (au-delà de GitHub Pages pour expanse-cortex, qui est hors-PRD).

### §7.6 — Extension à d'autres familles LLM sans ré-audit

**Exclu sans ré-audit.** Ajouter une 3ème famille architecturale (ex. Qwen, Phi, Gemma) impose une révision des hypothèses H4 (multi-substrat), de la spec D8 (compatibilité juge) et un audit antagoniste des nouveaux artefacts tokenizer.

### §7.7 — Validation humaine sur d'autres questions

**Exclu sans extension du PRD.** L'opérateur unique ne peut pas, structurellement, lire à l'aveugle plus de 30 réponses par session sans violer R1 (fatigue). Étendre le périmètre à des questions non listées dans VISION §2 impose une révision de ce PRD.

### §7.8 — Correction automatique de bugs dans le harness

**Exclu comme livrable.** Les bugs du harness sont documentés et patchés en mode « opportunistic fix » (cf. PFD §6 R3), mais aucun SLA de correction n'est promis. La robustesse est testée par les smoke-suites, pas garantie par design.

### §7.9 — Support OS non-Linux (Windows / macOS)

**Exclu.** Le stack imposé (`Bash` + `jq` + `curl` + `Ollama` + service Mnemolite MCP local, cf. PFD D1 + ENF-11) est conçu et testé pour **Linux** (Debian/Ubuntu). Aucun support garanti pour Windows (PowerShell ≠ Bash) ni macOS (chemins `/home/giak/...`, dépendances Ollama, hooks `chmod`). Toute exécution sur un autre OS exige un portage validé hors-PRD.

---

## §8 — Critères d'acceptation

> **Note.** Les critères d'acceptation Phase 1 sont de **deux ordres** : (a) critères d'**infrastructure** — le framework est-il conforme à ses propres exigences ? ; (b) critères de **résultat scientifique** — la Phase 1 a-t-elle produit un Golden Record défendable ? Les deux doivent être satisfaits pour considérer la Phase 1 comme terminée.

### §8.1 — Critères d'acceptation infrastructure (CA-I)

| # | Critère | Référence | Comment mesurer |
|---|---|---|---|
| **CA-I-1** | Le harness `run_test.sh` est livré et exécutable de bout en bout (définition de test → exécution → verdict → archive Mnemolite) | PFD §3 livrable 2 | `bash run_test.sh <test.json>` retourne code 0, trace dans Mnemolite |
| **CA-I-2** | Le schéma JSON de définition de test est validé par `jq -e .` pour 100% des tests lancés | EF-2, EF-14 | Toute trace invalide = erreur explicite |
| **CA-I-3** | La smoke-suite de calibration du juge passe avec ≥ 8/10 | EF-13, SPEC v18.1 §5.4 | Test gating automatique avant tout run Q2/Q5 |
| **CA-I-4** | Le bridge MCP Mnemolite est conforme au mapping `{title, content, memory_type, tags}` | EF-10, SPEC v18.1 §3.3 | Test unitaire sur payload + tags obligatoires |
| **CA-I-5** | L'aveugle dilué (J+1, dilution 30+, scellage) est imposé par le harness, pas laissé à la discipline de l'opérateur | EF-11, EF-12, PFD §5 | Lecture J+0 bloquée, dilution vérifiable post-coup |
| **CA-I-6** | La triplication du juge (graines 42/43/44) est effective, variance < 0.30 sur 95% des cellules | EF-7, SPEC v18.1 §5.2 | Métrique agrégée sur batch de 50 runs |
| **CA-I-7** | Le verdict graduel 4 niveaux est appliqué strictement, 0 verdict intermédiaire (« prometteur », « nuancé ») trouvé dans les traces | EF-8, PFD D2 | Audit grep sur l'ensemble des traces |
| **CA-I-8** | Les 14 exigences fonctionnelles EF-1 à EF-14 ont chacune un test implémenté | §5 | Matrice de couverture test ↔ exigence |
| **CA-I-9** | Les 16 exigences non fonctionnelles ENF-1 à ENF-16 sont vérifiables par procédure documentée | §6 | Procédure de vérification documentée pour chaque ENF |

### §8.2 — Critères d'acceptation résultat scientifique (CA-S)

Conformément à `doc/PFD.md §7` (Golden Record) :

| # | Critère | Référence | Seuil |
|---|---|---|---|
| **CA-S-1** | Nombre de mesures par cellule | PFD §7 | **n ≥ 30** (minimum statistique pour p-value) |
| **CA-S-2** | Nombre de modèles testés par question | PFD §7 + H4 | **≥ 2 modèles de familles architecturales distinctes** |
| **CA-S-3** | Nombre de questions couvertes | PFD §7 | **≥ 5 questions distinctes** sur les 7 (Q1-Q7) |
| **CA-S-4** | Domaines sémantiques couverts | PFD §7 + PFD §4 H5 (v6) | **≥ 2 domaines neutres n'impliquant ni éthique ni sécurité** (ex. : logique formelle, tri algorithmique, parsing de structures triviales). Les thèses géopolitiques, les sujets sensibles RLHF (politique, guerre, minorités, opinion morale) et les domaines chargés symboliquement sont **interdits en Phase 1**. |
| **CA-S-5** | Conditions par cellule | PFD §7 | **3 obligatoires** : Prompt A déployé + Prompt B dense-symbolique + Prompt C témoin neutre |
| **CA-S-6** | Significativité statistique par cellule | PFD §7 | **p-value < 0.05** + IC 95% reporté |
| **CA-S-7** | Empreinte matérielle archivée | PFD §7 | `sha256` des poids + comptage tokens + durée + timestamp UTC pour 100% des cellules |
| **CA-S-8** | Couverture des questions prioritaires | VISION §2 | **Q1 + Q2 + Q5** (priorité haute) testées avant toute conclusion Phase 1 |
| **CA-S-9** | Taux de cellules INVALIDÉ artefact | PFD §2 | ≤ 20% *(heuristique v0.1 — seuil à re-calibrer après les 100 premières cellules archivées, cf. §9.4 R-PRD-1 ; si dépassé : le protocole est suspect, audit antagoniste requis)* |
| **CA-S-10** | Bascule Phase 2 (ou arrêt) | VISION §8 | ≥ 3 briques `VALIDÉ fort` cohérentes OU réfutation centrale documentée |

### §8.3 — Critère d'acceptation global (CA-G)

> La Phase 1 est considérée **terminée avec succès** si et seulement si :
> 1. **100% des CA-I-1 à CA-I-9** sont satisfaits (infrastructure conforme).
> 2. **100% des CA-S-1 à CA-S-10** sont satisfaits (Golden Record défendable).
> 3. **Aucune déviation non-archivée** des hypothèses H1-H4, des décisions D1-D8, des risques R1-R3, ou des exigences VISION §6 n'a été introduite sans audit antagoniste documenté.
>
> **Sans p-value significative**, l'infrastructure est jugée non-fiée et Phase 1 n'est pas considérée comme terminée (le critère « le script a tourné sans crasher » est insuffisant — cf. PFD §7).

---

## §9 — Risques et dépendances

### §9.1 — Dépendances techniques (bloquantes)

| Dépendance | Criticité | Mitigation | Référence |
|---|---|---|---|
| **Service Mnemolite MCP** (`http://localhost:8002/mcp`) | Bloquante — sans lui, aucune archive possible | Path `/home/giak/Work/MnemoLite/` documenté ; à re-vérifier si migration de machine | PFD D7, §6 R3 |
| **Ollama local avec ≥ 2 modèles de familles distinctes** | Bloquante — sans multi-substrat, multi-modèles impossible | Vérifier en boot que ≥ 2 modèles disponibles (Llama + Mistral ou équivalents) | PFD H4, EF-6 |
| **Juge LLM tiers local** (Mistral-7B Q4_K_M ou Q8/fp16 selon VRAM) | Bloquante pour Q2/Q5 | Calibration par smoke-suite (EF-13) avant usage | SPEC v18.1 |
| **VRAM suffisante** pour Q8/fp16 si tests token-level Q1 | Conditionnelle — Q4 acceptable pour la plupart, mais Q1 caractère-raré peut nécessiter Q8+ | Fallback Q4 documenté avec warning de précision réduite | PFD H1, ENF-8 |
| **Bash + jq + curl + grep** sur la machine opérateur | Bloquante — stack figé | Documenter la version dans `tools/manifest.txt` | PFD D1, ENF-11 |
| **1 opérateur humain** (giak) | Single point of failure | Pauses forcées, plafond 1 session/jour, audits externes ponctuels | PFD §6 R1, Persona #3 |

### §9.2 — Dépendances méthodologiques (mitigées)

- **Aveugle dilué opérationnel** (J+1, dilution, scellage) : dépend de la discipline de l'opérateur — mitigation = ENF-5 et Persona #1 CU-2.
- **Audit antagoniste périodique** : dépend de la disponibilité d'un auditeur externe — mitigation = CU-6 + fréquence 1-2 fois/mois.
- **Calibration du juge** (smoke-suite) : doit être re-exécutée à chaque changement de modèle juge ou de prompt — mitigation = ENF-3 + EF-13.

### §9.3 — Risques hérités (cross-référencés)

Les risques méthodologiques sont déjà documentés ailleurs. Ce PRD **ne les redéploie pas** ; il les référence opérationnellement :

- **Risques VISION §9 (a-g)** : effets combinés de bagage symbolique et de variance de tokenisation, pénalité RLHF, effet de format reconnaissable, faiblesse non-étayée de Q5, robustesse de la mesure multi-substrats, collision de nomenclature, auto-biais de l'investigateur → voir `doc/VISION.md §9` pour définitions + mitigations.
- **Risques PFD §6 (R1-R3)** : fatigue du porteur, drift de scope, fragilité des scripts → voir `doc/PFD.md §6` pour définitions + mitigations.

### §9.4 — Risques PRD-spécifiques (non couverts par VISION/PFD)

- **R-PRD-1. Biais d'instrumentation par excès de rigueur.** Le harnais peut devenir si procédural qu'il **fossilise** le design expérimental, empêchant la sérendipité ou l'adaptation à un artefact inattendu. *Mitigation* : prévoir une clause de **mutation documentée** : tout écart au PRD est consigné dans une section « déviations » de la trace, avec justification, et fait l'objet d'un audit périodique (sans invalidation rétroactive).

- **R-PRD-2. Inflation documentaire.** Plus de docs (VISION, PFD, SPEC, PRD) = plus de risque d'incohérence cross-doc. *Mitigation* : à chaque modification d'un des 4 docs, vérifier que les 3 autres restent cohérents (cross-references vivants). Le présent PRD est volontairement court (≤ 350 lignes) pour ne pas alourdir.

- **R-PRD-3. Surcharge cognitive de l'opérateur.** Le PRD ajoute des exigences (CA-I, CA-S) qui peuvent décourager l'exécution par effet de liste-de-trop. *Mitigation* : ne pas viser la perfection infra avant le premier test — le critère « script a tourné » est un **préalable**, pas un objectif. Cf. PFD §7 sur l'équilibre entre rigueur et progression.

- **R-PRD-4. Verrouillage de format.** Le format de test `PFD D6` est imposé comme canonique. Si une question Q (ex. Q3 format contraignant) ne s'y conforme pas naturellement, on risque de la tordre pour la faire entrer dans le format. *Mitigation* : la clause « format canonique » est **extensible** (PFD D6 le prévoit explicitement : « Extensible si besoin, minimal au démarrage »). Toute extension est tracée.

---

*PRD rédigé le 4 juillet 2026 (v1) — formalise les exigences produit d'Expanse Phase 1, **descend d'un niveau** par rapport à VISION (direction) et PFD (cadrage). Pour toute question de fond non couverte ici, se référer à `doc/VISION.md` (9 sections) ou `doc/PFD.md` (8 sections). Pour la spécification opérationnelle du juge D8, voir `doc/01-specs/2026-07-04_v18_SPEC_juge-semantique-d8_ACTIVE.md`. Le PRD ne couvre pas la Phase 2 (implémentation méta-langage) — out-of-scope explicite cf. §7.1.*

*Sections propres au PRD : §2.2-§2.4 (problèmes utilisateur interne, pas de client externe), §4 personas (opérateur + Mnemolite + auditeur), §5 exigences fonctionnelles adaptées au framework (EF-1 à EF-14), §8 critères d'acceptation split infrastructure/résultat (CA-I + CA-S), §9.4 risques PRD-spécifiques (R-PRD-1 à R-PRD-4).*
