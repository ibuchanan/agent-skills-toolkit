---
okf_version: "0.2.0"
type: Specification
title: "Develop Skill Evals Reference Set — Context Map"
description: "Index of all documentation references bundled for develop-skill-evals — the Promptfoo target format, plus two pattern sources (native agentskills.io evals.json, Skill Judge) mined for transferable eval-design lessons, never adopted as second targets — with load triggers, so an agent loads only the file(s) a task actually needs."
sources:
  - id: promptfoo-docs-root
    resource: "https://www.promptfoo.dev/docs/"
    title: "Promptfoo Documentation"
    last_modified: "2026-07-30"
    author: "org:Promptfoo"
  - id: agentskills-docs-root
    resource: "https://github.com/agentskills/agentskills/tree/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs"
    title: "agentskills.io documentation"
    author: "org:agentskills"
  - id: agent-skills-eval-repo-root
    resource: "https://github.com/darkrishabh/agent-skills-eval/tree/b60eebe3c6edaa917a284e13b9b0e9fa00f1c957"
    title: "agent-skills-eval"
    author: "human:darkrishabh"
  - id: skill-judge-readme
    resource: "https://github.com/softaworks/agent-toolkit/blob/3027f20f3181758385a1bb8c022d4041dfb4de84/skills/skill-judge/README.md"
    title: "Skill Judge"
    author: "org:softaworks"
generated:
  by: agent:claude
  at: "2026-07-30T13:28:20Z"
---

# Develop Skill Evals Reference Set — Context Map

One target format, two pattern sources:

| Source                             | Purpose                                                                                                                                                                                                                                                                                                                                  | Loading trigger                                                                                                                                                                                                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `promptfoo-agent-skill-testing.md` | Provider setup, `skill-used`/`trajectory:*`/`trace-*` assertions, `llm-rubric`/`search-rubric` judging, the custom-provider fallback, plus patterns folded in from the two sources below (good-vs-weak assertion wording, with/without-skill baseline comparison)                                                                        | Any task authoring or debugging Promptfoo artifacts to test a skill invocation — **the only format this skill authors**, per `specs/develop-skill-evals.md`                                                                                                              |
| `agent-skills-native-evals.md`     | The agentskills.io project's own `evals/evals.json` methodology: test-case shape, `with_skill`/`without_skill` baseline comparison, good-vs-weak assertion guidance, deterministic `tool_assertions`, grading/benchmark aggregation                                                                                                      | **Not a target format** — this skill never authors `evals/evals.json`. Load only to explain what it is before declining a request for it, or to trace an extracted pattern back to its source; the patterns themselves are already in `promptfoo-agent-skill-testing.md` |
| `skill-judge-lessons.md`           | Distilled from the Skill Judge framework: design pattern (Tool/Navigation/Process/Mindset/Philosophy) → appropriate assertion style, and triggering as a first-class failure mode. Most of Skill Judge itself (knowledge-delta scoring, the 120-point rubric) judges a `SKILL.md`'s writing quality, not behavior — not this skill's job | **Not a target methodology** — this skill never scores a target's `SKILL.md`. Load only to explain that boundary before declining, or to trace a pattern back to its source; the patterns themselves already live in this skill's own workflow steps 1 and 4             |

`promptfoo-agent-skill-testing.md` was previously three files (merged for
having one workflow, not three separable concerns — see its own history
in `promptfoo/SUMMARY.md`). This file is kept even when thin because more
references are expected to land here over time — retain it as the index
going forward rather than removing it for being momentarily oversized for
its content.

Generic Promptfoo authoring mechanics (config schema, prompt formats,
deterministic assertion index, and custom-provider mechanics) were pruned
entirely; hand those off to the `promptfoo-evals` skill instead — see
`promptfoo/SUMMARY.md`'s Pruned table for exactly where.

## Raw captures

- `promptfoo/` — read `promptfoo/SUMMARY.md` for its index. Backs
  `promptfoo-agent-skill-testing.md`; never load a raw capture as the
  default reference, since these run hundreds of lines each.
- `agentskills/evaluating-skills.md` — full-fidelity capture backing
  `agent-skills-native-evals.md`'s methodology section.
- `agent-skills-eval/README.md` and `agent-skills-eval/schema.md` — the
  reference implementation's own README and verbatim TypeScript schema
  (`evals/evals.json` shape, `ToolAssertion`, `Provider`, YAML config),
  backing `agent-skills-native-evals.md`'s schema and SDK sections.
- `skill-judge/README.md` — full-fidelity capture backing
  `skill-judge-lessons.md`.

## Rarely needed — web URLs only, not vendored here

Everything below is real but low-relevance to writing evals specifically;
rather than vendor a raw copy nobody will load, use the live URL if a task
genuinely needs it:

<!-- markdownlint-disable MD060 -->

| Topic                                                                                                                             | URL                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Agent Skills spec (`SKILL.md` frontmatter/layout — already summarized at `specs/references/agent-skills/skill-format.md`)         | <https://github.com/agentskills/agentskills/blob/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs/specification.mdx>                          |
| Skill-authoring best practices (not eval-specific — see `develop-skill` instead)                                            | <https://github.com/agentskills/agentskills/blob/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs/skill-creation/best-practices.mdx>          |
| Optimizing skill `description` for triggering                                                                                     | <https://github.com/agentskills/agentskills/blob/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs/skill-creation/optimizing-descriptions.mdx> |
| Bundling scripts in a skill (referenced by evaluating-skills.md's "bundle repeated work" tip)                                     | <https://github.com/agentskills/agentskills/blob/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs/skill-creation/using-scripts.mdx>           |
| Agent Skills quickstart / client support                                                                                          | <https://github.com/agentskills/agentskills/blob/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs/skill-creation/quickstart.mdx>              |
| `agent-skills-eval` hosted docs site (more detail than the README)                                                                | <https://darkrishabh.github.io/agent-skills-eval/>                                                                                         |
| `agent-skills-eval` implementation source (discover/grade/run-eval/reporters — only if the SDK's behavior itself needs verifying) | <https://github.com/darkrishabh/agent-skills-eval/tree/b60eebe3c6edaa917a284e13b9b0e9fa00f1c957/src>                                       |
| `skill-creator` Skill (automates the evaluating-skills.md workflow end to end)                                                    | <https://github.com/anthropics/skills/tree/main/skills/skill-creator>                                                                      |
