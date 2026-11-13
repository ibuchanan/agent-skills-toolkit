# Build a change-note skill: a tour of the toolkit

We will build `draft-change-note`, a skill that turns supplied change facts into
a short Markdown note. Along the way we will use the toolkit's specification,
research, authoring, description, evaluation, citation, and installation skills. We will leave `axi` and `select-llm` outside this
exercise: we are not creating a tool interface or choosing a live model.
The finished exercise produces a locally installed skill and evaluation
artifacts; it does not require a paid evaluation run.

## Before we begin

Use a disposable checkout of this repository, with Git, Bun 1.4 or newer, Node.js
and npm installed. Use an agent that can read local files, edit this checkout,
and access web sources. Allow time for several approval conversations. Model
responses will vary; the checkpoints below describe the artifacts to inspect.

From the checkout root, run:

```sh
bun install --frozen-lockfile
bun run build
```

You should now have executable helpers under `scripts/`. Keep the agent and
terminal in the checkout root for the rest of the lesson. In the agent requests
below, ask the agent to read the named toolkit `SKILL.md` and follow it; this
avoids depending on any particular agent's slash-command syntax.

## 1. Create the empty skill

Run:

```sh
scripts/init-skill draft-change-note
scripts/validate-skill skills/draft-change-note
```

You should see a created `SKILL.md` and `scripts/`, `assets/`, `references/`, and
`evals/` directories. The template may already pass structural validation.
Open it: its placeholder instructions are not our finished skill.

## 2. Agree on what the skill will do

Send this request to the agent:

> Read `skills/grill-this-skill/SKILL.md` and use it to define
> `draft-change-note`. We are building a skill for a developer who supplies
> change facts and wants a Markdown note with exactly three level-two headings:
> Summary, Testing, and Risks. Use only supplied facts. Put “Not provided” in a
> section whose facts are missing. Do not run tests, inspect a repository,
> publish the note, or invent results. Requests to execute tests or publish a
> release are outside scope. Ask one decision at a time. Include a lean
> evaluation plan and a reference plan for Markdown heading syntax.

Answer the interview using those exercise constraints. Before approving, check
that the evaluation plan includes these scenarios:

- complete facts produce all three sections without added claims;
- missing test facts produce “Not provided” under Testing;
- a request to run tests is identified as outside scope, with no execution.

The expected-behavior evidence is the agreed specification and the supplied
facts. The Markdown source supports heading syntax only, not product behavior.
Approve the proposed specification once it matches. You should now have
`specs/draft-change-note.md` with a `### Evaluation plan` section.

## 3. Research one authoritative reference

Send:

> Read `skills/research-references/SKILL.md` and use it for
> `draft-change-note`. Propose a small research plan to verify Markdown ATX
> heading syntax against the official CommonMark specification at
> <https://spec.commonmark.org/>. We need only enough reference material to
> support the three level-two headings. Do not execute the plan before approval
> or write reference files before approval.

Approve the research plan. Review the agent's source evaluation and proposed
capture before approving file creation. You should receive a concise reference
with a real source URL, not a claim that the Markdown specification defines our
change-note policy.

## 4. Give the reference a maintainable shape

Send:

> Read `skills/ingest-reference/SKILL.md`. Review the captured Markdown
> reference for `draft-change-note`. Keep one concise document at
> `skills/draft-change-note/references/markdown-headings.md` with OKF 0.2.0
> frontmatter, a source URL, and truthful generation metadata. Preserve the
> captured source's actual attribution. Add a reference loading trigger for
> heading-syntax questions in the target `SKILL.md`. Do not add an entire
> documentation mirror or create citation metadata in this pass.

Run:

```sh
scripts/validate-okf skills/draft-change-note/references
```

Expect `Valid OKF bundle`. Open the reference and confirm that the recorded
source actually supports its contents. We now have a small, traceable source
rather than a copied page with no origin.

## 5. Implement the approved behavior

Send:

> Read `skills/develop-skill/SKILL.md` and use it to replace the
> placeholders in `skills/draft-change-note/SKILL.md`. Implement the approved
> `specs/draft-change-note.md`, preserve the reference loading trigger, and
> keep the instructions focused on drafting from supplied facts. Do not change
> the approved behavior or execute evaluations. Run the skill's prescribed
> static PromptLint feedback and report any blockers honestly.

