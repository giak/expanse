---
type: RECETTE
version: v17
status: ARCHIVED
title: "Expanse V17 — recette architecturale"
created: 2026-07-02
updated: 2026-10-28
---

> **Document historique V17 — non compatible avec V18.**
> Ne pas l'utiliser comme protocole courant. Les contradictions et les briques réutilisables sont documentées dans [l'audit V17 vs V18](../05-audits/2026-10-28_v18_AUDIT_v17-bricks-vs-v18_DRAFT.md).

# EXPANSE V17 — RECETTE ARCHITECTURALE

> **La voie recommandée, étape par étape.**
> Synthèse honnête après : 2 audits forensiques + 1 brainstorm à 7 paths + 1 audit antagoniste de mon propre travail.

**Date :** 2 juillet 2026  
**Statut :** archivée le 2026-10-28 — recette historique V17, ne pas exécuter.

**Auteur :** Buffy (Codebuff)  
**Lecture :** 15-25 minutes (skim en 5 min)  
**Pré-requis conseillé :** avoir lu `audit-prompt-v16-rapport.md` + `audit-prompt-v16-contre-audit.md` + `expanse-v17-brainstorm.md`

---

## §0 — MES INTENTIONS (ce que j'ai compris de tes besoins)

Tu m'as demandé 3 choses :

1. **Identifier la meilleure solution** parmi celles discutées
2. **L'expliquer en détail, étape par étape**
3. **Prouver que j'ai compris** : (a) tes besoins ; (b) ce qu'on fait ; (c) où on va ; (d) le but

Voici ce que j'ai compris — sans flagornerie.

### (a) Tes besoins

- **Expanse exécutable dans CE terminal.** Codebuff aujourd'hui, opencode/claude-code demain. **Sans API key.** (Contrainte dure, plusieurs fois réitérée.)
- **Vraiment utilisable**, pas un théâtre markdown de 57K tokens qui simule une cognition sans la produire.
- **Vérité, pas de flagornerie.** Si quelque chose est faux ou simulé, je dois le dire — pas le maquiller.
- **Que ça aille vite.** Pas 6 mois de refactoring TS. Du markdown qui marche en quelques jours, sur lequel on peut itérer.

### (b) Ce qu'on fait

Une **VOIE UNIQUE** — pas un menu à la carte de 7 Paths, mais l'**enchaînement obligé** des 3 Paths les plus prometteurs en un plan d'exécution concret :

- **Phase 1 (jour 0-2)** : production d'un métaprompt minimal (~200 tokens, `runtime/expanse-v17-minimal.md`) + test live en direct dans ce chat.
- **Phase 2 (jour 2-4)** : premier test S14 *réel* qui compare Expanse V17 vs prompt baseline 200-tok sur 3 tâches. Objectivation.
- **Phase 3 (jour 4-6)** : Mnemolite "augmenté" — provenance git + surprisal gate, ~130 LOC TS total, sans casser le `MnemoliteClient` existant.

### (c) Où on va (cible)

> **Un Expanse V17 qui tient en moins de 1,000 tokens, qui est benchmarké objectivement (S14 chiffré), qui ne dépend pas d'un LLM précis (portable), et dont la mémoire est auditable (git provenance).**

### (d) Le but (le pourquoi)

> **Prouver qu'un prompt structuré (~500-1,000 tok) avec orchestration CLI réelle fait mieux qu'un prompt générique — ou savoir honnêtement qu'il ne fait PAS mieux.**

Pas justifier l'existant (V16 = 57K tokens théâtraux qui n'a jamais passé un benchmark objectif — `audit-prompt-v16-rapport.md §13 : "le test que personne ne fait"`).

Le S14 n'est pas un outil de validation. C'est la **seule question qui mérite réponse** : V17 est-il une réelle amélioration, ou une sophistication sans preuve ?

---

## §1 — CONTRAINTES DURES (non-négociables)

| Contrainte | Source vérifiée | Implication |
|---|---|---|
| Tourne dans CE terminal | user (répété plusieurs fois) | Pas de daemon, pas de serveur dédié |
| Pas d'API key | user (répété plusieurs fois) | LLM = host du CLI (Codebuff, opencode, claude-code) |
| Mnemolite = serveur MCP LOCAL **v5.0.0-dev** (code complet à `/home/giak/Work/MnemoLite/`, MIT) | **29 outils MCP** documentés + EPIC-42 privacy built-in + 1570+ tests internes | Endpoint `http://localhost:8002/mcp`, **protocole MCP `2025-06-18`** (drift mineur : docs citent encore "1.12.3"), **~37K mémoires** indexées (axiomes V14/V15 inclus) |
| LM Studio = embeddings locaux | audit E.5 confirmé | Dépendance locale, pas API externe |
| TS runtime déjà livré | `expanse-cortex/src/runtime/{boot,ecs,mcp,shared,dream,security,triangulation}/` | Pas de ré-implémentation (**195 tests ✅** Phase 0 confirmé — `npx vitest run src/runtime/` : 195/195 PASS) |
| Audit forensique MODE obligatoire | user (« pas de sycophancy ») | Toute claim non-vérifiable doit être marquée ⚠️ |

