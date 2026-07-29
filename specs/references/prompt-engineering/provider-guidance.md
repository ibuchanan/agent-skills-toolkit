---
okf_version: '0.2.0'
type: Web Scrape
title: "Provider prompt-engineering guidance"
description: "Comparative summary of linked Anthropic, Google, Microsoft, and OpenAI prompt-engineering guidance."
sources:
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
generated:
  by: agent:rovo
  at: '2026-07-29T22:47:30Z'
---

<!-- markdownlint-disable MD013 -->

## Provider prompt-engineering guidance

The linked provider guidance converges on a lifecycle rather than a single universal prompt recipe.

1. Define success criteria and a way to test them before optimizing a prompt.
2. State the task clearly; use context, examples, and an appropriate format when they materially constrain the desired result.
3. Iterate based on observed output and feedback.
4. Validate the resulting behavior beyond one successful example because prompts and model outputs do not necessarily generalize.

Anthropic explicitly presents success criteria, empirical tests, and a first draft as prerequisites for prompt engineering. Google emphasizes prompt format, context, examples, adaptation, and multi-turn interaction. Microsoft emphasizes validation and grounding, warning that a technique working in one scenario may not generalize. OpenAI emphasizes model and snapshot variation, recommending tests and evaluation suites to monitor behavior during iteration or model changes.

## Use in skill development

- Start a skill evaluation plan with observable success conditions, not a vague goal to make the prompt better.
- Include realistic examples only when they disambiguate behavior; do not inflate instructions with decorative detail.
- Treat a provider-specific recommendation as conditional on that provider and model family.
- Preserve test cases when revising instructions so changes can be compared rather than judged from memory.
