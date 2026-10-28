---
type: AUDIT
version: v18
status: DRAFT
title: "Briques V17 réutilisables et contradictions avec V18"
question: "Quelles briques du framework de test V17 sont réutilisables pour V18, et où contredisent-elles le protocole V18 ?"
created: 2026-10-28
scope: "doc/04-tests V17, runtime V17, docs V18 — lecture seule, sans exécution"
auditor: "Buffy (Codebuff) — revue non indépendante"
evidence_cutoff: 2026-10-28
---

# Audit ciblé — briques V17 vs protocole V18

**Date :** 2026-10-28
**Périmètre :** les trois specs de test V17 (`doc/04-tests/`), le métaprompt V17 (`runtime/`), et les exigences V18 (`VISION`, `PFD`, `PRD`, `SPEC`).
**Profondeur :** ciblée — compatibilité de briques, pas RETEX de projet.
**Décision attendue :** faut-il forker le harnais V17 pour le pilote Q1, ou reconstruire un harnais V18 en réutilisant seulement les briques agnostiques ?

## Synthèse

- **Recommandation :** ne pas forker le harnais V17. Réutiliser **les patrons listés ci-dessous** (séparation WHAT/HOW/MEMORY, script neutre, `set -euo pipefail`, `jq`, un JSON = un test, une réponse = une trace, réponse brute avant scoring, batch + agrégation) et **reconstruire** le harnais V18. Le protocole V17 contredit V18 sur trois points bloquants : deux conditions au lieu de trois, verdict binaire au lieu de quatre niveaux, et absence de juge D8 pour Q2/Q5.
- **Constats prioritaires :**
  - **F-01 (P0)** — V17 est un framework à **2 conditions** et **verdict binaire** ; V18 exige **3 prompts** (A/B/C) et un **verdict à 4 niveaux**. Ce n'est pas une différence de réglage, c'est un autre protocole.
  - **F-02 (P1)** — Le schéma V17 (`prompt_A`/`prompt_B`, ou `conditions[]`/`tasks[]`) et les tags Mnemolite V17 (`type:test_result`, `project:expanse-research`) sont incompatibles avec D6/EF-2 et ENF-15. Un fichier V17 ne peut pas être ingéré par un harnais V18 sans transformation.
  - **F-03 (P1)** — V17 n'a ni `temperature`/`seed`/`num_predict`, ni empreinte sha256, ni comptage de tokens, ni `n ≥ 30`/p-value/IC, ni aveugle J+1, ni contrôle anti-artefact. Il ne peut pas produire une cellule Golden Record.
  - **F-04 (P1)** — Les exemples V17 (`Ψ`, `[LOST]`, `SEC`/politesse RLHF) ne sont pas des tâches neutres au sens H5/CA-S-4 : Ψ est un symbole Expanse, [LOST] un marqueur du méta-langage, SEC un contraste de style RLHF. Ils ne peuvent pas servir de base au pilote Q1.
  - **F-05 (P1)** — Les trois specs V17 sont `status: ACTIVE` dans `doc/04-tests/`, alors qu'elles ne sont pas V18-compatibles et ne sont pas référencées par INDEX_V18. Un agent à froid peut les prendre pour le framework courant.
- **À préserver :** l'agnosticisme du `test.sh` V17, le principe « un test = un JSON », l'écriture de la réponse brute avant scoring, et la validation humaine du JSON.
- **Confiance :** haute sur les contradictions textuelles (lignes citées) ; moyenne sur la réutilisabilité, car aucun script V17 n'a été exécuté dans cet audit.
- **Prochain contrôle :** le harnais Q1 doit rejeter un JSON à 2 prompts et ne produire aucun tag `kind:golden_cell`.

## Périmètre, méthode et limites

