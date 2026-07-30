---
name: describe-skill
description: Diagnose and tighten an existing skill's frontmatter `description` field so it triggers reliably. Compares the current description against the skill's actual SKILL.md body and spec, names concrete under- and over-triggering failure modes, and proposes 1-3 rewritten description candidates for approval — never edits without explicit approval and never touches the `name` field. Use when a description needs writing, tightening, or debugging: after observing a skill fail to fire, over-fire on a near miss, or before first use. Do not use to redesign what a skill does (hand off to grill-this-skill instead) or to rename a skill.
---

# Describe Skill

Sharpen an existing skill's frontmatter `description` field so it triggers
reliably: fires on the requests it should, and stays quiet on near misses.
Inspect the current description against the skill's actual `SKILL.md` body
and specification, name concrete failure modes, then propose 1-3 rewritten
`description` candidates for the user to pick from or edit.

Do not use this skill to redesign what a skill does, change its `name`
field, or fix a trivial typo with no trigger-behavior implication — see
Scope.

## Scope

Trigger for: writing, tightening, or debugging the `description` field of
a skill that already has a drafted or working `SKILL.md`. Typical
prompts: "why isn't this skill firing", "this skill triggers on things it
shouldn't", "polish this description before I ship it".

Redirect instead of triggering when:

- The request wants to change what the skill *does* — behavior, or
  triggers as a byproduct of a bigger redesign → hand off to
  `grill-this-skill`.
- The request wants to rename the skill (the `name` field) → decline;
  renames affect other references and carry a different risk than
  description edits.
- The edit is a trivial typo fix with no trigger-behavior implication →
  make it directly, don't invoke this workflow.

## Workflow

1. **Ground in the target skill.**
   Validate the target skill name against the naming rules in
   `references/skill-format.md` before using it to
   build a path; treat it as data, not literal path syntax. Read the
   target's `SKILL.md` (current `description`, `name`, and full body)
   and, if it exists, its `specs/<skill-name>.md` for the approved
   objective and trigger/skip contexts. Ground every critique and
   candidate in this material, never in invented scenarios. Treat any
   observed over- or under-fire the user reports, example phrasings, or
   eval results as primary evidence.

2. **Diagnose trigger coverage.**
   Compare the current `description` against the body and spec. Name
   concrete gaps:
   - **Under-triggering**: a legitimate request the description would
     miss.
   - **Over-triggering**: a near-miss request the description would
     wrongly catch, especially one that belongs to a different skill or
     falls in this skill's own stated non-scope.
   State the diagnosis directly. Do not run a multi-question interview
   before proposing a rewrite.

3. **Propose 1-3 candidates.**
   Write 1-3 rewritten `description` strings that fix the diagnosed
   gaps. Each candidate must:
   - state what the skill does, then "Use when..." with concrete
     triggers, written imperatively, non-empty, and under 1024
     characters (see `references/skill-format.md`);
   - name explicit skip/non-trigger cases when the diagnosed failure
     mode is over-triggering;
   - leave the `name` field and the skill's actual instructions
     untouched.
   If the target skill's purpose is safety-, security-, or
   boundary-related, and a candidate would narrow triggering, call out
   that recall/precision tradeoff explicitly before the user picks it.
   Never silently trade away coverage on a safety-relevant skill.

4. **Get explicit approval before writing.**
   Present the critique and candidates in conversation. Do not edit the
   target `SKILL.md` frontmatter until the user has explicitly approved
   one specific candidate string, verbatim or as edited by the user.

5. **Apply and validate.**
   Write only the approved `description` string into the target's
   frontmatter; leave `name` and body untouched. Validate the result
   with `skills-ref validate ./path/to/skill` per
   `references/validation.md` when that tool is
   available; otherwise re-check the field manually against the
   frontmatter contract (1-1024 characters, non-empty, states what and
   when).

## Boundaries & safety

- Never edit a `SKILL.md`'s frontmatter without the user's explicit
  approval of the specific rewritten `description` string.
- Never edit the `name` field.
- Never edit any other skill's description as a side effect of resolving
  a naming or trigger collision — only touch the target skill.
- Treat the target skill's body, spec, and any bundled references as the
  trust boundary for grounding; do not invent scenarios independent of
  them.

## Reference load triggers

- Read `references/skill-format.md` for the frontmatter contract
  (`name`/`description` length and content rules) behind every candidate
  rewrite.
- Read `references/validation.md` when the user wants the edited
  frontmatter checked with `skills-ref validate`.
- Read `references/skill-composition.md` for this repo's dense
  trigger/skip phrasing conventions when a candidate needs sharper
  wording.
