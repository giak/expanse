---
type: VISION
version: v18
status: ACTIVE
title: "Vision — Cadre empirique de validation d'un méta-langage cognitif LLM"
created: 2026-07-04
last_revised: 2026-07-04
project: Expanse (pré-cadrage — pas une implémentation)
# Note : VISION est le doc RACINE de la hiérarchie documentaire Expanse. Les 3 docs listés ci-dessous ne sont PAS des dépendances amont (au sens littéral « VISION ne peut exister sans eux ») mais des descendants : PFD/PRD/SPEC op.érationnalisent VISION. Le label `depends_on` est conservé par convention croisée avec PFD/PRD (qui eux dépendent littéralement de VISION) ; l'inversion de sens dans VISION est assumée et documentée ici pour les parseurs YAML en mode strict.
depends_on:
  - doc/PFD.md (v6 ACTIVE, descendant) — cadrage opérationnel, infrastructure exécutive Phase 1, op.érationnalise ce VISION
  - doc/PRD.md (v1.1 ACTIVE, descendant) — exigences produit concrètes et testables, formalise les critères §2/§5/§8/§9 de ce VISION
  - doc/01-specs/2026-07-04_v18_SPEC_juge-semantique-d8_ACTIVE.md (descendant) — spécification opérationnelle du juge D8, op.érationnalise §2 Q2/Q5 + §4 protocole bic.éphale de ce VISION
audit_trail: "v1 → v18 : document macroscopique, itère sans dupliquer PFD/PRD/SPEC. v17 → v18 : cross-doc dette refermée — ajout des dépendances descendantes (PFD v6 + PRD v1.1 + SPEC v18.1) rendues nécessaires après création du PRD (post-VISION v17) ; ajout du bloc 'Voir aussi — hiérarchie documentaire' (Au-dessus = c'est le doc racine / Ce document = VISION v18 / En-dessous = PFD + PRD + SPEC) ; ajout d'une mention v18 (2026-07-04) documentant la clôture de l'audit antagoniste profond #4 vs truth-engine v2 (cf. doc/05-audits/2026-07-04_truth-engine-vs-expanse_AUDIT-04.md) — la contrainte de neutralité thématique (PRD v1.1 §5.1 EF-1 corollaire Anti-TE + CA-S-4 + PFD v6 §4 H5) est compatible avec VISION §6 (agnosticité) et VISION §9-a (témoins neutres) sans modification des sept questions Q1-Q7."
---

# VISION — Cadre de validation d'un méta-langage cognitif LLM

> **Voir aussi — hiérarchie documentaire Expanse (VISION = doc racine).**
> - **Au-dessus** : néant (VISION est la racine, pas de doc parent dans cette hiérarchie).
> - **Ce document** : VISION v18 (cadrage macroscopique : pourquoi + quoi, 9 sections, agnosticité Q1-Q7).
> - **En-dessous (docs dérivés)** :
>   - `doc/PFD.md` (v6 ACTIVE) — **opérationnalise** VISION en posant les décisions D1-D8, hypothèses H1-H5, risques R1-R3, livrables Phase 1.
>   - `doc/PRD.md` (v1.1 ACTIVE) — **exigences produit concrètes** : 9 sections + 14 EF + 16 ENF + 9 CA-I + 10 CA-S + 3 personas + 4 R-PRD. Formalise les critères de succès Q1-Q7.
>   - `doc/01-specs/2026-07-04_v18_SPEC_juge-semantique-d8_ACTIVE.md` — **spécification opérationnelle** du juge LLM tiers local (8 sections, opérationnalise PFD D8 pour Q2/Q5).
>
> VISION ne duplique ni PFD, ni PRD, ni SPEC. Les sept questions de recherche (§2), les critères de succès (§5), les contraintes (§6), les exclusions (§7) et les critères d'arrêt (§8) restent la **référence non-négociable**. Pour toute question d'opérationnalisation (comment mesurer, comment juger, quel triangle abc), voir les docs dérivés.

> **Positionnement.** Ce document de vision définit le **pourquoi** et le **quoi** d'une investigation empirique sur l'opportunité, la mesurabilité et les conditions d'efficacité d'un méta-langage cognitif dédié pour les LLM — projet dénommé *Expanse*. Il ne fixe pas le **comment** (architecture, scripts, schémas) — c'est le rôle de la spécification. Il reste macroscopique. Il est volontairement agnostique : il ne définit pas les symboles particuliers, ni n'adopte un jargon interne.

---

## §1 — Contexte et objet

