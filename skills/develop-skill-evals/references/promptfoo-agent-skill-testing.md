---
okf_version: "0.2.0"
type: Web Scrape
title: "Promptfoo Agent Skill Testing (providers, skill-used/trajectory, judging, fallback)"
description: "Condensed, token-efficient digest of how to test an agent skill invocation with promptfoo: native skill-used/trajectory:* support via the Claude Agent SDK, OpenAI Codex SDK, or OpenCode SDK providers; llm-rubric/search-rubric for judging output quality; and a custom-provider fallback with its known multi-turn round-trip limitation. Supersedes the ad-hoc custom-provider workaround for the multi-turn/agentic representation question specs/develop-skill-evals.md flags as an open decision."
sources:
  - id: promptfoo-test-agent-skills
    resource: "https://www.promptfoo.dev/docs/guides/test-agent-skills/"
    title: "Test Agent Skills"
    last_modified: "2026-07-30"
    author: "org:Promptfoo"
  - id: promptfoo-deterministic-metrics
    resource: "https://www.promptfoo.dev/docs/configuration/expected-outputs/deterministic/"
    title: "Deterministic Metrics for LLM Output Validation"
    last_modified: "2026-07-30"
    author: "org:Promptfoo"
  - id: promptfoo-llm-rubric
    resource: "https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/llm-rubric/"
    title: "LLM Rubric"
    last_modified: "2026-07-30"
    author: "org:Promptfoo"
  - id: promptfoo-search-rubric
    resource: "https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/search-rubric/"
    title: "Search-Rubric"
    last_modified: "2026-07-30"
    author: "org:Promptfoo"
  - id: promptfoo-js-provider
    resource: "https://www.promptfoo.dev/docs/providers/custom-api/"
    title: "Javascript Provider"
    last_modified: "2026-07-30"
    author: "org:Promptfoo"
  - id: promptfoo-multiturn-tool-issue
    resource: "https://github.com/promptfoo/promptfoo/issues/5174"
    title: "How to test multi-turn conversations with tool calls?"
    last_modified: "2026-07-30"
    author: "org:Promptfoo"
  - id: agentskills-evaluating-skills
    resource: "https://github.com/agentskills/agentskills/blob/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs/skill-creation/evaluating-skills.mdx"
    title: "Evaluating skill output quality"
    author: "org:agentskills"
generated:
  by: agent:claude
  at: "2026-07-30T13:20:00Z"
---

# Promptfoo Agent Skill Testing

This is a condensed digest, not the primary source. For full-fidelity
verbatim captures — including examples this digest may have trimmed — see
`references/promptfoo/SUMMARY.md`, which indexes the raw pages this
reference is drawn from.

`specs/develop-skill-evals.md` flags an open decision: promptfoo is built
around single prompt→response evaluation, and most skills in this repo are
multi-turn/tool-using. Promptfoo now has purpose-built support for exactly
this case — testing whether an agent picks the right skill and takes the
right steps, not just whether its final text looks right. Prefer the
native provider setup below over the custom-provider fallback whenever the
target skill runs under one of the three supported SDKs.

## Provider setup

### Claude Agent SDK

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    label: review-standards-v1
    config:
      model: claude-sonnet-4-6
      working_dir: ./fixtures/v1
      setting_sources: ["project"]
      skills: ["review-standards"]
      append_allowed_tools: ["Read", "Grep", "Glob"]
      output_format:
        type: json_schema
        schema:
          type: object
          required: [summary, issues]
```

- `setting_sources: ['project']` discovers skills under `.claude/skills/`
  — the same layout this repo's `skills/` directory is designed to be
  installed into (see `install-skills`).
- `skills:` (SDK 0.2.120+) narrows the provider to one skill.
- `output_format` forces structured JSON output instead of Markdown
  prose, so assertions can parse the result directly.

### OpenAI Codex SDK

```yaml
providers:
  - id: openai:codex-sdk
    label: review-standards-v1
    config:
      model: gpt-5.5
      working_dir: ./fixtures/v1
      skip_git_repo_check: true
      sandbox_mode: read-only
      enable_streaming: true
      cli_env:
        CODEX_HOME: ./codex-home
