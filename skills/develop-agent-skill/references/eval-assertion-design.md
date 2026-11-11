# Designing evaluable assertions

Load this when a skill's promptfoo eval has failures and the instinct is to
rewrite the skill's guidance to make them pass. A failing eval can mean the
skill is wrong, the assertion is brittle, or the eval provider is weak.
Triage which one before editing anything — these three cost different fixes
and confusing them either hides real gaps or breaks skills that already work.

These lessons come from auditing a real eval run: 70% pass rate, ~49
failures, almost all traced to assertion design rather than skill content.

## Triage before fixing

For each failing test, read the model's actual output, not just the error
message. Then classify:

1. **Word-form/spelling mismatch** — the concept is present, phrased
   differently (`duplicated` vs `duplication`, `workflow` vs `workflows`,
   `minimize` vs `minimise`). Fix the assertion, not the skill.
2. **Wrong-field pinning** — the concept is present, in a different JSON
   field than the assertion checks (`guardrails` vs `recommended_actions`).
   Fix the assertion, not the skill.
3. **Genuine content gap** — the concept is absent from every field, in any
   wording. This is real evidence the skill under-specifies something.
   Fix the skill, or record the gap; do not force a synonym match to make
   the red disappear.
4. **Provider defect** — malformed JSON (unescaped quotes, truncated output
   because reasoning tokens consumed the whole budget), or the model
   switching languages mid-response. Fix the provider config or prompt
   contract, not the skill or the assertion.

Never resolve a failure by inventing a synonym for a concept the model never
actually expressed. If you can't point to the exact place in the model's
output that justifies the new alternative, it's category 3, not 1.

## Writing assertions that survive rewording

- Prefer `expect_any_substrings` (a list of acceptable alternatives) over
  `expect_substrings` (one required literal) for any concept that could
  reasonably be phrased more than one way — which is most prose concepts.
  Reserve bare `expect_substrings` for exact identifiers: file paths, CLI
  flags, field names, command names.
- Don't pin a check to `recommended_actions` or `guardrails` specifically
  unless the boundary between "step to take" and "constraint to respect" is
  actually sharp for that concept. When a statement could reasonably land in
  either (e.g. "always consult X before Y"), check the wildcard `"*"` field
  instead, which matches across the whole response.
- Ground any assertion that checks an external identifier (an MCP tool name,
  a CLI flag, a config key) in the identifier's real canonical spelling —
  check where it's actually defined, not the first casing you see in a
  model's output. Models will format tool-call-shaped strings inconsistently
  (`list-forge-modules` vs `list_forge_modules`) even when the skill's own
  docs are internally consistent; add both forms as alternatives rather than
  chasing one true casing through every test.

## `reject_substrings` traps

`reject_substrings` bans a literal string from appearing anywhere in a
field. It is easy to write and easy to make wrong:

- Never ban the "old" command/pattern in a task that explicitly hands the
  model an existing command and asks it to translate, replace, or migrate
  it. A correct answer has to name the old form for contrast ("replace
  `python3 -c` with `uv run python -c`"). Let the positive
  `expect_substrings`/`expect_any_substrings` checks confirm the *new* form
  is recommended; don't also ban the old one.
- Don't ban a generic tool/command name outright if the skill legitimately
  allows mentioning it as a fallback or hedge ("if X doesn't work, try
  `rg`"). Banning the bare word bans the hedge along with the wrong answer.
- If you do need to ban something, ban a specific bad *pattern* (the old
  command presented as the thing to run), not the bare token that also
  appears in valid explanatory prose. The current assertion engine only
  supports plain substring matching, so if a reject rule keeps tripping on
  legitimate contrast language, remove it rather than trying to out-guess it
  with more literals.

## Minimum bar for a new eval

A newly scaffolded eval that only checks `required_paths` and
`array_min_lengths` can't fail on a wrong answer — only on a malformed one.
Before calling test coverage sufficient, add at least one
`expect_substrings`/`expect_any_substrings` tied to the skill's actual
differentiating vocabulary (the command, file, or decision that makes this
skill's answer different from a generic one). Never leave a scaffolded
`task:` with placeholder text like `TODO replace with a realistic user
request` — an unfilled placeholder eval always passes and proves nothing.

## Provider changes shift the failure set, not just the count

Reasoning effort, temperature, and token budget change a model's output
style, not just its correctness. Bumping reasoning effort to fix one failure
mode (e.g. malformed JSON from a rushed answer) can introduce another (e.g.
reasoning tokens consuming the entire completion budget before the model
writes its answer, or a differently-worded answer tripping a previously-
passing assertion). After any provider/config change, expect the *set* of
failing tests to shift, not just shrink — re-triage the new failures with
the same four categories above rather than assuming they're new skill bugs.
