# CLI tools

<!-- cspell:words NFKC httpx LOCALAPPDATA artificialanalysis fnm -->

This reference describes the current repository implementation. It distinguishes
packaged helper commands from skill-local utilities and third-party tools.
Formats accepted by different validators are not interchangeable.

## Packaged helpers

The `bin` mapping in [`package.json`](../../package.json) exposes eight commands.
Source entry points are under [`src/scripts/`](../../src/scripts/); shared
implementations are under [`src/scripts/lib/`](../../src/scripts/lib/).
`bun run build` compiles them to native executables under `scripts/` for the
build machine's OS and architecture. Installed dependencies expose them under
`node_modules/.bin/`. Direct source invocation has the form
`bun run src/scripts/<command>.ts`.

The helpers emit human-readable text, not a stable JSON protocol. No shared
`--help`, `--version`, `--dry-run`, or JSON flag is implemented. Most
single-argument entry points read only the first positional argument; surplus
arguments are not consistently rejected. `link-toolkit-skills` explicitly
rejects arguments. `find-skills` does not parse them.

| Command               | Syntax                              | Working-directory / path rule                                     | Mutation                                |
| --------------------- | ----------------------------------- | ----------------------------------------------------------------- | --------------------------------------- |
| `find-skills`         | `find-skills`                       | Finds nearest ancestor containing a `.git` file or directory      | None                                    |
| `init-skill`          | `init-skill <name>`                 | Finds Git root; targets its `skills/`                             | Creates scaffold                        |
| `init-skill-eval`     | `init-skill-eval <skill-directory>` | Relative paths resolve from current directory                     | Creates eval scaffold                   |
| `validate-skill`      | `validate-skill <skill-directory>`  | Relative paths resolve from current directory                     | None                                    |
| `validate-okf`        | `validate-okf <bundle-directory>`   | Relative paths resolve from current directory                     | None                                    |
| `validate-cff`        | `validate-cff <directory>`          | Relative paths resolve from current directory                     | None                                    |
| `check-skill`         | See modes below                     | Requires a Git repository                                         | External tools may write eval artifacts |
| `link-toolkit-skills` | `link-toolkit-skills`               | Current directory is the consuming project root; no parent search | Creates/removes toolkit symlinks        |

### `find-skills`

Recursively discovers files named exactly `SKILL.md` beneath the Git root.
Output is sorted repository-relative paths, one per line. `node_modules/`
directories are excluded; directory symlinks are not followed. Other trees,
including fixtures and `vendor/`, are not excluded. Lowercase `skill.md` files
are not discovered.

An empty inventory emits nothing and succeeds. Repository lookup or filesystem
errors reject the top-level call; there is no dedicated usage-error handler.

### `init-skill`

Creates `skills/<name>/SKILL.md` and empty `scripts/`, `assets/`, `references/`,
and `evals/` subdirectories. The parent `skills/` directory must already exist.
The command refuses an existing skill directory; it has no overwrite flag.
The generated skill contains placeholder description and body text. It does not
create a specification, references, citation metadata, or meaningful tests.

Name checks use NFKC normalization, a 128-character limit, lowercase letters,
digits and hyphens, and prohibit leading, trailing, or repeated hyphens.

Output lists created paths. Exit codes: `0` success; `1` filesystem or unsafe
state failure; `2` missing/invalid name or repository root not found.

### `init-skill-eval`

Requires an existing directory with uppercase `SKILL.md`. Creates:

```text
evals/
  promptfooconfig.yaml
  prompts/
    main.txt
  tests/
```

An existing empty `evals/` is accepted. An existing
`evals/promptfooconfig.yaml` causes failure. The configuration contains a
Promptfoo schema URL, `prompts/*.txt`, and `tests/*.yaml`. The generic prompt
uses `{{input}}`. No provider, skill-loading harness, assertions, or test cases
are generated.

Output lists the created suite. Exit codes: `0` success; `1` missing skill,
existing config, or I/O failure; `2` missing positional argument.

### `validate-skill`

Reads `SKILL.md`, falling back to `skill.md`, and validates this repository's
frontmatter contract:

