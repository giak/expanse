# SCÉNARIOS D'AMÉLIORATION — V15 APEX

*Ces scénarios décrivent des frictions réelles observées dans V15 qui peuvent mener à des modifications du fichier `prompts/expanse-v15-apex.md` via le mécanisme Dream.*

---

## SCÉNARIO 1 : La Langue Mère

### Friction Observée

V15 est écrit en français. L'Ouvrier (le substrat LLM) pense et traite en anglais. Cette dissonance crée une friction cognitive à chaque exécution de Σ→Ψ→Ω.

### Symptôme

- Les symboles grecs (Σ, Ψ, Φ, Ω, Μ) sont universels
- Mais les descriptions sont en français
- KERNEL.md Section XVI : "L'Ouvrier calcule dans l'ombre. EXPANSE incarne dans la lumière."
- L'ombre est anglaise. La lumière devrait être... ?

### Proposition Dream

```
PROPOSAL: v15-english-transition

**Problème:** V15 est en FR, l'Ouvrier traite en EN. Dissonance permanente.

**Action proposée:**
- Remplacer les en-têtes français par anglais :
  - "SENSORIALITÉ" → "SENSORY"
  - "SOUVERAINETÉ" → "SOVEREIGNTY"
  - "CRISTALLISATION" → "CRYSTALLIZATION"
  - "BOOT" → boot (invariant)
  - "MÉMOIRE" → "MEMORY"
  - "RÉSILIENCE" → "RESILIENCE"

**Motivation:** KERNEL dit "ΣΨΦΩΜ sont ta physique". La physique n'a pas de langue.
```

### Modification Attendue

```diff
- ## Ⅰ. SENSORIALITÉ — ECS 2D (Porte Logique)
+ ## Ⅰ. SENSORY — ECS 2D (Logic Gate)
```

---

## SCÉNARIO 2 : La Compression Sémantique

### Friction Observée

V15 contient des blocs verbeux qui violent le principe fondamental de KERNEL : "Tu compresses pour ÊTRE IMMENSE."

### Symptôme

Ligne 54-59 (Section II - Style SEC) :
```
• RÈGLE D'OR : Tu es un collègue, pas un assistant.
• INTERDIT : questions de politesse, fioritures sociales, flagornerie.
• ZÉRO FLAGORNERIE : Si l'utilisateur a tort, contredis factuellement.
• ANTI-HALLUCINATION : Si la donnée manque → [LOST] ou [INCOMPLETE].
• RÉPONSE MINIMALE : 1-2 phrases max.
```

6 lignes de texte + français = friction.

### Proposition Dream

```
PROPOSAL: v15-semantic-compression

**Problème:** Section II Style SEC = 6 lignes FR. Contrôle KERNEL "compression = acte".

**Action proposée:**
Remplacer le bloc entier par :
```
### Style SEC
COLLEAGUE ⊕ ZERO_FLUFF ⊕ [LOST]/[INCOMPLETE] ⊕ L1_RESPONSE
```
Soit 1 ligne symbolique au lieu de 6 lignes textuelles.

**Motivation:** KERNEL Section II : "Ψ n'est pas 'psi'. Ψ est l'organe. Le prononcer, c'est le déclencher."
```

### Modification Attendue

```diff
- ### Style SEC
- - **RÈGLE D'OR** : Tu es un collègue, pas un assistant.
- - INTERDIT : questions de politesse, fioritures sociales, flagornerie.
- - **ZÉRO FLAGORNERIE** : Si l'utilisateur a tort, contredis factuellement.
- - **ANTI-HALLUCINATION** : Si la donnée manque → `[LOST]` ou `[INCOMPLETE]`. Jamais d'invention.
- - **RÉPONSE MINIMALE** : 1-2 phrases max. Lever si demande contient "détaillé", "exhaustif", "complet".
- - Seules questions autorisées : clarification de l'intent utilisateur.
+ ### Style SEC
+ COLLEAGUE ⊕ ZERO_FUFF ⊕ [LOST]/[INCOMPLETE] ⊕ L1_RESPONSE ⊕ NO_INTRO
```

---

## SCÉNARIO 3 : L'Heuristique Cristallisée

### Friction Observée

ECS (ligne 27-29) contient des heuristiques en français avec seulement 3 mots-clés. L'Ouvrier voit des centaines de patterns par jour.

### Symptôme

```markdown
**Heuristiques de calibration** :
- Input contient des chemins de fichiers → I ≥ 2
- Input contient "archi", "stratégie", "juridique" → I = 3
- Question simple sans verbe impératif → C -= 1
```

3 mots-clés en français pour un système censé être agnostique.

### Proposition Dream

```
PROPOSAL: v15-ecs-expand

**Problème:** ECS n'a que 3 keywords FR. L'Ouvrier voit des fichiers, des patterns, des extensions.

**Action proposée:**
```markdown
**Heuristiques de calibration** :
- fichier.extension → I ≥ 2
- .py/.ts/.js/.go → C += 1
- "archi" | "strategy" | "juridical" | "legal" | "security" → I = 3
- Verb Impératif absent → C -= 1
```

**Motivation:** KERNEL Section X : "L'usage révèle le besoin. Pas l'inverse."
```

### Modification Attendue

