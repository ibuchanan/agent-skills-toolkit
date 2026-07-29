---
okf_version: '0.2.0'
type: Web Scrape
title: "Atlassian prompt and agent-instruction guidance"
description: "Summary of Atlassian guidance on composing prompts and Rovo agent instructions."
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
generated:
  by: agent:rovo
  at: '2026-07-29T22:47:30Z'
---

<!-- markdownlint-disable MD013 -->

## Atlassian prompt and agent-instruction guidance

Atlassian frames effective prompts around four elements: persona, task, context, and format. The first three identify who is asking, what must happen, and the relevant circumstances; format makes the expected response shape explicit.

For Rovo agents, start with a focused job and short instructions. Provide a role, the tasks or scenarios the agent should handle, and the context needed to do that work. Shorter starting instructions make iteration and troubleshooting easier; long, multi-job prompts risk inconsistent prioritization.

## Practical use

- State the desired outcome before adding supporting context.
- Add only context that changes how the task should be completed.
- Specify the response form when structure, length, or downstream use matters.
- Keep an agent responsible for a specific job; divide unrelated work into scenarios or separate agents.
- Iterate from observed output rather than assuming a single prompt will be final.

## Limits

This is vendor guidance, not a substitute for evidence-backed domain instructions, authorization boundaries, or evaluations. Use it to shape an instruction, then validate behavior against the skill's own examples and acceptance criteria.
