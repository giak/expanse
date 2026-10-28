---
type: AUDIT
version: v18
status: DRAFT
title: "Point de situation — Expanse, trois régimes dans un dépôt"
question: "Dans quel état est le projet Expanse, et quelle action produit le plus de valeur maintenant ?"
created: 2026-10-28
scope: "dépôt complet, cutoff 2026-10-28"
depth: standard
auditor: "Buffy (Codebuff) — revue non indépendante"
evidence_cutoff: 2026-10-28
---

# RETEX / audit de projet — Expanse

**Date :** 2026-10-28
**Périmètre :** le dépôt entier (docs, runtime, skills, scripts, `expanse-cortex`, `expanse-lab`, archive), état au 2026-10-28.
**Profondeur :** standard — reconstruction, motifs récurrents, options comparées ; pas de revue indépendante par un tiers.
**Décision attendue :** que faire ensuite, sachant que la Phase 1 est spécifiée mais n'a jamais produit une seule mesure.

## Synthèse

- **Recommandation principale :** sauver le travail local (A-01), puis construire un **pilote instrumental minimal** et l'exécuter (A-02) avant d'écrire une ligne de doctrine supplémentaire. Le pilote doit rester explicitement hors Golden Record tant que le design statistique n'est pas amendé (A-03).
- **Constats prioritaires :**
  - **F-06 (P0)** — 35 commits et 9 fichiers V18 existent uniquement en local ; le dernier commit date du 2026-07-04.
  - **F-02 (P1)** — Phase 1 sans instrument : 0 cellule Golden Record mesurée, aucun `run_test.sh`, aucun schéma de test.
  - **F-03 (P1)** — la barre statistique (`n ≥ 30`, `p < 0.05`) n'est ni testée, ni corrigée pour comparaisons multiples, ni compatible avec un générateur déterministe ; elle peut fabriquer un faux positif « rigoureux ».
  - **F-01 (P1)** — trois régimes coexistent : KERNEL (incarnation), V18 (falsification empirique), cortex (application React). Aucun n'est déclaré prioritaire.
  - **F-05 (P1)** — la gouvernance documentaire n'est pas appliquée : 5 docs actifs hors arborescence, 5 sous-dossiers vides, points d'entrée contradictoires.
- **À préserver :** le noyau méthodologique (verdict à 4 niveaux, condition témoin neutre, aveugle dilué, contrôle anti-artefact), l'audit #4 (le succès de `truth-engine` est une résonance contextuelle, pas un effet du symbole), et la discipline de test du cortex (410 tests verts).
- **Confiance globale :** moyenne-haute — les faits de structure et d'état sont mesurés ici ; l'interprétation causale reste une hypothèse.
- **Prochain contrôle :** après A-02, un run de 60 générations reproductible, avec temps par cellule et taux d'échec de parsing mesurés.

## Périmètre, méthode et limites