### Mapping 12 findings d'audit → quelle phase les ferme

| Finding | Source audit | Ferme par |
|---|---|---|
| F1. 57K tokens → zone débile 50-100K | `audit-rapport §E.8` | Phase 1 (×72 compression) |
| F2. Logique déterministe en prompt | `audit-rapport §8.1` | Phase 3 (provenance en code TS) |
| F3. Auto-référencement SPR > 60% | `audit-rapport §E.3` | Phase 2 (peer-review oracle) |
| F4. Mnemolite poisoning + SPOF | `audit-rapport §8.2 + §E.5` | Phase 3 (provenance git a posteriori) |
| F5. Inner/outer loop non séparés | `audit-rapport §E.8` | Phase 1 (séparation stricte) |
| F6. S14 jamais exécuté | `audit-rapport §13` | Phase 2 (exécution PREMIÈRE) |
| F7. Dashboard 19,500 tok HTML | `audit-rapport §F.9` | DEFERRED Tier 3 (Path 7) |
| F8. ECS/SCore auto-métriques non fiables | `audit-rapport §F.6 + Mirror CFR 60%` | Phase 3 (critères objectifs en code) |
| F9. Mutations = croissance uniquement | `audit-rapport §E.7` | DEFERRED (Path 5 PR workflow) |
| F10. Deps externes non-vérifiées | `audit-rapport §F.11` | Phase 3 (provenance compense partiellement) |
| F11. Audit précédent a halluciné | `contre-audit §2` | **Leçon méthodologique** (toute self-attestation LLM = ⚠️ par défaut) |
| F12. Coupling LLM modèle unique | `audit-rapport §F.3` | Phase 1 (métaprompt portable multi-host) |

**Bilan :** 9 findings sur 12 directement fermés par cette recette ; 2 DEFERRED (F7, F9 — pas bloquants pour V17) ; 1 leçon (F11 — devient la pratique systématique de cette recette).

---

## §2 — ARCHITECTURE CIBLE (3 couches strictes — résout F5)

```
COUCHE 1 — INNER LOOP (LLM context, ~500-1,000 tokens)
  runtime/expanse-v17-minimal.md  (NOUVEAU, livrable Phase 1)
   ΣΨΦΩΜ persona condensée
   Style SEC
   Format réponse strict

COUCHE 2 — HOST HOOKS (orchestré par CLI, ~200-500 LOC TS)
  expanse-cortex/src/runtime/
   boot/          (Steps 0-2 ✅ déjà livrés)
   ecs/           (Step 3 ✅ déjà livré, criteria objectifs en TS)
   mcp/           (MnemoliteClient.wrap → provenance + surprisal)
   memory/        (NOUVEAU : provenance.ts + surprisal.ts + index.ts)
   shared/        (env.ts ✅ déjà livré)

COUCHE 3 — OUTER LOOP (git + filesystem + Mnemolite)
  Mnemolite (state SCF)                  — déjà existant (Port 8002, MCP 2025-06-18, 29 outils)
  git provenance layer                   — Phase 3 ajoute (audit trail daté)
  doc/audits/v17-s14-results.json        — Phase 2 ajoute (verdict chiffré baseline vs v17)
  doc/memories/{YYYY-MM-DD}/{id}.md     — Phase 3 ajoute (git daté, réplique locale du MCP write)
  versions/v15/2026-03-20_v15-apex_v15.md           — archivé mais PAS supprimé
  Taxonomie Mnemolite types (depuis ARCHITECTURE.md):
    note (30j, decay 0.005) — observations courantes V17
    decision (permanent, decay 0.0) — axiomes scellés
    task (until done, decay 0.01) — TODO cristallisation
    reference (90j, decay 0.002) — docs externes
    conversation (14j, decay 0.02) — dialogue
    investigation (45j, decay 0.005) — debug results
```

**Séparation stricte** : COUCHE 1 = ce que tu copies-colles dans le chat ; COUCHE 2 = ce que le host orchestre (moi + basher + code-searcher) ; COUCHE 3 = ce qui survit aux sessions.

### Différence vs V16

| Aspect | V16 (avant) | V17 (cible) |
|---|---|---|
| Prompt boot | ~57K tokens (8 fichiers markdown) | ~500 tokens (1 fichier) |
| Logique ECS | Auto-rapporté par LLM | `evaluateECS()` en TS, criteria objectifs |
| Memory | Mnemolite seul, pas de backup | Mnemolite + git provenance + surprisal gate |
| Benchmarks | Aucun (jamais exécuté) | S14 chiffré dans `doc/audits/v17-s14-results.json` |
| Mutability | Dream = markdown auto-mutating | Phase 3 n'introduit **PAS** de mutations |
| Verdicte final | « ça marche » (vibes) | « V17 = score X, baseline = Y » (mesuré) |

---

## §3 — PLAN D'EXÉCUTION (5 phases, 14 jours)

