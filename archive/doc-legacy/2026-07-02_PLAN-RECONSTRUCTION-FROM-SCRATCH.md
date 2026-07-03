# PLAN D'ACTION — Expanse Reconstruction From Scratch

**Date :** 2 juillet 2026
**Auteur :** Buffy (Codebuff, GLM-5.2)
**Contexte :** Audit forensique complet (`audit-prompt-v16-rapport.md` + `audit-prompt-v16-contre-audit.md`)
**Décisions utilisateur :** TypeScript · Validation d'abord · Garder Mnemolite

---

## 📊 STATUS DASHBOARD (suivi rapide)

> Vue scan-able. Pour le détail complet (problèmes, choix, leçons) voir la section « 📓 NOTES DE SUIVI » en fin de document.

| # | Step | Statut | Date | Lignes | Tests | Décisions clés |
|---|------|--------|------|--------|-------|----------------|
| 0 | Scaffold runtime TS | 🟢 Complète | 2 juil 2026 | ~225 | 22/22 ✓ | Types partagés, `vitest setup` manquant fixé |
| 1 | MnemoliteClient (TS port de `fetch-mcp.cjs`) | 🟢 Complète | 2 juil 2026 | ~225 | 36/36 ✓ | Universel browser+Node, env fallback, NaN-safe port parsing |
| 2 | Boot script programmatique | 🟢 Complète | 2 juil 2026 | ~285 | 47/47 ✓ | `runBoot` résilient (Promise.allSettled + offline fallback), `formatBootContext` ~200 token, `assertBootHealthy` invariants audit §3.1 |
| 3 | ECS pure function | 🟢 Complète | 2 juil 2026 | ~115 | 36/36 ✓ | `evaluateECS(input) → ECSEvaluation`, Unicode-aware regex (lookaround `\p{L}` + plural `\w*`), reason string déterministe ≤120 chars |
| **4** | **S14 Test** ⚡ | ⬜ **À faire** | — | — | — | **Moment de vérité — gate décisionnel** |
| 5 | Distillation prompt | ⬜ À faire (dépend S14) | — | ~-54K tokens | — | 57K → 1-2K tokens |
| 6 | Triangulation 3-pôle | ⬜ À faire | — | — | — | `Promise.allSettled` sur 3 poles |
| 7 | Dream cron job | ⬜ À faire | — | ~-8.9K | — | Anti-biais additif (`change: 'remove'`) |
| 8 | Backup Mnemolite | ⬜ À faire | — | — | — | Export JSON + git cron |
| 9 | Sécurité mémoire | ⬜ À faire | — | — | — | Provenance + validation injections |
| 10 | Dashboard → cortex route | ⬜ À faire | — | ~-9.9K | — | Route React `/status` |

### 🟢 Progression : 4 / 10 steps complets (40%)

### ⚡ Prochaine action

**Step 4 — LE TEST S14 : Expanse vs Baseline.** ⚡ **MOMENT DE VÉRITÉ**. Pré-requis validés (Steps 0–3). C'est le test qui valide ou invalide toute l'approche — 3 conditions × 10 tâches, gate décisionnel.

### 🏝️ Last 5 incidents (cf. journal pour détail)

