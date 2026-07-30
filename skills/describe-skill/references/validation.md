---
okf_version: '0.2.0'
type: Git Submodule
title: "Agent Skills validation"
description: "Summary of the canonical Agent Skills validation command and the constraints it checks."
sources:
  - id: agentskills-specification
    resource: "https://github.com/agentskills/agentskills/blob/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs/specification.mdx"
    title: "Agent Skills Specification"
generated:
  by: agent:rovo
  at: '2026-07-29T15:31:37Z'
---

<!-- markdownlint-disable MD013 -->

## Validation

Use the `skills-ref` reference library to validate a skill directory:

```bash
skills-ref validate ./my-skill
```

The validator checks `SKILL.md` frontmatter and naming conventions. In particular, it is the authoritative local check for the required `name` and `description` fields and the naming rules summarized in [skill-format.md](skill-format.md).

Run validation after creating or changing a skill’s frontmatter, directory name, or required file structure.
