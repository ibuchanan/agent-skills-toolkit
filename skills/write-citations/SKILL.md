---
name: write-citations
description: Create or update a CITATION.cff for a skill or repo from provenance-backed references under references/. Use when adding, updating, or maintaining citations, citable metadata, preferred citation, authors, DOI, or attribution.
---

# Write Citations

Create or update a `CITATION.cff` file for a skill or repo by reading the provenance-backed references already gathered under the skill's `references/` directory.

This skill is the author-side counterpart to `validate-cff`. It synthesizes existing sources into CFF 1.2.0 metadata; it does not discover new sources or check schema validity.

## Scope

### Trigger when the user wants to

- Create or update a `CITATION.cff`.
- Add citations, citable metadata, preferred citation, author metadata, DOI/Zenodo, or attribution for a skill or repo.

### Redirect instead of triggering when

- The user wants to validate an existing `CITATION.cff` → hand off to `validate-cff`.
- The user wants to find or download sources → hand off to `research-references`.
- The user wants to cite a paper or add a README bibliography → hand off to `research-references` or general writing help.
- The user wants to list references in a spec → hand off to spec-writing or `research-references`.

## Workflow

1. **Identify the target directory.**
   - Default to the skill root: the directory containing the nearest `SKILL.md` upward from the current working directory.
   - Only use a different directory if the user explicitly provides one.

2. **Gather inputs.**
   - Read the existing `CITATION.cff` in the target directory, if present.
   - Discover all `references/**/*.md` files under the target directory.
   - Parse each reference's OKF frontmatter for fields that map to CFF (title, author, date, license, DOI, URL, etc.).
   - Accept any explicit metadata the user provided (title, version, authors, license, DOI).

3. **Synthesize a CFF draft.**
   - Map reference fields to CFF 1.2.0 fields using the bundled CFF references.
   - Required fields: `cff-version: 1.2.0`, `message`, `title`, `authors`.
   - Authors must be either a person (`family-names` + `given-names`) or an entity (`name`).
   - Do not invent authors, titles, or identifiers not present in the references or explicit user input.

4. **Write or propose.**
   - If no `CITATION.cff` exists, write the file immediately and show the result.
   - If a `CITATION.cff` exists, explain the mapping and the diff, then confirm before writing.
   - Preserve fields that are already correct in the existing file.

5. **Report.**
   - Summarize which reference contributed which fields.
   - Mention any required fields that were not determined from the references or explicit input and were left empty or filled with a placeholder.

## Boundaries & safety

- Do not invent references or authors.
- Do not suggest authors from git history or GitHub metadata.
- Do not fetch or research new sources.
- Do not validate the file; rely on the CFF references and `validate-cff` for validation.
- Never overwrite an existing `CITATION.cff` without explaining the diff and confirming.
- Preserve personal identifiers (ORCID, email) only when they are already present in the references or explicitly provided.

## Reference load triggers

- Read `references/citation-file-format-SUMMARY.md` for a top-level CFF map and fast rules.
- Read `references/citation-file-format-authoring.md` when deciding root-level fields and the minimal template.
- Read `references/citation-file-format-people-and-identifiers.md` when mapping authors, entities, ORCIDs, or contacts.
- Read `references/citation-file-format-references.md` when handling `preferred-citation` or related-work citations.
- Read `references/citation-file-format-validation.md` when checking file naming or schema validity conventions.
- Read `references/validate-cff.ts` to understand the exact validation rules the output must satisfy.
- Read `references/CITATION.cff` for a working example.
