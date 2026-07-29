---
okf_version: '0.2.0'
type: Git Submodule
title: "Open Knowledge Format v0.2 reference map"
description: "Progressive-disclosure map for the vendored Open Knowledge Format v0.2 specification."
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

## Open Knowledge Format v0.2 reference map

These concise references summarize the vendored OKF v0.2 specification at revision `3fcbb9f828c2f23d109c855ee403c3a4c81f3a96`. Use them as a context map; consult `vendor/knowledge-catalog/okf/SPEC.md` for all normative detail.

| Source | Purpose | Loading trigger |
| --- | --- | --- |
| [bundle-and-concepts.md](bundle-and-concepts.md) | Terminology, directory structure, reserved filenames, concept frontmatter, and body conventions. | Creating or reviewing an OKF bundle or concept document. |
| [provenance-and-navigation.md](provenance-and-navigation.md) | Sources, trust and lifecycle signals, paths, links, actors, indexes, and logs. | Recording provenance or verification, organizing navigation, or resolving concept paths. |
| [attested-computations.md](attested-computations.md) | Attested Computation contracts, conformance, versioning, and v0.1 migration. | Defining a sanctioned computation or implementing an OKF consumer. |

## Fast rules

- A bundle is a hierarchy of Markdown documents; every non-reserved `.md` file is a concept.
- A concept has frontmatter and a Markdown body, and its `type` field is required.
- Use frontmatter to record provenance, trust, lifecycle, and computation contracts; use Markdown links for relationships.
- Consumers must accept unknown optional metadata and broken links rather than reject the bundle.
