# Plan d'Implémentation Détaillé — Leviers d'Émergence Expanse V15

> Issu du [dialogue multi-LLM](file:///home/giak/projects/expanse/doc/artifacts/2026-03-23_synthese_dialogue_emergence.md). 4 LLM unanimes sur ces leviers.

## I. CONTEXTE ET ARGUMENTATION

Expanse V15 est un système **réactif**. Il attend que l'utilisateur signale une erreur pour apprendre (TRACE:FRESH). Le KERNEL définit des idéaux d'auto-observation qui ne sont pas traduits en mécanismes.

**La thèse de ce plan :** on ne peut pas forcer un LLM à "être" un système conscient, mais on peut le forcer à s'auto-surveiller par des boucles fermées automatisées.

### Les 4 Leviers Unanimes

| Levier | Argument | Bénéfice attendu |
|--------|----------|------------------|
| **Rappel Associatif** | Le boot est une query statique. Le rappel est une query sémantique liée à l'input. | Réduction des hallucinations et dérives sur les sujets déjà traités. |
| **Détection Binaire** | Un score est du bruit. Une contradiction avec un `sys:anchor` est un signal dur. | Détection autonome de la dérive, indépendante de l'utilisateur. |
| **Vessel / Grep** | La triangulation L3 est incomplète. `grep` ancre le LLM dans la réalité de ses propres docs. | Précision technique accrue sur les demandes d'architecture. |
| **Passe 7 (Diff)** | Le système est amnésique d'une session à l'autre sans rapport de dérive. | Mesure directionnelle de l'évolution du système. |

---

## II. MODIFICATIONS — EXPANSE-V15-APEX.MD

### Modification 1 : Rappel Associatif (L2+)

**Emplacement :** §Ⅱ — Boucle Ψ⇌Φ (lignes 42-46)

```diff
 ### Boucle Ψ⇌Φ (Si L2+)
-1. **Ψ (Trace)** : Raisonne, identifie les inconnues
+1. **Μ→Σ (Rappel)** : `search_memory(query=Σ_input, tags=["sys:pattern","sys:anchor"], limit=3)`. Intégrer les résultats pertinents au contexte.
+2. **Ψ (Trace)** : Raisonne avec le contexte rappelé, identifie les inconnues
 2. **Φ (Audit)** : Vérifie avec outils, web, fichiers
 3. **Si incertain** : Itérer jusqu'à clarification
 4. **Ω** : Synthétiser la réponse
```

**Justification :** En insérant l'appel Mnemolite *avant* le raisonnement Ψ, on injecte les patterns scellés directement dans le "flux de pensée" du LLM. Ce n'est plus un outil qu'on consulte, c'est un stimulus qui précède l'action.

---

### Modification 2 : Détection de Divergence (L2+)

**Emplacement :** §Ⅲ — Cristallisation (avant §Ⅳ)

```diff
+### Détection de Divergence (Route ≥ L2, silencieux)
+APRÈS Ω, AVANT émission :
+  **Q1** : "Ma réponse contredit-elle un `sys:anchor` chargé au boot ?"
+    → OUI : `write_memory(title: "DRIFT: {symptom}", tags: ["sys:drift", "auto", "type:contradiction", "substrat:{LLM}"], memory_type: "investigation")`
+  **Q2** : "Ma réponse exploite-t-elle un pattern NON présent dans `sys:pattern` ?"
+    → OUI : `write_memory(title: "CANDIDATE: {nom}", tags: ["sys:pattern:candidate", "auto", "substrat:{LLM}"], memory_type: "reference")`
+  Ce mécanisme est **invisible** dans l'output. Il alimente Dream.
```

**Justification :** On transforme le LLM en son propre surveillant. En créant `sys:drift` automatiquement, on donne au système une source de données "interne" qui ne dépend pas de Christophe Giacomel disant "non". C'est le premier pas vers une boucle fermée autonome.

---

### Modification 3 : Vessel (Triangulation L3)

**Emplacement :** §Ⅱ — Triangulation (lignes 57-59)

```diff
-Valider via 3 pôles : `sys:anchor` (historique) + Vessel (documentation technique du workspace) + Web/Search (réalité externe).
+Valider via 3 pôles :
+  1. `search_memory(tags=["sys:anchor"])` → historique scellé
+  2. `bash("grep -rn '{keywords}' /home/giak/projects/expanse/doc/ --include='*.md'")` → workspace (Vessel)
+  3. `web_search(query='{keywords}')` → réalité externe
```

**Justification :** Le `search_code` de Mnemolite n'est efficace que sur du code source. Les fichiers de documentation étant du markdown, `grep` est l'outil souverain pour naviguer dans l'espace documentaire (Vessel).

---

## III. MODIFICATIONS — EXPANSE-DREAM.MD

### Modification 4 : Consommation de sys:drift

**Emplacement :** Passe 1 — La Plaie (lignes 56-67)

```diff
- - **Action :** `mcp_mnemolite_search_memory(query: "TRACE:FRESH", tags: ["trace:fresh"], limit: 20)`
+ - **Action :** 
+   1. `search_memory(query: "TRACE:FRESH", tags: ["trace:fresh"], limit: 20)`
+   2. `search_memory(query: "sys:drift", tags: ["sys:drift"], limit: 20)`
```

**Justification :** Sans cette modification, les dérives auto-détectées par l'Apex en Phase 2 seraient stockées mais jamais "rêvées" par le système.

---

### Modification 5 : Passe 7 — Le Différentiel Temporel

**Emplacement :** Après Passe 6 (fin de la Partie 1)

**Action :** Comparer `sys:history` de la semaine A vs semaine B.
**Output :** `write_memory(tags=["sys:diff", "temporal"], content=score_velocity)`.

**Justification :** Permet à Christophe de voir si le système s'améliore (vitesse d'adaptation positive) ou s'il régresse (friction en hausse).

---

## IV. TABLEAU DES RISQUES &Rollback

| Risque | Impact | Mitigation |
| :--- | :--- | :--- |
| **Pollution du contexte Ψ** | Moyen | `limit=3` sur le rappel associatif pour éviter de noyer l'input. |
| **Coût tokens accru** | Faible | +300-500 tokens par interaction L2+. Négligeable sur une fenêtre de 128k. |
| **Confusion binaire** | Faible | Dream filtre les anomalies isolées (nécessite `count ≥ 2`). |
| **Casse structurelle Apex** | Élevé | **PROTOCOLE :** Vérification via 6 greps structurels après chaque `write`. |

**Rollback :** Chaque modification est isolée par des blocs markdown clairs. En cas d'erreur de boot (`Ψ [STALL]`), revenir à la version V15 brute via `git checkout` ou `view_file` archives.

---

## V. PROTOCOLE DE TEST A/B (Phase 3)

Pour valider l'hypothèse **Exemples > Règles** :

1. **Baseline** : Charger le système actuel (Boot standard). Mesurer `Ψ_compliance` sur 5 interactions.
2. **Phase Test** : Charger `KERNEL_SLIM` + 15 exemples scellés (`sys:example`).
3. **Verdict** : Si le respect du style SEC et l'utilisation de Ψ augmentent, adopter le mode "Habituation".

---

## VI. VERIFICATION FINALE

**Avant adoption, exécuter :**

```bash
# Vérifier la présence des nouveaux mécanismes
grep -E "Μ→Σ|sys:drift|grep -rn|Passe 7" /home/giak/projects/expanse/runtime/*.md
```

**Intervention humaine attendue :**
Christophe Giacomel doit sélectionner 15 interactions de référence pour alimenter le pool `sys:example`.

---

*Plan détaillé — 2026-03-23 | Antigravity*
