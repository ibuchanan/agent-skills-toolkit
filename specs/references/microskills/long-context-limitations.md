---
okf_version: "0.2.0"
type: Research Synthesis
title: "Long-context limitations and microskill evidence boundaries"
description: "What Lost in the Middle demonstrates, and what it does not establish about instruction decomposition."
sources:
  - id: liu-et-al-2023-arxiv
    resource: "https://arxiv.org/abs/2307.03172v3"
    title: "Lost in the Middle: How Language Models Use Long Contexts"
  - id: liu-et-al-2023-full-text
    resource: "https://arxiv.org/html/2307.03172v3"
    title: "Lost in the Middle — full text, version 3"
generated:
  by: agent:rovo
  at: "2026-11-11T19:54:40Z"
---

<!-- markdownlint-disable MD013 -->

## Long-context limitations

**Authors:** Nelson F. Liu, Kevin Lin, John Hewitt, Ashwin Paranjape, Michele Bevilacqua, Fabio Petroni, and Percy Liang. **Version inspected:** arXiv v3, 20 November 2023; initially submitted 6 July 2023. **Verified:** 11 November 2026. The arXiv record reports acceptance in Transactions of the Association for Computational Linguistics; the findings below were checked in the versioned full text.

## Experimental scope — sections 2–3

| Task                              | Manipulation                                                                      | Observation                                                                                                          |
| --------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Multi-document question answering | Move the answer-bearing document among distractors; vary the number of documents. | Many evaluated models perform better when relevant information appears near the beginning or end than in the middle. |
| Synthetic key-value retrieval     | Move a matching key-value pair within serialized JSON; vary the number of pairs.  | Some models show substantial positional sensitivity; others perform the task well.                                   |

The study concerns access to information in supplied contexts. It does not directly measure obedience to CLI instructions, skill selection, Markdown organization, or command execution success.

## Qualifications — section 4 and appendices D–E

- Position effects depend on model, task, context length, and training conditions; they are not an invariant of every language model.
- Query-aware contextualization substantially improves synthetic key-value retrieval but does not similarly remove the multi-document QA trends.
- GPT-4 (8K) is evaluated on a subset of QA examples and exhibits positional sensitivity despite higher absolute performance.
- Encoder-decoder models are comparatively robust within their training sequence lengths, with degradation outside that range.

## Claim boundaries

| Claim                                                                            | Evidence status                                                       |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Relevant information can be harder to use when buried in a long context.         | Directly supported for the tested models and tasks.                   |
| Selective, relevant context is a reasonable motivation for modular instructions. | Design inference, not an evaluated microskill intervention.           |
| Smaller instruction files always improve tool-use reliability.                   | Not established by this study.                                        |
| A microskill should contain 20–80 lines or exactly one command.                  | Not tested.                                                           |
| Contemporary models reproduce the same effect sizes.                             | Requires fresh evaluation; this is a study of earlier model versions. |

## Credibility and applicability

This is primary empirical research with explicit tasks, comparisons, and model-dependent exceptions. It is authoritative for its experimental findings, not for a universal mechanism of “attention degradation” in agent manuals. Its age limits direct claims about current models. The source motivates testing context selection, but cannot substitute for task-specific evaluations of the proposed instruction design.
