---
okf_version: '0.2.0'
type: Git Submodule
title: "CITATION.cff 1.2.0 authoring essentials"
description: "Summary of required CFF root fields, common optional software or dataset metadata, and YAML authoring rules."
sources:
  - id: citation-file-format-schema
    resource: "https://github.com/citation-file-format/citation-file-format/blob/0c5b4aa07071490eaf261775ce96ccdd13a6e2d5/schema-guide.md"
    title: "Guide to Citation File Format schema version 1.2.0"
    author: "org:Citation File Format Contributors"
generated:
  by: agent:rovo
  at: '2026-07-29T15:54:13Z'
license: "CC-BY-4.0"
---

<!-- markdownlint-disable MD013 -->

## CFF authoring essentials

A valid CFF 1.2.0 file is named exactly `CITATION.cff`, is valid YAML 1.2, and conforms to the CFF 1.2.0 schema.

### Required root fields

| Key | Meaning |
| --- | --- |
| `authors` | Non-empty list of people and/or organizations credited for the software or dataset. |
| `cff-version` | CFF schema version. Use `1.2.0` for the vendored schema summarized here. |
| `message` | Human-facing instruction explaining how to cite the work. |
| `title` | Name of the software or dataset. |

Minimal CFF 1.2.0 file:

```yaml
authors:
  - family-names: Example
    given-names: Avery
cff-version: 1.2.0
message: "If you use this software, please cite it using these metadata."
title: "Example Software"
```

### Common optional root fields

Use `abstract`, `version`, `date-released`, `keywords`, `license`, `repository-code`, `repository-artifact`, `repository`, `url`, `doi`, `identifiers`, and `type` when they accurately describe the work. Root `type` is limited to `software` or `dataset`.

### YAML guidance

Quote strings with double quotes when they contain whitespace or YAML-significant characters, when a numeric-looking value must remain text, or when the text is a YAML boolean-like value such as `true`, `false`, `yes`, or `no`. Quote dates and identifier values where this avoids YAML type coercion.