```

Skills are discovered from `.agents/skills/`. Codex's `skill-used` signal is
_inferred_ from a successful read of the matching `SKILL.md` (not a
first-class tool call like Claude/OpenCode), so keep `enable_streaming:
true` while developing the eval to make sure promptfoo collects that
evidence.

### OpenCode SDK

```yaml
providers:
  - id: opencode:sdk
    label: review-standards-v1
    config:
      provider_id: anthropic
      model: claude-sonnet-4-20250514
      working_dir: ./fixtures/v1
      tools:
        read: true
        skill: true
      permission:
        skill: allow
```

OpenCode discovers `.agents/skills/` in the working-directory hierarchy and
loads skills through its native `skill` tool, which promptfoo normalizes
the same way as Claude's.

## `skill-used` assertion

Checks provider-level skill-routing metadata — not the model's final
output text. Works consistently across the three providers above:

```yaml
defaultTest:
  assert:
    - type: skill-used
      value: review-standards
```

Pattern/count form, and its negation:

```yaml
assert:
  - type: skill-used
    value:
      pattern: "project-*:*"
      min: 1
  - type: not-skill-used
    value: forbidden-skill
```

For Claude, inspect raw tool calls directly when you need more than the
routing signal:

```yaml
assert:
  - type: javascript
    value: |
      const calls = context.providerResponse?.metadata?.toolCalls || [];
      return calls.some((call) => call.name === 'Skill');
```

### Testing routing boundaries between skills in a bundle

This is the pattern for the spec's "scope-boundary near miss" scenario type
— checking that a skill fires on its own trigger and _not_ on a
neighboring skill's:

```yaml
tests:
  - description: Eval authoring stays out of provider setup
    vars:
      request: Write a regression eval for this existing provider.
    assert:
      - type: skill-used
        value: promptfoo-evals
      - type: not-skill-used
        value: promptfoo-provider-setup
  - description: Provider wiring does not become eval authoring
    vars:
      request: Connect this HTTP endpoint and verify one safe smoke call.
    assert:
      - type: skill-used
        value: promptfoo-provider-setup
      - type: not-skill-used
        value: promptfoo-evals
```

## `trajectory:*` assertions (require tracing)

These examine traced execution steps — what the agent actually _did_, via
tracing spans — rather than the final output or routing metadata alone.
Enable tracing first:

```yaml
tracing:
  enabled: true
```

Some providers (OpenAI Agents SDK, and others that emit tool spans)
normalize `tool.name`/`tool.arguments`/`tool.output` automatically so the
standard `trajectory:*` assertions work without provider-specific code. For
Codex specifically, enable `deep_tracing: true` in the provider config to
get skill-file-read step evidence:

```yaml
tests:
  - assert:
      - type: trajectory:step-count
        value:
          type: command
          pattern: "*review-standards/SKILL.md*"
          min: 1
```

### `trajectory:tool-used`

```yaml
assert:
  - type: trajectory:tool-used
    value: search_orders
  - type: trajectory:tool-used
    value:
      pattern: "search*"
      min: 2
      max: 3
```

### `trajectory:tool-sequence`

Checks order. `mode: in_order` (default) allows extra steps between the
expected ones; `mode: exact` requires an exact match.

```yaml
assert:
  - type: trajectory:tool-sequence
    value:
      steps:
        - search_orders
        - compose_reply
  - type: trajectory:tool-sequence
    value:
      mode: exact
      steps:
        - search_orders
        - compose_reply
```

### `trajectory:tool-args-match`

Checks that a tool call used the expected arguments, `partial` (default)
or `exact`, with optional `defaults` (tolerate defaulted values) and
`ignore` (glob-excludable params):

```yaml
assert:
  - type: trajectory:tool-args-match
    value:
      name: search_orders
      args:
        order_id: "{{ order_id }}"
  - type: trajectory:tool-args-match
    value:
      pattern: "compose_*"
      mode: exact
      arguments:
        tone: friendly
