# Repair an over-triggering skill description

To stop an existing skill from activating on requests outside its approved
scope, use `describe-skill` to narrow its frontmatter description, then check
both the reported false positives and the intended triggers.

## Prerequisites

- An existing skill with a drafted or working `SKILL.md`.
- Its approved specification, if available, and concrete requests on which it
  activated incorrectly.
- Access to the agent environment where the incorrect activation occurred.
- A checkout with dependencies installed and Bun available for validation.

Run terminal commands from the toolkit checkout root. Replace the following
value with the target skill's existing directory name:

```sh
skill_name='your-skill-name'
skill_dir="skills/$skill_name"
test -f "$skill_dir/SKILL.md"
git diff -- "$skill_dir/SKILL.md"
```

Preserve any existing edits before proceeding. Do not use this procedure to
rename the skill or change its intended behavior. If the body and specification
disagree about scope, resolve that agreement with `grill-this-skill` first.

## 1. Record the failing and intended requests

Collect the exact false-positive requests and evidence of activation, such as
an agent trace or explicit skill-load event. Also record legitimate requests
from the specification or existing evaluations that must continue to activate
this skill.

For each request, record the expected decision and its source:

| Request                       | Expected decision              | Evidence                                          |
| ----------------------------- | ------------------------------ | ------------------------------------------------- |
| Exact reported false positive | Do not select the target skill | Approved non-scope or conflicting skill ownership |
| Existing in-scope request     | Select the target skill        | Approved trigger context                          |
| Supported wording variation   | Select the target skill        | Same approved task, different phrasing            |

Use actual requests and supported variations, not invented responsibilities.
If you cannot establish the intended decision, settle the scope before editing.

## 2. Ask for description candidates without authorizing a write

Give the agent the actual paths and recorded requests with this instruction:

> Read `skills/describe-skill/SKILL.md` and follow it for the target skill.
> Read its full `SKILL.md` and approved specification, if present. Diagnose the
> reported over-triggering using the attached requests and activation evidence.
> Propose one to three description strings with explicit skip language for the
> false positives. Keep the name and body unchanged. Identify any intended
> triggers that could be lost, especially safety-relevant coverage. Do not
> write until I approve a specific candidate string.

Check each candidate against the recorded cases. Reject wording that excludes
legitimate uses or disguises a behavior change as a description correction.
Require a non-empty string of at most 256 characters, with no colon or em dash.

## 3. Approve and apply one exact description

Approve one candidate verbatim, or supply the exact edited string you want.
Authorize the agent to change only the target's `description` field.

Review and validate the result:

```sh
git diff -- "$skill_dir/SKILL.md"
bun run src/scripts/validate-skill.ts "$skill_dir"
```

Confirm that the `name`, body, and other skills are unchanged. If this skill had
pre-existing edits, compare against the state recorded before this procedure,
not just the last commit.

## 4. Recheck automatic selection

Start a fresh conversation for each recorded request using the same agent,
model, available skills, and settings as the original failure. Ensure the
updated description is loaded; reload or restart the agent if it caches skill
metadata.

Submit each request without explicitly invoking or loading the target skill.
Inspect the agent's selection trace, not just the quality of its final answer.
Record the outcome alongside the original failure evidence.

- If a false positive remains, return to the diagnosis with the new trace.
- If an intended trigger stops activating, revise the candidate before accepting
  the repair. Explicitly review any safety-related loss of coverage.
- If the environment does not expose selection evidence, mark activation as
  unverified rather than treating a plausible answer as proof.

If the approved evaluation plan covers these cases, update the corresponding
regression artifacts with `develop-skill-evals`. Authoring tests does not run
them. Execute live evaluations only with authorization and configured providers.
Do not invent a new evaluation plan through that skill.

## Completion check

Accept the repair when only the approved description changed, structural
validation passes, the reported false positives no longer select the skill,
and the recorded intended requests still do. Report the tested environment,
observed results, and any cases whose selection remains unverified.

For validator constraints and evaluation side effects, consult the
[CLI reference](../reference/cli-tools.md).
