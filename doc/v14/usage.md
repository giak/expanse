# EXPANSE V14 — Usage

> **Version**: 14.2.0
> **Type**: Guide d'utilisation
> **Attention**: Le boot `[V14 ACTIVE]` arrive actuellement en fin de réponse (bug).

---

## 1. Installation

### 1.1 Charger le System Prompt

1. Copier `prompts/expanse-v14-catalyst.md`
2. Coller dans les instructions système d'OpenCode

### 1.2 Premier Boot

Au premier lancement:
- Expanse vérifie les fichiers nexus
- Il同步 si nécessaire
- Il annonce `[V14 ACTIVE]`

---

## 2. Usage Quotidien

### 2.1 Nouvelle Session

```
Input: "Salut, on reprend"
Output: Ψ. [V14 ACTIVE]. Recherche mémoire... Prêt.
```

### 2.2 L1 — Code Simple

```
Input: "Convertis en arrow function"
Output: Ψ. [Code modifié]
```

### 2.3 L2 — Refactoring

```
Input: "Refactore le module auth"
Output: Ψ. Proposition: [code]. Note: Cette approche change X.
```

### 2.4 L3 — Stratégique

```
Input: "Quelle structure juridique ?"
Output: Ψ. Audit L3. Triangulation en cours...
- Historique: ...
- Documentation: ...
- Web: ...
Confiance: 75%. Sources: [liens].
```

---

## 3. Les Commandes

### 3.1 Ψ SEAL

Pour sceller un pattern:

```
Input: "Sauvegarde cette approche comme loi"
Output: Ψ. Je scelle ce pattern. [Ψ SEAL] : Migré vers sys:core
```

### 3.2 Question Philosophique

Si contradiction avec axiome:

```
Input: "On change tout"
Output: Ψ. Blocage. Cette décision contredit l'axiome [X]. 
Est-ce une Evolution ou une Erreur ?
```

---

## 4. Le Feedback

### 4.1 Messages Clés

| Message | Signification |
|---------|---------------|
| `[V14 ACTIVE]` | Boot réussi |
| `Confiance: XX%` | Score de triangulation |
| `[Ψ SEAL]` | Pattern scellé |
| `[BLOCK]` | Contradiction détectée |

### 4.2 Ce qui se passe

1. **Boot**: Il cherche sys:core + sys:anchor + nexus
2. **Input**: Il évalue L1/L2/L3
3. **L3**: Il fait triangule + audit
4. **Résolution**: Il agit + save si applicable

---

## 5. Troubleshooting

### 5.1 "Il me demande de sync"

C'est normal. Il a détecté un gap entre les versions.
Valide et il synchronise.

### 5.2 "Il ne détecte pas L3"

Vérifie que ton input contient des éléments stratégiques:
- Décisions irréversibles
- Argent/Juridique
- Architecture cœur

### 5.3 "Il ne seal pas"

Le seal nécessite:
- Pattern répété (n≥3)
- OU confirmation explicite

---

## 6. Workflow Complet

```
┌─────────────────────────────────────────────────────────┐
│ Session Start                                           │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ Boot: search_memory + view nexus                         │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ Sensorialité: Évalue L1 / L2 / L3                       │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ L1 → Exécution directe                                  │
│ L2 → Exécution + Brief                                  │
│ L3 → Triangulation + Preuve + Confirmation              │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ Resolution + save (si applicable)                        │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Résumé

| Niveau | Action | Justification |
|--------|--------|---------------|
| L1 | Directe | Non |
| L2 | + Brief | Courte |
| L3 | + Audit | Complète + Preuve |
