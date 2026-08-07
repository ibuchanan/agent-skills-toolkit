import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkSkill } from "../../src/scripts/lib/check-skill.js";
import { findRepositoryRoot } from "../../src/scripts/lib/paths.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface MockToolCall {
  skillDir: string;
  files?: string[];
}

function createMockTool(name: string, defaultResult: boolean) {
  const calls: MockToolCall[] = [];
  const applicable = () => true;
  const run = async (skillDir: string, files?: string[]) => {
    calls.push({ skillDir, files });
    return { success: defaultResult };
  };
  return { name, applicable, run, calls };
}

async function createSkillDir(
  parent: string,
  name: string,
  options: {
    references?: boolean;
    citation?: boolean;
    evals?: boolean;
  } = {},
): Promise<string> {
  const skillDir = join(parent, "skills", name);
  await mkdir(skillDir, { recursive: true });
  await writeFile(
    join(skillDir, "SKILL.md"),
    `---\nname: ${name}\ndescription: ${name} skill\n---\n# ${name}\n`,
  );
  if (options.references ?? true) {
    await mkdir(join(skillDir, "references"), { recursive: true });
  }
  if (options.citation ?? true) {
    await writeFile(
      join(skillDir, "CITATION.cff"),
      `cff-version: 1.2.0\nmessage: "Please cite this software."\ntitle: "${name}"\nauthors:\n  - family-names: Test\n    given-names: Author\n`,
    );
  }
  if (options.evals ?? false) {
    const evalDir = join(skillDir, "evals");
    await mkdir(evalDir, { recursive: true });
    await writeFile(
      join(evalDir, "promptfooconfig.yaml"),
      "prompts: []\ntests: []\n",
    );
  }
  return skillDir;
}

async function initRepo(parent: string): Promise<string> {
  await mkdir(join(parent, ".git"), { recursive: true });
  return parent;
}

