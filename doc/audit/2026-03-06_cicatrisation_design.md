# Brainstorm — Cicatrisation & Résolution (V8)

## 0. System Map
- **Organes :** $\Sigma$ (Induction Boot), Μ (Cristallisation), Rêveur (Introspection).
- **Fichiers clés :** [expanse-system.md](file:///home/giak/projects/expanse/prompts/expanse-system.md), [expanse-dream.md](file:///home/giak/projects/expanse/prompts/expanse-dream.md), [docs/ONTOLOGY.md](file:///home/giak/projects/expanse/docs/ONTOLOGY.md).
- **Structure :** Le Rêveur écrit des `[RULE_PROPOSAL]`. $\Sigma$ les détecte au Boot.

## 1. Λ Contexte
**Type :** Amélioration / Cycle de Vie
**Problème :** Les `[RULE_PROPOSAL]` sont persistantes. Une fois appliquées ou refusées par l'humain, elles continuent de trigger le **[DREAM INTERRUPT]** au Boot car $\Sigma$ ne sait pas différencier une "nouvelle" proposition d'une proposition "traitée".
**Contraintes :** Garder une trace (Provenance), ne pas supprimer arbitrairement (Audit Trail), minimiser la friction de clôture.
**Complexity budget :** ECS 2.5 (Structured)

## 2. ECS Estimate
- **Score :** 2.5 / 2.5
- **Mode :** Structured

## 3. Ω Generate — Iteration to Apex

### Approche A : Cicatrisation par Tag `[RESOLVED]` (Manuel/Sémi-Auto)
L'utilisateur ou l'organe Μ ajoute le tag `[RESOLVED]` à la mémoire une fois la décision prise.
- **Analyse critique :** Très robuste, humain-centrique (Veto). Risque d'oubli si l'utilisateur ne le fait pas.
- **Simplicité :** Élevée.
- **Amélioration (APEX) :** L'Ouvrier (LLM) qui applique le plan doit *automatiquement* proposer un outil `update_memory` à la fin de son exécution pour marquer la proposition comme close.

### Approche B : Le Protocole "Ghost" (Archivage Temporel)
Le Boot ne cherche que les `[RULE_PROPOSAL]` dont le `created_at` est supérieur à la dernière ancre de stabilité (`[STABLE_ANCHOR]`).
- **Analyse critique :** Élimine le besoin de tagger chaque règle. Mais demande une gestion de timestamp complexe et l'écriture d'une ancre de stabilité.
- **Simplicité :** Faible (Cognitive Drag).

### Approche C : La Consommation par Hash (ADN-Check)
Le Rêveur génère un Hash du fichier qu'il veut modifier. Si le hash actuel est différent de celui du Rêve, la règle est active.
- **Analyse critique :** Trop fragile pour Markdown. Une simple correction de typo rendrait la règle "non-appliquée".
- **Verdict :** Rejeté.

---

## 4. Comparison Table

| Approach | Simplicity | Robustness | Non-Regression | Complexity | Verdict |
|----------|------------|------------|----------------|------------|---------|
| A (Tag)  | 5/5        | 4/5        | 5/5            | 1/5        | **✓ (APEX)** |
| B (Time) | 2/5        | 3/5        | 4/5            | 3/5        | ✗       |
| C (Hash) | 1/5        | 1/5        | 5/5            | 5/5        | ✗       |

---

## 5. Final Solution : Le Protocole de Cicatrisation (A)

### CORE_RULE : Cycle de Vie de la Mutation
Une `[RULE_PROPOSAL]` passe par 3 états :
1. **ACTIVE** (Tags: `sys:expanse`, `[RULE_PROPOSAL]`) : Trigger le Boot Interrupt.
2. **RESOLVED / APPLIED** (Tags additionnels: `[RESOLVED]`, `[APPLIED]`) : Ignoré au Boot, conservé pour audit.
3. **REJECTED** (Tags additionnels: `[RESOLVED]`, `[REJECTED]`) : Ignoré au Boot, conservé pour éviter que le Rêveur ne repropose la même erreur.

### HEURISTIC : L'Ablation au Boot
Modifier la requête de boot dans [expanse-system.md](file:///home/giak/projects/expanse/prompts/expanse-system.md) pour être antilogique du tag `[RESOLVED]`.

---

## 6. Proof by Test
1. Créer une `[RULE_PROPOSAL]`.
2. Booter → Interruption détectée.
3. Tagger la mémoire avec `[RESOLVED]`.
4. Booter → Séquence fluide, pas d'interruption.

---

## 7. Checklist YAGNI
- [x] Utilisation des tags Mnemolite existants.
- [x] Conservation de l'historique des mutations.
- [ ] NO : Ne pas supprimer physiquement les mémoires (besoin de traçabilité).
- [ ] NO : Ne pas automatiser le tag `[RESOLVED]` sans confirmation humaine (Veto).

## 8. Last Lever Ψ
Le Rêveur (Passe 1 : La Plaie) devrait aussi lire les `[REJECTED]` pour ne pas boucler sur des idées que l'utilisateur a déjà refusées. C'est l'anti-fragilité par l'échec documenté.

---
**Mutation :** [MODIFY] [prompts/expanse-system.md](file:///home/giak/projects/expanse/prompts/expanse-system.md), [prompts/mu/crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md)
**Type :** Amélioration structurelle
