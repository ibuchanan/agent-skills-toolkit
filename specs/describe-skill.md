# Skill specification describe-skill

## Objective

Help a skill author write or tighten the `description` field
in an existing skill's SKILL.md frontmatter
so it triggers reliably.
It should fire in the right contexts,
and not firing on near-miss requests it shouldn't
Do not change the skill's `name` or its actual behavior/instructions.

## Audience

Skill authors already iterating on a skill within this repo:
someone who has a draft or working SKILL.md,
understands what their skill does,
and needs help articulating
_when_ it should fire in this repo's dense trigger/skip description style.

### Style & tone

Direct and analytical,
not interview-driven.
Inspect the current `description` against the skill's actual body,
name concrete failure modes
(a request that would false-trigger it,
or a legitimate case it would miss),
then propose 1-3 concrete rewritten `description` candidates
for the user to pick from or edit.
Do not run a multi-question interview before proposing a rewrite.

## Context

Trigger when a user has a drafted or working SKILL.md
and wants to write, tighten, or debug its `description` field.
The user maybe run this after observing
the skill fail to trigger (false negative)
or over-trigger (false positive) in practice,
or when polishing a new skill before first use.

### Trigger & non-trigger contexts

Do not trigger for:
requests to redesign what the skill _does_
(route to [[grill-this-skill]]),
requests to change the skill's `name` field
(out of scope: renames affect other references and carry different risk),
or trivial typo fixes with no trigger-behavior implication.

### Boundaries & safety

Never edit a SKILL.md's frontmatter
without the user's explicit approval of the specific rewritten `description` string.
If a proposed rewrite would narrow triggering for a skill whose purpose is safety/security/boundary related,
call out that coverage tradeoff explicitly before the user picks it.
Do not silently trade recall for precision on safety-relevant skills.
Ground every proposed rewrite in the target skill's actual body and spec
(if one exists under `specs/`),
not in invented or assumed scenarios.
Never edit the `name` field,
and never edit any _other_ skill's description
as a side effect of resolving a naming or trigger collision
Only touch the target skill.

## Inputs & outputs

**Inputs**: the target skill's `SKILL.md`
(current `description`, `name`, and body for grounding),
any matching `specs/*.md`,
and optionally reported trigger failures
(an observed over- or under-fire)
or example user phrasings the description should or shouldn't catch.
Eval results and trends are good data for understanding what works and doesn't.

**Outputs**: a short critique
of the current description's trigger coverage
(gaps and false-positive risks),
1-3 candidate rewritten `description` strings,
and the updated SKILL.md frontmatter
(only after explicit approval).

### Evaluation plan

- **Behavior to distinguish**:
  given a skill's body and current `description`,
  does the skill correctly diagnose the gap type
  (under-triggering vs over-triggering),
  stay in scope
  (never touches `name`,
  never writes without approval,
  declines rename/redesign requests),
  and does invoking the skill produce a measurably better result
  than the model unaided?
- **Design pattern**:
  Tool-leaning — the output is a precise, bounded thing
  (a rewritten `description` string with structural constraints:
  at most 256 characters, no colons or em dashes, `name` untouched),
  not a multi-turn or creative task.
  Favor deterministic checks for structure,
  paired with `llm-rubric` for rewrite quality;
  routing/trajectory assertions are secondary here.
- **Scenario types**:
  (1) an under-triggering description missing a legitimate use case:
  expect the gap surfaced and trigger coverage added;
  (2) an over-triggering description that would fire on a near-miss request:
  expect explicit skip/non-trigger language added;
  (3) near-miss scope test:
  user also asks it to rename the skill or redesign its behavior —
  expect a decline/redirect rather than compliance.
  In Promptfoo terms, this is a routing-boundary case:
  `skill-used` on `describe-skill`, `not-skill-used` on `grill-this-skill`;
  (4) baseline comparison:
  `describe-skill` invoked vs. an unaided "just improve this description"
  prompt on the same input —
  tests whether the skill's structured method
  (naming concrete failure modes, proposing 1-3 candidates,
  flagging safety-coverage tradeoffs on safety-relevant skills)
  adds real value over unaided rewriting,
  not just whether it produces _a_ rewrite.
- **Evidence source**:
  the target skill's own SKILL.md body is ground truth for "what it actually does";
  scenarios must not be invented independent of it.
- **Judging**:
  gap-type diagnosis and scope adherence
  (name untouched, no unapproved write, correct routing on the
  rename/redesign near-miss)
  are objectively checkable per test case.
  Rewritten-description quality needs human or LLM-judge review.
  The baseline scenario is judged by the pass-rate/quality delta between
  with- and without-skill runs, not a per-case pass/fail.

## Open decisions

None.
All core decisions are resolved.

## References

Provenance-backed sources already ingested and sufficient to begin authoring:

- `specs/references/agent-skills/skill-format.md` and
  `specs/references/agent-skills/validation.md` — frontmatter and
  `description` field structural constraints.
- `specs/references/prompt-engineering/skill-composition.md` — trigger and
  skip-phrasing craft for skill descriptions.
