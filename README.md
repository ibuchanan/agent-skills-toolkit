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

The root `package.json` includes a `files` allowlist for package archives:
skill instructions, references, assets, scripts, and citation metadata.
Evaluation fixtures, vendored repositories, and contributor tooling are excluded
from those archives. This allowlist does not filter Git-based CLI installs.
The package remains `private` to prevent accidental npm publication.

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