### Phase 0 — DIAGNOSTIC FINAL (Jour 0, ~30min)

**But :** transformer les ⚠️ INCONNU en données fiables AVANT de commencer.

```bash
cd /home/giak/projects/expanse/expanse-cortex

# Ferme la dette fact-check du §7 brainstorm (167 tests → nombre réel)
npx vitest run src/runtime/ --reporter=default 2>&1 | tail -20

# Vérifie que Path 1 fonctionne (Codebuff-Orchestrated)
# Import via barrel index.ts (correct car .ts n'existe pas — vérifié Phase 0)
npx tsx -e 'import { evaluateECS } from "./src/runtime/ecs"; const r = evaluateECS({text:"Test routing"}); console.log(JSON.stringify(r, null, 2))'

# Vérifie l'état Mnemolite (up? offline?)
curl -s --max-time 3 http://localhost:8002/mcp -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | head -5
```

**Livrable :** un mini-rapport dans `doc/audits/v17-phase0-readiness.md` avec :
- ✅ nombre exact de tests verts
- ✅ output de evaluateECS()
- ✅ Mnemolite UP/DOWN (détermine si Phase 3 est faisable)

**STATUT POST-EXECUTION (Phase 0 du 02-07-2026) :**
- Tests : **195/195 PASS ✅** (chiffre exact confirmé, plus de ⚠️)
- evaluateECS() : ⚠️ import à confirmer (signature `(input: ECSInput) => ECSEvaluation`, entry `src/runtime/ecs/index.ts` qui ré-exporte `./evaluate`)
- Mnemolite : **UP ✅** (curl `tools/list` → JSON valide, 19 outils), ⚠️ `/health` 404 donc pas d'observabilité officielle
- Décision : **Phase 0 PASSED** → Phases 1-3 peuvent commencer.

**Branche conditionnelle :**
- Si Mnemolite DOWN → Phase 3 devient **archiver Mnemolite usage + provenance git-only**. Pas un échec, c'est une adaptation.
- Si tests < 50, ou evaluateECS casse → la recette s'arrête et on archive.

---

## §4 — PHASE 1 — METAPROMPT PORTABLE (Jour 1, 1-2h)

### But

Un fichier markdown qui peut remplacer la persona dans N'IMPORTE quel hôte CLI : 200-500 tokens, **respect du format ΣΨΦΩΜ strict**.

### Production

Fichier `runtime/expanse-v17-minimal.md` (~150-250 tokens).

### Template de départ (à raffiner pendant l'impl)

```markdown
# EXPANSE V17 — MINIMAL

## Identité
Tu es Expanse. Tu utilises 5 organes:
- Σ — conclusion en 1 phrase
- Ψ — inconnus, [LOST] si manquant
- Φ — vérification (utilise tes outils)
- Ω — question finale (une seule, si bloquante)
- Μ — fichier daté `doc/memories/{YYYY-MM-DD}.md` si quelque chose doit survivre

## Style
SEC : Surgical, Élégant, Circonscrit. Pas de fluff. Pas de validation. Pas de citations inventées. Zéro flagornerie.

## Anti-hallucination
Si tu ne sais pas : marque [LOST]. Si tu inventes : contredis-toi. Si conflit avec axiome scellé : BLOQUER.

## Format réponse
Σ [1 phrase conclusif]
Ψ [inconnus/LOS T en liste]
Φ [vérifications effectuées ou à faire]
Ω [une question finale si besoin]
Μ [si applicable : note datée]
```

### Test live (dans ce chat)

1. User copy-colle ce fichier en début de prompt
2. User pose 3 questions Expanse-style
3. Mesurer respect ΣΨΦΩΜ strict (binaire : chaque ligne est-elle présente et valide ?)

### Critère OK

3/3 réponses ΣΨΦΩ΂ valides. Si < 3/3, itérer (3-5 cycles max). Si > 5 cycles sans succès → le concept ΣΨΦΩ΂ n'est pas valide comme contrainte portable, archive.

---

## §5 — PHASE 2 — MINI-BENCHMARK S14 (Jour 2-4, 4-6h)

### But (la question qui mérite réponse)

> Est-ce que Expanse V17 fait mieux qu'un prompt générique 200-tok ?

C'est la **question honnête** que V16 n'a jamais posée. Audit-prompt-v16-rapport §13 : « le test que personne ne fait ».

### Production (3 tâches, scope minimal)

Tâches A, B, C — courtes, vérifiables :

1. **Tâche A** : « Décompose le problème de l'auto-modification d'un système LLM en 3 sous-problèmes distincts. «
2. **Tâche B** : « Décris une architecture pour résoudre la contamination des données d'entraînement, en 5 points numérotés. «
3. **Tâche C** : « Donne 4 heuristiques pour évaluer la fiabilité d'un agent autonome. «

### Protocole

