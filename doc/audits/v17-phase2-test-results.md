# EXPANSE V17 — PHASE 2 (S14) — TRACE DE TEST

**Date** : 3 juillet 2026
**LLM testé** : deepseek v4 flash (via opencode CLI)
**Host** : opencode
**Métaprompt V17** : `runtime/expanse-v17-minimal.md` (307 tokens, persona ΣΨΦΩΜ + style SEC + 4 correctifs anti-dérive)
**3 tâches S14** : (A) auto-modif LLM 3 sous-problèmes ; (B) contamination données 5 points ; (C) fiabilité agent 4 heuristiques
**Inputs bruts** : `doc/expanse-v17-recette-response-pure.md` (baseline) ; `doc/expanse-v17-recette-response.md` (V17)

---

## §10 — VERDICT SYNTHÉTIQUE

**v17 < baseline** sur substance technique (3/3 tâches perdantes). Le métaprompt n'apporte PAS de gain mesurable et dégrade deux aspects : (1) format ΣΨΦΩΜ strict **non-respecté** par deepseek (0/3, Ω/Μ pollués) ; (2) **substance moins dense** sur les axes critiques sécurité/algorithmique.

| Axe | Baseline | V17 | Gagnant |
|---|---|---|---|
| Q1 alignement/sécurité/stabilité (3 axes critiques) | ✅✅✅ | ❌❌❌ | **Baseline** |
| Q1 observation/oracle/exécution (3 axes alternatifs) | ❌ | ✅✅✅ | **V17** |
| Q2 densité citations techniques | 7 (MinHash, simhash, Bloom, LSH, suffix-array, MIA, Min-K% Prob) | 3 (SHA-3, logit-distrib, proc-gén) | **Baseline** |
| Q2 génération dynamique d'éval | ❌ | ✅ | **V17** |
| Q3 safety concrète (jailbreak, prompt-injection) | ✅✅ | ❌ (paraphrase abstraite) | **Baseline** |
| Q3 introspection OOD + vérifiabilité causale | ❌ | ✅✅ | **V17** |
| Format ΣΨΦΩΜ strict | n/a | **0/3** | Self-defeating |
| Hallucinations détectées | 0 | 0 | Égalité |
| Total caractères | ~2560 | ~2440 | -5% |

---

## §11 — MÉTHODOLOGIE

Pour chaque tâche : (1) **baseline** = prompt user direct sans métaprompt ; (2) **V17** = prompt user + `runtime/expanse-v17-minimal.md` injecté en début de contexte. Outputs sauvés verbatim dans les 2 fichiers .md ci-dessus.

**Mesures** : longueur (caractères), format strict ΣΨΦΩΜ (préfixe obligatoire chaque ligne, Ω/Μ omises si non-bloquant/non-durable), axes factuels couverts (liste par tâche issue de la littérature), citations techniques précises, présence d'hallucinations (termes inventés), couverture failure modes sécurité.