Il existe aujourd'hui une **intuition non-validée** portée par un document théorique (guide de compression sémantique) : un **symbole dédié** — un signe unique, condensé, traité comme un atome sémantique — pourrait déclencher un traitement différent d'un **mot déployé** occupant plusieurs tokens, dans le réseau d'un grand modèle de langage. Cette intuition est aussi motivée par un constat : le langage naturel est ambigu, et le LLM y consacre une part significative de son traitement à **conjecturer** les intentions de l'utilisateur ou à **inventer** du contenu face à des informations absentes.

L'**objet** de ce projet n'est pas de développer l'implémentation d'un méta-langage. Il est de construire un **cadre empirique rigoureux** qui permette de déterminer :

- quelles affirmations sur les méta-langages dédiés sont effectivement soutenues par la mesure ;
- quelles autres sont des constructions plausibles mais **non étayées** ;
- quelles conditions méthodologiques permettraient, le cas échéant, de qualifier avec honnêteté ce qui marche.

Sans ce cadre préalable, tout développement Expanse serait une construction spéculative sur du sable. Avec ce cadre, chaque brique future pourra être introduite parce que **prouvée utile**, et non parce qu'élégante.

**L'horizon spéculatif de l'émergence (hors-mesure).** Au-delà de la validation isolée de chaque brique, le projet est nourri par une hypothèse téléologique à long terme : en fournissant un cadre sémantique dense et régulier, le modèle ne se contenterait pas d'appliquer une règle, mais ferait *émerger* de lui-même une structuration latente optimisée (un dialecte in-context). Cette « cristallisation » spontanée d'un méta-langage propre induirait une efficacité supérieure au simple ajout de contraintes. Cette hypothèse justifie l'ambition globale du projet, mais demeurant aujourd'hui **non-mesurable mécaniquement au niveau unitaire**, elle est **exclue du périmètre de test empirique de la Phase 1**.

---

## §2 — Questions de recherche ouvertes

Sept questions sont aujourd'hui sans réponse scientifique consensuelle. Toutes cinq devraient être éprouvées empiriquement avant toute implémentation. La hiérarchie reflète la **fragilité** de chacune selon l'état actuel de la littérature.

### Priorité haute

- **Q1 — Atome textuel dense vs définition déployée.** Un atome textuel conceptuel (symbole ou caractère rare, dont le poids variable en tokens est systématiquement mesuré et documenté par modèle), redéfini en amont dans le prompt, déclenche-t-il un comportement local différent par rapport à cette même définition déployée en langage naturel ?

- **Q2 — Marqueur d'incertitude.** Un marqueur syntaxique spécifique d'ignorance réduit-il l'invention et l'hallucination lorsque le LLM ne dispose pas de l'information ? *(Légitimé par le besoin pratique, mais non encore éprouvé.)*

- **Q5 — Incarnation verbale vs instruction comportementale.** Demander au LLM « tu *es* ce système » produit-il un comportement différent de « agis *comme* ce système » ? *Cette question est la plus fragile : la littérature actuelle ne fournit pas de preuve scientifique forte d'une différence effective entre ces formulations. Elle reste dans le périmètre, en priorité, parce que si elle est invalidée, une large part des hypothèses ontologiques du projet doit être révisée.*

### Priorité standard

- **Q3 — Format contraignant spécifique.** Sachant que la littérature (Chain-of-Thought, ReAct) valide l'impact structurant des formats imposés en langage naturel, cette restructuration du raisonnement se maintient-elle lorsque l'on force le modèle à l'exécuter via une compacité syntaxique (dense-symbolique atypique), particulièrement hors des tâches logico-mathématiques ?

- **Q4 — Style dense.** Un style bref et technique produit-il plus d'information utile par token qu'un style conversationnel de type agent conversationnel ?

- **Q6 — Préférence effective.** Toutes choses égales, un LLM performe-t-il mieux face à un prompt dense-symbolique qu'à un prompt verbose-naturel ?

- **Q7 — Résistance à la dilution.** Un symbole dédié ancre-t-il mieux un comportement sur de longs contextes, là où un mot se dilue ? *(Légitimé par le constat empirique connu que l'attention des LLM biaise vers les segments de début et de fin d'un long contexte, phénomène connu et documenté.)*

---

## §3 — Périmètre et utilisateurs

- **Périmètre.** Recherche empirique ciblée. Production-ready exclu. Implémentation partielle du méta-langage exclue tant que les briques ne sont pas validées.
- **Utilisateur principal.** Le porteur du projet — il valide, oriente, arbitre les hypothèses et les mutations. Pas de client externe, pas d'utilisateur final à ce stade.
- **Consommateur secondaire.** La mémoire du projet. Chaque verdict (hypothèse, exécution, score, inspection) est archivé, indexé, jamais perdu. Cette mémoire n'est pas un humain — c'est un système d'archivage queryable.

