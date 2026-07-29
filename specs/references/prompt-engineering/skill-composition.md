---
okf_version: '0.2.0'
type: Web Scrape
title: "Skill composition and installation guidance"
description: "Summary of Zed's linked guidance on skill structure, progressive disclosure, locations, and trust."
sources:
  - id: zed-skills-guide
    resource: "https://zed.dev/docs/assistant/prompting"
    title: "Skills | Agent Skills"
    author: "org:Zed Industries"
generated:
  by: agent:rovo
  at: '2026-07-29T22:47:30Z'
---

<!-- markdownlint-disable MD013 -->

## Skill composition and installation guidance

Zed describes skills as progressively disclosed resources: the agent first sees the name and description, then loads the main body after activation, and can load references or run scripts on demand. Put the most important routine guidance near the beginning of `SKILL.md`; move detailed material into `references/`; place executable support in `scripts/`.

Zed loads skills from global and project-local roots. Skills are direct children of those roots rather than nested groups. Project-local skills require a trusted worktree, and Zed requires explicit authorization before an agent edits skill files or bundled resources.

## Use in this toolkit

- Keep `SKILL.md` focused and move conditional detail to provenance-backed references.
- Prefer a flat skill-root installation model; use the toolkit's discovery and installation scripts rather than inventing nested skill registries.
- Treat locally supplied skills and resources as a trust boundary. Require explicit user authorization before changing the instructions that will govern future agent behavior.
- Use symlink or installation behavior only when it preserves the flat discovery model expected by the target environment.
