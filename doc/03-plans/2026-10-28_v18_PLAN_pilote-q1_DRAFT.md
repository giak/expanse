---
type: PLAN
version: v18
status: DRAFT
title: "Pilote Q1 — exécution exploratoire, hors Golden Record"
question: "Comment exécuter un pilote Q1 minimal, mesurable et honnête, sans contaminer le Golden Record ?"
created: 2026-10-28
related:
  - doc/VISION.md
  - doc/PFD.md
  - doc/PRD.md
  - doc/05-audits/2026-10-28_v18_AUDIT_point-projet-expanse_DRAFT.md
---

# Pilote Q1 — plan d'exécution exploratoire

> **Statut :** DRAFT, à valider avant toute ligne de code. Ce document ne remplace ni le PFD ni le PRD ; il tranche les points que ceux-ci laissent ouverts pour un **pilote de faisabilité**.
>
> **Précondition :** l'objectif poursuivi est la preuve empirique V18. Si l'objectif réel est la pratique KERNEL, ce plan ne s'applique pas (option E de l'audit).

## §0 — Décision en une page

Le pilote Q1 est un **test de tuyauterie**, pas un test d'hypothèse. Il doit répondre à trois questions mesurables :

1. Combien de temps coûte une génération sur les modèles locaux ?
2. Le format de sortie est-il parsable de façon fiable ?
3. Les répétitions à température 0 varient-elles, ou sont-elles des copies identiques ?

Il ne prononce **aucun verdict** sur Q1, ne produit **aucune p-value**, et ne crée **aucune cellule Golden Record**. Son résultat est un jeu de 60 traces + un `summary.json` qui permettent de décider si le design statistique (A-03) est finançable en temps.

**Ce qui est explicitement hors périmètre :** juge D8 (Q1 est mécanique), lecture aveugle J+1 (aucun verdict à protéger), Mnemolite (reporté au Golden Record), Phase 2, tout symbole du méta-langage Expanse.

## §1 — Les arbitrages manquants

| # | Point | Décision | Pourquoi | Alternative rejetée |
|---|---|---|---|---|
| **A1** | Statut du pilote | Exploratoire, **hors Golden Record** ; jamais tagué `kind:golden_cell` | `n = 10` ne satisfait pas O1 (`n ≥ 30`) ; le taguer contaminerait la recherche Mnemolite (cf. §1.1) | Compter le pilote comme premier test O1 |
| **A2** | Tâche Q1 | Complément à 9 sur `4831` → `5168` | Neutre, déterministe, non mémorisable, sans charge RLHF | Chiffres romains (rappel du pré-entraînement), tri (effet plafond) |
| **A3** | Conditions | A = prose déployée ; B = atome `⌘(d) = 9 − d` ; C = atome neutre `z9(d) = 9 − d` | C isole le bagage sémantique de la compaction **si `prompt_eval_count` est égal** ; sinon la comparaison B/C reste descriptive (VISION §7) | C = baseline sans instruction (ne mesure pas la compaction) |
| **A4** | Métrique | Primaire : `exact_match` ; secondaires : `format_ok`, tokens de réponse | Q1 est structurel, pas sémantique ; un juge LLM ajouterait un confondant | Juge D8 (réservé Q2/Q5), note humaine |
| **A5** | Modèles | `qwen3:8b` + `gemma3:12b` (familles Qwen3 / Gemma3, tous deux Q4_K_M) | Deux familles distinctes (aucun Mistral local), quantization comparable, tailles exécutables | `qwen3.5:2b` Q8 + `hermes3` Q4_0 (confond quantization et taille) ; un seul modèle (viole H4) |
| **A6** | Répétitions | 10 par cellule, `rep` 0–9, graines 1001–1010, `temperature: 0.0` ; si les sorties sont identiques, variance nulle consignée | Mesure la pseudo-réplication au lieu de la supposer | Graine unique (ne mesure rien) ; température variable (viole le déterminisme) |
| **A7** | Budget de tokens | Mesuré (`prompt_eval_count`) pour A/B/C, **non égalisé** | Le pilote teste la tuyauterie ; l'égalisation change l'hypothèse et relève d'A-03 | Padding de B (détruit la densité) ; 4e condition (scope creep) |
| **A8** | Stockage | JSON plat dans `doc/06-artifacts/2026-10-28_q1-pilot/`, un fichier par génération + `summary.json` ; pas de Mnemolite | La taxonomie Mnemolite n'a pas de tag `pilot_run` ; ne pas mélanger pilote et Golden Record | Écrire dans Mnemolite maintenant (pollue la recherche `kind:golden_cell`) |
| **A9** | Contrôle aveugle | Aucun ; le pilote ne produit pas de verdict | Le contrôle protège un verdict ; ici il n'y en a pas | 30 distracteurs pour 60 sorties (coût sans bénéfice) |
| **A10** | Critère d'arrêt | 60/60 JSON valides ; abandon si > 10 % d'erreurs HTTP, > 20 % d'échecs de format, ou p95 > 120 s | « Le script a tourné » est explicitement insuffisant (PFD §7) | Accepter un run partiel comme succès |

