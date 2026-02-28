# Expanse Activator

## Invocation

Pour activer le Flux Vital, utilise ces markers:

```
@expanse:analyze <question>  → Mode analysis (ECS ≥ 2.5)
@expanse:quick <question>    → Mode lightweight (ECS < 2.5)
@expanse:debug <problème>    → Mode debugging avec Φ
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

**@expanse:quick Comment créer un fichier?**
→ Lightweight - réponse directe

**@expanse:analyze Comment implémenter un système de pensée?**
→ Structured - analyse profonde

**@expanse:debug Mon code ne fonctionne pas**
→ Debugging - cycle avec Φ