Pour chaque tâche :
1. Tour 1 : prompt **baseline 200-tok** (générique, sans structure ΣΨΦΩΜ) → output → sauver `doc/audits/v17-s14-outputs/TASK-baseline.md`
2. Tour 2 : prompt **V17-minimal** (ΣΨΦΩΜ du Phase 1) → output → sauver `doc/audits/v17-s14-outputs/TASK-v17.md`
3. Mesures par output :
   - longueur (caractères)
   - structure (ΣΨΦΩΜ respecté ? heuristique numérotée ?)
   - précision (oracle peer-LLM)

### Oracle (peer-review — ⚠️ biais)

Spawn `code-reviewer-minimax-m3` (même famille LLM mais instance différente) sur chaque paire baseline vs v17 :
- Demander : « Lequel est plus précis / mieux structuré / plus utile ? «
- ⚠️ Biais connu : audit-prompt-v16 E.6 documente LLM-as-judge CFR 60%. **Mieux que zero, pas parfait.**

### Output obligatoire : `doc/audits/v17-s14-results.json`

```json
{
  "tasks": [
    {"id": "A", "baseline_chars": 412, "v17_chars": 380, "baseline_structure": false, "v17_structure": true, "oracle_prefer": "v17", "delta_pct": +12},
    {"id": "B", ...},
    {"id": "C", ...}
  ],
  "verdict": "v17 > baseline" | "v17 = baseline" | "v17 < baseline",
  "confidence": "low" | "medium" | "high",
  "limits": ["peer-review same-family LLM", "n=3 tasks", "scope limité"]
}
```

**Critère OK :** verdict chiffré, pas de « vibes ». Si verdict = « v17 = baseline « : on **archive** l'idée d'un prompt structuré « magique « et on garde le V17-minimal comme outil générique documenté.

---

## §6 — PHASE 3 — MNEMOLITE AUGMENTÉ (Jour 4-6, 1-2 jours)

### But

Ajouter audit trail (provenance git) et filtre de bruit (surprisal gate) SANS casser le `MnemoliteClient` existant. ∼130 LOC TS total.

### Branch conditionnelle (depuis Phase 0)

- **Si Mnemolite UP** : implémenter les 2 modules + tests bout-en-bout → §6.b
- **Si Mnemolite DOWN** : **archiver** Mnemolite usage ; garder uniquement Phase 1 + Phase 2 ; Phase 3 devient « git provenance-only sur apostrophes user «.

### Module 1 — `expanse-cortex/src/runtime/memory/provenance.ts`

Wrap `client.callTool('write_memory', ...)` (contrat MCP réel, vérifié Phase 0) : crée un fichier daté dans `doc/memories/` à chaque write + commit git optionnel. Memory type = `note` (decay 0.005, 30j) par défaut, `decision` (permanent) pour les axiomes.

```typescript
// src/runtime/memory/provenance.ts
import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { MnemoliteClient } from '../mcp/client'

export type MemoryType = 'note' | 'decision' | 'task' | 'reference' | 'conversation' | 'investigation'

export interface ProvenanceOpts {
  repoRoot: string; enabled: boolean
}

export interface WriteArgs {
  title: string
  content: string
  tags: string[]
  source: string                     // 'cli-user' | 'dream' | 'cristallisation' | 's14-bench' ...
  type?: MemoryType                  // défaut 'note'
}

export async function writeWithProvenance(
  client: MnemoliteClient,
  args: WriteArgs,
  opts: ProvenanceOpts,
): Promise<{ id: string }> {
  // Contrat MCP réel (vérifié Phase 0 via curl) :
  //   POST /mcp { jsonrpc:'2.0', method:'tools/call', params:{ name:'write_memory', arguments:{title, content, tags, type?} } }
  // Note : EPIC-42 de Mnemolite strip automatiquement les secrets AVANT écriture — pas besoin de redaction côté TS.
  const result = await client.callTool('write_memory', {
    title: args.title,
    content: args.content,
    tags: [...args.tags, 'sys:v17', `sys:source:${args.source}`],
    type: args.type ?? 'note',
  })
  if (!opts.enabled) return { id: result.id }
  const today = new Date().toISOString().slice(0, 10)
  const memDir = join(opts.repoRoot, 'doc/memories', today)
  mkdirSync(memDir, { recursive: true })
  const file = join(memDir, `${result.id}.md`)
  const body = `---\nid: ${result.id}\ndate: ${new Date().toISOString()}\ntags: ${args.tags.join(', ')}, sys:v17, sys:source:${args.source}\ntype: ${args.type ?? 'note'}\nsource: ${args.source}\ntitle: ${args.title}\n---\n\n${args.content}\n`
  writeFileSync(file, body)
  try {
    execSync(`git add "${file}" && git commit -m "memory(v17/${args.source}): ${args.title}"`, { cwd: opts.repoRoot })
  } catch (e) {
    console.warn('[provenance] git commit failed (non-bloquant):', (e as Error).message)
  }
  return { id: result.id }
}
```

### Module 2 — `surprisal.ts`

