# [Agent Skills Toolkit]

<!-- cspell:words bunx ibuchanan -->

> Please remove this quote block and replace the others with meaningful content. If you're looking at this on Bitbucket, be assured that it looks great on GitHub.

[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

> Provide an introduction/overview of your project, and articulate the problem it solves for the broader engineering community. Potential consumers should understand **what** the project is, and **why** it exists.

Other recommended badges are a [version](https://shields.io/category/version) badge (e.g. `npm`) and a [build](https://shields.io/category/build) badge (e.g., `circleci` or `travis`). Order should be `license - version - build - PRs`. Please use the `flat-square` style.

See e.g.

[![npm version](https://img.shields.io/npm/v/react-beautiful-dnd.svg?style=flat-square)](https://www.npmjs.com/package/react-beautiful-dnd) [![npm version](https://img.shields.io/npm/v/@atlaskit/button.svg?style=flat-square)](https://www.npmjs.com/package/@atlaskit/button) [![Build Status](https://img.shields.io/travis/stricter/stricter/master?style=flat-square)](https://travis-ci.org/stricter/stricter)

## Usage

This repository provides five skills:

- `grill-this-skill`: define or revise a skill specification through an interview.
- `research-references`: find and capture authoritative sources for a skill.
- `describe-skill`: improve an existing skill's trigger description.
- `develop-skill-evals`: turn an approved evaluation plan into Promptfoo tests.
- `write-citations`: create citation metadata from existing references.

## Installation

Run the [Skills CLI](https://github.com/vercel-labs/skills) from the project
where you want to use these skills. List the available skills first:

```sh
npx skills add ibuchanan/agent-skills-toolkit --list
```

Install one skill, or all five, for Claude Code (change `--agent` for your agent):

```sh
npx skills add ibuchanan/agent-skills-toolkit --skill describe-skill --agent claude-code --yes
npx skills add ibuchanan/agent-skills-toolkit --skill '*' --agent claude-code --yes
```

Bun users can replace `npx skills` with `bunx skills`. These commands install
into the current project; add `--global` for a user-wide installation.
You do not need to add this toolkit to the consuming project's dependencies
or run its contributor setup scripts.

The CLI discovers `skills/<name>/SKILL.md` directly from Git and installs the
skill directory with its supporting files. Neither npm publication nor a
per-skill `package.json` is required. See the upstream
[skill discovery documentation](https://github.com/vercel-labs/skills#skill-discovery).

### Helper commands as a development dependency

For projects that also need the helper commands, add this repository as a Git
devDependency (Bun 1.4 or newer is required for preparation):

```sh
bun add --dev --trust github:ibuchanan/agent-skills-toolkit
```

Dependency lifecycle scripts must be allowed for this trusted package. Its
`prepare` script runs `bun run build`, compiling eight native executables:
`check-skill`, `find-skills`, `init-skill`, `init-skill-eval`,
`link-toolkit-skills`, `validate-cff`, `validate-okf`, and `validate-skill`.
Package managers expose these commands in `node_modules/.bin`; they are also
available by name in package scripts.
For example, from an existing Git repository with a `skills/` directory:

```sh
./node_modules/.bin/init-skill example
./node_modules/.bin/find-skills
./node_modules/.bin/validate-skill skills/example
```

To symlink the installed toolkit skills into the consuming project's
`.agents/skills/`, run `link-toolkit-skills` from that project's root, or add:

```json
{
  "scripts": {
    "skill:link-toolkit": "link-toolkit-skills",
    "prepare": "bun run skill:link-toolkit"
  }
}
```

If the project also installs Lefthook, its preparation can be
`(lefthook install || true) && bun run skill:link-toolkit`. The linker creates
relative links for immediate skill directories containing `SKILL.md`. Reruns
leave correct links unchanged and remove stale same-name links into this
toolkit's skills directory. Existing files, directories, and foreign links are
preserved and reported as conflicts (exit 1). A missing toolkit skills directory
is a successful no-op; it does not remove existing links. Invalid arguments exit
2. The helper does not search parent directories or perform global installation.

The native executables target the build machine's OS and architecture. Package
archives include these executables and must be built on a compatible machine;
they are not cross-platform distributions. Archives do not include build source
and cannot be rebuilt after installation. The standalone validators bundle their
YAML parser. `check-skill` additionally calls external linters (`cspell`,
`markdownlint-cli2`, and `promptlint`), which the consuming project must provide;
Promptfoo is optional.

The root `package.json` allowlist includes skill resources, citation metadata,
and the compiled root helpers. Evaluation fixtures and root contributor tooling
are excluded. This allowlist does not filter Git-based Skills CLI installs.
The package remains `private` to prevent accidental npm publication.

Contributor hook installation and the vendored evaluation-runner bootstrap are
separate: run `bun run setup` explicitly when developing this repository. They
are not part of dependency preparation.

## Documentation

> If your project is small and simple enough, documentation can be added here. For larger projects, provide a link to where the documentation lives.

## Tests

> Describe and show how to run the tests with code examples.

## Contributions

Contributions to [Agent Skills Toolkit] are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

Copyright (c) [2026] Atlassian US., Inc.
Apache 2.0 licensed, see [LICENSE](LICENSE) file.

<br/>

> Pick one of the following:

[![With ❤️ from Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-cheers.png)](https://www.atlassian.com)

[![With ❤️ from Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-with-thanks.png)](https://www.atlassian.com)

[![With ❤️ from Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-with-thanks-light.png)](https://www.atlassian.com)

[![With ❤️ from Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-cheers-light.png)](https://www.atlassian.com)
