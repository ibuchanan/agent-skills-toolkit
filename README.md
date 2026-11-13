# Agent Skills Toolkit

<!-- cspell:words bunx ibuchanan -->

[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

Reusable Agent Skills and command-line helpers for developing other skills:
agree on behavior, gather evidence, write instructions, sharpen triggers,
author evaluations, and maintain attribution.

Use this toolkit when you maintain skills and want a specification-driven
workflow with traceable references and behavioral checks. It is not an agent
runtime, and installing it does not make model behavior deterministic.
The package is private and versioned `0.0.0`; install skills from Git rather
than relying on an npm release.

## Install and try a skill

From the project where you use your agent, list the available skills with the
[Skills CLI](https://github.com/vercel-labs/skills). This path requires Node.js
and npm, but not a toolkit checkout or contributor setup:

```sh
npx skills add ibuchanan/agent-skills-toolkit --list
npx skills add ibuchanan/agent-skills-toolkit --skill describe-skill --agent claude-code --yes
```

Change `--agent` for your supported agent. Use `--skill '*'` to install the full
collection, or add `--global` for a user-wide installation. Bun users can replace
`npx skills` with `bunx skills`. The CLI installs skill directories and their
supporting files directly from Git; it does not install external tools needed
by individual skills.

In your agent, ask:

> Use describe-skill to review the description of my existing skill. Identify
> incorrect activation cases and propose a tighter description. Do not edit
> until I approve the exact string.

Supply the target `SKILL.md`, its specification if available, and concrete
requests where it activated incorrectly. Expect a diagnosis and one to three
candidate descriptions, not an unapproved edit. See the
[over-triggering how-to](docs/how-to/repair-over-triggering.md) for verification.

## Choose the right skill

| Goal                                                | Skill                                                        |
| --------------------------------------------------- | ------------------------------------------------------------ |
| Define or revise intended behavior                  | [`grill-this-skill`](skills/grill-this-skill/SKILL.md)       |
| Find and assess authoritative sources               | [`research-references`](skills/research-references/SKILL.md) |
| Capture and maintain supporting knowledge           | [`ingest-reference`](skills/ingest-reference/SKILL.md)       |
| Improve an existing skill's instructions            | [`develop-agent-skill`](skills/develop-agent-skill/SKILL.md) |
| Repair missed or incorrect activation               | [`describe-skill`](skills/describe-skill/SKILL.md)           |
| Turn an approved evaluation plan into tests         | [`develop-skill-evals`](skills/develop-skill-evals/SKILL.md) |
| Attribute existing reference material               | [`write-citations`](skills/write-citations/SKILL.md)         |
| Scaffold, validate, import, or install local skills | [`manage-skills`](skills/manage-skills/SKILL.md)             |
| Design or review an agent-facing tool interface     | [`axi`](skills/axi/SKILL.md)                                 |
| Choose a model and fallback for a bounded task      | [`select-llm`](skills/select-llm/SKILL.md)                   |

## Optional: install the helper commands

For a consuming project that also needs scaffolding and validation helpers,
add the toolkit as a trusted Git development dependency with Bun 1.4 or newer:

```sh
bun add --dev --trust github:ibuchanan/agent-skills-toolkit
./node_modules/.bin/validate-skill path/to/existing-skill
```

Allow the trusted package's lifecycle script: `prepare` compiles eight native
helpers and links package-local skills under that checkout's `.agents/skills/`.
Helpers target the build machine's OS and architecture. A passing validation checks
frontmatter, not behavioral correctness. Built archives are platform-specific
and do not include helper build source.

See the [CLI reference](docs/reference/cli-tools.md) for all commands and limits.
Use `link-skills` to expose toolkit, package, or local skills to your agent.
Use the [local installation how-to](docs/how-to/install-local-skill.md) to put
one specific skill into another project. `check-skill` can run live Promptfoo
evaluations, requiring credentials and incurring provider costs; it is not an
offline-only validation command.

## Documentation and development

- **Learn by doing:** [Build a change-note skill](docs/tutorials/build-an-agent-skill.md).
  The tutorial's live-agent walkthrough is not yet verified.
- **Understand the design:** [Skills as engineered, maintained knowledge](docs/explanation/agent-skill-development.md).
- **Maintain references:** [Refresh a stale reference](docs/how-to/refresh-stale-reference.md).
- **Contribute:** [Development setup and inner loop](DEVELOPMENT.md),
  [contribution process](CONTRIBUTING.md), and [code of conduct](CODE_OF_CONDUCT.md).
- **Browse everything:** [Documentation index](docs/README.md).

Report bugs or propose larger changes through
[GitHub issues](https://github.com/ibuchanan/agent-skills-toolkit/issues).

## License

Copyright (c) 2026 Atlassian US., Inc. Licensed under [Apache 2.0](LICENSE).
Vendored material retains its own license and attribution.
