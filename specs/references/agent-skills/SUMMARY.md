---
okf_version: '0.2.0'
type: Git Submodule
title: "Agent Skills specification reference map"
description: "Progressive-disclosure map for the vendored Agent Skills specification."
sources:
  - id: agentskills-specification
    resource: "https://github.com/agentskills/agentskills/blob/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs/specification.mdx"
    title: "Agent Skills Specification"
generated:
  by: agent:rovo
  at: '2026-07-29T15:57:52Z'
---

<!-- markdownlint-disable MD013 -->

## Agent Skills specification reference map

These concise references summarize the vendored Agent Skills specification at revision `38a2ff82958afee88dadf4831509e6f7e9d8ef4e`. They are a context map, not a replacement for `vendor/agentskills/docs/specification.mdx`.

| Source | Purpose | Loading trigger |
| --- | --- | --- |
| [skill-format.md](skill-format.md) | Required skill layout, frontmatter constraints, and instruction-body guidance. | Creating, reviewing, or debugging a `SKILL.md`; checking names, descriptions, or optional metadata. |
| [resource-organization.md](resource-organization.md) | Optional resource directories, progressive disclosure, and relative-file links. | Splitting an oversized `SKILL.md` or deciding where scripts, references, and assets belong. |
| [validation.md](validation.md) | Canonical validation command and its coverage. | Validating a skill or investigating frontmatter and naming failures. |

## Fast rules

- Every skill requires a `SKILL.md` with YAML frontmatter followed by Markdown instructions.
- `name` and `description` are required. Keep `name` aligned with the parent directory and make `description` explicit about both capability and activation cues.
- Keep detailed material in focused, on-demand resources; keep links from `SKILL.md` one level deep.
- Validate with `skills-ref validate ./my-skill`.
