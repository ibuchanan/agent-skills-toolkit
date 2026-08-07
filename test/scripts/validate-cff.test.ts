import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { validateCff } from "../../src/scripts/lib/validate-cff.js";

const scriptPath = resolve(
  import.meta.dir,
  "../../src/scripts/validate-cff.ts",
);

let testDir: string;

function createTestDir(name: string): string {
  return join(testDir, name);
}

async function writeCff(dir: string, content: string): Promise<void> {
  await writeFile(join(dir, "CITATION.cff"), content, "utf8");
}

async function expectValid(dir: string): Promise<void> {
  const result = await validateCff(dir);
  expect(result.valid).toBe(true);
  expect(result.violations).toEqual([]);
}

async function expectInvalid(
  dir: string,
  expectedViolations: Array<{ field: string; reason: string }>,
): Promise<void> {
  const result = await validateCff(dir);
  expect(result.valid).toBe(false);
  for (const violation of expectedViolations) {
    expect(result.violations).toContainEqual(violation);
  }
}

describe("validate-cff script", () => {
  beforeEach(async () => {
    testDir = join(
      tmpdir(),
      `validate-cff-test-${Date.now()}-${Math.random()}`,
    );
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe("file and YAML validity", () => {
    it("accepts a minimal valid CITATION.cff", async () => {
      const dir = createTestDir("minimal-valid");
      await mkdir(dir, { recursive: true });
      await writeCff(
        dir,
        `cff-version: 1.2.0
message: "If you use this software, please cite it using these metadata."
title: "Test Software"
authors:
  - family-names: Test
    given-names: Author`,
      );
      await expectValid(dir);
    });

    it("reports a missing CITATION.cff", async () => {
      const dir = createTestDir("missing-cff");
      await mkdir(dir, { recursive: true });
      await expectInvalid(dir, [
        { field: "CITATION.cff", reason: "CITATION.cff not found" },
      ]);
    });

    it("rejects invalid YAML", async () => {
      const dir = createTestDir("invalid-yaml");
      await mkdir(dir, { recursive: true });
      await writeCff(dir, "not valid yaml: [unclosed");
      await expectInvalid(dir, [
        {
          field: "yaml",
          reason: expect.stringContaining("Invalid YAML") as unknown as string,
        },
      ]);
    });

    it("rejects non-mapping content (a list or scalar)", async () => {
      const dirList = createTestDir("non-mapping-list");
      await mkdir(dirList, { recursive: true });
      await writeCff(dirList, "- item");
      await expectInvalid(dirList, [
        { field: "root", reason: "CITATION.cff must be a YAML mapping" },
      ]);

      const dirScalar = createTestDir("non-mapping-scalar");
      await mkdir(dirScalar, { recursive: true });
      await writeCff(dirScalar, "just a string");
      await expectInvalid(dirScalar, [
        { field: "root", reason: "CITATION.cff must be a YAML mapping" },
      ]);
    });
  });

  describe("required fields", () => {
    it("reports each missing required field: authors, cff-version, message, title", async () => {
      const dir = createTestDir("missing-required");
      await mkdir(dir, { recursive: true });
      await writeCff(dir, "abstract: ");

      await expectInvalid(dir, [
        { field: "cff-version", reason: "Missing required field" },
        { field: "message", reason: "Missing required field" },
        { field: "title", reason: "Missing required field" },
        { field: "authors", reason: "Missing required field" },
      ]);
    });

    it("rejects a cff-version other than 1.2.0", async () => {
      const dir = createTestDir("wrong-version");
      await mkdir(dir, { recursive: true });
      await writeCff(
        dir,
        `cff-version: 1.1.0
message: "Please cite this software."
title: "Test Software"
authors:
  - family-names: Test
    given-names: Author`,
      );
      await expectInvalid(dir, [
        {
          field: "cff-version",
          reason: "cff-version must be 1.2.0",
        },
      ]);
    });
  });

  describe("authors", () => {
    it("accepts a person author (family-names and given-names)", async () => {
      const dir = createTestDir("person-author");
      await mkdir(dir, { recursive: true });
      await writeCff(
        dir,
        `cff-version: 1.2.0
message: "Please cite this software."
title: "Test Software"
authors:
  - family-names: Doe
    given-names: Jane`,
      );
      await expectValid(dir);
    });

    it("accepts an entity author (name)", async () => {
      const dir = createTestDir("entity-author");
      await mkdir(dir, { recursive: true });
      await writeCff(
        dir,
        `cff-version: 1.2.0
message: "Please cite this software."
title: "Test Software"
authors:
  - name: "ACME Corporation"`,
      );
      await expectValid(dir);
    });

    it("rejects an empty authors array", async () => {
      const dir = createTestDir("empty-authors");
      await mkdir(dir, { recursive: true });
      await writeCff(
        dir,
        `cff-version: 1.2.0
message: "Please cite this software."
title: "Test Software"
authors: []`,
      );
      await expectInvalid(dir, [
        { field: "authors", reason: "authors must not be empty" },
      ]);
    });

    it("rejects an author missing both person and entity fields", async () => {
      const dir = createTestDir("missing-author-fields");
      await mkdir(dir, { recursive: true });
      await writeCff(
        dir,
        `cff-version: 1.2.0
message: "Please cite this software."
title: "Test Software"
authors:
  - email: jane@example.com`,
      );
      await expectInvalid(dir, [
        {
          field: "authors[0]",
          reason:
            "Author must have either a 'name' or both 'family-names' and 'given-names'",
        },
      ]);
    });
  });

  describe("optional fields", () => {
    it("accepts a valid license", async () => {
      const dir = createTestDir("valid-license");
      await mkdir(dir, { recursive: true });
      await writeCff(
        dir,
        `cff-version: 1.2.0
message: "Please cite this software."
title: "Test Software"
license: "Apache-2.0"
authors:
  - family-names: Test
    given-names: Author`,
      );
      await expectValid(dir);
    });

    it("accepts a version string", async () => {
      const dir = createTestDir("version-string");
      await mkdir(dir, { recursive: true });
      await writeCff(
        dir,
        `cff-version: 1.2.0
message: "Please cite this software."
title: "Test Software"
version: "1.0.0"
authors:
  - family-names: Test
    given-names: Author`,
      );
      await expectValid(dir);
    });
  });

  describe("validation output", () => {
    it("succeeds silently when CITATION.cff is valid", async () => {
      const dir = createTestDir("silent-success");
      await mkdir(dir, { recursive: true });
      await writeCff(
        dir,
        `cff-version: 1.2.0
message: "Please cite this software."
title: "Test Software"
authors:
  - family-names: Test
    given-names: Author`,
      );

      const result = await Bun.$`bun ${scriptPath} ${dir}`
        .cwd(dir)
        .quiet()
        .nothrow();
      expect(result.exitCode).toBe(0);
      expect(result.stdout.toString()).toBe("");
      expect(result.stderr.toString()).toBe("");
    });

    it("reports all discovered validation failures", async () => {
      const dir = createTestDir("report-failures");
      await mkdir(dir, { recursive: true });
      await writeCff(
        dir,
        `cff-version: 1.1.0
message: ""
title: ""
authors: []`,
      );

      const result = await Bun.$`bun ${scriptPath} ${dir}`
        .cwd(dir)
        .quiet()
        .nothrow();
      const stderr = result.stderr.toString();
      expect(stderr).toContain("Validation failed");
      expect(stderr).toContain("cff-version");
      expect(stderr).toContain("message");
      expect(stderr).toContain("title");
      expect(stderr).toContain("authors");
    });

    it("exits unsuccessfully when CITATION.cff is invalid", async () => {
      const dir = createTestDir("exit-unsuccessful");
      await mkdir(dir, { recursive: true });
      await writeCff(
        dir,
        `cff-version: 1.2.0
message: "Please cite this software."
title: "Test Software"
authors: []`,
      );

      const result = await Bun.$`bun ${scriptPath} ${dir}`
        .cwd(dir)
        .quiet()
        .nothrow();
      expect(result.exitCode).toBe(1);
    });
  });
});
