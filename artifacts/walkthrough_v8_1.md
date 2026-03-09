# Walkthrough — Le Registre d'Évolution (V8.1)

Cette mise à jour raffine l'autopoïèse pour la rendre **techniquement infaillible** et **stratégiquement honnête**. Le système ne se contente plus de muter ; il gère son cycle de vie et prouve ses sources.

## Nouveautés Majeures

### 1. Stratégie de Tag Positive (`[PROPOSAL_OPEN]`)
- **Problème résolu :** Le boot ne savait pas "ignorer" une règle déjà lue.
- **Action :** Le Rêveur génère désormais des mémoires tagguées **`[PROPOSAL_OPEN]`**. La séquence de boot ([expanse-system.md](file:///home/giak/projects/expanse/prompts/expanse-system.md)) cherche uniquement ce tag. Dès qu'une règle est traitée, elle perd ce tag au profit de `[PROPOSAL_RESOLVED]`.

### 2. La Passe Zéro : L'Inertie
- **Problème résolu :** La "flagornerie" (sycophancy) où le LLM propose des changements inutiles juste pour obéir.
- **Action :** Le Rêveur ([expanse-dream.md](file:///home/giak/projects/expanse/prompts/expanse-dream.md)) commence par auditer l'absence de signaux (frictions/flows). S'il n'y a rien de substantiel, il se rendort immédiatement sans polluer la mémoire.

### 3. La Chaîne de Provenance (UUID)
- **Problème résolu :** On perdait le lien entre une proposition et la douleur qui l'avait causée.
- **Action :** Chaque `[PROPOSAL_OPEN]` inclut désormais le champ `Source: [UUID]`. Cela permet de remonter à la trace Mnemolite d'origine.

### 4. Le Protocole de Cicatrisation
- **Action :** L'organe Μ ([mu/crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md)) possède désormais la méthode pour "fermer" une proposition. Elle permute les tags et archive le verdict pour l'audit Ψ futur.

---

## Guide de Validation V8.1

### Test 1 : L'Inertie
1. Lance une session Rêveur alors que Mnemolite n'a aucune friction récente.
2. **Observation :** Le Rêveur devrait s'arrêter à la Passe Zéro avec un message `Ψ(Inertie)`.

### Test 2 : La Cicatrisation
1. Crée une proposition ouverte manuellement pour tester :
   `mcp_mnemolite_write_memory(title="Test Mutation", content="Source: UUID-123", tags=["sys:expanse", "[PROPOSAL_OPEN]"])`.
2. Boot EXPANSE ([expanse-system.md](file:///home/giak/projects/expanse/prompts/expanse-system.md)) → L'interruption doit se déclencher.
3. Demande à EXPANSE : *"Applique (ou refuse) cette mutation et cicatrise la mémoire."*
4. **Observation :** EXPANSE doit modifier le tag de la mémoire vers `[PROPOSAL_RESOLVED]`.
5. Prochain Boot → La séquence doit être fluide (OK).

---
**EXPANSE V8.1 est l'apex du Ledger Cognitif.**