| Field           | Implemented constraint                                                   |
| --------------- | ------------------------------------------------------------------------ |
| `name`          | Required string; name rules above; must match containing directory       |
| `description`   | Required non-empty string; at most 256 characters; no colon or em dash   |
| `allowed-tools` | Optional array; entries are string-coerced and checked for colon/em dash |
| `compatibility` | Optional string; at most 256 characters; no colon or em dash             |
| Other keys      | Rejected                                                                 |

Frontmatter must begin with the expected `---` delimiter and parse as a YAML
mapping. This is a local contract, not a claim of complete upstream Agent Skills
specification conformance. It does not judge the instruction body, trigger
accuracy, tool safety, references, or behavioral quality.

Success prints the name, description, and present optional fields. Failures
print diagnostics. Exit codes: `0` valid; `1` invalid content or filesystem
failure; `2` missing positional argument.

### `validate-okf`

Recursively inspects regular lowercase `.md` files beneath the supplied bundle
directory. Directory symlinks are not traversed.

| Subject                    | Implemented check                                                               |
| -------------------------- | ------------------------------------------------------------------------------- |
| Non-reserved Markdown file | YAML frontmatter mapping with a non-empty `type`                                |
| Present `generated` field  | Mapping containing a non-empty `by` value                                       |
| `index.md`, `log.md`       | Frontmatter not required; parseable supplied YAML; a present `type` is rejected |
| Empty bundle               | Accepted                                                                        |

The validator does not require `okf_version`, `sources`, `verified`, timestamps,
licenses, indexes, or working links. It does not validate every optional field's
type, freshness, provenance truth, source authority, or full OKF conformance.
A `SUMMARY.md` is not reserved and needs its own frontmatter. Indexing another
Markdown file in a summary does not exempt that file from checks.

Success prints `✓ Valid OKF bundle`; failure prints file/field/reason entries.
Exit codes: `0` valid; `1` invalid content or filesystem failure; `2` missing
positional argument.

### `validate-cff`

Reads `CITATION.cff` directly inside the supplied directory, not a file path.
Validates a YAML mapping with these minimal checks:

- `cff-version` is the string `1.2.0`.
- `message`, `title`, and `authors` are present and non-empty.
- `authors` is a non-empty array of mappings.
- Each author has `name`, or both `family-names` and `given-names`.

This is not full CFF JSON Schema validation. Optional metadata, identifier
validity, provenance accuracy, and source-to-author attribution are not checked.
Some field checks test presence rather than fully enforcing scalar types.

Success is silent. Failure prints field/reason diagnostics. Exit codes: `0`
valid; `1` validation/read failure; `2` missing positional argument. Unexpected
uncaught runtime errors are not wrapped in a structured diagnostic protocol.

### `check-skill`

| Mode                            | Behavior                                                                            |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| `check-skill <skill-directory>` | Checks one existing skill directory                                                 |
| `check-skill --all`             | Checks all skills found by recursive discovery                                      |
| `check-skill <file-path>...`    | Maps repository-root-relative file paths to containing skills and deduplicates them |

A single existing directory selects directory mode. Other positional inputs
select file-list mode. Files outside skills produce no skill result. A run
with no matching skills succeeds with a “No skills to check” message. Discovery
has the same fixture/vendor scope as `find-skills`, not just `skills/`.

Applicable checks, in order:

| Check            | Applicability / execution                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `validate-skill` | Always; in-process validator                                                                         |
| `validate-okf`   | When `references/` exists; in-process validator                                                      |
| `validate-cff`   | When root `CITATION.cff` exists; in-process validator                                                |
| `cspell`         | Skill files; external `cspell lint --gitignore --no-progress --no-summary …`                         |
| Markdown lint    | Markdown exists; external `markdownlint-cli2 …`                                                      |
| PromptLint       | Uppercase `SKILL.md` exists; external `promptlint <SKILL.md>`                                        |
| Promptfoo        | `evals/promptfooconfig.yaml` exists; external `promptfoo eval -c promptfooconfig.yaml` from `evals/` |

External binaries resolve first from the toolkit's `node_modules/.bin`, then
from `PATH`. Missing Promptfoo is a successful skip, explicitly reported;
missing required external linters fail. Promptfoo runs in Bash with the
repository's `.env`, if present, sourced and exported. Repository-owned `.env`
content is therefore executable shell input, not merely parsed key/value data.
Live runs can use credentials, contact model providers, incur charges, and
write artifacts. There is no static-only flag.

