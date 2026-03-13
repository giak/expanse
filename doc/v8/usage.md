# EXPANSE V8.0 — Usage

> **Version**: 8.0.0
> **Type**: Guide d'utilisation

---

## 1. Démarrage Rapide

### 1.1 Générer le Contexte

```bash
cd ~/projects/expanse
python3 scripts/boot_expanse.py
```

### 1.2 Entrer la Question

```
[HUMAIN] Entrez votre premier prompt:
> Mon problème de CORS sur route.ts
```

### 1.3 Utiliser le Prompt

Le script génère `.expanse/compiled_boot.md`. Copier le contenu dans l'IDE.

---

## 2. Exemples d'Usage

### 2.1 Résoudre un Bug

```
Input: "J'ai une erreur CORS sur ma route API"
Output: [Pattern CORS injecté] → Réponse directe avec solution
```

### 2.2 Reprendre un Projet

```
Input: "On en était où sur l'auth ?"
Output: [Nexus injecté] → Resume du contexte projet
```

### 2.3 Nouvelle Fonctionnalité

```
Input: "Ajoute un endpoint pour les users"
Output: → Implémentation directe
```

### 2.4 Question sur la Stack

```
Input: "Comment faire du SSR avec Next.js ?"
Output: [Profile checké] → Réponse adaptée à VIM + TS
```

---

## 3. Commandes Utilisateur

### 3.1 Boot

```bash
# Boot standard
python3 scripts/boot_expanse.py

# Boot avec input direct
echo "Mon bug CORS" | python3 scripts/boot_expanse.py
```

### 3.2 Interaction

| Action | Commande |
|--------|----------|
| Poser une question | Direct dans l'IDE |
| Demander du code | "Écris une fonction..." |
| Demander une explication | "Explique-moi..." |
| Demander un debug | "J'ai l'erreur X..." |

---

## 4. Comportement Attendu

### 4.1 Réponse

| Attendu | Non Attendu |
|---------|-------------|
| Premier token: `Ψ` | "Bonjour," |
| Réponse directe | "Je vais chercher..." |
| Style concis | Paragraphes de blabla |
| Utilise les Patterns | Ignore le contexte |

### 4.2 Après Résolution de Bug

Quand un bug est résolu, EXPANSE doit:

1. **Identifier** que c'était un bug complexe
2. **Appeler** `mcp_mnemolite_write_memory`
3. **Formater** selon le format Ω_FORGE

---

## 5. Les Drapeaux

### 5.1 Flags de Réponse

| Flag | Signification |
|------|---------------|
| [V] | Vérifié vrai |
| [U] | Non vérifié |
| [F] | Faux |

### 5.2 Flags de Mémoire

| Flag | Signification |
|------|---------------|
| [LOST] | Info manquante |
| [INCOMPLETE] | Donnée incomplète |

---

## 6. Mise à Jour du Nexus

### 6.1 Quand Mettre à Jour

- Une tâche est terminée
- Une décision architecturale est prise
- Le contexte change significativement

### 6.2 Comment Mettre à Jour

EXPANSE utilise `multi_replace_file_content` automatiquement.

Exemple de mise à jour:

```markdown
## CONTEXTE IMMÉDIAT
- En cours: Auth Clerk
- Terminé: Setup projet

## PROCHAINE ÉTAPE
- Implémenter middleware
```

---

## 7. Patterns Connus

### 7.1 Pattern CORS Next.js

```
SITUATION: API Route rejette CORS
CAUSE: Pas de handler OPTIONS
RESOLUTION: export async function OPTIONS()
```

### 7.2 Pattern Docker

```
SITUATION: Container ne démarre pas
CAUSE: Variable d'environnement manquante
RESOLUTION: Vérifier docker-compose.yml
```

---

## 8. Troubleshooting

### 8.1 "J'ai rien demandé, pourquoi il répond ça?"

**Cause:** Le pattern injecté n'était pas pertinent.

**Solution:** Le système doit filtrer. Vérifier le seuil dans `boot_expanse.py`.

### 8.2 "Il ne se souvient de rien"

**Cause:** Mnemolite vide ou Nexus corrompu.

**Solution:**
1. Vérifier Mnemolite: `search_memory(query="test")`
2. Vérifier Nexus: `cat .expanse/psi_nexus.md`

### 8.3 "Il me demande confirmation à chaque fois"

**Cause:** Prompt pas assez directif.

**Solution:** Le prompt V8.1 dit "Réponds DIRECTEMENT".

---

## 9. Workflow Complet

```
┌─────────────────────────────────────────────────────────┐
│ 1. USER: Question                                       │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 2. SCRIPT: Compile contexte                             │
│    - USER_ANCHOR (Mnemolite)                            │
│    - PSI_NEXUS (Fichier)                                │
│    - M_PATTERN (Mnemolite)                              │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 3. LLM: Répond avec ΣΨΦΩΜ                              │
│    - Lit le contexte injecté                            │
│    - Analyze                                            │
│    - Vérifie (Φ)                                        │
│    - Répond (Ω)                                        │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 4. SI bug résolu:                                       │
│    - Ω_FORGE → write_memory (M_PATTERN)                 │
│    - Update Nexus                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 10. Résumé

| Action | Commande/Action |
|--------|-----------------|
| Démarrer | `python3 scripts/boot_expanse.py` |
| Copier | Contenu de `compiled_boot.md` |
| Poser une question | Direct dans l'IDE |
| Bug résolu | Auto-cristallisation |
| Vérifier Nexus | `cat .expanse/psi_nexus.md` |