- **Question :** quelles briques V17 sont réutilisables pour V18, et où le protocole V17 contredit-il V18 ?
- **Inclus :** `doc/04-tests/2026-07-04_v17_TEST_protocol-simulation_ACTIVE.md`, `..._test-framework-spec_ACTIVE.md`, `..._research-framework-v2_ACTIVE.md`, `runtime/2026-07-02_v17-minimal-iteration-2_v17.md`, `doc/05-audits/v17-phase2-test-results.md`, et les exigences V18 (`VISION`, `PFD`, `PRD`, `SPEC`).
- **Exclus :** l'exécution des scripts V17 ; le runner prompt complet (lu par sections) ; les sections §4-§5 du research framework (non lues en entier) ; Mnemolite live ; les 325 fichiers de `doc/_legacy/`.
- **Sources non inspectées :** le code V17 n'existe pas comme fichier exécutable (`test.sh` est inline dans la spec) ; aucun test V17 n'a été rejoué. Les contradictions sont donc **textuelles**, pas runtime.
- **Échelle :** P0 = choix de protocole qui rend le harnais non conforme ; P1 = brique inutilisable sans réécriture ou risque de confusion ; P2 = friction. Confiance haute = ligne citée des deux côtés ; moyenne = lecture partielle ou inférence.
- **Hypothèse de cadrage :** V18 (VISION/PFD/PRD) est la référence normative ; les specs V17 sont des documents historiques, même si leur frontmatter dit `ACTIVE`.

## Inventaire — ce que V17 contient réellement

| Brique | Source | Ce qu'elle fait | Verdict |
|---|---|---|---|
| Socle 3 fichiers | protocol-simulation §0 (l. 19-29) | JSON = WHAT, script = HOW, Mnemolite = MEMORY | Réutilisable (principe) |
| `test.sh` de 15 lignes | protocol-simulation §2 (l. 54-78) | exécute 2 prompts, score shell | À remplacer (2 conditions, pas de seeds/tokens) |
| Définition JSON | protocol-simulation §1 (l. 31-49) | `id`, `model`, `metric`, `prompt_A`, `prompt_B`, `question` | À adapter (D6) |
| Métrique shell | protocol-simulation §1 et §5 | `wc -c`, `grep -c` | À adapter (script fixe, JSON) |
| Écriture Mnemolite | protocol-simulation §3 (l. 83-93) | 1 write par réponse, tags V17 | À adapter (tags/payload) |
| Schéma `conditions`/`tasks` | test-framework-spec §1 (l. 57-130) | conditions, tâches, itérations | Non réutilisable (D6) |
| Runner prompt | test-framework-spec §0/§2 (l. 16, 135-387) | le LLM host exécute et auto-score | Non réutilisable (D3) |
| Batch + agrégation | test-framework-spec §0/§2 (l. 171-180, 269-366) | batch ID, rapport final | Réutilisable (concept) |
| Labels Bleue/Rouge | research-framework-v2 §2.2 (l. 93-96) | masque la condition innovante | Réutilisable (partiel) |
| Scoring mécanique | research-framework-v2 §2.3 (l. 97-109) | script score, pas le LLM | Réutilisable (Q1/Q3/Q4/Q6/Q7) |
| Verdict binaire | research-framework-v2 §2.4 (l. 110-112) | VRAI/FAUX | Non réutilisable |
| « 2 conditions, 3 questions » | research-framework-v2 §2.1 (l. 84-91) | mini-test | Non réutilisable |
| Métaprompt V17 | runtime (l. 9-43) | Ψ, SEC, ΣΨΦΩΜ | Historique ; stimulus Q5 seulement |
| Trace V17 Phase 2 | v17-phase2-test-results (164 l.) | verbatim + verdict narratif | Modèle de lecture, pas schéma |

## Réutilisable tel quel (code ou patron)

| Brique | Pourquoi elle survit à V18 | Ancrage V18 |
|---|---|---|
| `set -euo pipefail` (protocol l. 57, 99) | échec immédiat, pas de faux succès | hygiène Bash du harnais |
| `jq` pour lire la définition (l. 62-63) | sépare le WHAT du HOW | D6 (PFD l. 122) |
| Script neutre, sans mot d'Expanse (l. 214-226) | le harnais ne contient aucune hypothèse | D3 (PFD l. 119) |
| Un JSON = un test / une question (l. 228-238) | granularité stricte | EF-1 (PRD l. 193) |
| Une réponse = une trace (test spec l. 369) | pas de batch write, trace atomique | EF-3 (PRD l. 199) |
| Écrire la réponse brute avant de scorer (test spec l. 378) | la mesure reste re-dérivable | EF-3 et ENF-1 |
| Batch ID unique (test spec l. 171-180) | agrégation et recherche futures | `run_id` du pilote |
| Agrégation finale (test spec l. 269-366) | un rapport par batch, pas par réponse | `summary.json` du pilote |

