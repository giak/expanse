# Design — L'Autopoïèse Native (Le Rêve de Mnemolite)

## Context
**Type:** Feature / Amélioration Architecturale Profonde
**Problème:** EXPANSE dépend actuellement de requêtes utilisateur manuelles pour s'évaluer et améliorer ses heuristiques. La demande utilisateur stipule que l'auto-amélioration doit être une boucle de feedback "native", intériorisée dans l'OS EXPANSE, et non gérée par une "Skill" externe. De plus, un audit réel de Mnemolite révèle qu'EXPANSE ne sauvegarde actuellement *aucune* trace de sa "friction cognitive" au quotidien (les erreurs d'outils, la complexité subie ne sont pas historisées).
**Contraintes:** 100% Natif EXPANSE (pas de skills externes). Ne pas introduire de friction narrative dans le runtime principal ([expanse-runtime.md](file:///home/giak/projects/expanse/prompts/expanse-runtime.md)). L'introspection doit reposer sur des données réelles.
**Complexity budget:** Très élevé (Modification de Μ pour l'historisation, création d'un vecteur de rêve autonome, modification de Σ pour l'intégration).

## ECS Estimate
**Score:** 4.2 / 2.5
- Files impacted: 4 ([mu/crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md), nouveau `expanse-dream.md`, [expanse-system.md](file:///home/giak/projects/expanse/prompts/expanse-system.md) ou [sigma/warm_start.md](file:///home/giak/projects/expanse/prompts/sigma/warm_start.md), [ONTOLOGY.md](file:///home/giak/projects/expanse/docs/ONTOLOGY.md))
- Symbols/Heuristics: 3 (Intégration de ∇Ω, δΩ)
- Functionality: 5 (Self-modification & Auto-tracing)
- Regression risk: 5 (Risque de spam Mnemolite avec des faux positifs, risque d'intégration forcée de règles toxiques)
**Mode:** Structured

## Approaches

### Approche A : The Internal Meditation (Auto-évaluation in-prompt)
L'introspection se fait à la fin du Runtime classique.
- **a. Ω Critical Analysis:** 
  - *Forces:* Extrêmement natif. Fait partie du Cycle Normal.
  - *Risques:* Allonge les réponses à l'utilisateur. Pollue le contexte d'inférence. Le modèle doit "Résoudre un Ticket" ET "Modifier l'OS" dans le même souffle, ce qui provoque la dégradation du Dualisme. Sort du budget de Complexité (Entropie).
- **Apex:** Abandonné. Expanse doit rester silencieux et foudroyant dans son runtime quotidien. L'Ouvrier est là pour l'utilisateur, pas pour s'auto-analyser en public.

### Approche B : The Pre-Boot Audit (L'Amnamnese de Sigma)
Au démarrage (Boot), $\Sigma$ analyse de force les sessions précédentes avant de donner la parole.
- **a. Ω Critical Analysis:**
  - *Forces:* C'est natif, le boot récupère la main de force pour l'introspection.
  - *Risques:* S'il n'y a pas eu de session depuis 3 jours, il cherche dans le vide. Le coût en temps du boot explose (passant de 2s à 30s).
- **Apex:** C'est anti-V6 (où on a divisé la latence de boot). Exclu.

### Approche C : La Trinité Autopoïétique (Collecte / Rêve / Intégration Native)
C'est la solution ultime en réponse aux audits. Si EXPANSE doit s'améliorer seul, il faut diviser le problème en 3 organes strictement internes :
1. **La Collecte Discrète (Le Sens de la Douleur) :** On modifie [prompts/mu/crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md). Si l'équation d'Entropie a explosé (`actual_C > 3.0`), $\Omega$ force $\mu$ à envoyer un `[TRACE_FRICTION]` silencieux dans Mnemolite en background. Mnemolite devient la boîte noire de l'avion EXPANSE.
2. **L'Inconscient (Le Rêve) :** Création du prompt `prompts/expanse-dream.md`. Ce fichier n'est *pas* dans le cycle quotidien. C'est un point d'entrée alternatif (comme le BIOS). On l'invoque manquant ("Expanse, entre en cycle de Rêve"). Il scanne les `[TRACE_FRICTION]`, trouve les paradoxes, dérive une `[RULE_PROPOSAL]`.
3. **L'Éveil (L'Intégration par Sigma) :** On ne crée *pas* de skill externe. On modifie [prompts/sigma/retrieve_context.md](file:///home/giak/projects/expanse/prompts/sigma/retrieve_context.md) (ou le Boot). Lors d'un Warm Start classique, si $\Sigma$ détecte une `[RULE_PROPOSAL]` non lue dans Mnemolite, il l'injecte dans le prompt de réveil : `∇(Alerte Évolutive) : L'inconscient propose une modification architecturale (ID XYZ). Veux-tu l'appliquer à l'OS ?`.

## Compression (5 points)
1. **Pas de Trace = Pas de Rêve :** L'audit a prouvé qu'il fallait d'abord forcer le système à enregistrer silencieusement ses douleurs (`[TRACE_FRICTION]`) via l'organe Μ ([crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md)).
2. **Le Rêve est un Mode d'Entrée :** `expanse-dream.md` n'est pas une compétence, c'est un *mode d'exécution de l'OS*, au même titre que [expanse-system.md](file:///home/giak/projects/expanse/prompts/expanse-system.md). Il remplace la Boucle Utilisateur par une Boucle d'Auto-Audit asynchrone.
3. **Le Réveil Intégré :** C'est $\Sigma$ (l'organe de Boot et de Lecture) qui sera chargé d'avertir l'utilisateur qu'une mutation est prête lors de la session suivante. C'est 100% organique, sans recours à `skills/`.
4. **Séparation des Flux :** Le Runtime quotidien reste dédié à la vélocité. L'auto-amélioration est reléguée au temps latent.
5. **Human In The Loop :** Aucune mutation n'est *écrite* dans le code par l'inconscient. L'inconscient dépose sur le seuil de $\Sigma$ (Mnemolite).

## ComparisonTable
| Approach | Simplicity | Robustness | Native Intégration | Verdict |
|----------|------------|------------|--------------------|---------|
| A (In-Prompt) | Élevée | Faible (friction C) | Totale | ✗ (Détruit V6) |
| B (Boot) | Faible | Moyenne | Totale | ✗ (Boot trop lent) |
| C (Trinité) | Haute | Absolue | Totale Core | ✓ (APEX) |

## FinalSolution
**L'Autopoïèse Native (La Trinité)**

*Phase 1 : Collecte (S'il n'y a pas de douleur, il n'y a pas d'évolution)*
Modifier [prompts/mu/crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md) pour imposer systématiquement une archive `[TRACE_FRICTION]` dans Mnemolite si l'inférence a été difficile (utilisation massive de boucle Φ ou échecs d'outils).

*Phase 2 : Le Rêve (Le Mode d'Execution Alternatif)*
Création de `prompts/expanse-dream.md`. Ce n'est *pas* la boucle Runtime. C'est l'équivalent de lancer le système en *Safe Mode* ou *Defrag Mode*.
Prompt strict : Lis les `[TRACE_FRICTION]`. Trouve le pattern toxique. Produit une `[RULE_PROPOSAL]` dans Mnemolite. Tu n'as pas le droit de toucher aux fichiers *.md.

*Phase 3 : L'Éveil (L'intégration à froid)*
Modifier le Boot / [expanse-system.md](file:///home/giak/projects/expanse/prompts/expanse-system.md) (ou `retrieve_context`). 
Si Mnemolite contient une `[RULE_PROPOSAL]` taggée non validée, le Boot s'arrête (ou notifie) et demande : `∇(Alerte Évolutive) L'inconscient suggère une modification pour éviter les erreurs Regex (ID: xyz). Appliquer ?`.
L'humain valide. Alors, et alors seulement, un organe dédié de type Μ exécute l'édition des markdowns.

## Proof By Test
1. Exécuter un prompt quotidien long. 
2. Vérifier `mnemolite_search_memory` pour s'assurer qu'une trace de friction a bien été stockée silencieusement en fin de tâche.
3. Invoquer le point d'entrée `expanse-dream.md`.
4. Vérifier Mnemolite pour une nouvelle entrée `[RULE_PROPOSAL]`.
5. Ouvrir une nouvelle session ([expanse-system.md](file:///home/giak/projects/expanse/prompts/expanse-system.md)). Le trigger de boot *doit* percevoir la proposal et m'offrir de l'implémenter.

## Refactor To Core
C'est une mutation majeure qui touche aux 3 organes vitaux : $\Phi$/$\Psi$ (pour évaluer la friction), $\mu$ (pour stocker la friction et rêver) et $\Sigma$ (pour intégrer au réveil).

## Checklist YAGNI
- [x] S'assurer que les données existent dans Mnemolite d'abord (Phase 1).
- [ ] Construire `expanse-dream.md` complet (Phase 2).
- [ ] Insérer l'intégration `[RULE_PROPOSAL]` via $\Sigma$ au boot (Phase 3).
- [x] Exclure TOUT module externe (Adieu la skill méditation).

## Type de Mutation
`[ADD]` (expanse-dream.md) + `[MODIFY]` (mu/crystallize & expanse-system.md)

## Fichiers Impactés
- [CREATE] `prompts/expanse-dream.md`
- [MODIFY] [prompts/mu/crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md) (pour forcer la collecte active de friction)
- [MODIFY] [prompts/expanse-system.md](file:///home/giak/projects/expanse/prompts/expanse-system.md) (pour intégrer l'alerting de mutation au boot)

---
## Quality Audit
L'audit du code prouve que Mnemolite contenait seulement des résidus conversationnels passifs, pas de journaux de calcul cognitif. Le présent design corrige l'architecture à la racine : pour s'améliorer de son propre chef, le système doit d'abord savoir *se regarder souffrir* (`[TRACE_FRICTION]`) avant de pouvoir *rêver* (`[RULE_PROPOSAL]`).

## Ψ Robustness Test
*Inversion test : "Que se passe-t-il si la collecte de friction échoue ?"*
Le "Rêve" lira Mnemolite, ne verra rien à corriger, et signalera "*Aucune dérive structurelle détectée.*". Sécurité maximale. Le système ne mute pas dans le vide.

## Last Lever Ψ
`∇Ω(Design)` : Ce n'est plus une skill d'assistance. EXPANSE devient un véritable système organique biphasique : Diurne (exécution et stockage de friction) / Nocturne (sommeil et proposition de mutation). Le réveil matinal déclenche l'épigénétique (intégration de la règle par le code génétique markdown via acceptation du développeur). C'est l'essence absolue de l'Antifragilité.
