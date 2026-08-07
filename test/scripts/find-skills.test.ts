import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const scriptPath = resolve(import.meta.dir, "../../src/scripts/find-skills.ts");

describe("find-skills script", () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `find-skills-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
    await mkdir(join(testDir, ".git"), { recursive: true });
  });

  afterEach(async () => {
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it("lists every SKILL.md file recursively from the repository root", async () => {
    await mkdir(join(testDir, "skills", "test-skill"), { recursive: true });
    await writeFile(
      join(testDir, "skills", "test-skill", "SKILL.md"),
      "# Test",
    );

    const { stdout } = await Bun.$`bun ${scriptPath}`.cwd(testDir).quiet();
    const output = stdout.toString().trim();

    expect(output).toContain("skills/test-skill/SKILL.md");
  });

  it("excludes SKILL.md files under node_modules", async () => {
    await mkdir(join(testDir, "skills", "valid-skill"), { recursive: true });
    await writeFile(
      join(testDir, "skills", "valid-skill", "SKILL.md"),
      "# Valid",
    );

    await mkdir(join(testDir, "node_modules", "some-package"), {
      recursive: true,
    });
    await writeFile(
      join(testDir, "node_modules", "some-package", "SKILL.md"),
      "# Hidden",
    );

    const { stdout } = await Bun.$`bun ${scriptPath}`.cwd(testDir).quiet();
    const output = stdout.toString().trim();

    expect(output).toContain("skills/valid-skill/SKILL.md");
    expect(output).not.toContain("node_modules");
  });
  it("prints one path per line", async () => {
    await mkdir(join(testDir, "skills", "alpha-skill"), { recursive: true });
    await writeFile(
      join(testDir, "skills", "alpha-skill", "SKILL.md"),
      "# Alpha",
    );
    await mkdir(join(testDir, "skills", "beta-skill"), { recursive: true });
    await writeFile(
      join(testDir, "skills", "beta-skill", "SKILL.md"),
      "# Beta",
    );

    const { stdout } = await Bun.$`bun ${scriptPath}`.cwd(testDir).quiet();
    const lines = stdout.toString().trim().split("\n");

    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe("skills/alpha-skill/SKILL.md");
    expect(lines[1]).toBe("skills/beta-skill/SKILL.md");
  });
  it("prints paths relative to the repository root", async () => {
    await mkdir(join(testDir, "deep", "nested", "skill"), { recursive: true });
    await writeFile(
      join(testDir, "deep", "nested", "skill", "SKILL.md"),
      "# Deep",
    );

    const { stdout } = await Bun.$`bun ${scriptPath}`.cwd(testDir).quiet();
    const output = stdout.toString().trim();

    expect(output).toBe("deep/nested/skill/SKILL.md");
    expect(output).not.toMatch(/^\/|^[A-Z]:/);
  });
  it("omits the leading ./ from printed paths", async () => {
    await writeFile(join(testDir, "SKILL.md"), "# Root");

    const { stdout } = await Bun.$`bun ${scriptPath}`.cwd(testDir).quiet();
    const output = stdout.toString().trim();

    expect(output).toBe("SKILL.md");
    expect(output).not.toStartWith("./");
  });
  it("sorts discovered paths lexicographically", async () => {
    await mkdir(join(testDir, "skills", "zebra-skill"), { recursive: true });
    await writeFile(
      join(testDir, "skills", "zebra-skill", "SKILL.md"),
      "# Zebra",
    );
    await mkdir(join(testDir, "skills", "apple-skill"), { recursive: true });
    await writeFile(
      join(testDir, "skills", "apple-skill", "SKILL.md"),
      "# Apple",
    );
    await mkdir(join(testDir, "skills", "mango-skill"), { recursive: true });
    await writeFile(
      join(testDir, "skills", "mango-skill", "SKILL.md"),
      "# Mango",
    );

    const { stdout } = await Bun.$`bun ${scriptPath}`.cwd(testDir).quiet();
    const lines = stdout.toString().trim().split("\n");

    expect(lines).toEqual([
      "skills/apple-skill/SKILL.md",
      "skills/mango-skill/SKILL.md",
      "skills/zebra-skill/SKILL.md",
    ]);
  });
  it("prints no output when the repository contains no SKILL.md files", async () => {
    const { stdout } = await Bun.$`bun ${scriptPath}`.cwd(testDir).quiet();
    const output = stdout.toString().trim();

    expect(output).toBe("");
  });
  it("finds skills when invoked outside the repository root", async () => {
    await mkdir(join(testDir, "skills", "remote-skill"), { recursive: true });
    await writeFile(
      join(testDir, "skills", "remote-skill", "SKILL.md"),
      "# Remote",
    );

    const subDir = join(testDir, "some", "nested", "directory");
    await mkdir(subDir, { recursive: true });

    const { stdout } = await Bun.$`bun ${scriptPath}`.cwd(subDir).quiet();
    const output = stdout.toString().trim();

    expect(output).toBe("skills/remote-skill/SKILL.md");
  });
});
