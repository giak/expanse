# [BRM] Brainstorm: Tool Failure (BOOT) - target content cannot be empty
Trace UUID: 669a935b
Symptom: Répétition de l'erreur "target content cannot be empty" sur des blocs multi-lignes. Indique une friction entre la perception du fichier (Σ) et l'outil de modification (Φ).

## 1. Divergence (Force Brute)
> **Objectif :** 3 angles d'attaque incompatibles.
- **A. [Modification Outil]** : Rendre l'outil `replace_file_content` plus tolérant aux espaces/indentations en utilisant des expressions régulières souples. → *Vulnérabilité : Trop complexe, risque de remplacer le mauvais bloc si la regex est trop permissive (violation de surgicalité).*
- **B. [Protocole de Lecture Préalable]** : Forcer une étape `view_file` stricte avec récupération exacte des lignes (StartLine/EndLine) avant toute tentative de mutation, et interdire le remplacement "à l'aveugle". → *Vulnérabilité : Ajoute une étape systématique (coût token/latence).*
- **C. [Granularité L1]** : Interdire le remplacement de gros blocs multi-lignes. Imposer le remplacement ligne par ligne (ou petite grappe) via `multi_replace_file_content` systématiquement pour les gros diffs. → *Vulnérabilité : Fastidieux pour le LLM de spécifier chaque ligne.*

## 2. Le Crash-Test (Convergence)
> **Contrainte :** Tuer 2 options, sauver la 3ème.
| Option | Pourquoi elle s'effondre (Fail-Case) |
|---|---|
| A | Modifier l'outil de l'IDE n'est pas dans le périmètre d'Expanse (qui est un OS cognitif, pas le développeur de l'IDE). |
| C | Remplacer ligne par ligne va épuiser la fenêtre de contexte et générer des erreurs de syntaxe par perte de vue globale. |
| B | **Survit**. Expanse doit internaliser que sa perception (Σ) est imparfaite. Le seul moyen d'avoir la chaîne exacte (TargetContent) est de l'extraire du système de fichiers juste avant la frappe (Φ). La latence est le prix de la précision. |

## 3. Cristal (Solution Finale)
> **Adversarial :** Si on applique B, quel est le pire effet de bord ? *Une augmentation mineure du temps d'exécution (1 tool call `view_file` suppplémentaire) pour chaque modification majeure.*

**Spécification (Mutation APEX) :**
Ajouter une règle dans APEX Section Ⅵ (Isolation) :
"Avant toute modification de fichier (`replace_file_content`), exécuter obligatoirement `view_file` sur la zone cible pour extraire la chaîne `TargetContent` au caractère près. Ne jamais deviner l'indentation."
