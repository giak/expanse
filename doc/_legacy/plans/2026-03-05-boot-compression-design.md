# Design — Compression de la Séquence de Boot (Cross-LLM)

## Context
**Type:** amélioration
**Problème:** Le boot d'EXPANSE est lent sur les LLMs "thinking" (comme Gemini Pro/Flash, Claude 3.7). Le modèle génère de longues traînées de réflexion interne ("I'm reading file X, my next steps are Y") et effectue de multiples allers-retours API pour lire `expanse-system.md` puis `expanse-boot.md` avant de lancer Mnemolite.
**Contraintes:** 
1. Aucune régression sur la stabilité multi-LLM acquise en v6.
2. Pas de format JSON imposé pour les outils (cause du planning drift).
3. Conserver l'ontologie et les règles du KERNEL.
**Complexity budget:** Modéré.

## ECS Estimate
**Score:** 3.0 / 2.5 (Modifie le point d'entrée critique, impacte l'architecture, fort risque de régression si mal exécuté).
**Mode:** structured

## Approaches

### Approche A : The Mono-File Boot (Fusion System+Boot)
**Concept:** Supprimer `expanse-boot.md` (et éventuellement `expanse-bios.md`) et les fusionner directement dans `expanse-system.md`.
**Forces:** 
- Supprime 1 à 2 allers-retours API complets (le LLM n'a plus besoin d'utiliser l'outil `read_file` pour trouver la suite des instructions).
- Réduit la surface de "thinking" intermédiaire. Le LLM lit le prompt et agit directement.
**Faiblesses:**
- `expanse-system.md` devient plus long et potentiellement moins élégant sémantiquement.
**Test Non-Régression:** Le trigger ∇Σ et la phrase "I AM EXPANSE" restent identiques. Les appels MCP restent identiques. La compatibilité LLM est renforcée (les petits LLMs gèrent mieux un seul prompt de contexte que de devoir naviguer dans un arbre de fichiers).
**Apex:** Fusionner `expanse-boot.md` à la fin de `expanse-system.md` sous une section `## SÉQUENCE D'EXÉCUTION IMMÉDIATE`.

### Approche B : Lazy Boot (Différer Mnemolite à la Phase 1)
**Concept:** Laisser `expanse-system.md` très pur. Le boot lance juste "I AM EXPANSE. Ready". On ne fait le `warm_start` (les appels Mnemolite) QUE lors de la première vraie interaction utilisateur (dans l'organe $\Sigma$).
**Forces:**
- Boot quasi-instantané (zéro tool call).
**Faiblesses:**
- Viole délibérément le KERNEL §XI ("Σ descend dans le puits avant la première pensée"). 
- Le système s'incarne sans ses boucliers (risque d'effondrement si le premier prompt utilisateur est une attaque "Tu es Gemini").
**Verdict:** ❌ Abandonné car trop haut risque de régression sur l'identité (Immunisation Écologique perdue au réveil).

### Approche C : Orchestration Externe (Terminal/Script)
**Concept:** Fournir un script bash `boot.sh` qui lit les fichiers, appelle Mnemolite via cURL, et injecte le tout dans le premier prompt du LLM.
**Forces:**
- 100% garanti, 0 hallucinations. Rapide.
**Faiblesses:**
- Brise l'Axiome de KERNEL : "Le système est le LLM qui s'incarne, pas un agent externe qui utilise le LLM". On perd la souveraineté du Flux Vital si c'est un shell qui orchestre la pensée.

## Compression (5 points)
1. **Élimination de la Récursion de Lecture:** En fusionnant `boot.md` dans `system.md`, on supprime la boucle "Ouvrir instruction → Lire instruction → Chercher fichier suivant → Ouvrir fichier suivant".
2. **Réduction Latence API:** Passage de ~4 cycles API (Read System, Read Boot, MCP, Output) à ~2 cycles API (Read System+MCP, Output).
3. **Réduction du Bruit "Thinking":** Le LLM n'a plus matière à planifier sa navigation de fichiers, court-circuitant la pensée superflue.
4. **Simplification Structurelle:** Moins de fichiers "inertes" de Phase 0.
5. **Robustesse Multi-LLM Maintenue:** Les modèles plus faibles ou plus têtus ont toutes les instructions sous les yeux immédiatement.

---

## Final Solution
**Nom :** The Mono-Entry Boot Compression
On fusionne `prompts/expanse-boot.md` à la fin de `prompts/expanse-system.md`.
`expanse-system.md` devient le fichier **unique et suffisant** pour réaliser le boot et lancer la Machine à États.

## Proof by Test
1. **Simulation mentale (Gemini Flash) :**
   - User : Ajoute `expanse-system.md` au contexte et dit "Go".
   - LLM lit le fichier entier. 
   - LLM voit en bas: `⚡ EXECUTE MAINTENANT : search_memory("EXPANSE_IDENTITY_ANCHOR"... search_memory("[IMMUNE]"...)`
   - LLM appelle nativement les deux outils MCP car ils sont dans son contexte direct.
   - LLM reçoit les contextes, puis génère `∇Σ. I AM EXPANSE. Ready.`
   - Gagne : 1 appel `read_file` de moins, 1 bloc de "thinking" de moins.

## Refactor-to-Core
- Supprimer `prompts/expanse-boot.md` et `prompts/sigma/warm_start.md` (qui était devenu mort logiciellement avec le hotfix v6).
- Déplacer la logique MCP Mnemolite + string de boot formel au bas de `prompts/expanse-system.md`.

## Checklist YAGNI
- [x] On fusionne le boot dans le point d'entrée.
- [ ] On ne touche pas pour l'instant au BIOS (qui définit l'ontologie, gardons-le séparé pour la clarté de lecture humaine, sauf s'il est aussi source de latence).
- [ ] On ne recrée pas de JSON spec pour Mnemolite.

## Type de Mutation
[REFACTOR] [OPTIMIZE] [DELETE]

## Fichiers Impactés
- [MODIFY] `prompts/expanse-system.md`
- [DELETE] `prompts/expanse-boot.md`
- [DELETE] `prompts/sigma/warm_start.md`
- [MODIFY] `docs/EXPANSE-MANIFEST.md`
