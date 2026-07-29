---
okf_version: '0.2.0'
type: Git Submodule
title: "CITATION.cff 1.2.0 validation"
description: "Summary of CFF naming and schema requirements plus the vendor-documented cffconvert validation command."
sources:
  - id: citation-file-format-schema
    resource: "https://github.com/citation-file-format/citation-file-format/blob/0c5b4aa07071490eaf261775ce96ccdd13a6e2d5/schema-guide.md"
    title: "Guide to Citation File Format schema version 1.2.0"
    author: "org:Citation File Format Contributors"
  - id: citation-file-format-readme
    resource: "https://github.com/citation-file-format/citation-file-format/blob/0c5b4aa07071490eaf261775ce96ccdd13a6e2d5/README.md"
    title: "Citation File Format README"
    author: "org:Citation File Format Contributors"
generated:
  by: agent:rovo
  at: '2026-07-29T15:54:13Z'
license: "CC-BY-4.0"
---

<!-- markdownlint-disable MD013 -->

## CFF validation

Before release, confirm all of the following:

1. The root file is named exactly `CITATION.cff`.
2. The document is valid YAML 1.2.
3. Its `cff-version` and fields conform to the CFF schema being targeted.
4. Required root fields are present and every nested identifier, person/entity, and reference record meets its applicable constraints.

The vendored README documents `cffconvert` as a command-line validator:

```shell
cffconvert --validate
```

Run it from the directory containing `CITATION.cff`. If validation reports a long traceback, locate the `jsonschema.exceptions.ValidationError` message to identify the failing constraint.