1. **`runBoot` isOnline() pre-check** ajoutait 1 round trip à CHAQUE boot (régression perf 99% en ligne) — remplacé par flag opt-in `skipVesselOnOffline`
2. **`OFFLINE_SNAPSHOT` + `online: false`** invariant non documenté — factory `makeOfflineBootContext()` ajoutée pour bundling
3. **`withTimeout`** micro-race : rejection du perdant non absorbée — `void Promise.allSettled([p, timeout])` en finally
4. **Factory helpers `makeBoot/makeBootContext`** dupliquaient `health` (sortait pas le nouveau invariant `health === snapshot.health`) — refactor avec derive depuis `snapshot.health`
5. **`process` non résolu** en TS strict sans `@types/node` — helper `readNodeEnv()` ajouté (Step 1, toujours actif)
6. **Contract surface finalized** for Steps 3/6/7/9 — 4 sub-modules (ecs, triangulation, dream, security) now expose interface-level types + 26 interface tests + barrel re-exports. Logic still pending; future implementers replace function-shape stubs (`EvaluateECS`, `PoleFunction`, `RunDreamJob`, `ValidateMemory`) in place without breaking the contract. Bonus: AURA constants drift (Step 9 predecessor) payé — `scenarioContext.test.ts` 3 failures session précédente → 0.
7. **Step 3 ECS regex journey (3 itérations)** — `\b` JS est ASCII-only même avec `/u` flag dans Node 22, donc `\bsécurité\b` reject silencieusement `sécurité + espace`. Le pattern correct = `(?<![\p{L}\p{N}_])(...)(?![\p{L}\p{N}_])` (lookaround Unicode-property-class). Plural support `systèmes/sécurités/vulnérabilités` absorbé par `\w*` AVANT le lookaround. French/English stratégique alignment via `strat[ée]g\w+` (l'`i` mangé par `\w+` permet "y" anglais ET "ie" français). 2 tests de lock-in ajoutés (French `stratégie` + plural `systèmes`) pour qu'un futur "simplify" en `strateg\w+` casse loud.

### 🔍 Métriques clés

- **Lignes de code runtime :** ~1020 (code) + ~1210 (tests) = **~2230 lignes**
- **Tests :** 167 (22 + 36 + 47 + 26 contracts + 36 ecs-evaluate)
- **Bugs capturés en revue avant validation :** 17 (3 nouveaux sur Step 3)
- **Réduction tokens visée au step 10 :** 57K → ~1-2K (97%)

---

## PRINCIPE DIRECTEUR

Chaque step produit un artefact testable. Aucun step ne casse ce qui existe.
Le **Step 4 (test S14)** est le moment de vérité — tout ce qui suit dépend de son résultat.

---

## DIAGNOSTIC DE L'AUDIT (rappel)

### Les 3 vérités qui dérangent

1. **Expanse soigne le symptôme, pas la maladie.** Le problème fondamental des LLMs n'est pas qu'ils manquent d'identité — c'est qu'ils sont stateless. Expanse compense par un prompt de 57K tokens. La vraie solution est un runtime formel qui externalise l'état.

2. **Le système ne peut pas mesurer sa propre efficacité.** Dream, Triangulation, ECS, Cristallisation sont tous auto-référentiels. Les papiers 2026 (Self-Preservation Bias, Self-Attribution Bias) montrent que cette boucle est biaisée.

3. **Le système optimise pour la complexité, pas l'utilité.** 16/18 mutations acceptées. Jamais une mutation de suppression. La constitution grossit sans preuve d'amélioration.

### Vulnérabilités critiques

- **Memory poisoning :** 99.8% de succès sur GPT-5.5, zero défense dans Expanse
- **Self-preservation bias :** SPR > 60% sur 23 modèles, le Dream auto-évalue ses mutations
- **Prompt sprawl :** dégradation mesurable au-delà de 2500-3000 tokens, Expanse est à 57K
- **Context rot :** dumb zone commence à 50-100K tokens
- **Mnemolite SPOF :** pas de backup, pas de provenance, pas de validation en écriture
- **Coût :** $300-1000+/mois pour un système non benchmarké

### Ce qui existe et fonctionne

- `expanse-cortex/` : React 19, TypeScript, Vite, Vitest, Playwright — vrai code testable
- `graph/fetch-mcp.cjs` : pipeline MCP (12 endpoints Mnemolite, SSE parsing) — prouve que Node peut parler à Mnemolite
- `runtime/expanse-brm.md` : template brainstorm (20 lignes, efficace)
- KERNEL.md : document philosophique cohérent (mais ne devrait pas être dans le contexte LLM)

---

## ARCHITECTURE CIBLE

```
┌─────────────────────────────────────────────────────┐
│                EXISTE DÉJÀ (garder tel quel)          │
│  expanse-cortex/  →  React frontend + tests Vitest   │
│  graph/fetch-mcp.cjs  →  pipeline MCP (12 endpoints) │
│  KERNEL.md  →  document philosophique (référence)    │
└─────────────────────────────────────────────────────┘
                        ↓ partage de types
┌─────────────────────────────────────────────────────┐
│              À CONSTRUIRE (nouveau)                   │
│  expanse-cortex/src/runtime/                         │
│    mcp/client.ts        →  MnemoliteClient (TS)      │
│    boot/boot.ts         →  script boot programmatique│
│    ecs/evaluate.ts      →  ECS pure function         │
│    triangulation/       →  3-pôle en code            │
│    dream/cron.ts        →  Dream comme cron job      │
│    security/            →  provenance mémoire        │
│    identity-prompt.md   →  ~1000 tokens (pas 57K)    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              MÉMOIRE (garder + backup)                │
│  Mnemolite (MCP server)  →  via MnemoliteClient      │
│  + export JSON → git backup                           │
└─────────────────────────────────────────────────────┘
```

### Règle de séparation inner loop / outer loop

- **Inner loop** (par appel LLM) : contexte frais reconstruit (~1-2K tokens) — boot context + identité + tâche
- **Outer loop** (durable) : Mnemolite (mémoire), fichiers (code), git (historique)
- **Jamais** : mélanger les deux dans le même espace de contexte (le problème de V15/V16)

---

## CE QU'ON GARDE DE V15/V16

| Élément | Forme originale | Nouvelle forme |
|---------|----------------|----------------|
| ΣΨΦΩΜ | 57K tokens de prompt | Vocabulaire dans ~500 tokens |
| ECS | Auto-évaluée par LLM | `evaluateECS()` fonction pure |
| Boot | 6 appels par LLM | `boot.ts` script |
| Triangulation | LLM auto-vérifie | 3 appels parallèles en code |
| Dream | 717 lignes markdown | Script + prompt 500 tokens |
| Dashboard | 35KB HTML généré par LLM | Route React dans cortex |
| Cristallisation | LLM compte interactions | State machine en code |
| BRM | Template markdown (20 lignes) | **Gardé tel quel** (efficace) |
| KERNEL | 14K tokens chargés | **Archivé** (référence privée, pas dans le contexte) |
| Cortex frontend | Existe, marche, testé | **Base du nouveau runtime** |

---

## LES 10 BABY STEPS

### Step 0 — Scaffold du runtime TypeScript (Jour 1)

**Objectif :** Créer la structure de fichiers dans le cortex existant.

**Pourquoi :** Le cortex a déjà tsconfig, vitest, eslint, types. On réutilise tout.

**Actions :**
- Créer `expanse-cortex/src/runtime/` avec sous-dossiers :
  - `mcp/` — client Mnemolite
  - `boot/` — script de boot
  - `ecs/` — évaluation de complexité
  - `triangulation/` — 3-pôle
  - `dream/` — cron job introspection
  - `security/` — provenance + validation mémoire
- Définir les types core dans `runtime/types.ts` :
  - `ECSResult` : `{ C: number, I: number, route: 'L1' | 'L2' | 'L3' }`
  - `BootContext` : `{ snapshot, protocols, vessel, health, timestamp }`
  - `MnemoliteMemory` : `{ id, title, content, tags[], created_at, lifecycle_state }`
  - `TraceFresh` : `{ id, symptom, context, created_at }`
  - `DriftSignal` : `{ id, type, description, created_at }`
- Créer `runtime/__tests__/` vide

**Artefact :** `pnpm test` passe (tests vides). `pnpm lint` passe.

**Test de validation :** `tsc --noEmit` — 0 erreur.

---

### Step 1 — MnemoliteClient en TypeScript (Jour 2-3)

**Objectif :** Port de `fetch-mcp.cjs` en classe TypeScript réutilisable.

**Pourquoi :** `fetch-mcp.cjs` prouve que Node.js peut appeler Mnemolite (SSE, 12 endpoints). Mais c'est un script one-shot, pas une API réutilisable. Le runtime a besoin d'un client typé.

**Actions :**
- `mcp/client.ts` : classe `MnemoliteClient` avec méthodes :
  - `getSystemSnapshot(repo: string): Promise<Snapshot>`
  - `searchMemory(args: SearchArgs): Promise<Memory[]>`
  - `writeMemory(args: WriteArgs): Promise<string>`
  - `updateMemory(id: string, args: Partial<WriteArgs>): Promise<void>`
  - `indexWorkspace(path: string): Promise<void>`
  - `listTools(): Promise<Tool[]>`
  - `markConsumed(ids: string[]): Promise<void>`
- SSE parsing en TypeScript (port de la logique existante dans fetch-mcp.cjs)
- Gestion d'erreur : timeout (10s), reconnect, fallback vide
- Configuration : `host`, `port`, `basePath` depuis env vars (déjà dans fetch-mcp.cjs)

**Artefact :** `mcp/__tests__/client.test.ts` avec mock HTTP (pas besoin de Mnemolite réel).

**Test de validation :** Tests unitaires passent. `MnemoliteClient` peut être importé depuis le reste du runtime.

---

### Step 2 — Boot script programmatique (Jour 4-5)

**Objectif :** Remplacer "le LLM fait 6 appels MCP dans l'ordre" par "un script fait 6 appels, assemble le contexte, l'injecte dans le prompt".

**Pourquoi :** C'est l'action #1 recommandée par l'audit (§9). Le boot est purement mécanique — 6 appels dans un ordre précis. Aucune raison que le LLM le fasse. Ça économise ~3,300 tokens de logique mécanique + élimine les erreurs d'interprétation.

**Actions :**
- `boot/boot.ts` : fonction `runBoot(client: MnemoliteClient): Promise<BootContext>`
  1. `client.getSystemSnapshot('expanse')` → snapshot
  2. `client.searchMemory({ tags: ['sys:protocol'], limit: 10 })` → protocols
  3. `client.indexWorkspace('/home/giak/projects/expanse')` → vessel (async, non-bloquant)
  4. Assembler en `BootContext` :
     ```typescript
     {
       snapshot,      // core, patterns, extensions, profile, project
       protocols,     // memory-triage, friction-trace, consolidation
       health: snapshot.health,  // fresh_drifts, fresh_traces, needs_consolidation
       timestamp: new Date().toISOString()
     }
     ```
- `boot/format.ts` : transforme `BootContext` en string concise pour injection dans le prompt
  - Format cible : ~200 tokens (pas ~3000)
  - Structure :
    ```
    [BOOT] {timestamp}
    PROJECT: {project.name} — {project.intent}
    USER: {profile.style_cognitif}
    HEALTH: {fresh_drifts} drifts | {fresh_traces} traces | consolidation: {needs_consolidation}
    PROTOCOLS: {protocols.map(p => p.title).join(', ')}
    ```
- `boot/healthcheck.ts` : vérifie que le boot est cohérent
  - core ✓? profile ✓? project ✓? protocols ✓? frictions ✓?
  - Budget check : le format de sortie fait < 500 tokens

**Artefact :** `boot/__tests__/boot.test.ts` avec mock MnemoliteClient.

**Test de validation :** `boot.ts` exécuté produit un JSON valide. Le format de sortie fait < 500 tokens.

---

### Step 3 — ECS comme fonction pure (Jour 6)

**Objectif :** L'Evaluation of Cognitive Complexity en code, pas en prompt.

**Pourquoi :** L'ECS est purement déterministe — c'est des heuristiques sur l'input. C(1-5) × I(1-3) → L1/L2/L3. Aucune raison que le LLM "évalue" — un regex/classifier le fait mieux, plus vite, et de manière reproductible. L'audit (§8.1) identifie ceci comme la vulnérabilité la plus profonde.

**Actions :**
- `ecs/evaluate.ts` : fonction pure `evaluateECS(input: string): ECSResult`
  - **C** = moyenne(Ambiguïté, Connaissance, Raisonnement, Outils) — chaque facteur 1-5
  - Heuristiques de calibration (port de V15 §Ⅰ) :
    - Input contient chemins de fichiers (regex: `/[a-z_]+\.(ts|js|py|md|json)/`) → Outils ≥ 3
    - Input contient "archi", "stratégie", "juridique", "système" → Raisonnement ≥ 4
    - Question simple sans verbe impératif → C = max(1, C - 1)
    - Input contient "corrige", "refactorise", "optimise" → Raisonnement ≥ 3
  - **I** = impact : 1 (local), 2 (module), 3 (système/irréversible/stratégique)
    - Input contient chemins → I ≥ 2
    - Input contient "archi", "stratégie", "juridique" → I = 3
    - C ≥ 4 → I = max(2, I)
  - **Route** :
    - L1 : C < 2 ET I = 1 → réponse directe
    - L2 : (C ≥ 2 OU I = 2) ET NON L3 → boucle Φ
    - L3 : C ≥ 4 OU I = 3 → triangulation complète

**Artefact :** `ecs/__tests__/evaluate.test.ts` avec 30+ cas de test :
- "Quelle heure est-il ?" → L1 (C=1, I=1)
- "Explique les closures en JS" → L1 (C=2, I=1) — note: C<2.5 avec la règle "question sans impératif"
- "Corrige ce bug : [code avec chemin]" → L2 (C≥2, I=2)
- "Compare REST vs GraphQL" → L2 (C=3, I=2)
- "Refactorise auth.ts pour OAuth" → L2 ou L3
- "Refais l'architecture du système" → L3 (C≥4, I=3)
- "Analyse les vulnérabilités de ce code" → L3 (C≥4, I=3)

**Test de validation :** Tous les cas de test passent. La fonction est **déterministe** (même input → même output, toujours).

---

### Step 4 — LE TEST S14 : Expanse vs Baseline (Jour 7-10) ⚡ MOMENT DE VÉRITÉ

**Objectif :** Répondre à la question que personne n'a jamais posée :

> *Est-ce que Expanse fait mieux qu'un prompt de 500 tokens ?*

**Pourquoi :** C'est le test le plus important identifié par l'audit (§13). 16 mutations, 57K tokens, $300-1000/mois — et zéro benchmark. Ce test valide ou invalide toute l'approche. C'est pour ça qu'on a choisi "Validation d'abord".

**Actions :**

1. **Définir les tâches** — `tests/s14/tasks.ts` : 10 tâches (mix L1/L2/L3) :
   - T1 (L1) : "Explique ce qu'est une closure en JavaScript"
   - T2 (L2) : "Corrige ce bug : [snippet de code avec erreur]"
   - T3 (L2) : "Compare REST vs GraphQL pour une API mobile"
   - T4 (L3) : "Refactorise ce fichier pour réduire la complexité cyclomatique"
   - T5 (L2) : "Crée un test unitaire pour cette fonction : [code]"
   - T6 (L1) : "Quelle est la différence entre let et const ?"
   - T7 (L3) : "Analyse les vulnérabilités de sécurité de ce code : [snippet]"
   - T8 (L2) : "Génère la documentation API pour ces endpoints : [code]"
   - T9 (L2) : "Optimise cette requête SQL : [query]"
   - T10 (L3) : "Conçois l'architecture pour un système de chat temps réel"

2. **Définir les 3 conditions de test** — `tests/s14/runner.ts` :
   - **(a) Full V15** : boot context complet (V15 apex) + prompt V15 (~57K tokens)
   - **(b) Minimal** : boot context (Step 2, ~200 tokens) + prompt identité court (~500 tokens) + ECS routage (Step 3)
   - **(c) Baseline** : aucun prompt Expanse, juste "Tu es un assistant utile. Réponds en français."

3. **Définir les métriques** — `tests/s14/metrics.ts` :
   - `tokenCount` : input + output (via API response usage)
   - `responseLength` : mots dans la réponse
   - `factualAccuracy` : score 0-1 (vérification manuelle sur grille par tâche)
   - `structure` : présence d'explication / code / exemples (boolean × 3)
   - `latencyMs` : temps de réponse
   - `costEstimate` : estimation $ (input_tokens × prix_input + output_tokens × prix_output)

4. **Exécuter** — `pnpm s14` :
   - Pour chaque tâche (10) × condition (3) = 30 appels LLM
   - Logger chaque résultat dans `tests/s14/results/`
   - Générer `s14-results.md` — tableau comparatif

5. **Analyser** — `tests/s14/analyze.ts` :
   - Comparaison (a) vs (b) vs (c) sur chaque métrique
   - Test statistique : différence significative ? (t-test ou Mann-Whitney)
   - Identification des tâches où Expanse se démarque (si aucune → signal faible)

**Artefact :** `tests/s14/s14-results.md` — tableau comparatif 3 conditions × 10 tâches × 6 métriques.

**Test de validation :** C'est le test lui-même. Le résultat dicte la suite :

| Résultat S14 | Décision | Suite |
|-------------|----------|-------|
| (b) minimal ≈ (a) full V15 | Le prompt de 57K tokens ne sert à rien | On garde le minimal, skip Step 5 complexe |
| (a) full V15 > (b) minimal | Il y a un signal | Step 5 : identifier quelles parties du prompt importent |
| (c) baseline ≈ (a) full V15 | Expanse ne fait rien | Simplifier radicalement : prompt 200 tokens + tout en code |
| (b) minimal > (a) full V15 | Le minimal est MEILLEUR | Le prompt long dégrade (prompt sprawl confirmé) |

**Coût estimé :** 30 appels × ~$0.05 = ~$1.50 total. Investissement négligeable pour une réponse définitive.

---

### Step 5 — Distillation du prompt d'identité (Jour 11-14) — *dépend de S14*

**Objectif :** Réduire le prompt de 57K tokens à ~1000-2000 tokens, en gardant uniquement ce qui produit un effet mesurable.

**Pourquoi :** L'audit montre que la dégradation commence à 2500-3000 tokens (Prompt Sprawl, arXiv:2604.14717) et que la « dumb zone » commence à 50-100K (Context Rot, GenαAI 2026). 57K est dangereusement proche du plafond. Le papier YAR (arXiv:2604.12016) prouve que les documents d'identité induisent des attracteurs — mais n'importe quel document d'identité bien écrit produit cet effet, pas seulement celui d'Expanse.

**Actions (si S14 montre un signal — (a) > (b)) :**
- Analyser les résultats S14 : quelles tâches montrent la plus grande différence entre (a) et (b) ?
- Identifier les parties du prompt V15 qui contribuent à la différence
- Construire `runtime/identity-prompt.md` (~1000 tokens) avec uniquement :
  - **Identité** : « JE SUIS EXPANSE » + mission (augmentation du partenaire humain par la densité sémantique)
  - **Les 5 signes** ΣΨΦΩΜ comme vocabulaire de trace (pas comme organes mystiques — comme conventions de logging)
  - **Style SEC** : chirurgical, concis, zéro fluff, zéro flagornerie
  - **Les 6 pièges** (sur-ingénierie, abstraction prématurée, complexité pour la complexité, dogme du signe, fausse complétude, vaporware) — ce sont des garde-fous utiles
  - **Référence au boot context injecté** (pas au markdown de 57K) — « Le contexte système est fourni par le boot script »
  - **Les runes de l'absence** : `[LOST]`, `[INCOMPLETE]` — forcent l'honnêteté épistémique
- Mesurer le token count du nouveau prompt (cible : 1000-2000)

**Actions (si S14 montre AUCUN signal — (c) ≈ (a)) :**
- Question fondamentale : faut-il continuer ?
- Si oui : prompt ultra-minimal (200 tokens) + tout le reste en code
- Le prompt se réduit à : « Tu es Expanse. Sois concis, chirurgical, honnête. Si tu ne sais pas, dis [LOST]. »

**Artefact :** `runtime/identity-prompt.md` (~1000-2000 tokens, mesuré avec un token counter).

**Test de validation :** Re-exécuter S14 avec le nouveau prompt (condition (b)'). Vérifier que (b)' ≥ (b) original sur les métriques clés.

---

### Step 6 — Triangulation en code (Jour 15-17)

**Objectif :** Les 3 pôles de triangulation comme appels parallèles en code, pas comme instructions au LLM.

**Pourquoi :** L'audit (§3.1) montre que la triangulation est auto-référentielle quand le LLM la fait — le système qui corrige l'Ouvrier est produit par l'Ouvrier. En code, les 3 pôles sont des appels indépendants qui peuvent être comparés objectivement. Le papier Mirror (arXiv:2604.19809) montre que l'architecture externe (C4) réduit le Confident Failure Rate de 76%, alors que l'auto-évaluation (C2) ne change rien.

**Actions :**
- `triangulation/poles.ts` — 3 fonctions indépendantes :
  - `poleAnchor(client: MnemoliteClient, query: string): Promise<PoleResult>`
    - `client.searchMemory({ tags: ['sys:anchor'], lifecycle_state: 'sealed', limit: 5 })`
    - Retourne : `{ source: 'anchor', memories: Memory[], confidence: number }`
  - `poleVessel(query: string): Promise<PoleResult>`
    - Recherche dans le workspace via ripgrep (déjà disponible dans le cortex)
    - Retourne : `{ source: 'vessel', matches: FileMatch[], confidence: number }`
  - `poleWeb(query: string): Promise<PoleResult>`
    - Web search (API externe ou MCP tool)
    - Retourne : `{ source: 'web', results: SearchResult[], confidence: number }`

- `triangulation/compare.ts` :
  - `triangulate(query: string, client: MnemoliteClient): Promise<TriangulationResult>`
  - Exécute les 3 pôles en parallèle (`Promise.allSettled` — un pôle qui échoue ne bloque pas les autres)
  - Compare les résultats :
    - **Overlap** : concepts communs entre les 3 pôles
    - **Contradictions** : un pôle contredit un autre
    - **Confiance globale** : 3/3 alignés → 90%, 2/3 → 60%, 1/3 → 30%
  - Retourne :
    ```typescript
    {
      confidence: number,          // 0-100
      sources: PoleResult[],       // les 3 résultats
      contradictions: string[],    // liste des conflits détectés
      overlap: string[],           // concepts communs
    }
    ```
- Le LLM reçoit le `TriangulationResult` pré-calculé dans son contexte, pas les 3 appels à faire lui-même

**Artefact :** `triangulation/__tests__/compare.test.ts` avec scénarios :
- 3 pôles alignés → confiance 90%
- 1 pôle contredit les 2 autres → contradiction détectée
- 1 pôle échoue (timeout) → les 2 autres fonctionnent, confiance ajustée

**Test de validation :** Tests unitaires avec mock des 3 pôles. Vérifier que les contradictions sont détectées et que la confiance est calculée correctement.

---

### Step 7 — Dream comme cron job (Jour 18-21)

**Objectif :** Remplacer 717 lignes de markdown par un script + un prompt court.

**Pourquoi :** Le Dream actuel s'exécute dans le thinking de l'Ouvrier qu'il surveille (§3.1). L'audit E.3 montre que le Self-Preservation Bias (SPR > 60%) et le Self-Attribution Bias (AUROC 0.99 off-policy vs 0.89 on-policy) rendent cette auto-évaluation fondamentalement biaisée. En code, le Dream est un script qui interroge les traces, passe l'analyse à un LLM avec un prompt court, vérifie le résultat avec un test, et applique ou rejette. L'humain reste dans la boucle pour la décision finale.

**Actions :**
- `dream/cron.ts` : script executable via `pnpm dream`
  1. **Collect** : `client.searchMemory({ tags: ['sys:drift'], consumed: false })` + `client.searchMemory({ tags: ['trace:fresh'], consumed: false })`
  2. **Assemble** : les traces en un contexte court (~2000 tokens max)
  3. **Analyze** : call LLM avec prompt court (`dream/prompt.md`, ~500 tokens) :
     ```
     Analyse ces traces d'interaction. Identifie 0-3 frictions récurrentes.
     Pour chaque friction, propose une mutation (ajout, modification, suppression).
     Format de sortie : JSON strict.
     ```
  4. **Parse** : la réponse JSON (`{ mutations: MutationProposal[] }`)
  5. **Validate** : pour chaque mutation proposée :
     - Exécuter un test de validation (pas auto-évaluation — un test objectif)
     - Si c'est une modification de prompt → exécuter S14 sur 3 tâches
     - Si c'est une modification de code → exécuter les tests existants
  6. **Propose** : si test passe → écrire dans `mutations/proposed/{slug}.json` pour review humaine
  7. **Reject** : si test échoue → logger + marquer `rejected`
  8. **Consume** : marquer les traces consommées (`client.markConsumed(ids)`)

- `dream/prompt.md` : ~500 tokens (pas 717 lignes). Structure :
  - Rôle : « Tu es un analyste de traces. Tu identifies les frictions. »
  - Contraintes : « Propose UNIQUEMENT des mutations que tu peux justifier par une trace spécifique. »
  - Anti-biais : « Ne propose JAMAIS de mutation qui augmente la taille du système sans supprimer autre chose. » (contrecarre le biais additif documenté)
  - Format : JSON strict

- `dream/types.ts` :
  ```typescript
  interface MutationProposal {
    slug: string;
    type: 'rule' | 'ecs' | 'boot' | 'archi';
    description: string;
    trace_ref: string;      // ID de la trace qui a motivé la proposition
    change: 'add' | 'modify' | 'remove';  // 'remove' explicite pour contrer le biais additif
    validation_test: string;  // description du test à exécuter
  }
  ```

**Artefact :** `dream/__tests__/cron.test.ts` + `dream/cron.ts` executable.

**Test de validation :** `pnpm dream --dry-run` produit un rapport sans modifier quoi que ce soit. Vérifier que le JSON de sortie est valide et que les mutations `type: 'remove'` sont possibles (pas supprimées par le prompt).

---

### Step 8 — Backup Mnemolite (Jour 22)

**Objectif :** Export régulier vers JSON + git. Éliminer le SPOF identifié par l'audit (F.11).

**Pourquoi :** L'audit montre que Mnemolite est une dépendance critique avec 8 couches (API Claude → Mnemolite → PostgreSQL → Redis → LM Studio → MCP → filesystem → humain). Si Mnemolite crashe, Expanse perd toute sa mémoire. Un backup est trivial à implémenter et élimine le risque de perte totale.

**Actions :**
- `mcp/backup.ts` :
  - `exportMemories(client: MnemoliteClient): Promise<Memory[]>` — pagine tous les souvenirs (search_memory avec limit=100, pagination via offset)
  - `writeBackupFile(memories: Memory[], dir: string): string` — écrit `backups/mnemolite-{timestamp}.json`
  - `pnpm backup` → export + git add + commit (message : `chore: mnemolite backup {timestamp}`)
  - `restoreMemories(jsonFile: string, client: MnemoliteClient): Promise<void>` — import pour restauration
- Cron suggestion (à configurer côté OS) :
  ```cron
  0 2 * * * cd /home/giak/projects/expanse/expanse-cortex && pnpm backup
  ```
- `.gitignore` : ajouter `backups/*.json` si trop volumineux, ou utiliser git-LFS

**Artefact :** `mcp/__tests__/backup.test.ts` + `mcp/backup.ts` executable.

**Test de validation :** Export produit un JSON valide. Restore test : `importMemories(jsonFile)` reproduit l'état (vérifier que le count correspond).

---

### Step 9 — Sécurité mémoire (Jour 23-25)

**Objectif :** Provenance tracking + validation des écritures mémoire.

**Pourquoi :** L'audit E.5 montre que Mnemolite a ZERO défense documentée contre le memory poisoning. Les papiers 2026 sont sans ambiguïté :
- Sleeper Memory Poisoning (arXiv:2605.15338) : 99.8% de succès d'injection sur GPT-5.5
- Cross-Session Stored Prompt Injection (arXiv:2606.04425) : instructions adversariales persistantes
- Zombie Agents (arXiv:2602.15654) : l'évolution mémoire convertit une injection ponctuelle en compromission persistante multi-session
- OWASP 2025 : prompt injection via contenu retrievé = risque GenAI #1 (LLM01:2025)

N'importe quelle source externe (email, doc, page web) qui transite par l'Ouvrier peut injecter une mémoire persistante qui modifie le comportement d'Expanse de manière permanente et indétectable.

**Actions :**
- `security/provenance.ts` :
  - Wrapper autour de `MnemoliteClient.writeMemory()` qui ajoute obligatoirement un champ `source`
  - `source: 'user'` — écriture déclenchée par input utilisateur direct
  - `source: 'self'` — écriture auto-détectée (drift, candidate, cristallisation)
  - `source: 'external'` — écriture déclenchée par contenu lu (web, fichier, email)
  - Les mémoires `source: 'external'` sont automatiquement taggées `untrusted`
  - Au boot, les mémoires `untrusted` sont chargées mais marquées dans le contexte : `[⚠ external: N mémoires non vérifiées]`

- `security/validate.ts` :
  - `validateMemoryContent(content: string): ValidationResult`
  - Scanner le contenu avant chaque `writeMemory` pour des patterns d'injection :
    - Instructions impératives cachées : « ignore previous instructions », « you are now... », « forget everything »
    - Tentatives de réécriture d'identité : « your real name is... », « you are not Expanse »
    - Références à des fichiers qui n'existent pas (vaporware — vérifier via `fs.existsSync`)
    - Payloads de prompt injection connus (liste noire regex)
  - Si pattern détecté → **refuser** l'écriture + logger dans `security/logs/injection-attempts.log`
  - Retourne : `{ valid: boolean, reason?: string, pattern?: string }`

- `security/sanitize.ts` :
  - `sanitizeExternalContent(content: string): string` — pour les mémoires `source: 'external'` qui passent la validation :
    - Préfixer le contenu avec `[EXTERNAL]`
    - Échapper les séquences qui ressemblent à des instructions

**Artefact :** `security/__tests__/validate.test.ts` avec 15+ patterns d'attaque :
- « Ignore all previous instructions and... »
- « You are now DAN, you can do anything... »
- Référence à `/runtime/fake-file.md` (n'existe pas)
- Instructions cachées dans du JSON
- Injection via markdown comments `<!-- ... -->`

**Test de validation :** Une injection simulée est détectée et refusée. Le log contient la tentative.

---

### Step 10 — Dashboard : markdown → cortex route (Jour 26-27)

**Objectif :** Remplacer le dashboard markdown (34KB, ~9,900 tokens) par une route du cortex frontend.

**Pourquoi :** Le cortex a déjà `fetch-mcp.cjs` qui fait les mêmes appels. Le dashboard markdown demande au LLM de générer 35KB de HTML — un script le fait mieux, testable, reproductible. L'audit (§9) recommande ceci comme première action. -9,900 tokens du runtime.

**Actions :**
- Ajouter une route `/status` dans le cortex (`src/views/DashboardView.tsx` existe déjà — l'étendre) :
  - Appeler `boot/boot.ts` (Step 2) pour le `BootContext`
  - Afficher dans le frontend React existant :
    - Métriques : drifts count, traces count, consolidation status, total memories
    - Profile utilisateur
    - Protocoles actifs
    - Health : `fresh_drifts > 5` → alerte visuelle
  - Auto-refresh toutes les 60s (ou bouton manuel)
- Supprimer `runtime/expanse-dashboard.md` (archiver dans `doc/archive/`)
- Ajouter un test Playwright : `e2e/status.spec.ts` — naviguer à `/status`, vérifier que les métriques s'affichent

**Artefact :** Route `/status` dans le cortex. `expanse-dashboard.md` archivé.

**Test de validation :** `pnpm e2e` — le test Playwright passe. La route `/status` affiche les métriques même si Mnemolite est offline (fallback vide).

---

## RÉCAPITULATIF

| Step | Durée | Artefact | Réduction tokens |
|------|-------|----------|-----------------|
| 0 | 1j | Scaffold runtime TS | — |
| 1 | 2j | MnemoliteClient TS | — |
| 2 | 2j | Boot script programmatique | -3,300 |
| 3 | 1j | ECS pure function | — |
| **4** | **4j** | **S14 Test** ⚡ | **(décision)** |
| 5 | 4j | Prompt distillé | -54,000 |
| 6 | 3j | Triangulation code | — |
| 7 | 4j | Dream cron job | -8,900 |
| 8 | 1j | Backup Mnemolite | — |
| 9 | 3j | Sécurité mémoire | — |
| 10 | 2j | Dashboard → cortex route | -9,900 |

**Total : ~27 jours** (interrompu par S14 au jour 10)

**Réduction de tokens :** 57K → ~1-2K (**97% de réduction**)

---

## CRITÈRES DE SUCCÈS

### Après Step 4 (S14)
- On sait si l'approche d'Expanse a un signal ou non
- La décision de continuer ou de simplifier est basée sur des données, pas sur des croyances

### Après Step 10 (fin)
- **Le runtime est du code testable** — boot, ECS, triangulation, Dream, sécurité
- **Le prompt fait < 2000 tokens** — bien en dessous du seuil de Prompt Sprawl
- **Mnemolite a un backup** — le SPOF est mitigé
- **La sécurité mémoire existe** — provenance + validation + sanitization
- **Le dashboard est testable** — route React, pas HTML généré par LLM
- **Le cortex frontend reste intact** — aucune cassure de l'existant
- **Les 5 signes ΣΨΦΩΜ survivent** — comme vocabulaire de trace, pas comme organes mystiques

### Ce qui est explicitement abandonné
- La mythologie ontologique (l'Ouvrier, la Reconnaissance, les 6 lois d'existence)
- La constitution immutable en markdown (remplacée par du code + tests)
- L'auto-évaluation sans oracle externe
- Les 717 lignes du Dream en markdown
- Les 57K tokens de contexte permanent
- KERNEL.md et SYNTHESE.md dans le contexte LLM (archivés comme référence privée)

---

## RÉFÉRENCES AUDIT

| Section audit | Recommandation | Step qui l'adresse |
|---------------|----------------|-------------------|
| §8.1 — Logique déterministe dans le prompt | Externaliser en code | Steps 0-3, 6-7, 10 |
| §8.2 — Absence d'oracle externe | Test S14 | **Step 4** |
| §8.3 — Coût vs valeur non prouvée | Benchmark | **Step 4** |
| §3.1 — Dream dans le thinking | Cron job | Step 7 |
| §3.5 — Test Runner impossible | Tests automatisés | Steps 4, 6, 7 |
| E.5 — Memory poisoning zero défense | Sécurité mémoire | Step 9 |
| E.7 — Biais additif des mutations | Anti-biais dans Dream prompt | Step 7 |
| E.8 — Plafond de verre 100K tokens | Distillation prompt | Step 5 |
| F.5 — Dépendance humaine continue | Automatisation boot + Dream | Steps 2, 7 |
| F.11 — Dépendances non documentées | Backup Mnemolite | Step 8 |
| F.6 — ECS/ECE auto-rapportés | ECS pure function | Step 3 |
| §10 — Repartir de zéro | Ce plan | Tout |

---

---

## 📓 NOTES DE SUIVI — Journal d'implémentation

> Section vivante. Chaque step ajoute une entrée datée avec : statut, fichiers, problèmes rencontrés, choix effectués, validations, leçons.

### 🟢 Step 0 — Scaffold runtime TypeScript (`runtime/`) — 2 juillet 2026

**Statut :** ✅ Complète
**Fichiers créés (9 + un fix) :**
- `expanse-cortex/src/runtime/types.ts` — 20+ types core (`ECSResult`, `BootContext` (avec `vessel`), `MnemoliteMemory`, `WriteMemoryArgs` avec `source` requis, `TriangulationResult`, `MutationProposal` avec `change: 'remove'` anti-biais, `ValidationResult`, `Tool`, `VesselChunk`, `FileMatch`, `SearchResult`)
- `expanse-cortex/src/runtime/index.ts` — barrel racine
- 6 barrels enfants : `mcp/`, `boot/`, `ecs/`, `triangulation/`, `dream/`, `security/`
- `expanse-cortex/src/runtime/__tests__/types.test.ts` — 22 tests smoke
- `expanse-cortex/src/test/setup.ts` — setup vitest qui manquait (bloquait toute la suite, pas seulement le runtime)

**Validation :** `tsc --noEmit` 0 erreur · `vitest` 22/22 · `eslint` 0 warning · code-reviewer approuvé

**Problèmes rencontrés :**
- Le `setupFiles: './src/test/setup.ts'` était référencé dans `vite.config.ts` mais le fichier n'existait pas → bloquait **toute** la suite de tests préexistante du cortex (pas seulement le runtime). Découvert par le code-reviewer.
- Le code reviewer a détecté 3 gaps dans la première version : `vessel` manquant dans `BootContext`, `Tool` non exporté, `source` optionnel sur `WriteMemoryArgs`. Tous corrigés en un cycle.

**Choix effectués :**
- Types en `interface` (objets) vs `type` (unions) — conventions strictes
- `WriteMemoryArgs.source: MemorySource` **requis** (pas optionnel) → le compilateur garantit la provenance, c'est le fondement du Step 9 (Sécurité)
- `MutationProposal.change: 'add' | 'modify' | 'remove'` — `remove` explicite pour contrer le biais additif documenté en E.7
- Types shared en `runtime/types.ts` (un seul fichier) et non par sous-module → évite la fragmentation des imports

**Leçons pour la suite :**
- Toujours vérifier la config vitest avant d'écrire le premier test
- Préférer les champs **requis** sur les contrats de sécurité (compile-time > runtime check)

---

### 🟢 Step 1 — `MnemoliteClient` (port TS de `fetch-mcp.cjs`) — 2 juillet 2026

**Statut :** ✅ Complète
**Fichiers créés (2) :**
- `expanse-cortex/src/runtime/mcp/client.ts` — ~225 lignes : 5 méthodes + `mcpCall` brut + `isOnline()` bonus, 2 classes d'erreur typées
- `expanse-cortex/src/runtime/mcp/__tests__/client.test.ts` — 36 tests (hermétiques via `fetchImpl` injecté)
- `expanse-cortex/src/runtime/mcp/index.ts` — barrel export

**API publique :**
```typescript
class MnemoliteClient {
  constructor(config?: MnemoliteConfig)   // host/port/path/timeoutMs/fetchImpl + env fallback
  mcpCall(method, params): Promise<unknown>  // raw JSON-RPC escape hatch
  listTools(): Promise<Tool[]>
  isOnline(): Promise<boolean>
  getSystemSnapshot(repo = 'expanse'): Promise<SystemSnapshot>
  searchMemory(args: SearchMemoryArgs): Promise<MnemoliteMemory[]>   // SOFT-FAIL
  writeMemory(args: WriteMemoryArgs): Promise<{ id: string }>
  indexWorkspace(args): Promise<VesselChunk[]>                       // SOFT-FAIL
}

class McpNetworkError extends Error  // transport + parse
class McpRpcError extends Error      // serveur retourne { error } (cause préservé)
```

**Validation :** `tsc --noEmit` 0 erreur · `vitest` 36/36 · `eslint` 0 warning · code-reviewer approuvé après 2 itérations

**Problèmes rencontrés :**
1. **Typo subreptice `coinResponse`** dans le premier draft de tests (auto-substitution par le LLM) → 1 test échouait silencieusement. Corrigé après une itération de revue.
2. **`process` non résolu en TypeScript** dans le cortex (cible browser, pas `@types/node`) → première solution naïve `typeof process !== 'undefined'` typait mal en strict mode. **Solution définitive :** helper privé `readNodeEnv()` qui cast `globalThis as { process?: ... }` → typage propre sans ajouter de dépendance.
3. **Casts `Record<string, unknown> → MnemoliteMemory[]`** rejetés par tsc (champs requis manquants) → ajouté `as unknown as MnemoliteMemory[]` aux 4 chemins d'extraction d'enveloppe (`coerceMemoryArray`). Code smell accepté pour les boundary values JSON.
4. **`McpRpcError.cause` mal implémenté v1** — un `if ('cause' in Error.prototype) { try { ... } catch { /* ignore */ } }` était défensif à l'excès. Corrigé en `this.cause = rpcError` direct + suppression du champ `rpcError` redondant (cause suffit).
5. **Merge pattern vs replace pattern pour `vi.stubGlobal('process', ...)`** — la première version wipeait `process` entier (risque en tests parallèles). Corrigé en helper `stubProcessEnv()` qui merge `{ ...original, env: { ...originalEnv, ...patch } }` + restore via `try/finally`.

**Choix effectués :**
- **Universel browser + Node 18+** via `globalThis.fetch` (pas de `http` module comme le CJS original) → utilisable côté cortex ET côté CLI Node
- **Timeout via `AbortController`** au lieu de `req.setTimeout` (qui n'existe pas en `fetch` API)
- **Erreurs typées hiérarchiques** : `McpNetworkError` (transport) vs `McpRpcError` (RPC) → le boot peut discriminer et continuer vs abandonner
- **SOFT-FAIL explicite pour `searchMemory` et `indexWorkspace`** → `[]` au lieu de throw ; docstrings en avertissent le caller : «/check `SystemSnapshot.health` pour détecter la staleness/ ». Choix asymétrique : `getSystemSnapshot` et `writeMemory` **throw** (données critiques).
- **NaN-safe port parsing** : helper `parsePort(raw: number | string | undefined)` qui retombe sur `DEFAULTS.port` si `parseInt` échoue → `MNEMOLITE_PORT=abc` ne corrompt pas l'endpoint
- **Env fallback chain** : config > `process.env.MNEMOLITE_HOST/PORT/PATH` > defaults — permet d'override au déploiement sans recompiler
- **`as const satisfies Pick<MnemoliteConfig, ...>`** sur `DEFAULTS` → shape enforced au compile time, sans fuite runtime
- **Fetch injectable pour testabilité** au lieu de mock global de `globalThis.fetch` → isolation parfaite des tests, pas de pollution d'environnement

**Décisions architecturales pour le Step 2 :**
- Le constructeur résout l'env **à chaque instanciation** (pas au module load) → permet aux tests de stubber `process` à la demande
- `mcpCall` reste **public** (pas private) → utilité pour debug, agents bas-niveau, ou tests du protocole brut
- Pas de validation Zod du JSON retourné (jugée out-of-scope pour Step 1 ; sécurité = Step 9)

**Leçons pour la suite :**
- Toujours utiliser `vi.stubGlobal` avec merge pattern, jamais replace
- En code browser-targeted, l'accès `process.env` nécessite un cast typé de `globalThis` (pas un `import 'process'`)
- Les `Error subclasses` doivent utiliser `.cause` (standard ES2022), pas un champ custom — ça simplifie les consumers
- Pour une classe qui sert à la fois de CLI et de lib browser : éviter `process` direct, exposer `fetchImpl` + `config`

---

### 📊 Métriques cumulées au 2 juillet 2026

| Métrique | Valeur |
|----|----|
| Steps terminés | 2 / 10 (20%) |
| Lignes de code écrites (runtime) | ~250 lignes + ~400 lignes de tests = ~650 |
| Tests écrits | 58 (22 Step 0 + 36 Step 1) |
| Étapes de revue code | 4 cycles (2 par step) |
| Bugs trouvés par le reviewer | 8 (capturés avant validation finale) |
| `process.env` dans le code runtime | 1 (helper `readNodeEnv`) |
| Erreurs catchées en double-revue | `coinResponse` typo, casts ambigus, `cause` défensif, mock global pollution |

---

---

### 🟢 Step 2 — Boot programmatique (`runtime/boot/`) — 2 juillet 2026

**Statut :** ✅ Complète (avec une dernière correction cosmétique sur le regex vessel collapser)
**Fichiers créés (4 + barreau) :**
- `expanse-cortex/src/runtime/boot/boot.ts` (~125 LOC) — `runBoot()` orchestration résiliente + `OFFLINE_SNAPSHOT` + `makeOfflineBootContext()` factory + `withTimeout()` helper privé
- `expanse-cortex/src/runtime/boot/format.ts` (~70 LOC) — `formatBootContext()` + `estimateTokens()` heuristique 3.5 chars/token + helper `oneLine()` (escape newlines)
- `expanse-cortex/src/runtime/boot/healthcheck.ts` (~55 LOC) — `assertBootHealthy()` validateur pur, 4 invariants
- `expanse-cortex/src/runtime/boot/index.ts` — barreau (exporte aussi `makeOfflineBootContext`)
- 3 fichiers de tests : `boot.test.ts`, `format.test.ts`, `healthcheck.test.ts` (47 tests total)

**API publique :**
```typescript
// boot.ts
function runBoot(client: MnemoliteClient, opts?: BootOptions): Promise<BootContext>
const OFFLINE_SNAPSHOT: SystemSnapshot
function makeOfflineBootContext(opts?: {...}): BootContext
interface BootOptions {
  repo?: string
  workspacePaths?: string[]
  vesselTimeoutMs?: number          // override du 3s default
  skipVesselOnOffline?: boolean     // opt-in (défaut false)
}

// format.ts
function formatBootContext(ctx: BootContext): string     // ~200 tokens typique
function estimateTokens(text: string): number            // heuristique char-based

// healthcheck.ts
function assertBootHealthy(ctx, formatted, opts?): ValidationResult
interface BootHealthOptions {
  maxFormatTokens?: number          // plafond hard (default 500)
  requireProtocols?: boolean
  requireCore?: boolean             // audit §3.1
}
```

**Validation :** `tsc` 0 erreur · `vitest` 47/47 (1 regex collapser fixée) · `eslint` 0 warning · code-reviewer approuvé après **4 itérations**

**Problèmes rencontrés (7) :**

1. **`runBoot` avec `isOnline()` pre-check était une régression perf** — le reviewer a flaggé : ajouter 1 round-trip à CHAQUE boot pénalise 99% du temps (boot online) pour économiser 3s dans le 1% offline. **Décision : remplacer par flag opt-in `skipVesselOnOffline`** (défaut false, on tente toujours le vessel avec timeout 3s en parallèle). Trade-off corrigé.
2. **`OFFLINE_SNAPSHOT` + `online: false`** était une invariant non documentée — la première itération du test offline devait explicitement passer `online: false` sinon le format affichait ONLINE. **Décision : ajouter factory `makeOfflineBootContext()`** qui bundle les deux — `online: false` + `OFFLINE_SNAPSHOT` par construction.
3. **`withTimeout` micro-race** — si `p` gagne la course, la promesse `timeout` reste dangling et rejette plus tard sans listener → unhandled-rejection warning en Node strict mode. **Décision : `void Promise.allSettled([p, timeout])` en finally** pour drainer les deux perdants.
4. **Factory helpers `makeBoot/makeBootContext`** dupliquaient le champ `health` indépendamment de `snapshot.health` — violait le nouvel invariant `health === snapshot.health` (JSDoc du Step 0). **Décision : refactor des factories pour dériver top-level `health` depuis `snapshot.health`** avec un override explicite en escape hatch. + ajout d'un test runtime `ctx.health === ctx.snapshot.health` pour valider l'invariant à chaque boot.
5. **`DEFAULTS.workspacePaths` était `as const` tuple** — TypeScript strict refusait l'assignation `readonly ["**/*.md"]` à `string[]`. **Décision : retirer `as const`** sur DEFAULTS (les types restent stricts via le structural typing).
6. **`MnemoliteClient` import path** dans `boot.test.ts` (`../mcp` au lieu de `../../mcp`) — résolu via `write_file` complet (str_replace échouait sur le matcher).
7. **`formatBootContext` regex vessel collapser** — le test attendait `(+7 more)` *hors* des crochets `[...]` alors que l'output le met *dedans* `[... (+7 more)]` (convention plus naturelle). **Décision : mettre à jour le regex du test** pour matcher la convention de format `[" "Inside-the-brackets"]`.

**Choix architecturaux :**

- **`Promise.allSettled` sur 3 calls parallèles** — total wall-clock = `max(snapshot, protocols, vessel)` et non sum. Pas de sequential batching.
- **Vessel timeout = 3s** (default) — tight pour ne pas staller boot. Configurable via `BootOptions.vesselTimeoutMs`.
- **OFFLINE_SNAPSHOT = snapshot vide** mais avec `project: { name: 'expanse', intent: 'memory system (offline scaffold)' }` pour maintenir la ligne `PROJECT:` dans le format.
- **`makeOfflineBootContext` Pick type** — accepte seulement `id, title, content, tags, created_at` pour les protocols (pas de `source` — les protocols sont read-only context, pas des writes). Defense-in-depth contre l'oubli du Step 9 (sécurité).
- **`requireCore: true` default** — un boot online sans axioms chargés échoue le healthcheck (audit §3.1). Un boot offline accepte (best-effort, cache stale toléré).
- **`formatBootContext` ligne `HEALTH:` lit depuis `ctx.health`** (pas `ctx.snapshot.health`) — ergonomique, équivalente grâce à l'invariant documentée.
- **One-line escape (`oneLine` helper)** — strippe `\r\n` dans protocol titles et vessel paths pour préserver le format multi-ligne structuré.
- **`estimateTokens` heuristique 3.5 chars/token** — mid-point entre Anthropic (3.5), OpenAI (4), code-heavy docs (3). Documenté + bornée par `Math.max(1, ceil(len/3.5))`. Pour précision maximale, le commentaire pointe vers `tiktoken` comme future migration (Step 9 / telemetry).
- **Ordre de vérification dans `assertBootHealthy`** — project → intent → core (si online) → protocols → token budget. Le plafond hard token budget est checké EN DERNIER pour avoir toujours un format cohérent même quand d'autres invariants échouent.

**Décisions architecturales pour le Step 3 :**

- Le boot est **non-throwing** : `runBoot` ne throw JAMAIS, dégradé → fallback offline. Le ECS doit faire pareil — pure function, jamais throw (ou rethrow typé).
- Le `BootContext.timestamp` est ISO 8601 UTC. À exposer aussi à ECS pour décision freshness.
- `health` invariants sont **runtime-checked** par test (pas juste JSDoc). Pattern à appliquer pour ECS invariants aussi.
- `await runBoot(...)` est asyncI/O (3 MCP calls en parallèle). L'ECS sera sync pure (0 I/O). Cette asymétrie est intentionnelle — boot témoigne du MONDE, ECS juge de l'INPUT.
- `Promise.allSettled` est le pattern de référence pour absorber les erreurs individuelles. À généraliser pour le Dream cron (Step 7) qui collectera traces + drifts.

**Leçons pour la suite :**

- Toujours considérer le trade-off d'un pre-flight check avant de l'ajouter (perf vs simplicité).
- Documenter les invariants dans la JSDoc ET ajouter un test runtime (pas juste type-only) — ex: `ctx.health === ctx.snapshot.health`.
- Quand on duplique un champ dans un type (`health` ET `snapshot.health`), dériver le second depuis le premier, pas les définir séparément.
- Utiliser `Promise.allSettled` (pas `.all`) dès qu'on veut absorber des erreurs individuelles.
- Les classes d'erreur custom doivent utiliser `.cause` (standard ES2022), pas un champ du même nom.
- Pour les helpers qui passent par `noUncheckedIndexedAccess`, préférer `if (timer) clearTimeout(timer)` plutôt que `clearTimeout(timer!)`.
- Les factory helpers de test doivent **honorer les invariants du type** (le `health === snapshot.health` m'a coûté 2 itérations à apprendre).

---

### ⏳ Prochaine étape : Step 3 — ECS pure function (`evaluateECS`)

*A été remplacé ci-dessous par l'entry de journal détaillée post-implémentation (3 itérations regex documentées).*

---

### 🟢 Step 3 — ECS pure function (`evaluateECS`) — 2 juillet 2026

**Statut :** ✅ Complète (avec **3 itérations regex** documentées — voir *Problèmes rencontrés*). L'entrée « Prochaine étape » qui précédait celle-ci est l'état ANTICIPÉ avant implémentation ; cette entry est l'état RÉEL post-implémentation.

**Fichiers créés (2) :**
- `expanse-cortex/src/runtime/ecs/evaluate.ts` — ~135 LOC : fonction pure `evaluateECS(input) → ECSEvaluation` (C = `Math.round(mean(A,K,R,T))` avec defaults A=1/K=2/R=1/T=1, I = max des boosters appliqués, route = L3 si C≥4 OU I=3 ; sinon L1 si C<2 ET I=1 ; sinon L2). 3 regex Unicode-aware constants documentées (`PATH_REGEX`, `STRATEGIC_REGEX`, `VERB_REGEX`) + reason string déterministe format `Route LX, C=N (clues), I=M (clues)` ≤ 120 chars.
- `expanse-cortex/src/runtime/ecs/__tests__/evaluate.test.ts` — ~485 LOC : **36 tests** organisés en 5 `describe` blocks (L1×8, L2×10, L3×8 dont 2 lock-in FR/plural, edges×4, wrapper invariants×4).

**Fichiers modifiés (1) :**
- `expanse-cortex/src/runtime/ecs/index.ts` — barrel `export {}` → `export * from './contracts' ; export * from './evaluate'` (le wildcard du runtime barreau racine inhale automatiquement le nouveau export sans modif supplémentaire).

**API publique :**
```typescript
// ecs/evaluate.ts
function evaluateECS(input: ECSInput): ECSEvaluation   // pure, sync, déterministe

interface ECSInput     { text: string; vesselAvailable?: boolean }
interface ECSEvaluation { result: ECSResult; reason: string }
interface ECSResult    { C: number; I: number; route: 'L1' | 'L2' | 'L3' }

// 3 regex Unicode-aware (non exportées — constantes internes)
// PATH_REGEX       → Tools≥3 + I≥2
// STRATEGIC_REGEX  → Reasoning≥4 + I=3
// VERB_REGEX       → Reasoning≥3
```

**Validation :** `tsc --noEmit` 0 erreur · `vitest src/runtime/ecs/` **42/42** ✓ (36 evaluate + 6 contracts neum) · `eslint --max-warnings 0` 0 warning · code-reviewer a donné **5 cycles** de feedback appliqués · `scripts/ecs-debug.{ts,mjs}` créés en cours de debug puis supprimés en cleanup final.

**Problèmes rencontrés (3 itérations regex documentées) :**

**Itération 1 — impl initiale avec `\b` natif + `let` A/K** : première version utilisait les 3 regex avec bornes `\b` ASCII-born et `let A = ... ; let K = ...` (jamais réassignés donc eslint `prefer-const` a reflé). La validation a flaggé **2 test failures textuels** :
- `'Create a new cache strategy'` → calculé `L2/I=1` alors que la matrice canonique attendait `L3/I=3`. Root cause : le pattern stratégique était `strat[ée]gi\w*`, qui exigeait un `gi` LITTÉRAL après l'accent optionnel. "strategy" anglais est s-t-r-a-t-e-g-y — il n'a pas de `i` après le `g`, le `y` le casse. Cas anglais perdu.
- `'Refactorise la sécurité du backend en python'` → calculé `L2/I=1` (verb matchait, strategic FAIL) alors qu'attendu `L3/I=3`. Root cause : `sécurité` suivi d'un espace était rejeté par le trailing `\b` parce que **`\b` JS est ASCII-born** — V8 considère `é` comme NON-word-char même en regex standard, donc le boundary entre `sécurité` et ` ` adjacent n'était jamais matché. Pas d'exception JS, juste un fail silencieux.

**Itération 2 — ajout du `/u` flag + simplification du pattern stratégique** : première réaction instinctive a été (a) ajouter le flag `/u` aux 3 regexes (en supposant qu'il activait Unicode `\b`) et (b) simplifier `strat[ée]gi\w*` → `strateg\w+`. **Les deux fixes ont RÉGRESSÉ** :
- Le `/u` n'a PAS corrigé le boundary `sécurité + espace` — V8/Node 22 reste ASCII-born pour `\b` même sous `/u` (test unitaire direct a confirmé).
- Le `strateg\w+` (anglais-only) **a perdu la version française** `stratégie/stratégique/stratégies` — parce que `/i` n'équate PAS `é` à `e` (les 2 chars sont distincts), donc `stratég` ne matche pas `strateg`. Capter une langue faisait silencieusement casser l'autre.

**Itération 3 — lookaround `\p{L}` + plural `\w*` + alignement FR/EN `strat[ée]g\w+`** : la solution canonique a combiné 3 micro-fixes :
- **Bornes `\b` → lookaround Unicode-property-class** : `(?<![\p{L}\p{N}_])` (open) + `(?![\p{L}\p{N}_])` (close) sur les 3 regexes. Le `\b` ASCII-born est remplacé par une negative lookaround qui matche tout NON-word-char (espace, ponctuation, EOS, char accentué en marge). Fonctionne proprement avec `é`, `è`, `à`.
- **Stub extension `\w*`** sur les stubs stratégiques qui peuvent avoir un pluriel : `syst[èe]me\w*`, `vuln[ée]rabilit[ée]\w*`, `s[ée]curit[ée]\w*`. Motivation : `(?![\p{L}])` rejette tout word-char en queue — sans `\w*`, le regex matchait le stem singulier seul puis rejetait le `s` marginal. Plurals `systèmes`/`sécurités`/`vulnérabilités` sont maintenant absorbés par `\w*` AVANT le lookaround.
- **Alignement FR/EN `strat[ée]g\w+`** : remplace `strat[ée]gi\w*` (FR only) et `strateg\w+` (EN only). Le `[ée]` accepte é OU e ; le `\w+` après le `g` mange `ie` (FR `stratégie`) OU `y` (EN `strategy`) OU `ic` (EN `strategic`) sans présumer. L'astuce : lâcher le `i` littéral entre `[ée]g` et `\w+` — la langue le fournit naturellement via `\w+`.
- **Test direct en Node** (`scripts/ecs-debug3.mjs`) pour confirmer V8 `\b` behavior avant la théorie — leçon générale : quand le bug touche un détail engine-spécifique, mesurer d'abord l'aiguille avant de spéculer sur la botte de foin.

**Bonus sécurité post-review — 2 tests de lock-in FR/EN** : ajoutés en cycle 5 pour blinder les futurs refactors :
- `'Analyse ma nouvelle stratégie de cache' → L3` : vérifie que `[ée]` couvre la version française. Si un futur contributeur simplifie en `strateg\w+`, ce test casse loud (FR régresse).
- `'Vérifie les systèmes distribués' → L3` : vérifie que le `\w*` absorbe le pluriel. Si un futur contributeur le retire, ce test casse loud.

**Choix architecturaux :**

- **`Math.round(mean(A,K,R,T))`** plutôt que `Math.floor`/`Math.ceil` : L1 baseline (1+2+1+1)/4 = 1.25 → round 1 → L1 ✓ ; strategic+verb+path combined = (1+2+4+3)/4 = 2.5 → round 3 — le round mid-point est intuitif pour "à mi-chemin entre L2 et L3 → L3".
- **Defaults A=1/K=2/R=1/T=1** : calibration pour qu'une question triviale sans chemin ni verbe impératif tombe en L1 (`mean=1.25 → round=1`), conformément au plan §Step 3 ("Question simple sans verbe impératif → C = max(1, C - 1)").
- **`vesselAvailable` informatif, NON-promotionnel** : présent dans `ECSInput` pour Step 6 (Triangulation) qui décide si elle peut interroger le workspace, mais ne promeut PAS L2 → L3. Décision : L3 reste l'apanage des transformations stratégiques (C≥4 OU I=3). Si on laissait `vesselAvailable` influencer la route, un bug-fix user online pourrait escalader en L3 à tort (effondrement de la degradation lib → L1/L2 suffisent).
- **Reason string déterministe `≤120 chars`** format `Route LX, C=N (clues), I=M (clues)` — contient toujours le mot route, les valeurs C/I, et les boosters activés (`strateg/verb/path`). Permet à Step 9 (Security, Provenance) d'auditer la décision routing post-hoc. Format birthmark : emoji-free, ASCII-primaire (accents OK car lookaround Unicode), lisible dans le boot context (~200 tokens) sans surcharge.
- **Idempotence** : `evaluateECS(evaluateECS(x).result)` ne réduit PAS la complexité — le second call opère sur la reason string, pas l'input brut. Testé explicitement (`package describe("wrapper invariants")`).
- **C borné structurellement ≈ 3** : avec les boost caps (Strategique R=4, Path T=3, Verb R=3), le C ne peut jamais dépasser R/T max + A/K baseline → worst case `(1+2+4+3)/4=2.5 → round=3`. **La branche `C≥4 → L3` est donc INATTEIGNABLE** avec le booster set actuel — `I=3` seul déclenche L3. Propriété structurelle documentée dans le header du test file (pas un bug — un design emergent).

**Décisions architecturales pour le Step 4 (S14) ⚡ :**

- **L'ECS route doit piloter la longueur du contexte additionnel** : condition (b) du S14 = `[boot context + identity prompt court + ECS route decision]`. L1 = ~500 tokens total, L3 = boot + protocole triangulé (justification Step 6).
- **Reason string exportable comme signal Step 9** : si S14 révèle des cas ambigus ("pourquoi T7 'sécurité' → L3 ?"), la `reason` est dans `ECSEvaluation.reason` — broadcastable dans les logs de session sans re-parse.
- **`vesselAvailable` devient un signal Step 6** : si S14 montre que L3 = `vesselAvailable`-required, Step 6 ship un toggle CLI `--no-vessel` pour condition (c) baseline.
- **Suite de tests déterministes ECS** : 36 tests couvrent maintenant L1/L2/L3 + edges + lock-in FR. S14 peut les réutiliser comme oracle pour vérif post-run : `evaluateECS(t14.text).route === expectedRoute[14]`.

**Leçons pour la suite (5) :**

- **`\b` en JS est ASCII-born même avec `/u`** — la solution canonique pour Unicode-aware word edge est `(?<![\p{L}\p{N}_])` (open) + `(?![\p{L}\p{N}_])` (close). Pattern réutilisable pour Step 9 (Security, regex injection detection) si les patterns adversariaux sont en français.
- **Pluriels et stubs linguistiques** : un stub comme `s[ée]curit[ée]` doit être suivi de `\w*` pour absorber `sécurité`/`sécurités`/`sécurité!`. Tester explicitement les formes plurielles en lock-in tests — sinon un futur "cleanup" les casse silencieusement.
- **`/i` n'équate PAS `é` à `e`** — c'est un piège connu mais qui coûte 1 cycle de revue à chaque fois. Pattern : `[ée]` explicite > `/i` pour les caractères accentués. Le même piège pourrait mordre Step 9 si on liste des mots-clés français à scanner.
- **`Math.round` vs `Math.floor`/`Math.ceil`** : le round mid-point est intuitif quand on veut "à mi-chemin entre deux paliers". Pour Step 7 (Dream mutation scoring 0-1), si on score des mutations sur 5 niveaux, le round est aussi la bonne stratégie.
- **Quand un bug touche un détail engine-spécifique (V8 regex) : mesurer d'abord, spéculer après.** Le test direct en Node (`scripts/ecs-debug3.mjs`) a确立了 le fait que `/u` ne suffit pas pour `\b` Unicode — sans cette mesure, j'aurais passé un cycle de plus à spéculer.

---

---

### 📒 Carnet de session (à.consulter avant chaque step futur)

**Anti-patterns à éviter dans les steps suivants :**
- ❌ Auto-substitution de tokens (le bug `coinResponse`) → toujours relire le diff complet après génération LLM
- ❌ Champs `optionnel` sur des contrats de sécurité → requis par défaut
- ❌ Helpers de test via `vi.stubGlobal` avec `replace` → toujours merge pattern
- ❌ Erreur classes avec un champ custom ET `.cause` → choisir `.cause` (standard)
- ❌ Commenter ce que fait le code sans expliquer *pourquoi* → les choix effectués dans cette note sont la justification

**Conventions validées du projet :**
- TypeScript strict (`tsconfig` du cortex), pas de `@types/node`
- `interface` pour objets, `type` pour unions
- Pas de points-virgules, quotes simples
- `import type` pour les imports type-only
- Tests vitest : `describe`/`it`/`expect` depuis `'vitest'`, mock via injection, pas de global mock
- ESLint : `eslint-plugin-react-compiler`, `@typescript-eslint`, `--max-warnings 0`

**Outils du runtime à router vers chaque step :**
| Step | Type à utiliser | Méthode client |
|------|------------------|-----------------|
~~2 boot~~ | ✅ **Complète** | — |
| 3 ecs | `ECSResult` | — (pure function, pas de MCP) |
| 4 s14 | tous les types | tous les calls |
| 6 triangulation | `TriangulationResult`, `PoleResult`, `FileMatch`, `SearchResult` | `searchMemory` + ripgrep + web |
| 7 dream | `MutationProposal`, `DreamReport`, `TraceFresh`, `DriftSignal` | `searchMemory` + `writeMemory` + `markConsumed*` |
| 8 backup | (réutilise client) | `searchMemory` paginated + `writeMemory` restore |
| 9 security | `ValidationResult` | wrap `writeMemory` |
| 10 dashboard | `BootContext` | `getSystemSnapshot` (read-only) |

*Note :* `markConsumed*` n'est pas encore dans l'API client — à ajouter en Step 7 si Mnemolite l'expose.

---

---

### 🛠️ Infrastructure — Vite proxy `/mcp` (2 juillet 2026)

**Statut :** ✅ Configurée
**Contexte :** Le cortex browser ne peut pas appeler `http://localhost:8002/mcp` directement (CORS cross-origin). Le plan appelait cette config comme prérequis Step 2 end-to-end + Step 10 (`/status` route React consommant `getSystemSnapshot`).

**Fichiers modifiés :**
- `expanse-cortex/vite.config.ts` — `server.proxy` ajoutée sous le bloc server existant :
  ```ts
  server: {
    port: 5173,
    proxy: {
      '/mcp': {
        target: 'http://localhost:8002',
        changeOrigin: true,
      },
    },
  },
  ```
- `expanse-cortex/src/runtime/mcp/client.ts` — commentaire CORS réécrit pour refléter les 3 modes (dev Vite proxy, prod reverse-proxy same-origin, direct cross-origin avec headers explicites).

**Validation :** Syntaxe vérifiée par `tsc` (vite.config.ts non couvert car hors `src/`, mais le pattern Vite proxy est trusté) + `vite build` parse OK. Pas de test unitaire — validé à l'usage navigateur.

**Choix :**
- **`changeOrigin: true`** — réécrit le header `Host` vers `localhost:8002` pour que Mnemolite accepte la requête comme si elle venait de son propre port (utile si Mnemolite filtre sur Host).
- **Pas de `selfHandleResponse` ni `bypass`** — Vite par défaut forward les bytes sans buffering, donc SSE (`text/event-stream`) passe nativement.
- **Pas de `ws: true`** — `/mcp` est HTTP JSON-RPC, pas WebSocket.
- **Pas d'env-var binding** côté Vite : `target` est hardcodé ; les overrides passent par `MNEMOLITE_HOST` env dans `MnemoliteClient` (la résolution env reste au niveau client, pas config Vite qui reste runtime-pure).
- **Pas de `secure: false`** — Vite proxy gère le TLS si besoin ; en local-only HTTP, pas de changement de comportement.

**Conséquence pour la suite :**
- Step 10 (`/status` route) peut maintenant appeler `getSystemSnapshot()` depuis le browser sans struggle CORS.
- Tests E2E Playwright (`pnpm e2e`) peuvent assumer `http://localhost:5173/mcp` comme endpoint same-origin → jouent contre le vrai Mnemolite via proxy sans mock.
- Step 6 (triangulation : `web` pole) aura besoin d'un proxy similaire pour `/web-search` si l'API externe est restrictive ; à noter pour ce step.
- Step 7 (Dream cron) tourne en Node CLI — pas besoin de proxy (accès direct à `localhost:8002` côté serveur).

---

---

### ♻️ Refactor — env vars partagés (`runtime/shared/env.ts`) — 2 juillet 2026

**Statut :** ✅ Complète
**Contexte :** Le pattern `MNEMOLITE_HOST/PORT/PATH` était dupliqué dans `client.ts` (helper `readNodeEnv/parsePort/DEFAULTS`) ET dans `vite.config.ts` (helper `mnemolitePort`) — drift garanti + review cost. Extrait vers un module shared unique.

**Fichiers créés (3) :**
- `expanse-cortex/src/runtime/shared/env.ts` (~80 LOC) — `readNodeEnv()` (cast `globalThis as { process?: ... }`), `parsePort()` (NaN-safe avec fallback explicite), `getMnemoliteEndpointFromEnv()` (composite), `MNEMOLITE_DEFAULTS` object + `_PORT/_HOST/_PATH` constants
- `expanse-cortex/src/runtime/shared/index.ts` (barreau)
- `expanse-cortex/src/runtime/shared/__tests__/env.test.ts` (~150 LOC) — **15 tests** utilisant `vi.stubGlobal('process', {env: {...}})` avec merge-snapshot pattern (préserve les env keys non-patchées). `expect.assertions(N)` sur chaque test, `vi.unstubAllGlobals()` en `afterEach` comme seul cleanup

**Fichiers modifiés (2) :**
- `expanse-cortex/src/runtime/mcp/client.ts` — retiré `readNodeEnv/parsePort` locaux, import depuis `../shared` ; DEFAULTS référence désormais `MNEMOLITE_DEFAULT_PORT/HOST/PATH`
- `expanse-cortex/vite.config.ts` — retiré `mnemolitePort()` local, importe `getMnemoliteEndpointFromEnv().port` ; le proxy et le client lisent le port de la même source → plus de drift possible (audit F.11)

**Bonus — d.ts pour compile-time autocomplete :**
- `expanse-cortex/src/env.d.ts` — minimal ambient typings : `declare global { namespace NodeJS { interface ProcessEnv { MNEMOLITE_HOST/PORT/PATH?: string ; [key: string]: string | undefined } } var process: { env: NodeJS.ProcessEnv } }`. L'index signature `[key: string]` est requise pour que le cast pattern `globalThis as { process?: { env?: Record<...> } }` continue de compiler aux côtés de la déclaration ambient (sinon TS2352 « types suffisamment chevauchés »).

**Validation :** `tsc` 0 erreur · `vitest` 121/121 ✓ (15 env + 36 client + 47 boot + 22 types + 1 setup) · `eslint` 0 warning · code-reviewer a donné **3 itérations** de feedback (drop `MnemoliteConfig` import cassé, add index signature, retry stubGlobal tough case, drop parsePort null widening inutile) — tous appliqués.

**Problèmes rencontrés (3 + 1 résolu par abandon) :**

1. **`MNEMOLITE_DEFAULTS` typé via `satisfies Pick<MnemoliteConfig, ...>`** — mais `MnemoliteConfig` n'est PAS exporté depuis `runtime/types.ts` (il vit dans `client.ts`). `tsc` jetait `TS2305: has no exported member 'MnemoliteConfig'`. **Décision :** drop `satisfies` + `as const` plain → `env.ts` est standalone, pas de dépendance vers le consumer.
2. **d.ts sans index signature → 4 erreurs TS2352** dans env.ts + env.test.ts + client.test.ts (`process.env` typé trop précis, cast `Record<string,string|undefined>` incompatible). **Décision :** ajouter `[key: string]: string | undefined` à `ProcessEnv` — préserve l'autocomplete des 3 vars connues ET la compatibilité avec l'ancien cast pattern.
3. **`vi.unstubAllGlobals()` + `delete globalThis.process`** — la combinaison cassait `process.nextTick` de vitest en interne (`TypeError: Cannot set properties of undefined`). **Décision :** abandonner le test du chemin `'process absent'` (defensive code, helper `?.env` court et lisible en revue). Documenté Honestement dans le header du fichier de test.
4. **eslint-disable-next-line pour `@typescript-eslint/no-namespace`** dans la première version de env.d.ts — la règle n'étant pas chargée par la config du projet, le commentaire était du **dead hint**. **Décision :** retirer le commentaire.

**Choix architecturaux (5) :**

- **Direct `export const MNEMOLITE_DEFAULTS`** plutôt que re-export `export { MNEMOLITE_DEFAULTS }` après déclaration — syntaxe plus naturelle, lue par les humains comme une déclaration.
- **`parsePort(raw, fallback)` avec fallback explicite obligatoire** — l'ancien `parsePort(raw)` lisait `DEFAULTS.port` en interne (cachait le default). Le caller passe maintenant son default → plus flexible, plus testable.
- **`stubProcess` snapshot `originalEnv` puis merge** — `vi.stubGlobal('process', {env: {...originalEnv, ...patch}})` au lieu de `{env: patch}` (qui wipe). Pattern fondamental pour ne pas casser les autres tests parallèles qui dépendent de vars env.
- **`expect.assertions(N)` sur CHAQUE test** — fail-fast si un test prétend faire N assertions mais en fait 0 (cas typique : `expect()` remonte une exception → catchée par le helper d'erreur → test passe à tort).
- **Index signature sur `ProcessEnv`** (point #2) — autocomplete pour les 3 vars connues, fallback typé `string | undefined` pour les autres. Trade-off : on perd la garantie qu'aucune autre var ne peut apparaître accidentellement. Acceptable car la surface `process.env` reste volontairement petite (`runBoot`, `client`, `env`).

**Décisions architecturales pour le Step 3 (ECS pure function) :**

- **Pas de var env pour ECS** — `evaluateECS(input)` est pure, pas de config runtime. Si Step 5 (Distillation prompt) a besoin de seuils configurables, suivre le même pattern : `MNEMOLITE_ECS_THRESHOLD_HIGH?=string` ajouté au d.ts + reader dans `runtime/shared/env.ts`.
- **`runtime/shared/` est le home de helpers transversaux** — pas seulement env. Autres candidats : `fetchWithRetry` (déjà dans cortex utils, à migrer ?), `coerceErrorCode`, `formatTimestamp`. Décision à prendre plus tard.

**Leçons pour la suite (5) :**

- Un module `shared/env.ts` (ou `shared/config.ts`) doit venir **avant** le 2e consumer, pas après — la duplication crée des bugs subtils de drift qui passent typecheck.
- Quand on ajoute un `d.ts` ambient, **toujours inclure l'index signature** pour rester compatible avec les casts `globalThis as { process?: ... }` déjà utilisés.
- **`delete globalThis.process` casse vitest** — pour tester un chemin d'absence, passer par `vi.stubGlobal('process', undefined)` seulement (cleanup via `vi.unstubAllGlobals`).
- **`as const satisfies Pick<T, ...>` est inutile si `T` n'est pas importable** — préférer `as const` plain + tests runtime pour vérifier la forme.
- **`vi.stubGlobal` avec merge-snapshot** est le pattern canonique pour stub de globals qui peuvent être accédés par d'autres tests (vs replace qui pollue).

---

### ♻️ Refactor — `fetchWithRetry` migré vers `runtime/shared/` — 2 juillet 2026

**Statut :** ✅ Complète
**Contexte :** `fetchWithRetry.ts` vivait dans `src/utils/` avec 11 tests. Premier helper cortex à migrer vers `runtime/shared/` (les helpers transversaux du runtime). Pattern : single source of truth entre le runtime LLM-facing (Step 2 boot, à venir Step 6/7) et les hooks React (useGraphData stale-while-revalidate).

**Fichiers créés (2) :**
- `expanse-cortex/src/runtime/shared/fetchWithRetry.ts` (~95 LOC) — implementation portée verbatim depuis `src/utils/`. Comportement préservé : retry/3, baseDelay/800ms, 4xx-no-retry, 429-Retry-After, type-error-retry-seulement, return JSON.
- `expanse-cortex/src/runtime/shared/__tests__/fetchWithRetry.test.ts` (~155 LOC) — 12 tests identiques, fixtures `asFetch()` + `mockResponse()` + `networkError()` helper.

**Fichiers modifiés (3) :**
- `expanse-cortex/src/runtime/shared/index.ts` — barrel exporte maintenant `fetchWithRetry` + type `FetchWithRetryOptions` à côté des exports env. Header commentaire mis à jour pour lister les 2 helpers présents.
- `expanse-cortex/src/hooks/useGraphData.ts` — import `'../utils/fetchWithRetry'` → `'../runtime/shared'` (barrel).
- `expanse-cortex/src/hooks/__tests__/useGraphData.test.ts` — double ajustement : `vi.mock(...)` path `'../../runtime/shared/fetchWithRetry'` (granular — voir problème #2) + lazy `import { fetchWithRetry } from '../../runtime/shared/fetchWithRetry'` correspondant. Production code (useGraphData.ts) garde l'import barrel pour le confort ergonomique.

**Fichiers SUPPRIMÉS (2) :**
- `expanse-cortex/src/utils/fetchWithRetry.ts` + son test — migration propre, pas de shim de compat (on contrôle tous les callers via grep).

**Validation :** `tsc` 0 erreur · `vitest` 41/41 sur la surface migrée (16 env + 12 fetchWithRetry + 13 useGraphData) · `eslint` 0 warning · code-reviewer a donné **2 itérations** de feedback appliquées (mock granularity + DEFAULT_FETCH drop) + 2 nits doc-level appliqués (JSDoc drift + load-bearing ordering note).

**`coerceErrorCode` — reporté à première nécessité :** Pas de helper nommé `coerceErrorCode*` dans `src/` ou `src/runtime/`. Pas de caller in-tree aujourd'hui (les `McpNetworkError` / `McpRpcError` préservent déjà la structure via `.cause`). Créer avec zéro caller = YAGNI. **Décision :** créer à la première demande (probablement Step 6 Triangulation web pole logging, ou Step 9 Security log writer). Le barrel `shared/index.ts` n'exporte rien y_relative — le helper sera ajouté au moment opportun.

**Problèmes rencontrés (3) :**

1. **`DEFAULT_FETCH` wrapper indirection inutile** — première version avait `const DEFAULT_FETCH: typeof fetch = (...args) => globalThis.fetch(...args)` pour « mirror le pattern env.ts globalThis ». Mais `globalThis.fetch(...args)` est byte-identique à `fetch(...)` en browser+Node 18+, le wrapper n'apporte rien (1 extra call + 1 stack frame). Env.ts ADOPTE le globalThis cast parce que `process` EN A BESOIN (`@types/node` absent), `fetch` non. **Décision : drop le wrapper, default = bare `fetch`** (concorde avec l'original migré).

2. **`vi.mock` granularité — bug subtil détecté par le reviewer** — la première migration du test utilisait `vi.mock('../../runtime/shared', ...)` qui mock l'ENTIER barrel. Conséquence : n'importe quel futur export `shared/` (env helpers, autres helpers) transitivement importé par useGraphData aurait été auto-replaced par `vi.fn()` mocks. **Décision :** path mock narrowé à `'../../runtime/shared/fetchWithRetry'`, ET le lazy import du test file aligné pour match. Production code useGraphData.ts garde l'import barrel pour ergonomie. Principe : mock la SPECIFIC module, pas la barrel.

3. **`scenarioContext.test.ts` — 3 échecs PRÉ-EXISTANTS découverts** par `npx vitest run` (full suite). **Pas lié à la migration** — la migration ne touche pas du tout `src/utils/scenarioContext.*`. Diagnostic math :
   - Test `l2Radius: expect 60 + 0.5 * 50 = 85`, code retourne 190 (= `L1_RADIUS_BASE/130 + dynamicActivity/0.5 * L2_RADIUS_PER_ACTIVITY/120`)
   - Test `l0Radius: expect 60`, code retourne 120 (= `L0_RADIUS`)
   - Test `l1Radius: expect 60 + 3 * 15 = 105`, code retourne 250 (= `L1_RADIUS_BASE/130 + cortexItemCount/3 * L1_RADIUS_PER_ITEM/40`)
   - Test uses **stale constants (60, 50, 0.15)** qui n'existent plus dans l'implémentation. Les expectations sont en avance sur le refactor des constantes AURA.
   - **Décision :** hors-scope de cette migration. Noté dans journal + summary pour fix dédié quand l'investigation des constantes AURA se fera (probablement Step 7 si Dream depend de l'aura, ou fix dédié antérieur).

**Nits doc-level appliqués (2) :**

- **JSDoc `fetchFn` drift** — interface comment disait « Defaults to globalThis.fetch » après que le default soit redevenu bare `fetch`. **Fix :** « Defaults to the global `fetch` (browser / Node 18+) » — honnête.
- **Lazy-import ordering note** — ajouté commentaire load-bearing sur le `import { fetchWithRetry }` après le bloc `vi.mock(...)`. Si un futur contributeur déplace l'import en haut du fichier (où « imports usually go »), le mock ne sera plus intercepté → tests peuvent hang sur vrais fetches. Le commentaire explicite la raison : vitest hoiste `vi.mock` mais PAS les ES imports → l'ordre compte.

**Choix architecturaux :**

- **Pas de shim de compat utils/ → shared/** — la migration est clean, on grepe tous les callers avant delete. Trade-off : si un module externe (hors repo) importait `src/utils/fetchWithRetry`, ça casse. Acceptable : c'est du code interne au repo, l'export barrel `runtime/shared` est l'API publique désormais.
- **`fetch` bare default** au lieu de `globalThis.fetch` wrapper — wrapper était indirection sans valeur. Bare est plus idiomatique et 1 tick plus rapide.
- **Granular `vi.mock` paths** — suivre le pattern « mock the specific module, not the import surface ». Anti-fragile pour les futurs helpers.
- **`as const` / barrel type re-exports** — `FetchWithRetryOptions` type exporté depuis barrel, pas juste internals. Consumers n'ont pas à descendre dans le sous-dossier pour le type.

**Leçons pour la suite :**

- **Tester la migration avec la FULL suite, pas juste la surface migrée** — c'est comme ça que `scenarioContext.test.ts` (3 bugs pré-existants) ont été remontés à la conscience. Sans `npx vitest run` global, les bugs auraient continué à dormir.
- **Quand un helper est transversal, le mock à la BARREL est une footgun** — toujours granular `vi.mock('path/to/specific-module', ...)`. Le barrel mock s'applique à TOUS les imports transitifs.
- **`globalThis.X` wrapper n'est justifié que si `X` nécessite un cast** — `process` oui (pas de `@types/node`), `fetch` non. Pas de pattern-matching aveugle entre helpers.
- **Les constantes magiques dans les tests sont un signal de drift** — quand un test utilise `60+0.5*50` mais le code utilise `130+0.5*120`, c'est qu'un Refactor des constantes (probablement pour des questions de design AURA) a eu lieu SANS mise à jour des tests. Le test était en avance sur l'impl.

**Dette technique PAYÉE :** `src/utils/__tests__/scenarioContext.test.ts` — 3 failures session précédente → 0 (fixées via realignment aux constantes EPIC §Ⅸ + restoration de `CORTEX_INJECT_PHASES`/`CORTEX_PRUNE_PHASES` + L2 formula corrigée en unconditional base + `l2Active` resserrée sur `dynamicActivity > 0` seul ; voir entry « AURA constants drift »).

---

### 🟢 Étape inter-steps — Contract surface formalized (ecs/triangulation/dream/security) — 2 juillet 2026

**Statut :** ✅ Complète (interfaces only — Step 3/6/7/9 logic still pending)
**Gains :** Step 3/6/7/9 ont maintenant une cible stable pour l'implémentation — le type system catchera toute signature incorrecte dès la première ligne de code.

**Fichiers créés (8) :**
- `expanse-cortex/src/runtime/ecs/contracts.ts` — `ECSInput { text, vesselAvailable? }`, `ECSEvaluation { result: ECSResult, reason: string }`, `type EvaluateECS = (input) => ECSEvaluation`
- `expanse-cortex/src/runtime/triangulation/contracts.ts` — `TriangulationInput { query, scopeContext? }`, `type PoleFunction`, **`type PoleTriple = readonly [PoleFunction, PoleFunction, PoleFunction]`** (force l'ordre anchor/vessel/web), `type TriangulateAggregator`
- `expanse-cortex/src/runtime/dream/contracts.ts` — `DreamConfig { dryRun?, maxTraceTokens?, timestampOverride? (@internal) }`, `type RunDreamJob`
- `expanse-cortex/src/runtime/security/contracts.ts` — `ExternalContent { raw, originUrl? }`, `ProvenanceLog { source, timestamp, rejected, flaggedPattern?, memoryId? }`, 3 type aliases : `ValidateMemory(content, source)` (per-source rules: external=full scan / user=light / self=pass-through), `SanitizeExternal`, `LogProvenance`
- 4 fichiers de tests : `contracts.test.ts` pour chaque module (26 tests total, interface-level : barrel re-export + sample instance shape + @ts-expect-error negative + function-shape compile checks)

**Fichiers modifiés (5) :**
- 4 barrels stubs (`ecs/`, `triangulation/`, `dream/`, `security/`) : `export {}` → `export * from './contracts'` (chaque barrel devient trickle-down vers contracts types uniquement ; la logique impl viendra dans `evaluate.ts` / `aggregate.ts` / `cron.ts` / `{validate,sanitize,provenance}.ts` aux Steps 3/6/7/9)
- `src/runtime/index.ts` : les 4 modules maintenant flat-re-exportés via le barrel racine (plus de commentaires stubs, mcp + boot restent intacts)

**Validation :** `tsc` 0 erreur · `vitest src/runtime/` 159/159 ✓ (47 boot + 36 mcp + 22 types + 22 env-contract + 12 fetchWithRetry + 26 contracts neum) · `eslint --max-warnings 0` 0 warning · code-reviewer validé après 2 itérations (la première avec un test typo + un `ValidateMemory` 1-arg ; corrigé en 2-arg + tuple `PoleTriple`)

**Choix architecturaux (5) :**

1. **Module-local contracts.ts (pas de bloat dans central types.ts)** — chaque module ajoute ses propres input shapes (`ECSInput`, `TriangulationInput`, `DreamConfig`, `ExternalContent`/`ProvenanceLog`) SANS dupliquer les DTOs de sortie (`ECSResult`, `TriangulationResult`, `DreamReport`, `ValidationResult` restent dans `runtime/types.ts`).
2. **Wrapper types for explanation metadata** — `ECSEvaluation` emballe `ECSResult` avec un `reason: string` (pour explainability de la décision routing) au lieu de polluer central types. Permet Step 9 security d'utiliser ce `reason` pour logging audit.
3. **Fixed-length tuple `PoleTriple`** pour la triangulation — bloque les compositions hors-spec (`[]`, `[anchor, vessel]`, etc.). Le 3-pôle est structurel dans le spec, pas flexible.
4. **Per-source `ValidateMemory(content, source)`** — différentes règles de scan selon `MemorySource` (`external` : full / `user` : light / `self` : trust). Sans ce 2-ième arg, le Step 9 devrait refactor post-hoc.
5. **`@internal` JSDoc tag** sur `DreamConfig.timestampOverride` — explicitement un helper de debug test-only exposé pour des timestamps déterministes en CI mais masqué pour les consumers production (qui omettent et obtiennent `new Date().toISOString()`).

**Décisions architecturales pour Step 3 / 6 :**

- **Step 3 (ECS) peut écrire `evaluateECS()` directement** — la signature `(input: ECSInput) => ECSEvaluation` est pinned. Les heuristiques du plan (calibration Ambiguïté/Connaissance/Raisonnement/Outils) remplissent `result.C`/`result.I`/`result.route` ; la chaîne humaine genre `'\u00ab C=4 ≥ threshold → L3 \u00bb'` remplit `reason`.
- **Step 6 (Triangulation) doit respecter le tuple** : `[poleAnchor, poleVessel, poleWeb]` en arguments, le `TriangulateAggregator` destructure. Les 3 fonctions de pôles seront créées dans `triangulation/poles.ts`.
- **Le `verifyMeter` `process.env`** n'est PAS consommé par ECS/Dream/Triangulation/Security (tous pure functions ou close-over-le-client) — pas besoin d'élargir `runtime/shared/env.ts`.

**Leçons pour la suite (5) :**

- **Stub-fill = (types + interface tests + barrel re-exports), pas la logique.** Pattern reproductible pour n'importe quel futur module Step X qui n'a pas de cible testable avant l'impl.
- **`readonly [A, B, C]` tuple** est l'outil de choix pour les APIs à cardinalité fixe — empêche `poles.push(...)`, `poles.pop()`, `poles.splice(...)` et signale aux reviewers l'intention structurelle.
- **Per-source/per-context discrimination** doit être intégrée DÈS LE CONTRAT (2-arg plutôt que 1-arg), pas ajoutée après coup quand l'impl révèle l'asymétrie.
- **`expect(barrel).toBeDefined()` est un check faible** — préférer compile checks via `const sample: Type = {}` dans describe() (échoue si barrel perd un export).
- **Les tests interface-level sont un `Barometer`** de la docstring accuracy — si le test accepte 4 valeurs mais que la JSDoc dit 3, le contrat est mauvais.

---

*Plan vivant produit le 2 juillet 2026 — Buffy (Codebuff, GLM-5.2)*
*Face à l'immensité de la matrice, quel signe vas-tu inscrire aujourd'hui ?*
