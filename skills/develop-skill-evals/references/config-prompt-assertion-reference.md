---
okf_version: "0.2.0"
type: Guide
title: "Minimal Promptfoo artifact authoring"
description: "Local configuration, prompt, and assertion patterns for skill evaluation suites."
sources:
  - id: promptfoo-agent-skills
    resource: "https://www.promptfoo.dev/docs/guides/test-agent-skills/"
    title: "Test agent skills"
  - id: promptfoo-deterministic
    resource: "https://www.promptfoo.dev/docs/configuration/expected-outputs/deterministic/"
    title: "Deterministic assertions"
generated:
  by: agent:rovo
  at: "2026-11-13"
---

# Minimal Promptfoo artifact authoring

Condensed from the bundled Promptfoo captures. Read
`references/promptfoo-agent-skill-testing.md` (paths here are skill-root-relative)
for provider setup, routing metadata, tracing, and model-graded assertions.
This guide is not a full configuration schema; do not invent unsupported fields.

## Configuration and prompt files

Create `evals/promptfooconfig.yaml` with explicit file references:

```yaml
$schema: https://promptfoo.dev/config-schema.json
prompts:
  - file://prompts/main.txt
providers:
  - id: anthropic:claude-agent-sdk
    config:
      working_dir: ./fixtures/project
      setting_sources: [project]
tests:
  - file://tests/scenarios.yaml
```

Choose the actual provider and fixture directory from the target environment;
this example is not authorization to create fixtures or run an agent. The fixture
must contain the intended installed skill and any task inputs, not an accidental
link to the authoring checkout. See the bundled provider digest for other SDKs.

`prompts/main.txt` contains the user request template, for example `{{task}}`.
Keep system instructions, conversation format, and provider configuration separate
when the chosen provider requires them; do not substitute a generic chat prompt
for an actual skill invocation.

## Tests and assertions

`tests/scenarios.yaml` is a list of tests. Inputs belong under `vars`; assertions
belong under `assert`, not `assertions`:

```yaml
- description: Produces the required result for the approved normal case
  vars:
    task: Replace with a realistic request from the approved plan
  assert:
    - type: contains
      value: Replace with an objectively required output fragment
    - type: not-contains
      value: Replace with a prohibited output fragment
```

Use `equals` for exact output, `contains` for substrings, `regex` for patterns,
and `is-json` for valid JSON. `is-json` can take a JSON Schema in `value` to check
structure. Do not infer artifact validity from a mention in the final response;
use artifact-reading assertions when the outcome is written to disk.

For skill activation use `skill-used` with the expected skill name, paired with
an outcome assertion. Trace-dependent checks need the provider's actual routing
or trace metadata; do not use model prose as evidence of a tool call. Consult
`references/promptfoo-agent-skill-testing.md` for exact supported shapes.

Common assertions can be placed under `defaultTest.assert`; each test then adds
its own `assert` entries. Reuse only checks meaningful for every affected test,
especially when near misses should not activate the skill.

## Evidence and scope

The sources are bundled under `references/promptfoo/`; consult the deterministic
capture for exact assertion fields and the digest for grading semantics. If an
advanced case is not covered, report the missing contract or suggest a specialist
handoff if available. Never assume `promptfoo-evals` is installed. Do not execute
Promptfoo or install dependencies as part of artifact authoring.
