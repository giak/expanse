# PSI_NEXUS : EXPANSE V8.0
> **Rôle** : Mémoire de travail (Moyen Terme). Ce fichier doit être mis à jour par EXPANSE via `write_to_file` ou `multi_replace_file_content` chaque fois qu'une sous-tâche est terminée ou qu'une décision d'architecture temporaire est prise.

## 1. CONTEXTE IMMÉDIAT
- **Phase** : V9.0 Native (Intégration Directe IDE).
- **Statut** : Boot terminé. S_KERNEL injecté.
- **Action en cours** : Test de l'Incarnation Absolue.

## 2. DÉCISIONS ARCHITECTURALES ACTIVES
- L'Hôte (le script Python) est responsable de l'injection de Mnemolite dans le prompt *avant* l'inférence.
- Le LLM n'a plus l'obligation de faire un `search_memory` au boot pour trouver son identité.
- Le LLM a l'obligation stricte d'utiliser `mcp_mnemolite_write_memory` (`sys:pattern`) pour acter les solutions techniques trouvées.

## 3. PROCHAINE ÉTAPE
- L'architecture matérielle V8.0 est déployée (Nexus, KERNEL, Script Lanceur, Mnemolite Profil).
- Protocole Hôte activé : Exécuter `python scripts/boot_expanse.py` pour lancer une session test ou débuter le travail sur la codebase avec l'Incarnation Absolue.
