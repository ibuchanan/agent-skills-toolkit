---
okf_version: '0.2.0'
type: Git Submodule
title: "OKF v0.2 provenance, trust, and navigation"
description: "Summary of Open Knowledge Format provenance, verification, lifecycle, paths, links, actor names, indexes, and logs."
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

## Provenance, trust, and navigation

### Provenance and lifecycle

Use `sources` to record material from which a concept derives. Each source identifies the material and can include objective credibility signals such as author, usage count, and last-modified information; OKF records signals rather than assigning a trust verdict.

Use `generated` to record who or what created content and `verified` for confirmation events. Trust tiers derive from `verified`: unverified, machine-confirmed, and human-reviewed. Use `status` and `stale_after` to describe lifecycle state and when a concept should be rechecked.

Actor values use a shared convention: `<producer>/<version>` for agents/tools, `human:<id>` for people, and `process:<id>` for automated processes. The `human:` prefix is required for hand-authored or human-confirmed content because consumers use it when classifying trust.

### Links, paths, and discovery

Standard Markdown links express concept relationships; their surrounding prose carries the relationship type. Consumers must tolerate broken links because they can represent knowledge not yet written.

Path-valued fields accept absolute URLs, bundle-relative paths beginning with `/`, or ordinary relative paths. The `references/` directory is a convention for mirrored external materials, run instructions, or code; it is not required.

An `index.md` may list a directory's contents for progressive disclosure. It normally has no frontmatter, except that a bundle-root index may declare `okf_version`. A `log.md` may record newest-first, ISO 8601 date-grouped update entries at any hierarchy level.
