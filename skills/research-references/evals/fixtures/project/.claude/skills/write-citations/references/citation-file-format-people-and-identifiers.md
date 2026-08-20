---
okf_version: '0.2.0'
type: Git Submodule
title: "CITATION.cff people and identifiers"
description: "Summary of CFF person/entity records, ORCIDs, contact data, and structured identifier entries."
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

## People and identifiers

### Authors and contacts

`authors` and optional `contact` are lists of person and entity records. Represent an individual with `family-names` and `given-names`; use a single `name` for an organization or group. Add optional disambiguating or contact metadata only when known, such as `orcid`, `affiliation`, `email`, `website`, address fields, or name particles and suffixes.

```yaml
authors:
  - family-names: Example
    given-names: Avery
    orcid: "https://orcid.org/0000-0000-0000-0000"
  - name: "Example Research Group"
contact:
  - family-names: Maintainer
    given-names: Morgan
```

An ORCID must use the `https://orcid.org/` URI form prescribed by the schema. Do not invent person-name parts: use the person or entity shape that reflects the available attribution information.

### Identifiers and links

Use a root `doi` for a DOI describing the work. Use `identifiers` for a list of structured identifiers; every entry has a required `type` and `value`, with an optional explanatory `description`. CFF 1.2.0 supports DOI, URL, Software Heritage (`swh`), and other identifier forms, each with its own value constraint.

Use `repository-code` for source code, `repository-artifact` for a released artifact, and `repository` when one repository URL represents the work generally. Use `url` for another relevant project URL.
