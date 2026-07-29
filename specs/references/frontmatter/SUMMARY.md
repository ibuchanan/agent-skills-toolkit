---
okf_version: '0.2.0'
type: Mixed Sources
title: "Shared frontmatter test authority map"
description: "Traceability map from shared frontmatter parser tests to the Agent Skills, Open Knowledge Format, and YAML specifications."
sources:
  - id: agentskills-specification
    resource: "https://github.com/agentskills/agentskills/blob/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs/specification.mdx"
    title: "Agent Skills Specification"
  - id: open-knowledge-format-spec
    resource: "https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/3fcbb9f828c2f23d109c855ee403c3a4c81f3a96/okf/SPEC.md"
    title: "Open Knowledge Format (OKF) Version 0.2"
    author: "org:GoogleCloudPlatform"
  - id: yaml-specification-1-2-2
    resource: "https://yaml.org/spec/1.2.2/"
    title: "YAML Ain’t Markup Language (YAML™) revision 1.2.2"
    last_modified: '2021-10-01'
    author: "org:YAML Language Development Team"
  - id: jekyll-front-matter
    resource: "https://jekyllrb.com/docs/front-matter/"
    title: "Front Matter | Jekyll"
    author: "org:Jekyll"
generated:
  by: agent:rovo
  at: '2026-07-29T16:24:34Z'
---

<!-- markdownlint-disable MD013 -->

## Shared frontmatter test authority map

This collection defines the evidence boundary for `test/root/scripts/shared/frontmatter-contract.ts`. It separates YAML-language validity, the Jekyll-style frontmatter convention, and format-specific metadata validation, so shared tests stay portable between Agent Skills and OKF.

| Source | Purpose | Loading trigger |
| --- | --- | --- |
| [shared-parser-contract.md](shared-parser-contract.md) | Maps every shared skipped frontmatter behavior to its authority and defines the shared-versus-format-specific boundary. | Turning a shared frontmatter placeholder into a real red test or changing its expected behavior. |

## Boundary

The shared parser contract owns frontmatter delimiters, YAML parsing, and the requirement that the parsed root is a mapping suitable for metadata keys. Agent Skills- and OKF-specific suites own required fields and format-specific constraints.
