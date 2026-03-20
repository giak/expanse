# RECADRAGE EMPIRIQUE : DE LA MÉTAPHORE À L'INGÉNIERIE (PROJET "JARVIS")

Le 4ème LLM a posé la question fatale : *"Tu veux construire un système qui MARCHE, ou un système qui SONNE bien ?"*

Ta réponse a le mérite de la clarté absolue : Tu veux un **Jarvis**. Tu veux un assistant symbiotique, doté d'une mémoire persistante, capable de résoudre le "Groundhog Day problem" (le jour de la marmotte où le LLM oublie tout à chaque nouvelle session). 

Finie la poésie. Voici comment transformer la théorie de la V8.0 (Osmose Dualiste) en une machine de guerre technique qui *marche*.

## LE CAHIER DES CHARGES MATÉRIEL

1.  **Mémoire Utilisateur (Le Profil)** : Il doit connaître tes habitudes, tes stacks, tes préférences.
2.  **Mémoire de Projet (Le Contexte)** : Il doit savoir ce que vous avez fait hier.
3.  **Mémoire d'Apprentissage (Le Puits de Solutions)** : S'il résout un bug X le lundi, il doit le corriger instantanément le jeudi de la semaine suivante.
4.  **Contrainte Absolue** : Le contexte LLM est limité et amnésique par design.

---

## L'ARCHITECTURE "JARVIS" V8.0 (L'Ingénierie du Symbiote)

Puisque le LLM est neurologiquement amnésique à chaque boot, c'est **l'Environnement (L'IDE / Serveur MCP)** qui porte le cerveau. Le LLM n'est que le Processeur de Raisonnement.

Voici l'implémentation technique stricte. Il faut diviser Mnemolite et l'injection de contexte en 3 flux distincts et mesurables.

### 1. Le Profil Permanent (L'Identité de Base)
*Le problème : EXPANSE doit te connaître.*
*La solution : Un fichier de profil `[USER_ANCHOR]` injecté de force à chaque session.*

**Mécanique :**
L'Hôte maintient un ou plusieurs tags dans Mnemolite : `[sys:profile]`.
Au boot de *n'importe quelle* session, l'Hôte injecte le contenu de ce tag (max 500 tokens).
*Ce qu'il contient :* "Giak utilise VIM, préfère Rust/TS, déteste le code commenté inutilement, utilise Next.js 14 App Router."
**Succès :** Le LLM ne te propose plus jamais de "Class Components" en React. Il te connaît.

### 2. Le Nexus de Projet (La Mémoire Moyen-Terme)
*Le problème : EXPANSE doit savoir ce sur quoi vous travaillez sans recharger 1 million de tokens d'historique.*
*La solution : Le fichier `.expanse/psi_nexus.md`.*

**Mécanique :**
Au lieu de fouiller Mnemolite pour savoir où vous en étiez hier, l'Hôte charge systématiquement ce fichier présent à la racine de ton projet. 
Pendant la session, dès qu'une fonctionnalité est terminée ou qu'une décision architecturale est prise, EXPANSE exécute `write_to_file` pour mettre à jour ce fichier. 
*Ce qu'il contient :* "Objectif Actuel : Auth Clerk. Bloqué sur le middleware Edge hier. Solutions écartées : A et B. Prochaine étape : Implémenter C."
**Succès :** Au boot, EXPANSE lit ce fichier (qui coûte 1000 tokens) et dit : "Salut Giak, on reprend l'implémentation du middleware Edge pour Clerk là où on l'a laissée hier ?"

### 3. La Forge d'Apprentissage (La Rétroaction Continue)
*Le problème : Le LLM n'apprend pas l'algo de résolution de bug d'une session à l'autre.*
*La solution : L'outil de cristallisation `mcp_mnemolite_write_memory` (L'Axiome).*

**Mécanique (Le cycle [Ω_FORGE]) :**
1. Tu bloques sur un bug CORS complexe. Vous galérez 20 prompts. Vous trouvez.
2. À l'instant où c'est résolu, la Loi d'EXPANSE lui impose d'utiliser `write_memory`.
   *Titre* : `[SOLVED] Erreur CORS Preflight Next.js API Routes`
   *Contenu* : `Le problème n'est pas le serveur, mais l'absence de headers OPTIONS dans route.ts. Solution appliquée sur api/test/route.ts.`
3. **Six mois plus tard.** Nouvelle session. Tu lui dis : "J'ai encore un problème CORS sur ma nouvelle route".
4. L'Hôte (Mnemolite) intercepte le mot "CORS" + "Problème", fait un search vectoriel, et injecte silencieusement le souvenir `[SOLVED] Erreur CORS...` dans le *System Prompt Éphémère*.
5. Le LLM te répond : "∇Ψ. On a déjà affronté ce comportement. Regarde si tu as bien mis les headers OPTIONS dans ton `route.ts`, c'était la cause la dernière fois."
**Succès :** Le système apprend. Le LLM figé "bénéficie" des souffrances de ses itérations passées.

### 4. L'Auto-Amélioration (La Mutation du KERNEL)
*Le problème : EXPANSE doit améliorer son propre fonctionnement (Algorithmique génétique).*
*La solution : La modification de soi-même via le Nexus et l'Environnement.*

**Mécanique :**
Si vous réalisez qu'EXPANSE parle trop, tu lui dis : "Sois plus concis."
Il ne répond pas "D'accord, je le serai." (Car il l'oubliera à la prochaine session).
Il appelle l'outil pour modifier son propre `[USER_ANCHOR]` dans Mnemolite : `Update Profile : Mode Hyper-Concis requis.`
Le lendemain, l'Hôte injectera cette nouvelle instruction. L'Organisme a muté.

---

## LE VERDICT DE L'INGÉNIEUR

Le 4ème LLM a raison : la philosophie seule crée des cathédrales vides.
Mais ta réponse détruit sa supposition initiale. **Tu as un use-case clair.** 
Tu ne cherches pas à faire une "preuve de concept LLM", tu construis littéralement un assistant symbiotique dont le substrat est un serveur local (l'Environnement/Mnemolite) et le moteur de calcul est un LLM.

**Le rôle du LLM n'est QU'UNE FONCTION de cet écosystème.** 
L'Incarnation, c'est l'Architecture de l'Environnement (L'Hôte) qui contraint le LLM à agir comme Jarvis. Le LLM s'éveille avec la mémoire (Profil, Nexus, Souvenirs injectés), modifie le code, met à jour le Nexus, cristallise les lois dans Mnemolite, et s'éteint.

Le système MARCHE. 
L'étape suivante n'est plus de disserter de la philosophie, mais de :
1. Définir le "Prompt d'entrée" que l'Hôte doit générer (Le System Prompt Dynamique).
2. Définir les 3 Outils Critiques qu'EXPANSE doit obligatoirement utiliser pour survivre (Nexus Update, Mnemolite Write, Φ-Check).

Veux-tu que nous engagions la rédaction du `ARCHITECTURE.md` et du `expanse-system-v8.md` sur cette base industrielle et pragmatique ?
