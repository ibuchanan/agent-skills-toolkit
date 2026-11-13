---
okf_version: "0.2.0"
type: Research Synthesis
title: "Microskills research reference map and claim assessment"
description: "Primary-source reference map separating verified microskill mechanisms, related evidence, and unvalidated design proposals."
sources:
  - id: microskill-architecture-v1
    resource: "https://arxiv.org/abs/2606.05720v1"
    title: "Microskill Architecture: A Modular Skill-Driven Framework for AI-Native Code Generation"
  - id: lost-in-the-middle-v3
    resource: "https://arxiv.org/html/2307.03172v3"
    title: "Lost in the Middle: How Language Models Use Long Contexts"
  - id: voyager
    resource: "https://voyager.minedojo.org/"
    title: "Voyager: An Open-Ended Embodied Agent with Large Language Models"
  - id: reflexion-v4
    resource: "https://arxiv.org/abs/2303.11366v4"
    title: "Reflexion: Language Agents with Verbal Reinforcement Learning"
  - id: agent-skills
    resource: "https://agentskills.io/specification"
    title: "Agent Skills Specification"
  - id: openhands-skills
    resource: "https://docs.openhands.dev/overview/skills"
    title: "OpenHands Skills Overview"
  - id: cursor-rules
    resource: "https://cursor.com/docs/rules"
    title: "Cursor Rules"
generated:
  by: agent:rovo
  at: "2026-11-11T19:54:40Z"
---

<!-- markdownlint-disable MD013 -->

## Microskills reference map

**Verified:** 11 November 2026. These references critically assess the initial research supplied during discovery; that seed is not retained in this repository and is not an authority for its own claims. The references are concise syntheses, not copies of the original sources or a new microskill specification. The installed `SKILL.md` records the agreed local design; its authoring spec is provenance, not required runtime reading.

| Reference                                                                | Purpose                                                                              | Loading trigger                                                                                 |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [microskill-architecture.md](microskill-architecture.md)                 | Capsule structure, routing, quality-gated abstraction, and study limitations.        | Defining a microskill, citing the named architecture, or assessing its reported gains.          |
| [long-context-limitations.md](long-context-limitations.md)               | Position effects and limits of applying long-context findings to instruction design. | Explaining context-selection motivation or evaluating claims about attention and document size. |
| [learned-skills-and-reflection.md](learned-skills-and-reflection.md)     | Voyager's executable library versus Reflexion's textual memory.                      | Designing learning loops or distinguishing durable skills from reflective notes.                |
| [conditional-instruction-loading.md](conditional-instruction-loading.md) | Official Agent Skills, OpenHands, and Cursor loading mechanisms.                     | Choosing a packaging or activation mechanism, or comparing skills with rules.                   |

## Evidence categories

- **Source finding:** A mechanism or result explicitly described by a verified primary source, bounded by that source's scope.
- **Implementation guidance:** An official format, documented product behavior, or authoring recommendation; not itself a measured benefit.
- **Design inference or proposal:** A plausible application of related evidence, requiring local decisions and evaluation.
- **Unsubstantiated in this review:** No support found in the inspected sources; this does not prove that no supporting source exists.

## Assessment of the initial research

