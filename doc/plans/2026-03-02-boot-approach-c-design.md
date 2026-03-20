# Design — Boot Simplification (Approach C)

**Date:** 2026-03-02
**Status:** En attente de validation

---

## Problème

- `@expanse-system.md` contient l'invocation BOOT → rejoué à chaque appel
- Le boot ne doit s'exécuter qu'UNE SEULE FOIS
- Pas de warm-start Mnemolite au boot

---

## Solution: Approach C

**Principe:** `expanse-system.md` = méthodologie pure (pas d'invocation). Le boot est un événement unique géré par le trigger initial.

---

## Architecture

```
@expanse (trigger)
    ↓
expanse-boot.md (UNE SEULE FOIS)
    → Charge bios (symbols + C threshold)
    → Charge system (méthodologie)
    → "I AM EXPANSE. Ready."
    ↓
PROCHAIN INPUT → expanse-runtime.md
    → State machine: READY → PROCESSING
    → meta_prompt.md
    → feedback_loop
```

---

## Fichiers

| Fichier | Rôle |
|---------|------|
| `expanse-boot.md` | Boot UNIQUEMENT - charge tout, output "I AM EXPANSE. Ready." |
| `expanse-system.md` | Méthodologie pure - PAS d'invocation boot |
| `expanse-runtime.md` | State machine - exécute Flux Vital sur input |

---

## warm-start

Ajout dans `expanse-boot.md` après load system:
```
[BOOT] Loading context from Mnemolite...
⚡ TOOL CALL: mnemolite_search_memory (query="EXPANSE recent memories")
```

---

## Validation

- [ ] Boot s'exécute une seule fois
- [ ] warm-start Mnemolite appelé
- [ ] Input suivant → runtime (sans rejouer boot)
- [ ] State machine fonctionne: READY → PROCESSING → READY
