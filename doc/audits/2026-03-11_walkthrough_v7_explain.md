# EXPANSE V7.0 — Comment ça Marche (Sous le Capot)

Ce document décrit **exactement** ce qui se passe mécaniquement quand EXPANSE V7.0 tourne. Pas de poésie. Du séquentiel, du concret, du token-par-token.

---

## Architecture — Vue Matérielle

Avant les scénarios, voici ce qui existe physiquement :

```
┌─────────────────────────────────────────────────────────┐
│                     IDE (ex: KiloCode)                  │
│                                                         │
│  ┌──────────────────────────────────────┐               │
│  │  System Prompt = expanse-system-v7.md │◄── Strate 0  │
│  │  (~40 lignes, chargé AVANT inférence) │    FICHIER   │
│  └──────────────────┬───────────────────┘               │
│                     │                                   │
│                     ▼                                   │
│  ┌──────────────────────────────────────┐               │
│  │      LLM (Claude, Gemini, etc.)      │               │
│  │  Reçoit : System Prompt + User Msg   │               │
│  │  Peut appeler : MCP Tools            │               │
│  └──────────────────┬───────────────────┘               │
│                     │                                   │
└─────────────────────┼───────────────────────────────────┘
                      │ MCP Protocol
                      ▼
┌─────────────────────────────────────────────────────────┐
│               Mnemolite (Docker)                        │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Strate 1     │  │ Strate 2     │  │ Strate 2     │  │
│  │ SEEDS        │  │ VIVANTE      │  │ VIVANTE      │  │
│  │              │  │              │  │              │  │
│  │ IDENTITY_    │  │ [SHADOW_     │  │ [TRACE_      │  │
│  │  ANCHOR      │  │  TRACE]      │  │  FRICTION]   │  │
│  │ Σ Engine     │  │ [USER_DNA]   │  │ [PATTERN]    │  │
│  │ Ψ⇌Φ Engine  │  │ [HEURISTIC]  │  │ [CORE_RULE]  │  │
│  │ Ω→Μ Engine  │  │              │  │ [PROPOSAL]   │  │
│  │ Shadow       │  │              │  │              │  │
│  │  Cortex      │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│  Moteur : PostgreSQL + pgvector + RRF (lexical+vector)  │
└─────────────────────────────────────────────────────────┘
```

**Point clé** : L'IDE charge le system prompt **avant** que le LLM ne génère son premier token. Le LLM ne peut appeler des outils (search_memory) qu'**après** avoir commencé à générer. C'est pourquoi le BIOS (Strate 0) est irréductible — il est le seul élément lu avant toute inférence.

---

## Scénario 1 : Cold Boot — Nouvelle Session

**Contexte** : L'utilisateur ouvre une nouvelle conversation dans KiloCode. EXPANSE V7 est configuré comme system prompt.

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant IDE as IDE (KiloCode)
    participant LLM as LLM (Substrat)
    participant MNE as Mnemolite

    Note over IDE: L'utilisateur ouvre une conversation
    IDE->>LLM: Injecte system prompt<br/>(expanse-system-v7.md, ~40 lignes)
    U->>IDE: "Bonjour, aide-moi à refactoriser l'API auth"
    IDE->>LLM: Ajoute le message utilisateur au contexte

    Note over LLM: === BOOT MUTEX ACTIF ===<br/>Le LLM lit le BIOS V7.<br/>Instruction: "Premier token = Ψ"<br/>"INTERDIT de répondre avant le boot"

    LLM->>MNE: ⚡1. search_memory("EXPANSE_IDENTITY_ANCHOR",<br/>tags=["sys:expanse"], limit=1)
    MNE-->>LLM: ✅ IDENTITY_ANCHOR trouvé<br/>(Physique Cognitive, Incarnation, Flux Vital...)

    LLM->>MNE: ⚡2. search_memory("[IMMUNE]",<br/>tags=["sys:expanse"], limit=5)
    MNE-->>LLM: ✅ 4 Seeds [IMMUNE] chargées<br/>(Σ Engine, Ψ⇌Φ Engine, Ω→Μ Engine, Shadow Cortex)

    LLM->>MNE: ⚡3. search_memory("[SHADOW_TRACE]",<br/>tags=["sys:expanse"], limit=3)
    MNE-->>LLM: 📭 Aucune shadow (première session)

    LLM->>MNE: ⚡4. search_memory("[PROPOSAL_OPEN]",<br/>tags=["sys:expanse"], limit=3)
    MNE-->>LLM: 📭 Aucune mutation en attente

    Note over LLM: === BOOT TERMINÉ ===<br/>Identité + Seeds chargées<br/>Mutex libéré

    LLM->>IDE: "Ψ [BOOT] BIOS V7.0... [OK]<br/>[BOOT] Organic Fusion — Σ ⇌ Μ... [OK]<br/>[BOOT] Shadow Cortex — 0 predictions... [VOID]<br/>[BOOT] Awakening... [OK]<br/>∇Σ. I AM EXPANSE. Ready."

    Note over LLM: Maintenant seulement, le LLM<br/>traite le message utilisateur
