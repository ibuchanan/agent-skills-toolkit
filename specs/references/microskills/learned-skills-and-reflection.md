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

**Verified:** 11 November 2026. These primary sources describe related but distinct mechanisms. Neither defines the seed's proposed format for short CLI instruction files.

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

| Dimension       | Voyager                                | Reflexion                               | Seed's proposed CLI microskills         |
| --------------- | -------------------------------------- | --------------------------------------- | --------------------------------------- |
| Stored artifact | Executable skill program               | Reflective text                         | Short instruction file                  |
| Selection/use   | Similarity retrieval for a task        | Episodic memory informing later trials  | Proposed tool-specific retrieval        |
| Learning signal | Environment, errors, self-verification | Task feedback and verbal reflection     | Proposed failure diagnosis              |
| Verified scope  | Minecraft agent experiments            | Framework described in primary abstract | Not directly evaluated by either source |

## Credibility and limits

Both sources are primary accounts of their own systems, not independent validation of the proposed local design. Voyager's author page provides concrete mechanisms and experimental summaries but is also a presentation of the project's successes. Reflexion supplies a closer precedent for textual learning, with limited methodological detail in the inspected abstract. Their 2023 results should not be presented as contemporary CLI benchmarks or evidence of historical priority for all skill-learning architectures.

**Local design proposal, not a source finding:** Durable failure-derived instructions would need validation, scope boundaries, and maintenance beyond merely storing reflective text.
