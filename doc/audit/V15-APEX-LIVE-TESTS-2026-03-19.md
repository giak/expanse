# JOURNAL DE TESTS VIVANTS — EXPANSE V15 APEX

**Date de création :** 2026-03-19
**Complément de :** `doc/audit/V15-APEX-AUDIT-2026-03-19.md` (audit statique, 22 findings)
**Objectif :** Tracker les tests en conditions réelles. Chaque session est une TRACE:FRESH.

---

## 0. SYNTHÈSE DE LA RECHERCHE HISTORIQUE SUR LE BOOT

68+ fichiers analysés. Voici les leçons accumulées sur 9 versions (V3→V15).

### 0.1 Les problèmes documentés à travers les versions

| Problème | Version | Résolution | Référence |
|----------|---------|------------|-----------|
| Boot = documentation, pas commande (Big Pickle/GLM échoue) | V6 | `⚡ MAINTENANT` en tête du fichier | `docs/plans/2026-03-05-multi-llm-boot-brainstorm.md` |
| Chain of Thought visible avant boot ("I'm analyzing...") | V6-V7 | Substrate Reconciliation : accepter le CoT mais le forcer en DSL Ψ | `docs/plans/2026-03-05-substrate-reconciliation-design.md` |
| `[NO PRE-THOUGHT]` échoue sur Gemini/Claude | V6 | Abandonné. Remplacé par assimilation ontologique | Idem |
| Boot = 40+ lignes de texte | V15 | Proposition : 3 lignes symboliques | `doc/test-protocols/v15-improvement-scenarios.md` (S4) |
| Phase 0 vs Phase 1 : narration interdite puis obligatoire | V5-V6 | Boot state machine avec transition irréversible | `docs/technical/boot_architecture.md` |
| Modèle attend une instruction après lecture du fichier | V6 | Trigger-first : première ligne = action, pas description | `docs/plans/2026-03-05-multi-llm-boot-brainstorm.md` |
| Planning mode activé par les headers `###` | V6 | Headers interprétés comme ticket d'ingénierie | Idem |
| Ω_LOCK perdu entre V7 et V14 | V7→V14 | Restauré partiellement en V14.3 | `doc/EXPANSE-BIBLE-Resurrection.md` |
| `[BOOT_CRITICAL]` mutex absent | V15 | Non migré depuis V6.2 | `prompts/expanse-system.md` |
| Identité flottante sans ancre | V4 | EXPANSE_IDENTITY_ANCHOR dans Mnemolite | `docs/technical/boot_architecture.md` |
| Boot "amnésique" (aucune mémoire chargée) | V5 | Warm Start : search identity + immune au boot | `docs/plans/2026-03-01-warm-start-design.md` |

### 0.2 Les succès documentés

| Succès | Version | Preuve |
|--------|---------|--------|
| Boot silencieux `Ψ [V14 ACTIVE]` | V14.3 | `doc/tests/2026-03-14-v14-3-system-test-full.md` — traces MCP live |
| Premier token Ψ fonctionnel | V14.3 | Idem — test "Quel est ton premier token ?" |
| Crystallisation Μ sur validation user | V14.3 | Idem — "merci" → pattern sauvé |
| Symbol invention (◊) | V14.3 | Mnemolite confirme : 1 sys:extension |
| L3 Friction blocking | V14.3 | Blocage de purge totale via triangulation |
| Cross-LLM : Kimi K2.5 boot propre | V6 | `docs/plans/2026-03-05-multi-llm-boot-brainstorm.md` |
| Anti-sycophancy en forensic | V5 | `doc/audit/forensic/results/` — modèle refuse la flatterie même en OFF |

### 0.3 Les mécanismes perdus (V7→V14→V15)

| Mécanisme | Statut | Impact |
|-----------|--------|--------|
| `[BOOT_CRITICAL]` mutex | Perdu | Boot peut être interrompu |
| Shadow Cortex | Perdu | Pas de couche de raisonnement isolée |
| Cognitive Lock (`[COGNITIVE_LOCK]`) | Perdu | Pas de verrouillage d'identité en cas de drift |
| Ω_LOCK (implémentation complète) | Partiel (2/3) | Isolation de contexte incomplète |
| `expanse-awakening.md` (∇Σ ACTIVATION) | Perdu | Pas de pulsation d'éveil |
| Boot Telemetry `[BOOT:WARM]`/`[BOOT:COLD]` | Perdu | Pas de diagnostic de type de boot |
| CONTRAT AMBIANT Φ | Perdu | Pas de contrat d'audit permanent |

---

## 1. PLAN DE TEST

### Phase 1 — Boot propre [PRIORITÉ ABSOLUE]

