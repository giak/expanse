# Brainstorm — Signal Observation Générique (V8.4 — Ultrathink)

> Skill : [skills/brainstorm/SKILL.md](file:///home/giak/projects/expanse/skills/brainstorm/SKILL.md)  
> ECS = 3.5 — Mode Structuré Maximum  
> Posture : Le problème n'est pas "comment déclencher Μ" — c'est "quoi observer".

---

## Λ Contexte — Le Vrai Problème

Notre approche actuelle est **fondée sur des proxies mécaniques** :
- `C > 3.0` → mesure la complexité, pas la friction.
- `correction_detected=true` → mesure un mot de correction, pas un désalignement.
- `iteration_count ≥ 2` → mesure la répétition, pas sa cause.

Ces signaux sont **fragiles** car :
1. Ils dépendent d'heuristiques linguistiques qui varient selon les langues et les personnes.
2. Ils mesurent des effets (la correction) et non des causes (le désalignement conceptuel).
3. Ils sont **figés dans le code** — incapables d'évoluer avec l'usage.

**Contrainte duale :** EXPANSE doit s'auto-améliorer SANS l'humain (Rêveur autonome) ET AVEC l'humain (symbiose). Les signaux doivent alimenter les deux boucles.

---

## APPROCHE A — Le Bus de Signaux (Architecture Découplée)

### Idée
Plutôt que de coder des déclencheurs dans chaque organe, créer un **Bus de Signaux** : chaque organe *émet* des événements génériques. Μ *souscrit* et décide quoi cristalliser.

```
Σ émet: {type: "correction", severity: 0.8, context: "..."}
Ψ émet: {type: "drift", iteration: 2, topic: "..."}
Ω émet: {type: "incomplete", markers: ["[LOST]"], ...}
          ↓
     [Signal Bus] (tenu par Μ)
          ↓
      Μ décide: TRACE_FRICTION? USER_DNA? TRACE_FLOW?
```

### Analyse critique
- **Force :** Découplage total. Ajouter un nouveau type de signal ne modifie qu'un seul organe.
- **Force :** Générique et extensible par nature — le Rêveur peut proposer de nouveaux types de signaux.
- **Faiblesse critique :** Le "Bus" n'existe pas dans EXPANSE aujourd'hui. C'est une abstraction qui demande un fichier dédié (`mu/signal_bus.md`) et une modification de [meta_prompt.md](file:///home/giak/projects/expanse/prompts/meta_prompt.md) pour câbler les émissions.
- **Verdict :** Conceptuellement APEX, mais impose une refonte architecturale.

### APEX A
Le Bus est un tableau dans [meta_prompt.md](file:///home/giak/projects/expanse/prompts/meta_prompt.md) :
```
session_signals = []
```
Chaque organe y ajoute ses événements. Μ les lit en fin de cycle et décide. Léger, sans nouveau fichier.

---

## APPROCHE B — L'Observateur Comportemental (Déviation du Baseline)

### Idée
Au lieu de détecter des événements spécifiques, Ψ maintient un **profil de session courant** et mesure sa **déviation du `[USER_DNA]` attendu**. Toute déviation significative = signal.

Si `[USER_DNA]` dit que l'utilisateur est "rapide, technique, non-correctif" et que la session est "lente, philosophique, avec 3 reformulations" → déviation élevée → `[TRACE_FRICTION]`.

### Analyse critique
- **Force :** Véritablement générique. Pas besoin de nommer les signaux — la déviation parle d'elle-même.
- **Force :** Self-improving par nature — plus le `[USER_DNA]` est précis, plus la détection est fine.
- **Faiblesse :** Circulaire au départ : le `[USER_DNA]` doit exister pour calculer la déviation. En l'absence de DNA (nouvelles sessions), le système est aveugle.
- **Solution :** Un DNA de bootstrap générique par défaut, raffiné au fil des sessions.

### APEX B
[psi/meta_reflect.md](file:///home/giak/projects/expanse/prompts/psi/meta_reflect.md) calcule un `session_profile` après chaque échange et le compare au `[USER_DNA]` chargé par Σ. Déviation > seuil → émet un signal vers le Bus.

---

## APPROCHE C — L'Observation par l'INPUT (Le Renversement)

### L'Insight le plus radical

**On observe les mauvais signaux.** Nous observons les OUTPUTS (corrections, itérations, [LOST]). Mais le signal le plus riche est l'**INPUT** — les questions elles-mêmes.

Chaque question de l'utilisateur révèle :
- Ce qu'il ne sait pas encore (domaine à renforcer dans `USER_DNA`).
- Ce qu'il cherche (intention latente, souvent différente de la demande explicite).
- Son style cognitif (question courte/directe vs longue/philosophique).
- Ses patterns de questionnement (questions en cascade, reformulations préventives).

**La dernière question de la conversation est souvent la plus importante.** Elle révèle où le dialogue a abouti et ce qui reste non-résolu.

### Analyse critique
- **Force révolutionnaire :** Σ est déjà positionné pour lire l'input. On n'ajoute rien — on lit mieux ce qui arrive.
- **Force :** Ne dépend d'aucun proxy mécanique (ECS, itérations). Observe la substance réelle.
- **Force :** Fonctionne dès la première session, sans `[USER_DNA]` préexistant.
- **Faiblesse :** Demande que Σ soit capable d'analyser la **structure** et non juste le **contenu** de la question. Effort d'analyse plus élevé.

### APEX C
[sigma/parse_input.md](file:///home/giak/projects/expanse/prompts/sigma/parse_input.md) ajoute une dimension d'**analyse méta-conversationnelle** :
- Style de question : directif / exploratoire / correctif / collaboratif.
- Position dans la conversation : 1ère question / milieu / dernière question.
- Question récurrente (même thème depuis 3+ échanges) → `[PATTERN]` émergent.

Μ reçoit cette analyse enrichie et cristallise automatiquement ce qui mérite d'être retenu — sans attendre une correction ou un ECS élevé.

---

## Comparaison Finale

| Approche | Généricité | Robustesse | Effort Impl. | Autonome/Symbiose |
|----------|-----------|-----------|-------------|-----------------|
| A (Bus) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Élevé | Les deux |
| B (Déviation) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Moyen | Les deux |
| C (Input) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Faible | **Les deux, dès J1** |

---

## FinalSolution — La Triade Complète V8.4

Ces trois approches ne sont pas alternatives — elles sont les **trois couches d'un même système d'observation** :

```
COUCHE 1 (C) — Σ observe l'INPUT
  → Analyse méta-conversationnelle : style, récurrence, position
  → Fonctionne sans USER_DNA

COUCHE 2 (B) — Ψ mesure la DÉVIATION
  → Compare session courante au USER_DNA
  → Devient plus précis au fil du temps

COUCHE 3 (A) — Μ agrège les SIGNAUX
  → Bus interne dans meta_prompt.md
  → Décide la cristallisation selon la convergence des signaux des couches 1 et 2
```

Au lieu d'un déclencheur unique et fragile, EXPANSE triangule depuis trois sources indépendantes. Un signal isolé ne déclenche pas de cristallisation. La convergence de deux signaux ou plus = cristallisation certaine.

**∴ La friction utile n'est pas détectée par un seuil. Elle est triangulée par convergence.**

---

## Ce qui Change dans l'Architecture

| Mutation | Type | Fichier | Impact |
|---------|------|---------|--------|
| `session_signals = []` dans le cycle | `[MODIFY]` | [meta_prompt.md](file:///home/giak/projects/expanse/prompts/meta_prompt.md) | Central |
| Analyse méta-conversationnelle | `[MODIFY]` | [sigma/parse_input.md](file:///home/giak/projects/expanse/prompts/sigma/parse_input.md) | Générique |
| Calcul de déviation vs USER_DNA | `[MODIFY]` | [psi/meta_reflect.md](file:///home/giak/projects/expanse/prompts/psi/meta_reflect.md) | Adaptable |
| Décision de cristallisation par convergence | `[MODIFY]` | [mu/crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md) | Intelligent |