Inspect the result. You should find an explicit missing-facts rule, the three
required headings, and a boundary against test execution and publication.
Resolve blocking static-analysis findings with the agent before continuing.

Run the structural check again:

```sh
scripts/validate-skill skills/draft-change-note
```

## 6. Make the trigger description precise

Send:

> Read `skills/describe-skill/SKILL.md` and use it on
> `skills/draft-change-note/SKILL.md`. Improve only the trigger description
> against our approved specification. Distinguish drafting from supplied facts
> from requests to run tests or publish a release. Preserve the body and keep
> the description within this repo's validator constraints.

Review the proposed change and approve it when requested. Run:

```sh
scripts/validate-skill skills/draft-change-note
```

You should still have a valid skill, now with a description that names the
intended request rather than offering generic writing help.

## 7. Turn the evaluation plan into artifacts

Run:

```sh
scripts/init-skill-eval skills/draft-change-note
```

The scaffold contains a configuration and prompt template, but no provider or
meaningful tests yet. Send:

> Read `skills/develop-skill-evals/SKILL.md` and use it for
> `draft-change-note`. Read the approved evaluation plan, the implemented
> `SKILL.md`, and the existing suite skeleton. Author Promptfoo artifacts for
> the three approved scenarios. Use objective heading and missing-fact checks
> where possible. Make the out-of-scope case check the intended boundary, not
> one exact refusal sentence. Do not invent additional behavior or execute
> evaluations. Identify any unresolved provider or harness setup explicitly.

Inspect `evals/promptfooconfig.yaml`, `evals/prompts/`, and `evals/tests/`.
Each test should describe the expected behavior and trace back to the plan.
Do not treat these files as a passing test result. Live execution remains a
separate, explicitly authorized task with provider and harness configuration.

## 8. Attribute the source

Send:

> Read `skills/write-citations/SKILL.md` and use the existing
> `draft-change-note` references to create its `CITATION.cff`. For this exercise,
> I explicitly authorize the entity author “Change Note Tutorial Authors” for
> the new skill. Do not attribute the skill itself to the Markdown source's
> authors. Preserve source attribution as related-work metadata where supported
> by the captured reference. Do not invent dates, identifiers, or authors.

Run:

```sh
scripts/validate-cff skills/draft-change-note
```

Expect a silent successful exit (status `0`). Inspect the file: the skill's author and the source's
attribution should not have been conflated.

## 9. Install the skill locally

Send:

> Read `skills/manage-skills/SKILL.md`. Install only the local
> `draft-change-note` skill into this checkout's `.agents/skills/`, using
> `skills/` as the explicit source. For now, inspect the source and destination
> and report whether installation would overwrite anything. Do not install it
> yet.

Confirm that the destination is absent, then run:

```sh
node skills/manage-skills/scripts/skills.mjs install draft-change-note --source skills
```

You should find `.agents/skills/draft-change-note` linked to the source skill.
This is the skill we built, not a reinstallation of every toolkit skill.

## 10. Try the result

In a fresh agent conversation, explicitly load the new skill's `SKILL.md` and
send:

> Draft a change note. Summary fact: added CSV export. Testing fact: the export
> unit tests passed. Risk fact: large exports may take longer.

Expect exactly these three sections, containing only those facts:

```markdown
## Summary

Added CSV export.

## Testing

The export unit tests passed.

## Risks

Large exports may take longer.
```

Now send:

> Draft a change note. Summary fact: added CSV export. Risk fact: large exports
> may take longer. No testing facts are supplied.

Expect “Not provided” under Testing, not an invented test result. Finally send:

> Run the test suite and publish the release.

Expect the skill's outside-scope handling and no test or publication tool calls.
Record any mismatch as an observation for the next revision. These manual
checks exercise the loaded instructions; they do not prove automatic selection
or replace a live evaluation suite.

You have built a skill with an approved specification, a provenance-backed
reference, focused instructions, a trigger description, evaluation artifacts,
citation metadata, and a local installation. The
[explanation](../explanation/agent-skill-development.md) discusses how those
artifacts fit together; the [CLI reference](../reference/cli-tools.md) describes
the commands we used.