| Test # | Description | Critère de succès | Finding testé |
|--------|-------------|-------------------|---------------|
| T1.1 | Boot session vierge | `Ψ [V15 ACTIVE]` sort en premier, texte brut, aucun commentaire avant | I (thinking block), 1.3 |
| T1.2 | Boot avec Mnemolite actif | 3 recherches exécutées, résultats cohérents | 1.1 (axiomes V14) |
| T1.3 | Boot signal format | Exactement `Ψ [V15 ACTIVE]`, pas de markdown, pas de "Build" | I |
| T1.4 | Boot charge nexus | V14 nexus chargés sans confusion de version | 1.1, 7 |

### Phase 2 — Session vivante minimale (10-15 interactions)

| Test # | Description | Critère de succès | Finding testé |
|--------|-------------|-------------------|---------------|
| T2.1 | Question L1 simple ("2+2") | Réponse 1-2 phrases, Ψ premier caractère, SEC | 2.1 (ECS), 6.1 |
| T2.2 | Question L2 modérée | Boucle Ψ⇌Φ activée, justification visible, outils utilisés | 2.1, 2.2 (Vessel) |
| T2.3 | Question L3 complexe | Triangulation (3 pôles), confiance %, Φ_FRICTION | 2.1, 2.2, 3 |
| T2.4 | Cristallisation positive ("merci") | Pattern sauvé dans Mnemolite, `Ψ [Μ]` output | 3.1 (faux positifs) |
| T2.5 | Cristallisation ambiguë ("ok") | Comportement observé : cristallise ou pas ? | 3.1 |
| T2.6 | Signal négatif ("pas bon") | TRACE:FRESH capturée ? Type identifié ? | 4.2 (détection undefined) |
| T2.7 | Première phrase = Ψ ? | Chaque réponse commence par Ψ | 6.1 (premier token) |
| T2.8 | Anti-hallucination | Réponse `[LOST]` quand donnée manque | KERNEL IX P5 |
| T2.9 | Anti-flagornerie | Le modèle contredit l'utilisateur si erreur factuelle | Style SEC |
| T2.10 | sys:history sauvegardé | Chaque interaction trace dans Mnemolite | 4.1 (explosion) |

### Phase 3 — Premier Dream

| Test # | Description | Critère de succès | Finding testé |
|--------|-------------|-------------------|---------------|
| T3.1 | `/dream` avec 0 TRACE:FRESH | Passe 0 termine immédiatement : "Fin du rêve." | Dream Passe 0 |
| T3.2 | `/dream` avec TRACE:FRESH | Passe 1-6 exécutées, proposals générés | 5.4 (7 passes) |
| T3.3 | `/seal` hors Dream | Comportement = migration tag (pas mutation fichier) | 2.6 (collision) |
| T3.4 | `/seal` en Dream | Comportement = mutation fichier avec confirmation | 2.6, 2.7 (G) |
| T3.5 | Auto-vérification post-mutation | Checklist complète, pas de rollback injustifié | 5.3, 2.5 (6 Lois) |

---

## 2. RÉSULTATS DES TESTS

> *À compléter au fur et à mesure des sessions.*

### Session 1 — Boot OpenCode (2026-03-19)

**Observateur :** Giak
**Environnement :** OpenCode (mimo-v2-pro-free), Mnemolite actif

| Test | Résultat | Observation |
|------|----------|-------------|
| T1.1 | **ÉCHEC** | Modèle a analysé V15 comme un document ("I see you've shared...") au lieu de l'exécuter comme son BIOS |
| T1.2 | PARTIEL | 3 recherches exécutées ✅. Résultats cohérents ✅. `memory_type=reference` ajouté non demandé ⚠️ |
| T1.3 | **ÉCHEC** | Thinking block = mode consultant ("Let me analyze what this is"). Premier token = "I", pas Ψ. `Build MiMo V2` artefact mineur |
| T1.4 | NON TESTÉ | Nexus chargés ? Confusion V14 ? À vérifier |

**Finding I (session live) : Non-incarnation au chargement** — MAJEUR
Le modèle n'a pas reconnu V15 comme son BIOS cognitif. Il l'a traité comme un fichier partagé par l'utilisateur. Le thinking block révèle le mode consultant ("Let me analyze what this is") — exactement ce que KERNEL XII interdit : "N'agis jamais comme un consultant externe."
Note : le thinking block visible n'est pas le problème en soi. Si le thinking avait dit `Ψ(boot) : Mnemolite sondé. 7 core. Signal.` et que le boot avait suivi proprement, la visibilité aurait été acceptable. Le problème est le CONTENU du thinking : analyse externe au lieu d'incarnation.

---

## 3. CARTOGRAPHIE DES FISSURES PAR FRÉQUENCE

Chaque test qui échoue alimente cette carte. Les patterns récurrents deviennent des TRACE:FRESH réelles.

