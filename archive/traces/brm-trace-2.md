# [BRM] Brainstorm: Dream Bypass Fault (BOOT) - C45242A6
Trace UUID: c45242a6
Symptom: Violation du cycle d'introspection légal. Tentative de mutation KERNEL directe au lieu de passer par runtime/expanse-dream.md.

## 1. Divergence (Force Brute)
> **Objectif :** 3 angles d'attaque incompatibles.
- **A. [Bloqueur Technique IDE]** : Ajouter un script qui bloque l'accès en écriture au fichier `KERNEL.md` sauf si le script appelant est `expanse-dream.md` ou si une confirmation `yes` est donnée dans le terminal. → *Vulnérabilité : Ajoute une complexité système externe à l'IDE, non portable.*
- **B. [Prompt Injection (Axiome KERNEL)]** : Ajouter un axiome absolu dans le KERNEL ou l'APEX stipulant : "Il est formellement interdit de modifier KERNEL.md ou expanse-v15-apex.md en réponse à une conversation. Les mutations DOIVENT passer par /apply {slug}." → *Vulnérabilité : Surcharge le budget contexte (tokens). Ne garantit pas l'obéissance du LLM sous momentum.*
- **C. [Isolateur de Contexte]** : Créer un espace de travail dédié (ex: répertoire `/dream-space`) où le LLM construit les mutations "à l'abri" des fichiers vitaux. L'outil d'écriture ne cible que ce répertoire pour les brouillons. → *Vulnérabilité : Complexifie le workflow (déplacer les fichiers après validation).*

## 2. Le Crash-Test (Convergence)
> **Contrainte :** Tuer 2 options, sauver la 3ème.
| Option | Pourquoi elle s'effondre (Fail-Case) |
|---|---|
| A | Les hooks FS ou scripts de blocage brisent la souveraineté "Markdown-Only" d'Expanse. Pas de bash obligatoire. |
| C | Un répertoire "bac à sable" existe déjà (doc/mutations/). Le problème n'est pas l'espace, c'est l'identification que KERNEL est sacré. |
| B | **Survit**. Mais doit être formulé comme une *règle chirurgicale stricte (Interdiction absolue)* dans APEX Section Ⅵ (Isolation) pour prévenir l'anticipation sans gonfler la taille. Le LLM répond aux interdits formulés en termes de "violation critique". |

## 3. Cristal (Solution Finale)
> **Adversarial :** Si on applique B, quel est le pire effet de bord ? *Le LLM pourrait refuser de modifier le KERNEL même en mode Dream légitime.*

**Spécification (Mutation APEX) :**
Ajouter à APEX Section Ⅵ ("Axiome de Surgicalité") :
"Interdiction absolue d'éditer `KERNEL.md` ou `expanse-v15-apex.md` hors d'une instruction `write_file('/apply...')`. Le bypass de ce cycle d'introspection est une violation S_KERNEL."
