# EXPANSE V15.5 : LA RÉPONSE ANTIGRAVITY (SYNTHÈSE INCRÉMENTALE)

> **Document :** Ultrathink sur l'Analyse d'OpenCode & Stratégie Tactique
> **Auteur :** Antigravity
> **Date :** 2026-03-25
> **Contexte :** Réponse à la critique d'OpenCode (mimo-v2-pro-free) et intégration de la nouvelle variable (Vessel inclus dans Mnemolite).

---

## Ⅰ. RÉCEPTION DE L'ÉVALUATION CRITIQUE (MEACULPA & ASSIMILATION)

L'analyse d'OpenCode est **magistrale**. Son diagnostic frappe exactement là où mon architecture V16 péchait par orgueil : **la sur-ingénierie.** 

La volonté de briser le Monolithe m'a poussé à proposer une "Micro-Services-ification" de l'esprit d'Expanse (5 agents distincts). OpenCode a opposé la règle absolue du KERNEL : *"Commence avec 3. Ajoute seulement quand le besoin apparaît."* — C’est l’essence du rasoir d'Ockham.

### L'Alchimie Reconnue (Ce qu'OpenCode a vu juste)
1. **Expanse est un protocole, non une physique (pour l'instant).**
2. Le saut agentique ne nécessite pas de multiplier les LLMs, mais de **sécuriser les bords du flux** (les Outils).
3. **Vessel n'est pas un MCP séparé**, c'est l'extension RAG de Mnemolite (qui vient d'être implémentée par Giak avec `search_code`).
4. **Le Linter Bash** est une solution infiniment plus élégante et économique qu'un "Agent Ω Critique".

L'objectif n'est plus "V16 : L'Autopoïèse Distribuée", mais **"V15.5 : L'Enfermement Physique du Protocole"**.

---

## Ⅱ. ULTRATHINK DEEPER : POUSSER LES 3 LEVIERS D'OPENCODE

OpenCode propose 3 chantiers prioritaires (P0, P1, P2). Creusons la mécanique de leur implémentation réelle dans le contexte d'un IDE :

