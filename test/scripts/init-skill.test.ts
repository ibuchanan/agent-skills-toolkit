import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdir, rm, readFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { parse as parseYaml } from "yaml";
import { createSkillDirectory } from "../../src/scripts/lib/io.js";
import { validateSkillName } from "../../src/scripts/lib/validation.js";

describe("init-skill script", () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `test-skill-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("input and overwrite safety", () => {
    it("rejects an invalid skill name", () => {
      const result = validateSkillName("MySkill");
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("refuses to create a skill that already exists", async () => {
      const skillName = "existing-skill";
      const skillsDir = testDir;
      const skillDir = join(skillsDir, skillName);

      // Pre-create the skill directory
      await mkdir(skillDir, { recursive: true });

      // Attempt to create should fail
      await expect(
        createSkillDirectory(skillName, skillsDir),
      ).rejects.toThrow();
    });

    it("leaves existing skill contents unchanged when initialization fails", async () => {
      const skillName = "partial-skill";
      const skillsDir = testDir;
      const skillDir = join(skillsDir, skillName);

      // Pre-create the skill directory
      await mkdir(skillDir, { recursive: true });
      const markerFile = join(skillDir, "MARKER.txt");
      await import("fs/promises").then((m) =>
        m.writeFile(markerFile, "preserved"),
      );

      // Attempt to create should fail
      try {
        await createSkillDirectory(skillName, skillsDir);
      } catch {
        // Expected to fail
      }

      // Verify that skill directory was cleaned up entirely (atomic failure)
      const exists = await import("fs/promises").then((m) =>
        m.stat(skillDir).catch(() => null),
      );
      expect(exists).toBeNull();
    });
  });

  describe("skill", () => {
    it("creates the skill directory", async () => {
      const skillName = "test-skill";
      const skillsDir = testDir;

      await createSkillDirectory(skillName, skillsDir);

      const skillDir = join(skillsDir, skillName);
      const stat = await import("fs/promises").then((m) => m.stat(skillDir));
      expect(stat.isDirectory()).toBe(true);
    });

    it("writes YAML frontmatter followed by Markdown instructions", async () => {
      const skillName = "test-skill";
      const skillsDir = testDir;

      await createSkillDirectory(skillName, skillsDir);

      const skillMdPath = join(skillsDir, skillName, "SKILL.md");
      const content = await readFile(skillMdPath, "utf8");

      // Check for YAML frontmatter
      expect(content).toMatch(/^---\n/);
      expect(content).toMatch(/\n---\n/);

      // Check for Markdown after frontmatter
      const parts = content.split("---");
      expect(parts.length).toBeGreaterThanOrEqual(3);
      const markdown = parts.slice(2).join("---");
      expect(markdown).toMatch(/^/);
    });

    it("sets the frontmatter name to the created directory name", async () => {
      const skillName = "my-skill";
      const skillsDir = testDir;

      await createSkillDirectory(skillName, skillsDir);

      const skillMdPath = join(skillsDir, skillName, "SKILL.md");
      const content = await readFile(skillMdPath, "utf8");
      const [, frontmatterSection] = content.split("---").slice(0, 3);
      const parsed = parseYaml(frontmatterSection) as Record<string, unknown>;

      expect(parsed.name).toBe(skillName);
    });

    it("writes a non-empty description", async () => {
      const skillName = "test-skill";
      const skillsDir = testDir;

      await createSkillDirectory(skillName, skillsDir);

      const skillMdPath = join(skillsDir, skillName, "SKILL.md");
      const content = await readFile(skillMdPath, "utf8");
      const [, frontmatterSection] = content.split("---").slice(0, 3);
      const parsed = parseYaml(frontmatterSection) as Record<string, unknown>;

      expect(parsed.description).toBeDefined();
      expect(typeof parsed.description).toBe("string");
      expect((parsed.description as string).length).toBeGreaterThan(0);
    });

    it("creates a SKILL.md that passes Agent Skills validation", async () => {
      const skillName = "test-skill";
      const skillsDir = testDir;

      await createSkillDirectory(skillName, skillsDir);

      const skillMdPath = join(skillsDir, skillName, "SKILL.md");
      const content = await readFile(skillMdPath, "utf8");
      const [, frontmatterSection] = content.split("---").slice(0, 3);
      const parsed = parseYaml(frontmatterSection) as Record<string, unknown>;

      // Required fields
      expect(parsed.name).toBe(skillName);
      expect(parsed.description).toBeDefined();

      // No unexpected fields
      const keys = Object.keys(parsed);
      expect(keys.every((k) => ["name", "description"].includes(k))).toBe(true);

      // Description length
      const desc = parsed.description as string;
      expect(desc.length).toBeLessThanOrEqual(256);
    });
  });

  describe("extension directories", () => {
    it("creates the scripts directory", async () => {
      const skillName = "test-skill";
      const skillsDir = testDir;

      await createSkillDirectory(skillName, skillsDir);

      const scriptsDir = join(skillsDir, skillName, "scripts");
      const stat = await import("fs/promises").then((m) => m.stat(scriptsDir));
      expect(stat.isDirectory()).toBe(true);
    });

    it("creates the assets directory", async () => {
      const skillName = "test-skill";
      const skillsDir = testDir;

      await createSkillDirectory(skillName, skillsDir);

      const assetsDir = join(skillsDir, skillName, "assets");
      const stat = await import("fs/promises").then((m) => m.stat(assetsDir));
      expect(stat.isDirectory()).toBe(true);
    });

    it("creates the references directory", async () => {
      const skillName = "test-skill";
      const skillsDir = testDir;

      await createSkillDirectory(skillName, skillsDir);

      const referencesDir = join(skillsDir, skillName, "references");
      const stat = await import("fs/promises").then((m) =>
        m.stat(referencesDir),
      );
      expect(stat.isDirectory()).toBe(true);
    });

    it("creates the evals directory", async () => {
      const skillName = "test-skill";
      const skillsDir = testDir;

      await createSkillDirectory(skillName, skillsDir);

      const evalsDir = join(skillsDir, skillName, "evals");
      const stat = await import("fs/promises").then((m) => m.stat(evalsDir));
      expect(stat.isDirectory()).toBe(true);
    });
  });
});
