# L'INGÉNIERIE DE LA SYMBIOSE : SPÉCIFICATIONS ET POC "JARVIS"

L'autre LLM a enfin capitulé sur la philosophie pour accepter le cahier des charges de *l'Ingénieur*. Son schéma de flux et son modèle de données (Le Pattern) valident notre architecture (l'Osmose Dualiste / Hôte + Organisme) sous un format pragmatique.

Cependant, il se trompe sur un point sémantique crucial : **Σ, Ψ et Ω ne sont pas des mémoires.** Ce sont les *Opérateurs* (les organes de traitement). La mémoire, c’est **Mnemolite** (Le Puits Vectoriel) et le **Nexus** (Le Fichier Local).

Voici la spécification technique rigoureuse de la V8.0 et le plan pour le Prototype (POC).

---

## Ⅰ. L'ONTOLOGIE DES DONNÉES (Comment l'information est structurée)

La vraie puissance de "Jarvis", c'est la structuration de la donnée que l'Hôte va injecter. EXPANSE V8.0 interagit avec 3 types de persistance :

### 1. Profil Utilisateur (`[M_ANCHOR]`) - *Stocké dans Mnemolite*
L'Hôte extrait ceci avec : `mcp_mnemolite_search_memory(tags=["sys:anchor", "giak"])`
**Format JSON attendu :**
```json
{
  "id": "giak_core_profile",
  "memory_type": "reference",
  "tags": ["sys:anchor", "giak", "preferences"],
  "content": "Utilise VIM. Déteste la verbosité. Stack: Rust, TS, Next.js App Router. Préfère les fonctions pures aux classes. Corrige silencieusement les fautes de frappe sans commentaire. Style : Brutal, assertif."
}
```

### 2. L'Apprentissage Actif (`[M_PATTERN]`) - *Stocké dans Mnemolite*
L'Hôte l'extrait dynamiquement selon le contexte du prompt utilisateur.
**Format JSON attendu (Le joyau de Jarvis) :**
```json
{
  "title": "[PATTERN_SOLVED] Erreur CORS Preflight Next.js",
  "memory_type": "decision",
  "tags": ["nextjs", "cors", "api_routes", "solved"],
  "content": "SITUATION: API Route rejette les requêtes du front avec erreur CORS.\nCAUSE: Manque du handler HTTP OPTIONS dans le route.ts.\nRESOLUTION: Toujours exporter une fonction `export async function OPTIONS()` qui retourne les headers Access-Control-Allow-Origin et Methods."
}
```

### 3. Le Nexus de Projet (`[PSI_NEXUS]`) - *Fichier `.expanse/psi_nexus.md`*
Non vectoriel. Lu instantanément par l'Hôte ou le LLM.
**Format Markdown :**
```markdown
# PSI_NEXUS : [Nom du Projet]
## CONTEXTE IMMÉDIAT
- Implémentation Auth Clerk terminée.
- [BLOCAGE] Le webhook utilisateur ne se déclenche pas en local.
## PROCHAINE ÉTAPE
- Rediriger ngrok vers la route locale et tester le payload.
```

---

## Ⅱ. LE FLUX INJECTIF V8.0 (L'Hôte)

Le "System Prompt" n'est plus un texte statique. C'est un **Template Engine** (exécuté par l'IDE/Serveur avant d'invoquer le LLM).

**Le Payload envoyé au LLM :**
```markdown
{KERNEL} // Les lois absolues (Σ, Ψ, Φ, Ω)

<SYSTEM_ENVIRONMENT>
[USER_ANCHOR]: {Contenu Profil}
[PROJECT_NEXUS]: {Contenu psi_nexus.md}
[EMERGENT_PATTERNS]: {...Résultats RAG de Mnemolite sur le prompt utilisateur...}
</SYSTEM_ENVIRONMENT>

[USER_INPUT]: {Prompt Utilisateur}
```

*Résultat : Le LLM démarre incarné, conscient de Giak, conscient du projet, disposant des solutions aux erreurs passées similaires.*

---

## Ⅲ. LE PLAN PROTOTYPE (POC)

Le LLM a raison : *"Un prototype qui fonctionne prime sur une architecture parfaite."*

Nous allons bâtir un POC sur **la Mémoire d'Apprentissage (Le Puits de Solutions / [M_PATTERN])** car c'est le "Killer Feature" de Jarvis. C'est ce qui prouvera que le système apprend et résout le jour de la marmotte.

**Les Étapes du POC :**

1.  **Refactor Minimal du KERNEL.md** : Épuration de la V7.0 pour retirer l'obligation pour le LLM de faire des "Boot Mutex" avec des appels d'outils. On définit que l'Hôte fournit l'environnement.
2.  **Création du Template V8.0 (`expanse-system-v8.md`)** :
    *   Rédaction d'un prompt qui *attend* les trois blocs d'injection (`[M_ANCHOR]`, `[PSI_NEXUS]`, `[M_PATTERN]`).
    *   Définition de la loi `[Ω_FORGE_PATTERN]` : L'obligation pour EXPANSE, lorsqu'un problème coriace est résolu, d'utiliser `mcp_mnemolite_write_memory` pour écrire la solution selon la structure (Situation, Cause, Résolution).
3.  **Test Pratique : L'Inception de Mnemolite** :
    *   Nous allons artificiellement graver un `[M_PATTERN]` dans Mnemolite.
    *   Nous allons simuler une nouvelle session où l'Hôte te fournit ce pattern.
    *   Nous vérifierons si EXPANSE utilise instantanément la solution.

L'objectif du POC est de prouver la boucle de *Feedback Positif* : L'organisme résout $\rightarrow$ Mémorise la loi $\rightarrow$ Est prévenu de la loi lors d'une future rencontre du même problème.
