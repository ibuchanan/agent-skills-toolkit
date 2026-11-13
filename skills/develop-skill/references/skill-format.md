---
okf_version: "0.2.0"
type: Guide
title: "Agent Skills package and instruction format"
description: "Package layout, frontmatter constraints, resource links, and progressive disclosure for skill authors."
sources:
  - id: agentskills-specification
    resource: "https://agentskills.io/specification"
    title: "Agent Skills Specification"
    author: "org:Agent Skills contributors"
  - id: agentskills-specification-snapshot
    resource: "https://github.com/agentskills/agentskills/blob/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs/specification.mdx"
    title: "Agent Skills Specification — reviewed snapshot"
generated:
  by: agent:rovo
  at: "2026-11-13"
---

# Agent Skills package and instruction format

Load when checking package layout, metadata, or resource links.

## Package contract

A skill is a directory containing at least `SKILL.md`. That file begins with
YAML frontmatter, followed by Markdown instructions. The body has no prescribed
section structure; use procedures, examples, and edge cases that help execution.

| Field | Contract in the reviewed specification |
| --- | --- |
| `name` | Required, 1–64 characters; lowercase Unicode alphanumeric characters and hyphens; no leading, trailing, or consecutive hyphens; matches the directory name. |
| `description` | Required, non-empty, at most 1,024 characters; describes capability and activation context. |
| `license` | Optional license name or reference to a bundled license file. |
| `compatibility` | Optional, 1–500 characters when provided; specific environment requirements rather than routine setup prose. |
| `metadata` | Optional mapping from string keys to string values. |
| `allowed-tools` | Experimental space-separated tool list; support varies by client. |

```text
skill-name/
├── SKILL.md
├── references/  # Conditional documentation
├── assets/      # Templates and static resources
└── scripts/     # Reusable executable helpers
```

Only `SKILL.md` is required. Add other directories only for actual task needs.

## Disclosure and links

- Metadata is available for discovery; the full instruction body loads after
  activation; supporting resources load when needed.
- Keep routine decisions in `SKILL.md`. Put conditional detail in focused files
  and specify the circumstances under which to load each one.
- Reference bundled resources relative to the skill root, such as
  `references/script-design.md`. Avoid chains of references that require loading
  several documents to reach the useful content.
- Distinguish resource paths from the agent's current working directory when
  documenting executable commands; do not assume every client changes directory.

## Requirements versus advice

The upstream document recommends a main file below 5,000 tokens and advises
keeping it under 500 lines. These are authoring heuristics, not frontmatter
validity rules or evidence that behavior is correct. The local `develop-skill`
specification rejects universal line-count and PromptLint score gates: organize
by task-relevant loading boundaries instead.

Mechanical validation can check format and naming. It does not establish useful
instructions, faithful implementation of a spec, or correct runtime behavior.

## Provenance and limits

Adapted and condensed from the Agent Skills contributors' specification, licensed
[CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/). The reviewed local copy
is `vendor/agentskills/docs/specification.mdx` at commit
`38a2ff82958afee88dadf4831509e6f7e9d8ef4e` (9 July 2026); the previously bundled
copy matched it byte-for-byte. Reviewed 13 November 2026. This is a summary, not
an unchanged reproduction. The live website was not rechecked; client-specific
behavior and later upstream changes are not verified here.
