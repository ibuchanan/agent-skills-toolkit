---
name: select-llm
description: Selects LLMs for tasks and agent roles by balancing cost, quality, and performance. Use when choosing a primary model, fallback, or routing policy under budget, latency, reliability, provider, or deployment constraints.
compatibility: Optional network access for live model research. API-backed mode requires Python 3 and an Artificial Analysis API key.
---

# Select LLM

> Paths like `references/...`, `scripts/...`, and `assets/...` in this file are relative to this `SKILL.md`'s directory.

Use this skill when you need to choose a model for a task, workflow, or agent role.

Prioritize:

- cost
- quality
- performance

Prefer the lowest-cost model that still meets the task's quality and performance needs.

The goal is not to pick a universally best model. The goal is to choose a model that fits the task shape, hard constraints, and operating budget.

## Core Rules

- Do not recommend a model only because it leads a benchmark.
- Prefer measured workflow reliability over benchmark prestige.
- Apply hard constraints before quality ranking.
- Treat dual hosted and local availability as a cost-optimization preference, not an absolute requirement.
- Do not assume advertised context limits equal practical limits.
- Do not collapse all agent roles onto one model without a clear reason.
- Escalate to stronger or more expensive models only when task complexity, stakes, or failure signals justify it.

## Inputs

Gather or infer:

- task type
- output format requirements
- expected context size
- latency sensitivity
- budget sensitivity
- reliability requirements
- privacy or deployment constraints
- provider constraints
- fallback availability
- current model catalog data

Use the task taxonomy in `references/taxonomy.md`.

## Data Sources

Combine two kinds of source material:

### 1. Stable task taxonomy

Use the reference taxonomy to classify the task in stable terms:

- primary activity
- complexity level
- operational constraints

This provides the conceptual vocabulary for task profiling even when the model roster changes quickly.

### 2. Current model metadata

Use current sources for live model facts such as:

- pricing
- availability
- context limits
- structured output support
- provider compatibility
- modality support
- release or deprecation status

Prefer `https://artificialanalysis.ai/` as the default current source for model research. Treat live sources as authoritative for fast-changing model metadata.

When API access is available, prefer the Artificial Analysis API for structured retrieval of current model data.

If using the free Artificial Analysis API:

- provide attribution to `https://artificialanalysis.ai/`
- keep API keys out of client-side code
- cache responses to reduce rate-limit pressure and avoid unnecessary key exposure
- use stable model and creator IDs as primary identifiers because names and slugs may change
- preserve a no-key fallback so the skill still works without API credentials

Preferred helper:

- `scripts/fetch-model-catalog.py`

See also:

- `references/live-data.md`

## Workflow

### 1. Classify The Task

Identify:

- task type
- output format requirements
- expected context size
- latency sensitivity
- budget sensitivity
- reliability requirements
- privacy or deployment constraints
- provider constraints

Also profile the minimum capability needed by evaluating:

- reasoning depth
- coding difficulty
- need for precise instruction following
- need for stable schema output
- need for long-context handling
- importance of factuality or hallucination resistance

The output of this step is a task profile rather than a model choice.

### 2. Gather Current Model Data

Use current model sources for live metadata such as:

- pricing
- availability
- context limits
- structured output support
- provider compatibility

Prefer `https://artificialanalysis.ai/` as the default current source for model research.

If an Artificial Analysis API key is configured, prefer the API over manual page research for machine-readable model metadata. Cache results and attribute the data source in generated materials that rely on the free API.

If no API key is configured, prefer a fresh checked-in snapshot, then public research and static references rather than failing. Treat snapshots older than 30 days as stale: still usable as a fallback, but call out the age and prefer live or public current sources for final model facts.

When available, use `scripts/fetch-model-catalog.py` to retrieve a normalized model catalog before ranking candidates.

### 3. Apply Hard Constraints

Exclude models that cannot satisfy hard requirements.

Examples:

- unsupported structured output
- insufficient practical context
- unacceptable cost or latency
- incompatible provider or deployment requirements
- known workflow-specific failures

Structured output is a major routing constraint. A model that is capable in general can still be disqualified if it is unreliable for schema-valid JSON or tool-call compatible content under pressure.

### 4. Rank The Remaining Candidates

Rank candidates by:

- observed success on this task class
- cost
- quality
- performance
- operational simplicity
- hosted and local portability
- fallback compatibility

Observed task success should carry more weight than general intelligence rankings. When quality is close, prefer the better cost or performance profile.

### 5. Return A Recommendation

Return:

- one primary model
- at least one fallback when feasible
- escalation guidance for retries or higher-stakes cases
- a concise rationale describing the tradeoff

Fallbacks should fail differently from the primary when possible. If the primary is cheap but weak on structured output reliability, the fallback may be a more robust proprietary model.

## Role-Aware Routing

For coding agents and multi-agent systems, support role-aware routing. The selected model does not need to be identical across all subagents.

Map roles back to the task taxonomy rather than using informal labels alone.

Typical mappings:

- planner: automation and assistance, usually high reasoning, often level 7-10 when orchestration or tool use is central
- coder: content creation with secondary analysis, typically level 5-8
- reviewer: analysis and decision support, typically level 6-8 with stronger reliability requirements
- compressor: summarization and synthesis, typically level 4
- extractor: extraction and classification, typically level 1-3 with strong schema reliability
- fallback generalist: robust backup for difficult or ambiguous cases

## Integration Targets

For systems with named model configs, map from task profile to:

- model identifier
- provider identifier
- generation settings relevant to the workflow
- JSON mode or structured output settings when required
- retry policy
- fallback chain

For coding agents with subagent definitions, help answer:

- which model each subagent should use by default
- when a subagent should escalate to a stronger model
- which subagents can safely use cheaper utility models
- which roles demand the most reliable structured output or review quality

## Output Shape

Return a structured recommendation with:

- `task_profile`
- `task_profile.activity`
- `task_profile.complexity`
- `selection.primary`
- `selection.fallback`
- `selection.avoid`
- `selection.escalation`
- `selection.data_source`
- `rationale`

Example:

```json
{
  "task_profile": {
    "task_type": "structured_derivation",
    "activity": "extraction and classification",
    "complexity": "1-3",
    "requires_json": true,
    "estimated_context_tokens": 18000,
    "latency_tier": "interactive",
    "budget_tier": "balanced"
  },
  "selection": {
    "primary": "provider/model-a",
    "fallback": ["provider/model-b"],
    "avoid": ["provider/model-c"],
    "escalation": "Escalate on schema validation failure or repeated malformed JSON",
    "data_source": {
      "name": "artificialanalysis",
      "mode": "api",
      "attribution_required": true
    }
  },
  "rationale": [
    "Primary is the cheapest model that still appears reliable for schema-constrained extraction.",
    "Fallback trades cost for better structured-output reliability.",
    "Avoided candidate is known to fail this workflow's output contract."
  ]
}
```

## Non-Goals

This skill should not:

- build a full benchmark ingestion pipeline
- continuously auto-tune selections from production telemetry
- solve procurement or vendor management
- replace task-specific testing with a universal rubric
- implement critic-based or learned task profiling pipelines
- perform formal SLA or reinforcement-learning optimization over routing decisions
- orchestrate speculative execution or confidence-based cascade evaluation workflows
- enforce ontology-driven governance or semantic compliance reasoning

See:

- `references/selection-guide.md`
- `references/live-data.md`
- `references/taxonomy.md`
- `references/examples.md`
