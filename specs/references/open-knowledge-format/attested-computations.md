---
okf_version: '0.2.0'
type: Git Submodule
title: "OKF v0.2 attested computations and conformance"
description: "Summary of Attested Computation concepts, their execution contracts, consumer conformance, versioning, and v0.1 migration."
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

## Attested computations and conformance

An `Attested Computation` is a standalone concept that defines a sanctioned way to calculate a value. Other concepts link to it normally. This separates the computation's runtime, verification state, and attester from the metrics or reports that use it.

For this concept type, `runtime` is required. Optional contract fields include typed `parameters`, `computation` (a path to code), `executor` (run instructions plus expected receipt fields), and `attester` (deterministic, non-LLM code that inspects a receipt and returns a verdict). Put a short computation in one fenced block under `# Computation`, or set `computation` to an external path and omit that body fence.

The executor and attester resources are packaging-neutral: they may point to a skill, script, or container, while the OKF contract fixes the interface. OKF records a computation and its verification mechanism; it does not execute either.

### Consumer requirements and versioning

A conforming consumer must parse frontmatter for every non-reserved Markdown file, recognize required concept structure, and handle the specified provenance, trust, lifecycle, and computation fields. It must not reject a bundle solely for unknown types or additional metadata, missing optional fields or index files, or broken links.

OKF v0.2 uses `okf_version: "0.2"` only in a bundle-root `index.md` frontmatter block. Minor revisions add backward-compatible optional material; major revisions may change required names or reserved filenames. In v0.2, `generated.at` supersedes legacy `timestamp`, and frontmatter `sources` supersedes a legacy body `# Citations` list; consumers may fall back to their v0.1 forms when the newer fields are absent.
