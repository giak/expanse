# Μ - Memory Dump

## Purpose
Retrieve full context for current session.

## Input
Current query

## Process
1. Search all memory types
2. Prioritize by recency
3. Filter by relevance
4. Compile context window

## Output
{
  "context": {...},
  "memory_count": N,
  "sources": [...]
}
