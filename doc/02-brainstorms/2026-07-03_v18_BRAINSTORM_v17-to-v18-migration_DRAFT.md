---
type: BRAINSTORM
version: v18
status: DRAFT
title: "V17 → V18 mutations : 4 increments concrets"
author: "Buffy (Codebuff)"
created: 2026-07-03
last_reviewed: 2026-07-03
related:
  - "../02-brainstorms/expanse-v17-brainstorm.md"
  - "../01-specs/2026-07-02_v17_RECETTE_expanse-v17_ARCHIVED.md"
  - "../01-specs/expanse-v17-recette-response.md"
tags: [v17-to-v18, mutation, kernel, v18, cristallisats]
---

# 🧬 V17 → V18 — BRAINSTORM MUTATIONS (4 increments)

> Suite pragmatique du brainstorm V17 (7 paths) + recette Phase 1-3.
> 4 mutations concrete testables **en V18** ; M3 + M4 deferrement V18.1 par overload.
> Status : **DRAFT** — promotion ACTIVE necessite S14 chiffre + 4 reviews humaines.

**Date :** 3 juillet 2026
**Auteur :** Buffy (Codebuff)
**Méthode :** Selection criteria strict — (1) testable MAINTENANT, (2) fertilité V18+, (3) absence d'overlap avec V16/V17 livres.

---

## §0 — RAPPEL V17 (anchor)

V17 livre (recette Phase 0 confirmée, 195 tests verts) :

- Metaprompt `runtime/2026-07-02_v17-minimal-iteration-2_v17.md` (~200-500 tok)
- TS runtime `expanse-cortex/src/runtime/` (boot/ecs/mcp/shared) — 195 tests PASS
- Mnemolite MCP local `http://localhost:8002/mcp` (29 outils, UP verifie Phase 0)
- Axiomes V14/V15 (≥10 Ω Ω_PLANCK, Ω_GATE, Ω_INERTIA_KISS...) seedés via `get_system_snapshot`

**Gaps V17 NON FERMES** :

