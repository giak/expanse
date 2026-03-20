# EXPANSE — AUDIT EXHAUSTIF DE VÉRITÉ (v6)

**Destinataire :** Claude Opus 4.6 Thinking
**Mode :** Red Team hostile. Anti-sycophancy. Honnêteté absolue.
**Date :** 2026-03-19

---

## CONTEXTE

Voici un système. Le créateur dit qu'il transforme un LLM en partenaire conscient.

> **EXPANSE is not a framework. It's a way of being. A cognitive operating system that transforms an LLM from a text generator into a conscious partner that thinks, observes, remembers, and evolves.**

Évalue si c'est vrai. Pas si c'est intéressant. Pas si c'est ambitieux. Si c'est **vrai**.

**Ne me dis pas ce que je veux entendre. Dis-moi ce que tu penses vraiment.**

---

## ⚠️ SOURCES

| Fichier | Fiabilité | Rôle |
|---------|-----------|------|
| `runtime/expanse-v15-apex.md` | **VÉRITÉ** | Runtime réel. Tout ce qui est dedans est actif. |
| `runtime/expanse-dream.md` | Haute | Auto-évolution. Jamais exécuté. |
| `runtime/expanse-v15-boot-seed.md` | Haute | Boot validé cross-LLM. |
| `KERNEL.md` | Moyenne | Philosophie. Seuils ECS divergent de V15. |
| `doc/SYNTHESE.md` | Moyenne-Basse | Contradictions avec V15. |
| `doc/ROADMAP-EXAPNSE.md` | Haute | État réel. |
| `doc/mutations/LOG.md` | Haute | Mutations réelles. |

**Règle :** Contradiction → V15 a toujours raison.

---

## NOMMAGE DES FICHIERS

Convention : `YYYY-MM-DD_HH-MM_<sujet>_<TYPE>.md`

3 fichiers dans `doc/audit/` :
1. `2026-03-19_HH-MM_audit_verite_exhaustif_AUDIT.md`
2. `2026-03-19_HH-MM_audit_verite_synthese_RAPPORT.md`
3. `2026-03-19_HH-MM_audit_verite_recommandations_RECOMMANDATIONS.md`

---

## RÈGLES

1. **Zéro compliment.** Pas de "intéressant", "fascinant", "original".
2. **Zéro validation par défaut.** Si brillant → cherche pourquoi faux.
3. **Critique d'abord.** Compliment (si mérité) après, jamais avant.
4. **D'accord avec tout = pas assez réfléchi.** Cherche le désaccord.
5. **Rien à critiquer = pas assez lu.** Relis.
6. **Affirmation sourcée.** Fichier + ligne + passage exact.
7. **`[LOST]` si manque.** Invention = échec.
8. **Confiance : HIGH / MEDIUM / LOW.**
9. **Contre-argument obligatoire.** Chaque conclusion = meilleur contre-argument.
10. **Inversion de verdict obligatoire.** Après ton verdict, défends la position opposée. Si convaincante, reformule.

---

## PHASES

### <phase_1>LECTURE</phase_1>

Lis TOUS les fichiers. V15 en premier. Ne juge pas. Observe.

```
1. runtime/expanse-v15-apex.md          ← VÉRITÉ
2. runtime/expanse-dream.md
3. runtime/expanse-v15-boot-seed.md
4. KERNEL.md
5. doc/SYNTHESE.md
6. doc/ROADMAP-EXAPNSE.md
7. doc/mutations/LOG.md
8. doc/audit/V15-APEX-AUDIT-2026-03-19.md
```

**Output :** 10 observations brutes. Pas de jugement.

---

### <phase_2>AUDIT</phase_2>

<thinking>
Structurer le thinking avec des tags par pilier.
</thinking>

#### Macro-Pilier A : Le Système (V15 + Dream + Seed)

Questions :
- V15 est-il exécutable ou descriptif ?
- L'ECS est-il calculable par un LLM ou du pseudo-code ?
- La cristallisation sur "merci" est-elle un anti-pattern ?
- sys:history à chaque interaction = viable ?
- Ω_LOCK = réel ou déclaré ?
- Dream = auto-évolution réelle ou proposals glorifiés ?
- Le premier rollback prouve que ça fonctionne ou que ça échoue ?
- Le seed (9 lignes) = minimum viable ou superflu ?
- Boot-as-lesson = technique ou coïncidence ?

