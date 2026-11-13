# Agent Skills as engineered, maintained knowledge

An Agent Skill is a reusable influence on an agent's decisions, not just a
piece of prose. Its description affects when the agent selects it. Its
instructions affect what the agent does, which tools it uses, and when it asks
for authorization. Its references affect what the agent treats as evidence.
Changing any of these can change behavior for future users.

This repository treats those changes as engineering work. Specifications make
intent durable; curated references make knowledge traceable; evaluations expose
behavioral regressions; scripts make repeatable checks inexpensive. None of
these makes model behavior deterministic. Together they make it more reviewable.

## Why specification-driven development applies to skills

Code and skills both translate intent into behavior. With code, a patch can
compile while implementing the wrong requirement. With skills, instructions can
be fluent and structurally valid while triggering on the wrong request,
exceeding their authority, or producing the wrong artifact. Surface quality is
not evidence of fitness for purpose.

A specification separates the intended behavior from the current implementation.
In this repo, [`grill-this-skill`](../../skills/grill-this-skill/SKILL.md) establishes
an objective, audience, trigger and non-trigger contexts, safety boundaries,
inputs, outputs, references, and a lean evaluation plan. The approved agreement
lives under `specs/`, rather than only in a conversation. That separation gives
later agents and reviewers something stable against which to judge an edit.

The evaluation plan belongs in that agreement because “better instructions” is
otherwise difficult to falsify. A normal request, a near miss, and evidence for
the expected behavior make the intended distinction concrete. A skill can be
wrong by activating when it should not, as well as by answering badly after it
activates.

Specification-driven does not mean every correction needs a new interview.
`grill-this-skill` explicitly excludes bounded mechanical edits that do not
change behavior, triggers, safety, references, or evaluation plans. The valuable
boundary is between changing the agreement and implementing it—not between
large files and small files.

## Why knowledge management is part of skill development

A skill's supporting knowledge has a lifecycle. Sources change, summaries lose
context, duplicate documents disagree, and an agent-generated claim can acquire
apparent authority merely by being copied. A directory full of documents is not
yet a trustworthy knowledge base.

This repo separates several responsibilities:

- [`research-references`](../../skills/research-references/SKILL.md) identifies
  research questions, evaluates sources, and obtains approval before capture.
- [`ingest-reference`](../../skills/ingest-reference/SKILL.md) handles acquisition,
  structure, provenance, and maintenance of reference material.
- [`write-citations`](../../skills/write-citations/SKILL.md) derives citation
  metadata from references already gathered, rather than inventing sources.

The resulting distinction is between **what is known**, **where it came from**,
and **how the agent should use it**. Provenance allows a maintainer to revisit
an assumption without reconstructing the conversation that introduced it.
Citation metadata supports attribution but does not prove that a claim is true
or that a source is current.

### The contribution of Open Knowledge Format

[Open Knowledge Format (OKF) v0.2](../../specs/references/open-knowledge-format/SUMMARY.md)
represents knowledge as Markdown concept documents with YAML metadata and links.
Its provenance and lifecycle fields can describe sources, generation,
verification, status, and staleness. These are evidence and lifecycle signals,
not a substitute for source evaluation. A generated document is not
human-reviewed simply because it has metadata.

The repository uses OKF-backed summaries as context maps. Detailed knowledge
can stay out of `SKILL.md` until a task needs it. The ingestion skill's local
“5/5000” convention calls for a `SUMMARY.md` when a collection exceeds five
files or 5,000 tokens, with purpose and loading triggers for each reference.
That threshold is repository guidance, not a requirement of the OKF format.
Progressive disclosure reduces irrelevant context while keeping deeper evidence
available.

There is a difference between the knowledge model and its current enforcement.
`validate-okf` checks a small structural subset, including frontmatter, `type`,
and `generated.by` when `generated` is present. It does not establish source
credibility, freshness, license compatibility, or full OKF conformance. It also
requires frontmatter on each non-reserved Markdown document: an indexed raw
file is not exempt merely because an ingestion convention permits it.