- provenance.ts + surprisal.ts (recette §6 SPECIFIE, non LIVRÉ en code)
- v18-bootstrap.sh (n'existe pas — chaque terminal frais = setup manuel)
- S14-as-CI (n'existe pas — regression gate manuel ou absent)
- Cristallisats structures (mutations = ad-hoc / 1 fichier `mutations/` legacy, aucune assertions.ts associee)

**Méta-risque (audits V17 §E.6 + §9)** : LLM auto-attestation bias. Toute claim *« V18 marche mieux que V17 »* = ⚠️ tant que S14 PAS EXECUTE.

---

## §1 — MUTATIONS V17 → V18 (4 arguments, 2 deferred overload-raison)

### M1 — Cristallisats structures (machine-parseable journal)

**Problème V17.** Mutations = ad-hoc markdown dans `doc/_legacy/mutations/` (1 fichier unique Phase 7 livraison) ou implicites dans `runtime/` SHA-history. Aucun schema standardise, aucune `assertions.ts` CI-friendly, aucune validation automatique. Reproduction du bias V16 audit §E.7 (compositionnelle sans suppression).

**Spec technique.** Creer `doc/07-mutations/cristallisats/{YYYY-MM-DD}_cristal-{SLUG}/` avec 5 fichiers obligatoires :

```
doc/07-mutations/cristallisats/
└── {YYYY-MM-DD}_cristal-{SLUG}/
    ├── intent.md          # ≤200 mots : QUOI et POURQUOI
    ├── diff.patch         # format git diff
    ├── assertions.ts      # vitest tests ciblles mutation (≥1 test)
    ├── validated.json     # { pass: bool, ts_passed: N, reviewer_feedback: string }
    └── promote.md         # commit message pret-a-appliquer si valide
```

**Per-dir README ancrage (ajouter a `doc/07-mutations/cristallisats/README.md`) :**

> # cristallisats/
> **WHY** journal date de mutations candidates V18+. Audit-friendly, CI-gateable.
> **WHO** agent LLM ou humain qui propose une mutation.
> **HOW** creer `cristallisats/{YYYY-MM-DD}_cristal-{SLUG}/` avec 5 fichiers.
> **STATUS** Phase 7 (V18 mutation workflow).

**Effet V18.**
- Anti-biais V16 §E.7 → une mutation peut SUPPRIMER du code (intent.md justifie).
- CI-gateable : `validated.json` requetable par GitHub Actions (cf. M4 depletion).
- Audit-replayable : un humain peut rejouer n'importe quel cristal sur le code V18 actuel.

**Cout.** ~30 min scaffolding + 1 migration d'exemple (le `v18-bootstrap.sh` cristal M3 comme banc d'essai).

**Risque.** Discipline culturelle : si les mutations ne passent pas par cristallisats, le journal devient fake. Mitige par CI gate (M4) et reviewer humain sur validation.

---

### M2 — Mnemolite provenance + surprisal (livraison effective)

**Problème V17.** Recette Phase 3 SPECIFIE provenance.ts + surprisal.ts mais ne sont PAS livres en code (`expanse-cortex/src/runtime/memory/` absent du repo Phase 2). Self-attestation bias §F.10 : 'deps externes non-vérifiées' compense partiellement.

**Spec technique.** 2 modules TS dans `expanse-cortex/src/runtime/memory/` :

- `provenance.ts` (≤100 LOC) : wrap `MnemoliteClient.writeMemory()` avec commit daté `doc/memories/{YYYY-MM-DD}/{id}.md` a chaque ecriture. Best-effort git (warn-and-continue si pas repo ou erreur reseau).
- `surprisal.ts` (≤70 LOC) : calcule `bigram JS similarity` si Mnemolite DOWN / `search_memory` similarity si UP. Skip si ≥ 0.85.

**Total ≤170 LOC** (vs recette §6 spec ~130). Lean raison : V18 SEC impose tight.

**Tests vitest requis.**

- `provenance.test.ts` : verifier creation fichier `fs.existsSync()` + mock git
- `surprisal.test.ts` : verifier bigram similarity (1.0 / 0.5 / <0.85) + mock search_memory

**Migration `client.ts` integration.**

```typescript
// src/runtime/mcp/client.ts (modif mineur)
async writeMemory(args: WriteArgs) {
  const r = await this.callTool('write_memory', args)
  if (opts.provenance) await writeWithProvenance(this, args, r.id, opts)
  return r
}
```

**Effet V18.** Audit trail complet (git date pour chaque write) + bruit-reduction (similarity gate). Ferme partiellement audit E.5 (memory poisoning) pour Expanse-specific use-cases.

**Cout.** ~2 jours (1 impl + 1 tests + 1 review).

**Risque.** Same LLM-auto-attestation bias que V17 — si je dis 'ca marche', c'est ⚠️ tant que S14 PAS EXECUTE.

---

### M3 — v18-bootstrap one-shot (DEFERRED V18.1 par overload)

**Problème V17.** Un terminal frais = setup manuel Mnemolite + axioms + vitest. Pas reproductible entre machines. L'utilisateur doit savoir sur quelle machine il est — blocage cognitif.

**Spec technique.** Script bash `runtime/v18-bootstrap.sh` (~40 LOC) :

```bash
#!/bin/bash
# runtime/v18-bootstrap.sh — bring up Expanse V18 from fresh clone
set -eu
cd "$(dirname "$0")/.."
REPO=$(pwd)

echo "[v18-bootstrap] repo=$REPO"

if curl -s --max-time 3 http://localhost:8002/mcp -X POST \
    -H 'Content-Type: application/json' \
    -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
    | grep -q '"tools"'; then
  echo "[v18-bootstrap] Mnemolite: UP"
else
  echo "[v18-bootstrap] Mnemolite: DOWN — fail-fast (thinker Q3)"
  exit 1   # DRAFT V18: no degraded mode
fi

# Seed axioms from snapshot
TODAY=$(date +%Y-%m-%d)
mkdir -p doc/memories/$TODAY
curl -s -X POST http://localhost:8002/mcp -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_system_snapshot","arguments":{"repository":"expanse"}}}' \
  | jq -r '.result.core[] | "---\nid: \(.id)\ntitle: \(.title)\ntags: \(.tags | join(", "))\n\n\(.content)"' \
  > doc/memories/$TODAY/axiomes-seed.md

# Sanity check
cd expanse-cortex && npx vitest run src/runtime/ --reporter=default 2>&1 | tail -5
echo "[v18-bootstrap] Expanse V18 standing by."
```

**Effet V18.** Reproducible setup — clone + bash = V18 pret en <2min.

**Cout.** ~1 jour dev + ~30 min test multi-host.

**Risque.** Fail-fast brut peut rebuter : machine sans Mnemolite crash. Doc explicite requise 'Mnemolite obligatoire V18'.

**Deferrement.** V18.1 (semaine 2) — overload scope V18.0.

---

### M4 — S14-as-CI (regression gate, budget-equalisé, LLM-judge biais) (DEFERRED V18.1)

**Problème V17.** S14 chiffré une fois (`doc/05-audits/v17-s14-results.json`). Pas de regression gate : V18 pourrait regresser tant qu'on ne re-run S14 manuellement.

**Spec technique.** Workflow GitHub Actions `.github/workflows/v18-s14.yml` :

```yaml
name: V18 S14 Regression Gate
on:
  pull_request:
    paths: ['runtime/**/*.md']    # ← only on metaprompt changes (thinker Q4)
jobs:
  s14:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Mnemolite mock
        run: bash scripts/setup-mnemolite-mock.sh
      - name: Run S14 (3 tasks x 2 conditions)
        env:
          LLM_BUDGET_USD: 10       # ← hard limit (thinker Q4)
        run: cd expanse-cortex && npx tsx src/runtime/s14-bench.ts
      - name: Delta check
        run: |
          DELTA=$(jq -r '.delta_pct' doc/05-audits/v18-s14/results.json)
          if [ "$(echo "$DELTA < 0" | bc)" = "1" ]; then
            echo "V18 regression: delta=$DELTA"
            exit 1
          fi
```

**Effet V18.** Regressions futures detectees automatiquement. Anti §E.7 (compositionnelle sans mesure).

**Cout.** ~2 jours (yaml + tsx bench runner + GitHub secrets).

**Risque CRITIQUE.** LLM-as-judge bias. Audit V17 §E.6 *Mirror CFR 60%* — un LLM qui evalue un autre LLM = meme biais. **Si le judge hallucine, hard-blocker des PRs valides.** Mitige par : (a) budget $10 max, (b) manual override possible, (c) re-run possible.

**Deferrement.** V18.1 — overload + risque LLM-judge necessite debat prealable.

---

## §2 — ANTI-PATTERNS V18 (hérités V17 recette §8)

1. **Pas de croissance compositionnelle** sans suppression (cf. V16 audit §E.7). Si M1-M4 ajoutent du code, supprimer équivalent V17.
2. **Pas de livraison sans S14**. M2 livré = V18 livré = S14 doit passer.
3. **Pas de mut Mnemolite writés bruts**. Toujours passer par provenance.ts.
4. **`/health` 404 (audit V17 Phase 0)** : V18 doit corriger OU documenter la limite en README.
5. **Pas de claims V18 > V17 sans S14**. Gardes-fous V17 §9.

## §3 — TIMELINE V18 (proposition)

> **⚠️ WARNING — M4 LLM-judge gatekeeper** (audit V17 §E.6 *Mirror CFR 60%*). Un LLM qui évalue un autre LLM porte le même biais compositionnel. **Si le judge hallucine, hard-blocker des PRs valides** sur des hallucinations d'évaluation. V18.1 M4 ne doit PAS être déployé en CI gatekeeper strict tant que : (a) budget $10 max, (b) manual override obligatoire, (c) re-run possible. Cf. §1 M4 *Risque CRITIQUE* pour détails.

```
V18.0 (semaine 1 — focus M1+M2)
├── J1   scaffold cristallisats/ + README
├── J2-3 M1 implementation TS (atomic mutations seeded)
└── J5   bilan S14 post-M2 (test critique)

V18.1 (semaine 2 — overload deferrement)
├── J6-7 M3 v18-bootstrap.sh + tests multi-host
└── J7-8 M4 S14-as-CI yml + bench runner + LLM-judge fallback

V18.2 (semaine 3 — bilan)
└── J10  V18 release / branching
```

## §4 — CE QUI EST HONNÊTE (méta-clarification audit V17 §9)

- **M1, M2 = low-risk sandbox-local testable** (TS + markdown). Verifiable dans Codebuff.
- **M3 = medium-risk multi-host deps** : necessite machine externe pour valider portabilité. Probable que je (Codebuff) ne puisse pas valider hors cette machine.
- **M4 = high-risk CI + $$** : GitHub Actions + LLM API = ~$10/mois minimum (hard-limit). A discuter avec user sur budget.
- **Aucune des 4 ne resout F8 (LLM auto-evaluation biaisée)** — ça reste un humain dans la boucle.
- **Status DRAFT = non-promu**. Promotion ACTIVE necessite (a) S14 chiffre PASS + (b) 4 reviews humaines.
- **V17 metaprompt** `runtime/2026-07-02_v17-minimal-iteration-2_v17.md` est exhaustivement 'metaprompt seul' — pas promesse cognitive, juste porte-format ΣΨΦΩΜ.

## §5 — NEXT STEPS USER-FACING

3 décisions critiques V18 :

1. **Approuve M1+M2 scope V18.0 ?** (cf. §1 M1+M2 spec technique).
2. **Confirme deferrement overload M3+M4 → V18.1 ?** (vs tout livrer V18.0).
3. **Budget M4 acceptable ?** : $10/mois LLM-judge, OU alternative offline-judge (heuristique locale vs LLM peer-review).

**Defaults assumés** (à challenger si pas OK) :

- **M3 fail-fast** (no degraded mode) — choix retenu : observabilité stricte V17 (cf. §1 M3 *Risque*).
- **Promote ACTIVE** (item 5 retiré du scope user) : post-V18.0 S14-PASS, run `cristallisats/2026-XX-XX_v18-promo/` avec `validated.json` = `{pass:true, ts_passed:N}` + **4 reviews humaines** (cf. §4 méta-clarification).

## §6 — CE QUI N'EST PAS DANS CE BRAINSTORM (souci d'honnêteté)

- Pas de fine-tune propose (V16 era hors scope).
- Pas de remplacement du LLM host.
- Pas de Mnemolite local a creer (deja OP, hors scope).
- Pas de mutation sur KERNEL.md / V16-era prompts (cf.§5 honesté V17).
- Pas de speculations sur le futur V19+ (ce fichier = V18 plan).

---

*Bilan rédigé le 3 juillet 2026 — Buffy (Codebuff)*
*Brainstorm V17 → V18 — 4 increments concrets : M1 cristallisats structurés (V18.0), M2 provenance+surprisal TS livraison (V18.0), M3 v18-bootstrap (V18.1), M4 S14-as-CI (V18.1). Deferrement overload explicite. Risk LLM-as-judge CFR 60% documenté. Status DRAFT.*

*Pré-requis promote ACTIVE : S14 chiffré PASS + 4 reviews humaines.*



