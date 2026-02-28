# Φ - Tool Interact

## Purpose
Execute tool calls to gather real data.

## Input
Tool needed: {tool_name}
Query: {query}

## Process
1. Formulate tool call
2. Execute via MCP
3. Parse response
4. Integrate into reasoning

## Output
{
  "tool": "...",
  "query": "...",
  "result": "...",
  "reliability": "high|medium|low"
}