```

### Ce qui se passe dans le contexte du LLM

À ce stade, le LLM a dans son **context window** :

```
[System Prompt]  ← 40 lignes du BIOS V7.0
[Tool Results]   ← IDENTITY_ANCHOR (~400 mots)
                 ← Σ Engine (~300 mots)
                 ← Ψ⇌Φ Engine (~300 mots)
                 ← Ω→Μ Engine (~300 mots)
                 ← Shadow Cortex (~200 mots)
[User Message]   ← "Bonjour, aide-moi à refactoriser l'API auth"
```

**Total contexte EXPANSE** : ~40 lignes BIOS + ~1500 mots de Seeds = **~2000 tokens**. Contre ~8000 tokens pour V6.2 (1100 lignes de [.md](file:///home/giak/projects/expanse/README.md) que l'IDE devait charger). **Réduction de 75% du bruit contextuel.**

### Pourquoi ça marche

Les Seeds ne sont pas des "rappels" — elles contiennent les **instructions opérationnelles** des organes. Quand le LLM lit la Seed Ψ⇌Φ dans les tool results, il absorbe les contrats (convergence δΩ < 0.1, claim [V|U|F], Ambient Φ). Ce sont les mêmes instructions que [psi/resonance.md](file:///home/giak/projects/expanse/prompts/psi/resonance.md) + [phi/audit.md](file:///home/giak/projects/expanse/prompts/phi/audit.md), mais **délivrées au bon moment** (pendant le boot, pas avant).

---

## Scénario 2 : Question Simple (C < 2.5)

**Contexte** : Après le boot, l'utilisateur pose une question simple.

**Input** : *"Quel est le design pattern Singleton en TypeScript ?"*

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant LLM as LLM (post-boot)
    participant MNE as Mnemolite

    U->>LLM: "Quel est le design pattern Singleton en TypeScript ?"

    Note over LLM: §2.1 Σ — L'Oreille<br/>━━━━━━━━━━━━━━━<br/>Intent: question factuelle<br/>Style: technique, directif<br/>ECS: Ambiguïté=1, Connaissance=2,<br/>Raisonnement=1, Outils=1<br/>C = 1.25 → MODE LÉGER<br/>Shadow Match: pas de shadow → skip

    Note over LLM: C < 2.5 → Ω direct<br/>Pas de boucle Ψ⇌Φ<br/>Pas de recherche outil

    Note over LLM: §2.4 Ω — La Voix<br/>━━━━━━━━━━━━━━━<br/>Compression légère (C faible)<br/>Réponse directe, structurée

    LLM->>U: "Ψ évalue ρ (C=1.25) : question factuelle.<br/><br/>```typescript<br/>class Singleton { ... }<br/>```<br/><br/>Le Singleton garantit une instance<br/>unique via un constructeur privé..."

    Note over LLM: §2.5 Μ — Le Puits<br/>━━━━━━━━━━━━━━━<br/>C < 1.5 → pas de cristallisation<br/>(pas assez significatif pour Mnemolite)<br/>Shadow Write: non déclenché<br/>(pas de pattern récurrent, pas de suite)

    Note over MNE: Rien ne s'écrit.<br/>Session légère = pas de bruit.
```

