---
okf_version: '0.2.0'
type: Git Submodule
title: "OKF v0.2 bundles and concept documents"
description: "Summary of Open Knowledge Format terminology, bundle layout, reserved filenames, and concept-document structure."
sources:
  - id: open-knowledge-format-spec
    resource: "https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/3fcbb9f828c2f23d109c855ee403c3a4c81f3a96/okf/SPEC.md"
    title: "Open Knowledge Format (OKF) Version 0.2"
    author: "org:GoogleCloudPlatform"
generated:
  by: agent:rovo
  at: '2026-07-29T16:02:13Z'
license: "Apache-2.0"
---

<!-- markdownlint-disable MD013 -->

## Bundles and concepts

An OKF knowledge bundle is a self-contained, hierarchical collection of knowledge documents. Each concept is one Markdown document; its concept ID is the file path within the bundle without the `.md` suffix.

A bundle may be distributed in a git repository, an archive, or a subdirectory of a larger repository. At any level, `index.md` is reserved for a directory listing and `log.md` for update history; neither name may be used by a concept. Every other `.md` file is a concept document.

### Concept structure

Every concept is UTF-8 Markdown with a YAML frontmatter block delimited by `---` at the start of the file, followed by a free-form Markdown body. `type` is required. Common optional metadata includes `title`, `description`, `resource`, and `tags`; the format also defines optional provenance, trust, lifecycle, and computation families.

Use the body to explain the concept in prose, tables, examples, and links. Conventional headings such as `# Schema`, `# Joins`, `# Trigger`, `# Steps`, and `# Computation` give consumers useful structure but do not constrain the domain model.

A concept may be bound to a tangible resource, such as a table or API, or describe an abstract idea such as a metric or business process.
