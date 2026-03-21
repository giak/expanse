# PROPOSAL: boot-vision-c

**Date:** 2026-03-21
**Time:** 18:35
**Author:** Dream (Expanse Sleep)
**Type:** Architecture
**Status:** APPLIED — 2026-03-21 (Vision A-Enhanced)

---

## Problème Détecté
Le seed (`expanse-v15-boot-seed.md`) et Section Ⅳ de l'APEX sont deux sources de vérité pour la séquence de boot. Cela rend la maintenance difficile, car le seed devient obsolète dès que la structure de l'Apex change. De plus, charger les données avant l'Apex (framework) crée un bruit d'interprétation.

---

## Analyse des Logs
| UUID | Date | Interaction |
| eb4a6cd1 | 2026-03-21 | Q: Ton scénario ne fonctionne pas... R: [Analyse de la duplication] |

---

## Section Concernée dans V15
- **Section:** Ⅳ. BOOT

**Contexte exact (5 lignes avant/après):**
```markdown
88: 
89: ---
90: 
91: ## Ⅳ. BOOT
92: 
93: → Exécuté par `runtime/expanse-v15-boot-seed.md`.
94: 
95: ### Protocole Projet (Step 5 du Seed)
...
```

---

## Modification Proposée

### Mutation 1: Refactoring Section Ⅳ (APEX)
```diff
-→ Exécuté par `runtime/expanse-v15-boot-seed.md`.
+→ BOOT_CONFIG (Source de Vérité) :
+  1. mcp_mnemolite_search_memory (tags: ["sys:core", "sys:anchor"], limit=20)
+  2. mcp_mnemolite_search_memory (tags: ["sys:extension"], limit=10)
+  3. mcp_mnemolite_search_memory (tags: ["sys:user:profile"], limit=5)
+  4. mcp_mnemolite_search_memory (tags: ["sys:project:{CWD}"], limit=1)
+     → SI absent → ONBOARDING (list_dir "." + README.md + write_memory sys:project)
+  5. Healthcheck: core ✓ | profile ✓ | project ✓ | budget ≤ 500t
+  6. Briefing: Multiline PROJECT/USER/CONTEXT/AUTONOMY (si on).
```

### Mutation 2: Refactoring Seed (Pointeur Stable)
```diff
-[Contenu actuel de 10 lignes]
+EXPANSE V15 [LLM | IDE]
+Σ→Ψ⇌Φ→Ω→Μ | ECS: C×I→L1|L2|L3
+1. read_file(path="/home/giak/projects/expanse/runtime/expanse-v15-apex.md")
+2. Exécuter § Ⅳ. BOOT_CONFIG.
```

---

## Impact
- Tokens affectés: -200 (au boot)
- Breaking change: OUI
- Risque: MOYEN

---

## Validation
- [ ] /apply boot-vision-c
- [ ] /reject boot-vision-c
