# Refresh a stale reference without losing provenance

To update an existing skill reference, compare it with an authoritative source,
replace only affected content, and keep the source, generation, verification,
and citation records consistent with the new revision.

## Prerequisites

- An existing captured reference and its owning skill.
- Access to its source or a trustworthy replacement source.
- Permission to retrieve and retain the source material.
- A checkout with dependencies installed and Bun available for validation.

Run terminal commands from the toolkit checkout root. Set the paths for the
reference you are refreshing:

```sh
skill_dir='skills/your-skill-name'
reference="$skill_dir/references/your-reference.md"
test -f "$reference"
git status --short -- "$skill_dir"
git diff -- "$reference" "$skill_dir/CITATION.cff"
```

Preserve existing edits. Record the current source URL, version or commit,
generation record, and any verification metadata before replacing content.
Use Git history for tracked prior versions; preserve an untracked original
separately before editing it.

## 1. Establish the refresh scope

Read the reference's frontmatter, its loading trigger in `SKILL.md`, and any
`SUMMARY.md` entry. Identify the claims, API details, tables, or formulas the
skill actually relies on.

Follow the source URL and check the upstream revision. Distinguish the date the
source changed from the date you retrieved it. Do not substitute today's date
for an unknown publication date, `last_modified`, or CFF `date-released`.

If the source has moved, verify its successor before changing the URL. If it is
unavailable, record the blocker and retain the prior source identity; do not
mark the reference fresh or verified on the strength of a replacement you have
not checked. Use `research-references` when finding a replacement needs new
source research, including its plan and capture approval gates.

## 2. Retrieve and compare the relevant revision

Ask the agent to use `skills/ingest-reference/SKILL.md` for the identified
reference. Supply the current path, authoritative source, intended scope, and
these constraints:

> Capture the relevant upstream revision into a separate staging location.
> Compare it with the current reference. Report substantive changes, removed
> claims, and downstream skill assumptions that may be affected. Preserve
> source attribution and logical sections. Do not overwrite the current file
> or update citation metadata until I approve the proposed diff.

Use the acquisition method appropriate to the existing source:

- **Repository source:** record the old and proposed commit. Fetch and inspect
  the proposed revision. Do not advance unrelated submodules. Review the exact
  commit before using it as the final provenance identifier.
- **Web source:** retrieve the authoritative page with Firecrawl or the approved
  acquisition tool. Check redirects, code blocks, and omitted sections.
- **PDF or Word source:** use Docling or the approved extractor. Compare tables,
  formulas, headings, and reading order against the original document.

If a source is pinned as a submodule, approve and record its specific new commit
before updating the pin. Update derived reference files in the same change.
Do not edit upstream mirrored material merely to add local metadata; maintain
local provenance in the derived document or context map.

## 3. Apply the approved content and metadata changes

Review the comparison, then authorize only the agreed refresh. Keep the existing
reference path when it still represents the same subject. If a split or rename
is necessary, update all affected links and loading triggers.

For each changed local Markdown concept document:

- Retain OKF `0.2.0` frontmatter and a non-empty `type`.
- Update `sources` to identify the exact material used, including its revision
  where available. Preserve correct source authorship and license information.
- Record the actual producing agent/tool and production time in `generated`.
  Do not represent the source's author as the producer of your derived summary.
- Review `verified` entries. Do not carry a prior content-verification claim
  forward as though it covered changed content. Keep historical evidence in Git
  or a change log; add new verification only after the stated check occurs.
- Update any existing lifecycle status or review deadline honestly. Do not label
  material human-reviewed without an actual human review.

If the reference set exceeds five files or 5,000 tokens, create or update its
OKF-backed `SUMMARY.md` with purpose and loading triggers. Ensure the changed
reference's trigger still describes when its contents are needed.

If upstream changes require different skill behavior, flag that separately for
specification review. Do not silently rewrite the skill's scope during a
reference refresh.

## 4. Reconcile affected citation metadata

If the refresh changes metadata represented in the owning skill's
`CITATION.cff`, ask the agent to follow `skills/write-citations/SKILL.md` using
the refreshed local references. Require an explanation of which source
contributes each changed field and the proposed diff. Approve that diff before
the agent overwrites an existing citation file.

Preserve correct metadata for the skill itself. Do not replace its authors,
version, or release date with those of an upstream source. Do not invent missing
identifiers or infer authors from Git history.

If no represented citation metadata changed, leave the file unchanged. If a
new citation file is needed but required metadata is missing, obtain that
information before treating the file as complete.

## 5. Validate structure and review source fidelity

Run:

```sh
bun run src/scripts/validate-okf.ts "$skill_dir/references"
if [ -f "$skill_dir/CITATION.cff" ]; then
  bun run src/scripts/validate-cff.ts "$skill_dir"
fi
git diff --check -- "$skill_dir"
git diff -- "$skill_dir"
```

Resolve failures in the touched files. If an existing bundle has unrelated
validation failures, record them separately rather than claiming the whole
bundle passed. The OKF validator also checks unwrapped Markdown files indexed
by a summary; an index entry alone does not exempt them.

Check changed claims against the source, open affected links, and inspect
extracted tables or formulas. Run applicable regression checks with authorization
if skill behavior may be affected. Do not use `check-skill` as an offline-only
shortcut: it can execute live evaluations.

## Completion check

Finish with the source revision, retrieval/production time, substantive changes,
citation diff or reason for no change, validation results, and unresolved
behavioral impact recorded in the change review. Keep the prior revision
recoverable. Structural validation alone does not establish fidelity or freshness.

See the [CLI reference](../reference/cli-tools.md) for validator limits and the
[development explanation](../explanation/agent-skill-development.md) for the
relationship between provenance and skill behavior.