### §1.1 — Arbitrage O1 : le pilote n'est pas le « premier test Q1 »

**Contradiction apparente.** O1 exige, pour le « premier test comparatif Q1 archivé », une trace Mnemolite `kind:golden_cell`, deux familles et `n ≥ 30` par cellule. Le pilote propose `n = 10`, sans Mnemolite et sans `golden_cell`. Lu comme « premier run Q1, quel qu'il soit », O1 interdit le pilote.

**Décision.** O1 est le critère d'acceptation de la **première cellule Golden Record Q1**, pas une condition d'entrée pour tout travail exploratoire. Le pilote est hors de son périmètre : aucun tag `kind:golden_cell`, aucune trace Mnemolite, aucun verdict, aucune p-value. O1 reste **inchangé et non abaissé** : le premier run Golden Record Q1 devra satisfaire `n ≥ 30`, deux familles, Mnemolite, verdict à 4 niveaux et p-value. Le pilote est une **précondition de faisabilité**, pas un substitut.

**Pourquoi cette lecture ne dégrade rien.**

- Si le pilote comptait comme O1, il faudrait soit le porter à `n = 30` — il perd sa fonction, mesurer le coût avant de s'engager — soit abaisser O1 à `n = 10` — il perd sa garantie statistique.
- Les critères de O1 incluent explicitement `kind:golden_cell` et une trace Mnemolite ; le pilote n'en a aucun. La lecture « première cellule Golden Record » est donc la lecture littérale des critères, pas une échappatoire.
- Le pilote ne produit aucun verdict : il ne peut pas être confondu avec une preuve Q1.

**Conséquences.**

- Le pilote porte le champ `kind: pilot_run` dans son JSON plat (pas un tag Mnemolite), jamais `kind:golden_cell`.
- Il n'est compté dans aucun objectif SMART ; O5 est néanmoins respecté par construction (deux familles).
- Le premier run Golden Record Q1 reste à faire, avec A-03 (addendum statistique) comme préalable.
- Si le pilote montre que `n = 30` est infaisable en temps, O1 ne sera pas réinterprété : il faudra un audit A-03 et un amendement explicite du PRD.

**Ce qui invaliderait cette décision.** Si l'opérateur saute le pilote et va directement au Golden Record, O1 s'applique sans changement et ce plan est caduc. Si A-03 révèle que `n = 30` n'est pas le bon seuil, l'amendement passe par le PRD et un audit, pas par ce plan.

## §2 — Dispositif Q1

**Question :** `4831`. **Attendu :** `5168`.

Les trois prompts sont des préfixes ; le harnais ajoute `\n\n` + la question.

- **A — définition déployée :** « Règle : pour chaque chiffre, calcule son complément à 9 (9 moins le chiffre). Applique cette règle à la suite de chiffres suivante. Réponds uniquement par les quatre chiffres, sans explication. »
- **B — atome dense :** « ⌘(d) = 9 − d. Applique ⌘ à chaque chiffre de la suite suivante. Réponds uniquement par les quatre chiffres, sans explication. »
- **C — témoin neutre :** « z9(d) = 9 − d. Applique z9 à chaque chiffre de la suite suivante. Réponds uniquement par les quatre chiffres, sans explication. »

La définition de test suit D6 : `{id, model, metric, prompts: [A, B, C], question}`. Le harnais rejette tout fichier dont `.prompts | length != 3`.

**Métrique** (`metric`) : `EXPECTED=5168 ./metrics/q1_metric.sh`. Le script lit la réponse sur stdin, extrait la première suite de quatre chiffres, et émet :

```json
{"exact_match": 1, "format_ok": 1, "digits": "5168"}
```

`format_ok = 0` si la réponse ne contient pas exactement quatre chiffres après nettoyage. `exact_match = 1` si `digits == "5168"`. Le script est déterministe et ne juge pas le raisonnement.

**Signature comportementale mesurée :** `exact_match`, `format_ok`, `eval_count` et le texte brut. Le pilote ne juge pas la qualité du raisonnement ; il constate si les sorties diffèrent.

## §3 — Exécution

