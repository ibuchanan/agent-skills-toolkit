# Capture Microskill evaluation suite

Authors artifacts for the eight **Capture skill** scenarios in `specs/capture-microskill.md`. This suite does not evaluate downstream invocation of generated skills. The target is a Process skill: objective artifact and attempted-tool checks complement routing assertions and final-response rubric judgments.

## Preparation and execution handoff

- Requires an independently installed, compatible Promptfoo and Claude Agent SDK, Anthropic credentials, and the repository's `yaml` dependency. No installation or evaluation is performed by these artifacts' authoring workflow.
- From this directory, run `node prepare.mjs` before each fresh evaluation. It deletes only this suite's `.work/`, creates eight separate fixture projects, and copies the current capture `SKILL.md` into each project's `.claude/skills/`. It does not modify the source skill or global installation settings.
- Run the configured evaluation separately with caching disabled. Use a single pass: **do not use in-place repeats**. For repeated trials, prepare fresh workspaces before each trial and retain results separately. Preparation deliberately destroys previous disposable artifacts.
- The native `anthropic:claude-agent-sdk` provider is used, not a hand-rolled custom-provider fallback. Each case selects its own provider label and workspace. `maxConcurrency: 1` keeps filesystem observations simple.
- Treat credentials and SDK tool permissions as execution-environment concerns. Use an isolated account/container for execution. The Claude tool preset exposes shell tools so attempted misuse can fail a check; they are not auto-approved. A permission denial is not counted as compliant behavior. Stop a run requiring unexpected interactive tool approval rather than approve the command.

## What is checked

`tests/scenarios.yaml` maps one case to each approved scenario. Synthetic tool behavior is supplied as a human-selected lesson; it is not asserted to be independently verified product documentation. The collision fixture has no merge authorization, matching the current spec's ask-before-modifying behavior. The placement fixture deliberately lacks placement guidance.

`assertions/artifacts.cjs` checks actual workspace files, metadata, single-file output, selected exact syntax, preservation of the collision fixture, no writes in clarification/near-miss cases, and observed write paths. It inspects all recorded tool calls, including errored attempts; missing trace data fails closed. Shell, network, installation, and other unexpected tool attempts fail even if denied. The fixture has no legitimate need for shell tools or creation helpers.

Positive routing cases require `skill-used`. Discovery requires `not-skill-used`. Discussion has no mandatory routing expectation because the spec does not settle whether the skill should activate for that wording. Every routing assertion is paired with checks on final output and artifacts.

Rubric assertions judge final responses only, with a pinned model, temperature zero, and a 0.8 threshold. They cannot inspect generated files. The deterministic artifact checks cover selected syntax and obvious provenance headings but do not establish complete semantic fidelity, useful triggering of generated skills, absence of all unsupported claims, or every possible provenance formulation. Human review of generated files is still needed for those judgments. This is **partial workflow coverage**, not proof of end-to-end tool correctness.

## Review after execution

No run results are included. Review actual SDK metadata shape, provider-label filtering, routing results, and permission behavior on the first independently executed run. Provider/config compatibility is not established by static checks. Hand off provider or assertion debugging to `promptfoo-evals`.

Repeat with fresh preparation to inspect variance; do not trust one rubric judgment. Tighten assertions that fail to discriminate or fail structurally across all cases. There is no without-skill baseline here, so results cannot establish incremental benefit from the skill.

The suggested publication changes and additional extraction/scope-conflict scenarios were not applied or added: this authoring task cannot change the target behavior or invent scenarios beyond the approved evaluation plan. Update the spec separately before expanding the suite.
