import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { validateOkf } from "../../src/scripts/lib/validate-okf.js";

let testDir: string;

function createTestBundleDir(name: string): string {
  return join(testDir, name);
}

async function writeConcept(
  bundleDir: string,
  relativePath: string,
  content: string,
): Promise<void> {
  const filePath = join(bundleDir, relativePath);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}

describe("validate-okf script", () => {
  beforeEach(async () => {
    testDir = join(
      tmpdir(),
      `validate-okf-test-${Date.now()}-${Math.random()}`,
    );
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe("bundle structure", () => {
    describe("index files", () => {
      it("bundle root index.md", async () => {
        const bundleDir = createTestBundleDir("root-index");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "index.md",
          "# Bundle Index\n\n* [Concept](concept.md) - description",
        );
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("bundle root index.md with okf_version frontmatter", async () => {
        const bundleDir = createTestBundleDir("root-index-version");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "index.md",
          "---\nokf_version: '0.2'\n---\n# Bundle Index",
        );
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("subdirectory index.md with no frontmatter", async () => {
        const bundleDir = createTestBundleDir("subdir-index");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "subdir/index.md",
          "# Subdirectory Index\n\n* [Concept](concept.md)",
        );
        await writeConcept(
          bundleDir,
          "subdir/concept.md",
          "---\ntype: Test\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("bundle with no index.md", async () => {
        const bundleDir = createTestBundleDir("no-index");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });
    });

    describe("log files", () => {
      it("log.md file at any level", async () => {
        const bundleDir = createTestBundleDir("log-file");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "log.md",
          "# Directory Update Log\n\n## 2026-05-22\n* **Creation**: Created concept.",
        );
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });
    });

    describe("cross-links", () => {
      it("broken cross-links between concepts", async () => {
        const bundleDir = createTestBundleDir("broken-links");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\n---\n# Body\n\nSee [missing](/missing.md).",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("absolute bundle-relative paths starting with /", async () => {
        const bundleDir = createTestBundleDir("absolute-links");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\n---\n# Body\n\nSee [other](/other.md).",
        );
        await writeConcept(
          bundleDir,
          "other.md",
          "---\ntype: Test\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("relative paths between concepts", async () => {
        const bundleDir = createTestBundleDir("relative-links");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "dir/concept.md",
          "---\ntype: Test\n---\n# Body\n\nSee [other](../other.md).",
        );
        await writeConcept(
          bundleDir,
          "other.md",
          "---\ntype: Test\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe("concept documents", () => {
    describe("frontmatter", () => {
      it("parses YAML frontmatter block delimited by ---", async () => {
        const bundleDir = createTestBundleDir("valid-frontmatter");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("rejects concept document with missing frontmatter", async () => {
        const bundleDir = createTestBundleDir("missing-frontmatter");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(bundleDir, "concept.md", "# No frontmatter\n");
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(false);
        expect(result.violations).toContainEqual({
          file: "concept.md",
          field: "frontmatter",
          reason: "Missing frontmatter",
        });
      });

      it("rejects frontmatter with unclosing --- delimiter", async () => {
        const bundleDir = createTestBundleDir("unclosed-frontmatter");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\n# Missing closing delimiter\n",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(false);
        expect(result.violations).toContainEqual({
          file: "concept.md",
          field: "frontmatter",
          reason: "Missing frontmatter",
        });
      });

      it("rejects frontmatter that is not parseable YAML", async () => {
        const bundleDir = createTestBundleDir("invalid-yaml");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: [unclosed array\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(false);
        expect(result.violations).toContainEqual({
          file: "concept.md",
          field: "frontmatter",
          reason: expect.stringContaining("Invalid YAML"),
        });
      });

      it("rejects frontmatter whose parsed value is not YAML mapping", async () => {
        const bundleDir = createTestBundleDir("non-mapping-frontmatter");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\n- item1\n- item2\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(false);
        expect(result.violations).toContainEqual({
          file: "concept.md",
          field: "frontmatter",
          reason: "Frontmatter must be a YAML mapping",
        });
      });

      it("rejects frontmatter mapping without required type field", async () => {
        const bundleDir = createTestBundleDir("missing-type");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntitle: No Type\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(false);
        expect(result.violations).toContainEqual({
          file: "concept.md",
          field: "type",
          reason: "Missing or empty required type field",
        });
      });

      it("rejects frontmatter mapping with empty type field", async () => {
        const bundleDir = createTestBundleDir("empty-type");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: ''\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(false);
        expect(result.violations).toContainEqual({
          file: "concept.md",
          field: "type",
          reason: "Missing or empty required type field",
        });
      });

      it("accepts frontmatter mapping with any non-empty type value", async () => {
        const bundleDir = createTestBundleDir("any-type");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: My Custom Type\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("accepts unknown frontmatter keys without rejecting them", async () => {
        const bundleDir = createTestBundleDir("unknown-keys");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\ncustom_field: value\nanother: 123\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });
    });

    describe("recommended fields", () => {
      it("title field", async () => {
        const bundleDir = createTestBundleDir("title-field");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\ntitle: My Concept\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("description field", async () => {
        const bundleDir = createTestBundleDir("description-field");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\ndescription: One-line summary\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("resource field", async () => {
        const bundleDir = createTestBundleDir("resource-field");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nresource: https://example.com/resource\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("tags list", async () => {
        const bundleDir = createTestBundleDir("tags-list");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\ntags: [a, b, c]\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });
    });

    describe("provenance", () => {
      it("sources list where each entry has required resource", async () => {
        const bundleDir = createTestBundleDir("sources-required-resource");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nsources:\n  - resource: https://example.com/source\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("source entry with id for per-claim attribution", async () => {
        const bundleDir = createTestBundleDir("source-id");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nsources:\n  - id: source-1\n    resource: https://example.com/source\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("source entry with title", async () => {
        const bundleDir = createTestBundleDir("source-title");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nsources:\n  - resource: https://example.com/source\n    title: Example Source\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("source entry with author actor", async () => {
        const bundleDir = createTestBundleDir("source-author");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nsources:\n  - resource: https://example.com/source\n    author: human:ahormati\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("source entry with usage_count signal", async () => {
        const bundleDir = createTestBundleDir("source-usage");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nsources:\n  - resource: https://example.com/source\n    usage_count: 5000\nusage_window: { from: 2026-06-01, to: 2026-06-30 }\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("source entry with last_modified date", async () => {
        const bundleDir = createTestBundleDir("source-modified");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nsources:\n  - resource: https://example.com/source\n    last_modified: 2026-05-30\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("usage_window sibling with from and to dates", async () => {
        const bundleDir = createTestBundleDir("usage-window");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nsources:\n  - resource: https://example.com/source\n    usage_count: 100\nusage_window: { from: 2026-06-01, to: 2026-06-30 }\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("source entry that overrides shared usage_window", async () => {
        const bundleDir = createTestBundleDir("usage-window-override");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nsources:\n  - resource: https://example.com/source\n    usage_count: 100\n    usage_window: { from: 2026-05-01, to: 2026-05-31 }\nusage_window: { from: 2026-06-01, to: 2026-06-30 }\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });
    });

    describe("trust", () => {
      it("generated block with required by actor", async () => {
        const bundleDir = createTestBundleDir("generated-by");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\ngenerated: { by: reference_agent/gemini-2.5-pro, at: 2026-06-20T22:53:05Z }\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("generated block with ISO 8601 at timestamp", async () => {
        const bundleDir = createTestBundleDir("generated-at");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\ngenerated: { by: human:ahormati, at: '2026-06-20T22:53:05Z' }\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("verified block as single { by, at } mapping", async () => {
        const bundleDir = createTestBundleDir("verified-single");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nverified: { by: human:ahormati, at: 2026-06-25T09:00:00Z }\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("verified block as list of { by, at } mappings", async () => {
        const bundleDir = createTestBundleDir("verified-list");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nverified:\n  - { by: human:ahormati, at: 2026-06-25T09:00:00Z }\n  - { by: process:finance-nightly, at: 2026-06-26T02:00:00Z }\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });
    });

    describe("lifecycle", () => {
      it("status field with value draft", async () => {
        const bundleDir = createTestBundleDir("status-draft");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nstatus: draft\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("status field with value stable", async () => {
        const bundleDir = createTestBundleDir("status-stable");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nstatus: stable\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("status field with value deprecated", async () => {
        const bundleDir = createTestBundleDir("status-deprecated");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nstatus: deprecated\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("stale_after absolute date", async () => {
        const bundleDir = createTestBundleDir("stale-after");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nstale_after: 2026-09-23\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });
    });

    describe("actor convention", () => {
      it("agent actor as <producer>/<version>", async () => {
        const bundleDir = createTestBundleDir("actor-agent");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\ngenerated: { by: reference_agent/gemini-2.5-pro, at: 2026-06-20T22:53:05Z }\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("human actor as human:<id>", async () => {
        const bundleDir = createTestBundleDir("actor-human");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\ngenerated: { by: human:ahormati, at: 2026-06-20T22:53:05Z }\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("process actor as process:<id>", async () => {
        const bundleDir = createTestBundleDir("actor-process");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\ngenerated: { by: process:finance-nightly, at: 2026-06-20T22:53:05Z }\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });
    });

    describe("links and paths", () => {
      it("resource field with absolute URL", async () => {
        const bundleDir = createTestBundleDir("resource-absolute-url");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nresource: https://example.com/resource\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("resource field with bundle-relative path starting with /", async () => {
        const bundleDir = createTestBundleDir("resource-bundle-relative");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nresource: /references/source.md\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });

      it("resource field with relative path", async () => {
        const bundleDir = createTestBundleDir("resource-relative");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\nresource: ../references/source.md\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe("Attested Computation concepts", () => {
    it("type: Attested Computation concept", async () => {
      const bundleDir = createTestBundleDir("attested-computation");
      await mkdir(bundleDir, { recursive: true });
      await writeConcept(
        bundleDir,
        "computation.md",
        "---\ntype: Attested Computation\n---\n# Computation\n\n    SELECT 1",
      );
      const result = await validateOkf(bundleDir);
      expect(result.valid).toBe(true);
    });

    it("runtime field", async () => {
      const bundleDir = createTestBundleDir("runtime-field");
      await mkdir(bundleDir, { recursive: true });
      await writeConcept(
        bundleDir,
        "computation.md",
        "---\ntype: Attested Computation\nruntime: bigquery\n---\n# Computation\n\n    SELECT 1",
      );
      const result = await validateOkf(bundleDir);
      expect(result.valid).toBe(true);
    });

    it("parameters list with name, type, and required entries", async () => {
      const bundleDir = createTestBundleDir("parameters-list");
      await mkdir(bundleDir, { recursive: true });
      await writeConcept(
        bundleDir,
        "computation.md",
        "---\ntype: Attested Computation\nruntime: bigquery\nparameters:\n  - { name: year, type: integer, required: true }\n---\n# Computation\n\n    SELECT * FROM table WHERE year = @year",
      );
      const result = await validateOkf(bundleDir);
      expect(result.valid).toBe(true);
    });

    it("computation path field", async () => {
      const bundleDir = createTestBundleDir("computation-path");
      await mkdir(bundleDir, { recursive: true });
      await writeConcept(
        bundleDir,
        "computation.md",
        "---\ntype: Attested Computation\nruntime: bigquery\ncomputation: references/computations/query.sql\n---\n# Body",
      );
      const result = await validateOkf(bundleDir);
      expect(result.valid).toBe(true);
    });

    it("executor block with resource and receipt fields", async () => {
      const bundleDir = createTestBundleDir("executor-block");
      await mkdir(bundleDir, { recursive: true });
      await writeConcept(
        bundleDir,
        "computation.md",
        "---\ntype: Attested Computation\nruntime: bigquery\nexecutor:\n  resource: references/skills/run-on-bq.md\n  receipt: [job_id, executed_sql, result]\n---\n# Computation\n\n    SELECT 1",
      );
      const result = await validateOkf(bundleDir);
      expect(result.valid).toBe(true);
    });

    it("attester block with resource field", async () => {
      const bundleDir = createTestBundleDir("attester-block");
      await mkdir(bundleDir, { recursive: true });
      await writeConcept(
        bundleDir,
        "computation.md",
        "---\ntype: Attested Computation\nruntime: bigquery\nattester:\n  resource: references/attesters/result.py\n---\n# Computation\n\n    SELECT 1",
      );
      const result = await validateOkf(bundleDir);
      expect(result.valid).toBe(true);
    });

    it("inline # Computation section in body", async () => {
      const bundleDir = createTestBundleDir("inline-computation");
      await mkdir(bundleDir, { recursive: true });
      await writeConcept(
        bundleDir,
        "computation.md",
        "---\ntype: Attested Computation\nruntime: bigquery\n---\n# Computation\n\n    SELECT 1",
      );
      const result = await validateOkf(bundleDir);
      expect(result.valid).toBe(true);
    });
  });

  describe("invalid OKF", () => {
    describe("bundle structure", () => {
      it("rejects concept document using index.md as filename", async () => {
        const bundleDir = createTestBundleDir("index-as-concept");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "index.md",
          "---\ntype: Test\n---\n# This is a concept, not an index",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(false);
        expect(result.violations).toContainEqual({
          file: "index.md",
          field: "filename",
          reason:
            "Reserved filename index.md must not be used for a concept document",
        });
      });

      it("rejects concept document using log.md as filename", async () => {
        const bundleDir = createTestBundleDir("log-as-concept");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "log.md",
          "---\ntype: Test\n---\n# This is a concept, not a log",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(false);
        expect(result.violations).toContainEqual({
          file: "log.md",
          field: "filename",
          reason:
            "Reserved filename log.md must not be used for a concept document",
        });
      });
    });

    describe("concept documents", () => {
      it("rejects generated block without required by actor", async () => {
        const bundleDir = createTestBundleDir("generated-missing-by");
        await mkdir(bundleDir, { recursive: true });
        await writeConcept(
          bundleDir,
          "concept.md",
          "---\ntype: Test\ngenerated: { at: 2026-06-20T22:53:05Z }\n---\n# Body",
        );
        const result = await validateOkf(bundleDir);
        expect(result.valid).toBe(false);
        expect(result.violations).toContainEqual({
          file: "concept.md",
          field: "generated.by",
          reason: "generated.by is required when generated is present",
        });
      });
    });
  });
});