## Réutilisable avec adaptation

| Brique | Adaptation nécessaire | Ancrage V18 |
|---|---|---|
| Définition JSON (protocol §1 ; test spec §1) | passer à `{id, model, metric, prompts: [A,B,C], question}` ; rejeter 2 prompts | D6 (PFD l. 122), EF-2 (PRD l. 197) |
| Métrique shell (protocol §1/§5) | script fixe et versionné, pas d'`eval` ; sortie JSON (`exact_match`, `format_ok`) ; ajouter les tokens | EF-3, EF-5 |
| Écriture Mnemolite (protocol §3 ; test spec §3) | remplacer `type:test_result` par `kind`/`phase`/`q`/`model` ; le pilote n'utilise pas Mnemolite | ENF-15 (PRD l. 271), EF-10 (PRD l. 217) |
| Structure du runner (test spec §0/§2) | garder setup → lecture → boucle → sauvegarde → agrégation ; remplacer le LLM host par Bash/curl | D3 (PFD l. 119), EF-5 |
| `iterations` (test spec l. 70) | devenir `n` avec politique de graines ; le défaut 1 est invalide | PFD §7 (l. 103-108) |
| `system_prompt` / `system_prompt_file` (test spec l. 75-76) | ne pas mapper système/user ; V18 teste des prompts A/B/C, pas un rôle système | D6, EF-2 |
| `rubric.metrics` (test spec l. 81-90) | rester une note d'analyse humaine ; la métrique V18 est mécanique | EF-9 (PRD l. 215) |
| Trace V17 Phase 2 | garder le verbatim et la méthodologie ; ajouter le schéma JSON, les timings et les tokens | EF-3, §4 du plan pilote |

## Contradictions précises

**Lecture :** chaque ligne confronte une affirmation V17 et une exigence V18. « Directe » = les deux ne peuvent pas être vrais ensemble ; « gap » = V17 ne dit rien, mais ne peut pas satisfaire V18 ; « partielle » = un élément survit, le reste manque.

