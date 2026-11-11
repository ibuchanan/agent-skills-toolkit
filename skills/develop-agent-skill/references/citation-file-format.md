# Citation File Format (`CITATION.cff`)

The [Citation File Format](https://citation-file-format.github.io/) defines a human- and machine-readable way to describe how a project should be cited.
A `CITATION.cff` file lives at the root of a repository or package and uses YAML.
Platforms and tools can use it to present citation information directly to users or convert it into other formats.

## Why it matters

A `CITATION.cff` file helps a project:

- tell users how to cite the work correctly
- expose structured metadata for software and datasets
- interoperate with tools such as GitHub, Zenodo, and Zotero
- record upstream works in `references` when a local package derives from or vendors external material

For this repository, `CITATION.cff` is especially useful for skill packages that:

- are published or reused independently
- vendor or adapt upstream reference material
- should preserve provenance for externally sourced content

## Minimum practical fields

The Citation File Format supports many fields, but most local skill packages only need a small subset.
A practical minimal file usually includes:

- `cff-version`: the CFF schema version, typically `1.2.0`
- `title`: the name of the software, package, or reference bundle
- `message`: a short citation instruction for users
- `type`: usually `software` or `dataset`
- `authors`: one or more authors or organizations
- one or both of:
  - `repository-code`
  - `url`
- optionally:
  - `license`
  - `abstract`
  - `keywords`
  - `references`

## Common patterns in this repo

Use `type: software` when the package is the skill itself.
Use `type: dataset` when the file primarily describes vendored reference materials or bundled documentation.

Examples already in this repo follow these patterns:

- a skill can cite itself as software
- a reference bundle can cite the upstream project it was copied from
- `references` can point at the authoritative website or source repository

## Recommended authoring guidance

When adding or updating `CITATION.cff` for a skill package:

1. Set `title` to the package or bundle name users would recognize.
2. Add a `message` that tells readers what to cite.
3. Choose the most accurate `type`:
   - `software` for the skill package itself
   - `dataset` for vendored reference material
4. Include the canonical repository or project URL when available.
5. Add `references` entries for upstream projects, websites, or software that the package is based on.
6. Prefer accurate provenance over exhaustive metadata.

## Example: skill package

```yaml
cff-version: 1.2.0
message: "If you use this skill, please cite it as below."
title: "Example Skill"
type: software
license: Apache-2.0
authors:
  - name: "Example Maintainers"
repository-code: "https://github.com/example/skills"
url: "https://github.com/example/skills"
abstract: >-
  A reusable agent skill for a specific developer workflow.
keywords:
  - agent-skills
  - automation
  - developer-tools
references:
  - type: website
    title: "Upstream Specification"
    url: "https://example.com/spec"
    notes: >-
      The authoritative specification that this skill implements or relies on.
```

## Example: vendored reference materials

```yaml
cff-version: 1.2.0
message: "If you use the vendored reference materials in this directory, please cite the upstream project."
title: "Reference materials for Example Skill"
type: dataset
authors:
  - name: "Example Organization"
repository-code: "https://github.com/example/upstream-project"
url: "https://example.com"
license: "Apache-2.0 AND CC-BY-4.0"
references:
  - type: software
    title: "Upstream Project"
    authors:
      - name: "Example Organization"
    repository-code: "https://github.com/example/upstream-project"
    url: "https://example.com"
```

## Validation and tooling

The Citation File Format ecosystem includes tools for:

- creating starter files
- validating or checking content
- converting CFF into formats such as BibTeX, RIS, and CodeMeta

Useful entry points:

- CFF project site: <https://citation-file-format.github.io/>
- CFF initializer: <https://citation-file-format.github.io/cff-initializer-javascript/>
- converter: <https://github.com/citation-file-format/cff-converter-python>

## Practical advice for `manage-skills`

When a user asks to create, import, or package a skill, check whether a `CITATION.cff` file should also be added or preserved.
This is especially important when:

- importing a skill from another source
- copying reference materials into `references/`
- adapting upstream documentation or examples
- preserving attribution and citation metadata from vendored content

If an upstream project already provides `CITATION.cff`, prefer adapting it rather than inventing new citation metadata from scratch.