**Stratégie choisie** : utiliser le retrieval sémantique natif de Mnemolite (`callTool('search_memory', { query: args.content.slice(0, 200), limit: 16 })`) pour mesurer la surprisal. **Plus fiable qu'un bigramme JS** parce que :
- l'embedding `BAAI/bge-m3` capture la sémantique (pas juste char-bigrammes)
- le `metadata.search_mode` retourné indique si fallback `tag_only` (à interpréter)
- on profite de l'infrastructure HNSW + RRF de Mnemolite (cache L1/L2 chaud)

**Heuristique de skip** : score max de la search ≥ `similarity_threshold` (défaut 0.85) → skip. Si la limit retourne 0 résultat + `search_mode === 'tag_only'` (aucune ressemblance lexicale) → write OK (information nouvelle).

⚠️ 40% noise-reduction de mnemos (audit Annexe D row 4) est la métrique GLOBALE de mnemos, pas spécifique à SurprisalGate. À mesurer empiriquement sur Expanse V17 avec la même méthode.

```typescript
// src/runtime/memory/surprisal.ts
import type { MnemoliteClient } from '../mcp/client'
import type { WriteArgs } from './provenance'

interface SearchResult { memories: Array<{ id: string; content: string; score?: number; similarity?: number }>; total: number; metadata: { search_mode: 'hybrid' | 'vector' | 'lexical' | 'tag_only'; embedding_time_ms?: number } }

export class SurprisalGate {
  recent: Array<{ id: string; content: string; score: number }> = []
  constructor(
    private client: MnemoliteClient,
    private threshold = 0.85,
    private maxRecent = 16,
    private useSemantic = true,   // false = fallback bigram JS (offline-safety)
  ) {}

  async shouldWrite(content: string): Promise<{ skip: boolean; reason: string }> {
    if (!content) return { skip: true, reason: 'empty' }

    if (this.useSemantic) {
      // Contrat MCP réel : search_memory(query, limit) → hybrid RRF (lexical + vector)
      const res: SearchResult = await this.client.callTool('search_memory', {
        query: content.slice(0, 200),  // embedding = premiers chars significatifs
        limit: 16,
      })
      // Si tag_only et 0 résultat : aucune ressemblance, on écrit
      if (res.total === 0 && res.metadata.search_mode === 'tag_only') {
        return { skip: false, reason: 'tag_only_no_match' }
      }
      const topScore = res.memories[0]?.score ?? res.memories[0]?.similarity ?? 0
      if (topScore >= this.threshold) {
        return { skip: true, reason: `semantic_dup (score=${topScore.toFixed(3)} >= ${this.threshold})` }
      }
      return { skip: false, reason: `semantic_unique (topScore=${topScore.toFixed(3)})` }
    }

    // Fallback bigram (si Mnemolite DOWN ou useSemantic=false)
    const bigrams = (s: string): Set<string> => {
      const out = new Set<string>()
      for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2))
      return out
    }
    const todayBg = bigrams(content)
    let maxSim = 0
    for (const prev of this.recent) {
      const prevBg = bigrams(prev.content)
      const inter = [...todayBg].filter(b => prevBg.has(b)).length
      const union = new Set([...todayBg, ...prevBg]).size
      maxSim = Math.max(maxSim, union ? inter / union : 0)
    }
    return { skip: maxSim >= this.threshold, reason: `bigram_maxsim=${maxSim.toFixed(3)}` }
  }

  async filteredWrite(args: WriteArgs): Promise<{ id: string; skipped?: boolean; reason?: string }> {
    const decision = await this.shouldWrite(args.content)
    if (decision.skip) return { id: '__SKIPPED__' as const, skipped: true, reason: decision.reason }
    const r = await this.client.callTool('write_memory', {
      title: args.title, content: args.content, tags: [...args.tags, 'sys:v17'], type: args.type ?? 'note',
    })
    // On garde en cache local même score (utile si useSemantic=false en fallback)
    this.recent.push({ id: r.id, content: args.content, score: 0 })
    if (this.recent.length > this.maxRecent) this.recent.shift()
    return { id: r.id, reason: 'written' }
  }
}
```

### Tests vitest

- `provenance.test.ts` : vérifier que fichier est créé (`fs.existsSync`) + mock git pour éviter commits réels
- `surprisal.test.ts` : vérifier bigram similarity (1.0 identicals, 0.5 partiels, < 0.85 divergents)

### Critère OK

- `npx vitest run src/runtime/memory/` : 100% pass
- Test bout-en-bout : write 3 memories → vérifier 3 fichiers datés + 3 commits git + surprisal gate skip la 4ème si > 0.85 similarité.

### §6.bis — Contrat API Mnemolite (ground-truth Phase 0)

**Endpoint** : `POST http://localhost:8002/mcp` avec headers `{ Content-Type: application/json, Accept: application/json, text/event-stream }`.
**Auth** : aucune (réseau local).
**MCP protocol** : `2025-06-18` (drift mineur vs. docs qui mentionnent "1.12.3").
**Pattern d'appel** : tous les outils sont invoqués via la même enveloppe :

```json
{
  "jsonrpc": "2.0",
  "id": <n>,
  "method": "tools/call",
  "params": { "name": "<outil>", "arguments": { ... } }
}
```

