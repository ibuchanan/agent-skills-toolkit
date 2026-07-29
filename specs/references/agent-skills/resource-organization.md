---
okf_version: '0.2.0'
type: Git Submodule
title: "Agent Skills resources and progressive disclosure"
description: "Summary of optional skill directories, resource-loading layers, and relative-file reference rules."
sources:
  - id: agentskills-specification
    resource: "https://github.com/agentskills/agentskills/blob/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs/specification.mdx"
    title: "Agent Skills Specification"
generated:
  by: agent:rovo
  at: '2026-07-29T15:31:37Z'
---

<!-- markdownlint-disable MD013 -->

## Resources and progressive disclosure

## Optional directories

| Directory | Intended contents | Authoring guidance |
| --- | --- | --- |
| `scripts/` | Executable code. | Make scripts self-contained or document dependencies; provide useful errors and handle edge cases. Common implementations use Python, Bash, or JavaScript, subject to client support. |
| `references/` | Detailed documentation used only when needed. | Keep each file narrowly focused so agents load only the relevant context. Examples include technical references, form formats, and domain guides. |
| `assets/` | Static resources. | Store templates, images, and data files such as lookup tables or schemas. |

## Loading model

Skills are designed for progressive loading:

1. **Metadata**: `name` and `description` are loaded for every skill at startup (about 100 tokens).
2. **Instructions**: the `SKILL.md` body is loaded after the skill is activated (under 5,000 tokens recommended).
3. **Resources**: files in `scripts/`, `references/`, and `assets/` are loaded only when the active task needs them.

Design consequence: put discovery cues in `description`, operational essentials in `SKILL.md`, and specialized or lengthy material in a focused resource file.

## File references

Reference paths relative to the skill root. For example:

```markdown
See [the reference guide](references/REFERENCE.md) for details.

Run the extraction script:
scripts/extract.py
```

Keep resource links one level from `SKILL.md`; avoid chains of deeply nested references.