describe("check-skill script", () => {
  let testDir: string;
  let repoRoot: string;

  beforeEach(async () => {
    testDir = await mkdtemp(join(tmpdir(), "check-skill-test-"));
    repoRoot = await initRepo(testDir);
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe("single-skill invocation", () => {
    it("accepts a single skill directory path as its argument", async () => {
      const skillDir = await createSkillDir(testDir, "alpha", {
        references: true,
        citation: true,
        evals: true,
      });
      const tool = createMockTool("validate-skill", true);
      const result = await checkSkill({
        repoRoot,
        mode: { type: "skill", skillDir },
        tools: [tool],
      });
      expect(result.success).toBe(true);
      expect(tool.calls).toHaveLength(1);
      expect(tool.calls[0].skillDir).toBe(skillDir);
    });

    it("rejects a path that is not a skill directory (no SKILL.md)", async () => {
      const badDir = join(testDir, "skills", "not-a-skill");
      await mkdir(badDir, { recursive: true });
      await expect(
        checkSkill({
          repoRoot,
          mode: { type: "skill", skillDir: badDir },
          tools: [],
        }),
      ).rejects.toThrow(/SKILL.md/);
    });

    it("rejects a missing path", async () => {
      const missingDir = join(testDir, "skills", "missing");
      await expect(
        checkSkill({
          repoRoot,
          mode: { type: "skill", skillDir: missingDir },
          tools: [],
        }),
      ).rejects.toThrow(/not found|does not exist/);
    });
  });

  describe("repo-wide invocation", () => {
    it("runs against every skill when invoked with --all", async () => {
      const alpha = await createSkillDir(testDir, "alpha");
      const beta = await createSkillDir(testDir, "beta");
      const tool = createMockTool("validate-skill", true);
      const result = await checkSkill({
        repoRoot,
        mode: { type: "all" },
        tools: [tool],
      });
      expect(result.success).toBe(true);
      const dirs = tool.calls.map((c) => c.skillDir).sort();
      expect(dirs).toEqual([alpha, beta].sort());
    });

    it("discovers skills via the find-skills primitive rather than its own scan", async () => {
      await createSkillDir(testDir, "alpha");
      await createSkillDir(testDir, "beta");
      const tool = createMockTool("validate-skill", true);
      await checkSkill({
        repoRoot,
        mode: { type: "all" },
        tools: [tool],
      });
      const dirs = tool.calls.map((c) => c.skillDir);
      expect(dirs.every((d) => d.includes("/skills/"))).toBe(true);
    });

    it("runs each discovered skill's checks independently, so one skill's failure does not stop the others", async () => {
      const alpha = await createSkillDir(testDir, "alpha");
      await createSkillDir(testDir, "beta");
      const tool = createMockTool("validate-skill", true);
      // Make alpha fail
      tool.run = async (skillDir: string, files?: string[]) => {
        tool.calls.push({ skillDir, files });
        return { success: skillDir !== alpha };
      };
      const result = await checkSkill({
        repoRoot,
        mode: { type: "all" },
        tools: [tool],
      });
      expect(result.success).toBe(false);
      expect(tool.calls).toHaveLength(2);
    });

    it("reports a per-skill summary line for every discovered skill", async () => {
      await createSkillDir(testDir, "alpha");
      await createSkillDir(testDir, "beta");
      const tool = createMockTool("validate-skill", true);
      const result = await checkSkill({
        repoRoot,
        mode: { type: "all" },
        tools: [tool],
      });
      expect(result.skillResults).toHaveLength(2);
      expect(result.skillResults.every((r) => r.success)).toBe(true);
    });

    it("exits successfully when no skills are discovered", async () => {
      const result = await checkSkill({
        repoRoot,
        mode: { type: "all" },
        tools: [],
      });
      expect(result.success).toBe(true);
      expect(result.skillResults).toHaveLength(0);
    });
  });

  describe("tool composition: scoping each tool to the target skill", () => {
    it("runs each configured tool scoped to the skill directory", async () => {
      const skillDir = await createSkillDir(testDir, "alpha");
      const cspell = createMockTool("cspell", true);
      const markdownlint = createMockTool("markdownlint", true);
      const result = await checkSkill({
        repoRoot,
        mode: { type: "skill", skillDir },
        tools: [cspell, markdownlint],
      });
      expect(result.success).toBe(true);
      expect(cspell.calls).toHaveLength(1);
      expect(markdownlint.calls).toHaveLength(1);
    });
  });

  describe("missing optional artifacts", () => {
    it("skips the CITATION.cff check with a note, not a failure, when the skill has no CITATION.cff", async () => {
      const skillDir = await createSkillDir(testDir, "alpha", {
        citation: false,
      });
      const cff = createMockTool("validate-cff", true);
      cff.applicable = () => false;
      const result = await checkSkill({
        repoRoot,
        mode: { type: "skill", skillDir },
        tools: [cff],
      });
      expect(result.success).toBe(true);
      expect(cff.calls).toHaveLength(0);
    });

    it("skips the OKF frontmatter check with a note, not a failure, when the skill has no references/ directory", async () => {
      const skillDir = await createSkillDir(testDir, "alpha", {
        references: false,
      });
      const okf = createMockTool("validate-okf", true);
      okf.applicable = () => false;
      const result = await checkSkill({
        repoRoot,
        mode: { type: "skill", skillDir },
        tools: [okf],
      });
      expect(result.success).toBe(true);
      expect(okf.calls).toHaveLength(0);
    });

    it("skips the promptfoo check with a note, not a failure, when the skill has no evals/ directory", async () => {
      const skillDir = await createSkillDir(testDir, "alpha", { evals: false });
      const promptfoo = createMockTool("promptfoo", true);
      promptfoo.applicable = () => false;
      const result = await checkSkill({
        repoRoot,
        mode: { type: "skill", skillDir },
        tools: [promptfoo],
      });
      expect(result.success).toBe(true);
      expect(promptfoo.calls).toHaveLength(0);
    });

    it("still runs core checks even when all optional artifacts are absent", async () => {
      const skillDir = await createSkillDir(testDir, "alpha", {
        references: false,
        citation: false,
        evals: false,
      });
      const core = createMockTool("validate-skill", true);
      const result = await checkSkill({
        repoRoot,
        mode: { type: "skill", skillDir },
        tools: [core],
      });
      expect(result.success).toBe(true);
      expect(core.calls).toHaveLength(1);
    });
  });

  describe("aggregation and exit behavior", () => {
    it("runs all applicable tools for a skill even after an earlier tool fails", async () => {
      const skillDir = await createSkillDir(testDir, "alpha");
      const first = createMockTool("first", false);
      const second = createMockTool("second", true);
      const result = await checkSkill({
        repoRoot,
        mode: { type: "skill", skillDir },
        tools: [first, second],
      });
      expect(result.success).toBe(false);
      expect(first.calls).toHaveLength(1);
      expect(second.calls).toHaveLength(1);
    });

    it("exits unsuccessfully when any applicable tool reports a failure", async () => {
      const skillDir = await createSkillDir(testDir, "alpha");
      const tool = createMockTool("bad-tool", false);
      const result = await checkSkill({
        repoRoot,
        mode: { type: "skill", skillDir },
        tools: [tool],
      });
      expect(result.success).toBe(false);
      expect(result.skillResults[0].toolResults[0].success).toBe(false);
    });

    it("exits successfully when every applicable tool passes", async () => {
      const skillDir = await createSkillDir(testDir, "alpha");
      const tool = createMockTool("good-tool", true);
      const result = await checkSkill({
        repoRoot,
        mode: { type: "skill", skillDir },
        tools: [tool],
      });
      expect(result.success).toBe(true);
    });
  });

  describe("invocation via changed file paths", () => {
    it("accepts a list of file paths instead of a single skill directory or --all", async () => {
      const skillDir = await createSkillDir(testDir, "alpha");
      const tool = createMockTool("validate-skill", true);
      const filePath = join(skillDir, "SKILL.md");
      const result = await checkSkill({
        repoRoot,
        mode: { type: "files", files: [filePath] },
        tools: [tool],
      });
      expect(result.success).toBe(true);
      expect(tool.calls).toHaveLength(1);
    });

    it("treats each given file path as relative to the repository root", async () => {
      const skillDir = await createSkillDir(testDir, "alpha");
      const tool = createMockTool("validate-skill", true);
      const result = await checkSkill({
        repoRoot,
        mode: { type: "files", files: ["skills/alpha/SKILL.md"] },
        tools: [tool],
      });
      expect(result.success).toBe(true);
      expect(tool.calls[0].skillDir).toBe(skillDir);
    });

    it("resolves each file path to its containing skill directory", async () => {
      const skillDir = await createSkillDir(testDir, "alpha");
      const tool = createMockTool("validate-skill", true);
      await checkSkill({
        repoRoot,
        mode: {
          type: "files",
          files: ["skills/alpha/SKILL.md", "skills/alpha/references/okf.md"],
        },
        tools: [tool],
      });
      expect(new Set(tool.calls.map((c) => c.skillDir)).size).toBe(1);
      expect(tool.calls[0].skillDir).toBe(skillDir);
    });

    it("ignores a given file path that does not fall under any skill directory", async () => {
      await createSkillDir(testDir, "alpha");
      const tool = createMockTool("validate-skill", true);
      const result = await checkSkill({
        repoRoot,
        mode: { type: "files", files: ["README.md"] },
        tools: [tool],
      });
      expect(result.success).toBe(true);
      expect(tool.calls).toHaveLength(0);
      expect(result.skillResults).toHaveLength(0);
    });

    it("groups multiple file paths under the same skill into a single check run", async () => {
      const skillDir = await createSkillDir(testDir, "alpha");
      const tool = createMockTool("validate-skill", true);
      await checkSkill({
        repoRoot,
        mode: {
          type: "files",
          files: ["skills/alpha/SKILL.md", "skills/alpha/CITATION.cff"],
        },
        tools: [tool],
      });
      expect(tool.calls).toHaveLength(1);
    });

    it("runs checks for every distinct skill touched by the given file paths", async () => {
      const alpha = await createSkillDir(testDir, "alpha");
      const beta = await createSkillDir(testDir, "beta");
      const tool = createMockTool("validate-skill", true);
      const result = await checkSkill({
        repoRoot,
        mode: {
          type: "files",
          files: ["skills/alpha/SKILL.md", "skills/beta/SKILL.md"],
        },
        tools: [tool],
      });
      expect(result.success).toBe(true);
      const dirs = tool.calls.map((c) => c.skillDir).sort();
      expect(dirs).toEqual([alpha, beta].sort());
    });

    it("exits successfully with no work performed when given an empty list of file paths", async () => {
      const result = await checkSkill({
        repoRoot,
        mode: { type: "files", files: [] },
        tools: [],
      });
      expect(result.success).toBe(true);
      expect(result.skillResults).toHaveLength(0);
    });
  });
});

describe("check-skill CLI", () => {
  let testDir: string;
  let repoRoot: string;
  const scriptPath = resolve(__dirname, "../../src/scripts/check-skill.ts");

  beforeEach(async () => {
    testDir = await mkdtemp(join(tmpdir(), "check-skill-cli-test-"));
    repoRoot = await initRepo(testDir);
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  async function createSkillForCli(name: string): Promise<string> {
    return createSkillDir(testDir, name);
  }

  it("exits with code 2 and usage error on stderr when given invalid arguments", async () => {
    const result = await Bun.$`bun ${scriptPath}`
      .cwd(repoRoot)
      .quiet()
      .nothrow();
    expect(result.exitCode).toBe(2);
    expect(result.stderr.toString()).toContain("Usage");
  });

  it("exits with code 2 when a single argument is not a skill directory", async () => {
    const badDir = join(testDir, "skills", "not-a-skill");
    await mkdir(badDir, { recursive: true });
    const result = await Bun.$`bun ${scriptPath} ${badDir}`
      .cwd(repoRoot)
      .quiet()
      .nothrow();
    expect(result.exitCode).toBe(2);
    expect(result.stderr.toString()).toContain("SKILL.md");
  });

  it("exits with code 0 when checking a single valid skill", async () => {
    const skillDir = await createSkillForCli("alpha");
    const result = await Bun.$`bun ${scriptPath} ${skillDir}`
      .cwd(repoRoot)
      .quiet()
      .nothrow();
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString()).toContain("alpha");
  });

  it("exits with code 1 when a skill fails a check", async () => {
    const skillDir = await createSkillForCli("alpha");
    // Write an invalid SKILL.md to force validate-skill to fail
    await writeFile(
      join(skillDir, "SKILL.md"),
      "---\nname: wrong-name\ndescription: description\n---\n# Alpha\n",
    );
    const result = await Bun.$`bun ${scriptPath} ${skillDir}`
      .cwd(repoRoot)
      .quiet()
      .nothrow();
    expect(result.exitCode).toBe(1);
    expect(result.stderr.toString()).toContain("validate-skill");
    expect(result.stderr.toString()).toContain("alpha");
  });
});
