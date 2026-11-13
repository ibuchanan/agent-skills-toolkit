---
okf_version: "0.2.0"
type: Research Synthesis
title: "MicroSkill Architecture: capsules, routing, and abstraction"
description: "Verified architecture and bounded empirical claims from Zare and Abdolrahmani's MicroSkill preprint."
sources:
  - id: zare-abdolrahmani-2026
    resource: "https://arxiv.org/abs/2606.05720v1"
    title: "Microskill Architecture: A Modular Skill-Driven Framework for AI-Native Code Generation"
  - id: zare-abdolrahmani-2026-full-text
    resource: "https://arxiv.org/pdf/2606.05720v1"
    title: "Microskill Architecture — full text, version 1"
generated:
  by: agent:rovo
  at: "2026-11-11T19:54:40Z"
---

<!-- markdownlint-disable MD013 -->

## MicroSkill Architecture

**Authors:** Mohammad Zare and Omid Abdolrahmani. **Published:** 4 June 2026, arXiv version 1. **Verified:** 11 November 2026, using the arXiv record and PDF text. This is a primary architecture proposal and author-reported case study; the inspected record identifies a preprint, not a peer-reviewed publication.

## Capsule structure — section III.A

The paper decomposes project knowledge into atomic skill capsules. A capsule has five components:

| Component    | Meaning in the paper                                                    |
| ------------ | ----------------------------------------------------------------------- |
| Identifier   | Hierarchical namespace for grouping and navigating related skills.      |
| Domain scope | Region of the project file tree within which the skill operates.        |
| Signature    | Programming interfaces, function signatures, and type contracts.        |
| Guardrails   | Security requirements, coding standards, and architectural constraints. |
| Boilerplate  | Canonical implementation exemplar conforming to the expected patterns.  |

The example is a YAML capsule for `auth.jwt_generate`, scoped to an authentication service, with a function signature, constraints, and code boilerplate. The paper does **not** define a required Markdown format, a 20–80-line limit, or a single-CLI-subcommand boundary. Its example constraints are illustrative, not security recommendations for this repository.

## Routing and verification — sections III.B–C

The Dynamic Skill Router selects relevant capsules using semantic similarity under a context budget. The development lifecycle combines selected knowledge with current project state and verifies generated changes before acceptance. The proposal includes enforcement mechanisms; textual guardrails alone are not evidence of access control.

This supports selective retrieval of bounded project knowledge. It does not establish that every agent platform retrieves guidance immediately before individual tool calls, nor that progressively loaded `SKILL.md` packages are necessarily monolithic.

## Abstraction loop — section III.C.1

A candidate solution is evaluated against a quality threshold. An Abstractor Agent extracts its reusable core, removes task-specific details, and constructs a capsule conforming to the registry structure. Accepted capsules become available to later tasks.

The trigger described here is a **quality-approved solution**, not every failed command or stack trace. Failure diagnosis may contribute to discovering a solution, but automatic failure-to-Markdown distillation is an additional design proposal, not the paper's stated mechanism.

## Reported evaluation — section IV

The authors compare two conditions on fifteen CMS feature specifications using Claude 3.5 Sonnet: full project context versus forty-two initial capsules and dynamic routing.

| Metric                            | Full-context baseline | MicroSkill condition |
| --------------------------------- | --------------------- | -------------------- |
| Average tokens per feature        | 48,500                | 3,200                |
| First-attempt compilation success | 40%                   | 86.6%                |
| Architectural violations          | 12                    | 0                    |
| Newly generated capsules          | Not supported         | 7                    |

These are **author-reported case-study results**, not independently reproduced measurements. The approximately 93.4% figure is a token reduction; it is not a separately measured latency improvement or a universal monetary saving. The success-rate change is approximately **46.6 percentage points**, not a 46.6% relative increase.

## Credibility and limits

- **Currency and relevance:** Directly addresses MicroSkill Architecture and matches the seed's title, authors, and arXiv identifier.
- **Authority and purpose:** Primary author account of a proposed architecture. It establishes what the authors propose, not industry consensus.
- **Accuracy and generalizability:** The authors explicitly acknowledge one system, one domain, and one model. The evaluation bundles decomposition, routing, boilerplate, and enforcement; it does not isolate the effect of capsule size or compare against well-designed progressive-disclosure skills.
- **Reproducibility:** No executable replication package was verified in this review. Reported results remain unreplicated here.

**Permitted conclusion:** The paper proposes bounded capsules, semantic routing, and quality-gated abstraction, with encouraging but limited case-study results. Calling it a universally validated CLI microskill standard exceeds the evidence.