`check-skill`'s PromptLint invocation is not the same as the `score` and
`security` subcommands prescribed by `develop-agent-skill`; compatibility
depends on the installed tool interface.

Output reports each skill and check, failures, and skipped checks. Exit codes:
`0` all applicable, non-skipped checks passed (including no matches); `1` one
or more checks failed; `2` missing arguments, repository lookup, invalid skill
path, or another top-level error. A zero exit does not establish that evals ran.

### `link-toolkit-skills`

Source: `<cwd>/node_modules/agent-skills-toolkit/skills/`.
Destination: `<cwd>/.agents/skills/`.

Immediate skill directories containing `SKILL.md` receive relative symlinks.
Correct existing links are unchanged. Stale same-name links into this toolkit's
skills directory are removed. Files, directories, and foreign links are
preserved and reported as conflicts. A missing source directory is a successful
no-op and does not trigger removal of existing links. There is no global mode
or ancestor lookup.

Output lists linked, unchanged, removed, and conflicting names, or a no-op
message. Exit codes: `0` completed/no-op; `1` conflicts or operational error;
`2` any supplied argument.

## Skill-local utilities

These are not entries in the root package's `bin` mapping.

### Local `manage-skills` CLI

Entry point: [`skills/manage-skills/scripts/skills.mjs`](../../skills/manage-skills/scripts/skills.mjs).
Runtime: Node.js with `commander` and `yaml` resolvable. Invocation prefix:
`node skills/manage-skills/scripts/skills.mjs`.

| Subcommand | Arguments and flags                                                   | Effect                                               |
| ---------- | --------------------------------------------------------------------- | ---------------------------------------------------- |
| `list`     | `[--source <dir>] [--json]`                                           | Lists available skills; optional JSON output         |
| `validate` | `<skill> [--source <dir>]`                                            | Validates by source name or path                     |
| `new`      | `<name> [--source <dir>] [--force]`                                   | Scaffolds skill and a skill-named YAML eval template |
| `install`  | `<name> [target] [--source <dir>] [--dest <path>] [--copy] [--force]` | Installs one skill; symlink by default               |
| `import`   | `<path> [name] [--source <dir>] [--override-name <name>] [--force]`   | Copies an external skill into the source directory   |

`--help` is supported by the command parser. The default source is
`<cwd>/packages/agents/src/skills`, **not this repo's `skills/`**. In this
repository, `--source skills` is the explicit source override. The default
installation target is an ancestor workspace root with array-valued
`package.json.workspaces`, or the invocation directory when none is found.
The destination defaults to `.agents/skills` beneath that target.

`--force` permits replacement; existing destinations are otherwise protected.
The `new` template is not the Promptfoo scaffold from `init-skill-eval`.
This CLI also uses a different validator: name limit 64, description limit 1024,
compatibility limit 500, and additional accepted keys including `license` and
`metadata`. Its passing result is not equivalent to `validate-skill` passing.
Normal completion exits `0`; validation, caught operational errors, and parser
errors normally exit `1`. This CLI does not share the packaged helpers' usage
exit-code convention.

### Model-catalog fetcher

Entry point:
[`skills/select-llm/scripts/fetch-model-catalog.py`](../../skills/select-llm/scripts/fetch-model-catalog.py).
The inline script metadata declares Python 3.11+ and `httpx`; invocation is
`uv run skills/select-llm/scripts/fetch-model-catalog.py [options]`.

| Option                    | Default                                                               |
| ------------------------- | --------------------------------------------------------------------- |
| `--cache-path <path>`     | Platform cache directory, `select-llm/artificialanalysis-models.json` |
| `--snapshot-path <path>`  | Skill's `assets/model-catalog.snapshot.json`                          |
| `--max-age-seconds <int>` | `86400`                                                               |
| `--timeout-seconds <int>` | `20`                                                                  |
| `--force-refresh`         | Off; bypasses fresh-cache reuse                                       |

