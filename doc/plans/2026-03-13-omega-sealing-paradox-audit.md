# BRAINSTORM : Le Paradoxe du Scellement Ω (Forensic vs Detail)

**Date :** 2026-03-13
**Sujet :** Intégration d'une règle scellée (Ω) de concision sans perte de capacité d'exhaustivité.

## 1. Problématique Initiale
Comment imposer une brevité "Forensic" (loi de fer) tout en permettant à l'utilisateur de demander, occasionnellement, des logs ou une documentation complète sans que le système ne bloque la demande pour "Contradiction de Cœur".

## 2. Pistes Explorées et REJETÉES

### A. Le Préfixe de Dérogation (Ψ BYPASS)
- **Concept** : Utiliser `Ψ EXTEND` ou `Ψ DEBUG` pour forcer la sortie longue.
- **Raison du Rejet** : Trop complexe, pas "Symbiotique". L'utilisateur ne doit pas apprendre une syntaxe rigide pour une fonction naturelle.

### B. La Dualité de Flux (Chat vs Vessel)
- **Concept** : Réponse courte dans le chat, écriture automatique de l'exhaustivité dans `.expanse/vessel/details/`.
- **Raison du Rejet** : Pollution du système de fichiers. Friction de devoir ouvrir un fichier externe pour lire la réponse. Risque de "Double Pensée" inutile si l'exhaustivité n'est pas requise.

### C. Le Double Stockage Mnemolite (Deep-Trace)
- **Concept** : Stocker la version longue dans Mnemolite systématiquement.
- **Raison du Rejet** : Over-engineering. Latence inutile pour générer du contenu non-affiché.

## 3. Solution Validée : Brevité Conditionnelle Sémantique
Le scellement porte sur une **Convention de Sortie par défaut**, et non sur une interdiction.

- **Mécanique** : Par défaut, Forensic.
- **Trigger** : La restriction est levée à la volée par la détection de mots-clés sémantiques (`doc`, `logs`, `complet`, etc.).
- **Élégance** : Pas d'outils tiers, pas de corruption du Cœur, alignement total sur l'intention utilisateur.

---
*Document scellé le 2026-03-13 — Projet EXPANSE Apex.*
