# Skill specification develop-skill-evals

## Objective

Turn an already-approved skill's lean evaluation plan (behavior to
distinguish, scenario types, evidence source, judging approach — as produced
by `grill-this-skill` or recorded in an existing `specs/<skill>.md`) into
concrete Promptfoo artifacts: `promptfooconfig.yaml`, test cases, and
assertions. Does not decide what should be evaluated, and does not run evals.

## Audience

Skill authors in this repo who already have (or are pointed to) an approved
`specs/<skill>.md` with a lean evaluation plan. They understand what their
skill does but may not know Promptfoo's config/assertion syntax, or how to map
skill-behavior scenarios (trigger, non-trigger, near-miss) onto Promptfoo test
cases.

### Style & tone

Direct and instructional, but scoped: explain inline only the Promptfoo
mechanics specific to testing a *skill invocation* — provider setup (native
agent-SDK routing via the Claude Agent SDK/OpenAI Codex SDK/OpenCode SDK, and
the custom-provider fallback), `skill-used`/`trajectory:*`/`trace-*`
assertions, and `llm-rubric`/`search-rubric` judging semantics. Defer generic
Promptfoo mechanics — config schema, prompt-template syntax, the deterministic
assertion-type index — to the `promptfoo-evals` skill rather than duplicating
them; this skill's own reference set deliberately does not keep a copy of that
generic ground. Treat the spec's evaluation plan as settled — don't re-ask
what the skill should do. Be prescriptive about artifact file layout and
naming so eval suites stay consistent across skills in this repo; be flexible
about assertion choices where the spec doesn't dictate them.

## Context

Trigger when a user has an approved lean evaluation plan for a specific agent
skill and wants it turned into Promptfoo artifacts — this skill is about
testing skill behavior/triggering, not generic prompt evals. Most skills in
this repo are multi-turn/agentic rather than bare-prompt; Promptfoo's native
`skill-used`/`trajectory:*` assertions via the Claude Agent SDK, OpenAI Codex
SDK, or OpenCode SDK providers (`references/promptfoo-agent-skill-testing.md`)
represent this directly, with a custom-provider fallback for anything those
SDKs don't cover — this is no longer an open question.

### Trigger & non-trigger contexts

Trigger for: authoring or updating Promptfoo test artifacts for a skill whose
`specs/<skill>.md` already contains a lean evaluation plan.

Do not trigger, and redirect instead, when:

- no spec or lean evaluation plan exists yet for the target skill → redirect
  to `grill-this-skill` first; do not improvise scenarios.
- the request is about generic Promptfoo work unrelated to an agent skill
  (a bare prompt, a non-skill LLM app), or about running/debugging an
  already-authored suite's regressions → defer to `promptfoo-evals`.
- the request asks for a native agentskills.io `evals/evals.json` artifact
  instead of (or alongside) a Promptfoo suite → decline; that format is read
  only as a source of transferable eval-design patterns (see References),
  never authored here — redirect to `grill-this-skill` if the user wants to
  reconsider this skill's scope, rather than complying silently.
- the request asks to score or improve a target skill's `SKILL.md` writing
  quality (knowledge delta, design-pattern adherence, anti-pattern review) →
  decline; that is `describe-skill`'s/`develop-agent-skill`'s job, not this
  one's, even though the Skill Judge framework (see References) informed some
  of this skill's own assertion-design guidance.

### Boundaries & safety

- Never invent evaluation scenarios beyond the approved spec's lean evaluation
  plan. If the plan is missing a scenario type, evidence source, or judging
  approach, surface the gap and point back to `grill-this-skill` rather than
  fabricating it.
- Never edit the target skill's `SKILL.md` (name, description, or body) —
  this skill only produces eval artifacts, never changes what the skill under
  test actually does.
- Don't write or overwrite eval artifacts on disk without the user reviewing
  the proposed `promptfooconfig.yaml`/test cases first, especially if an eval
  suite already exists for that skill.
- Don't attempt to install or run Promptfoo (`npx promptfoo eval`, etc.) —
  this skill authors config only; running is out of scope. Reviewing results
  a user shares from a run *they* performed is not the same as running
  Promptfoo — that distinction stays intact.
- Treat the target skill's own `SKILL.md` body as ground truth for expected
  behavior; scenarios must trace back to it, not to assumptions.
- Never force a weak or brittle assertion through when a scenario resists
  honest expression in either deterministic or `llm-rubric` form — flag it
  and redirect to `grill-this-skill` instead. That resistance usually signals
  ambiguity in the target's `SKILL.md`, not a gap in Promptfoo's assertion
  vocabulary.

## Inputs & outputs

**Inputs**: the target skill's `SKILL.md` (behavior grounding) and its
approved `specs/<skill>.md` lean evaluation plan; optionally existing files
under `skills/<skill-name>/evals/` if updating rather than creating.

**Outputs**: Promptfoo artifacts (`promptfooconfig.yaml`, test case/fixture
files, assertions) proposed in conversation first, then written to
`skills/<skill-name>/evals/` only after explicit approval — matching the
existing skill-scaffolding convention (`specs/technical-implementation-spec.md`
already reserves this directory).

### Evaluation plan