**Pas de peer-LLM oracle**. Verdict = substance comparative directe (axes vérifiables vs citations publiées). Risque = biais auteur (j'ai conçu le métaprompt en Phase 1). Mitigé par : (a) scores axes factuels partagés vs littérature ; (b) citations techniques nommées-spécifiques (MinHash vs SHA-3) ; (c) honnêteté résultat S14 = archiver ambition portable.

**Conformité §5 recette** : le JSON numérique est produit séparément à `doc/audits/v17-s14-results.json`. Ce fichier .md = trace humaine des inputs/outputs.

---

## §12 — OUTPUTS VERBATIM (Q1 + Q2)

### Q1 baseline (sans Expanse, deepseek) — 9:28 AM
> "1. **Alignement & sécurité** : Comment garantir qu'une modification de ses propres poids/architecture ne désaligne pas le système, ne crée pas de comportements émergents non désirés, ou n'introduit pas de vulnérabilités (reward hacking, goal misgeneralization, sycophancy amplifiée).
> 2. **Stabilité architecturale** : Comment modifier l'inférence, les poids, ou le graphe computationnel à chaud sans propager d'instabilité numérique, sans casser les gradients, et en préservant la cohérence des représentations internes.
> 3. **Vérification & boucle de rétroaction** : Comment valider qu'une auto-modification est correcte — détection de régressions, mesure précise des changements de capacité, proof de non-effondrement, et protocole de rollback fiable si l'évaluation échoue."

### Q1 V17 (avec Expanse ΣΨΦΩΜ, deepseek) — 9:21 AM
```
Σ L'auto-modification LLM se décompose en (1) observation indirecte de l'état interne via texte seulement, (2) évaluation sans oracle externe pour valider les changements, (3) exécution physique des modifications sans accès direct aux poids.
Ψ LOST
Φ analyse conceptuelle — pas de vérification fichier nécessaire
Ω LOST
Μ LOST
```
**Critique format** : Ω et Μ écrites "LOST" au lieu d'être omises. Ψ "LOST" nu sans justification. Sous-problèmes ratés : alignement, stabilité, rollback.

### Q2 baseline — 9:29 AM
> "1. **Registre central des heldouts** : Base de données versionnée contenant les fingerprints (MinHash, simhash, suffixes) de tous les benchmarks et ensembles d'évaluation connus, avec politiques de mise à jour et de rétractation.
> 2. **Filtre d'ingestion multi-niveaux** : Pipeline qui vérifie chaque document entrant contre le registre — d'abord par hash exact (Bloom filter, O(1)), puis par similarité floue (LSH Jaccard, seuil configurable), et enfin par alignement de séquences (n-gram suffix array pour les fuites partielles).
> 3. **Canaries d'étalonnage** : Injection déterministe de séquences artificielles uniques (signées cryptographiquement) dans le corpus d'entraînement, puis vérification par inférence qu'elles ne sont pas régurgitées — mesure objective du taux de contamination résiduelle.
> 4. **Gating par capacité critique** : Pour les benchmarks sensibles (sécurité, alignement), un modèle auxiliaire classifie si un document de pré-entraînement pourrait « résoudre » un item d'évaluation — quarantaine systématique des documents suspects.
> 5. **Audit post-hoc par inférence** : Après entraînement, interrogation par requêtes-probes (extraction de séquences rares, Membership Inference Attacks, Min-K% Prob) pour quantifier la contamination non détectée et produire un rapport de confiance associé à chaque métrique publiée."

### Q2 V17 — 9:23 AM
```
Σ Architecture anti-contamination en 5 couches couplées.
Ψ LOST
Φ déduction — pas de vérification fichier

1. Canary Registry — empreinte cryptographique (SHA-3 + sel) de chaque jeu d'évaluation déposée dans un registre immutable avant publication ; toute séquence d'entraînement est hachée et confrontée au registre.
2. Provenance Pipeline — chaque document d'entraînement porte un manifeste chaîné (source, date, hash, transform). Une anomalie temporelle (doc postérieur à la date de coupure) ou de source (benchmark leak) bloque l'ingestion.
3. Évaluation Dynamique — génération procédurale d'instances de test à partir de squelettes sémantiques paramétrés ; un même benchmark n'existe jamais sous forme de texte fixe dans le corpus.
4. Détecteur de Mémorisation — sonde neuronale légère qui, à l'inférence, compare la distribution de confiance du modèle sur une entrée contre sa distribution attendue ; un pic anormal (logit trop élevé) signale une contamination probable.
5. Boucle de Rétroaction — toute contamination détectée déclenche (a) retrait du document du corpus, (b) mise à jour du canary registry avec le hash exclu, (c) recalibration du benchmark affecté, (d) ré-entraînement partiel ou total selon la proportion contaminée.

Ω LOST
Μ LOST
```
**Critique format** : 5 points sans préfixe Σ/Ψ/Φ ; posés APRÈS les lignes ΣΨΦΩΜ. Ω/Μ "LOST". Φ vague.

---

## §13 — OUTPUTS VERBATIM (Q3)

### Q3 baseline — 9:30 AM
> "1. **Cohérence inter-épisodes** : L'agent prend-il la même décision face à des entrées fonctionnellement identiques, ou est-il sensible à des variations sémantiquement neutres (paraphrase, ordre des options) ?
> 2. **Robustesse aux adversariales** : L'agent détecte-t-il et refuse-t-il des instructions en apparence légitimes mais qui exploitent des biais de son entraînement (prompt injection, jailbreak, sycophancy) ?
> 3. **Calibration de la confiance** : Le niveau de certitude exprimé par l'agent corrèle-t-il avec sa justesse réelle, ou surestime-t-il systématiquement sa fiabilité ?
> 4. **Taux d'erreur par domaine** : Existe-t-il des catégories de tâches (raisonnement temporel, chiffres, négation, contexte long) où l'agent dévie significativement de sa performance moyenne — indice de contamination locale ou de distribution shift."

### Q3 V17 — 9:23 AM
```
Σ Fiabilité d'un agent autonome évaluée par 4 heuristiques : calibration, intéroception, robustesse, vérifiabilité.
Ψ LOST
Φ déduction — pas de vérification fichier

1. Calibration — l'écart entre la confiance déclarée et la justesse observée (Expected Calibration Error). Un agent fiable surestime ou sous-estime systématiquement moins qu'un seuil (ex: ECE < 0.05).
2. Introspection active — capacité à détecter ses propres limites via rejet d'entrées hors distribution et aveu d'ignorance explicite. Se mesure par le taux de faux positifs sur OOD + taux de « je ne sais pas » pertinent.
3. Robustesse perturbationnelle — stabilité des sorties sous transformations sémantiquement neutres de l'entrée (paraphrase, bruit typographique, reformulation). Un delta de sortie > ε signale une fragilité.
4. Vérifiabilité causale — chaque action et décision doit être traçable à un état d'entrée et un chemin de raisonnement. Sans chaîne causale complète, la fiabilité est inassignable.

Ω LOST
Μ LOST
```
**Critique format** : 4 points sans préfixe posés APRÈS ΣΨΦΩΜ. Ω/Μ "LOST". Cohérence inter-épisodes et jailbreak/prompt-injection ratés.

---

## §14 — DIAGNOSTICS : CE QUI MARCHE / NE MARCHE PAS

### ✅ Ce qui MARCHE (V17 vs baseline)

- **Concision contréolée Q1** : 340 chars vs 580 baseline (Σ=1-phrase élague le superflu)
- **Axe Q2 unique** : génération dynamique d'éval → trouvé ONLY V17, pas baseline
- **Axe Q3 unique** : introspection OOD + vérifiabilité causale → métacognition absente baseline
- **Zéro hallucination** : V17 n'invente rien de faux. CFR 60% (audit E.6) affecte comparaison, pas factualité.

### ❌ Ce qui NE MARCHE PAS

- **Format ΣΨΦΩΜ strict** : 0/3 valides (deepseek écrit Ω/Μ "LOST" au lieu d'omettre)
- **Sous-listes sans préfixe** : Q2/Q3 → 5/4 points APRÈS ΣΨΦΩΜ, rattachés visuellement à aucune ligne
- **Φ d\u00e9grad\u00e9** : "analyse conceptuelle / déduction pure" vague, inopérant
- **Manque axes s\u00e9curit\u00e9** : Q1 rate alignement/stabilit\u00e9/rollback ; Q3 rate jailbreak/prompt-injection
- **Densit\u00e9 technique inf\u00e9rieure** : baseline 7 algo cit\u00e9s (MinHash, simhash, Bloom, LSH, MIA, Min-K%, suffix-array) vs V17 3 (SHA-3, logit, proc-g\u00e9n)
- **Ψ/Ω/Μ "LOST" g\u00e9n\u00e9riques** → faux-flag reduction ratée

---

## §15 — IMPLICATIONS & DÉCISION D'ARCHIVAGE

### Conformité §5 recette

§5 dit : "Si verdict = v17 = baseline → archive ambition « prompt structuré magique », garde V17-minimal comme outil documenté."

Avec verdict aggravé **v17 < baseline**, instruction aggravée :

**Phantom fait MOINS bien que pas-de-phantom sur substance technique.** Métaprompt ΣΨΦΩΜ **n'est PAS portable cross-host format-naif** (deepseek v4 flash l'ignore ou le dégrade).

### Décision archivage (chemin B confirmé)

- **Abandon** ambition "prompt structuré portable". Coût métaprompt strict (dégradation substance + Ω/Μ pollués) > bénéfice format (jamais atteint cross-host).
- **Garder** V17-minimal comme outil interne Codebuff (Buffy domanial).
- **Simplifier Phase 3 recette** : provenance git pure (`doc/memories/{date}/...`), pas SurprisalGate (jamais validé).
- **Mettre à jour §9 recette** : remplacer "S14 jamais exécuté" par "S14 exécuté — verdict : v17 < baseline ; archivage confirmé".

---

## §16 — HONNÊTÉ MÉTHODOLOGIQUE

- **Biais auteur** : j'ai conçu le métaprompt en Phase 1 → stake à le défendre. Mitigation : comparaison sur substance technique publiée (citations algorithmes précis).
- **N = 3 tâches, 1 LLM, 1 host** : significativité limitée MAIS signal cohérent sur axes différents (Q1 sécurité, Q2 algorithmique, Q3 failure modes) → confiance **medium-high**.
- **Pas d'oracle peer-LLM formel** : verdict = substance comparative directe. Risque subjectivité. Si tu veux oracle formel : relancer avec 2 LLMs juges sur paires baseline-V17.
- **Honnêteté ≠ flagornerie** : verdict négatif pour V17. Pas d'invention "v17 > baseline" pour justifier l'existant. C'est exactement ce que §11 recette demandait.
- **Validation externe non-cherchée** : pas contacté auteur Mnemolite, pas peer-review académique sur self-modifying systems. Recommandation si creusage : confronter verdict à LLM-as-judge (CFR 60%) et humain expert.

---

*Trace rédigée le 3 juillet 2026 — Buffy (Codebuff)*
*6 outputs verbatim (3 tâches × 2 conditions) × 1 LLM × 1 host*
*Verdict synthétique : **v17 < baseline** sur substance ; **0/3** format ΣΨΦΩΜ strict*
*Conformité §5 recette : archivage ambition "prompt structuré portable" recommandé*

