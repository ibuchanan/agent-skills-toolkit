import { afterEach, beforeEach, expect, it } from "bun:test";
import {
  lstat,
  mkdir,
  readlink,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { linkSkills } from "../../src/scripts/lib/link-skills.js";
import { createTestTempDir } from "./shared/temp-dir.js";

let tempDir: string;
let source: string;
let target: string;
beforeEach(async () => {
  tempDir = await createTestTempDir("link-");
  source = join(tempDir, "node_modules/agent-skills-toolkit/skills");
  target = join(tempDir, ".agents/skills");
});
afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

async function skill(name: string) {
  await mkdir(join(source, name), { recursive: true });
  await writeFile(join(source, name, "SKILL.md"), `# ${name}\n`);
}

it("links immediate skills relatively and is idempotent", async () => {
  await skill("beta");
  await skill("alpha");
  await mkdir(join(source, "not-a-skill"));
  await mkdir(join(source, "invalid/SKILL.md"), { recursive: true });
  await skill("nested/child");
  expect(await linkSkills(source, target)).toEqual({
    linked: ["alpha", "beta"],
    unchanged: [],
    removed: [],
    conflicts: [],
  });
  const link = await readlink(join(target, "alpha"));
  expect(link.startsWith("/")).toBe(false);
  expect(resolve(target, link)).toBe(join(source, "alpha"));
  expect(await linkSkills(source, target)).toEqual({
    linked: [],
    unchanged: ["alpha", "beta"],
    removed: [],
    conflicts: [],
  });
});

it("preserves files, directories, and foreign or dangling symlinks", async () => {
  for (const name of ["file", "directory", "foreign"]) await skill(name);
  await mkdir(target, { recursive: true });
  await writeFile(join(target, "file"), "local content");
  await mkdir(join(target, "directory"));
  await symlink("missing-foreign", join(target, "foreign"), "dir");
  const result = await linkSkills(source, target);
  expect(result.conflicts).toEqual(["directory", "file", "foreign"]);
  expect(result.linked).toEqual([]);
  expect(await Bun.file(join(target, "file")).text()).toBe("local content");
  expect((await lstat(join(target, "directory"))).isDirectory()).toBe(true);
  expect(await readlink(join(target, "foreign"))).toBe("missing-foreign");
});

it("prunes only stale same-name toolkit links", async () => {
  await skill("obsolete");
  await linkSkills(source, target);
  await rm(join(source, "obsolete"), { recursive: true });
  await symlink(join(source, "other"), join(target, "alias"), "dir");
  await symlink(join(tempDir, "elsewhere"), join(target, "foreign"), "dir");
  await mkdir(join(target, "local"));
  expect((await linkSkills(source, target)).removed).toEqual(["obsolete"]);
  expect(await readlink(join(target, "alias"))).toBe(join(source, "other"));
  expect((await lstat(join(target, "foreign"))).isSymbolicLink()).toBe(true);
  expect((await lstat(join(target, "local"))).isDirectory()).toBe(true);
});

it("does not create destinations or prune links when the source is missing", async () => {
  expect(await linkSkills(source, target)).toEqual({
    linked: [],
    unchanged: [],
    removed: [],
    conflicts: [],
  });
  await expect(lstat(target)).rejects.toMatchObject({ code: "ENOENT" });
  await mkdir(target, { recursive: true });
  await symlink(join(source, "old"), join(target, "old"), "dir");
  await linkSkills(source, target);
  expect((await lstat(join(target, "old"))).isSymbolicLink()).toBe(true);
});

it("rejects identical directories and propagates filesystem errors", async () => {
  await skill("alpha");
  await expect(linkSkills(source, source)).rejects.toThrow("must differ");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, "not a directory");
  await expect(linkSkills(source, target)).rejects.toThrow();
});

const script = resolve(import.meta.dir, "../../src/scripts/link-skills.ts");
const run = (...args: string[]) =>
  Bun.spawnSync([process.execPath, script, ...args], { cwd: tempDir });

it("reports missing-source no-ops, conflicts, and operational errors", async () => {
  const missing = run("--toolkit");
  expect(missing.exitCode).toBe(0);
  expect(missing.stdout.toString()).toContain(
    "No agent-skills-toolkit skills found",
  );
  await skill("alpha");
  await mkdir(target, { recursive: true });
  await writeFile(join(target, "alpha"), "local");
  const conflict = run("--toolkit");
  expect(conflict.exitCode).toBe(1);
  expect(conflict.stderr.toString()).toContain(
    "Skipped existing .agents/skills/alpha",
  );
  await rm(target, { recursive: true });
  await writeFile(target, "not a directory");
  const error = run("--toolkit");
  expect(error.exitCode).toBe(1);
  expect(error.stderr.toString()).toContain(
    "Unable to link agent-skills-toolkit skills",
  );
});