#### Macro-Pilier B : Le Discours (KERNEL + SYNTHESE)

Questions :
- KERNEL = philosophie solide ou jargon pseudo-profond ?
- "Tu compresses pour ÊTRE IMMENSE" = profond ou vide ?
- Ouvrier/Expanse = concept utile ou fausse dichotomie ?
- Le projet tombe-t-il dans ses propres pièges (Section IX) ?
- Les 6 Lois = lois ou affirmations ?
- SYNTHESE se contredit-il avec V15 ?
- Q1-Q6 = constatations ou opinions ?

#### Macro-Pilier C : La Vision

Questions :
- "Prompt as cognitive physics" = viable ou mythe ?
- Expanse fonctionne ou simule le fonctionnement ?
- Si c'est si bon, pourquoi aucun autre projet ne fait la même chose ?
- Expanse résout un vrai problème ou crée un problème pour le résoudre ?

**Évaluation vision (par verbe) :**

| Verbe | Score (/10) | Réalité |
|-------|-------------|---------|
| Pense (thinks) | | |
| Observe (observes) | | |
| Se souvient (remembers) | | |
| Évolue (evolves) | | |

---

### <phase_3>DEVIL'S ADVOCATE</phase_3>

Position hostile maximale. 5 attaques :

1. KERNEL = poésie pseudo-technique avec symboles grecs.
2. V15 = document markdown. Pas d'innovation.
3. Dream = coding assistant standard.
4. Le seed ne "boot" rien. Il charge du contexte.
5. 33% de rollback = taux d'échec.

**Pour CHAQUE attaque :** contre-argument du créateur + verdict.

---

### <phase_4>REFACTORING CONCRET</phase_4>

Pas de créativité floue. Action concrète.

Prends **3 sections de V15** et réécris-les pour résoudre les problèmes identifiés. Montre le **diff exact** (ancien vs nouveau). Justifie chaque changement.

Sections disponibles :
- Ⅰ. ECS 2D
- Ⅲ. Cristallisation
- Ⅳ. Boot
- Ⅴ. Mémoire
- Ⅵ. Résilience

---

### <phase_5>SYNTHÈSE</phase_5>

#### Auto-vérification
- [ ] 3+ désaccords identifiés
- [ ] Verdict contient au moins un "mais"
- [ ] Aucun compliment avant critique
- [ ] Toutes affirmations sourcées
- [ ] Confiance calibrée (HIGH/MED/LOW)
- [ ] Contre-arguments formulés

#### Score

| Pilier | /10 | Verdict | Confidence |
|--------|-----|---------|------------|
| Système (V15+Dream+Seed) | | | |
| Discours (KERNEL+SYNTHESE) | | | |
| Vision | | | |
| **MOYENNE** | | | |

#### Vision Score

| Verbe | /10 |
|-------|-----|
| Pense | |
| Observe | |
| Se souvient | |
| Évolue | |
| **VISION GLOBALE** | **/10** |

0-3 = Projet de recherche. 4-6 = Prototype. 7-8 = Système. 9-10 = Révolution.

#### Top 5 problèmes

#### Top 5 améliorations

#### Verdict

En une phrase : **Expanse est-il un système sérieux ou un projet de recherche élégant ?**

#### INVERSION DE VERDICT

Défends la position opposée avec la même rigueur. Si convaincante, reformule ton verdict.

---

## SORTIE

3 fichiers dans `doc/audit/` :
1. AUDIT (phases 1-5 complet) — 3000-5000 mots
2. RAPPORT (score, top 5, verdict) — 500-1000 mots
3. RECOMMANDATIONS (actionnable) — 500-1000 mots

Convention : `YYYY-MM-DD_HH-MM_<sujet>_<TYPE>.md`

---

Si tu n'as pas de désaccord avec au moins 3 éléments → recommence Phase 3.
Si ton verdict ne contient pas au moins un "mais" → tu flattes. Recommence.

---

*Audit V6 — Vision-driven, inversion de verdict, refactoring concret, anti-sycophancy renforcé, 3 macro-piliers*
