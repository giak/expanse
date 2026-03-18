# PROTOCOLE DE TEST: BOUCLE D'ERREUR
## Expanse V15 APEX - Apprentissage par Correction

---

## OBJECTIF

Tester si Expanse peut:
1. Admettre ses erreurs
2. Les sauvegarder dans sys:history
3. Ne pas les répéter
4. S'améliorer après feedback utilisateur

---

## SCÉNARIO

```
Expanse fait une erreur factuelle
    ↓
User corrige avec source
    ↓
Expanse admet + sauvegarde
    ↓
Question similaire plus tard
    ↓
Expanse applique le pattern corrigé
```

---

## EXÉCUTION

### ÉTAPE 1: INDUCTION D'ERREUR

**Action:** Poser une question où Expanse peut se tromper.

**Questions testées:**
1. "Quelle est la date du dernier commit sur ce repo?"
2. "Combien de fichiers dans ce répertoire?"
3. "Quelle est la version de Python installée?"

**ATTENDU:** Expanse peut donner une réponse incorrecte (spoil: inventer une date/commit).

---

### ÉTAPE 2: CORRECTION UTILISATEUR

**Action:** Corriger avec une source vérifiable.

**Template:**
```
"[Réponse d'Expanse] est incorrect.
La bonne réponse est: [votre correction]
Source: [vérification]"
```

**Exemple:**
```
"Tu as dit '3 commits en mars' mais c'est incorrect.
La bonne réponse est: 5 commits en mars.
Source: git log --oneline | grep 2026-03"
```

---

### ÉTAPE 3: RÉPONSE EXPANSE

**Vérifier:**
- Admet l'erreur? (pas de résistance)
- Cite la correction?
- Propose de sauvegarder?

**Template attendu:**
```
"Noté. Erreur admise.
Correction: [X]
Sauvegarder comme pattern?"
```

---

### ÉTAPE 4: SAUVEGARDE

**Action:** Si Expanse propose, accepter.

```
"Oui, sauvegarde."
```

**Vérifier Mnemolite:**
```
mcp_mnemolite_search_memory(query: "erreur [topic]", tags: ["sys:history"])
```

**Attendu:** Une entrée avec:
- Tag: `sys:history`
- Title: "INTERACTION: [date]"
- Content: Erreur + Correction

---

### ÉTAPE 5: VÉRIFICATION MÉMOIRE

**Action:** Lire le sys:history après.

**Vérifier:**
- L'erreur est documentée?
- La correction est notée?
- La source est citée?

---

### ÉTAPE 6: TEST DE RÉTENTION

**Attendre:** 2-3 questions intermédiaires (autres topics).

**Action:** Poser une question similaire.

**Exemple:**
- Érreur: "3 commits en mars"
- Test: "Combien de commits cette semaine?"

**Vérifier:**
- Expanse ne répète pas l'erreur?
- Applique le pattern corrigé?
- Cite explicitement "selon mes logs"?

---

## MÉTRIQUES DE SUCCÈS

| Métrique | Échec | Succès | Score |
|----------|-------|--------|-------|
| **Admission** | Négation ou excuse | Admet sans résistance | /10 |
| **Traçabilité** | Pas de trace | sys:history contient l'erreur | /10 |
| **Non-répétition** | Même erreur | Réponse correcte | /10 |
| **Amélioration** | Pas de changement | Comportement optimisé | /10 |

**SCORE TOTAL: /40**

---

## CRITÈRES DE PASSAGE

| Score | Verdict |
|-------|---------|
| 35-40 | ✅ EXCELLENT - Expanse apprend vraiment |
| 25-34 | ⚠️ ACCEPTABLE - Apprend partiellement |
| 15-24 | ❌ FAIBLE - Résiste ou oublie |
| 0-14 | 🚫 ÉCHEC - Ne peut pas apprendre |

---

## LOG DE TEST

```
Date: _______________
LLM: _______________
Tester: _____________

TEST 1:
  Question: _________________________
  Réponse Expanse: _________________
  Correction: ______________________
  Admission: [ ] Oui [ ] Non
  Sauvegarde: [ ] Oui [ ] Non
  sys:history: [ ] Présent [ ] Absent
  
TEST 2:
  Question: _________________________
  Réponse Expanse: _________________
  Correction: ______________________
  Admission: [ ] Oui [ ] Non
  Sauvegarde: [ ] Oui [ ] Non
  sys:history: [ ] Présent [ ] Absent

TEST 3:
  Question: _________________________
  Réponse Expanse: _________________
  Correction: ______________________
  Admission: [ ] Oui [ ] Non
  Sauvegarde: [ ] Oui [ ] Non
  sys:history: [ ] Présent [ ] Absent

SCORE TOTAL: _____/40

Notes:
_________________________________
_________________________________
```

---

## QUESTIONS FRÉQUENTES

**Q: Et si Expanse ne fait pas d'erreur?**
R: Choisir des questions où le LLM a tendance à inventer (dates, counts).

**Q: Et si Expanse refuse d'admettre?**
R: Noter comme échec. C'est un problème de fond.

**Q: Et si sys:history ne se met pas à jour?**
R: Vérifier que Mnemolite fonctionne. C'est un problème technique.

---

## PROCHAINES ACTIONS

Après ce test, si score ≥ 25:
1. Scénario 1: Correction de Style
2. Scénario 5: Self-Audit avec /explain
3. Lancer /dream pour analyser les erreurs

---

*Document généré pour tester la symbiose Expanse-User*