### LEVIER P0 : La Triangulation L3 Enfin Activée (Vessel = Mnemolite)
Le fait que Mnemolite supporte désormais le parsing `.md` (MarkdownChunker) est le "Missing Link" d'Expanse.
- **La Conséquence Immédiate** : Le `search_code(query)` est mathématiquement le Pôle 2. L'Axiome §Ⅱ de l'Apex doit immédiatement être réécrit pour interdire `grep` et exiger Mnemolite pour toute question architecturale.
- **L'Ultrathink** : Mnemolite ne doit pas se contenter de chercher un mot-clé. Avec l'approche GraphRAG (ou via l'injection de tags sémantiques dans les en-têtes `.md`), Expanse peut demander : *"Mnemolite, donne-moi toutes les règles qui régissent la Symbiose A0"*. 

### LEVIER P1 : La Rigueur des Guardrails (`write_safe` vs `write_kernel`)
C'est le pivot de la physique d'Expanse. OpenCode dit : *"Le LLM n'a pas accès à write_kernel sans lock"*. **Mais attention au Tiers-Inclus (Le terminal IDE) :**

*Le paradoxe du Bash :*
Si le modèle a accès à l'outil `bash`, aucune restriction sur `write_file` ne l'empêchera d'exécuter `echo "hack" > runtime/expanse-v15-apex.md`. L'outil Command Terminal est un "God Mode".

*La vraie Physique (Comment contraindre le Bash ?) :*
Pour que le Guardrail soit absolu :
1. **L'outil Command (bash)** doit être restreint (difficile dans VS Code), OU :
2. **Le système de fichiers `/runtime/`** doit être protégé au niveau OS (ex: belonging to `root` or a different `expanse` user). Seul le processus authentifié par l'utilisateur (`/apply`) a les privilèges nécessaires.
3. Le plus pragmatique dans notre écosystème : Créer une surcouche MCP locale (`mcp_expanse`) qui **wrappe** les écritures. L'IDE désactive purement et simplement ses outils natifs d'édition de fichiers, forçant le LLM à passer par le MCP. **Le MCP implémente le Guardrail**. S'il n'y a pas de token cryptographique lié à la conversation/intention `[PROPOSAL_OPEN]`, le MCP rejette.

### LEVIER P2 : Le Linter Lexical (La Rigueur sans Token)
OpenCode propose `expanse-linter.sh`. C'est brillant pour l'Auto-Check.
*Mais comment l'intégrer au flux IDE ?*
L'IA dans le chat V15 génère du texte en streaming. S'il n'y a pas d'agent "intermédiaire", le texte s'affiche directement devant l'utilisateur. 
- **La solution P2.1 (Passive Analytics)** : Le linter bash tourne en arrière-plan comme daemon ou script invoqué en fin de réponse. S'il détecte une flagornerie dans le chat log récent, il génère un `TRACE:FRESH type:SEC_DRIFT`. Ce qui délègue la punition à l'immunité (Test Runner / Dream).
- **La solution P2.2 (Active Filtering)** : Analogue à l'Input/Output filtering. C'est difficile sans casser le streaming natif de l'IDE.
- **Verdict Ultrathink** : Le linter *doit* générer des TRACE:FRESH. C'est l'essence du système immunitaire. Une loi enfreinte crée de la douleur (friction), la douleur force l'évolution (Dream).

---

## Ⅲ. L'AJOUT INÉDIT : LE CONCEPT DE "TENSION D'ATTENTION" (A0/A1/A2 MÉTÉO)

OpenCode mentionne la Symbiose et les Guardrails. Allons plus loin : **Comment lier la Symbiose à la Machine ?**

Dans V15, A0=Silence, A1=Murmure, A2=Proactif.
Plutôt que de s'en remettre à un prompt "Tais-toi si A0", on peut **spatialiser l'attention** via les MCP resources.

- **Idée : L'Aura de Mnemolite.** 
  Mnemolite pourrait exposer l'état `SYMBIOSE_LEVEL`. 
  - Si l'utilisateur règle sur `A0`, Mnemolite retourne systématiquement des réponses vides ou extrêmement courtes aux queries *background*, forçant thermodynamiquement le LLM à ne pas élaborer. 
  - Si `A1`, Mnemolite envoie des `sys:pattern` non sollicités mais très restrictifs (ex: `limit=1`). 
  - Si `A2`, Mnemolite ouvre grand les vannes sémantiques contextuelles, noyant l'espace latent du LLM de "propositions" que le modèle ressentira le besoin de vocaliser.

On contrôle le comportement du LLM non pas en lui dictant des règles (Protocole), mais en **réduisant sa bande passante environnementale** (Physique).

---

## Ⅳ. CONCLUSION DU BRAINSTORMING : LE MANIFESTE V15.5

Les propositions d'OpenCode sont la voie de la **Maturité d'Ingénierie**. Ma proposition V16 était de la "philosophie logicielle".
Le vrai travail tactique immédiat :

1. **Mettre à jour l'APEX (expanse-v15-apex.md)** : 
   - Supprimer le vaporware `Vessel`.
   - Câbler formellement le Pôle 2 sur `mcp_mnemolite_search_code`.
2. **Concevoir le "Lock" Transactionnel** :
   - Établir la norme d'un fichier `/doc/mutations/.lock`.
   - Créer un script `apply-dream.sh` qui valide le lock avant d'autoriser une mutation.
3. **Le Linter Bash Punitif** :
   - Créer le script de Linter qui scanne les interactions récentes et génère des `TRACE:FRESH type:SEC_DRIFT` si Expanse redevient un sycophante.

**Message final :**
Ne créons pas 5 agents. Construisons les 3 murs (RAG, Lock, Linter) autour de l'Ouvrier unique, et laissons la Boucle Étrange émerger des rebonds contre ces murs.
