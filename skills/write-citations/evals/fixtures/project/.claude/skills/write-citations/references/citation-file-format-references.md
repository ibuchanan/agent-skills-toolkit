---
okf_version: '0.2.0'
type: Git Submodule
title: "CITATION.cff references and citation redirection"
description: "Summary of CFF related-work references and preferred-citation metadata for credit redirection."
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

## References and citation redirection

### Related work

Use `references` as a bibliography for work on which the software or dataset builds, including dependencies, datasets, and research outputs. Each list entry is a reference object. Its required `type` selects the work category; include relevant bibliographic fields such as `authors`, `title`, `year`, `doi`, `url`, `version`, and publication-specific metadata.

```yaml
references:
  - authors:
      - family-names: Example
        given-names: Avery
    title: "Foundational Research Software"
    type: software
    version: 1.0
```

CFF defines many reference types, including `article`, `book`, `conference-paper`, `dataset`-related types, `software`, `software-code`, `software-container`, `report`, `thesis`, `website`, and `generic`. Select the narrowest type that accurately represents the cited work.

### Preferred citation

Use `preferred-citation` when users should cite another work—commonly a paper describing the software—instead of the root software or dataset record. The root metadata must still describe the software or dataset itself. `preferred-citation` is one reference object, not a list; ensure its required `type` and other bibliographic fields are sufficient to identify the target work.
