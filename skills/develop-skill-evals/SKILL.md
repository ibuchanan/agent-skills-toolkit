---
name: develop-skill-evals
description: Turn an approved skill evaluation plan into Promptfoo eval artifacts. Use when an approved spec has a completed Evaluation plan and needs test cases, assertions, prompts, or configuration. Do not use to define a plan or evaluate generic prompts.
---

# Develop Skill Evals

Turn an already-approved skill's lean evaluation plan
into concrete Promptfoo artifacts:
`promptfooconfig.yaml`, test cases, and assertions.
Treat the plan as settled —
this skill does not decide what should be evaluated,
and it does not run evals.

Do not use this skill to invent an evaluation plan from scratch,
edit the target skill's behavior, or execute Promptfoo.

## Scope

Trigger for: authoring or updating Promptfoo test artifacts for a skill whose
`specs/<skill-name>.md` already contains a completed `### Evaluation plan`
section.

Redirect instead of triggering when:

- No spec or lean evaluation plan exists yet for the target skill →
  hand off to `grill-this-skill` first; do not improvise scenarios.
- The request is about generic Promptfoo work unrelated to an agent skill
  (a bare prompt, a non-skill LLM app), or about running/debugging an
  already-authored suite's regressions → hand off to `promptfoo-evals`.

A second eval methodology exists — the agentskills.io project's own native
`evals/evals.json` format (`references/agent-skills-native-evals.md`) —
but it is not a target format for this skill and never will be authored
here; it is read only to mine transferable eval-design patterns (assertion
wording, baseline comparison) already folded into
`references/promptfoo-agent-skill-testing.md`. If a request explicitly
asks for an `evals/evals.json` file, decline and redirect to
`grill-this-skill` rather than treating it as this skill's job.

## Workflow

### 1. Gather grounding

Validate the target skill name against the skill-name rules in
`references/skill-format.md` before using it to build any
file path or command. Treat it as data, not literal path syntax.

Read, in this order:

- the target skill's `specs/<skill-name>.md`, specifically its
  `### Evaluation plan` section (behavior to distinguish, scenario types,
  evidence source, judging approach);
- the target skill's `SKILL.md` body — the ground truth for expected
  behavior; scenarios must trace back to it, not to assumptions;
- any existing `skills/<skill-name>/evals/` content, if updating rather
  than creating.

If the spec has no `### Evaluation plan` section, or it is missing a
scenario type, evidence source, or judging approach, stop and redirect to
`grill-this-skill`. Do not fabricate the missing piece.

While reading the target's `SKILL.md`, note which design pattern it
follows (Tool: precise operations on a format; Navigation: routes between
distinct scenarios; Process: multi-step; Mindset/Philosophy: creative,
high-freedom output) — it predicts which assertion style and scenario type
will actually exercise the skill in step 4. See
`references/skill-judge-lessons.md` for why. Scoring the skill's adherence
to the pattern is a different skill's job; identifying it here is just
input to this skill's own assertion choices.

### 2. Choose how to invoke a multi-turn or agentic skill

Most skills in this repo are multi-turn or tool-using (interview flows,
multi-step agent workflows) rather than a bare prompt. Promptfoo now has
first-class support for this: the `anthropic:claude-agent-sdk` provider
(also `openai:codex-sdk`, `opencode:sdk`) can invoke a skill installed
under `.claude/skills/` or `.agents/skills/` directly, and the `skill-used`
and `trajectory:*` assertions check which skill/tool ran and in what order.

Read `references/promptfoo-agent-skill-testing.md` — it is the default
starting point for evaluating a skill in this repo, and also covers the
hand-rolled Python/JS/HTTP provider fallback for when the target skill
runs under something native support doesn't cover. Say so explicitly
rather than silently choosing the fallback.

Either way, a test case built this way still only proves what the provider
and its assertions actually observe (skill routing, traced tool steps, or a
judged final output) — label anything short of that plainly as a partial
check, not a full behavioral test of the workflow.

### 3. Scaffold the suite

Use the canonical layout under `skills/<skill-name>/evals/`:

```text
evals/
  promptfooconfig.yaml
  prompts/
  tests/
```

After the artifact proposal is approved (step 5), create this layout with
ordinary file-writing tools following `references/manual-scaffold-guide.md`.
Use the resolved target skill directory, not an assumed checkout layout.
Preserve existing suite content. An installed `init-skill-eval` CLI may be
used if available and inspected, but is not required; do not assume a
checkout-level `scripts/init-skill-eval` exists.

### 4. Map scenarios to test cases

For each scenario type in the spec's evaluation plan (normal case, near
miss, scope-boundary near miss, and so on), write one Promptfoo test case:

- Word the prompt/input from the scenario's own description in the spec;
  do not invent new scenarios.
- Set a `description:` on the test case stating the scenario and expected
  behavior, not just the prompt — this is what lets a future reader (or
  future you) recover _why_ the test exists once the target `SKILL.md`
  has moved on from its current wording.
- If the spec's scenario types have no scope-boundary/routing case at all,
  flag that gap before writing test cases — a skill that never fires in
  practice fails regardless of how its content assertions would have
  scored (`references/skill-judge-lessons.md`).
- Match assertions to the plan's judging approach. Start with
  `references/config-prompt-assertion-reference.md` for common patterns:
  use `skill-used`/`trajectory:*` when the scenario is about which
  skill/tool ran, not the final text; reach for `llm-rubric`/`search-rubric`
  only when the spec flags a scenario as needing human or LLM-judge review,
  such as rewritten-content quality — this is also the right call for a
  high-freedom/creative target skill (Mindset/Philosophy pattern), where a
  tight deterministic check would wrongly fail correct-but-differently-
  worded output. For a plainly objective check (a specific string,
  pattern, or JSON shape) — the right call for a low-freedom/precise
  target skill (Tool pattern) — use a deterministic assertion (`equals`,
  `contains`, `regex`, `is-json`, etc.) directly. See
  `references/promptfoo-agent-skill-testing.md` for detailed provider
  setup and LLM-judge semantics. Hand off to `promptfoo-evals` for the
  full assertion-type index, advanced config schema, or mechanics beyond
  the common cases in this skill's bundled references.