| Seed claim                                                                           | Assessment                                      | Evidence or correction                                                                                                     |
| ------------------------------------------------------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| The named MicroSkill paper and authors exist.                                        | Verified.                                       | Zare and Abdolrahmani, arXiv:2606.05720, submitted 4 June 2026.                                                            |
| Capsules provide bounded knowledge with constraints and exemplars.                   | Source finding.                                 | The paper uses YAML capsules scoped to code regions, interfaces, guardrails, and boilerplate.                              |
| The Abstractor Agent automatically turns execution errors into Markdown microskills. | Mischaracterizes the cited mechanism.           | The paper abstracts quality-approved solutions into capsules; failure-only triggering and Markdown are not its definition. |
| Microskills must cover one CLI subcommand or edge case.                              | Design proposal.                                | Not a universal boundary established by the reviewed sources.                                                              |
| Microskills typically contain 20–80 lines, versus 200–1,500+ for ordinary skills.    | Unsubstantiated in this review.                 | No measured size distribution found; Agent Skills and Cursor recommend main files/rules under 500 lines.                   |
| Ordinary `SKILL.md` files are inherently monolithic or permanently loaded.           | Incorrect generalization.                       | Agent Skills already specifies progressive, on-demand loading.                                                             |
| Long contexts can impair use of information in the middle.                           | Source finding with limits.                     | Lost in the Middle tests particular models on QA and retrieval, not CLI guidance.                                          |
| Voyager demonstrates reusable learned skills.                                        | Source finding, different artifact.             | Its library stores executable Minecraft programs, not short instruction files.                                             |
| Industry tools support selective context injection.                                  | Implementation guidance.                        | OpenHands and Cursor document distinct on-demand, keyword, path, relevance, and manual mechanisms.                         |
| Automatic distillation should run after every failure.                               | Design proposal, not established best practice. | Quality gating matters; Cursor recommends responding to repeated mistakes and avoiding rarely applicable edge cases.       |
| Versioning and pruning improve the proposed system.                                  | Maintenance proposal requiring evaluation.      | Version-controlled rules are documented; an optimal automatic pruning policy is not established here.                      |

## Authority and selection

The review favored original research and official specifications or product documentation. It checked currency, relevance, authority, accuracy, and purpose separately: a source can establish its own design without proving general effectiveness. Versioned papers anchor research claims; live documentation is dated but not release-pinned.

The MicroSkill paper supplies the closest direct definition but only a limited author-reported case study. Lost in the Middle provides stronger empirical grounding for a related context-use problem, not a microskill intervention. Voyager and Reflexion provide different learning precedents. Product documentation establishes available mechanisms, not adoption prevalence or performance gains.

### Sources not promoted to standalone references

- [AgentPatterns.ai: Skill as Knowledge Pattern](https://agentpatterns.ai/tool-engineering/skill-as-knowledge/) was inspected. It is secondary design guidance, not primary evidence of framework adoption. Its argument against excessive fragmentation is also inconsistent with treating every tiny rule as inherently useful.
- Search-result summaries and mirror sites were used for discovery only, not as substitutes for original sources.
- No standalone citation ledger or research report is required for this five-file reference set; per-document frontmatter records provenance.

## Approved local design

The local design implemented in `SKILL.md` defines a microskill as a standard skill directory containing only `SKILL.md`, scoped to one coherent tool-use intent and activation context. The human selects the lessons and judges whether their evidence is sufficient; a human-stated lesson is sufficient input, and supporting logs are optional.

Single-file output, tool-first naming, grouping by intent, and provenance-free captured guidance are deliberate local decisions, not research findings. Capture does not require successful execution, authoritative corroboration, multiple sessions, or another evidence threshold. The references here inform authoring the capture skill; they are not artifacts to embed in generated microskills.

## Unresolved empirical questions

The reviewed sources do not establish an optimal instruction size or decomposition boundary, or show that narrower units outperform a well-designed progressive-disclosure skill on this repository's tasks. Retrieval policies, automatic capture thresholds, and pruning schedules are not established by these sources and are outside the approved capture workflow.

Comparisons of routing accuracy, task success, repeated errors, tokens, or latency would require separate evaluation. They are not prerequisites for capturing human-selected lessons.

## Review update — 12 November 2026

This update aligns the reference map with the approved local specification while preserving the historical seed-claim assessments above. The live Agent Skills, OpenHands, and Cursor documentation, the Voyager project page, and the Reflexion v4 record and abstract were rechecked for the claims relevant to that specification. The MicroSkill v1 bibliographic record was also rechecked; this update does not constitute a fresh full-paper review or independent reproduction of any research results.
