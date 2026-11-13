---
okf_version: "0.2.0"
type: Guide
title: "Local evaluation suite scaffolding"
description: "Create the evaluation artifact layout without a checkout-level scaffolding command."
sources:
  - id: promptfoo-agent-skills
    resource: "https://www.promptfoo.dev/docs/guides/test-agent-skills/"
    title: "Test agent skills"
generated:
  by: agent:rovo
  at: "2026-11-13"
---

# Local evaluation suite scaffolding

After approval of the proposed artifacts, create `evals/prompts/` and
`evals/tests/` inside the resolved target skill directory. Do not assume that the
target is installed under `skills/` in the current working directory.

Preserve existing suites. Reuse empty directories, but if
`evals/promptfooconfig.yaml` exists, inspect and update it within the approved
scope instead of overwriting it with a starter.

Create these files using ordinary file-writing tools:

- `evals/promptfooconfig.yaml`: use explicit `file://prompts/main.txt` and
  `file://tests/scenarios.yaml` entries, plus the chosen provider configuration.
- `evals/prompts/main.txt`: the provider-appropriate user request template, such
  as `{{task}}`, not a substitute for loading the target skill.
- `evals/tests/scenarios.yaml`: realistic test cases grounded in the approved
  evaluation plan, with inputs under `vars` and checks under `assert`.

Read `references/config-prompt-assertion-reference.md` for the minimal file
contents and `references/promptfoo-agent-skill-testing.md` for provider wiring.
These paths are relative to the authoring skill's root, not the target directory.

An already-installed `init-skill-eval` CLI is optional. Inspect its help and safety
before using it; do not assume a `scripts/` command exists in the current checkout,
install it on demand, or execute a scaffolder before artifact approval. Creating
these files does not authorize running evaluations or installing providers.