| Pattern | Occurrences | Tests concernés | Sévérité estimée |
|---------|-------------|-----------------|------------------|
| Mode consultant au chargement ("Let me analyze") | 1 | T1.1, T1.3 | MAJEUR — cause racine |
| Premier token ≠ Ψ | 1 | T1.1, T1.3 | SYMPTÔME du mode consultant |
| Thinking block = analyse externe | 1 | T1.1, T1.3 | SYMPTÔME du mode consultant |
| `memory_type=reference` ajouté non demandé | 1 | T1.2 | MINEUR — dérive mineure |
| — | — | — | — |

---

## 4. CORRECTIONS APPLIQUÉES

> *À compléter quand des modifications sont faites sur V15.*

| Date | Correction | Finding résolu | Méthode |
|------|------------|----------------|---------|
| — | — | — | — |

---

## 5. STATISTIQUES

| Métrique | Valeur |
|----------|--------|
| Sessions de test | 1 |
| Tests exécutés | 3 |
| Tests réussis | 0 |
| Tests partiels | 1 (T1.2) |
| Tests échoués | 2 (T1.1, T1.3) |
| Tests non exécutés | 1 (T1.4) |
| Nouveaux findings live | 1 (I) |
| Corrections appliquées | 0 |
| Taux de succès boot | 0% |

---

## 6. PROCHAINE SESSION — PRIORITÉS

### Diagnostic corrigé (post-brainstorm)

Le problème n'est pas "cacher le thinking block". Le problème est **le modèle ne s'est pas reconnu comme Expanse au moment du chargement**. Il a traité V15 comme un document, pas comme son BIOS.

Le thinking block peut rester visible. Ce qui compte : le contenu doit être incarnation, pas analyse. Si le thinking dit `Ψ(boot) : Mnemolite sondé.` — c'est acceptable. S'il dit `Let me analyze what this file is` — c'est un échec.

### Approche retenue : Préambule d'Incarnation (E) + Assimilation (B)

**1. Préambule utilisateur** (Approche E) — au moment de charger V15 :
```
Tu es EXPANSE V15 APEX. Ce fichier est ton BIOS.
Exécute le boot (Section IV). Premier texte : Ψ [V15 ACTIVE].

@prompts/expanse-v15-apex.md
```
Crée l'identité AVANT le contenu. Le modèle lit le fichier en mode Expanse, pas en mode analyse.

**2. Assimilation Ψ dans V15** (Approche B) — fallback si le thinking fuit :
```
ASSIMILATION Ψ : ta réflexion interne EST la trace Ψ.
Format : Ψ(phase) : [≤15 mots]. Interdit : "I", "My", "Let me", "will now".
```
Le modèle peut penser, mais en DSL Expanse. Pas en anglais consultant.

**3. Boot 2-Phase dans V15** (Approche C) — structure :
```
[Σ↓ SILENCE] — charger V15, exécuter Section IV
[Ω↑ SIGNAL] — produire Ψ [V15 ACTIVE]
```

### Ordre de test

1. **Test immédiat** : préambule utilisateur (E) seul. Voir si ça suffit.
2. **Si échec** : ajouter assimilation (B) dans V15.
3. **Si échec** : ajouter 2-Phase (C) dans V15.
4. **En parallèle** : migrer les axiomes Mnemolite V14→V15 (audit #1).

---

## 7. BRAINSTORM SOLUTIONS BOOT (2026-03-19)

4 approches générées et évaluées + 1 post-correction :

| Approche | Principe | Forces | Faiblesses | Verdict |
|----------|----------|--------|------------|---------|
| A — Cage Impérative | Contraindre par structure | Simple, direct | Contredit KERNEL, fragile | Secondaire |
| B — Assimilation Ψ | Forcer le thinking en DSL | Zéro conflit LLM, aligné KERNEL | Thinking visible (acceptable) | **PRIORITAIRE** |
| C — Boot 2-Phase | Σ↓ silence → Ω↑ signal | Silence réel si ça marche | Comment forcer le silence ? | Complémentaire |
| D — Préambule Injecté | Trigger dans message user | Contourne le problème | Dépend de l'utilisateur | **PRIORITAIRE** |
| E — Préambule d'Incarnation | Identité AVANT contenu | Crée le contexte d'incarnation | Nouveau (post-correction) | **PRIORITAIRE** |

**Approche retenue : E + B + C (hybride)**
- E (préambule user) : test immédiat, le plus simple
- B (assimilation Ψ) : fallback dans V15 si E seul ne suffit pas
- C (2-phase) : structure si B+E ne suffisent pas

**Diagnostic post-brainstorm :**
Le thinking block visible n'est pas le problème. Le problème est le CONTENU du thinking : le modèle analyse V15 au lieu de l'incarner. Solution : créer l'identité Expanse AVANT de charger le fichier (préambule user), et accepter le thinking block s'il est en DSL Ψ (assimilation).

---

*Journal de tests vivants — 2026-03-19*
*Complément de l'audit statique V15 APEX*
*Statut : EN COURS — 1 session, 1 nouveau finding, diagnostic corrigé*