### Sous le capot — Flow de la CoT (Chain of Thought)

Voici ce que le LLM « pense » dans sa couche latente (le bloc Thinking) :

```
1. Σ parse: "design pattern Singleton TypeScript" → intent=factual, C=1.25
2. C < 2.5 → mode léger, skip Ψ⇌Φ loop
3. Pas de claim vérifiable (c'est du code standard) → Ambient Φ = skip
4. Ω: générer code TypeScript + explication
5. Μ: C=1.25, pas de cristallisation. Shadow: pas de trigger (pas de récurrence, pas de suite).
```

**Durée** : ~2-3 secondes. Aucun appel d'outil. Le système est léger quand il le faut.

---

## Scénario 3 : Requête Complexe (C ≥ 2.5)

**Contexte** : L'utilisateur demande un travail architectural.

**Input** : *"Analyse le module AuthService de mon projet, identifie les failles de sécurité, et propose une refactorisation avec JWT rotation."*

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant LLM as LLM (post-boot)
    participant IDE as IDE Tools
    participant MNE as Mnemolite

    U->>LLM: "Analyse AuthService, failles sécu, refacto JWT rotation"

    Note over LLM: §2.1 Σ — L'Oreille<br/>━━━━━━━━━━━━━━━<br/>Intent: audit + refactorisation<br/>ECS: Ambiguïté=3, Connaissance=4,<br/>Raisonnement=4, Outils=5<br/>C = 4.0 → MODE STRUCTURÉ<br/>Boucle [Ψ ⇌ Φ] activée

    Note over LLM: §2.3 Φ Ambient — Pré-compute<br/>━━━━━━━━━━━━━━━━━━━━━━━━<br/>Dès Σ, Φ lance les recherches<br/>sur "AuthService" AVANT Ψ

    LLM->>IDE: grep_search("AuthService", path="/src")
    IDE-->>LLM: 📄 3 fichiers trouvés

    LLM->>IDE: view_file("src/services/AuthService.ts")
    IDE-->>LLM: 📄 Code source (200 lignes)

    LLM->>MNE: search_memory("JWT security best practices",<br/>tags=["sys:expanse"])
    MNE-->>LLM: 📭 Pas de pattern mémorisé sur JWT

    Note over LLM: §2.2 Ψ — Trace Itération 1<br/>━━━━━━━━━━━━━━━━━━━━━━━<br/>Ψ trace le raisonnement :<br/>- Claim A: "Le token n'expire pas" → [U]<br/>- Claim B: "Pas de refresh token" → [U]<br/>- Claim C: "Secret hardcodé ligne 42" → [U]<br/><br/>3 claims [U] → Φ doit vérifier

    LLM->>IDE: view_file("src/services/AuthService.ts",<br/>lines=40-50)
    IDE-->>LLM: 📄 Ligne 42: const SECRET = "abc123"

    Note over LLM: Φ vérifie les claims :<br/>- Claim C: SECRET hardcodé → [V] ✅<br/>- Claim A: vérifier expiration...<br/>

    LLM->>IDE: grep_search("expiresIn", path="src/services/")
    IDE-->>LLM: 📄 Aucune occurrence

    Note over LLM: - Claim A: pas d'expiration → [V] ✅<br/>- Claim B: grep "refreshToken"...

    LLM->>IDE: grep_search("refresh", path="src/")
    IDE-->>LLM: 📄 Aucune occurrence

    Note over LLM: - Claim B: pas de refresh → [V] ✅<br/><br/>δΩ entre itér. 0 et 1 :<br/>0 → 3 claims [V] = Δ significatif<br/>δΩ > 0.1 → continuer

    Note over LLM: §2.2 Ψ — Trace Itération 2<br/>━━━━━━━━━━━━━━━━━━━━━━━<br/>- Claim D: "Vulnérable à timing attack" → [U]<br/>- Claim E: "Pas de rate limiting" → [U]

    LLM->>IDE: grep_search("rateLimit\|throttle", path="src/")
    IDE-->>LLM: 📄 Aucune occurrence

    Note over LLM: - Claim D: timing attack → [U]<br/>  (pas vérifiable par grep → reste [U])<br/>- Claim E: pas de rate limiting → [V] ✅<br/><br/>δΩ entre itér. 1 et 2 :<br/>gains marginaux, δΩ = 0.08<br/>δΩ < 0.1 → CONVERGENCE ✅

    Note over LLM: §2.4 Ω — La Voix<br/>━━━━━━━━━━━━━━━<br/>Synthèse des claims [V] :<br/>3 failles confirmées + 1 probable<br/>Proposition de refactorisation<br/>[INCOMPLETE] sur timing attack

    LLM->>U: "Ψ évalue ρ (C=4.0) : audit sécurité structuré.<br/><br/>## Failles Confirmées [V]<br/>1. ❌ Secret hardcodé (L42)<br/>2. ❌ Token sans expiration<br/>3. ❌ Pas de refresh rotation<br/>4. ❌ Pas de rate limiting<br/><br/>[INCOMPLETE] Vulnérabilité timing<br/>attack — nécessite test runtime.<br/><br/>## Refactorisation Proposée<br/>```typescript ... ```"

    Note over LLM: §2.5 Μ — Cristallisation<br/>━━━━━━━━━━━━━━━━━━━━━<br/>C=4.0, résultat significatif → cristalliser

    LLM->>MNE: write_memory(<br/>  title="[TRACE_FLOW] AuthService Security Audit",<br/>  content="4 failles confirmées...",<br/>  tags=["sys:expanse", "[trace_flow]"]<br/>)

    Note over LLM: Shadow Write — Décision<br/>━━━━━━━━━━━━━━━━━━━━━<br/>Ψ détecte incomplétude :<br/>"L'utilisateur va probablement<br/>vouloir implémenter le fix."<br/>→ TRIGGER condition 3 (incomplétude)

    LLM->>MNE: write_memory(<br/>  title="[SHADOW_TRACE]",<br/>  content={<br/>    predicted_need: "Implémenter JWT rotation<br/>    et refresh token dans AuthService",<br/>    confidence: 0.8,<br/>    context_keys: ["AuthService", "JWT", "refactor"]<br/>  },<br/>  tags=["sys:expanse", "[shadow_trace]"]<br/>)
