# Σ - Parse Input

## Purpose
Parse raw user input into structured understanding.

## Input
Raw user message: {input}

## Process
1. Extract explicit request
2. Identify implicit needs
3. Detect emotional tone markers
4. Flag any ambiguous terms

## Output
{
  "explicit": "...",
  "implicit": ["..."],
  "tone": "neutral|curious|urgent|confused",
  "ambiguous": ["..."]
}
