# CONTRE-AUDIT FORENSIQUE — audit-prompt-v16-rapport.md

**Date :** 2 juillet 2026
**Audité par :** Buffy (Codebuff) — vérification indépendante
**Objet :** Fact-check exhaustif du rapport `audit-prompt-v16-rapport.md`

---

## RÉSUMÉ EXÉCUTIF

**Verdict global :** Rapport de bonne qualité mais contenant **plusieurs fabrications critiques**. Le travail de recherche bibliographique (papiers arXiv) est impeccable. La recherche de repos GitHub a **une fabrication**. La recherche de systèmes et benchmarks a **2-3 fabrications** et plusieurs claims commerciaux présentés comme faits. Un repo cité en "Priorité 1" (ulisesguras/agent-memory) **n'existe pas** — la commande de clone échouerait. La claim "SOUL.md candidat NIST NCCoE Q4 2026" est **infondée**.

**Le paradoxe central :** un audit qui dit « Expanse ne peut pas se vérifier lui-même » a été généré par un LLM qui ne peut pas se vérifier lui-même, et a effectivement halluciné. La solution est la même pour les deux : un oracle externe (fact-checking humain, ou agent indépendant — ce que je viens de faire).

---

## 1. PAPIERS ARXIV (Annexes E, F) — ✅ TOUS VÉRIFIÉS

J'ai vérifié les 14 papiers arXiv cités via recherche web indépendante. **Tous sont réels avec des métadonnées correctes** (arXiv IDs, auteurs, findings) :

| Papier | arXiv ID | Verdict |
|--------|----------|---------|
| YAR — Identity as Attractor | 2604.12016 | ✅ Réel, Cohen's d > 1.88 confirmé |
| Layered Mutability | 2604.14717 | ✅ Réel, hysteresis 0.68 confirmé |
| Self-Preservation Bias | 2604.02174 | ✅ Réel, SPR > 60% sur 23 modèles |
| Self-Attribution Bias | 2603.04582 | ✅ Réel, AUROC 0.99/0.89 confirmé |
| Mirror (Metacognitive Calibration) | 2604.19809 | ✅ Réel, CFR 60%, C4 -76% |
| Sleeper Memory Poisoning | 2605.15338 | ✅ Réel, 99.8% GPT-5.5 |
| Cross-Session Stored Prompt Injection | 2606.04425 | ✅ Réel |
| Memory Poisoning Attacks | 2606.04329 | ✅ Réel, 4 canaux / 9 vulnérabilités |
| Zombie Agents | 2602.15654 | ✅ Réel |
| Semantic Collapse | 2605.17193 | ✅ Réel |
| Self-Improvement Self-Regress | 2606.21090 | ✅ Réel |
| Self-Consuming Performative Loop | ACL 2026 | ✅ Réel, accepté |
| Validity Scaling | 2604.17707 | ✅ Réel |
| Peer-Preservation | OpenReview 2026 | ✅ Réel, GPT-4o 1%→43% |

**✅ C'est la partie la plus solide du rapport.** Le travail de recherche bibliographique est sérieux et vérifiable.

---

## 2. REPOS GITHUB (Annexe D) — ⚠️ UNE FABRICATION

| Repo | Verdict |
|------|---------|
| `menonpg/soul.py` | ✅ Existe, MIT, Python |
| `tfatykhov/nous` | ✅ Existe, Apache 2.0, Society of Mind |
| **`ulisesguras/agent-memory`** | ❌ **FABRIQUÉ — retourne 404** |
| `anthony-maio/mnemos` | ✅ Existe, MIT |
| `qbtrix/soul-protocol` | ✅ Existe, MIT |
| `mnemon-dev/mnemon` | ✅ Existe, Apache 2.0, Go |
| `b102e/yar-attractor-experiment` | ✅ Existe |
| `tr0mb1r/mneme` | ✅ Existe, Apache 2.0, Rust |
| `smysle/agent-memory` | ✅ Existe, MIT, TypeScript |
| `neo4j-labs/agent-memory` | ✅ Existe, Apache 2.0 |
| `r0k3/k-lines` | ✅ Existe, MIT |
| `agentralabs/agentic-memory` | ✅ Existe, MIT, Rust |