- Pair every `skill-used`/`trajectory:*` routing assertion with at least
  one assertion on the actual `output` (a rubric or a deterministic
  check). Routing alone tells you the skill fired, not that it helped —
  a suite that only checks routing gives false confidence.
- `llm-rubric`/`search-rubric` and agent-SDK-routed assertions are not
  deterministic — accept that tradeoff deliberately, don't design around
  it silently. Pin `temperature: 0` on the judge, add a `threshold` when
  the plan needs a stricter bar than the judge's own `pass` field, and use
  `--repeat` to reveal flakiness before trusting a single run. Prefer a
  deterministic assertion whenever the check can honestly be expressed
  that way; reserve model-graded assertions for scenarios that genuinely
  need judgment.
- If a scenario resists an honest objective assertion — you've tried both
  a deterministic check and an `llm-rubric` and neither captures the
  spec's intent — stop and flag it rather than forcing a weak assertion
  through. That resistance is often a sign the target `SKILL.md`'s own
  instructions are ambiguous, not that the eval format is inadequate.
  Redirect to `grill-this-skill` to resolve the ambiguity rather than
  shipping an assertion you don't trust.

### 5. Propose before writing

Present the proposed `promptfooconfig.yaml` and test cases in conversation
first. Only write or update files under `skills/<skill-name>/evals/` after
explicit approval — especially when a suite already exists for that skill.

### 6. Review assertions after a run, if results are available

This skill doesn't run Promptfoo, but if the user shares results from a
run (their own, or a prior iteration), review the assertions against
those results before treating the suite as finished:

- Drop or tighten any assertion that passed identically across every test
  case, or across both sides of a with/without-skill baseline comparison
  — it isn't distinguishing anything and is inflating an apparent pass
  rate without reflecting real skill value.
- An assertion that failed on every run is more likely broken (checking
  for something the model structurally can't do, or a typo in the
  expected value) than evidence the skill is broken — fix the assertion
  before concluding the skill needs work.
- High variance across repeated runs of the same test case (from
  `--repeat`) signals either a flaky, temperature-sensitive judge or an
  ambiguous target-skill instruction — not necessarily a skill defect.

### 7. Hand off

State the recommended next step after writing. Typical handoffs:

- `promptfoo-evals`, for deeper assertion or provider debugging once the
  suite runs;
- `ingest-reference`, if a Promptfoo documentation gap blocked an assertion
  or provider choice;
- `grill-this-skill`, if authoring surfaced a gap in the approved evaluation
  plan itself, or if a scenario resisted honest assertion in step 4.

Do not run `promptfoo eval` or any other Promptfoo CLI command — this skill
authors artifacts only.

## Boundaries & safety

- Never edit the target skill's `SKILL.md` (name, description, or body).
  This skill only produces eval artifacts, never changes what the skill
  under test actually does.
- Never invent evaluation scenarios beyond the approved spec's lean
  evaluation plan.
- Never write eval artifacts to disk without the user reviewing them first.
- Never attempt to install or run Promptfoo. Reviewing results the user
  shares from a run they performed (step 6) is not the same as running
  Promptfoo — stay within that distinction.
- If a request also asks to edit the target skill's behavior or run the
  suite, decline that part and stay to authoring artifacts.

## Reference load triggers

Do not load these by default. Read `references/SUMMARY.md` for the full
context map with load triggers, or jump straight to the reference below
that matches the current question, apply it, then return to the workflow.

**Bundled locally in this skill:**

- Read `references/skill-format.md` — skill structure grounding for mapping
  scenarios onto behavior faithfully.
- Read `references/skill-composition.md` — trigger/near-miss phrasing
  craft, useful for scenario-to-test-case mapping.
- Read `references/manual-scaffold-guide.md` — step-by-step instructions to
  create the canonical evaluation suite layout by hand, without external
  scripts.
- Read `references/config-prompt-assertion-reference.md` — common Promptfoo
  configuration patterns, prompt template syntax, and deterministic
  assertion types. Use this as a starting point for most authoring tasks.
- Read `references/promptfoo-agent-skill-testing.md` for anything about
  testing a skill invocation — the default starting point for a skill
  installed under `.claude/skills/` or `.agents/skills/`; the
  custom-provider fallback for when native support doesn't cover the
  target skill; and `llm-rubric`/`search-rubric` model-graded assertions,
  especially the pass/threshold interaction.

**When to hand off:**

Companion skills are optional. If unavailable, report the specialist work needed
and stop that portion rather than assuming an installed skill or reading its files.

- Hand off to `promptfoo-evals` for advanced `promptfooconfig.yaml` config
  fields, provider mechanics beyond the common cases, or the complete
  deterministic assertion-type index.
- Read `references/agent-skills-native-evals.md` only if a request raises
  `evals/evals.json` and you need to explain what it is before declining
  and redirecting per the Scope section above. Its extracted patterns
  (assertion wording, baseline comparison) already live in
  `references/promptfoo-agent-skill-testing.md` — no need to load this one
  for those.
- Read `references/skill-judge-lessons.md` only if a request asks to
  score or improve a target skill's `SKILL.md` writing quality (a
  different skill's job) and you need to explain why that's out of scope
  here. Its extracted patterns (design pattern → assertion style,
  triggering as a first-class failure mode) already live in this
  workflow's steps 1 and 4 — no need to load this one for those.
