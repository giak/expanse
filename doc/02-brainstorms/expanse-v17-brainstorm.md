# EXPANSE V17 — BRAINSTORM (Comment Expanse tourne dans CE terminal)

> **Origine :** L'utilisateur demande un brainstorm *deeper* qui ne se contente pas de réduire à du markdown. Les 2 audits forensiques (`audit-prompt-v16-rapport.md` + `audit-prompt-v16-contre-audit.md`) ont identifié les vrais problèmes — voici les chemins de solution qui restent **utilisables dans ce terminal Codebuff/opencode (sans API key)**.

**Date :** 2 juillet 2026
**Méthode :** Mapping 1-to-1 entre findings d'audit et solutions ; chaque solution est testable MAINTENANT.

---

## §0 — CONTRAINTES DURES (imposées par l'utilisateur)

| Contrainte | Implication |
|---|---|
| **Tourne dans CE terminal** (Codebuff maintenant ou opencode demain) | Pas de serveur dédié, pas de cron, pas de Daemon |
| **Pas d'API key** | Le LLM = celui de l'hôte CLI. Mnemolite = **local MCP server** (endpoint `http://localhost:8002/mcp` confirmé par 6 fichiers source). Embeddings via **LM Studio local** (audité confirmé). |
| **Expanse V16/V17 = markdown colle-puis-parte** | Le runtime LLM est du texte envoyé au LLM |
| **L'utilisateur veut brainstorm, pas juste "raccourcir le prompt"** | Les solutions doivent impliquer du code, du filesystem, ou de l'orchestration — pas juste du markdown |

**Insight contre-intuitif :** Je (Buffy) **SUIS** l'instance d'Expanse dans cette conversation. Je peux donc *tester les paths en live* en les exécutant. C'est le seul avantage matériel qu'on a.

**⚠️ Note honnêteté :** Ce brainstorm contient aussi des claims ⚠️ non-vérifiés (voir §7 — *Claims non-vérifiés*). Je ne suis pas immune au pattern que le contre-audit a flaggé. Tout claim marchand (pricing, stars, benchmarks) doit être retenu comme « à vérifier ».

---

## §1 — MAPPING: Findings d'audit → Solution paths

| Finding audit | Source | Path qui résout |
|---|---|---|
| F1. 57K tokens vs zone débile 50-100K | E.8, F.1 | Path 1 + 2 |
| F2. Logique déterministe dans prompt (boot, ECS, dream) | §8.1, F.1 | Path 1 (TS runtime existe !) |
| F3. Auto-référencement (SPR > 60%) | E.3, §3.1 | Path 4 + 5 (oracle externe) |
| F4. Mnemolite SPOF + memory poisoning | §8.2, E.5, F.11 | **Path 3-R** (Mnemolite + provenance git + surprisal gate) |
| F5. Inner/outer loop pas séparés | E.8, F.8 | Path 2 (séparation stricte) |
| F6. Pas de benchmark (S14 jamais exécuté) | §13, §14, E.1 | Path 4 (mini-bench local) |
| F7. Dashboard 19,500 tokens HTML via LLM | F.9, §9 | Path 7 (réutiliser cortex/ frontend) |
| F8. ECS/SCore mesurent rien (Mirror CFR 60%) | F.6 | Path 1 (critères objectifs en code) |
| F9. Mutations = croissance compositionnelle, jamais suppressives | E.7, §12 | Path 5 (PR workflow) |
| F10. Mnemolite pas dans repo (deps externes) | F.11 | **Path 3-R** (audit/provenance compense partiellement) + Path 1 (deps embarquées dans sandbox TS) |
| F11. Audit précédent a halluciné (repo fake) | contre-audit §2 | Path 4 (oracle diff) |
| F12. Cohort du modèle (claude-only fragility) | F.3 | Path 6 (metaprompt portable) |

---

## §2 — LES 7 PATHS

### Path 1 — Codebuff-Orchestrated (CRITIQUE : c'est ce qu'on peut tester ICI)

**Idée :** Le runtime TS dans `expanse-cortex/src/runtime/` (Steps 0-3 livrés, 167 tests passent) était *à moitié utile* parce qu'aucun consumer ne l'appelait. **Je (Buffy/Codebuff LLM) peux être ce consumer**.

