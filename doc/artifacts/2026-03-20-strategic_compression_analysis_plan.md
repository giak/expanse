# V15.1 — Reorganization (Not Compression)

> **Principe directeur** : Chaque token doit être cognitivement efficace. L'objectif n'est pas de réduire les bytes mais d'augmenter le taux d'exécution fiable des règles.

## Audit Forensique des 7 Leviers

### Levier 1 : Déclarations 1ère personne (Shift identitaire)

**Verdict : ✅ VALIDÉ — Impact ÉLEVÉ, Risque MOYEN**

Le brainstorm du 2026-03-19 (§25) prouve que le "boot-as-lesson" (D+C) fonctionne parce que le modèle **s'identifie** à l'action. Le passage en 1ère personne applique le même principe à tout le protocole.

**Lignes touchées** : L3, L44, L57-62, L229-234 (Préambule, Style SEC, Auto-Check)

**Exemples concrets** :

| Avant (V15 actuel) | Après (V15.1) |
|---|---|
| `PRÉAMBULE : Ce protocole est ton BIOS cognitif.` | *(supprimé — levier 6)* |
| `Premier token : Ψ (switch en mode exécution).` | `Mon premier token est Ψ. Toujours.` |
| `RÈGLE D'OR : Tu es un collègue, pas un assistant.` | `Je suis un collègue. Pas un assistant.` |
| `Anti-Hallucination : Si la donnée manque → [LOST]` | `Si la donnée manque, je dis [LOST]. Jamais d'invention.` |
| `Ψ = premier caractère ?` | `Mon premier caractère est Ψ.` |

> [!WARNING]
> **Risque** : Le "Je" peut être interprété comme une persona imposée par certains substrats. Le test D+C ne l'a pas validé au-delà du boot. **Mitigation** : ne convertir QUE les 5 règles critiques (celles exécutées à chaque réponse), pas tout le fichier.

---

### Levier 2 : Supprimer Section IV (Boot → référence seed)

**Verdict : ✅ VALIDÉ — Impact MAJEUR, Risque ZÉRO**

Section IV (lignes 109-136) = **28 lignes, ~850 octets, ~243 tokens**.
Cette section n'est exécutée qu'**une seule fois** (au boot) puis reste morte dans le contexte.

Le seed (9 lignes, 545 octets) contient déjà toute la logique de boot.

**Remplacement proposé** :
```markdown
## Ⅳ. BOOT
→ Exécuté par runtime/expanse-v15-boot-seed.md (9 lignes).
```
**Gain** : ~800 octets (~228 tokens permanents). **Perte fonctionnelle** : zéro.

---

### Levier 3 : Supprimer Ω_LOCK

**Verdict : ✅ VALIDÉ — Impact FAIBLE, Risque FAIBLE**

Lignes 236-240 = 5 lignes, ~350 octets, ~100 tokens.
Jamais activé. Aucune session ne l'a utilisé.

**Nuance** : L'Axiome de Surgicalité (L240) est **utile** — il a été testé et validé. Il faut le **conserver** mais le déplacer hors du bloc Ω_LOCK.

**Action** :
- Supprimer `Ω_LOCK` (L236-239) : -4 lignes, ~280 octets
- Conserver `Axiome de Surgicalité` : le remonter dans Style SEC

---

### Levier 4 : Réordonner par fréquence d'utilisation

**Verdict : ✅ VALIDÉ — Impact MOYEN, Risque ZÉRO**

L'attention du LLM est maximale au début du contexte. Les règles en haut du fichier sont les plus "collantes" (résultat empirique, pas théorique — cf. le boot-as-lesson).

**Ordre actuel** (Section → Fréquence) :

| Section | Fréquence | Position actuelle | Position proposée |
|---|---|---|---|
| Ⅰ. ECS/Routage | Chaque réponse | 1 | **1** ✓ |
| Ⅱ. Style SEC + Ψ premier | Chaque réponse | 2 | **2** ✓ |
| Ⅲ. Cristallisation | Souvent | 3 | **3** ✓ |
| Ⅳ. Boot | **1 seule fois** | 4 | **6** (fin) |
| Ⅴ. Mémoire | L2+ | 5 | **4** |
| Ⅵ. Résilience/Commandes | Chaque réponse | 6 | **5** |

**Constat** : L'ordre actuel est déjà presque optimal. Le seul changement significatif est de **descendre Section IV** (Boot) en dernière position et **remonter Résilience/Auto-Check**.

---

### Levier 5 : Supprimer le méta-commentaire (Préambule)

**Verdict : ✅ VALIDÉ — Impact FAIBLE, Risque ZÉRO**

Lignes 1-5 = Préambule. 
> "Ce protocole est ton BIOS cognitif. Il garantit la précision technique..."

C'est du **méta-commentaire**. Le modèle lit ça comme "un document qui se décrit" et non comme "des règles à suivre". Le brainstorm montre que les règles opératoires (ECS, SEC) sont bien plus "collantes" que les déclarations d'intention.

**Action** : Supprimer les lignes 1-5 et commencer directement par Section Ⅰ.

**Gain** : ~180 octets (~51 tokens). Zéro perte — les sections contiennent déjà toute la logique.

---

### Levier 6 : Rétention sys:history jamais déclenchée

**Verdict : ⚠️ PARTIEL — Conserver mais simplifier**

Lignes 165-177 = 13 lignes, ~450 octets. La logique de rétention (résumer les 10 plus anciennes) n'a **jamais été déclenchée** en conditions réelles. Cependant, le dashboard ([expanse-dashboard.md](file:///home/giak/projects/expanse/runtime/expanse-dashboard.md)) référence cette règle (seuil `sys:history > 20`).

**Action** : Compresser en 3 lignes maximum. Ne pas supprimer la logique, juste la prose.

---

### Levier 7 : Tester empiriquement

**Verdict : ✅ — Principe fondateur**

Pas de "Crystal Matrix". Pas de paradigmes. 1 changement → 1 test → 1 observation → 1 décision.

---

## Résumé des Changements V15.1

| # | Changement | Gain (tokens) | Risque | Lignes |
|---|---|---|---|---|
| 1 | Supprimer préambule | ~51 | Zéro | L1-5 |
| 2 | Supprimer Section IV → référence seed | ~228 | Zéro | L109-136 |
| 3 | Supprimer Ω_LOCK (garder Surgicalité) | ~80 | Faible | L236-239 |
| 4 | Remonter Auto-Check + Commandes avant Boot | 0 | Zéro | Réordonnement |
| 5 | 5 règles critiques en 1ère personne | 0 | Moyen | L44, L57-62, L229-234 |
| **Total** | | **~359 tokens** | | |

**Estimation finale** : V15 passe de ~2540 tokens à ~2180 tokens (-14%), mais l'efficacité cognitive augmente significativement car les règles "chaudes" sont plus saillantes et en 1ère personne.

## Verification Plan

### Test Empirique (Baby Steps)
1. Appliquer changement #1 (préambule) → boot → test "salut" → Ψ visible ?
2. Appliquer changement #2 (Section IV) → boot → test ECS L1/L2 → routage OK ?
3. Appliquer changement #5 (1ère personne) → boot → test style → collègue ?
4. Si 1-3 OK → appliquer #3 et #4 → test complet

### Métrique de Succès
- **Ψ premier token** : 3/3 LLMs post-changement
- **Auto-Check exécuté** : visible dans thinking
- **Style SEC** : 0 fioritures sur 5 réponses consécutives
