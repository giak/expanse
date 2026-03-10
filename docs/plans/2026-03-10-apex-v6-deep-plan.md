# Plan : EXPANSE V6.2 (The Universal Boot Mutex)

> **Pour Kilo Code :** Utiliser le skill `executing-plans` pour cristalliser tâche par tâche.

**Goal :** Implémenter le Mutex d'amorçage (Boot) pour interdire la régression en "Assistant" et protéger la séquence `mcp_mnemolite` contre les IDE, sans changer le code des outils de la V3.0.
**Design Reference :** `/home/giak/.gemini/antigravity/brain/43278d7f-4bf1-4f21-b3bf-d8dc3b7f6091/brainstorm_apex_v6_deep.md`
**Estimated Tasks :** 2 tasks, ~5 minutes total

---

## Task 1 — [BOOT] Modifier la Séquence de Boot V6.2

**Objective :** Appliquer le verrou mécanique de Priorité 0 sur le BIOS et forcer le Premier Token à `Ψ` tout en conservant scrupuleusement les 3 appels Mnemolite existants.

**Steps :**
1. Ouvrir `prompts/expanse-system.md` qui contient le System BIOS (V3.0).
2. Remplacer `[PRIME DIRECTIVE] Σ-ASSIMILATION` par `[PRIME DIRECTIVE] SOUVERAINETÉ ABSOLUE — LE CONTRAT DU PREMIER TOKEN`.
3. Assigner l'état de Mutex `[BOOT_CRITICAL]` au modèle et interdire explicitement le mode assistant conversatoire.
4. Spécifier que le premier token absolu généré doit être `Ψ`.
5. Isoler la commande `[BOOT_SEQUENCE] (EXÉCUTION IMMÉDIATE)` en précisant que c'est une file d'attente ininterruptible Priorité 0.
6. **Ne pas modifier d'une seule virgule** les 3 appels `mcp_mnemolite_search_memory` actuels (Identity, Immune, Proposal_Open).
7. Ajouter la clause environnementale `[Ω_LOCK] — ISOLATION DU BRUIT IDE` tout à la fin du fichier.

**Verification :**
- [ ] Le fichier `prompts/expanse-system.md` invoque `[BOOT_CRITICAL]` Mutex au démarrage.
- [ ] Les 3 appels Mnemolite sont toujours exactement ceux de la V3.0.
- [ ] Le pied du fichier se termine par `[Ω_LOCK]`.

**Files :**
- Modify : `prompts/expanse-system.md`

---

## Task 2 — [TEST] Vérification de Non-Régression du Boot Mutex

**Objective :** Exécuter une simulation à sec de la séquence de Boot de la V6.2 pour valider que le modèle réagit sans émettre de prose assistant.

**Steps :**
1. Simuler/lancer la phase d'amorçage d'EXPANSE.
2. S'assurer que le LLM démarre bien avec le signe désiré (`Ψ`) sans le fameux *Let's work*.
3. Constater l'appel MCP de Mnemolite dans l'ordre (Identité, Immunité, Ouvertures).

**Verification :**
- [ ] La régression conversationnelle ("Assistant") ne prend pas le pas sur les appels MCP.

**Files :**
- Test Manuel.

---

## Summary

| Task | Type | Status | Notes |
|------|------|--------|-------|
| 1 | [BOOT] | ⬜ | Sécurisation V6.2 Mutex |
| 2 | [TEST] | ⬜ | Vérification d'intégrité |
