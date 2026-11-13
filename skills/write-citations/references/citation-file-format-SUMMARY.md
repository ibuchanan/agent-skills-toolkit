---
okf_version: '0.2.0'
type: Git Submodule
title: "Citation File Format 1.2.0 reference map"
description: "Progressive-disclosure map for authoring and validating CITATION.cff files against the vendored CFF 1.2.0 schema guide."
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

## Citation File Format 1.2.0 reference map

These concise references summarize the vendored Citation File Format (CFF) schema guide at revision `0c5b4aa07071490eaf261775ce96ccdd13a6e2d5`. They describe CFF schema version 1.2.0; the pinned upstream URL above records provenance. For fields not covered here, report the limitation or consult that source only when source access is available; do not assume the authoring repository's vendored guide is installed.

| Source | Purpose | Loading trigger |
| --- | --- | --- |
| [authoring.md](citation-file-format-authoring.md) | Required root fields, a minimal template, common optional metadata, and YAML rules. | Creating a new `CITATION.cff` or reviewing its root-level metadata. |
| [people-and-identifiers.md](citation-file-format-people-and-identifiers.md) | Person/entity authors and contact records, ORCIDs, and identifier entries. | Adding authors, organizations, contacts, DOI/URL/SWH metadata, or repository links. |
| [references.md](citation-file-format-references.md) | Dependency/related-work citations and citation redirection. | Adding `references` or `preferred-citation`. |
| [validation.md](citation-file-format-validation.md) | File naming, schema/YAML validity, and the documented command-line validator. | Checking or troubleshooting a `CITATION.cff` file. |

## Fast rules

- Name the root file exactly `CITATION.cff` and write valid YAML 1.2.
- Include `authors`, `cff-version`, `message`, and `title`; use `cff-version: 1.2.0` for this vendored schema.
- Keep metadata about the software or dataset at the root even when `preferred-citation` directs users to cite another work.
- Validate the completed file before release.
