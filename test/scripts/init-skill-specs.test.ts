import { afterEach, beforeEach, expect, it } from "bun:test";
import {
  lstat,
  mkdir,
  readdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { join, resolve } from "node:path";
import { generateSkillMd } from "../../src/scripts/lib/io.js";
import { createTestTempDir } from "./shared/temp-dir.js";

let root: string;
const script = resolve(import.meta.dir, "../../src/scripts/init-skill.ts");
beforeEach(async () => {
  root = await createTestTempDir("tmp_rovo_init_specs_");
  await mkdir(join(root, ".git"));
  await mkdir(join(root, "specs"));
});
afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});
const run = (args = ["--specs"], cwd = root, preload?: string) =>
  Bun.spawnSync(
    [
      process.execPath,
      ...(preload ? ["--preload", preload] : []),
      script,
      ...args,
    ],
    { cwd },
  );
async function spec(file: string, content: string) {
  await writeFile(join(root, "specs", file), content);
}

it("discovers heading styles in path order from a nested working directory", async () => {
  const fixtures = {
    "d.md": "# Skill specification: `fourth`\n\nDo not copy this body.",
    "b.md": "# Skill specification `second`\n",
    "c.md": "# Skill specification: third\n",
    "a.md": "# Skill specification first\n",
  };
  for (const [file, content] of Object.entries(fixtures))
    await spec(file, content);
  const nested = join(root, "nested", "directory");
  await mkdir(nested, { recursive: true });
  const result = run(["--specs"], nested);
  expect(result.exitCode).toBe(0);
  expect(result.stdout.toString().trim().split("\n")).toEqual([
    "Created skill: first (specs/a.md)",
    "Created skill: second (specs/b.md)",
    "Created skill: third (specs/c.md)",
    "Created skill: fourth (specs/d.md)",
  ]);
  for (const name of ["first", "second", "third", "fourth"]) {
    expect((await readdir(join(root, "skills", name))).sort()).toEqual([
      "SKILL.md",
      "assets",
      "evals",
      "references",
      "scripts",
    ]);
    expect(await readFile(join(root, "skills", name, "SKILL.md"), "utf8")).toBe(
      generateSkillMd(name),
    );
  }
  for (const [file, content] of Object.entries(fixtures)) {
    expect(await readFile(join(root, "specs", file), "utf8")).toBe(content);
  }
});

it("ignores non-specs, fenced examples, nested specs and non-Markdown files", async () => {
  await spec("README.md", "# Overview\n\n# Skill specification not-a-spec\n");
  await spec("example.md", "```md\n# Skill specification example\n```\n");
  await spec(
    "prose.md",
    "## Skill specification lower-level\nSkill specification prose\n",
  );
  await spec("ignored.txt", "# Skill specification ignored\n");
  await mkdir(join(root, "specs", "nested"));
  await spec("nested/child.md", "# Skill specification child\n");
  await mkdir(join(root, "dependency", "specs"), { recursive: true });
  await writeFile(
    join(root, "dependency", "specs", "other.md"),
    "# Skill specification other\n",
  );
  const result = run();
  expect(result.exitCode).toBe(0);
  expect(result.stdout.toString()).toContain(
    "No matching skill specifications",
  );
  expect(await lstat(join(root, "skills")).catch(() => null)).toBeNull();
});

it("reports invalid names and continues without interpreting specification content", async () => {
  await spec("a.md", "# Skill specification ../escape\n");
  await spec("b.md", "# Skill specification `Bad_Name`\n");
  await spec("c.md", "# Skill specification safe\n$(touch escaped)\n");
  const result = run();
  expect(result.exitCode).toBe(1);
  const lines = result.stdout.toString().trim().split("\n");
  expect(lines).toHaveLength(3);
  expect(lines[0]).toContain("Error: specs/a.md");
  expect(lines[1]).toContain("Error: specs/b.md");
  expect(lines[2]).toBe("Created skill: safe (specs/c.md)");
  expect(result.stderr.toString()).toBe("");
  expect(await readdir(join(root, "skills"))).toEqual(["safe"]);
  expect(await lstat(join(root, "escaped")).catch(() => null)).toBeNull();
});

