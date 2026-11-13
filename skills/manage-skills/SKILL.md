---
name: manage-skills
description: Use this skill to manage local skill definitions, especially when listing, scaffolding, installing, importing, or validating skills.
compatibility: Requires Bun to run the bundled CLI. No package installation is needed.
---

# Manage Skills

> Paths like `references/...`, `scripts/...`, and `assets/...` in this file are relative to this `SKILL.md`'s directory.

Use this skill to manage local skill definitions, especially when listing, scaffolding, installing, importing, or validating skills. This skill is about creating and managing skill definitions; not about designing a skill's behavior. If the user needs help authoring or iterating on a skill's content after scaffolding, use `develop-skill`.

## Invocation — use the skill's bundled script

Resolve `SKILLDIR` to the directory containing this loaded `SKILL.md`, not the
current project directory. Substitute that actual path below; `get_skill` is not
a shell command. Quote paths so installations containing spaces work.

```bash
SKILLDIR="/actual/path/to/manage-skills"
bun run "$SKILLDIR/scripts/skills.mjs" <subcommand> [args]
```

The script bundles its JavaScript dependencies; only Bun is required. If Bun is
unavailable, report the unmet prerequisite rather than installing it silently.
The default source is `packages/agents/src/skills` relative to the current working
directory. For a different project layout, pass `--source <actual-skills-directory>`
to the subcommand. The source tree is a task input, not an installation path.

## Scope

This skill covers operational management of skills under `packages/agents/src/skills`. Supported subcommands: `list`, `new`, `install`, `import`, `validate`.

Not for: writing high-quality skill content from scratch, improving existing skill instructions, or eval design. For those, use `develop-skill`.

## Core workflow

1. Determine which subcommand matches the user's intent (see decision guide below).
2. Before `install` or `import`, perform the self-containment review below on the source. Report blocking dependencies before proceeding; do not silently repair content or treat structural validation as proof of portability.
3. Run the command using this skill's bundled script, with `--source` when the project's skill directory differs from the default.
4. **Verify the result** — confirm created files exist with `ls` or `list`; do not trust exit 0 alone. Review the resulting package for self-containment after `import` or copy-mode `install`, and when explicitly validating a skill.
5. After making changes, summarize what was created, imported, installed, or validated. Report structural validity and self-containment separately.

## Subcommands

### `list`

Inspect available repo-local skills.

```bash
bun run "$SKILLDIR/scripts/skills.mjs" list
bun run "$SKILLDIR/scripts/skills.mjs" list --json
```

Lists skill directories that contain `SKILL.md`. Emits readable text or JSON.

### `new`

Scaffold a new skill directory.

```bash
bun run "$SKILLDIR/scripts/skills.mjs" new <skill-name>
```

- Name must match `^[a-z0-9][a-z0-9-]*$`
- Creates `packages/agents/src/skills/<skill-name>/` with subdirs: `references/`, `scripts/`, `assets/`, `evals/`, and a starter `SKILL.md`
- Do not use `--force` unless overwriting is explicitly intended
- After scaffolding, verify with `ls packages/agents/src/skills/<skill-name>/` and replace placeholder `SKILL.md` content with real instructions

### `install`

Place a skill into a repo-local `.agents/skills` directory.

```bash
bun run "$SKILLDIR/scripts/skills.mjs" install <skill-name>
bun run "$SKILLDIR/scripts/skills.mjs" install <skill-name> /path/to/other-repo --copy
```

- Validates the source skill before installing
- Uses a symlink by default; use `--copy` for an independent copy
- Mention whether the result is a symlink or copy
- If `--force` is used, warn the user an existing destination will be replaced

### `import`

Bring an external skill directory into this repo.

```bash
bun run "$SKILLDIR/scripts/skills.mjs" import /path/to/external/skill [name]
```

- Validates the external skill before import
- Copies into the repo source tree, optionally renaming
- Use `--override-name` to rewrite the imported frontmatter name
- Validate after import and report any issues

### `validate`

Check whether a skill is structurally valid.

```bash
bun run "$SKILLDIR/scripts/skills.mjs" validate <skill-name-or-path>
```

Validates required frontmatter fields and directory conventions. Reports clear failures.

## Self-containment review

This is an agent review in addition to the CLI's structural checks; the current
validator does not establish that resource links or runtime dependencies resolve.

1. Start at `SKILL.md` and follow required resource loads through references,
   templates, and helpers. Confirm each bundled path exists and resolves inside
   the skill directory, including symlink targets and transitive dependencies.
2. Flag required reads of the skill's own unbundled spec, shared repository
   resources such as `specs/references/` or `vendor/`, sibling skill directories,
   absolute author-machine paths, and relative paths escaping the package.
   Inspect prose and commands as well as Markdown links.
3. Distinguish those defects from legitimate task inputs (such as a target spec
   supplied by the user), explicit tool/service prerequisites, optional handoffs,
   and source/provenance links. These do not need copying, but their role and
   unavailable-prerequisite behavior must be clear.
4. Review as if only this skill directory had been copied into a different
   project, without the authoring checkout or conversation context. A symlink
   installation working in the original checkout is not portability evidence.
   Do not execute bundled code just to inspect dependencies.
5. Report offending paths, why they are required, and unresolved checks. Hand off
   instruction repairs to `develop-skill` and reference localization to
   `ingest-reference`; do not claim self-containment until blockers are resolved.

## Decision guide

| User intent                                   | Subcommand                             |
| --------------------------------------------- | -------------------------------------- |
| See what skills exist                         | `list`                                 |
| Create a new skill folder                     | `new`                                  |
| Make a skill available under `.agents/skills` | `install`                              |
| Bring an external skill into this repo        | `import`                               |
| Check a skill is structurally valid           | `validate`                             |
| Author or improve skill content               | use `skill-creator` or `develop-skill` |

## Reference material

Read `references/skill-format.md` when checking package layout, frontmatter, or
resource links. Content-authoring practices and script design are outside this
skill's scope; optionally hand off to `develop-skill` if installed, otherwise
report the needed authoring work without assuming a companion is available.

See `scripts/README.md` for bundle maintenance and third-party license notices.

## Safety note

Prefer deterministic CLI operations over hand-editing directories. Always verify file creation after running any write subcommand — exit 0 is not proof of success in this repo.
