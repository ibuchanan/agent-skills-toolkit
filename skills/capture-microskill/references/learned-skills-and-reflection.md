---
okf_version: "0.2.0"
type: Research Synthesis
title: "Learned skill libraries and reflective memory"
description: "Distinguishes Voyager's executable skills from Reflexion's feedback-derived textual memory."
sources:
  - id: voyager-author-project
    resource: "https://voyager.minedojo.org/"
    title: "Voyager: An Open-Ended Embodied Agent with Large Language Models"
  - id: reflexion-v4
    resource: "https://arxiv.org/abs/2303.11366v4"
    title: "Reflexion: Language Agents with Verbal Reinforcement Learning"
generated:
  by: agent:rovo
  at: "2026-11-11T19:54:40Z"
---

<!-- markdownlint-disable MD013 -->

## Learned skills and reflective memory

**Verified:** 11 November 2026. These primary sources describe related but distinct mechanisms. Neither defines the approved local format for single-file CLI or MCP guidance.

## Voyager — author-maintained project page

**Authors:** Guanzhi Wang, Yuqi Xie, Yunfan Jiang, Ajay Mandlekar, Chaowei Xiao, Yuke Zhu, Linxi Fan, and Anima Anandkumar. **Research:** 2023; the project page links arXiv:2305.16291 and the [implementation repository](https://github.com/MineDojo/Voyager). The inspected evidence is the authors' project page, including its component descriptions, experiments, and ablation summary—not an independent reproduction.

| Component            | Documented behavior                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Automatic curriculum | Proposes exploration tasks based on progress and current Minecraft state.                                                      |
| Skill library        | Stores executable programs indexed by embeddings of their descriptions. Retrieves the top five relevant skills for a new task. |
| Iterative prompting  | Incorporates environmental feedback, execution errors, and self-verification to improve generated programs.                    |

The authors report improved exploration, tech-tree progress, and transfer to unseen tasks in a new Minecraft world. The library contains temporally extended, compositional **executable behaviors**. These may be complex programs, not atomic prose instructions.

**Supported analogy:** Feedback can improve candidate behaviors, and successful behaviors can be indexed and reused. **Unsupported extrapolation:** Voyager proves that every command failure should generate a reusable Markdown microskill, or that textual capsules will reproduce its performance gains.

## Reflexion — arXiv v4 record and abstract

**Authors:** Noah Shinn, Federico Cassano, Edward Berman, Ashwin Gopinath, Karthik Narasimhan, and Shunyu Yao. **Version inspected:** 10 October 2023, initially submitted 20 March 2023. Verification here covers the primary bibliographic record and abstract; detailed experiment protocols were not reviewed.

Reflexion agents reflect on task feedback and retain reflective text in an episodic memory buffer. Later attempts use that memory without updating model weights. The abstract describes feedback from external or internally simulated sources and improvements on sequential decision-making, coding, and language reasoning tasks.

**Supported analogy:** Linguistic feedback can persist across trials as contextual memory. **Unsupported extrapolation:** Episodic reflection is automatically correct, portable across projects, or equivalent to a validated registry of durable skills. The abstract's headline benchmark score is not used here as a predicted gain for microskills.

## Mechanism comparison

| Dimension | Voyager | Reflexion | Approved local capture design |
| --- | --- | --- | --- |
| Stored artifact | Executable skill program | Reflective text | Standard Agent Skill containing only `SKILL.md` |
| Selection/use | Similarity retrieval for a task | Episodic memory informing later trials | Standard skill activation for a coherent tool-use intent and context |
| Lesson input | Environment, errors, self-verification | Task feedback and verbal reflection | Human-provided or human-selected CLI or MCP lessons; logs optional |
| Evidence scope | Minecraft agent experiments | Framework described in primary abstract | Local specification; not directly evaluated by either source |

## Credibility and limits

Both sources are primary accounts of their own systems, not independent validation of the proposed local design. Voyager's author page provides concrete mechanisms and experimental summaries but is also a presentation of the project's successes. Reflexion supplies a closer precedent for textual learning, with limited methodological detail in the inspected abstract. Their 2023 results should not be presented as contemporary CLI benchmarks or evidence of historical priority for all skill-learning architectures.

**Local design decision, not a source finding:** Under the local design implemented in the installed `SKILL.md`, the human selects lessons and owns evidence sufficiency. Capture faithfully distills those lessons without requiring successful execution, corroboration, multiple sessions, or another evidence threshold. This authorization policy is distinct from an empirical claim that the resulting guidance is correct or effective. The capture workflow reviews metadata, scope, fidelity, and safety without executing the target tool; evaluation authoring and execution are separate tasks.

## Review update — 12 November 2026

The Voyager author-maintained project page and Reflexion v4 bibliographic record and abstract were rechecked for the mechanisms summarized here. The local-design comparison now reflects the approved human-selected capture workflow rather than the earlier failure-driven seed proposal. This update is not a fresh review of either full paper's experimental methods or an independent reproduction; the original source provenance and evidence limits remain unchanged.
