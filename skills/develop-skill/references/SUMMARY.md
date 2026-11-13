---
okf_version: "0.2.0"
type: Reference Map
title: "Develop Skill reference map and source assessment"
description: "Approved core references, loading triggers, provenance, legacy retention recommendations, and unresolved evidence gaps."
sources:
  - id: agentskills-specification
    resource: "https://agentskills.io/specification"
    title: "Agent Skills Specification"
    author: "org:Agent Skills contributors"
  - id: agentskills-best-practices
    resource: "https://agentskills.io/skill-creation/best-practices"
    title: "Best practices for skill creators"
    author: "org:Agent Skills contributors"
  - id: agentskills-using-scripts
    resource: "https://agentskills.io/skill-creation/using-scripts"
    title: "Using scripts in skills"
    author: "org:Agent Skills contributors"
  - id: agentskills-reviewed-revision
    resource: "https://github.com/agentskills/agentskills/tree/38a2ff82958afee88dadf4831509e6f7e9d8ef4e/docs"
    title: "Agent Skills documentation — reviewed snapshot"
generated:
  by: agent:rovo
  at: "2026-11-13"
---

# Develop Skill reference map

This set supports initial instruction authoring and evidence-driven revision,
not end-to-end skill lifecycle coordination. Load the smallest reference that
addresses the current implementation decision.

| Reference | Purpose | Load when |
| --- | --- | --- |
| [skill-format.md](skill-format.md) | Package contract, metadata, resource layout, and relative links. | Checking package structure, frontmatter, or resource links. |
| [authoring-practices.md](authoring-practices.md) | Grounded procedures, defaults, examples, calibrated control, and disclosure boundaries. | Authoring or revising instruction content and organization. |
| [script-design.md](script-design.md) | Helper selection, interface design, dependencies, and execution caveats. | Deciding whether a helper is justified or designing its interface. |

## Source assessment and provenance

Reviewed 13 November 2026 against local `specs/develop-skill.md`. That spec is
project authority for scope and safety, not an external research finding or a
file to bundle into an installed skill.

The three primary documents are first-party Agent Skills project documentation,
inspected in `vendor/agentskills/docs/` at commit
`38a2ff82958afee88dadf4831509e6f7e9d8ef4e` (9 July 2026). The corresponding
previously bundled documents matched byte-for-byte. Each summary records its
canonical URL and pinned upstream source.

- **Currency:** reproducible local snapshot; current live website contents and
  changes after this revision were not checked.
- **Relevance:** directly addresses format, instruction implementation, and helper
  design; no broad research was needed to support the approved scope.
- **Authority:** the specification establishes its own package contract; companion
  guides explain the project's authoring recommendations.
- **Accuracy:** summaries were checked against local primary documents. Guidance
  and examples are not independent empirical proof of improved task performance.
- **Purpose:** project documentation intended to help adoption and authoring, not
  a neutral comparative benchmark of every skill architecture or runtime.

These files are adapted summaries, not unchanged reproductions. Attribution:
Agent Skills contributors, documentation licensed
[CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/); local upstream license:
`vendor/agentskills/docs/LICENSE`. Local policy is labeled separately from source
recommendations. Source size heuristics do not establish universal line-count or
PromptLint score gates, and dependency examples do not authorize installation.

## Legacy collection: selection rationale

The approved implementation pass removed these legacy materials from this
skill's bundle and replaced their load triggers with the focused references above.
The repository-level vendor sources remain unchanged.

| Material | Rationale for exclusion from this skill's bundle |
| --- | --- |
| Architecture survey and Skill OS paper | Omit: broad framing adds no necessary, unique decision for the approved implementation scope. |
| Security-at-scale and SkillJect papers | Omit: useful threat context, but not necessary to encode the approved safety boundaries. This is a relevance decision, not a finding that the research is invalid. |
| SkillsBench paper | Omit: evaluation research belongs outside the focused implementation workflow. |
| `citation-file-format.md` | Omit: citation authoring is owned by `write-citations`. Preserve provenance without duplicating that workflow. |
| `eval-assertion-design.md` | Omit: assertion and provider repair exceed instruction-gap triage; the claimed internal run lacks a traceable artifact in the document. |
| Full bundled Agent Skills repository | Replace with focused references rather than carrying unrelated site assets, code, tests, and specialist guides into this package. |

Legacy papers were assessed for local relevance, not freshly authenticated at
publisher sites. Do not treat their bibliographic metadata or reported results
as newly verified by this review.

## Specialist boundaries and unresolved items

The local specialist specs establish handoffs: `grill-this-skill` for intended
behavior, `describe-skill` for activation repair, `research-references` for source
assessment, `ingest-reference` for acquisition and structuring, `write-citations`
for citation metadata, `develop-skill-evals` for approved evaluation artifacts,
and `manage-skills` or applicable helpers for mechanical management. Consult
available contracts when needed; do not bundle copies or assume these companions
are installed.

At review time, the spec's referenced `specs/promptlint.md` and a local
`skills/promptlint/SKILL.md` were absent. The optional static-analysis handoff
contract remains unresolved. Do not invent commands, require installation, or
make that missing contract block core authoring.

The approved implementation pass also aligned `SKILL.md` with the local spec.
Citation metadata and evaluation artifacts were not revised: `CITATION.cff`
still describes legacy bundled files, and legacy eval cases include assertion
repair behavior now outside this skill's scope. These need separate specialist
follow-ups. Static conformance checks do not verify behavioral correctness.
