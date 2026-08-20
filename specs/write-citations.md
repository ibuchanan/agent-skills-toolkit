# Skill specification: write-citations

## Objective

Help a skill or repository author create or update a `CITATION.cff` file by aggregating provenance-backed references already gathered under the skill's `references/` directory. The skill produces a CFF 1.2.0 file that passes the repo's `validate-cff` rules.

## Audience

A skill/repo author who:

- Understands what `CITATION.cff` is and why it matters,
- Has already gathered reference documents (e.g., via `research-references`),
- Knows the references contain provenance,
- Does not necessarily know the exact CFF 1.2.0 field names or how source provenance maps to them.

## Style & tone

Decisive and prescriptive. The skill should "just do it" — propose concrete field values, write the file, and explain the mapping. It is collaborative only when the user must disambiguate (e.g., conflicting author metadata), not by default.

## Context

### Trigger & non-trigger contexts

**Trigger when** the user asks to:

- Create, update, or maintain a `CITATION.cff`.
- Add citations, citable metadata, preferred citation, author metadata, DOI/Zenodo, or attribution for a skill or repo.

**Do not trigger when** the user asks to:

- Validate an existing `CITATION.cff` → redirect to `validate-cff`.
- Find or download sources → redirect to `research-references`.
- Cite a paper or add a README bibliography → redirect to `research-references` or general writing help.
- List references in a spec → redirect to spec-writing or `research-references`.

### Boundaries & safety

- Do not invent references or authors not present in the gathered references or explicitly provided by the user.
- Do not suggest authors from git history or GitHub metadata at this time.
- Do not fetch or research new sources.
- Do not validate the file; rely on the CFF references and the `validate-cff` rules for correctness.
- Write a new `CITATION.cff` immediately when none exists.
- When a `CITATION.cff` already exists, explain the mapping and diff, then confirm before writing.
- Preserve fields that are already correct in an existing file.

## Inputs & outputs

### Inputs

- **Target directory:** defaults to the skill root (directory containing `SKILL.md`). Only override if the user explicitly specifies another directory.
- **Reference sources:** `references/**/*.md` inside the skill directory, parsed for OKF frontmatter.
- **Existing file:** `CITATION.cff` in the target directory, if present.
- **Explicit metadata:** any title, version, authors, license, DOI, etc., supplied by the user.

### Outputs

- A written `CITATION.cff` at the target directory root.
- A concise mapping summary showing which reference contributed which fields.
- For existing files, a diff or explanation of what changed and why.

## References

The skill relies on the files in `skills/write-citations/references/`:

- `citation-file-format-SUMMARY.md`
- `citation-file-format-authoring.md`
- `citation-file-format-people-and-identifiers.md`
- `citation-file-format-references.md`
- `citation-file-format-validation.md`
- `validate-cff.ts` (the rules the output must pass)
- `CITATION.cff` (a working example)

## Evaluation plan

1. **Create a new CITATION.cff**
   - Given a skill with valid references and no existing `CITATION.cff`, the skill writes a valid CFF 1.2.0 file at the skill root.
   - Check: `validate-cff` passes; file path is correct.

2. **Update an existing CITATION.cff**
   - Given an existing file with one outdated field and other correct fields, the skill explains the diff, preserves the correct fields, and writes after confirmation.
   - Check: diff shows only the intended change.

3. **Near-miss: paper citation or README bibliography**
   - The user asks about citing a paper or adding a bibliography.
   - Check: no `CITATION.cff` is written; response redirects appropriately.

4. **Missing references**
   - Given a skill with no `references/` and no explicit metadata.
   - Check: the skill does not invent authors or facts; it either asks for input or produces a minimal skeleton.

## Open decisions

None.
