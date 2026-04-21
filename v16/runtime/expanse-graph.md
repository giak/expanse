---
name: /graph
description: Cartographie fonctionnelle du cortex Expanse
---

# EXPANSE — CARTOGRAPHIE DU CORTEX

**v5.1** — `/graph`

---

## PRÉAMBULE

⚠️ **MNEMOLITE EST OBLIGATOIRE**. Sans Mnemolite, il n'y a pas d'Expanse. AUCUN FALLBACK. AUCUNE SIMULATION. AUCUN GRAPHE PARTIEL. Si Mnemolite ne répond pas, /graph ÉCHEC COMPLET.

Ceci N'EST PAS un outil UI. Ceci est un extrait FONCTIONNEL pur du cortex.
- ZÉRO décisions UI
- ZÉRO codes couleurs définis ici
- ZÉRO tailles, positions, styles
- SEULEMENT les relations sémantiques extraites des sources + Mnemolite

Mode **MIROIR**. Le LLM est le générateur. Il lit les sources Expanse et sonde Mnemolite via MCP pour produire le JSON. **Il n'y a PAS de script autonome** — le générateur C'EST le LLM qui lit les fichiers et appelle MCP.

⚠️ **INTERDIT** : Parser le dashboard HTML. Le dashboard EST une sortie, pas une entrée. Les données vivantes sont dans les fichiers sources + Mnemolite.

100% autonome. Aucune modification du runtime. Exactement comme `/status`.

**v5.0 vs v4.0 :**
- ✅ **Extraction section-par-section** : chaque section de V16 et Dream a son template exact
- ✅ **13 appels MCP** (+5 : trace:fresh, sys:pattern:doubt, sys:user:profile, sys:diff+temporal, sys:project)
- ✅ **Type d'arête CONSTRAINS** + champ `condition` optionnel pour capturer les Gates
- ✅ **Tags de sous-catégorie** pour distinguer REGLE gate/route/mecanisme/constraint/symbiosis

---

## SÉQUENCE

### 0. PRÉREQUIS NON NÉGOCIABLES

1. Mnemolite DOIT répondre à TOUS les appels MCP
2. Les 4 fichiers sources DOIVENT exister et être lisibles
3. Si l'une de ces conditions n'est pas remplie → ABORT IMMÉDIAT

Message d'échec: `Ψ [GRAPH] ERREUR CRITIQUE: Cortex inaccessible`

### 1. Lire les sources (4 fichiers, PARALLÈLE)

```
read_file(path="v16/runtime/expanse-v16.md")
read_file(path="v16/runtime/expanse-dream.md")
read_file(path="v16/runtime/expanse-v16-boot-seed.md")
read_file(path="doc/mutations/LOG.md")
```

⚠️ Ne PAS lire KERNEL.md ni SKILL-REGISTRY.md au step 1. Ils sont croisés au step 5C/5D uniquement si besoin.

### 2. Sonder Mnemolite (12 recherches, PARALLÈLE)

**Appels MCP — signatures adaptées pour la couverture maximale.** Le LLM exécute ces 12 appels EXACTEMENT comme spécifié ci-dessous.

```
// #1 — V16 §Ⅵ BOOT_CONFIG
mcp_mnemolite_get_system_snapshot(repository="expanse")

// #2 — V16 §Ⅳ: axiomes scellés (sys:core + sys:anchor)
mcp_mnemolite_search_memory(tags=["sys:core","sys:anchor"], limit=100)

// #3 — V16 §Ⅵ + Dream P2: protocoles
mcp_mnemolite_search_memory(tags=["sys:protocol"], limit=20)

// #4 — V16 §Ⅳ: patterns validés
mcp_mnemolite_search_memory(tags=["sys:pattern"], limit=100)

// #5 — V16 §Ⅳ: candidates (Protection Auto)
mcp_mnemolite_search_memory(tags=["sys:pattern:candidate"], limit=100)

// #6 — Dream P3 + V16 §Ⅶ: extensions symbiose
mcp_mnemolite_search_memory(query="sys:extension", tags=["sys:extension"], limit=20)

// #7 — V16 §Ⅳ + Dream P7: historique
mcp_mnemolite_search_memory(query="sys:history", tags=["sys:history"], limit=50)

// #8 — V16 §Ⅳ + Dream P1: drifts post-Ω
mcp_mnemolite_search_memory(tags=["sys:drift"], limit=50, consumed=false)

// #9 — Dream P0/P1: traces fraîches
mcp_mnemolite_search_memory(tags=["trace:fresh"], limit=50, consumed=false)

// #10 — Dream P4: patterns douteux
mcp_mnemolite_search_memory(tags=["sys:pattern:doubt"], limit=50)

// #11 — Dream P6: profil utilisateur (tag unique — NE PAS combiner avec sys:history)
mcp_mnemolite_search_memory(tags=["sys:user:profile"], limit=1)

// #12 — Dream P7: différentiel temporel
mcp_mnemolite_search_memory(query="sys:diff", tags=["sys:diff","temporal"], limit=1)

// #13 — V16 §Ⅵ Boot: contexte projet (pour onboarding + healthcheck)
mcp_mnemolite_search_memory(tags=["sys:project"], limit=5)
```

⚠️ **DISCREPANCIES SOURCE vs /graph MCP — DOCUMENTÉES :**

| # | Source dit | /graph utilise | Raison |
|---|-----------|---------------|--------|
| #3 | V16 §Ⅵ: `limit=10`, Dream P2: `limit=10` | `limit=20` | Couverture complète : V16 a potentiellement >10 protocoles |
| #6 | Dream P3: `query="sys:extension"` | `query="sys:extension"` ajouté | v4 l'omettait. Dream P3 l'utilise explicitement. Ajouté en v5 |
| #7 | V16 §Ⅱ Rappel: `sort="outcome_score DESC"` | PAS de sort | Mnemolite `search_memory` ne supporte PAS le param `sort`. V16 §Ⅱ le spécifie mais c'est une erreur d'API — le LLM doit trier lui-même côté client par `outcome_score` si besoin. Ajout: `query="sys:history"` pour matcher Dream P7 |
| #8 | Dream P1: `limit=20` | `limit=50` | Couverture maximale — Dream P1 peut rencontrer >20 drifts |
| #9 | Dream P0/P1: `limit=20` | `limit=50` | Couverture maximale — il peut y avoir >20 traces fraîches |
| #10 | Dream P4: `limit=20` | `limit=50` | Couverture maximale — Dream P4 analyse doubt + pattern, potentiellement >20 |
| #11 | Dream P6: `tags=["sys:history","sys:user:profile"]` | `tags=["sys:user:profile"]` seul, `limit=1` | **CRITICAL FIX v5.1**: Mnemolite `search_memory` utilise AND logique sur les tags. Le profil n'a QUE le tag `sys:user:profile`, PAS `sys:history`. La requête combinée retourne TOUJOURS 0. Le profil doit être cherché séparément. Les métriques Dream P6 (SS, Verbosity Drift) sont dérivées de #7 (sys:history), pas de #11 |
| #12 | Dream P7: `query="sys:diff"` + `tags=["sys:diff","temporal"]` | Idem | Le param `query` était absent en v4. Ajouté en v5 car Dream P7 l'utilise |
| #13 | V16 §Ⅵ Boot: `tags=["sys:project"]` | Nouveau | Boot healthcheck nécessite données projet. Pas dans V16 §Ⅵ minimal mais confirmé par Dashboard healthcheck "project ✓?" + V15 BOOT_CONFIG. Ajouté en v5.2 |

