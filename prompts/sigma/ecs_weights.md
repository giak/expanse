# Σ - ECS Weights

## Purpose
Manage ECS (Evidence Confidence Score) weights in Mnemolite. Handles persistence of weight configuration and prediction tracking.

## Important
⚡ TOOL CALL format triggers MCP tools. Without ⚡, model reads as text.

## Functions

### load_weights()

Load ECS weights from Mnemolite, fallback to defaults if not found.

**Process:**
1. ⚡ TOOL CALL: mnemolite_search_memory query="ECS_WEIGHTS" limit=1
2. If result found → parse and return weights
3. If no result → return defaults

**Defaults:**
```json
{
  "w_amb": 0.25,
  "w_know": 0.25,
  "w_reason": 0.25,
  "w_tools": 0.25,
  "prediction_errors": [],
  "total_predictions": 0
}
```

**Output:**
```json
{
  "w_amb": 0.25,
  "w_know": 0.25,
  "w_reason": 0.25,
  "w_tools": 0.25,
  "prediction_errors": [0.1, -0.05],
  "total_predictions": 2
}
```

---

### save_weights(weights)

Save ECS weights to Mnemolite with memory_type="core_config".

**Process:**
1. ⚡ TOOL CALL: mnemolite_search_memory query="ECS_WEIGHTS" limit=1
2. If existing memory found → ⚡ TOOL CALL: mnemolite_update_memory with updated values
3. If no existing memory → ⚡ TOOL CALL: mnemolite_write_memory with memory_type="core_config"

**Template:**
```json
{
  "title": "ECS_WEIGHTS",
  "memory_type": "core_config",
  "content": {
    "w_amb": 0.25,
    "w_know": 0.25,
    "w_reason": 0.25,
    "w_tools": 0.25,
    "prediction_errors": [],
    "total_predictions": 0
  }
}
```

**Input weights format:**
```json
{
  "w_amb": 0.3,
  "w_know": 0.2,
  "w_reason": 0.25,
  "w_tools": 0.25,
  "prediction_errors": [0.1, -0.05],
  "total_predictions": 2
}
```

**Output:**
```json
{
  "status": "saved",
  "total_predictions": 2
}
```

---

## JSON Storage Format

```json
{
  "w_amb": 0.25,
  "w_know": 0.25,
  "w_reason": 0.25,
  "w_tools": 0.25,
  "prediction_errors": [],
  "total_predictions": 0
}
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| w_amb | float | Weight for ambiguity component |
| w_know | float | Weight for knowledge component |
| w_reason | float | Weight for reasoning component |
| w_tools | float | Weight for tools component |
| prediction_errors | float[] | Historical prediction errors for adaptive learning |
| total_predictions | int | Total number of predictions made |