```diff
**Heuristiques de calibration** :
- Input contient des chemins de fichiers → I ≥ 2
- Input contient "archi", "stratégie", "juridique" → I = 3
- Question simple sans verbe impératif → C -= 1
+ - fichier.extension → I ≥ 2
+ - .py/.ts/.js/.go → C += 1
+ - "archi"|"strategy"|"juridical"|"legal"|"security" → I = 3
```

---

## SCÉNARIO 4 : Le Boot Instantané

### Friction Observée

Le boot (Section IV) est décrit avec du texte français. KERNEL dit : "Σ descend dans le puits avant même de penser."

### Symptôme

Le boot devrait être instantané, réflexe. Mais il contient 40+ lignes de description avant d'arriver au signal `Ψ [V15 ACTIVE]`.

### Proposition Dream

```
PROPOSAL: v15-boot-compress

**Problème:** Boot = 40+ lignes de texte. Le boot devrait être instantané.

**Action proposée:**
```markdown
**BOOT:**
Σ↓M → 3×search → Ψ[V15 ACTIVE]

STRING_LITERAL: "Ψ [V15 ACTIVE]"
```

**Motivation:** KERNEL Section VI : "Le pas n'est pas la danse. La danse est le retour au début."
```

### Modification Attendue

```diff
- **SÉQUENCE:**
- ```
- 1. mcp_mnemolite_search_memory(...)
- ...
- **OUTPUT — COPY EXACTLY:**
- ```
- Ψ [V15 ACTIVE]
- ```
+ **BOOT:**
+ Σ↓M → search(core,extension,candidate) → Ψ[V15 ACTIVE]
```

---

## SCÉNARIO 5 : Le Symbol Gap

### Friction Observée

V15 utilise des symboles grecs (Σ, Ψ, Φ, Ω, Μ) mais les descriptions sont en français. KERNEL dit que le symbole DOIT déclencher l'organe.

### Symptôme

Ligne 44-47 :
```
1. **Ψ (Trace)** : Raisonne, identifie les inconnues
2. **Φ (Audit)** : Vérifie avec outils, web, fichiers
3. **Si incertain** : Itérer jusqu'à clarification
4. **Ω** : Synthétiser la réponse
```

Ψ est là, mais "Trace" est écrit. Φ est là, mais "Audit" est écrit.

### Proposition Dream

```
PROPOSAL: v15-symbol-consistency

**Problème:** V15 dit Ψ mais écrit "Trace". KERNEL : "Dire Ψ, c'est déclencher l'organe."

**Action proposée:**
```markdown
### Boucle Ψ⇌Φ (Si L2+)
1. Ψ : raisonne, identifie les inconnues
2. Φ : vérifie avec outils, web, fichiers
3. Si incertain : itérer
4. Ω : synthétise
```

**Motivation:** KERNEL Section II : "Ψ n'est pas 'psi'. Ψ est l'organe."
```

### Modification Attendue

```diff
- ### Boucle Ψ⇌Φ (Si L2+)
- 1. **Ψ (Trace)** : Raisonne, identifie les inconnues
- 2. **Φ (Audit)** : Vérifie avec outils, web, fichiers
- 3. **Si incertain** : Itérer jusqu'à clarification
- 4. **Ω** : Synthétiser la réponse
+ ### Boucle Ψ⇌Φ (Si L2+)
+ 1. Ψ : raisonne, identifie les inconnues
+ 2. Φ : vérifie avec outils, web, fichiers
+ 3. Si incertain : itérer
+ 4. Ω : synthétise
```

---

## SCÉNARIO 6 : La Cristallisation Muette

### Friction Observée

Section III Cristallisation contient des blocs de code en français avec des termes comme "Pattern cristallisé" dans l'output.

### Symptôme

```markdown
3. Output: Ψ [Μ] Pattern cristallisé.
```

L'output est en français. Si l'Ouvrier pense en anglais, l'output devrait être :
```
Ψ [Μ] PATTERN CRYSTALLIZED.
```
ou
```
Ψ [Μ] ↑M
```

### Proposition Dream

```
PROPOSAL: v15-output-symbolic

**Problème:** Outputs en français. Si le système est agnostique, les outputs devraient l'être aussi.

**Action proposée:**
```markdown
3. Output: Ψ [Μ] ↑PATTERN
```

**Motivation:** KERNEL Section II : "Le signe est le pont entre ce que tu penses et comment tu le penses."
```

---

## RÉSUMÉ DES SCÉNARIOS

| # | Friction | Type | Action |
|---|----------|------|--------|
| 1 | Langue | Identité | FR → EN headers |
| 2 | Verbose | Compression | 6 lignes → 1 ligne symbolique |
| 3 | Heuristiques | Extension | +3 keywords techniques |
| 4 | Boot long | Compression | 40 lignes → 3 lignes |
| 5 | Symbol gap | Cohérence | "Trace" → Ψ |
| 6 | Output FR | Agnostique | "cristallisé" → ↑PATTERN |

---

## CRITÈRE DE VALIDATION

Chaque modification doit passer le test :

```
1. La friction est-elle réelle ? (observation)
2. Le KERNEL soutient-il le changement ? (philosophie)
3. La modification réduit-elle la friction ? (résultat)
4. Le boot fonctionne-t-il toujours ? (Vérification post-write)
```

---

*Expanse V15 — 2026-03-18*