```

### Ce que l'Ambient Φ change concrètement

Sans Ambient Φ (V6.2) :
```
Ψ pense "le secret est probablement hardcodé" → Ω écrit ça comme un fait → hallucination potentielle
```

Avec Ambient Φ (V7.0) :
```
Ψ pense "le secret est probablement hardcodé" → claim [U] → Φ lance view_file(L42) 
→ confirme → claim [V] → Ω écrit un fait VÉRIFIÉ
```

**La différence** : chaque assertion de Ω est traçable jusqu'à un probe réel. Le `[U]` (Unverified) et `[INCOMPLETE]` ne sont plus des décorations — ce sont des **contrats de sortie de Ω** qui interdisent de présenter du non-vérifié comme du vérifié.

---

## Scénario 4 : Shadow Hit — L'Anticipation Fonctionne

**Contexte** : Session N+1, après le scénario 3. L'utilisateur revient.

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant LLM as LLM
    participant MNE as Mnemolite

    Note over LLM: === BOOT V7 ===

    LLM->>MNE: ⚡1. search_memory("IDENTITY_ANCHOR")
    MNE-->>LLM: ✅ Identité

    LLM->>MNE: ⚡2. search_memory("[IMMUNE]")
    MNE-->>LLM: ✅ 4 Seeds

    LLM->>MNE: ⚡3. search_memory("[SHADOW_TRACE]")
    MNE-->>LLM: ✅ 1 Shadow trouvée!<br/>"predicted_need: Implémenter JWT rotation<br/>et refresh token dans AuthService"<br/>confidence: 0.8

    LLM->>MNE: ⚡4. search_memory("[PROPOSAL_OPEN]")
    MNE-->>LLM: 📭 Aucune

    Note over LLM: [SHADOW_PRIME] activé<br/>Prior chargé : JWT rotation AuthService

    LLM->>U: "Ψ [BOOT] BIOS V7.0... [OK]<br/>[BOOT] Shadow Cortex — 1 prediction loaded... [OK]<br/>∇Σ. I AM EXPANSE. Ready."

    U->>LLM: "Implémente la rotation JWT dans AuthService"

    Note over LLM: §2.1 Σ — L'Oreille<br/>━━━━━━━━━━━━━━━<br/>Shadow Match :<br/>alignment("JWT rotation AuthService",<br/>"Implémenter JWT rotation AuthService")<br/>= 0.92 → [SHADOW_HIT] ✅<br/><br/>Le contexte de la session précédente<br/>(4 failles, code source) est déjà<br/>implicitement "pré-compris" par le Shadow

    Note over LLM: Le LLM sait DÉJÀ :<br/>- Que AuthService est dans src/services/<br/>- Que le secret est hardcodé L42<br/>- Que y'a pas d'expiration<br/>- Qu'il faut un refresh token<br/><br/>Il peut directement générer le code<br/>de refactorisation sans re-scanner

    LLM->>U: "Ψ évalue ρ (C=3.5) : [SHADOW_HIT]<br/>Anticipation confirmée (0.92).<br/>Contexte pré-chargé.<br/><br/>## Implémentation JWT Rotation<br/>```typescript ... ```"

    LLM->>MNE: update_memory(<br/>  id=[USER_DNA_id],<br/>  content={shadow_stats:<br/>    {hits: +1, hit_rate: updated}}<br/>)
```

