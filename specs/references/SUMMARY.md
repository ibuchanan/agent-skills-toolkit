---
okf_version: '0.2.0'
type: Git Submodule
title: "Vendored specifications reference map"
description: "Progressive-disclosure index for concise local summaries of vendored Agent Skills, Citation File Format, Knowledge Catalog, and Open Knowledge Format sources."
sources:
  - id: agentskills-specification
    resource: "https://github.com/agentskills/agentskills/blob/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs/specification.mdx"
    title: "Agent Skills Specification"
  - id: citation-file-format-schema
    resource: "https://github.com/citation-file-format/citation-file-format/blob/0c5b4aa07071490eaf261775ce96ccdd13a6e2d5/schema-guide.md"
    title: "Guide to Citation File Format schema version 1.2.0"
  - id: knowledge-catalog-readme
    resource: "https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/3fcbb9f828c2f23d109c855ee403c3a4c81f3a96/README.md"
    title: "Knowledge Catalog README"
  - id: open-knowledge-format-spec
    resource: "https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/3fcbb9f828c2f23d109c855ee403c3a4c81f3a96/okf/SPEC.md"
    title: "Open Knowledge Format (OKF) Version 0.2"
generated:
  by: agent:rovo
  at: '2026-07-29T16:02:13Z'
---

<!-- markdownlint-disable MD013 -->

## Vendored specifications reference map

Use this directory for the normative requirements summarized from vendored Agent Skills, Citation File Format, Knowledge Catalog, and Open Knowledge Format sources. The first two are pinned at revisions `38a2ff82958afee88dadf4831509e6f7e9d8ef4e` and `0c5b4aa07071490eaf261775ce96ccdd13a6e2d5`; Knowledge Catalog and its OKF specification are pinned at `3fcbb9f828c2f23d109c855ee403c3a4c81f3a96`. These are summaries, not replacements for the upstream sources under `vendor/`.

| Source | Purpose | Loading trigger |
| --- | --- | --- |
| [agent-skills/SUMMARY.md](agent-skills/SUMMARY.md) | Agent Skills layout, frontmatter, resources, progressive disclosure, and validation. | Creating, reviewing, or validating an Agent Skills `SKILL.md`. |
| [citation-file-format/SUMMARY.md](citation-file-format/SUMMARY.md) | CFF 1.2.0 authoring, people and identifiers, references, and validation. | Creating, reviewing, or validating a root `CITATION.cff` file. |
| [knowledge-catalog/SUMMARY.md](knowledge-catalog/SUMMARY.md) | Knowledge Catalog repository scope, components, license, and project status. | Understanding the vendored Knowledge Catalog project or locating its demonstrations. |
| [open-knowledge-format/SUMMARY.md](open-knowledge-format/SUMMARY.md) | OKF v0.2 bundle structure, concept metadata, provenance, navigation, computations, and conformance. | Creating, reviewing, or consuming an OKF knowledge bundle. |
