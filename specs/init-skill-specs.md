# Feature specification: `init-skill --specs`

## Problem

The toolkit can scaffold one skill when the caller already knows its name, but
many repositories keep approved skill specifications in `specs/`. Developers
must identify specifications without matching skills and invoke `init-skill`
for each one manually. A repository-local loop can automate this, but the logic
belongs with the toolkit's initializer and is useful across repositories.

## Solution

Add an `--specs` mode to `init-skill` that discovers skill specifications in
the current repository and scaffolds a starter skill for each specification
that does not already have a corresponding skill directory.

This mode creates the normal starter structure only. It does not copy the
specification into `SKILL.md`, author skill instructions, or overwrite any
existing skill content.

## Command contract

```text
init-skill <skill-name>
init-skill --specs
```

- Preserve the existing single-skill form and its behavior for valid names.
- `--specs` takes no positional arguments and cannot be combined with a skill
  name or other unsupported options.
- Locate the repository root using the existing repository-root discovery
  behavior, regardless of the caller's working directory within that repository.
- Read candidate files from the root-level `specs/` directory only. Do not
  recursively scan dependencies, generated output, or other directories.
- Process Markdown files in deterministic lexicographic path order.

## Specification discovery

A candidate is a Markdown file whose first-level heading identifies a skill
specification in the form `# Skill specification <name>`. Accept an optional
colon after `specification` and optional backticks around `<name>` so existing
spec heading styles are recognized. The extracted name must pass the existing
skill-name validation rules.

- Ignore Markdown files without a matching heading; do not infer names from
  filenames or prose.
- Treat a matching heading with an invalid name as an item-level error and
  continue processing other candidates.
- Do not parse or execute specification content. Treat it as untrusted input;
  use the validated name as a filesystem path component.

## Creation and collision safety

For each discovered skill name:

- If `skills/<name>/` does not exist, create the same directory structure and
  starter `SKILL.md` as the positional command.
- If any filesystem entry already exists at `skills/<name>/`, skip it without
  modifying, deleting, or replacing the entry or anything beneath it. This
  includes a complete skill and a partial/incomplete directory.
- Make the existence check and creation safe against a concurrent initializer:
  a collision discovered during creation must leave the pre-existing path
  untouched.
- Keep each new skill creation atomic: on an I/O failure, remove only artifacts
  created by that attempted initialization and preserve all pre-existing data.
- Never modify, move, or delete files under `specs/`.

## Output and exit behavior

For each recognized skill specification, emit one concise progress/result line
in input order, distinguishing created skills, skipped existing paths, and item
errors. Report the source specification path and skill name where available.
Ignore non-matching Markdown files silently. Continue processing after an
item-level failure so one bad specification does not prevent other safe
scaffolds from being created.

- Exit `0` when processing completes without item errors, including when there
  are no matching specifications or all targets already exist.
- Exit nonzero if one or more candidate specifications could not be processed;
  still report the outcome for every candidate.
- Keep usage and repository-discovery errors consistent with the existing
  command's exit-code conventions.
- Keep diagnostics actionable and avoid stack traces for expected item errors.

Example:

```text
Created skill: forge-testing (specs/forge-testing.md)
Skipped existing skill: forge-ui (skills/forge-ui already exists)
```

## Tests and acceptance criteria

Test the observable command behavior using temporary repositories and
specification fixtures, without writing to the developer's live skills
folder.

1. The positional `init-skill <name>` form still creates the standard scaffold.
2. `init-skill --specs` discovers headings with and without the optional colon
   and backticks, and derives the expected skill names.
3. Discovery is limited to root-level Markdown files in `specs/`, and processing
   order is deterministic.
4. Files without a recognized heading are ignored; invalid names produce a
   reported error without stopping other candidates.
5. A complete existing skill and an incomplete pre-existing skill directory
   are both skipped with their contents unchanged.
6. A creation collision or injected I/O failure never deletes or overwrites
   pre-existing files; partial artifacts created by the failed attempt are
   cleaned up.
7. Multiple specifications continue processing after an item-level failure,
   with accurate output and a nonzero final status.
8. No matching specifications and all-existing targets are successful no-op
   outcomes with clear output.
9. Unsupported argument combinations fail before filesystem mutation.
10. Specification files remain byte-for-byte unchanged.

## Out of scope

- Generating skill instructions from specification content.
- Choosing which specifications are approved or ready for skill authoring.
- Recursively searching arbitrary directories or accepting a custom specs path.
- Updating or replacing an existing skill, including via a force option.
- Publishing, installing, validating, or evaluating the generated skills.