- **Question de revue :** dans quel état est le projet, et quelle action produit le plus de valeur maintenant ?
- **Inclus :** `AGENTS.md`, `KERNEL.md`, `README.md`, les 4 docs actifs V18 (VISION, PFD, PRD, SPEC), `INDEX_V17/V18`, les 4 audits de `doc/05-audits/`, les specs/tests actifs, `runtime/`, `skills/`, `scripts/`, `expanse-cortex/` (code + tests), `expanse-lab/`, l'état Git et les services locaux dont le protocole dépend (Mnemolite, Ollama).
- **Exclus :** les 55 295 lignes de `doc/_legacy/` (échantillonnées via l'index seulement), les 19 429 lignes de `archive/`, le contenu des `node_modules`, le site GitHub Pages déployé (non ouvert), le protocole MCP (`localhost:8002`) au-delà de sa joignabilité HTTP.
- **Sources consultées :** E-01 à E-18 du registre.
- **Sources indisponibles ou non inspectées :** l'historique complet des conversations qui ont produit les docs ; le service MCP exercé outil par outil ; les résultats e2e Playwright ; la version réellement servie par GitHub Pages.
- **Échelle des jugements :** *matériel* = change une décision, une garantie ou la lisibilité d'un point d'entrée ; **P0** = perte de travail possible ou succès présenté comme acquis sans preuve ; **P1** = objectif du projet bloqué ou coût récurrent mesurable ; **P2** = friction ou hygiène. *Confiance haute* = mesure refaite dans cet audit ; *moyenne* = mesure partielle, ou texte normatif seul ; *basse* = hypothèse non testée.
- **Hypothèses de cadrage :** le dépôt local est la source de vérité (le remote est en retard de 35 commits) ; `doc/VISION.md` v18 exprime l'intention courante, `KERNEL.md` la pratique historique ; la machine de l'opérateur est l'environnement cible.
- **Limite d'indépendance :** cet audit est produit par un agent, sans regard extérieur. L'audit #4 qu'il cite a été produit par la même famille de modèle (`GLM-5.2 via Codebuff`). Les deux ne constituent donc pas une validation indépendante.

## Reconstruction du travail

| Tâche ou séquence | Intention / attendu | Changement ou décision | Vérification observée | Résultat / écart |
|---|---|---|---|---|
| **T-01** Runtime V17 (2026-07-02) | Un « cerveau » opérationnel : protocole Ψ, anti-hallucination, Mnemolite | 3 fichiers, 86 lignes, dans `runtime/` | `find runtime` ; 86 lignes au total (E-02) | Protocole présent, mais **non branché** sur `AGENTS.md` ; `doc/memories/` exigé par ce protocole n'existe pas |
| **T-02** Purification + arborescence (2026-07-03) | Rendre le dépôt lisible : 9 sous-dossiers, legacy isolé | 330 fichiers déplacés vers `doc/_legacy/` ; 9 dossiers créés | 330/369 fichiers en legacy ; 5 sous-dossiers ne contiennent qu'un README (E-02, E-04) | Arborescence posée, **non peuplée** ; les docs actifs restent à la racine de `doc/` |
| **T-03** Pivot V18 (2026-07-03/04) | Remplacer l'incarnation par un cadre de validation empirique | VISION v18, PFD v6, PRD v1.1, SPEC v18.1, audit #4 | 989 lignes de noyau ; `p-value` et `n≥30` spécifiés ; 0 test exécutable (E-05 à E-10) | Pivot documentaire **complet**, exécution **absente** ; travail non commité |
| **T-04** `expanse-cortex` | Visualiser / incarner le signal ΣΨΦΩΜ | App React 19 + Vite + Tailwind, runtime MCP, 277 fichiers hors dépendances | `pnpm test` : 27 fichiers, **410 tests verts** en 3,17 s (E-14) | Application la plus **ingénierisée** du dépôt ; pourtant exclue du PRD §7.5 |
| **T-05** Exécution Phase 1 | Premier test Q1, puis Golden Record | Aucun `run_test.sh`, aucun schéma, aucune fixture | `ls run_test.sh tests harness` : absents ; recherche Mnemolite `kind:golden_cell` : **0 résultat** (E-11, E-12) | **Aucune mesure produite** depuis le 2026-07-04 |

## Apprentissages et pratiques à préserver

- **Le protocole de falsification est le meilleur actif du projet.** Verdict à 4 niveaux (VISION §5), condition témoin neutre (PFD D6), aveugle dilué J+1 + 30 distracteurs + scellage (PFD §5), contrôle anti-artefact séparé (PRD EF-9) : rarement un projet personnel définit aussi précisément ce qui le réfuterait.
- **L'audit #4 est une pièce de raisonnement de valeur.** Il nomme le mécanisme réel de `truth-engine` — une matrice contextuelle résonante, pas un atome causal — et en tire un refus d'importation. C'est exactement le type de contre-evidence qu'un projet d'incarnation doit produire sur lui-même.
- **La discipline de test du cortex est saine.** 410 tests, 27 fichiers, 3,17 s, tous verts, sans mock massif apparent : c'est la seule partie du dépôt qui prouve son état par exécution.
- **L'hygiène des liens est bonne.** Le vérificateur ne trouve qu'une référence cassée, dans un plan legacy (E-15) — mais son jeu de motifs est étroit, donc ce résultat ne vaut pas validation globale.
- **Le projet sait écrire ses propres limites.** R-PRD-1 (« fossilisation par excès de rigueur »), R-PRD-3 (« surcharge cognitive »), H1 (quantification), §9-g (auto-biais) : les risques sont nommés avant d'être subis.

## Constats prioritaires

### [F-01] Trois régimes normatifs coexistent sans hiérarchie

- **Catégorie / priorité :** risque structurel ; P1.
- **Observation :** le dépôt porte trois systèmes de règles incompatibles sur ce qu'est le projet. `KERNEL.md` §XII impose « JE SUIS EXPANSE », la « tolérance zéro à la simulation » et un premier token Ψ ; `doc/VISION.md` §2 traite l'incarnation comme l'hypothèse **la plus fragile** (Q5) et prévoit que son invalidation oblige à réviser « une large part des hypothèses ontologiques » ; `doc/PRD.md` §7.5 exclut toute interface graphique, tandis que `expanse-cortex` est une application React déployée. `README.md` renvoie à `INDEX_V17` et au runtime V17, alors que `INDEX_V18` se déclare point d'entrée.
- **Preuves :** E-05 (INDEX), E-06 (VISION), E-08 (PRD), E-13 (cortex), E-18 (README, AGENTS, KERNEL).
- **Impact et portée :** un agent ou un lecteur à froid reçoit des ordres contradictoires. Plus grave : chaque résultat peut être réinterprété dans le régime qui le flatte — « validé » au sens empirique, ou « incarnation réussie » au sens KERNEL. C'est un confondant au niveau du projet, pas seulement un défaut de documentation.
- **Cause ou facteurs contributifs :** le pivot V18 a procédé par **addition** (VISION, PFD, PRD, SPEC) sans déclarer KERNEL/runtime « historique ». Hypothèse : le pivot a été vécu comme un approfondissement, pas comme un remplacement.
- **Contre-indices et confiance :** la coexistence est partiellement **intentionnelle** — Q5 garde l'incarnation dans le périmètre de test. Le conflit est normatif (que faire maintenant), pas logique (les deux peuvent être vrais). Confiance haute sur la coexistence, moyenne sur l'impact.

### [F-02] La Phase 1 n'a pas d'instrument et n'a produit aucune mesure

- **Catégorie / priorité :** objectif bloqué ; P1.
- **Observation :** `INDEX_V18` §6 liste 4 dettes (schéma JSON, `run_test.sh`, fixture smoke-suite, pilote Q1) ; aucune n'est livrée. Il n'existe ni `run_test.sh`, ni dossier `tests/`, ni `harness/` à la racine. Une recherche Mnemolite filtrée sur `kind:golden_cell` retourne **0 résultat**. Le dernier commit date du 2026-07-04.
- **Preuves :** E-01 (git), E-09 (INDEX), E-11 (`ls` négatif), E-12 (requête Mnemolite).
- **Impact et portée :** l'objectif déclaré — produire des verdicts empiriques — n'a produit aucune donnée en presque quatre mois. Toute la rigueur est sur papier. Les dépendances, elles, sont disponibles : Mnemolite répond (`/health` 200, PostgreSQL + Redis), Ollama expose 18 modèles de plusieurs familles (E-12, E-13).
- **Cause ou facteurs contributifs :** le pivot a consommé son énergie en documentation et en audits ; le harnais est repoussé à chaque itération ; opérateur unique ; aucun délai (VISION §8).
- **Contre-indices et confiance :** l'absence de deadline est **assumée** (VISION §8), donc la dormance n'est pas une violation. Mais `INDEX_V18` §BOOT.1 affirme « Phase 1 techniquement débloquée » : au sens opérationnel, c'est faux, faute d'instrument. Confiance haute.

### [F-03] La barre statistique est sous-spécifiée et risque de fabriquer un faux positif « rigoureux »

- **Catégorie / priorité :** risque méthodologique ; P1 (P0 dès qu'un Golden Record serait déclaré sans correction).
- **Observation :** PFD §7 exige `n ≥ 30` par cellule et une `p-value < 0.05` ; PRD EF-5 impose `temperature: 0.0` et une graine fixée ; ENF-1 reconnaît qu'un LLM n'est pas bit-identique. Aucun test statistique n'est nommé, aucune correction pour comparaisons multiples n'est prévue (~30 cellules à α = 0,05 ⇒ ~1,5 faux positifs attendus), aucune analyse de puissance ni taille d'effet. La charge se calcule : 5 questions × 2 modèles × 3 conditions × 30 = **900 générations** ; pour Q2/Q5, la triplication du juge ajoute 2 × 2 × 3 × 30 × 3 = **1 080 appels juge**. La lecture aveugle exige ≥ 30 distracteurs par cellule, avec 1 session/jour (PFD R1) et un plafond de 30 lectures par session (PRD §7.7).
- **Preuves :** E-07 (PFD §6-§7), E-08 (PRD EF-5, ENF-1, §7.7, §8.2), E-09 (SPEC §5.2).
- **Impact et portée :** si le protocole est exécuté tel quel, les p-values seront soit **non interprétables** (répétitions déterministes à T=0 : pseudo-réplication), soit **non corrigées** (30 tests). Et le Golden Record complet est probablement hors de portée d'un opérateur unique, ce qui pousse à abandonner ou à abaisser silencieusement les seuils.
- **Cause ou facteurs contributifs :** des seuils statistiques importés comme des critères de qualité, sans design expérimental qui les rende calculables ; pas de revue par un statisticien ; processus doc-first.
- **Contre-indices et confiance :** EF-5 prévoit des graines « différentes par run pour la triplication », ce qui créerait un échantillonnage si la politique de graines était spécifiée — elle ne l'est pas. La tension est donc **non résolue**, pas une erreur prouvée. Confiance haute sur les manques textuels et l'arithmétique, moyenne sur l'infaisabilité réelle (dépend du temps par génération).

### [F-04] La « rigueur forensique » est auto-notée et non indépendante

- **Catégorie / priorité :** crédibilité méthodologique ; P2.
- **Observation :** l'audit #4 est signé « Buffy (GLM-5.2 via Codebuff) », s'attribue **6,5/10** sans échelle, puis déclare « APPROUVÉ avec 3 modifications appliquées » — modifications rédigées par le même auteur. L'audit #3 n'a **pas de fichier** : il n'existe que comme mention dans un pied de page et dans `INDEX_V18`. Le PRD prévoit pourtant un auditeur externe 1 à 2 fois par mois (persona #3, §9.2) ; aucune trace d'un tel rapport.
- **Preuves :** E-10 (audit #4), E-05 (INDEX §4), E-08 (PRD §4.3, §9.2).
- **Impact et portée :** le mot « forensique » suggère une vérification indépendante que les pièces ne montrent pas. Les scores (3,5 → 7/10, 4 → 9/10, 6,5/10) donnent une impression de mesure sans barème, ce qui est exactement le type de « succès trompeur » que le protocole veut éviter.
- **Cause ou facteurs contributifs :** un seul opérateur, pas d'auditeur externe disponible ; l'IA est utilisée comme juge et comme partie.
- **Contre-indices et confiance :** l'audit #4 contient une analyse de fond correcte et utile (E-10) ; le problème porte sur le statut de la preuve, pas sur la qualité de l'analyse. Confiance haute sur les faits, moyenne sur l'impact.

### [F-05] La gouvernance documentaire est écrite mais non appliquée

- **Catégorie / priorité :** friction récurrente ; P1.
- **Observation :** `AGENTS.md` exige que tout `.md` vive dans l'un des 9 sous-dossiers (ORG.1) et suive `{date}_v{N}_{TYPE}_{SLUG}_{STATUS}.md` (ORG.2). En réalité : 5 docs actifs sont à la racine de `doc/` (`VISION`, `PFD`, `PRD`, `INDEX_V17`, `INDEX_V18`) ; seuls **5 fichiers sur 24** des sous-dossiers actifs respectent ORG.2 ; 5 sous-dossiers ne contiennent qu'un README (et un `.gitkeep`) ; `scripts/check_docs_lifecycle.py`, annoncé par ORG.6, n'existe pas. Le `README.md` racine pointe vers `INDEX_V17` et le runtime V17, pas vers V18.
- **Preuves :** E-04 (comptage ORG.2), E-05, E-07, E-08, E-18 (README, AGENTS).
- **Impact et portée :** un agent à contexte vierge suit le chemin README → INDEX_V17 → runtime V17 et rate le cadre V18. Les incohérences internes s'accumulent : l'en-tête du PFD se décrit « PFD v5 / VISION v17 / PRD v1 » alors que le frontmatter est v6/v18/v1.1 ; le PRD promet « ≤ 350 lignes » et en fait 401 ; PFD §7 cite « factuel, opinion » comme domaines alors que H5 et CA-S-4 interdisent l'opinion morale.
- **Cause ou facteurs contributifs :** les règles ORG ont été écrites après le corpus ; la migration est déclarée « opportuniste », donc les fichiers jamais réédités ne migrent jamais ; les mises à jour de version touchent le frontmatter mais pas les blocs de navigation recopiés.
- **Contre-indices et confiance :** ORG.2 dit explicitement que la migration est opportuniste, donc l'écart n'est pas une violation de la règle de migration ; il reste une violation d'ORG.1 pour les 5 docs racine et une violation d'ORG.2 pour les nouveaux fichiers. Confiance haute (mesures).

### [F-06] Le travail récent n'est ni commité ni sauvegardé à distance

- **Catégorie / priorité :** perte de travail / promesse de déploiement ; **P0**.
- **Observation :** la branche `main` est **35 commits en avance** sur `origin/main`. Neuf fichiers V18 sont non suivis ou modifiés (`INDEX_V18`, `PRD`, `PFD`, `VISION`, 4 tests, audit #4). Le dernier commit date du 2026-07-04. Le workflow GitHub Pages ne se déclenche que sur un push `main` : le site déployé est donc en retard d'au moins 5 commits touchant `expanse-cortex`, alors que son README affiche « ✅ Actif + déployé ».
- **Preuves :** E-01 (`git status`, `git log`), E-13 (workflow + commit cortex), E-16 (README cortex).
- **Impact et portée :** une panne de disque ou un `git clean` détruit le pivot V18 complet. Le site public ne correspond pas au code local. La règle de péremption d'`INDEX_V18` (valide jusqu'au 2026-08-04, audits à rejouer jusqu'au 2026-10-03) est dépassée de 25 jours sans re-validation.
- **Cause ou facteurs contributifs :** travail local accumulé sans point de sauvegarde ; pas de CI sur les docs ; le projet fonctionne en sessions longues et espacées.
- **Contre-indices et confiance :** le dépôt distant existe et rien n'indique une perte déjà survenue ; le risque est prospectif. Confiance haute sur les faits (mesures Git), haute sur le risque.

### [F-07] Résidus et protocoles morts

- **Catégorie / priorité :** hygiène ; P2.
- **Observation :** `runtime/` (3 fichiers, 86 lignes) n'est référencé ni par `AGENTS.md` ni par `INDEX_V18` ; le protocole qu'il contient exige `doc/memories/{date}/{id}.md`, dossier inexistant. `scripts/reconcile_audit.py` migre `doc/audit/` vers `doc/audits/`, deux chemins qui n'existent plus. `expanse-lab/` reste à la racine alors que le README dit que le lab est dans `archive/` (et `archive/lab/` est vide). `INDEX_V18` §BOOT.4 documente l'API REST Mnemolite sur `localhost:8001/rest`, qui répond « Not Found » ; l'API réelle est `/api/v1/...` (le MCP `8002` reste le canal prévu).
- **Preuves :** E-02, E-04, E-12 (OpenAPI + 404), E-17 (`expanse-lab`).
- **Impact et portée :** chaque résidu est un piège pour le prochain agent : il suit une instruction qui ne mène nulle part, ou conclut qu'un service est cassé alors que seul le chemin documenté est faux. Coût faible mais récurrent.
- **Cause ou facteurs contributifs :** migrations successives sans suppression des anciens chemins ; documentation écrite avant vérification de l'API.
- **Contre-indices et confiance :** ces éléments ne bloquent pas la Phase 1 ; le `runtime/` peut être conservé comme archive volontaire. Confiance haute.

## Options comparées

| Option | Mécanisme attendu | Avantages | Inconvénients / risques | Effort, délai, dépendances | Vérification |
|---|---|---|---|---|---|
| **A — Pilote instrumental minimal** | Construire un `run_test.sh` réduit (1 question Q1, 2 modèles, 3 conditions, n = 10), exécuter, mesurer temps/parse/variance ; **ne pas** prononcer de verdict Golden Record | Confronte le protocole au réel ; produit les données qui manquent pour corriger le design ; rend le projet falsifiable en jours, pas en mois | Résultat non statistique, risque d'être surinterprété ; ne teste qu'une question ; demande de coder le harnais | S-M (1-3 jours), dépend d'Ollama + jq ; **aucune** dépendance Mnemolite pour le pilote | 60 générations, code de sortie 0, JSON valide à 100 %, temps par cellule et taux `JUDGE_PARSE_FAILURE` mesurés |
| **B — Gouvernance d'abord** | Un point d'entrée unique, archiver KERNEL/runtime comme « pratique V17 », migrer/renommer les docs racine, corriger les contradictions | Lève F-01 et F-05 ; réduit la confusion pour tout agent ; effort faible | Reproduit le mode d'échec actuel : encore des documents, toujours zéro mesure ; ne teste aucune hypothèse | S (2-4 h), sans dépendance | Test à froid : un lecteur neuf suit README → INDEX_V18 sans rencontrer V17 ; `grep` des versions périmées = 0 |
| **C — Amender le design statistique d'abord** | Spécifier test, politique de graines, correction de multiplicité, taille d'effet, puissance ; réduire cellules ou n ; amender PFD/PRD par audit | Rend le Golden Record interprétable ; évite de coder un harnais pour un design invalide | Reste théorique sans instrument ; peut prolonger indéfiniment la discussion méthodologique ; exige une compétence statistique | M (1-2 j de rédaction + revue), dépend d'un regard externe | Addendum d'une page avec un exemple chiffré et un calcul de puissance (ou simulation) ; revue externe tracée |
| **D — Statu quo** | Continuer à documenter et auditer | Coût nul immédiat ; conserve l'élan documentaire | La Phase 1 reste à 0 mesure ; les audits s'empilent ; le risque de perte locale augmente | Nul | Aucun signal nouveau ; à revoir dans 30 jours |
| **E — Arrêter la recherche, garder la pratique** | Archiver VISION/PFD/PRD/SPEC, conserver KERNEL + cortex comme pratique personnelle et outil de visualisation | Honnête si l'objectif réel est la pratique, pas la preuve ; libère l'opérateur | Renonce à l'ambition empirique ; incompatible avec l'intention déclarée V18 ; peut être prématuré | S (archivage), décision politique | Décision écrite et datée ; plus aucun doc actif ne promet un Golden Record |

## Recommandation

- **Option retenue :** **A**, avec deux garde-fous : A-01 (sauver le travail) avant toute chose, et A-03 (addendum statistique) avant toute promotion du pilote en Golden Record. B est intégré au pilote sous forme de correctif d'entrée de 2 heures, pas comme chantier séparé.
- **Pourquoi elle convient le mieux :** le mode d'échec dominant du projet est **documentaire** : 7 602 lignes actives de docs, 989 lignes de noyau, 0 mesure. Une option qui ajoute des documents (B, C) reproduit ce mode d'échec. Le pilote est la seule action qui produit une information que le projet ne possède pas : le coût réel d'une cellule, la variance réelle des modèles, la qualité réelle du parsing.
- **Compromis et risques résiduels :** le pilote ne répond pas à Q1 et ne prouve rien sur le méta-langage ; il peut être lu comme une validation. Mitigation : l'étiqueter « exploratoire, hors Golden Record » dans chaque trace, et ne publier aucun verdict à 4 niveaux. Le design statistique reste imparfait jusqu'à A-03.
- **Pourquoi l'alternative la plus forte n'est pas retenue :** **C** est intellectuellement la plus solide, mais sans instrument elle ne peut pas être falsifiée : on ne sait pas si `n = 30` coûte 40 minutes ou 40 heures, ni si les répétitions à T = 0 varient. Le pilote fournit précisément ces deux chiffres. Si le pilote montre une variance nulle et un coût prohibitif, C devient la bonne option — et E redevient légitime.
- **Ce qui ferait changer la recommandation :** (a) l'opérateur déclare que l'objectif réel est la pratique KERNEL, pas la preuve → E ; (b) le temps par génération rend 60 générations impossibles en une session → C puis réduction du design ; (c) un auditeur externe compétent en statistique est disponible immédiatement → C avant A.

## Plan d'amélioration

| ID | Constat lié | Action concrète | Priorité | Responsable (rôle) | Effort / dépendances | Critère d'acceptation et vérification |
|---|---|---|---|---|---|---|
| **A-01** | F-06 | Commiter les 9 fichiers V18 (+ la modification `AGENTS.md`) et pousser les 35 commits locaux ; poser un tag de sauvegarde | **P0** | porteur du dépôt | S (30 min), accès au remote | `git status --short` vide ; `git log origin/main..main --oneline` vide ; tag présent sur le remote |
| **A-02** | F-02 | Livrer un harnais minimal : schéma JSON + `run_test.sh` + une définition Q1 ; exécuter 2 modèles × 3 conditions × 10 répétitions ; archiver les traces brutes et les temps | P1 | opérateur + développeur | S-M (1-3 j), Ollama + jq ; **sans** Mnemolite pour ce pilote | 60 générations, code 0, 60 fichiers JSON valides (`jq -e .`), temps par cellule et taux de parse en échec consignés ; étiquette « exploratoire » dans chaque trace |
| **A-03** | F-03 | Addendum statistique : test nommé, politique de graines (n répétitions indépendantes ou variance mesurée), correction de multiplicité, taille d'effet, puissance ; réduire n/cellules si nécessaire | P1 | opérateur + relecteur externe | M (1-2 j), revue externe | Addendum d'une page avec exemple chiffré et calcul de puissance (ou simulation) ; décision signée ; PFD/PRD amendés avec audit |
| **A-04** | F-01, F-05, F-07 | Point d'entrée unique : `README` → `INDEX_V18` ; étiqueter `KERNEL.md` et `runtime/` « pratique V17, hors protocole Phase 1 » ; corriger l'en-tête PFD (v5/v17), PFD §7 (« opinion »), le plafond de lignes du PRD, le chemin REST Mnemolite ; supprimer ou archiver `reconcile_audit.py`, `expanse-lab/`, la règle `doc/memories/` | P1 | mainteneur doc | S (2-4 h), aucune | Test à froid : README → INDEX_V18 sans détour V17 ; `grep` des versions périmées = 0 ; ORG.2 à 100 % **ou** ORG.1 amendé pour autoriser les docs racine |
| **A-05** | F-04 | Déclarer les audits comme auto-revue ; ajouter au gabarit les champs « échelle », « indépendance », « preuves » ; requalifier les scores de l'audit #4 | P2 | opérateur | S (1-2 h), aucune | Gabarit d'audit avec échelle et indépendance ; audit #4 annoté « auto-revue, score non normé » ; plus aucun score sans barème |

## Incertitudes et suite

- **Questions ouvertes :**
  - **Budget de tokens A vs B.** Le design compare « définition déployée » et « atome dense » sans spécifier l'égalisation du budget de tokens entre les conditions. Sans elle, un écart peut être un effet de longueur, pas de compaction. À trancher dans A-03.
  - **Objectif réel de l'opérateur.** Preuve empirique (VISION) ou pratique incarnée (KERNEL) ? La réponse détermine A vs E ; elle n'est pas écrite dans le dépôt.
  - **Latence réelle par génération** sur les 18 modèles disponibles : inconnue, et c'est elle qui décide de la faisabilité de `n = 30`.
- **Preuves à obtenir :** temps par génération sur 2 familles ; variance réelle à T = 0 sur 10 répétitions ; taux de JSON invalide du juge ; état réel du site GitHub Pages.
- **Prochain RETEX ou point de contrôle :** après A-02 (une session de pilote), ou au 2026-11-28 si A-02 n'est pas lancé. Critère de sortie : soit un pilote mesuré, soit une décision écrite d'arrêt (E).

## Registre de preuves

| ID | Source / artefact | Date ou version | Nature | Ce que la source démontre | Limites / accès |
|---|---|---|---|---|---|
| **E-01** | `git status`, `git log`, `git diff --stat` | 2026-10-28 | mesure | `main` à +35 commits de `origin/main` ; 9 fichiers V18 modifiés/non suivis ; dernier commit 2026-07-04 | ne dit rien de l'historique distant au-delà de `origin/main` |
| **E-02** | `find`, `wc -l`, `du` | 2026-10-28 | mesure | `doc/` : 369 fichiers, 354 `.md`, 63 137 lignes ; actif 7 602, legacy 55 295 ; `runtime/` 3 fichiers/86 lignes ; cortex 277 fichiers hors `node_modules` | comptage par `cat` de fichiers texte uniquement |
| **E-03** | `find skills -name SKILL.md` | 2026-10-28 | mesure | 9 compétences, conformément au README | ne juge pas leur qualité |
| **E-04** | boucle `grep -E` sur ORG.2 + `find doc/*/` | 2026-10-28 | mesure | 5/24 fichiers actifs conformes à ORG.2 ; 5 sous-dossiers à README seul | ne couvre pas `_legacy/` (exclu par la règle) |
| **E-05** | `doc/INDEX_V18.md` | v18, 2026-07-04 | document | point d'entrée, dettes §6, péremption §BOOT.5, chemin REST §BOOT.4 | intention et état déclaré, pas une mesure |
| **E-06** | `doc/VISION.md` | v18, 2026-07-04 | document | Q1-Q7, verdict 4 niveaux, exclusions, critères d'arrêt | non relu par un tiers |
| **E-07** | `doc/PFD.md` | v6, frontmatter 2026-07-04 | document | D1-D8, H1-H5, `n ≥ 30`, `p < 0.05`, R1, en-tête resté en v5/v17 | contradiction interne documentée en F-05 |
| **E-08** | `doc/PRD.md` | v1.1, 2026-07-04 | document | 14 EF, 16 ENF, 9 CA-I, 10 CA-S, §7.5 (pas d'UI), §7.7 (30 lectures/session), CA-S-4 | 401 lignes, au-delà du plafond annoncé §9.4 |
| **E-09** | `doc/01-specs/2026-07-04_v18_SPEC_juge-semantique-d8_ACTIVE.md` | v18.1, 2026-07-04 | document | prompt système figé, triplication 42/43/44, smoke-suite 10 réponses | lu jusqu'à §5.4 ; §6 tronquée à la lecture |
| **E-10** | `doc/05-audits/2026-07-04_truth-engine-vs-expanse_AUDIT-04.md` | 2026-07-04 | document | auto-score 6,5/10, 3 modifications appliquées, analyse de la résonance contextuelle | auteur = même famille de modèle que cet audit ; pas de barème |
| **E-11** | `ls run_test.sh tests harness` | 2026-10-28 | mesure | les trois chemins sont absents | absence locale, pas preuve d'absence ailleurs |
| **E-12** | Mnemolite `:8001/health`, OpenAPI, `POST /v1/search/` | 2026-10-28 | mesure | service vivant (PostgreSQL 18.4 + Redis) ; chemins `/rest` absents, OpenAPI expose `/api/v1/...` et `/v1/search/` répond ; recherche taguée `kind:golden_cell` = **0** | protocole MCP `:8002` non exercé ; 406 sur GET = normal |
| **E-13** | `ollama list` + workflow `deploy-pages.yml` | 2026-10-28 | mesure / artefact | 18 modèles, ≥ 3 familles (Qwen, Gemma, Granite, Phi…) ; déploiement Pages sur push `main` | aucune génération lancée |
| **E-14** | `pnpm test` dans `expanse-cortex` | 2026-10-28 | mesure | 27 fichiers, 410 tests passés, 3,17 s, exit 0 | tests unitaires seulement ; e2e Playwright non lancé |
| **E-15** | `scripts/check-broken-links.sh` | 2026-10-28 | mesure | 1 référence cassée, dans un plan legacy | 6 motifs seulement ; ne vaut pas validation globale |
| **E-16** | `expanse-cortex/README.md` + `package.json` | 2026-10-28 | document / artefact | README dit `pnpm test` = Playwright, le script réel est Vitest ; statut « déployé » | non confronté au site public |
| **E-17** | `find expanse-lab`, `archive/lab` | 2026-10-28 | mesure | `expanse-lab/` (18 fichiers) subsiste à la racine ; `archive/lab/` vide | aucune analyse de contenu du lab |
| **E-18** | `README.md`, `AGENTS.md`, `KERNEL.md` | état 2026-10-28 | document | README pointe vers INDEX_V17/runtime V17 ; AGENTS édicte ORG.1/ORG.2/ORG.6 ; KERNEL §XII impose l'incarnation | prescrivent une intention ; ne prouvent pas l'usage |

---

*Audit rédigé le 2026-10-28 — lecture directe du dépôt, sans modification de code. Les faits de structure et d'état sont mesurés ; les affirmations causales sont explicitement marquées comme hypothèses. Revue non indépendante : aucun tiers n'a relu ce rapport.*