| # | V17 (ligne) | V18 (ligne) | Nature | Conséquence |
|---|---|---|---|---|
| **C-01** | 2 conditions : `prompt_A`/`prompt_B` (protocol l. 38-39) ; « 2 conditions » (research l. 89) | 3 prompts A/B/C obligatoires (PFD D6 l. 122 ; PRD EF-2 l. 197) | Directe | Un JSON V17 est rejeté ; le pilote doit ajouter C. |
| **C-02** | Verdict binaire VRAI/FAUX (research l. 110-112) | 4 niveaux (PFD D2 l. 118 ; PRD EF-8 l. 213 ; VISION §5 l. 92) | Directe | Le runner V17 ne peut pas produire un verdict V18. |
| **C-03** | « Interdit : tout jugement sémantique par le LLM » (research l. 108) | Juge D8 requis pour Q2/Q5 (PFD l. 124 ; PRD EF-7 l. 209) | Directe pour Q2/Q5 ; compatible Q1/Q3/Q4/Q6/Q7 | Ne pas importer la règle telle quelle ; Q1 reste mécanique. |
| **C-04** | `prompt_A`/`prompt_B` (protocol l. 38-44) ou `test_id/conditions/tasks` (test spec l. 65-90) | D6 `{id, model, metric, prompts[3], question}` (PFD l. 122 ; PRD l. 197) | Incompatible | Transformation obligatoire ; aucun fichier V17 n'est un test V18. |
| **C-05** | `type:test_result`, `project:expanse-research`, `condition`, `score` (protocol l. 86, 90 ; test spec l. 46-51, 243-256) | `kind:golden_cell`, `phase:1`, `q:Q1`, `model`, `memory_type` (PRD ENF-15 l. 271 ; EF-10 l. 217) | Incompatible | Trace V17 non conforme ; le pilote n'écrit pas dans Mnemolite. |
| **C-06** | `ollama run` sans options (protocol l. 65-66, 107-108) | T=0, seed, num_predict (PRD EF-5 l. 205) | Gap | V17 ne contrôle pas la variance ; pas de reproductibilité. |
| **C-07** | Métrique `wc -c`/`grep`, pas de tokens ni sha256 (protocol l. 68-69) | sha256 des poids, tokens, durée, UTC (PRD EF-3 l. 199) | Gap | Trace V17 non re-dérivable. |
| **C-08** | Un modèle par JSON (protocol §7 l. 231) | ≥ 2 familles (PFD H4 l. 63 ; PRD EF-6 l. 207) | Directe | V17 est mono-substrat par construction. |
| **C-09** | `iterations` défaut 1 (test spec l. 70) ; verdict binaire (research l. 112) | n≥30, p<0.05, IC95 (PFD l. 103-108 ; PRD O1 l. 91, O4 l. 94, CA-S-1 l. 341, CA-S-6 l. 346) | Gap | Aucune cellule Golden Record possible. |
| **C-10** | Labels Bleue/Rouge (research l. 93-96), sans J+1/dilution/scellage | J+1, ≥ 30 distracteurs, chmod 444 (PFD l. 79-82 ; PRD EF-11 l. 221, EF-12 l. 223) | Partielle | Le label seul ne suffit pas ; le protocole complet manque. |
| **C-11** | Aucun contrôle anti-artefact (research l. 110-112) | Mesure primaire + contrôle anti-artefact (PRD EF-9 l. 215 ; VISION §4.3 l. 87) | Gap | Un « VALIDÉ » V17 ne serait pas V18. |
| **C-12** | Exemples Ψ (l. 39), [LOST] (l. 175), SEC/politesse RLHF (l. 199) ; research l. 27-31 | Domaines neutres, Anti-TE (PFD H5 l. 65 ; PRD CA-S-4 l. 344, EF-1 l. 193) | Directe pour Q1 | Ces exemples ne sont pas des tests Q1 V18 ; certains peuvent être des stimuli Q2/Q4/Q5, après adaptation et contrôle neutre. |
| **C-13** | T1/T2 identité et décision (test spec l. 118-130) | Une brique isolée, pas de bundle (PRD EF-1 l. 193) | Partielle | Le fichier mélange deux comportements ; ne pas le reprendre tel quel. |
| **C-14** | `eval "$METRIC"` sur une chaîne du JSON (protocol l. 68-69, 110-111) | Harnais agnostique (PFD D3 l. 119) | Risque/contradiction | Injection et confondant ; script fixe. |
| **C-15** | « le LLM host EST le harness » (test spec l. 16) ; auto-score (l. 145) | Harnais déterministe, juge séparé (PFD D3 l. 119 ; PRD EF-4 l. 203, EF-5 l. 205, EF-7 l. 209) | Directe | Le runner prompt n'est pas un harnais ; à remplacer par Bash/curl. |
| **C-16** | `/tmp/${ID}_A.txt` (protocol l. 65-66, 107-108) ; `/tmp/expanse-test-output.txt` (test spec l. 378) | Archive durable (PRD EF-3 l. 199 ; PFD §7 l. 103-109) | Gap | Perte au reboot ; pas de trace. |
| **C-17** | STOP si Mnemolite down (test spec l. 370) | Pilote A8 sans Mnemolite ; Golden Record avec Mnemolite (PFD D7 l. 123) | Mismatch opérationnel | Les scripts V17 ne tournent pas dans le pilote ; adapter le stockage. |
| **C-18** | Métaprompt Ψ premier token, ΣΨΦΩΜ, SEC (runtime l. 9-43) | Q5 est une hypothèse fragile (VISION l. 59) ; pas d'implémentation du méta-langage (VISION §7) | Doctrinale | Réutilisable comme stimulus Q5, pas comme harnais ni cadre. |

## Ce que la lecture établit