Reads `ARTIFICIAL_ANALYSIS_API_KEY` from the environment and local `.env` files
without replacing existing environment values. A fresh cache is preferred;
otherwise it attempts the Artificial Analysis API when a key exists. Failure
or absent credentials falls back to cache, then snapshot, then an unavailable
catalog. Successful live fetches update the cache. Standard output is JSON;
fallback notices go to standard error. Normal fallbacks, including unavailable
data, return `0`, so availability must be read from the payload. Argument
parsing errors return `2`; uncaught runtime failures are not normalized.

### Other supporting scripts

- [`skills/write-citations/references/validate-cff.ts`](../../skills/write-citations/references/validate-cff.ts)
  is reference implementation material, not an independent CLI entry point.
- [`skills/research-references/evals/run.sh`](../../skills/research-references/evals/run.sh)
  is the `bun run eval:research-references` wrapper. It sources root `.env`
  and invokes `fnm exec --using=22 -- promptfoo eval -c promptfooconfig.yaml`,
  forwarding extra arguments. It requires Bash, `fnm`, Node 22, Promptfoo,
  and the suite's provider setup; it can incur evaluation costs.

## Third-party tools at the boundaries

| Tool                                              | Role / local integration                                                                | Contract source                                                                            |
| ------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| External Skills CLI (`npx skills`, `bunx skills`) | Git-based skill discovery and installation; unrelated to the local `skills.mjs` command | [Skills CLI](https://github.com/vercel-labs/skills)                                        |
| PromptLint                                        | Static prompt scoring/security feedback; also invoked by `check-skill`                  | Installed command help; [`develop-agent-skill`](../../skills/develop-agent-skill/SKILL.md) |
| Promptfoo                                         | Executes configured model evaluations; not installed by root dependencies               | [Promptfoo](https://www.promptfoo.dev/docs/intro/)                                         |
| Vendored `agent-skills-eval`                      | Separate evaluator for existing skill-named YAML suites                                 | [Vendored README](../../vendor/agent-skills-eval/README.md)                                |
| Firecrawl                                         | External web acquisition used by ingestion guidance                                     | [`ingest-reference`](../../skills/ingest-reference/SKILL.md)                               |
| Docling                                           | External document extraction used by ingestion guidance                                 | [`ingest-reference`](../../skills/ingest-reference/SKILL.md)                               |
| Git                                               | Repository identity, version history, submodule pinning                                 | [Git documentation](https://git-scm.com/docs)                                              |
| Bun                                               | Dependency installation, TypeScript execution, native helper compilation, tests         | [`package.json`](../../package.json)                                                       |

Third-party option sets and provider credentials are governed by their installed
versions, not by the toolkit helper contract.

## Root package tasks

These tasks are defined in `package.json`; they are not additional packaged bins.

| `bun run` task                              | Current effect                                                             |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| `build`, `build:scripts`                    | Compile root helper entry points to `scripts/`                             |
| `prepare`                                   | Run build; dependency lifecycle permission is required                     |
| `bootstrap`                                 | `npm install` and build inside `vendor/agent-skills-eval`                  |
| `setup`                                     | Install Lefthook hooks, then bootstrap the vendored evaluator              |
| `test`                                      | Bootstrap, then run `bun test test/scripts/*.test.ts`                      |
| `test:coverage`, `test:watch`               | Bun test coverage / watch modes                                            |
| `typecheck`                                 | TypeScript no-emit check using `tsconfig.typecheck.json`                   |
| `lint`                                      | Lefthook lint group: Biome, Markdown, spelling, type checks                |
| `lint:biome`, `lint:markdown`, `lint:spell` | Individual configured linters                                              |
| `lint:fix`                                  | Biome lint with writes                                                     |
| `format`, `format:check`                    | Biome format with / without writes                                         |
| `check`                                     | Forced Lefthook pre-push group: format, lint, test                         |
| `eval:research-references`                  | Research skill's live-eval wrapper above                                   |
| `changelog`                                 | `git cliff`                                                                |
| `todo`                                      | Recursive text search for TODO markers                                     |
| `clean`                                     | Remove `node_modules/`, `dist/`, and generated `scripts/`; retain lockfile |

`setup` and `test` can install dependencies; `check` is not a synonym for
`check-skill`. The package remains private, and built archives contain native
helpers rather than helper source that can be rebuilt.