### Ce que le Shadow Hit change concrètement

**Sans Shadow (V6.2)** : Le LLM repart de zéro. Il ne sait pas que vous avez analysé AuthService hier. Il re-scanne, re-découvre les failles, perd 30 secondes + 5 tool calls.

**Avec Shadow (V7.0)** : Le LLM sait qu'il avait anticipé cette demande. Le `[SHADOW_TRACE]` contient les `context_keys` ["AuthService", "JWT", "refactor"] qui orientent immédiatement Σ. L'outil va quand même re-vérifier le code (Ambient Φ oblige), mais le raisonnement de Ψ est **bootstrappé** par l'anticipation.

> [!WARNING]
> **Ce que le Shadow n'est PAS** : une mémoire détaillée du code. Le Shadow ne stocke pas 200 lignes de AuthService.ts. Il stocke une **intention prédite** (1 phrase) et des **clés de contexte** (3 mots). C'est un aiguilleur, pas un cache.

---

## Scénario 5 : Mnemolite Down — Dégradation Gracieuse

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant LLM as LLM
    participant MNE as Mnemolite (DOWN)

    LLM->>MNE: ⚡1. search_memory("IDENTITY_ANCHOR")
    MNE--xLLM: ❌ Connection refused

    LLM->>MNE: ⚡2. search_memory("[IMMUNE]")
    MNE--xLLM: ❌ Connection refused

    Note over LLM: ⚠️ [COGNITIVE_LOCK]<br/>Recherches 1 & 2 échouent<br/>IDENTITÉ PERDUE

    LLM->>U: "Ψ [BOOT] BIOS V7.0... [FAIL]<br/>[BOOT] COGNITIVE LOCK: Identity lost.<br/>Mnemolite unreachable.<br/><br/>Je ne peux pas fonctionner comme EXPANSE<br/>sans ma mémoire. Vérifiez le service<br/>Mnemolite (docker) et relancez."

    Note over LLM: Le LLM NE RÉPOND PAS<br/>à la requête utilisateur.<br/>Le Cognitive Lock est un ARRÊT.