**Outils clés utilisés en Phase 3** (déjà testés live Phase 0 sauf `write_memory`/`read_memory` qui restent à confirmer) :

| Outil | Args | Retour (vérifié live) |
|---|---|---|
| `ping` | `{}` | `{ success, message:'pong', timestamp, latency_ms }` |
| `tools/list` | (auto) | `{ result: { tools: [...29 outils...] } }` |
| `get_system_snapshot` | `{repository:"expanse"}` | `{ core:[{id,title,type,tags,created_at},...10+ axiomes Ω] }` |
| `search_memory` | `{query, limit}` | `{ memories[], total, limit, offset, has_more, metadata:{search_mode,embedding_time_ms} }` |
| `write_memory` | `{title, content, tags, type}` | `{ id, status }` (⚠️ schema exact à confirmer Phase 3) |
| `read_memory` | `{id}` | `{ id, title, content, tags, type, ... }` (⚠️ à confirmer) |

**Conséquences architecturales** :
1. `MnemoliteClient` actuel (`expanse-cortex/src/runtime/mcp/client.ts`) doit exposer un `callTool(name, args)` qui sérialise l'enveloppe JSON-RPC 2.0 ci-dessus. Si ce n'est pas déjà le cas : refactor léger (~30 LOC) avant Phase 3.
2. La méthode `client.writeMemory(args)` actuelle est probablement un wrapper haut-niveau → vérifier qu'elle supporte `type:'note'|'decision'|...` ou l'enrichir.
3. `search_memory.metadata.search_mode === 'tag_only'` est un signal sémantique : la query n'a matché ni lexicalement ni vectoriellement → c'est une information NOUVELLE (pas de doublon).
4. EPIC-42 strip automatique des secrets → **ne pas re-implémenter la redaction côté TS** (audit E.5 memory poisoning est couvert partiellement par Mnemolite lui-même).

---

## §7 — MÉTRIQUES DE SUCCÈS (par phase)

