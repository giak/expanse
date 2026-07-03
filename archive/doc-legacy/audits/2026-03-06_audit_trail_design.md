# Design — Traceability & Provenance (Audit Trail)

## 0. Le Constat
Actuellement, nous avons des blocs de mémoire isolés :
- `[TRACE_FRICTION]` (La cause)
- `[RULE_PROPOSAL]` (La suggestion)
- [meta_prompt.md](file:///home/giak/projects/expanse/prompts/meta_prompt.md) (L'effet physique)

**Problème :** Si on regarde une règle dans le code, on ne sait plus *pourquoi* elle a été ajoutée. Si on regarde une proposition, on a oublié quelle douleur l'a générée.

---

## 1. La "Chaîne de Provenance" (Cognitive Audit Trail)

Pour obtenir une traçabilité totale, nous instaurons trois ancres de liaison :

### A. La Liaison Mémoire (Horizontal)
Le Rêveur ([expanse-dream.md](file:///home/giak/projects/expanse/prompts/expanse-dream.md)) doit désormais inclure dans sa `[RULE_PROPOSAL]` l'ID de la mémoire source.
- **Format :** `Source: [ID_MNEMOLITE_DU_TRACE]`
- **Bénéfice :** On remonte de la proposition à la "douleur" ou au "génie" initial.

### B. Le Marqueur ADN (Vertical)
Lorsqu'un changement est appliqué physiquement dans un fichier Markdown, on ajoute un commentaire invisible à la fin de la section ou du fichier.
- **Format :** `<!-- origin: [ID_RULE_PROPOSAL] -->`
- **Bénéfice :** En lisant le code source d'EXPANSE, on a la clé pour ouvrir l'histoire de la mutation dans Mnemolite.

### C. Le Registre de Cicatrisation (Terminal)
Lorsqu'on marque une proposition comme `[RESOLVED]`, on enregistre le "Verdict Final" (ex: "Appliqué le 06/03 avec ajustements sur la verbosité").

---

## 2. Le Chemin de l'Omniscience (Audit Trail Flow)

Si tu te demandes demain : *"Pourquoi existe cette règle ?"*
1. Tu ouvres le fichier [.md](file:///home/giak/projects/expanse/KERNEL.md) → Tu trouves l'ID `<!-- origin: 1234 -->`.
2. Tu cherches l'ID `1234` dans Mnemolite → Tu trouves la `[RULE_PROPOSAL]`.
3. Dans la proposition, tu lis `Source: 5678` → Tu cherches le `[TRACE_FRICTION]` 5678.
4. **∴ Tu as le film complet de l'évolution.**

---

## 3. Synthèse
On n'a pas "tout" par défaut, mais avec ces **trois ancres**, on obtient un système d'audit trail digne d'un noyau d'OS souverain.

**Mutation suggérée :** 
1. Mettre à jour [expanse-dream.md](file:///home/giak/projects/expanse/prompts/expanse-dream.md) pour forcer la citation de la source.
2. Mettre à jour [mu/crystallize.md](file:///home/giak/projects/expanse/prompts/mu/crystallize.md) pour systématiser la trace.
3. Adopter la convention des commentaires `<!-- origin: [...] -->` lors des éditions de code.