it("skips complete and partial directories, files, and dangling symlinks unchanged", async () => {
  const skills = join(root, "skills");
  await mkdir(join(skills, "complete"), { recursive: true });
  await writeFile(join(skills, "complete", "SKILL.md"), "original");
  await mkdir(join(skills, "partial"));
  await writeFile(join(skills, "partial", "marker"), "preserved");
  await writeFile(join(skills, "file"), "file content");
  await symlink("missing", join(skills, "link"));
  for (const name of ["complete", "partial", "file", "link"])
    await spec(`${name}.md`, `# Skill specification ${name}\n`);
  const result = run();
  expect(result.exitCode).toBe(0);
  expect(
    result.stdout.toString().match(/Skipped existing skill:/g),
  ).toHaveLength(4);
  expect(await readFile(join(skills, "complete", "SKILL.md"), "utf8")).toBe(
    "original",
  );
  expect(await readFile(join(skills, "partial", "marker"), "utf8")).toBe(
    "preserved",
  );
  expect(await readFile(join(skills, "file"), "utf8")).toBe("file content");
  expect((await lstat(join(skills, "link"))).isSymbolicLink()).toBe(true);
});

it("handles duplicate specs and missing specs as successful no-ops", async () => {
  await spec("a.md", "# Skill specification repeated\n");
  await spec("b.md", "# Skill specification repeated\n");
  const result = run();
  expect(result.exitCode).toBe(0);
  expect(result.stdout.toString()).toContain(
    "Created skill: repeated (specs/a.md)",
  );
  expect(result.stdout.toString()).toContain(
    "Skipped existing skill: repeated (specs/b.md",
  );
  await rm(join(root, "specs"), { recursive: true });
  expect(run().exitCode).toBe(0);
  expect(run().stdout.toString()).toContain("No matching");
});

it("preserves positional scaffolding and rejects unsupported arguments before mutation", async () => {
  await spec("ready.md", "# Skill specification ready\n");
  for (const args of [
    [],
    ["--unknown"],
    ["--specs", "name"],
    ["name", "--specs"],
    ["--specs", "--specs"],
    ["name", "extra"],
    ["--specs", "--force"],
  ]) {
    expect(run(args).exitCode).toBe(2);
    expect(await lstat(join(root, "skills")).catch(() => null)).toBeNull();
  }
  await mkdir(join(root, "skills"));
  expect(run(["single"]).exitCode).toBe(0);
  expect(
    await readFile(join(root, "skills", "single", "SKILL.md"), "utf8"),
  ).toBe(generateSkillMd("single"));
  expect(run(["single"]).exitCode).toBe(1);
  expect(
    await readFile(join(root, "skills", "single", "SKILL.md"), "utf8"),
  ).toBe(generateSkillMd("single"));
});

it("continues after injected read and write failures and rolls back only the failed skill", async () => {
  for (const name of ["a", "b", "c"])
    await spec(`${name}.md`, `# Skill specification ${name}\n`);
  const preload = join(root, "tmp_rovo_faults.ts");
  await writeFile(
    preload,
    `
    import { mock } from "bun:test";
    import * as fs from "node:fs/promises";
    const original = { ...fs };
    mock.module("node:fs/promises", () => ({ ...original,
      readFile: async (path, ...args) => {
        if (String(path).endsWith("/specs/a.md")) throw new Error("injected read failure");
        return original.readFile(path, ...args);
      },
      writeFile: async (path, ...args) => {
        if (String(path).endsWith("/skills/b/SKILL.md")) {
          await original.writeFile(path, "partial");
          throw new Error("injected write failure");
        }
        return original.writeFile(path, ...args);
      }
    }));
  `,
  );
  const result = run(["--specs"], root, preload);
  expect(result.exitCode).toBe(1);
  const lines = result.stdout.toString().trim().split("\n");
  expect(lines).toHaveLength(3);
  expect(lines[0]).toContain("injected read failure");
  expect(lines[1]).toContain("injected write failure");
  expect(lines[2]).toContain("Created skill: c");
  expect(await readdir(join(root, "skills"))).toEqual(["c"]);
});

it("preserves a concurrent initializer's path when exclusive creation collides", async () => {
  await spec("race.md", "# Skill specification race\n");
  const preload = join(root, "tmp_rovo_collision.ts");
  await writeFile(
    preload,
    `
    import { mock } from "bun:test";
    import * as fs from "node:fs/promises";
    const original = { ...fs };
    mock.module("node:fs/promises", () => ({ ...original,
      mkdir: async (path, ...args) => {
        if (String(path).endsWith("/skills/race")) {
          await original.mkdir(path);
          await original.writeFile(String(path) + "/marker", "concurrent owner");
        }
        return original.mkdir(path, ...args);
      }
    }));
  `,
  );
  const result = run(["--specs"], root, preload);
  expect(result.exitCode).toBe(0);
  expect(result.stdout.toString()).toContain("Skipped existing skill: race");
  expect(await readFile(join(root, "skills", "race", "marker"), "utf8")).toBe(
    "concurrent owner",
  );
  expect(await readdir(join(root, "skills", "race"))).toEqual(["marker"]);
});