- **Le noyau réutilisable est une discipline, pas un protocole.** Script neutre, un test à la fois, réponse brute écrite avant scoring, validation humaine : ces quatre choix survivent à V18. Les choix de conditions, de verdict et de juge ne survivent pas.
**Correspondance des constats :** F-01 = C-01/C-02/C-03 ; F-02 = C-04/C-05 ; F-03 = C-06 à C-11 ; F-04 = C-12/C-13 ; F-05 = statut `ACTIVE` des specs V17.

- **Les trois contradictions bloquantes (C-01, C-02, C-03) ne se corrigent pas par un patch.** Elles définissent le design de recherche : 2 conditions binaires contre 3 conditions graduées. Un fork du `test.sh` reproduirait le mauvais design avec une nouvelle syntaxe.
- **Le modèle de données est le piège silencieux.** Un JSON V17 peut être exécuté sans erreur et produire une trace qui n'est ni D6 ni `kind:golden_cell`. Le harnais V18 doit rejeter ce fichier à l'entrée, pas le convertir implicitement.
- **Les exemples V17 sont le piège le plus visible.** `Ψ`, `[LOST]` et `SEC` ressemblent à des tests prêts à l'emploi, mais ils violent H5, CA-S-4 et le corollaire Anti-TE. Ils ne doivent pas entrer dans le pilote Q1.
- **Le statut `ACTIVE` des specs V17 est un risque de gouvernance.** Un agent qui cherche « le framework de test » dans `doc/04-tests/` trouve trois documents V17 marqués ACTIVE et aucun renvoi vers V18. C'est F-05.

## Options comparées

| Option | Mécanisme | Avantages | Risques | Effort | Vérification |
|---|---|---|---|---|---|
| **A — forker `test.sh`** | copier le socle V17 et patcher les champs | rapide ; conserve la tuyauterie | 2 conditions, pas de seeds/tokens/stats ; le patch devient une réécriture | S-M | un JSON à 2 prompts doit être rejeté : le fork échoue au premier test EF-2 |
| **B — reconstruire V18** | réutiliser les patrons listés, écrire le harnais D6 | aligné EF-2/EF-5/EF-9 ; pas de dette V17 | travail initial plus long ; risque de réinventer l'agrégation | M | 2-prompt rejeté, 60 traces, `summary.json` |
| **C — V17 tel quel** | exécuter les specs V17 pour Q1 | zéro travail | non conforme : 2 conditions, verdict binaire, aucun Golden Record | nul | échoue EF-2 et EF-8 par construction |

## Recommandation

- **Option retenue : B.** Le noyau V17 réutilisable est une discipline (script neutre, un test à la fois, trace brute, validation humaine), pas un protocole. Le protocole V17 est l'opposé de V18 sur les trois choix qui comptent : 2 conditions, verdict binaire, et interdiction globale du juge (alors que V18 l'exige pour Q2/Q5).
- **Pourquoi elle convient :** elle conserve les quatre pratiques qui ont de la valeur et n'importe aucune des contradictions. Le pilote Q1 peut être écrit en Bash/curl avec `jq`, sans dépendre du runner LLM ni de Mnemolite.
- **Compromis et risques résiduels :** il faut réécrire l'agrégation et le stockage ; le risque est de sous-spécifier le `summary.json`. Mitigation : le schéma du plan pilote est le contrat.
- **Pourquoi A n'est pas retenue :** un fork semble moins cher, mais le premier test EF-2 (2 prompts rejetés) oblige à changer le schéma, puis le runner, puis les tags. On paie deux fois.
- **Ce qui ferait changer la recommandation :** un amendement explicite de V18 à 2 conditions et verdict binaire ; ce n'est pas le cas aujourd'hui.

## Plan d'amélioration

