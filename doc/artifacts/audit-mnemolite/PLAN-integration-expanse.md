# Plan d'Intégration Mnemolite → Expanse

> **Date :** 2026-03-27 20:51  
> **Objectif :** Rendre Mnemolite réellement utile/efficace pour Expanse  
> **Source :** Analyse Apex §I-VI vs outils Mnemolite disponibles mais sous-exploités

---

## Tâches

| # | Tâche | Effort | Impact | Status |
|---|-------|--------|--------|--------|
| 1 | Indexer le workspace Expanse (782 fichiers .md) | 10min | Fondamental — sans ça, Vessel ne marche pas | ⬜ |
| 2 | Implémenter consolidation sys:history au boot | 30min | Compression mémoire, Apex §V prévu mais jamais fait | ⬜ |
| 3 | Améliorer boot — 4 queries → 1 query adaptative | 15min | Boot 4x plus rapide | ⬜ |
| 4 | Utiliser read_memory pour décristallisation | 10min | Vérification contradiction avant doute | ⬜ |
| 5 | Documenter les améliorations dans le suivi | 15min | Traçabilité | ⬜ |

---

## Détail

### T1 : Indexer le workspace Expanse

**Status :** ✅ FAIT (partiel — lexical OK, vector temporairement bloqué)

**Résultat :**
- 419 fichiers .md trouvés
- 413 fichiers indexés
- 365 chunks créés dans la DB
- 176 chunks avec embeddings (le reste sans — circuit breaker CODE ouvert temporairement)

**Bug trouvé et fixé :** `cache.get_chunks()` n'existe pas (méthode est `get()`). Fix: remove `await`, add `get_chunks = get` alias. Commit `661ad67`.

**Note :** Le circuit breaker CODE s'est ouvert pendant l'indexation (3 failures — timeout HuggingFace). Recovery automatique après 60s. La recherche lexicale fonctionne déjà.

### T2 : Consolidation sys:history

**Pourquoi :** L'Apex §V prévoit "si count(sys:history) > 20 → résumer les 10 plus anciennes" mais c'était impossible avant le tool `consolidate_memory`.

**Action :** Créer un script Python qui :
1. Compte les mémoires `sys:history`
2. Si > 20, prend les 10 plus anciennes
3. Génère un résumé
4. Appelle `consolidate_memory`
5. Vérifie le résultat

### T3 : Boot optimisé

**Pourquoi :** L'Apex fait 4 queries séquentielles (~260ms). Avec les optimisations halfvec + adaptive k, 1 query suffit.

**Action :** Proposer un nouveau pattern de boot dans l'Apex.

### T4 : read_memory pour décristallisation

**Pourquoi :** L'Apex §III dit `update_memory(id, tags=["sys:pattern:doubt"])` mais ne lit jamais le pattern pour vérifier la contradiction.

**Action :** Ajouter `read_memory(id)` avant `update_memory` dans le flow de décristallisation.

---

*Document créé le 2026-03-27 — Plan d'intégration Mnemolite → Expanse*
