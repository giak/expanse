# Expanse - Règles annexes Projet

## ⚠️ RTK : Optimisation Token (OBLIGATOIRE)

**RTK (Rust Token Killer)** est un proxy CLI qui réduit la consommation de tokens de 60 à 90 % en compressant la sortie des commandes shell avant qu'elle n'atteigne le LLM.

### Règle fondamentale
**TOUJOURS préfixer les commandes shell avec `rtk`** quand tu utilises l'agent `basher` ou tout outil exécutant des commandes terminal.

```
❌ PROHIBÉ (commande brute dans le paramètre command) :
command: "ls -la src/"
command: "grep -r 'pattern' ."
command: "git status"
command: "cat fichier.json"
command: "find . -name '*.ts'"

✅ OBLIGATOIRE (préfixer avec rtk dans le paramètre command) :
command: "rtk ls src/"
command: "rtk grep -r 'pattern' ."
command: "rtk git status"
command: "rtk read fichier.json"
command: "rtk find . -name '*.ts'"
```

**Note :** RTK gère ses propres flags de formatage. Les flags d'affichage natifs (`-la`, `--color`) sont ignorés ou adaptés par RTK.

### Commandes RTK disponibles

| Commande native | Équivalent RTK | Économie typique |
|----------------|----------------|------------------|
| `ls` | `rtk ls` | 70-80% |
| `cat` | `rtk read` | 60-80% |
| `grep` | `rtk grep` | 80-95% |
| `git status/log/diff` | `rtk git status` | 70-90% |
| `find` | `rtk find` | 75-85% |
| `tree` | `rtk tree` | 80-90% |
| `docker logs/ps` | `rtk docker logs` | 85-95% |
| `curl` | `rtk curl` | 60-80% (auto JSON schema) |
| `npm/pnpm` | `rtk pnpm` | 60-70% |
| `cargo` | `rtk cargo` | 60-70% |
| `pytest/vitest` | `rtk pytest` / `rtk vitest` | 70-85% (failures only) |
| `tsc/mypy` | `rtk tsc` / `rtk mypy` | 70-80% (grouped errors) |

### Commandes meta RTK
- `rtk gain` : Afficher les économies totales de tokens
- `rtk gain --history` : Historique des commandes avec économies
- `rtk gain --graph` : Graphique ASCII sur 30 jours
- `rtk discover` : Trouver les économies manquées dans l'historique
- `rtk proxy <cmd>` : Exécuter la commande brute sans filtrage (debug uniquement)
- `rtk smart <cmd>` : Résumé technique en 2 lignes (heuristique)
- `rtk summary <cmd>` : Résumé heuristique de la sortie
- `rtk err <cmd>` : N'afficher que les erreurs/warnings

### Exceptions (PAS de préfixe rtk)
- Commandes avec effets de bord critiques : `git add`, `git commit`, `git push`, `npm install`, `pip install`, `mkdir`, `cp`, `mv`, `rm`
- Commandes interactives : `vim`, `htop`, `less`
- Commandes dont tu as besoin de la sortie complète non filtrée (rare, utiliser `rtk proxy <cmd>` si besoin)

### Pourquoi c'est important
Chaque token économisé = moins de contexte consommé = plus de capacité pour l'analyse réelle. Sur 2 450 commandes, RTK a déjà économisé **57.8M tokens (99.4%)**.

---

## ⚠️ ANTI-PATTERN — Appels tool `write()` (OBLIGATOIRE)

**JAMAIS appeler `write()` sans les DEUX paramètres `content` et `filePath`.**

```
❌ PROHIBÉ — ces appels RETOURNERONT UNE ERREUR :
write()
write(content="...")
write(filePath="...")

✅ OBLIGATOIRE — TOUJOURS les deux paramètres :
write(content="le texte complet ici", filePath="/chemin/vers/fichier.md")
```

**Règle de fer :**
- `content=` DOIT être une string non-vide (le texte complet du fichier)
- `filePath=` DOIT être un chemin absolu
- Si le texte est long (>1000 mots), le contenu va DANS `content=`, jamais ailleurs
- Si `content` est manquant → l'outil retourne une erreur → le pipeline est cassé
- RELIS ton appel `write()` AVANT de l'exécuter. Vérifie que `content=` et `filePath=` sont tous deux présents.

**Pattern d'échec connu :** L'LLM génère parfois `write()` comme placeholder puis oublie de remplir les paramètres. **TOUJOURS construire l'appel complet en une seule passe.**

### ⚠️ BUG DOCUMENTÉ — `write()` échoue silencieusement avec contenu long

**Symptôme :** `write()` retourne `"expected string, received undefined"` même quand `content=` et `filePath=` sont explicitement fournis. Les appels `bash()` avec commandes longues échouent aussi.

**Cause :** Quand le paramètre `content=` dépasse ~5000 caractères, la génération XML du LLM casse les valeurs de paramètres. Les balises sont produites mais VIDES — les valeurs ne sont pas émises. Ceci est un défaut de génération du LLM, pas de l'outil.

**Solution — STRATÉGIE WRITE+EDIT :**

```
ÉTAPE 1: write() avec première section seulement (≤3000 chars)
  write(content="# TITRE\n\n## §0 PREMIÈRE SECTION\n...", filePath="/chemin/fichier.md")

ÉTAPE 2: edit() pour ajouter chaque section suivante
  edit(oldString="dernière ligne existante", newString="dernière ligne\n\n## §1 SUITE\n...", filePath="/chemin/fichier.md")

ÉTAPE 3: Répéter edit() jusqu'au fichier complet
```

**Règles de la stratégie :**
1. **Segmenter** — découper le contenu en blocs de ≤3000 caractères
2. **Écrire le premier bloc** avec `write()` (titre + §0)
3. **Éditer pour le reste** — chaque `edit()` ajoute une section en remplaçant la dernière ligne
4. **`oldString`** = dernière ligne du fichier courant (unique pour éviter les doublons)
5. **`newString` = oldString + "\n\n" + nouveau contenu**
6. **Vérifier** après chaque `edit()` que le contenu est bien ajouté

**Exemple concret :**
```
# Étape 1 — base
write(content="# INVESTIGATION — Sujet\n\n## §0 RÉSUMÉ\nContenu...", filePath="/path/file.md")

# Étape 2 — ajouter §1
edit(filePath="/path/file.md",
     oldString="Contenu...",
     newString="Contenu...\n\n## §1 ANALYSIS\nSuite du contenu...")

# Étape 3 — ajouter §2
edit(filePath="/path/file.md",
     oldString="Suite du contenu...",
     newString="Suite du contenu...\n\n## §2 CLUSTERS\nEncore du contenu...")
```

**NE JAMAIS :** tenter un `write()` de >5000 caractères en une passe. Ça échouera et gaspillera des tours de conversation.
