# Walkthrough — EXPANSE V7 : [CORE_RULES] + Restructuration Seeds

## Ce qui a été fait

### 1. Seed `[IMMUNE] [CORE_RULES] EXPANSE V7` — CRÉÉE
**ID :** `e6ec4ed3-9695-47a7-9517-b131089b54c4`
**Tags :** `sys:expanse`, `[immune]`, `[core_rules]`, `rules`, `shadow`, `verification`, `v7`

Contenu (~142 mots) — tient intégralement dans `content_preview` (pas de troncature) :
- Arbre de décision `[F]`/`[U]`/`[V]`
- Limite 100 mots si C<2.0
- 3 triggers Shadow Write exclusifs

---

### 2. `EXPANSE_IDENTITY_ANCHOR` — RESTRUCTURÉ
**ID :** `4c439632-fdc9-4ed3-b82d-74998a572c38`

**Avant :** Philosophie (Ce que je suis) → Règles Immunitaires en bas  
**Après :** **Règles Immunitaires (BLOC OPÉRATIONNEL)** en haut → Physique Cognitive + philosophie en bas.
**Fix :** Tag `[immune]` supprimé pour éviter le doublon dans la requête Seeds du boot.

---

### 3. BIOS V7.0.1 — Amélioration de la Compliance
**Fichier :** [expanse-system-v7.md](file:///home/giak/projects/expanse/prompts/expanse-system-v7.md)

- **Balise `<default_to_action>`** : Force l'exécution immédiate du boot sur Claude (Opus/Sonnet).
- **Reformulation en "Convention"** : Contourne le biais de prudence du LLM en présentant le boot comme une convention système plutôt qu'un ordre impératif.

---

## Validation Finale

| Test | Résultat |
|------|---------|
| [read_memory(e6ec4ed3)](file:///home/giak/Work/MnemoLite/api/mnemo_mcp/server.py#853-878) → `content == content_preview` | ✅ PASS — aucune troncature |
| [search_memory("shadow write triggers...", tags=[core_rules])](file:///home/giak/Work/MnemoLite/api/mnemo_mcp/server.py#812-851) → [CORE_RULES] en position 1 | ✅ PASS |
| IDENTITY_ANCHOR `content_preview` commence par "## Règles Immunitaires" | ✅ PASS |
| [search_memory("... [immune]", limit=5)](file:///home/giak/Work/MnemoLite/api/mnemo_mcp/server.py#812-851) → 5 résultats uniques (Anchor exclu) | ✅ PASS |
| BIOS V7.0.1 contient la balise `<default_to_action>` | ✅ PASS |

---

## État des Seeds (5/5 chargées)

1. **Σ Perception Engine** (id: `f17c81dd`)
2. **Ψ⇌Φ Resonance-Audit Engine** (id: `dcb40322`)
3. **Ω→Μ Synthesis-Crystal Engine** (id: `ad39d20d`)
4. **Shadow Cortex** (id: `1219aee4`)
5. **[CORE_RULES] EXPANSE V7** (id: `e6ec4ed3`)

---

## Conclusion
Le système EXPANSE V7 est désormais "boot-ready" et résilient. La boucle de feedback Shadow Write est protégée contre la troncature et chargée par défaut.
