---
okf_version: '0.2.0'
type: Web Scrape
title: "Prompt engineering reference map"
description: "Progressive-disclosure map of prompt-engineering and agent-instruction guidance ingested from the external hyperlinks collected in the vendored Forge Rovo metaprompting prompts."
sources:
  - id: atlassian-prompt-guide
    resource: "https://www.atlassian.com/blog/announcements/ultimate-guide-writing-ai-prompts"
    title: "The ultimate guide to writing effective AI prompts"
    last_modified: '2024-09-18'
    author: "human:Jamil Valliani"
  - id: rovo-agent-instructions
    resource: "https://support.atlassian.com/rovo/docs/write-instructions-for-your-agent/"
    title: "Write instructions for your Rovo agent"
    author: "org:Atlassian"
  - id: clear-framework
    resource: "https://doi.org/10.1016/j.acalib.2023.102720"
    title: "The CLEAR path: A framework for enhancing information literacy through prompt engineering"
    author: "human:Leo S. Lo"
  - id: costar-framework
    resource: "https://medium.com/@frugalzentennial/unlocking-the-power-of-costar-prompt-engineering-a-guide-and-example-on-converting-goals-into-dc5751ce9875"
    title: "Unlocking the Power of COSTAR Prompt Engineering"
    author: "human:Frugal Zentennial"
  - id: anthropic-prompt-overview
    resource: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview"
    title: "Prompt engineering overview"
    author: "org:Anthropic"
  - id: google-prompt-guide
    resource: "https://cloud.google.com/discover/what-is-prompt-engineering"
    title: "Prompt engineering: overview and guide"
    author: "org:Google Cloud"
  - id: microsoft-prompt-techniques
    resource: "https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/prompt-engineering"
    title: "Prompt engineering techniques"
    author: "org:Microsoft"
  - id: openai-prompt-guide
    resource: "https://platform.openai.com/docs/guides/prompt-engineering"
    title: "Prompt engineering"
    author: "org:OpenAI"
  - id: zed-skills-guide
    resource: "https://zed.dev/docs/assistant/prompting"
    title: "Skills | Agent Skills"
    author: "org:Zed Industries"
generated:
  by: agent:rovo
  at: '2026-07-29T22:47:30Z'
---

<!-- markdownlint-disable MD013 -->

## Prompt engineering reference map

This collection summarizes the external sources linked by the vendored metaprompting prompts; it does not reproduce or treat those prompt files as the source material. Use the smallest thematic document that answers the task.

| Source | Purpose | Loading trigger |
| --- | --- | --- |
| [atlassian-agent-instructions.md](atlassian-agent-instructions.md) | Atlassian guidance on prompt composition and Rovo agent instructions. | Designing or revising instructions for an Atlassian/Rovo-style agent. |
| [prompt-frameworks.md](prompt-frameworks.md) | CLEAR and COSTAR as structured thinking aids for prompt or instruction design. | Choosing a framework to elicit concise, explicit, audience-aware instructions. |
| [provider-guidance.md](provider-guidance.md) | Anthropic, Google, Microsoft, and OpenAI guidance on success criteria, evaluation, context, examples, and model variability. | Planning prompt experiments, evaluations, grounding, or provider-sensitive prompt changes. |
| [skill-composition.md](skill-composition.md) | Zed guidance on progressive disclosure, skill locations, trust, and resource layout. | Designing an Agent Skills package or considering global versus project-local installation. |

## Source posture

- Treat vendor documentation as authoritative for that vendor's products and recommendations, not as universal rules.
- Treat CLEAR as a peer-reviewed framework; the accessible record supplies its abstract and bibliographic metadata.
- Treat COSTAR as a secondary practitioner reference and a useful structure prompt, not a normative specification.
