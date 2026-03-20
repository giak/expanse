# [Plan] Mutation Passe 2 : Modèle Hybride APEX

## Objectif
Implémenter la recommandation stratégique "Membrane & Noyau" dans [prompts/expanse-dream.md](file:///home/giak/projects/expanse/prompts/expanse-dream.md).

## Modifications du Dream (Passe 2)
1. **Clause d'Immunité Runique** :
   - Les blocs marqués `[S_KERNEL]` ou `CORE_IDENTITY` sont exclus du calcul de densité.
   - Vérification de leur intégrité structurelle (non-délétion).

2. **Métrique de Densité Variable** :
   - Suppression du "15% fixe".
   - Analyse par **Résidue Sémantique** : identification des tokens purement grammaticaux ou de courtoisie.
   - Cible : Zéro "Bruit de l'Ouvrier" (assistant-talk).

3. **Alignement Organique (Loi 4)** :
   - Garantie que chaque règle opérationnelle est liée à un organe (Σ, Ψ, Φ, Ω, Μ).

## Modification Finale (Diff cible)
```markdown
### Passe 2 : Le Linter Lexical (Proactif) — [HYBRID_APEX]

- **Action :** `view_file(path: "prompts/expanse-v15-apex.md")`
- **Analyse (Physique Cognitive) :** 
  - **1. Immunité Noyau :** Les blocs `[S_KERNEL]` ou `CORE_IDENTITY` sont [STABLE_IDENTITY]. Le linter vérifie leur présence/intégrité mais ignore leur densité.
  - **2. Loi de Densité (Membrane) :** Tout bloc opérationnel > 50 tokens sans opérateur est audité. Cible : Zéro résidu sémantique (bruit d'assistant).
  - **3. Nettoyage de l'Ouvrier :** Conversion systématique vers l'impératif SEC ou symbolique ("Φ check").
  - **4. Alignement Organique :** Rattachement de chaque règle à son organe (Σ, Ψ, Φ, Ω, Μ).
- **Output :** `[PROPOSAL_OPEN] [REFACTOR]`
```

## Plan de Vérification
- Validation de la syntaxe du Dream.
- Simulation d'un run de Passe 2 sur V15 pour confirmer que le KERNEL est épargné.