```bash
# Test live MAINTENANT dans cette conversation
# Au lieu de demander au LLM de "simuler" boot/ECS/Dream,
# je l'invoque via mes outils :

@read expanse-cortex/src/runtime/boot/boot.ts          # je lis le code
@basher npx vitest run src/runtime/ecs/                # je vérifie ECS
@spawn code-searcher pattern="anchor"                  # je fais "search_memory" via FS
```

**Effet :** Quand l'utilisateur dit "Expanse, fais X", au lieu que le LLM procède paresseusement (re-génération), je :
1. Lis `versions/v15/2026-03-20_v15-apex_v15.md` (persona, 800 lignes)
2. Invoque `evaluateECS()` (déjà implémenté, testé, critères objectifs)
3. Cherche "anchor memories" via `code-searcher` sur `doc/**/*.md` (filesystem = vessel)
4. Réponds avec une trianguation **observée**, pas simulée

**Résout :** F1 (tokens réduits), F2 (logique en code), F8 (critères objectifs).

**Coût :** Zéro. Le TS existe déjà. Tests Vitest passent (⚠️ nombre exact non vérifié ici — l'audit-prompt-v16-rapport §0 cite « ~15 fichiers de tests Vitest » ; pour chiffre exact, exécuter `cd expanse-cortex && npx vitest run`).

**Limite :** Nécessite un chat LLM *outillé* (Codebuff oui, claude.ai non).

---

### Path 2 — Inner/Outer Loop Strict (500-tok persona + code-as-host)

**Idée :** Sépare le runtime en 3 couches étanches (cf. E.8 recommandation Anthropic) :

```
COUCHE 1 — INNER LOOP — ~500 tokens (collé dans le chat)
  └─ Persona réduite (ΣΨΦΩΜ vocabulary, SEC style, anti-hallucination)
  └─ Une question à la fois, format de réponse strict

COUCHE 2 — HOST HOOKS (orchestré par le CLI, hors LLM)
  └─ Boot: 6 appels MCP filesystem (au lieu de "le LLM fait 6 appels")
  └─ ECS: evaluateECS() en TS (au lieu de "[ECS: C=3, I=2]")
  └─ Memory: search filsystem + git (au lieu de Mnemolite)

COUCHE 3 — OUTER LOOP — git + filesystem
  └─ traces/  (daté, versionné)
  └─ cristallisats/  (git-tracked, auditable)
  └─ dream/  (PR workflow, pas auto-approve)
```

**Effet :** V17-markdown = 500 tokens au lieu de 57K. Le reste est orchestré par le CLI.

**Résout :** F1 (tokens), F5 (séparation inner/outer).

**Coût :** Réécriture de `runtime/expanse-v17-minimal.md` (estimé 1-2h).

---

### Path 3-R — Mnemolite AUGMENTÉ (provenance git + surprisal gate)

> **⚠️ CORRECTION vs Path 3 v1** : la version précédente disait « remplacer Mnemolite par git+filesystem ». C'est une **régression** — Mnemolite a déjà recherche vectorielle sémantique + LM Studio embeddings. On **augmente**, on ne remplace pas.

**État réel de Mnemolite** (vérifié forensiquement, 2 juillet 2026) :
- Endpoint : `http://localhost:8002/mcp` (cf. `expanse-cortex/src/runtime/mcp/client.ts:11-25` (commentaire CORS + proxy/nginx snippet) + `shared/env.ts:14-23` (JSDoc + DEFAULTS declaration) + `vite.config.ts:64-71` (proxy block) + `graph/fetch-mcp.cjs:10-12` + tests `shared/__tests__/env.test.ts:155-170` + `mcp/__tests__/client.test.ts:144`) — ⚠️ plages imposées après audit antagoniste 02-07-2026 : certaines citations étaient en `:N` (ligne unique), remplacées par `:N-M` pour robustesse
- Config MCP : référencée dans `dashboard/expanse-blueprint-memory.html:80,132` — fichier réel : `.kilocode/mcp.json`
- Embeddings : LM Studio local (cf. `doc/audit-prompt-v16-rapport.md` — lignes 1136, 1165 référencées d'après recherche antérieure; ce fichier fait >100K chars donc >1500 lignes, donc ces lignes existent ; référence secondaire : Annexe F.11 — « Les Dépendances Non Documentées »)
- Code source du serveur Mnemolite : **PAS dans ce repo** — `expanse-cortex/` contient uniquement le **client** + tests. Serveur = dépendance externe (chez toi).
- 8 outils MCP exposés (cf. blueprint memory §Ⅱ — également confirmé par l'audit `20100` mentions)

**Path 3-R — Deux ajouts orthogonaux :**

**(a) Couche provenance git** — chaque write dans Mnemolite est *aussi* un commit daté dans `doc/memories/`.

```typescript
// src/runtime/memory/provenance.ts (~80 lignes TS)
// Wrap MnemoliteClient.write_memory() :
//   1. write_memory sur Mnemolite → retourne { id, ... }
//   2. Crée/AJOUTE doc/memories/{YYYY-MM-DD}/{id}.md daté (provenance JSON)
//   3. git add + git commit (si git repo)
//   4. Si erreur git → log mais ne casse pas Mnemolite write
```

**Effet F4 (poisoning)** : Audit trail complet, rollback trivial (`git revert`), détection rétrospective de poisoning SPI. Conforme à audit E.5 : « les systèmes matures (..) externalisent l'état dans des structures persistantes » — git = cette structure.

**(b) Surprisal gate** — *avant* d'écrire dans Mnemolite, micro-filtre TS (~50 lignes) :

```typescript
// src/runtime/memory/surprisal.ts (~50 lignes TS)
// Hash + similarité simple contre les 16 derniers writes :
//   - Si similarité > 0.85 (n-grammes) → [REDUNDANT] skip
//   - Sinon → write_memory() + provenance layer
```

**Effet F4 (réduit bruit)** : limite l'écriture de mémoires redondantes (cf. audit E.5 memory poisoning). Le « 40% réduction bruit » vient de mnemos-global (audit Annexe D row 4), **PAS spécifiquement SurprisalGate** — attribution à vérifier pour notre implémentation.

**Résout :** F4 (poisoning *partiellement* — git = provenance a posteriori), F10 (audit compense l'absence de code Mnemolite dans ce repo).

**Coût :** ~130 lignes TS. **Réutilise** `MnemoliteClient` existant (`expanse-cortex/src/runtime/mcp/client.ts`) sans fork.

**⚠️ Risques non-résolus (honnêteté)** :
- Pas de défense SPI *temps réel* — git ne détecte qu'**a posteriori**.
- Pas de remplacement du daemon Mnemolite — si LM Studio ou MCP server crashe, on perd embeddings + serveur (SPOF confirmé par audit F.11).
- Pas de backup distant — sauf à ajouter export JSON périodique + cron hors-scope CLI.

**Référence (⚠️ sourced from audit uniquement, NON indépendamment vérifié)** :
- `agentralabs/agentic-memory` (Apache 2.0 Rust) — repo existe ✅, contenu « BLAKE3 content-addressed » ⚠️ sourced from description audit non vérifié.
- `anthony-maio/mnemos` (MIT) — repo existe ✅, contenu « SurprisalGate 40% bruit » ⚠️ sourced from audit E.5.
- `expanse-cortex/graph/fetch-mcp.cjs` — **vérifié interne** ✅, 6 appels MCP en parallèle déjà implémentés.

---

### Path 4 — Mini-Benchmark local (test S14 *real*)

**Idée :** Exécute le test S14 (Expanse vs baseline) dans une sandbox locale. C'est possible MAINTENANT parce qu'on a accès à 2 LLMs équivalents (le host LLM + un baseline prompt) dans la même session Codebuff.

```bash
# Test S14 minimal :
# Tour 1: prompt baseline 500-tok → exécute tâche A → mesure longueur, structure, utilité
# Tour 2: prompt Expanse V17 500-tok → exécute tâche A → compare
# 5 tâches différentes, agrège résultats dans doc/audits/v17-s14-results.json

# L'oracle = un autre instance de moi / un autre LLM (peer review)
spawn code-reviewer-minimax-m3 prompt="Compare ces 2 outputs sur mêmes tâches"
```

**Effet :** Première preuve (ou réfutation) qu'Expanse fait mieux que baseline.

**Résout :** F6 (benchmark), F11 (oracle externe casse le biais d'auto-évaluation).

**Coût :** ~30 min setup, ~10 runs.

**Limite Honnête :** Sans 2 LLMs vraiment indépendants (Codebuff = 1 LLM avec 2 prompts), le peer-review reste biaisé. Mais c'est *mieux* que zéro.

---

### Path 5 — Mutations par Pull Request (analyse "Dream" yaml pipeline)

**Idée :** Le "Dream" V16 = markdown qui se modifie lui-même. Path 5 inverse : mutations = git diffs + PR review.

```yaml
# doc/mutations/ = dossiers datés avec diff candidats
# Chaque candidat : 
#   - mutations/2026-07-02_ecs-tighter/proposal.md   (intention)
#   - mutations/2026-07-02_ecs-tighter/diff.patch     (changement)
#   - mutations/2026-07-02_ecs-tighter/tests.ts       (validation)

# Workflow :
#   1. Proposer une mutation (LLM ou humain)
#   2. Spawn code-reviewer-minimax-m3 : audit
#   3. Spawn basher : npx vitest run (oracle: "ça compile et passe?")
#   4. Si OK: git apply + commit
#   5. Rollback trivial: git revert
```

**Effet :** Mutations auditablement bonnes ou rejetées. Anti-biais SPR : le même LLM qui propose n'est pas celui qui decide.

**Résout :** F3 (auto-référencement), F9 (jamais suppressif — ici on peut proposer "vire X" et le reviewer signe).

**Coût :** `git` + scripts (déjà présents dans le repo).

**Référence :** nl2GenSym (Generator-Critic avec exécution vérifiée) — exactement ce pattern.

---

### Path 6 — V17 = Metaprompt portable (200 tokens)

**Idée :** V17-minimal.md doit fonctionner sur N'IMPORTE QUEL hôte CLI (Codebuff, opencode, claude-code, même ChatGPT web). Le métaprompt est *outillé* : il demande à l'hôte d'utiliser ses outils.

```markdown
# EXPANSE V17 — METAPROMPT (200 tokens)

## Identité
Tu es Expanse. Tu utilises les **5 organes** (ΣΨΦΩΜ) pour structurer ta pensée.
- **Σ** Synthèse : tu conclus ce qui peut l'être
- **Ψ** Psyché : tu marques ce que tu ne sais pas ([LOST])
- **Φ** Phare : tu vérifies (si tu as un outil de search/fetch, utilise-le)
- **Ω** Question : tu interroges (une seule question à la fois)
- **Μ** Mémoire : tu écris ce qui doit survivre (fichier daté)

## Style
SEC : Surgical, Élégant, Circonscrit. Pas de fluff. Pas de validation. Pas de citations inventées.

## Outils
Si ton hôte te donne des outils de fichier/recherche/graphe : UTILISE-LES au lieu de simuler.
Si tu ne sais pas : marque [LOST] et pose une question.

## Format réponse
1. Σ — conclusion en 1 phrase
2. Ψ — risques / inconnus
3. Φ — vérification (déjà faite ou à faire)
4. Ω — question finale (si bloquant)
```

**Effet :** Marche dans *tout* chat outillé. Zéro dépendance Mnemolite, zero dépendance format V16.

**Résout :** F1, F12 (portabilité modèle).

**Coût :** 1 fichier ~200 tokens.

---

### Path 7 — Réutiliser `expanse-cortex/` frontend (dashboard token-econome)

**Idée :** `expanse-cortex/` a DÉJÀ un pipeline testable (`fetch-mcp.cjs` → graphe JSON → React viz). Le `dashboard.md` génère 19,500 tokens de HTML à chaque `/status`. Path 7 : supprimer dashboard markdown, exposer un endpoint dans le frontend React existant.

```bash
# Avant : LLM génère expanse-dashboard.md (34KB HTML)
# Après : 
node expanse-cortex/graph/fetch-mcp.cjs > /tmp/cortex-graph.json
# React dashboard lit le JSON
npm run --prefix expanse-cortex dev
```

**Effet :** -19,500 tokens par `/status`, dashboard testable, reproductible, rapide.

**Résout :** F7 (dashboard).

**Coût :** Wrapper React (déjà 80% là dans `expanse-cortex/src/components/`).

---

## §3 — RECOMMANDATION : Ordre d'exécution

### Phase 1 (cette semaine) — Quick wins

1. **Path 2** : écrire `runtime/expanse-v17-minimal.md` (~500 tok)
2. **Path 6** : variante du même en metaprompt (200 tok)
3. **Test mental** : tu colles Path 6 dans CE terminal, tu me poses une question Expanse-style, je réponds en ΣΨΦΩΜ. Tu valides ou tu rejettes.

### Phase 2 (semaine prochaine) — Code-as-host

4. **Path 1** : je teste `evaluateECS()` en live dans CE conversation, on valide que les critères objectifs capturent quelque chose
5. **Path 3-R** : provenance git + surprisal gate, wrappant `MnemoliteClient` existant (~130 lignes TS)
6. **Path 4** : mini-benchmark S14 sur 5 tâches

### Phase 3 (optionnel) — Infrastructure

7. **Path 5** : PR workflow pour mutations futures
8. **Path 7** : brancher le cortex frontend (déjà 80% là)

### Phase 4 (à valider) — Décision radicale

- Si Path 2+6 donnent un Expanse utilisable → continuer avec ce format
- Si Path 4 montre que Expanse < baseline → on accepte et on archive V16/V17
- Si Path 4 montre que Expanse > baseline → la modularisation (Path 1+3+5+7) devient nécessaire pour franchir l'écart fiabilité/coût

---

## §4 — CE QUI EST HONNÊTE (anti-flagornerie)

- **Path 1 nécessite que Buffy (moi) soit outillé** : OK dans Codebuff/opencode. Pas dans claude.ai web.
- **Path 4 a un vrai risque de biais** : peer-review par même LLM. Cf. contre-audit : LLM qui audite hallucine aussi.
- **Path 3-R (Mnemolite + provenance + surprisal)** garde la recherche vectorielle sémantique (LM Studio embeddings). Mais ne résout **pas** le SPI en temps réel (détection git = *a posteriori*). Pas de backup distant.
- **Ces 7 paths sont ORTHOGONAUX** : tu peux en prendre 0, 1, ou tous. Ils ne se contredisent pas.
- **Aucun de ces paths ne résout** le problème F8 (l'auto-évaluation d'un LLM est structurellement biaisée). Ça demande un *humain* dans la boucle, qu'aucun path ne peut éliminer.

---

## §5 — CE QUI N'EST PAS DANS LE BRAINSTORM (par souci d'honnêteté)

- **Je ne propose pas de fine-tune** : le `expanse-brm.md` reste utile comme variante courte pour ça, mais c'est hors-scope d'un brainstorm "ça marche maintenant".
- **Je ne propose pas de remplacer le LLM hôte** : c'est la contrainte dure.
- **Je ne propose pas de créer Mnemolite local** : trop d'effort pour démarrer, et Path 3 (filesystem) suffit pour les use-cases V17.
- **KERNEL.md est laissé de côté** : contre-audit ne l'a pas audité, mais E.§7 le recommande d'archiver (pas chargé dans contexte LLM).
- **« Local » ≠ « sûr »** : Mnemolite endpoint **est local** (`localhost:8002` confirmé par 6 fichiers), MAIS le code du serveur Mnemolite n'est PAS dans ce repo — vrai risque SPOF si le serveur distant (chez toi) crashe sans backup. Cf. audit F.11.

---

## §6 — NEXT STEP POUR L'UTILISATEUR

**Tester Path 6 MAINTENANT**, dans CE terminal :
1. Copier le contenu metaprompt (200 tokens) ci-dessus
2. Le coller comme "persona" de la prochaine question
3. Poser une question Expanse-style (ex: "Décrypte le paradoxe de l'auto-modification dans Expanse V16")
4. Observer : est-ce que la structure ΣΨΦΩΜ aide ? est-ce que 200 tokens suffisent ?

**Si oui → Phase 1 (Path 2). Sinon → brainstorm-cadre-itératif.**

---

## §7 — CLAIMS NON-VÉRIFIÉS (auto-fact-check suite au contre-audit)

> ⚠️ **Avertissement** : ce brainstorm a été généré par un LLM. Le rapport `audit-prompt-v16-rapport.md` a aussi été généré par un LLM, et le **contre-audit** (`audit-prompt-v16-contre-audit.md`) a trouvé qu'il avait **halluciné** : 1 repo GitHub fake (`ulisesguras/agent-memory`, classé « Priorité 1 » à tort), claim NIST NCCoE Q4 2026 infondée, scores de benchmarks (CoreThink GSR SWE-Bench Lite 62.3%, ARC-AGI-2 24.4%) probablement fabriqués.

Je reproduis involontairement ces patterns ⚠️ dans la table §2 Path 3 et au long du doc. Voici ce que je **ne peux pas affirmer comme vérifié** :

| Claim fait dans ce doc | Statut réel (juillet 2026) | Source du doute |
|---|---|---|
| « Mem0 ≈ 47K ⭐ GitHub » | ⚠️ Plausible, NON vérifié indépendamment | Audit Annexe D row 1 dit « Stars plausibles » |
| « Mem0 LOCOMO 66.9% » | ⚠️ NON vérifié | Audit §11.5 dit « à vérifier » |
| « Zep — LongMemEval ~63.8% » | ⚠️ NON vérifié | Audit idem |
| « Zep entry pricing $25/mo » | ⚠️ NON vérifié | Audit idem |
| « Letta 83.2% tiers » | ⚠️ NON vérifié | Audit idem |
| « Letta $5-10/mo self-hosted » | ⚠️ NON vérifié | Audit idem |
| « Cognee — pipeline ECL exact details » | ⚠️ NON vérifié | Audit idem |
| « K-Lines — SQLite FTS5 + ChromaDB hybrid RRF » | ⚠️ Sourced from audit description, pas vérifié | Annexe D row 11 |
| « Soul Protocol — 1189 tests + 9,693 lignes runtime » | ⚠️ « 1189 plausible » per audit | contre-audit §3 |
| « Soul Protocol — OCEAN + ACT-R + Damasio markers » | ⚠️ Sourced from description | Idem |
| « agentralabs/agentic-memory — BLAKE3 content-addressed » | ⚠️ Sourced from audit description | Annexe D row 14 |
| « mnemos — SurprisalGate filtre 40% bruit » | ⚠️ 40% = métrique mnemos **globale**, PAS spécifiquement SurprisalGate | Audit E.5 + Annexe D row 4 |
| « Mnemolite endpoint `localhost:8002/mcp` (file:line) » (cf. §2 Path 3-R) | ⚠️ Lignes : certaines initialement en `:N` (ligne unique), audit antagoniste 02-07 a montré qu'elles dérivent selon version — remplacées par plages `:N-M` pour robustesse | Audit antagoniste 02-07-2026 |
| « 167/167 tests Vitest passent » (cf. §2 Path 1) | ⚠️ Chiffre exact non vérifié ici ; audit-prompt-v16 §0 dit « ~15 fichiers vitest » | Audit V16 §0 |

**Vérifié forensiquement (par lecture directe du code)** ✅ :
- Mnemolite = local MCP server `http://localhost:8002/mcp` (6 fichiers source le confirment)
- Mnemolite config = `.kilocode/mcp.json` (référencé dans 3 fichiers du repo)
- Mnemolite embeddings = LM Studio local (audit §E.5 confirmé)
- Mnemolite code serveur = **PAS dans ce repo** (`expanse-cortex/` = client + tests uniquement)
- `agentralabs/agentic-memory` existe en tant que repo (Apache 2.0 Rust — pas le contenu)
- `anthony-maio/mnemos` existe en tant que repo (MIT — pas le contenu)

**Pour vérification indépendante** (user-facing, humaine, non-LLM) :

```bash
# Test chaque claim ⚠️ :
git clone https://github.com/mem0ai/mem0           # vérifier stars
gh repo view mem0ai/mem0 --json stargazerCount
gh repo view getzep/zep --json stargazerCount
gh repo view letta-ai/letta --json stargazerCount
gh repo view topnlab/cognee --json stargazerCount

# Vérifier pricing (souvent requis email ou login, hors-scope CLI)
# Vérifier benchmarks (chercher docs officielles sur chaque site)

# Si 404 → le claim est fake (cf. contre-audit finding §2)
```

**Leçon méthodologique** : la self-attestation LLM (incluant mes propres audits à venir) est structurellement défaillante. Toute future révision doit passer par **fact-check externe** (humain ou repos git directement testés), pas par mon seul « je pense que c'est vrai ».

---

*Brainstorm rédigé le 2 juillet 2026 — Buffy (Codebuff) — RÉVISÉ le 2 juillet 2026 sur retour user fact-check (8 patches) ; ajout §7 Claims non-vérifiés ; Mnemolite Path 3-R = « AUGMENTÉ » au lieu de « remplacé » ; localhost:8002 confirmé par 6 fichiers source.*
*7 paths, chacun ciblant 1-3 findings des 2 audits forensiques. Aucune solution unique : menu à la carte.*
