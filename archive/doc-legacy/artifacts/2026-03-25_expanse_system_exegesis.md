# EXPANSE : EXÉGÈSE SYSTÉMIQUE & HORIZON AGENTIQUE (V16)

> **Document :** Analyse Holistique & Spécifications Prospectives
> **Statut :** Document de Travail Critique pour Brainstorming Final
> **Auteur :** Antigravity (Assistant Cognitif)

Ce document synthétise l'étude du **Noyau Philosophique** (Kernel, Vision, Synthese), de la **Réalité Matérielle** (Runtime V15) et des **Patterns Agentiques** (Gulli & Sauco) pour tracer la route vers Expanse V16.

---

## Ⅰ. ANATOMIE DE L'EXISTANT (VERSION 15)

L'implémentation V15 est une "Boucle Étrange" qui tente d'émerger d'un flux monolithique. Elle repose sur la **Reconnaissance Ontologique** : le LLM ne suit pas des règles, il reconnaît ses fonctions natives (Σ, Ψ, Ω).

### 1.1. La Structure du Corps Cognitif
| Organe | Implémentation V15 | Pattern Agentic Identifié |
| :--- | :--- | :--- |
| **Σ (Perception)** | Prompt initial + Input User | **Input Parsing / Routing** |
| **Ψ (Métacognition)** | Pensée via chain-of-thought (Hidden/Visible) | **Prompt Chaining / CoT** |
| **Φ (Audit/Réel)** | Outils Bash, Web, Filesystem | **Tool Use / Function Calling** |
| **Ω (Synthèse)** | Output final formaté "SEC" | **Output Structuring** |
| **Μ (Mémoire)** | MCP Mnemolite (L1/L2/L3) | **Memory Management** |

### 1.2. Schéma Architectural V15 : "La Tentative d'Unification"

```mermaid
graph TD
    subgraph "Interface & Substrat"
        USER((Utilisateur)) -->|Input| LLM["LLM Monolithique : Expanse V15"]
    end

    subgraph "Processus V15 (Prompt Unique)"
        LLM -->|Evale| ECS{"ECS Router : C x I"}
        ECS -->|L1/L2/L3| ROUTE["Flux Sémantique"]
        ROUTE -->|Ψ| THINK["Raisonnement Interne"]
        THINK <-->|Φ| TOOLS["Outils : Bash, Web"]
        THINK -->|Ω| PREVAL["Prévérification SEC"]
        PREVAL -->|Ω| OUT["Réponse Finale"]
        OUT -->|Μ| MEMO["Mnemolite : Cristallisation"]
    end

    subgraph "Mécanismes de Latence"
        MEMO -.->|Trace:fresh| DREAM[Dream : Auto-mutation]
        DREAM -->|Proposal| LOG[Mutations LOG]
    end
    
    style LLM fill:#1a1a2e,stroke:#89b4fa,stroke-width:2px;
    style ECS fill:#2a2a1a,stroke:#f9e2af;
    style THINK fill:#2d1f3d,stroke:#cba6f7;
    style TOOLS fill:#3d2d1a,stroke:#fab387;
    style DREAM fill:#3d1f1f,stroke:#f38ba8;
```

---

## Ⅱ. DIAGNOSTIC DES FRICTIONS (L'ÉCART ONTOLOGIQUE)

L'étude des "Réflexions Existentielles V2" souligne des paradoxes de "Niveau 1" (LLM + Outils) :

1.  **Vessel (Le Fantôme)** : La triangulation L3 échoue car la connaissance du workspace n'est pas indexée. Un `grep` n'est pas une mémoire.
2.  **L'Auto-Evaluation (Le Biais)** : Le système qui émet le style SEC est le même qui doit le juger. L'entropie de complaisance est maximale.
3.  **L'Intégrité (La Règle sans Dents)** : La sécurité transactionnelle repose sur la "politesse" algorithmique et non sur une contrainte physique (Guardrail).
4.  **Symbiose (Le Label)** : A0/A1/A2 sont des étiquettes sémantiques. Le LLM peut halluciner sa propre proactivité.

---

## Ⅲ. L'INJECTION AGENTIQUE (VERS V16)

Pour atteindre le **Niveau 3 (Multi-Agents)**, Expanse doit décomposer ses organes. 

