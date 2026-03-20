# EXPANSE V8.0 — Setup

> **Version**: 8.0.0
> **Type**: Guide d'installation

---

## 1. Prérequis

| Prérequis | Version | Usage |
|-----------|---------|-------|
| Python | 3.10+ | Script lanceur |
| Mnemolite | Latest | Vector DB |
| Git | Latest | Contrôle de version |

---

## 2. Installation Mnemolite

### 2.1 Clone et Setup

```bash
# Clone Mnemolite
git clone https://github.com/anomalyco/mnemolite.git
cd mnemolite

# Configuration
cp .env.example .env
# Editer .env avec les valeurs nécessaires

# Lancement
docker-compose up -d
```

### 2.2 Vérification

```bash
docker ps | grep mnemolite
```

---

## 3. Installation EXPANSE

### 3.1 Clone

```bash
git clone https://github.com/giak/expanse.git
cd expanse
```

### 3.2 Structure

```
expanse/
├── .expanse/
│   ├── psi_nexus.md        # Mémoire projet (créé au premier boot)
│   └── compiled_boot.md    # Prompt compilé (généré)
├── scripts/
│   └── boot_expanse.py     # Lanceur
├── prompts/
│   └── expanse-system-v8.md # KERNEL
├── doc/v8/
│   └── (documentation)
└── ...
```

### 3.3 Permissions

```bash
chmod +x scripts/boot_expanse.py
```

---

## 4. Configuration

### 4.1 Variables d'Environnement

Créer un fichier `.env` à la racine:

```bash
# Mnemolite (optionnel si mnemolite est en local)
MNEMOLITE_HOST=localhost
MNEMOLITE_PORT=6333

# Projet
PROJECT_NAME=expanse
```

### 4.2 Chemins

Le script utilise des chemins relatifs. Assurez-vous d'être dans le répertoire `expanse` pour lancer le script.

---

## 5. Premier Boot

### 5.1 Créer le Profile Utilisateur

```python
# Via Mnemolite (outil write_memory)
{
    "title": "[USER_ANCHOR] Profil Giak",
    "content": "Utilise VIM. Déteste la verbosité. Stack: Rust, TS, Next.js.",
    "tags": ["sys:anchor", "giak", "preferences"],
    "memory_type": "reference"
}
```

### 5.2 Créer le Nexus

```bash
mkdir -p .expanse
```

Créer `.expanse/psi_nexus.md`:

```markdown
# PSI_NEXUS : EXPANSE
## CONTEXTE IMMÉDIAT
- Projet initialisé

## PROCHAINE ÉTAPE
- Commencer à travailler
```

### 5.3 Lancer le Script

```bash
python3 scripts/boot_expanse.py
```

---

## 6. Utilisation

### 6.1 Workflow Standard

```bash
# 1. Lancer le script
python3 scripts/boot_expanse.py

# 2. Entrer votre question
# > Comment configurer Docker ?

# 3. Le script génère .expanse/compiled_boot.md

# 4. Copier le contenu dans l'IDE

# 5. Travailler normalement
```

### 6.2 Dans l'IDE (Cline/Roo-Code)

1. Nouvelle session / Nouveau chat
2. Coller le contenu de `compiled_boot.md`
3. Commencer à travailler

---

## 7. Dépannage

### 7.1 Mnemolite Non Accessible

```bash
# Vérifier que le service tourne
docker ps | grep mnemolite

# Redémarrer si nécessaire
docker-compose restart
```

### 7.2 Erreur de Script

```bash
# Vérifier Python
python3 --version

# Vérifier les dépendances
pip3 install -r requirements.txt
```

### 7.3 Contexte Vide

Vérifier que Mnemolite contient bien le profile:

```python
search_memory(
    query="giak",
    tags=["sys:anchor"]
)
```

---

## 8. Configuration Avancée

### 8.1 Modifier le Seuil de Pertinence

Dans `scripts/boot_expanse.py`:

```python
# Line ~100
if similarity_score < 0.3:  # Augmenter pour plus de filtrage
    return "> [EMERGENT_PATTERNS]: Aucune résonance pertinente."
```

### 8.2 Changer le Nom du Nexus

Modifier la variable `nexus_path`:

```python
nexus_path = os.path.join(os.getcwd(), ".expanse", "mon_nexus.md")
```

---

## 9. Résumé des Commandes

| Commande | Description |
|----------|-------------|
| `python3 scripts/boot_expanse.py` | Générer le contexte |
| `cat .expanse/compiled_boot.md` | Voir le prompt compilé |
| `docker-compose -f mnemolite/docker-compose.yml up` | Démarrer Mnemolite |

---

## 10. Check List

- [ ] Mnemolite installé et fonctionnel
- [ ] EXPANSE cloné
- [ ] Script exécutable
- [ ] Profile utilisateur créé
- [ ] Nexus initialisé
- [ ] Premier boot testé
