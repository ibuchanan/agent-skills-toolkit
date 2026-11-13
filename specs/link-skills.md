# Specification: `link-skills` CLI

## Objective

Generalize `agent-skills-toolkit`'s `link-toolkit-skills` command so it can expose skills from any installed package, including the toolkit, and skills developed locally in a consuming repository through relative symlinks under `.agents/skills/`.

Use the same command to self-install this repository's own skills. A single binary should support all sources without replacing existing destination content or removing links owned by another source.

## Audience

Maintainers and contributors to `agent-skills-toolkit`, maintainers of downstream packages that ship their own skills, and developers consuming those packages or developing local skills.

## Context

The current `link-toolkit-skills` command links immediate skill directories from:

```text
<cwd>/node_modules/agent-skills-toolkit/skills/
```

to:

```text
<cwd>/.agents/skills/
```

The shared `linkSkills(sourceDir, targetDir)` implementation already handles relative symlinks, idempotence, conflicts, and source-scoped stale-link cleanup. The CLI and its contract are toolkit-specific. Generalize source selection rather than adding separate installers for each package or for this repository.

## CLI contract

Rename the binary to `link-skills` and support explicit source modes:

```sh
link-skills --package agent-skills-toolkit
link-skills --package @example/developer-tools
link-skills --toolkit
link-skills --local
```

- `--package <name>` selects `<cwd>/node_modules/<name>/skills/`.
- `--toolkit` is shorthand for `--package agent-skills-toolkit`, not a distinct source or ownership scope.
- `--local` selects `<cwd>/skills/`.
- All modes target `<cwd>/.agents/skills/`.
- The command runs from the consuming repository root. It does not search ancestor directories, infer a workspace root, or select a source relative to its own executable.
- Require exactly one mode. Missing, repeated, or conflicting modes, unknown arguments, and a missing package value print usage and exit with code `2`. No-argument invocation has no default.
- Accept unscoped and scoped package names. Reject filesystem paths, traversal components, absolute paths, package versions, and package specifiers such as URLs. The package value identifies a package under the root's `node_modules`, not an arbitrary source directory.
- Support both `--package <name>` and `--package=<name>`; bare `package=...` is not accepted.
- Package mode links skills from an already-installed package. It does not download packages, run a package manager, execute package scripts, or read a custom skill-directory setting. Packages must ship skills under `skills/<skill-name>/SKILL.md`.
- Package directories may be symlinks, as with workspace or package-manager installations. Construct relative links through the selected `<cwd>/node_modules/<name>/skills/` path; do not store package-manager-specific backing paths.

## Usage scenarios

### Consuming toolkit, package, and local skills

Run from the consuming repository root after installing the required packages:

```sh
link-skills --toolkit
link-skills --package @example/developer-tools
link-skills --local
```

Each invocation selects one source. Combining sources means invoking the command separately; there is no implicit discovery of every dependency or ordering-based override.

A downstream tool can expose its own package script or wrapper that invokes `link-skills --package @example/developer-tools` from the consumer root. The toolkit's compiled binary supplies the linking logic; the downstream tool only supplies its installed package name. It must include its `skills/` tree in its published package and make the `link-skills` executable available to the caller.

### Self-installing this repository's skills

Use local mode in this repository, without installing the toolkit into its own `node_modules`:

```sh
bun run build
./scripts/link-skills --local
```

Wire this into the repository's package scripts:

```json
{
  "scripts": {
    "link:skills": "./scripts/link-skills --local",
    "prepare": "bun run build && bun run link:skills"
  }
}
```

Build before invoking the compiled executable. Self-installation targets this checkout's `.agents/skills/`, not a home directory or a separate consumer. Existing links to `../../skills/<name>` remain unchanged; foreign links and other existing content remain conflicts. Do not automatically run toolkit/package mode here: the local source already contains the toolkit's own skills.

Generated discovery links must remain out of the published package. Preserve existing tracked discovery entries; adopting this setup does not authorize replacing conflicts or changing which links are tracked.

## Link behavior

Apply the same safety behavior to all modes:

1. Discover only immediate source child directories that contain a regular `SKILL.md` file. Do not recursively discover nested skills.
2. Create relative directory symlinks in the target for discovered skills.
3. Leave a correct existing symlink to the selected source unchanged.
4. Treat an existing file, directory, dangling symlink, or symlink to another source as a conflict. Preserve it; do not overwrite it.
5. Remove a stale same-name symlink only when its resolved target is the matching immediate child of the selected source directory and that skill is no longer present in that source.
6. Never remove links belonging to a different source directory. Local mode must not prune package links; one package must not prune another package's links. Toolkit shorthand and explicit toolkit package mode select the same source and may clean up the same stale links.
7. A missing source directory remains a successful no-op and must not trigger stale-link cleanup. This includes a missing package or a package without a `skills/` directory.
8. If source and target resolve to the same directory, fail with an operational error.