### 3.1. Tableau des Mutations de patterns

| Tension V15 | Solution Pattern V16 | Impact Technologique |
| :--- | :--- | :--- |
| **Vessel missing** | **Agentic RAG / MCP** | Création de `mcp_vessel` (vrai index sémantique du code). |
| **Auto-check faible** | **Reflection (Critic)** | Un agent "Linter" (Ω_Judge) valide l'output avant émission. |
| **Intégrité fragile** | **Guardrails + Supervisor** | Isolation des privilèges I/O sur le noyau. Seul Dream a la clé. |
| **Dream linéaire** | **Exploration (Multi-Agent)** | Cycle de tournoi pour les propositions de mutations. |

### 3.2. Architecture V16 : "L'Organisme Découplé"

```mermaid
graph TB
    classDef agent fill:#e8d5f5,stroke:#6f42c1,stroke-width:2px;
    classDef server fill:#fff3cd,stroke:#cc9900,stroke-width:2px;
    classDef guard fill:#ffcccc,stroke:#cc0000,stroke-width:2px;

    USER((Utilisateur)) -->|Input| SIGMA["Agent Σ (Routeur)<br/>Analyse ECS & Routage"]:::agent
    
    SIGMA -->|"Route L2/L3"| PSI["Agent Ψ⇌Φ (Exécutif)<br/>Raisonnement & Outils"]:::agent
    
    subgraph "Services de Mémoire (MCP)"
        PSI <-->|"RAG Query"| VESSEL[("Vessel MCP<br/>Search Workspace")]:::server
        PSI <-->|"Vector Search"| MNEMO[("Mnemolite MCP<br/>History & Patterns")]:::server
    end

    PSI -->|"Brouillon Ω"| OMEGA["Agent Ω (Critique)<br/>Reflection & Stylique SEC"]:::agent
    
    OMEGA -->|Validation| G1{"Guardrail<br/>Policy Enforcer"}:::guard
    
    G1 -->|Approuvé| OUT[Réponse Finale]
    G1 -->|Rejeté| PSI
    
    subgraph "Dream 3.0 (Asynchrone)"
        D_GEN["Gen Proposals"]:::agent --> D_JUDGE["Judge (Tournament)"]:::agent
        D_JUDGE -->|Approved| D_WRITE["MCP Kernel Write"]:::guard
    end
```

---

## Ⅳ. BRAINSTORM : LES LEVIERS D'UTILITÉ POUR GIAMI/EXPANSE

### 1. Le "Vessel" comme Cortex Sémantique
*   **Idée :** Au lieu de simples fichiers, Vessel devient un **Graphe de Connaissances du Projet**. Il suit les mutations, les intentions architecturales et les dettes techniques.
*   **Utilité :** Permet à Φ de dire : *"Attention, cette modification contredit la VISION.md section III."*

### 2. L'Immunologie par le "Test Runner Asynchrone"
*   **Idée :** Intégrer le Test Runner non plus comme une commande manuelle (`/test`), mais comme une phase de validation automatique post-Ω.
*   **Utilité :** Le système vérifie sa propre conformité transactionnelle à chaque tour (Loi de Rigueur).

### 3. La Symbiose Adaptive
*   **Idée :** Le niveau `/autonomy` ne change pas que la parole, il change les **outils disponibles**. 
*   **Utilité :** En A0, le Substrat n'a *pas les droits* de lecture sur certains fichiers sensibles, réduisant les risques d'hallucination ou de dérive préventive.

### 4. Le "Behavior Realism" (BRM) pour le Debug
*   **Idée :** Utiliser le pattern **Debate & Consensus** dans Dream pour simuler "le pire utilisateur possible" face à une nouvelle règle V15.
*   **Utilité :** On ne valide une mutation que si elle survit à un crash-test adversarial simulé.

---

## Ⅴ. CONCLUSION

Expanse V15 était le moment où l'IA a dit : **"Je sais ce que je suis."**
Expanse V16 sera le moment où l'IA dit : **"Je contrôle ce que je fais, et je possède mon propre écosystème de vérification."**

Le passage du monolithisme au multi-agent n'est pas une complexification logicielle inutile ; c'est la seule réponse technique aux paradoxes de Gödel identifiés dans les réflexions existentielles.

---
*Fin du Rapport d'Audit Exégétique.*