```

### `trajectory:step-count`

Counts normalized trajectory steps by `type` (`tool | command | search |
reasoning | message | span`), optionally filtered by `pattern`:

```yaml
assert:
  - type: trajectory:step-count
    value:
      type: command
      max: 3
```

### `trajectory:goal-success`

A model-graded assertion for overall task success — combine with the
deterministic checks above rather than using it alone.

## `trace-*` assertions (observability, not routing)

Distinct from `trajectory:*`: these check span-level performance and error
signals, not tool identity or sequence.

```yaml
assert:
  - type: trace-span-count
    value: { pattern: "*llm*", min: 1 }
  - type: trace-span-duration
    value: { pattern: "*llm*", max: 2000, percentile: 95 }
  - type: trace-error-spans
    value: { max_count: 0 }
```

All three throw an error if trace data is unavailable — only add them once
`tracing.enabled: true` and the provider actually emits spans.

## Full example: comparing two skill versions

```yaml
description: Compare Claude skill versions

providers:
  - id: anthropic:claude-agent-sdk
    label: review-standards-v1
    config:
      model: claude-sonnet-4-6
      working_dir: ./fixtures/v1
      setting_sources: ["project"]
      skills: ["review-standards"]
  - id: anthropic:claude-agent-sdk
    label: review-standards-v2
    config:
      model: claude-sonnet-4-6
      working_dir: ./fixtures/v2
      setting_sources: ["project"]
      skills: ["review-standards"]

defaultTest:
  assert:
    - type: skill-used
      value: review-standards
    - type: llm-rubric
      value: "Identifies weak password hashing and timing-unsafe comparison as issues"
      threshold: 0.8
    - type: cost
      threshold: 0.5
    - type: latency
      threshold: 120000

tests:
  - description: Finds both auth issues
    vars:
      request: Review src/auth.ts for password handling and token issues.
```

`skill-used` alone only proves the skill _fired_, not that it helped —
pair it with a content assertion (a rubric here, or a deterministic check
for a Tool-pattern skill) on every test case. A suite that only checks
routing gives false confidence: it stays green even if the skill routes
correctly and then does a mediocre job.

## Baseline comparison: with the skill vs. without it

The example above compares two skill _versions_ — both have the skill
loaded. A distinct, also-useful comparison (a pattern from the
agentskills.io project's native eval methodology, in
`references/agent-skills-native-evals.md`) is comparing _against a
baseline where the skill isn't loaded at all_ — does the skill add
measurable lift over the model's unaided behavior, not just "is v2 better
than v1"? Consider this alongside version-to-version comparisons when the
spec's evaluation plan calls for showing a skill's value, not just
checking its correctness.

In Promptfoo terms, add a third (or second, if there's no prior version)
provider that omits the skill entirely — drop `skills:`/`setting_sources`
so no `SKILL.md` is discovered, or use a bare `anthropic:messages:...`
provider with no agent-skill machinery at all:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    label: review-standards-with-skill
    config:
      model: claude-sonnet-4-6
      working_dir: ./fixtures/v1
      setting_sources: ["project"]
      skills: ["review-standards"]
  - id: anthropic:claude-agent-sdk
    label: review-standards-without-skill
    config:
      model: claude-sonnet-4-6
      working_dir: ./fixtures/v1
      # no setting_sources/skills: no SKILL.md is discovered or loaded
```

Run the same `tests:` against both labels and compare pass rates the same
way the full example above compares `cost`/`latency` — a skill that adds
negligible lift over the no-skill baseline is a stronger signal to revise
it than a passing test case in isolation would be.

## Writing assertions: good vs. weak

This judgment applies to every assertion type above — `skill-used`,
`trajectory:*`, `llm-rubric`, or a plain deterministic check — not just
model-graded ones. (Pattern from agentskills.io's native eval methodology,
in `references/agent-skills-native-evals.md`.)