it("rejects invalid arguments without changing destinations", async () => {
  await mkdir(target, { recursive: true });
  await writeFile(join(target, "keep"), "untouched");
  const invalidArgs = [
    [],
    ["unexpected"],
    ["--help"],
    ["--local", "--toolkit"],
    ["--local", "--local"],
    ["--toolkit", "--toolkit"],
    ["--package"],
    ["--package="],
    ["package=example"],
    ["--package", "example", "--local"],
    ["--package=example", "--package=other"],
    ...[
      "../outside",
      "/absolute",
      "./relative",
      "@scope/../name",
      "@scope/name/child",
      "name@1.0.0",
      "https://example.com/pkg",
      "file:../pkg",
      "name\\path",
      "..",
      ".hidden",
      "@scope",
      "@scope/",
      "--local",
      "has space",
      "Uppercase",
      "a".repeat(215),
    ].map((name) => ["--package", name]),
  ];
  for (const args of invalidArgs) {
    const result = run(...args);
    expect(result.exitCode, JSON.stringify(args)).toBe(2);
    expect(result.stderr.toString()).toContain("Usage:");
  }
  expect(await Bun.file(join(target, "keep")).text()).toBe("untouched");
});

it("selects local, toolkit, unscoped, and scoped packages", async () => {
  for (const [args, path, name] of [
    [["--local"], "skills", "local-example"],
    [
      ["--toolkit"],
      "node_modules/agent-skills-toolkit/skills",
      "toolkit-example",
    ],
    [
      ["--package", "example"],
      "node_modules/example/skills",
      "package-example",
    ],
    [
      ["--package=@example/tools"],
      "node_modules/@example/tools/skills",
      "scoped-example",
    ],
  ] as const) {
    source = join(tempDir, path);
    await skill(name);
    const result = run(...args);
    expect(result.exitCode, result.stderr.toString()).toBe(0);
    expect(await readlink(join(target, name))).toBe(`../../${path}/${name}`);
    expect(run(...args).stdout.toString()).toContain("Already linked");
  }
  expect(run("--package", "agent-skills-toolkit").stdout.toString()).toContain(
    "Already linked agent-skills-toolkit skill: toolkit-example",
  );
  await rm(
    join(tempDir, "node_modules/agent-skills-toolkit/skills/toolkit-example"),
    { recursive: true },
  );
  expect(run("--package=agent-skills-toolkit").stdout.toString()).toContain(
    "Removed stale agent-skills-toolkit link: toolkit-example",
  );
});

it("keeps symlinked package paths in generated links", async () => {
  source = join(tempDir, "workspace/skills");
  await skill("alpha");
  await mkdir(join(tempDir, "node_modules"));
  await symlink("../workspace", join(tempDir, "node_modules/example"), "dir");
  expect(run("--package", "example").exitCode).toBe(0);
  expect(await readlink(join(target, "alpha"))).toBe(
    "../../node_modules/example/skills/alpha",
  );
});

it("rejects physically identical source and destination directories", async () => {
  source = join(tempDir, "skills");
  await skill("alpha");
  await mkdir(dirname(target), { recursive: true });
  await symlink("../skills", target, "dir");
  await expect(linkSkills(source, target)).rejects.toThrow("must differ");
  expect(run("--local").exitCode).toBe(1);
});

it("isolates stale cleanup and preserves collisions in either source order", async () => {
  const sources = [
    join(tempDir, "skills"),
    source,
    join(tempDir, "node_modules/other/skills"),
  ];
  for (const dir of sources) {
    source = dir;
    await skill("shared");
    await skill(`unique-${sources.indexOf(dir)}`);
  }
  for (const order of [sources, [...sources].reverse()]) {
    await rm(target, { recursive: true, force: true });
    for (const [index, dir] of order.entries()) {
      const result = await linkSkills(dir, target);
      expect(result.conflicts).toEqual(index === 0 ? [] : ["shared"]);
      expect(resolve(target, await readlink(join(target, "shared")))).toBe(
        join(order[0] as string, "shared"),
      );
    }
  }
  for (const [index, dir] of sources.entries()) {
    await rm(join(dir, `unique-${index}`), { recursive: true });
  }
  for (const [index, dir] of sources.entries()) {
    expect((await linkSkills(dir, target)).removed).toEqual([
      `unique-${index}`,
    ]);
    for (let other = index + 1; other < sources.length; other++)
      expect(
        (await lstat(join(target, `unique-${other}`))).isSymbolicLink(),
      ).toBe(true);
  }
});
