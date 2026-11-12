# Development

<!-- cspell:words Biome fnm gitleaks ibuchanan -->

Use this guide when changing skills, helper code, or documentation. For installing
skills into a consuming project, start with the [README](README.md). Collaboration
rules and the CLA are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Set up a checkout

Prerequisites:

- Git with submodule support.
- Bun 1.4 or newer for root dependencies, TypeScript, builds, and tests.
- Node.js and npm for the vendored evaluation runner's install/build workflow.
- `gitleaks` on `PATH` if using the installed pre-commit hook.

Clone with the pinned submodules and initialize the toolchain:

```sh
git clone --recurse-submodules https://github.com/ibuchanan/agent-skills-toolkit.git
cd agent-skills-toolkit
bun install --frozen-lockfile
bun run build
bun run setup
```

For an existing clone, use `git submodule update --init --recursive` before setup.
`bun install` may already build helpers through `prepare`; the explicit build
also covers installs where lifecycle scripts did not run. `setup` installs
Lefthook hooks and runs `bootstrap`, which uses npm to install and build
`vendor/agent-skills-eval`. These commands can access the network.

Confirm a helper runs:

```sh
scripts/validate-skill skills/describe-skill
```

Expect the skill name and description with exit status `0`. This checks the local
frontmatter contract, not skill quality. Forge credentials, a cloud site, and
SecretSpec are not prerequisites for this repository's current package scripts.

## The key development loop

**Agree on behavior → ground the knowledge → edit → check → evaluate → review.**

### 1. Scope the change against its specification

Read the target `skills/<name>/SKILL.md`, its `specs/<name>.md` when present, and
existing evaluations before editing.

For a new skill or a behavior, trigger, safety, reference-plan, or evaluation-plan
change, use [`grill-this-skill`](skills/grill-this-skill/SKILL.md) to establish an
approved specification and lean evaluation plan. Do not start a new interview
for a bounded mechanical correction that leaves the agreement unchanged.

For a new directory, scaffold from the checkout root:

```sh
scripts/init-skill your-skill-name
```

Replace placeholders before treating the skill as usable. Scaffolding does not
approve behavior or create a complete evaluation suite.

### 2. Ground the implementation

Use `research-references` to find and assess sources, respecting its plan and
capture approval gates. Use `ingest-reference` to capture and maintain the
approved material. Preserve source identity, provenance, and attribution;
add loading triggers rather than stuffing every reference into `SKILL.md`.

For maintenance work, follow
[Refresh a stale reference](docs/how-to/refresh-stale-reference.md). If a source
change alters the skill's intended behavior, revisit the specification instead
of silently broadening the implementation.

### 3. Make a focused edit

Use `develop-agent-skill` for existing instruction changes, `describe-skill` for
a description-only repair, and `write-citations` for metadata derived from
existing references. Preserve each skill's approval boundaries.

For helper changes, edit entry points in `src/scripts/` and reusable logic in
`src/scripts/lib/`. Add regression coverage under `test/scripts/`, including
usage errors, filesystem side effects, and output/exit behavior where relevant.
Rebuild after changing helper source:

```sh
bun run build
bun run typecheck
```

Keep the eight packaged commands synchronized with `package.json.bin`. Do not
hand-edit generated executables.

### 4. Run targeted static checks and code tests

Set the skill path and run the applicable structural checks:

```sh
skill_dir='skills/your-skill-name'
bun run src/scripts/validate-skill.ts "$skill_dir"
if [ -d "$skill_dir/references" ]; then
  bun run src/scripts/validate-okf.ts "$skill_dir/references"
fi
if [ -f "$skill_dir/CITATION.cff" ]; then
  bun run src/scripts/validate-cff.ts "$skill_dir"
fi
```

For a helper change, run its focused tests, for example:

```sh
bun test test/scripts/validate-skill.test.ts
```

For Markdown-only edits, format the changed files with the local Biome binary,
then run Markdown lint and spelling. For example, for these two guides:

```sh
./node_modules/.bin/biome format --write README.md DEVELOPMENT.md
./node_modules/.bin/markdownlint-cli2 README.md DEVELOPMENT.md
./node_modules/.bin/cspell lint --gitignore --no-progress README.md DEVELOPMENT.md
```

The repository's Markdown lint configuration adds its own globs, so that lint
invocation can inspect more than the two named files. Check local links and
command snippets as well. Formatting and structural validators do not establish
source fidelity, trigger accuracy, or safe agent behavior.

### 5. Author and run behavioral evaluations separately

Use `develop-skill-evals` only when the approved specification contains a
completed `### Evaluation plan`. It authors Promptfoo artifacts; it does not
invent the plan or execute tests. Initialize a missing Promptfoo skeleton with:

```sh
scripts/init-skill-eval skills/your-skill-name
```

The scaffold has no provider or meaningful test cases. Supply the suite's agent
harness, provider configuration, credentials, and assertions before execution.
Do not overwrite an existing suite or convert older formats without an explicit
migration decision. Some existing suites use the separate vendored
`agent-skills-eval` runner.

Run live evaluations only when authorized. Promptfoo is not a root dependency.
The research-reference suite has `bun run eval:research-references`, which
requires Bash, `fnm`, Node 22, Promptfoo, and provider configuration. Its wrapper
sources the root `.env`; inspect it before use and keep credentials out of Git.