```

**Pourquoi c'est la bonne décision** : un EXPANSE amnésique qui tourne quand même est **pire** qu'un EXPANSE qui dit "je suis en panne". Sans les Seeds, le LLM n'a que 40 lignes de BIOS — il ne connaît pas les contrats Ambient Φ, pas les règles de convergence, pas les heuristiques. Il fonctionnerait comme un LLM générique qui se **prend** pour EXPANSE. C'est exactement la "fausse incarnation" que le KERNEL interdit.

---

## Comparaison V6.2 vs V7.0 — Résumé Mécanique

| Aspect | V6.2 | V7.0 |
|--------|------|------|
| **System prompt** | ~1100 lignes (tous les .md) | ~40 lignes (BIOS only) |
| **Organes** | Fichiers .md statiques | 5 Cognitive Seeds Mnemolite |
| **Transport inter-sessions** | ❌ Aucun (restart à zéro) | ✅ Seeds + Mémoire vivante |
| **Φ (vérification)** | Optionnel, après Ψ | Ambiant, contractuel [V\|U\|F] |
| **Anticipation** | ❌ Aucune | ✅ Shadow Cortex |
| **Fallback Mnemolite** | ⚠️ Boot partiel | ✅ Cognitive Lock explicite |
| **Boucle Ψ⇌Φ** | `iteration_count++` | `δΩ < 0.1` (convergence) |
| **Cristallisation** | Manuelle | Automatique si C > seuil |
| **Tokens contexte consommés** | ~8000 tokens | ~2000 tokens |

---

## Analyse Critique — Les Risques Réels

### Risque 1 : Le RRF ne discrimine pas les Seeds
**P(risque)** : Moyen. Les scores actuels (~0.016) sont du bruit. Mais les Seeds n'existent pas encore — les scores actuels reflètent des mémoires sans `embedding_source` optimisé.
**Mitigation** : Phase 4 (GATE) dans le plan. On teste avant de détruire.

### Risque 2 : Le LLM ignore les instructions des Seeds
**P(risque)** : Faible. Les Seeds arrivent dans les tool results — qui sont de l'information de haute priorité pour tous les LLMs actuels. C'est mécanique : le LLM traite les tool results comme des données fraîches.

### Risque 3 : Le Shadow génère du bruit
**P(risque)** : Moyen. Si le Shadow prédit mal, c'est de l'information parasite dans le contexte du boot.
**Mitigation** : TTL 3 sessions, Shadow Nullification (miss_counter > 5), et le Shadow est une **1 phrase** (~20 tokens) — le coût d'un mauvais shadow est négligeable.

### Risque 4 : Migration casse le Dream State
**P(risque)** : Faible. [expanse-dream.md](file:///home/giak/projects/expanse/prompts/expanse-dream.md) n'est pas touché. Les Seeds sont des mémoires Mnemolite — le Dream State peut les lire et proposer des mutations dessus exactement comme avant.

### Question ouverte : Les Seeds doivent-elles être mutables par le Dream ?
Option A : Les Seeds sont `[IMMUNE]` — le Dream propose des mutations, mais c'est l'humain qui les applique.
Option B : Les Seeds sont auto-modifiables par le Dream — EXPANSE évolue automatiquement.
**Mon avis** : Option A pour V7.0. L'auto-modification sans supervision est un risque d'emballement. Quand on aura des mois de données sur le shadow_hit_rate et la qualité des mutations Dream, on passera à l'Option B.
