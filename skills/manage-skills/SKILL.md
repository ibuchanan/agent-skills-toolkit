---
name: manage-skills
description: Use this skill to manage local skill definitions, especially when listing, scaffolding, installing, importing, or validating skills.
compatibility: Requires the manage-skills CLI usually installed to `~/.agents/skills/manage-skills/scripts/skills.mjs`. Use bun run to execute it.
---

# Manage Skills

> Paths like `references/...`, `scripts/...`, and `assets/...` in this file are relative to this `SKILL.md`'s directory.

Use this skill to manage local skill definitions, especially when listing, scaffolding, installing, importing, or validating skills. This skill is about creating and managing skill definitions; not about designing a skill's behavior. If the user needs help authoring or iterating on a skill's content after scaffolding, use `develop-skill`.

## Invocation — use the global script with bun

```bash
bun run ~/.agents/skills/manage-skills/scripts/skills.mjs <subcommand> [args]
```

The script defaults `--source` to `packages/agents/src/skills`, so no `--source` flag is needed for standard skill operations. Do not use `npm exec -- manage-skills` or `node_modules/.bin/manage-skills` — they silently do nothing.

## Scope

This skill covers operational management of skills under `packages/agents/src/skills`. Supported subcommands: `list`, `new`, `install`, `import`, `validate`.

Not for: writing high-quality skill content from scratch, improving existing skill instructions, or eval design. For those, use `develop-skill`.

## Core workflow

1. Determine which subcommand matches the user's intent (see decision guide below).
2. Run the command using the repo-local script.
3. **Verify the result** — confirm created files exist with `ls` or `list`; do not trust exit 0 alone.
4. After making changes, summarize what was created, imported, installed, or validated.

## Subcommands

### `list`

Inspect available repo-local skills.

```bash
bun run ~/.agents/skills/manage-skills/scripts/skills.mjs list
bun run ~/.agents/skills/manage-skills/scripts/skills.mjs list --json
```

Lists skill directories that contain `SKILL.md`. Emits readable text or JSON.

### `new`

Scaffold a new skill directory.

```bash
bun run ~/.agents/skills/manage-skills/scripts/skills.mjs new <skill-name>
```

- Name must match `^[a-z0-9][a-z0-9-]*$`
- Creates `packages/agents/src/skills/<skill-name>/` with subdirs: `references/`, `scripts/`, `assets/`, `evals/`, and a starter `SKILL.md`
- Do not use `--force` unless overwriting is explicitly intended
- After scaffolding, verify with `ls packages/agents/src/skills/<skill-name>/` and replace placeholder `SKILL.md` content with real instructions

### `install`

Place a skill into a repo-local `.agents/skills` directory.

```bash
bun run ~/.agents/skills/manage-skills/scripts/skills.mjs install <skill-name>
bun run ~/.agents/skills/manage-skills/scripts/skills.mjs install <skill-name> /path/to/other-repo --copy
```

- Validates the source skill before installing
- Uses a symlink by default; use `--copy` for an independent copy
- Mention whether the result is a symlink or copy
- If `--force` is used, warn the user an existing destination will be replaced

### `import`

Bring an external skill directory into this repo.

```bash
bun run ~/.agents/skills/manage-skills/scripts/skills.mjs import /path/to/external/skill [name]
```

- Validates the external skill before import
- Copies into the repo source tree, optionally renaming
- Use `--override-name` to rewrite the imported frontmatter name
- Validate after import and report any issues

### `validate`

Check whether a skill is structurally valid.

```bash
bun run ~/.agents/skills/manage-skills/scripts/skills.mjs validate <skill-name-or-path>
```

Validates required frontmatter fields and directory conventions. Reports clear failures.

## Decision guide

| User intent                                   | Subcommand                                   |
| --------------------------------------------- | -------------------------------------------- |
| See what skills exist                         | `list`                                       |
| Create a new skill folder                     | `new`                                        |
| Make a skill available under `.agents/skills` | `install`                                    |
| Bring an external skill into this repo        | `import`                                     |
| Check a skill is structurally valid           | `validate`                                   |
| Author or improve skill content               | use `skill-creator` or `develop-skill` |

## Reference material

Load these only when needed — do not read by default:

- `references/agentskills/docs/specification.mdx` — Agent Skills package structure and frontmatter
- `references/agentskills/docs/skill-creation/best-practices.mdx` — grounding skills in real expertise
- `references/agentskills/docs/skill-creation/using-scripts.mdx` — when and how to use scripts

## Safety note

Prefer deterministic CLI operations over hand-editing directories. Always verify file creation after running any write subcommand — exit 0 is not proof of success in this repo.
