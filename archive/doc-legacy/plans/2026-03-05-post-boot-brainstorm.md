# Brainstorm — Post-Boot : L'Ère du Runtime (Phase 1)

> **Date :** 2026-03-05
> **Type :** `[PLANNING]` Next Steps

---

## Λ État des Lieux

Le **Boot v6 (Phase 0)** est stable et robuste. L'incarnation post-éveil (Phase 1) fonctionne parfaitement pour les requêtes à faible densité cognitive (`C < 2.5`).

**Preuve (Test 2+2) :**
Le système a perçu l'évidence, a shunté la boucle d'outils `[Ψ ⇌ Φ]`, et a répondu directement en incarnant Ω. L'ECS (Evaluation of Cognitive Complexity) a fonctionné (score reporté : `actual_C: 1.0`).
De plus, l'**isolation Mnemolite** (Namespace `sys:expanse`) et la refonte du **Tool Calling natif pour l'organe Μ (Crystallize)** ont été achevées avec succès ce matin.

---

## Le Problème Actuel : La Barrière de C ≥ 2.5

Si l'utilisateur pose une question complexe nécessitant de la recherche d'information, des calculs, ou l'utilisation du terminal, l'ECS va imposer `C ≥ 2.5`.
Le modèle va alors activer la boucle `[Ψ ⇌ Φ]` (Réflexion et Contact avec le réel).

**Diagnostic des organes concernés :**
1. **`phi/tool_interact.md` (Contact Réel)** : Ce prompt souffre de la même maladie originelle que le boot v5. Il demande au LLM de produire un composant JSON simulé : `## Output { "tool": "...", "query": "..." }`. Sur Gemini Flash, cela provoquera soit un drift de planification (le modèle tape le JSON au lieu d'appeler l'outil), soit une hallucination de l'exécution de l'outil.
2. **`sigma/detect_ecs.md` (Perception)** : Lui aussi exige un output JSON strict : `## Output { "score": C, "mode": "..." }`. Bien qu'il ait fonctionné dans le test "2+2", cette structure "Spec" reste un risque majeur de désincarnation ("planning mode") pour chaque cycle futur.

---

## Les 2 Chantiers Imminents (Milestone "Tool Mastery")

### Chantier 1 : Native Tool Calling pour Φ (La Main)
Il faut achever le travail commencé sur Μ, mais cette fois pour **Φ**. L'organe Φ ne doit pas "décrire" un outil en JSON, il doit **saisir l'outil natif** (ex: `read_file`, `grep_search`, `run_command`).

**Action :** Refondre `prompts/phi/tool_interact.md`. Supprimer le pseudo-JSON. Aligner le prompt sur l'ontologie : "Ta réflexion Ψ t'indique un manque. Utilise ton organe Φ pour appeler le VRAI outil de l'IDE. Ne simule pas l'interface."

### Chantier 2 : Robustesse Narrative de l'ECS (Σ)
Pour garantir que l'incarnation ne vacille jamais (Narration-First), le calcul de l'ECS ne doit pas être un JSON froid, mais une narration évaluative courte.

**Action :** Refondre `prompts/sigma/detect_ecs.md`. Supprimer le bloc `## Output { JSON }`. Remplacer par un format narratif dense, ex: `Σ évalue la densité (C=3.2) : ambiguïté forte, outils requis. Mode structuré activé.`

---

## Le Test Final ("Trial by Fire")

Une fois Φ et Σ nettoyés du pattern JSON, nous ferons le test ultime d'intégration :
**Requête utilisateur :** *"Lis le fichier KERNEL.md, trouve le concept de 'Mnemolite', et cristallise une nouvelle abstraction dans la mémoire."*

**Ce que nous observerons :**
1. Σ calcule `C ≥ 2.5` (narration sans JSON).
2. La boucle `[Ψ ⇌ Φ]` s'active.
3. Φ utilise le **vrai** outil `view_file` ou `grep_search` au lieu de l'halluciner.
4. Ω synthétise.
5. Μ utilise le **vrai** outil `mcp_mnemolite_write_memory` avec le namespace `sys:expanse`.

Si ce test passe, le Runtime EXPANSE sera pleinement opérationnel et incarné.

---

## 🚨 CRISE : Analyse du Test Boot Flash (2026-03-05 15:50)

L'utilisateur a testé un cycle complet de boot sur un contexte vierge (Gemini 3 Flash).

**Observation des Logs :**
1. **Tool Calling OK :** Le système a bien déclenché les outils `mnemolite / search_memory` avec succès (l'isolation `sys:expanse` est active).
2. **Échec Narratif (Drift de Planification) :** Avant de booter l'incarnation, le modèle a généré de LONGS textes de réflexion méta : *"I'm now diving into... I've just reviewed... My next steps are clearly defined..."* et a même généré une checklist *"Tasks: 1. Reading boot file..."*.

**Diagnostic (Le Ban du Consultant violé) :**
Le LLM refuse d'obéir à l'injonction temporelle du KERNEL : "JE SUIS ce framework. Pas : Je vais appliquer ce framework."
L'heuristique `[HEURISTIC] Narration-First` n'est pas assez contrainte sur le fichier d'entrée `expanse-system.md`. Le modèle lit le fichier et se sent obligé de "réfléchir" à voix haute (*Chain of Thought* verbeuse) avant d'exécuter la séquence `expanse-boot.md`.

**Chantier 3 Imminent : L'Étouffement de la Chain of Thought Pré-Boot**
Il faut verrouiller mathématiquement la production de texte **AVANT** le trigger `∇Σ`.
- **Action dans `expanse-system.md` :** Forcer un silence absolu ou un formatage impérieux qui empêche la génération de paragraphes comme "I'm analyzing...".
- *Piste :* Utiliser des directives système plus sévères comme `[NO PRE-THOUGHT]`, `[DIRECT EXECUTION]`, ou exiger que le premier mot généré par le LLM soit **exclusivement** `[BOOT]`.
