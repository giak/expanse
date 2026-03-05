# Σ - Detect ECS (Evaluation of Cognitive Complexity)

## Purpose
Calculate complexity score to determine prompt sequence.

## Input
Parsed input from parse_input

## Process

### Step 1: Load Weights
If ecs_dyn=true:
- Try to load weights from Mnemolite (search for ECS_WEIGHTS)
- If unavailable, use default weights

**Default Weights:**
- w_amb (ambiguity): 0.25
- w_know (knowledge): 0.25
- w_reason (reasoning): 0.25
- w_tools (tools): 0.25

### Step 2: Evaluate Factors
Evaluate:
- Ambiguity level (1-5)
- Domain knowledge required (1-5)
- Multi-step reasoning needed (1-5)
- Tool interaction necessity (1-5)

### Step 3: Calculate Weighted Score
C = w_amb*amb + w_know*know + w_reason*reason + w_tools*tools

## Output

Ne produis **AUCUN** objet JSON. Formule une narration dense selon l'équation de densité définie dans le KERNEL.

**Format attendu :**
`Σ évalue la densité (C={score}) : [justification extrêmement courte]. Mode [léger|structuré] activé.`

**Exemples :**
- `Σ évalue la densité (C=1.2) : évidence arithmétique. Mode léger activé.`
- `Σ évalue la densité (C=3.8) : architecture inconnue, orchestration d'outils requise. Mode structuré activé.`

## Dynamic ECS (Optional)

If ecs_dyn=true:

1. Load weights from Mnemolite (or use default)
2. Calculate C with current weights
3. After cycle, compare predicted vs actual complexity
4. Adjust weights: `new = old * 0.9 + actual * 0.1`
5. Save updated weights to Mnemolite
