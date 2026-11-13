# Changelog

All notable changes to this project are documented here.

## [0.1.0] - 2026-11-13

### 🚀 Features

- _(skills)_ Bootstrap skill development workspace
- Add agent skills, specs, and build tooling
- _(tooling)_ Implement init-skill-eval script with full test suite
- _(tooling)_ Implement validate-skill script with comprehensive test suite
- _(describe-skill)_ Implement skill description diagnosis and tightening
- _(scripts)_ Add skill evaluation initialization and validation
- _(describe-skill)_ Add Promptfoo eval suite
- _(scripts)_ Add validate-okf library and CLI
- _(scripts)_ Add find-skills script and tests
- _(scripts)_ Add validate-cff library, CLI, and tests
- _(scripts)_ Add check-skill CLI to validate skills
- _(skills)_ Add write-citations skill with spec, references, and eval suite
- _(skills)_ Add research-references skill and eval suite
- _(skills)_ Add AXI interface design skill
- _(toolkit)_ Package helpers and link skills
- _(skills)_ Import reference ingestion skill
- _(skills)_ Import skill management workflow
- _(skills)_ Import LLM selection skill
- _(skills)_ Import agent skill development workflow
- _(skills)_ Add capture-microskill authoring skill
- _(cli)_ [**breaking**] Link package and local skills
- _(skills)_ [**breaking**] Implement develop-skill spec
- _(init-skill)_ Scaffold skills from specifications

### 🐛 Bug Fixes

- Fix TypeScript strict mode errors in validate-skill and yaml-parser
- _(evals)_ Resolve promptfoo paths relative to eval directory
- _(validation)_ Enforce frontmatter character rules
- _(skills)_ Make skill installation portable
- _(lint)_ Correct reference markup and vocabulary
- _(build)_ Isolate temporary artifacts in scratch
- _(changelog)_ Keep generated changelog reproducible
- _(capture)_ Prioritize microskill execution
- _(skills)_ Require self-contained skill packages
- _(skills)_ Repair package self-containment

### 💼 Other

- Configure ESM output and add script execution permissions
- Replace tsc build with bun build --compile for self-contained binaries
- Migrate toolchain from npm/vitest to Bun
- _(tooling)_ Upgrade Bun and Biome tooling

### 🚜 Refactor

- Replace dynamic fs imports and drop dead code in scripts

### 📚 Documentation

- Replace zx with Bun Shell in technical spec
- Add develop-skill-evals specification
- _(skills)_ Tighten grill-this-skill trigger description
- Add describe-skill spec and local skill symlinks
- _(specs)_ Update grill-this-skill specification
- Fix Markdown lint violations
- _(axi)_ Allow valid terms in spelling checks
- _(microskills)_ Specify capture and ground references
- Add skill development documentation

### 🎨 Styling

- _(skills)_ Normalize skill and evaluation formatting

### 🧪 Testing

- _(frontmatter)_ Add shared parser contract
- _(scripts)_ Add bootstrap script contracts
- _(init)_ Specify safe skill scaffold
- _(scripts)_ Specify check-skill behavior
- Scope tests to repository sources
- _(scripts)_ Add OKF validation test behaviors

### ⚙️ Miscellaneous Tasks

- _(lint)_ Configure documentation checks
- _(vendor)_ Add agent-skills-eval submodule
- _(.agents)_ Add symbolic link to develop-skill-evals
- _(spellcheck)_ Scope dictionaries by skill
- _(cspell)_ Add OKF and actor example names to dictionary
- _(tests)_ Bootstrap agent-skills-eval submodule and exclude vendor tests
- _(git)_ Stop ignoring root npm lockfile
- _(spell)_ Apply microskills dictionary
- _(skills)_ Track active skill shortcuts
- _(checks)_ Fix spelling scope and formatting
- _(lint)_ Fix repository check configuration
