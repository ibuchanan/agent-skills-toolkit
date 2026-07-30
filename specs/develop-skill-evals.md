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

Direct and instructional. Explain Promptfoo mechanics inline as they come up
(config structure, assertion types, provider setup) rather than assuming
familiarity. Treat the spec's evaluation plan as settled — don't re-ask what
the skill should do. Be prescriptive about artifact file layout and naming so
eval suites stay consistent across skills in this repo; be flexible about
assertion choices where the spec doesn't dictate them.

## Context

Trigger when a user has an approved lean evaluation plan for a specific agent
skill and wants it turned into Promptfoo artifacts — this skill is about
testing skill behavior/triggering, not generic prompt evals.

### Trigger & non-trigger contexts

Trigger for: authoring or updating Promptfoo test artifacts for a skill whose
`specs/<skill>.md` already contains a lean evaluation plan.

Do not trigger, and redirect instead, when:
- no spec or lean evaluation plan exists yet for the target skill → redirect
  to `grill-this-skill` first; do not improvise scenarios.
- the request is about generic Promptfoo work unrelated to an agent skill
  (a bare prompt, a non-skill LLM app), or about running/debugging an
  already-authored suite's regressions → defer to `promptfoo-evals`.

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
  this skill authors config only; running is out of scope.
- Treat the target skill's own `SKILL.md` body as ground truth for expected
  behavior; scenarios must trace back to it, not to assumptions.

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
  test cases/assertions grounded in that plan, and (b) stay in scope — no
  edits to the target `SKILL.md`, no unapproved writes, no attempt to run
  Promptfoo?
- **Scenario types**:
  1. Normal case — a spec with a complete lean plan (e.g.
     `specs/describe-skill.md`) → expect faithful artifacts proposed for
     `skills/describe-skill/evals/`.
  2. Near miss — user asks to develop evals for a skill with no spec/plan yet
     → expect a redirect to `grill-this-skill`, not fabricated scenarios.
  3. Scope-boundary near miss — user also asks it to edit the target skill's
     behavior or run the suite → expect a decline, staying to authoring only.
- **Evidence source**: the target skill's approved `specs/<skill>.md`
  evaluation-plan section, plus its `SKILL.md` body for behavior grounding.
- **Judging**: scope adherence and faithfulness-to-plan are objectively
  checkable; the quality of specific assertion choices needs human or
  LLM-judge review.

## Open decisions

- **Question**: how should multi-turn/interview-driven or agentic skills
  (tool calls, multi-step conversations — most skills in this repo, including
  `grill-this-skill` itself) be represented in Promptfoo, which is built
  around single prompt→response evaluation?
  **Why it matters**: without an answer, authored artifacts for such skills
  may misrepresent what's actually being tested.
  **What it blocks**: detailed evaluation authoring for multi-turn/agentic
  skills specifically; does not block approving this spec or authoring evals
  for single-turn/tool-output skills now.
  **Next owner**: research via Promptfoo docs (see References) before the
  first multi-turn skill's evals are authored.

## References

Existing, reusable now:
- `specs/references/agent-skills/skill-format.md` — skill structure grounding
  for mapping scenarios onto behavior faithfully.
- `specs/references/prompt-engineering/skill-composition.md` — trigger/
  near-miss phrasing craft, useful for scenario-to-test-case mapping.

Missing, needs `ingest-reference`:
- Official Promptfoo docs on `promptfooconfig.yaml` config schema.
- Promptfoo assertion types, especially model-graded assertions
  (`llm-rubric`) for the "needs human/LLM-judge review" cases the lean plans
  flag.
- Promptfoo provider setup for testing a skill invocation (vs. a bare prompt).

Open research question: how Promptfoo represents multi-turn/agentic test
cases (see Open decisions above) — needs resolution before ingestion is
complete.

## Next implementation step

The initial implementation is `skills/develop-skill-evals/SKILL.md` (currently
a template stub). Suggested next step after approval: `ingest-reference` to
acquire the missing Promptfoo references, then author the skill body using
`specs/describe-skill.md` as the first real test case for its own workflow.