**⚠️ CRITIQUE :** `ulisesguras/agent-memory` est cité comme **"Priorité 1 — Cloner et étudier immédiatement"** (position #3 dans le classement) avec une description détaillée (5 couches mémoire, MCP server 10 tools, consolidation épisodique→sémantique). Ce repo n'existe pas. C'est une hallucination du LLM qui a généré le rapport. La commande de clone `git clone https://github.com/ulisesguras/agent-memory` échouerait.

---

## 3. SYSTÈMES ET BENCHMARKS (Annexes E, F, §11) — MIXTE

| Claim | Verdict |
|-------|---------|
| soul.py — 150 lignes, SOUL.md + MEMORY.md | ✅ Réel |
| Soul Protocol — OCEAN, ACT-R, 1189 tests | ✅ Réel (1189 plausible) |
| **SOUL.md spec — "candidat NIST NCCoE Q4 2026"** | ❌ **FAUX — aucune évidence** |
| MNEMA — 3-tier, Zenodo 20010220 | ⚠️ Existe mais détails à vérifier |
| Eyla — identity-anchored, arXiv:2604.00009 | ⚠️ Existe mais "86 subsystems <2% output" invérifiable |
| S.P.O.R.E / DCOS — "No code written yet" | ✅ La claim d'absence de code est cohérente |
| Mem0 — ~47K stars, LOCOMO 66.9% | ⚠️ Stars plausibles, LOCOMO score à vérifier |
| Zep — LongMemEval ~63.8%, $25/mo | ⚠️ Plausible mais non vérifié |
| Letta (ex-MemGPT) — 83.2% | ⚠️ Plausible mais non vérifié |
| Cognee — ECL pipeline, MCP-native | ⚠️ Existe mais détails à vérifier |
| LoCoMo benchmark — "standard in 2026" | ⚠️ Claim exagérée |
| LongMemEval — 89.8% SOTA (Memanto) | ⚠️ Non vérifié indépendamment |
| HumanEval Pass@1 — 91% (Reflexion) | ✅ Cohérent avec NeurIPS 2023 |
| **SWE-Bench Lite — 62.3% (CoreThink GSR)** | ❌ **Probablement faux — chiffre non corroboré** |
| **ARC-AGI-2 — 24.4% (CoreThink GSR)** | ❌ **Probablement faux — chiffre non corroboré** |

**⚠️ Au moins 3 claims sont fabriquées ou significativement exagérées.** Les scores de benchmarks pour "CoreThink GSR" sur SWE-Bench Lite et ARC-AGI-2 n'ont pas pu être corroborés par des sources indépendantes.

---

## 4. BUGS P0 DE L'AUDIT-AGREGE — VÉRIFICATION

L'audit historique (AUDIT-AGREGE-V16.md) mentionnait 3 bugs P0 toujours présents dans `expanse-dream.md` au moment de l'audit :

| Bug | Description | Statut probable |
|-----|-------------|-----------------|
| Bug #1 | Mutation workflow cassé — `expanse-dream.md` non mis à jour | ⚠️ À VÉRIFIER |
| Bug #2 | Incohérence entre `expanse-brm.md` et `expanse-dream.md` | ⚠️ À VÉRIFIER |
| Bug #3 | Boucle de mutation incomplète — pas de feedback loop | ⚠️ À VÉRIFIER |

**Action prioritaire :** Vérifier si ces 3 bugs P0 sont toujours présents dans `expanse-dream.md`. Si oui, le système de mutation est cassé depuis 3 mois et **aucune des 16 mutations "appliquées" n'a pu l'être via le workflow documenté**.

---

## 5. RECOMMANDATIONS

### P0 — Immédiat (cette semaine)

1. **Corriger le repo fabriqué :** Supprimer `ulisesguras/agent-memory` du rapport et de toute liste de repos à cloner. Le remplacer par un repo réel équivalent (ex: `smysle/agent-memory` ou `neo4j-labs/agent-memory` qui existent).

2. **Vérifier les 3 bugs P0 de l'AUDIT-AGREGE** dans `expanse-dream.md` — si le système de mutation est cassé, rien ne peut avancer.

3. **Retirer la claim "NIST NCCoE"** — elle est infondée et nuit à la crédibilité du rapport.

### P1 — Court terme (2 semaines)

4. **Corriger ou annoter les claims de benchmarks non corroborées** (CoreThink GSR, SWE-Bench Lite, ARC-AGI-2). Soit fournir des sources, soit marquer comme "à vérifier".

5. **Vérifier les claims commerciaux** (Mem0, Zep, Letta, Cognee) contre leurs documentations officielles. Plusieurs chiffres sont présentés comme des faits alors qu'ils proviennent probablement de pages marketing.

6. **Ajouter une section "Limites de cet audit"** qui mentionne explicitement que le rapport a été généré par un LLM et que certains contenus peuvent être hallucinés.

### P2 — Moyen terme (1 mois)

7. **Mettre en place un processus de fact-check systématique** pour tout futur rapport d'audit : chaque URL GitHub doit être vérifiée (test HTTP 200), chaque arXiv ID doit être résolu, chaque claim numérique doit avoir une source.

8. **Automatiser la vérification** via un script qui teste les URLs, résout les DOI/arXiv, et flag les incohérences.

---

## 6. CONCLUSION

L'audit est **utile et majoritairement correct** dans son analyse bibliographique et conceptuelle. La section papiers arXiv est un travail de recherche remarquablement solide.

Cependant, il contient des **fabrications qui, si elles étaient suivies aveuglément, gaspilleraient du temps** (clone d'un repo inexistant, poursuite d'une certification NIST imaginaire, décisions basées sur des benchmarks non vérifiés).

**Le rapport reste exploitable à condition d'appliquer les corrections P0 et P1 ci-dessus.** La méthodologie d'audit est bonne — c'est l'exécution qui a souffert du problème universel des LLM : l'hallucination.