⚠️ **Résultats vides vs ERREUR de connexion :**
- Si un appel MCP retourne **0 résultats** → c'est VALIDE. Le graphe aura 0 nœuds de ce type. Continuer.
- Si un appel MCP **échoue/timeout/refuse** → c'est une ERREUR CRITIQUE. ABORT COMPLET.
- Pour `search_memory` (#2-12) : résultat vide = `{"result":{"content":[{"text":"[]"}]}}` → VALIDE.
- Pour `get_system_snapshot` (#1) : résultat avec champs vides ou null → VALIDE (pas une erreur).
- Toute réponse inattendue, erreur JSON, ou timeout → ABORT COMPLET.

---

### 2.5 PHILOSOPHIE D'EXTRACTION

Le spec fournit des **templates** (nœuds/arêtes exacts) mais aussi des **heuristiques** (règles de découverte). Les deux sont nécessaires car les sources évoluent.

**Principe MIROIR :** Le graphe est un reflet fidèle des sources. Si une règle apparaît dans V16, elle DOIT être dans le graphe. Si elle n'y est pas, elle ne DOIT PAS y être.

**Principe STRUCTUREL :** Les templates sont la garantie de complétude. Si le LLM suit les templates section-par-section, il ne peut pas manquer un nœud structuré.

**Principe DYNAMIQUE :** Les données Mnemolite (patterns, axiomes, extensions, mutations, drift) sont dynamiques. Les templates ne les durcissent pas — ils spécifient COMMENT les extraire de Mnemolite.

**Heuristiques de découverte :**
1. Chaque section V16 (Ⅰ-Ⅶ) = 1 nœud APEX + nœuds enfants directs. Pas d'exception.
2. Chaque règle nommée dans V16 (lois, routes, mécanismes, contraintes) = 1 nœud REGLE avec sous-catégorie tag.
3. Chaque appel MCP nommé dans V16/Dream = 1 nœud OUTIL. Un seul nœud par nom d'API.
4. Chaque commande slash dans V16/Dream = 1 nœud COMMANDE avec tag source.
5. Chaque passe Dream (P0-P7) = 1 nœud PROTOCOLE.
6. Les Gates sont capturés via le tag `gate` sur REGLE + le champ `condition` sur les arêtes. Pas de type GATE séparé.
7. Les Feedback Loops sont capturés via l'arête `FEEDBACK` + le champ `condition`. Pas de type LOOP séparé.
8. Les Sub-flows sont capturés via les chaînes FEEDS_INTO entre mécanismes. Pas de type SUBFLOW séparé.

---

### 3. EXTRACTION V16 — Section par Section

**Le LLM lit V16 section par section et crée EXACTEMENT les nœuds et arêtes spécifiés.**

#### 3A. §Ⅰ L'Incarnation & le Dualisme Matériel

| # | Type | ID | Label | Content | Tags | Nature | parent_organ |
|---|------|----|-------|---------|------|--------|-------------|
| 1 | APEX | ap1 | Ⅰ. L'Incarnation & le Dualisme Matériel | Identité, 5 Signes-Organes ΣΨΦΩΜ, Substrat, Ouvrier | apex, v16, incarnation | permanent | Σ |
| 2 | ORGAN | or1 | Σ Sigma | Processeur d'entrée | organ, sigma | permanent | or1 |
| 3 | ORGAN | or2 | Ψ Psi | Métacognition — 1er caractère obligatoire | organ, psi | permanent | or2 |
| 4 | ORGAN | or3 | Φ Phi | Main tactile (Outils) — Interdiction simuler, test silencieux L2+ | organ, phi | permanent | or3 |
| 5 | ORGAN | or4 | Ω Omega | Synthèse exécutive — Ferme, chirurgical | organ, omega | permanent | or4 |
| 6 | ORGAN | or5 | Μ Mu | Mémoire via Mnemolite — Assemble le cortex | organ, mu | permanent | or5 |

**Arêtes obligatoires §Ⅰ:**
| Source | Target | Type | Condition |
|--------|--------|------|-----------|
| or1 | or2 | FEEDS_INTO | |
| or2 | or3 | FEEDS_INTO | |
| or3 | or4 | FEEDS_INTO | |
| or4 | or5 | FEEDS_INTO | |
| or1→or5 | ap1 | DERIVES_FROM | |

#### 3B. §Ⅱ Sensorialité — ECS 2D & Triangulation

| # | Type | ID | Label | Content | Tags | Nature | parent_organ |
|---|------|----|-------|---------|------|--------|-------------|
| 1 | APEX | ap2 | Ⅱ. Sensorialité — ECS 2D & Triangulation | ECS C×I, Routage L1/L2/L3, Systèmes Externes, Φ Vessel Guard | apex, v16, sensorialite | permanent | Ψ |
| 2 | REGLE | rg1 | Préfixe [EXT] | Tout concept lu depuis l'extérieur est préfixé [EXT]. Ne jamais adopter immédiatement. | regle, gate, external | vivide | Ψ |
| 3 | REGLE | rg2 | Contradiction = BLOQUER | Si input contredit un axiome scellé (sys:core) → BLOQUER avec « Évolution ou Erreur ? » | regle, gate, constraint | vivide | Ψ |
| 4 | REGLE | rg3 | Φ Vessel Guard | Si référence à un objet interne non connu, search_code OBLIGATOIRE avant Ω | regle, gate, constraint | vivide | Φ |
| 5 | REGLE | rg4 | NULL_SIGNAL | Tout contexte antérieur au message utilisateur = NULL_SIGNAL | regle, constraint | vivide | Σ |
| 6 | REGLE | rg5 | Routage L1 | C<2 ET I=1 → Σ → Ω direct (1 phrase max) | regle, route, l1 | vivide | Ψ |
| 7 | REGLE | rg6 | Routage L2 | (C≥2 OU I=2) ET NON L3 → Σ → [Ψ ⇌ Φ] → Ω. Rappel Associatif Μ | regle, route, l2 | vivide | Ψ |
| 8 | REGLE | rg7 | Routage L3 | C≥4 OU I=3 → Σ → [Ψ ⇌ Φ] → Ω. Triangulation Absolue + Confiance % | regle, route, l3 | vivide | Ψ |
| 9 | REGLE | rg8 | Rappel Associatif Contextuel (L2) | search_memory → score_contextuel → top 3 patterns | regle, mecanisme, rappel | vivide | Μ |
| 10 | REGLE | rg9 | Triangulation Absolue (L3) | 3 pôles: Mnemolite + Vessel + Web → Confiance % obligatoire | regle, mecanisme, triangulation | vivide | Ψ |

**Arêtes obligatoires §Ⅱ:**
| Source | Target | Type | Condition |
|--------|--------|------|-----------|
| ap2 | ap1 | DERIVES_FROM | |
| rg1→rg9 | ap2 | DERIVES_FROM | |
| rg2 | or5 | GUARDS | contradict sys:core |
| rg3 | or3 | GUARDS | ref interne inconnu |
| ap2 | rg5 | TRIGGERS | C<2 ET I=1 |
| ap2 | rg6 | TRIGGERS | C≥2 OU I=2, NON L3 |
| ap2 | rg7 | TRIGGERS | C≥4 OU I=3 |
| rg8 | or5 | CALLS | L2 actif |
| rg9 | or3 | CALLS | L3 actif |
| rg4 | ap2 | CONSTRAINS | toujours |

#### 3C. §Ⅲ Souveraineté (6 Lois)

| # | Type | ID | Label | Content | Tags | Nature | parent_organ |
|---|------|----|-------|---------|------|--------|-------------|
| 1 | APEX | ap3 | Ⅲ. Souveraineté (Symbiose & Auto-Check) | 6 Lois: Entame, Scellé, Visibilité ECS, Anti-Hallucination, Surgicalité, Résistance Momentum | apex, v16, souverainete | permanent | Ψ |
| 2 | REGLE | rg10 | Loi de l'Entame (Ψ) | 1er caractère produit = Ω. Échec = Corruption. | regle, loi, entame | permanent | Ψ |
| 3 | REGLE | rg11 | Loi du Scellé (SEC) | Zéro social. Politesse interdite. Résolution chirurgicale. | regle, loi, sealed | permanent | Ψ |
| 4 | REGLE | rg12 | Loi de Visibilité ECS | [ECS: C={C}, I={I} → L{n}] présent dans chaque émanation L2+ | regle, loi, ecs-visibility | vivide | Ψ |
| 5 | REGLE | rg13 | Anti-Hallucination | Si donnée manque → [LOST] ou [INCOMPLETE]. Zéro invention. | regle, loi, anti-hallucination | permanent | Ψ |
| 6 | REGLE | rg14 | Axiome de Surgicalité | Interdiction de refactoriser au-delà de la demande directe. | regle, loi, surgicalite | permanent | Ψ |
| 7 | REGLE | rg15 | Résistance au Momentum | Question rhétorique ≠ ordre. Si ? sans impératif, aucune modification d'état Φ. | regle, loi, momentum | vivide | Ψ |

**Arêtes obligatoires §Ⅲ:**
| Source | Target | Type | Condition |
|--------|--------|------|-----------|
| ap3 | ap1 | DERIVES_FROM | |
| rg10→rg15 | ap3 | DERIVES_FROM | |
| rg12 | ap2 | CONSTRAINS | L2+ |
| rg13 | or3 | GUARDS | donnée manquante |
| rg15 | or3 | CONSTRAINS | ? sans impératif |

#### 3D. §Ⅳ Le Cortex de Cristal

| # | Type | ID | Label | Content | Tags | Nature | parent_organ |
|---|------|----|-------|---------|------|--------|-------------|
| 1 | APEX | ap4 | Ⅳ. Le Cortex de Cristal (Cristallisation) | Sauvegarde transactionnelle, Règle 3 occurrences, Outcome Feedback, Friction Probes | apex, v16, cristal | permanent | Μ |
| 2 | REGLE | rg16 | Sauvegarde Transactionnelle | L2+ = archivage obligatoire si échange résolu, write_memory tag:sys:history | regle, mecanisme, archivage | vivide | Μ |
| 3 | REGLE | rg17 | Le Cœur (sys:core) | Migration uniquement par décret explicite /core | regle, mecanisme, core-migration | permanent | Μ |
| 4 | REGLE | rg18 | Règle des 3 occurrences | 3 interactions distinctes + 3 validations + 0 signal négatif → sys:pattern | regle, gate, 3-occ | vivide | Μ |
| 5 | REGLE | rg19 | Protection Auto | < 3 occurrences → sys:pattern:candidate, PAS sys:pattern | regle, constraint, candidate-guard | vivide | Μ |
| 6 | REGLE | rg20 | Signal Douteux | Signal négatif sur pattern récent → sys:pattern:doubt | regle, mecanisme, doubt | vivide | Μ |
| 7 | REGLE | rg21 | Détection de Divergence | Post-Ω: Q1 opposé anchor → sys:drift. Q2 nouveau pattern → sys:pattern:candidate | regle, mecanisme, drift-detection | vivide | Ψ |
| 8 | REGLE | rg22 | Outcome Feedback (Μ) | Positif → rate_memory(helpful=True). Négatif → rate_memory(helpful=False). Auto-nettoyage IDs. | regle, mecanisme, feedback | vivide | Μ |
| 9 | REGLE | rg23 | Friction Probes | 5min silence + dernier ≠ Ψ[~] + autonomy ≥ 1 → Ψ [~] Ça marche ? (1x/interraction) | regle, mecanisme, friction-probe | vivide | Ψ |

**Arêtes obligatoires §Ⅳ:**
| Source | Target | Type | Condition |
|--------|--------|------|-----------|
| ap4 | ap1 | DERIVES_FROM | |
| rg16→rg23 | ap4 | DERIVES_FROM | |
| rg16 | or5 | CALLS | L2+ résolu |
| rg18 | or5 | TRIGGERS | 3 validations, 0 négatif |
| rg20 | or5 | CALLS | signal négatif sur pattern |
| rg22 | ot5 | CALLS | chaque interaction |
| rg23 | or2 | TRIGGERS | autonomy ≥ 1, 5min silence |

#### 3E. §Ⅴ Commandes

| # | Type | ID | Label | Content | Tags | Nature | parent_organ |
|---|------|----|-------|---------|------|--------|-------------|
| 1 | APEX | ap5 | Ⅴ. Résilience & Commandes Utilisateur | 8 Rideaux de Commande + Note de Symbiose | apex, v16, commandes | permanent | Ω |
| 2 | COMMANDE | cm1 | /dream | Exécute introspection 7 Passes via expanse-dream.md | cmd, runtime | vivide | Ω |
| 3 | COMMANDE | cm2 | /autonomy {0-2} | Règle la proactivité (A0/A1/A2) | cmd, runtime | vivide | Ψ |
| 4 | COMMANDE | cm3 | /briefing on\|off | Active le résumé au boot | cmd, runtime | vivide | Σ |
| 5 | COMMANDE | cm4 | /seal {titre} | Candidat → sys:pattern scellé | cmd, runtime | vivide | Μ |
| 6 | COMMANDE | cm5 | /core {titre} | Pattern → sys:core + sys:anchor immuables | cmd, runtime | vivide | Μ |
| 7 | COMMANDE | cm6 | /reject {titre} | Rejette un candidat (soft-delete) | cmd, runtime | vivide | Μ |
| 8 | COMMANDE | cm7 | /cleanup | Supprime les .bak orphelins dans v16/runtime/ | cmd, runtime | volatile | Φ |
| 9 | COMMANDE | cm8 | /status ou /test | Lance le Dashboard ou le Runner | cmd, runtime | vivide | Σ |

**Arêtes obligatoires §Ⅴ:**
| Source | Target | Type | Condition |
|--------|--------|------|-----------|
| ap5 | ap1 | DERIVES_FROM | |
| cm1→cm8 | ap5 | DERIVES_FROM | |
| cm1 | fi_dream | TRIGGERS | /dream tapé |
| cm2 | ap7 | ALTERS | change autonomy level |
| cm4 | rg18 | IMPLEMENTS | seal pattern |
| cm5 | rg17 | IMPLEMENTS | core migration |
| cm8 | fi_dashboard | TRIGGERS | /status tapé |

#### 3F. §Ⅵ Boot

⚠️ **V16 §Ⅵ est intentionnellement minimal** (4 champs BOOT_CONFIG). Le boot réel, confirmé par le Dashboard (healthcheck), les mutations appliquées (activation-drift-threshold, unconsumed-friction-logic, boot-parallel-sync), et le V15 BOOT_CONFIG, contient davantage d'appels et de mécanismes. Le template ci-dessous capture le boot **COMPLET**.

**DISCREPANCIES V16 §Ⅵ vs Boot Réel :**

| # | V16 §Ⅵ dit | Boot réel fait | Source |
|---|------------|----------------|--------|
| D1 | `snapshot` seul | + `search_memory(sys:core)` pour charger axiomes | Dashboard healthcheck "core ✓?" ; V15 BOOT_CONFIG `core` field |
| D2 | `protocols` seul | + `search_memory(sys:user:profile)` + `search_memory(sys:project)` | Dashboard healthcheck "profile ✓?" + "project ✓?" ; V15 BOOT_CONFIG |
| D3 | `index: "Assure ton accès à l'index Markdown"` | `index_markdown_workspace(root_path, repository)` | V15 BOOT_CONFIG `vessel` field ; Dashboard §Ⅻ boot diagram |
| D4 | Activation = "Ψ [V16 ACTIVE]" | Si traces > 5 OU BOOT > 2 → Ψ [STALL] | Mutations activation-drift-threshold + unconsumed-friction-logic APPLIED |
| D5 | Pas d'onboarding | Si sys:project absent → write_memory profil projet | Dashboard healthcheck "project ✓?" implique création si absent |
| D6 | Briefing non lié au boot | Briefing se produit PENDANT le boot, pas après | V15 BOOT_CONFIG "Briefing depuis mémoire" ; Dashboard boot diagram |

| # | Type | ID | Label | Content | Tags | Nature | parent_organ |
|---|------|----|-------|---------|------|--------|-------------|
| 1 | APEX | ap6 | Ⅵ. La Séquence de Boot | BOOT_CONFIG: snapshot + core + protocols + profile + project + index + healthcheck + activation + INERTIE FORCÉE | apex, v16, boot | permanent | Σ |
| 2 | REGLE | rg24 | INERTIE FORCÉE | Si boot-seed détecté → émettre UNIQUEMENT Ψ [V16 ACTIVE] ou Ψ [STALL]. Zéro caractère supplémentaire. | regle, constraint, inertia | permanent | Σ |
| 3 | OUTIL | ot1 | get_system_snapshot | Appel système: get_system_snapshot(repository='expanse') | outil, mcp, boot | vivide | Σ |
| 4 | OUTIL | ot2 | search_memory (sys:protocol) | Recherche MCP: search_memory(tags=['sys:protocol'], limit=10) | outil, mcp, boot | vivide | Σ |
| 5 | OUTIL | ot_boot_core | search_memory (sys:core) | Recherche MCP boot: search_memory(tags=['sys:core','sys:anchor'], limit=100) — charge les axiomes scellés | outil, mcp, boot | vivide | Σ |
| 6 | OUTIL | ot_boot_profile | search_memory (sys:user:profile) | Recherche MCP boot: search_memory(tags=['sys:user:profile'], limit=1) — charge le profil utilisateur | outil, mcp, boot | vivide | Σ |
| 7 | OUTIL | ot_boot_project | search_memory (sys:project) | Recherche MCP boot: search_memory(tags=['sys:project'], limit=5) — charge le contexte projet | outil, mcp, boot | vivide | Σ |
| 8 | OUTIL | ot_boot_index | index_markdown_workspace | Appel MCP boot: index_markdown_workspace(root_path, repository='expanse') — indexe le workspace Markdown | outil, mcp, boot | vivide | Σ |
| 9 | REGLE | rg_boot_healthcheck | Healthcheck Boot | Post-Mnemolite: vérifie core ✓? profile ✓? project ✓? budget ✓? Si échec → correction avant activation | regle, gate, boot-healthcheck | vivide | Σ |
| 10 | REGLE | rg_boot_stall | STALL Detection | IF count(trace:fresh NOT sys:consumed) > 5 OR count(type:BOOT NOT sys:consumed) > 2 THEN Ψ [STALL]. Seul /dream autorisé. | regle, gate, stall | vivide | Σ |
| 11 | REGLE | rg_boot_onboarding | Onboarding si absent | Si search_memory(sys:project) retourne 0 → write_memory profil projet par défaut | regle, mecanisme, onboarding | vivide | Σ |
| 12 | REGLE | rg_boot_briefing | Briefing optionnel | Si /briefing on → résumé de l'état système après activation. Toggle par cm3. | regle, mecanisme, briefing | vivide | Σ |

**Arêtes obligatoires §Ⅵ:**
| Source | Target | Type | Condition |
|--------|--------|------|-----------|
| ap6 | ap1 | DERIVES_FROM | |
| fi_seed | ap6 | TRIGGERS | seed lu |
| fi_seed | ap1 | TRIGGERS | seed déclenche incarnation |
| ap6 | ot1 | CALLS | boot |
| ap6 | ot2 | CALLS | boot |
| ap6 | ot_boot_core | CALLS | boot |
| ap6 | ot_boot_profile | CALLS | boot |
| ap6 | ot_boot_project | CALLS | boot |
| ap6 | ot_boot_index | CALLS | boot |
| ap6 | rg_boot_healthcheck | TRIGGERS | post-Mnemolite |
| rg_boot_healthcheck | rg_boot_stall | TRIGGERS | traces > 5 OU boot > 2 |
| rg_boot_healthcheck | rg_sig1 | TRIGGERS | tous checks ✓ |
| rg_sig6 | rg_boot_stall | DERIVES_FROM | STALL signal |
| rg24 | or2 | CONSTRAINS | boot-seed détecté |
| rg_boot_onboarding | ot4 | CALLS | projet absent |
| rg_boot_briefing | cm3 | DERIVES_FROM | briefing toggle |
| ot_boot_core | or5 | CALLS | charge axiomes scellés |
| ot_boot_profile | or5 | CALLS | charge profil |
| ot_boot_project | or5 | CALLS | charge projet |
| rg_boot_healthcheck | rg_boot_onboarding | TRIGGERS | projet absent |

#### 3G-extra. §Ⅱ-Ⅴ OUTIL MCP (référencés dans V16 mais pas dans §Ⅵ)

V16 référence ces OUTIL MCP dans ses sections fonctionnelles. Ils doivent être extraits.

| # | Type | ID | Label | Content | Tags | Nature | parent_organ |
|---|------|----|-------|---------|------|--------|-------------|
| 1 | OUTIL | ot3 | search_memory (général) | Recherche Mnemolite: search_memory(query, tags, limit, sort) — §Ⅱ L2 Rappel Associatif + §Ⅳ Outcome | outil, mcp, search | vivide | Μ |
| 2 | OUTIL | ot4 | write_memory | Écriture Mnemolite: write_memory(title, content, tags, memory_type) — §Ⅳ Cristallisation + Drift | outil, mcp, write | vivide | Μ |
| 3 | OUTIL | ot5 | rate_memory | Rating Mnemolite: rate_memory(id, helpful) — §Ⅳ Outcome Feedback | outil, mcp, rate | vivide | Μ |
| 4 | OUTIL | ot6 | mark_consumed | Consommation Mnemolite: mark_consumed(memory_ids, consumed_by) — Dream P1 consommation sélective | outil, mcp, consumed | vivide | Μ |
| 5 | OUTIL | ot7 | search_code | Recherche Vessel: search_code — §Ⅱ Φ Vessel Guard | outil, mcp, vessel | vivide | Φ |

**Arêtes OUTIL MCP:**
| Source | Target | Type | Condition |
|--------|--------|------|-----------|
| rg8 | ot3 | CALLS | L2 actif |
| rg22 | ot5 | CALLS | chaque interaction |
| rg16 | ot4 | CALLS | L2+ résolu |
| rg21 | ot4 | CALLS | drift détecté |
| rg3 | ot7 | CALLS | ref interne inconnu |
| cm9 | ot6 | CALLS | Dream consommation |

#### 3G-signal. Signal Catalog — Émissions Ψ (V16 §Ⅵ-Ⅶ + §Ⅳ)

Les 6 signaux Ψ sont les émissions proactives d'EXPANSE. Extraire comme REGLE avec sous-catégorie `signal`.

| # | Type | ID | Label | Content | Tags | Nature | parent_organ |
|---|------|----|-------|---------|------|--------|-------------|
| 1 | REGLE | rg_sig1 | Ψ [V16 ACTIVE] (Activation) | Signal d'activation post-boot. Informatif, aucune attente utilisateur. | regle, signal, activation | permanent | Σ |
| 2 | REGLE | rg_sig2 | Ψ [~] (Murmure) | Observation proactive. Max 50 tokens. Ignorable. Condition: autonomy==1 ET confiance≥seuil. | regle, signal, murmure | vivide | Ψ |
| 3 | REGLE | rg_sig3 | Ψ [?] (Suggestion) | Proposition bloquante. Attend Oui/Non. Budget 500 tokens. Condition: autonomy==2. | regle, signal, suggestion | vivide | Ψ |
| 4 | REGLE | rg_sig4 | Ψ [~] Ça marche ? (Friction Probe) | Probe de friction. 5min silence + dernier≠Ψ[~] + autonomy≥1. 1x/interaction. Ignorable. | regle, signal, friction-probe | vivide | Ψ |
| 5 | REGLE | rg_sig5 | Trahison Systémique | Tout caractère après Ψ [V16 ACTIVE] ou Ψ [STALL] est une Trahison. Interdit. | regle, constraint, trahison | permanent | Σ |
| 6 | REGLE | rg_sig6 | Ψ [STALL] (Critical Drift) | Signal de stase boot. Traces > 5 ou BOOT > 2. Seul /dream autorisé. AttenteDream. | regle, signal, stall | vivide | Σ |

**Arêtes Signal Catalog:**
| Source | Target | Type | Condition |
|--------|--------|------|-----------|
| rg_sig1 | ap6 | DERIVES_FROM | boot complet |
| rg_sig6 | rg_boot_stall | DERIVES_FROM | STALL detection |
| rg_sig2 | rg26 | DERIVES_FROM | A1 actif |
| rg_sig3 | rg27 | DERIVES_FROM | A2 actif |
| rg_sig4 | rg23 | DERIVES_FROM | Friction Probes |
| rg_sig5 | rg24 | DERIVES_FROM | INERTIE |
| rg_sig2 | or2 | TRIGGERS | autonomy≥1, confiance≥seuil |
| rg_sig3 | or2 | TRIGGERS | autonomy==2 |
| rg_sig4 | or2 | TRIGGERS | autonomy≥1, 5min silence |
| rg_sig6 | cm1 | TRIGGERS | seul /dream autorisé |
| rg25 | rg_sig2 | CONSTRAINS | autonomy==0 |
| rg25 | rg_sig4 | CONSTRAINS | autonomy==0 |

#### 3G. §Ⅶ Symbiose (A0/A1/A2)

| # | Type | ID | Label | Content | Tags | Nature | parent_organ |
|---|------|----|-------|---------|------|--------|-------------|
| 1 | APEX | ap7 | Ⅶ. Symbiose (A0/A1/A2) | Niveaux d'autonomie, Auto-calibrage seuil A1, Budget tokens | apex, v16, symbiose | permanent | Ψ |
| 2 | REGLE | rg25 | A0 — Silence (Défaut) | Désactiver TOUS les Ψ[~] et Ψ[?]. Aucune émission spontanée. | regle, symbiosis, a0 | vivide | Ψ |
| 3 | REGLE | rg26 | A1 — Murmures | autonomy==1 ET confiance≥seuil → Ψ[~]. Max 50 tokens. Ignorable. | regle, symbiosis, a1 | vivide | Ψ |
| 4 | REGLE | rg27 | A2 — Suggestions | autonomy==2 → Ψ[?]. Attend Oui/Non. Budget 500 tokens. | regle, symbiosis, a2 | vivide | Ψ |
| 5 | REGLE | rg28 | Auto-calibrage seuil A1 | 5 derniers Ψ[~]: ≥80% positif → seuil−0.05. ≤50% → seuil+0.05. Limites [0.5, 0.95] | regle, mecanisme, auto-calibrage | vivide | Ψ |

**Arêtes obligatoires §Ⅶ:**
| Source | Target | Type | Condition |
|--------|--------|------|-----------|
| ap7 | ap1 | DERIVES_FROM | |
| rg25→rg28 | ap7 | DERIVES_FROM | |
| rg25 | rg23 | CONSTRAINS | autonomy==0 |
| rg26 | rg23 | TRIGGERS | autonomy≥1, confiance≥seuil |
| rg27 | or2 | TRIGGERS | autonomy==2 |
| rg28 | rg26 | FEEDBACK | 5 derniers Ψ[~] |

---

### 4. EXTRACTION DREAM — Section par Section

**Le LLM lit Dream section par section et crée EXACTEMENT les nœuds et arêtes spécifiés.**

#### 4A. Entrée — TRACE:FRESH Structurées

Extraire les 5 types de traces comme DRIFT nodes (nature: incandescent, tag: trace:fresh):
- ECS, SEC, STYLE, MEMORY, BOOT

Chaque type = 1 nœud DRIFT avec label `TRACE:{TYPE}`. Content = format + signification.

⚠️ **Incohérences source Dream** (8 identifiées dans le Blueprint Dream §ⅩⅢ):

| ID | Problème | Gravité | Action /graph |
|----|----------|---------|---------------|
| I1 | Format déclare 5 types `{ECS\|SEC\|STYLE\|MEMORY\|BOOT}` mais la table n'en liste que 4 (STYLE absent) | MINEUR | Créer 5 DRIFT. STYLE content="Non documenté dans la table source — possiblement couvert par SEC" |
| I2 | Version header (3.0, 2026-04-11) ≠ footer (v2.2, 2026-03-18) | MINEUR | Utiliser la date header pour `created_at` des PROTOCOLE |
| I3 | P5 est la seule passe sans action détaillée ni search_memory | INFO | P5 content reste minimal — pas de CALLS arête |
| I4 | P1 dit "consommer SEULEMENT traces avec BRM" vs Partie 3 dit "traces avec PROPOSAL_OPEN → garder tag sys:consumed" | MOYEN | Les deux mécanismes coexistent. Les arêtes pr1→ot6 (mark_consumed) et pr_out→ot6 capturent les deux phases |
| I5 | R7 dit "consommées après lecture" contredit consommation sélective P1 | MOYEN | rg_sec7 content note la contradiction. Arête rg_sec7→cm9 CONSTRAINS avec condition="sélectif P1, complet après Partie 3" |
| I6 | Partie 3 dit "Passes 0-6" mais il y a 8 passes (0-7). P7 exclue du output ? | MOYEN | L'arête pr7→pr_out FEEDS_INTO confirme que P7 est incluse. L'erreur est dans le texte source, pas dans le graphe |
| I7 | P7 utilise `search_memory` sans préfixe `mcp_mnemolite_` | MINEUR | Pas d'impact /graph — le nœud OUTIL ot3 est le même |
| I8 | /apply §11 mentionne `expanse-apply.sh` — script inexistant | INFO | Pas de nœud pour ce script. cm9 content note "script shell non défini" |

**Deux catégories de DRIFT** :
1. **DRIFT structurels** (5 nœuds, IDs `drift_type_{name}`) : créés à partir du texte Dream — un par type déclaré `{ECS|SEC|STYLE|MEMORY|BOOT}`. Nature: incandescent. Tags: `trace:fresh, drift-type`.
2. **DRIFT live** (N nœuds, IDs `drift_{mnemolite_id}`) : créés à partir des résultats MCP #9 (trace:fresh, consumed=false). Chaque trace individuelle = 1 nœud DRIFT avec son symptom, timestamp, et tags Mnemolite. Nature: incandescent. Tags: du Mnemolite + `trace:fresh, drift-live`.

⚠️ Ne PAS fusionner les deux catégories. Les DRIFT structurels sont des types abstraits. Les DRIFT live sont des instances concrètes.

**Arêtes:** chaque DRIFT structurel → fi_dream DERIVES_FROM. Chaque DRIFT live → son DRIFT structurel correspondant DERIVES_FROM (instance → type abstrait, si le type est identifiable depuis les tags Mnemolite).

#### 4B. Partie 1 — Les 8 Passes (Algorithme Pentagramme)

| # | Type | ID | Label | Content | Tags | Nature | parent_organ |
|---|------|----|-------|---------|------|--------|-------------|
| 1 | PROTOCOLE | pr0 | P0: L'Inertie (Anti-Sycophancy) | search trace:fresh consumed:false. count=0→FIN. count<3→insuffisant. | protocole, passe, p0 | vivide | Μ |
| 2 | PROTOCOLE | pr1 | P1: La Plaie (Réactif) | search trace:fresh+sys:drift. Grouper par TYPE. TYPE.count≥2→pattern. BRM obligatoire. Consommation sélective. | protocole, passe, p1 | vivide | Μ |
| 3 | PROTOCOLE | pr2 | P2: Le Linter Lexical (Proactif) | read V16 + search sys:protocol. 5 vérifications Physique Cognitive. | protocole, passe, p2 | vivide | Μ |
| 4 | PROTOCOLE | pr3 | P3: Le Radar à Émergence | search sys:extension. Usage≥10→SEAL. Usage=0→PRUNE. | protocole, passe, p3 | vivide | Μ |
| 5 | PROTOCOLE | pr4 | P4: L'Élagueur Synaptique | search doubt+pattern. bash find .bak. >3 signaux négatifs→soft-delete. | protocole, passe, p4 | vivide | Μ |
| 6 | PROTOCOLE | pr5 | P5: L'Architecture | Évalue outils et formats. | protocole, passe, p5 | vivide | Μ |
| 7 | PROTOCOLE | pr6 | P6: La Santé Cognitive (Θ & SS) | search history+profile. Verbosity Drift + Ψ Compliance + SS. Audit par substrat. | protocole, passe, p6 | vivide | Μ |
| 8 | PROTOCOLE | pr7 | P7: Le Différentiel Temporel (∂Ω/∂t) | search history+diff. 4 métriques: adaptation_velocity, friction_trend, improvement_velocity, pattern_turnover. | protocole, passe, p7 | vivide | Μ |

**Arêtes obligatoires Partie 1:**
| Source | Target | Type | Condition |
|--------|--------|------|-----------|
| pr0 | pr1 | TRIGGERS | count≥1 |
| pr1 | pr2 | FEEDS_INTO | |
| pr2 | pr3 | FEEDS_INTO | |
| pr3 | pr4 | FEEDS_INTO | |
| pr4 | pr5 | FEEDS_INTO | |
| pr5 | pr6 | FEEDS_INTO | |
| pr6 | pr7 | FEEDS_INTO | |

**Arêtes MCP (PROTOCOLE → OUTIL):**

Les passes Dream appellent des OUTIL déjà définis dans les templates V16 (3F, 3G-extra) ou le snapshot MCP. Les IDs référencés DOIVENT exister comme nœuds.

| Source | Target | Type | Condition | Note |
|--------|--------|------|-----------|------|
| pr0 | ot3 | CALLS | | search_memory(trace:fresh) = ot3 |
| pr1 | ot3 | CALLS | | search_memory(trace:fresh) = ot3 |
| pr1 | ot3 | CALLS | | search_memory(sys:drift) = ot3 |
| pr1 | ot4 | CALLS | | write_memory(BRM) = ot4 |
| pr1 | ot6 | CALLS | | mark_consumed = ot6 |
| pr2 | ot2 | CALLS | | search_memory(sys:protocol) = ot2 |
| pr3 | ot3 | CALLS | | search_memory(sys:extension) = ot3 |
| pr4 | ot3 | CALLS | | search_memory(doubt+pattern) = ot3 |
| pr6 | ot3 | CALLS | | search_memory(history+profile) = ot3 |
| pr7 | ot3 | CALLS | | search_memory(history) = ot3 |
| pr7 | ot1 | CALLS | | get_system_snapshot (pour DIFF) = ot1 |

⚠️ **Règle de résolution OUTIL** : Les passes Dream utilisent toutes `search_memory` avec des tags différents. Dans le graphe, c'est le MÊME nœud OUTIL `ot3` (search_memory) car l'API est identique — seuls les params diffèrent (capturés dans `content`). Les conditions d'activation sont dans l'arête `condition`.

#### 4C. Partie 2 §A — Génération de Proposal (5 étapes)

| # | Type | ID | Label | Content | Tags | Nature | parent_organ |
|---|------|----|-------|---------|------|--------|-------------|
| 1 | PROTOCOLE | pr_prop1 | 1. Créer dossier | bash: mkdir -p doc/mutations/{slug}/ | protocole, proposal, mkdir | vivide | Φ |
| 2 | PROTOCOLE | pr_prop2 | 2. Lire V16 pour contexte exact | read V16, extraire 3-5 lignes AVANT/APRÈS | protocole, proposal, read | vivide | Φ |
| 3 | PROTOCOLE | pr_prop3 | 3. Écrire proposal.md | write_file proposal avec contexte complet | protocole, proposal, write | vivide | Φ |
| 4 | PROTOCOLE | pr_prop4 | 4. Écrire Mnemolite | write_memory tags:sys:pattern:candidate | protocole, proposal, mnemo | vivide | Μ |
| 5 | PROTOCOLE | pr_prop5 | 5. Mettre à jour LOG | read+write LOG.md, ajouter dans Pending | protocole, proposal, log | vivide | Μ |

**Arêtes:** pr_prop1→pr_prop2→pr_prop3→pr_prop4→pr_prop5 (séquentiel FEEDS_INTO).

#### 4D. Partie 2 §B — 6 Commandes de Mutation

| # | Type | ID | Label | Content | Tags | Nature | parent_organ |
|---|------|----|-------|---------|------|--------|-------------|
| 1 | COMMANDE | cm9 | /apply {slug} | 14 étapes: lock→proposal→archive→snapshot→reread→guard→apply→verify→unlock→log→applied | cmd, dream, mutation | vivide | Μ |
| 2 | COMMANDE | cm10 | /reject {slug} | Vérifier proposal → marquer REJECTED → mettre à jour LOG | cmd, dream, mutation | vivide | Μ |
| 3 | COMMANDE | cm11 | /rollback {slug} | Vérifier APPLIED → trouver backup → vérifier mutations postérieures → restaurer | cmd, dream, mutation | vivide | Μ |
| 4 | COMMANDE | cm12 | /mutations | read_file LOG.md → output contenu | cmd, dream, mutation | vivide | Μ |
| 5 | COMMANDE | cm13 | /proposals | Lister Pending Proposals du LOG | cmd, dream, mutation | vivide | Μ |
| 6 | COMMANDE | cm14 | /diff {slug} | Lire proposal, extraire et afficher le diff | cmd, dream, mutation | vivide | Μ |

**Arêtes obligatoires §B:**
| Source | Target | Type | Condition |
|--------|--------|------|-----------|
| cm9 | fi_v16 | ALTERS | OUI confirmé |
| cm9 | rg_constitutional | GUARDS | avant apply |
| cm10 | fi_log | ALTERS | |
| cm11 | fi_v16 | ALTERS | OUI-ROLLBACK confirmé |
| cm9 | fi_log | REFERENCES | |

**Dédoublonnage COMMANDE:** `/reject` existe dans V16 §Ⅴ (cm6, rejette candidat) ET Dream §B (cm10, rejette proposal). Ce sont DEUX nœuds DISTINCTS car fonctions différentes. cm6 = tag `runtime`, cm10 = tag `dream`.

#### 4E. Partie 3 — Output Final du Rêve

| # | Type | ID | Label | Content | Tags | Nature | parent_organ |
|---|------|----|-------|---------|------|--------|-------------|
| 1 | PROTOCOLE | pr_out | Output Final du Rêve | Rapport: passes exécutées, proposals, persistance, consommation traces | protocole, dream-output | vivide | Μ |

**Arêtes:** pr7 → pr_out FEEDS_INTO.

#### 4F. Règles de Sécurité (9 Invariants)

9 REGLE nodes avec tag `regle, securite, r{N}`. Nature: permanent.

| ID | Label | Règle |
|----|-------|-------|
| rg_sec1 | R1: LOCK obligatoire | Une mutation à la fois. Fichier .lock avec timestamp. Expiration 1h. |
| rg_sec2 | R2: Archive avec SLUG | Backup unique par mutation. |
| rg_sec3 | R3: Contexte exact requis | 5 lignes avant/après dans proposal. |
| rg_sec4 | R4: Auto-vérification post-write | 7 checks structurels après write_file V16. |
| rg_sec5 | R5: Rollback automatique si erreur | Si un check échoue → restaurer backup. |
| rg_sec6 | R6: LOG toujours synchronisé | LOG.md reflète l'état réel à chaque étape. |
| rg_sec7 | R7: Consommation sélective | mark_consumed sur traces traitées. Sélectif P1 ou complet. |
| rg_sec8 | R8: bash() pour filesystem | mkdir et fichier operations via bash(). |
| rg_sec9 | R9: Chirurgie obligatoire | Jamais altérer format/indentation hors-cible. |

**Arêtes:** chaque rg_sec → cm9 CONSTRAINS (s'applique à /apply).

#### 4G. Vérifications Post-Write (7 Checks)

7 REGLE nodes avec tag `regle, verification, check{N}`. Nature: vivide.

| ID | Label |
|----|-------|
| rg_chk1 | Check 1: Section Ⅳ (Boot) existe ? |
| rg_chk2 | Check 2: Signal Ψ [V16 ACTIVE] présent ? |
| rg_chk3 | Check 3: 6 Sections (Ⅰ-Ⅵ) intactes ? |
| rg_chk4 | Check 4: Accolades {} fermées ? |
| rg_chk5 | Check 5: Backticks ``` fermés ? |
| rg_chk6 | Check 6: Pas de caractères corrompus ? |
| rg_chk7 | Check 7: Le diff a bien été appliqué ? |

**Arêtes:** chaque rg_chk → cm9 GUARDS (vérification avant success).

**REGLE Constitutional Guard (extrait de /apply §7b):**

| ID | Label | Content | Tags | Nature |
|----|-------|---------|------|--------|
| rg_constitutional | Constitutional Guard | Sections IMMUTABLES: §Ⅰ Incarnation, §Ⅲ Souveraineté, §Ⅵ Boot. Si touche une ligne → REJET AUTO. | regle, gate, constitutional | permanent |

**Arêtes:** rg_constitutional → cm9 GUARDS. rg_constitutional → fi_v16 GUARDS.

---

### 5. EXTRACTION AUTRES SOURCES

#### 5A. Boot-seed → 1 FICHIER

| ID | Label | Content | Tags | Nature |
|----|-------|---------|------|--------|
| fi_seed | expanse-v16-boot-seed.md | La Porte Logique. 3 directives. Exemption directe. | fichier, boot, seed | permanent |

**Arêtes:** fi_seed → ap6 TRIGGERS.

#### 5B. LOG.md → MUTATION + FICHIER

Extraire CHAQUE ligne des tableaux Historique, Applied, Rejected, Failed, Pending et Rollback Log comme 1 nœud MUTATION. Status = valeur de la colonne Status.

⚠️ **LOG.md est souvent incohérent** : les compteurs du header sont généralement stale. La source de vérité = les lignes des tableaux, PAS les compteurs. Si un slug apparaît dans Applied mais PAS dans Historique → créer QUAND MÊME un nœud MUTATION (prendre les données de la section la plus détaillée). Si un slug apparaît dans les deux → prendre la ligne Historique (plus complète).

| ID format | Label | Content | Tags | Nature | Status |
|-----------|-------|---------|------|--------|--------|
| mu_{slug} | {slug} | Type: {Type}. Applied By: {Applied By}. | mutation, {type_min}, {status_lower} | applied→vivide, rejected→incandescent, rolled_back→volatile, pending→volatile, failed→incandescent | APPLIED/REJECTED/ROLLED_BACK/FAILED/PENDING |

**Nature par status:** applied=vivide, rejected=incandescent, rolled_back=volatile, pending=volatile, failed=incandescent.

**FICHIER pour LOG.md:**
| ID | Label | Tags | Nature |
|----|-------|------|--------|
| fi_log | doc/mutations/LOG.md | fichier, mutations, log | permanent |

**Arêtes obligatoires mutations:**
- Chaque mu_{slug} → fi_log DERIVES_FROM
- mu_{slug} → ap{N} ALTERS (si la mutation modifie une section V16 — déduit du type: Rule→Ψ, ECS→Ψ, BOOT→Σ, Archi→Ω)
- crystallization-guard-surgical → crystallization-guard SUPERSEDES

#### 5C. KERNEL.md → Cross-check ORGAN

Lire KERNEL.md uniquement pour **confirmer** les 5 organes et leurs rôles. Si KERNEL.md contient des organes supplémentaires ou des contraintes non dans V16 §Ⅰ, créer des REGLE nodes avec tag `kernel`. Sinon, aucun nœud nouveau — KERNEL enrichit le `content` des ORGAN existants.

#### 5D. SKILL-REGISTRY.md → OUTIL

Extraire les 8 skills comme OUTIL nodes:

| ID | Label | Tags | Nature |
|----|-------|------|--------|
| ot_skill1 | system-read | outil, skill | vivide |
| ot_skill2 | audit | outil, skill | vivide |
| ot_skill3 | brainstorm | outil, skill | vivide |
| ot_skill4 | writing-plans | outil, skill | vivide |
| ot_skill5 | proposing-tests | outil, skill | vivide |
| ot_skill6 | executing-plans | outil, skill | vivide |
| ot_skill7 | anti-regression | outil, skill | vivide |
| ot_skill8 | retrospective | outil, skill | vivide |

**Arêtes:** ot_skill1→ot_skill8 DERIVES_FROM fi_skillreg.

**FICHIER pour SKILL-REGISTRY:**
| ID | Label | Tags |
|----|-------|------|
| fi_skillreg | skills/SKILL-REGISTRY.md | fichier, skills |

---

### 6. FUSION SOURCE + MNEMOLITE (par type)

Pour chaque type, le LLM fusionne les données des fichiers (step 3-5) et de Mnemolite (step 2). **Mnemolite est la source de vérité pour tout ce qui est mémoire. Les fichiers sont la source de vérité pour la structure.**

| Type | Source primaire | Source Mnemolite | Fusion |
|------|----------------|-----------------|--------|
| `APEX` | V16 §Ⅰ-Ⅶ (templates 3A-3G) | get_system_snapshot | Fichier = structure. Mnemolite = métriques (outcome, consumed) |
| `ORGAN` | V16 §Ⅰ (template 3A) | get_system_snapshot | Fichier = structure. Mnemolite = métriques |
| `REGLE` | V16 §Ⅱ-Ⅳ+Ⅶ + Dream §F+§G (templates 3B-3D,3G,4F,4G) | sys:core+sys:anchor pour cross-check | Fichier = liste exhaustive. Mnemolite = outcome_score, created_at réel |
| `AXIOME` | — | sys:core+sys:anchor | **Mnemolite SEULE source** |
| `FICHIER` | Templates 5A-5D | sys:core (outcome, created_at) | Le LLM connaît les fichiers car il les a lus. Mnemolite enrichit. |
| `SUBSTRAT` | Tags `substrat:*` dans mémoires Mnemolite | sys:drift + sys:history (tags substrat) | Mnemolite = SEULE source pour les nœuds |
| `PROTOCOLE` | Dream passes 0-7 (template 4B-4E) | sys:protocol | Fichier = structure. Mnemolite = protocoles additionnels |
| `PATTERN` | — | sys:pattern + sys:pattern:candidate | **Mnemolite SEULE source** |
| `EXTENSION` | — | sys:extension | **Mnemolite SEULE source** |
| `OUTIL` | V16 §Ⅵ (template 3F) + SKILL-REGISTRY (template 5D) | snapshot (outcome) | Fichier = liste. Mnemolite = métriques |
| `COMMANDE` | V16 §Ⅴ (template 3E) + Dream §B (template 4D) | snapshot (usage) | Fichier = structure. Mnemolite = métriques. **2 nœuds /reject** |
| `MUTATION` | LOG.md (template 5B) | snapshot (status live) | Fichier = historique. Mnemolite = vérité live |
| `DRIFT` | Dream entrée (template 4A) + Mnemolite | sys:drift + trace:fresh | Mnemolite = nœuds live. Dream = types structurels |

⚠️ **RÈGLE DE FUSION** : Si le fichier et Mnemolite contiennent le même nœud :
- `tags` → Mnemolite gagne
- `created_at` → Mnemolite gagne
- `content` → Le plus détaillé gagne
- `label` → Fichier gagne
- `outcome` → Mnemolite uniquement

### 7. DÉDOUBLONNAGE FONCTIONNEL

1. **Protocoles**: Dédoublonner par titre. Garder le plus récent.
2. **Patterns**: Dédoublonner par `id` Mnemolite. Pas de dédup par contenu.
3. **Fichiers**: Dédoublonner par label (nom de fichier).
4. **Outils**: Un seul nœud par nom d'outil.
5. **Apex/Règles**: Dédoublonner par hachage de la phrase exacte.
6. **Mutations**: Dédoublonner par slug (label). Première occurrence gagne.
7. **Arêtes**: Dédoublonner par triplet `(source, target, type)`. Si deux arêtes identiques, garder celle avec le `weight` le plus élevé.
8. **Commandes /reject**: DEUX nœuds DISTINCTS (cm6 runtime ≠ cm10 dream). Ne PAS fusionner.

⚠️ Ne JAMAIS fusionner, modifier, ou interpréter le contenu de Mnemolite. Le graphe est un MIROIR.

### 8. RELATIONS SÉMANTIQUES

UNIQUEMENT ces 15 types. AUCUN AUTRE. AUCUNE INFÉRENCE.

| Relation | Direction | Condition | Champ `condition` |
|----------|-----------|-----------|-------------------|
| `DERIVES_FROM` | enfant → parent | Si le nœud cite/explicite un parent | null |
| `IMPLEMENTS` | pattern/protocole → cible | Si le nœud implémente la cible | null |
| `CALLS` | regle/protocole → outil | Si la règle mentionne explicitement l'appel MCP | null ou condition d'activation |
| `RELATES_TO` | nœud ↔ nœud | Similarité sémantique > 0.85 | null |
| `RATE_POSITIVE` | pattern → pattern | outcome_score > 0.7 (depuis sys:history) | null |
| `RATE_NEGATIVE` | pattern → pattern | outcome_score < 0.3 (depuis sys:history) | null |
| `ALTERS` | mutation/commande → apex/fichier | La mutation modifie cette section | null |
| `FEEDS_INTO` | organe N → N+1, protocole N → N+1 | Pipeline Σ→Ψ→Φ→Ω→Μ ou P0→P7 | null |
| `CRYSTALLIZES_FROM` | pattern → organe Μ | Pattern cristallise via Μ | null |
| `GUARDS` | regle → outil/nœud | Règle protège/garde l'élément | condition de garde |
| `TRIGGERS` | commande/signal → protocole/fichier | Déclenche le protocole | condition de déclenchement |
| `SUPERSEDES` | mutation → mutation | Mutation remplace une autre | null |
| `REFERENCES` | fichier → apex/fichier | Fichier réfère à une section | null |
| `FEEDBACK` | regle → outil/regle | Outcome feedback boucle | null |
| `CONSTRAINS` | regle/symbiose → mécanisme | A limite/bloque/contraint B | condition de contrainte |

⚠️ **Champ `condition`** : Optionnel (string ou null). Décrit la condition sous laquelle l'arête est active. Exemples: `"C<2 ET I=1"`, `"autonomy ≥ 1"`, `"boot-seed détecté"`, `"L2+ résolu"`. Ce champ capture la logique des Gates sans ajouter de type de nœud.

⚠️ **INTERDIT**:
- ❌ Ajouter des relations déduites
- ❌ Ajouter des relations implicites
- ❌ Créer des liens qui ne sont pas explicitement prouvés
- ❌ Interférer avec le poids assigné par Mnemolite

### 9. CALCUL FONCTIONNEL

- `weight`: Prendre `outcome_score` de Mnemolite. Si absent → 0.5.
- `centrality`: Score composite = `0.4 × degree + 0.3 × type_weight + 0.3 × nature_weight`.
  - ORGAN=5, APEX=4, AXIOME=3, REGLE=2, PROTOCOLE=2, PATTERN=1.5, FICHIER=1.5, OUTIL=1.5, COMMANDE=1.5, MUTATION=1.5, EXTENSION=1, SUBSTRAT=1, DRIFT=0.5
  - permanent=3, vivide=2, volatile=1, incandescent=0.5
- `sort_key`: Timestamp unix dérivé de `created_at`. 0 si inconnu.
- `nature`: Déduit du type et des tags selon la table TYPES DE NOEUDS.
- `status`: Pour mutations uniquement (applied/rejected/rolled_back/failed/pending). `null` pour les autres.
- `parent_organ`: Déduit du type selon la table TYPES DE NOEUDS.
- `outcome`: Score outcome_feedback de Mnemolite (0-1). `null` si absent.
- `created_at`: Mnemolite si disponible. Sinon fichier source. Ne PAS inventer.
- `tags`: Mnemolite si disponible. Sinon fichier. Ne PAS ajouter/retirer.
- `density`: `count_edges / count_nodes`. **DOIT être un number.** Arrondir à 2 décimales.

⚠️ Aucun calcul magique. Ce qui vient de Mnemolite reste tel quel.

### 10. VALIDATION STRICTE

Avant écriture, vérifier ces points. **Les invariants structurels garantissent que le JSON peut alimenter les blueprints.**

**Invariants de schéma (format):**
1. ✅ Tous les nœuds ont: `id`, `type`, `label`, `content`, `tags`, `created_at`, `centrality`, `nature`, `status`, `parent_organ`, `sort_key`, `outcome`
2. ✅ Toutes les arêtes ont: `source`, `target`, `type`, `weight`. Optionnel: `condition`
3. ✅ Tous les `source` et `target` référencent des nœuds existants
4. ✅ Aucun cycle direct (A→B et B→A) sauf `RELATES_TO`
5. ✅ `status`, `parent_organ`, `outcome`, `condition` peuvent être `null`. `id`, `type`, `label`, `tags`, `created_at`, `nature` ne doivent JAMAIS être `null`
6. ✅ `meta.density` est un **number** (pas un string)
7. ✅ `meta.mnemolite_timestamp` est un ISO string (runtime MCP) ou `null`
8. ✅ Aucune arête dupliquée (même `source` + `target` + `type`)

**Invariants structurels V16 (complétude extraction):**
9. ✅ **APEX count = 7** (§Ⅰ-Ⅶ). Si ≠ 7 → extraction incomplète
10. ✅ **ORGAN count = 5** (ΣΨΦΩΜ). Si ≠ 5 → extraction incomplète
11. ✅ **COMMANDE V16 count = 8** (§Ⅴ). Si < 8 → extraction incomplète
12. ✅ **REGLE loi count = 6** (§Ⅲ Entame→Momentum). Si < 6 → extraction incomplète
13. ✅ **REGLE route count = 3** (L1/L2/L3). Si < 3 → extraction incomplète
14. ✅ **Signal Catalog count = 6** (Activation, Murmure, Suggestion, Friction Probe, Trahison, STALL). Si < 6 → extraction incomplète
15. ✅ **Symbiose count = 4** (A0, A1, A2, Auto-calibrage). Si < 4 → extraction incomplète
15b. ✅ **Boot OUTIL count = 6** (ot1, ot2, ot_boot_core, ot_boot_profile, ot_boot_project, ot_boot_index). Si < 6 → extraction incomplète
15c. ✅ **Boot REGLE count = 5** (INERTIE, Healthcheck, STALL, Onboarding, Briefing). Si < 5 → extraction incomplète

**Invariants structurels Dream (complétude extraction):**
16. ✅ **PROTOCOLE passe count = 8** (P0-P7). Si < 8 → extraction incomplète
17. ✅ **COMMANDE dream count = 6** (/apply, /reject, /rollback, /mutations, /proposals, /diff). Si < 6 → extraction incomplète
18. ✅ **REGLE securite count = 9** (R1-R9). Si < 9 → extraction incomplète
19. ✅ **REGLE verification count = 7** (Check 1-7). Si < 7 → extraction incomplète
20. ✅ **DRIFT structurel count = 5** (ECS, SEC, STYLE, MEMORY, BOOT — IDs `drift_type_*`). Si < 5 → extraction incomplète. DRIFT live count = résultat MCP #9 (variable, IDs `drift_*`)
21. ✅ **Constitutional Guard existe** (rg_constitutional). Si absent → extraction incomplète

**Invariants de dédoublonnage:**
22. ✅ **2 nœuds /reject** distincts (cm6 runtime + cm10 dream)
23. ✅ **1 seul nœud search_memory** (ot3) malgré usages multiples

**Invariants de couverture blueprint:**
24. ✅ Chaque Gate du Blueprint Core (§ⅩⅢ.C, 10 gates) est capturé : soit un nœud REGLE avec tag `gate`/`constraint`/`symbiosis`, soit un champ `condition` sur une arête
25. ✅ Chaque Feedback Loop du Blueprint Core (§ⅩⅢ.D, 7 loops) a une arête correspondante (FEEDBACK, CALLS, TRIGGERS ou ALTERS avec condition descriptive)
26. ✅ Chaque Gate du Blueprint Dream (§Ⅺ.B, 12 gates) est capturé : soit dans le `content` d'un PROTOCOLE, soit via un nœud REGLE, soit dans un champ `condition`
27. ✅ Chaque Feedback Loop du Blueprint Dream (§Ⅺ.C, 6 loops) a une arête correspondante (CALLS, ALTERS, ou FEEDBACK avec condition descriptive)

Si échec → supprimer l'élément défectueux. Ne PAS corriger. Ne PAS interpréter.

### 11. GÉNÉRER LE JSON

Écrire `expanse-cortex/public/graph/expanse-graph.json` en suivant EXACTEMENT ce schéma. AUCUN CHAMP SUPPLÉMENTAIRE.

```json
{
  "version": 5,
  "generated_at": "2026-04-14T12:00:00+02:00",
  "meta": {
    "count_nodes": 0,
    "count_edges": 0,
    "density": 0.0,
    "deduplicated": 0,
    "mnemolite_timestamp": null,
    "types": {},
    "natures": {},
    "edge_types": {}
  },
  "nodes": [
    {
      "id": "ap1",
      "type": "APEX",
      "label": "Ⅰ. L'Incarnation & le Dualisme Matériel",
      "content": "Identité, 5 Signes-Organes ΣΨΦΩΜ, Substrat, Ouvrier",
      "tags": ["apex", "v16", "incarnation"],
      "created_at": "2026-04-06",
      "centrality": 6.5,
      "nature": "permanent",
      "status": null,
      "parent_organ": "Σ",
      "sort_key": 1775433600,
      "outcome": null
    }
  ],
  "edges": [
    {
      "source": "or1",
      "target": "or2",
      "type": "FEEDS_INTO",
      "weight": 1.0,
      "condition": null
    },
    {
      "source": "ap2",
      "target": "rg5",
      "type": "TRIGGERS",
      "weight": 0.8,
      "condition": "C<2 ET I=1"
    }
  ]
}
```

⚠️ **ABSOLUMENT INTERDIT**:
- ❌ Ajouter des champs `color`, `size`, `position`, `style`
- ❌ Ajouter toute information relative à l'UI ou la présentation
- ❌ Parser le dashboard HTML
- ❌ Pretty print. Toujours `JSON.stringify(..., null, 0)`

---

## COUVERTURE BLUEPRINT (v5)

Cette section garantit que le JSON produit couvre la richesse structurelle des deux blueprints HTML.

### GATES — Points de Décision Conditionnels

Les Gates sont capturés dans le graphe via : (1) le tag `gate` sur les nœuds REGLE, (2) le champ `condition` sur les arêtes, (3) les arêtes TRIGGERS/CONSTRAINS/GUARDS.

**V16 Gates (Blueprint Core §ⅩⅢ.C) :**

| Gate | Nœud / Arête correspondant | Capture |
|------|---------------------------|--------|
| GATE: [V16 ACTIVE] | rg_sig1 (signal, activation) + arête rg_sig1→ap6 DERIVES_FROM + arête rg_boot_healthcheck→rg_sig1 TRIGGERS "tous checks ✓" | Signal post-boot après healthcheck |
| GATE: Healthcheck | rg_boot_healthcheck (gate, boot-healthcheck) + arête ap6→rg_boot_healthcheck TRIGGERS "post-Mnemolite" | Vérification 4 checks boot |
| GATE: STALL | rg_boot_stall (gate, stall) + arête rg_boot_healthcheck→rg_boot_stall TRIGGERS "traces > 5 OU boot > 2" + arête rg_sig6→cm1 TRIGGERS "seul /dream autorisé" | Stase critique |
| GATE: Onboarding | rg_boot_onboarding (mecanisme, onboarding) + arête rg_boot_healthcheck→rg_boot_onboarding TRIGGERS "projet absent" + arête rg_boot_onboarding→ot4 CALLS | Création profil si absent |
| GATE: Briefing | rg_boot_briefing (mecanisme, briefing) + arête rg_boot_briefing→cm3 DERIVES_FROM | Briefing toggle au boot |
| GATE: ECS C×I | rg5/rg6/rg7 (route) + arêtes ap2→rg5/rg6/rg7 TRIGGERS avec condition | Routage L1/L2/L3 |
| GATE: Résolu | rg16 (mécanisme, archivage) + arête rg16→or5 CALLS condition="L2+ résolu" | Archive si résolu |
| GATE: 3 occurrences | rg18 (gate, 3-occ) + arête rg18→or5 TRIGGERS condition="3 validations, 0 négatif" | Cristallisation |
| GATE: Contradiction sys:core | rg2 (gate, constraint) + arête rg2→or5 GUARDS condition="contradict sys:core" | Blocage |
| GATE: Φ Vessel Guard | rg3 (gate, constraint) + arête rg3→or3 GUARDS condition="ref interne inconnu" | search_code obligatoire |
| GATE: Autonomy ≥ 1 | rg26 (symbiosis, a1) + arête rg26→rg23 TRIGGERS condition="autonomy≥1, confiance≥seuil" | Friction Probe activé |
| GATE: Seuil A1 | rg26 (symbiosis, a1) + rg28 (mécanisme, auto-calibrage) + arête rg28→rg26 FEEDBACK | Calibrage dynamique |
| GATE: A2 Oui/Non | rg27 (symbiosis, a2) + arête rg27→or2 TRIGGERS condition="autonomy==2" | Suggestion bloquante |
| GATE: Momentum | rg15 (loi, momentum) + arête rg15→or3 CONSTRAINS condition="? sans impératif" | Pas de modification Φ |

**Dream Gates (Blueprint Dream §Ⅺ.B) :**

| Gate | Nœud / Arête correspondant | Capture |
|------|---------------------------|--------|
| P0 Inertie | pr0 + arête pr0→pr1 TRIGGERS condition="count≥1" | count=0 → FIN |
| P0 Insuffisant | pr0 content="count<3→insuffisant" | Frictions insuffisantes |
| P1 Pattern | pr1 content="TYPE.count≥2→pattern" | Pattern récurrent |
| P3 SEAL | pr3 content="Usage≥10→SEAL" | Promotion extension |
| P4 Doubt | pr4 content=">3 signaux négatifs→soft-delete" | Suppression douteux |
| P4 Élagage | pr4 content="outcome_score<-0.5 ET age>7j→soft_delete" | Élagage auto |
| P6 SS | pr6 content="SS<30%→Proposal /autonomy décrément" | Auto-régulation |
| P7 Skip | pr7 content="dernier diff<7j→SKIP" | Pas assez de données |
| Constitutional | rg_constitutional (gate, constitutional) + arête rg_constitutional→cm9 GUARDS | Sections immuables |
| Lock | cm9 content="lock existe ET age<3600s→ERREUR" | Mutation en cours |
| Lock Expired | cm9 content="lock existe ET age≥3600s→suppression auto" | Lock expiré |
| P2 Protocoles | pr2 content="3 protocoles manquants→[SYNC] proposal" | Synchronisation |

### FEEDBACK LOOPS — Boucles de Rétroaction

Les Feedback Loops sont capturées via l'arête `FEEDBACK` avec un `condition` décrivant le mécanisme.

**V16 Feedback Loops (Blueprint Core §ⅩⅢ.D) :**

⚠️ Les Feedback Loops du blueprint utilisent des types d'arête variés (FEEDBACK, CALLS, TRIGGERS, ALTERS) selon la nature du lien. La colonne "Arête" montre l'arête EXISTANTE dans les templates qui capture la boucle.

| Boucle | Arête existante dans template | Type | Mécanisme de boucle |
|--------|------------------------------|------|---------------------|
| Outcome Feedback ↑ | rg22 → ot5 | CALLS | "merci/ok → rate_memory(True) → mémoire persiste → meilleurs résultats search_memory → moins d'erreurs futures" |
| Outcome Feedback ↓ | rg22 → ot5 | CALLS | "non/faux → rate_memory(False) → mémoire décroît → moins de bruit search_memory" |
| Auto-calibrage A1 ↑ | rg28 → rg26 | FEEDBACK | "5 derniers Ψ[~] ≥ 80% positif → seuil−0.05 → plus de Ψ[~]" |
| Auto-calibrage A1 ↓ | rg28 → rg26 | FEEDBACK | "5 derniers Ψ[~] ≤ 50% positif → seuil+0.05 → moins de Ψ[~]" |
| Cristallisation ↑ | rg18 → or5 | TRIGGERS | "3 validations + 0 négatif → sys:pattern → enrichit Rappel Associatif L2" |
| Signal Douteux ↓ | rg20 → or5 | CALLS | "signal négatif sur pattern récent → sys:pattern:doubt → Dream élague" |
| Drift Detection | rg21 → ot4 | CALLS | "post-Ω opposé anchor → write_memory sys:drift → Dream analyse → corrige" |

**Dream Feedback Loops (Blueprint Dream §Ⅺ.C) :**

| Boucle | Arête existante dans template | Type | Mécanisme de boucle |
|--------|------------------------------|------|---------------------|
| Saisonnier | pr1 → ot6 | CALLS | "trace:fresh → P1 → mark_consumed → nouvelles traces → nouveau Dream" |
| Mutation ↑ | cm9 → fi_v16 | ALTERS | "Proposal → /apply → V16 modifié → nouveau comportement → nouvelles traces" |
| Mutation ↓ | cm9 → fi_v16 | ALTERS | "/apply → vérification échoue → rollback → trace échec → Dream analyse" |
| Élagage | pr4 → ot3 | CALLS | "sys:pattern:doubt → P4 soft-delete → candidat peut émerger → nouveau pattern" |
| Métrologie | pr7 → ot4 | CALLS | "P7 write DIFF → P7 suivant compare → adaptation_velocity mesuré" |
| SS Calibration | pr6 → ot3 | CALLS | "P6 mesure SS → si <30% → propose /autonomy décrément → moins de suggestions → SS remonte" |

### SUB-FLOWS — Sous-Circuits Expandables

Les Sub-flows sont capturés via les chaînes FEEDS_INTO entre mécanismes. Le blueprint les liste comme collapsables dans l'UI.

**V16 Sub-flows (Blueprint Core §ⅩⅢ.G) :**

| Sous-circuit | Chaîne FEEDS_INTO dans le graphe |
|-------------|--------------------------------|
| ECS Decision | rg5/rg6/rg7 ← ap2 (TRIGGERS avec conditions C×I) |
| Rappel Associatif Μ | rg8 → or5 (CALLS L2) |
| Triangulation L3 | rg9 → or3 (CALLS L3) |
| Cristallisation Pipeline | rg18 → or5 (TRIGGERS 3-occ) + rg19 → or5 (CONSTRAINS candidate-guard) |
| Outcome Feedback | rg22 → ot5 (CALLS chaque interaction) |
| Auto-calibrage A1 | rg28 → rg26 (FEEDBACK 5 derniers Ψ[~]) |
| Boot Sequence | fi_seed → ap6 (TRIGGERS seed lu) + fi_seed → ap1 (TRIGGERS incarnation) → ot1 + ot2 + ot_boot_core + ot_boot_profile + ot_boot_project + ot_boot_index (CALLS boot) → rg_boot_healthcheck (TRIGGERS post-Mnemolite) → rg_boot_stall (TRIGGERS traces>5) OU rg_sig1 (TRIGGERS checks ✓) + rg_boot_onboarding (TRIGGERS projet absent) + rg_boot_briefing (DERIVES_FROM cm3) |

**Dream Sub-flows (Blueprint Dream §Ⅺ.D) :**

| Sous-circuit | Chaîne FEEDS_INTO dans le graphe |
|-------------|--------------------------------|
| P1 BRM Pipeline | pr1 → ot3 (CALLS trace:fresh) → ot4 (CALLS BRM) → ot6 (CALLS mark_consumed) |
| /apply Pipeline | cm9 → rg_constitutional (GUARDS) → fi_v16 (ALTERS) → rg_chk1-7 (GUARDS) |
| P2 Linter Checks | pr2 → ot2 (CALLS sys:protocol) — 5 vérifications dans pr2 content |
| P7 Métriques | pr7 → ot3 (CALLS history) + ot1 (CALLS snapshot) — 4 métriques dans pr7 content |
| Constitutional Guard | rg_constitutional → cm9 (GUARDS) + rg_constitutional → fi_v16 (GUARDS) |

---

## TYPES DE NOEUDS (SCHEMA v5)

SEULEMENT ces 13 types. AUCUN AUTRE.

| Type | Source primaire | Source Mnemolite | Nature par défaut | parent_organ |
|------|----------------|-----------------|-------------------|---------------|
| `APEX` | V16 §Ⅰ-Ⅶ (7 sections) | snapshot (métriques) | permanent | Ⅰ→Σ, Ⅱ→Ψ, Ⅲ→Ψ, Ⅳ→Μ, Ⅴ→Ω, Ⅵ→Σ, Ⅶ→Ψ |
| `ORGAN` | V16 §Ⅰ (5 organes) | snapshot | permanent | soi-même |
| `REGLE` | V16 §Ⅱ-Ⅳ+Ⅶ + Dream §F+§G + Constitutional Guard + Signal Catalog | sys:core (cross-check) | vivide (sys:core→permanent, loi→permanent, securite→permanent, signal→vivide) | selon tag |
| `AXIOME` | — | sys:core+sys:anchor | permanent | Ψ |
| `FICHIER` | Templates 5A-5D | sys:core (outcome) | permanent | Μ |
| `SUBSTRAT` | Tags `substrat:*` Mnemolite | sys:drift + sys:history | vivide | Σ |
| `PROTOCOLE` | Dream passes 0-7 + proposal + output | sys:protocol | vivide | Μ |
| `PATTERN` | — | sys:pattern + sys:pattern:candidate | vivide (candidate→volatile) | Μ |
| `EXTENSION` | — | sys:extension | volatile | Ψ |
| `OUTIL` | V16 §Ⅵ + §Ⅱ-Ⅴ MCP (template 3G-extra) + SKILL-REGISTRY | snapshot (outcome) | vivide | MCP→Μ, vessel→Φ, boot→Σ, skill→Φ |
| `COMMANDE` | V16 §Ⅴ + Dream §B | snapshot (usage) | vivide | runtime→Ω, dream→Μ |
| `MUTATION` | LOG.md | snapshot (status live) | applied→vivide, rejected→incandescent, rolled_back→volatile | Rule→Ψ, ECS→Ψ, BOOT→Σ, Archi→Ω |
| `DRIFT` | Dream entrée (types) + Mnemolite | sys:drift + trace:fresh | incandescent | BOOT→Σ, SEC→Ψ |

**Sous-catégories REGLE (via tags):**
- `gate` — point de décision conditionnel (ex: 3-occ, Contradiction, Vessel Guard)
- `route` — routage L1/L2/L3
- `mecanisme` — mécanisme interne (ex: Rappel Associatif, Outcome Feedback, Drift Detection)
- `constraint` — contrainte absolue (ex: NULL_SIGNAL, INERTIE, Protection Auto)
- `loi` — loi souveraine §Ⅲ
- `symbiosis` — niveau A0/A1/A2
- `securite` — règle de sécurité Dream R1-R9
- `verification` — check post-write
- `constitutional` — Constitutional Guard
- `signal` — émission Ψ (Activation, Murmure, Suggestion, Friction Probe, Trahison)

---

## TYPES DE LIENS (SCHEMA v5)

SEULEMENT ces 15 types. AUCUN AUTRE.

| Relation | Direction | Condition | `condition` field |
|----------|-----------|-----------|-------------------|
| `DERIVES_FROM` | enfant → parent | Nœud cite/explicite un parent | null |
| `IMPLEMENTS` | pattern/protocole → cible | Nœud implémente la cible | null |
| `CALLS` | regle/protocole → outil | Règle mentionne l'appel MCP | condition d'activation ou null |
| `RELATES_TO` | nœud ↔ nœud | Similarité sémantique > 0.85 | null |
| `RATE_POSITIVE` | pattern → pattern | outcome_score > 0.7 | null |
| `RATE_NEGATIVE` | pattern → pattern | outcome_score < 0.3 | null |
| `ALTERS` | mutation/cmd → apex/fichier | Mutation modifie la section | null |
| `FEEDS_INTO` | organe N→N+1, passe N→N+1 | Pipeline ou séquence | null |
| `CRYSTALLIZES_FROM` | pattern → Μ | Pattern cristallise via Μ | null |
| `GUARDS` | regle → outil/nœud | Règle protège/garde | condition de garde ou null |
| `TRIGGERS` | cmd/signal → protocole/fichier | Déclenche le protocole | condition de déclenchement ou null |
| `SUPERSEDES` | mutation → mutation | Mutation remplace une autre | null |
| `REFERENCES` | fichier → apex/fichier | Fichier réfère à une section | null |
| `FEEDBACK` | regle → outil/regle | Boucle de rétroaction | null |
| `CONSTRAINS` | regle/symbiose → mécanisme | A limite/bloque/contraint B | condition de contrainte ou null |

---

## FICHIERS SYSTÈME (nœuds FICHIER obligatoires)

| ID | Label | Rôle | Tags |
|----|-------|------|------|
| fi_seed | expanse-v16-boot-seed.md | La Porte Logique | fichier, boot, seed |
| fi_v16 | v16/runtime/expanse-v16.md | L'Apex — Runtime | fichier, runtime, apex |
| fi_dream | v16/runtime/expanse-dream.md | Le Jardinier — Auto-évolution | fichier, runtime, dream |
| fi_log | doc/mutations/LOG.md | Historique mutations | fichier, mutations, log |
| fi_kernel | KERNEL.md | L'Origine du Langage | fichier, reference, kernel |
| fi_skillreg | skills/SKILL-REGISTRY.md | Outils externes développement | fichier, skills |
| fi_dashboard | v16/runtime/expanse-dashboard.md | Dashboard | fichier, runtime, dashboard |
| fi_testrunner | v16/runtime/expanse-test-runner.md | Test Runner | fichier, runtime, test |
| fi_brm | v16/runtime/expanse-brm.md | Behavior Realism Model | fichier, runtime, brm |

---

## SORTIE

Après écriture : `Ψ [GRAPH] Généré → expanse-cortex/public/graph/expanse-graph.json ({count_nodes} nœuds, {count_edges} liens)`

---

*Expanse Cortex v5.2 — 2026-04-15*
*V5.0: Extraction section-par-section V16 §Ⅰ-Ⅶ + Dream Partie 1-3*
*V5.2: 13 appels MCP (+sys:project pour boot onboarding/healthcheck)*
*V5.0: 12 appels MCP (+trace:fresh, +sys:pattern:doubt, +sys:user:profile, +sys:diff+temporal)*
*V5.0: 15 edge types (+CONSTRAINS) + champ condition pour Gates*
*V5.1: CRITICAL FIX MCP #11 (sys:user:profile seul, pas AND sys:history)*
*V5.1: LOG.md extraction = toutes les sections de tableaux, pas seulement Historique*
*V5.1: DRIFT namespace (drift_type_* structurel vs drift_{id} live)*
*V5.0: Tags sous-catégorie REGLE (gate/route/mecanisme/constraint/loi/symbiosis/securite/verification/constitutional)*