## The development loop expressed by this repo

The loop connects durable artifacts rather than relying on one long agent
session:

**Observed need → approved specification → grounded references → skill
implementation → checks and evaluations → evidence for the next revision.**

The roles overlap at handoff points, but have different centers of responsibility:

| Responsibility                       | Agent skill                               | Durable result                                             |
| ------------------------------------ | ----------------------------------------- | ---------------------------------------------------------- |
| Agree on intended behavior           | `grill-this-skill`                        | Approved `specs/<name>.md`, including an evaluation plan   |
| Establish supporting evidence        | `research-references`, `ingest-reference` | Curated, provenance-backed references                      |
| Improve an existing implementation   | `develop-skill`                           | Focused changes to `SKILL.md` and supporting files         |
| Improve selection behavior           | `describe-skill`                          | A more discriminating trigger description                  |
| Express the approved evaluation plan | `develop-skill-evals`                     | Promptfoo configuration, prompts, and test cases           |
| Attribute existing evidence          | `write-citations`                         | `CITATION.cff`                                             |
| Manage local skill files             | `manage-skills`                           | Validation, scaffolding, import, or local installation     |
| Assess an agent-facing interface     | `axi`                                     | Interface-design guidance when a tool contract is involved |
| Choose a model for a bounded task    | `select-llm`                              | A task-specific selection and fallback recommendation      |

These are not mandatory stages for every edit. Model selection and interface
design become relevant when a change introduces those concerns. Evaluation
execution is separate from evaluation authoring: `develop-skill-evals` neither
runs tests nor invents a missing plan. Likewise, scaffolding creates files; it
does not approve the behavior those files will implement.

A failure can send work to different places. A genuine skill gap calls for an
instruction change. A brittle assertion calls for a test change. A provider
output defect calls for a model or prompt-contract correction. A changed
requirement calls for revisiting the specification. Treating every failure as a
reason to add more prose would erase those distinctions.

## Why scripts are separate from agent judgment

An agent is useful when a task requires interpretation: interviewing a user,
judging source authority, choosing an assertion, or resolving conflicting
requirements. A script is useful when the operation should be repeatable and
its success mechanically observable. Recreating such operations through model
output adds variability without adding useful judgment.

The eight packaged helpers divide the mechanical work into narrow contracts:

| Helper            | Place in the loop                                       |
| ----------------- | ------------------------------------------------------- |
| `find-skills`     | Inventory of skill files in a Git repository            |
| `init-skill`      | Creation of a skill directory and initial template      |
| `init-skill-eval` | Creation of the Promptfoo suite skeleton                |
| `validate-skill`  | Repository-specific skill frontmatter checks            |
| `validate-okf`    | Structural checks on a reference bundle                 |
| `validate-cff`    | Structural checks on citation metadata                  |
| `check-skill`     | Coordination and reporting of applicable checks         |
| `link-skills`     | Exposure of installed package and local skills to agent |

“Automated” does not mean “offline” or “deterministic end to end.” The three
validators and scaffolding commands do not ask a model to judge content. `check-skill`
also invokes external linters and can run Promptfoo against configured model
providers. That can require credentials, contact external services, and incur
cost. Its successful exit can include a skipped Promptfoo run when the command
is unavailable; it is not proof that behavioral tests passed.

The CLI landscape also has distinct audiences. The external Skills CLI installs
skills from Git. The packaged helpers support local authoring and validation.
The separate `manage-skills` script handles local skill operations. PromptLint
provides static prompt feedback, while Promptfoo executes behavioral evaluations.
The vendored `agent-skills-eval` runner is a separate evaluation path already
present in parts of the repository, not the output target of
`develop-skill-evals`. Bun builds the packaged executables; it is not a skill
quality assessor.

The [CLI reference](../reference/cli-tools.md) records these contracts and their
limits. The distinction matters: a green structural check is useful evidence,
but approval, knowledge quality, and observed agent behavior remain separate
claims.
