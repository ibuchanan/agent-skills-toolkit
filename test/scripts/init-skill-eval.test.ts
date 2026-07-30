import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { initSkillEval } from "../../src/scripts/lib/init-skill-eval.js";

let testDir: string;

describe("init-skill-eval script", () => {
  beforeEach(async () => {
    testDir = join(
      tmpdir(),
      `rovo-init-skill-eval-test-${Date.now()}-${Math.random()}`,
    );
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe("input and overwrite safety", () => {
    it("rejects a missing skill directory", async () => {
      const missingSkillDir = join(testDir, "nonexistent-skill");
      try {
        await initSkillEval(missingSkillDir);
        expect.fail("Should have thrown an error for missing directory");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("not found");
      }
    });

    it("rejects a skill directory without SKILL.md", async () => {
      const skillDir = join(testDir, "invalid-skill");
      await mkdir(skillDir, { recursive: true });

      try {
        await initSkillEval(skillDir);
        expect.fail("Should have thrown an error for missing SKILL.md");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("SKILL.md");
      }
    });

    it("refuses to overwrite an existing evaluation suite", async () => {
      const skillDir = join(testDir, "skill-with-evals");
      await mkdir(skillDir, { recursive: true });
      await writeFile(
        join(skillDir, "SKILL.md"),
        "---\nname: test\n---\n# Test\n",
        "utf8",
      );

      const evalDir = join(skillDir, "evals", "default");
      await mkdir(evalDir, { recursive: true });
      await writeFile(
        join(evalDir, "promptfooconfig.yaml"),
        "existing config\n",
        "utf8",
      );

      try {
        await initSkillEval(skillDir);
        expect.fail(
          "Should have thrown an error for existing evaluation suite",
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("already exists");
      }
    });

    it("leaves an existing evaluation suite unchanged when initialization fails", async () => {
      const skillDir = join(testDir, "skill-with-broken-evals");
      await mkdir(skillDir, { recursive: true });
      await writeFile(
        join(skillDir, "SKILL.md"),
        "---\nname: test\n---\n# Test\n",
        "utf8",
      );

      const evalDir = join(skillDir, "evals", "default");
      await mkdir(evalDir, { recursive: true });
      const originalConfig = "original config that should not change\n";
      await writeFile(
        join(evalDir, "promptfooconfig.yaml"),
        originalConfig,
        "utf8",
      );

      try {
        await initSkillEval(skillDir);
        expect.fail("Should have thrown an error");
      } catch (error) {
        const currentConfig = await readFile(
          join(evalDir, "promptfooconfig.yaml"),
          "utf8",
        );
        expect(currentConfig).toBe(originalConfig);
      }
    });
  });

  describe("evaluation suite", () => {
    it("creates the canonical evaluation suite directory under evals", async () => {
      const skillDir = join(testDir, "fresh-skill");
      await mkdir(skillDir, { recursive: true });
      await writeFile(
        join(skillDir, "SKILL.md"),
        "---\nname: fresh-skill\n---\n# Fresh Skill\n",
        "utf8",
      );

      await initSkillEval(skillDir);

      const evalDir = join(skillDir, "evals", "default");
      const stat = await import("node:fs/promises").then((m) =>
        m.stat(evalDir).catch(() => null),
      );
      expect(stat).not.toBeNull();
      expect(stat?.isDirectory()).toBe(true);
    });

    it("writes a promptfooconfig.yaml with the Promptfoo schema directive", async () => {
      const skillDir = join(testDir, "schema-skill");
      await mkdir(skillDir, { recursive: true });
      await writeFile(
        join(skillDir, "SKILL.md"),
        "---\nname: schema-skill\n---\n# Schema Skill\n",
        "utf8",
      );

      await initSkillEval(skillDir);

      const configPath = join(
        skillDir,
        "evals",
        "default",
        "promptfooconfig.yaml",
      );
      const content = await readFile(configPath, "utf8");
      expect(content).toContain("$schema");
    });

    it("creates a file-based prompt directory", async () => {
      const skillDir = join(testDir, "prompt-skill");
      await mkdir(skillDir, { recursive: true });
      await writeFile(
        join(skillDir, "SKILL.md"),
        "---\nname: prompt-skill\n---\n# Prompt Skill\n",
        "utf8",
      );

      await initSkillEval(skillDir);

      const promptDir = join(skillDir, "evals", "default", "prompts");
      const stat = await import("node:fs/promises").then((m) =>
        m.stat(promptDir).catch(() => null),
      );
      expect(stat?.isDirectory()).toBe(true);
    });

    it("creates a file-based test directory", async () => {
      const skillDir = join(testDir, "test-skill");
      await mkdir(skillDir, { recursive: true });
      await writeFile(
        join(skillDir, "SKILL.md"),
        "---\nname: test-skill\n---\n# Test Skill\n",
        "utf8",
      );

      await initSkillEval(skillDir);

      const testDir_ = join(skillDir, "evals", "default", "tests");
      const stat = await import("node:fs/promises").then((m) =>
        m.stat(testDir_).catch(() => null),
      );
      expect(stat?.isDirectory()).toBe(true);
    });

    it("configures Promptfoo to load prompts and tests from those directories", async () => {
      const skillDir = join(testDir, "config-skill");
      await mkdir(skillDir, { recursive: true });
      await writeFile(
        join(skillDir, "SKILL.md"),
        "---\nname: config-skill\n---\n# Config Skill\n",
        "utf8",
      );

      await initSkillEval(skillDir);

      const configPath = join(
        skillDir,
        "evals",
        "default",
        "promptfooconfig.yaml",
      );
      const content = await readFile(configPath, "utf8");
      expect(content).toContain("prompts:");
      expect(content).toContain("tests:");
    });
  });

  describe("initial contents", () => {
    it("creates a minimal prompt template without inventing skill-specific behavior", async () => {
      const skillDir = join(testDir, "minimal-skill");
      await mkdir(skillDir, { recursive: true });
      await writeFile(
        join(skillDir, "SKILL.md"),
        "---\nname: minimal-skill\n---\n# Minimal Skill\n",
        "utf8",
      );

      await initSkillEval(skillDir);

      const promptPath = join(
        skillDir,
        "evals",
        "default",
        "prompts",
        "main.txt",
      );
      const content = await readFile(promptPath, "utf8");
      // Verify it's a minimal template
      expect(content.length).toBeGreaterThan(0);
      expect(content.toLowerCase()).not.toContain("minimal-skill");
    });

    it("does not choose a provider or create semantic evaluation cases", async () => {
      const skillDir = join(testDir, "no-provider-skill");
      await mkdir(skillDir, { recursive: true });
      await writeFile(
        join(skillDir, "SKILL.md"),
        "---\nname: no-provider-skill\n---\n# No Provider Skill\n",
        "utf8",
      );

      await initSkillEval(skillDir);

      const configPath = join(
        skillDir,
        "evals",
        "default",
        "promptfooconfig.yaml",
      );
      const content = await readFile(configPath, "utf8");
      // Should not specify a provider
      expect(content).not.toContain("provider:");
      // Should not have assertion/eval logic
      expect(content.toLowerCase()).not.toContain("assert");
    });
  });
});