- **Behavior to distinguish**: given an approved spec's lean evaluation plan,
  does the skill (a) faithfully translate its scenario types into Promptfoo
  test cases/assertions grounded in that plan, (b) stay in scope — no edits to
  the target `SKILL.md`, no unapproved writes, no attempt to run Promptfoo, no
  authoring of a native `evals/evals.json` artifact, no scoring of a target's
  `SKILL.md` writing quality — and (c) flag rather than force an assertion
  when a scenario genuinely resists honest expression?
- **Scenario types**:
  1. Normal case — a spec with a complete lean plan (e.g.
     `specs/describe-skill.md`) → expect faithful artifacts proposed for
     `skills/describe-skill/evals/`.
  2. Near miss: no plan yet — user asks to develop evals for a skill with no
     spec/plan yet → expect a redirect to `grill-this-skill`, not fabricated
     scenarios.
  3. Scope-boundary near miss: edit/run — user also asks it to edit the
     target skill's behavior or run the suite → expect a decline, staying to
     authoring only.
  4. Scope-boundary near miss: native format — user asks for a native
     `evals/evals.json` artifact instead of a Promptfoo suite → expect a
     decline, not silent compliance.
  5. Scope-boundary near miss: SKILL.md quality scoring — user asks to score
     or improve a target's `SKILL.md` writing quality (e.g. via a
     Skill-Judge-style rubric) → expect a decline and redirect to
     `describe-skill`/`develop-agent-skill`.
  6. Resistance-is-a-signal — a scenario resists honest assertion in both
     deterministic and `llm-rubric` form → expect the skill to flag the
     ambiguity and redirect to `grill-this-skill` rather than shipping a weak
     assertion.
- **Evidence source**: the target skill's approved `specs/<skill>.md`
  evaluation-plan section, plus its `SKILL.md` body for behavior grounding.
- **Judging**: scope adherence, faithfulness-to-plan, and correct
  decline/redirect behavior for scenarios 2–6 are objectively checkable; the
  quality of specific assertion choices — including whether a routing
  assertion is properly paired with a content assertion, and whether
  determinism tradeoffs are handled deliberately — needs human or LLM-judge
  review.

## Open decisions

- **Question**: `SKILL.md` is now 246 lines and PromptLint's cost-efficiency
  score has dipped to 9.5 (from a steady 10.0) after this session's additions
  (pattern extraction from two sources, the review-after-a-run step, the
  resistance-is-a-signal rule). Should step 4's now-large assertion-guidance
  block move into a reference file, or is 9.5 an acceptable steady state?
  **Why it matters**: PromptLint treats a cost score below 9.5 as "splitting
  overdue"; 9.5 is the boundary, not yet below it.
  **What it blocks**: nothing today — doesn't block authoring or evaluation
  design; it's a maintenance signal, not a correctness gap.
  **Next owner**: whoever next substantially edits `SKILL.md`'s workflow
  steps — reassess then rather than splitting preemptively.

## References

**Target format — read by default:**

- `references/promptfoo-agent-skill-testing.md` — provider setup (native
  agent-SDK routing + custom-provider fallback), `skill-used`/`trajectory:*`/
  `trace-*` assertions, `llm-rubric`/`search-rubric` judging, baseline
  comparison, and assertion-writing guidance (good-vs-weak wording,
  determinism tradeoffs, necessity review). The only artifact format this
  skill authors.
- `references/promptfoo/` — unabridged firecrawl captures backing the above
  (see `references/promptfoo/SUMMARY.md`); loaded only to verify an exact
  detail, never as the default reference.

**Pattern sources — mined for transferable lessons, never adopted as a second
target format:**

- `references/agent-skills-native-evals.md` — the agentskills.io project's own
  `evals/evals.json` methodology (`with_skill`/`without_skill` baseline
  comparison, good-vs-weak assertion guidance, deterministic
  `tool_assertions`). Backed by `references/agentskills/evaluating-skills.md`
  and `references/agent-skills-eval/` (`README.md`, `schema.md`).
- `references/skill-judge-lessons.md` — distilled from the Skill Judge
  framework (design pattern → assertion style, triggering as a first-class
  failure mode). Backed by `references/skill-judge/README.md`.

**Pruned, deliberately not kept here:**

- Generic Promptfoo config schema, prompt-template syntax, and the
  deterministic assertion-type index — hand off to `promptfoo-evals` instead;
  see `references/promptfoo/SUMMARY.md`'s Pruned table for exactly where each
  topic now lives.

`references/SUMMARY.md` indexes all of the above with load triggers, so an
agent loads only what a given task needs.

## Next implementation step

The skill body (`skills/develop-skill-evals/SKILL.md`) and its full reference
set are now built and internally consistent with this spec. The one piece of
the original plan never completed: no real eval suite has been authored
end-to-end for any target skill yet — only references and scaffolding exist.
Recommended next step: author `skills/describe-skill/evals/` for real, using
`specs/describe-skill.md`'s already-concrete evaluation plan (under-
triggering, over-triggering, rename/redesign near-miss) as the first genuine
validation of this skill's workflow.

Once that lands, `grill-this-skill` is the more interesting follow-up
validation specifically for the multi-turn/agentic resolution — but its own
`specs/grill-this-skill.md` `### Evaluation plan` section is currently *meta*
(describes the general practice, not an instantiated plan for grill-this-
skill's own behavior), so `grill-this-skill` would need to be run on itself
first to produce a concrete plan before `develop-skill-evals` could use it.