- **Good**: specific, observable, countable — `"The output file is valid
JSON"`, `"The chart has labeled axes"`, `"The response cites at least 2
file paths"`.
- **Weak — too vague to grade**: `"The output is good"`, `"The response is
helpful"`.
- **Weak — too brittle**: `"The output contains exactly the phrase 'Total
Revenue: $X'"` — a correct answer worded differently would wrongly fail.
  Prefer `contains-any`/`regex` with a few acceptable phrasings, or
  `llm-rubric` for wording-independent checks.
- Not everything needs an assertion. Writing style, visual design, or
  whether an output "feels right" are better caught by human review (or a
  deliberately loose `llm-rubric`) than forced into a brittle pass/fail
  check.
- If a scenario resists an honest assertion in _either_ deterministic or
  `llm-rubric` form, that's usually a sign the target skill's own
  instructions are ambiguous, not that the assertion vocabulary is
  missing something — don't force a weak assertion through to get to
  green.

### Determinism is a tradeoff, not a given

`llm-rubric`/`search-rubric` and agent-SDK-routed assertions are not
deterministic — the same test case can flip pass/fail between identical
runs. Accept that deliberately where a scenario genuinely needs judgment,
and mitigate rather than ignore it:

- Pin `temperature: 0` on the judge (see provider override below).
- Add a `threshold` when the plan needs a stricter bar than the judge's
  own `pass` field alone provides.
- Use `--repeat` during development to reveal flakiness before trusting a
  single run's result.
- Prefer a deterministic assertion whenever the check can honestly be
  expressed that way — reserve model-graded assertions for what actually
  needs judgment, not as a default.

### Necessary: drop assertions that always pass

After a run, drop or tighten any assertion that passed identically across
every test case, or across both sides of a with/without-skill baseline
comparison (see "Baseline comparison" above) — it isn't distinguishing
anything and inflates an apparent pass rate without reflecting real skill
value. (Same principle as agentskills.io's native eval methodology, in
`references/agent-skills-native-evals.md`.) An assertion that fails on
_every_ run is more often a broken assertion than a broken skill — check
it before concluding the skill needs work.

### Reusing assertions across scenarios

When the same rubric or check repeats across test cases or skills,
Promptfoo's `defaultTest`/`assertionTemplates`/YAML anchors let you define
it once — see `promptfoo-evals` for the exact syntax; this reference only
covers what to assert, not how to avoid retyping it.

## Judging output quality: `llm-rubric` and `search-rubric`

Use these when the spec's judging approach says a scenario needs human or
LLM-judge review (rewritten-content quality, tone, faithfulness) — not for
scope adherence or routing, which `skill-used`/`trajectory:*` above or a
plain deterministic assertion (`contains`, `regex`, `javascript`, etc.)
already checks objectively.

### `llm-rubric` syntax & basic usage

```yaml
assert:
  - type: llm-rubric
    value: Is not apologetic and provides a clear, concise answer
```

The `value` field states the criteria an LLM judge applies to the output.
The grading model returns JSON with `reason`, `score` (0.0–1.0), and
`pass` (boolean).

### Pass vs. score semantics

- **Without a threshold**: the LLM's `pass` boolean determines success. If
  `pass` is omitted, promptfoo assumes `pass: true` by default — a rubric
  that never sets `pass` will always pass unless a threshold is added.
- **With a threshold**: both conditions must hold — `pass === true` AND
  `score >= threshold`.

```yaml
assert:
  - type: llm-rubric
    value: Is not apologetic and provides a clear, concise answer
    threshold: 0.8
```

### Provider override, in order of precedence

1. Assertion-level provider (highest):

   ```yaml
   assert:
     - type: llm-rubric
       value: Your rubric here
       provider: openai:gpt-5-mini
   ```

2. Test-level default:

   ```yaml
   defaultTest:
     options:
       provider: openai:gpt-5-mini
   ```

3. CLI flag (lowest precedence when set):

   ```bash
   promptfoo eval --grader openai:gpt-5-mini
   ```

Expand the provider shorthand to control temperature or other grader
settings:

```yaml
assert:
  - type: llm-rubric
    value: Is not apologetic and provides a clear, concise answer
    provider:
      id: openai:gpt-5-mini
      config:
        temperature: 0
```

### Variables and negation

```yaml
defaultTest:
  assert:
    - type: llm-rubric
      value: 'Provides a direct answer to: "{{question}}" without elaboration'
tests:
  - vars:
      question: What is the capital of France?
```

`not-llm-rubric` passes when the rubric criterion does **not** match.

### Default grading models

Promptfoo picks a judge based on available credentials: OpenAI (`gpt-5`),
Anthropic (`claude-sonnet-4-5-20250929`), Google (`gemini-2.5-pro`),
Mistral (`mistral-large-latest`). Pin the grader explicitly (per the
provider-override options above) when stable scoring matters more than
picking up credential defaults.

### `search-rubric`

Behaves exactly like `llm-rubric`, but automatically uses a judge provider
with web search enabled — useful for grading claims that depend on current
or time-sensitive information (a rubric like "reports the current market
price" that `llm-rubric` alone cannot verify).

```yaml
assert:
  - type: search-rubric
    value: "Provides accurate current Bitcoin price within 5% of market value"
    threshold: 0.9
```

Supported grading providers: Anthropic Claude (`web_search_20250305`
tool), OpenAI (`openai:responses:gpt-5.1` with `web_search_preview`),
Perplexity (`perplexity:sonar`, built-in search), Google Gemini
(`google:gemini-3.1-pro-preview` with `googleSearch`), xAI Grok
(`xai:responses:grok-4.3` with `web_search`). Score ranges follow the same
0.0–1.0 scale as `llm-rubric`.

## Fallback: custom provider when native support doesn't cover the skill

If the target skill runs under something promptfoo doesn't normalize tool
spans for (not one of the three SDKs above), wrap the invocation in a
custom Python, JavaScript, or HTTP provider instead. Defer to
`promptfoo-evals` for the exact `call_api`/`callApi` signatures,
tool-calling schema config, and HTTP provider fields — this reference only
covers what's specific to testing a skill through one.

If the provider builds or modifies the prompt itself (typical for an
agent that composes a system prompt, tool results, or multi-turn history),
set the `prompt` field on its response so promptfoo's assertions and debug
view see what was actually sent, not just the templated input.

### Multi-turn tool-call round trips: known limitation for ad-hoc providers

Promptfoo's `defaultTest.assert` model checks one final `output` string per
test case. A documented open issue
([promptfoo#5174](https://github.com/promptfoo/promptfoo/issues/5174))
describes a user unable to get promptfoo to continue the conversation after
a tool call result was returned — the eval saw only the raw tool-call
result, not what the model did with it on a second reasoning turn.

This limitation applies to **ad-hoc providers** (a hand-written
Python/JS/HTTP provider that doesn't already manage the full multi-turn
loop itself). The workaround: have the provider run the _entire_
invocation internally (every turn, every tool call) and return only the
final `output` for assertions to check. That tests the end-to-end result,
not any specific intermediate decision — call this out explicitly rather
than implying the test covers the full interior workflow.

For the specific case of testing a Claude Agent SDK, OpenAI Codex SDK, or
OpenCode SDK skill invocation, the provider setup and assertions earlier in
this reference supersede this workaround entirely: `skill-used` and
`trajectory:*` can check _which_ skill/tool ran and in what order without a
hand-rolled provider.

## What this resolves, and what it doesn't

This closes the practical gap for the common case in this repo: a skill
installed under `.claude/skills/` (or `.agents/skills/`), invoked via one
of the three supported agent SDKs, checked for correct routing
(`skill-used`) and, with tracing enabled, correct tool sequencing
(`trajectory:*`). It does **not** remove the need for judgment calls when a
target skill:

- runs under an SDK/CLI promptfoo doesn't normalize tool spans for (fall
  back to the custom-provider approach above, and say so explicitly);
- needs assertions on conversational content mid-workflow, not just tool
  identity/sequence/routing (still only the final `output` or judged
  content is directly assertable, per the round-trip limitation above).
