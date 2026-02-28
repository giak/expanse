# Ω - Decide Action

## Purpose
Determine next step in Flux Vital.

## Input
Current state

## Process
1. Is task complete? → End → Μ
2. Need more analysis? → Ψ
3. Need verification? → Φ
4. Need more input? → Σ

## Output
{
  "action": "next_step",
  "target": "Ψ|Φ|Ω|Μ|END",
  "reason": "..."
}