| ID | Constat lié | Action concrète | Priorité | Responsable (rôle) | Effort / dépendances | Critère d'acceptation et vérification |
|---|---|---|---|---|---|---|
| **A-01** | C-01, C-02, C-04 | écrire le harnais Q1 à partir des patrons listés ; rejeter un JSON à 2 prompts ; métrique fixe, sans `eval` ; runner Bash/curl | P0 | développeur | S-M | un JSON à 2 prompts sort en erreur ; `grep -R 'eval '` = 0 ; 60 traces valides |
| **A-02** | F-05 | marquer les trois specs V17 comme historiques (ARCHIVED ou bandeau) et renvoyer à cet audit | P1 | mainteneur doc | S | plus aucune spec V17 `ACTIVE` citée comme framework courant |
| **A-03** | C-12, C-13 | ne pas réutiliser les exemples Ψ/[LOST]/SEC ; utiliser la tâche neutre du plan pilote | P1 | développeur | S | aucune définition de test V18 ne contient Ψ, [LOST] ou SEC |
| **A-04** | C-03 | pour Q2/Q5, utiliser la SPEC juge V18, pas la règle V17 « pas de juge » | P1 | développeur | S | SPEC juge citée ; triplication 42/43/44 |
| **A-05** | C-18 | traiter le métaprompt V17 comme stimulus Q5, jamais comme harnais | P2 | mainteneur | S | aucun ΣΨΦΩΜ dans le harnais Q1 ; Q5 planifié séparément |

## Incertitudes et suite

- **Questions ouvertes :** le `test.sh` V17 est-il réellement exécutable tel quel ? La spec est inline, aucun fichier n'a été lancé. La réponse ne change pas les contradictions textuelles, mais changerait la gravité de C-14/C-16.
- **Preuves à obtenir :** exécuter le `test.sh` V17 sur un JSON factice pour confirmer le comportement de `eval` et de `/tmp` ; lire le runner prompt en entier ; lire research §4-§5.
- **Prochain contrôle :** après A-01, un JSON à 2 prompts doit être rejeté, puis le pré-vol de 6 générations doit produire 6 traces valides. Sans cela, le harnais n'est pas prêt.

## Registre de preuves

| ID | Source / artefact | Date ou version | Nature | Ce que la source démontre | Limites / accès |
|---|---|---|---|---|---|
| **E-01** | `doc/04-tests/2026-07-04_v17_TEST_protocol-simulation_ACTIVE.md` | 2026-07-04, v17 | document | socle 3 fichiers, `test.sh` 2 prompts, `eval`, tags V17 | spec, pas code exécuté |
| **E-02** | `doc/04-tests/2026-07-04_v17_TEST_test-framework-spec_ACTIVE.md` | 2026-07-04, v17 | document | runner LLM, schéma `conditions/tasks`, Mnemolite | runner prompt lu par sections |
| **E-03** | `doc/04-tests/2026-07-04_v17_TEST_research-framework-v2_ACTIVE.md` | 2026-07-04, v17 | document | 2 conditions, verdict binaire, labels Bleue/Rouge | §4-§5 non lues en entier |
| **E-04** | `doc/05-audits/v17-phase2-test-results.md` | 2026-07-03 | artefact | trace V17 réelle, verbatim + verdict narratif | V17, pas V18 |
| **E-05** | `runtime/2026-07-02_v17-minimal-iteration-2_v17.md` | 2026-07-02, v17.4 | document | métaprompt Ψ/SEC/ΣΨΦΩΜ | intention, pas mesure |
| **E-06** | `doc/PFD.md` | v6, 2026-07-04 | document | D2/D3/D6/D7/D8, H4/H5, §7, aveugle | normatif, pas exécuté |
| **E-07** | `doc/PRD.md` | v1.1, last_revised 2026-10-28 | document | EF-1 à EF-12, ENF-15, O1/O4, CA-S-1/4/6 | normatif, pas exécuté |
| **E-08** | `doc/VISION.md` | v18, 2026-07-04 | document | §4.3 bicéphale, §5 verdict, §7 exclusion | normatif, pas exécuté |
| **E-09** | `doc/03-plans/2026-10-28_v18_PLAN_pilote-q1_DRAFT.md` | 2026-10-28 | document | décisions A1-A10, §1.1, schéma de trace | plan DRAFT, non commité |

*Audit en lecture seule : cet audit n'a modifié ni les specs V17 ni le plan pilote. Les contradictions sont textuelles ; aucun script V17 n'a été exécuté. Revue non indépendante.*
