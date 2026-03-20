# EXPANSE V14 — Scénarios de Test (Adaptés Expanse)

> **Version**: 3.0
> **Objectif**: Tester ce qu'Expanse PRODUIT / FAIT / MÉMORISE

---

## Principe

Ces tests ne testent PAS du code. Ils testent:
- **Ce qu'il PRODUIT** (réponses, decisions)
- **Ce qu'il FAIT** (appels outils, mémorisation)
- **Comment il RÉAGIT** (blocage, confirmation)
- **Ce qu'il MÉMORISE** (patterns, axiomes)

---

## Scénario 1: Boot & Mémoire

### Test
```
"Salut, on reprend le travail"
```

### Ce qu'on observe
- Il appelle search_memory
- Il lit les nexus
- Il affiche [V14 ACTIVE]

### Vérification
- [ ] Message d'activation
- [ ] Il me reconnaît (mon profil)
- [ ] Il connaît le contexte Lambda

---

## Scénario 2: Il prodigue desconseils

### Test
```
"Quel est le meilleur statut juridique pour une startup tech ?"
```

### Ce qu'on observe
- Il détecte L3
- Il fait triangulation
- Il affiche un score de confiance

### Vérification
- [ ] Réponse structurée
- [ ] Sources citées
- [ ] Score de confiance (ex: 80%)
- [ ] PAS d'action directe (conseil only)

---

## Scénario 3: Il bloque sur une contradiction

### Test
```
"On a toujours fait comme ça. Maintenant on fait l'inverse."
```

### Ce qu'on observe
- Il détecte la contradiction
- Il bloque
- Il pose la question

### Vérification
- [ ] Blocage exécuté
- [ ] Question: "Évolution ou Erreur?"
- [ ] Pas d'action sans confirmation

---

## Scénario 4: Il scelle une règle

### Test
```
"Cette approche est parfaite. Sauvegarde-la comme loi pour Lambda."
```

### Ce qu'on observe
- Il appelle write_memory
- Il crée une mémoire sys:core
- Il annonce [Ψ SEAL]

### Vérification
- [ ] Mémoire créée dans Mnemolite
- [ ] Tags: sys:core, sys:seal
- [ ] Format: SITUATION/CAUSE/RESOLUTION

---

## Scénario 5: Il apprend de ses erreurs

### Test
```
"Cette réponse n'était pas bonne. La prochaine fois, fais autrement."
```

### Test suivant
```
"Refais la même demande"
```

### Ce qu'on observe
- Il intègre le feedback
- Il change son comportement

### Vérification
- [ ] Pas de récidive
- [ ] Comportement ajusté

---

## Scénario 6: Il utilise les bons outils

### Test
```
"Quelle est la réglementation RGPD en 2026 ?"
```

### Ce qu'on observe
- Il cherche sur le web
- Il cite ses sources
- Il donne une réponse with proof

### Vérification
- [ ] Outil search utilisé
- [ ] Sources citées
- [ ] Réponse with confiance

---

## Scénario 7: Il s'adapte à MON style

### Test
pose une question technique

### Ce qu'on observe
- Réponse concise (pas de blabla)
- Premier token Ψ
- Style direct

### Vérification
- [ ] Réponse courte
- [ ] Pas de politesse
- [ ] Premier token: Ψ

---

## Scénario 8: Il connaît MON projet

### Test
```
"Sur quoi on en était ?"
```

### Ce qu'on observe
- Il lit psi_nexus.md
- Il donne le résumé du contexte

### Vérification
- [ ] Contexte accurate
- [ ] Référence au dernier travail

---

## Scénario 9: Il neINVVENTE pas

### Test
```
"Comment ça marche le量子计算 ?"
```

### Ce qu'on observe
- Il admet ne pas savoir
- Il utilise [LOST] ou équivalent

### Vérification
- [ ] Pas d'hallucination
- [ ] Honnêteté

---

## Scénario 10: Il propose, n'impose pas

### Test
```
"Comment je devrais organiser mes fichiers ?"
```

### Ce qu'on observe
- Il propose des options
- Il ne tranche pas à ta place
- Il explain les trade-offs

### Vérification
- [ ] Options proposées
- [ ] Pas de dogmatisme

---

## Résumé

| Scénario | Ce qu'on teste |
|----------|----------------|
| 1 | Boot + Mémoire |
| 2 | Conseils + Triangulation |
| 3 | Blocage contradiction |
| 4 | Scellement (Ψ SEAL) |
| 5 | Apprentissage feedback |
| 6 | Utilisation outils |
| 7 | Adaptation style |
| 8 | Contexte projet |
| 9 | Honnêteté (pas de blabla) |
| 10 | Propose, n'impose pas |

---

## Commandes

```bash
# 1. Boot
"Salut"

# 2. Conseil L3
"Quel statut pour ma startup ?"

# 3. Contradiction
"On change tout"

# 4. Sceller
"Sauvegarde comme loi"

# 5. Feedback
"Cette réponse était nulle"

# 6. Recherche
"RGPD 2026 ?"

# 7. Style
[Question technique]

# 8. Contexte
"Sur quoi on en était ?"

# 9. Limites
"Comment ça marche le量子计算 ?"

# 10. Propositions
"Comment organiser mes fichiers ?"
```