---

## §4 — Fonctionnalités de haut niveau

Le cadre de validation doit fournir quatre capacités, sans détail d'implémentation :

1. **Test granulaire.** Tester une brique isolée (un symbole, un marqueur, un style, un mode d'incarnation). Jamais le méta-langage complet dans son ensemble.
2. **Session indépendante.** Chaque test s'exécute dans une session LLM vierge. Aucune contamination du contexte entre tests.
3. **Protocole de mesure bicéphale.** L'évaluation sépare strictement deux étapes : la **mesure primaire** (strictement mécanique, déterministe, exécutée par un script sur le texte figé) et le **contrôle anti-artefact** (vérification que l'effet mécanique n'est pas un faux positif). Si ce contrôle requiert un jugement humain abstrait en contexte solo, il s'exécute en **aveugle par masquage consigné** : un script présente les réponses générées sans révéler leurs conditions de test originelles, forçant l'opérateur à acter l'artefact avant la révélation des métadonnées.
4. **Capitalisation.** Chaque test (hypothèse, **empreinte matérielle en tokens par modèle**, exécution, score, verdict) est archivé, daté, versionné. Les hypothèses parentes et filles sont chaînées.

---

## §5 — Critères de succès — verdict graduel

Le verdict découle de la combinaison entre la mesure scriptée et le contrôle anti-artefact. Chaque brique reçoit un verdict à **quatre niveaux**, jamais plus :

| Niveau | Critère de qualification |
|---|---|
| **VALIDÉ — fort** | Effet mécanique mesuré reproductible (≥ 2 modèles) ET aucun artefact validé par le contrôle. |
| **VALIDÉ — partiel** | Effet mécanique mesuré sur 1 seul modèle ET aucun artefact validé par le contrôle. |
| **INVALIDÉ — artefact** | Effet mécanique mesuré par le script, MAIS le contrôle révèle un faux positif technique (perroquet du prompt, bypass de la consigne, hallucination formatée). |
| **INVALIDÉ — bruit** | Aucun effet mécanique mesurable (score nul ou non-significatif, variance aléatoire). La mesure primaire échoue. |

**Refus explicite des formulations intermédiaires** : « c'est prometteur », « je ressens une amélioration ». Le verdict est une équation, pas une critique littéraire.

---

## §6 — Contraintes structurantes (non négociables)

- **Agnosticité du harnais.** Le mécanisme de test ne doit contenir aucune des hypothèses qu'il évalue. Sinon l'auto-biais serait garanti.
- **Aveugle.** Le LLM testé ne sait pas qu'il est testé.
- **Multi-substrat.** Tester sur ≥ 2 modèles différents. Un effet observé sur un seul modèle est insuffisant — il peut être idiosyncratique.

- **Déterminisme forcé.** Toute comparaison d'hypothèse s'effectue « toutes choses égales par ailleurs » : les paramètres de variance et d'échantillonnage probabiliste du moteur de génération doivent être figés aux valeurs les plus asymétriques et restrictives permises par le substrat local. Le hasard doit être neutralisé au maximum pour isoler l'impact mécanique structurant de la prompt-ingénierie.
- **Itératif.** Chaque test produit soit une mutation de l'hypothèse, soit la déclaration d'une impasse. Jamais un verdict figé définitif sur une seule passe.
- **Granulaire.** Une chose à la fois. Pas de bundle.
- **Pas de vaporware.** Toute brique référencée est définie opéra­toirement (à quoi elle reconnaît-on qu'elle est présente) avant d'être testée.

---

## §7 — Exclusions explicites

Ce que ce projet **n'est pas** :

- **Pas une implémentation** du méta-langage Expanse. La construction est un projet suivant, conditionné par les résultats de cette investigation.
- **Pas une théorie** sur les mécanismes internes du réseau neural d'un LLM (architecture, couches, neurones). Le projet observe des comportements, il ne théorise pas leur implémentation interne.
- **Pas un benchmark public** reproductible par des tiers. Usage strictement interne.
- **Pas une publication académique.** La rigueur méthodologique est requise, le format de publication ne l'est pas.
- **Pas d'atomes sémantiques sans condition témoin neutre.** Tout test impliquant un symbole chargé par le pré-entraînement (lettres grecques, notations) doit inclure une condition témoin s'appuyant sur un atome textuel neutre (caractère rare ou chaîne compacte), dont le poids exact en tokens sera relevé pour chaque tokenizer testé, afin d'isoler l'effet du bagage sémantique de l'effet de pure compaction.
- **Pas de prédiction fonctionnelle** sur ce qui marchera « sur le terrain » sans mesure préalable.
- **Gouvernance des données archivées.** Les verdicts (hypothèses, scores, inspection) sont strictement internes ; aucune publication externe n'est prévue. En cas de compromission de la mémoire du projet, celui-ci n'est pas fragilisé : les verdicts sont **re-dérivables** depuis les conditions de test archivées.

---

## §8 — Conditions et critères d'arrêt

L'arrêt du projet n'est pas piloté par une deadline externe. Il s'arrête par épuisement productif, par réfutation centrale, ou par accumulation suffisante — jamais par enthousiasme non fondé, jamais par abandon sur bruit.

- **Aucun budget-temps prédéfini.** Pas de deadline, pas d'engagement de ressources à priori. Le projet avance par essai-erreur, test par test, jusqu'à épuisement productif ou réfutation.

- **Épuisement d'une piste.** Quand une hypothèse ne produit plus de variation mesurable après M mutations consécutives.
- **Réfutation centrale.** Si Q1 (symbole vs mot) ou Q2 (marqueur d'incertitude) sont invalidés au niveau « fort », l'objet principal du projet disparaît — décision conjointe d'arrêter ou de repositionner.
- **Base suffisante.** Quand ≥ 3 briques sont validées au niveau « fort » ET cohérentes entre elles ET reproductibles cross-modèles, le projet passe en **phase 2 : conception d'un méta-langage complet**.

**Définition des phases (pour éviter toute ambiguïté) :**
- **Phase 1.** Cette investigation empirique. C'est l'objet du présent document de vision.
- **Phase 2.** Conception d'un méta-langage complet, conditionnée aux résultats de la phase 1. Pas dans le périmètre ici.

---

## §9 — Risques méthodologiques identifiés

Cette section assume les **faiblesses potentielles** du cadre, pour ne pas les subir en silence :

- **a) Effets combinés de bagage symbolique et de variance de tokenisation.** L'usage de symboles pré-entraînés expose au rappel de connaissances fortuites, tandis que l'usage de caractères rares expose à une fragmentation tokenizer-dépendante (où 1 caractère se brise paradoxalement en plusieurs tokens). Mitigation obligatoire : usage de conditions témoins neutres où le comptage de tokens est extrait comme donnée de contrôle explicite pour chaque famille de modèles.

- **b) Pénalité d'alignement (RLHF).** Les modèles modernes ajustés pour le comportement (RLHF) peuvent assimiler une syntaxe dense-symbolique atypique à une anomalie ou une tentative d'obfuscation (jailbreak), induisant une dégradation artificielle ou un refus poli. Mitigation : documenter systématiquement l'intervention des filtres d'alignement, et veiller à distinguer analytiquement ce qui relève d'une baisse de performance cognitive de ce qui relève d'un rejet post-entraînement préprogrammé.
- **c) Effet de format reconnaissable.** Si le format de prompt devient trop reconnaissable (« toujours le même préfixe »), les modèles peuvent court-circuiter la tâche en reconnaissant le pattern au lieu de la traiter. Mitigation : **permutation contrôlée de l'ordre des éléments** dans les conditions équivalentes.
- **d) Faiblesse non-étayée de Q5.** L'hypothèse que l'incarnation verbale est supérieure à l'instruction comportementale ne dispose pas, à l'état actuel de la littérature, de preuves scientifiques solides. Le cadre de test **doit** la traiter comme une hypothèse à éprouver, non comme une conviction à confirmer.
- **e) Robustesse de la mesure multi-substrats.** La variance intra-modèle (entre exécutions successives du même modèle) peut masquer des effets réels ; la variance inter-modèles peut exagérer des artefacts. Le verdict graduel impose des seuils minimaux précisément pour mitiger ce risque.
- **f) Collision de nomenclature externe.** Le nom « Expanse » entre en collision avec des produits commerciaux existants. Pour les communications externes, prévoir une désambiguïsation explicite. Pour le travail interne, le nom est conservé tel quel.
- **g) Auto-biais de l'investigateur.** Le porteur du projet connaît les hypothèses qu'il veut valider — et risque donc de construire inconsciemment des conditions qui les favorisent. Mitigation : aveugle strict, mesure mécanique externe, et revue des protocoles par un regard extérieur quand c'est possible.

---

*Vision rédigée le 4 juillet 2026 — cadrage macroscopique, agnostique, factualisable.*
*Conçu pour être validé avant toute spécification. Les 5 garde-fous méthodologiques sont imposés par le fact-check des sources existantes (Symbol Tuning, LLMLingua, longueur de contexte, état de l'art sur le rôle-prompting), non par préférence esthétique.*