Skills from different sources with the same name contend for the single target path `.agents/skills/<name>`. Preserve the existing link and report a conflict; do not apply implicit precedence or replace the existing destination.

## Output and exit codes

Report linked, unchanged, removed, and conflicting skill names, with wording that identifies the selected source (`local` or the package name, including when selected through `--toolkit`). Emit a clear no-op message when there are no applicable skills.

- Exit `0` when linking completes, including a successful no-op.
- Exit `1` for conflicts or operational errors.
- Exit `2` for invalid arguments or a missing required mode.

A self-install conflict must propagate a nonzero exit through `link:skills` and `prepare`; do not hide it or retry with overwrite behavior.

## Implementation scope

- Rename `link-toolkit-skills` to `link-skills` in the package `bin` mapping and use a generic CLI entry point and helper/module name where appropriate.
- Keep the shared linker source-agnostic; pass the selected source and common target paths from the CLI rather than duplicating link logic.
- Implement toolkit mode by selecting the toolkit package name through the same package path selection logic.
- Update consumers to invoke explicit modes and document the package layout needed by downstream skill providers.
- Update this repository's `prepare` script to build and then self-install through `link:skills` in local mode.
- Remove `link-toolkit-skills` without a deprecated alias. This is an intentional breaking rename; document migration to `link-skills --toolkit`.

## Tests

Extend the linker unit and package-consumer tests to verify:

- Local, toolkit, unscoped package, and scoped package modes select their expected source and share the `.agents/skills` target.
- Toolkit shorthand and explicit toolkit package mode are equivalent, including stale-link cleanup.
- Both supported package argument forms work; invalid names and package specifiers produce usage and exit `2` without changing destination content.
- Source selection remains relative to the consumer root when the executable belongs to the toolkit or is invoked through a downstream wrapper.
- A downstream package can ship and link its own skills using the toolkit executable without a toolkit-specific installer.
- Symlinked package directories work and generated relative links retain the consumer's `node_modules` path.
- Relative links are created and repeated invocation is idempotent.
- Only immediate valid skills are linked.
- Correct links are unchanged; files, directories, dangling links, and foreign links are preserved and reported as conflicts.
- Stale links from the selected source are removed, while local links and links from other packages are preserved.
- A missing source is a no-op and does not prune existing links.
- Same-name skills from any two distinct sources conflict without replacement, independent of which mode runs first.
- Missing, repeated, or conflicting mode arguments produce usage and exit `2`.
- Operational errors produce exit `1`.
- A checkout fixture without a self-dependency can build and self-install its local skills using the repository package scripts; a second invocation is unchanged.
- Self-installation preserves foreign destination content and propagates conflicts through the package script.
- Packed artifacts exclude generated `.agents/skills` links while including the compiled executable and package skills.
- If a deprecated alias is retained, it invokes toolkit mode and emits the expected notice.

## Documentation updates

Update all toolkit references to the command, including:

- CLI reference documentation;
- the local-skill installation guide, distinguishing collection linking from selected-skill copying or installation into another project;
- package-consumer tests and fixtures;
- setup examples and scripts, including this repository's self-installation;
- examples for downstream packages shipping their own skills;
- any usage or explanation docs that name `link-toolkit-skills`.

Document source paths, target path, root-directory behavior, mode selection, package name validation and layout, conflict and stale-link behavior, output, and exit codes. Clarify that linking is not package installation or verification of agent activation.

## Acceptance criteria

- `link-skills --package <name>` exposes skills from an installed unscoped or scoped package.
- `link-skills --toolkit` behaves identically to `link-skills --package agent-skills-toolkit`.
- `link-skills --local` exposes local skills without requiring an installed package.
- A downstream package can use the toolkit command to expose its own bundled skills in a consumer.
- This repository builds and self-installs through `prepare` using local mode, without a self-dependency or separate installer.
- All modes use the same safe, idempotent linker and destination, and never prune another source's links.
- A same-name collision never overwrites an existing target.
- The old command is either intentionally removed with documentation updated or retained only as a tested deprecated alias.
- Unit tests, package-consumer tests, and relevant repository checks pass.

## References

- `src/scripts/lib/link-skills.ts` — shared source-agnostic linker implementation.
- `src/scripts/link-skills.ts` — explicit local/package CLI entry point.
- `src/scripts/build.ts` — compiled executable build process.
- `package.json` — binary mapping, package contents, and lifecycle scripts.
- `test/scripts/link-skills.test.ts` — linker and CLI behavior tests.
- `test/scripts/package-skills.test.ts` — package-consumer coverage.
- `docs/reference/cli-tools.md` — current CLI reference.
- `docs/how-to/install-local-skill.md` — local skill installation guidance.
