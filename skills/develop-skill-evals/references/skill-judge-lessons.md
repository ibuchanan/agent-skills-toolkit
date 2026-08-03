---
okf_version: "0.2.0"
type: Specification
title: "Skill Judge Lessons for Eval Authoring"
description: "Distilled lessons from the Skill Judge framework (softaworks/agent-toolkit), separating what transfers to writing Promptfoo behavioral evals (freedom calibration -> assertion tightness, design pattern -> scenario style, triggering as a first-class failure mode) from what doesn't (scoring a SKILL.md's own writing quality, which is a different skill's job, not this one's)."
sources:
  - id: skill-judge-readme
    resource: "https://github.com/softaworks/agent-toolkit/blob/3027f20f3181758385a1bb8c022d4041dfb4de84/skills/skill-judge/README.md"
    title: "Skill Judge"
    author: "org:softaworks"
generated:
  by: agent:claude
  at: "2026-07-30T13:28:20Z"
---

# Skill Judge Lessons for Eval Authoring

Full-fidelity source: `references/skill-judge/README.md`.

**Skill Judge scores a `SKILL.md` document's own writing quality** — its
knowledge content, structure, and adherence to design patterns — a static
review, not a runtime behavioral test. This skill (`develop-skill-evals`)
never edits or scores a target's `SKILL.md`; that boundary doesn't change.
Most of Skill Judge's 8 dimensions (knowledge delta classification,
anti-pattern lists, progressive-disclosure structure, spec-compliance
grading, the 120-point rubric and letter grades) are about that different
job — see "Not applicable here" below. Three ideas do transfer to writing
better Promptfoo test cases for skill _behavior_.

## Transferable: freedom calibration → assertion tightness

Skill Judge's D6 dimension asks whether a `SKILL.md`'s specificity matches
the task's fragility: high freedom (principles) for creative tasks, low
freedom (exact scripts) for fragile operations. The same calibration
applies to choosing an assertion for that skill's _output_, not just to
writing the skill's instructions:

- A skill matching the **Tool** pattern (precise operations on a specific
  format — the Skill Judge doc's own examples: docx, pdf, xlsx) has
  low-freedom, exactly-checkable output. Use deterministic assertions
  (`equals`, `regex`, `is-json`) or `trajectory:tool-args-match` — a loose
  `llm-rubric` under-tests it.
- A skill matching the **Mindset** or **Philosophy** pattern (creative
  tasks requiring taste or originality) has high-freedom output that
  resists exact matching. Use `llm-rubric` with a rubric describing the
  _quality_ wanted, not a literal string — a tight `contains` check
  under-tests it and will flag correct-but-differently-worded output as a
  failure (the same brittleness `references/promptfoo-agent-skill-testing.md`'s
  "Writing assertions: good vs. weak" section already warns about).

## Transferable: design pattern → scenario style

Skill Judge's five patterns (Mindset, Navigation, Philosophy, Process,
Tool) predict what kind of eval scenario actually exercises a skill:

- **Navigation** pattern (multiple distinct scenarios, routing between
  them) → the scenario that matters most is the routing-boundary test
  already in `promptfoo-agent-skill-testing.md` ("Testing routing
  boundaries between skills in a bundle": `skill-used` + `not-skill-used`
  pairs). A Navigation-pattern skill with no such test is undertested
  regardless of how well its `with_skill` assertions pass.
- **Process** pattern (complex multi-step projects) → favors
  `trajectory:tool-sequence`/`trajectory:step-count` over a single final-
  output check, since the _order_ of steps is the thing likely to break.
- **Tool** pattern → favors the deterministic assertions above.
- **Mindset**/**Philosophy** patterns → favor `llm-rubric`/`search-rubric`
  and the with/without-skill baseline comparison (does the skill actually
  change the _quality_ of a creative output, not just its presence).

Identifying which pattern a target skill follows — before choosing
assertions — is a cheap check worth doing as part of gathering grounding
(workflow step 1), even though scoring the skill's adherence to the
pattern is not this skill's job.

## Transferable: triggering is a first-class failure mode

Skill Judge's failure patterns #6 ("The Invisible Skill" — great content,
poor description, so it never activates) and #7 ("The Wrong Location" —
trigger info in the body instead of the description) both describe a
skill that _works_ once invoked but is never invoked. This is independent
confirmation that testing routing/triggering (`skill-used`/`not-skill-used`,
already this skill's recommended pattern for scope-boundary scenarios) is
not a secondary concern — a skill can pass every content assertion and
still fail in practice by never firing. Prioritize a triggering scenario
in the lean evaluation plan's scenario types when the spec doesn't already
have one, rather than treating it as optional coverage.

## Not applicable here

Everything else in Skill Judge is about judging the quality of a
`SKILL.md` as _written knowledge_, which is `describe-skill`'s or
`develop-agent-skill`'s job, not this skill's:

- The knowledge-delta scan (Expert/Activation/Redundant classification of
  each section) and its core formula ("Good Skill = Expert-only Knowledge
  minus what Claude already knows").
- D2–D5 and D8 (mindset/procedures transfer, anti-pattern list quality,
  spec compliance, progressive-disclosure structure, decision trees and
  code examples in the body).
- The 120-point rubric, letter grades, and "Skill Evaluation Report"
  output format — a document-review report, not a behavioral-eval report.
- Failure patterns #1–5, #8, #9 (tutorial content, monolithic files,
  orphaned references, checkbox procedures, vague warnings,
  over-engineering, freedom mismatch _in the instructions themselves_) —
  these describe defects in what the skill _says_, not in what evaluating
  its _behavior_ would test.

If a request asks to score or improve a target skill's `SKILL.md` writing
quality using this framework, that is out of scope for `develop-skill-evals`
— say so and redirect rather than applying Skill Judge's rubric here.