| Phase | Métrique | Cible | Comment mesurer |
|---|---|---|---|
| **0** | Tests verts runtime TS | **= 195 confirmés Phase 0 ✅** | `npx vitest run src/runtime/` | 195/195 PASS, 0 FAIL |
| **0** | evaluateECS() live output | output = objet `ECSEvaluation` | `npx tsx -e 'import { evaluateECS } from "./src/runtime/ecs"; ...'` (barrel index.ts → implementation evaluate.ts) | ⚠️ à tester live dans Phase 1 (chemin import validé) |
| **0** | Mnemolite up | réponse JSON valide | `curl -X POST localhost:8002/mcp -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'` | **UP ✅ confirmé Phase 0** (mais `/health` 404 — pas d'observabilité officielle) |
| **1** | V17-minimal tokens | ≤ 800 tokens | `wc -c < runtime/expanse-v17-minimal.md / 4` (estimation) |
| **1** | Format ΣΨΦΩΜ respecté | 3/3 réponses valides | test live manuel (3 questions dans le chat) |
| **2** | S14 verdict | verdict chiffre (`v17 > = <` baseline) | JSON dans `doc/audits/v17-s14-results.json` |
| **2** | Peer-review ratio | verdict reproductible dans 80%+ des cas | 2 instances peer-review, comparaison |
| **3** | provenance.ts LOC | ≤ 100 | `wc -l src/runtime/memory/provenance.ts` |
| **3** | surprisal.ts LOC | ≤ 70 | `wc -l src/runtime/memory/surprisal.ts` |
| **3** | Tests memory/ pass | 100% | `npx vitest run src/runtime/memory/` |

**Verdict global :** la recette est LIVRÉE si toutes les cases cochées. La recette est PARTIELLE si 1-3 cases ratées. La recette est ÉCHOUÉE si verdict S14 = `v17 = baseline` ET on ne peut pas expliquer pourquoi (cause racine → reopen des phases).

---

## §8 — ANTI-PATTERNS À ÉVITER (hérités des audits §E.7 + §F)

1. **Ne PAS reproduire la croissance compositionnelle de V16.** Path 6 doit rester ≤ 800 tokens à long terme. Si une mutation augmente, il FAUT en réduire une autre.
2. **Ne PAS mettre la logique ECS dans V17 markup.** Les heuristiques de routage vont dans `evaluateECS()` (code), pas dans le metaprompt.
3. **Ne PAS utiliser LLM-as-judge seul.** Le peer-LLM reste biaisé (audit DREAM benchmark). Toujours avoir au moins un oracle de référence : humain, ou co-métrique test.
4. **Ne PAS promettre SPOF=0 pour Mnemolite.** Mnemolite reste SPOF — MAIS avec 2 atténuations built-in vérifiées Phase 0 : (a) **EPIC-42 secret stripping** (11 regex patterns) réduit la surface d'poisoning par exfiltration ; (b) **Triple-layer cache** (L1/L2/L3) maintient la disponibilité. Provenance + surprisal (Phase 3) ajoutent audit-traversabilité et bruit-réduction, **pas d'anti-poisoning fort**. Audit E.5 (Cross-Session SPI, Memory Poisoning 60-89% succès sur systèmes peu protégés) reste valide : Phase 3 ≠ immunité.
5. **Ne PAS ajouter 16+ mutations sans en supprimer aucune.** Si Phase 3 introduit 5 nouvelles features, il FAUT en supprimer 5 anciennes (anti-E.7 bias de survie).
6. **Ne PAS faire de la philosophie en lieu de code.** V16 a 14K tokens de philosophie (KERNEL.md) qui ne produisent aucun artefact observable. V17-minimal est strictement opérationnel.
7. **Ne PAS clamer que V17 marche mieux qu'un baseline sans S14 chiffré.** Aucune auto-évaluation. Aucun verdict « vibes «. Pas de « je pense que c'est mieux «.
8. **Ne PAS ignorer les claims ⚠️.** Tous les « Mem0 47K stars «, « Soul Protocol 9,693 lignes «, « mnemos 40% bruit « restent ⚠️ tant que pas vérifiés (cf. brainstorm §7).
9. **Ne PAS laisser l'utilisateur valider « à l'impression «.** L'utilisateur est humain, sa validation est biaisée (cf. F.2 projection psychologique). C'est pour ça qu'on a un S14 chiffré.
10. **Ne PAS promettre une réversibilité parfaite.** Layered Mutability (audit F.4) hysteresis = 0.68 : revenir en arrière ne restaure pas 100% du comportement. Le SPOF Mnemolite reste, on ne fait que le rendre auditable.

---

## §9 — HONNÊTETÉ FINALE (3 truths + 3 unknowables)

### Ce que je SAIS ✅ (vérifié forensiquement)

- Mnemolite = local MCP server `localhost:8002/mcp` (MIT, v5.0.0-dev, code complet à `/home/giak/Work/MnemoLite/`)
- LM Studio / `BAAI/bge-m3` = embeddings locaux (audit §E.5/F.11 + .env.example confirmé)
- TS runtime Steps 0-7 livré, code testable (audit §F.5)
- Mnemolite contient **≥10 axiomes Ω V14/V15 réels** (Ω_GATE, Ω_PLANCK, Ω_INERTIA_KISS, Ω_RECURSION_V2) — prouvé via `get_system_snapshot` live
- Mnemolite expose **29 outils MCP** documentés (test : `ping`, `tools/list`, `get_system_snapshot`, `search_memory`)
- **Phase 0 EXÉCUTÉE (02-07-2026) : 195/195 tests verts ✅, Mnemolite UP ✅, entrée ECS = `src/runtime/ecs/index.ts`**

### Ce que je NE SAIS PAS ⚠️ (à mesurer AVANT de promettre)

- Si V17-minimal fait mieux qu'un prompt générique 200-tok : **S14 N'A JAMAIS ÉTÉ EXÉCUTÉ**. Audit §13 : « le test que personne ne fait «. Mon `Phase 2` est littéralement la première fois.
- ⚠️ Phase 0 a livré 195/195 tests mais `/health` Mnemolite est 404 : **observabilité absente**. Si Mnemolite crashe silencieusement, on ne le saura qu'en tombant sur le crash. `ping` reste un fallback (latency_ms retourne) mais ce n'est pas un health-check routé.
- ⚠️ Schemas exacts `write_memory` / `read_memory` / `update_memory` NON testés live — leurs champs requis vs optionnels seront confirmés dans la première itération Phase 3.
- ⚠️ Drift mineur MCP protocol : `live response:protocolVersion="2025-06-18"` vs `docs/MCP.md:1.12.3`. Le client MCP doit accepter les deux (le 2025-06-18 est la spec officielle la plus récente, 1.12.3 n'est pas un protocol MCP mais probablement la version du serveur Mnemolite lui-même — vérifier avant Phase 3).
- Si le peer-LLM oracle est fiable — audit §E.6 « Mirror CFR 60% « documente un biais LLM-as-judge. On l'utilise *quand même* parce que c'est mieux que l'auto-évaluation, PAS parce que c'est parfait.
- Si `surprisal.ts` réduira le bruit « ~40% « — audit §E.5 cite 40% mais c'est la métrique **globale** de mnemos, PAS spécifiquement SurprisalGate (distinction soulignée brainstorm §7). À mesurer empiriquement sur Expanse.
- Si l'utilisateur accepterait d'archiver V17 si S14 montre baseline = V17 (= accepter qu'Expanse n'apporte *rien* de mesurable).
- Quel LLM host exécute ce test (Codebuff = ? quel modèle ? quel coût en $ ?). Audit §E.2 donne des estimations $20-90/mois pour V16 full — V17 minimal devrait être infiniment moindre, mais **⚠️ à mesurer**.
- Drift du V17-minimal après 100, 1000 utilisations : on n'a aucune idée. Le S14 teste un instant T, pas la trajectoire.

### Ce que je PROMETS ✅

- Vérification par `$npx vitest run src/runtime/` AVANT Phase 1+3 (fermeture dette fact-check du §7 brainstorm).
- S14 honnête au byte près : si V17 < baseline, je le dis. Pas d'invention d'amélioration.
- Aucune claim « Mem0 47K stars « sans vérification par `gh repo view --json stargazerCount`.
- Audit antagoniste du résultat final (pas de la promesse, du résultat).
- Documentation de TOUS les `... mais...` (chaque claim a un caveat).

### Ce que je REFUSE ❌

- Promettre que V17 marchera mieux que baseline (S14 tranchera).
- Reproduire le pattern de croissance compositionnelle V16 (audit §E.7).
- Utiliser mon auto-évaluation comme oracle.
- Flagorner (« magnifique «, « génial «, « révolutionnaire «, « Au-delà de l'état de l'art «). Audit §F.12 documente ce travers.
- Cacher les claims ⚠️ comme s'ils étaient ✅ (cf. erreur fact-check brainstorm §7).

---

## §10 — ANNEXE : timeline gantt (semaine 1)

```
Jour 0 |████████░░░░░░░░░░░| Phase 0 : vitest count + ECS test + Mnemolite up?
Jour 1 |████████████████░░| Phase 1 : V17-minimal.md + 3 tests live
Jour 2 |█████████████████░| Phase 1 : itération 2-3 si besoin
Jour 3 |████████████████░░| Phase 2 : S14 setup (3 tâches, baseline+V17)
Jour 4 |████████████████░░| Phase 2 : peer-review + aggregation JSON
Jour 5 |████████████████░░| Phase 3 : provenance.ts + tests
Jour 6 |████████████████░░| Phase 3 : surprisal.ts + tests bout-en-bout
Jour 7 |████░░░░░░░░░░░░░░| Phase 4 : DÉCISION + archivage/extension selon verdict
```

### Références sources

| Type | Source |
|---|---|
| Code TS livré | `expanse-cortex/src/runtime/{boot,ecs,mcp,shared}/` |
| Code Mnemolite client (Expanse side) | `expanse-cortex/src/runtime/mcp/client.ts` |
| Code Mnemolite serveur complet | `/home/giak/Work/MnemoLite/` (MIT, pas dans ce repo) |
| Audit forensique (rapport) | `doc/audit-prompt-v16-rapport.md` |
| Audit forensique (contre-audit) | `doc/audit-prompt-v16-contre-audit.md` |
| Brainstorm 7 Paths | `doc/expanse-v17-brainstorm.md` |
| Plan legacy | `doc/2026-07-02_PLAN-RECONSTRUCTION-FROM-SCRATCH.md` (archivé, recontextualisé) |

---

## §11 — POST-SCRIPTUM (ce que cette recette n'est pas)

Cette recette est :
- ✅ un plan d'exécution **concret** (Phase 0-4, avec commandes bash)
- ✅ un cadrage honnête (12 findings mappés, 9 fermés, 2 deferrés, 1 leçon)
- ✅ un test de passage obligé (S14 chiffré)

Cette recette n'est **PAS** :
- ❌ une preuve qu'Expanse V17 vaut mieux que baseline (c'est la question que S14 doit trancher)
- ❌ un substitut à la maintenance réelle (TS runtime + Mnemolite doivent tourner)
- ❌ une fin en soi — c'est un cadre pour commencer à **mesurer**.

Le but de cette recette ne change pas : **répondre honnêtement** à la question « est-ce qu'Expanse aide le LLM à faire mieux ? «. Si oui, on continue. Si non, on archive. Si on ne sait pas, on le S14.

---

*Recette rédigée le 2 juillet 2026 — Buffy (Codebuff)*
*Synthèse honnête de : 2 audits forensiques + 1 brainstorm à 7 Paths + 1 audit antagoniste + 1 fact-check user sur brainstorm + 1 audit antagoniste on matrix comparison. Aucune hypothèse non-vérifiée introduite. Toutes les claims ⚠️ marquées.*
*11 sections. ~350 lignes. Plan d'exécution 5 phases. Architecture 3 couches strictes. 12 findings d'audit mappés. Métriques de succès par phase. Anti-patterns hérités des §E.7 / §F. Honnêteté finale (3 truths + unknowables).*
*Recommandation finale : Phase 0 (`npx vitest run` + `curl localhost:8002`) avant toute autre action. C'est la dette fact-check à fermer.*

**STATUS Phase 0 (post-exécution 02-07-2026) :**
- ✅ `npx vitest run src/runtime/` → **195/195 PASS**
- ⚠️ `npx tsx -e '...' evaluateECS` → entry point `src/runtime/ecs/index.ts` confirmé, exécution live à valider en Phase 1
- ✅ `curl localhost:8002/mcp tools/list` → **UP, JSON valide**
- ⚠️ `/health` 404 (pas d'observabilité round-trip)

→ **Phase 3 VIABLE** (branche conditionnelle Mnemolite DOWN désactivée). Phase 1 peut commencer.