`check-skill <directory>` combines validators, external linters, and a Promptfoo
run when applicable. It can source `.env` as shell input, use credentials, contact
providers, incur costs, and write artifacts. Missing Promptfoo is reported as a
successful skip, so exit `0` does not prove behavioral tests ran. Use the targeted
commands above when you need static-only checks. See the
[CLI reference](docs/reference/cli-tools.md) for exact applicability and exits.

Record the model, configuration, observed results, and skipped checks. Distinguish
skill defects from assertion defects and provider-output failures before editing
instructions to satisfy a failing test.

### 6. Review the change and run the repository gate

Review the source diff, test evidence, updated references, and documentation.
Do not claim a live-agent walkthrough passed when only file operations or unit
tests were checked. Use [Repair over-triggering](docs/how-to/repair-over-triggering.md)
for activation evidence and [Install a local skill](docs/how-to/install-local-skill.md)
for a controlled target-project check.

Run the pre-push gate before submitting:

```sh
bun run check
```

It runs formatting checks, lint/type checks, and the root test script. The root
test script bootstraps the vendored runner before executing helper tests; it can
install dependencies and build binaries. This is not the live skill-evaluation
gate and does not run every skill's Promptfoo suite.

## Repository map

| Path                                                                    | Responsibility                                                                  |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `skills/<name>/SKILL.md`                                                | Agent instructions and trigger metadata                                         |
| `skills/<name>/references/`                                             | Supporting knowledge and loading maps                                           |
| `skills/<name>/evals/`                                                  | Skill-specific evaluation configurations and cases                              |
| `specs/`                                                                | Intended skill behavior and evaluation plans                                    |
| `specs/references/`                                                     | Shared specification-authoring knowledge                                        |
| `src/scripts/`, `src/scripts/lib/`                                      | Helper entry points and implementation                                          |
| `scripts/`                                                              | Generated native helpers; ignored by Git                                        |
| `.scratch/tests/`                                                       | Ignored temporary package and linking fixtures; safe to remove after tests stop |
| `test/scripts/`                                                         | Helper, installation, and package tests                                         |
| `vendor/`                                                               | Pinned upstream Git submodules                                                  |
| `docs/`                                                                 | Tutorial, how-to guides, explanation, and CLI reference                         |
| `package.json`, `bun.lock`                                              | Root tasks, package allowlist, and dependency lock                              |
| `lefthook.yml`, `biome.jsonc`, `.markdownlint-cli2.yaml`, `cspell.json` | Hooks and static-check configuration                                            |

## Hooks, builds, and packaging

Helper compilation runs from a unique `.scratch/build/compile-*` directory.
Bun writes its `.bun-build` intermediates there while finished executables go
to `scripts/`. The builder restores its working directory and removes only its
own scratch directory on success or ordinary failure. A forcibly terminated
build may leave ignored scratch files; remove those only after builds stop.
Existing root-level `.bun-build` files from older builds are not deleted
automatically.

- **Pre-commit:** builds helpers, formats files and stages fixes, and runs
  `gitleaks` against staged changes. Review the staged diff after formatting.
- **Pre-push:** runs formatting checks, lint, and tests. `bun run check` invokes
  this group explicitly; it is different from `check-skill`.
- **Preparation:** `prepare` only builds helpers. It does not install hooks or
  bootstrap the vendored runner; `setup` does those explicitly.
- **Dependencies:** use Bun and retain `bun.lock` at the root. The vendored
  runner retains its npm workflow. Keep submodule updates deliberate and pinned.
- **Package contents:** the private package includes native helpers, skill
  instructions, references, assets, scripts, and citation metadata. The allowlist
  excludes root helper source and evaluation fixtures. Git-based Skills CLI
  installation uses a different discovery path, not that package allowlist.
- **Platform:** native helpers target the machine on which they were built.
  Build archives on a compatible machine; they cannot rebuild themselves after
  installation. Package tests cover preparation and consumer exposure.
- **Cleanup:** `bun run clean` deletes root `node_modules/`, `dist/`, and
  generated `scripts/`, but keeps `bun.lock`. Reinstall and rebuild afterward.

Tests that need repository-local temporary fixtures use
`test/scripts/shared/temp-dir.ts` to create unique directories under
`.scratch/tests/`. Each test still removes its own directory in cleanup. If a
process is interrupted, leftovers stay ignored by Git; remove them only after
related test processes have stopped. Other isolated tests use the OS temporary
directory. Do not create new fixture directories at the repository root.

## Common blockers

| Symptom                                          | Action                                                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Missing native helper                            | Run `bun run build`; check that Bun satisfies `package.json.engines`                                          |
| Missing vendored runner source/build             | Initialize submodules, then run `bun run bootstrap`                                                           |
| Commit fails because `gitleaks` is absent        | Install it and ensure it is on the hook's `PATH`                                                              |
| `check-skill` fails on a missing linter          | Provide the required tool; inspect the [CLI contract](docs/reference/cli-tools.md)                            |
| Skill passes one validator but fails another     | Distinguish the packaged validator from the local `manage-skills` validator; they enforce different contracts |
| Eval reports skipped or lacks a provider         | Configure the suite and record the skip; do not count it as a behavioral pass                                 |
| Static check fails on unrelated existing content | Isolate and report the baseline failure instead of broadening the patch silently                              |

For background on the loop, read
[Agent Skills as engineered, maintained knowledge](docs/explanation/agent-skill-development.md).
For a guided first skill, use the [tutorial](docs/tutorials/build-an-agent-skill.md).
Keep detailed command contracts in the [reference](docs/reference/cli-tools.md),
not duplicated in this guide. Route new documentation through the
[documentation index](docs/README.md).
