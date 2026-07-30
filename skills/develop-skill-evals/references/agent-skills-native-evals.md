---
okf_version: '0.2.0'
type: Specification
title: "Native agentskills.io Evals (evals/evals.json) — Pattern Source, Not a Target Format"
description: "Condensed digest of the agentskills.io project's own eval methodology: evals/evals.json test cases, with_skill/without_skill baseline comparison, LLM-judge assertion grading, deterministic tool_assertions, and benchmark aggregation. This skill does not author evals/evals.json and is not considering adopting it — read this only to mine transferable eval-design patterns for the Promptfoo path; see the note at the bottom for which patterns were already extracted into promptfoo-agent-skill-testing.md."
sources:
  - id: agentskills-evaluating-skills
    resource: "https://github.com/agentskills/agentskills/blob/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs/skill-creation/evaluating-skills.mdx"
    title: "Evaluating skill output quality"
    author: "org:agentskills"
  - id: agent-skills-eval-readme
    resource: "https://github.com/darkrishabh/agent-skills-eval/blob/b60eebe3c6edaa917a284e13b9b0e9fa00f1c957/README.md"
    title: "agent-skills-eval"
    author: "human:darkrishabh"
generated:
  by: agent:claude
  at: '2026-07-30T13:14:29Z'
---

# Native agentskills.io Evals

**Not a target format.** This skill authors Promptfoo artifacts only, per
`specs/develop-skill-evals.md`, and is not evaluating whether to switch or
add `evals/evals.json` as a second output. This methodology is read purely
as a source of eval-design patterns and practices — some of which don't
depend on the tool at all — to apply within the Promptfoo path. See "What
was extracted, and what wasn't" at the bottom.

Full-fidelity source: `references/agentskills/evaluating-skills.md` (the
methodology) and `references/agent-skills-eval/` (README.md +
schema.md — a reference implementation, `agent-skills-eval`, that runs
this format).

## `evals/evals.json` shape

Lives inside the skill directory being evaluated (`<skill>/evals/evals.json`
— note this repo's own `scripts/init-skill-eval` instead scaffolds a
Promptfoo suite at `<skill>/evals/promptfooconfig.yaml`; the two formats
are siblings under the same `evals/` directory, not interchangeable files).

```json
{
  "skill_name": "csv-analyzer",
  "evals": [
    {
      "id": 1,
      "prompt": "I have a CSV of monthly sales data in data/sales_2025.csv. Can you find the top 3 months by revenue and make a bar chart?",
      "expected_output": "A bar chart image showing the top 3 months by revenue, with labeled axes and values.",
      "files": ["evals/files/sales_2025.csv"],
      "assertions": [
        "The output includes a bar chart image file",
        "The chart shows exactly 3 months",
        "Both axes are labeled"
      ]
    }
  ]
}
```

If `assertions` is omitted but `expected_output` is present, the reference
implementation promotes `expected_output` into a judge assertion
automatically — a minimal eval file still produces meaningful grading.

## Writing good vs. weak assertions

Directly reusable for this skill's own scenario-to-assertion mapping,
regardless of target format:

- **Good**: `"The output file is valid JSON"`, `"The bar chart has labeled
  axes"`, `"The report includes at least 3 recommendations"` — specific,
  observable, countable.
- **Weak**: `"The output is good"` (too vague to grade); `"The output uses
  exactly the phrase 'Total Revenue: $X'"` (too brittle — correct output
  with different wording would wrongly fail).
- Not everything needs an assertion. Writing style, visual design, "feel"
  are better caught by human review than forced into a pass/fail check.

## `with_skill` / `without_skill` baseline comparison

The core pattern: run each test case twice — once with the skill loaded,
once without (or against a previous version) — so you have a baseline to
compare against, not just an absolute pass rate. Workspace layout:

```text
<skill>-workspace/iteration-1/
  eval-<slug>/
    with_skill/{outputs/, timing.json, grading.json}
    without_skill/{outputs/, timing.json, grading.json}
  benchmark.json
```

`benchmark.json` aggregates `pass_rate`/`time_seconds`/`tokens` (mean,
stddev) per side plus a `delta` — what the skill costs (time, tokens)
versus what it buys (pass-rate lift). This is the same
cost-vs-benefit judgment Promptfoo's `cost`/`latency` assertions make
per-test-case; here it's computed as a run-level aggregate instead.

## Deterministic `tool_assertions` (no LLM judge)

Graded locally against the model's structured `tool_calls` — the same
"objectively checkable" category as Promptfoo's
`trajectory:tool-used`/`tool-args-match`, in this format's terms:

```typescript
type ToolAssertion =
  | { type: "tool-called";       name: string }
  | { type: "tool-not-called";   name: string }
  | { type: "tool-arg-equals";   name: string; path: string; value: unknown }
  | { type: "tool-arg-contains"; name: string; path: string; value: string }
  | { type: "tool-arg-matches";  name: string; path: string; pattern: string; flags?: string }
  | { type: "tool-call-count";   name?: string; min?: number; max?: number };
```

`path` is dot-notation into the parsed tool-call arguments (e.g.
`"command"`, `"input.command"`, `"files[0]"`).

## Grading and iterating

- Grading records `PASS`/`FAIL` **with evidence** quoting the actual
  output — an assertion marked pass without a concrete quote is a red
  flag, not a pass.
- Review the assertions themselves after each round: drop ones that always
  pass in both `with_skill`/`without_skill` (they prove nothing), fix ones
  that always fail (broken assertion, not a broken skill), and study ones
  that pass with the skill but fail without — that's where the skill is
  demonstrably adding value.
- High `stddev` across repeated runs signals a flaky eval or an ambiguous
  instruction, not necessarily a bad skill.

## Running it (reference implementation, `agent-skills-eval`)

```bash
npx agent-skills-eval ./skills --target gpt-4o-mini --judge gpt-4o-mini --baseline --strict
```

OpenAI-compatible by default (works with OpenAI, Together, Groq, Anthropic
via compat layers, local servers); implement the five-field `Provider`
interface (`references/agent-skills-eval/schema.md`) for anything else.
Produces a static HTML report plus JSON/JSONL artifacts. This skill does
not run evals itself regardless of format — this section is context for
what a downstream `npx agent-skills-eval` run would do with artifacts
authored here, the same way `promptfoo eval` is context but out of scope
for the Promptfoo path.

## What was extracted, and what wasn't

Two patterns from this methodology are generic enough to apply inside the
Promptfoo path regardless of format, and are now folded into
`promptfoo-agent-skill-testing.md` directly (with a citation back here):

- **Good-vs-weak assertion wording** — "specific, observable, countable"
  vs. "too vague" or "too brittle" is exactly the same judgment call
  whether the assertion is a `tool_assertion`, an `llm-rubric` value, or a
  plain `contains`/`regex`. See that file's "Writing assertions: good vs.
  weak" section.
- **With-skill vs. without-skill baseline comparison** — this methodology
  always compares against a *no-skill* baseline, not just skill-version A
  vs. B. Promptfoo's existing "compare two skill versions" example only
  covers A/B; a genuine baseline (same task, skill absent entirely) is a
  distinct, useful comparison this skill's plan-to-test-case mapping
  should also consider. See that file's "Baseline comparison" section.

Not extracted, and not planned to be: the `evals/evals.json` file format
itself, its `iteration-N`/`with_skill`/`without_skill` workspace layout,
`benchmark.json` aggregation, and the `agent-skills-eval` CLI/SDK. Those
are tied to running a different tool end to end, not to authoring a
Promptfoo test case — out of scope here regardless of how well-designed
they are.