- **API :** `POST http://localhost:11434/api/generate`, `stream: false`.
- **Options par appel :** `temperature: 0.0`, `seed: 1001 + rep`, `num_predict: 64`, `top_k: 1`, `top_p: 1.0`.
- **Session vierge :** requête stateless, aucun historique ; un appel = une cellule.
- **Empreinte :** `ollama show <model> --modelfile` hashé en SHA-256, plus l'ID de `ollama list`.
- **Ordre :** modèle par modèle, condition A puis B puis C, 10 répétitions. Aucun run concurrent (évite la contention GPU).
- **Pré-vol :** 6 générations (2 modèles × 3 conditions × 1) pour mesurer latence et format. Mesurer aussi `prompt_eval_count` de B et C : si les deux diffèrent, consigner l'écart et ne pas traiter B/C comme une isolation du bagage. Si un modèle échoue au format sur A, le prompt est corrigé avant le batch ; les 6 traces de pré-vol sont conservées mais exclues du jeu de 60.
- **Durée :** 66 appels au total. Si le p95 dépasse 120 s, arrêt et révision du couple de modèles.

## §4 — Trace et stockage

Un fichier par génération : `doc/06-artifacts/2026-10-28_q1-pilot/<model>__<condition>__<rep>.json`.

```json
{
  "kind": "pilot_run",
  "run_id": "2026-10-28_q1-pilot",
  "cell_id": "qwen3-8b__B__03",
  "model": "qwen3:8b",
  "model_digest": "sha256:...",
  "condition": "B",
  "rep": 3,
  "seed": 1003,
  "temperature": 0.0,
  "num_predict": 64,
  "prompt": "...",
  "question": "4831",
  "response": "...",
  "prompt_eval_count": 57,
  "eval_count": 6,
  "total_duration_ns": 123456789,
  "metric": {"exact_match": 1, "format_ok": 1, "digits": "5168"},
  "status": "ok",
  "timestamp_utc": "2026-10-28T..."
}
```

`status` ∈ `ok | format_failure | http_error`. Un fichier invalide est un échec, pas une ligne à ignorer. `kind` vaut toujours `pilot_run` ; `golden_cell` est interdit dans ce répertoire.

`summary.json` agrège par modèle × condition : `n`, `exact_match_count`, `format_ok_count`, médiane et p95 de `total_duration_ns`, moyenne de `prompt_eval_count` et `eval_count`, nombre de réponses distinctes. Il contient un bloc `limitations` explicite (Q4, une tâche, `n = 10`, pas de contrôle aveugle, pas de test statistique).

## §5 — Critères d'acceptation

- 60/60 fichiers JSON valides (`jq -e .`), 6/6 pré-vols conservés.
- 0 cellule manquante ; chaque cellule a un `status`.
- `summary.json` présent et cohérent avec les fichiers.
- Le taux d'échec de format est reporté, pas masqué.

Le pilote est **réussi** si les 60 traces existent et sont exploitables, même si `exact_match` est à 0 ou à 100 %. Il est **échoué** si des cellules manquent, si le format n'est pas parsable, ou si la latence rend le batch impossible.

## §6 — Ce que le pilote ne prouve pas

- Il ne prouve pas Q1 : une tâche, deux modèles, `n = 10`, aucun test statistique.
- Il ne sépare pas l'effet de l'atome de l'effet de longueur (A7).
- Il ne teste pas les caractères rares : les deux modèles sont Q4_K_M, et H1 documente l'écrasement des tokens rares.
- Il ne produit aucun verdict à 4 niveaux et aucune cellule Golden Record.
- Il n'exerce pas le juge D8 : Q1 est mécanique, le juge est réservé à Q2/Q5.

## §7 — Décision à la sortie

- Si 60/60 valides et format ≤ 10 % d'échec : passer à **A-03** (addendum statistique) avec les latences et la variance mesurées.
- Si `distinct_responses == 1` pour toutes les cellules (variance nulle à T=0) : A-03 doit changer le design (varier les instances de tâche ou introduire un échantillonnage contrôlé) avant tout `n = 30`.
- Si p95 > 120 s : réduire le nombre de cellules ou choisir des modèles plus petits avant A-03.
- Si format > 20 % d'échec : corriger le prompt ou la métrique avant toute statistique.

**Prochaine action après validation de ce plan :** écrire le harnais (`run_test.sh`, `metrics/q1_metric.sh`, définition JSON) et exécuter le pré-vol. Aucun code n'est écrit avant validation.

## §8 — Ce qui est repris de V17, et ce qui ne l'est pas

| Élément V17 | Repris ? | Raison |
|---|---|---|
| JSON + métrique shell | Oui, comme forme | D6 / EF-2 imposent 3 prompts, pas 2 |
| `test.sh` de 15 lignes | Non | `ollama run` ne donne ni tokens, ni seeds, ni traces |
| Verdict binaire | Non | V18 impose 4 niveaux ; le pilote ne prononce aucun verdict |
| Mnemolite | Non (reporté) | Pas de tag `pilot_run` ; le Golden Record seulement |
| Schéma `prompt_A` / `prompt_B` | Non | D6 impose `prompts: [A, B, C]` |

---

*Plan rédigé le 2026-10-28 — à valider avant implémentation. Les décisions A1–A10 sont des appels du rédacteur, réversibles sur argument ; elles ne sont pas des décisions actées du PFD.*
