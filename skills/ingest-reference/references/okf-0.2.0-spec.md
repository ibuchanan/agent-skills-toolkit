---
okf_version: '0.2.0'
type: Specification
title: "Open Knowledge Format (OKF) v0.2.0 Specification"
description: "The definitive frontmatter standard for agent skill references, emphasizing provenance, source hierarchy, and generation metadata."
sources:
  - id: okf-producer-v2
    resource: "https://github.com/ibuchanan/explore-forge-confluence-okf-producer/blob/main/specs/okf-producer-v2.md"
    title: "OKF Producer v2 Specification"
    last_modified: '2026-07-26'
    author: "human:ibuchanan"
generated:
  by: agent:rovo
  at: '2026-07-28T09:04:42Z'
---

# OKF v0.2.0 Specification

The Open Knowledge Format (OKF) is a metadata standard for Markdown documents intended for AI agent consumption. Version 0.2.0 introduces a structured `sources` array and `generated` block to replace legacy flat fields.

## Frontmatter Fields

### 1. Versioning

- `okf_version`: Must be `'0.2.0'`.

### 2. Identity

- `type`: High-level classification (e.g., `Specification`, `Web Scrape`, `PDF Conversion`, `Git Submodule`).
- `title`: The canonical title of the knowledge piece.
- `description`: A 1-2 sentence summary for agentic "just-in-time" loading decisions.

### 3. Provenance (`sources`)

An array of objects representing the original material.

- `id`: A unique local key for the source (e.g., `source-doc`).
- `resource`: The direct URL, URI, or commit SHA.
- `title`: The title of the source material.
- `last_modified`: ISO 8601 date (`YYYY-MM-DD`) when the source was last updated.
- `author`: The original author (e.g., `human:AAID`, `org:Anthropic`, or `agent:rovo`).

### 4. Generation (`generated`)

Metadata about the extraction process.

- `by`: The tool, agent, or process used (e.g., `docling/1.2.0`, `firecrawl/1.0.0`, `agent:rovo`).
- `at`: ISO 8601 timestamp of extraction.

### 5. Verification (`verified`) - Optional

Record of deterministic checks passed.

- `by`: The verification process (e.g., `process:checksum-match`).
- `at`: ISO 8601 timestamp of verification.

## Full Template

```yaml
---
okf_version: '0.2.0'
type: [Type]
title: "Title"
description: "Description"
sources:
  - id: source-1
    resource: "URL"
    title: "Source Title"
    last_modified: 'YYYY-MM-DD'
    author: "Author"
generated:
  by: Tool/Version
  at: 'YYYY-MM-DDTHH:MM:SSZ'
---
```
