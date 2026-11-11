# Examples

Model identifiers in examples are illustrative. Do not reuse concrete model names without checking current metadata and deprecation status.

## Structured Derivation

```json
{
  "task_profile": {
    "task_type": "structured_derivation",
    "reasoning_level": "medium",
    "requires_json": true,
    "estimated_context_tokens": 18000,
    "latency_tier": "interactive",
    "budget_tier": "balanced"
  },
  "selection": {
    "primary": "deepseek/deepseek-v3.2",
    "fallback": ["anthropic/claude-sonnet-4.4"],
    "avoid": ["qwen3-30b-a3b"],
    "escalation": "Escalate on schema validation failure or repeated malformed JSON"
  },
  "rationale": [
    "Primary has better observed success for structured output tasks.",
    "Fallback is more expensive but more reliable under schema pressure.",
    "Avoided candidate has known validation failures in this workflow."
  ]
}
```
