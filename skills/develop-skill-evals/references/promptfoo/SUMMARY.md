---
okf_version: '0.2.0'
type: Specification
title: "Promptfoo Raw Captures — Context Map"
description: "Index of the promptfoo/ subdirectory's unabridged firecrawl captures, plus pointers to material that was pruned from here because it's generic Promptfoo mechanics already owned by the promptfoo-evals skill, not agent/skill-testing-specific."
sources:
  - id: promptfoo-docs-root
    resource: "https://www.promptfoo.dev/docs/"
    title: "Promptfoo Documentation"
    last_modified: '2026-07-30'
    author: "org:Promptfoo"
generated:
  by: agent:claude
  at: '2026-07-30T13:00:00Z'
---

# Promptfoo Raw Captures — Context Map

This subdirectory holds only the raw captures that are specific to
testing an **agent/skill invocation** — this skill's actual focus, per
`specs/develop-skill-evals.md`. Generic Promptfoo mechanics (config
schema, prompt authoring, deterministic assertions, custom providers,
tool-calling config) were pruned from here because `promptfoo-evals`
already owns that ground; see "Pruned" below for where to go instead.

## What's here

All four raw captures back the single condensed digest,
`../promptfoo-agent-skill-testing.md` (provider setup, `skill-used`,
`trajectory:*`, model-graded judging, and the custom-provider fallback are
now one file).

| Raw capture | Load only to... |
| --- | --- |
| `guides-test-agent-skills.md` | Verify an exact SDK provider config or assertion example the digest trimmed |
| `configuration-expected-outputs-deterministic.md` | Verify `trajectory:*`/`trace-*`/`skill-used` value-field shapes exactly |
| `configuration-expected-outputs-model-graded-llm-rubric.md` | Verify `llm-rubric` pass/threshold wording exactly |
| `configuration-expected-outputs-model-graded-search-rubric.md` | Verify `search-rubric` provider-support table exactly |

## Pruned — go to `promptfoo-evals` instead

These raw captures were deleted because they documented generic Promptfoo
mechanics with no agent/skill-testing angle, and `promptfoo-evals`'s own
`references/cheatsheet.md` already covers the same ground (config
structure, prompt formats, the full assertion-type tables, and Python/JS/
HTTP provider signatures). If a task needs this material, hand off to
`promptfoo-evals` rather than re-scraping it here.

| Topic | Where to go | Original source (re-scrape if ever needed) |
| --- | --- | --- |
| `promptfooconfig.yaml` config structure, incl. nested types (`TestCase`, `Scenario`, `DerivedMetric`, `ProvidersConfig`, `CommandLineOptions`) | `promptfoo-evals` cheatsheet, "Config structure" | https://www.promptfoo.dev/docs/configuration/reference/ |
| Prompt authoring (inline, multiline, Nunjucks, `file://`, dynamic Python/JS, chat JSON) | `promptfoo-evals` cheatsheet, "Write prompts" | https://www.promptfoo.dev/docs/configuration/prompts/ |
| Deterministic assertion type index (`equals`, `contains`, `is-json`, etc.) | `promptfoo-evals` cheatsheet, "Assertion types" | https://www.promptfoo.dev/docs/configuration/expected-outputs/ |
| Tool/function-calling schema config for bare providers | `promptfoo-evals` (not yet in its cheatsheet as of this writing — hand off and let it research if needed) | https://www.promptfoo.dev/docs/configuration/tools/ |
| Custom Python provider (`call_api` signature, return shape) | `promptfoo-evals` cheatsheet, "Python provider" | https://www.promptfoo.dev/docs/providers/python/ |
| Custom JavaScript/TypeScript provider (`callApi` signature, return shape) | `promptfoo-evals` cheatsheet, "JavaScript provider" | https://www.promptfoo.dev/docs/providers/custom-api/ |
| HTTP/HTTPS endpoint provider | `promptfoo-evals` cheatsheet, "HTTP endpoint" | https://www.promptfoo.dev/docs/providers/http/ |

Their condensed counterparts (`../promptfoo-config-schema.md`,
`../promptfoo-prompts-format.md`, `../promptfoo-assertions-index.md`) have
also been removed — this table is the only artifact left for those three
topics; use it to hand off to `promptfoo-evals` rather than looking for a
local file. `../promptfoo-skill-provider-setup.md` was separately merged
into `../promptfoo-agent-skill-testing.md` (its custom-provider framing and
the multi-turn round-trip limitation are now that file's "Fallback"
section); its generic Python/JS/tool-schema/HTTP mechanics were dropped
during the merge for the same reason as everything else in this table —
`promptfoo-evals` already owns them.
