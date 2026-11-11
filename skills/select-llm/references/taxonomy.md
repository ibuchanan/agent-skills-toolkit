# Task Taxonomy

This document summarizes two reference sources for classifying tasks before selecting a model:

- `NIST.AI.200-1.md`: activity-oriented taxonomy for how an AI system contributes to a human task
- `iternal-llm-selection-guide-2026.md`: capability-oriented taxonomy for how much model intelligence a task requires

Use this taxonomy to profile the task in stable terms before looking at current model rosters.

## How To Classify A Task

Classify each task on three axes:

1. primary activity: what role the AI plays in the human task
2. complexity level: how much reasoning or autonomy the task requires
3. operational constraints: what the output and workflow must satisfy

## 1. Primary Activity

These categories summarize the NIST AI Use Taxonomy in a form that is practical for LLM routing.

| Activity | Meaning | Common LLM examples |
| --- | --- | --- |
| extraction and classification | pull fields, labels, entities, or simple judgments from input | entity extraction, tagging, moderation, schema fill |
| transformation | rewrite or convert material without changing the core meaning | translation, normalization, reformatting, tone shift |
| summarization and synthesis | condense or combine information into a coherent whole | meeting notes, briefings, multi-document synthesis |
| content creation | generate new text, code, or other artifacts | drafting, code generation, creative writing |
| retrieval and guidance | help the user find, rank, recommend, or navigate options | search assistance, recommendations, candidate ranking |
| analysis and decision support | evaluate evidence and support a human decision | code review, risk review, comparative analysis |
| automation and assistance | carry out a repeatable workflow or agent-like task | assistants, tool use, process automation, orchestration |
| monitoring, detection, and prediction | identify changes, anomalies, or likely outcomes | alert triage, incident detection, trend prediction |

Notes:

- a real task can combine multiple activities
- for routing, identify the primary activity first, then note secondary activities if they materially change model needs
- code tasks often span multiple activities: generation, analysis, synthesis, and automation

## 2. Complexity Level

These levels summarize the Iternal intelligence hierarchy. The goal is to estimate the minimum capability threshold needed for reliable results.

| Level | Name | Typical requirement |
| --- | --- | --- |
| 1 | extraction | pull specific values from known patterns |
| 2 | classification | assign labels or buckets |
| 3 | transformation | convert format, style, or representation |
| 4 | summarization | compress while preserving key meaning |
| 5 | generation | produce new content following constraints |
| 6 | analysis | weigh multiple factors and interpret evidence |
| 7 | synthesis | combine multiple sources into one conclusion |
| 8 | multi-step reasoning | chain several reasoning steps correctly |
| 9 | creative synthesis | generate novel solutions or high-judgment output |
| 10 | agentic reasoning | plan, use tools, adapt, and complete multi-step workflows |

Routing guidance:

- levels 1-3 usually favor cheap, fast models if formatting is reliable enough
- levels 4-6 usually need stronger general-purpose models
- levels 7-10 often justify frontier or agent-specialized models
- choose the lowest-cost model that clears the capability threshold for the task

## 3. Operational Constraints

These are the practical constraints the skill should capture before ranking models.

### Output Requirements

- strict JSON or schema-constrained output
- deterministic terse text
- long-form prose
- code with minimal commentary
- tool-call compatible content
- long-context comprehension
- multimodal input or output

### Workflow Constraints

- latency sensitivity
- budget sensitivity
- reliability requirements
- privacy or deployment constraints
- provider constraints
- fallback availability

These constraints can override a nominally strong candidate. For example, a cheaper model may fail if it cannot reliably produce strict structured output or if its practical context is too small.

## Routing Concepts

These concepts connect the taxonomy to selection behavior.

- task profiling: identify the activity, complexity level, and operational constraints
- capability threshold: prefer the cheapest model that reliably clears the task's required level
- SLA matching: balance cost, latency, and quality against the actual workload
- speculative evaluation: try cheaper paths first when failure is cheap and escalation is available
- constraint guarding: exclude models that fail hard requirements such as privacy, context, or structured output reliability

## Practical Mapping

Use this quick mapping when profiling common LLM workflows.

| Workflow | Primary activity | Typical complexity |
| --- | --- | --- |
| structured derivation | extraction and classification | 1-3 |
| summarization or compression | summarization and synthesis | 4 |
| extraction or tagging | extraction and classification | 1-2 |
| rewrite or translation | transformation | 3 |
| summarization | summarization and synthesis | 4 |
| draft generation | content creation | 5 |
| speculative draft generation | content creation | 5-6 |
| code generation | content creation | 5-8 |
| code editing | transformation plus analysis | 4-7 |
| review or verification | analysis and decision support | 6-8 |
| research synthesis | summarization and synthesis | 6-8 |
| planning or orchestration | automation and assistance | 7-10 |
| fallback general reasoning | analysis and decision support | 6-8 |

When a task spans multiple rows, prefer the highest complexity level that is central to success, not the cheapest subtask in the workflow.
