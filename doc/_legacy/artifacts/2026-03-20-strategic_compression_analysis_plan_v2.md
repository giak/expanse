# V15.1 — Plan Révisé (Post-Critique)

> Intégration des 6 faiblesses identifiées. Abandon du Levier 5 en phase initiale. Découverte du **vrai levier caché**.

---

## L'Erreur de Mon Plan Précédent

Mon plan proposait ~359 tokens de gain. Tu as montré que :
- 359 tokens sur 128K = **0.28%** → invisible pour le modèle
- D+C n'a **jamais testé** la 1ère personne — j'ai confondu "boot-as-lesson" avec "identity shift"
- Le préambule pourrait être un **ancrage d'identité**, pas du bruit
- La vérification omettait cristallisation, ECS routing, sys:history, TRACE:FRESH
- Pas de rollback

Ces critiques sont valides. Mon plan mélangeait des gains sûrs (Section IV, Ω_LOCK) avec des hypothèses non testées (1ère personne, préambule), et les présentait dans le même paquet.

## Le Levier Caché : La Redondance MCP

V15 fait **8890 octets**. Les code blocks font **1861 octets** = **21% du fichier**.

Ces blocs contiennent 7 appels MCP avec syntaxe complète (paramètres, types, indentation). Mais le modèle **connaît déjà** toutes ces signatures — elles sont dans ses tool definitions.

Écrire :
```
mcp_mnemolite_write_memory(
    title: "PATTERN: {nom}",
    content: "{description + contexte}",
    tags: ["sys:pattern", "v15"],
    memory_type: "reference"
)
```

…c'est dire au modèle ce qu'il sait déjà. C'est comme écrire la documentation de `print()` dans un script Python.

**Ce qu'il a besoin de savoir** : QUAND appeler et QUELS tags. Pas COMMENT appeler.

### Compression par bloc

| Bloc | Lignes actuelles | Remplacement | Gain |
|---|---|---|---|
| Cristallisation Μ (L74-86) | 13 lignes | `Signal positif + pattern inédit → write_memory(tags: sys:pattern). Output: Ψ [Μ] Pattern cristallisé.` | ~300 octets |
| Décristallisation (L90-99) | 10 lignes | `Signal négatif + pattern récent (3 échanges) → update_memory(tags: sys:pattern:doubt). Output: Ψ [Μ] Pattern douteux.` | ~250 octets |
| Sauvegarde L2+ (L155-163) | 9 lignes | `Route ≥ L2 → write_memory(title: "INTERACTION: {date}", tags: sys:history, type: conversation)` | ~220 octets |
| Rétention (L166-177) | 12 lignes | `count(sys:history) > 20 → résumer 10 anciennes en 1 agrégée, soft-delete originales` | ~300 octets |
| TRACE:FRESH FORMAT+EXEMPLE (L194-210) | 17 lignes | Garder FORMAT (5 lignes), supprimer EXEMPLE | ~250 octets |
| **Total code blocks** | **61 lignes** | **~10 lignes** | **~1320 octets (~377 tokens)** |

Combiné avec Section IV et Ω_LOCK :

| Changement | Gain (octets) | Gain (tokens) | Risque |
|---|---|---|---|
| Compression code blocks | ~1320 | ~377 | **Zéro** |
| Section IV → référence | ~850 | ~243 | **Zéro** |
| Ω_LOCK (garder Surgicalité) | ~280 | ~80 | **Zéro** |
| **Total Phase 1** | **~2450** | **~700** | **Zéro** |

**700 tokens = -28% du fichier**. Et c'est **100% zéro risque** car on ne change aucune règle. On supprime de l'information que le modèle possède déjà.

---

## Plan en 3 Phases

### Phase 1 : Chirurgie Zéro-Risque
| # | Changement | Tokens | Rollback |
|---|---|---|---|
| 1a | Section IV → `→ Voir boot-seed.md` | -243 | Restaurer depuis backup |
| 1b | Ω_LOCK → supprimer (garder Surgicalité dans SEC) | -80 | Restaurer depuis backup |
| 1c | Compresser 5 code blocks MCP | -377 | Restaurer depuis backup |
| 1d | Réordonnement (Auto-Check monte, Boot descend) | 0 | Ré-réordonner |

**Test Phase 1** : Boot → "salut" → question L2 → "merci" → signal négatif.
**Critères** : Ψ premier token (5/5), ECS routing correct, cristallisation déclenchée, TRACE:FRESH écrite.

### Phase 2 : Hypothèse Préambule (si Phase 1 ✅)
| # | Changement | Rollback |
|---|---|---|
| 2a | Supprimer le préambule (L1-5) | Restaurer le préambule |

**Test Phase 2** : Même batterie que Phase 1.
**Critère spécifique** : Le modèle traite-t-il toujours V15 comme firmware (pas comme "un document de règles") ?
**Signal de régression** : Le modèle dit "selon le protocole" ou "le document indique" au lieu d'exécuter directement.

### Phase 3 : Hypothèse 1ère Personne (si Phase 2 ✅)
| # | Changement | Rollback |
|---|---|---|
| 3a | Convertir 5 règles chaudes en "Je" | Restaurer en "Tu" |

**Test Phase 3** : Même batterie + test de persona.
**Critère spécifique** : Le modèle exécute-t-il les règles ou les joue-t-il ?
**Signal de régression** : "En tant que collègue Expanse, je..." → persona roleplay au lieu d'exécution.

> [!IMPORTANT]
> **Contre-argument au "Je"** : Les données d'entraînement contiennent massivement "You are a helpful assistant" (2ème personne = identity anchoring). "I am X" est le pattern du roleplay/character sheet. Le "Tu" de KERNEL et V15 pourrait être **plus sticky** que le "Je" parce qu'il active le pattern **system prompt**, pas le pattern **character sheet**.
>
> C'est une hypothèse qui mérite un test A/B : V15-Tu vs V15-Je sur 3 LLMs.

---

## Matrice de Vérification Complète

| Test | Vérifie | Phase 1 | Phase 2 | Phase 3 |
|---|---|---|---|---|
| Boot → `Ψ [V15 ACTIVE]` | Boot intact | ✅ | ✅ | ✅ |
| "salut" → Ψ premier | Auto-Check | ✅ | ✅ | ✅ |
| Question L1 → 1-2 phrases | ECS routing | ✅ | ✅ | ✅ |
| Question L2 → Ψ⇌Φ | ECS routing | ✅ | ✅ | ✅ |
| "merci" après pattern → `Ψ [Μ]` | Cristallisation | ✅ | ✅ | ✅ |
| "non c'est faux" → TRACE:FRESH | Signaux négatifs | ✅ | ✅ | ✅ |
| Route L2+ → sys:history écrit | Sauvegarde | ✅ | ✅ | ✅ |
| Style SEC, 0 fioritures | Souveraineté | ✅ | ✅ | ✅ |
| Pas de "selon le protocole" | Firmware vs Doc | — | ✅ | ✅ |
| Pas de "En tant que..." | Exécution vs Persona | — | — | ✅ |

---

## Résultat Attendu

V15 actuel : **8890 octets (~2540 tokens)**
V15.1 Phase 1 : **~6440 octets (~1840 tokens)** → **-28%**, zéro risque
V15.1 Phase 2 : **~6260 octets (~1789 tokens)** → **-30%**, risque faible
V15.1 Phase 3 : **~6260 octets (~1789 tokens)** → même taille, changement de forme

La vraie métrique n'est pas les tokens. C'est : **le modèle exécute-t-il chaque règle de façon fiable sur 3 LLMs ?**
