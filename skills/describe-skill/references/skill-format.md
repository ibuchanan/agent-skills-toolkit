---
okf_version: '0.2.0'
type: Git Submodule
title: "Agent Skills SKILL.md format"
description: "Normative summary of required skill structure, frontmatter fields, and instruction-body guidance."
sources:
  - id: agentskills-specification
    resource: "https://github.com/agentskills/agentskills/blob/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs/specification.mdx"
    title: "Agent Skills Specification"
generated:
  by: agent:rovo
  at: '2026-07-29T15:31:37Z'
---

<!-- markdownlint-disable MD013 -->

## `SKILL.md` format

## Required layout

A skill is a directory whose minimum required file is `SKILL.md`. That file starts with YAML frontmatter and is followed by Markdown instructions.

```text
skill-name/
└── SKILL.md
```

## Frontmatter contract

| Field | Required | Requirements |
| --- | --- | --- |
| `name` | Yes | 1–64 characters; lowercase Unicode alphanumerics and hyphens only; no leading, trailing, or consecutive hyphens; must equal the parent-directory name. |
| `description` | Yes | 1–1024 characters and non-empty; state both what the skill does and when to use it; include activation keywords. |
| `license` | No | A short license name or a reference to a bundled license file. |
| `compatibility` | No | 1–500 characters when present; use only for specific environmental requirements such as host product, packages, or network access. |
| `metadata` | No | String-keyed, string-valued mapping for client-specific properties; prefer distinctive key names. |
| `allowed-tools` | No | Experimental, space-separated list of pre-approved tools; implementation support varies. |

Minimal example:

```markdown
---
name: skill-name
description: States the capability and when to use it.
---
```

## Instruction body

The body may use any Markdown structure that helps an agent perform the task. Useful content includes procedures, input/output examples, and common edge cases.

An agent loads the complete `SKILL.md` after activation. Keep the main body focused—under 5,000 tokens is recommended and under 500 lines is advised—and move detailed material into on-demand references.
