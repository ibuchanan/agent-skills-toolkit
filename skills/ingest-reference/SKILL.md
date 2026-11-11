---
name: ingest-reference
description: Manage the lifecycle of agent skill references. Use when adding external docs to a skill's references/ directory, formatting raw content into structured references, adding citation metadata, or auditing/pruning stale references.
---

# Ingest Reference

Manage the lifecycle of reference materials for agent skills: decision, ingestion, formatting, attribution, and maintenance.

## Use this skill for

- adding external documentation or specifications to a skill's `references/` directory
- converting raw text or web content into structured, agent-friendly markdown references
- adding or updating `CITATION.cff` files for provenance and attribution
- auditing a skill's references for staleness, bloat, or duplication
- pruning references that no longer improve skill decision quality

## Toolchain

- **Git Submodule**: Preferred for external repos to enable controlled versioning and easy `git submodule update --remote` flows.
- **Firecrawl**: Use `firecrawl scrape` for one-offs or `crawl` for site-wide ingestion.
- **Docling**: Preferred for PDF and Word document extraction to high-quality Markdown.
- **OKF (Open Knowledge Format)**: Use version `0.2.0` for per-document frontmatter.

## Workflow

1. **Decide Ingestion Method**.
   - **Controlled Inclusion**: Use **Git Submodules** for external repositories. SHA-pinning ensures deterministic environments.
   - **Dynamic Scrape**: Use **Firecrawl** for web docs. Leverages `onlyMainContent` to achieve up to **93% token reduction** vs raw HTML. Validate URLs against authoritative domains (e.g., `*.atlassian.com`, `*.github.io`).
   - **High-Fidelity Extraction**: Use **Docling** for PDF/Word documents. Preserves semantic structures (tables, formulas, reading order) to minimize hallucinations.
2. **Structure with OKF Frontmatter**.
   - Wrap every ingested `.md` file in OKF `0.2.0` frontmatter immediately after extraction.
   - **OKF Template (v0.2.0)**:

     ```yaml
     ---
     okf_version: '0.2.0'
     type: [e.g., Web Scrape, PDF Conversion, Git Submodule]
     title: "Canonical Title"
     description: "What this document provides."
     sources:
       - id: source-id
         resource: "https://example.com/source.md"
         title: "Original Title"
         last_modified: 'YYYY-MM-DD'
         author: "human:AAID or org:Name"
     generated:
       by: agent:rovo # or Tool/Version
       at: '2026-07-28T09:04:42Z'
     license: "Apache-2.0" # Optional: if different from root CITATION.cff
     ---
     ```

3. **Apply the 5/5000 Rule (Progressive Disclosure)**.
   - If a doc set exceeds **5 files** or **5,000 tokens**, create a `SUMMARY.md` (wrapped in OKF) to act as a context map.
   - List sub-documents in a table format: `| Source | Purpose | Loading Trigger |`.
   - This prevents "context rot" and ensures the agent loads detailed context only when intent-based triggers are met.
4. **Dual-Layer Attribution**.
   - **Global (CITATION.cff)**: Root-level provenance for authors, primary repositories, and top-level licenses.
   - **Document (OKF 0.2.0)**: Per-file extraction metadata (exact source, timestamp, specific author).
5. **Link with Intent-Based Triggers**.
   - In `SKILL.md`, add a "Reference load triggers" section.
   - Target the `SUMMARY.md` first for sets exceeding 5 files or 5,000 tokens to enable hierarchical exploration.
   - Trigger phrases must match user intent: "Read `references/api/SUMMARY.md` when the user asks for auth endpoint details."
6. **Maintain and Audit**.
   - Update submodule SHAs monthly or upon upstream release.
   - Conduct a 90-day provenance audit of OKF `timestamp` and CFF `date-released` to detect stale content.

## Reference Load Triggers

- Read `references/citation-file-format.md` when adding or updating root `CITATION.cff` metadata.
- Read `references/okf-0.2.0-spec.md` for the definitive Open Knowledge Format v0.2.0 specification.
- Read `references/agentskills/SUMMARY.md` when the user asks about the structure or management of references in agent skills.

## Guardrails

- **No Mystery Docs**: Every file in `references/` MUST have OKF frontmatter or be indexed in an OKF-wrapped `SUMMARY.md`.
- **Semantic Chunking**: Do not split documents at arbitrary token boundaries. Extraction tools should preserve logical section/paragraph boundaries.
- **Provenance Parity**: Ensure root `CITATION.cff` and document OKF metadata remain in sync regarding sources and authors.
- **Validation**: Validate that extracted tables and formulas (LaTeX) maintain structural integrity before finalizing ingestion.
