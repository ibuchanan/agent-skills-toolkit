---
okf_version: '0.2.0'
type: Mixed Sources
title: "Shared YAML frontmatter parser contract"
description: "Authoritative traceability for the shared frontmatter parser tests used by Agent Skills and OKF validation suites."
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

## Shared parser contract

Both formats require YAML frontmatter followed by Markdown content. OKF makes the envelope explicit: the opening delimiter must be `---` on a line by itself at the beginning of the file and the block must end with a matching delimiter. Jekyll documents the same triple-dash convention as established ecosystem practice, including an empty frontmatter block. YAML 1.2.2 supplies the language grammar; it permits scalar, sequence, and mapping roots, so mapping-only acceptance is a format-level metadata rule rather than a YAML or Jekyll rule.

### Traceability for shared tests

| Shared behavior | Authority | Contract to test |
| --- | --- | --- |
| `parses valid frontmatter` | Agent Skills requires YAML frontmatter; OKF requires a YAML frontmatter block; Jekyll documents the de facto triple-dash convention; YAML 1.2.2 defines valid YAML documents. | Accept a delimited block containing valid YAML whose root is a mapping. |
| `rejects missing frontmatter` | Agent Skills requires frontmatter; OKF requires the frontmatter block at the file start; Jekyll treats front matter as a leading triple-dash-delimited block. | Reject a Markdown document that does not start with the opening delimiter. |
| `rejects unclosed frontmatter` | OKF requires a closing `---` delimiter on its own line. | Reject a document whose opening delimiter has no closing delimiter. |
| `rejects invalid yaml` | Both formats require YAML; YAML 1.2.2 defines the document syntax. | Reject a delimited block that the YAML parser cannot parse. |
| `rejects non-mapping frontmatter` | Agent Skills requires named root fields such as `name` and `description`; OKF requires the root `type` key. YAML permits scalar and sequence roots. | Parse YAML first, then reject a root that is not a key/value mapping because it cannot carry either format’s required metadata keys. |

### Shared seam and format-specific seams

Keep this shared helper limited to envelope and root-shape behavior. Do not place format-specific validation here:

- Agent Skills-specific tests own `name`, `description`, optional-field constraints, and rejection of unexpected fields.
- OKF-specific tests own the required `type` key and acceptance of unknown producer-defined keys.
- YAML-specific tests should not assert that a scalar or sequence is syntactically invalid; those are valid YAML roots and are rejected only by the metadata-envelope contract.
- Jekyll compatibility tests should permit an empty delimiter block when supporting the broader convention. That case is not valid for Agent Skills or OKF once their required metadata semantics are applied.

When implementing real tests, inject the public parser seam into the shared contract and use separate suites to assert each format’s semantic validation after parsing succeeds.
