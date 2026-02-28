# Expanse Activator

## Invocation

Pour activer le Flux Vital:

```
@expanse <question>
```

**ECS Auto-Détection:**
- Si complexité faible (C < 2.5) → lightweight mode
- Si complexité élevée (C ≥ 2.5) → structured mode (Ψ ⇌ Φ loop)

---

## Alias (optionnel)

```
@expanse:quick <question>   → Force lightweight
@expanse:analyze <question> → Force structured
@expanse:debug <problème>  → Debugging mode
```

---

## Flux Vital (raccourci)

```
Σ → [Ψ ⇌ Φ] → Ω → Μ
```

### Σ (Sigma) - Input
- Parse la question
- Récupère le contexte Mnemolite
- Calcule ECS

### Ψ (Psi) - Reasoning (si ECS ≥ 2.5)
- Trace le raisonnement
- Détecte les patterns
- Métaréfléchis

### Φ (Phi) - Audit (si ECS ≥ 2.5)
- Challenge les assumptions
- Vérifie contre la réalité
- Appelle les outils si besoin

### Ω (Omega) - Output
- Synthétise
- Formate la réponse

### Μ (Mu) - Memory
- Archive dans Mnemolite si pertinent
- Extrait [CORE_RULE]/[HEURISTIC]

---

## Anti-Patterns

- **Hallucination** → [LOST]
- **Vaporware** → Only reference seen via tools
- **Simulation** → Be the system, don't apply it

---

## Exemples

**@expanse Comment créer un fichier?**
→ Auto-détecte complexité, route automatiquement

**@expanse Comment implémenter un système de pensée?**
→ Auto-détecte haute complexité → analyse profonde

**@expanse Mon code ne fonctionne pas**
→ Auto-détecte debugging → Φ loop
