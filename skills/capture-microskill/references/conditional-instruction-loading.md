---
okf_version: "0.2.0"
type: Research Synthesis
title: "Conditional instruction loading in Agent Skills, OpenHands, and Cursor"
description: "Official loading mechanisms, authoring advice, and limits of the claimed microskill distinction."
sources:
  - id: agent-skills-specification-live
    resource: "https://agentskills.io/specification"
    title: "Agent Skills Specification"
  - id: openhands-skills-overview
    resource: "https://docs.openhands.dev/overview/skills"
    title: "OpenHands Skills Overview"
  - id: openhands-keyword-skills
    resource: "https://docs.openhands.dev/overview/skills/keyword"
    title: "OpenHands Keyword-Triggered Skills"
  - id: cursor-rules
    resource: "https://cursor.com/docs/rules"
    title: "Cursor Rules"
generated:
  by: agent:rovo
  at: "2026-11-11T19:54:40Z"
---

<!-- markdownlint-disable MD013 -->

## Conditional instruction loading

**Verified:** 11 November 2026 against official live documentation. These pages are authoritative for their own formats and documented behavior, not empirical proof of performance or industry-wide adoption. They are unversioned; retrieval date matters, and future implementations may differ.

## Agent Skills — specification

A skill is a directory containing `SKILL.md`, with required `name` and `description` frontmatter. Optional resources include scripts, references, and assets. The specification describes progressive disclosure:

| Layer        | Documented loading model                                                            |
| ------------ | ----------------------------------------------------------------------------------- |
| Metadata     | Names and descriptions available at startup, approximately 100 tokens per skill.    |
| Instructions | Full `SKILL.md` body loaded when a skill activates; under 5,000 tokens recommended. |
| Resources    | Supporting files loaded only when required.                                         |

The specification recommends keeping the main file under 500 lines and individual reference files focused. These are authoring recommendations, not a normative 20–80-line definition of microskills.

**Consequence for the seed:** `SKILL.md` is a packaging format, not a synonym for a broad, permanently loaded prompt. A narrowly scoped, selectively loaded unit can already be an ordinary Agent Skill. Earlier authoring research used a pinned repository snapshot; this document describes live pages inspected on the verification date and does not update that historical pin. That earlier reference map is not needed to use this bundled guidance.

## OpenHands — skills overview and keyword documentation

| Mechanism               | Behavior described in the overview                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| Repository `AGENTS.md`  | Full content included in the initial system prompt.                                                         |
| Agent Skills `SKILL.md` | Metadata advertised first; full instructions invoked when relevant.                                         |
| Skill with `triggers`   | Available for model invocation, with additional injection when a keyword or command matches a user message. |
| Rule with `paths`       | Injected when a matching file is first touched; not advertised as a model-invoked skill.                    |

The overview describes metadata → instructions → resources disclosure and recommends `.agents/skills/` for new skills. Legacy `.openhands/skills/` and `.openhands/microagents/` locations remain supported. A legacy `.md` skill without a trigger is documented as always loaded.

**Documentation discrepancy:** The keyword page says skills are “only loaded” when a trigger word appears. The overview explicitly says triggered skills also remain available for model invocation. This reference preserves that discrepancy rather than treating keyword matching as the only activation route. Exact behavior should be checked against the deployed OpenHands version.

Keyword and path matching are not synonymous with vector search, and user-message triggers are not a guarantee of loading immediately before a tool invocation. OpenHands states that skills do not grant permissions or install dependencies.

## Cursor — project rules and best practices

Project rules use `.mdc` files in `.cursor/rules`, with `description`, `globs`, and `alwaysApply` controlling inclusion.

| Rule type               | Activation                                   |
| ----------------------- | -------------------------------------------- |
| Always Apply            | Every chat session.                          |
| Apply Intelligently     | Agent judges relevance from the description. |
| Apply to Specific Files | Matching file is in context.                 |
| Apply Manually          | Rule is mentioned explicitly.                |

Cursor recommends focused, actionable, scoped rules; fewer than 500 lines; composable smaller rules; concrete examples; and references to canonical files instead of copying them. It advises starting simple and adding rules after repeated mistakes. It also cautions against documenting every possible command or adding rarely applicable edge cases.

This supports selective guidance and incremental maintenance. It does not support mandatory one-command units, automatic capture after every failure, or a universal microskill size. Version-controlled rule files are evidence of a maintenance mechanism, not proof of a validated automatic pruning policy.

## Authority and evidence boundaries

- **Currency:** Live official docs checked on the stated date, without a release or commit pin.
- **Relevance:** Direct evidence for modular instructions and activation mechanisms.
- **Authority:** Standards documentation for Agent Skills; product documentation for OpenHands and Cursor.
- **Accuracy:** Mechanisms and recommendations are distinguished; the OpenHands wording conflict remains explicit.
- **Purpose:** Configuration and authoring guidance, not comparative research. No reliability, token-cost, or latency effect size follows from these pages.

**Local terminology proposal:** “Microskill” may name a deliberately narrow instruction unit within these mechanisms. That is a local design choice, not a separate cross-tool standard established by the reviewed documents.
